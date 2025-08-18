/**
 * Hero区块组件
 * 网站首屏展示区域，包含主标题、副标题、描述文本和行动按钮
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

export const Hero: React.FC = () => {
  const { getContent } = useLanguage();

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://cdn-tos-cn.bytedance.net/obj/aipa-tos/60c79cd2-d7db-457b-812e-4f910eef6638/tim-johnson-430Ad4CRkhk-unsplash.jpg)',
        }}
      />
      
      {/* 渐变遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-transparent to-orange-800/30" />
      
      {/* 温暖光晕效果 */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle 800px at 60% 40%, rgba(255, 193, 61, 0.3) 0%, transparent 60%),
                      radial-gradient(circle 600px at 80% 70%, rgba(255, 140, 66, 0.2) 0%, transparent 50%)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          {getContent({
            zh: '卡住了，就找拨云见日',
            en: 'Stuck? Contact Breakthrough'
          })}
        </motion.h1>

        <motion.h2
          className="text-xl sm:text-2xl lg:text-3xl font-medium mb-8 opacity-95 leading-relaxed drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
        >
          {getContent({
            zh: 'AI编程的金牌辅助天团',
            en: 'Gold Medal AI Programming Support Team'
          })}
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="https://fiverr.com/gig-tech-support"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-orange-300 hover:from-orange-400 hover:to-amber-400"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ y: 0, scale: 0.95 }}
          >
            {getContent({
              zh: '获取技术辅助',
              en: 'Get Technical Support'
            })}
          </motion.a>

          <motion.button
            onClick={() => handleNavClick('#services')}
            className="px-8 py-4 border-2 border-white/90 text-white rounded-full font-semibold text-lg hover:bg-white/20 hover:border-white transition-all duration-300 backdrop-blur-sm shadow-lg"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ y: 0, scale: 0.95 }}
          >
            {getContent({
              zh: '了解所有服务',
              en: 'View All Services'
            })}
          </motion.button>
        </motion.div>
      </div>

      {/* 滚动指示器 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/80 rounded-full flex justify-center shadow-lg">
          <div className="w-1 h-3 bg-white/80 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};