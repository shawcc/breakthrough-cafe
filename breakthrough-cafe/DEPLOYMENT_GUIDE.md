# 🚀 完整部署指南

本项目包含前端、后端API和MongoDB数据库，需要按以下步骤部署到Vercel。

## 📋 部署前准备

### 1. MongoDB Atlas云数据库设置

1. **注册MongoDB Atlas账号**
   - 访问 https://www.mongodb.com/atlas
   - 注册免费账号

2. **创建集群**
   - 选择免费的M0 Sandbox集群
   - 选择云提供商和区域（推荐：AWS + 亚洲区域）

3. **配置数据库访问**
   - 创建数据库用户（用户名/密码）
   - 配置网络访问：添加IP白名单 `0.0.0.0/0`（允许所有IP）

4. **获取连接字符串**
   - 点击"Connect" → "Connect your application"
   - 复制连接字符串，你的连接字符串是：
   ```
   mongodb+srv://chichishaw:<db_password>@btcafe.v040m4w.mongodb.net/?retryWrites=true&w=majority&appName=BTCAFE
   ```
   - **重要**: 将 `<db_password>` 替换为你的实际数据库密码

### 2. 数据迁移（如果有本地数据）

如果你在本地有测试数据，需要迁移到云数据库：

```bash
# 导出本地数据
mongodump --db your_local_db --out ./db_backup

# 导入到Atlas（替换连接字符串）
mongorestore --uri "your_atlas_connection_string" --db your_db_name ./db_backup/your_local_db
```

## 🔧 Vercel部署设置

### 1. 环境变量配置

在Vercel项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `MONGODB_URI` | `mongodb+srv://chichishaw:[你的密码]@btcafe.v040m4w.mongodb.net/?retryWrites=true&w=majority&appName=BTCAFE` | MongoDB Atlas连接字符串 |
| `DATABASE_NAME` | `blog` | 数据库名称 |
| `NODE_ENV` | `production` | 生产环境标识 |

### 2. GitHub集成

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "feat: add vercel deployment config"
   git push origin main
   ```

2. **连接Vercel**
   - 访问 https://vercel.com
   - 使用GitHub账号登录
   - 点击"Import Project"
   - 选择你的GitHub仓库

3. **部署配置**
   - Framework Preset: 选择 "Vite"
   - Root Directory: `.` (默认)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. 环境变量设置

在Vercel项目设置中：
1. 进入项目 → Settings → Environment Variables
2. 添加上述环境变量
3. 确保在所有环境（Production、Preview、Development）中都添加

## 🧪 部署验证

部署完成后，验证以下功能：

### 1. 前端页面
- ✅ 主页正常显示
- ✅ 路由导航正常
- ✅ 样式正确加载

### 2. API接口
访问 `https://your-domain.vercel.app/api/health` 应该返回：
```json
{
  "status": "ok",
  "timestamp": "2024-xx-xxT...",
  "services": {
    "api": "healthy",
    "database": "connected"
  }
}
```

### 3. 数据库连接
访问 `https://your-domain.vercel.app/api/articles` 应该返回文章列表

### 4. 管理功能
- ✅ 登录功能正常
- ✅ 文章创建/编辑正常
- ✅ 数据持久化正常

## 🔄 持续部署流程

### 同步方式 1：通过现有脚本
```bash
# 从AIPA同步到本地（手动操作）
npm run sync

# 推送到GitHub（自动触发Vercel部署）
git add .
git commit -m "sync: update from aipa"
git push origin main
```

### 同步方式 2：直接Git操作
```bash
# 修改代码后
git add .
git commit -m "feat: your changes"
git push origin main
```

## 🚨 常见问题

### 1. 数据库连接失败
- 检查MongoDB Atlas网络访问白名单
- 验证连接字符串格式
- 确保用户名密码正确

### 2. API路由404
- 检查`vercel.json`配置
- 确保`/api/[...path].ts`文件存在
- 查看Vercel函数日志

### 3. 环境变量未生效
- 确保在Vercel后台正确设置
- 重新部署项目以生效新变量

### 4. 构建失败
- 检查依赖版本兼容性
- 查看Vercel构建日志
- 确保TypeScript配置正确

## 📊 监控和维护

### 1. 性能监控
- 使用Vercel Analytics
- 监控API响应时间
- 观察错误率

### 2. 数据库监控
- MongoDB Atlas内置监控
- 观察连接数和查询性能
- 设置告警

### 3. 日志查看
- Vercel Functions标签页查看API日志
- MongoDB Atlas查看数据库操作日志

## 🎯 部署完成检查清单

- [ ] MongoDB Atlas集群创建完成
- [ ] 数据库连接字符串获取
- [ ] Vercel项目创建并连接GitHub
- [ ] 环境变量配置完成
- [ ] 首次部署成功
- [ ] API健康检查通过
- [ ] 前端页面正常访问
- [ ] 数据库读写测试通过
- [ ] 管理功能验证通过

完成以上步骤后，你的项目就成功部署到生产环境了！🎉