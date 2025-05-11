const express = require('express');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// 获取所有分类和创建分类
router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

// 获取、更新和删除单个分类
router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;