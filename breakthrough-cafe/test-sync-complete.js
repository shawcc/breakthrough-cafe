#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 验证AIPA同步完整性');
console.log('=======================\n');

// 检查必要的文件和目录
function checkRequiredFiles() {
    console.log('📋 检查必要文件和目录...\n');
    
    const requiredItems = [
        // 核心文件
        { path: 'App.tsx', type: 'file', description: 'React应用入口' },
        { path: 'package.json', type: 'file', description: '依赖配置' },
        
        // 前端页面
        { path: 'pages', type: 'directory', description: '页面目录' },
        { path: 'components', type: 'directory', description: '组件目录' },
        { path: 'hooks', type: 'directory', description: 'React Hooks' },
        
        // 数据库相关
        { path: 'server', type: 'directory', description: '服务端代码' },
        { path: 'server/index.ts', type: 'file', description: '服务端入口' },
        { path: 'server/routes', type: 'directory', description: '路由目录' },
        { path: 'shared', type: 'directory', description: '共享类型' },
        
        // Vercel部署
        { path: 'vercel.json', type: 'file', description: 'Vercel配置' },
        { path: 'api', type: 'directory', description: 'API路由' },
        
        // 配置文件
        { path: '.env', type: 'file', description: '环境变量配置' }
    ];
    
    let allExists = true;
    let issues = [];
    
    requiredItems.forEach(item => {
        const exists = fs.existsSync(item.path);
        const status = exists ? '✅' : '❌';
        console.log(`${status} ${item.path} - ${item.description}`);
        
        if (!exists) {
            allExists = false;
            issues.push(item);
        }
    });
    
    console.log('\n');
    return { allExists, issues };
}

// 检查文件内容
function checkFileContents() {
    console.log('📄 检查关键文件内容...\n');
    
    const checks = [];
    
    // 检查package.json中的依赖
    if (fs.existsSync('package.json')) {
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const hasHono = packageJson.dependencies && packageJson.dependencies['hono'];
            const hasMongodb = packageJson.dependencies && packageJson.dependencies['mongodb'];
            
            console.log(`📦 Hono框架: ${hasHono ? '✅ 已配置' : '❌ 缺失'}`);
            console.log(`🗄️  MongoDB: ${hasMongodb ? '✅ 已配置' : '❌ 缺失'}`);
            
            checks.push({ name: 'Hono依赖', passed: !!hasHono });
            checks.push({ name: 'MongoDB依赖', passed: !!hasMongodb });
        } catch (error) {
            console.log('❌ package.json 格式错误');
            checks.push({ name: 'package.json', passed: false });
        }
    }
    
    // 检查服务端入口文件
    if (fs.existsSync('server/index.ts')) {
        const serverContent = fs.readFileSync('server/index.ts', 'utf8');
        const hasHonoImport = serverContent.includes('hono');
        const hasRoutes = serverContent.includes('routes');
        
        console.log(`🔧 服务端框架: ${hasHonoImport ? '✅ Hono已配置' : '❌ 缺失Hono'}`);
        console.log(`🛣️  路由配置: ${hasRoutes ? '✅ 已配置' : '❌ 缺失'}`);
        
        checks.push({ name: '服务端框架', passed: hasHonoImport });
        checks.push({ name: '路由配置', passed: hasRoutes });
    }
    
    // 检查环境变量
    if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf8');
        const hasMongoDB = envContent.includes('MONGODB_URI');
        const hasPassword = !envContent.includes('<YOUR_PASSWORD>');
        
        console.log(`🔑 MongoDB配置: ${hasMongoDB ? '✅ 已配置' : '❌ 缺失'}`);
        console.log(`🔐 密码设置: ${hasPassword ? '✅ 已设置' : '⚠️  需要设置'}`);
        
        checks.push({ name: 'MongoDB配置', passed: hasMongoDB });
        checks.push({ name: '密码设置', passed: hasPassword });
    }
    
    console.log('\n');
    return checks;
}

// 统计文件数量
function countFiles() {
    console.log('📊 文件统计...\n');
    
    function countInDirectory(dir) {
        if (!fs.existsSync(dir)) return 0;
        
        let count = 0;
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
            if (item.name.startsWith('.')) continue;
            
            if (item.isFile()) {
                count++;
            } else if (item.isDirectory()) {
                count += countInDirectory(path.join(dir, item.name));
            }
        }
        
        return count;
    }
    
    const totalFiles = countInDirectory('.');
    console.log(`📄 总文件数: ${totalFiles}`);
    console.log(`🎯 期望文件数: ~52（包含数据库功能的完整版本）`);
    
    if (totalFiles >= 45) {
        console.log('✅ 文件数量正常，同步完整');
    } else if (totalFiles >= 20) {
        console.log('⚠️  文件数量偏少，可能缺少部分功能');
    } else {
        console.log('❌ 文件数量过少，可能同步不完整');
    }
    
    console.log('\n');
    return totalFiles;
}

// 生成下一步建议
function generateNextSteps(fileCheck, contentCheck, fileCount) {
    console.log('🎯 下一步建议');
    console.log('=============\n');
    
    if (!fileCheck.allExists) {
        console.log('❌ 同步不完整，建议重新从AIPA下载：\n');
        console.log('1. 重新从AIPA下载完整项目文件');
        console.log('2. 确保包含所有52个文件');
        console.log('3. 重新运行此验证脚本\n');
        
        console.log('缺失的文件/目录：');
        fileCheck.issues.forEach(issue => {
            console.log(`   - ${issue.path} (${issue.description})`);
        });
        return false;
    }
    
    const failedChecks = contentCheck.filter(check => !check.passed);
    if (failedChecks.length > 0) {
        console.log('⚠️  需要完善配置：\n');
        
        failedChecks.forEach(check => {
            if (check.name === '密码设置') {
                console.log('🔐 设置MongoDB密码：');
                console.log('   编辑 .env 文件，将 <YOUR_PASSWORD> 替换为实际密码\n');
            }
        });
    }
    
    if (fileCount >= 45 && failedChecks.length <= 1) {
        console.log('✅ 同步完整，可以推送到GitHub：\n');
        console.log('运行命令：node push-to-github-simple.js\n');
        return true;
    }
    
    return false;
}

// 主程序
function main() {
    try {
        console.log('开始验证AIPA代码同步状态...\n');
        
        const fileCheck = checkRequiredFiles();
        const contentCheck = checkFileContents();
        const fileCount = countFiles();
        
        const readyToPush = generateNextSteps(fileCheck, contentCheck, fileCount);
        
        console.log('📋 验证摘要');
        console.log('===========');
        console.log(`文件完整性: ${fileCheck.allExists ? '✅ 通过' : '❌ 失败'}`);
        console.log(`内容检查: ${contentCheck.every(c => c.passed) ? '✅ 通过' : '⚠️  部分通过'}`);
        console.log(`文件数量: ${fileCount} (期望: ~52)`);
        console.log(`准备推送: ${readyToPush ? '✅ 是' : '❌ 否'}\n`);
        
        if (readyToPush) {
            console.log('🎉 恭喜！项目已准备好推送到GitHub！');
        }
        
    } catch (error) {
        console.error('❌ 验证过程中发生错误:', error.message);
        process.exit(1);
    }
}

// 运行主程序
if (require.main === module) {
    main();
}