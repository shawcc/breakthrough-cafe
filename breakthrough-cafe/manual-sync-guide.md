# 手动同步指南 📋

## 适用场景
- 遇到权限错误无法运行脚本
- 希望更精确控制同步过程
- 脚本运行有问题的情况

## 操作步骤

### 第一步：备份当前重要文件
在开始前，请备份这些重要文件：
```bash
# 创建备份目录
mkdir backup-$(date +%Y%m%d)

# 备份重要配置
cp .env backup-$(date +%Y%m%d)/ 2>/dev/null || true
cp vercel.json backup-$(date +%Y%m%d)/ 2>/dev/null || true
```

### 第二步：从AIPA导出最新代码
1. 在AIPA中点击导出按钮
2. 下载ZIP文件到本地
3. 解压到临时目录（比如 `aipa-latest`）

### 第三步：复制核心文件
```bash
# 复制前端代码（覆盖旧版本）
cp -r aipa-latest/components/* components/ 2>/dev/null || true
cp -r aipa-latest/pages/* pages/ 2>/dev/null || true
cp -r aipa-latest/hooks/* hooks/ 2>/dev/null || true
cp -r aipa-latest/store/* store/ 2>/dev/null || true
cp -r aipa-latest/types/* types/ 2>/dev/null || true
cp -r aipa-latest/shared/* shared/ 2>/dev/null || true

# 复制服务端代码
cp -r aipa-latest/server/* server/ 2>/dev/null || true

# 复制根目录文件
cp aipa-latest/App.tsx .
cp aipa-latest/vercel.json .
```

### 第四步：更新配置文件
检查并更新 `.env` 文件，确保包含：
```env
MONGODB_URI=你的MongoDB连接字符串
NODE_ENV=production
```

### 第五步：测试本地
```bash
# 确保在项目根目录
pwd

# 查看文件结构
ls -la

# 如果有package.json，检查是否需要安装依赖
cat package.json 2>/dev/null || echo "No package.json found"
```

### 第六步：推送到GitHub
```bash
# 检查Git状态
git status

# 添加所有文件
git add .

# 提交更改
git commit -m "Sync latest code from AIPA"

# 推送到GitHub
git push origin main
```

## 验证部署
1. 推送完成后，Vercel会自动部署
2. 检查Vercel控制台确认部署成功
3. 访问您的网站URL验证功能

## 常见问题

**Q: 如果.env文件丢失怎么办？**
A: 在Vercel控制台的Environment Variables中重新配置MONGODB_URI

**Q: 如果部署失败怎么办？**
A: 检查Vercel的部署日志，通常是缺少环境变量或代码错误

**Q: 如何确认同步成功？**
A: 访问网站，检查是否显示最新的功能和内容

## 提示
- 这个方法虽然手动，但是最可靠
- 每次都会完全覆盖旧代码，确保同步彻底
- 适合小白用户，无需复杂的脚本操作