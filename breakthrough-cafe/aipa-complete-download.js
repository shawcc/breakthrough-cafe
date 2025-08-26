#!/usr/bin/env node

/**
 * AIPA完整代码下载脚本
 * 专门用于下载包含数据库功能的最新版本
 */

const fs = require('fs');
const path = require('path');

console.log('📥 AIPA代码下载工具');
console.log('===================\n');

// 当前项目的所有文件列表（从AIPA获取）
const fileList = [
    // 核心配置文件
    'package.json',
    '.env',
    'vercel.json',
    'DEPLOYMENT_GUIDE.md',
    'DEPLOYMENT_STEPS.md',
    
    // 前端核心文件
    'App.tsx',
    'types/index.ts',
    'store/languageStore.ts',
    'hooks/useLanguage.ts',
    'hooks/useArticles.ts',
    'hooks/useArticleManagement.ts',
    'hooks/useSimpleAuth.ts',
    'data/content.ts',
    
    // 共享类型
    'shared/types/article.ts',
    
    // 组件
    'components/Navigation/index.tsx',
    'components/Hero/index.tsx',
    'components/Services/index.tsx',
    'components/Process/index.tsx',
    'components/CTA/index.tsx',
    'components/Footer/index.tsx',
    'components/ManagementLayout/index.tsx',
    'components/RichTextEditor/index.tsx',
    'components/ErrorBoundary/index.tsx',
    
    // 页面
    'pages/Cases/index.tsx',
    'pages/Programming/index.tsx',
    'pages/CaseDetail/index.tsx',
    'pages/Articles/index.tsx',
    'pages/ArticleDetail/index.tsx',
    
    // 管理页面
    'pages/Management/Login/index.tsx',
    'pages/Management/Dashboard/index.tsx',
    'pages/Management/ArticleEditor/index.tsx',
    'pages/Management/ArticleList/index.tsx',
    'pages/Management/CategoryManagement/index.tsx',
    'pages/Management/DebugTool/index.tsx',
    'pages/Management/PutDebugTool/index.tsx',
    'pages/Management/DatabaseDebugTool/index.tsx',
    'pages/Management/MongoDebugTool/index.tsx',
    'pages/Management/StatusDebugTool/index.tsx',
    'pages/Management/DirectMongoTest/index.tsx',
    'pages/Management/SelectionDebugTool/index.tsx',
    'pages/Management/DataConsistencyTool/index.tsx',
    'pages/Management/PutAnalysisTool/index.tsx',
    'pages/Management/CacheDebugTool/index.tsx',
    
    // 后端代码
    'server/index.ts',
    'server/db.ts',
    'server/routes/articles.ts',
    'server/routes/categories.ts',
    
    // Vercel API
    'api/[...path].ts',
    
    // 部署脚本
    'deploy-to-github.js',
    'deploy-to-vercel.js',
    'quick-deploy.js',
    'simple-github-push.js',
    'safe-sync-guide.md',
    'compare-and-update.js',
];

// 检查当前目录状态
function checkCurrentDirectory() {
    console.log('📁 检查当前目录状态...');
    
    const files = fs.readdirSync('.');
    const hasGit = files.includes('.git');
    const hasPackageJson = files.includes('package.json');
    
    console.log(`Git仓库: ${hasGit ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`Package.json: ${hasPackageJson ? '✅ 存在' : '❌ 不存在'}`);
    
    if (hasPackageJson) {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasDB = pkg.dependencies && (pkg.dependencies.mongodb || pkg.dependencies.hono);
        console.log(`数据库功能: ${hasDB ? '✅ 已包含' : '❌ 未包含'}`);
    }
    
    return { hasGit, hasPackageJson };
}

// 创建目录结构
function createDirectoryStructure() {
    console.log('\n📂 创建目录结构...');
    
    const directories = [
        'types',
        'store', 
        'hooks',
        'data',
        'shared/types',
        'components/Navigation',
        'components/Hero',
        'components/Services',
        'components/Process',
        'components/CTA',
        'components/Footer',
        'components/ManagementLayout',
        'components/RichTextEditor',
        'components/ErrorBoundary',
        'pages/Cases',
        'pages/Programming',
        'pages/CaseDetail',
        'pages/Articles',
        'pages/ArticleDetail',
        'pages/Management/Login',
        'pages/Management/Dashboard',
        'pages/Management/ArticleEditor',
        'pages/Management/ArticleList',
        'pages/Management/CategoryManagement',
        'pages/Management/DebugTool',
        'pages/Management/PutDebugTool',
        'pages/Management/DatabaseDebugTool',
        'pages/Management/MongoDebugTool',
        'pages/Management/StatusDebugTool',
        'pages/Management/DirectMongoTest',
        'pages/Management/SelectionDebugTool',
        'pages/Management/DataConsistencyTool',
        'pages/Management/PutAnalysisTool',
        'pages/Management/CacheDebugTool',
        'server/routes',
        'api'
    ];
    
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`创建目录: ${dir}`);
        }
    });
}

// 生成下载说明
function generateDownloadInstructions() {
    console.log('\n📋 文件下载说明');
    console.log('================');
    console.log('需要从AIPA下载以下文件：');
    console.log('');
    
    fileList.forEach((file, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${file}`);
    });
    
    console.log('\n🔧 手动操作步骤：');
    console.log('1. 在AIPA项目中，逐个复制上述文件内容');
    console.log('2. 在本地创建对应文件并粘贴内容');
    console.log('3. 特别注意配置文件：.env, vercel.json');
    console.log('4. 确保MongoDB连接字符串正确');
}

// 生成配置检查清单
function generateConfigChecklist() {
    console.log('\n✅ 配置检查清单');
    console.log('================');
    console.log('下载完成后，请检查：');
    console.log('');
    console.log('[ ] .env文件存在且包含MongoDB连接信息');
    console.log('[ ] package.json包含所有必要依赖');
    console.log('[ ] vercel.json配置正确');
    console.log('[ ] server/目录包含后端代码');
    console.log('[ ] pages/Management/目录包含管理后台');
    console.log('[ ] 所有组件文件完整');
    console.log('');
    console.log('配置完成后运行：');
    console.log('  npm install  # 安装依赖');
    console.log('  npm run dev  # 本地测试');
}

// 主函数
function main() {
    const status = checkCurrentDirectory();
    
    if (!status.hasGit) {
        console.log('⚠️  警告：当前目录没有.git文件夹');
        console.log('请确保在正确的项目目录中运行此脚本');
    }
    
    createDirectoryStructure();
    generateDownloadInstructions();
    generateConfigChecklist();
    
    console.log('\n🎯 准备完成！');
    console.log('请按照上述说明从AIPA手动下载文件内容。');
    console.log('有问题随时询问！');
}

// 运行
main();