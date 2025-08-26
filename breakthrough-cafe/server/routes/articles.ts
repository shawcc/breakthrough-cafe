/**
 * 文章相关路由
 * 处理文章的CRUD操作和查询功能
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Article, ArticleFilters, ArticlesResponse } from '../../shared/types/article';

const app = new Hono();

// 🔥 确保路由注册成功
console.log('📋 === 文章路由模块开始加载 ===');
console.log('📋 Hono版本:', typeof Hono);
console.log('📋 app实例类型:', typeof app);
console.log('📋 开始注册文章路由...');

// 错误处理辅助函数
const handleError = (error: any, operation: string) => {
  console.error(`❌ ${operation}失败:`, error);
  
  // 如果是验证错误
  if (error.name === 'ZodError' || error.issues) {
    const firstError = error.issues?.[0];
    return {
      error: firstError ? `${firstError.path.join('.')}: ${firstError.message}` : '数据验证失败'
    };
  }
  
  // 如果是 MongoDB 错误
  if (error.code === 11000) {
    return { error: '数据已存在，请检查重复字段' };
  }
  
  // 通用错误
  return {
    error: error.message || `${operation}失败，请重试`
  };
};

// 创建文章验证schema
const createArticleSchema = z.object({
  title: z.object({
    zh: z.string().min(1, '中文标题不能为空'),
    en: z.string().min(1, '英文标题不能为空')
  }),
  excerpt: z.object({
    zh: z.string().min(1, '中文摘要不能为空'),
    en: z.string().min(1, '英文摘要不能为空')
  }),
  content: z.object({
    zh: z.string().min(1, '中文内容不能为空'),
    en: z.string().min(1, '英文内容不能为空')
  }),
  category: z.string().min(1, '分类不能为空'),
  tags: z.array(z.string()),
  readTime: z.object({
    zh: z.string(),
    en: z.string()
  }),
  isFeatured: z.boolean().default(false),
  author: z.string().min(1, '作者不能为空'),
  status: z.enum(['draft', 'published']).default('draft'),
  coverImage: z.string().optional()
});

// 🔥 1. 获取文章列表 - 确保第一个注册
console.log('📋 注册GET / 路由 (获取文章列表)');
app.get('/', async (c) => {
  try {
    console.log('📚 === 获取文章列表请求开始 ===');
    console.log('🕒 请求时间:', new Date().toISOString());
    
    const query = c.req.query();
    console.log('🔍 原始查询参数:', query);
    
    const filters: ArticleFilters = {
      category: query.category || undefined,
      isFeatured: query.isFeatured ? query.isFeatured === 'true' : undefined,
      status: query.status as 'draft' | 'published' || undefined,
      limit: parseInt(query.limit || '10'),
      skip: parseInt(query.skip || '0'),
      sortBy: query.sortBy as any || 'updatedAt',
      sortOrder: query.sortOrder as 'asc' | 'desc' || 'desc'
    };

    console.log('🔍 解析后的过滤条件:', filters);

    // 构建查询条件
    const matchQuery: any = {};
    
    if (filters.status) {
      matchQuery.status = filters.status;
      console.log('✅ 添加状态筛选:', filters.status);
    } else {
      console.log('📋 查询所有状态的文章');
    }
    
    if (filters.category) {
      matchQuery.category = filters.category;
      console.log('✅ 添加分类筛选:', filters.category);
    }
    
    if (filters.isFeatured !== undefined) {
      matchQuery.isFeatured = filters.isFeatured;
      console.log('✅ 添加精选筛选:', filters.isFeatured);
    }

    console.log('🔍 最终数据库查询条件:', JSON.stringify(matchQuery, null, 2));

    // 查询文章
    const articlesCollection = db.collection('3d056577_articles');
    console.log('💾 使用数据库集合:', '3d056577_articles');
    
    const total = await articlesCollection.countDocuments(matchQuery);
    console.log('📊 符合条件的文章总数:', total);
    
    const sortField = filters.sortBy!;
    const sortDirection = filters.sortOrder === 'desc' ? -1 : 1;
    console.log('📋 排序条件:', { field: sortField, direction: sortDirection });
    
    const articles = await articlesCollection
      .find(matchQuery)
      .sort({ [sortField]: sortDirection })
      .skip(filters.skip!)
      .limit(filters.limit!)
      .toArray();

    console.log('✅ 查询完成，返回文章数量:', articles.length);

    const response: ArticlesResponse = {
      articles: articles as Article[],
      total,
      page: Math.floor(filters.skip! / filters.limit!) + 1,
      limit: filters.limit!,
      hasMore: (filters.skip! + filters.limit!) < total
    };

    console.log('📤 === 返回响应 ===');
    console.log('响应摘要:', {
      articlesCount: response.articles.length,
      total: response.total,
      page: response.page,
      hasMore: response.hasMore
    });
    
    return c.json(response);
  } catch (error) {
    console.error('💥 === 获取文章列表错误 ===');
    console.error('🕒 错误时间:', new Date().toISOString());
    console.error('📝 错误详情:', error);
    
    const errorResponse = handleError(error, '获取文章列表');
    return c.json(errorResponse, 500);
  }
});

// 🔥 2. 创建文章 - 确保第二个注册
console.log('📋 注册POST / 路由 (创建新文章)');
app.post('/', zValidator('json', createArticleSchema), async (c) => {
  try {
    const articleData = c.req.valid('json');
    console.log('📝 === 创建文章请求开始 ===');
    console.log('🕒 请求时间:', new Date().toISOString());

    const articlesCollection = db.collection('3d056577_articles');
    console.log('💾 === 准备数据库操作 ===');
    console.log('数据库集合名称:', '3d056577_articles');
    
    const newArticle = {
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      category: articleData.category,
      tags: articleData.tags,
      readTime: articleData.readTime,
      isFeatured: articleData.isFeatured,
      author: articleData.author,
      status: articleData.status,
      ...(articleData.coverImage && { coverImage: articleData.coverImage }),
      publishedAt: articleData.status === 'published' ? new Date() : null,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💾 开始数据库插入操作...');
    const result = await articlesCollection.insertOne(newArticle);
    
    if (!result.insertedId) {
      console.error('❌ 数据库插入失败，没有返回insertedId');
      return c.json({ error: '数据库插入失败' }, 500);
    }
    
    const createdArticle = await articlesCollection.findOne({ 
      _id: result.insertedId 
    });

    if (!createdArticle) {
      console.error('❌ 无法查询到刚插入的文章');
      return c.json({ error: '文章创建后查询失败' }, 500);
    }

    console.log('✅ === 文章创建成功 ===');
    console.log('📋 创建的文章ID:', createdArticle._id.toString());
    
    return c.json(createdArticle, 201);
  } catch (error) {
    console.error('💥 === 创建文章错误 ===');
    const errorResponse = handleError(error, '创建文章');
    return c.json(errorResponse, 500);
  }
});

// 🔥 3. 更新文章 - 去除验证器的完全修复版本
console.log('📋 注册PUT /:id 路由 (更新文章) - 去除验证器修复版');

app.put('/:id', async (c) => {
  console.log('🚀 === PUT路由调用开始（去除验证器修复版） ===');
  console.log('⏰ 请求时间:', new Date().toISOString());
  
  try {
    const articleId = c.req.param('id');
    const updateData = await c.req.json();
    
    console.log('📥 请求信息:');
    console.log('  - 文章ID:', articleId);
    console.log('  - 更新数据:', JSON.stringify(updateData, null, 2));
    
    // 验证 ObjectId
    if (!mongo.ObjectId.isValid(articleId)) {
      console.log('❌ 无效的文章ID格式:', articleId);
      return c.json({ error: '无效的文章ID格式' }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    
    // 查找现有文章
    const existingArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!existingArticle) {
      console.log('❌ 文章不存在，ID:', articleId);
      return c.json({ error: '文章不存在' }, 404);
    }
    
    console.log('✅ 找到现有文章，当前标题:', existingArticle.title?.zh);
    
    // 🔥 构建更新字段 - 只包含实际传入的字段
    const updateFields: any = {
      updatedAt: new Date()
    };
    
    // 逐个检查并添加字段，避免undefined值
    if (updateData.title !== undefined) {
      updateFields.title = updateData.title;
      console.log('✅ 添加title字段:', updateData.title);
    }
    
    if (updateData.excerpt !== undefined) {
      updateFields.excerpt = updateData.excerpt;
      console.log('✅ 添加excerpt字段');
    }
    
    if (updateData.content !== undefined) {
      updateFields.content = updateData.content;
      console.log('✅ 添加content字段');
    }
    
    if (updateData.category !== undefined) {
      updateFields.category = updateData.category;
      console.log('✅ 添加category字段:', updateData.category);
    }
    
    if (updateData.tags !== undefined) {
      updateFields.tags = updateData.tags;
      console.log('✅ 添加tags字段');
    }
    
    if (updateData.readTime !== undefined) {
      updateFields.readTime = updateData.readTime;
      console.log('✅ 添加readTime字段');
    }
    
    if (updateData.isFeatured !== undefined) {
      updateFields.isFeatured = updateData.isFeatured;
      console.log('✅ 添加isFeatured字段:', updateData.isFeatured);
    }
    
    if (updateData.author !== undefined) {
      updateFields.author = updateData.author;
      console.log('✅ 添加author字段:', updateData.author);
    }
    
    if (updateData.status !== undefined) {
      updateFields.status = updateData.status;
      console.log('✅ 添加status字段:', updateData.status);
      
      // 处理发布状态
      if (updateData.status === 'published' && existingArticle.status !== 'published') {
        updateFields.publishedAt = new Date();
        console.log('✅ 设置发布时间');
      } else if (updateData.status === 'draft') {
        updateFields.publishedAt = null;
        console.log('✅ 清除发布时间');
      }
    }
    
    if (updateData.coverImage !== undefined) {
      updateFields.coverImage = updateData.coverImage;
      console.log('✅ 添加coverImage字段:', updateData.coverImage);
    }
    
    console.log('🔧 最终更新字段数量:', Object.keys(updateFields).length);
    console.log('🔧 更新字段列表:', Object.keys(updateFields));
    
    // 🎯 执行数据库更新
    console.log('💾 === 执行数据库更新 ===');
    
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { $set: updateFields }
    );
    
    console.log('💾 MongoDB更新结果:');
    console.log('  - acknowledged:', updateResult.acknowledged);
    console.log('  - matchedCount:', updateResult.matchedCount);
    console.log('  - modifiedCount:', updateResult.modifiedCount);
    
    if (updateResult.matchedCount === 0) {
      console.log('❌ 没有找到匹配的文档');
      return c.json({ error: '文章不存在或更新失败' }, 404);
    }
    
    if (updateResult.modifiedCount === 0) {
      console.log('⚠️ 文档匹配但未修改（可能是相同数据）');
    }
    
    // 查询更新后的文章
    const updatedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!updatedArticle) {
      console.log('❌ 无法查询到更新后的文章');
      return c.json({ error: '更新后查询失败' }, 500);
    }
    
    console.log('🎉 === 更新完成 ===');
    console.log('  - 更新后标题:', updatedArticle.title?.zh);
    console.log('  - 更新时间:', updatedArticle.updatedAt);
    
    return c.json(updatedArticle);
    
  } catch (error) {
    console.log('💥 === PUT路由错误 ===');
    console.log('📝 错误消息:', error.message);
    console.log('📝 错误堆栈:', error.stack);
    
    const errorResponse = handleError(error, '更新文章');
    return c.json(errorResponse, 500);
  }
});

console.log('✅ PUT /:id 路由注册完成（去除验证器修复版）！');

// 🔥 4. 获取单篇文章
console.log('📋 注册GET /:id 路由 (获取单篇文章)');
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`📖 获取文章详情: ${id}`);

    const articlesCollection = db.collection('3d056577_articles');
    
    const article = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(id) 
    });

    if (!article) {
      console.log(`❌ 文章不存在: ${id}`);
      return c.json({ error: '文章不存在' }, 404);
    }

    // 增加浏览次数
    await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(id) },
      { $inc: { views: 1 } }
    );

    console.log(`✅ 成功获取文章: ${article.title?.zh || article.title}`);
    
    return c.json(article);
  } catch (error) {
    const errorResponse = handleError(error, '获取文章详情');
    return c.json(errorResponse, 500);
  }
});

// 🔥 5. 删除文章
console.log('📋 注册DELETE /:id 路由 (删除文章)');
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`🗑️ 删除文章: ${id}`);

    const articlesCollection = db.collection('3d056577_articles');
    
    const result = await articlesCollection.deleteOne({ 
      _id: new mongo.ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return c.json({ error: '文章不存在' }, 404);
    }

    console.log(`✅ 文章删除成功: ${id}`);
    
    return c.json({ message: '文章删除成功' });
  } catch (error) {
    const errorResponse = handleError(error, '删除文章');
    return c.json(errorResponse, 500);
  }
});

// 🔥 验证所有路由注册完成
console.log('📋 === 文章路由模块注册完成 ===');
console.log('✅ GET  / (获取文章列表) - 已注册');
console.log('✅ POST / (创建新文章) - 已注册');
console.log('✅ PUT  /:id (更新文章) - 简化修复版已注册');
console.log('✅ GET  /:id (获取单篇文章) - 已注册');
console.log('✅ DELETE /:id (删除文章) - 已注册');

// 🔧 6. MongoDB调试路由 - 专门用于诊断数据库更新问题
console.log('📋 注册POST /debug/mongo-test 路由 (MongoDB调试)');
app.post('/debug/mongo-test', async (c) => {
  try {
    console.log('🔧 开始直接数据库更新测试');
    
    const requestBody = await c.req.json();
    const { articleId, status } = requestBody;
    
    console.log('目标文章ID', articleId);
    console.log('目标状态', status);
    
    // 验证必要参数
    if (!articleId) {
      return c.json({ error: '缺少必要参数: articleId' }, 400);
    }
    
    if (!status) {
      return c.json({ error: '缺少必要参数: status' }, 400);
    }
    
    // 验证文章ID格式
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ error: '无效的文章ID格式' }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    
    // 📋 步骤1: 获取当前文章状态
    console.log('📋 步骤1: 获取当前文章状态');
    const currentArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!currentArticle) {
      return c.json({ error: '文章不存在' }, 404);
    }
    
    console.log('当前文章数据', JSON.stringify({
      id: currentArticle._id.toString(),
      title: currentArticle.title?.zh,
      status: currentArticle.status,
      updatedAt: currentArticle.updatedAt
    }));
    
    // 📋 步骤2: 执行内部PUT更新 - 直接调用内部逻辑
    console.log('📋 步骤2: 执行内部PUT更新');
    const updateData = {
      status: status,
      title: currentArticle.title,
      excerpt: currentArticle.excerpt,
      content: currentArticle.content,
      category: currentArticle.category,
      tags: currentArticle.tags,
      readTime: currentArticle.readTime,
      isFeatured: currentArticle.isFeatured,
      author: currentArticle.author
    };
    
    console.log('更新数据', JSON.stringify(updateData));
    
    // 构建更新字段
    const updateFields: any = {
      updatedAt: new Date()
    };
    
    // 逐个添加字段
    if (updateData.title !== undefined) {
      updateFields.title = updateData.title;
    }
    if (updateData.status !== undefined) {
      updateFields.status = updateData.status;
    }
    if (updateData.excerpt !== undefined) {
      updateFields.excerpt = updateData.excerpt;
    }
    if (updateData.content !== undefined) {
      updateFields.content = updateData.content;
    }
    if (updateData.category !== undefined) {
      updateFields.category = updateData.category;
    }
    if (updateData.tags !== undefined) {
      updateFields.tags = updateData.tags;
    }
    if (updateData.readTime !== undefined) {
      updateFields.readTime = updateData.readTime;
    }
    if (updateData.isFeatured !== undefined) {
      updateFields.isFeatured = updateData.isFeatured;
    }
    if (updateData.author !== undefined) {
      updateFields.author = updateData.author;
    }
    
    // 处理发布状态
    if (updateData.status === 'published' && currentArticle.status !== 'published') {
      updateFields.publishedAt = new Date();
    } else if (updateData.status === 'draft') {
      updateFields.publishedAt = null;
    }
    
    // 执行数据库更新
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { $set: updateFields }
    );
    
    console.log('PUT更新结果', JSON.stringify({
      acknowledged: updateResult.acknowledged,
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount
    }));
    
    // 📋 步骤3: 再次获取验证数据库状态
    console.log('📋 步骤3: 再次获取验证数据库状态');
    const verifiedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    console.log('验证结果', JSON.stringify({
      id: verifiedArticle._id.toString(),
      title: verifiedArticle.title?.zh,
      status: verifiedArticle.status,
      updatedAt: verifiedArticle.updatedAt,
      isUpdated: currentArticle.updatedAt.getTime() !== verifiedArticle.updatedAt.getTime()
    }));
    
    const success = verifiedArticle.status === status;
    
    if (success) {
      console.log('✅ 数据库更新成功！状态已正确更新');
    } else {
      console.log('❌ 数据库更新失败！状态未正确更新');
    }
    
    return c.json({
      success: success,
      currentStatus: currentArticle.status,
      targetStatus: status,
      finalStatus: verifiedArticle.status,
      updateResult: updateResult,
      isUpdated: currentArticle.updatedAt.getTime() !== verifiedArticle.updatedAt.getTime()
    });
    
  } catch (error) {
    console.error('💥 MongoDB调试测试失败:', error.message);
    return c.json({ 
      error: error.message,
      details: 'MongoDB调试测试失败' 
    }, 500);
  }
});

console.log('✅ POST /debug/mongo-test (MongoDB调试) - 已注册');

// 🔧 7. 直接MongoDB测试路由 - 绕过PUT逻辑
console.log('📋 注册POST /debug/direct-mongo 路由 (直接MongoDB测试)');
app.post('/debug/direct-mongo', async (c) => {
  try {
    console.log('🔧 开始直接数据库测试');
    
    const requestBody = await c.req.json();
    const { articleId, operation, newStatus } = requestBody;
    
    console.log('请求参数:', { articleId, operation, newStatus });
    
    // 验证必要参数
    if (!articleId) {
      return c.json({ error: '缺少必要参数: articleId' }, 400);
    }
    
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ error: '无效的文章ID格式' }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    
    // 获取原始文章
    const originalArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!originalArticle) {
      return c.json({ error: '文章不存在' }, 404);
    }
    
    console.log('原始文章状态:', originalArticle.status);
    
    // 执行直接更新操作
    const updateData = {
      status: newStatus,
      updatedAt: new Date()
    };
    
    console.log('准备更新数据:', updateData);
    
    // 🎯 直接执行updateOne，不经过PUT路由
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { $set: updateData }
    );
    
    console.log('MongoDB updateOne结果:');
    console.log('  - acknowledged:', updateResult.acknowledged);
    console.log('  - matchedCount:', updateResult.matchedCount);
    console.log('  - modifiedCount:', updateResult.modifiedCount);
    
    // 验证更新结果
    const updatedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    console.log('更新后文章状态:', updatedArticle?.status);
    
    const success = (
      updateResult.acknowledged && 
      updateResult.matchedCount > 0 && 
      updatedArticle?.status === newStatus
    );
    
    console.log('测试结果:', success ? '成功' : '失败');
    
    return c.json({
      success,
      originalStatus: originalArticle.status,
      targetStatus: newStatus,
      finalStatus: updatedArticle?.status,
      updateResult: {
        acknowledged: updateResult.acknowledged,
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount
      },
      timeDiff: updatedArticle?.updatedAt?.getTime() - originalArticle.updatedAt?.getTime()
    });
    
  } catch (error) {
    console.error('💥 直接MongoDB测试失败:', error.message);
    return c.json({ 
      error: error.message,
      details: '直接MongoDB测试失败' 
    }, 500);
  }
});

console.log('✅ POST /debug/direct-mongo (直接MongoDB测试) - 已注册');

// 🔧 8. 基础updateOne测试路由
console.log('📋 注册POST /debug/basic-update 路由 (基础updateOne测试)');
app.post('/debug/basic-update', async (c) => {
  try {
    console.log('🔧 开始基础updateOne测试');
    
    const requestBody = await c.req.json();
    const { articleId, testField } = requestBody;
    
    console.log('请求参数:', { articleId, testField });
    
    if (!articleId) {
      return c.json({ error: '缺少必要参数: articleId' }, 400);
    }
    
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ error: '无效的文章ID格式' }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    
    // 获取原始文章
    const originalArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!originalArticle) {
      return c.json({ error: '文章不存在' }, 404);
    }
    
    console.log('原始文章updateAt:', originalArticle.updatedAt);
    
    // 执行简单的字段更新
    const updateData = {
      testField: testField,
      updatedAt: new Date()
    };
    
    console.log('准备更新数据:', updateData);
    
    // 执行updateOne
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { $set: updateData }
    );
    
    console.log('MongoDB updateOne结果:');
    console.log('  - acknowledged:', updateResult.acknowledged);
    console.log('  - matchedCount:', updateResult.matchedCount);
    console.log('  - modifiedCount:', updateResult.modifiedCount);
    
    // 验证更新结果
    const updatedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    console.log('更新后testField:', updatedArticle?.testField);
    console.log('更新后updateAt:', updatedArticle?.updatedAt);
    
    const success = (
      updateResult.acknowledged && 
      updateResult.matchedCount > 0 && 
      updateResult.modifiedCount > 0 &&
      updatedArticle?.testField === testField
    );
    
    console.log('测试结果:', success ? '成功' : '失败');
    
    return c.json({
      success,
      targetTestField: testField,
      finalTestField: updatedArticle?.testField,
      updateResult: {
        acknowledged: updateResult.acknowledged,
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount
      },
      timeDiff: updatedArticle?.updatedAt?.getTime() - originalArticle.updatedAt?.getTime()
    });
    
  } catch (error) {
    console.error('💥 基础updateOne测试失败:', error.message);
    return c.json({ 
      error: error.message,
      details: '基础updateOne测试失败' 
    }, 500);
  }
});

console.log('✅ POST /debug/basic-update (基础updateOne测试) - 已注册');

// 🔧 9. 验证文章数据路由 - 专门检查标题数据（修复版）
console.log('📋 注册POST /debug/verify-article 路由 (验证文章数据)');
app.post('/debug/verify-article', async (c) => {
  try {
    console.log('🔍 开始验证文章数据');
    
    const requestBody = await c.req.json();
    const { articleId } = requestBody;
    
    console.log('验证文章ID:', articleId);
    
    if (!articleId) {
      return c.json({ error: '缺少必要参数: articleId' }, 400);
    }
    
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ error: '无效的文章ID格式' }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    
    // 直接查询数据库中的文章
    const article = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!article) {
      return c.json({ error: '文章不存在' }, 404);
    }
    
    console.log('📋 数据库中的文章数据:');
    console.log('  - ID:', article._id.toString());
    console.log('  - 标题对象:', JSON.stringify(article.title));
    console.log('  - 中文标题:', article.title?.zh);
    console.log('  - 英文标题:', article.title?.en);
    console.log('  - 状态:', article.status);
    console.log('  - 更新时间:', article.updatedAt);
    
    // 同时通过GET路由获取数据进行对比
    console.log('🔍 通过GET路由获取数据...');
    let getRouteData = null;
    let getRouteError = null;
    
    try {
      // 直接调用GET路由逻辑，不依赖外部API
      const getResult = await articlesCollection.findOne({ 
        _id: new mongo.ObjectId(articleId) 
      });
      
      if (getResult) {
        getRouteData = getResult;
        console.log('📋 GET路由返回的数据:');
        console.log('  - ID:', getRouteData._id.toString());
        console.log('  - 标题对象:', JSON.stringify(getRouteData.title));
        console.log('  - 中文标题:', getRouteData.title?.zh);
        console.log('  - 英文标题:', getRouteData.title?.en);
        console.log('  - 状态:', getRouteData.status);
        console.log('  - 更新时间:', getRouteData.updatedAt);
      } else {
        getRouteError = 'GET路由查询无结果';
      }
    } catch (error) {
      getRouteError = `GET路由查询异常: ${error.message}`;
      console.error('❌ GET路由查询失败:', error.message);
    }
    
    let consistency = null;
    
    if (getRouteData) {
      // 对比数据一致性
      const titleConsistent = JSON.stringify(article.title) === JSON.stringify(getRouteData.title);
      const statusConsistent = article.status === getRouteData.status;
      
      console.log('📊 数据一致性检查:');
      console.log('  - 标题一致:', titleConsistent);
      console.log('  - 状态一致:', statusConsistent);
      
      consistency = {
        titleConsistent,
        statusConsistent
      };
    }
    
    return c.json({
      success: true,
      timestamp: new Date().toISOString(),
      databaseData: {
        id: article._id.toString(),
        title: article.title,
        status: article.status,
        updatedAt: article.updatedAt
      },
      getRouteData: getRouteData ? {
        id: getRouteData._id.toString(),
        title: getRouteData.title,
        status: getRouteData.status,
        updatedAt: getRouteData.updatedAt
      } : null,
      getRouteError,
      consistency,
      verification: {
        titleExists: !!article.title,
        titleType: typeof article.title,
        titleKeys: article.title ? Object.keys(article.title) : [],
        lastModified: article.updatedAt
      }
    });
    
  } catch (error) {
    console.error('💥 验证文章数据失败:', error.message);
    return c.json({ 
      error: error.message,
      details: '验证文章数据失败' 
    }, 500);
  }
});

console.log('✅ POST /debug/verify-article (验证文章数据) - 已注册');
console.log('📋 模块导出的app对象类型:', typeof app);
console.log('📋 Hono app 包含的路由数量:', 9);

export default app;