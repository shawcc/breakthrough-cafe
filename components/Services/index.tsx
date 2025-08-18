/**
 * 服务介绍组件
 * 展示平台提供的各项服务，包含服务卡片和相关链接
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { services } from '../../data/content';

export const Services: React.FC = () => {
  const { getContent } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {getContent({
              zh: 'AI编程辅助 + 免费增值服务',
              en: 'AI Programming Support + Free Value-Added Services'
            })}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getContent({
              zh: '从创意到产品，从产品到成功产品，我们全程辅助',
              en: 'From idea to product, from product to successful product, we provide full assistance'
            })}
          </p>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* 第一个板块 - AI编程技术辅助（突出显示，占据更大空间） */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-10 shadow-xl border-2 border-orange-300 hover:shadow-2xl transition-all duration-300 ring-4 ring-orange-100 relative overflow-hidden"
            variants={cardVariants}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            {/* 突出标签 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
              {getContent({ zh: '🔥 核心服务', en: '🔥 Core Service' })}
            </div>
            
            {/* 装饰性背景元素 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center text-4xl shadow-lg">
                  💻
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {getContent(services[0].title)}
                </h3>
                
                <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-4xl">
                  {getContent(services[0].description)}
                </p>
                
                <motion.a
                  href={services[0].link}
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getContent(services[0].buttonText)}
                  <motion.span
                    className="ml-3 text-xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* 其他三个板块 - 免费增值服务 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(1).map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl mr-3">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getContent(service.title)}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  {getContent(service.description)}
                </p>
                
                <motion.a
                  href={service.link}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getContent(service.buttonText)}
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};