import React, { useState } from 'react';
import { useSimpleAuth } from '../../../hooks/useSimpleAuth';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

interface DatabaseDebugToolProps {}

const DatabaseDebugTool: React.FC<DatabaseDebugToolProps> = () => {
  const { isAuthenticated } = useSimpleAuth();
  const [articleId, setArticleId] = useState('68a5e3f370386a003110d6a7');
  const [newStatus, setNewStatus] = useState<'draft' | 'published'>('published');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (level: LogEntry['level'], message: string, data?: any) => {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    setLogs(prev => [...prev, log]);
    console.log(`[${level.toUpperCase()}] ${message}`, data || '');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // 直接数据库更新测试
  const testDirectDatabaseUpdate = async () => {
    setIsLoading(true);
    clearLogs();
    
    try {
      addLog('info', '🔧 开始直接数据库更新测试');
      addLog('info', '目标文章ID', articleId);
      addLog('info', '目标状态', newStatus);

      // 先获取当前状态
      addLog('info', '📋 步骤1: 获取当前文章状态');
      const getCurrentResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${isAuthenticated}`,
          'Content-Type': 'application/json'
        }
      });

      if (!getCurrentResponse.ok) {
        throw new Error(`获取文章失败: ${getCurrentResponse.status}`);
      }

      const currentArticle = await getCurrentResponse.json();
      addLog('info', '当前文章数据', {
        id: currentArticle._id,
        title: currentArticle.title?.zh,
        status: currentArticle.status,
        updatedAt: currentArticle.updatedAt
      });

      // 执行PUT更新
      addLog('info', '📋 步骤2: 执行PUT更新');
      const updateData = {
        status: newStatus,
        title: currentArticle.title,
        excerpt: currentArticle.excerpt,
        content: currentArticle.content,
        category: currentArticle.category,
        tags: currentArticle.tags,
        readTime: currentArticle.readTime,
        isFeatured: currentArticle.isFeatured,
        author: currentArticle.author
      };

      addLog('info', '更新数据', updateData);

      const updateResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${isAuthenticated}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      addLog('info', 'PUT响应状态', {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        ok: updateResponse.ok
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`PUT请求失败: ${updateResponse.status} - ${errorText}`);
      }

      const updatedArticle = await updateResponse.json();
      addLog('success', 'PUT请求成功', {
        id: updatedArticle._id,
        title: updatedArticle.title?.zh,
        oldStatus: currentArticle.status,
        newStatus: updatedArticle.status,
        updated: updatedArticle.status !== currentArticle.status
      });

      // 再次获取验证
      addLog('info', '📋 步骤3: 再次获取验证数据库状态');
      const verifyResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${isAuthenticated}`,
          'Content-Type': 'application/json'
        }
      });

      const verifiedArticle = await verifyResponse.json();
      addLog('info', '验证结果', {
        id: verifiedArticle._id,
        title: verifiedArticle.title?.zh,
        status: verifiedArticle.status,
        updatedAt: verifiedArticle.updatedAt,
        isUpdated: verifiedArticle.status === newStatus
      });

      if (verifiedArticle.status === newStatus) {
        addLog('success', '✅ 数据库更新成功！状态已正确更新');
      } else {
        addLog('error', '❌ 数据库更新失败！状态未更新', {
          expected: newStatus,
          actual: verifiedArticle.status
        });
      }

    } catch (error: any) {
      addLog('error', '❌ 测试过程中发生错误', {
        message: error.message,
        stack: error.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 测试列表API缓存
  const testListAPICache = async () => {
    setIsLoading(true);
    clearLogs();

    try {
      addLog('info', '🔍 测试列表API缓存状态');
      
      const listResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles?limit=50&sortBy=updatedAt&sortOrder=desc`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${isAuthenticated}`,
          'Content-Type': 'application/json'
        }
      });

      if (!listResponse.ok) {
        throw new Error(`列表请求失败: ${listResponse.status}`);
      }

      const listData = await listResponse.json();
      const targetArticle = listData.articles.find((article: any) => article._id === articleId);

      addLog('info', '列表API结果', {
        totalArticles: listData.articles.length,
        targetFound: !!targetArticle
      });

      if (targetArticle) {
        addLog('info', '目标文章在列表中的状态', {
          id: targetArticle._id,
          title: targetArticle.title?.zh,
          status: targetArticle.status,
          updatedAt: targetArticle.updatedAt
        });
      } else {
        addLog('warning', '目标文章未在列表中找到');
      }

    } catch (error: any) {
      addLog('error', '❌ 列表API测试失败', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="p-4">请先登录</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">数据库更新调试工具</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">测试参数</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">文章ID</label>
            <input
              type="text"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="请输入文章ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">目标状态</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>
        </div>

        <div className="space-x-4">
          <button
            onClick={testDirectDatabaseUpdate}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '执行中...' : '测试数据库直接更新'}
          </button>
          
          <button
            onClick={testListAPICache}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? '执行中...' : '测试列表API缓存'}
          </button>
          
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            清除日志
          </button>
        </div>
      </div>

      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">调试日志</h3>
          <div className="text-xs text-gray-400">共 {logs.length} 条日志</div>
        </div>
        
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">暂无日志，请执行测试</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-gray-500 text-xs">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                <span className={`
                  ${log.level === 'success' ? 'text-green-400' : ''}
                  ${log.level === 'error' ? 'text-red-400' : ''}
                  ${log.level === 'warning' ? 'text-yellow-400' : ''}
                  ${log.level === 'info' ? 'text-blue-400' : ''}
                `}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="flex-1">{log.message}</span>
                {log.data && (
                  <span className="text-gray-400 text-xs">
                    {typeof log.data === 'string' ? log.data : JSON.stringify(log.data)}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">使用说明</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 此工具用于诊断数据库更新是否真正生效</li>
          <li>• "测试数据库直接更新" 会执行完整的更新流程并验证结果</li>
          <li>• "测试列表API缓存" 检查列表API中是否显示最新数据</li>
          <li>• 如果数据库更新失败，会显示详细的错误信息</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseDebugTool;