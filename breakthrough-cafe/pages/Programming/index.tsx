/**
 * 编程辅助页面
 * 展示各种AI IDE、编程语言和技术服务
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { Code, Cpu, Zap, Layers, Terminal, Database, Globe, Smartphone, ArrowRight, ExternalLink } from 'lucide-react';

export const Programming: React.FC = () => {
  const { getContent } = useLanguage();

  const aiIDEs = [
    {
      name: 'Cursor',
      description: { zh: '最强AI代码编辑器，智能代码补全和生成', en: 'Most powerful AI code editor with intelligent completion and generation' },
      icon: <Code className="w-8 h-8" />,
      features: ['AI代码生成', '智能补全', '代码重构', '错误修复']
    },
    {
      name: 'GitHub Copilot',
      description: { zh: '微软AI编程助手，支持多种编程语言', en: 'Microsoft AI programming assistant supporting multiple languages' },
      icon: <Cpu className="w-8 h-8" />,
      features: ['代码建议', '函数生成', '注释生成', '测试编写']
    },
    {
      name: 'Claude Dev',
      description: { zh: 'VS Code中的Claude AI助手扩展', en: 'Claude AI assistant extension for VS Code' },
      icon: <Zap className="w-8 h-8" />,
      features: ['智能问答', '代码解释', '架构建议', '最佳实践']
    },
    {
      name: 'Windsurf',
      description: { zh: '新一代AI IDE，专为AI原生开发设计', en: 'Next-generation AI IDE designed for AI-native development' },
      icon: <Layers className="w-8 h-8" />,
      features: ['AI原生设计', '多模型支持', '智能工作流', '团队协作']
    }
  ];

  const programmingLanguages = [
    {
      category: { zh: '前端开发', en: 'Frontend Development' },
      icon: <Globe className="w-6 h-6" />,
      languages: [
        { name: 'JavaScript/TypeScript', level: '专家', color: 'bg-yellow-100 text-yellow-800' },
        { name: 'React/Vue/Angular', level: '专家', color: 'bg-blue-100 text-blue-800' },
        { name: 'HTML/CSS/Tailwind', level: '专家', color: 'bg-green-100 text-green-800' },
        { name: 'Next.js/Nuxt.js', level: '熟练', color: 'bg-purple-100 text-purple-800' }
      ]
    },
    {
      category: { zh: '后端开发', en: 'Backend Development' },
      icon: <Terminal className="w-6 h-6" />,
      languages: [
        { name: 'Node.js/Express', level: '专家', color: 'bg-green-100 text-green-800' },
        { name: 'Python/Django/FastAPI', level: '专家', color: 'bg-blue-100 text-blue-800' },
        { name: 'Java/Spring Boot', level: '熟练', color: 'bg-red-100 text-red-800' },
        { name: 'Go/Gin', level: '熟练', color: 'bg-cyan-100 text-cyan-800' }
      ]
    },
    {
      category: { zh: '移动开发', en: 'Mobile Development' },
      icon: <Smartphone className="w-6 h-6" />,
      languages: [
        { name: 'React Native', level: '专家', color: 'bg-blue-100 text-blue-800' },
        { name: 'Flutter/Dart', level: '熟练', color: 'bg-blue-100 text-blue-800' },
        { name: 'Swift/iOS', level: '基础', color: 'bg-gray-100 text-gray-800' },
        { name: 'Kotlin/Android', level: '基础', color: 'bg-orange-100 text-orange-800' }
      ]
    },
    {
      category: { zh: '数据科学', en: 'Data Science' },
      icon: <Database className="w-6 h-6" />,
      languages: [
        { name: 'Python/Pandas/NumPy', level: '专家', color: 'bg-blue-100 text-blue-800' },
        { name: 'SQL/PostgreSQL/MongoDB', level: '专家', color: 'bg-green-100 text-green-800' },
        { name: 'R/统计分析', level: '熟练', color: 'bg-purple-100 text-purple-800' },
        { name: 'TensorFlow/PyTorch', level: '熟练', color: 'bg-red-100 text-red-800' }
      ]
    }
  ];

  const services = [
    {
      title: { zh: '代码审查与优化', en: 'Code Review & Optimization' },
      description: { zh: '专业的代码审查，性能优化建议，最佳实践指导', en: 'Professional code review, performance optimization suggestions, best practice guidance' },
      icon: <Code className="w-12 h-12" />,
      price: { zh: '￥199/小时', en: '$29/hour' }
    },
    {
      title: { zh: 'AI工具培训', en: 'AI Tool Training' },
      description: { zh: '手把手教你使用各种AI编程工具，提升开发效率', en: 'Step-by-step training on various AI programming tools to boost development efficiency' },
      icon: <Zap className="w-12 h-12" />,
      price: { zh: '￥299/次', en: '$45/session' }
    },
    {
      title: { zh: '架构设计咨询', en: 'Architecture Design Consulting' },
      description: { zh: '系统架构设计，技术选型建议，扩展性规划', en: 'System architecture design, technology selection advice, scalability planning' },
      icon: <Layers className="w-12 h-12" />,
      price: { zh: '￥499/次', en: '$75/session' }
    },
    {
      title: { zh: '问题诊断修复', en: 'Problem Diagnosis & Fix' },
      description: { zh: '快速定位技术问题，提供解决方案，远程协助修复', en: 'Quickly identify technical issues, provide solutions, remote assistance for fixes' },
      icon: <Terminal className="w-12 h-12" />,
      price: { zh: '￥99/问题', en: '$15/issue' }
    }
  ];

  // 服务流程步骤
  const serviceSteps = [
    {
      number: 1,
      title: { zh: '选择平台', en: 'Choose Platform' },
      description: { zh: '选择你熟悉的交易平台，在那里找到「拨云见日咖啡屋」', en: 'Choose a trading platform you\'re familiar with and find "Breakthrough Cafe" there' },
      icon: <Globe className="w-8 h-8" />
    },
    {
      number: 2,
      title: { zh: '提交需求', en: 'Submit Requirements' },
      description: { zh: '和工程师描述你的预期和你现在遇到的困难，发送你和AI的沟通历史', en: 'Describe your expectations and current difficulties to our engineers, send your communication history with AI' },
      icon: <Terminal className="w-8 h-8" />
    },
    {
      number: 3,
      title: { zh: '结伴编程', en: 'Pair Programming' },
      description: { zh: '工程师调试完成后会发给你指令，使用指令继续和AI畅快协作吧', en: 'After debugging, engineers will send you instructions to continue smooth collaboration with AI' },
      icon: <Code className="w-8 h-8" />
    }
  ];

  // 交易平台
  const platforms = [
    {
      name: 'Fiverr',
      description: { zh: '全球领先的自由职业平台', en: 'Leading global freelance platform' },
      url: '/platform/fiverr',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Upwork',
      description: { zh: '专业技术服务平台', en: 'Professional technical services platform' },
      url: '/platform/upwork',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'FreeLancer',
      description: { zh: '全球自由工作者社区', en: 'Global freelancer community' },
      url: '/platform/freelancer',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: '猪八戒网',
      description: { zh: '中国领先的企业服务平台', en: 'China\'s leading enterprise service platform' },
      url: '/platform/zbj',
      color: 'from-red-500 to-pink-600'
    },
    {
      name: '闲鱼',
      description: { zh: '阿里旗下个人交易平台', en: 'Alibaba\'s personal trading platform' },
      url: '/platform/xianyu',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {getContent({
              zh: 'AI编程的金牌辅助',
              en: 'Gold Medal AI Programming Support'
            })}
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {getContent({
              zh: '我们熟练使用各种前沿AI编程工具，无论哪个AI，都能帮你调教',
              en: 'We are proficient in various cutting-edge AI programming tools, helping you tame any AI'
            })}
          </motion.p>

          <motion.div
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full text-lg font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {getContent({
              zh: '让AI为你工作，而不是与AI斗争',
              en: 'Make AI work for you, not fight against AI'
            })}
          </motion.div>
        </div>
      </section>

      {/* 服务流程 Section */}
      <section className="py-20 bg-white">
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
                zh: '服务流程',
                en: 'Service Process'
              })}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent({
                zh: '继续和AI做朋友',
                en: 'Continue being friends with AI'
              })}
            </p>
          </motion.div>

          {/* 流程步骤 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {serviceSteps.map((step, index) => (
              <motion.div
                key={step.number}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* 连接线 */}
                {index < serviceSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 z-0" 
                       style={{ width: 'calc(100% - 80px)', left: '90px' }} />
                )}
                
                <motion.div
                  className="relative z-10 w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {step.icon}
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {getContent(step.title)}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {getContent(step.description)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 平台选择 */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {getContent({
                  zh: '选择你熟悉的平台',
                  en: 'Choose Your Familiar Platform'
                })}
              </h3>
              <p className="text-gray-600">
                {getContent({
                  zh: '在这些平台上找到我们，开始你的编程辅助服务',
                  en: 'Find us on these platforms and start your programming assistance service'
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {platforms.map((platform, index) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  className="group block bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white mb-3 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-center mb-2 group-hover:text-orange-600 transition-colors">
                    {platform.name}
                  </h4>
                  <p className="text-xs text-gray-500 text-center">
                    {getContent(platform.description)}
                  </p>
                </motion.a>
              ))}
            </div>

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 text-orange-600">
                <div className="w-3 h-3 rounded-full bg-orange-600 animate-pulse"></div>
                <span className="text-sm font-medium">
                  {getContent({
                    zh: '点击平台图标，马上找到我们',
                    en: 'Click platform icons to find us immediately'
                  })}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI IDEs Section */}
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
                zh: 'AI编程工具',
                en: 'AI Programming Tools'
              })}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent({
                zh: '我们熟练使用各种前沿AI编程工具，帮您选择最适合的开发环境',
                en: 'We are proficient in various cutting-edge AI programming tools, helping you choose the most suitable development environment'
              })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiIDEs.map((ide, index) => (
              <motion.div
                key={ide.name}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center text-white">
                    {ide.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{ide.name}</h3>
                    <p className="text-gray-600 mb-4">{getContent(ide.description)}</p>
                    <div className="flex flex-wrap gap-2">
                      {ide.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programming Languages Section */}
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
                zh: '技术栈覆盖',
                en: 'Technology Stack Coverage'
              })}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent({
                zh: '从前端到后端，从移动端到数据科学，全栈技术支持',
                en: 'From frontend to backend, from mobile to data science, full-stack technical support'
              })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programmingLanguages.map((category, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center text-white">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getContent(category.category)}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.languages.map((lang) => (
                    <div key={lang.name} className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{lang.name}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${lang.color}`}>
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
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
                zh: '专业服务项目',
                en: 'Professional Services'
              })}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent({
                zh: '根据您的具体需求，提供个性化的技术解决方案',
                en: 'Provide personalized technical solutions based on your specific needs'
              })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {getContent(service.title)}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {getContent(service.description)}
                  </p>
                  
                  <div className="text-2xl font-bold text-orange-600 mb-6">
                    {getContent(service.price)}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200">
                    {getContent({
                      zh: '立即咨询',
                      en: 'Consult Now'
                    })}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {getContent({
              zh: '准备开始您的编程项目了吗？',
              en: 'Ready to Start Your Programming Project?'
            })}
          </motion.h2>
          
          <motion.p
            className="text-xl text-purple-100 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {getContent({
              zh: '无论是简单的bug修复还是复杂的系统设计，我们都能为您提供专业的技术支持',
              en: 'Whether it\'s simple bug fixes or complex system design, we can provide professional technical support'
            })}
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="bg-white text-orange-600 py-3 px-8 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
              {getContent({
                zh: '免费咨询',
                en: 'Free Consultation'
              })}
            </button>
            <button className="bg-orange-700 text-white py-3 px-8 rounded-xl font-semibold hover:bg-orange-800 transition-colors duration-200">
              {getContent({
                zh: '查看案例',
                en: 'View Cases'
              })}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};