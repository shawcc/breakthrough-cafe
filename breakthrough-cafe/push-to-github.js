#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectDir = '/Users/bytedance/breakthrough-cafe';

function log(message) {
    console.log(`\n📝 ${message}`);
}

function success(message) {
    console.log(`\n✅ ${message}`);
}

function error(message) {
    console.log(`\n❌ ${message}`);
}

function warning(message) {
    console.log(`\n⚠️  ${message}`);
}

function execCommand(command, description) {
    try {
        log(`${description}...`);
        const result = execSync(command, { 
            cwd: projectDir, 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        success(`${description} 完成`);
        return result;
    } catch (err) {
        error(`${description} 失败: ${err.message}`);
        throw err;
    }
}

function checkGitStatus() {
    log('检查Git状态...');
    
    try {
        // 检查是否在git仓库中
        execSync('git status', { cwd: projectDir, stdio: 'pipe' });
        success('Git仓库检查通过');
    } catch (err) {
        warning('当前不在Git仓库中，正在初始化...');
        execCommand('git init', '初始化Git仓库');
    }

    // 检查是否有远程仓库
    try {
        const remotes = execSync('git remote -v', { cwd: projectDir, encoding: 'utf8' });
        if (remotes.trim()) {
            success('检测到远程仓库');
            console.log(remotes);
        } else {
            warning('未检测到远程仓库');
            console.log('\n请先添加远程仓库：');
            console.log('git remote add origin https://github.com/用户名/仓库名.git');
            return false;
        }
    } catch (err) {
        warning('未检测到远程仓库');
        console.log('\n请先添加远程仓库：');
        console.log('git remote add origin https://github.com/用户名/仓库名.git');
        return false;
    }

    return true;
}

function addGitignore() {
    const gitignorePath = path.join(projectDir, '.gitignore');
    const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production
/build
/dist

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Mac
.DS_Store

# Vercel
.vercel

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Temporary files
*.tmp
*.temp

# Debug tools and sync scripts
*sync*.js
*debug*.js
*deploy*.js
fix-*.js
organize-*.js
DEPLOYMENT_*.md
*.md
!README.md
`;

    if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, gitignoreContent);
        success('创建了 .gitignore 文件');
    } else {
        log('.gitignore 文件已存在');
    }
}

function commitAndPush() {
    try {
        // 添加所有文件
        execCommand('git add .', '添加所有文件到Git');

        // 检查是否有变更
        try {
            const status = execSync('git status --porcelain', { cwd: projectDir, encoding: 'utf8' });
            if (!status.trim()) {
                warning('没有检测到文件变更，跳过提交');
                return true;
            }
        } catch (err) {
            // 继续执行提交
        }

        // 提交
        const commitMessage = `更新代码 - ${new Date().toLocaleString('zh-CN')}`;
        execCommand(`git commit -m "${commitMessage}"`, '提交变更');

        // 推送到远程仓库
        execCommand('git push -u origin main', '推送到GitHub');

        return true;
    } catch (err) {
        // 尝试推送到master分支
        try {
            warning('推送到main分支失败，尝试推送到master分支...');
            execCommand('git push -u origin master', '推送到GitHub (master分支)');
            return true;
        } catch (masterErr) {
            error('推送失败');
            console.log('\n可能的解决方案：');
            console.log('1. 检查远程仓库地址是否正确');
            console.log('2. 确认是否有推送权限');
            console.log('3. 手动执行: git push -u origin main');
            return false;
        }
    }
}

async function main() {
    console.log('🚀 GitHub 推送工具');
    console.log('='.repeat(50));

    try {
        // 切换到项目目录
        process.chdir(projectDir);
        log(`切换到项目目录: ${projectDir}`);

        // 检查Git状态
        if (!checkGitStatus()) {
            error('请先配置远程仓库后重新运行此脚本');
            return;
        }

        // 添加.gitignore
        addGitignore();

        // 提交并推送
        if (commitAndPush()) {
            success('代码推送完成！');
            console.log('\n🎉 下一步：');
            console.log('1. 登录 https://vercel.com');
            console.log('2. 连接GitHub仓库');
            console.log('3. 配置环境变量');
            console.log('4. 部署项目');
        }

    } catch (err) {
        error(`执行失败: ${err.message}`);
        console.log('\n💡 手动操作步骤：');
        console.log('1. git add .');
        console.log('2. git commit -m "更新代码"');
        console.log('3. git push origin main');
    }
}

// 运行主函数
main().catch(console.error);