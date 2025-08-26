/**
 * 文章列表页面
 * 展示所有文章，支持分类筛选和搜索
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useArticles, useCategories } from '../../hooks/useArticles';
import { Search, Calendar, Clock, ArrowRight, Filter, Star } from 'lucide-react';

export const Articles: React.FC = () => {
  const { getContent } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { categories } = useCategories();
  
  // 🔒 重要修复：公开页面只显示已发布的文章
  const { articles, total, isLoading } = useArticles({
    category: selectedCategory || undefined,
    isFeatured: showFeaturedOnly || undefined,
    status: 'published', // ✅ 强制只获取已发布文章
    limit: 20,
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  console.log('🔍 公开文章页面 - 筛选条件检查:');
  console.log('  - status: 强制设为 published');
  console.log('  - category:', selectedCategory || '全部');
  console.log('  - isFeatured:', showFeaturedOnly);
  console.log('📊 获取到的文章:');
  console.log('  - 总数:', total);
  console.log('  - 当前显示:', articles.length);
  
  // 验证所有文章都是已发布状态
  const draftArticles = articles.filter(article => article.status !== 'published');
  if (draftArticles.length > 0) {
    console.error('🚨 严重错误：公开页面出现了草稿文章！');
    console.error('草稿文章列表:', draftArticles.map(a => ({ id: a._id, title: getContent(a.title), status: a.status })));
  } else {
    console.log('✅ 状态检查通过：所有文章都是已发布状态');
  }

  // 过滤搜索结果
  const filteredArticles = articles.filter(article => {
    const title = getContent(article.title).toLowerCase();
    const excerpt = getContent(article.excerpt).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || excerpt.includes(query);
  });

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {getContent({
                zh: '经验 | 方法 | 技巧',
                en: 'Experience | Methods | Tips'
              })}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getContent({
                zh: '持续分享AI编程、产品运营和商业化设计的实用知识',
                en: 'Continuously sharing practical knowledge in AI programming, product operations, and commercialization design'
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={getContent({
                  zh: '搜索文章...',
                  en: 'Search articles...'
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getContent({ zh: '全部', en: 'All' })}
              </button>
              {Array.isArray(categories) && categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getContent(category.title)}
                </button>
              ))}
            </div>

            {/* Featured Filter */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 rounded-full transition-colors ${
                  showFeaturedOnly ? 'bg-orange-600' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    showFeaturedOnly ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {getContent({ zh: '仅显示精选', en: 'Featured Only' })}
                </span>
              </label>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-500">
            {getContent({
              zh: `找到 ${filteredArticles.length} 篇文章`,
              en: `Found ${filteredArticles.length} articles`
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article._id}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  onClick={() => handleArticleClick(article._id)}
                >
                  {/* Article Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.isFeatured && (
                      <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 mr-1" />
                        {getContent({ zh: '精选', en: 'Featured' })}
                      </span>
                    )}
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Article Title */}
                  <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                    {getContent(article.title)}
                  </h2>

                  {/* Article Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {getContent(article.excerpt)}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
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
          )}

          {/* Empty State */}
          {!isLoading && filteredArticles.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {getContent({
                  zh: '暂无文章',
                  en: 'No Articles Found'
                })}
              </h3>
              <p className="text-gray-500">
                {getContent({
                  zh: '试试调整搜索条件或分类筛选',
                  en: 'Try adjusting your search terms or category filters'
                })}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};