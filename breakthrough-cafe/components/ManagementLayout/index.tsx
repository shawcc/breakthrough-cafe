/**
 * 管理后台布局组件
 * 提供统一的管理页面布局和导航
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  BarChart3,
  LogOut,
  Settings,
  Bug
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useSimpleAuth } from '../../hooks/useSimpleAuth';

interface ManagementLayoutProps {
  children: React.ReactNode;
}

export const ManagementLayout: React.FC<ManagementLayoutProps> = ({ children }) => {
  const { getContent } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useSimpleAuth();

  const menuItems = [
    {
      label: getContent({ zh: '仪表板', en: 'Dashboard' }),
      icon: LayoutDashboard,
      path: '/management',
      exact: true
    },
    {
      label: getContent({ zh: '文章管理', en: 'Articles' }),
      icon: FileText,
      path: '/management/articles'
    },
    {
      label: getContent({ zh: '分类管理', en: 'Categories' }),
      icon: Folder,
      path: '/management/categories'
    },
    {
      label: getContent({ zh: '数据统计', en: 'Analytics' }),
      icon: BarChart3,
      path: '/management/analytics'
    },
    {
      label: getContent({ zh: '🔧 调试工具', en: '🔧 Debug Tool' }),
      icon: Bug,
      path: '/management/debug'
    },
    {
      label: getContent({ zh: '🚀 PUT调试', en: '🚀 PUT Debug' }),
      icon: Bug,
      path: '/management/put-debug'
    },
    {
      label: getContent({ zh: '🔍 数据库调试', en: '🔍 DB Debug' }),
      icon: Bug,
      path: '/management/db-debug'
    },
    {
      label: getContent({ zh: '🎯 PUT分析', en: '🎯 PUT Analysis' }),
      icon: Bug,
      path: '/management/put-analysis'
    }
  ];

  const isActivePath = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    console.log('🚪 用户主动登出');
    logout();
    navigate('/management/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        {/* Logo */}
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
          <img 
            src="https://cdn-tos-cn.bytedance.net/obj/aipa-tos/a5b16aca-9306-40da-823c-1e32f0e588e2/处理图片背景.png"
            alt="Logo"
            className="h-8 w-auto"
          />
          <div>
            <h1 className="font-bold text-gray-900">
              {getContent({ zh: '管理后台', en: 'Management' })}
            </h1>
            <p className="text-xs text-gray-500">
              {getContent({ zh: '拨云见日', en: 'Breakthrough' })}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActivePath(item.path, item.exact)
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors text-left"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">
                {getContent({ zh: '返回网站', en: 'Back to Site' })}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {getContent({ zh: '退出登录', en: 'Logout' })}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};