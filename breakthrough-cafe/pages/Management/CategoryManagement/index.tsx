/**
 * 分类管理页面
 * 管理文章分类的创建、编辑、删除等操作
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Folder,
  Tag,
  Palette,
  Hash,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useCategories } from '../../../hooks/useArticles';
import { useArticleManagement } from '../../../hooks/useArticleManagement';
import type { ArticleCategory } from '../../../shared/types/article';

export const CategoryManagement: React.FC = () => {
  const { getContent } = useLanguage();
  const { categories, mutate } = useCategories();
  const { createCategory, isLoading, error, setError } = useArticleManagement();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ArticleCategory, '_id' | 'createdAt' | 'updatedAt'>>({
    slug: '',
    title: { zh: '', en: '' },
    description: { zh: '', en: '' },
    icon: '📁',
    color: '#f97316',
    order: 0
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleMultiLangChange = (field: string, lang: 'zh' | 'en', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev] as any,
        [lang]: value
      }
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // TODO: 实现编辑功能
        console.log('编辑分类功能待实现');
      } else {
        await createCategory(formData);
        mutate(); // 刷新分类列表
        resetForm();
      }
    } catch (error) {
      // 错误已在hook中处理
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: { zh: '', en: '' },
      description: { zh: '', en: '' },
      icon: '📁',
      color: '#f97316',
      order: 0
    });
    setShowCreateForm(false);
    setEditingCategory(null);
  };

  // 预定义的图标选项
  const iconOptions = ['📁', '💼', '🎯', '💡', '🚀', '📚', '🛠️', '🎨', '📊', '🌟'];
  
  // 预定义的颜色选项
  const colorOptions = [
    '#f97316', '#3b82f6', '#10b981', '#8b5cf6', 
    '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getContent({ zh: '分类管理', en: 'Category Management' })}
          </h1>
          <p className="text-gray-600 mt-1">
            {getContent({ 
              zh: `共 ${categories.length} 个分类`, 
              en: `${categories.length} categories in total` 
            })}
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>{getContent({ zh: '创建分类', en: 'Create Category' })}</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingCategory) && (
        <motion.div
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingCategory 
                ? getContent({ zh: '编辑分类', en: 'Edit Category' })
                : getContent({ zh: '创建新分类', en: 'Create New Category' })
              }
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  {getContent({ zh: '分类标识符', en: 'Category Slug' })}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="category-slug"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {getContent({ zh: '用于URL的标识符，只能包含小写字母、数字和连字符', en: 'URL identifier, only lowercase letters, numbers and hyphens allowed' })}
                </p>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getContent({ zh: '排序权重', en: 'Sort Order' })}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Multi-language Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getContent({ zh: '中文标题', en: 'Chinese Title' })}
                </label>
                <input
                  type="text"
                  value={formData.title.zh}
                  onChange={(e) => handleMultiLangChange('title', 'zh', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="输入中文标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getContent({ zh: '英文标题', en: 'English Title' })}
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => handleMultiLangChange('title', 'en', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Enter English title"
                />
              </div>
            </div>

            {/* Multi-language Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getContent({ zh: '中文描述', en: 'Chinese Description' })}
                </label>
                <textarea
                  value={formData.description.zh}
                  onChange={(e) => handleMultiLangChange('description', 'zh', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  placeholder="输入中文描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getContent({ zh: '英文描述', en: 'English Description' })}
                </label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => handleMultiLangChange('description', 'en', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter English description"
                />
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                {getContent({ zh: '分类图标', en: 'Category Icon' })}
              </label>
              <div className="flex flex-wrap gap-3">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange('icon', icon)}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                      formData.icon === icon
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                {getContent({ zh: '主题颜色', en: 'Theme Color' })}
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('color', color)}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                      formData.color === color
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {formData.color === color && (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getContent({ zh: '取消', en: 'Cancel' })}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading 
                  ? getContent({ zh: '保存中...', en: 'Saving...' })
                  : getContent({ zh: '保存', en: 'Save' })
                }
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(categories) && categories.map((category) => (
          <motion.div
            key={category._id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getContent(category.title)}
                  </h3>
                  <p className="text-sm text-gray-500">#{category.slug}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingCategory(category._id);
                    setFormData(category);
                  }}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Description */}
            <p className="text-gray-600 text-sm mb-4">
              {getContent(category.description)}
            </p>

            {/* Category Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {getContent({ zh: '排序', en: 'Order' })}: {category.order}
              </span>
              <span>
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && !showCreateForm && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-16 text-center">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {getContent({ zh: '暂无分类', en: 'No Categories Yet' })}
          </h3>
          <p className="text-gray-500 mb-6">
            {getContent({ 
              zh: '创建您的第一个文章分类来组织内容', 
              en: 'Create your first article category to organize content' 
            })}
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            {getContent({ zh: '创建分类', en: 'Create Category' })}
          </button>
        </div>
      )}
    </div>
  );
};
