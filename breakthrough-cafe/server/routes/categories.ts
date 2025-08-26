/**
 * 文章分类相关路由
 * 处理文章分类的CRUD操作
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { ArticleCategory } from '../../shared/types/article';

const app = new Hono();

// 获取所有分类
app.get('/', async (c) => {
  try {
    console.log('📂 获取文章分类列表');
    
    const categoriesCollection = db.collection('3d056577_article_categories');
    
    const categories = await categoriesCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    console.log(`✅ 成功获取 ${categories.length} 个分类`);
    
    // 🔧 修复：返回包含categories属性的对象，匹配前端useCategories的期望格式
    return c.json({ categories });
  } catch (error) {
    console.error('❌ 获取分类列表失败:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 创建分类验证schema
const createCategorySchema = z.object({
  slug: z.string().min(1, '分类标识符不能为空'),
  title: z.object({
    zh: z.string().min(1, '中文标题不能为空'),
    en: z.string().min(1, '英文标题不能为空')
  }),
  description: z.object({
    zh: z.string(),
    en: z.string()
  }),
  icon: z.string(),
  color: z.string(),
  order: z.number().default(0)
});

// 创建分类
app.post('/', zValidator('json', createCategorySchema), async (c) => {
  try {
    const categoryData = c.req.valid('json');
    console.log('📂 创建新分类:', categoryData.slug);

    const categoriesCollection = db.collection('3d056577_article_categories');
    
    // 检查slug是否已存在
    const existingCategory = await categoriesCollection.findOne({ 
      slug: categoryData.slug 
    });

    if (existingCategory) {
      return c.json({ error: '分类标识符已存在' }, 400);
    }

    const newCategory = {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await categoriesCollection.insertOne(newCategory);
    
    const createdCategory = await categoriesCollection.findOne({ 
      _id: result.insertedId 
    });

    console.log(`✅ 分类创建成功: ${createdCategory._id}`);
    
    return c.json(createdCategory, 201);
  } catch (error) {
    console.error('❌ 创建分类失败:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
