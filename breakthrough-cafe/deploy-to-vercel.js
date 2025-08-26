#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Vercel部署自动化脚本
 * 负责检查配置、同步代码并部署到Vercel
 */

console.log('🚀 开始Vercel部署流程...\n');

// 1. 检查必要的配置文件
function checkDeploymentConfig() {
    console.log('📋 检查部署配置...');
    
    const requiredFiles = [
        'vercel.json',
        'api/[...path].ts',
        'server/index.ts',
        'server/db.ts',
        '.env'
    ];
    
    const missingFiles = [];
    
    requiredFiles.forEach(file => {
        if (!fs.existsSync(path.join(__dirname, file))) {
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length > 0) {
        console.error('❌ 缺少必要的部署配置文件:');
        missingFiles.forEach(file => {
            console.error(`   - ${file}`);
        });
        process.exit(1);
    }
    
    console.log('✅ 部署配置文件检查完成\n');
}

// 2. 检查环境变量配置
function checkEnvironmentConfig() {
    console.log('🔧 检查环境变量配置...');
    
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env文件不存在');
        process.exit(1);
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('<db_password>')) {
        console.error('❌ 请先在.env文件中替换MongoDB密码占位符 <db_password>');
        console.error('   编辑 .env 文件，将 <db_password> 替换为你的实际MongoDB密码');
        process.exit(1);
    }
    
    console.log('✅ 环境变量配置检查完成\n');
}

// 3. 检查Git状态
function checkGitStatus() {
    console.log('📦 检查Git状态...');
    
    try {
        // 检查是否有未提交的更改
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        
        if (status.trim()) {
            console.log('📝 发现未提交的更改，正在提交...');
            
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "feat: prepare for vercel deployment"', { stdio: 'inherit' });
            console.log('✅ 代码已提交\n');
        } else {
            console.log('✅ 代码已是最新状态\n');
        }
        
    } catch (error) {
        console.error('❌ Git操作失败:', error.message);
        process.exit(1);
    }
}

// 4. 推送到GitHub
function pushToGitHub() {
    console.log('🌐 推送代码到GitHub...');
    
    try {
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ 代码已推送到GitHub\n');
    } catch (error) {
        console.error('❌ 推送失败:', error.message);
        console.error('请检查GitHub仓库配置和网络连接');
        process.exit(1);
    }
}

// 5. 生成部署说明
function generateDeploymentInstructions() {
    console.log('📖 生成部署说明...\n');
    
    const instructions = `
🎯 下一步操作指南：

1. 🔗 访问 Vercel：https://vercel.com
2. 📥 导入项目：点击 "Import Project" 选择你的GitHub仓库
3. ⚙️ 配置环境变量：
   - 进入项目 Settings → Environment Variables
   - 添加以下环境变量：
   
   MONGODB_URI = mongodb+srv://chichishaw:[你的密码]@btcafe.v040m4w.mongodb.net/?retryWrites=true&w=majority&appName=BTCAFE
   NODE_ENV = production
   DATABASE_NAME = blog

4. 🚀 点击 Deploy 开始部署

5. ✅ 部署完成后测试：
   - 访问 https://你的域名.vercel.app
   - 测试 API：https://你的域名.vercel.app/api/health
   - 验证管理后台功能

💡 提示：
- MongoDB密码不要包含特殊字符，如果有特殊字符需要URL编码
- 部署后如果遇到问题，查看Vercel的Functions日志
- 确保MongoDB Atlas允许来自0.0.0.0/0的连接
`;

    console.log(instructions);
}

// 主执行流程
async function main() {
    try {
        checkDeploymentConfig();
        checkEnvironmentConfig();
        checkGitStatus();
        pushToGitHub();
        generateDeploymentInstructions();
        
        console.log('🎉 部署准备完成！请按照上述说明在Vercel中完成最终部署。');
        
    } catch (error) {
        console.error('❌ 部署过程中发生错误:', error.message);
        process.exit(1);
    }
}

// 执行主流程
main();