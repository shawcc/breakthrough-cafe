/**
 * 选择功能调试工具
 * 专门测试文章列表页面的选择下拉框问题
 */

import React, { useState } from 'react';
import { useCategories } from '../../../hooks/useArticles';

export const SelectionDebugTool: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [testLog, setTestLog] = useState<string[]>([]);
  
  const { categories, isLoading, error } = useCategories();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLog(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleCategoryChange = (value: string) => {
    addLog(`分类选择变更: "${value}"`);
    setSelectedCategory(value);
  };

  const handleStatusChange = (value: string) => {
    addLog(`状态选择变更: "${value}"`);
    setSelectedStatus(value);
  };

  const testSelectBoxes = async () => {
    addLog('=== 开始选择框测试 ===');
    
    // 1. 测试 categories 数据
    addLog(`categories 数据状态:`);
    addLog(`  - 加载中: ${isLoading}`);
    addLog(`  - 错误: ${error ? error.message : '无'}`);
    addLog(`  - 数据类型: ${Array.isArray(categories) ? '数组' : typeof categories}`);
    addLog(`  - 数据长度: ${Array.isArray(categories) ? categories.length : 'N/A'}`);
    
    if (Array.isArray(categories) && categories.length > 0) {
      addLog(`  - 第一个分类: ${JSON.stringify(categories[0])}`);
    } else {
      addLog(`  - 没有分类数据或数据格式错误`);
    }

    // 2. 测试 API 请求
    try {
      addLog('正在测试 categories API...');
      const response = await fetch(`${process.env.AIPA_API_DOMAIN}/api/categories`);
      const data = await response.json();
      addLog(`API 响应状态: ${response.status}`);
      addLog(`API 响应数据: ${JSON.stringify(data, null, 2)}`);
    } catch (apiError) {
      addLog(`API 请求失败: ${apiError.message}`);
    }

    // 3. 测试选择功能
    addLog('测试选择功能...');
    addLog(`当前选择的分类: "${selectedCategory}"`);
    addLog(`当前选择的状态: "${selectedStatus}"`);
    
    addLog('=== 测试完成 ===');
  };

  const clearLog = () => {
    setTestLog([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">选择功能调试工具</h1>
        
        {/* 测试按钮 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={testSelectBoxes}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔍 开始测试
          </button>
          <button
            onClick={clearLog}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            🗑️ 清空日志
          </button>
        </div>

        {/* 原版选择框测试 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 分类选择框 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">分类选择框测试</h3>
            <div className="space-y-3">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">所有分类</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.title?.zh || category.slug}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600">
                当前选择: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedCategory || '(无)'}</span>
              </p>
            </div>
          </div>

          {/* 状态选择框 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">状态选择框测试</h3>
            <div className="space-y-3">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">所有状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
              </select>
              <p className="text-sm text-gray-600">
                当前选择: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedStatus || '(无)'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 简化版选择框测试 */}
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-3">简化版选择框测试</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              onChange={(e) => addLog(`简化分类选择: ${e.target.value}`)}
              className="px-3 py-2 border border-yellow-300 rounded-lg"
            >
              <option value="">选择分类</option>
              <option value="test1">测试分类1</option>
              <option value="test2">测试分类2</option>
            </select>
            
            <select 
              onChange={(e) => addLog(`简化状态选择: ${e.target.value}`)}
              className="px-3 py-2 border border-yellow-300 rounded-lg"
            >
              <option value="">选择状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
          </div>
        </div>

        {/* 数据状态显示 */}
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">数据状态</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Categories 加载状态:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${isLoading ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                {isLoading ? '加载中' : '已完成'}
              </span>
            </div>
            <div>
              <span className="font-medium">Categories 数量:</span>
              <span className="ml-2 font-mono bg-white px-2 py-1 rounded">
                {Array.isArray(categories) ? categories.length : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">错误状态:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${error ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                {error ? '有错误' : '正常'}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
              <span className="text-red-800 text-sm">错误详情: {error.message}</span>
            </div>
          )}
        </div>

        {/* Categories 详细数据 */}
        {Array.isArray(categories) && categories.length > 0 && (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-3">Categories 数据详情</h3>
            <div className="space-y-2 text-sm">
              {categories.map((category, index) => (
                <div key={category._id || index} className="bg-white p-2 rounded border">
                  <span className="font-mono text-xs text-gray-500">#{index + 1}</span>
                  <span className="ml-2">ID: {category._id}</span>
                  <span className="ml-4">Slug: {category.slug}</span>
                  <span className="ml-4">中文标题: {category.title?.zh}</span>
                  <span className="ml-4">英文标题: {category.title?.en}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 测试日志 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">测试日志</h3>
            <span className="text-sm text-gray-500">共 {testLog.length} 条</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
            {testLog.length === 0 ? (
              <p className="text-gray-500 text-sm">暂无日志，点击"开始测试"开始</p>
            ) : (
              <div className="space-y-1">
                {testLog.map((log, index) => (
                  <div key={index} className="text-xs font-mono text-gray-700 border-b border-gray-200 pb-1">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};