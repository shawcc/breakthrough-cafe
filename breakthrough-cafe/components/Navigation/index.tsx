/**
 * 导航栏组件
 * 响应式导航栏，支持滚动时背景变化、路由导航和语言切换功能
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { navigationItems } from '../../data/content';

export const Navigation: React.FC = () => {
  const { currentLang, switchLanguage, getContent } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname === href;
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#011C38]/98 backdrop-blur-md shadow-xl'
          : 'bg-[#011C38]/95 backdrop-blur-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="https://cdn-tos-cn.bytedance.net/obj/aipa-tos/a5b16aca-9306-40da-823c-1e32f0e588e2/处理图片背景.png"
                alt="拨云见日 Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold text-white hidden sm:block">
                {getContent({
                  zh: '拨云见日咖啡屋',
                  en: 'Breakthrough Cafe'
                })}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {item.href.startsWith('#') ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="text-gray-200 hover:text-cyan-400 font-medium transition-colors duration-200"
                  >
                    {getContent(item.text)}
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={`font-medium transition-colors duration-200 ${
                      isActiveRoute(item.href)
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-200 hover:text-cyan-400'
                    }`}
                  >
                    {getContent(item.text)}
                  </Link>
                )}
              </div>
            ))}
            
            {/* 管理后台入口 */}
            <Link
              to="/management/login"
              className="text-gray-200 hover:text-cyan-400 font-medium transition-colors duration-200"
            >
              {getContent({ zh: '管理', en: 'Admin' })}
            </Link>
          </div>

          {/* Right Side - Language Switcher and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-gray-600">
              <button
                onClick={() => switchLanguage('zh')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentLang === 'zh'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentLang === 'en'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-200 hover:text-cyan-400 hover:bg-gray-700/50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-gray-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {navigationItems.map((item) => (
                <div key={item.href}>
                  {item.href.startsWith('#') ? (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="block w-full text-left text-gray-200 hover:text-cyan-400 font-medium py-2 transition-colors duration-200"
                    >
                      {getContent(item.text)}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block font-medium py-2 transition-colors duration-200 ${
                        isActiveRoute(item.href)
                          ? 'text-cyan-400'
                          : 'text-gray-200 hover:text-cyan-400'
                      }`}
                    >
                      {getContent(item.text)}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* 移动端管理后台入口 */}
              <Link
                to="/management/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-200 hover:text-cyan-400 font-medium py-2 transition-colors duration-200"
              >
                {getContent({ zh: '管理后台', en: 'Admin Panel' })}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};