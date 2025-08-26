/**
 * GitHub推送脚本 - 小白专用版
 * 将本地代码推送到GitHub，然后自动部署到Vercel
 */

import { execSync } from 'child_process';
import fs from 'fs';

async function pushToGitHub() {
  console.log('📤 拨云见日咖啡屋 - GitHub推送助手\n');
  
  try {
    // 第一步：检查Git状态
    console.log('📋 第一步：检查Git状态...');
    await checkGitStatus();
    
    // 第二步：配置Git（如果需要）
    console.log('\n👤 第二步：检查Git配置...');
    await checkGitConfig();
    
    // 第三步：添加文件并提交
    console.log('\n📝 第三步：准备提交...');
    await prepareCommit();
    
    // 第四步：推送到GitHub
    console.log('\n🚀 第四步：推送到GitHub...');
    await pushToRemote();
    
    // 第五步：验证推送结果
    console.log('\n✅ 第五步：验证结果...');
    await verifyPush();
    
    console.log('\n🎉 推送完成！Vercel会自动开始部署');
    console.log('\n📝 下一步：检查Vercel部署状态');
    
  } catch (error) {
    console.error('\n❌ 推送失败:', error.message);
    console.log('\n🔧 请检查以下几点：');
    console.log('  1. GitHub仓库是否存在');
    console.log('  2. 是否有推送权限');
    console.log('  3. 网络连接是否正常');
  }
}

async function checkGitStatus() {
  try {
    // 检查是否是Git仓库
    const isGitRepo = fs.existsSync('.git');
    
    if (!isGitRepo) {
      console.log('  📁 初始化Git仓库...');
      execSync('git init', { stdio: 'inherit' });
      console.log('  ✅ Git仓库已初始化');
    } else {
      console.log('  ✅ 已是Git仓库');
    }
    
    // 检查Git状态
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log('  📝 发现待提交的文件');
      } else {
        console.log('  ✅ 工作目录干净');
      }
    } catch (error) {
      console.log('  ⚠️ 无法检查Git状态');
    }
    
  } catch (error) {
    throw new Error('Git检查失败：' + error.message);
  }
}

async function checkGitConfig() {
  try {
    // 检查用户配置
    try {
      const userName = execSync('git config user.name', { encoding: 'utf8' }).trim();
      const userEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
      
      console.log(`  ✅ Git用户: ${userName} <${userEmail}>`);
    } catch (error) {
      console.log('  ⚠️ Git用户未配置，请运行以下命令：');
      console.log('     git config --global user.name "你的用户名"');
      console.log('     git config --global user.email "你的邮箱"');
      throw new Error('Git用户配置缺失');
    }
    
    // 检查远程仓库
    try {
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      console.log(`  ✅ 远程仓库: ${remoteUrl}`);
    } catch (error) {
      console.log('  ⚠️ 未配置远程仓库');
      console.log('     请先添加GitHub仓库：');
      console.log('     git remote add origin https://github.com/你的用户名/仓库名.git');
      throw new Error('远程仓库未配置');
    }
    
  } catch (error) {
    throw error;
  }
}

async function prepareCommit() {
  try {
    // 添加所有文件
    console.log('  📁 添加所有文件...');
    execSync('git add .', { stdio: 'inherit' });
    console.log('  ✅ 文件已添加');
    
    // 创建提交信息
    const timestamp = new Date().toLocaleString('zh-CN');
    const commitMessage = `🚀 拨云见日咖啡屋 - 项目部署 ${timestamp}

✅ 咖啡屋网站完整版本
📝 包含文章管理系统
🗄️ MongoDB数据库集成
⚙️ Vercel部署配置

功能特性:
- 响应式咖啡屋主页
- 文章发布和管理系统
- 多语言支持(中英文)
- 管理员后台
- MongoDB云数据库

准备部署到: https://你的域名.vercel.app`;

    // 提交文件
    console.log('  💾 创建提交...');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('  ✅ 提交已创建');
    
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('  ℹ️ 没有需要提交的更改');
    } else {
      throw new Error('提交失败：' + error.message);
    }
  }
}

async function pushToRemote() {
  try {
    console.log('  🌐 推送到GitHub...');
    
    // 设置默认分支为main
    execSync('git branch -M main', { stdio: 'inherit' });
    
    // 推送到远程仓库
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('  ✅ 推送成功！');
    
  } catch (error) {
    throw new Error('推送失败：' + error.message);
  }
}

async function verifyPush() {
  try {
    // 检查最新提交
    const lastCommit = execSync('git log --oneline -1', { encoding: 'utf8' }).trim();
    console.log(`  📝 最新提交: ${lastCommit}`);
    
    // 检查远程状态
    try {
      execSync('git fetch origin', { stdio: 'pipe' });
      console.log('  ✅ 与远程仓库同步');
    } catch (error) {
      console.log('  ⚠️ 无法检查远程状态');
    }
    
    console.log('\n🎯 推送验证完成！');
    console.log('\n📋 接下来：');
    console.log('  1. 访问你的GitHub仓库确认代码已上传');
    console.log('  2. 检查Vercel的部署状态');
    console.log('  3. 配置Vercel的环境变量（如果还没配置）');
    
  } catch (error) {
    console.log('  ⚠️ 验证过程中出现问题，但推送可能已成功');
  }
}

// 如果直接运行这个脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  pushToGitHub().catch(console.error);
}

export { pushToGitHub };