#!/usr/bin/env node
/**
 * 部署到GitHub脚本 - 支持全栈应用部署
 * 包含前端、后端和数据库配置的完整同步
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

// 配置信息
const CONFIG = {
  // GitHub配置
  github: {
    owner: 'wulayu', // 替换为你的GitHub用户名
    repo: 'breakthrough-cafe', // 替换为你的仓库名
    token: process.env.GITHUB_TOKEN || '', // 需要设置GitHub Token
  },
  
  // 排除的文件和目录
  excludePatterns: [
    'node_modules',
    '.git',
    '.env',
    '.env.local',
    '*.log',
    '.DS_Store',
    'deploy-to-github.js', // 排除本脚本
  ],
  
  // 强制包含的部署相关文件
  deploymentFiles: [
    'vercel.json',
    'api/[...path].ts',
    'DEPLOYMENT_GUIDE.md',
    'server/db.ts',
  ]
};

class GitHubDeployer {
  constructor() {
    this.octokit = new Octokit({
      auth: CONFIG.github.token,
    });
    this.localFiles = new Map();
    this.remoteFiles = new Map();
  }

  /**
   * 主部署流程
   */
  async deploy() {
    try {
      console.log('🚀 开始部署到GitHub...');
      console.log('📊 项目类型：全栈应用（React + Hono + MongoDB）');
      
      // 验证GitHub Token
      if (!CONFIG.github.token) {
        throw new Error('请设置GITHUB_TOKEN环境变量');
      }
      
      // 1. 验证仓库访问权限
      await this.verifyRepository();
      
      // 2. 读取本地文件
      await this.readLocalFiles();
      
      // 3. 读取远程文件
      await this.readRemoteFiles();
      
      // 4. 分析文件差异
      const changes = this.analyzeChanges();
      
      // 5. 显示部署预览
      this.displayDeploymentPreview(changes);
      
      // 6. 确认部署
      if (await this.confirmDeployment()) {
        await this.executeDeployment(changes);
        console.log('🎉 部署完成！');
        this.displayPostDeploymentInfo();
      } else {
        console.log('❌ 部署取消');
      }
      
    } catch (error) {
      console.error('💥 部署失败:', error.message);
      process.exit(1);
    }
  }

  /**
   * 验证仓库访问权限
   */
  async verifyRepository() {
    console.log('🔍 验证GitHub仓库访问权限...');
    
    try {
      const { data: repo } = await this.octokit.repos.get({
        owner: CONFIG.github.owner,
        repo: CONFIG.github.repo,
      });
      
      console.log(`✅ 仓库验证成功: ${repo.full_name}`);
      console.log(`  - 私有仓库: ${repo.private ? '是' : '否'}`);
      console.log(`  - 默认分支: ${repo.default_branch}`);
      
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`仓库 ${CONFIG.github.owner}/${CONFIG.github.repo} 不存在或无访问权限`);
      }
      throw error;
    }
  }

  /**
   * 读取本地文件
   */
  async readLocalFiles() {
    console.log('📂 读取本地文件...');
    
    const rootDir = process.cwd();
    await this.scanDirectory(rootDir, '');
    
    console.log(`📊 扫描完成，共 ${this.localFiles.size} 个文件`);
    
    // 显示关键文件
    const keyFiles = [
      'App.tsx',
      'server/index.ts', 
      'server/db.ts',
      'vercel.json',
      'DEPLOYMENT_GUIDE.md'
    ];
    
    console.log('🔑 关键文件检查:');
    keyFiles.forEach(file => {
      const status = this.localFiles.has(file) ? '✅' : '❌';
      console.log(`  ${status} ${file}`);
    });
  }

  /**
   * 扫描目录
   */
  async scanDirectory(dirPath, relativePath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativeFilePath = path.join(relativePath, entry.name).replace(/\\/g, '/');
        
        // 检查是否应该排除
        if (this.shouldExclude(relativeFilePath, entry.name)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          await this.scanDirectory(fullPath, relativeFilePath);
        } else {
          // 读取文件内容
          const content = await fs.readFile(fullPath, 'utf8');
          this.localFiles.set(relativeFilePath, {
            content,
            size: content.length,
            path: relativeFilePath
          });
        }
      }
    } catch (error) {
      console.warn(`⚠️ 读取目录失败: ${dirPath}`, error.message);
    }
  }

  /**
   * 检查是否应该排除文件
   */
  shouldExclude(filePath, fileName) {
    // 检查排除模式
    for (const pattern of CONFIG.excludePatterns) {
      if (pattern.includes('*')) {
        // 通配符匹配
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        if (regex.test(fileName) || regex.test(filePath)) {
          return true;
        }
      } else {
        // 精确匹配
        if (fileName === pattern || filePath === pattern || filePath.startsWith(pattern + '/')) {
          return true;
        }
      }
    }
    
    // 强制包含部署文件
    if (CONFIG.deploymentFiles.includes(filePath)) {
      return false;
    }
    
    return false;
  }

  /**
   * 读取远程文件
   */
  async readRemoteFiles() {
    console.log('🌐 读取远程文件...');
    
    try {
      const { data: tree } = await this.octokit.git.getTree({
        owner: CONFIG.github.owner,
        repo: CONFIG.github.repo,
        tree_sha: 'main',
        recursive: true,
      });
      
      for (const item of tree.tree) {
        if (item.type === 'blob') {
          try {
            const { data: blob } = await this.octokit.git.getBlob({
              owner: CONFIG.github.owner,
              repo: CONFIG.github.repo,
              file_sha: item.sha,
            });
            
            const content = Buffer.from(blob.content, 'base64').toString('utf8');
            this.remoteFiles.set(item.path, {
              content,
              sha: item.sha,
              size: item.size,
              path: item.path
            });
          } catch (error) {
            console.warn(`⚠️ 读取远程文件失败: ${item.path}`);
          }
        }
      }
      
      console.log(`📊 远程文件读取完成，共 ${this.remoteFiles.size} 个文件`);
      
    } catch (error) {
      if (error.status === 409) {
        console.log('📝 远程仓库为空，这是首次部署');
      } else {
        console.warn('⚠️ 读取远程文件失败:', error.message);
      }
    }
  }

  /**
   * 分析文件变更
   */
  analyzeChanges() {
    console.log('🔍 分析文件变更...');
    
    const changes = {
      created: [],
      modified: [],
      deleted: [],
      unchanged: []
    };
    
    // 检查本地文件
    for (const [path, localFile] of this.localFiles) {
      const remoteFile = this.remoteFiles.get(path);
      
      if (!remoteFile) {
        changes.created.push({ path, file: localFile });
      } else if (localFile.content !== remoteFile.content) {
        changes.modified.push({ 
          path, 
          local: localFile, 
          remote: remoteFile 
        });
      } else {
        changes.unchanged.push({ path });
      }
    }
    
    // 检查已删除的文件
    for (const [path, remoteFile] of this.remoteFiles) {
      if (!this.localFiles.has(path)) {
        changes.deleted.push({ path, file: remoteFile });
      }
    }
    
    return changes;
  }

  /**
   * 显示部署预览
   */
  displayDeploymentPreview(changes) {
    console.log('\n📋 部署预览:');
    console.log('==========================================');
    
    if (changes.created.length > 0) {
      console.log(`\n🆕 新增文件 (${changes.created.length}个):`);
      changes.created.forEach(item => {
        const size = (item.file.size / 1024).toFixed(1);
        console.log(`  + ${item.path} (${size} KB)`);
      });
    }
    
    if (changes.modified.length > 0) {
      console.log(`\n📝 修改文件 (${changes.modified.length}个):`);
      changes.modified.forEach(item => {
        const sizeDiff = ((item.local.size - item.remote.size) / 1024).toFixed(1);
        const diffSymbol = sizeDiff >= 0 ? '+' : '';
        console.log(`  * ${item.path} (${diffSymbol}${sizeDiff} KB)`);
      });
    }
    
    if (changes.deleted.length > 0) {
      console.log(`\n🗑️ 删除文件 (${changes.deleted.length}个):`);
      changes.deleted.forEach(item => {
        console.log(`  - ${item.path}`);
      });
    }
    
    if (changes.unchanged.length > 0) {
      console.log(`\n✅ 未变更文件: ${changes.unchanged.length}个`);
    }
    
    console.log('\n🎯 部署特性:');
    console.log('  ✅ React前端应用');
    console.log('  ✅ Hono后端API');
    console.log('  ✅ MongoDB数据库支持');
    console.log('  ✅ Vercel部署配置');
    console.log('  ✅ 环境变量支持');
    
    console.log('\n⚠️ 部署后需要配置的环境变量:');
    console.log('  - MONGODB_URI: MongoDB Atlas连接字符串');
    console.log('  - MONGODB_DB_NAME: 数据库名称（可选）');
    
    console.log('==========================================');
  }

  /**
   * 确认部署
   */
  async confirmDeployment() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      readline.question('\n🚀 确认部署？(y/N): ', (answer) => {
        readline.close();
        resolve(answer.toLowerCase().startsWith('y'));
      });
    });
  }

  /**
   * 执行部署
   */
  async executeDeployment(changes) {
    console.log('\n🚀 开始执行部署...');
    
    const totalChanges = changes.created.length + changes.modified.length + changes.deleted.length;
    let processedChanges = 0;
    
    // 获取当前commit SHA
    let currentSha;
    try {
      const { data: ref } = await this.octokit.git.getRef({
        owner: CONFIG.github.owner,
        repo: CONFIG.github.repo,
        ref: 'heads/main',
      });
      currentSha = ref.object.sha;
    } catch (error) {
      console.log('📝 创建首次提交...');
    }
    
    // 创建新的tree
    const tree = [];
    
    // 添加所有本地文件
    for (const [path, file] of this.localFiles) {
      const { data: blob } = await this.octokit.git.createBlob({
        owner: CONFIG.github.owner,
        repo: CONFIG.github.repo,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64',
      });
      
      tree.push({
        path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
      
      processedChanges++;
      const progress = ((processedChanges / totalChanges) * 100).toFixed(1);
      console.log(`📤 上传中... ${progress}% (${processedChanges}/${totalChanges})`);
    }
    
    // 创建tree
    const { data: newTree } = await this.octokit.git.createTree({
      owner: CONFIG.github.owner,
      repo: CONFIG.github.repo,
      tree,
      base_tree: currentSha,
    });
    
    // 创建commit
    const commitMessage = this.generateCommitMessage(changes);
    const { data: newCommit } = await this.octokit.git.createCommit({
      owner: CONFIG.github.owner,
      repo: CONFIG.github.repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: currentSha ? [currentSha] : [],
    });
    
    // 更新引用
    await this.octokit.git.updateRef({
      owner: CONFIG.github.owner,
      repo: CONFIG.github.repo,
      ref: 'heads/main',
      sha: newCommit.sha,
    });
    
    console.log(`✅ 部署完成！Commit: ${newCommit.sha.substring(0, 7)}`);
  }

  /**
   * 生成提交消息
   */
  generateCommitMessage(changes) {
    const parts = [];
    
    if (changes.created.length > 0) {
      parts.push(`新增 ${changes.created.length} 个文件`);
    }
    if (changes.modified.length > 0) {
      parts.push(`修改 ${changes.modified.length} 个文件`);
    }
    if (changes.deleted.length > 0) {
      parts.push(`删除 ${changes.deleted.length} 个文件`);
    }
    
    const summary = parts.join('，');
    
    return `部署全栈应用: ${summary}

🚀 部署内容：
- React前端应用
- Hono后端API  
- MongoDB数据库支持
- Vercel部署配置

部署时间: ${new Date().toISOString()}`;
  }

  /**
   * 显示部署后信息
   */
  displayPostDeploymentInfo() {
    console.log('\n🎉 部署成功！');
    console.log('==========================================');
    console.log('📋 下一步操作:');
    console.log('');
    console.log('1. 🔗 连接Vercel:');
    console.log('   - 访问 https://vercel.com');
    console.log('   - 导入您的GitHub仓库');
    console.log('   - Vercel会自动检测配置');
    console.log('');
    console.log('2. ⚙️ 配置环境变量:');
    console.log('   在Vercel项目设置中添加:');
    console.log('   - MONGODB_URI: MongoDB Atlas连接字符串');
    console.log('   - MONGODB_DB_NAME: breakthrough_cafe (可选)');
    console.log('');
    console.log('3. 🗄️ 设置MongoDB Atlas:');
    console.log('   - 访问 https://cloud.mongodb.com');
    console.log('   - 创建免费集群');
    console.log('   - 获取连接字符串');
    console.log('   - 配置网络访问（允许所有IP: 0.0.0.0/0）');
    console.log('');
    console.log('4. 📖 详细说明:');
    console.log('   查看 DEPLOYMENT_GUIDE.md 获取完整部署指南');
    console.log('');
    console.log('🔗 相关链接:');
    console.log(`   GitHub: https://github.com/${CONFIG.github.owner}/${CONFIG.github.repo}`);
    console.log('   Vercel: https://vercel.com/dashboard');
    console.log('   MongoDB Atlas: https://cloud.mongodb.com');
    console.log('==========================================');
  }
}

// 执行部署
if (require.main === module) {
  const deployer = new GitHubDeployer();
  deployer.deploy().catch(error => {
    console.error('💥 部署失败:', error);
    process.exit(1);
  });
}

module.exports = GitHubDeployer;