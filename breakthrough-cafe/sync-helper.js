#!/usr/bin/env node

console.log('🚀 Breakthrough Cafe 项目同步助手');
console.log('===================================\n');

const fs = require('fs');
const path = require('path');

// 检查当前项目状态
function checkProjectStatus() {
    console.log('📋 检查当前项目状态...\n');
    
    // 检查是否有server目录（新版本特征）
    const hasServer = fs.existsSync('./server');
    const hasDatabase = fs.existsSync('./server/index.ts');
    const hasAPI = fs.existsSync('./api');
    
    console.log(`📁 server目录: ${hasServer ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`🗄️  数据库功能: ${hasDatabase ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`🌐 API目录: ${hasAPI ? '✅ 存在' : '❌ 不存在'}`);
    
    if (!hasServer) {
        console.log('\n⚠️  检测到您的本地代码是旧版本（没有数据库功能）');
        console.log('\n🎯 推荐操作步骤：');
        console.log('1. 从AIPA导出最新的完整项目ZIP文件');
        console.log('2. 备份当前文件夹（重命名为 breakthrough-cafe-old）');
        console.log('3. 解压新的ZIP文件');
        console.log('4. 使用以下MongoDB连接字符串配置.env文件：');
        console.log('   MONGODB_URI=mongodb+srv://chichishaw:您的密码@btcafe.v040m4w.mongodb.net/btcafe?retryWrites=true&w=majority&appName=BTCAFE');
        console.log('5. 运行 npm install（如果需要）');
        console.log('6. 测试应用：npm run dev 或 npm start');
        console.log('7. 推送到GitHub：git add . && git commit -m "Update to latest version" && git push');
        
        console.log('\n💡 小贴士：');
        console.log('- 新版本包含完整的文章管理系统和数据库功能');
        console.log('- 您的GitHub会自动部署到Vercel');
        console.log('- 记得在Vercel中配置MONGODB_URI环境变量');
        
    } else {
        console.log('\n✅ 您的项目已经是最新版本！');
        console.log('\n🎯 下一步操作：');
        console.log('1. 确保.env文件配置正确');
        console.log('2. 测试应用：npm run dev');
        console.log('3. 推送到GitHub进行部署');
    }
}

// 检查MongoDB配置
function checkMongoConfig() {
    console.log('\n🔧 MongoDB配置检查...\n');
    
    const envExists = fs.existsSync('.env');
    console.log(`📄 .env文件: ${envExists ? '✅ 存在' : '❌ 不存在'}`);
    
    if (envExists) {
        try {
            const envContent = fs.readFileSync('.env', 'utf8');
            const hasMongoURI = envContent.includes('MONGODB_URI');
            const hasPassword = envContent.includes('<db_password>');
            
            console.log(`🔑 MONGODB_URI配置: ${hasMongoURI ? '✅ 存在' : '❌ 不存在'}`);
            
            if (hasPassword) {
                console.log('⚠️  请将.env文件中的<db_password>替换为您的实际MongoDB密码');
            } else if (hasMongoURI) {
                console.log('✅ MongoDB配置看起来正确');
            }
        } catch (error) {
            console.log('❌ 读取.env文件时出错');
        }
    } else {
        console.log('\n🆕 需要创建.env文件，内容如下：');
        console.log('MONGODB_URI=mongodb+srv://chichishaw:您的密码@btcafe.v040m4w.mongodb.net/btcafe?retryWrites=true&w=majority&appName=BTCAFE');
    }
}

// 主函数
function main() {
    checkProjectStatus();
    checkMongoConfig();
    
    console.log('\n✨ 如有问题，请按照上述步骤操作，或联系技术支持！');
}

main();