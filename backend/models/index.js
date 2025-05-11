// 导入所有模型
const User = require('./User');
const Category = require('./Category');
const File = require('./File');
const { sequelize } = require('../config/db');

// 定义模型之间的关系

// 用户与分类的关系：一个用户可以创建多个分类
User.hasMany(Category, { 
  foreignKey: 'createdById',
  as: 'categories'
});
Category.belongsTo(User, { 
  foreignKey: 'createdById',
  as: 'createdBy'
});

// 分类与子分类的关系：一个分类可以有多个子分类
Category.hasMany(Category, { 
  foreignKey: 'parentId',
  as: 'children'
});
Category.belongsTo(Category, { 
  foreignKey: 'parentId',
  as: 'parent'
});

// 用户与文件的关系：一个用户可以上传多个文件
User.hasMany(File, { 
  foreignKey: 'uploadedById',
  as: 'files'
});
File.belongsTo(User, { 
  foreignKey: 'uploadedById',
  as: 'uploadedBy'
});

// 分类与文件的关系：一个分类可以包含多个文件
Category.hasMany(File, { 
  foreignKey: 'categoryId',
  as: 'files'
});
File.belongsTo(Category, { 
  foreignKey: 'categoryId',
  as: 'category'
});

// 导出所有模型
module.exports = {
  sequelize,
  User,
  Category,
  File
};