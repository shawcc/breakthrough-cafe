import React, { useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => 
  fetch(`${process.env.AIPA_API_DOMAIN}${url}`).then(res => res.json());

export const CacheDebugTool: React.FC = () => {
  const { getContent } = useLanguage();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // 测试不同的SWR查询键
  const testKeys = [
    '/api/articles',
    '/api/articles?limit=50&sortBy=updatedAt&sortOrder=desc',
    '/api/articles?category=&status=&limit=50&sortBy=updatedAt&sortOrder=desc',
    '/api/articles?status=&limit=50&sortBy=updatedAt&sortOrder=desc',
    '/api/articles/68a5e0c157ca66d3949308ca' // 具体的文章ID
  ];

  const runCacheTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('🔍 开始缓存诊断测试...');
    
    const results = [];
    
    for (const key of testKeys) {
      try {
        console.log(`🔍 测试缓存键: ${key}`);
        
        // 获取当前缓存数据
        const cachedData = await fetcher(key);
        
        // 强制刷新缓存
        await mutate(key);
        
        // 再次获取数据
        const freshData = await fetcher(key);
        
        const result = {
          key,
          success: true,
          cachedData: cachedData?.articles?.[0]?.title || cachedData?.title || '无数据',
          freshData: freshData?.articles?.[0]?.title || freshData?.title || '无数据',
          isConsistent: JSON.stringify(cachedData) === JSON.stringify(freshData)
        };
        
        results.push(result);
        console.log(`✅ 测试完成: ${key}`, result);
        
      } catch (error) {
        const result = {
          key,
          success: false,
          error: error.message,
          cachedData: null,
          freshData: null,
          isConsistent: false
        };
        
        results.push(result);
        console.error(`❌ 测试失败: ${key}`, error);
      }
      
      // 每次测试之间添加延迟
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTestResults(results);
    setIsRunning(false);
    console.log('🏁 缓存诊断测试完成', results);
  };

  // 测试文章列表页面实际使用的查询
  const testActualQuery = async () => {
    try {
      console.log('🎯 测试文章列表页面实际查询...');
      
      // 这是文章列表组件实际使用的查询参数
      const actualUrl = '/api/articles?limit=50&sortBy=updatedAt&sortOrder=desc';
      
      console.log('📡 发起实际查询:', actualUrl);
      const response = await fetch(`${process.env.AIPA_API_DOMAIN}${actualUrl}`);
      const data = await response.json();
      
      console.log('📊 实际查询结果:', data);
      
      if (data.articles && data.articles.length > 0) {
        const firstArticle = data.articles[0];
        console.log('🔍 第一篇文章详情:');
        console.log('  - ID:', firstArticle._id);
        console.log('  - 标题:', firstArticle.title);
        console.log('  - 更新时间:', firstArticle.updatedAt);
        
        alert(`实际查询结果:\n\n第一篇文章:\nID: ${firstArticle._id}\n标题: ${JSON.stringify(firstArticle.title, null, 2)}\n更新时间: ${firstArticle.updatedAt}\n\n请查看控制台获取完整信息。`);
      } else {
        alert('没有找到文章数据');
      }
      
    } catch (error) {
      console.error('❌ 实际查询测试失败:', error);
      alert(`查询失败: ${error.message}`);
    }
  };

  // 强制清除所有缓存
  const clearAllCache = async () => {
    try {
      console.log('🗑️ 开始清除所有SWR缓存...');
      
      // 清除所有测试键的缓存
      for (const key of testKeys) {
        await mutate(key, undefined, { revalidate: false });
        console.log(`✅ 已清除缓存: ${key}`);
      }
      
      // 清除localStorage中的jotai缓存
      localStorage.removeItem('articles');
      localStorage.removeItem('categories');
      console.log('✅ 已清除localStorage缓存');
      
      // 触发全局刷新事件
      window.dispatchEvent(new CustomEvent('articleUpdated', {
        detail: { action: 'clearCache' }
      }));
      console.log('✅ 已触发全局刷新事件');
      
      alert('已清除所有缓存，请刷新页面验证效果');
      
    } catch (error) {
      console.error('❌ 清除缓存失败:', error);
      alert(`清除缓存失败: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          缓存调试工具
        </h1>
        <p className="text-gray-600 mb-6">
          这个工具用于诊断SWR缓存问题，检查不同查询键的缓存状态。
        </p>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={runCacheTest}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isRunning ? '测试中...' : '🔍 运行缓存测试'}
          </button>
          
          <button
            onClick={testActualQuery}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🎯 测试实际查询
          </button>
          
          <button
            onClick={clearAllCache}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ 清除所有缓存
          </button>
        </div>
      </div>

      {/* 测试结果 */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">测试结果</h2>
          
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.success 
                  ? (result.isConsistent ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200')
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="font-mono text-sm text-gray-600 mb-2">
                  {result.key}
                </div>
                
                {result.success ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">缓存数据:</div>
                        <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                          {typeof result.cachedData === 'object' 
                            ? JSON.stringify(result.cachedData, null, 2)
                            : result.cachedData}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">最新数据:</div>
                        <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                          {typeof result.freshData === 'object' 
                            ? JSON.stringify(result.freshData, null, 2)
                            : result.freshData}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`mt-2 text-sm font-medium ${
                      result.isConsistent ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {result.isConsistent ? '✅ 数据一致' : '⚠️ 数据不一致'}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600 text-sm">
                    ❌ {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};