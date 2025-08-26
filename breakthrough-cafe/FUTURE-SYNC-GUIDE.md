# 🚀 AIPA项目未来同步操作指南

## 📋 概述

当AIPA平台有代码更新时，使用此指南完成同步到线上的操作。

**同步流程**：AIPA → 本地 → GitHub → Vercel（自动部署）

## 🎯 使用场景

- AIPA平台有新功能或修复更新
- 需要同步最新代码到线上环境
- 保持项目与AIPA平台同步

## 📝 操作步骤

### 第一步：准备工作

1. **打开终端，进入项目目录**
   ```bash
   cd breakthrough-cafe
   ```

2. **检查当前Git状态**
   ```bash
   git status
   ```
   如果有未提交的变更，建议先提交或备份。

### 第二步：从AIPA导出代码

1. **登录AIPA平台**
   - 访问你的AIPA项目
   - 点击"导出"或"下载"按钮

2. **下载zip文件**
   - 将下载的zip文件保存到项目根目录
   - 确保文件名包含"aipa"关键词（如：aipa-project-20241227.zip）

### 第三步：运行同步脚本

**一键同步（推荐给小白用户）**：
```bash
node future-sync-workflow.js
```

脚本会自动处理：
- ✅ 环境检查和验证
- ✅ 备份重要配置文件
- ✅ 解压和处理AIPA代码
- ✅ 修复目录结构问题
- ✅ 合并代码（保护重要配置）
- ✅ 同步到GitHub
- ✅ 自动触发Vercel部署

### 第四步：验证部署

1. **检查GitHub**
   - 访问你的GitHub仓库
   - 确认代码已更新

2. **检查Vercel**
   - 访问Vercel控制台
   - 确认部署成功

3. **访问线上网站**
   - 访问你的线上网址
   - 验证功能正常

## 🛡️ 安全保护

脚本会自动保护以下重要文件，不会被覆盖：

- `.env` - 数据库连接配置
- `vercel.json` - 部署配置
- `.git/` - Git版本控制
- `.gitignore` - Git忽略规则
- `node_modules/` - 依赖包

## 🔧 手动同步（高级用户）

如果自动脚本遇到问题，可以手动操作：

### 1. 备份重要文件
```bash
# 创建备份目录
mkdir backup-before-sync

# 备份重要配置
cp .env backup-before-sync/
cp vercel.json backup-before-sync/
cp package.json backup-before-sync/
```

### 2. 处理AIPA代码
```bash
# 解压AIPA代码到临时目录
mkdir temp-aipa
unzip aipa-*.zip -d temp-aipa/

# 检查目录结构
ls temp-aipa/
```

### 3. 修复目录结构
如果AIPA代码在src目录中：
```bash
# 移动src内容到根目录
cd temp-aipa/[实际代码目录]
if [ -d "src" ]; then
  mv src/* ./
  rmdir src
fi
```

### 4. 合并代码
```bash
# 回到项目根目录
cd ../../

# 复制代码文件（排除配置文件）
rsync -av --exclude='.env' --exclude='vercel.json' --exclude='.git' temp-aipa/[实际代码目录]/ ./
```

### 5. 恢复配置
```bash
# 恢复重要配置
cp backup-before-sync/.env ./
cp backup-before-sync/vercel.json ./
```

### 6. 提交和推送
```bash
# 添加变更
git add .

# 提交变更
git commit -m "🔄 AIPA同步更新 - $(date +%Y-%m-%d)"

# 推送到GitHub
git push origin main
```

## ❗ 常见问题

### Q1: 脚本找不到zip文件
**A**: 确保AIPA导出的zip文件在项目根目录，且文件名包含"aipa"。

### Q2: 目录结构错误
**A**: 脚本会自动修复，如果仍有问题，可以手动将src目录内容移到根目录。

### Q3: Git推送失败
**A**: 检查网络连接和GitHub认证。可以先运行 `git status` 查看状态。

### Q4: Vercel部署失败
**A**: 检查：
- .env文件是否包含正确的MongoDB连接字符串
- vercel.json配置是否正确
- 访问Vercel控制台查看详细错误信息

### Q5: 数据库连接问题
**A**: 确保：
- MongoDB连接字符串正确
- 数据库用户权限正常
- 网络连接正常

## 🔄 同步频率建议

- **主要功能更新**：立即同步
- **Bug修复**：建议在测试后同步
- **实验性功能**：谨慎同步，建议先在开发环境测试

## 📞 获取帮助

如果遇到问题：

1. **查看日志**：脚本会输出详细的执行日志
2. **检查备份**：重要文件都有备份，可以恢复
3. **重新开始**：可以从Git历史恢复后重新执行

## 🎉 完成确认

同步完成后，你应该能看到：

- ✅ GitHub仓库有新的提交
- ✅ Vercel显示部署成功
- ✅ 线上网站功能正常
- ✅ 数据库连接正常

---

**记住**：这个工作流程设计为小白友好，遇到问题时不要慌张，脚本会保护你的重要配置！