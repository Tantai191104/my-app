const mongoose = require("mongoose");
const Member = require("../models/members");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const { membername, password, name, YOB, isAdmin } = req.body;

    // Kiểm tra tên người dùng đã tồn tại chưa
    const existingUser = await Member.findOne({ membername });
    if (existingUser) {
      return res.status(400).json({ message: "Member already exists" });
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

    res.status(201).json({
      message: "Member created successfully",
      membername: newMember.membername,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Tìm thành viên theo tên đăng nhập
    const member = await Member.findOne({ name });
    if (!member) {
      req.session.message = "Account does not exist.";
      return res.redirect("/api/auth/login");
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      req.session.message = "Incorrect password.";
      return res.redirect("/api/auth/login");
    }

    // Đăng nhập thành công → lưu đầy đủ thông tin vào session
    req.session.user = {
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
  const message = req.session.message || null;
  delete req.session.message;
  res.render("login", { message, layout: false });
};
