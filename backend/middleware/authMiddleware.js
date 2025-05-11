const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由 - 验证用户是否已登录
exports.protect = async (req, res, next) => {
  let token;

  // 从请求头或cookie中获取令牌
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 检查令牌是否存在
  if (!token) {
    return res.status(401).json({ message: '未授权，请登录' });
  }

  try {
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 获取用户信息
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: '找不到该用户' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: '未授权，令牌无效' });
  }
};

// 授权中间件 - 检查用户角色
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '未授权，请登录' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '无权访问此资源' });
    }

    next();
  };
};