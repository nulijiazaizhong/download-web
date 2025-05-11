# 下载站管理系统

这是一个带有后台管理功能的下载站系统，包含前台下载界面和后台管理系统。

## 功能特点

- 前台下载界面：用户可以浏览和下载文件
- 后台管理系统：管理员可以上传、删除、修改文件和分类
- 用户权限控制：区分普通用户和管理员权限
- 文件分类管理：支持多级分类
- 文件搜索功能：快速查找所需文件

## 技术栈

- 前端：HTML, CSS, JavaScript, Vue.js
- 后端：Node.js, Express
- 数据库：MongoDB

## 项目结构

```
download-web/
├── frontend/           # 前端代码
│   ├── public/         # 静态资源
│   └── src/            # 源代码
├── backend/            # 后端代码
│   ├── controllers/    # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   └── config/         # 配置文件
└── uploads/            # 上传的文件存储位置
```

## 安装和运行

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 后端

```bash
cd backend
npm install
npm run dev
```

## 使用说明

1. 访问 http://localhost:5173 进入前台下载界面
2. 访问 http://localhost:5173/admin 进入后台管理系统
3. 默认管理员账号：admin，密码：admin123