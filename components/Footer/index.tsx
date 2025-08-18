/**
 * 页脚组件
 * 包含联系信息、服务范围和公司介绍
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

export const Footer: React.FC = () => {
  const { getContent } = useLanguage();

  const footerSections = [
    {
      title: { zh: '编程卡住了就找我们', en: 'Programming Stuck? Find Us' },
      content: [
        { zh: '邮箱: hello@breakthrough-ai.com', en: 'Email: hello@breakthrough-ai.com' },
        { zh: '微信: Breakthrough2024', en: 'WeChat: Breakthrough2024' },
        { zh: 'QQ群: 888888888 (AI编程技术交流)', en: 'QQ Group: 888888888 (AI Programming Tech)' }
      ]
    },
    {
      title: { zh: '我们的服务体系', en: 'Our Service System' },
      content: [
        { zh: '🎯 AI编程技术辅助（核心付费服务）', en: '🎯 AI Programming Support (Core Paid Service)' },
        { zh: '💝 产品运营推广指导（免费）', en: '💝 Product Marketing Guidance (Free)' },
        { zh: '💝 项目方向咨询（免费）', en: '💝 Project Direction Consultation (Free)' },
        { zh: '💝 资源对接服务（免费）', en: '💝 Resource Networking Service (Free)' }
      ]
    },
    {
      title: { zh: '关于拨云见日', en: 'About Breakthrough' },
      content: [
        {
          zh: '我们专注于为AI创作者提供专业的编程技术支持。我们相信，技术难题不应该成为实现想法的障碍。通过专业的付费编程辅助服务和免费的增值支持，我们帮助每个有愿景的创作者突破技术瓶颈，让改变世界的想法真正落地。',
          en: 'We focus on providing professional programming technical support for AI creators. We believe technical challenges shouldn\'t be barriers to implementing ideas. Through professional paid programming support and free value-added services, we help every visionary creator break through technical bottlenecks and turn world-changing ideas into reality.'
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {footerSections.map((section, index) => (
            <motion.div key={index} variants={itemVariants}>
              <h3 className="text-xl font-bold text-amber-400 mb-6">
                {getContent(section.title)}
              </h3>
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <motion.p
                    key={itemIndex}
                    className="text-gray-300 leading-relaxed hover:text-white transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    {getContent(item)}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-gray-400"
            whileHover={{ scale: 1.05 }}
          >
            {getContent({
              zh: '© 2024 拨云见日 Breakthrough. 专业的AI编程技术辅助服务平台',
              en: '© 2024 Breakthrough. Professional AI Programming Technical Support Platform'
            })}
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};