const File = require('../models/File');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// 配置文件存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    // 确保目录存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 可以在这里添加文件类型限制
  cb(null, true);
};

// 初始化上传中间件
exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 限制文件大小为100MB
}).single('file');

// @desc    上传文件
// @route   POST /api/files
// @access  私有 (仅管理员)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请上传文件' });
    }

    const { description, category, isPublic } = req.body;

    // 创建文件记录
    const file = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      description,
      filesize: req.file.size,
      filePath: req.file.path,
      category,
      uploadedBy: req.user.id,
      isPublic: isPublic === 'true'
    });

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取所有文件
// @route   GET /api/files
// @access  公开
exports.getFiles = async (req, res) => {
  try {
    const query = {};
    
    // 如果不是管理员，只显示公开文件
    if (!req.user || req.user.role !== 'admin') {
      query.isPublic = true;
    }
    
    // 分类过滤
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // 搜索功能
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // 分页
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const files = await File.find(query)
      .populate('category', 'name')
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    const total = await File.countDocuments(query);
    
    res.json({
      success: true,
      count: files.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: files
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个文件
// @route   GET /api/files/:id
// @access  公开/私有
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('category', 'name')
      .populate('uploadedBy', 'username');
    
    if (!file) {
      return res.status(404).json({ message: '文件未找到' });
    }
    
    // 检查权限
    if (!file.isPublic && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: '无权访问此文件' });
    }
    
    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    下载文件
// @route   GET /api/files/:id/download
// @access  公开/私有
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: '文件未找到' });
    }
    
    // 检查权限
    if (!file.isPublic && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: '无权下载此文件' });
    }
    
    // 更新下载计数
    file.downloadCount += 1;
    await file.save();
    
    // 发送文件
    const filePath = path.join(__dirname, '../../', file.filePath);
    res.download(filePath, file.originalname);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新文件信息
// @route   PUT /api/files/:id
// @access  私有 (仅管理员)
exports.updateFile = async (req, res) => {
  try {
    let file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: '文件未找到' });
    }
    
    // 更新文件信息
    file = await File.findByIdAndUpdate(
      req.params.id,
      { 
        description: req.body.description,
        category: req.body.category,
        isPublic: req.body.isPublic === 'true'
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    删除文件
// @route   DELETE /api/files/:id
// @access  私有 (仅管理员)
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: '文件未找到' });
    }
    
    // 删除物理文件
    const filePath = path.join(__dirname, '../../', file.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // 删除数据库记录
    await file.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};