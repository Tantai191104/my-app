const mongoose = require("mongoose");
const Player = require("../models/playerschema");
const Team = require("../models/teams");
exports.getAllPlayer = async (req, res) => {
  const { search, team } = req.query;
  const query = {};

  if (search && search.trim()) {
    query.playerName = { $regex: search, $options: "i" };
  }

  if (team && mongoose.Types.ObjectId.isValid(team)) {
    query.team = mongoose.Types.ObjectId.createFromHexString(team);
  }

  try {
    console.log("Search Query:", query);
    const players = await Player.find(query).populate("team");
    const teams = await Team.find();
    res.render("index", { players, teams, query });
  } catch (error) {
    console.error("getAllPlayer error:", error);
    res.status(500).send("Lỗi server: " + error.message);
  }
};
exports.getPlayerById = async (req, res) => {
  const playerId = req.params.id;
  const userId = req.session.user?._id;

  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    const player = await Player.findById(playerId)
      .populate("team")
      .populate("comments.author"); // populate author để lấy username

    if (!player) return res.send("No player");

    if (userId) {
      // Sort để comment của user đứng đầu
      player.comments.sort((a, b) => {
        const isAUser = a.author?._id?.toString() === userId.toString();
        const isBUser = b.author?._id?.toString() === userId.toString();

        if (isAUser && !isBUser) return -1;
        if (!isAUser && isBUser) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt); // còn lại sort theo ngày mới nhất
      });
    }

    res.render("playerDetail", { player });
  } catch (error) {
    console.error("getPlayerById error:", error);
    res.status(500).json({ error: "Lỗi server khi lấy thông tin cầu thủ" });
  }
};

exports.addFeedback = async (req, res) => {
  const playerId = req.params.id;
  const { content, rating } = req.body;
  const memberId = req.session.user._id;

  try {
    const player = await Player.findById(playerId);

    if (!player) {
      req.session.message = {
        type: "danger",
        text: "Player not found.",
      };
      return res.redirect("/");
    }

    const alreadyCommented = player.comments.some(
      (c) => c.author?.toString() === memberId.toString()
    );

    if (alreadyCommented) {
      req.session.message = {
        type: "warning",
        text: "You have already left feedback for this player.",
      };
      return res.redirect(`/${playerId}`);
    }

    player.comments.push({
      content,
      rating,
      author: memberId,
    });

    await player.save();

    req.session.message = {
      type: "success",
      text: "Thanks for your feedback!",
    };
    res.redirect(`/${playerId}`);
  } catch (err) {
    console.error("addFeedback error:", err);
    req.session.message = {
      type: "danger",
      text: "There was an error submitting your feedback.",
    };
    res.redirect(`/${playerId}`);
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const { playerName, image, cost, information, isCaptain, team } = req.body;

    await Player.findByIdAndUpdate(req.params.playerId, {
      playerName,
      image,
      cost,
      information,
      isCaptain: isCaptain === "true",
      team,
    });

    req.session.message = {
      type: "success",
      text: "Player updated successfully.",
    };

    res.redirect("/players");
  } catch (error) {
    console.error("Update Player Error:", error);
    req.session.message = {
      type: "danger",
      text: "Failed to update player.",
    };
    res.redirect("/players");
  }
};
exports.deletePlayer = async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.playerId);

    req.session.message = {
      type: "success",
      text: "Player deleted successfully.",
    };

    res.redirect("/players");
  } catch (error) {
    console.error("Delete Player Error:", error);
    req.session.message = {
      type: "danger",
      text: "Failed to delete player.",
    };
    res.redirect("/players");
  }
};