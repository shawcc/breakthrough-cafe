#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 整理AIPA文件并部署到GitHub/Vercel');
console.log('=====================================\n');

function checkDirectoryStructure() {
    console.log('📁 检查当前目录结构...');
    
    const currentDir = process.cwd();
    console.log(`当前目录: ${currentDir}`);
    
    // 检查是否有App.tsx等核心文件
    const coreFiles = ['App.tsx', 'package.json'];
    const missingFiles = coreFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        console.log('❌ 缺少核心文件:', missingFiles.join(', '));
        console.log('\n请确认你在正确的项目目录中，或者zip包文件没有正确解压');
        return false;
    }
    
    console.log('✅ 目录结构检查通过\n');
    return true;
}

function cleanupUnnecessaryFiles() {
    console.log('🧹 清理不需要的文件...');
    
    const filesToDelete = [
        'tsconfig.json',
        'tailwind.config.js',
        'vite.config.ts',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml'
    ];
    
    filesToDelete.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`  删除: ${file}`);
        }
    });
    
    console.log('✅ 文件清理完成\n');
}

function checkGitStatus() {
    console.log('📋 检查Git状态...');
    
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
            console.log('📝 发现文件变更:');
            console.log(status);
        } else {
            console.log('📝 没有文件变更');
        }
        return true;
    } catch (error) {
        console.log('❌ Git检查失败:', error.message);
        return false;
    }
}

function deployToGitHub() {
    console.log('📤 推送到GitHub...');
    
    try {
        console.log('  添加所有文件...');
        execSync('git add .', { stdio: 'inherit' });
        
        console.log('  提交变更...');
        const commitMessage = `chore: sync from AIPA - ${new Date().toLocaleString()}`;
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
        
        console.log('  推送到远程仓库...');
        execSync('git push origin main', { stdio: 'inherit' });
        
        console.log('✅ GitHub推送成功!\n');
        return true;
    } catch (error) {
        console.log('❌ GitHub推送失败:', error.message);
        return false;
    }
}

function showNextSteps() {
    console.log('🎉 部署完成!');
    console.log('=====================================');
    console.log('');
    console.log('📋 下一步操作:');
    console.log('');
    console.log('1. 检查Vercel自动部署状态:');
    console.log('   访问 https://vercel.com/dashboard');
    console.log('');
    console.log('2. 如果需要手动触发部署:');
    console.log('   在Vercel项目页面点击 "Redeploy"');
    console.log('');
    console.log('3. 配置环境变量(如果需要):');
    console.log('   在Vercel项目设置中添加数据库连接等环境变量');
    console.log('');
    console.log('4. 访问你的网站:');
    console.log('   等待部署完成后访问你的Vercel域名');
    console.log('');
}

async function main() {
    try {
        // 检查目录结构
        if (!checkDirectoryStructure()) {
            process.exit(1);
        }
        
        // 清理不需要的文件
        cleanupUnnecessaryFiles();
        
        // 检查Git状态
        if (!checkGitStatus()) {
            console.log('⚠️  Git检查失败，但继续执行...\n');
        }
        
        // 部署到GitHub
        if (deployToGitHub()) {
            showNextSteps();
        } else {
            console.log('❌ 部署失败，请检查错误信息');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ 脚本执行失败:', error.message);
        process.exit(1);
    }
}

main();