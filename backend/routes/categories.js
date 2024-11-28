const express = require('express');
const Category = require('../models/Category'); // Giả sử bạn có một model Category
const router = express.Router();

// Tạo danh mục (Category)
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    // Kiểm tra xem danh mục đã tồn tại chưa
    const categoryExist = await Category.findOne({ name });
    if (categoryExist) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Tạo danh mục mới
    const newCategory = new Category({
      name,
      description,
    });

    // Lưu danh mục vào cơ sở dữ liệu
    await newCategory.save();

    // Trả về phản hồi thành công
    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Lấy tất cả danh mục
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Lấy danh mục theo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cập nhật danh mục
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Xóa danh mục
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
