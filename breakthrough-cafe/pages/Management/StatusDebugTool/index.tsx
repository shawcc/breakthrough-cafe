import React, { useState } from 'react';

interface DebugResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const StatusDebugTool: React.FC = () => {
  const [articleId, setArticleId] = useState('68a5e3f370386a003110d6a7');
  const [targetStatus, setTargetStatus] = useState<'draft' | 'published'>('published');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (step: string, result: DebugResult) => {
    setResults(prev => [...prev, { 
      step, 
      timestamp: new Date().toISOString(),
      ...result 
    }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runStatusTest = async () => {
    setIsLoading(true);
    clearResults();
    
    try {
      // 步骤1: 获取当前文章状态
      addResult('步骤1: 获取当前文章状态', { success: true, data: '开始测试...' });
      
      const currentResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`);
      const currentArticle = await currentResponse.json();
      
      addResult('步骤1: 获取当前文章状态', { 
        success: true, 
        data: {
          id: currentArticle._id,
          title: currentArticle.title?.zh,
          status: currentArticle.status,
          updatedAt: currentArticle.updatedAt
        }
      });

      // 步骤2: 执行PUT更新（只更新状态）
      addResult('步骤2: 执行PUT更新', { success: true, data: '准备发送PUT请求...' });
      
      const updateData = {
        status: targetStatus,
        title: currentArticle.title,
        excerpt: currentArticle.excerpt,
        content: currentArticle.content,
        category: currentArticle.category,
        tags: currentArticle.tags,
        readTime: currentArticle.readTime,
        isFeatured: currentArticle.isFeatured,
        author: currentArticle.author
      };
      
      addResult('步骤2: 执行PUT更新', { 
        success: true, 
        data: {
          targetStatus,
          updateData: JSON.stringify(updateData, null, 2)
        }
      });
      
      const putResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer true`
        },
        body: JSON.stringify(updateData)
      });
      
      addResult('步骤2: 执行PUT更新', { 
        success: true, 
        data: {
          status: putResponse.status,
          statusText: putResponse.statusText,
          ok: putResponse.ok
        }
      });
      
      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        addResult('步骤2: PUT请求失败', { 
          success: false, 
          error: `HTTP ${putResponse.status}: ${errorText}` 
        });
        return;
      }
      
      const putResult = await putResponse.json();
      addResult('步骤2: PUT请求成功', { 
        success: true, 
        data: {
          id: putResult._id,
          title: putResult.title?.zh,
          oldStatus: currentArticle.status,
          newStatus: putResult.status,
          updated: currentArticle.status !== putResult.status
        }
      });

      // 步骤3: 再次获取验证数据库状态
      addResult('步骤3: 再次获取验证数据库状态', { success: true, data: '验证更新结果...' });
      
      const verifyResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`);
      const verifiedArticle = await verifyResponse.json();
      
      addResult('步骤3: 验证结果', { 
        success: true, 
        data: {
          id: verifiedArticle._id,
          title: verifiedArticle.title?.zh,
          status: verifiedArticle.status,
          updatedAt: verifiedArticle.updatedAt,
          isUpdated: currentArticle.updatedAt !== verifiedArticle.updatedAt
        }
      });

      // 步骤4: MongoDB直接测试
      addResult('步骤4: MongoDB直接测试', { success: true, data: '测试MongoDB原生更新...' });
      
      try {
        const mongoResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/debug/mongo-test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            articleId: articleId,
            status: targetStatus
          })
        });
        
        if (mongoResponse.ok) {
          const mongoResult = await mongoResponse.json();
          addResult('步骤4: MongoDB测试成功', { 
            success: true, 
            data: mongoResult 
          });
        } else {
          const errorText = await mongoResponse.text();
          let errorObj;
          try {
            errorObj = JSON.parse(errorText);
          } catch {
            errorObj = { error: errorText };
          }
          addResult('步骤4: MongoDB测试失败', { 
            success: false, 
            error: errorObj.error || errorText
          });
        }
      } catch (mongoError) {
        addResult('步骤4: MongoDB测试异常', { 
          success: false, 
          error: mongoError.message 
        });
      }
      
      // 最终结论
      const wasSuccessful = verifiedArticle.status === targetStatus;
      addResult('最终结论', {
        success: wasSuccessful,
        data: wasSuccessful ? 
          `✅ 数据库更新成功！状态已正确更新为 ${targetStatus}` :
          `❌ 数据库更新失败！状态仍为 ${verifiedArticle.status}，期望 ${targetStatus}`
      });
      
    } catch (error) {
      addResult('整体测试异常', { 
        success: false, 
        error: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">状态更新调试工具</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">测试参数</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章ID
              </label>
              <input
                type="text"
                value={articleId}
                onChange={(e) => setArticleId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入文章ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标状态
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">草稿 (draft)</option>
                <option value="published">已发布 (published)</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={runStatusTest}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '测试中...' : '开始测试'}
            </button>
            
            <button
              onClick={clearResults}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              清除结果
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">测试结果</h2>
          
          {results.length === 0 ? (
            <p className="text-gray-500">暂无测试结果</p>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.success 
                      ? 'bg-green-50 border-green-400' 
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {result.step}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {result.error && (
                    <p className="text-red-600 mb-2">❌ {result.error}</p>
                  )}
                  
                  {result.data && (
                    <div className="text-sm">
                      {typeof result.data === 'string' ? (
                        <p className="text-gray-700">{result.data}</p>
                      ) : (
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};