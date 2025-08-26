import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../hooks/useLanguage';
import { useArticleManagement } from '../../../hooks/useArticleManagement';
import { useArticleDetail } from '../../../hooks/useArticles';
import { useCategories } from '../../../hooks/useArticles';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Article } from '../../../shared/types/article';
import ReactQuill from 'react-quill';

export const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContent } = useLanguage();
  const { 
    createArticle, 
    updateArticle, 
    auth,
    cleanup
  } = useArticleManagement();
  const { categories } = useCategories();
  
  // 🔥 组件挂载状态追踪 - 防止React错误#185
  const isMountedRef = useRef(true);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isEditing = id !== 'new';
  const { article } = useArticleDetail(isEditing ? id! : '');

  // 🔥 状态初始化 - 确保稳定的默认值
  const getInitialFormData = useCallback((): Partial<Article> => ({
    title: { zh: '', en: '' },
    excerpt: { zh: '', en: '' },
    content: { zh: '', en: '' },
    category: '',
    tags: [],
    readTime: { zh: '5分钟', en: '5 min read' },
    author: '拨云见日团队',
    status: 'draft',
    isFeatured: false,
    coverImage: ''
  }), []);

  const [formData, setFormData] = useState<Partial<Article>>(getInitialFormData);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 🔥 安全状态更新函数
  const safeSetState = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T | ((prev: T) => T)) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  // 🔥 文章数据更新处理 - 防止无限循环
  const updateFormData = useCallback((articleData: Article) => {
    if (!isMountedRef.current || isDataLoaded) return;
    
    console.log('📥 加载文章数据:', articleData.title?.zh);
    safeSetState(setFormData, articleData);
    safeSetState(setIsDataLoaded, true);
  }, [isDataLoaded, safeSetState]);

  // 🔥 数据同步逻辑 - 使用稳定的依赖
  useEffect(() => {
    if (isEditing && article && !isDataLoaded && isMountedRef.current) {
      updateFormData(article);
    }
  }, [isEditing, article, isDataLoaded, updateFormData]);

  // 🔥 组件挂载和清理逻辑
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      console.log('🧹 ArticleEditor 组件卸载，执行清理');
      isMountedRef.current = false;
      
      // 清理定时器
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      
      // 调用管理hook的清理函数
      cleanup();
    };
  }, [cleanup]);

  // 富文本编辑器配置
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image'
  ];

  // 🔥 安全的输入处理函数
  const handleInputChange = useCallback((field: string, value: any) => {
    if (!isMountedRef.current) return;
    
    safeSetState(setFormData, prev => ({
      ...prev,
      [field]: value
    }));
    safeSetState(setError, null);
  }, [safeSetState]);

  const handleMultiLangChange = useCallback((field: string, lang: 'zh' | 'en', value: string) => {
    if (!isMountedRef.current) return;
    
    safeSetState(setFormData, prev => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev] as any,
        [lang]: value
      }
    }));
    safeSetState(setError, null);
  }, [safeSetState]);

  const addTag = useCallback(() => {
    if (!isMountedRef.current || !newTag.trim()) return;
    
    if (!formData.tags?.includes(newTag.trim())) {
      safeSetState(setFormData, prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      safeSetState(setNewTag, '');
    }
  }, [newTag, formData.tags, safeSetState]);

  const removeTag = useCallback((tagToRemove: string) => {
    if (!isMountedRef.current) return;
    
    safeSetState(setFormData, prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  }, [safeSetState]);

  // 🔥 异步提交处理 - 修复认证状态检查
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMountedRef.current) return;
    
    console.log('🚀 开始保存文章流程');
    console.log('🔐 当前认证状态:', auth);
    
    // 🔥 修复认证检查 - 确保状态已初始化
    if (!auth.isInitialized) {
      console.log('⏳ 认证状态尚未初始化，等待...');
      safeSetState(setError, '正在初始化认证状态，请稍候重试');
      return;
    }
    
    if (!auth.isAuthenticated) {
      console.log('❌ 用户未认证');
      safeSetState(setError, '会话已过期，请重新登录');
      return;
    }
    
    safeSetState(setIsLoading, true);
    safeSetState(setError, null);
    
    try {
      // 表单验证
      const validationErrors = [];
      
      if (!formData.title?.zh?.trim()) validationErrors.push('中文标题不能为空');
      if (!formData.title?.en?.trim()) validationErrors.push('英文标题不能为空');
      if (!formData.excerpt?.zh?.trim()) validationErrors.push('中文摘要不能为空');  
      if (!formData.excerpt?.en?.trim()) validationErrors.push('英文摘要不能为空');
      if (!formData.content?.zh?.trim()) validationErrors.push('中文内容不能为空');
      if (!formData.content?.en?.trim()) validationErrors.push('英文内容不能为空');
      if (!formData.category?.trim()) validationErrors.push('分类不能为空');
      if (!formData.author?.trim()) validationErrors.push('作者不能为空');
      
      if (validationErrors.length > 0) {
        if (isMountedRef.current) {
          safeSetState(setError, `表单验证失败：${validationErrors.join('; ')}`);
          safeSetState(setIsLoading, false);
        }
        return;
      }
      
      console.log('✅ 前端验证通过，准备构建提交数据');
      
      // 构建提交数据
      const submitData = {
        title: {
          zh: formData.title!.zh.trim(),
          en: formData.title!.en.trim()
        },
        excerpt: {
          zh: formData.excerpt!.zh.trim(),
          en: formData.excerpt!.en.trim()
        },
        content: {
          zh: formData.content!.zh.trim(),
          en: formData.content!.en.trim()
        },
        category: formData.category!.trim(),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        readTime: {
          zh: formData.readTime?.zh?.trim() || '5分钟',
          en: formData.readTime?.en?.trim() || '5 min read'
        },
        isFeatured: Boolean(formData.isFeatured),
        author: formData.author!.trim(),
        status: (formData.status || 'draft') as 'draft' | 'published',
        ...(formData.coverImage?.trim() && { coverImage: formData.coverImage.trim() })
      };
      
      console.log('📤 最终提交数据:', JSON.stringify(submitData, null, 2));
      
      let result;
      if (isEditing) {
        console.log('📝 执行更新操作，文章ID:', id);
        result = await updateArticle(id!, submitData);
      } else {
        console.log('🆕 执行创建操作');
        result = await createArticle(submitData);
      }
      
      console.log('✅ 保存完成，结果:', result);
      
      // 🔥 安全导航 - 确保组件仍然挂载
      if (isMountedRef.current) {
        console.log('🎉 保存成功，准备跳转');
        
        // 使用ref而不是useState来管理定时器
        cleanupTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            navigate('/management/articles');
          }
        }, 100);
      }
      
    } catch (error) {
      console.error('💥 保存失败详细错误:', error);
      
      if (!isMountedRef.current) return;
      
      let errorMessage = '保存失败';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      safeSetState(setError, errorMessage);
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsLoading, false);
      }
    }
  }, [
    formData, 
    auth, 
    isEditing, 
    id, 
    updateArticle, 
    createArticle, 
    navigate, 
    safeSetState
  ]);

  const handlePreview = useCallback(() => {
    if (isEditing && isMountedRef.current) {
      window.open(`/articles/${id}`, '_blank');
    }
  }, [isEditing, id]);

  const handleBack = useCallback(() => {
    if (isMountedRef.current) {
      navigate('/management/articles');
    }
  }, [navigate]);

  const handleDismissError = useCallback(() => {
    if (isMountedRef.current) {
      safeSetState(setError, null);
    }
  }, [safeSetState]);

  // 🔥 如果组件已卸载，不渲染任何内容
  if (!isMountedRef.current) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing 
                ? getContent({ zh: '编辑文章', en: 'Edit Article' })
                : getContent({ zh: '创建新文章', en: 'Create New Article' })
              }
            </h1>
            {isEditing && (
              <p className="text-gray-600 mt-1">
                {getContent(formData.title || { zh: '', en: '' })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isEditing && (
            <button
              onClick={handlePreview}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{getContent({ zh: '预览', en: 'Preview' })}</span>
            </button>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || !auth.isInitialized}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {isLoading 
                ? getContent({ zh: '保存中...', en: 'Saving...' })
                : getContent({ zh: '保存', en: 'Save' })
              }
            </span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">保存失败</h3>
              <p className="text-sm text-red-600 mt-1">
                {typeof error === 'string' ? error : '保存文章时发生未知错误，请重试'}
              </p>
            </div>
            <button
              onClick={handleDismissError}
              className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Authentication Status Debug */}
      {!auth.isInitialized && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            ⏳ 正在初始化认证状态，请稍候...
          </p>
        </div>
      )}

      {auth.isInitialized && !auth.isAuthenticated && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800 text-sm">
            🔐 未认证状态，无法保存文章。请刷新页面或重新登录。
          </p>
        </div>
      )}

      {/* Language Toggle */}
      <div className="flex mb-6">
        <button
          onClick={() => isMountedRef.current && setActiveTab('zh')}
          className={`px-4 py-2 rounded-l-lg border ${
            activeTab === 'zh' 
              ? 'bg-orange-600 text-white border-orange-600' 
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          } transition-colors`}
        >
          中文
        </button>
        <button
          onClick={() => isMountedRef.current && setActiveTab('en')}
          className={`px-4 py-2 rounded-r-lg border-t border-r border-b ${
            activeTab === 'en'
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          } transition-colors`}
        >
          English
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'zh' ? '文章标题' : 'Article Title'}
          </label>
          <input
            type="text"
            value={formData.title?.[activeTab] || ''}
            onChange={(e) => handleMultiLangChange('title', activeTab, e.target.value)}
            placeholder={activeTab === 'zh' ? '请输入文章标题' : 'Enter article title'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'zh' ? '文章摘要' : 'Article Excerpt'}
          </label>
          <textarea
            rows={3}
            value={formData.excerpt?.[activeTab] || ''}
            onChange={(e) => handleMultiLangChange('excerpt', activeTab, e.target.value)}
            placeholder={activeTab === 'zh' ? '请输入文章摘要' : 'Enter article excerpt'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'zh' ? '文章内容' : 'Article Content'}
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.content?.[activeTab] || ''}
              onChange={(value) => handleMultiLangChange('content', activeTab, value)}
              placeholder={activeTab === 'zh' ? '请输入文章内容，支持富文本格式' : 'Enter article content with rich text formatting'}
              modules={quillModules}
              formats={quillFormats}
              style={{
                minHeight: '300px',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Category */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getContent({ zh: '文章分类', en: 'Category' })}
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">{getContent({ zh: '选择分类', en: 'Select Category' })}</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.slug} value={category.slug}>
                    {getContent(category.title)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getContent({ zh: '文章标签', en: 'Tags' })}
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => isMountedRef.current && setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder={getContent({ zh: '输入标签并按回车', en: 'Enter tag and press Enter' })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-orange-600 text-white rounded-r-lg hover:bg-orange-700 transition-colors"
                >
                  {getContent({ zh: '添加', en: 'Add' })}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getContent({ zh: '发布状态', en: 'Status' })}
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="draft">{getContent({ zh: '草稿', en: 'Draft' })}</option>
                <option value="published">{getContent({ zh: '已发布', en: 'Published' })}</option>
              </select>
            </div>

            {/* Featured */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {getContent({ zh: '设为精选文章', en: 'Featured Article' })}
                </span>
              </label>
            </div>

            {/* Author */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getContent({ zh: '作者', en: 'Author' })}
              </label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder={getContent({ zh: '请输入作者', en: 'Enter author name' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Reading Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getContent({ zh: '预计阅读时长', en: 'Reading Time' })}
              </label>
              <input
                type="text"
                value={formData.readTime?.[activeTab] || ''}
                onChange={(e) => handleMultiLangChange('readTime', activeTab, e.target.value)}
                placeholder={activeTab === 'zh' ? '例如：5分钟' : 'e.g., 5 min read'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getContent({ zh: '封面图片URL', en: 'Cover Image URL' })}
              </label>
              <input
                type="url"
                value={formData.coverImage || ''}
                onChange={(e) => handleInputChange('coverImage', e.target.value)}
                placeholder={getContent({ zh: '请输入图片URL', en: 'Enter image URL' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};