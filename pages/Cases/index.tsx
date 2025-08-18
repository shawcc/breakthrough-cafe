/**
 * 案例展示页面
 * 展示服务成功案例和客户反馈
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { ExternalLink, Star, User, Calendar } from 'lucide-react';

export const Cases: React.FC = () => {
  const { getContent } = useLanguage();

  const cases = [
    {
      id: 1,
      title: { zh: 'AI聊天机器人项目', en: 'AI Chatbot Project' },
      description: { zh: '帮助客户解决了React组件状态管理问题，优化了聊天界面的响应速度，成功部署到生产环境', en: 'Helped client solve React component state management issues, optimized chat interface response speed, successfully deployed to production' },
      tech: ['React', 'TypeScript', 'WebSocket', 'Node.js'],
      result: { zh: '部署成功，用户体验提升300%', en: 'Successful deployment, 300% user experience improvement' },
      client: { zh: '张先生 - 创业者', en: 'Mr. Zhang - Entrepreneur' },
      date: '2024-12',
      rating: 5
    },
    {
      id: 2,
      title: { zh: '电商数据分析平台', en: 'E-commerce Analytics Platform' },
      description: { zh: '协助客户从零搭建数据可视化平台，解决了大数据处理和图表渲染性能问题', en: 'Assisted client in building data visualization platform from scratch, solved big data processing and chart rendering performance issues' },
      tech: ['Vue.js', 'Python', 'MongoDB', 'Chart.js'],
      result: { zh: '处理效率提升10倍，获得天使投资', en: '10x processing efficiency improvement, secured angel investment' },
      client: { zh: '李女士 - 产品经理', en: 'Ms. Li - Product Manager' },
      date: '2024-11',
      rating: 5
    },
    {
      id: 3,
      title: { zh: '智能推荐系统优化', en: 'Smart Recommendation System Optimization' },
      description: { zh: '帮助优化推荐算法，解决了API集成和缓存策略问题，提升了推荐准确率', en: 'Helped optimize recommendation algorithms, solved API integration and caching strategy issues, improved recommendation accuracy' },
      tech: ['Python', 'FastAPI', 'Redis', 'TensorFlow'],
      result: { zh: '推荐准确率提升40%，日活用户翻倍', en: '40% recommendation accuracy improvement, doubled daily active users' },
      client: { zh: '王先生 - 技术总监', en: 'Mr. Wang - CTO' },
      date: '2024-10',
      rating: 5
    },
    {
      id: 4,
      title: { zh: '移动端APP开发', en: 'Mobile App Development' },
      description: { zh: '协助完成React Native项目的关键功能开发，解决了跨平台兼容性和性能优化问题', en: 'Assisted in completing key feature development for React Native project, solved cross-platform compatibility and performance optimization issues' },
      tech: ['React Native', 'JavaScript', 'Firebase', 'Redux'],
      result: { zh: '成功上线iOS和Android双平台', en: 'Successfully launched on both iOS and Android platforms' },
      client: { zh: '陈先生 - 独立开发者', en: 'Mr. Chen - Independent Developer' },
      date: '2024-09',
      rating: 5
    }
  ];

  const testimonials = [
    {
      content: { zh: '太感谢了！原本卡了两周的问题，在他们的帮助下半天就解决了。专业、耐心、靠谱！', en: 'Thank you so much! The problem that had been stuck for two weeks was solved in half a day with their help. Professional, patient, and reliable!' },
      author: { zh: '刘开发者', en: 'Liu Developer' },
      role: { zh: '全栈工程师', en: 'Full Stack Engineer' },
      rating: 5
    },
    {
      content: { zh: 'AI总是给出奇怪的答案，找到他们后问题迎刃而解。不仅解决了技术问题，还给了很多产品建议。', en: 'AI always gave weird answers, but after finding them, problems were solved easily. Not only solved technical issues but also gave many product suggestions.' },
      author: { zh: '赵产品', en: 'Zhao Product' },
      role: { zh: '产品经理', en: 'Product Manager' },
      rating: 5
    },
    {
      content: { zh: '从编程辅助到运营建议，一站式服务让我的项目从想法变成了现实。强烈推荐！', en: 'From programming assistance to operational advice, one-stop service turned my project from idea to reality. Highly recommended!' },
      author: { zh: '孙创业者', en: 'Sun Entrepreneur' },
      role: { zh: '创始人', en: 'Founder' },
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {getContent({
              zh: '看看他们的成功',
              en: 'See Their Success'
            })}
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {getContent({
              zh: '真实的案例，真实的反馈，每一个成功的背后都有我们的专业支持',
              en: 'Real cases, real feedback, behind every success is our professional support'
            })}
          </motion.p>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent({
                zh: '成功案例',
                en: 'Success Cases'
              })}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent({
                zh: '这些项目见证了我们的专业能力和服务质量',
                en: 'These projects demonstrate our professional capabilities and service quality'
              })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {getContent(caseItem.title)}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(caseItem.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {getContent(caseItem.description)}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {caseItem.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold">
                    {getContent({
                      zh: '成果：',
                      en: 'Result: '
                    })}
                    {getContent(caseItem.result)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{getContent(caseItem.client)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{caseItem.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent({
                zh: '客户反馈',
                en: 'Client Feedback'
              })}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent({
                zh: '听听他们怎么说',
                en: 'Hear what they say'
              })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{getContent(testimonial.content)}"
                </p>

                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">
                    {getContent(testimonial.author)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getContent(testimonial.role)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};