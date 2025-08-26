/**
 * 智能对比和更新脚本
 * 安全地同步AIPA最新代码
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 拨云见日咖啡屋 - 智能代码对比工具\n');

// 需要保护的文件和目录（不要覆盖）
const protectedItems = [
  'server/',
  'vercel.json',
  '.env',
  'DEPLOYMENT_GUIDE.md',
  'DEPLOYMENT_STEPS.md',
  'deploy-to-vercel.js',
  'quick-deploy.js',
  'simple-github-push.js',
  'aipa-structure-sync.js',
  'safe-sync-guide.md',
  'compare-and-update.js',
  'shared/',
  'api/',
  'node_modules/',
  '.git/',
  'package-lock.json'
];

// 前端核心文件（可能需要更新）
const frontendFiles = [
  'App.tsx',
  'types/index.ts',
  'store/languageStore.ts',
  'hooks/useLanguage.ts',
  'data/content.ts',
  'components/',
  'pages/Cases/',
  'pages/Programming/',
  'pages/CaseDetail/',
  'pages/Articles/',
  'pages/ArticleDetail/'
];

async function compareAndUpdate() {
  try {
    console.log('📋 第一步：检查是否有AIPA导出的新文件...\n');
    
    // 查找可能的AIPA导出文件
    const currentDir = process.cwd();
    const files = fs.readdirSync(currentDir);
    
    let aipaZipFile = null;
    let aipaDir = null;
    
    // 查找zip文件
    for (const file of files) {
      if (file.endsWith('.zip') && (file.includes('aipa') || file.includes('project'))) {
        aipaZipFile = file;
        console.log(`  📦 发现AIPA导出文件: ${file}`);
        break;
      }
    }
    
    // 查找解压后的目录
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      if (fs.statSync(fullPath).isDirectory() && 
          (file.includes('aipa') || file.includes('project')) &&
          file !== 'btcafe-project') {
        aipaDir = file;
        console.log(`  📁 发现AIPA解压目录: ${file}`);
        break;
      }
    }
    
    if (!aipaZipFile && !aipaDir) {
      console.log('  ✅ 没有发现新的AIPA文件，当前代码可能已是最新');
      console.log('  💡 建议直接进行GitHub推送\n');
      
      console.log('🚀 推荐下一步操作：');
      console.log('  node simple-github-push.js\n');
      return;
    }
    
    console.log('\n📋 第二步：分析文件差异...\n');
    
    if (aipaZipFile && !aipaDir) {
      console.log('  ⚠️  发现zip文件但未解压');
      console.log('  💡 请先解压zip文件到单独目录，然后重新运行此脚本');
      return;
    }
    
    if (aipaDir) {
      await analyzeDifferences(aipaDir);
    }
    
  } catch (error) {
    console.error('❌ 对比过程出错:', error.message);
    console.log('\n🔧 建议：如果遇到问题，可以直接使用现有代码进行部署');
  }
}

async function analyzeDifferences(aipaDir) {
  console.log(`  🔍 正在分析 ${aipaDir} 目录...\n`);
  
  const currentFiles = [];
  const newFiles = [];
  
  // 扫描当前项目文件
  scanDirectory('.', currentFiles, ['node_modules', '.git', aipaDir]);
  
  // 扫描AIPA导出文件
  scanDirectory(aipaDir, newFiles, ['node_modules', '.git']);
  
  console.log('📊 文件对比结果：\n');
  
  // 分析差异
  const updates = [];
  const newAdditions = [];
  const protectedFiles = [];
  
  for (const newFile of newFiles) {
    const isProtected = protectedItems.some(item => newFile.startsWith(item));
    
    if (isProtected) {
      protectedFiles.push(newFile);
      continue;
    }
    
    if (currentFiles.includes(newFile)) {
      // 文件存在，检查是否需要更新
      if (shouldUpdate(newFile)) {
        updates.push(newFile);
      }
    } else {
      // 新文件
      newAdditions.push(newFile);
    }
  }
  
  // 输出结果
  if (updates.length > 0) {
    console.log('🔄 建议更新的文件:');
    updates.forEach(file => console.log(`  - ${file}`));
    console.log();
  }
  
  if (newAdditions.length > 0) {
    console.log('➕ 新增的文件:');
    newAdditions.forEach(file => console.log(`  - ${file}`));
    console.log();
  }
  
  if (protectedFiles.length > 0) {
    console.log('🛡️ 受保护的文件（不会覆盖）:');
    protectedFiles.forEach(file => console.log(`  - ${file}`));
    console.log();
  }
  
  // 询问用户操作
  console.log('🤔 接下来你想怎么做？');
  console.log('  1. 自动更新建议的文件');
  console.log('  2. 手动检查后决定');
  console.log('  3. 跳过更新，直接部署现有代码');
  console.log('\n💡 对于小白用户，建议选择选项3，直接部署现有代码');
}

function scanDirectory(dir, fileList, excludeDirs = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    if (excludeDirs.includes(item)) continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, fileList, excludeDirs);
    } else {
      // 标准化路径
      const relativePath = path.relative('.', fullPath).replace(/\\/g, '/');
      if (!relativePath.startsWith(dir + '/') && dir !== '.') {
        fileList.push(path.relative(dir, fullPath).replace(/\\/g, '/'));
      } else {
        fileList.push(relativePath);
      }
    }
  }
}

function shouldUpdate(filePath) {
  // 简单的文件更新判断逻辑
  // 主要检查前端相关文件
  const frontendExtensions = ['.tsx', '.ts', '.css', '.json'];
  const ext = path.extname(filePath);
  
  return frontendExtensions.includes(ext) && 
         !filePath.includes('server/') && 
         !filePath.includes('api/');
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  compareAndUpdate().catch(console.error);
}