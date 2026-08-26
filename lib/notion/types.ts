export interface NotionPaginationOptions {
  maxRecords?: number;
  pageSize?: number;
  startCursor?: string;
  sorts?: any[];
  filter?: any;
}

export interface NotionQueryResult<T> {
  success: boolean;
  data: T;
  hasMore?: boolean;
  nextCursor?: string | null;
  totalFetched?: number;
  isOffline?: boolean;
  error?: string;
}

export interface NotionMutationResult<T> {
  success: boolean;
  data: T;
  id?: string;
  isOffline?: boolean;
  error?: string;
}
