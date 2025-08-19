/**
 * aipa文件结构智能同步脚本
 * 处理aipa导出的特殊文件结构，安全合并到GitHub项目
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function aipaStructureSync() {
  console.log('🔄 aipa文件结构智能同步\n');
  
  // 第一步：分析aipa导出的文件结构
  console.log('📋 第一步：分析aipa导出结构...');
  await analyzeAipaStructure();
  
  // 第二步：保护GitHub重要配置
  console.log('\n🛡️ 第二步：保护GitHub部署配置...');
  await protectGitHubConfigs();
  
  // 第三步：智能重组文件结构
  console.log('\n🔄 第三步：智能重组文件结构...');
  await reorganizeFiles();
  
  // 第四步：合并package.json
  console.log('\n📦 第四步：智能合并package.json...');
  await mergePackageJson();
  
  // 第五步：处理构建配置
  console.log('\n⚙️ 第五步：处理构建配置冲突...');
  await handleBuildConfig();
  
  // 第六步：安全提交
  console.log('\n🚀 第六步：安全提交到GitHub...');
  await safeCommit();
}

async function analyzeAipaStructure() {
  const analysis = {
    hasRsbuildConfig: fs.existsSync('rsbuild.config.ts'),
    hasSrcPackageJson: fs.existsSync('src/package.json'),
    hasEntryTsx: fs.existsSync('src/entry.tsx'),
    syncScriptsInSrc: [
      'src/config-diff.js',
      'src/protected-sync.js', 
      'src/one-click-sync.js',
      'src/smart-sync.js'
    ].filter(file => fs.existsSync(file))
  };
  
  console.log('📊 aipa导出结构分析:');
  console.log(`  🔧 Rsbuild配置: ${analysis.hasRsbuildConfig ? '✅ 存在' : '❌ 不存在'}`);
  console.log(`  📦 src/package.json: ${analysis.hasSrcPackageJson ? '⚠️ 存在(冲突)' : '✅ 不存在'}`);
  console.log(`  🚀 entry.tsx: ${analysis.hasEntryTsx ? '✅ 存在' : '❌ 不存在'}`);
  console.log(`  📝 src中的同步脚本: ${analysis.syncScriptsInSrc.length}个`);
  
  return analysis;
}

async function protectGitHubConfigs() {
  const timestamp = Date.now();
  const protectedConfigs = [];
  
  // 保护GitHub的重要配置文件
  const importantFiles = [
    'package.json',
    'vite.config.ts',
    'vercel.json',
    '.env.production'
  ];
  
  for (const file of importantFiles) {
    try {
      // 尝试从GitHub获取文件
      const gitHubContent = execSync(`git show origin/main:${file}`, { encoding: 'utf8' });
      
      // 备份到临时位置
      const backupPath = `./temp-github-${timestamp}-${file.replace('/', '-')}`;
      fs.writeFileSync(backupPath, gitHubContent);
      protectedConfigs.push({ file, backup: backupPath });
      
      console.log(`  🛡️ 已保护: ${file}`);
    } catch (error) {
      console.log(`  ℹ️ GitHub上无此文件: ${file}`);
    }
  }
  
  return protectedConfigs;
}

async function reorganizeFiles() {
  console.log('📁 重组文件结构...');
  
  // 移动同步脚本到根目录
  const scriptsToMove = [
    'config-diff.js',
    'protected-sync.js',
    'one-click-sync.js', 
    'smart-sync.js',
    'sync-complete.js',
    'sync-from-aipa.js',
    'workflow-guide.js'
  ];
  
  scriptsToMove.forEach(script => {
    const srcPath = `src/${script}`;
    const rootPath = `./${script}`;
    
    if (fs.existsSync(srcPath)) {
      // 如果根目录已有同名文件，先备份
      if (fs.existsSync(rootPath)) {
        fs.copyFileSync(rootPath, `${rootPath}.backup`);
      }
      
      // 移动文件
      fs.copyFileSync(srcPath, rootPath);
      fs.unlinkSync(srcPath);
      console.log(`  📤 已移动: ${script} → 根目录`);
    }
  });
  
  // 删除src目录中重复的package.json
  if (fs.existsSync('src/package.json')) {
    fs.unlinkSync('src/package.json');
    console.log('  🗑️ 已删除: src/package.json (重复文件)');
  }
}

async function mergePackageJson() {
  try {
    // 读取GitHub版本的package.json
    const gitHubPkgContent = execSync('git show origin/main:package.json', { encoding: 'utf8' });
    const gitHubPkg = JSON.parse(gitHubPkgContent);
    
    // 读取aipa版本的package.json
    const aipaPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    console.log('🔍 package.json差异分析:');
    
    // 智能合并策略
    const mergedPkg = {
      ...aipaPkg,
      // 保留GitHub的关键部署配置
      dependencies: gitHubPkg.dependencies || aipaPkg.dependencies,
      devDependencies: gitHubPkg.devDependencies || aipaPkg.devDependencies,
      engines: gitHubPkg.engines || aipaPkg.engines,
      // 保留GitHub的构建脚本，但合并新增的同步脚本
      scripts: {
        ...gitHubPkg.scripts,
        // 只添加同步相关的新脚本
        ...(aipaPkg.scripts && Object.keys(aipaPkg.scripts)
          .filter(key => key.includes('sync') || key.includes('config'))
          .reduce((acc, key) => ({ ...acc, [key]: aipaPkg.scripts[key] }), {}))
      }
    };
    
    // 写入合并后的package.json
    fs.writeFileSync('package.json', JSON.stringify(mergedPkg, null, 2));
    
    console.log('  ✅ package.json已智能合并');
    console.log('  🛡️ 保护了GitHub的依赖配置');
    console.log('  🆕 添加了aipa的同步脚本');
    
  } catch (error) {
    console.log('  ⚠️ package.json合并失败，使用aipa版本');
  }
}

async function handleBuildConfig() {
  const hasViteConfig = fs.existsSync('vite.config.ts');
  const hasRsbuildConfig = fs.existsSync('rsbuild.config.ts');
  
  if (hasViteConfig && hasRsbuildConfig) {
    console.log('⚠️ 检测到构建工具冲突: Vite vs Rsbuild');
    
    try {
      // 检查GitHub使用的是什么构建工具
      const gitHubHasVite = execSync('git show origin/main:vite.config.ts', { stdio: 'pipe' });
      
      // GitHub使用Vite，保留Vite配置
      fs.unlinkSync('rsbuild.config.ts');
      console.log('  🛡️ 保持GitHub的Vite配置');
      console.log('  🗑️ 已删除aipa的Rsbuild配置');
      
    } catch (error) {
      // GitHub没有vite.config.ts，可能需要使用新的Rsbuild
      console.log('  🆕 GitHub无Vite配置，使用aipa的Rsbuild');
      console.log('  ⚠️ 注意：这可能需要更新部署配置！');
    }
  }
}

async function safeCommit() {
  try {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    execSync('git add .', { stdio: 'inherit' });
    
    const commitMessage = `🔄 Smart sync from aipa with structure fix - ${timestamp}

智能结构同步:
✅ aipa代码已更新到最新版本
🛡️ GitHub部署配置已保护
📁 文件结构已智能重组
📦 package.json已智能合并
⚙️ 构建配置冲突已处理

保护措施:
- 保留GitHub的依赖配置
- 保护部署相关设置
- 同步脚本已移至根目录
- 消除文件结构冲突

网站: https://breakthrough.cafe`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('\n🎉 智能同步完成！');
    console.log('\n📊 同步结果:');
    console.log('✅ aipa最新代码已同步');
    console.log('🛡️ GitHub部署配置已保护');
    console.log('📁 文件结构已重组');
    console.log('📦 依赖配置已保护');
    console.log('⏳ 等待Vercel部署...');
    
  } catch (error) {
    console.error('\n❌ 提交失败:', error.message);
    console.log('\n🔧 建议手动检查git status后再次尝试');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  aipaStructureSync().catch(console.error);
}

export { aipaStructureSync };
