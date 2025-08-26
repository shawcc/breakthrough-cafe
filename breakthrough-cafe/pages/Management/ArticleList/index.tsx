/**
 * 文章列表管理页面
 * 显示所有文章并提供批量管理功能
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useArticles, useCategories } from '../../../hooks/useArticles';
import { useArticleManagement } from '../../../hooks/useArticleManagement';

export const ArticleListManagement: React.FC = () => {
  const { getContent } = useLanguage();
  const navigate = useNavigate();
  const { deleteArticle, isLoading } = useArticleManagement();
  const { categories } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // 获取文章数据 - 修复筛选条件构建
  const { articles, total, mutate, isLoading: articlesLoading, error: articlesError } = useArticles({
    category: selectedCategory || undefined,
    status: (selectedStatus || undefined) as 'draft' | 'published' | undefined, // 修复类型转换
    limit: 50,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  // 🔥 终极修复：监听全局文章更新事件，强制刷新数据
  React.useEffect(() => {
    const handleArticleUpdate = (event: CustomEvent) => {
      console.log('📡 收到全局文章更新事件:', event.detail);
      console.log('🔄 强制刷新文章列表数据...');
      
      // 🔥 关键修复：使用 revalidate: true 强制重新验证
      mutate(undefined, { revalidate: true });
      
      // 额外延迟后再次刷新，确保数据一致性
      setTimeout(() => {
        console.log('🔄 延迟二次刷新...');
        mutate(undefined, { revalidate: true });
      }, 200);
    };
    
    window.addEventListener('articleUpdated', handleArticleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('articleUpdated', handleArticleUpdate as EventListener);
    };
  }, [mutate]);

  // 在组件挂载时输出调试信息
  React.useEffect(() => {
    console.log('📋 === 文章列表管理页面调试信息 ===');
    console.log('🕒 调试时间:', new Date().toISOString());
    console.log('🔍 当前筛选条件:');
    console.log('  - 选中分类:', selectedCategory || '全部');
    console.log('  - 选中状态:', selectedStatus || '全部');
    console.log('  - 搜索关键词:', searchQuery || '无');
    console.log('📊 数据状态:');
    console.log('  - 加载中:', articlesLoading);
    console.log('  - 错误:', articlesError?.message || '无');
    console.log('  - 总文章数:', total);
    console.log('  - 当前显示:', articles.length);
    
    if (articlesError) {
      console.error('🚨 文章列表请求错误详情:', articlesError);
    }
    
    console.log('📝 文章状态分布:');
    const statusCount = articles.reduce((acc, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('  - 草稿:', statusCount.draft || 0);
    console.log('  - 已发布:', statusCount.published || 0);
    
    // 输出所有文章的详细信息
    if (articles.length > 0) {
      console.log('📋 所有文章详情:');
      articles.forEach((article, index) => {
        console.log(`  ${index + 1}. ${getContent(article.title)} - 状态: ${article.status} - 更新: ${new Date(article.updatedAt).toLocaleString()}`);
      });
    } else if (!articlesLoading) {
      console.log('⚠️ 没有文章数据');
    }
  }, [articles, total, selectedCategory, selectedStatus, searchQuery, getContent, articlesLoading, articlesError]);

  // 强制刷新按钮
  const handleForceRefresh = async () => {
    console.log('🔄 强制刷新文章列表...');
    await mutate();
    console.log('✅ 强制刷新完成');
  };

  // 验证文章数据按钮 - 新增调试功能
  const handleVerifyArticle = async () => {
    const firstArticle = articles[0];
    if (!firstArticle) {
      alert('没有文章可验证');
      return;
    }
    
    try {
      console.log('🔍 验证文章数据:', firstArticle._id);
      
      const verifyResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles/debug/verify-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articleId: firstArticle._id
        })
      });
      
      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error('❌ 验证请求失败:', errorText);
        alert(`验证请求失败: ${verifyResponse.status} ${errorText}`);
        return;
      }
      
      const verifyData = await verifyResponse.json();
      console.log('📊 验证结果:', verifyData);
      
      // 显示验证结果
      let message = `文章数据验证结果:\n\n`;
      message += `数据库中的标题: ${verifyData.databaseData?.title?.zh || '未知'}\n`;
      message += `API返回的标题: ${verifyData.apiData?.title?.zh || '未知'}\n`;
      message += `前端显示的标题: ${getContent(firstArticle.title)}\n\n`;
      message += `标题一致性: ${verifyData.consistency?.titleConsistent ? '✅' : '❌'}\n`;
      message += `状态一致性: ${verifyData.consistency?.statusConsistent ? '✅' : '❌'}\n\n`;
      message += `请查看控制台获取详细信息。`;
      
      alert(message);
    } catch (error) {
      console.error('❌ 验证文章数据失败:', error);
      alert(`验证失败: ${error.message}`);
    }
  };

  // 检查数据库按钮 - 新增调试功能
  const handleCheckDatabase = async () => {
    try {
      console.log('🔍 检查数据库状态...');
      
      // 请求服务端健康检查
      const healthResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/health`);
      const healthData = await healthResponse.json();
      console.log('🏥 服务端健康状态:', healthData);
      
      // 请求所有文章（无筛选条件）
      const allArticlesResponse = await fetch(`${process.env.AIPA_API_DOMAIN}/api/articles?limit=100`);
      const allArticlesData = await allArticlesResponse.json();
      console.log('📊 所有文章数据:', allArticlesData);
      
      alert(`数据库检查完成！\n总文章数: ${allArticlesData.total || 0}\n请查看控制台获取详细信息。`);
    } catch (error) {
      console.error('❌ 数据库检查失败:', error);
      alert(`数据库检查失败: ${error.message}`);
    }
  };

  // 过滤搜索结果
  const filteredArticles = articles.filter(article => {
    const title = getContent(article.title).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query);
  });

  const handleDelete = async (articleId: string) => {
    if (window.confirm(getContent({
      zh: '确定要删除这篇文章吗？此操作不可恢复。',
      en: 'Are you sure you want to delete this article? This action cannot be undone.'
    }))) {
      try {
        await deleteArticle(articleId);
        mutate(); // 刷新列表
      } catch (error) {
        // 错误已在hook中处理
      }
    }
  };

  const toggleSelectArticle = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const selectAllArticles = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(article => article._id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getContent({ zh: '文章管理', en: 'Article Management' })}
          </h1>
          <p className="text-gray-600 mt-1">
            {getContent({ 
              zh: `共 ${total} 篇文章`, 
              en: `${total} articles in total` 
            })}
            {articlesLoading && (
              <span className="ml-2 text-blue-500">正在加载...</span>
            )}
            {articlesError && (
              <span className="ml-2 text-red-500">加载失败</span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* 验证文章数据按钮 */}
          <button
            onClick={handleVerifyArticle}
            className="px-3 py-2 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
          >
            🔍 验证数据
          </button>

          {/* 数据库检查按钮 */}
          <button
            onClick={handleCheckDatabase}
            className="px-3 py-2 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
          >
            🔍 检查数据库
          </button>

          {/* 调试刷新按钮 */}
          <button
            onClick={handleForceRefresh}
            className="px-3 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            🔄 强制刷新
          </button>

          <button
            onClick={() => navigate('/management/articles/new')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>{getContent({ zh: '创建新文章', en: 'Create New Article' })}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={getContent({ zh: '搜索文章...', en: 'Search articles...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">{getContent({ zh: '所有分类', en: 'All Categories' })}</option>
            {Array.isArray(categories) && categories.map((category) => (
              <option key={category._id} value={category.slug}>
                {getContent(category.title)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              console.log('🔄 状态筛选变更:', e.target.value);
              setSelectedStatus(e.target.value);
            }}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">{getContent({ zh: '所有状态', en: 'All Status' })}</option>
            <option value="published">{getContent({ zh: '已发布', en: 'Published' })}</option>
            <option value="draft">{getContent({ zh: '草稿', en: 'Draft' })}</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                onChange={selectAllArticles}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
            </label>
            <span className="text-sm font-medium text-gray-600">
              {getContent({ zh: '全选', en: 'Select All' })}
            </span>
            {selectedArticles.length > 0 && (
              <span className="text-sm text-orange-600">
                {getContent({ 
                  zh: `已选择 ${selectedArticles.length} 篇`, 
                  en: `${selectedArticles.length} selected` 
                })}
              </span>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-gray-100">
          {filteredArticles.map((article) => (
            <motion.div
              key={article._id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article._id)}
                    onChange={() => toggleSelectArticle(article._id)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </label>

                {/* Article Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {getContent(article.title)}
                    </h3>
                    {article.isFeatured && (
                      <Star className="w-4 h-4 text-orange-500 fill-current" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {article.status === 'published' 
                        ? getContent({ zh: '已发布', en: 'Published' })
                        : getContent({ zh: '草稿', en: 'Draft' })
                      }
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {getContent(article.excerpt)}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views} {getContent({ zh: '浏览', en: 'views' })}</span>
                    </div>
                    <span>{article.author}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/articles/${article._id}`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={getContent({ zh: '预览', en: 'Preview' })}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/management/articles/${article._id}`)}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title={getContent({ zh: '编辑', en: 'Edit' })}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(article._id)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title={getContent({ zh: '删除', en: 'Delete' })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {getContent({ zh: '暂无文章', en: 'No Articles Found' })}
            </h3>
            <p className="text-gray-500 mb-6">
              {getContent({ 
                zh: '创建您的第一篇文章开始吧', 
                en: 'Create your first article to get started' 
              })}
            </p>
            <button
              onClick={() => navigate('/management/articles/new')}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              {getContent({ zh: '创建新文章', en: 'Create New Article' })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};