const Player = require("../models/playerschema");

exports.updateComment = async (req, res) => {
  const { playerId, commentId } = req.params;
  const { rating, content } = req.body;
  console.log(req.session.user);

  try {
    const player = await Player.findById(playerId);
    if (!player) {
      req.session.message = { type: "error", text: "Player not found" };
      return res.redirect("/");
    }

    const comment = player.comments.id(commentId);
    if (!comment) {
      req.session.message = { type: "error", text: "Comment not found" };
      return res.redirect(`/players/${playerId}`);
    }

    if (comment.author.toString() !== req.session.user._id.toString()) {
      req.session.message = {
        type: "error",
        text: "Not authorized to edit this comment",
      };
      return res.redirect(`/players/${playerId}`);
    }

    comment.rating = rating;
    comment.content = content;
    await player.save();

    req.session.message = {
      type: "success",
      text: "Comment updated successfully",
    };
    res.redirect(`/players/${playerId}#comment-${commentId}`);
  } catch (err) {
    console.error("Error updating comment:", err);
    req.session.message = { type: "error", text: "Something went wrong" };
    res.redirect(`/players/${playerId}`);
  }
};

exports.deleteComment = async (req, res) => {
  const { playerId, commentId } = req.params;

  try {
    const player = await Player.findById(playerId);
    if (!player) {
      req.session.message = { type: "error", text: "Player not found" };
      return res.redirect("/");
    }

    const comment = player.comments.id(commentId);
    if (!comment) {
      req.session.message = { type: "error", text: "Comment not found" };
      return res.redirect(`/players/${playerId}`);
    }

    if (comment.author.toString() !== req.session.user._id.toString()) {
      req.session.message = {
        type: "error",
        text: "Not authorized to delete this comment",
      };
      return res.redirect(`/players/${playerId}`);
    }

    player.comments.pull(commentId);
    await player.save();

    req.session.message = {
      type: "success",
      text: "Comment deleted successfully",
    };
    res.redirect(`/players/${playerId}`);
  } catch (err) {
    console.error("Error deleting comment:", err);
    req.session.message = { type: "error", text: "Something went wrong" };
    res.redirect(`/players/${playerId}`);
  }
};
