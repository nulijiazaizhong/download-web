# MongoDB 迁移到 MySQL 指南

本文档提供了将下载站项目从 MongoDB 迁移到 MySQL 数据库的详细步骤。

## 迁移概述

我们已经将项目的数据库从 MongoDB（一个文档型数据库）迁移到了 MySQL（一个关系型数据库）。主要变更包括：

1. 使用 Sequelize ORM 替代 Mongoose
2. 重构数据模型以适应关系型数据库结构
3. 更新环境变量配置
4. 添加模型关联

## 安装步骤

### 1. 安装 MySQL

如果您尚未安装 MySQL，请先安装：

- Windows: 下载并安装 [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- macOS: 使用 Homebrew 安装 `brew install mysql`
- Linux: 使用包管理器安装，例如 `sudo apt install mysql-server`

安装后，确保 MySQL 服务已启动。

### 2. 创建数据库

登录到 MySQL 并创建新数据库：

```sql
CREATE DATABASE download_web;
```

### 3. 更新项目依赖

在项目根目录运行以下命令安装新依赖：

```bash
npm install
```

这将安装 `mysql2` 和 `sequelize` 包。

### 4. 配置环境变量

更新 `.env` 文件中的数据库连接信息：

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=download_web
MYSQL_USER=你的MySQL用户名
MYSQL_PASSWORD=你的MySQL密码
```

## 数据迁移

### 自动迁移

项目配置了自动迁移功能。当您首次启动应用时，Sequelize 将自动创建所有必要的表结构。

如果您需要从旧的 MongoDB 数据库迁移数据，需要编写自定义脚本将数据从 MongoDB 导出并导入到 MySQL。

## 启动应用

配置完成后，启动应用：

```bash
npm run dev
```

## 模型关系说明

在迁移到关系型数据库后，我们使用外键定义了以下关系：

- 用户与分类：一对多（一个用户可以创建多个分类）
- 分类与子分类：自引用一对多（一个分类可以有多个子分类）
- 用户与文件：一对多（一个用户可以上传多个文件）
- 分类与文件：一对多（一个分类可以包含多个文件）

## 故障排除

如果遇到连接问题：

1. 确认 MySQL 服务正在运行
2. 验证 `.env` 文件中的连接信息是否正确
3. 确保数据库用户有足够的权限
4. 检查控制台错误信息以获取更具体的问题描述

## 注意事项

- 此迁移更改了数据库结构，但保留了原有的 API 接口
- 前端代码不需要修改，因为 API 响应格式保持不变
- 在生产环境部署前，请确保彻底测试所有功能