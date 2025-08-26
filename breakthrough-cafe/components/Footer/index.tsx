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
      title: { zh: '联系我们', en: 'Contact Us' },
      content: [
        { zh: '邮箱: Jimmy@breakthrough.cafe', en: 'Email: Jimmy@breakthrough.cafe' },
        { zh: '微信: Breakthrough2025', en: 'WeChat: Breakthrough2025' },
        { zh: 'QQ群: 888888888 (AI编程技术交流)', en: 'QQ Group: 888888888 (AI Programming Tech)' }
      ]
    },
    {
      title: { zh: '服务体系', en: 'Our Service System' },
      content: [
        { zh: 'AI编程技术辅助', en: 'AI Programming Support' },
        { zh: '产品运营交流（免费）', en: 'Product Marketing Exchange (Free)' },
        { zh: '项目方向咨询（免费）', en: 'Project Direction Consultation (Free)' },
        { zh: '资源对接服务（免费）', en: 'Resource Networking Service (Free)' }
      ]
    },
    {
      title: { zh: '关于拨云见日咖啡屋', en: 'About Breakthrough Cafe' },
      content: [
        {
          zh: '我们是一群热爱编程的工程师，希望帮助每一个AI创业路上遇到困难的梦想家。在这个黄金时代，贡献绵薄之力，不负如来不负韶华。',
          en: 'We are a group of passionate programming engineers, hoping to help every dreamer who encounters difficulties on their AI entrepreneurship journey. In this golden age, we contribute our modest efforts, living up to both our calling and our youth.'
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
    <footer id="contact" className="bg-[#011C38] text-white py-16">
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
              <h3 className="text-xl font-bold text-cyan-400 mb-6">
                {getContent(section.title)}
              </h3>
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <motion.p
                    key={itemIndex}
                    className="text-gray-300 leading-relaxed hover:text-cyan-300 transition-colors duration-200"
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
          className="mt-12 pt-8 border-t border-gray-700 text-center"
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
              zh: '© 2025 拨云见日咖啡屋. AI编程金牌辅助',
              en: '© 2025 Breakthrough Cafe. Gold Medal AI Programming Support'
            })}
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};