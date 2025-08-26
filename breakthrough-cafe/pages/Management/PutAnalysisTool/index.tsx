import React, { useState } from 'react';

interface PutAnalysisResult {
  step: string;
  status: 'success' | 'error' | 'pending';
  data?: any;
  error?: string;
  details?: any;
}

const PutAnalysisTool: React.FC = () => {
  const [articleId, setArticleId] = useState('68a5e0c157ca66d3949308ca');
  const [newTitle, setNewTitle] = useState('111test');
  const [analysisResults, setAnalysisResults] = useState<PutAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addResult = (result: PutAnalysisResult) => {
    setAnalysisResults(prev => [...prev, result]);
  };

  const runPutAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResults([]);

    try {
      // 步骤1: 验证文章存在
      addResult({ step: '步骤1: 验证文章存在', status: 'pending' });
      
      const originalResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`);
      if (!originalResponse.ok) {
        addResult({ 
          step: '步骤1: 验证文章存在', 
          status: 'error', 
          error: `无法获取原文章: ${originalResponse.status}` 
        });
        return;
      }
      
      const originalArticle = await originalResponse.json();
      addResult({ 
        step: '步骤1: 验证文章存在', 
        status: 'success', 
        data: originalArticle,
        details: {
          currentTitle: originalArticle.title?.zh,
          status: originalArticle.status,
          updatedAt: originalArticle.updatedAt
        }
      });

      // 步骤2: 构建更新数据
      addResult({ step: '步骤2: 构建更新数据', status: 'pending' });
      
      const updateData = {
        title: {
          zh: newTitle,
          en: originalArticle.title?.en || 'test'
        },
        excerpt: originalArticle.excerpt,
        content: originalArticle.content,
        category: originalArticle.category,
        tags: originalArticle.tags,
        readTime: originalArticle.readTime,
        isFeatured: originalArticle.isFeatured,
        author: originalArticle.author,
        status: originalArticle.status
      };

      addResult({ 
        step: '步骤2: 构建更新数据', 
        status: 'success', 
        data: updateData,
        details: {
          targetTitle: updateData.title.zh,
          fieldsCount: Object.keys(updateData).length
        }
      });

      // 步骤3: 发送PUT请求
      addResult({ step: '步骤3: 发送PUT请求', status: 'pending' });
      
      console.log('🔥 发送PUT请求:', JSON.stringify(updateData, null, 2));
      
      const putResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        addResult({ 
          step: '步骤3: 发送PUT请求', 
          status: 'error', 
          error: `PUT请求失败: ${putResponse.status} - ${errorText}` 
        });
        return;
      }

      const putResult = await putResponse.json();
      addResult({ 
        step: '步骤3: 发送PUT请求', 
        status: 'success', 
        data: putResult,
        details: {
          responseTitle: putResult.title?.zh,
          responseUpdatedAt: putResult.updatedAt
        }
      });

      // 步骤4: 验证数据库更新
      addResult({ step: '步骤4: 验证数据库更新', status: 'pending' });
      
      // 等待一秒确保数据库更新完成
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const verifyResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/${articleId}?_t=${Date.now()}`);
      if (!verifyResponse.ok) {
        addResult({ 
          step: '步骤4: 验证数据库更新', 
          status: 'error', 
          error: `验证请求失败: ${verifyResponse.status}` 
        });
        return;
      }

      const verifiedArticle = await verifyResponse.json();
      const titleUpdated = verifiedArticle.title?.zh === newTitle;
      const timeUpdated = new Date(verifiedArticle.updatedAt) > new Date(originalArticle.updatedAt);

      addResult({ 
        step: '步骤4: 验证数据库更新', 
        status: titleUpdated ? 'success' : 'error', 
        data: verifiedArticle,
        details: {
          titleUpdated,
          timeUpdated,
          expectedTitle: newTitle,
          actualTitle: verifiedArticle.title?.zh,
          originalTime: originalArticle.updatedAt,
          currentTime: verifiedArticle.updatedAt
        },
        error: titleUpdated ? undefined : '标题未更新成功'
      });

      // 步骤5: 直接数据库测试
      addResult({ step: '步骤5: 直接数据库测试', status: 'pending' });
      
      const directTestResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/debug/basic-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articleId: articleId,
          testField: `test_${Date.now()}`
        })
      });

      if (!directTestResponse.ok) {
        const errorText = await directTestResponse.text();
        addResult({ 
          step: '步骤5: 直接数据库测试', 
          status: 'error', 
          error: `直接测试失败: ${directTestResponse.status} - ${errorText}` 
        });
        return;
      }

      const directTestResult = await directTestResponse.json();
      addResult({ 
        step: '步骤5: 直接数据库测试', 
        status: directTestResult.success ? 'success' : 'error', 
        data: directTestResult,
        error: directTestResult.success ? undefined : '直接数据库更新失败'
      });

    } catch (error) {
      addResult({ 
        step: '分析过程异常', 
        status: 'error', 
        error: error.message 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ResultCard: React.FC<{ result: PutAnalysisResult }> = ({ result }) => {
    const getStatusColor = () => {
      switch (result.status) {
        case 'success': return 'bg-green-50 border-green-200';
        case 'error': return 'bg-red-50 border-red-200';
        case 'pending': return 'bg-yellow-50 border-yellow-200';
        default: return 'bg-gray-50 border-gray-200';
      }
    };

    const getStatusIcon = () => {
      switch (result.status) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'pending': return '⏳';
        default: return '❓';
      }
    };

    return (
      <div className={`border rounded-lg p-4 mb-4 ${getStatusColor()}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <h3 className="font-medium">{result.step}</h3>
        </div>
        
        {result.error && (
          <div className="text-red-600 text-sm mb-2">
            <strong>错误:</strong> {result.error}
          </div>
        )}
        
        {result.details && (
          <div className="bg-white bg-opacity-50 rounded p-2 mb-2">
            <strong>关键信息:</strong>
            <pre className="text-xs mt-1">{JSON.stringify(result.details, null, 2)}</pre>
          </div>
        )}
        
        {result.data && (
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-600">查看完整数据</summary>
            <pre className="mt-2 bg-white bg-opacity-50 p-2 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">PUT 路由分析工具</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">测试参数</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">文章ID</label>
            <input
              type="text"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="文章ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">新标题</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="新的中文标题"
            />
          </div>
        </div>
        
        <button
          onClick={runPutAnalysis}
          disabled={isAnalyzing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isAnalyzing ? '分析中...' : '开始PUT路由分析'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">分析结果</h2>
        
        {analysisResults.length === 0 ? (
          <p className="text-gray-500">点击上方按钮开始分析</p>
        ) : (
          <div>
            {analysisResults.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PutAnalysisTool;