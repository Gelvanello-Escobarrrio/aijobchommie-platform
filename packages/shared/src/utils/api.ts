/**
 * API utility functions for AI Job Chommie platform
 */

import type { ApiResponse, ApiError } from '../types/api';

/**
 * Create standardized API response
 */
export const createApiResponse = <T>(
  data?: T,
  message?: string,
  error?: ApiError
): ApiResponse<T> => {
  return {
    success: !error,
    data,
    message,
    error,
    timestamp: new Date()
  };
};

/**
 * Create API success response
 */
export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => {
  return createApiResponse(data, message);
};

/**
 * Create API error response
 */
export const createErrorResponse = (
  error: string | ApiError,
  statusCode?: number
): ApiResponse<any> => {
  const apiError: ApiError = typeof error === 'string' 
    ? { code: 'GENERIC_ERROR', message: error, statusCode }
    : error;
    
  return createApiResponse(null, undefined, apiError);
};

/**
 * Extract error message from various error types
 */
export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    
    if ('details' in error && typeof error.details === 'string') {
      return error.details;
    }
  }
  
  return 'An unexpected error occurred';
};

/**
 * Parse query parameters from URL string
 */
export const parseQueryParams = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Build API endpoint URL
 */
export const buildApiUrl = (
  baseUrl: string,
  endpoint: string,
  params?: Record<string, any>
): string => {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = `${cleanBaseUrl}/${cleanEndpoint}`;
  
  if (params) {
    const queryString = buildQueryString(params);
    return url + queryString;
  }
  
  return url;
};

/**
 * Get error status code from response
 */
export const getErrorStatusCode = (error: any): number => {
  if (error?.response?.status) return error.response.status;
  if (error?.status) return error.status;
  if (error?.statusCode) return error.statusCode;
  return 500;
};

/**
 * Check if error is client error (4xx)
 */
export const isClientError = (statusCode: number): boolean => {
  return statusCode >= 400 && statusCode < 500;
};

/**
 * Check if error is server error (5xx)
 */
export const isServerError = (statusCode: number): boolean => {
  return statusCode >= 500 && statusCode < 600;
};

/**
 * Check if request should be retried
 */
export const shouldRetry = (error: any, attempt: number, maxRetries: number): boolean => {
  if (attempt >= maxRetries) return false;
  
  const statusCode = getErrorStatusCode(error);
  
  // Don't retry client errors (except 429 Too Many Requests)
  if (isClientError(statusCode) && statusCode !== 429) {
    return false;
  }
  
  // Retry server errors and network errors
  return isServerError(statusCode) || !statusCode;
};

/**
 * Calculate retry delay with exponential backoff
 */
export const calculateRetryDelay = (
  attempt: number,
  baseDelay = 1000,
  maxDelay = 30000
): number => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
};

/**
 * Sanitize data for API requests
 */
export const sanitizeApiData = <T extends Record<string, any>>(data: T): Partial<T> => {
  const sanitized: Partial<T> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string') {
        sanitized[key as keyof T] = value.trim() as T[keyof T];
      } else {
        sanitized[key as keyof T] = value;
      }
    }
  });
  
  return sanitized;
};

/**
 * Validate required fields in API data
 */
export const validateRequiredFields = <T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      missingFields.push(String(field));
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Transform API response data
 */
export const transformApiResponse = <TInput, TOutput>(
  response: ApiResponse<TInput>,
  transformer: (data: TInput) => TOutput
): ApiResponse<TOutput> => {
  if (!response.success || response.data === undefined || response.data === null) {
    // Return a compatible ApiResponse<TOutput> with undefined data
    return {
      ...response,
      data: undefined as unknown as TOutput
    } as ApiResponse<TOutput>;
  }

  try {
    const transformedData = transformer(response.data as TInput);
    return {
      ...response,
      data: transformedData as unknown as TOutput
    };
  } catch (error) {
    return {
      success: false,
      data: undefined as unknown as TOutput,
      message: undefined,
      error: {
        code: 'TRANSFORMATION_ERROR',
        message: extractErrorMessage(error)
      },
      timestamp: new Date()
    };
  }
};

/**
 * Merge multiple API responses
 */
export const mergeApiResponses = <T>(
  responses: ApiResponse<T>[]
): ApiResponse<T[]> => {
  const errors: string[] = [];
  const data: T[] = [];
  
  responses.forEach((response, index) => {
    if (response.success && response.data) {
      data.push(response.data);
    } else if (response.error) {
      errors.push(`Response ${index + 1}: ${response.error.message}`);
    }
  });
  
  if (errors.length > 0) {
    return createErrorResponse({
      code: 'MERGE_ERROR',
      message: `Some requests failed: ${errors.join(', ')}`
    });
  }

  // createSuccessResponse expects a T, but here we have T[] so we call createApiResponse directly
  return createApiResponse<T[]> (data, `Successfully merged ${data.length} responses`);
};

/**
 * Cache key generator for API requests
 */
export const generateCacheKey = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const baseKey = endpoint.replace(/\//g, ':');
  
  if (!params) return baseKey;
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${String(params[key])}`)
    .join('&');
    
  return `${baseKey}?${sortedParams}`;
};

/**
 * Check if API response is cached
 */
export const isCachedResponse = <T>(response: ApiResponse<T>): boolean => {
  return Boolean(response.timestamp && 
    Date.now() - new Date(response.timestamp).getTime() < 300000); // 5 minutes
};

/**
 * Format API validation errors
 */
export const formatValidationErrors = (
  errors: Array<{ field: string; message: string }>
): ApiError => {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: errors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {} as Record<string, string>)
  };
};

/**
 * Rate limiting utilities
 */
export const createRateLimitKey = (
  userId: string,
  endpoint: string,
  timeWindow = '1h'
): string => {
  return `rate_limit:${userId}:${endpoint}:${timeWindow}`;
};

/**
 * Check if request is rate limited
 */
export const isRateLimited = (
  requestCount: number,
  limit: number
): boolean => {
  return requestCount >= limit;
};

/**
 * Format rate limit error
 */
export const createRateLimitError = (
  limit: number,
  resetTime: Date
): ApiError => {
  return {
    code: 'RATE_LIMITED',
    message: `Request limit of ${limit} exceeded. Try again after ${resetTime.toISOString()}`,
    details: {
      limit,
      resetTime: resetTime.toISOString()
    }
  };
};

/**
 * Debounce API calls
 */
export const debounceApiCall = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }) as T;
};

/**
 * Throttle API calls
 */
export const throttleApiCall = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): T => {
  let lastCallTime = 0;
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    
    return new Promise((resolve, reject) => {
      const timeSinceLastCall = now - lastCallTime;
      
      if (timeSinceLastCall >= delay) {
        lastCallTime = now;
        fn(...args).then(resolve).catch(reject);
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          lastCallTime = Date.now();
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay - timeSinceLastCall);
      }
    });
  }) as T;
};
