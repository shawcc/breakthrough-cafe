#!/usr/bin/env node

/**
 * 快速部署脚本
 * 一键完成从配置到部署的全流程
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 拨云见日咖啡屋 - 快速部署工具\n');
console.log('这个脚本将帮助你完成从配置到部署的全部流程\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    try {
        // 1. 获取MongoDB密码
        console.log('📊 检测到你的MongoDB连接信息：');
        console.log('   集群: btcafe.v040m4w.mongodb.net');
        console.log('   用户名: chichishaw');
        console.log('   应用名: BTCAFE\n');
        
        const dbPassword = await askQuestion('🔑 请输入你的MongoDB数据库密码: ');
        
        if (!dbPassword) {
            console.error('❌ 密码不能为空');
            process.exit(1);
        }
        
        // 2. 更新.env文件
        console.log('\n📝 更新配置文件...');
        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace('<db_password>', dbPassword);
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env文件已更新');
        
        // 3. 检查Git状态并提交
        console.log('\n📦 准备代码提交...');
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            if (status.trim()) {
                execSync('git add .', { stdio: 'inherit' });
                execSync('git commit -m "feat: configure mongodb connection for deployment"', { stdio: 'inherit' });
                console.log('✅ 代码已提交');
            }
        } catch (error) {
            console.log('⚠️ Git提交跳过（可能已经是最新状态）');
        }
        
        // 4. 推送到GitHub
        const shouldPush = await askQuestion('\n🌐 是否立即推送到GitHub? (y/n): ');
        if (shouldPush.toLowerCase() === 'y' || shouldPush.toLowerCase() === 'yes') {
            try {
                execSync('git push origin main', { stdio: 'inherit' });
                console.log('✅ 代码已推送到GitHub');
            } catch (error) {
                console.error('❌ 推送失败，请检查GitHub配置');
            }
        }
        
        // 5. 显示部署说明
        console.log('\n🎯 下一步部署说明：');
        console.log('='.repeat(50));
        console.log('1. 🔗 访问 https://vercel.com');
        console.log('2. 📥 点击 "Import Project" 选择你的GitHub仓库');
        console.log('3. ⚙️ 在项目设置中添加环境变量：');
        console.log('   Settings → Environment Variables');
        console.log('');
        console.log('   添加以下变量：');
        console.log('   ┌─────────────────┬────────────────────────────────────┐');
        console.log('   │ 变量名          │ 值                                 │');
        console.log('   ├─────────────────┼────────────────────────────────────┤');
        console.log('   │ MONGODB_URI     │ mongodb+srv://chichishaw:' + dbPassword + '@btcafe.v040m4w.mongodb.net/?retryWrites=true&w=majority&appName=BTCAFE │');
        console.log('   │ DATABASE_NAME   │ blog                               │');
        console.log('   │ NODE_ENV        │ production                         │');
        console.log('   └─────────────────┴────────────────────────────────────┘');
        console.log('');
        console.log('4. 🚀 点击 "Deploy" 开始部署');
        console.log('5. ✅ 部署完成后访问你的网站！');
        console.log('');
        console.log('💡 部署完成后测试这些URL：');
        console.log('   - 主页: https://你的域名.vercel.app');
        console.log('   - API健康检查: https://你的域名.vercel.app/api/health');
        console.log('   - 管理后台: https://你的域名.vercel.app/#/management/login');
        console.log('');
        console.log('🎉 配置完成！请按照上述步骤在Vercel中完成部署。');
        
    } catch (error) {
        console.error('❌ 配置过程中发生错误:', error.message);
    } finally {
        rl.close();
    }
}

main();