const mongoose = require("mongoose");
const Member = require("../models/members");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const { membername, password, name, YOB, isAdmin } = req.body;

    // Kiểm tra tên người dùng đã tồn tại chưa
    const existingUser = await Member.findOne({ membername });
    if (existingUser) {
      req.session.message = { type: "danger", text: "Account already exists." };
      return res.redirect("/api/auth/register");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo member mới
    const newMember = new Member({
      membername,
      password: hashedPassword,
      name,
      YOB,
      isAdmin: isAdmin || false,
    });

    await newMember.save();
    req.session.message = {
      type: "success",
      text: "Account created successfully!",
    };
    return res.redirect("/api/auth/login");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { membername, password } = req.body;
    // Tìm thành viên theo tên đăng nhập
    const member = await Member.findOne({ membername });
    if (!member) {
      req.session.message = { type: "danger", text: "Account does not exist." };
      return res.redirect("/api/auth/login");
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      req.session.message = { type: "danger", text: "Incorrect password." };
      return res.redirect("/api/auth/login");
    }
    // Đăng nhập thành công → lưu đầy đủ thông tin vào session
    req.session.user = {
      _id: member._id,
      membername: member.membername,
      name: member.name,
      YOB: member.YOB,
      isAdmin: member.isAdmin,
    };
    // Xóa message lỗi cũ nếu có
    delete req.session.message;
    // Chuyển về trang chính
    res.redirect("/");
  } catch (error) {
    console.error("SignIn error:", error);
    req.session.message = "Server error. Please try again.";
    res.redirect("/api/auth/login");
  }
};

exports.showLoginForm = (req, res) => {
  res.render("login", { layout: false });
};

exports.showRegisterForm = (req, res) => {
  res.render("register", { layout: false });
};

exports.logOut = (req, res) => {
  delete req.session.user;
  res.redirect("/");
};
