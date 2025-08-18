/**
 * 行动号召组件
 * 引导用户采取行动的区块
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

export const CTA: React.FC = () => {
  const { getContent } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-800 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {getContent({
            zh: '为什么是「拨云见日」',
            en: 'Why "Breaking Through the Clouds"?'
          })}
        </motion.h2>

        <motion.p
          className="text-xl mb-8 opacity-90 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {getContent({
            zh: '2025年，AI还不成熟，但我们成熟',
            en: 'In 2025, AI is not yet mature, but we are'
          })}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="https://fiverr.com/gig-tech-support"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-400"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ y: 0, scale: 0.95 }}
          >
            {getContent({
              zh: '🎯 立即获取编程辅助',
              en: '🎯 Get Programming Help Now'
            })}
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>

          <motion.a
            href="https://fiverr.com/gig-free-consultation"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ y: 0, scale: 0.95 }}
          >
            {getContent({
              zh: '💝 免费服务咨询',
              en: '💝 Free Service Consultation'
            })}
          </motion.a>
        </motion.div>

        {/* 服务对比 */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-orange-600/20 rounded-xl p-4">
              <h4 className="font-bold text-lg mb-2">🎯 核心付费服务</h4>
              <p className="text-sm opacity-90">专业AI编程技术辅助</p>
              <p className="text-sm opacity-90">一对一深度技术支持</p>
            </div>
            <div className="bg-amber-600/20 rounded-xl p-4">
              <h4 className="font-bold text-lg mb-2">💝 免费增值服务</h4>
              <p className="text-sm opacity-90">产品运营推广指导</p>
              <p className="text-sm opacity-90">项目咨询 · 资源对接</p>
            </div>
          </div>
        </motion.div>

        {/* 信任指标 */}
        <motion.div
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="text-3xl font-bold mb-2">50+</div>
            <div className="text-sm opacity-80">
              {getContent({ zh: '个改变世界的产品', en: 'World-changing Products' })}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">24小时</div>
            <div className="text-sm opacity-80">
              {getContent({ zh: '内必回复', en: 'Response Time' })}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-sm opacity-80">
              {getContent({ zh: '问题解决率', en: 'Problem Solved' })}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">专业</div>
            <div className="text-sm opacity-80">
              {getContent({ zh: '超级个体导师', en: 'Solo Creator Mentor' })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};