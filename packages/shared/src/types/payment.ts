export interface PaystackTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: 'ZAR' | 'USD' | 'EUR' | 'GBP';
  status: PaymentStatus;
  gateway_response?: string;
  paid_at?: Date;
  created_at: Date;
  channel?: PaymentChannel;
  fees?: number;
  customer?: PaystackCustomer;
  authorization?: PaymentAuthorization;
  metadata?: Record<string, any>;
}

export type PaymentStatus = 
  | 'success'
  | 'failed' 
  | 'cancelled'
  | 'pending'
  | 'abandoned'
  | 'ongoing';

export type PaymentChannel = 
  | 'card'
  | 'bank'
  | 'ussd'
  | 'qr'
  | 'mobile_money'
  | 'bank_transfer'
  | 'eft';

export interface PaystackCustomer {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  customer_code: string;
  risk_action?: string;
}

export interface PaymentAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
}

export interface PaymentInitialization {
  email: string;
  amount: number;
  currency?: string;
  callback_url?: string;
  channels?: PaymentChannel[];
  metadata?: PaymentMetadata;
  plan?: string;
  invoice_limit?: number;
  phone?: string;
}

export interface PaymentMetadata {
  userId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  jobId?: string;
  custom_fields?: CustomField[];
  [key: string]: any;
}

export interface CustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerification {
  status: boolean;
  message: string;
  data?: PaystackTransaction;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  paystackCustomerCode?: string;
  paystackSubscriptionCode?: string;
  paymentMethod?: PaymentMethod;
  features: SubscriptionFeature[];
  usageMetrics?: UsageMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionPlan = 'basic' | 'premium' | 'enterprise';

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired' | 'suspended';

export type BillingCycle = 'monthly' | 'yearly';

export interface PaymentMethod {
  type: PaymentChannel;
  last4?: string;
  brand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  authorizationCode?: string;
}

export interface SubscriptionFeature {
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  unit?: string;
}

export interface UsageMetrics {
  jobApplications: number;
  jobApplicationsLimit: number;
  profileViews: number;
  profileViewsLimit: number;
  resumeDownloads: number;
  resumeDownloadsLimit: number;
  jobAlerts: number;
  jobAlertsLimit: number;
  aiRecommendations: number;
  aiRecommendationsLimit: number;
  premiumSupport: boolean;
  advancedFilters: boolean;
  companyInsights: boolean;
  priorityListing: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: BillingCycle;
  features: PlanFeature[];
  isPopular: boolean;
  isActive: boolean;
  paystackPlanCode?: string;
  trialDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeature {
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'boolean' | 'number' | 'text';
  unit?: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  dueDate: Date;
  paidAt?: Date;
  paymentReference?: string;
  items: InvoiceItem[];
  tax?: number;
  discount?: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  subscriptionId?: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentChannel;
  reference: string;
  description: string;
  metadata?: Record<string, any>;
  processedAt?: Date;
  createdAt: Date;
}

export interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address: BillingAddress;
  taxId?: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageTransactionValue: number;
  topPaymentMethods: { method: PaymentChannel; count: number; percentage: number }[];
  revenueByPlan: { plan: SubscriptionPlan; revenue: number; subscribers: number }[];
  monthlyTrend: { month: string; revenue: number; transactions: number }[];
}
