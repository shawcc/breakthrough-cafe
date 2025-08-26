/**
 * 配置文件差异检查工具
 * 帮助分析GitHub和本地配置的差异
 */

import { execSync } from 'child_process';
import fs from 'fs';

async function checkConfigDiff() {
  console.log('🔍 配置文件差异分析工具\n');
  
  console.log('📋 检查重要配置文件的差异...\n');
  
  const configFiles = ['package.json', 'vite.config.ts', 'vercel.json'];
  
  for (const file of configFiles) {
    console.log(`📄 检查文件: ${file}`);
    await analyzeFileDiff(file);
    console.log('');
  }
}

async function analyzeFileDiff(filename) {
  try {
    // 获取GitHub版本
    const gitHubContent = execSync(`git show origin/main:${filename}`, { encoding: 'utf8' });
    
    // 检查本地版本
    if (!fs.existsSync(filename)) {
      console.log('  ❌ 本地文件不存在');
      return;
    }
    
    const localContent = fs.readFileSync(filename, 'utf8');
    
    if (gitHubContent === localContent) {
      console.log('  ✅ 文件完全一致');
    } else {
      console.log('  ⚠️ 文件存在差异');
      
      if (filename === 'package.json') {
        analyzePackageJsonDiff(gitHubContent, localContent);
      } else {
        console.log('  💡 建议手动检查差异');
      }
    }
    
  } catch (error) {
    console.log('  ❌ GitHub上没有此文件或检查失败');
  }
}

function analyzePackageJsonDiff(gitHubContent, localContent) {
  try {
    const gitHubPkg = JSON.parse(gitHubContent);
    const localPkg = JSON.parse(localContent);
    
    // 检查依赖差异
    const gitHubDeps = { ...gitHubPkg.dependencies, ...gitHubPkg.devDependencies };
    const localDeps = { ...localPkg.dependencies, ...localPkg.devDependencies };
    
    const onlyInGitHub = Object.keys(gitHubDeps).filter(dep => !localDeps[dep]);
    const onlyInLocal = Object.keys(localDeps).filter(dep => !gitHubDeps[dep]);
    
    if (onlyInGitHub.length > 0) {
      console.log('  🔒 GitHub独有依赖:', onlyInGitHub.join(', '));
    }
    
    if (onlyInLocal.length > 0) {
      console.log('  🆕 本地新增依赖:', onlyInLocal.join(', '));
    }
    
    // 检查脚本差异
    const gitHubScripts = Object.keys(gitHubPkg.scripts || {});
    const localScripts = Object.keys(localPkg.scripts || {});
    
    if (gitHubScripts.length !== localScripts.length) {
      console.log('  ⚙️ 脚本配置存在差异');
    }
    
  } catch (error) {
    console.log('  ❌ JSON解析失败');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkConfigDiff().catch(console.error);
}

export { checkConfigDiff };