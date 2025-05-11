# Docker 部署指南 - 下载站服务

本文档提供了使用 Docker 和 Docker Compose 部署下载站服务的详细步骤。本服务使用文件系统存储数据，无需数据库。

## 部署前提

在开始部署前，请确保您的服务器满足以下要求：

- 已安装 Docker（推荐 20.10.x 或更高版本）
- 已安装 Docker Compose（推荐 2.x 或更高版本）
- 最低配置：1GB RAM, 1 CPU, 20GB 存储空间
- 已开放端口：80 (前端服务), 5000 (后端 API, 可选)

## 文件说明

本项目包含以下 Docker 相关文件：

- `Dockerfile.backend`: 后端服务的 Docker 构建文件
- `Dockerfile.frontend`: 前端服务的 Docker 构建文件
- `docker-compose.yml`: 定义和编排所有服务的配置文件
- `nginx.conf`: Nginx 配置文件，用于前端服务和 API 代理
- `backend/config/fileStorage.js`: 文件系统存储模块，用于替代数据库存储数据

## 部署步骤

### 1. 克隆代码仓库

```bash
# 克隆代码（替换为您的实际仓库地址）
git clone https://your-repository-url.git download-web
cd download-web
```

### 2. 配置环境变量（可选）

默认情况下，`docker-compose.yml` 文件中已经包含了必要的环境变量配置。如果需要自定义，可以编辑该文件：

```bash
# 编辑 docker-compose.yml 文件
vim docker-compose.yml
```

主要配置项：
- JWT 密钥
- 存储路径配置
- 其他应用特定配置

### 3. 构建和启动服务

```bash
# 构建并在后台启动所有服务
docker-compose up -d
```

首次启动时，Docker 会：
1. 下载必要的基础镜像
2. 构建应用镜像
3. 创建并启动所有容器
4. 设置网络和数据卷
5. 初始化文件存储系统

### 4. 验证部署

```bash
# 检查容器状态
docker-compose ps
```

所有服务应该处于 `Up` 状态。现在您可以通过浏览器访问：

- 前端应用：http://your-server-ip
- 后端 API（如果需要直接访问）：http://your-server-ip:5000/api

## 维护与更新

### 查看日志

```bash
# 查看所有服务的日志
docker-compose logs

# 查看特定服务的日志
docker-compose logs backend
docker-compose logs frontend
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

### 更新应用

```bash
# 拉取最新代码
git pull

# 重新构建并启动服务
docker-compose up -d --build
```

### 数据备份

```bash
# 备份数据文件
docker cp download-web-backend:/app/data ./backup-data-$(date +%Y%m%d)
# 备份上传文件
docker cp download-web-backend:/app/uploads ./backup-uploads-$(date +%Y%m%d)
```

## 故障排除

### 容器无法启动

1. 检查日志：`docker-compose logs`
2. 确认端口是否被占用：`netstat -tuln`
3. 检查磁盘空间：`df -h`

### 数据存储问题

1. 检查数据目录权限：`docker exec download-web-backend ls -la /app/data`
2. 确认数据文件存在：`docker exec download-web-backend ls -la /app/data/users`
3. 检查日志中的存储错误：`docker-compose logs backend | grep "Error"` 

### 前端无法访问后端 API

1. 检查 Nginx 配置
2. 确认后端服务正常运行
3. 检查网络连接：`docker network inspect download-web-network`

## 安全建议

1. 修改 `docker-compose.yml` 中的默认密码
2. 使用环境变量文件 `.env` 存储敏感信息（不要提交到代码仓库）
3. 定期更新 Docker 镜像
4. 配置 HTTPS（可使用 Let's Encrypt）

## 结语

恭喜！您已成功使用 Docker 和 Docker Compose 部署了下载站服务。这种部署方式相比传统部署有以下优势：

- 环境一致性：消除了「在我的机器上能运行」的问题
- 简化部署：一键启动所有服务
- 易于扩展：可以轻松添加更多服务或实例
- 隔离性：各服务互不干扰

如有任何问题，请参考项目文档或联系技术支持。