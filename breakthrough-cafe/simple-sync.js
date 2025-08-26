#!/usr/bin/env node

/**
 * 🚀 简化版AIPA同步脚本 - 直接可用版本
 * 
 * 使用场景：AIPA项目有更新时，运行此脚本完成同步
 * 流程：AIPA导出 → 本地处理 → GitHub推送 → Vercel自动部署
 * 
 * 使用方法：
 * 1. 从AIPA导出zip包到本地项目目录
 * 2. 运行: node simple-sync.js
 * 3. 按照提示操作
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 AIPA项目同步工具启动...\n');
console.log('📋 当前目录:', process.cwd());

// 检查基本环境
function checkEnvironment() {
  console.log('🔍 步骤1: 环境检查');
  
  // 检查Git状态
  try {
    execSync('git status', { stdio: 'pipe' });
    console.log('✅ Git仓库状态正常');
  } catch (error) {
    console.log('❌ 错误：当前目录不是Git仓库');
    console.log('💡 请确保在正确的项目目录下运行此脚本');
    process.exit(1);
  }
  
  // 查找AIPA导出的zip文件
  const files = fs.readdirSync('.');
  const zipFiles = files.filter(file => file.endsWith('.zip'));
  
  if (zipFiles.length === 0) {
    console.log('❌ 未找到zip文件');
    console.log('💡 请确保从AIPA导出的项目zip包在当前目录中');
    console.log('📁 当前目录文件:');
    files.forEach(file => {
      if (!file.startsWith('.')) {
        console.log(`   - ${file}`);
      }
    });
    console.log('\n🔄 请按以下步骤操作：');
    console.log('1. 在AIPA中点击"导出项目"');
    console.log('2. 下载zip包到当前目录');
    console.log('3. 重新运行此脚本');
    process.exit(1);
  }
  
  console.log(`📦 找到zip文件: ${zipFiles[0]}`);
  return zipFiles[0];
}

// 备份重要文件
function backupImportantFiles() {
  console.log('\n💾 步骤2: 备份重要配置');
  
  const backupDir = 'backup-' + Date.now();
  fs.mkdirSync(backupDir);
  
  const importantFiles = ['.env', 'vercel.json'];
  const backedFiles = [];
  
  importantFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(backupDir, file));
      backedFiles.push(file);
      console.log(`✅ 已备份: ${file}`);
    }
  });
  
  if (backedFiles.length === 0) {
    console.log('⚠️  没有找到需要备份的配置文件');
  }
  
  return { backupDir, backedFiles };
}

// 处理zip文件
function processZipFile(zipFile) {
  console.log('\n📦 步骤3: 处理AIPA代码');
  
  const tempDir = 'temp-extract-' + Date.now();
  fs.mkdirSync(tempDir);
  
  console.log('📂 正在解压文件...');
  try {
    if (process.platform === 'win32') {
      // Windows
      execSync(`powershell Expand-Archive "${zipFile}" "${tempDir}"`, { stdio: 'pipe' });
    } else {
      // macOS/Linux
      execSync(`unzip -q "${zipFile}" -d "${tempDir}"`, { stdio: 'pipe' });
    }
    console.log('✅ 解压完成');
  } catch (error) {
    console.log('❌ 解压失败:', error.message);
    process.exit(1);
  }
  
  return tempDir;
}

// 修复目录结构
function fixDirectoryStructure(tempDir) {
  console.log('\n🔧 步骤4: 修复目录结构');
  
  // 查找实际的代码目录
  function findCodeDir(dir) {
    const items = fs.readdirSync(dir);
    
    // 检查是否包含关键文件
    if (items.includes('App.tsx') || items.includes('src') || items.includes('components')) {
      return dir;
    }
    
    // 递归查找
    for (const item of items) {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isDirectory() && !item.startsWith('.')) {
        const result = findCodeDir(itemPath);
        if (result) return result;
      }
    }
    
    return null;
  }
  
  const codeDir = findCodeDir(tempDir);
  if (!codeDir) {
    console.log('❌ 无法找到有效的代码目录');
    process.exit(1);
  }
  
  console.log(`📁 找到代码目录: ${path.relative('.', codeDir)}`);
  
  // 检查是否有src目录需要处理
  const srcDir = path.join(codeDir, 'src');
  if (fs.existsSync(srcDir)) {
    console.log('🔄 处理src目录结构...');
    
    const srcItems = fs.readdirSync(srcDir);
    srcItems.forEach(item => {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(codeDir, item);
      
      if (fs.existsSync(destPath)) {
        if (fs.statSync(destPath).isDirectory()) {
          execSync(`rm -rf "${destPath}"`, { stdio: 'pipe' });
        } else {
          fs.unlinkSync(destPath);
        }
      }
      
      execSync(`mv "${srcPath}" "${destPath}"`, { stdio: 'pipe' });
    });
    
    // 删除空的src目录
    fs.rmdirSync(srcDir);
    console.log('✅ 目录结构修复完成');
  }
  
  return codeDir;
}

// 同步代码文件
function syncCodeFiles(codeDir, backup) {
  console.log('\n🔗 步骤5: 同步代码文件');
  
  // 需要保护的文件和目录
  const protectedItems = [
    '.git',
    '.env',
    'vercel.json',
    'node_modules',
    backup.backupDir,
    'temp-extract-'
  ];
  
  // 获取所有文件
  function getAllFiles(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    let files = [];
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = prefix ? path.join(prefix, item) : item;
      
      if (fs.statSync(fullPath).isDirectory()) {
        files = files.concat(getAllFiles(fullPath, relativePath));
      } else {
        files.push(relativePath);
      }
    });
    
    return files;
  }
  
  const allFiles = getAllFiles(codeDir);
  
  // 过滤受保护的文件
  const filesToSync = allFiles.filter(file => {
    return !protectedItems.some(protectedItem => {
      return file.startsWith(protectedItem) || file.includes('/' + protectedItem);
    });
  });
  
  console.log(`📝 准备同步 ${filesToSync.length} 个文件`);
  
  // 复制文件
  let syncedCount = 0;
  filesToSync.forEach(file => {
    const srcPath = path.join(codeDir, file);
    const destPath = file;
    
    // 确保目标目录存在
    const destDir = path.dirname(destPath);
    if (destDir !== '.' && !fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // 复制文件
    try {
      fs.copyFileSync(srcPath, destPath);
      syncedCount++;
      
      if (syncedCount % 10 === 0) {
        console.log(`📄 已同步 ${syncedCount}/${filesToSync.length} 个文件`);
      }
    } catch (error) {
      console.log(`⚠️  无法复制文件 ${file}: ${error.message}`);
    }
  });
  
  console.log(`✅ 同步完成，共处理 ${syncedCount} 个文件`);
}

// 恢复配置文件
function restoreConfig(backup) {
  console.log('\n🔧 步骤6: 恢复配置文件');
  
  backup.backedFiles.forEach(file => {
    const backupPath = path.join(backup.backupDir, file);
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, file);
      console.log(`✅ 已恢复: ${file}`);
    }
  });
  
  // 检查重要配置
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('mongodb')) {
      console.log('✅ MongoDB配置已恢复');
    } else {
      console.log('⚠️  请检查MongoDB连接配置');
    }
  }
  
  if (fs.existsSync('vercel.json')) {
    console.log('✅ Vercel配置已恢复');
  }
}

// 提交到Git
function commitToGit() {
  console.log('\n🚀 步骤7: 提交到Git');
  
  try {
    // 检查是否有变更
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!status.trim()) {
      console.log('ℹ️  没有检测到变更');
      return false;
    }
    
    console.log('📝 添加变更文件...');
    execSync('git add .', { stdio: 'inherit' });
    
    const commitMessage = `🔄 AIPA同步更新 - ${new Date().toLocaleDateString('zh-CN')}`;
    console.log('💾 提交变更...');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    console.log('🚀 推送到GitHub...');
    execSync('git push', { stdio: 'inherit' });
    
    console.log('✅ 已推送到GitHub');
    return true;
    
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('ℹ️  没有变更需要提交');
      return false;
    } else {
      console.log('❌ Git操作失败:', error.message);
      console.log('💡 请手动执行以下命令：');
      console.log('   git add .');
      console.log('   git commit -m "AIPA同步更新"');
      console.log('   git push');
      return false;
    }
  }
}

// 清理临时文件
function cleanup(tempDir, zipFile, backupDir) {
  console.log('\n🧹 步骤8: 清理临时文件');
  
  try {
    if (fs.existsSync(tempDir)) {
      execSync(`rm -rf "${tempDir}"`, { stdio: 'pipe' });
      console.log('✅ 已删除临时目录');
    }
    
    if (fs.existsSync(zipFile)) {
      fs.unlinkSync(zipFile);
      console.log('✅ 已删除zip文件');
    }
    
    if (fs.existsSync(backupDir)) {
      execSync(`rm -rf "${backupDir}"`, { stdio: 'pipe' });
    }
    
  } catch (error) {
    console.log('⚠️  清理过程中出现问题:', error.message);
    console.log('💡 可以手动删除临时文件');
  }
}

// 主函数
function main() {
  try {
    // 步骤1: 环境检查
    const zipFile = checkEnvironment();
    
    // 步骤2: 备份配置
    const backup = backupImportantFiles();
    
    // 步骤3: 处理zip文件
    const tempDir = processZipFile(zipFile);
    
    // 步骤4: 修复目录结构
    const codeDir = fixDirectoryStructure(tempDir);
    
    // 步骤5: 同步代码
    syncCodeFiles(codeDir, backup);
    
    // 步骤6: 恢复配置
    restoreConfig(backup);
    
    // 步骤7: 提交到Git
    const pushed = commitToGit();
    
    // 步骤8: 清理
    cleanup(tempDir, zipFile, backup.backupDir);
    
    // 完成提示
    console.log('\n🎉 同步完成！');
    if (pushed) {
      console.log('✅ 代码已推送到GitHub，Vercel将自动部署');
      console.log('🔗 请访问你的Vercel控制台查看部署状态');
    } else {
      console.log('ℹ️  请手动推送代码到GitHub以触发部署');
    }
    
    console.log('\n📋 后续步骤：');
    console.log('1. 访问Vercel控制台确认部署状态');
    console.log('2. 测试网站功能是否正常');
    console.log('3. 如有问题，查看部署日志排查');
    
  } catch (error) {
    console.log('\n❌ 同步过程中出现错误:', error.message);
    console.log('\n💡 解决建议:');
    console.log('1. 检查是否在正确的项目目录');
    console.log('2. 确保AIPA导出的zip文件在当前目录');
    console.log('3. 检查Git仓库状态是否正常');
    console.log('4. 如需帮助，请查看错误信息详情');
    process.exit(1);
  }
}

// 启动脚本 - ES模块版本
main();