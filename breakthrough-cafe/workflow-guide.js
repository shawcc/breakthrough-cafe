/**
 * 三环境同步工作流程指南
 */

function showWorkflowGuide() {
  console.log('📋 三环境代码同步完整指南\n');
  
  console.log('🌍 三套环境说明:');
  console.log('1. 🎯 aipa平台代码 - 在线编辑器中的代码');
  console.log('2. 💻 本地开发代码 - 您电脑上的代码');
  console.log('3. 🌐 GitHub远程代码 - 远程仓库中的代码');
  console.log('4. 🚀 Vercel部署代码 - 生产环境网站\n');
  
  console.log('🔄 标准同步流程:');
  console.log('aipa平台 → 本地环境 → GitHub仓库 → Vercel部署\n');
  
  console.log('📝 详细操作步骤:\n');
  
  console.log('第一步: aipa → 本地');
  console.log('1. 在aipa编辑器中完成代码修改');
  console.log('2. 确认aipa预览效果正常');
  console.log('3. 导出/下载代码到本地项目目录');
  console.log('4. 解压覆盖现有文件(保留.git目录)\n');
  
  console.log('第二步: 本地 → GitHub');
  console.log('运行同步脚本:');
  console.log('- node sync-complete.js  (推荐)');
  console.log('- node safe-sync.js      (安全模式)');
  console.log('- npm run sync:to-github (如果已配置)\n');
  
  console.log('第三步: GitHub → Vercel');
  console.log('- Vercel自动检测GitHub变更');
  console.log('- 自动触发重新部署');
  console.log('- 等待3-5分钟完成部署\n');
  
  console.log('🛠️ 可用命令:');
  console.log('- node sync-from-aipa.js   # 第一步指导');
  console.log('- node sync-complete.js    # 完整同步');
  console.log('- node workflow-guide.js   # 显示本指南');
  console.log('- node safe-sync.js        # 安全同步模式');
  console.log('- node rollback.js         # Git版本回退\n');
  
  console.log('⚠️ 注意事项:');
  console.log('- 每次修改都应该先在aipa平台完成');
  console.log('- 确保aipa导出的代码是最新版本');
  console.log('- 同步前先备份本地重要修改');
  console.log('- 遇到冲突时优先使用强制推送');
  console.log('- 部署后清除浏览器缓存验证效果\n');
  
  console.log('🎯 快速开始:');
  console.log('1. 从aipa导出最新代码到本地');
  console.log('2. 运行: node sync-complete.js');
  console.log('3. 等待部署完成并验证网站\n');
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  showWorkflowGuide();
}

export { showWorkflowGuide };
