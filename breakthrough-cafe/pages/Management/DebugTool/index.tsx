import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';

export const DebugTool: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testArticleId, setTestArticleId] = useState('');
  const [testStatus, setTestStatus] = useState<'draft' | 'published'>('published');

  // 直接PUT请求测试
  const testDirectPutRequest = async () => {
    if (!testArticleId.trim()) {
      alert('请输入文章ID');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧪 === 开始直接PUT请求测试 ===');
      
      // 1. 构建测试数据
      const testData = {
        status: testStatus,
        title: {
          zh: `测试更新标题-${Date.now()}`,
          en: `Test Update Title-${Date.now()}`
        },
        excerpt: {
          zh: '这是更新测试的摘要内容',
          en: 'This is updated test excerpt content'
        },
        content: {
          zh: '这是更新测试的正文内容，用于验证更新功能',
          en: 'This is updated test content for verifying update functionality'
        },
        category: 'tech',
        tags: ['测试', '更新', 'test', 'update'],
        readTime: {
          zh: '2分钟',
          en: '2 min read'
        },
        author: '调试测试者',
        isFeatured: false
      };

      console.log('📋 测试数据:', JSON.stringify(testData, null, 2));

      // 2. 构建URL
      let apiDomain = process.env.AIPA_API_DOMAIN;
      if (!apiDomain) {
        apiDomain = window.location.origin;
        console.warn('⚠️ AIPA_API_DOMAIN未配置，使用当前域名:', apiDomain);
      }
      apiDomain = apiDomain.replace(/\/$/, '');
      const fullUrl = `${apiDomain}/api/articles/${testArticleId}`;

      console.log('🌐 完整请求URL:', fullUrl);

      // 3. 发送PUT请求
      console.log('📤 发送PUT请求...');
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      console.log('📡 响应状态:', response.status, response.statusText);
      console.log('📡 响应头:', Object.fromEntries(response.headers.entries()));

      // 4. 处理响应
      let responseData: any;
      const responseText = await response.text();
      console.log('📄 原始响应:', responseText);

      try {
        responseData = JSON.parse(responseText);
        console.log('📋 解析后的响应:', responseData);
      } catch (e) {
        console.error('❌ 响应JSON解析失败:', e);
        responseData = { rawResponse: responseText };
      }

      // 5. 记录结果
      const testResult = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
        url: fullUrl,
        requestData: testData,
        responseData,
        logs: {
          urlBuilt: fullUrl,
          requestSent: true,
          responseReceived: true,
          jsonParsed: typeof responseData === 'object'
        }
      };

      setResult(testResult);

      if (response.ok) {
        console.log('✅ PUT请求测试成功！');
        alert('✅ PUT请求测试成功！查看控制台和结果显示');
      } else {
        console.log('❌ PUT请求测试失败');
        alert(`❌ PUT请求失败: ${response.status} ${response.statusText}`);
      }

    } catch (error) {
      console.error('💥 PUT请求测试异常:', error);
      
      const errorResult = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        logs: {
          errorOccurred: true,
          errorMessage: error.message
        }
      };

      setResult(errorResult);
      alert(`💥 PUT请求测试异常: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 测试获取文章列表（确保API连接正常）
  const testGetArticles = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🔍 测试获取文章列表...');
      
      let apiDomain = process.env.AIPA_API_DOMAIN;
      if (!apiDomain) {
        apiDomain = window.location.origin;
      }
      apiDomain = apiDomain.replace(/\/$/, '');
      const fullUrl = `${apiDomain}/api/articles`;

      const response = await fetch(fullUrl);
      const data = await response.json();

      console.log('📋 文章列表:', data);

      setResult({
        success: response.ok,
        method: 'GET',
        url: fullUrl,
        status: response.status,
        data,
        articlesCount: data.articles?.length || 0,
        timestamp: new Date().toISOString()
      });

      alert(`✅ 获取到 ${data.articles?.length || 0} 篇文章`);

    } catch (error) {
      console.error('❌ 获取文章列表失败:', error);
      setResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 测试服务端路由信息
  const testRouteInfo = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🛤️ 测试路由信息...');
      
      let apiDomain = process.env.AIPA_API_DOMAIN;
      if (!apiDomain) {
        apiDomain = window.location.origin;
      }
      apiDomain = apiDomain.replace(/\/$/, '');
      const fullUrl = `${apiDomain}/api/routes`;

      const response = await fetch(fullUrl);
      const data = await response.json();

      console.log('🛤️ 路由信息:', data);

      setResult({
        success: response.ok,
        method: 'GET',
        url: fullUrl,
        status: response.status,
        data,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ 获取路由信息失败:', error);
      setResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/management/articles')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API调试工具</h1>
            <p className="text-gray-600 mt-1">用于测试文章更新功能的专用调试工具</p>
          </div>
        </div>
      </div>

      {/* 测试控制面板 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">测试控制面板</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 文章ID输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测试文章ID（可在文章列表中查看）
            </label>
            <input
              type="text"
              value={testArticleId}
              onChange={(e) => setTestArticleId(e.target.value)}
              placeholder="输入文章ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* 测试状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测试状态更新
            </label>
            <select
              value={testStatus}
              onChange={(e) => setTestStatus(e.target.value as 'draft' | 'published')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={testDirectPutRequest}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>🚨 直接PUT测试</span>
          </button>

          <button
            onClick={testGetArticles}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>📚 获取文章列表</span>
          </button>

          <button
            onClick={testRouteInfo}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-4 h-4" />
            <span>🛤️ 路由信息</span>
          </button>
        </div>

        {isLoading && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">⏳ 测试进行中，请查看控制台输出...</p>
          </div>
        )}
      </div>

      {/* 测试结果显示 */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">测试结果</h2>
          
          {/* 成功/失败状态 */}
          <div className={`p-3 rounded-lg mb-4 ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? '测试成功' : '测试失败'}
              </span>
            </div>
            
            {result.error && (
              <p className="text-red-700 mt-2">错误信息: {result.error}</p>
            )}
          </div>

          {/* 详细结果 */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">基本信息</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>时间:</strong> {result.timestamp}</p>
                {result.url && <p><strong>URL:</strong> {result.url}</p>}
                {result.status && <p><strong>状态码:</strong> {result.status} {result.statusText}</p>}
                {result.method && <p><strong>方法:</strong> {result.method}</p>}
              </div>
            </div>

            {result.data && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">响应数据</h3>
                <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {result.requestData && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">请求数据</h3>
                <pre className="bg-blue-50 p-3 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(result.requestData, null, 2)}
                </pre>
              </div>
            )}

            {result.logs && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">调试日志</h3>
                <pre className="bg-yellow-50 p-3 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(result.logs, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">使用说明</h2>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>1. 获取文章列表:</strong> 测试API连接，获取现有文章及其ID</p>
          <p><strong>2. 路由信息:</strong> 查看服务端注册的所有路由，确认PUT路由是否存在</p>
          <p><strong>3. 直接PUT测试:</strong> 输入文章ID，直接发送PUT请求测试更新功能</p>
          <p><strong>注意:</strong> 所有测试结果会在控制台输出详细日志，请打开开发者工具查看</p>
        </div>
      </div>
    </div>
  );
};