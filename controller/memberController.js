const mongoose = require("mongoose");
const Member = require("../models/members");
const bcrypt = require("bcrypt");
// Show profile ejs
exports.showProfile = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/api/auth/login");
  }
  res.render("profile");
};


// edit - profile
exports.updateProfile = async (req, res) => {
  const { name, YOB } = req.body;
  const userId = req.session.user._id;
  try {
    await Member.findByIdAndUpdate(userId, { name, YOB });
    // cập nhật lại session nếu cần
    req.session.user.name = name;
    req.session.user.YOB = YOB;

    req.session.message = {
      type: "success",
      text: "Profile updated successfully!",
    };
    return res.redirect("/api/member/profile");
  } catch (error) {
    console.error(err);
    req.session.message = { type: "danger", text: "Server error!" };
    res.redirect("/profile");
  }
};

// change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const member = await Member.findById(req.session.user._id);

  const match = await bcrypt.compare(currentPassword, member.password);
  if (!match) {
    req.session.message = { type: "danger", text: "Old password incorrect." };
    return res.redirect("/api/member/profile#password");
  }

  if (newPassword !== confirmNewPassword) {
    req.session.message = { type: "danger", text: "Passwords do not match." };
    return res.redirect("/api/member/profile#password");
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  member.password = hashed;
  await member.save();

  req.session.message = {
    type: "success",
    text: "Password changed successfully.",
  };
  res.redirect("/api/member/profile#password");
};
