/**
 * 案例展示页面
 * 展示客户反馈和成功案例，移除原有的静态文章部分
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Star, Calendar, BookOpen, Code, TrendingUp, DollarSign, ArrowRight, Clock, ExternalLink, Users, Zap } from 'lucide-react';

export const Cases: React.FC = () => {
  const { getContent } = useLanguage();
  const navigate = useNavigate();

  const cases = [
    {
      id: 1,
      title: { zh: 'AI聊天机器人项目', en: 'AI Chatbot Project' },
      category: { zh: 'Web开发', en: 'Web Development' },
      description: { zh: '为初创公司开发智能客服系统，处理效率提升300%', en: 'Developed intelligent customer service system for startup, improving processing efficiency by 300%' },
      tech: ['React', 'TypeScript', 'WebSocket', 'Node.js'],
      duration: { zh: '3天', en: '3 days' },
      rating: 5,
      result: { zh: '系统稳定性大幅提升，节省60%客服成本', en: 'Greatly improved system stability, saved 60% customer service costs' },
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: { zh: '数据可视化仪表板', en: 'Data Visualization Dashboard' },
      category: { zh: '数据分析', en: 'Data Analytics' },
      description: { zh: '构建实时数据分析平台，支持多维度数据展示', en: 'Built real-time data analysis platform supporting multi-dimensional data display' },
      tech: ['Python', 'Django', 'React', 'D3.js'],
      duration: { zh: '1周', en: '1 week' },
      rating: 5,
      result: { zh: '数据处理效率提升10倍，获得天使投资', en: 'Data processing efficiency improved 10x, secured angel investment' },
      image: 'https://images.unsplash.com/photo-1551288049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: { zh: '电商推荐算法优化', en: 'E-commerce Recommendation Algorithm' },
      category: { zh: '算法优化', en: 'Algorithm Optimization' },
      description: { zh: '优化推荐系统算法，提升用户购买转化率', en: 'Optimized recommendation system algorithm to improve user purchase conversion rate' },
      tech: ['Python', 'TensorFlow', 'Redis', 'MySQL'],
      duration: { zh: '5天', en: '5 days' },
      rating: 5,
      result: { zh: '推荐准确率提升40%，用户活跃度翻倍', en: 'Recommendation accuracy improved 40%, user activity doubled' },
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: { zh: '移动端直播应用', en: 'Mobile Live Streaming App' },
      category: { zh: '移动开发', en: 'Mobile Development' },
      description: { zh: '开发实时直播应用，支持多人在线互动', en: 'Developed real-time live streaming app supporting multi-user online interaction' },
      tech: ['React Native', 'WebRTC', 'Socket.io', 'AWS'],
      duration: { zh: '2周', en: '2 weeks' },
      rating: 5,
      result: { zh: '同时在线用户数突破1万，延迟低于100ms', en: 'Concurrent users exceeded 10,000, latency below 100ms' },
      image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: { zh: '企业CRM系统', en: 'Enterprise CRM System' },
      category: { zh: '企业应用', en: 'Enterprise Application' },
      description: { zh: '定制化客户关系管理系统，提升销售效率', en: 'Customized customer relationship management system to improve sales efficiency' },
      tech: ['Vue.js', 'Laravel', 'MySQL', 'Docker'],
      duration: { zh: '10天', en: '10 days' },
      rating: 5,
      result: { zh: '销售转化率提升25%，客户满意度95%+', en: 'Sales conversion rate increased 25%, customer satisfaction 95%+' },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: { zh: '区块链钱包应用', en: 'Blockchain Wallet App' },
      category: { zh: '区块链', en: 'Blockchain' },
      description: { zh: '开发安全的数字货币钱包，支持多链交易', en: 'Developed secure digital currency wallet supporting multi-chain transactions' },
      tech: ['React', 'Web3.js', 'Solidity', 'MetaMask'],
      duration: { zh: '1周', en: '1 week' },
      rating: 5,
      result: { zh: '零安全事故，用户资产100%安全保障', en: 'Zero security incidents, 100% user asset security guarantee' },
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      title: { zh: 'AI图像识别系统', en: 'AI Image Recognition System' },
      category: { zh: 'AI/ML', en: 'AI/ML' },
      description: { zh: '构建高精度图像识别模型，应用于工业质检', en: 'Built high-precision image recognition model for industrial quality inspection' },
      tech: ['Python', 'OpenCV', 'TensorFlow', 'Docker'],
      duration: { zh: '6天', en: '6 days' },
      rating: 5,
      result: { zh: '识别准确率达到99.5%，检测效率提升50倍', en: 'Recognition accuracy reached 99.5%, detection efficiency improved 50x' },
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      title: { zh: '在线教育平台', en: 'Online Education Platform' },
      category: { zh: '教育技术', en: 'EdTech' },
      description: { zh: '开发互动式在线学习平台，支持实时答疑', en: 'Developed interactive online learning platform with real-time Q&A support' },
      tech: ['Next.js', 'PostgreSQL', 'Socket.io', 'Stripe'],
      duration: { zh: '2周', en: '2 weeks' },
      rating: 5,
      result: { zh: '学生完课率提升40%，教师满意度98%', en: 'Student completion rate increased 40%, teacher satisfaction 98%' },
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
    },
    {
      id: 9,
      title: { zh: '智能家居控制系统', en: 'Smart Home Control System' },
      category: { zh: 'IoT', en: 'IoT' },
      description: { zh: '开发智能家居中控系统，支持语音和App控制', en: 'Developed smart home control system supporting voice and app control' },
      tech: ['React Native', 'MQTT', 'Arduino', 'Firebase'],
      duration: { zh: '8天', en: '8 days' },
      rating: 5,
      result: { zh: '设备响应时间<200ms，用户操作成功率99%+', en: 'Device response time <200ms, user operation success rate 99%+' },
      image: 'https://images.unsplash.com/photo-1558618047-3c8676c84d7f?w=400&h=300&fit=crop'
    },
    {
      id: 10,
      title: { zh: '金融风控系统', en: 'Financial Risk Control System' },
      category: { zh: '金融科技', en: 'FinTech' },
      description: { zh: '构建实时风险评估系统，防范金融欺诈', en: 'Built real-time risk assessment system to prevent financial fraud' },
      tech: ['Java', 'Spring Boot', 'Kafka', 'Elasticsearch'],
      duration: { zh: '12天', en: '12 days' },
      rating: 5,
      result: { zh: '欺诈检测准确率95%+，减少损失80%', en: 'Fraud detection accuracy 95%+, reduced losses by 80%' },
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop'
    }
  ];

  const handleCaseClick = (caseId: number) => {
    navigate(`/cases/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {getContent({
              zh: '这条路上，他们也在奔腾',
              en: 'On This Road, They Are Also Running Forward'
            })}
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {getContent({
              zh: '他们和你一样，有个想解决的问题，AI恰好能做。于是轻松启程，过程中遭遇坎坷，最终顺利搞定。',
              en: 'Like you, they had a problem to solve that AI could handle. They started easily, encountered bumps along the way, and finally succeeded.'
            })}
          </motion.p>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((case_item, index) => (
              <motion.div
                key={case_item.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onClick={() => handleCaseClick(case_item.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={case_item.image} 
                    alt={getContent(case_item.title)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">
                      {getContent(case_item.category)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center text-yellow-400">
                    {[...Array(case_item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {getContent(case_item.title)}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {getContent(case_item.description)}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {case_item.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {case_item.tech.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{case_item.tech.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{getContent(case_item.duration)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <p className="text-green-700 text-sm font-medium">
                      {getContent({ zh: '成果：', en: 'Result: ' })}{getContent(case_item.result)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 font-medium text-sm">
                      {getContent({ zh: '查看详情', en: 'View Details' })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 引导到文章页面的CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent({
                zh: '想了解更多经验和方法？',
                en: 'Want to Learn More Tips and Methods?'
              })}
            </h2>
            <p className="text-gray-600 mb-8">
              {getContent({
                zh: '查看我们的实用文章，获取AI编程、产品运营和商业化设计的深度见解',
                en: 'Check out our practical articles for deep insights on AI programming, product operations, and commercialization design'
              })}
            </p>
            <button
              onClick={() => navigate('/articles')}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              {getContent({
                zh: '浏览实用文章',
                en: 'Browse Articles'
              })}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};