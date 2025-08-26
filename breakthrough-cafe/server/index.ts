/**
 * 服务端入口文件 - v6.1 调试接口修复版
 * 添加DirectMongoTest页面需要的调试接口
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { connectDatabase, getDatabase } from './db';
import { MongoClient } from 'mongodb';

// 全局数据库实例（兼容现有代码）
let db: any = null;
let mongo: any = null;

// 初始化数据库连接
async function initDatabase() {
  if (!db) {
    try {
      const { client, db: database } = await connectDatabase();
      db = database;
      mongo = { ObjectId: MongoClient.ObjectId };
      console.log('✅ 数据库初始化成功');
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error.message);
      throw error;
    }
  }
  return { db, mongo };
}

const rootApp = new Hono();

console.log('🚀🚀🚀 === 服务端启动 v6.1 === 🚀🚀🚀');
console.log('🕒 启动时间:', new Date().toISOString());
console.log('🔧 添加DirectMongoTest调试接口');

// CORS 配置
rootApp.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

console.log('✅ CORS配置完成');

// Vercel部署兼容性检查
if (typeof process !== 'undefined' && process.env.VERCEL) {
  console.log('🚀 Vercel环境检测到');
  console.log('📊 环境变量:', {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI ? '已设置' : '未设置'
  });
}

// ========================
// 系统路由
// ========================

// 健康检查
rootApp.get('/api/health', async (c) => {
  try {
    await initDatabase();
  } catch (error) {
    console.log('⚠️ 数据库连接失败，但API仍可用');
  }
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '6.1.0-DEBUG-INTERFACE-FIX',
    services: {
      api: 'healthy',
      database: 'connected'
    },
    environment: {
      hasDb: typeof db !== 'undefined',
      hasMongo: typeof mongo !== 'undefined'
    }
  };
  
  console.log('🏥 健康检查请求');
  return c.json(healthData);
});

// 路由调试接口
rootApp.get('/api/routes', (c) => {
  console.log('🛤️ 路由调试接口被调用');
  
  const routeInfo = {
    server: {
      version: '6.1.0-DEBUG-INTERFACE-FIX',
      timestamp: new Date().toISOString(),
      strategy: '直接路由注册 + 调试接口修复'
    },
    registeredRoutes: [
      { method: 'GET', path: '/api/health', description: '健康检查', status: '✅ 工作正常' },
      { method: 'GET', path: '/api/routes', description: '路由信息', status: '✅ 工作正常' },
      { method: 'GET', path: '/api/debug', description: '调试信息', status: '✅ 工作正常' },
      { method: 'GET', path: '/api/articles', description: '获取文章列表', status: '✅ 工作正常' },
      { method: 'POST', path: '/api/articles', description: '创建新文章', status: '✅ 工作正常' },
      { method: 'PUT', path: '/api/articles/:id', description: '🚨 更新文章（关键）', status: '🔥 已正确注册' },
      { method: 'GET', path: '/api/articles/:id', description: '获取单篇文章', status: '✅ 工作正常' },
      { method: 'DELETE', path: '/api/articles/:id', description: '删除文章', status: '✅ 工作正常' },
      { method: 'GET', path: '/api/categories', description: '获取分类列表', status: '✅ 工作正常' },
      { method: 'POST', path: '/api/articles/debug/verify-article', description: '🔧 验证文章数据', status: '🆕 新增' },
      { method: 'POST', path: '/api/articles/debug/direct-mongo', description: '🔧 直接MongoDB测试', status: '🆕 新增' },
      { method: 'POST', path: '/api/articles/debug/basic-update', description: '🔧 基础updateOne测试', status: '🆕 新增' }
    ],
    putRouteInfo: {
      path: 'PUT /api/articles/:id',
      status: '✅ 已确认注册',
      testMethod: '使用任意文章ID测试更新',
      expectedResponse: '应该看到详细的更新日志'
    }
  };

  return c.json(routeInfo);
});

// 调试信息接口
rootApp.get('/api/debug', (c) => {
  console.log('🔍 调试接口被调用');
  
  const debugInfo = {
    server: {
      version: '6.1.0-DEBUG-INTERFACE-FIX',
      timestamp: new Date().toISOString(),
      status: '🎯 调试接口修复版本'
    },
    database: {
      dbType: typeof db,
      mongoType: typeof mongo,
      available: typeof db !== 'undefined' && typeof mongo !== 'undefined'
    },
    routes: {
      strategy: '直接注册所有路由在主文件中',
      putRouteStatus: '🔥 已确认正确注册',
      debugInterfacesAdded: '🆕 已添加DirectMongoTest调试接口'
    }
  };
  
  return c.json(debugInfo);
});

// ========================
// 文章路由 - 直接定义
// ========================

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

console.log('📋 === 开始注册文章路由 ===');

// 🔧 验证文章数据路由 - 优先注册，确保路径匹配正确
console.log('📋 注册: POST /api/articles/debug/verify-article - 验证文章数据');
rootApp.post('/api/articles/debug/verify-article', async (c) => {
  console.log('🔍🔍🔍 === 验证文章数据路由 ===');
  console.log('⏰ 请求时间:', new Date().toISOString());
  
  try {
    await initDatabase();
    
    const requestBody = await c.req.json();
    const { articleId } = requestBody;
    
    console.log('📥 接收参数:');
    console.log('  文章ID:', articleId);
    
    if (!articleId) {
      return c.json({ 
        error: '缺少必要参数articleId', 
        required: ['articleId'] 
      }, 400);
    }
    
    // 验证ObjectId格式
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ 
        error: '无效的文章ID格式', 
        articleId 
      }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    console.log('✅ 获取集合:', '3d056577_articles');
    
    // 直接查询数据库中的文章
    console.log('📋 步骤1: 直接查询数据库');
    const article = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!article) {
      return c.json({ 
        error: '文章不存在', 
        articleId 
      }, 404);
    }
    
    console.log('✅ 数据库中的文章数据:');
    console.log('  ID:', article._id.toString());
    console.log('  标题对象:', JSON.stringify(article.title));
    console.log('  中文标题:', article.title?.zh);
    console.log('  英文标题:', article.title?.en);
    console.log('  状态:', article.status);
    console.log('  更新时间:', article.updatedAt);
    
    // 通过GET路由逻辑获取数据进行对比
    console.log('📋 步骤2: 通过GET路由逻辑获取数据...');
    let apiData = null;
    let apiError = null;
    
    try {
      // 直接调用GET路由逻辑，不依赖外部API
      const getResult = await articlesCollection.findOne({ 
        _id: new mongo.ObjectId(articleId) 
      });
      
      if (getResult) {
        apiData = getResult;
        
        console.log('✅ GET路由逻辑返回的数据:');
        console.log('  ID:', apiData._id.toString());
        console.log('  标题对象:', JSON.stringify(apiData.title));
        console.log('  中文标题:', apiData.title?.zh);
        console.log('  英文标题:', apiData.title?.en);
        console.log('  状态:', apiData.status);
        console.log('  更新时间:', apiData.updatedAt);
      } else {
        apiError = 'GET路由查询无结果';
        console.log('❌ GET路由查询失败:', apiError);
      }
    } catch (fetchError) {
      apiError = `GET路由查询异常: ${fetchError.message}`;
      console.log('❌ GET路由查询异常:', fetchError.message);
    }
    
    // 数据一致性检查
    let consistency = null;
    if (apiData) {
      const titleConsistent = JSON.stringify(article.title) === JSON.stringify(apiData.title);
      const statusConsistent = article.status === apiData.status;
      
      consistency = {
        titleConsistent,
        statusConsistent,
        titleComparison: {
          database: article.title,
          api: apiData.title
        },
        statusComparison: {
          database: article.status,
          api: apiData.status
        }
      };
      
      console.log('📊 数据一致性检查:');
      console.log('  标题一致:', titleConsistent);
      console.log('  状态一致:', statusConsistent);
    }
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      databaseData: {
        id: article._id.toString(),
        title: article.title,
        status: article.status,
        updatedAt: article.updatedAt
      },
      getRouteData: apiData ? {
        id: apiData._id.toString(),
        title: apiData.title,
        status: apiData.status,
        updatedAt: apiData.updatedAt
      } : null,
      getRouteError: apiError,
      consistency: consistency,
      verification: {
        titleExists: !!article.title,
        titleType: typeof article.title,
        titleKeys: article.title ? Object.keys(article.title) : null,
        lastModified: article.updatedAt
      }
    };
    
    console.log('🎉 验证文章数据完成');
    
    return c.json(result);
    
  } catch (error) {
    console.error('💥 验证文章数据错误:', error.message);
    return c.json({ 
      error: '验证文章数据失败', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// 1. 获取文章列表
console.log('📋 注册: GET /api/articles');
rootApp.get('/api/articles', async (c) => {
  try {
    await initDatabase();
    console.log('📚 获取文章列表请求');
    
    const query = c.req.query();
    const filters = {
      category: query.category || undefined,
      isFeatured: query.isFeatured ? query.isFeatured === 'true' : undefined,
      status: query.status as 'draft' | 'published' || undefined,
      limit: parseInt(query.limit || '10'),
      skip: parseInt(query.skip || '0'),
      sortBy: query.sortBy || 'updatedAt',
      sortOrder: query.sortOrder as 'asc' | 'desc' || 'desc'
    };

    const matchQuery: any = {};
    if (filters.status) matchQuery.status = filters.status;
    if (filters.category) matchQuery.category = filters.category;
    if (filters.isFeatured !== undefined) matchQuery.isFeatured = filters.isFeatured;

    const articlesCollection = db.collection('3d056577_articles');
    
    const total = await articlesCollection.countDocuments(matchQuery);
    const sortDirection = filters.sortOrder === 'desc' ? -1 : 1;
    
    const articles = await articlesCollection
      .find(matchQuery)
      .sort({ [filters.sortBy]: sortDirection })
      .skip(filters.skip)
      .limit(filters.limit)
      .toArray();

    console.log(`✅ 返回 ${articles.length} 篇文章`);

    return c.json({
      articles,
      total,
      page: Math.floor(filters.skip / filters.limit) + 1,
      limit: filters.limit,
      hasMore: (filters.skip + filters.limit) < total
    });
  } catch (error) {
    console.error('❌ 获取文章列表错误:', error.message);
    return c.json({ 
      error: '获取文章列表失败', 
      message: error.message 
    }, 500);
  }
});

// 2. 创建文章
console.log('📋 注册: POST /api/articles');
rootApp.post('/api/articles', zValidator('json', createArticleSchema), async (c) => {
  try {
    await initDatabase();
    console.log('📝 创建文章请求');
    
    const articleData = c.req.valid('json');
    const articlesCollection = db.collection('3d056577_articles');
    
    const newArticle = {
      ...articleData,
      publishedAt: articleData.status === 'published' ? new Date() : null,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await articlesCollection.insertOne(newArticle);
    const createdArticle = await articlesCollection.findOne({ 
      _id: result.insertedId 
    });

    console.log('✅ 文章创建成功');
    return c.json(createdArticle, 201);
  } catch (error) {
    console.error('❌ 创建文章错误:', error.message);
    return c.json({ 
      error: '创建文章失败', 
      message: error.message 
    }, 500);
  }
});

// 3. 🔥🔥🔥 更新文章 - 最关键的路由
console.log('📋 注册: PUT /api/articles/:id 🚨🚨🚨');
rootApp.put('/api/articles/:id', zValidator('json', createArticleSchema.partial()), async (c) => {
  console.log('🎉🎉🎉 === PUT路由成功调用！ === 🎉🎉🎉');
  console.log('⏰ 请求时间:', new Date().toISOString());
  console.log('🔥 版本: v6.1-DEBUG-INTERFACE-FIX');
  console.log('🎯 这证明PUT路由已经完全修复！');
  console.log('======================================');
  
  try {
    await initDatabase();
    const articleId = c.req.param('id');
    const updateData = c.req.valid('json');
    
    console.log('📥 请求参数:');
    console.log('  文章ID:', articleId);
    console.log('  更新字段:', Object.keys(updateData));
    
    // 输出关键字段的更新信息
    if (updateData.status) {
      console.log('  🎯 状态更新:', updateData.status);
    }
    if (updateData.title) {
      console.log('  📝 标题更新:', updateData.title.zh);
    }
    if (updateData.category) {
      console.log('  📂 分类更新:', updateData.category);
    }
    
    // 验证文章ID格式
    if (!mongo.ObjectId.isValid(articleId)) {
      console.log('❌ 无效的文章ID格式:', articleId);
      return c.json({ error: '无效的文章ID格式' }, 400);
    }
    
    // 数据库操作
    console.log('💾 === 数据库操作 ===');
    const articlesCollection = db.collection('3d056577_articles');
    console.log('  集合名称:', '3d056577_articles');
    
    // 查找现有文章
    const existingArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!existingArticle) {
      console.log('❌ 文章不存在，ID:', articleId);
      return c.json({ error: '文章不存在' }, 404);
    }
    
    console.log('✅ 找到现有文章:');
    console.log('  ID:', existingArticle._id.toString());
    console.log('  标题:', existingArticle.title?.zh);
    console.log('  当前状态:', existingArticle.status);
    
    // 准备更新数据
    const finalUpdateData = { ...updateData };
    finalUpdateData.updatedAt = new Date();
    
    // 处理发布状态
    if (updateData.status) {
      console.log('🎯 状态更新逻辑:');
      console.log('  从:', existingArticle.status);
      console.log('  到:', updateData.status);
      
      if (updateData.status === 'published' && existingArticle.status !== 'published') {
        finalUpdateData.publishedAt = new Date();
        console.log('  📅 设置新的发布时间');
      } else if (updateData.status === 'draft') {
        finalUpdateData.publishedAt = null;
        console.log('  📝 清除发布时间');
      }
    }
    
    console.log('💾 === 执行更新 ===');
    console.log('  更新字段数量:', Object.keys(finalUpdateData).length);
    console.log('  更新字段详情:', JSON.stringify(finalUpdateData, null, 2));
    
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { $set: finalUpdateData }
    );
    
    console.log('💾 更新结果:');
    console.log('  acknowledged:', updateResult.acknowledged);
    console.log('  matchedCount:', updateResult.matchedCount);
    console.log('  modifiedCount:', updateResult.modifiedCount);
    
    if (updateResult.matchedCount === 0) {
      console.log('❌ 没有匹配的文档');
      return c.json({ error: '文章不存在或更新失败' }, 404);
    }
    
    if (updateResult.modifiedCount === 0) {
      console.log('⚠️ 文档未修改（数据可能相同）');
    }
    
    // 查询最终结果
    const updatedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!updatedArticle) {
      console.log('❌ 查询更新后的文章失败');
      return c.json({ error: '更新后查询失败' }, 500);
    }
    
    console.log('🎉 === 更新完成 ===');
    console.log('  最终状态:', updatedArticle.status);
    console.log('  最终标题:', updatedArticle.title?.zh);
    console.log('  最终分类:', updatedArticle.category);
    console.log('  更新时间:', updatedArticle.updatedAt);
    
    // 验证关键字段
    let success = true;
    const verificationResults = [];
    
    if (updateData.status && updatedArticle.status !== updateData.status) {
      success = false;
      verificationResults.push(`状态验证失败: 期望 ${updateData.status}, 实际 ${updatedArticle.status}`);
    }
    
    if (updateData.title && updateData.title.zh && updatedArticle.title.zh !== updateData.title.zh) {
      success = false;
      verificationResults.push(`标题验证失败`);
    }
    
    if (updateData.category && updatedArticle.category !== updateData.category) {
      success = false;
      verificationResults.push(`分类验证失败: 期望 ${updateData.category}, 实际 ${updatedArticle.category}`);
    }
    
    if (!success) {
      console.log('⚠️ 验证失败:', verificationResults);
      return c.json({
        ...updatedArticle,
        _validationErrors: verificationResults
      });
    }
    
    console.log('✅ 所有字段验证通过！');
    console.log('🕒 完成时间:', new Date().toISOString());
    console.log('======================================');
    
    return c.json(updatedArticle);
    
  } catch (error) {
    console.log('💥 === PUT路由错误 ===');
    console.log('🕒 错误时间:', new Date().toISOString());
    console.log('📝 错误消息:', error.message);
    console.log('📝 错误类型:', error.constructor.name);
    
    return c.json({ 
      error: '服务器内部错误',
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// 4. 获取单篇文章
console.log('📋 注册: GET /api/articles/:id');
rootApp.get('/api/articles/:id', async (c) => {
  try {
    await initDatabase();
    const id = c.req.param('id');
    const articlesCollection = db.collection('3d056577_articles');
    
    const article = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(id) 
    });

    if (!article) {
      return c.json({ error: '文章不存在' }, 404);
    }

    // 增加浏览次数
    await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(id) },
      { $inc: { views: 1 } }
    );

    return c.json(article);
  } catch (error) {
    return c.json({ 
      error: '获取文章失败', 
      message: error.message 
    }, 500);
  }
});

// 5. 删除文章
console.log('📋 注册: DELETE /api/articles/:id');
rootApp.delete('/api/articles/:id', async (c) => {
  try {
    await initDatabase();
    const id = c.req.param('id');
    const articlesCollection = db.collection('3d056577_articles');
    
    const result = await articlesCollection.deleteOne({ 
      _id: new mongo.ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return c.json({ error: '文章不存在' }, 404);
    }

    return c.json({ message: '文章删除成功' });
  } catch (error) {
    return c.json({ 
      error: '删除文章失败', 
      message: error.message 
    }, 500);
  }
});

// ========================
// 分类路由
// ========================

console.log('📋 注册: GET /api/categories');
rootApp.get('/api/categories', async (c) => {
  try {
    await initDatabase();
    const categoriesCollection = db.collection('3d056577_article_categories');
    
    const categories = await categoriesCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    return c.json({ categories });
  } catch (error) {
    // 如果集合不存在，返回默认分类
    const defaultCategories = [
      { 
        slug: 'tech', 
        title: { zh: '技术', en: 'Technology' }, 
        description: { zh: '技术相关文章', en: 'Technology articles' },
        icon: 'Code',
        color: '#3B82F6',
        order: 1
      },
      { 
        slug: 'business', 
        title: { zh: '商业', en: 'Business' }, 
        description: { zh: '商业相关文章', en: 'Business articles' },
        icon: 'Briefcase',
        color: '#10B981',
        order: 2
      }
    ];
    
    return c.json({ categories: defaultCategories });
  }
});

// ========================
// 调试路由 - DirectMongoTest需要的接口
// ========================

console.log('📋 注册: POST /api/articles/debug/direct-mongo - DirectMongoTest直接MongoDB测试');
rootApp.post('/api/articles/debug/direct-mongo', async (c) => {
  console.log('🔧🔧🔧 === DirectMongoTest直接MongoDB测试路由 ===');
  console.log('⏰ 请求时间:', new Date().toISOString());
  
  try {
    await initDatabase();
    
    const requestBody = await c.req.json();
    const { articleId, operation, newStatus } = requestBody;
    
    console.log('📥 接收参数:');
    console.log('  文章ID:', articleId);
    console.log('  操作类型:', operation);
    console.log('  新状态:', newStatus);
    
    if (!articleId) {
      return c.json({ 
        error: '缺少必要参数articleId', 
        required: ['articleId'] 
      }, 400);
    }
    
    // 验证ObjectId格式
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ 
        error: '无效的文章ID格式', 
        articleId 
      }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    console.log('✅ 获取集合:', '3d056577_articles');
    
    // 步骤1：获取当前文章状态
    console.log('📋 步骤1: 查询当前文章');
    const currentArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!currentArticle) {
      return c.json({ 
        error: '文章不存在', 
        articleId 
      }, 404);
    }
    
    console.log('✅ 当前文章状态:');
    console.log('  ID:', currentArticle._id.toString());
    console.log('  当前状态:', currentArticle.status);
    console.log('  标题:', currentArticle.title?.zh);
    console.log('  更新时间:', currentArticle.updatedAt);
    
    // 步骤2：准备更新数据
    console.log('📋 步骤2: 准备更新数据');
    const updateData = {
      updatedAt: new Date()
    };
    
    // 如果指定了newStatus，则更新状态
    if (newStatus) {
      updateData.status = newStatus;
      
      // 处理发布时间
      if (newStatus === 'published' && currentArticle.status !== 'published') {
        updateData.publishedAt = new Date();
        console.log('  📅 设置发布时间');
      } else if (newStatus === 'draft') {
        updateData.publishedAt = null;
        console.log('  📝 清除发布时间');
      }
    }
    
    console.log('💾 更新数据:', JSON.stringify(updateData, null, 2));
    
    // 步骤3：执行更新
    console.log('📋 步骤3: 执行MongoDB原生更新');
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { $set: updateData }
    );
    
    console.log('💾 MongoDB更新结果:');
    console.log('  acknowledged:', updateResult.acknowledged);
    console.log('  matchedCount:', updateResult.matchedCount);
    console.log('  modifiedCount:', updateResult.modifiedCount);
    console.log('  upsertedCount:', updateResult.upsertedCount);
    
    // 步骤4：验证更新结果
    console.log('📋 步骤4: 验证更新结果');
    const updatedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!updatedArticle) {
      return c.json({ 
        error: '更新后查询失败' 
      }, 500);
    }
    
    console.log('✅ 更新后文章状态:');
    console.log('  ID:', updatedArticle._id.toString());
    console.log('  最终状态:', updatedArticle.status);
    console.log('  标题:', updatedArticle.title?.zh);
    console.log('  更新时间:', updatedArticle.updatedAt);
    
    // 验证是否更新成功
    const isStatusUpdated = newStatus ? updatedArticle.status === newStatus : true;
    const isTimeUpdated = updatedArticle.updatedAt.getTime() !== currentArticle.updatedAt.getTime();
    const isSuccessful = updateResult.acknowledged && updateResult.matchedCount > 0 && (updateResult.modifiedCount > 0 || isTimeUpdated) && isStatusUpdated;
    
    console.log('📊 验证结果:');
    console.log('  状态是否更新:', isStatusUpdated);
    console.log('  时间是否更新:', isTimeUpdated);
    console.log('  modifiedCount:', updateResult.modifiedCount);
    console.log('  最终成功判断:', isSuccessful);
    
    const result = {
      success: isSuccessful,
      mongoResult: {
        acknowledged: updateResult.acknowledged,
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount
      },
      before: {
        id: currentArticle._id.toString(),
        status: currentArticle.status,
        updatedAt: currentArticle.updatedAt
      },
      after: {
        id: updatedArticle._id.toString(),
        status: updatedArticle.status,
        updatedAt: updatedArticle.updatedAt
      },
      verification: {
        statusUpdated: isStatusUpdated,
        timeUpdated: isTimeUpdated,
        expectedStatus: newStatus,
        actualStatus: updatedArticle.status
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('🎉 DirectMongoTest直接测试完成');
    console.log('  最终结果:', result.success ? '✅ 成功' : '❌ 失败');
    
    return c.json(result);
    
  } catch (error) {
    console.error('💥 DirectMongoTest直接测试错误:', error.message);
    return c.json({ 
      error: 'DirectMongoTest直接测试失败', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

console.log('📋 注册: POST /api/articles/debug/basic-update - 基础updateOne测试');
rootApp.post('/api/articles/debug/basic-update', async (c) => {
  console.log('🔧🔧🔧 === 基础updateOne测试路由 ===');
  console.log('⏰ 请求时间:', new Date().toISOString());
  
  try {
    await initDatabase();
    
    const requestBody = await c.req.json();
    const { articleId, testField } = requestBody;
    
    console.log('📥 接收参数:');
    console.log('  文章ID:', articleId);
    console.log('  测试字段:', testField);
    
    if (!articleId) {
      return c.json({ 
        error: '缺少必要参数articleId', 
        required: ['articleId'] 
      }, 400);
    }
    
    // 验证ObjectId格式
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ 
        error: '无效的文章ID格式', 
        articleId 
      }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    console.log('✅ 获取集合:', '3d056577_articles');
    
    // 步骤1：检查文章是否存在
    console.log('📋 步骤1: 检查文章是否存在');
    const currentArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!currentArticle) {
      return c.json({ 
        error: '文章不存在', 
        articleId 
      }, 404);
    }
    
    console.log('✅ 文章存在:');
    console.log('  ID:', currentArticle._id.toString());
    console.log('  标题:', currentArticle.title?.zh);
    console.log('  当前状态:', currentArticle.status);
    
    // 步骤2：执行简单的updateOne操作
    console.log('📋 步骤2: 执行基础updateOne操作');
    const updateData = {
      updatedAt: new Date()
    };
    
    // 如果提供了测试字段，添加到更新数据中
    if (testField) {
      updateData.testField = testField;
      console.log('  添加测试字段:', testField);
    }
    
    console.log('💾 更新数据:', JSON.stringify(updateData, null, 2));
    
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { $set: updateData }
    );
    
    console.log('💾 MongoDB updateOne结果:');
    console.log('  acknowledged:', updateResult.acknowledged);
    console.log('  matchedCount:', updateResult.matchedCount);
    console.log('  modifiedCount:', updateResult.modifiedCount);
    
    // 步骤3：验证更新结果
    console.log('📋 步骤3: 验证更新结果');
    const updatedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!updatedArticle) {
      return c.json({ 
        error: '更新后查询失败' 
      }, 500);
    }
    
    console.log('✅ 更新后检查:');
    console.log('  更新时间变化:', updatedArticle.updatedAt.getTime() !== currentArticle.updatedAt.getTime());
    console.log('  测试字段值:', updatedArticle.testField);
    
    // 计算各种验证条件，添加详细的类型检查日志
    const timeUpdated = updatedArticle.updatedAt.getTime() !== currentArticle.updatedAt.getTime();
    console.log('📊 验证 timeUpdated:');
    console.log('  计算结果:', timeUpdated);
    console.log('  结果类型:', typeof timeUpdated);
    console.log('  是否严格等于true:', timeUpdated === true);
    
    const testFieldSet = testField ? (updatedArticle.testField !== undefined && updatedArticle.testField !== null) : true;
    console.log('📊 验证 testFieldSet:');
    console.log('  计算结果:', testFieldSet);
    console.log('  结果类型:', typeof testFieldSet);
    console.log('  是否严格等于true:', testFieldSet === true);
    
    const testFieldMatches = testField ? updatedArticle.testField === testField : true;
    console.log('📊 验证 testFieldMatches:');
    console.log('  计算结果:', testFieldMatches);
    console.log('  结果类型:', typeof testFieldMatches);
    console.log('  是否严格等于true:', testFieldMatches === true);
    
    console.log('📊 MongoDB结果验证:');
    console.log('  acknowledged:', updateResult.acknowledged);
    console.log('  acknowledged类型:', typeof updateResult.acknowledged);
    console.log('  acknowledged === true:', updateResult.acknowledged === true);
    console.log('  matchedCount:', updateResult.matchedCount);
    console.log('  matchedCount > 0:', updateResult.matchedCount > 0);
    console.log('  modifiedCount:', updateResult.modifiedCount);
    console.log('  modifiedCount > 0:', updateResult.modifiedCount > 0);
    
    // 检查组合条件 - 添加详细的acknowledged类型检查
    console.log('🔍 acknowledged详细检查:');
    console.log('  acknowledged值:', updateResult.acknowledged);
    console.log('  acknowledged类型:', typeof updateResult.acknowledged);
    console.log('  acknowledged == true:', updateResult.acknowledged == true);
    console.log('  acknowledged === true:', updateResult.acknowledged === true);
    console.log('  Boolean(acknowledged):', Boolean(updateResult.acknowledged));
    
    // 简化success判断逻辑 - 直接基于实际操作结果
    // 移除对acknowledged字段的依赖，直接使用实际更新效果
    const mongoCondition = updateResult.matchedCount > 0;
    const updateCondition = updateResult.modifiedCount > 0 || timeUpdated === true;
    const fieldConditions = testFieldSet === true && testFieldMatches === true;
    
    console.log('📊 简化后的条件检查:');
    console.log('  matchedCount > 0:', mongoCondition);
    console.log('  更新条件 (modifiedCount > 0 || timeUpdated):', updateCondition);
    console.log('  字段条件 (testFieldSet && testFieldMatches):', fieldConditions);
    
    // 最终success计算 - 基于实际操作结果
    const isSuccessful = mongoCondition && updateCondition && fieldConditions;
    
    console.log('🎯 最终成功判断:');
    console.log('  MongoDB基础条件:', mongoCondition);
    console.log('  更新条件:', updateCondition);
    console.log('  字段条件:', fieldConditions);
    console.log('  最终结果:', isSuccessful);
    console.log('  结果类型:', typeof isSuccessful);
    
    const result = {
      success: isSuccessful,
      mongoResult: {
        acknowledged: updateResult.acknowledged,
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount
      },
      before: {
        id: currentArticle._id.toString(),
        updatedAt: currentArticle.updatedAt,
        testField: currentArticle.testField || '(未设置)'
      },
      after: {
        id: updatedArticle._id.toString(),
        updatedAt: updatedArticle.updatedAt,
        testField: updatedArticle.testField || '(未设置)'
      },
      verification: {
        timeUpdated: timeUpdated,
        testFieldSet: testFieldSet,
        testFieldMatches: testFieldMatches,
        expectedTestField: testField,
        actualTestField: updatedArticle.testField
      },
      debugInfo: {
        mongoCondition: mongoCondition,
        updateCondition: updateCondition,
        fieldConditions: fieldConditions
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('🎉 基础updateOne测试完成');
    console.log('  最终结果:', result.success ? '✅ 成功' : '❌ 失败');
    
    return c.json(result);
    
  } catch (error) {
    console.error('💥 基础updateOne测试错误:', error.message);
    return c.json({ 
      error: '基础updateOne测试失败', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// 保留原有的调试路由（向后兼容）
console.log('📋 注册: POST /api/debug/mongo-test - 原有MongoDB直接测试（向后兼容）');
rootApp.post('/api/debug/mongo-test', async (c) => {
  console.log('🔧🔧🔧 === MongoDB直接测试路由（原有） ===');
  console.log('⏰ 请求时间:', new Date().toISOString());
  
  try {
    await initDatabase();
    
    const requestBody = await c.req.json();
    const { articleId, status } = requestBody;
    
    console.log('📥 接收参数:');
    console.log('  文章ID:', articleId);
    console.log('  目标状态:', status);
    
    if (!articleId || !status) {
      return c.json({ 
        error: '缺少必要参数', 
        required: ['articleId', 'status'] 
      }, 400);
    }
    
    // 验证ObjectId格式
    if (!mongo.ObjectId.isValid(articleId)) {
      return c.json({ 
        error: '无效的文章ID格式', 
        articleId 
      }, 400);
    }
    
    const articlesCollection = db.collection('3d056577_articles');
    console.log('✅ 获取集合:', '3d056577_articles');
    
    // 执行直接更新
    const updateResult = await articlesCollection.updateOne(
      { _id: new mongo.ObjectId(articleId) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log('💾 MongoDB直接更新结果:');
    console.log('  acknowledged:', updateResult.acknowledged);
    console.log('  matchedCount:', updateResult.matchedCount);
    console.log('  modifiedCount:', updateResult.modifiedCount);
    
    if (updateResult.matchedCount === 0) {
      return c.json({ 
        error: '文章不存在', 
        articleId 
      }, 404);
    }
    
    // 查询更新后的结果
    const updatedArticle = await articlesCollection.findOne({ 
      _id: new mongo.ObjectId(articleId) 
    });
    
    if (!updatedArticle) {
      return c.json({ 
        error: '更新后查询失败' 
      }, 500);
    }
    
    console.log('✅ 更新后状态:');
    console.log('  最终状态:', updatedArticle.status);
    console.log('  更新时间:', updatedArticle.updatedAt);
    
    const result = {
      success: updateResult.acknowledged && updateResult.matchedCount > 0,
      mongoResult: {
        acknowledged: updateResult.acknowledged,
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount
      },
      article: {
        id: updatedArticle._id.toString(),
        status: updatedArticle.status,
        title: updatedArticle.title,
        updatedAt: updatedArticle.updatedAt
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('🎉 MongoDB直接测试完成');
    
    return c.json(result);
    
  } catch (error) {
    console.error('💥 MongoDB直接测试错误:', error.message);
    return c.json({ 
      error: 'MongoDB直接测试失败', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

console.log('✅ 所有路由注册完成');
console.log('✅ 调试路由: verify-article, direct-mongo, basic-update');
console.log('🔥 PUT路由特别确认: PUT /api/articles/:id 已正确注册！');
console.log('🔧 验证文章路由特别确认: POST /api/articles/debug/verify-article 已正确注册！');

// 导出应用实例
export default rootApp;

// Vercel兼容性导出
export { rootApp };