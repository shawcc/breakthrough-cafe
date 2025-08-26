/**
 * 案例详情页面
 * 展示单个案例的详细信息
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { ArrowLeft, Star, User, Calendar, Clock, CheckCircle, Code, Lightbulb, Target, Award } from 'lucide-react';

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContent } = useLanguage();

  // 这里应该根据ID获取具体案例数据，暂时用模拟数据
  const caseData = {
    id: parseInt(id || '1'),
    title: { zh: 'AI聊天机器人项目', en: 'AI Chatbot Project' },
    category: { zh: 'Web开发', en: 'Web Development' },
    duration: { zh: '3天', en: '3 days' },
    date: '2024-12',
    rating: 5,
    client: { zh: '张先生 - 创业者', en: 'Mr. Zhang - Entrepreneur' },
    overview: {
      zh: '这是一个为初创公司开发的智能客服聊天机器人项目。客户希望通过AI技术提升客户服务效率，降低人工成本。项目涉及自然语言处理、实时通信和用户体验优化等多个技术领域。',
      en: 'This is an intelligent customer service chatbot project developed for a startup company. The client wanted to improve customer service efficiency and reduce labor costs through AI technology. The project involved multiple technical areas including natural language processing, real-time communication, and user experience optimization.'
    },
    challenge: {
      zh: '客户在项目开发过程中遇到了React组件状态管理混乱、WebSocket连接不稳定、聊天界面响应缓慢等关键技术问题。AI助手给出的解决方案不够具体，导致开发进度严重滞后。',
      en: 'The client encountered key technical issues during development including chaotic React component state management, unstable WebSocket connections, and slow chat interface responses. AI assistant provided solutions that were not specific enough, causing serious development delays.'
    },
    solution: {
      zh: '我们的工程师团队采用了系统性的问题解决方法：1) 重构React状态管理架构，引入Redux Toolkit优化状态流；2) 实现WebSocket重连机制和心跳检测；3) 使用虚拟滚动和消息分页优化界面性能；4) 提供详细的部署文档和运维指南。',
      en: 'Our engineering team adopted a systematic problem-solving approach: 1) Refactored React state management architecture, introduced Redux Toolkit to optimize state flow; 2) Implemented WebSocket reconnection mechanism and heartbeat detection; 3) Used virtual scrolling and message pagination to optimize interface performance; 4) Provided detailed deployment documentation and operation guides.'
    },
    result: {
      zh: '项目成功部署到生产环境，聊天界面响应速度提升300%，用户体验显著改善。客户反馈系统稳定性大幅提升，为公司节省了60%的客服成本。',
      en: 'The project was successfully deployed to production environment, chat interface response speed improved by 300%, and user experience significantly improved. Client feedback showed greatly improved system stability, saving the company 60% of customer service costs.'
    },
    tech: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'Redux Toolkit', 'Socket.io'],
    features: [
      { zh: '智能对话引擎', en: 'Intelligent Dialogue Engine' },
      { zh: '实时消息推送', en: 'Real-time Message Push' },
      { zh: '多语言支持', en: 'Multi-language Support' },
      { zh: '客户信息管理', en: 'Customer Information Management' },
      { zh: '对话历史记录', en: 'Conversation History' },
      { zh: '自动回复配置', en: 'Auto-reply Configuration' }
    ],
    timeline: [
      { day: 1, task: { zh: '需求分析与技术方案设计', en: 'Requirements analysis and technical solution design' } },
      { day: 2, task: { zh: '核心功能开发与状态管理重构', en: 'Core functionality development and state management refactoring' } },
      { day: 3, task: { zh: '性能优化、测试与部署指导', en: 'Performance optimization, testing and deployment guidance' } }
    ]
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* 返回按钮 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.button
          onClick={() => navigate('/cases')}
          className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getContent({ zh: '返回案例列表', en: 'Back to Cases' })}</span>
        </motion.button>
      </div>

      {/* 案例头部信息 */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">
                {getContent(caseData.category)}
              </span>
              <span className="text-gray-600">{getContent(caseData.duration)}</span>
              <div className="flex items-center text-yellow-500">
                {[...Array(caseData.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {getContent(caseData.title)}
            </h1>

            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{getContent(caseData.client)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{caseData.date}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 案例详情内容 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 主要内容 */}
            <div className="lg:col-span-2 space-y-12">
              {/* 项目概述 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-6 h-6 text-orange-600 mr-2" />
                  {getContent({ zh: '项目概述', en: 'Project Overview' })}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {getContent(caseData.overview)}
                </p>
              </motion.div>

              {/* 遇到的挑战 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="w-6 h-6 text-orange-600 mr-2" />
                  {getContent({ zh: '遇到的挑战', en: 'Challenges Faced' })}
                </h2>
                <div className="bg-red-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {getContent(caseData.challenge)}
                  </p>
                </div>
              </motion.div>

              {/* 解决方案 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Code className="w-6 h-6 text-orange-600 mr-2" />
                  {getContent({ zh: '解决方案', en: 'Our Solution' })}
                </h2>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {getContent(caseData.solution)}
                  </p>
                </div>
              </motion.div>

              {/* 项目成果 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-6 h-6 text-orange-600 mr-2" />
                  {getContent({ zh: '项目成果', en: 'Project Results' })}
                </h2>
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {getContent(caseData.result)}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* 侧边栏信息 */}
            <div className="space-y-8">
              {/* 技术栈 */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {getContent({ zh: '技术栈', en: 'Tech Stack' })}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseData.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* 主要功能 */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {getContent({ zh: '主要功能', en: 'Key Features' })}
                </h3>
                <ul className="space-y-2">
                  {caseData.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-sm">{getContent(feature)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* 开发时间线 */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {getContent({ zh: '开发时间线', en: 'Development Timeline' })}
                </h3>
                <div className="space-y-4">
                  {caseData.timeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {item.day}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {getContent(item.task)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* 联系我们 */}
          <motion.div
            className="mt-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {getContent({ zh: '有类似项目需求？', en: 'Have Similar Project Needs?' })}
            </h3>
            <p className="text-gray-600 mb-6">
              {getContent({
                zh: '我们的专业团队随时准备为您提供技术支持，让您的项目顺利落地',
                en: 'Our professional team is ready to provide technical support to help your project land successfully'
              })}
            </p>
            <button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
              {getContent({ zh: '立即咨询', en: 'Contact Us Now' })}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
