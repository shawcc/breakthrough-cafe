import { execSync } from 'child_process';

console.log('🔄 开始强制同步最新代码...\n');

try {
  // 1. 检查当前状态
  console.log('📋 检查当前Git状态...');
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('📦 发现未提交的更改，正在添加...');
    } else {
      console.log('✅ 没有未提交的更改');
    }
  } catch (error) {
    console.log('⚠️ Git状态检查失败，继续执行...');
  }

  // 2. 添加所有文件
  console.log('📦 添加所有文件...');
  execSync('git add .', { stdio: 'inherit' });

  // 3. 创建提交
  const timestamp = new Date().toISOString();
  const message = `🔄 Sync from local at ${timestamp}

强制同步最新代码
- 解决版本不一致问题
- 确保最新代码部署到生产环境`;

  console.log('💾 创建提交...');
  try {
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  } catch (error) {
    console.log('📝 没有变化，创建空提交...');
    execSync(`git commit --allow-empty -m "${message}"`, { stdio: 'inherit' });
  }

  // 4. 推送到远程
  console.log('📤 推送到GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('\n✅ 同步完成！');
  console.log('⏳ 等待 Vercel 重新部署...');
  console.log('🌐 几分钟后访问: https://breakthrough.cafe');
  console.log('💡 记得清除浏览器缓存 (Ctrl+Shift+R)');

} catch (error) {
  console.error('❌ 同步失败:', error.message);
  
  console.log('\n🛠️ 手动操作建议:');
  console.log('1. 检查Git配置: git config --list');
  console.log('2. 检查远程仓库: git remote -v');
  console.log('3. 手动推送: git push origin main --force');
}
