# 🔧 AIPA 目录结构调整指南

## 问题说明

从AIPA导出的zip包通常是标准的前端项目结构：
```
breakthrough-cafe/
├── src/           # 所有代码文件在这里
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── ...
├── package.json
├── tsconfig.json
└── 其他配置文件
```

而AIPA在线版本使用的是扁平化结构：
```
breakthrough-cafe/
├── components/    # 直接在根目录
├── pages/
├── hooks/
├── server/
├── api/
└── 其他文件
```

## 🚀 一键解决方案

### 步骤1: 运行调整脚本
```bash
node fix-directory-structure.js
```

### 步骤2: 验证结果
脚本会自动：
- ✅ 将 `src/` 目录下的所有文件移动到根目录
- ✅ 删除不需要的配置文件 (rsbuild.config.ts, postcss.config.js 等)
- ✅ 创建必要的配置文件 (.env, vercel.json)
- ✅ 显示调整后的目录结构

### 步骤3: 提交到Git
```bash
git add .
git commit -m "fix: 调整目录结构为AIPA格式"
git push origin main
```

## 📋 手动调整方法（备用）

如果脚本执行失败，可以手动操作：

### 1. 移动文件
```bash
# 进入项目目录
cd breakthrough-cafe

# 移动 src 下的所有文件到根目录
mv src/* .
mv src/.* . 2>/dev/null || true

# 删除空的 src 目录
rmdir src
```

### 2. 删除不需要的文件
```bash
rm -f rsbuild.config.ts
rm -f postcss.config.js  
rm -f tailwind.config.ts
rm -f tsconfig.json
```

### 3. 检查重要文件
确保以下文件存在：
- ✅ `App.tsx` (React入口)
- ✅ `vercel.json` (部署配置)
- ✅ `.env` (环境变量)
- ✅ `api/[...path].ts` (API路由)
- ✅ `server/` 目录 (后端代码)

## 🔍 验证调整结果

调整完成后，你的目录结构应该是这样：

```
breakthrough-cafe/
├── 📁 components/
├── 📁 pages/
├── 📁 hooks/
├── 📁 server/
├── 📁 api/
├── 📁 shared/
├── 📄 App.tsx
├── 📄 vercel.json
├── 📄 .env
├── 📄 package.json
└── 📄 其他文件...
```

## ⚠️ 常见问题

### Q: 脚本提示"src目录不存在"
A: 可能zip包结构不同，请检查实际的目录结构

### Q: 移动文件时出现权限错误
A: 确保你有目录的写权限，尝试使用管理员权限运行

### Q: Git提交时有很多文件变更
A: 这是正常的，因为文件路径都改变了

## 🎯 下一步

目录结构调整完成后：

1. **测试本地运行** (可选)
2. **提交到GitHub**
   ```bash
   git add .
   git commit -m "fix: 调整目录结构为AIPA格式"
   git push origin main
   ```
3. **等待Vercel自动部署**
4. **配置环境变量** (在Vercel控制台)

## 🆘 需要帮助？

如果遇到问题，可以：
1. 检查脚本输出的错误信息
2. 手动按照上述步骤操作
3. 确保所有必要文件都在正确位置