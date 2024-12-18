const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Tùy theo nơi bạn định nghĩa model User

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    // So sánh mật khẩu trực tiếp mà không mã hóa
    if (user.password !== password) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    // Tạo token sau khi xác thực thành công
    const token = jwt.sign(
      { userId: user._id, username: user.username }, // Lưu thêm username vào payload
      'secret_key',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Tạo mới người dùng
    const newUser = new User({
      username,
      email,
      password,
    });


    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    // Tạo token khi đăng ký thành công
    const token = jwt.sign({ userId: newUser._id }, 'secret_key', { expiresIn: '1h' });

    res.status(201).json({ message: 'Đăng ký thành công', token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
