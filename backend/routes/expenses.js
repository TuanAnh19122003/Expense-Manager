const express = require('express');
const Expense = require('../models/Expense'); // Giả sử bạn có một model Expense
const router = express.Router();

// Lấy toàn bộ danh sách chi tiêu và thông tin tên category
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('category', 'name')  // Populate tên của category
      .sort({ date: -1 });  // Sắp xếp theo ngày giảm dần
    res.status(200).json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Thêm chi tiêu với thông tin category là ObjectId
router.post('/', async (req, res) => {
  const { amount, description, category, date } = req.body;

  try {
    const newExpense = new Expense({
      amount,
      description,
      category,  // category là ObjectId của Category
      date,
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


// Lấy chi tiết chi tiêu theo ID và thông tin tên category
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id)
      .populate('category', 'name');  // Populate tên của category
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cập nhật chi tiêu theo ID và thông tin category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { amount, description, category, date },
      { new: true }  // Trả về đối tượng đã được cập nhật
    )
    .populate('category', 'name');  // Populate tên của category

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
