const express = require('express');
const { upload, uploadFile, getFiles, getFile, downloadFile, updateFile, deleteFile } = require('../controllers/fileController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// 获取所有文件和上传文件
router.route('/')
  .get(getFiles)
  .post(protect, authorize('admin'), upload, uploadFile);

// 获取、更新和删除单个文件
router.route('/:id')
  .get(getFile)
  .put(protect, authorize('admin'), updateFile)
  .delete(protect, authorize('admin'), deleteFile);

// 下载文件
router.get('/:id/download', downloadFile);

module.exports = router;