/**
 * 一键式同步脚本 - 最大化简化操作流程
 */

import { execSync } from 'child_process';
import fs from 'fs';

async function oneClickSync() {
  console.log('🚀 一键式同步 - 最简化操作流程\n');
  
  console.log('📋 当前流程: aipa平台 → 本地环境 → GitHub仓库\n');
  
  // 第一步：检查是否有新代码
  console.log('🔍 第一步：检查是否有新的aipa代码...');
  
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  
  if (!gitStatus) {
    console.log('❌ 未检测到代码变更');
    console.log('\n📝 请先完成以下操作:');
    console.log('1. 🎯 在aipa平台完成代码修改');
    console.log('2. 📥 从aipa平台导出项目(ZIP文件)');
    console.log('3. 📂 解压到当前目录，覆盖现有文件');
    console.log('4. 🔄 重新运行本脚本\n');
    
    console.log('💡 导出提示:');
    console.log('- aipa编辑器 → 右上角菜单 → "导出项目"');
    console.log('- 下载ZIP → 解压到项目根目录');
    console.log('- 确保覆盖所有文件(保留.git目录)\n');
    
    return;
  }
  
  console.log('✅ 检测到代码变更！');
  console.log('变更文件:');
  console.log(gitStatus);
  
  // 第二步：一键推送到GitHub
  console.log('\n🚀 第二步：一键推送到GitHub...');
  
  try {
    // 显示即将提交的内容摘要
    console.log('\n📊 变更摘要:');
    try {
      const diffStat = execSync('git diff --stat', { encoding: 'utf8' });
      console.log(diffStat);
    } catch (e) {
      console.log('无法获取变更统计');
    }
    
    // 执行同步
    execSync('git add .', { stdio: 'inherit' });
    
    const timestamp = new Date().toLocaleString('zh-CN');
    const commitMessage = `🔄 Sync from aipa platform - ${timestamp}

快速同步流程:
✅ aipa平台代码已导出并覆盖本地
✅ 一键推送到GitHub仓库
⏳ 等待Vercel自动部署

网站: https://breakthrough.cafe`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('\n🎉 同步完成！');
    console.log('\n📊 状态更新:');
    console.log('✅ aipa平台 → 本地环境');
    console.log('✅ 本地环境 → GitHub仓库');
    console.log('⏳ GitHub仓库 → Vercel部署 (3-5分钟)');
    
    console.log('\n🌐 部署信息:');
    console.log(`- 🚀 网站: https://breakthrough.cafe`);
    console.log(`- 📝 提交时间: ${timestamp}`);
    console.log(`- ⏰ 预计完成: ${new Date(Date.now() + 5*60*1000).toLocaleString('zh-CN')}`);
    
    console.log('\n✨ 下次使用:');
    console.log('1. 在aipa修改代码');
    console.log('2. 导出ZIP到本地');
    console.log('3. 运行 npm run sync (本脚本)');
    
  } catch (error) {
    console.error('\n❌ 同步失败:', error.message);
    
    if (error.message.includes('non-fast-forward')) {
      console.log('\n🔧 自动尝试强制推送...');
      try {
        execSync('git push origin main --force', { stdio: 'inherit' });
        console.log('✅ 强制推送成功！');
      } catch (forceError) {
        console.log('❌ 强制推送也失败，请手动处理');
      }
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  oneClickSync().catch(console.error);
}

export { oneClickSync };
