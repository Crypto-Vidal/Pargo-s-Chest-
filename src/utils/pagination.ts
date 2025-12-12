import { PaginationParams, SortParams, PaginatedResponse } from '../types';

export function getPaginationParams(
  page: string | undefined,
  limit: string | undefined
): PaginationParams {
  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '10', 10);

  const validPage = Math.max(1, pageNum);
  const validLimit = Math.min(Math.max(1, limitNum), 100); // Max 100 items per page

  return {
    page: validPage,
    limit: validLimit,
    skip: (validPage - 1) * validLimit,
  };
}

export function getSortParams(
  sortBy: string | undefined,
  sortOrder: string | undefined,
  allowedFields: string[]
): SortParams {
  const validSortBy = sortBy && allowedFields.includes(sortBy) ? sortBy : 'createdAt';
  const validSortOrder = sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc';

  return {
    sortBy: validSortBy,
    sortOrder: validSortOrder,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
