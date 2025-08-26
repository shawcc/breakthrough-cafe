#!/usr/bin/env node

/**
 * AIPA 目录结构调整脚本
 * 将标准前端项目结构（有src目录）调整为AIPA扁平化结构
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 AIPA 目录结构调整脚本');
console.log('==========================');

// 检查当前目录结构
function checkCurrentStructure() {
  const currentDir = process.cwd();
  const srcDir = path.join(currentDir, 'src');
  
  console.log('\n📁 检查当前目录结构...');
  console.log(`当前目录: ${currentDir}`);
  
  if (fs.existsSync(srcDir)) {
    console.log('✅ 发现 src 目录 - 需要调整结构');
    return true;
  } else {
    console.log('❌ 未发现 src 目录 - 可能已经是正确结构或需要手动检查');
    return false;
  }
}

// 移动文件从 src 到根目录
function moveFilesFromSrc() {
  const currentDir = process.cwd();
  const srcDir = path.join(currentDir, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.log('❌ src 目录不存在，跳过移动操作');
    return false;
  }

  console.log('\n📦 开始移动文件...');
  
  try {
    // 递归移动 src 目录下的所有文件到根目录
    function moveDirectory(fromDir, toDir) {
      const items = fs.readdirSync(fromDir);
      
      for (const item of items) {
        const fromPath = path.join(fromDir, item);
        const toPath = path.join(toDir, item);
        
        const stat = fs.statSync(fromPath);
        
        if (stat.isDirectory()) {
          // 创建目标目录（如果不存在）
          if (!fs.existsSync(toPath)) {
            fs.mkdirSync(toPath, { recursive: true });
            console.log(`📁 创建目录: ${item}`);
          }
          // 递归移动子目录
          moveDirectory(fromPath, toPath);
        } else {
          // 移动文件
          if (fs.existsSync(toPath)) {
            console.log(`⚠️  覆盖文件: ${item}`);
          } else {
            console.log(`📄 移动文件: ${item}`);
          }
          fs.copyFileSync(fromPath, toPath);
        }
      }
    }
    
    moveDirectory(srcDir, currentDir);
    
    // 删除空的 src 目录
    console.log('\n🗑️  删除原 src 目录...');
    fs.rmSync(srcDir, { recursive: true, force: true });
    
    console.log('✅ 文件移动完成');
    return true;
    
  } catch (error) {
    console.error('❌ 移动文件时出错:', error.message);
    return false;
  }
}

// 删除不需要的配置文件
function removeUnnecessaryFiles() {
  const filesToRemove = [
    'rsbuild.config.ts',
    'postcss.config.js',
    'tailwind.config.ts',
    'tsconfig.json'
  ];
  
  console.log('\n🗑️  删除不需要的配置文件...');
  
  for (const file of filesToRemove) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ 已删除: ${file}`);
      } catch (error) {
        console.log(`❌ 删除失败 ${file}: ${error.message}`);
      }
    } else {
      console.log(`⚪ 文件不存在: ${file}`);
    }
  }
}

// 创建必要的配置文件
function createNecessaryFiles() {
  console.log('\n📝 创建必要配置文件...');
  
  // 创建 .env 文件（如果不存在）
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    const envContent = `# MongoDB 连接配置
MONGODB_URI=mongodb+srv://chichishaw:<db_password>@btcafe.v040m4w.mongodb.net/?retryWrites=true&w=majority&appName=BTCAFE

# 应用配置
NODE_ENV=production
PORT=3000

# Vercel 配置
VERCEL_URL=your-app.vercel.app
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ 创建 .env 文件');
  } else {
    console.log('⚪ .env 文件已存在');
  }
  
  // 创建 vercel.json 文件（如果不存在）
  const vercelPath = path.join(process.cwd(), 'vercel.json');
  if (!fs.existsSync(vercelPath)) {
    const vercelConfig = {
      "buildCommand": "echo 'No build needed for AIPA'",
      "outputDirectory": ".",
      "functions": {
        "api/[...path].ts": {
          "runtime": "@vercel/node"
        }
      },
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "/api/[...path]"
        },
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    };
    
    fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2));
    console.log('✅ 创建 vercel.json 文件');
  } else {
    console.log('⚪ vercel.json 文件已存在');
  }
}

// 显示最终状态
function showFinalStatus() {
  console.log('\n🎉 目录结构调整完成！');
  console.log('============================');
  
  const currentDir = process.cwd();
  const items = fs.readdirSync(currentDir);
  
  console.log('\n📁 当前目录结构:');
  items.forEach(item => {
    const itemPath = path.join(currentDir, item);
    const isDir = fs.statSync(itemPath).isDirectory();
    console.log(`${isDir ? '📁' : '📄'} ${item}`);
  });
  
  console.log('\n✅ 接下来可以执行:');
  console.log('1. git add .');
  console.log('2. git commit -m "fix: 调整目录结构为AIPA格式"');
  console.log('3. git push origin main');
  console.log('\n🚀 然后项目将自动部署到Vercel!');
}

// 主函数
function main() {
  try {
    // 检查目录结构
    const needsAdjustment = checkCurrentStructure();
    
    if (!needsAdjustment) {
      console.log('\n✅ 目录结构可能已经正确，或需要手动检查');
      return;
    }
    
    // 移动文件
    const moveSuccess = moveFilesFromSrc();
    
    if (!moveSuccess) {
      console.log('\n❌ 文件移动失败，请手动检查');
      return;
    }
    
    // 删除不需要的文件
    removeUnnecessaryFiles();
    
    // 创建必要文件
    createNecessaryFiles();
    
    // 显示最终状态
    showFinalStatus();
    
  } catch (error) {
    console.error('\n❌ 脚本执行出错:', error.message);
    console.log('\n🔧 请手动检查并调整目录结构');
  }
}

// 运行脚本
main();