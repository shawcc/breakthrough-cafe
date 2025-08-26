/**
 * 数据一致性验证工具
 * 专门用于调试和验证文章数据的一致性问题
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, RefreshCw, Database, Server, Monitor } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useArticles } from '../../../hooks/useArticles';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

export const DataConsistencyTool: React.FC = () => {
  const { getContent } = useLanguage();
  const { articles, mutate } = useArticles({ limit: 10 });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string>('');

  const addResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runComprehensiveTest = async () => {
    if (!selectedArticle) {
      alert('请先选择一篇文章进行测试');
      return;
    }

    setIsRunning(true);
    clearResults();

    try {
      console.log('🧪 === 开始综合数据一致性测试 ===');
      
      // 1. 测试数据库直接查询
      addResult({
        name: '数据库直接查询',
        status: 'success',
        message: '开始测试数据库直接查询...'
      });

      try {
        const dbResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/debug/verify-article`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId: selectedArticle })
        });

        if (!dbResponse.ok) {
          throw new Error(`数据库查询失败: ${dbResponse.status} ${dbResponse.statusText}`);
        }

        const dbData = await dbResponse.json();
        addResult({
          name: '数据库查询结果',
          status: 'success',
          message: `数据库中的标题: ${dbData.databaseData?.title?.zh || '未知'}`,
          data: dbData.databaseData
        });

        // 2. 测试GET API
        addResult({
          name: 'GET API查询',
          status: 'success',
          message: '开始测试GET API查询...'
        });

        const apiResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${selectedArticle}`);
        if (!apiResponse.ok) {
          throw new Error(`GET API失败: ${apiResponse.status} ${apiResponse.statusText}`);
        }

        const apiData = await apiResponse.json();
        addResult({
          name: 'GET API结果',
          status: 'success',
          message: `API返回的标题: ${apiData.title?.zh || '未知'}`,
          data: apiData
        });

        // 3. 对比前端缓存数据
        const frontendArticle = articles.find(a => a._id === selectedArticle);
        addResult({
          name: '前端缓存数据',
          status: 'success',
          message: `前端显示的标题: ${frontendArticle?.title?.zh || '未找到'}`,
          data: frontendArticle
        });

        // 4. 数据一致性检查
        const dbTitle = dbData.databaseData?.title?.zh;
        const apiTitle = apiData.title?.zh;
        const frontendTitle = frontendArticle?.title?.zh;

        const allSame = dbTitle === apiTitle && apiTitle === frontendTitle;

        addResult({
          name: '数据一致性检查',
          status: allSame ? 'success' : 'error',
          message: allSame 
            ? '✅ 所有数据源的标题完全一致' 
            : `❌ 数据不一致 - 数据库: "${dbTitle}", API: "${apiTitle}", 前端: "${frontendTitle}"`,
          data: {
            database: dbTitle,
            api: apiTitle,
            frontend: frontendTitle,
            consistent: allSame
          }
        });

        // 5. 更新时间检查
        const dbTime = new Date(dbData.databaseData?.updatedAt).getTime();
        const apiTime = new Date(apiData.updatedAt).getTime();
        const frontendTime = new Date(frontendArticle?.updatedAt || 0).getTime();

        const timeConsistent = dbTime === apiTime && apiTime === frontendTime;

        addResult({
          name: '更新时间一致性',
          status: timeConsistent ? 'success' : 'warning',
          message: timeConsistent 
            ? '✅ 所有数据源的更新时间一致' 
            : `⚠️ 更新时间不一致 - 数据库: ${new Date(dbTime)}, API: ${new Date(apiTime)}, 前端: ${new Date(frontendTime)}`,
          data: {
            database: dbTime,
            api: apiTime,
            frontend: frontendTime,
            consistent: timeConsistent
          }
        });

      } catch (error) {
        addResult({
          name: '测试执行错误',
          status: 'error',
          message: `测试过程中发生错误: ${error.message}`,
          data: error
        });
      }

    } finally {
      setIsRunning(false);
    }
  };

  const testCacheRefresh = async () => {
    if (!selectedArticle) {
      alert('请先选择一篇文章进行测试');
      return;
    }

    setIsRunning(true);
    
    try {
      console.log('🔄 测试缓存刷新机制...');
      
      addResult({
        name: '缓存刷新测试',
        status: 'success',
        message: '开始测试SWR缓存刷新机制...'
      });

      // 获取刷新前的数据
      const beforeRefresh = articles.find(a => a._id === selectedArticle);
      
      // 执行缓存刷新
      await mutate();
      
      // 等待一段时间让数据更新
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addResult({
        name: '缓存刷新完成',
        status: 'success',
        message: '✅ SWR缓存刷新完成，请检查数据是否更新',
        data: {
          beforeTitle: beforeRefresh?.title?.zh,
          beforeUpdatedAt: beforeRefresh?.updatedAt
        }
      });

    } catch (error) {
      addResult({
        name: '缓存刷新错误',
        status: 'error',
        message: `缓存刷新失败: ${error.message}`,
        data: error
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testArticleUpdate = async () => {
    if (!selectedArticle) {
      alert('请先选择一篇文章进行测试');
      return;
    }

    setIsRunning(true);

    try {
      console.log('📝 测试文章更新流程...');
      
      addResult({
        name: '文章更新测试',
        status: 'success',
        message: '开始测试文章更新流程...'
      });

      // 获取当前文章数据
      const currentArticle = articles.find(a => a._id === selectedArticle);
      if (!currentArticle) {
        throw new Error('找不到指定的文章');
      }

      // 创建测试数据 - 只修改标题
      const testTitle = `测试更新标题-${Date.now()}`;
      const updateData = {
        ...currentArticle,
        title: {
          zh: testTitle,
          en: currentArticle.title.en
        }
      };

      // 移除MongoDB自动字段
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      addResult({
        name: '准备更新数据',
        status: 'success',
        message: `将标题更新为: ${testTitle}`,
        data: { oldTitle: currentArticle.title.zh, newTitle: testTitle }
      });

      // 发送PUT请求
      const updateResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${selectedArticle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer true'
        },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`更新请求失败: ${updateResponse.status} ${errorText}`);
      }

      const updateResult = await updateResponse.json();
      
      addResult({
        name: '更新请求成功',
        status: 'success',
        message: `✅ 服务端返回更新成功，新标题: ${updateResult.title?.zh}`,
        data: updateResult
      });

      // 等待一段时间，然后验证数据
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 强制刷新缓存
      await mutate();
      
      // 再次验证数据一致性
      await runComprehensiveTest();

    } catch (error) {
      addResult({
        name: '文章更新错误',
        status: 'error',
        message: `文章更新失败: ${error.message}`,
        data: error
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            数据一致性验证工具
          </h1>
        </div>
        <p className="text-gray-600">
          用于调试和验证文章数据在数据库、API和前端缓存之间的一致性问题
        </p>
      </div>

      {/* Article Selection */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">选择测试文章</h2>
        <select
          value={selectedArticle}
          onChange={(e) => setSelectedArticle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">请选择一篇文章</option>
          {articles.map((article) => (
            <option key={article._id} value={article._id}>
              {getContent(article.title)} - {article.status} - {new Date(article.updatedAt).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Test Controls */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">测试操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={runComprehensiveTest}
            disabled={isRunning || !selectedArticle}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="w-4 h-4" />
            <span>数据一致性测试</span>
          </button>

          <button
            onClick={testCacheRefresh}
            disabled={isRunning || !selectedArticle}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>缓存刷新测试</span>
          </button>

          <button
            onClick={testArticleUpdate}
            disabled={isRunning || !selectedArticle}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Server className="w-4 h-4" />
            <span>文章更新测试</span>
          </button>

          <button
            onClick={clearResults}
            disabled={isRunning}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Monitor className="w-4 h-4" />
            <span>清空结果</span>
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">测试结果</h2>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${getStatusBg(result.status)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{result.name}</h3>
                    <p className="text-gray-600 mt-1">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                          查看详细数据
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Running Indicator */}
      {isRunning && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-gray-900">正在执行测试，请稍候...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};