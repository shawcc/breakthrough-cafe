/**
 * 管理后台仪表板
 * 显示文章统计信息和快速操作
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  Star, 
  Calendar,
  BarChart3,
  Settings,
  Database
} from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useArticles, useCategories } from '../../../hooks/useArticles';

export const ManagementDashboard: React.FC = () => {
  const { getContent } = useLanguage();
  const navigate = useNavigate();
  
  // 获取统计数据
  const { articles: allArticles, total: totalArticles } = useArticles({ 
    limit: 1000, 
    status: 'published' 
  });
  const { articles: draftArticles } = useArticles({ 
    limit: 1000, 
    status: 'draft' 
  });
  const { articles: featuredArticles } = useArticles({ 
    limit: 1000, 
    isFeatured: true 
  });
  const { categories } = useCategories();

  // 计算统计信息
  const totalViews = allArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  const statsCards = [
    {
      title: getContent({ zh: '已发布文章', en: 'Published Articles' }),
      value: totalArticles,
      icon: FileText,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: getContent({ zh: '草稿文章', en: 'Draft Articles' }),
      value: draftArticles.length,
      icon: Calendar,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: getContent({ zh: '精选文章', en: 'Featured Articles' }),
      value: featuredArticles.length,
      icon: Star,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: getContent({ zh: '总浏览量', en: 'Total Views' }),
      value: totalViews,
      icon: TrendingUp,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      title: getContent({ zh: '创建新文章', en: 'Create New Article' }),
      description: getContent({ zh: '撰写并发布新的文章', en: 'Write and publish a new article' }),
      icon: PlusCircle,
      action: () => navigate('/management/articles/new'),
      color: 'from-orange-600 to-amber-600'
    },
    {
      title: getContent({ zh: '管理文章', en: 'Manage Articles' }),
      description: getContent({ zh: '编辑、删除和管理现有文章', en: 'Edit, delete and manage existing articles' }),
      icon: FileText,
      action: () => navigate('/management/articles'),
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: getContent({ zh: '分类管理', en: 'Category Management' }),
      description: getContent({ zh: '创建和管理文章分类', en: 'Create and manage article categories' }),
      icon: Settings,
      action: () => navigate('/management/categories'),
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: getContent({ zh: '数据统计', en: 'Analytics' }),
      description: getContent({ zh: '查看文章阅读和用户统计', en: 'View article reads and user statistics' }),
      icon: BarChart3,
      action: () => navigate('/management/analytics'),
      color: 'from-green-600 to-teal-600'
    },
    {
      title: getContent({ zh: '数据一致性验证', en: 'Data Consistency Check' }),
      description: getContent({ zh: '调试和验证文章数据一致性问题', en: 'Debug and verify article data consistency issues' }),
      icon: Database,
      action: () => navigate('/management/data-consistency'),
      color: 'from-red-600 to-rose-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getContent({ zh: '管理后台', en: 'Management Dashboard' })}
        </h1>
        <p className="text-gray-600">
          {getContent({ 
            zh: '欢迎回来！这里是您的文章管理中心', 
            en: 'Welcome back! This is your article management center' 
          })}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {getContent({ zh: '快速操作', en: 'Quick Actions' })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={action.action}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Articles Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {getContent({ zh: '最近文章', en: 'Recent Articles' })}
        </h2>
        <div className="space-y-4">
          {allArticles.slice(0, 5).map((article) => (
            <div 
              key={article._id} 
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {getContent(article.title)}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span>{article.views} {getContent({ zh: '浏览', en: 'views' })}</span>
                  {article.isFeatured && (
                    <span className="text-orange-600">
                      {getContent({ zh: '精选', en: 'Featured' })}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate(`/management/articles/${article._id}`)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                {getContent({ zh: '编辑', en: 'Edit' })}
              </button>
            </div>
          ))}
        </div>
        
        {allArticles.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {getContent({ zh: '还没有发布的文章', en: 'No published articles yet' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
