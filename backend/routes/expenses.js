const express = require('express');
const Expense = require('../models/Expense'); // Giả sử bạn có một model Expense
const router = express.Router();

// Tạo chi tiêu
router.post('/', async (req, res) => {
  const { amount, description, category, date } = req.body;

  try {
    // Tạo chi tiêu mới
    const newExpense = new Expense({
      amount,
      description,
      category,
      date,
    });

    // Lưu chi tiêu vào cơ sở dữ liệu
    await newExpense.save();

    // Trả về phản hồi thành công
    res.status(201).json({
      message: 'Expense created successfully',
      expense: newExpense,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Lấy tất cả chi tiêu
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Lấy chi tiêu theo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cập nhật chi tiêu
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(id, { amount, description, category, date }, { new: true });
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

// Xóa chi tiêu
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);
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
