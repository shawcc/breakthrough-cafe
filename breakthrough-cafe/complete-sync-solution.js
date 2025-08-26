#!/usr/bin/env node

/**
 * 完整代码同步解决方案
 * 适用于：本地有旧版本代码，需要同步AIPA最新版本
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 拨云见日咖啡屋 - 完整代码同步工具');
console.log('=====================================\n');

// 检查当前环境
function checkEnvironment() {
    console.log('📋 检查当前环境...');
    
    // 检查是否在项目目录
    if (!fs.existsSync('./package.json')) {
        console.log('❌ 错误：请在项目根目录运行此脚本');
        process.exit(1);
    }
    
    // 检查是否有.git文件夹
    const hasGit = fs.existsSync('./.git');
    console.log(`Git仓库状态: ${hasGit ? '✅ 已初始化' : '❌ 未初始化'}`);
    
    // 检查package.json内容
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const hasDatabase = packageJson.dependencies && 
                       (packageJson.dependencies.mongodb || 
                        packageJson.dependencies.hono);
    
    console.log(`代码版本: ${hasDatabase ? '✅ 最新版（含数据库）' : '⚠️  旧版本（仅静态页面）'}`);
    
    return { hasGit, hasDatabase };
}

// 创建备份
function createBackup() {
    console.log('\n💾 创建备份...');
    
    const backupDir = `../btcafe-backup-${new Date().toISOString().slice(0, 10)}`;
    
    try {
        // 简单的文件复制备份
        console.log(`备份位置: ${backupDir}`);
        console.log('⚠️  请手动复制当前文件夹到备份位置');
        console.log('   建议命令: cp -r . ' + backupDir);
        
        return true;
    } catch (error) {
        console.log('❌ 备份失败:', error.message);
        return false;
    }
}

// 同步策略说明
function showSyncStrategy() {
    console.log('\n🔄 同步策略说明');
    console.log('================');
    console.log('由于版本差异较大，建议采用以下方案：');
    console.log('');
    console.log('方案A：完全替换（推荐，简单）');
    console.log('  1. 备份当前代码');
    console.log('  2. 清空当前目录（保留.git文件夹）');
    console.log('  3. 下载AIPA最新代码');
    console.log('  4. 推送到GitHub');
    console.log('');
    console.log('方案B：增量同步（复杂）');
    console.log('  1. 智能合并新旧文件');
    console.log('  2. 手动解决冲突');
    console.log('  3. 测试功能完整性');
    console.log('');
}

// 生成下一步指令
function generateNextSteps() {
    console.log('\n📋 下一步操作指南');
    console.log('==================');
    console.log('');
    console.log('步骤1: 备份当前代码');
    console.log('  mkdir ../btcafe-backup');
    console.log('  cp -r . ../btcafe-backup/');
    console.log('');
    console.log('步骤2: 清理当前目录（保留.git）');
    console.log('  find . -maxdepth 1 -not -name .git -not -name . -exec rm -rf {} +');
    console.log('');
    console.log('步骤3: 运行AIPA同步脚本');
    console.log('  node aipa-complete-download.js');
    console.log('');
    console.log('步骤4: 配置MongoDB连接');
    console.log('  编辑 .env 文件，填入你的数据库密码');
    console.log('');
    console.log('步骤5: 推送到GitHub');
    console.log('  git add .');
    console.log('  git commit -m "upgrade: 升级到数据库版本"');
    console.log('  git push');
    console.log('');
    console.log('步骤6: 在Vercel配置环境变量');
    console.log('  MONGODB_URI = 你的MongoDB连接字符串');
    console.log('  ADMIN_USERNAME = admin');
    console.log('  ADMIN_PASSWORD = 你设置的管理员密码');
}

// 主函数
function main() {
    const env = checkEnvironment();
    
    if (env.hasDatabase) {
        console.log('\n✅ 检测到你已经有最新版本的代码！');
        console.log('可以直接推送到GitHub进行部署。');
        return;
    }
    
    console.log('\n⚠️  检测到需要版本升级');
    console.log('当前版本: 静态页面');
    console.log('目标版本: 完整数据库应用');
    
    createBackup();
    showSyncStrategy();
    generateNextSteps();
    
    console.log('\n🎯 准备就绪！');
    console.log('请按照上述步骤进行操作，有问题随时询问。');
}

// 运行
main();