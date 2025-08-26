/**
 * 文章管理Hook
 * 处理文章的创建、更新、删除等管理操作
 * 🔥 优化版本 - 标准SWR刷新模式
 * ✅ 修复React错误#185 - 添加组件挂载状态检查
 * ✅ 修复认证状态管理 - 统一认证逻辑
 */

import { useRef, useCallback } from 'react';
import { mutate } from 'swr';
import { useSimpleAuth } from './useSimpleAuth';
import type { Article } from '../shared/types/article';

// API基础URL
const API_BASE = process.env.AIPA_API_DOMAIN;

// 请求头工厂函数
const getHeaders = (isAuthenticated: boolean, withAuth: boolean = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };
  
  if (withAuth && isAuthenticated) {
    // 🔥 修复认证头 - 使用统一的认证标识
    headers['Authorization'] = `Bearer true`;
  }
  
  return headers;
};

// 通用API请求函数
const apiRequest = async (url: string, options: RequestInit = {}) => {
  console.log('🌐 API请求详情:');
  console.log(`  - 完整URL: ${API_BASE}${url}`);
  console.log(`  - 请求方法: ${options.method || 'GET'}`);
  
  if (options.headers) {
    console.log(`  - 请求头: ${JSON.stringify(options.headers)}`);
  }
  
  if (options.body) {
    console.log(`  - 请求体大小: ${(options.body as string).length} 字符`);
    console.log(`  - 请求体内容: ${options.body}`);
    try {
      const parsedBody = JSON.parse(options.body as string);
      console.log(`  - 解析后的请求体: ${JSON.stringify(parsedBody)}`);
    } catch (e) {
      // 忽略解析错误
    }
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    cache: 'no-cache',
  });

  console.log('📡 响应详情:');
  console.log(`  - 状态码: ${response.status}`);
  console.log(`  - 状态文本: ${response.statusText}`);
  console.log(`  - 响应头: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API请求失败: ${response.status} ${response.statusText}`);
    console.error(`错误详情: ${errorText}`);
    
    let errorMessage = `请求失败: ${response.status}`;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('✅ 成功响应:', data);
  
  return data;
};

export const useArticleManagement = () => {
  // 🔥 使用统一的认证系统
  const auth = useSimpleAuth();

  // ✅ 添加组件挂载状态检查
  const isMountedRef = useRef(true);

  // 🔥 标准SWR刷新函数 - 简化但有效的方式
  const triggerDataRefresh = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('🔄 === 开始标准数据刷新 ===');
    
    // 1. 使用SWR的全局mutate刷新所有相关数据
    mutate(
      key => typeof key === 'string' && key.includes('/api/articles'),
      undefined,
      { revalidate: true }
    );
    
    mutate(
      key => typeof key === 'string' && key.includes('/api/categories'),
      undefined,
      { revalidate: true }
    );
    
    // 2. 触发全局事件通知其他组件
    const refreshEvent = new CustomEvent('articleUpdated', { 
      detail: { timestamp: Date.now(), action: 'data-refresh' } 
    });
    window.dispatchEvent(refreshEvent);
    
    console.log('✅ 标准数据刷新完成');
  }, []);

  // 检查认证状态
  const checkAuth = useCallback(() => {
    console.log('✅ 认证检查通过');
    
    if (!auth.isAuthenticated) {
      console.error('❌ 用户未认证');
      throw new Error('会话已过期，请重新登录');
    }
    
    console.log('✅ 认证检查通过');
    return true;
  }, [auth.isAuthenticated]);

  // 创建文章
  const createArticle = useCallback(async (articleData: Omit<Article, '_id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    console.log('🚀 开始创建文章流程');
    console.log('🔐 当前认证状态:', auth);
    
    checkAuth();

    try {
      console.log('📋 表单数据:', articleData);

      const response = await apiRequest('/api/articles', {
        method: 'POST',
        headers: getHeaders(auth.isAuthenticated),
        body: JSON.stringify(articleData)
      });

      console.log('✅ 创建完成，结果:', response);
      
      // 🔄 触发标准数据刷新
      if (isMountedRef.current) {
        triggerDataRefresh();
      }
      
      return response;
    } catch (error) {
      console.error('❌ 创建文章失败:', error);
      throw error;
    }
  }, [auth, checkAuth, triggerDataRefresh]);

  // 更新文章
  const updateArticle = useCallback(async (id: string, articleData: Partial<Article>) => {
    console.log('🔄 === 开始更新文章（标准刷新版） ===');
    console.log('📋 文章ID:', id);
    console.log('📋 更新数据:', articleData);
    
    checkAuth();

    try {
      // 清理数据，移除不应该发送的字段
      const { _id, createdAt, updatedAt, views, ...cleanData } = articleData;
      
      console.log('🧹 清理后的更新数据:', cleanData);

      const response = await apiRequest(`/api/articles/${id}`, {
        method: 'PUT',
        headers: getHeaders(auth.isAuthenticated),
        body: JSON.stringify(cleanData)
      });

      console.log('✅ 服务端更新成功:', response);
      
      // 🔄 触发标准数据刷新
      if (isMountedRef.current) {
        triggerDataRefresh();
      }
      
      console.log('✅ === 文章更新和数据刷新完成 ===');
      
      return response;
    } catch (error) {
      console.error('❌ 更新文章失败:', error);
      throw error;
    }
  }, [auth, checkAuth, triggerDataRefresh]);

  // 删除文章
  const deleteArticle = useCallback(async (id: string) => {
    console.log('🗑️ 开始删除文章:', id);
    
    checkAuth();

    try {
      await apiRequest(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: getHeaders(auth.isAuthenticated)
      });

      console.log('✅ 删除完成');
      
      // 🔄 触发标准数据刷新
      if (isMountedRef.current) {
        triggerDataRefresh();
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ 删除文章失败:', error);
      throw error;
    }
  }, [auth, checkAuth, triggerDataRefresh]);

  // 组件卸载时清理
  const cleanup = useCallback(() => {
    isMountedRef.current = false;
  }, []);

  return {
    // 状态 - 使用统一的认证状态
    auth,
    
    // 操作
    createArticle,
    updateArticle,
    deleteArticle,
    
    // 🔄 标准数据刷新
    triggerDataRefresh,
    
    // 清理函数
    cleanup
  };
};