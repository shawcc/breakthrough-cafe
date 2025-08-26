# 🚀 拨云见日咖啡屋 - 完整部署指南

## 📋 部署流程概览

```
AIPA平台 → 本地电脑 → GitHub仓库 → Vercel网站
   ↓           ↓           ↓           ↓
 开发完成    同步代码    自动触发    线上访问
```

## 🎯 第一步：从AIPA同步到本地

### 1.1 准备工作
- 确保你的电脑已安装 Node.js（版本 >= 18）
- 确保你有 Git 工具

### 1.2 创建本地项目文件夹
```bash
# 在你想存放项目的地方创建文件夹
mkdir btcafe-project
cd btcafe-project
```

### 1.3 运行同步脚本
```bash
# 运行我们已经创建好的同步脚本
node aipa-structure-sync.js
```

**📱 如果你是在手机上操作：**
- 可以先跳过这一步，直接从第二步开始
- 代码文件已经在AIPA中准备好了

**这个脚本会做什么：**
- 从AIPA平台下载所有项目文件
- 自动安装依赖包
- 配置好项目结构

## 🔗 第二步：配置MongoDB连接

### 2.1 编辑环境变量文件
在项目根目录找到 `.env` 文件，编辑以下内容：

```env
# MongoDB Atlas 连接配置
MONGODB_URI=mongodb+srv://chichishaw:你的数据库密码@btcafe.v040m4w.mongodb.net/btcafe?retryWrites=true&w=majority&appName=BTCAFE

# Vercel环境配置
AIPA_API_DOMAIN=https://你的vercel域名.vercel.app
```

**重要：** 
- 把 `你的数据库密码` 替换为你的MongoDB实际密码
- `你的vercel域名` 暂时可以不填，等部署后再填

### 2.2 测试本地连接
```bash
# 安装依赖（如果还没安装）
npm install

# 启动本地服务器测试
npm run dev
```

在浏览器打开 `http://localhost:3000` 查看网站是否正常。

## 📤 第三步：推送到GitHub

### 3.1 初始化Git仓库
```bash
# 在项目目录下
git init
git add .
git commit -m "Initial commit: 拨云见日咖啡屋项目"
```

### 3.2 使用简化脚本推送
```bash
# 使用我们准备好的简化脚本
node simple-github-push.js
```

**📱 如果脚本运行失败，可以手动操作：**
```bash
# 连接到你的GitHub仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送代码
git branch -M main
git push -u origin main
```

## 🌐 第四步：在Vercel上配置

### 4.1 环境变量配置
在Vercel控制台添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `MONGODB_URI` | mongodb+srv://chichishaw:你的密码@btcafe.v040m4w.mongodb.net/btcafe?retryWrites=true&w=majority&appName=BTCAFE |
| `NODE_ENV` | production |

### 4.2 部署设置
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## ✅ 第五步：验证部署

### 5.1 检查网站功能
1. 前台页面：确保可以访问咖啡屋主页
2. 文章系统：检查文章列表和详情页
3. 管理后台：访问 `/management/login` 测试登录

### 5.2 管理员登录
- 用户名：`admin`
- 密码：`admin123`

## 🛠️ 常见问题解决

### Q: 本地同步失败怎么办？
A: 确保网络连接正常，如果还是失败，可以手动从AIPA下载代码文件。

### Q: MongoDB连接失败？
A: 检查连接字符串中的密码是否正确，确保MongoDB Atlas的网络设置允许所有IP访问。

### Q: Vercel部署失败？
A: 检查环境变量是否正确设置，特别是 `MONGODB_URI`。

### Q: 网站访问报错？
A: 查看Vercel的日志，通常是环境变量配置或数据库连接问题。

## 📞 需要帮助？

如果遇到任何问题，请：
1. 截图保存错误信息
2. 告诉我你在哪一步遇到问题
3. 提供详细的错误描述

## 🎉 恭喜！

完成以上步骤后，你的咖啡屋网站就成功上线了！