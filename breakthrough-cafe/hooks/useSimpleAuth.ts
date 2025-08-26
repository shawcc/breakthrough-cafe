/**
 * 简化的认证Hook
 * 专门处理管理后台的登录状态，避免过于复杂的逻辑
 */

import { useState, useEffect, useCallback } from 'react';

export const useSimpleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 初始化认证状态
  useEffect(() => {
    console.log('🔐 初始化认证状态...');
    
    try {
      const authStatus = localStorage.getItem('management_auth');
      const isAuth = authStatus === 'true';
      
      console.log('🔍 从localStorage读取认证状态:', authStatus);
      console.log('🎯 转换后的认证状态:', isAuth);
      
      setIsAuthenticated(isAuth);
      setIsInitialized(true);
      
      console.log('✅ 认证状态初始化完成:', { isAuth, isInitialized: true });
    } catch (error) {
      console.error('❌ 认证状态初始化失败:', error);
      setIsAuthenticated(false);
      setIsInitialized(true);
    }
  }, []);

  // 登录
  const login = useCallback((password: string): boolean => {
    console.log('🔑 尝试登录...');
    
    const correctPassword = 'aipa2024';
    if (password === correctPassword) {
      console.log('✅ 密码正确，设置认证状态');
      setIsAuthenticated(true);
      localStorage.setItem('management_auth', 'true');
      return true;
    }
    
    console.log('❌ 密码错误');
    return false;
  }, []);

  // 登出
  const logout = useCallback(() => {
    console.log('🚪 执行登出操作');
    setIsAuthenticated(false);
    localStorage.removeItem('management_auth');
  }, []);

  return {
    isAuthenticated,
    isInitialized,
    login,
    logout
  };
};