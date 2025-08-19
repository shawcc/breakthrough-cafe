/**
 * 案例展示页面
 * 展示客户反馈和知识分享
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
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
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

  const knowledgeCategories = [
    {
      id: 'ai-programming',
      title: { zh: 'AI编程', en: 'AI Programming' },
      description: { zh: '掌握AI编程的最新技巧和最佳实践', en: 'Master the latest AI programming tips and best practices' },
      icon: <Code className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      articles: [
        {
          title: { zh: 'Cursor编辑器完全指南：从入门到精通', en: 'Complete Guide to Cursor Editor: From Beginner to Expert' },
          excerpt: { zh: '全面解析Cursor编辑器的核心功能，包括AI代码生成、智能补全和调试技巧，让你的编程效率提升10倍', en: 'Comprehensive analysis of Cursor editor core features, including AI code generation, smart completion and debugging tips to boost your programming efficiency by 10x' },
          readTime: { zh: '8分钟阅读', en: '8 min read' },
          date: '2024-12-15',
          tags: ['Cursor', 'AI编程', '效率工具']
        },
        {
          title: { zh: 'AI编程中的常见陷阱与解决方案', en: 'Common Pitfalls in AI Programming and Solutions' },
          excerpt: { zh: '总结AI编程过程中最容易遇到的10个问题，提供实用的解决方案和预防措施，帮你避免重复踩坑', en: 'Summarize the 10 most common problems in AI programming, provide practical solutions and preventive measures to help you avoid repeated mistakes' },
          readTime: { zh: '12分钟阅读', en: '12 min read' },
          date: '2024-12-10',
          tags: ['调试技巧', '最佳实践', '问题解决']
        },
        {
          title: { zh: 'React项目中的AI工具集成实战', en: 'Practical AI Tool Integration in React Projects' },
          excerpt: { zh: '从零开始构建一个集成多种AI工具的React项目，包括代码生成、自动测试和性能优化的完整流程', en: 'Build a React project integrated with multiple AI tools from scratch, including complete workflows for code generation, automated testing and performance optimization' },
          readTime: { zh: '15分钟阅读', en: '15 min read' },
          date: '2024-12-05',
          tags: ['React', 'AI集成', '实战教程']
        },
        {
          title: { zh: 'ChatGPT API在前端开发中的最佳实践', en: 'Best Practices for ChatGPT API in Frontend Development' },
          excerpt: { zh: '深入探讨如何在前端项目中高效使用ChatGPT API，包括请求优化、错误处理和用户体验设计', en: 'In-depth exploration of how to efficiently use ChatGPT API in frontend projects, including request optimization, error handling and UX design' },
          readTime: { zh: '10分钟阅读', en: '10 min read' },
          date: '2024-12-03',
          tags: ['ChatGPT', 'API集成', '前端开发']
        },
        {
          title: { zh: 'GitHub Copilot使用技巧：让AI成为你的编程伙伴', en: 'GitHub Copilot Tips: Make AI Your Programming Partner' },
          excerpt: { zh: '分享GitHub Copilot的高级使用技巧，包括注释编写、代码补全和重构建议，最大化AI辅助编程的效果', en: 'Share advanced GitHub Copilot usage tips, including comment writing, code completion and refactoring suggestions to maximize AI-assisted programming effectiveness' },
          readTime: { zh: '9分钟阅读', en: '9 min read' },
          date: '2024-12-01',
          tags: ['GitHub Copilot', 'AI辅助', '编程技巧']
        },
        {
          title: { zh: 'AI代码审查工具对比：选择最适合的解决方案', en: 'AI Code Review Tools Comparison: Choose the Right Solution' },
          excerpt: { zh: '详细对比主流AI代码审查工具的功能特点，帮助团队选择最适合的代码质量保障方案', en: 'Detailed comparison of mainstream AI code review tools features to help teams choose the most suitable code quality assurance solution' },
          readTime: { zh: '14分钟阅读', en: '14 min read' },
          date: '2024-11-28',
          tags: ['代码审查', 'AI工具', '质量保障']
        },
        {
          title: { zh: '构建智能代码生成器：从需求到实现', en: 'Building Intelligent Code Generator: From Requirements to Implementation' },
          excerpt: { zh: '手把手教你构建一个智能代码生成器，涵盖需求分析、架构设计、模型训练和部署优化的完整过程', en: 'Step-by-step guide to building an intelligent code generator, covering the complete process from requirements analysis, architecture design, model training to deployment optimization' },
          readTime: { zh: '20分钟阅读', en: '20 min read' },
          date: '2024-11-25',
          tags: ['代码生成', '深度学习', '工程实践']
        },
        {
          title: { zh: 'AI辅助调试：快速定位和解决代码问题', en: 'AI-Assisted Debugging: Quickly Locate and Solve Code Issues' },
          excerpt: { zh: '介绍如何利用AI工具进行高效调试，包括错误诊断、性能分析和解决方案推荐', en: 'Introduction to efficient debugging using AI tools, including error diagnosis, performance analysis and solution recommendations' },
          readTime: { zh: '11分钟阅读', en: '11 min read' },
          date: '2024-11-22',
          tags: ['调试技巧', 'AI诊断', '性能优化']
        },
        {
          title: { zh: '机器学习模型在Web应用中的部署策略', en: 'Deployment Strategies for ML Models in Web Applications' },
          excerpt: { zh: '全面讲解机器学习模型的Web部署方案，包括模型压缩、边缘计算和实时推理优化', en: 'Comprehensive explanation of web deployment solutions for machine learning models, including model compression, edge computing and real-time inference optimization' },
          readTime: { zh: '18分钟阅读', en: '18 min read' },
          date: '2024-11-20',
          tags: ['模型部署', '边缘计算', 'Web应用']
        },
        {
          title: { zh: '自然语言处理在前端交互中的创新应用', en: 'Innovative Applications of NLP in Frontend Interactions' },
          excerpt: { zh: '探索NLP技术在前端用户交互中的创新应用，包括智能搜索、语音控制和文本理解', en: 'Explore innovative applications of NLP technology in frontend user interactions, including intelligent search, voice control and text understanding' },
          readTime: { zh: '13分钟阅读', en: '13 min read' },
          date: '2024-11-18',
          tags: ['NLP', '用户交互', '创新应用']
        }
      ]
    },
    {
      id: 'product-operations',
      title: { zh: '产品运营', en: 'Product Operations' },
      description: { zh: '探索产品从0到1的运营策略和增长方法', en: 'Explore product operations strategies and growth methods from 0 to 1' },
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      articles: [
        {
          title: { zh: '如何找到你的第一批种子用户', en: 'How to Find Your First Seed Users' },
          excerpt: { zh: '详解冷启动阶段的用户获取策略，从社区营销到内容营销，分享7种有效的种子用户获取方法', en: 'Detailed explanation of user acquisition strategies in the cold start phase, from community marketing to content marketing, sharing 7 effective seed user acquisition methods' },
          readTime: { zh: '10分钟阅读', en: '10 min read' },
          date: '2024-12-12',
          tags: ['用户获取', '冷启动', '增长策略']
        },
        {
          title: { zh: '构建产品增长飞轮的完整方法论', en: 'Complete Methodology for Building Product Growth Flywheel' },
          excerpt: { zh: '深入分析成功产品的增长飞轮模式，提供可复制的增长框架和实施步骤，让你的产品实现自驱动增长', en: 'In-depth analysis of successful product growth flywheel models, providing replicable growth frameworks and implementation steps for self-driven product growth' },
          readTime: { zh: '18分钟阅读', en: '18 min read' },
          date: '2024-12-08',
          tags: ['增长飞轮', '产品策略', '数据驱动']
        },
        {
          title: { zh: 'AI产品的用户体验设计原则', en: 'UX Design Principles for AI Products' },
          excerpt: { zh: '探讨AI产品特有的用户体验挑战，分享设计AI交互界面的最佳实践和用户教育策略', en: 'Explore unique UX challenges of AI products, share best practices for designing AI interaction interfaces and user education strategies' },
          readTime: { zh: '14分钟阅读', en: '14 min read' },
          date: '2024-12-03',
          tags: ['UX设计', 'AI产品', '用户体验']
        },
        {
          title: { zh: '社交媒体营销的数据驱动策略', en: 'Data-Driven Social Media Marketing Strategies' },
          excerpt: { zh: '基于数据分析的社交媒体营销方法，包括内容策略、投放优化和ROI测量的完整体系', en: 'Data analysis-based social media marketing methods, including content strategy, advertising optimization and ROI measurement complete system' },
          readTime: { zh: '12分钟阅读', en: '12 min read' },
          date: '2024-11-30',
          tags: ['社交媒体', '数据分析', '营销策略']
        },
        {
          title: { zh: '用户留存率提升的心理学原理', en: 'Psychology Principles for Improving User Retention' },
          excerpt: { zh: '运用行为心理学提升产品用户留存率，包括习惯养成、激励机制和情感连接的设计技巧', en: 'Apply behavioral psychology to improve product user retention, including habit formation, incentive mechanisms and emotional connection design techniques' },
          readTime: { zh: '16分钟阅读', en: '16 min read' },
          date: '2024-11-27',
          tags: ['用户留存', '行为心理学', '产品设计']
        },
        {
          title: { zh: 'A/B测试的高级技巧与陷阱避免', en: 'Advanced A/B Testing Techniques and Pitfall Avoidance' },
          excerpt: { zh: '深度解析A/B测试的高级技巧，包括实验设计、统计分析和结果解读的科学方法', en: 'In-depth analysis of advanced A/B testing techniques, including scientific methods for experiment design, statistical analysis and result interpretation' },
          readTime: { zh: '15分钟阅读', en: '15 min read' },
          date: '2024-11-24',
          tags: ['A/B测试', '数据科学', '实验设计']
        },
        {
          title: { zh: '内容营销的SEO优化策略', en: 'SEO Optimization Strategies for Content Marketing' },
          excerpt: { zh: '结合SEO和内容营销的策略，包括关键词研究、内容规划和链接建设的系统方法', en: 'Strategies combining SEO and content marketing, including systematic methods for keyword research, content planning and link building' },
          readTime: { zh: '13分钟阅读', en: '13 min read' },
          date: '2024-11-21',
          tags: ['SEO', '内容营销', '搜索引擎']
        },
        {
          title: { zh: '客户成功管理的完整体系', en: 'Complete Customer Success Management System' },
          excerpt: { zh: '构建客户成功管理体系，包括客户分层、健康度评估和主动服务的实施框架', en: 'Build customer success management system, including customer segmentation, health assessment and proactive service implementation framework' },
          readTime: { zh: '17分钟阅读', en: '17 min read' },
          date: '2024-11-18',
          tags: ['客户成功', '客户管理', '服务体系']
        },
        {
          title: { zh: '产品定价策略的心理学应用', en: 'Psychology Applications in Product Pricing Strategies' },
          excerpt: { zh: '运用消费心理学制定产品定价策略，包括锚定效应、损失厌恶和价值感知的定价技巧', en: 'Apply consumer psychology to develop product pricing strategies, including anchoring effect, loss aversion and value perception pricing techniques' },
          readTime: { zh: '11分钟阅读', en: '11 min read' },
          date: '2024-11-15',
          tags: ['定价策略', '消费心理学', '价值感知']
        },
        {
          title: { zh: '跨平台用户行为分析与优化', en: 'Cross-Platform User Behavior Analysis and Optimization' },
          excerpt: { zh: '分析用户在不同平台的行为差异，提供跨平台用户体验优化和数据整合的方法', en: 'Analyze user behavior differences across platforms, provide methods for cross-platform user experience optimization and data integration' },
          readTime: { zh: '14分钟阅读', en: '14 min read' },
          date: '2024-11-12',
          tags: ['跨平台', '用户行为', '数据分析']
        }
      ]
    },
    {
      id: 'business-design',
      title: { zh: '商业化设计', en: 'Commercialization Design' },
      description: { zh: '学习如何将技术产品转化为可持续的商业模式', en: 'Learn how to transform technical products into sustainable business models' },
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      articles: [
        {
          title: { zh: '从免费工具到付费产品的转化策略', en: 'Conversion Strategies from Free Tools to Paid Products' },
          excerpt: { zh: '分析成功的免费增值模式案例，详解如何设计付费功能、定价策略和用户转化漏斗，实现可持续收入', en: 'Analyze successful freemium model cases, explain how to design paid features, pricing strategies and user conversion funnels for sustainable revenue' },
          readTime: { zh: '16分钟阅读', en: '16 min read' },
          date: '2024-12-14',
          tags: ['商业模式', '付费转化', '定价策略']
        },
        {
          title: { zh: 'AI工具的护城河构建指南', en: 'Guide to Building Moats for AI Tools' },
          excerpt: { zh: '深度探讨AI时代的竞争壁垒，从数据护城河到网络效应，教你构建难以复制的竞争优势', en: 'Deep dive into competitive barriers in the AI era, from data moats to network effects, teaching you to build irreplicable competitive advantages' },
          readTime: { zh: '20分钟阅读', en: '20 min read' },
          date: '2024-12-09',
          tags: ['竞争策略', '护城河', '商业模式']
        },
        {
          title: { zh: '技术创业者的融资准备清单', en: 'Funding Preparation Checklist for Tech Entrepreneurs' },
          excerpt: { zh: '为技术背景的创业者准备的完整融资指南，包括商业计划书撰写、投资人沟通和估值谈判技巧', en: 'Complete funding guide for tech entrepreneurs, including business plan writing, investor communication and valuation negotiation skills' },
          readTime: { zh: '22分钟阅读', en: '22 min read' },
          date: '2024-12-01',
          tags: ['融资', '创业', '商业计划']
        },
        {
          title: { zh: 'SaaS产品的订阅模式设计', en: 'Subscription Model Design for SaaS Products' },
          excerpt: { zh: '深入解析SaaS订阅模式的设计原则，包括套餐规划、计费策略和客户生命周期价值优化', en: 'In-depth analysis of SaaS subscription model design principles, including package planning, billing strategies and customer lifetime value optimization' },
          readTime: { zh: '18分钟阅读', en: '18 min read' },
          date: '2024-11-28',
          tags: ['SaaS', '订阅模式', '客户价值']
        },
        {
          title: { zh: '平台经济的网络效应设计', en: 'Network Effect Design in Platform Economy' },
          excerpt: { zh: '分析平台经济中网络效应的构建方法，包括双边市场设计、生态系统建设和价值创造机制', en: 'Analyze network effect construction methods in platform economy, including two-sided market design, ecosystem building and value creation mechanisms' },
          readTime: { zh: '19分钟阅读', en: '19 min read' },
          date: '2024-11-25',
          tags: ['平台经济', '网络效应', '生态系统']
        },
        {
          title: { zh: '数字产品的知识产权保护策略', en: 'IP Protection Strategies for Digital Products' },
          excerpt: { zh: '针对数字产品的知识产权保护策略，包括专利申请、商标注册和技术秘密保护的实用指南', en: 'IP protection strategies for digital products, including practical guides for patent applications, trademark registration and trade secret protection' },
          readTime: { zh: '15分钟阅读', en: '15 min read' },
          date: '2024-11-22',
          tags: ['知识产权', '法律保护', '数字产品']
        },
        {
          title: { zh: '全球化产品的本地化商业策略', en: 'Localization Business Strategies for Global Products' },
          excerpt: { zh: '探讨产品全球化过程中的本地化商业策略，包括市场调研、文化适应和监管合规的方法', en: 'Explore localization business strategies in product globalization, including market research, cultural adaptation and regulatory compliance methods' },
          readTime: { zh: '17分钟阅读', en: '17 min read' },
          date: '2024-11-19',
          tags: ['全球化', '本地化', '商业策略']
        },
        {
          title: { zh: '区块链项目的代币经济学设计', en: 'Tokenomics Design for Blockchain Projects' },
          excerpt: { zh: '详解区块链项目的代币经济学设计原理，包括代币分配、激励机制和价值捕获的系统方法', en: 'Detailed explanation of tokenomics design principles for blockchain projects, including token distribution, incentive mechanisms and value capture systematic methods' },
          readTime: { zh: '21分钟阅读', en: '21 min read' },
          date: '2024-11-16',
          tags: ['区块链', '代币经济学', '激励机制']
        },
        {
          title: { zh: '数据驱动的商业模式创新', en: 'Data-Driven Business Model Innovation' },
          excerpt: { zh: '利用数据分析驱动商业模式创新，包括用户洞察、市场机会识别和商业价值挖掘的方法', en: 'Use data analysis to drive business model innovation, including user insights, market opportunity identification and business value mining methods' },
          readTime: { zh: '16分钟阅读', en: '16 min read' },
          date: '2024-11-13',
          tags: ['数据驱动', '商业创新', '价值挖掘']
        },
        {
          title: { zh: '可持续发展的商业模式设计', en: 'Sustainable Business Model Design' },
          excerpt: { zh: '设计兼顾商业价值和社会责任的可持续商业模式，包括ESG整合、循环经济和影响力投资的策略', en: 'Design sustainable business models that balance commercial value and social responsibility, including ESG integration, circular economy and impact investing strategies' },
          readTime: { zh: '20分钟阅读', en: '20 min read' },
          date: '2024-11-10',
          tags: ['可持续发展', 'ESG', '社会责任']
        }
      ]
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

      {/* Cases Section - 直接展示案例，无标题 */}
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

      {/* Knowledge Articles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent({
                zh: '经验|方法|技巧',
                en: 'Experience | Methods | Tips'
              })}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {getContent({
                zh: '我们持续分享AI编程、产品运营和商业化设计的实用知识，帮助每个创作者在技术和商业路上走得更远',
                en: 'We continuously share practical knowledge in AI programming, product operations, and commercialization design to help every creator go further on their technical and business journey'
              })}
            </p>
          </motion.div>

          <div className="space-y-20">
            {knowledgeCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {getContent(category.title)}
                    </h3>
                    <p className="text-gray-600">
                      {getContent(category.description)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {category.articles.map((article, articleIndex) => (
                    <motion.article
                      key={articleIndex}
                      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: articleIndex * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} text-white`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                          {getContent(article.title)}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {getContent(article.excerpt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{article.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{getContent(article.readTime)}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.article>
                  ))}
                </div>

                <motion.div
                  className="text-center mt-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <button className={`inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r ${category.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm`}>
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {getContent({
                        zh: `查看更多${getContent(category.title)}文章`,
                        en: `View More ${getContent(category.title)} Articles`
                      })}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-20 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {getContent({
                  zh: '订阅知识更新',
                  en: 'Subscribe to Knowledge Updates'
                })}
              </h3>
              <p className="text-gray-600 mb-6">
                {getContent({
                  zh: '每周精选最新的AI编程技巧、产品运营策略和商业化案例，直接发送到你的邮箱',
                  en: 'Weekly curated latest AI programming tips, product operation strategies and commercialization cases, delivered directly to your inbox'
                })}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={getContent({
                    zh: '输入你的邮箱地址',
                    en: 'Enter your email address'
                  })}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                <button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                  {getContent({
                    zh: '立即订阅',
                    en: 'Subscribe Now'
                  })}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};