const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// 用户注册和登录路由
router.post('/register', register);
router.post('/login', login);

// 获取当前用户信息
router.get('/me', protect, getMe);

module.exports = router;