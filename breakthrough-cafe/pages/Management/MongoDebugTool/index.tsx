import React, { useState } from 'react';
import { useArticleManagement } from '../../../hooks/useArticleManagement';

export const MongoDebugTool: React.FC = () => {
  const { isAuthenticated } = useArticleManagement();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runMongoTest = async () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      // 测试文章ID
      const testArticleId = '68a5e3f370386a003110d6a7';
      
      console.log('🔧 开始MongoDB更新诊断测试');
      console.log('🌐 API域名:', process.env.AIPA_API_DOMAIN);
      console.log('🔑 认证状态:', isAuthenticated);
      
      // 1. 获取文章当前状态
      console.log('📋 步骤1: 获取当前文章状态');
      const getUrl = `${process.env.AIPA_API_DOMAIN}/api/articles/${testArticleId}`;
      console.log('🌐 GET URL:', getUrl);
      
      const getResponse = await fetch(getUrl);
      console.log('📡 GET响应状态:', getResponse.status, getResponse.statusText);
      
      if (!getResponse.ok) {
        throw new Error(`获取文章失败: ${getResponse.status} ${getResponse.statusText}`);
      }
      
      const currentArticle = await getResponse.json();
      console.log('✅ 当前文章:', currentArticle);
      
      setResults(prev => [...prev, {
        step: '步骤1: 获取当前状态',
        success: true,
        data: {
          id: currentArticle._id,
          title: currentArticle.title?.zh || 'No title',
          status: currentArticle.status,
          updatedAt: currentArticle.updatedAt
        }
      }]);

      // 2. 执行PUT更新（简单数据）
      console.log('📋 步骤2: 执行简单PUT更新测试');
      const simpleUpdateData = {
        status: currentArticle.status === 'draft' ? 'published' : 'draft',
        title: currentArticle.title,
        excerpt: currentArticle.excerpt,
        content: currentArticle.content,
        category: currentArticle.category,
        tags: currentArticle.tags || [],
        readTime: currentArticle.readTime,
        isFeatured: Boolean(currentArticle.isFeatured),
        author: currentArticle.author || '测试作者'
      };

      console.log('🔄 发送PUT请求，数据:', simpleUpdateData);
      
      const putUrl = `${process.env.AIPA_API_DOMAIN}/api/articles/${testArticleId}`;
      const authToken = localStorage.getItem('management_auth');
      console.log('🌐 PUT URL:', putUrl);
      console.log('🔑 Auth Token:', authToken ? '存在' : '不存在');
      
      const putResponse = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(simpleUpdateData)
      });

      console.log('📡 PUT响应状态:', putResponse.status, putResponse.statusText);
      
      let putResult;
      try {
        putResult = await putResponse.json();
        console.log('📋 PUT响应数据:', putResult);
      } catch (e) {
        console.error('❌ PUT响应解析失败:', e);
        putResult = { error: 'JSON解析失败', rawStatus: putResponse.status };
      }
      
      setResults(prev => [...prev, {
        step: '步骤2: PUT更新请求',
        success: putResponse.ok,
        data: {
          status: putResponse.status,
          statusText: putResponse.statusText,
          url: putUrl,
          hasAuth: !!authToken,
          responseData: putResult
        }
      }]);

      // 3. 再次获取文章状态验证
      console.log('📋 步骤3: 验证更新结果');
      const verifyResponse = await fetch(getUrl);
      console.log('📡 验证响应状态:', verifyResponse.status);
      
      if (!verifyResponse.ok) {
        throw new Error(`验证获取文章失败: ${verifyResponse.status}`);
      }
      
      const verifyArticle = await verifyResponse.json();
      console.log('✅ 验证文章:', verifyArticle);
      
      setResults(prev => [...prev, {
        step: '步骤3: 验证更新结果',
        success: true,
        data: {
          id: verifyArticle._id,
          title: verifyArticle.title?.zh || 'No title',
          oldStatus: currentArticle.status,
          newStatus: verifyArticle.status,
          statusChanged: currentArticle.status !== verifyArticle.status,
          oldUpdatedAt: currentArticle.updatedAt,
          newUpdatedAt: verifyArticle.updatedAt,
          timeChanged: currentArticle.updatedAt !== verifyArticle.updatedAt
        }
      }]);

      // 4. 直接数据库查询测试（通过API）
      console.log('📋 步骤4: 服务端MongoDB查询测试');
      const mongoTestUrl = `${process.env.AIPA_API_DOMAIN}/api/debug/mongo-test`;
      console.log('🌐 MongoDB测试URL:', mongoTestUrl);
      
      const requestBody = {
        articleId: testArticleId,
        status: simpleUpdateData.status
      };
      console.log('📋 MongoDB测试请求体:', requestBody);
      
      const dbTestResponse = await fetch(mongoTestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 MongoDB测试响应状态:', dbTestResponse.status, dbTestResponse.statusText);
      console.log('🌐 完整请求URL:', mongoTestUrl);
      console.log('🔑 使用的认证Token:', authToken ? 'Bearer ' + authToken.substring(0, 10) + '...' : '无');

      let dbTestResult = {};
      if (dbTestResponse.ok) {
        try {
          dbTestResult = await dbTestResponse.json();
          console.log('✅ MongoDB测试成功:', dbTestResult);
        } catch (e) {
          console.error('❌ MongoDB测试响应解析失败:', e);
          dbTestResult = { 
            error: 'JSON解析失败', 
            rawStatus: dbTestResponse.status,
            responseText: await dbTestResponse.text().catch(() => '无法获取响应文本')
          };
        }
      } else {
        console.error('❌ MongoDB测试请求失败');
        
        // 尝试获取错误响应文本
        let errorText = '';
        try {
          errorText = await dbTestResponse.text();
          console.error('错误响应文本:', errorText);
        } catch (e) {
          console.error('无法获取错误响应文本:', e);
        }
        
        // 尝试解析JSON错误
        try {
          dbTestResult = JSON.parse(errorText);
        } catch (e) {
          dbTestResult = { 
            error: '接口不存在或请求失败',
            status: dbTestResponse.status,
            statusText: dbTestResponse.statusText,
            url: mongoTestUrl,
            errorText: errorText,
            possibleCauses: [
              '路由未正确注册',
              '认证失败',
              '网络问题',
              '服务端错误'
            ]
          };
        }
      }
      
      setResults(prev => [...prev, {
        step: '步骤4: MongoDB直接测试',
        success: dbTestResponse.ok,
        data: {
          ...dbTestResult,
          requestInfo: {
            url: mongoTestUrl,
            method: 'POST',
            hasAuth: !!authToken,
            requestBody: requestBody
          }
        }
      }]);

    } catch (error) {
      console.error('❌ MongoDB测试失败:', error);
      setResults(prev => [...prev, {
        step: '错误',
        success: false,
        data: { 
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">请先登录管理后台</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">MongoDB更新诊断工具 v2.0</h1>
        
        <div className="mb-6 flex gap-4">
          <button
            onClick={runMongoTest}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isLoading ? '测试中...' : '开始MongoDB诊断测试'}
          </button>
          
          {results.length > 0 && (
            <button
              onClick={clearResults}
              className="px-6 py-3 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors"
            >
              清除结果
            </button>
          )}
        </div>

        {/* 环境信息 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🔍 环境信息</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>API域名:</strong> {process.env.AIPA_API_DOMAIN || '未设置'}
            </div>
            <div>
              <strong>认证状态:</strong> {isAuthenticated ? '✅ 已认证' : '❌ 未认证'}
            </div>
            <div>
              <strong>Local Token:</strong> {localStorage.getItem('management_auth') ? '✅ 存在' : '❌ 不存在'}
            </div>
            <div>
              <strong>测试文章ID:</strong> 68a5e3f370386a003110d6a7
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">测试结果</h2>
            
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? '✅' : '❌'} {result.step}
                </h3>
                
                <div className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};