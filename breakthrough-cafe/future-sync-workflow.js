#!/usr/bin/env node

/**
 * 🚀 AIPA项目标准化同步工作流程
 * 
 * 使用场景：未来AIPA有更新时，运行此脚本完成同步
 * 流程：AIPA → 本地 → GitHub → Vercel
 * 
 * 使用方法：
 * 1. 从AIPA导出zip包到本地
 * 2. 运行: node future-sync-workflow.js
 * 3. 按照提示操作
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class FutureSyncWorkflow {
  constructor() {
    this.currentDir = process.cwd();
    this.backupDir = path.join(this.currentDir, 'backup-before-sync');
    this.tempDir = path.join(this.currentDir, 'temp-aipa-extract');
    
    // 需要保护的重要文件（不会被覆盖）
    this.protectedFiles = [
      '.env',
      'vercel.json',
      '.git/',
      '.gitignore',
      'node_modules/',
      'backup-before-sync/',
      'temp-aipa-extract/'
    ];
  }

  // 主工作流程
  async run() {
    console.log('🚀 AIPA项目标准化同步工作流程启动...\n');
    
    try {
      // 第一步：环境检查
      await this.checkEnvironment();
      
      // 第二步：备份当前配置
      await this.backupImportantFiles();
      
      // 第三步：处理AIPA代码
      await this.processAipaCode();
      
      // 第四步：合并代码
      await this.mergeCode();
      
      // 第五步：验证配置
      await this.validateConfiguration();
      
      // 第六步：同步到GitHub
      await this.syncToGitHub();
      
      console.log('✅ 同步流程完成！项目已自动部署到Vercel');
      console.log('🔗 请访问你的Vercel项目查看部署状态');
      
    } catch (error) {
      console.error('❌ 同步过程中出现错误:', error.message);
      console.log('💡 请查看详细操作指南: FUTURE-SYNC-GUIDE.md');
    }
  }

  // 检查环境和准备工作
  async checkEnvironment() {
    console.log('📋 第一步：环境检查');
    
    // 检查是否在Git仓库中
    try {
      execSync('git status', { stdio: 'pipe' });
      console.log('✅ Git仓库状态正常');
    } catch (error) {
      throw new Error('当前目录不是Git仓库，请确保在正确的项目目录下运行');
    }
    
    // 检查是否有未提交的变更
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log('⚠️  发现未提交的变更，建议先提交或备份');
        console.log('📝 未提交的文件:');
        console.log(status);
        
        // 询问用户是否继续
        const readline = await import('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
          rl.question('是否继续？(y/N): ', resolve);
        });
        rl.close();
        
        if (answer.toLowerCase() !== 'y') {
          throw new Error('用户取消操作');
        }
      }
    } catch (error) {
      if (error.message !== '用户取消操作') {
        console.log('⚠️  无法检查Git状态，继续执行...');
      } else {
        throw error;
      }
    }
    
    // 检查AIPA导出的zip文件
    const zipFiles = fs.readdirSync(this.currentDir).filter(file => 
      file.endsWith('.zip') && file.includes('aipa')
    );
    
    if (zipFiles.length === 0) {
      console.log('❓ 未找到AIPA导出的zip文件');
      console.log('💡 请确保已从AIPA导出项目zip包到当前目录');
      console.log('📁 当前目录:', this.currentDir);
      throw new Error('找不到AIPA导出的zip文件');
    }
    
    console.log(`📦 找到AIPA导出文件: ${zipFiles[0]}`);
    this.aipaZipFile = zipFiles[0];
    
    console.log('✅ 环境检查完成\n');
  }

  // 备份重要文件
  async backupImportantFiles() {
    console.log('💾 第二步：备份重要配置文件');
    
    // 创建备份目录
    if (fs.existsSync(this.backupDir)) {
      fs.rmSync(this.backupDir, { recursive: true });
    }
    fs.mkdirSync(this.backupDir, { recursive: true });
    
    // 备份重要文件
    const filesToBackup = [
      '.env',
      'vercel.json',
      'package.json',
      'README.md'
    ];
    
    for (const file of filesToBackup) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(this.backupDir, file));
        console.log(`✅ 已备份: ${file}`);
      }
    }
    
    // 备份当前Git状态
    try {
      const gitLog = execSync('git log --oneline -n 5', { encoding: 'utf8' });
      fs.writeFileSync(path.join(this.backupDir, 'git-history.txt'), gitLog);
      console.log('✅ 已备份Git历史');
    } catch (error) {
      console.log('⚠️  无法备份Git历史');
    }
    
    console.log('✅ 备份完成\n');
  }

  // 处理AIPA代码
  async processAipaCode() {
    console.log('📦 第三步：处理AIPA代码');
    
    // 清理临时目录
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true });
    }
    fs.mkdirSync(this.tempDir, { recursive: true });
    
    // 解压AIPA代码
    console.log('📂 正在解压AIPA代码...');
    try {
      // 使用不同的解压方法
      if (process.platform === 'win32') {
        // Windows
        execSync(`powershell Expand-Archive "${this.aipaZipFile}" "${this.tempDir}"`, { stdio: 'inherit' });
      } else {
        // macOS/Linux
        execSync(`unzip -q "${this.aipaZipFile}" -d "${this.tempDir}"`, { stdio: 'inherit' });
      }
      console.log('✅ 解压完成');
    } catch (error) {
      throw new Error(`解压失败: ${error.message}`);
    }
    
    // 检查并修复目录结构
    await this.fixDirectoryStructure();
    
    console.log('✅ AIPA代码处理完成\n');
  }

  // 修复目录结构（解决之前遇到的问题）
  async fixDirectoryStructure() {
    console.log('🔧 修复目录结构...');
    
    // 查找实际的代码目录
    const findCodeDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      // 检查是否包含src目录或直接包含代码文件
      if (items.includes('src') || items.includes('App.tsx') || items.includes('index.tsx')) {
        return dir;
      }
      
      // 递归查找子目录
      for (const item of items) {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory() && !item.startsWith('.')) {
          const result = findCodeDirectory(itemPath);
          if (result) return result;
        }
      }
      
      return null;
    };
    
    const actualCodeDir = findCodeDirectory(this.tempDir);
    if (!actualCodeDir) {
      throw new Error('无法找到有效的代码目录结构');
    }
    
    console.log(`📁 找到代码目录: ${actualCodeDir}`);
    
    // 如果代码在src目录中，需要移动到根目录
    const srcDir = path.join(actualCodeDir, 'src');
    if (fs.existsSync(srcDir)) {
      console.log('🔄 移动src目录中的文件到根目录...');
      
      const srcItems = fs.readdirSync(srcDir);
      for (const item of srcItems) {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(actualCodeDir, item);
        
        if (fs.existsSync(destPath)) {
          fs.rmSync(destPath, { recursive: true });
        }
        
        if (fs.statSync(srcPath).isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          execSync(`cp -r "${srcPath}/"* "${destPath}/"`, { stdio: 'pipe' });
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
      
      // 删除src目录
      fs.rmSync(srcDir, { recursive: true });
      console.log('✅ 目录结构修复完成');
    }
    
    this.processedCodeDir = actualCodeDir;
  }

  // 合并代码
  async mergeCode() {
    console.log('🔗 第四步：合并代码');
    
    // 获取需要更新的文件列表
    const filesToUpdate = this.getFilesToUpdate();
    
    console.log(`📝 准备更新 ${filesToUpdate.length} 个文件`);
    
    // 复制文件，但保护重要配置
    for (const file of filesToUpdate) {
      const srcPath = path.join(this.processedCodeDir, file);
      const destPath = path.join(this.currentDir, file);
      
      if (fs.existsSync(srcPath)) {
        // 确保目标目录存在
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        // 复制文件
        if (fs.statSync(srcPath).isDirectory()) {
          if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true });
          }
          fs.mkdirSync(destPath, { recursive: true });
          execSync(`cp -r "${srcPath}/"* "${destPath}/"`, { stdio: 'pipe' });
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
        
        console.log(`✅ 已更新: ${file}`);
      }
    }
    
    console.log('✅ 代码合并完成\n');
  }

  // 获取需要更新的文件列表
  getFilesToUpdate() {
    const allFiles = this.getAllFiles(this.processedCodeDir);
    const relativePaths = allFiles.map(file => 
      path.relative(this.processedCodeDir, file)
    );
    
    // 过滤掉受保护的文件
    return relativePaths.filter(file => {
      return !this.protectedFiles.some(protected => {
        if (protected.endsWith('/')) {
          return file.startsWith(protected) || file.includes('/' + protected);
        }
        return file === protected;
      });
    });
  }

  // 递归获取所有文件
  getAllFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        this.getAllFiles(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // 验证配置
  async validateConfiguration() {
    console.log('🔍 第五步：验证配置');
    
    // 恢复重要配置文件
    const configFiles = ['.env', 'vercel.json'];
    for (const file of configFiles) {
      const backupPath = path.join(this.backupDir, file);
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, file);
        console.log(`✅ 已恢复配置: ${file}`);
      }
    }
    
    // 检查关键配置
    if (!fs.existsSync('.env')) {
      console.log('⚠️  缺少.env文件，请确保MongoDB连接配置正确');
    } else {
      const envContent = fs.readFileSync('.env', 'utf8');
      if (envContent.includes('mongodb+srv://')) {
        console.log('✅ MongoDB连接配置存在');
      } else {
        console.log('⚠️  请检查MongoDB连接配置');
      }
    }
    
    if (!fs.existsSync('vercel.json')) {
      console.log('⚠️  缺少vercel.json文件，请检查部署配置');
    } else {
      console.log('✅ Vercel部署配置存在');
    }
    
    console.log('✅ 配置验证完成\n');
  }

  // 同步到GitHub
  async syncToGitHub() {
    console.log('🚀 第六步：同步到GitHub');
    
    try {
      // 添加所有变更
      console.log('📝 添加文件变更...');
      execSync('git add .', { stdio: 'inherit' });
      
      // 检查是否有变更
      try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (!status.trim()) {
          console.log('ℹ️  没有检测到变更，跳过提交');
          return;
        }
      } catch (error) {
        console.log('⚠️  无法检查变更状态，继续提交...');
      }
      
      // 提交变更
      const commitMessage = `🔄 AIPA同步更新 - ${new Date().toISOString().split('T')[0]}`;
      console.log('💾 提交变更...');
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      // 推送到GitHub
      console.log('🚀 推送到GitHub...');
      execSync('git push origin main', { stdio: 'inherit' });
      
      console.log('✅ 已推送到GitHub，Vercel将自动部署');
      
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('ℹ️  没有变更需要提交');
      } else {
        throw new Error(`Git操作失败: ${error.message}`);
      }
    }
    
    // 清理临时文件
    this.cleanup();
  }

  // 清理临时文件
  cleanup() {
    console.log('🧹 清理临时文件...');
    
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true });
    }
    
    if (fs.existsSync(this.aipaZipFile)) {
      fs.unlinkSync(this.aipaZipFile);
      console.log('✅ 已删除zip文件');
    }
    
    console.log('✅ 清理完成');
  }
}

// 主函数
async function main() {
  const workflow = new FutureSyncWorkflow();
  await workflow.run();
}

// 导出类和主函数
export { FutureSyncWorkflow, main };

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ 脚本执行失败:', error.message);
    process.exit(1);
  });
}