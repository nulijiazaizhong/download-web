const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    用户注册
// @route   POST /api/auth/register
// @access  公开
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: '用户已存在' });
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password
    });

    // 返回用户信息和令牌
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  公开
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: '无效的凭据' });
    }

    // 检查密码是否匹配
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '无效的凭据' });
    }

    // 返回用户信息和令牌
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取当前用户信息
// @route   GET /api/auth/me
// @access  私有
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    创建默认管理员账户
// @route   POST /api/auth/create-admin
// @access  仅在初始化时使用
exports.createDefaultAdmin = async () => {
  try {
    // 检查是否已存在管理员
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return console.log('管理员账户已存在');
    }

    // 创建默认管理员
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('默认管理员账户已创建');
  } catch (error) {
    console.error('创建默认管理员失败:', error.message);
  }
};