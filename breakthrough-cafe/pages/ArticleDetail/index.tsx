/**
 * 文章详情页面
 * 展示单篇文章的完整内容
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useArticleDetail } from '../../hooks/useArticles';
import { ArrowLeft, Calendar, Clock, User, Eye, Share2, Star } from 'lucide-react';

export const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContent } = useLanguage();
  
  const { article, isLoading, error } = useArticleDetail(id!);

  // 🔒 安全检查：验证文章状态
  React.useEffect(() => {
    if (article) {
      console.log('🔍 文章详情页面 - 状态检查:');
      console.log('  - 文章ID:', article._id);
      console.log('  - 文章标题:', getContent(article.title));
      console.log('  - 文章状态:', article.status);
      console.log('  - 发布时间:', article.publishedAt);
      
      // 检查是否为草稿状态
      if (article.status !== 'published') {
        console.error('🚨 安全警告：尝试访问非已发布状态的文章！');
        console.error('  - 文章状态:', article.status);
        console.error('  - 将重定向到文章列表页面');
        
        // 重定向到文章列表，不允许访问草稿
        navigate('/articles', { replace: true });
        return;
      }
      
      console.log('✅ 文章状态检查通过：已发布文章');
    }
  }, [article, navigate, getContent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="flex space-x-4 mb-8">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔒 重要：如果文章不存在、有错误、或者不是已发布状态，都显示错误页面
  if (error || !article || article.status !== 'published') {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {getContent({
              zh: '文章不存在',
              en: 'Article Not Found'
            })}
          </h1>
          <p className="text-gray-600 mb-8">
            {getContent({
              zh: '抱歉，您要查看的文章不存在或尚未发布',
              en: 'Sorry, the article you are looking for does not exist or has not been published yet'
            })}
          </p>
          <button
            onClick={() => navigate('/articles')}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
          >
            {getContent({
              zh: '返回文章列表',
              en: 'Back to Articles'
            })}
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getContent(article.title),
          text: getContent(article.excerpt),
          url: window.location.href
        });
      } catch (error) {
        console.log('分享失败:', error);
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      // 这里可以添加 toast 提示
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            onClick={() => navigate('/articles')}
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{getContent({ zh: '返回文章列表', en: 'Back to Articles' })}</span>
          </motion.button>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Article Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 mr-1" />
                {getContent({ zh: '精选文章', en: 'Featured Article' })}
              </span>
            )}
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {getContent(article.title)}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{getContent(article.readTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{article.views} {getContent({ zh: '浏览', en: 'views' })}</span>
            </div>
          </div>

          {/* Article Excerpt */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed italic">
              {getContent(article.excerpt)}
            </p>
          </div>

          {/* Share Button */}
          <div className="flex justify-end">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{getContent({ zh: '分享文章', en: 'Share Article' })}</span>
            </button>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          className="prose prose-lg max-w-none mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            lineHeight: '1.8',
            fontSize: '16px'
          }}
        >
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: getContent(article.content).replace(/\n/g, '<br>') 
            }} 
          />
        </motion.div>

        {/* Article Footer */}
        <motion.footer
          className="border-t border-gray-200 pt-8 pb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {getContent({
                zh: '喜欢这篇文章？',
                en: 'Like This Article?'
              })}
            </h3>
            <p className="text-gray-600 mb-6">
              {getContent({
                zh: '订阅我们的更新，获取更多实用的技术文章和经验分享',
                en: 'Subscribe to our updates for more practical technical articles and experience sharing'
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
                  zh: '订阅',
                  en: 'Subscribe'
                })}
              </button>
            </div>
          </div>
        </motion.footer>
      </article>
    </div>
  );
};