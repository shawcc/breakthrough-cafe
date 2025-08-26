#!/usr/bin/env node

const fs = require('fs');

console.log('⚙️  Vercel环境变量配置指南');
console.log('==============================\n');

// 检查本地环境配置
function checkLocalConfig() {
    console.log('🔍 检查本地环境配置...\n');
    
    if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf8');
        console.log('✅ 发现本地.env文件');
        
        // 检查MongoDB配置
        if (envContent.includes('MONGODB_URI')) {
            console.log('✅ MongoDB URI已配置');
            
            const hasPassword = !envContent.includes('<YOUR_PASSWORD>') && !envContent.includes('<password>');
            console.log(`🔐 密码状态: ${hasPassword ? '✅ 已设置' : '⚠️  需要设置实际密码'}`);
            
            if (!hasPassword) {
                console.log('\n⚠️  请在.env文件中设置实际的MongoDB密码！\n');
            }
            
            return { hasConfig: true, hasPassword };
        } else {
            console.log('❌ 缺少MongoDB URI配置');
            return { hasConfig: false, hasPassword: false };
        }
    } else {
        console.log('❌ 未找到.env文件');
        return { hasConfig: false, hasPassword: false };
    }
}

// 显示环境变量配置
function showEnvironmentVariables() {
    console.log('🔧 Vercel环境变量配置');
    console.log('========================\n');
    
    console.log('📋 需要在Vercel中配置的环境变量：\n');
    
    console.log('1️⃣  MONGODB_URI');
    console.log('   值: mongodb+srv://chichishaw:<YOUR_PASSWORD>@btcafe.v040m4w.mongodb.net/?retryWrites=true&w=majority&appName=BTCAFE');
    console.log('   ⚠️  请将 <YOUR_PASSWORD> 替换为您的实际MongoDB密码\n');
    
    console.log('2️⃣  NODE_ENV');
    console.log('   值: production\n');
    
    console.log('3️⃣  AIPA_API_DOMAIN (可选)');
    console.log('   值: 留空（Vercel会自动设置）\n');
}

// 显示Vercel配置步骤
function showVercelSteps() {
    console.log('🌐 Vercel配置详细步骤');
    console.log('=======================\n');
    
    console.log('📱 方法一：通过Vercel Dashboard');
    console.log('--------------------------------');
    console.log('1. 登录 https://vercel.com');
    console.log('2. 找到您的 breakthrough-cafe 项目');
    console.log('3. 点击项目名称进入项目详情');
    console.log('4. 点击顶部的 "Settings" 标签');
    console.log('5. 在左侧菜单选择 "Environment Variables"');
    console.log('6. 点击 "Add New" 按钮');
    console.log('7. 依次添加上述环境变量\n');
    
    console.log('💻 方法二：通过Vercel CLI');
    console.log('-------------------------');
    console.log('1. 安装Vercel CLI: npm i -g vercel');
    console.log('2. 登录: vercel login');
    console.log('3. 在项目目录运行: vercel env add');
    console.log('4. 按照提示添加环境变量\n');
}

// 显示部署验证步骤
function showDeploymentVerification() {
    console.log('✅ 部署验证清单');
    console.log('=================\n');
    
    console.log('🔍 部署后请验证以下功能：\n');
    
    console.log('1️⃣  网站基本功能');
    console.log('   - 首页正常显示');
    console.log('   - 导航菜单工作正常');
    console.log('   - 页面样式正确\n');
    
    console.log('2️⃣  文章功能');
    console.log('   - 访问 /articles 页面');
    console.log('   - 文章列表正常加载');
    console.log('   - 点击文章可以查看详情\n');
    
    console.log('3️⃣  管理后台');
    console.log('   - 访问 /management 页面');
    console.log('   - 登录功能正常（默认密码：admin123）');
    console.log('   - 可以创建和编辑文章\n');
    
    console.log('4️⃣  数据库连接');
    console.log('   - 检查Vercel函数日志');
    console.log('   - 确认没有MongoDB连接错误');
    console.log('   - 测试数据读写功能\n');
}

// 显示常见问题解决方案
function showTroubleshooting() {
    console.log('🔧 常见问题与解决方案');
    console.log('=======================\n');
    
    console.log('❌ 部署失败');
    console.log('----------');
    console.log('1. 检查Vercel构建日志');
    console.log('2. 确认所有依赖都在package.json中');
    console.log('3. 检查vercel.json配置文件\n');
    
    console.log('❌ 数据库连接失败');
    console.log('----------------');
    console.log('1. 确认MONGODB_URI环境变量正确');
    console.log('2. 检查MongoDB Atlas网络访问设置');
    console.log('3. 确认数据库用户权限\n');
    
    console.log('❌ API接口404错误');
    console.log('---------------');
    console.log('1. 检查api/[...path].ts文件是否存在');
    console.log('2. 确认Vercel Functions配置');
    console.log('3. 检查路由配置\n');
    
    console.log('❌ 页面样式丢失');
    console.log('---------------');
    console.log('1. 确认Tailwind CSS配置');
    console.log('2. 检查静态资源部署');
    console.log('3. 查看浏览器控制台错误\n');
}

// 生成配置摘要
function generateConfigSummary(localConfig) {
    console.log('📋 配置摘要');
    console.log('===========\n');
    
    console.log('本地配置状态：');
    console.log(`✅ .env文件: ${localConfig.hasConfig ? '已配置' : '❌ 未配置'}`);
    console.log(`🔐 MongoDB密码: ${localConfig.hasPassword ? '已设置' : '⚠️  需要设置'}\n`);
    
    console.log('Vercel部署需要：');
    console.log('✅ MONGODB_URI (必需)');
    console.log('✅ NODE_ENV=production (必需)');
    console.log('⚪ AIPA_API_DOMAIN (可选)\n');
    
    console.log('下一步操作：');
    if (!localConfig.hasPassword) {
        console.log('1. ⚠️  先设置本地.env文件中的MongoDB密码');
        console.log('2. 🌐 在Vercel中配置环境变量');
        console.log('3. 🚀 重新部署项目');
    } else {
        console.log('1. 🌐 在Vercel中配置环境变量');
        console.log('2. 🚀 推送代码触发自动部署');
        console.log('3. ✅ 验证部署结果');
    }
}

// 主程序
function main() {
    try {
        console.log('开始Vercel环境配置指导...\n');
        
        const localConfig = checkLocalConfig();
        
        showEnvironmentVariables();
        showVercelSteps();
        showDeploymentVerification();
        showTroubleshooting();
        generateConfigSummary(localConfig);
        
        console.log('\n🎯 重要提醒：');
        console.log('===========');
        console.log('1. 🔐 请确保MongoDB密码正确设置');
        console.log('2. 🌐 环境变量配置后需要重新部署');
        console.log('3. ✅ 部署完成后请测试所有功能');
        console.log('4. 📱 有问题请检查Vercel Function日志\n');
        
        console.log('✨ 配置指导完成！祝您部署顺利！');
        
    } catch (error) {
        console.error('❌ 配置指导过程中发生错误:', error.message);
        process.exit(1);
    }
}

// 运行主程序
if (require.main === module) {
    main();
}