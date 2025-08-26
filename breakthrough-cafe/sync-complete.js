/**
 * 完整的三环境同步脚本
 * aipa → 本地 → GitHub → Vercel
 */

import { execSync } from 'child_process';
import fs from 'fs';

async function completeSync() {
  console.log('🚀 完整三环境同步流程\n');
  console.log('📋 同步路径: aipa平台 → 本地环境 → GitHub仓库 → Vercel部署\n');
  
  // 检查Git状态
  let hasChanges = false;
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    hasChanges = !!gitStatus;
    
    if (hasChanges) {
      console.log('✅ 检测到代码变更');
      console.log('变更文件:');
      console.log(gitStatus);
    } else {
      console.log('❌ 未检测到代码变更');
      console.log('💡 请确保已从aipa平台导出最新代码到本地');
      return;
    }
  } catch (error) {
    console.log('⚠️ Git状态检查失败:', error.message);
    return;
  }
  
  console.log('\n🔄 开始同步到GitHub...');
  
  try {
    // 1. 添加所有变更
    console.log('📦 添加代码变更...');
    execSync('git add .', { stdio: 'inherit' });
    
    // 2. 创建提交
    const timestamp = new Date().toISOString();
    const commitMessage = `🔄 Complete sync from aipa platform at ${timestamp}

三环境同步流程:
✅ aipa平台 → 本地环境 (手动导出完成)
✅ 本地环境 → GitHub仓库 (当前提交)
⏳ GitHub仓库 → Vercel部署 (自动触发)

同步内容: 最新aipa平台代码
目标网站: https://breakthrough.cafe`;

    console.log('💾 创建同步提交...');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // 3. 推送到GitHub
    console.log('📤 推送到GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('\n✅ 同步完成！');
    console.log('\n📊 同步状态:');
    console.log('✅ aipa平台 → 本地环境');
    console.log('✅ 本地环境 → GitHub仓库');
    console.log('⏳ GitHub仓库 → Vercel部署 (进行中...)');
    
    console.log('\n🌐 部署信息:');
    console.log('- 🔗 GitHub仓库: https://github.com/shawcc/breakthrough-cafe');
    console.log('- 🚀 目标网站: https://breakthrough.cafe');
    console.log('- ⏱️ 预计部署时间: 3-5分钟');
    
    console.log('\n📝 验证步骤:');
    console.log('1. 等待3-5分钟让Vercel完成部署');
    console.log('2. 清除浏览器缓存 (Ctrl+Shift+R 或 Cmd+Shift+R)');
    console.log('3. 访问 https://breakthrough.cafe 确认更新');
    
  } catch (error) {
    console.error('\n❌ 同步失败:', error.message);
    
    if (error.message.includes('non-fast-forward')) {
      console.log('\n🔧 解决方案: 可能需要强制推送');
      console.log('运行: git push origin main --force');
    }
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  completeSync().catch(console.error);
}

export { completeSync };
