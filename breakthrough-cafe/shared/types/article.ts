/**
 * 文章相关的共享类型定义
 * 前端和服务端共用的数据类型
 */

export interface Article {
  _id: string;
  title: {
    zh: string;
    en: string;
  };
  excerpt: {
    zh: string;
    en: string;
  };
  content: {
    zh: string;
    en: string;
  };
  category: string;
  tags: string[];
  readTime: {
    zh: string;
    en: string;
  };
  isFeatured: boolean;
  publishedAt: Date;
  author: string;
  status: 'draft' | 'published';
  views: number;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleCategory {
  _id: string;
  slug: string;
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  icon: string;
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleFilters {
  category?: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published';
  limit?: number;
  skip?: number;
  sortBy?: 'publishedAt' | 'views' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
