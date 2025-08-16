export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  pagination?: PaginationMeta;
  timestamp: Date;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  statusCode?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UploadedFile {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: FileType;
  extractedText?: string;
  metadata?: FileMetadata;
  isProcessed: boolean;
  isPublic: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type FileType = 'resume' | 'profile_picture' | 'document' | 'company_logo' | 'cover_letter';

export interface FileMetadata {
  width?: number;
  height?: number;
  pages?: number;
  language?: string;
  format?: string;
  compressed?: boolean;
  thumbnail?: string;
  [key: string]: any;
}

export interface FileUploadRequest {
  file: File;
  type: FileType;
  isPublic?: boolean;
  expiresIn?: number;
}

export interface FileUploadResponse {
  file: UploadedFile;
  uploadUrl?: string;
}

export interface AIService {
  provider: 'openai' | 'huggingface' | 'anthropic';
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface AIAnalysisRequest {
  text: string;
  type: 'resume' | 'job_description' | 'cover_letter' | 'skill_extraction';
  service?: AIService;
  userId?: string;
}

export interface AIAnalysisResponse {
  analysis: AIAnalysisResult;
  usage?: TokenUsage;
  processingTime: number;
  model: string;
}

export interface AIAnalysisResult {
  summary?: string;
  skills?: string[];
  experience?: string[];
  score?: number;
  recommendations?: string[];
  keywords?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost?: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: ServiceHealth[];
  performance: PerformanceMetrics;
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  error?: string;
  lastCheck: Date;
}

export interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  activeConnections: number;
  requestsPerSecond: number;
  averageResponseTime: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: NotificationChannel[];
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 
  | 'job_alert'
  | 'application_status'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_reminder'
  | 'profile_incomplete'
  | 'new_message'
  | 'system_update'
  | 'security_alert';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export interface WebhookPayload {
  event: string;
  data: Record<string, any>;
  timestamp: Date;
  signature?: string;
  source: 'paystack' | 'supabase' | 'system';
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

export interface CacheInfo {
  key: string;
  ttl: number;
  hit: boolean;
  size?: number;
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    byRole: Record<string, number>;
  };
  jobs: {
    total: number;
    active: number;
    newThisMonth: number;
    byStatus: Record<string, number>;
  };
  applications: {
    total: number;
    thisMonth: number;
    byStatus: Record<string, number>;
  };
  payments: {
    totalRevenue: number;
    monthlyRevenue: number;
    activeSubscriptions: number;
    byPlan: Record<string, number>;
  };
  system: {
    uptime: number;
    version: string;
    environment: string;
    lastDeployment: Date;
  };
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface SearchQuery {
  q?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  include?: string[];
}

export interface BulkOperation<T = any> {
  operation: 'create' | 'update' | 'delete';
  data: T[];
  options?: {
    skipValidation?: boolean;
    continueOnError?: boolean;
    batchSize?: number;
  };
}

export interface BulkOperationResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}
