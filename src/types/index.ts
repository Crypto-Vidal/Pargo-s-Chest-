import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchParams {
  query: string;
  userId: string;
}

export interface VideoMetadata {
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  channel?: string;
  channelUrl?: string;
  publishedAt?: Date;
}

export interface AuthRequest extends Request {
  userId?: string;
}
