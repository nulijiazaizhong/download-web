const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const File = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: '请提供文件名' },
      len: { args: [1, 200], msg: '文件名不能超过200个字符' }
    }
  },
  originalname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: '请提供原始文件名' }
    }
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      notEmpty: { msg: '请提供文件描述' },
      len: { args: [1, 1000], msg: '描述不能超过1000个字符' }
    }
  },
  filesize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: '请提供文件大小' }
    }
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: '请提供文件路径' }
    }
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    },
    validate: {
      notEmpty: { msg: '请选择文件分类' }
    }
  },
  uploadedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = File;