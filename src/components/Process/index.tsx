/**
 * 合作流程组件
 * 展示与客户的合作流程步骤
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { processSteps } from '../../data/content';

export const Process: React.FC = () => {
  const { getContent } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const stepVariants = {
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
    <section id="process" className="py-20 bg-white">
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
              zh: '2025年AI编程的最佳实践',
              en: 'Best Practices for AI Programming in 2025'
            })}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getContent({
              zh: '硅基生命和碳基生命的合作元年，冲突不可避免',
              en: 'The first year of collaboration between silicon and carbon-based life, conflicts are inevitable'
            })}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className="text-center relative"
              variants={stepVariants}
            >
              {/* 连接线 */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 z-0" 
                     style={{ width: 'calc(100% - 80px)', left: '90px' }} />
              )}
              
              <motion.div
                className="relative z-10 w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {step.number}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {getContent(step.title)}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {getContent(step.description)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 text-orange-600">
            <div className="w-3 h-3 rounded-full bg-orange-600 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-orange-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-orange-600 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};