#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AIPA到GitHub同步助手 - 简单版');
console.log('=====================================\n');

// 检查当前环境
function checkEnvironment() {
    console.log('📋 检查当前环境...');
    
    // 检查当前目录
    const currentDir = process.cwd();
    console.log(`📁 当前目录: ${currentDir}`);
    
    // 检查是否有.git目录
    const gitExists = fs.existsSync('.git');
    console.log(`🔧 Git状态: ${gitExists ? '✅ 已初始化' : '❌ 未初始化'}`);
    
    // 检查文件数量
    const files = fs.readdirSync('.').filter(f => !f.startsWith('.'));
    console.log(`📄 当前文件数量: ${files.length}`);
    
    // 检查是否有server目录（数据库版本标识）
    const hasServer = fs.existsSync('server');
    console.log(`🗄️  数据库版本: ${hasServer ? '✅ 已有' : '❌ 需要更新'}`);
    
    console.log('\n');
    return { gitExists, hasServer, fileCount: files.length };
}

// 提供同步指导
function provideSyncGuidance(status) {
    console.log('📖 同步操作指导');
    console.log('==================\n');
    
    if (!status.hasServer) {
        console.log('⚠️  检测到您需要从AIPA下载最新代码（包含数据库功能）\n');
        
        console.log('📱 AIPA操作步骤：');
        console.log('1. 登录 AIPA 平台');
        console.log('2. 打开您的 Breakthrough Cafe 项目');
        console.log('3. 点击右上角的"下载"按钮');
        console.log('4. 选择"下载所有文件"');
        console.log('5. 解压下载的ZIP文件\n');
        
        console.log('💻 本地操作步骤：');
        if (status.gitExists) {
            console.log('1. 备份当前.git目录: cp -r .git ../backup-git');
            console.log('2. 清空当前目录（保留.git）: find . -not -name .git -not -path "./.git/*" -delete');
        } else {
            console.log('1. 清空当前目录: rm -rf *');
            console.log('2. 初始化Git: git init');
        }
        console.log('3. 将AIPA下载的文件复制到当前目录');
        console.log('4. 配置MongoDB连接字符串');
        console.log('5. 测试本地运行: npm install && npm start');
        console.log('6. 推送到GitHub: git add . && git commit -m "Update to database version" && git push\n');
    } else {
        console.log('✅ 检测到已有数据库版本，可以直接推送到GitHub\n');
        
        console.log('🔄 推送到GitHub：');
        console.log('1. git add .');
        console.log('2. git commit -m "Update project files"');
        console.log('3. git push origin main\n');
    }
    
    console.log('🌐 Vercel环境配置：');
    console.log('1. 在Vercel Dashboard中找到您的项目');
    console.log('2. 进入Settings > Environment Variables');
    console.log('3. 添加以下环境变量：');
    console.log('   - MONGODB_URI=mongodb+srv://chichishaw:<password>@btcafe.v040m4w.mongodb.net/');
    console.log('   - NODE_ENV=production');
    console.log('4. 重新部署项目\n');
}

// 创建配置文件模板
function createConfigTemplate() {
    console.log('📝 创建配置文件模板...\n');
    
    const envContent = `# MongoDB连接配置
MONGODB_URI=mongodb+srv://chichishaw:<YOUR_PASSWORD>@btcafe.v040m4w.mongodb.net/?retryWrites=true&w=majority&appName=BTCAFE
NODE_ENV=development

# 请将 <YOUR_PASSWORD> 替换为您的实际数据库密码
`;

    try {
        fs.writeFileSync('.env', envContent);
        console.log('✅ 已创建 .env 配置文件模板');
        console.log('⚠️  请记得将 <YOUR_PASSWORD> 替换为您的实际MongoDB密码\n');
    } catch (error) {
        console.log('❌ 创建配置文件失败:', error.message);
    }
}

// 主程序
function main() {
    try {
        const status = checkEnvironment();
        provideSyncGuidance(status);
        
        if (!fs.existsSync('.env')) {
            createConfigTemplate();
        }
        
        console.log('🎯 下一步建议：');
        if (!status.hasServer) {
            console.log('1. 先从AIPA下载最新代码');
            console.log('2. 运行 node test-sync-complete.js 验证同步');
            console.log('3. 运行 node push-to-github-simple.js 推送代码');
        } else {
            console.log('1. 直接运行 node push-to-github-simple.js 推送代码');
            console.log('2. 在Vercel配置环境变量');
        }
        
        console.log('\n✨ 同步检查完成！');
        
    } catch (error) {
        console.error('❌ 发生错误:', error.message);
        process.exit(1);
    }
}

// 运行主程序
if (require.main === module) {
    main();
}

module.exports = { checkEnvironment, provideSyncGuidance };