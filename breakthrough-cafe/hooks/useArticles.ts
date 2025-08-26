/**
 * 文章数据管理Hook
 * 处理文章相关的数据获取和状态管理
 * 🔥 优化版本 - 标准SWR模式
 * ✅ 修复React错误#185 - 添加组件挂载状态检查
 */

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import useSWR from 'swr';
import type { Article, ArticleCategory, ArticleFilters, ArticlesResponse } from '../shared/types/article';
import React, { useRef, useCallback } from 'react';

// 文章状态管理
const articlesAtom = atomWithStorage<Article[]>('articles', []);
const categoriesAtom = atomWithStorage<ArticleCategory[]>('categories', []);

// API fetcher - 简化版本
const fetcher = (url: string) => {
  // 添加简单的缓存破坏机制
  const cacheBuster = `_t=${Date.now()}`;
  const finalUrl = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
  
  console.log('🚀 发起API请求 (带防缓存参数):', finalUrl);
  
  return fetch(`${process.env.AIPA_API_DOMAIN}${finalUrl}`, {
    cache: 'no-cache',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }).then(res => res.json());
};

export const useArticles = (filters?: ArticleFilters) => {
  const [articles, setArticles] = useAtom(articlesAtom);
  
  // ✅ 添加组件挂载状态检查
  const isMountedRef = useRef(true);
  
  // 构建查询参数
  const params = new URLSearchParams();
  
  // 只有在明确指定了值的情况下才添加参数
  if (filters?.category && filters.category.trim()) {
    params.append('category', filters.category);
  }
  
  if (filters?.isFeatured !== undefined) {
    params.append('isFeatured', String(filters.isFeatured));
  }
  
  // 🔒 重要：处理status参数，确保安全性
  if (filters?.status && filters.status.trim()) {
    params.append('status', filters.status);
    console.log('✅ 明确指定文章状态:', filters.status);
  } else {
    console.log('⚠️ 未指定文章状态，将获取所有状态的文章');
    console.log('  - 如果这是公开页面，应该明确指定 status: "published"');
  }
  
  if (filters?.limit) {
    params.append('limit', String(filters.limit));
  }
  
  if (filters?.skip) {
    params.append('skip', String(filters.skip));
  }
  
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy);
  }
  
  if (filters?.sortOrder) {
    params.append('sortOrder', filters.sortOrder);
  }

  const queryString = params.toString();
  const url = `/api/articles${queryString ? `?${queryString}` : ''}`;
  
  console.log('🔍 useArticles构建的请求URL:', url);
  console.log('🔍 useArticles筛选条件:', filters);

  const { data, error, isLoading, mutate } = useSWR<ArticlesResponse>(url, fetcher, {
    // 🔄 标准SWR配置
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 2000, // 2秒内去重
    focusThrottleInterval: 5000, // 5秒内焦点节流
    refreshInterval: 0, // 禁用自动刷新
    errorRetryCount: 3, // 保留错误重试
  });
  
  // ✅ 组件卸载时清理
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // 🔄 监听全局刷新事件
  React.useEffect(() => {
    const handleArticleUpdate = () => {
      if (!isMountedRef.current) return;
      console.log('📡 useArticles 收到文章更新事件，强制刷新');
      mutate();
    };
    
    window.addEventListener('articleUpdated', handleArticleUpdate);
    
    return () => {
      window.removeEventListener('articleUpdated', handleArticleUpdate);
    };
  }, [mutate]);

  // 🔄 当SWR获取到新数据时，同步更新jotai本地存储
  React.useEffect(() => {
    if (!isMountedRef.current) return;
    
    if (data && data.articles) {
      console.log('📊 useArticles 使用SWR数据，文章数量:', data.articles.length);
      
      if (data.articles.length > 0) {
        console.log('📄 第一篇文章标题:', data.articles[0].title);
      }
      
      console.log('📋 useArticles收到数据:', {
        articlesCount: data.articles.length,
        total: data.total,
        url: url
      });
      
      // 🔄 同步更新jotai存储，确保UI显示最新数据
      setArticles(data.articles);
      console.log('🔄 已同步更新jotai本地存储');
      
      // 统计文章状态分布
      const statusCount = data.articles.reduce((acc, article) => {
        acc[article.status] = (acc[article.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 文章状态分布:', statusCount);
    }
    
    if (error) {
      console.error('❌ useArticles请求错误:', error);
    }
  }, [data, error, url, setArticles]);

  // 🔄 强制优先使用SWR数据
  const currentArticles = data?.articles || [];
  
  // 调试信息
  if (data?.articles) {
    console.log('📊 useArticles 使用SWR数据，文章数量:', data.articles.length);
    if (data.articles.length > 0) {
      console.log('📄 第一篇文章标题:', data.articles[0].title);
    }
  } else if (isLoading) {
    console.log('⏳ useArticles 正在加载数据...');
  } else if (articles.length > 0) {
    console.log('⚠️ useArticles 使用本地缓存数据，可能过时');
  }

  return {
    articles: currentArticles,
    total: data?.total || 0,
    page: data?.page || 1,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    mutate,
    setArticles
  };
};

export const useArticleDetail = (id: string) => {
  // ✅ 添加组件挂载状态检查
  const isMountedRef = useRef(true);
  
  const url = id ? `/api/articles/${id}` : null;
    
  const { data, error, isLoading, mutate } = useSWR<Article>(url, fetcher, {
    // 🔄 标准SWR配置
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 2000,
    focusThrottleInterval: 5000,
    refreshInterval: 0,
  });

  // ✅ 组件卸载时清理
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 🔄 监听全局刷新事件
  React.useEffect(() => {
    const handleUpdate = () => {
      if (!isMountedRef.current) return;
      console.log('📡 useArticleDetail 收到更新事件，强制刷新');
      mutate();
    };
    
    window.addEventListener('articleUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('articleUpdated', handleUpdate);
    };
  }, [mutate]);

  return {
    article: data,
    isLoading,
    error,
    mutate
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);
  
  // ✅ 添加组件挂载状态检查
  const isMountedRef = useRef(true);
  
  const url = '/api/categories';
    
  const { data, error, isLoading, mutate } = useSWR<{ categories: ArticleCategory[] }>(url, fetcher, {
    // 🔄 标准SWR配置
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 5000, // categories变化较少，可以更长去重时间
  });

  // ✅ 组件卸载时清理
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 🔒 类型安全检查：确保 categories 始终是数组
  const getSafeArray = (value: any): ArticleCategory[] => {
    // 检查是否是包含 categories 属性的对象
    if (value && typeof value === 'object' && Array.isArray(value.categories)) {
      return value.categories.filter(Boolean);
    }
    // 检查是否直接是数组
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    console.warn('⚠️ useCategories: 收到非数组类型数据:', typeof value, value);
    return [];
  };

  const safeCategories = getSafeArray(data) || getSafeArray(categories) || [];

  // 🔄 同步更新categories的jotai存储
  React.useEffect(() => {
    if (!isMountedRef.current) return;
    
    if (data && getSafeArray(data).length > 0) {
      setCategories(getSafeArray(data));
      console.log('🔄 已同步更新categories本地存储');
    }
  }, [data, setCategories]);

  return {
    categories: safeCategories,
    isLoading,
    error,
    mutate,
    setCategories
  };
};