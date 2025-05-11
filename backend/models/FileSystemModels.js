const { FileStorage } = require('../config/fileStorage');
const bcrypt = require('bcryptjs');

// 用户模型
class UserModel {
  constructor() {
    this.storage = new FileStorage('users');
  }

  // 创建用户
  async create(userData) {
    // 加密密码
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    
    return this.storage.create(userData);
  }

  // 查找所有用户
  async findAll() {
    return this.storage.findAll();
  }

  // 根据ID查找用户
  async findByPk(id) {
    return this.storage.findByPk(id);
  }

  // 根据条件查找用户
  async findOne(where) {
    return this.storage.findOne(where);
  }

  // 更新用户
  async update(data, where) {
    // 如果更新包含密码，需要加密
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    
    return this.storage.update(data, where);
  }

  // 删除用户
  async destroy(where) {
    return this.storage.destroy(where);
  }

  // 验证密码
  async comparePassword(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
  }
}

// 分类模型
class CategoryModel {
  constructor() {
    this.storage = new FileStorage('categories');
  }

  // 创建分类
  async create(categoryData) {
    return this.storage.create(categoryData);
  }

  // 查找所有分类
  async findAll() {
    return this.storage.findAll();
  }

  // 根据ID查找分类
  async findByPk(id) {
    return this.storage.findByPk(id);
  }

  // 根据条件查找分类
  async findOne(where) {
    return this.storage.findOne(where);
  }

  // 更新分类
  async update(data, where) {
    return this.storage.update(data, where);
  }

  // 删除分类
  async destroy(where) {
    return this.storage.destroy(where);
  }
}

// 文件模型
class FileModel {
  constructor() {
    this.storage = new FileStorage('files');
  }

  // 创建文件记录
  async create(fileData) {
    return this.storage.create(fileData);
  }

  // 查找所有文件
  async findAll() {
    return this.storage.findAll();
  }

  // 根据ID查找文件
  async findByPk(id) {
    return this.storage.findByPk(id);
  }

  // 根据条件查找文件
  async findOne(where) {
    return this.storage.findOne(where);
  }

  // 更新文件
  async update(data, where) {
    return this.storage.update(data, where);
  }

  // 删除文件
  async destroy(where) {
    return this.storage.destroy(where);
  }
}

module.exports = {
  User: new UserModel(),
  Category: new CategoryModel(),
  File: new FileModel()
};