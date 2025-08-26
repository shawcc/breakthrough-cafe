/**
 * MongoDB连接配置 - Vercel部署版本
 * 支持本地开发和Vercel生产环境
 */

import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * 获取MongoDB连接
 */
export async function connectDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // 如果已经连接，直接返回
  if (client && db) {
    return { client, db };
  }

  try {
    // 获取连接字符串
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI环境变量未设置');
    }

    console.log('🔗 连接MongoDB...');
    console.log('📍 环境:', process.env.NODE_ENV || 'development');
    
    // 创建新连接
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    
    // 连接到数据库
    const dbName = process.env.MONGODB_DB_NAME || 'breakthrough_cafe';
    db = client.db(dbName);

    console.log('✅ MongoDB连接成功');
    console.log('📊 数据库名称:', dbName);

    // 测试连接
    await db.admin().ping();
    console.log('✅ 数据库ping测试通过');

    return { client, db };
    
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error);
    throw error;
  }
}

/**
 * 获取数据库实例（用于全局访问）
 */
export function getDatabase(): Db {
  if (!db) {
    throw new Error('数据库未初始化，请先调用connectDatabase()');
  }
  return db;
}

/**
 * 关闭数据库连接
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ MongoDB连接已关闭');
  }
}

// Vercel环境下的自动连接
if (typeof process !== 'undefined' && process.env.VERCEL) {
  // 在Vercel环境下，每个请求都可能需要重新连接
  console.log('🚀 Vercel环境：准备MongoDB连接');
}