/**
 * 管理后台登录页面
 * 简单的密码认证页面
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useSimpleAuth } from '../../../hooks/useSimpleAuth';

export const ManagementLogin: React.FC = () => {
  const { getContent } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useSimpleAuth();
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果已经登录，重定向到管理页面
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ 用户已登录，重定向到管理页面');
      navigate('/management/articles');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError(getContent({ zh: '请输入密码', en: 'Please enter password' }));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔑 尝试登录...');
      const success = login(password);
      
      if (success) {
        console.log('✅ 登录成功，重定向到管理页面');
        navigate('/management/articles');
      } else {
        setError(getContent({ zh: '密码错误', en: 'Incorrect password' }));
      }
    } catch (err) {
      console.error('❌ 登录过程出错:', err);
      setError(getContent({ zh: '登录失败，请重试', en: 'Login failed, please try again' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <img 
            src="https://cdn-tos-cn.bytedance.net/obj/aipa-tos/a5b16aca-9306-40da-823c-1e32f0e588e2/处理图片背景.png"
            alt="Logo"
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getContent({ zh: '管理后台登录', en: 'Management Login' })}
          </h1>
          <p className="text-gray-600">
            {getContent({ zh: '请输入密码访问管理功能', en: 'Enter password to access management features' })}
          </p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getContent({ zh: '管理密码', en: 'Management Password' })}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(''); // 清除错误信息
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder={getContent({ zh: '请输入管理密码', en: 'Enter management password' })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{getContent({ zh: '登录中...', en: 'Logging in...' })}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{getContent({ zh: '登录', en: 'Login' })}</span>
                </>
              )}
            </button>
          </form>

          {/* 返回首页链接 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              {getContent({ zh: '返回首页', en: 'Back to Home' })}
            </button>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {getContent({ 
            zh: '如需访问权限，请联系系统管理员', 
            en: 'Please contact system administrator for access' 
          })}
        </div>
      </motion.div>
    </div>
  );
};