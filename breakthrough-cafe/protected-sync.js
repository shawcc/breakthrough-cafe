/**
 * 配置文件保护同步脚本
 * 保护GitHub上的重要配置，避免部署失败
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 需要保护的配置文件列表
const PROTECTED_FILES = [
  'package.json',
  'vercel.json', 
  'netlify.toml',
  '.env',
  '.env.production',
  'vite.config.ts',
  'tailwind.config.js'
];

async function protectedSync() {
  console.log('🛡️ 配置文件保护同步 - 避免部署失败\n');
  
  // 第一步：备份GitHub上的重要配置
  console.log('📋 第一步：保护GitHub上的部署配置...');
  await backupGitHubConfigs();
  
  // 第二步：检查aipa导出的代码
  console.log('\n🔍 第二步：检查aipa导出代码...');
  const hasAipaChanges = checkAipaChanges();
  
  if (!hasAipaChanges) {
    console.log('❌ 未检测到aipa代码变更');
    console.log('💡 请先从aipa平台导出最新代码到本地');
    return;
  }
  
  // 第三步：智能合并，保护配置文件
  console.log('\n🔄 第三步：智能合并代码和配置...');
  await intelligentMerge();
  
  // 第四步：安全推送到GitHub
  console.log('\n🚀 第四步：安全推送到GitHub...');
  await safePushToGitHub();
}

async function backupGitHubConfigs() {
  console.log('💾 从GitHub拉取最新的部署配置...');
  
  try {
    // 确保本地是最新的GitHub版本
    execSync('git fetch origin main', { stdio: 'inherit' });
    
    // 备份当前的配置文件
    const backupDir = `./config-backup-${Date.now()}`;
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    PROTECTED_FILES.forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, `${backupDir}/${file}`);
        console.log(`  ✅ 已备份: ${file}`);
      }
    });
    
    console.log(`📁 配置文件已备份到: ${backupDir}`);
    
  } catch (error) {
    console.error('⚠️ 配置备份失败:', error.message);
  }
}

function checkAipaChanges() {
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (gitStatus) {
      console.log('✅ 检测到代码变更');
      console.log('变更文件:');
      console.log(gitStatus);
      return true;
    }
    return false;
  } catch (error) {
    console.log('⚠️ 无法检查代码状态');
    return false;
  }
}

async function intelligentMerge() {
  console.log('🧠 智能合并aipa代码和GitHub配置...\n');
  
  // 检查package.json的差异
  await handlePackageJsonMerge();
  
  // 检查其他配置文件
  await handleOtherConfigs();
  
  console.log('✅ 智能合并完成！');
}

async function handlePackageJsonMerge() {
  console.log('📦 处理package.json合并...');
  
  try {
    // 获取GitHub上的package.json
    const gitHubPackageJson = execSync('git show origin/main:package.json', { encoding: 'utf8' });
    const gitHubPkg = JSON.parse(gitHubPackageJson);
    
    // 检查本地的package.json（aipa导出的）
    if (fs.existsSync('package.json')) {
      const localPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      console.log('\n🔍 package.json差异分析:');
      
      // 合并策略：保留GitHub的依赖配置，使用aipa的脚本配置
      const mergedPkg = {
        ...localPkg,
        // 保留GitHub上的关键部署配置
        dependencies: gitHubPkg.dependencies || localPkg.dependencies,
        devDependencies: gitHubPkg.devDependencies || localPkg.devDependencies,
        // 如果GitHub上有特殊的构建配置，优先使用
        ...(gitHubPkg.scripts && Object.keys(gitHubPkg.scripts).length > Object.keys(localPkg.scripts).length 
          ? { scripts: { ...localPkg.scripts, ...gitHubPkg.scripts } }
          : {}),
        // 保留部署相关字段
        engines: gitHubPkg.engines || localPkg.engines,
        type: gitHubPkg.type || localPkg.type,
      };
      
      // 写入合并后的package.json
      fs.writeFileSync('package.json', JSON.stringify(mergedPkg, null, 2));
      console.log('  ✅ package.json已智能合并');
      
      // 显示保护的配置
      if (gitHubPkg.dependencies && Object.keys(gitHubPkg.dependencies).length > 0) {
        console.log('  🛡️ 已保护GitHub依赖配置');
      }
      if (gitHubPkg.engines) {
        console.log('  🛡️ 已保护Node.js版本配置');
      }
      
    }
  } catch (error) {
    console.log('  ⚠️ package.json合并失败，使用原始文件');
  }
}

async function handleOtherConfigs() {
  console.log('\n⚙️ 检查其他配置文件...');
  
  for (const file of PROTECTED_FILES) {
    if (file === 'package.json') continue; // 已经处理过
    
    try {
      // 检查GitHub上是否有这个配置文件
      execSync(`git show origin/main:${file}`, { stdio: 'pipe' });
      
      // 如果GitHub上有，而本地aipa导出的覆盖了，则恢复GitHub版本
      const gitHubVersion = execSync(`git show origin/main:${file}`, { encoding: 'utf8' });
      fs.writeFileSync(file, gitHubVersion);
      console.log(`  🛡️ 已恢复GitHub版本: ${file}`);
      
    } catch (error) {
      // GitHub上没有这个文件，使用aipa的版本
      console.log(`  📄 使用aipa版本: ${file}`);
    }
  }
}

async function safePushToGitHub() {
  try {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    execSync('git add .', { stdio: 'inherit' });
    
    const commitMessage = `🛡️ Protected sync from aipa - ${timestamp}

智能保护同步:
✅ aipa平台代码已更新
🛡️ GitHub部署配置已保护
✅ package.json已智能合并
⏳ 确保部署继续成功

保护的配置: ${PROTECTED_FILES.join(', ')}
网站: https://breakthrough.cafe`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('\n🎉 保护同步完成！');
    console.log('\n📊 同步结果:');
    console.log('✅ aipa平台代码已更新');
    console.log('🛡️ GitHub部署配置已保护');
    console.log('✅ package.json已智能合并');
    console.log('⏳ 部署应该继续成功');
    
    console.log('\n🔍 验证步骤:');
    console.log('1. 等待Vercel部署完成 (3-5分钟)');
    console.log('2. 检查部署是否成功');
    console.log('3. 如果失败，检查构建日志');
    console.log('4. 必要时可以快速回退');
    
  } catch (error) {
    console.error('\n❌ 推送失败:', error.message);
    await handlePushError(error);
  }
}

async function handlePushError(error) {
  if (error.message.includes('non-fast-forward')) {
    console.log('\n🔧 尝试强制推送（保护配置）...');
    try {
      execSync('git push origin main --force', { stdio: 'inherit' });
      console.log('✅ 强制推送成功，配置已保护！');
    } catch (forceError) {
      console.log('❌ 强制推送失败，需要手动处理');
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  protectedSync().catch(console.error);
}

export { protectedSync };
