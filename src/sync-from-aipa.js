/**
 * 从aipa平台导入代码到本地的标准化脚本
 * 第一步：aipa → 本地
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function syncFromAipa() {
  console.log('🎯 开始从aipa平台同步代码到本地...\n');
  
  // 1. 备份当前本地代码
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `./backups/local-backup-${timestamp}`;
  
  console.log('💾 备份当前本地代码...');
  if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups', { recursive: true });
  }
  
  // 备份关键文件和目录
  const filesToBackup = [
    'src',
    'components', 
    'pages',
    'hooks',
    'data',
    'App.tsx',
    'index.tsx',
    'index.css',
    'package.json',
    'vite.config.ts',
    'tailwind.config.js'
  ];
  
  fs.mkdirSync(backupDir, { recursive: true });
  
  filesToBackup.forEach(item => {
    const sourcePath = `./${item}`;
    const targetPath = `${backupDir}/${item}`;
    
    if (fs.existsSync(sourcePath)) {
      try {
        const stats = fs.statSync(sourcePath);
        if (stats.isDirectory()) {
          execSync(`cp -r "${sourcePath}" "${targetPath}"`, { stdio: 'pipe' });
        } else {
          fs.copyFileSync(sourcePath, targetPath);
        }
        console.log(`  ✅ 已备份: ${item}`);
      } catch (error) {
        console.log(`  ⚠️ 备份失败: ${item} - ${error.message}`);
      }
    }
  });
  
  console.log(`✅ 本地代码已备份到: ${backupDir}\n`);
  
  // 2. 指导用户从aipa导出代码
  console.log('📋 从aipa平台导出代码的步骤:\n');
  console.log('1. 🌐 打开aipa编辑器页面');
  console.log('2. 📁 找到"导出"或"Export"功能');
  console.log('   - 通常在顶部菜单栏');
  console.log('   - 或者右上角的"⋯"菜单中');
  console.log('   - 可能叫"Download"、"Export Project"等');
  console.log('3. 📦 选择导出整个项目');
  console.log('4. 💾 下载ZIP文件到本地');
  console.log('5. 📂 解压到当前项目目录，覆盖现有文件\n');
  
  console.log('⚠️ 重要提示:');
  console.log('- 确保导出的是最新的aipa代码');
  console.log('- 解压时选择"覆盖现有文件"');
  console.log('- 保留.git目录，不要覆盖Git配置\n');
  
  // 3. 等待用户确认
  console.log('❓ 请完成上述步骤后，按任意键继续...');
  console.log('   或者按 Ctrl+C 取消操作');
  
  // 在实际使用中，这里可以等待用户输入
  // process.stdin.setRawMode(true);
  // process.stdin.resume();
  // await new Promise(resolve => process.stdin.once('data', resolve));
  
  console.log('\n🔄 继续执行后续同步步骤...');
  console.log('运行以下命令完成完整同步:\n');
  console.log('npm run sync:to-github  # 同步到GitHub');
  console.log('或者:');
  console.log('node safe-sync.js       # 安全同步到GitHub\n');
  
  // 4. 检查代码变更
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
      console.log('✅ 检测到代码变更，准备同步到GitHub');
      console.log('\n变更文件:');
      console.log(gitStatus);
    } else {
      console.log('ℹ️ 未检测到代码变更');
    }
  } catch (error) {
    console.log('⚠️ 无法检查Git状态:', error.message);
  }
  
  console.log('\n📝 同步流程状态:');
  console.log('✅ 第一步: aipa → 本地 (请手动完成)');
  console.log('⏳ 第二步: 本地 → GitHub (运行后续脚本)');
  console.log('⏳ 第三步: GitHub → Vercel (自动触发)\n');
  
  console.log('🎯 下一步: 运行 npm run sync:to-github');
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  syncFromAipa().catch(console.error);
}

export { syncFromAipa };
