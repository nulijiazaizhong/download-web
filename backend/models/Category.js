const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: '请提供分类名称' },
      len: { args: [1, 50], msg: '分类名称不能超过50个字符' }
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: '请提供分类描述' },
      len: { args: [1, 500], msg: '描述不能超过500个字符' }
    }
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// 获取完整分类路径的方法
Category.prototype.getPath = async function() {
  let path = [this.name];
  let currentCategory = this;
  
  while (currentCategory.parentId) {
    const parentCategory = await Category.findByPk(currentCategory.parentId);
    if (!parentCategory) break;
    
    path.unshift(parentCategory.name);
    currentCategory = parentCategory;
  }
  
  return path.join(' > ');
};

module.exports = Category;