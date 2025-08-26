#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 GitHub推送助手');
console.log('==================\n');

// 检查Git状态
function checkGitStatus() {
    console.log('🔍 检查Git状态...\n');
    
    try {
        // 检查是否是Git仓库
        execSync('git status', { stdio: 'pipe' });
        console.log('✅ Git仓库已初始化');
        
        // 检查是否有远程仓库
        try {
            const remotes = execSync('git remote -v', { encoding: 'utf8' });
            if (remotes.trim()) {
                console.log('✅ 远程仓库已配置');
                console.log(remotes);
            } else {
                console.log('⚠️  未配置远程仓库');
                return { hasGit: true, hasRemote: false };
            }
        } catch (error) {
            console.log('⚠️  未配置远程仓库');
            return { hasGit: true, hasRemote: false };
        }
        
        // 检查文件状态
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            const hasChanges = status.trim().length > 0;
            console.log(`📝 待提交更改: ${hasChanges ? '✅ 有更改需要提交' : '⚠️  无更改'}`);
            
            return { hasGit: true, hasRemote: true, hasChanges };
        } catch (error) {
            console.log('❌ 无法检查文件状态');
            return { hasGit: true, hasRemote: true, hasChanges: true };
        }
        
    } catch (error) {
        console.log('❌ 未初始化Git仓库');
        return { hasGit: false, hasRemote: false, hasChanges: false };
    }
}

// 初始化Git仓库
function initializeGit() {
    console.log('🔧 初始化Git仓库...\n');
    
    try {
        execSync('git init', { stdio: 'inherit' });
        console.log('✅ Git仓库初始化完成\n');
        
        // 创建.gitignore
        const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build output
build/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`;
        
        fs.writeFileSync('.gitignore', gitignoreContent);
        console.log('✅ .gitignore 已创建\n');
        
        return true;
    } catch (error) {
        console.log('❌ Git初始化失败:', error.message);
        return false;
    }
}

// 配置远程仓库
function setupRemoteRepository() {
    console.log('🌐 配置远程仓库\n');
    console.log('请提供您的GitHub仓库信息：\n');
    
    console.log('📋 操作步骤：');
    console.log('1. 在GitHub上创建新的仓库（如果还没有）');
    console.log('2. 复制仓库的SSH或HTTPS地址');
    console.log('3. 运行以下命令添加远程仓库：\n');
    
    console.log('🔗 添加远程仓库命令示例：');
    console.log('git remote add origin https://github.com/YOUR_USERNAME/breakthrough-cafe.git');
    console.log('或');
    console.log('git remote add origin git@github.com:YOUR_USERNAME/breakthrough-cafe.git\n');
    
    console.log('⚠️  请手动运行上述命令后，重新执行此脚本\n');
}

// 提交并推送代码
function commitAndPush(hasChanges) {
    console.log('📤 提交并推送代码...\n');
    
    try {
        if (hasChanges) {
            // 添加所有文件
            console.log('📝 添加文件到Git...');
            execSync('git add .', { stdio: 'inherit' });
            
            // 提交更改
            console.log('💾 提交更改...');
            const commitMessage = 'feat: 更新到数据库版本，支持文章管理系统';
            execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
            console.log('✅ 代码已提交\n');
        }
        
        // 检查是否有main分支
        try {
            execSync('git branch -M main', { stdio: 'pipe' });
            console.log('🌿 已切换到main分支');
        } catch (error) {
            // 忽略错误，可能已经在main分支
        }
        
        // 推送到远程仓库
        console.log('🚀 推送到GitHub...');
        try {
            execSync('git push -u origin main', { stdio: 'inherit' });
            console.log('✅ 代码已成功推送到GitHub！\n');
            return true;
        } catch (error) {
            // 尝试强制推送（如果是首次推送）
            console.log('⚠️  尝试强制推送...');
            execSync('git push -u origin main --force', { stdio: 'inherit' });
            console.log('✅ 代码已强制推送到GitHub！\n');
            return true;
        }
        
    } catch (error) {
        console.log('❌ 推送失败:', error.message);
        console.log('\n💡 可能的解决方案：');
        console.log('1. 检查GitHub仓库地址是否正确');
        console.log('2. 检查SSH密钥或访问权限');
        console.log('3. 确认网络连接正常\n');
        return false;
    }
}

// 显示Vercel部署指导
function showVercelGuidance() {
    console.log('🌐 Vercel自动部署指导');
    console.log('========================\n');
    
    console.log('📋 如果您已配置GitHub自动部署：');
    console.log('1. ✅ 代码推送后Vercel会自动触发部署');
    console.log('2. 🔧 确保在Vercel中配置了环境变量：');
    console.log('   - MONGODB_URI=mongodb+srv://chichishaw:<password>@btcafe.v040m4w.mongodb.net/');
    console.log('   - NODE_ENV=production\n');
    
    console.log('🛠️  如果还未配置自动部署：');
    console.log('1. 登录 vercel.com');
    console.log('2. 点击 "New Project"');
    console.log('3. 选择您的GitHub仓库');
    console.log('4. 配置环境变量');
    console.log('5. 点击 "Deploy"\n');
    
    console.log('🔍 部署后验证：');
    console.log('1. 访问部署的网站');
    console.log('2. 测试文章列表页面');
    console.log('3. 测试管理后台功能\n');
}

// 主程序
function main() {
    try {
        console.log('开始GitHub推送流程...\n');
        
        const gitStatus = checkGitStatus();
        
        if (!gitStatus.hasGit) {
            const initSuccess = initializeGit();
            if (!initSuccess) {
                process.exit(1);
            }
            
            setupRemoteRepository();
            return;
        }
        
        if (!gitStatus.hasRemote) {
            setupRemoteRepository();
            return;
        }
        
        const pushSuccess = commitAndPush(gitStatus.hasChanges);
        
        if (pushSuccess) {
            showVercelGuidance();
            
            console.log('🎉 推送完成！');
            console.log('📱 请检查Vercel Dashboard查看部署状态');
        }
        
    } catch (error) {
        console.error('❌ 推送过程中发生错误:', error.message);
        process.exit(1);
    }
}

// 运行主程序
if (require.main === module) {
    main();
}