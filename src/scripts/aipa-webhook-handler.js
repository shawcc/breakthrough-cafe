/**
 * aipa webhook处理器
 * 监听aipa平台的代码变更，自动同步到GitHub
 */

import express from 'express';
import crypto from 'crypto';
import { execSync } from 'child_process';

const app = express();
app.use(express.json());

// aipa webhook处理端点
app.post('/aipa-webhook', async (req, res) => {
  try {
    console.log('🎯 收到aipa平台webhook...');
    
    // 验证webhook签名（如果aipa支持）
    const signature = req.headers['x-aipa-signature'];
    
    // 处理代码更新事件
    if (req.body.event === 'code_updated') {
      console.log('📝 检测到代码更新，开始同步...');
      
      // 下载最新代码
      await downloadFromAipa(req.body.download_url);
      
      // 自动推送到GitHub
      await pushToGitHub();
      
      res.status(200).json({ status: 'success', message: '同步完成' });
    }
    
  } catch (error) {
    console.error('❌ Webhook处理失败:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

async function downloadFromAipa(downloadUrl) {
  // 实现从aipa平台下载最新代码的逻辑
  console.log('📥 从aipa下载最新代码...');
}

async function pushToGitHub() {
  // 自动推送到GitHub
  console.log('📤 推送到GitHub...');
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "🔄 Auto sync from aipa platform"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 aipa webhook监听器运行在端口 ${PORT}`);
});
