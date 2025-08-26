import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../../../hooks/useArticles';

const DirectMongoTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const { 
    articles,
    total,
    isLoading: articlesLoading,
    error: articlesError,
    ...rest
  } = useArticles({ limit: 20 }); // 增加获取的文章数量

  // 调试：输出articles数据
  console.log('🔍 DirectMongoTest useArticles 调试信息:', {
    articles,
    articlesLength: articles?.length,
    articlesType: typeof articles,
    articlesIsArray: Array.isArray(articles),
    total,
    articlesLoading,
    articlesError,
    rest
  });

  // 获取选中的文章信息
  const selectedArticle = articles?.find(article => article._id === selectedArticleId);

  // 直接MongoDB updateOne测试
  const testDirectUpdate = async (articleId: string, newStatus: string) => {
    try {
      setIsLoading(true);
      console.log('🔧 开始直接MongoDB测试');
      
      const response = await fetch(`${process.env.AIPA_API_DOMAIN || ''}/api/articles/debug/direct-mongo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articleId,
          operation: 'updateStatus',
          newStatus
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      setTestResults(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        test: 'Direct MongoDB Update',
        articleId,
        newStatus,
        result,
        success: result.success
      }, ...prev]);
      
    } catch (error) {
      setTestResults(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        test: 'Direct MongoDB Update',
        articleId,
        newStatus,
        error: error.message,
        success: false
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  // 测试collection.updateOne基础操作
  const testBasicUpdateOne = async (articleId: string) => {
    try {
      setIsLoading(true);
      console.log('🔧 开始基础updateOne测试');
      
      const response = await fetch(`${process.env.AIPA_API_DOMAIN || ''}/api/articles/debug/basic-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articleId,
          testField: `test_${Date.now()}`
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      setTestResults(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        test: 'Basic updateOne Test',
        articleId,
        result,
        success: result.success
      }, ...prev]);
      
    } catch (error) {
      setTestResults(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        test: 'Basic updateOne Test',
        articleId,
        error: error.message,
        success: false
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // 快速测试按钮
  const handleQuickTest = (testType: 'status' | 'basic') => {
    if (!selectedArticleId) {
      alert('请先选择一篇文章');
      return;
    }

    if (testType === 'status') {
      const newStatus = selectedArticle?.status === 'published' ? 'draft' : 'published';
      testDirectUpdate(selectedArticleId, newStatus);
    } else {
      testBasicUpdateOne(selectedArticleId);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/management/dashboard" 
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← 返回管理后台
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          直接MongoDB测试工具
        </h1>
        <p className="text-gray-600">
          绕过PUT路由，直接测试MongoDB数据库操作
        </p>
      </div>

      {/* 调试信息面板 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">📊 数据加载状态调试</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>加载状态:</strong> {articlesLoading ? '⏳ 加载中' : '✅ 已完成'}
          </div>
          <div>
            <strong>文章数量:</strong> {articles?.length || 0}
          </div>
          <div>
            <strong>总数:</strong> {total || 0}
          </div>
          <div>
            <strong>错误信息:</strong> {articlesError ? articlesError.message : '无'}
          </div>
          <div>
            <strong>数据类型:</strong> {Array.isArray(articles) ? '数组' : typeof articles}
          </div>
          <div>
            <strong>文章数据存在:</strong> {articles ? '是' : '否'}
          </div>
        </div>
        
        {/* 显示前3篇文章的简要信息 */}
        {articles && articles.length > 0 && (
          <div className="mt-3 pt-3 border-t border-yellow-300">
            <strong>前3篇文章预览:</strong>
            <div className="mt-1 space-y-1">
              {articles.slice(0, 3).map((article, index) => (
                <div key={index} className="text-xs text-gray-600">
                  {index + 1}. ID: {article._id?.slice(-8)}... | 标题: {article.title?.zh || '无标题'} | 状态: {article.status}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 文章选择器 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">选择测试文章</h2>
        
        <div className="mb-4">
          <label htmlFor="article-select" className="block text-sm font-medium text-gray-700 mb-2">
            选择文章:
          </label>
          <select
            id="article-select"
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- 请选择一篇文章 --</option>
            {Array.isArray(articles) && articles.map((article) => (
              <option key={article._id} value={article._id}>
                {article.title?.zh || '无标题'} ({article.status})
              </option>
            ))}
          </select>
          
          {/* 下拉框调试信息 */}
          <div className="mt-2 text-xs text-gray-500">
            选项数量: {Array.isArray(articles) ? articles.length : 0} | 
            加载状态: {articlesLoading ? '加载中' : '完成'} | 
            选中ID: {selectedArticleId || '无'}
          </div>
        </div>

        {/* 选中文章的详细信息 */}
        {selectedArticle && (
          <div className="mb-4 p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">选中文章信息:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ID:</strong> {selectedArticle._id}
              </div>
              <div>
                <strong>标题:</strong> {selectedArticle.title?.zh || 'N/A'}
              </div>
              <div>
                <strong>当前状态:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  selectedArticle.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedArticle.status}
                </span>
              </div>
              <div>
                <strong>分类:</strong> {selectedArticle.category || 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* 测试按钮 */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleQuickTest('status')}
            disabled={isLoading || !selectedArticleId}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            测试状态切换 ({selectedArticle?.status === 'published' ? '→ draft' : '→ published'})
          </button>
          <button
            onClick={() => handleQuickTest('basic')}
            disabled={isLoading || !selectedArticleId}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            基础updateOne测试
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            清空结果
          </button>
        </div>
      </div>

      {/* 全部文章列表（作为参考） */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <details>
          <summary className="text-lg font-semibold cursor-pointer">
            全部可用文章 ({articles?.length || 0}篇)
          </summary>
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            {Array.isArray(articles) && articles.map((article) => (
              <div key={article._id} className="border rounded p-3 bg-gray-50 text-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div><strong>标题:</strong> {article.title?.zh || 'N/A'}</div>
                    <div><strong>ID:</strong> {article._id}</div>
                    <div>
                      <strong>状态:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedArticleId(article._id)}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    选择此文章
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* 测试结果 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">测试结果</h2>
        
        {isLoading && (
          <div className="text-blue-600 mb-4">⏳ 测试进行中...</div>
        )}
        
        {testResults.length === 0 ? (
          <p className="text-gray-500">暂无测试结果</p>
        ) : (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`border rounded p-4 ${
                  result.success 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">
                    {result.success ? '✅' : '❌'} {result.test}
                  </span>
                  <span className="text-sm text-gray-500">
                    {result.timestamp}
                  </span>
                </div>
                
                {result.articleId && (
                  <div className="text-sm mb-1">
                    <strong>文章ID:</strong> {result.articleId}
                  </div>
                )}
                
                {result.newStatus && (
                  <div className="text-sm mb-1">
                    <strong>目标状态:</strong> {result.newStatus}
                  </div>
                )}
                
                {result.error && (
                  <div className="text-sm text-red-600 mb-1">
                    <strong>错误:</strong> {result.error}
                  </div>
                )}
                
                {result.result && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600">
                      查看详细结果
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMongoTest;