const mongoose = require("mongoose");
const Member = require("../models/members");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
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

exports.SignIn = async (req, res) => {
  try {
    const { membername, password } = req.body;

    // 1. Kiểm tra người dùng có tồn tại không
    const member = await Member.findOne({ membername });
    if (!member) {
      return res.status(400).json({ message: 'Tài khoản không tồn tại' });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    // 3. Tạo JWT token
    const token = jwt.sign(
      {
        id: member._id,
        membername: member.membername,
        isAdmin: member.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '3d' } // token hết hạn sau 3 ngày
    );

    // 4. Trả về token và thông tin user
    res.status(200).json({
      token,
      member: {
        id: member._id,
        membername: member.membername,
        name: member.name,
        isAdmin: member.isAdmin
      }
    });
  } catch (error) {
    console.error('SignIn error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
