const express = require('express');
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense'); // Giả sử bạn có một model Expense
const router = express.Router();

// Middleware để xác thực JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    req.userId = decoded.userId;  // Lưu userId vào request để sử dụng sau
    next();
  });
};

// Lấy toàn bộ danh sách chi tiêu của người dùng đã đăng nhập
router.get('/', verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId })  // Lọc chi tiêu theo userId
      .populate('category', 'name')  // Populate tên của category
      .sort({ date: -1 });  // Sắp xếp theo ngày giảm dần
    res.status(200).json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Thêm chi tiêu (cập nhật thêm userId để phân biệt chi tiêu của người dùng)
router.post('/', verifyToken, async (req, res) => {
  const { amount, description, category, date } = req.body;

  try {
    const newExpense = new Expense({
      amount,
      description,
      category,  // category là ObjectId của Category
      date,
      user: req.userId,  // Gắn userId vào chi tiêu
    });

    // Lưu chi tiêu vào cơ sở dữ liệu
    await newExpense.save();

    res.status(201).json({
      message: 'Expense created successfully',
      expense: newExpense,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Lấy chi tiết chi tiêu theo ID
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOne({ _id: id, user: req.userId })  // Kiểm tra xem chi tiêu có thuộc về user hiện tại không
      .populate('category', 'name');
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cập nhật chi tiêu theo ID
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;

  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: req.userId },  // Chỉ cho phép người dùng cập nhật chi tiêu của chính họ
      { amount, description, category, date },
      { new: true }
    ).populate('category', 'name');

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Xóa chi tiêu theo ID
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, user: req.userId });  // Xóa chi tiêu của người dùng hiện tại
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({
      message: 'Expense deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
