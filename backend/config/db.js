const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// 创建Sequelize实例
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: process.env.MYSQL_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// 测试数据库连接
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL数据库连接成功');
    
    // 在开发环境下同步模型到数据库
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('数据库模型同步完成');
    }
  } catch (error) {
    console.error('MySQL数据库连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };