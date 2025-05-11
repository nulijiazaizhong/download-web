# VPS 部署指南 - 下载站服务

本文档提供了在 VPS（虚拟专用服务器）上部署下载站服务的详细步骤。

## 部署前提

在开始部署前，请确保您的 VPS 满足以下要求：

- 操作系统：推荐使用 Ubuntu 20.04 LTS 或更高版本
- 最低配置：1GB RAM, 1 CPU, 20GB 存储空间
- 已开放端口：80, 443 (用于 HTTP/HTTPS), 3306 (MySQL), 5000 (应用服务)

## 部署步骤

### 1. 安装基础环境

#### 1.1 更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

#### 1.2 安装 Node.js

```bash
# 安装 Node.js 16.x 或更高版本
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v
```

#### 1.3 安装 MySQL

```bash
# 安装 MySQL 服务器
sudo apt install -y mysql-server

# 启动 MySQL 服务
sudo systemctl start mysql
sudo systemctl enable mysql

# 设置 MySQL 安全配置
sudo mysql_secure_installation
```

在安全配置过程中，请设置 root 用户密码并回答安全问题（建议全部选择 Y）。

### 2. 配置 MySQL 数据库

```bash
# 登录 MySQL
sudo mysql -u root -p
```

登录后，创建数据库和用户：

```sql
# 创建数据库
CREATE DATABASE download_web;

# 创建专用用户（替换 'your_username' 和 'your_secure_password'）
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_secure_password';

# 授予权限
GRANT ALL PRIVILEGES ON download_web.* TO 'your_username'@'localhost';

# 刷新权限
FLUSH PRIVILEGES;

# 退出 MySQL
EXIT;
```

### 3. 部署应用代码

#### 3.1 安装 Git

```bash
sudo apt install -y git
```

#### 3.2 克隆代码仓库

```bash
# 创建应用目录
mkdir -p /var/www/download-web
cd /var/www/download-web

# 克隆代码（替换为您的实际仓库地址）
git clone https://your-repository-url.git .
```

#### 3.3 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

### 4. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
cd /var/www/download-web
cp .env.example .env  # 如果有示例配置文件
# 或者手动创建
nano .env
```

添加以下配置（请替换为您的实际值）：

```
NODE_ENV=production
PORT=5000

# MySQL数据库配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=download_web
MYSQL_USER=your_username
MYSQL_PASSWORD=your_secure_password

# JWT配置
JWT_SECRET=your_random_secure_jwt_secret_key
JWT_EXPIRE=30d

# 上传路径
UPLOAD_PATH=uploads
```

请确保 `JWT_SECRET` 使用随机生成的安全字符串。

### 5. 构建前端

```bash
cd /var/www/download-web/frontend
npm run build
```

### 6. 配置上传目录

```bash
# 创建上传目录
mkdir -p /var/www/download-web/uploads

# 设置权限
chmod -R 755 /var/www/download-web/uploads
```

### 7. 使用 PM2 管理应用

PM2 是一个进程管理工具，可以帮助您保持应用持续运行。

```bash
# 安装 PM2
sudo npm install -g pm2

# 启动应用
cd /var/www/download-web
pm2 start backend/server.js --name "download-web"

# 设置开机自启
pm2 startup
# 执行上面命令输出的指令

# 保存 PM2 配置
pm2 save
```

### 8. 配置 Nginx 反向代理（可选但推荐）

```bash
# 安装 Nginx
sudo apt install -y nginx

# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/download-web
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # 替换为您的域名

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 配置上传文件的访问
    location /uploads/ {
        alias /var/www/download-web/uploads/;
    }
}
```

启用站点并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/download-web /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

### 9. 配置 SSL 证书（可选但推荐）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取并配置 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

按照提示完成 SSL 证书的配置。

## 维护与更新

### 更新应用代码

```bash
cd /var/www/download-web
git pull
npm install  # 如果有新的依赖

# 更新前端
cd frontend
npm install  # 如果有新的依赖
npm run build

# 重启应用
cd /var/www/download-web
pm2 restart download-web
```

### 数据库备份

```bash
# 创建备份目录
mkdir -p /var/backups/download-web

# 备份数据库
mysqldump -u your_username -p download_web > /var/backups/download-web/backup-$(date +%Y%m%d).sql
```

## 故障排除

### 应用无法启动

1. 检查日志：`pm2 logs download-web`
2. 确认环境变量配置正确：`cat .env`
3. 验证数据库连接：`mysql -u your_username -p -e "USE download_web; SHOW TABLES;"`

### 无法上传文件

1. 检查上传目录权限：`ls -la uploads/`
2. 确认 Nginx 配置正确：`sudo nginx -t`

### 数据库连接问题

1. 确认 MySQL 服务运行状态：`sudo systemctl status mysql`
2. 验证数据库用户权限：`mysql -u your_username -p -e "SHOW GRANTS;"`

## 安全建议

1. 定期更新系统和依赖包
2. 使用强密码并定期更换
3. 配置防火墙只开放必要端口
4. 设置自动备份
5. 监控服务器资源使用情况

## 结语

恭喜！您已成功在 VPS 上部署了下载站服务。如有任何问题，请参考项目文档或联系技术支持。