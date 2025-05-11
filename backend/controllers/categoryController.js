const Category = require('../models/Category');

// @desc    创建分类
// @route   POST /api/categories
// @access  私有 (仅管理员)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    // 创建分类
    const category = await Category.create({
      name,
      description,
      parent: parent || null,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取所有分类
// @route   GET /api/categories
// @access  公开
exports.getCategories = async (req, res) => {
  try {
    // 查询参数
    const query = {};
    
    // 如果指定了父分类，则只获取该父分类下的子分类
    if (req.query.parent) {
      query.parent = req.query.parent;
    } else if (req.query.root === 'true') {
      // 如果请求根分类，则只获取没有父分类的分类
      query.parent = null;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .populate('createdBy', 'username')
      .sort('name');

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个分类
// @route   GET /api/categories/:id
// @access  公开
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name')
      .populate('createdBy', 'username');

    if (!category) {
      return res.status(404).json({ message: '分类未找到' });
    }

    // 获取分类路径
    const path = await category.getPath();

    // 获取子分类
    const children = await Category.find({ parent: category._id }).select('name');

    res.json({
      success: true,
      data: {
        ...category._doc,
        path,
        children
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新分类
// @route   PUT /api/categories/:id
// @access  私有 (仅管理员)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    // 检查是否存在循环引用
    if (parent && parent === req.params.id) {
      return res.status(400).json({ message: '分类不能作为自己的父分类' });
    }

    // 检查是否将分类设置为其子分类的父分类
    if (parent) {
      const childCategories = await Category.find({ parent: req.params.id });
      const childIds = childCategories.map(cat => cat._id.toString());
      
      if (childIds.includes(parent)) {
        return res.status(400).json({ message: '不能将分类设置为其子分类的父分类' });
      }
    }

    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: '分类未找到' });
    }

    // 更新分类
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, parent: parent || null },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    删除分类
// @route   DELETE /api/categories/:id
// @access  私有 (仅管理员)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: '分类未找到' });
    }

    // 检查是否有子分类
    const hasChildren = await Category.findOne({ parent: req.params.id });
    if (hasChildren) {
      return res.status(400).json({ message: '无法删除有子分类的分类，请先删除或移动子分类' });
    }

    // 检查是否有关联的文件
    const File = require('../models/File');
    const hasFiles = await File.findOne({ category: req.params.id });
    if (hasFiles) {
      return res.status(400).json({ message: '无法删除有关联文件的分类，请先删除或移动文件' });
    }

    // 删除分类
    await category.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};