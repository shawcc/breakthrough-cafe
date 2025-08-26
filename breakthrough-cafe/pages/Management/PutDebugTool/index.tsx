import React, { useState } from 'react';

const PutDebugTool: React.FC = () => {
  const [articleId, setArticleId] = useState('68a5e3f370386a003110d6a7'); // 测试文章ID
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPutRoute = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 === PUT路由深度调试开始 ===');
      
      // 1. 先获取原始文章数据
      const getUrl = `${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`;
      console.log('🔍 Step 1: 获取原始文章');
      console.log('GET URL:', getUrl);
      
      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer true',
          'Content-Type': 'application/json',
        }
      });
      
      const originalArticle = await getResponse.json();
      console.log('📋 原始文章数据:', originalArticle);
      
      // 2. 创建测试更新数据 - 切换状态
      const newStatus = originalArticle.status === 'draft' ? 'published' : 'draft';
      const testData = {
        ...originalArticle,
        status: newStatus,
        title: {
          zh: originalArticle.title.zh + ' [调试更新]',
          en: originalArticle.title.en + ' [Debug Update]'
        }
      };
      
      // 清理MongoDB不需要的字段
      delete testData._id;
      delete testData.createdAt;
      delete testData.updatedAt;
      delete testData.views;
      delete testData.publishedAt;
      
      console.log('🔄 Step 2: 准备PUT更新');
      console.log('新状态:', newStatus);
      console.log('PUT数据:', testData);
      
      // 3. 执行PUT请求
      const putUrl = `${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`;
      console.log('🚀 Step 3: 执行PUT请求');
      console.log('PUT URL:', putUrl);
      
      const putResponse = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      console.log('📡 PUT响应状态:', putResponse.status);
      console.log('📡 PUT响应状态文本:', putResponse.statusText);
      
      const putResult = await putResponse.json();
      console.log('📋 PUT响应数据:', putResult);
      
      // 4. 重新获取文章验证更新
      console.log('🔍 Step 4: 验证更新结果');
      const verifyResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer true',
          'Content-Type': 'application/json',
        }
      });
      
      const updatedArticle = await verifyResponse.json();
      console.log('📋 更新后文章数据:', updatedArticle);
      
      // 5. 比较前后差异
      const comparison = {
        original: {
          status: originalArticle.status,
          title_zh: originalArticle.title.zh,
          updatedAt: originalArticle.updatedAt
        },
        updated: {
          status: updatedArticle.status,
          title_zh: updatedArticle.title.zh,
          updatedAt: updatedArticle.updatedAt
        },
        success: updatedArticle.status === newStatus,
        titleChanged: updatedArticle.title.zh !== originalArticle.title.zh
      };
      
      console.log('📊 数据对比结果:', comparison);
      
      setTestResult({
        success: putResponse.ok,
        statusCode: putResponse.status,
        originalArticle,
        putResult,
        updatedArticle,
        comparison,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ PUT调试测试失败:', error);
      setTestResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          PUT路由深度调试工具
        </h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            测试文章ID:
          </label>
          <input
            type="text"
            value={articleId}
            onChange={(e) => setArticleId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="输入要测试的文章ID"
          />
        </div>
        
        <button
          onClick={testPutRoute}
          disabled={loading || !articleId}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 测试中...' : '🧪 开始PUT路由深度测试'}
        </button>
        
        {testResult && (
          <div className="mt-8">
            <div className={`p-4 rounded-md mb-4 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className="font-semibold text-lg mb-2">
                {testResult.success ? '✅ 测试完成' : '❌ 测试失败'}
              </h3>
              <p className="text-sm text-gray-600">
                时间: {testResult.timestamp}
              </p>
              {testResult.statusCode && (
                <p className="text-sm">
                  HTTP状态码: {testResult.statusCode}
                </p>
              )}
            </div>
            
            {testResult.comparison && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-2">📊 关键数据对比</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>更新前:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>状态: {testResult.comparison.original.status}</li>
                      <li>标题: {testResult.comparison.original.title_zh}</li>
                      <li>更新时间: {testResult.comparison.original.updatedAt}</li>
                    </ul>
                  </div>
                  <div>
                    <strong>更新后:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>状态: {testResult.comparison.updated.status}</li>
                      <li>标题: {testResult.comparison.updated.title_zh}</li>
                      <li>更新时间: {testResult.comparison.updated.updatedAt}</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className={`inline-block px-2 py-1 rounded text-sm ${testResult.comparison.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    状态更新: {testResult.comparison.success ? '✅ 成功' : '❌ 失败'}
                  </div>
                  <div className={`inline-block ml-2 px-2 py-1 rounded text-sm ${testResult.comparison.titleChanged ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    标题更新: {testResult.comparison.titleChanged ? '✅ 成功' : '❌ 失败'}
                  </div>
                </div>
              </div>
            )}
            
            {testResult.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                <h4 className="font-semibold text-red-800 mb-2">错误信息:</h4>
                <p className="text-sm text-red-700">{testResult.error}</p>
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                📋 查看详细数据 (点击展开)
              </summary>
              <div className="mt-2">
                <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-h-96">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default PutDebugTool;