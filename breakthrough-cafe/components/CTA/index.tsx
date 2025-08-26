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
            zh: '为什么选择「拨云见日咖啡屋」',
            en: 'Why Choose "Breakthrough Cafe"?'
          })}
        </motion.h2>

        <motion.p
          className="text-xl mb-12 opacity-90 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {getContent({
            zh: '2025年，AI不成熟，你也不成熟，而我们熟了',
            en: 'In 2025, AI is not mature, neither are you, but we are'
          })}
        </motion.p>

        {/* 信任指标 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="text-3xl font-bold mb-2">50+</div>
            <div className="text-sm opacity-80">
              {getContent({ zh: '个被挽回的破碎项目', en: 'Rescued Broken Projects' })}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">12小时</div>
            <div className="text-sm opacity-80">
              {getContent({ zh: '内必能重拾信心', en: 'To Regain Confidence' })}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">20+</div>
            <div className="text-sm opacity-80">
              {getContent({ zh: '工程师提供举手之劳', en: 'Engineers Ready to Help' })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};