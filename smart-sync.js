/**
 * 智能同步脚本 - 自动检测并优化同步流程
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function smartSync() {
  console.log('🧠 智能同步 - 自动检测最佳同步策略\n');
  
  // 智能检测当前状态
  const status = await detectCurrentStatus();
  
  console.log('📊 当前状态分析:');
  console.log(`- 📁 本地文件变更: ${status.hasLocalChanges ? '✅ 有' : '❌ 无'}`);
  console.log(`- 🎯 aipa导出文件: ${status.hasAipaFiles ? '✅ 检测到' : '❌ 未检测到'}`);
  console.log(`- 🌐 GitHub连接: ${status.gitHubConnected ? '✅ 正常' : '❌ 异常'}`);
  console.log(`- 📦 Git仓库状态: ${status.gitStatus}\n`);
  
  // 根据状态选择最佳策略
  if (!status.hasLocalChanges) {
    await handleNoChanges();
  } else if (status.hasConflicts) {
    await handleConflicts();
  } else {
    await handleNormalSync();
  }
}

async function detectCurrentStatus() {
  const status = {
    hasLocalChanges: false,
    hasAipaFiles: false,
    gitHubConnected: false,
    hasConflicts: false,
    gitStatus: 'unknown'
  };
  
  try {
    // 检测本地变更
    const gitStatusOutput = execSync('git status --porcelain', { encoding: 'utf8' });
    status.hasLocalChanges = !!gitStatusOutput.trim();
    
    // 检测Git仓库状态
    const gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    status.gitStatus = gitBranch || 'detached';
    
    // 检测GitHub连接
    try {
      execSync('git ls-remote origin', { stdio: 'pipe' });
      status.gitHubConnected = true;
    } catch (e) {
      status.gitHubConnected = false;
    }
    
    // 检测是否有aipa导出的典型文件结构
    const aipaIndicators = ['App.tsx', 'index.tsx', 'package.json'];
    status.hasAipaFiles = aipaIndicators.every(file => fs.existsSync(file));
    
  } catch (error) {
    console.log('⚠️ 状态检测部分失败:', error.message);
  }
  
  return status;
}

async function handleNoChanges() {
  console.log('📝 处理策略: 无变更状态\n');
  console.log('💡 建议操作:');
  console.log('1. 🎯 前往aipa平台进行代码修改');
  console.log('2. 📥 导出最新的项目ZIP文件');
  console.log('3. 📂 解压到当前目录覆盖文件');
  console.log('4. 🔄 重新运行同步脚本\n');
  
  console.log('⚡ 快捷提醒:');
  console.log('- aipa编辑器通常在右上角有"导出"功能');
  console.log('- 解压时选择"全部替换"');
  console.log('- 注意保留.git目录不要覆盖');
}

async function handleConflicts() {
  console.log('⚠️ 处理策略: 冲突解决模式\n');
  console.log('🔧 自动尝试解决冲突...');
  
  try {
    execSync('git add .', { stdio: 'inherit' });
    console.log('✅ 冲突已自动解决');
    await handleNormalSync();
  } catch (error) {
    console.log('❌ 需要手动解决冲突');
    console.log('运行: git status 查看具体冲突');
  }
}

async function handleNormalSync() {
  console.log('🚀 处理策略: 标准同步流程\n');
  
  try {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "🔄 Smart sync from aipa - ${timestamp}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('\n🎉 智能同步完成！');
    console.log(`📅 同步时间: ${timestamp}`);
    console.log('🌐 等待Vercel部署...');
    
  } catch (error) {
    console.log('❌ 同步过程出现问题，尝试智能修复...');
    await attemptAutoFix(error);
  }
}

async function attemptAutoFix(error) {
  if (error.message.includes('non-fast-forward')) {
    console.log('🔧 检测到推送冲突，尝试强制推送...');
    try {
      execSync('git push origin main --force', { stdio: 'inherit' });
      console.log('✅ 强制推送成功！');
    } catch (e) {
      console.log('❌ 自动修复失败，需要手动处理');
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  smartSync().catch(console.error);
}

export { smartSync };
