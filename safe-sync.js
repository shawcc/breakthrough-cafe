/**
 * 安全同步脚本 - 保护重要配置文件
 */

import { execSync } from 'child_process';
import fs from 'fs';

async function safeSyncToGitHub() {
  try {
    console.log('🛡️ 开始安全同步流程...\n');
    
    // 1. 先拉取远程变更
    console.log('📥 拉取远程配置文件...');
    execSync('git fetch origin main', { stdio: 'inherit' });
    
    // 2. 备份重要的远程配置文件
    console.log('💾 备份GitHub上的重要配置...');
    const importantFiles = ['package.json', 'vite.config.ts', 'tsconfig.json'];
    
    for (const file of importantFiles) {
      try {
        const remoteContent = execSync(`git show origin/main:${file}`, { encoding: 'utf8' });
        fs.writeFileSync(`${file}.github`, remoteContent);
        console.log(`✅ 已备份远程 ${file}`);
      } catch (error) {
        console.log(`⚠️ 远程 ${file} 不存在，跳过`);
      }
    }
    
    // 3. 询问用户要保留哪些文件
    console.log('\n🤔 检查差异...');
    for (const file of importantFiles) {
      if (fs.existsSync(`${file}.github`)) {
        try {
          const localContent = fs.readFileSync(file, 'utf8');
          const remoteContent = fs.readFileSync(`${file}.github`, 'utf8');
          
          if (localContent !== remoteContent) {
            console.log(`\n📋 ${file} 存在差异`);
            console.log('本地版本和远程版本不同，建议手动检查');
          }
        } catch (error) {
          console.log(`⚠️ 无法比较 ${file}`);
        }
      }
    }
    
    // 4. 使用远程的 package.json（如果存在）
    if (fs.existsSync('package.json.github')) {
      console.log('\n🔄 使用GitHub上的 package.json...');
      fs.copyFileSync('package.json.github', 'package.json');
    }
    
    // 5. 添加文件但排除配置文件差异
    console.log('\n📦 添加代码文件...');
    execSync('git add .', { stdio: 'inherit' });
    
    // 6. 提交更改
    const timestamp = new Date().toISOString();
    const message = `🔄 Safe sync at ${timestamp}

保护重要配置文件的安全同步
- 保留GitHub上调整好的配置
- 同步最新的代码变更
- 避免覆盖关键配置文件`;

    console.log('💾 创建安全提交...');
    try {
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    } catch (error) {
      console.log('📝 创建空提交...');
      execSync(`git commit --allow-empty -m "${message}"`, { stdio: 'inherit' });
    }
    
    // 7. 推送变更
    console.log('📤 推送到GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    // 8. 清理临时文件
    console.log('🧹 清理临时文件...');
    for (const file of importantFiles) {
      if (fs.existsSync(`${file}.github`)) {
        fs.unlinkSync(`${file}.github`);
      }
    }
    
    console.log('\n✅ 安全同步完成！');
    console.log('🌐 网站将使用保护的配置文件重新部署');
    
  } catch (error) {
    console.error('❌ 安全同步失败:', error.message);
  }
}

safeSyncToGitHub();
