/**
 * Vercel部署 - API路由处理器
 * 将所有API请求路由到Hono服务器
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

// 导入服务器配置
import rootApp from '../server/index';

// 使用Hono的Vercel适配器
export default handle(rootApp);