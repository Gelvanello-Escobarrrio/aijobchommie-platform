/**
 * 💳 PAYSTACK PAYMENT SERVICE
 * 
 * Comprehensive Paystack integration for South African payments
 * Supports subscriptions, one-time payments, and webhook handling
 */

import axios from 'axios';
import { db } from '../config/database';
import { payments, users } from '../models/schema';
import { eq } from 'drizzle-orm';
import winston from 'winston';
import crypto from 'crypto';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

// Paystack configuration
const PAYSTACK_CONFIG = {
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
  baseUrl: 'https://api.paystack.co',
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || ''
};

// Subscription plans for AI Job Chommie (prices in kobo - ZAR cents)
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free Plan',
    price: 0,
    currency: 'ZAR',
    interval: 'monthly',
    features: [
      'Basic job search',
      'Up to 5 applications per month',
      'Email job alerts',
      'Basic profile'
    ]
  },
  basic: {
    name: 'Basic Plan',
    price: 4900, // R49.00 in kobo (cents)
    currency: 'ZAR',
    interval: 'monthly',
    features: [
      'Unlimited job applications',
      'AI-powered job matching',
      'Priority email alerts',
      'Advanced profile features',
      'Application tracking',
      'Direct employer contact'
    ]
  },
  premium: {
    name: 'Premium Plan',
    price: 9900, // R99.00 in kobo (cents)
    currency: 'ZAR',
    interval: 'monthly',
    features: [
      'All Basic features',
      'Priority application placement',
      'CV analysis and optimization',
      'Interview preparation tips',
      'Salary negotiation guidance',
      'Career coaching access',
      'WhatsApp job alerts',
      '24/7 priority support'
    ]
  }
};

export interface PaymentInitialization {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface PaymentVerification {
  status: 'success' | 'failed' | 'pending';
  reference: string;
  amount: number;
  currency: string;
  paidAt?: Date;
  channel?: string;
  fees?: number;
  authorization?: any;
}

/**
 * Paystack Payment Service
 */
export class PaystackService {

  /**
   * Initialize payment for subscription or one-time payment
   */
  static async initializePayment({
    email,
    amount,
    currency = 'ZAR',
    plan,
    userId,
    metadata = {}
  }: {
    email: string;
    amount: number;
    currency?: string;
    plan?: string;
    userId?: string;
    metadata?: any;
  }): Promise<PaymentInitialization> {
    try {
      const reference = this.generateReference();
      
      const paymentData = {
        email: email,
        amount: Math.round(amount * 100), // Convert to kobo (cents)
        currency: currency,
        reference: reference,
        callback_url: `${process.env.PAYMENT_SUCCESS_URL || 'http://localhost:3000/payment/success'}?reference=${reference}`,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: {
          userId: userId,
          plan: plan,
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: plan || 'one-time'
            },
            {
              display_name: "User ID",
              variable_name: "user_id", 
              value: userId || 'guest'
            }
          ],
          ...metadata
        }
      };

      const response = await this.makePaystackRequest('POST', '/transaction/initialize', paymentData);
      
      if (response.status && response.data) {
        // Store payment record in database
        await this.createPaymentRecord({
          userId: userId,
          amount: amount,
          currency: currency,
          reference: reference,
          status: 'pending',
          subscriptionPlan: plan,
          metadata: paymentData.metadata
        });

        logger.info(`✅ Payment initialized: ${reference} for ${email} - R${amount}`);

        return {
          authorizationUrl: response.data.authorization_url,
          accessCode: response.data.access_code,
          reference: reference
        };
      } else {
        throw new Error(response.message || 'Payment initialization failed');
      }
    } catch (error) {
      logger.error('❌ Payment initialization failed:', error);
      throw new Error(`Payment initialization failed: ${error.message}`);
    }
  }

  /**
   * Verify payment status
   */
  static async verifyPayment(reference: string): Promise<PaymentVerification> {
    try {
      const response = await this.makePaystackRequest('GET', `/transaction/verify/${reference}`);
      
      if (response.status && response.data) {
        const transaction = response.data;
        
        const verification: PaymentVerification = {
          status: transaction.status === 'success' ? 'success' : 'failed',
          reference: transaction.reference,
          amount: transaction.amount / 100, // Convert back to rands
          currency: transaction.currency,
          paidAt: transaction.paid_at ? new Date(transaction.paid_at) : undefined,
          channel: transaction.channel,
          fees: transaction.fees ? transaction.fees / 100 : undefined,
          authorization: transaction.authorization
        };

        // Update payment record in database
        await this.updatePaymentRecord(reference, {
          status: verification.status,
          paidAt: verification.paidAt,
          paystackTransactionId: transaction.id.toString(),
          metadata: {
            channel: verification.channel,
            fees: verification.fees,
            authorization: verification.authorization,
            gateway_response: transaction.gateway_response
          }
        });

        // Handle successful payment
        if (verification.status === 'success') {
          await this.handleSuccessfulPayment(transaction);
        }

        logger.info(`✅ Payment verified: ${reference} - ${verification.status}`);
        return verification;
        
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }
    } catch (error) {
      logger.error('❌ Payment verification failed:', error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  /**
   * Create subscription plan on Paystack
   */
  static async createSubscriptionPlan(planKey: string): Promise<any> {
    try {
      const plan = SUBSCRIPTION_PLANS[planKey];
      if (!plan) {
        throw new Error(`Invalid plan: ${planKey}`);
      }

      const planData = {
        name: plan.name,
        interval: plan.interval,
        amount: plan.price,
        currency: plan.currency,
        description: `AI Job Chommie ${plan.name} - ${plan.features.join(', ')}`,
        send_invoices: true,
        send_sms: false, // Disable SMS for now
        hosted_page: false
      };

      const response = await this.makePaystackRequest('POST', '/plan', planData);
      
      if (response.status && response.data) {
        logger.info(`✅ Subscription plan created: ${planKey}`);
        return response.data;
      } else {
        throw new Error(response.message || 'Plan creation failed');
      }
    } catch (error) {
      logger.error('❌ Plan creation failed:', error);
      throw error;
    }
  }

  /**
   * Subscribe user to a plan
   */
  static async createSubscription({
    customerCode,
    planCode,
    authorization
  }: {
    customerCode: string;
    planCode: string;
    authorization: string;
  }): Promise<any> {
    try {
      const subscriptionData = {
        customer: customerCode,
        plan: planCode,
        authorization: authorization
      };

      const response = await this.makePaystackRequest('POST', '/subscription', subscriptionData);
      
      if (response.status && response.data) {
        logger.info(`✅ Subscription created: ${response.data.subscription_code}`);
        return response.data;
      } else {
        throw new Error(response.message || 'Subscription creation failed');
      }
    } catch (error) {
      logger.error('❌ Subscription creation failed:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionCode: string, token: string): Promise<boolean> {
    try {
      const response = await this.makePaystackRequest('POST', '/subscription/disable', {
        code: subscriptionCode,
        token: token
      });
      
      if (response.status) {
        logger.info(`✅ Subscription cancelled: ${subscriptionCode}`);
        return true;
      } else {
        throw new Error(response.message || 'Subscription cancellation failed');
      }
    } catch (error) {
      logger.error('❌ Subscription cancellation failed:', error);
      return false;
    }
  }

  /**
   * Create customer on Paystack
   */
  static async createCustomer({
    email,
    firstName,
    lastName,
    phone
  }: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<any> {
    try {
      const customerData = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone
      };

      const response = await this.makePaystackRequest('POST', '/customer', customerData);
      
      if (response.status && response.data) {
        logger.info(`✅ Customer created: ${email}`);
        return response.data;
      } else {
        throw new Error(response.message || 'Customer creation failed');
      }
    } catch (error) {
      logger.error('❌ Customer creation failed:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events from Paystack
   */
  static async handleWebhook(payload: any, signature: string): Promise<boolean> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(payload, signature)) {
        logger.error('❌ Invalid webhook signature');
        return false;
      }

      const event = payload.event;
      const data = payload.data;

      logger.info(`📧 Webhook received: ${event}`);

      switch (event) {
        case 'charge.success':
          await this.handleChargeSuccess(data);
          break;
        case 'subscription.create':
          await this.handleSubscriptionCreate(data);
          break;
        case 'subscription.disable':
          await this.handleSubscriptionDisable(data);
          break;
        case 'invoice.create':
          await this.handleInvoiceCreate(data);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(data);
          break;
        default:
          logger.info(`ℹ️ Unhandled webhook event: ${event}`);
      }

      return true;
    } catch (error) {
      logger.error('❌ Webhook handling failed:', error);
      return false;
    }
  }

  /**
   * Get payment analytics
   */
  static async getPaymentAnalytics(userId?: string): Promise<any> {
    try {
      let query = db.select().from(payments);
      
      if (userId) {
        query = query.where(eq(payments.userId, userId));
      }

      const allPayments = await query;

      const analytics = {
        totalPayments: allPayments.length,
        totalRevenue: allPayments
          .filter(p => p.status === 'successful')
          .reduce((sum, p) => sum + Number(p.amount), 0),
        successfulPayments: allPayments.filter(p => p.status === 'successful').length,
        failedPayments: allPayments.filter(p => p.status === 'failed').length,
        pendingPayments: allPayments.filter(p => p.status === 'pending').length,
        revenueByPlan: {},
        paymentMethods: {},
        monthlyRevenue: []
      };

      // Group by subscription plan
      allPayments
        .filter(p => p.status === 'successful' && p.subscriptionPlan)
        .forEach(payment => {
          const plan = payment.subscriptionPlan;
          analytics.revenueByPlan[plan] = (analytics.revenueByPlan[plan] || 0) + Number(payment.amount);
        });

      // Monthly revenue tracking
      const monthlyData = {};
      allPayments
        .filter(p => p.status === 'successful' && p.paidAt)
        .forEach(payment => {
          const month = payment.paidAt.toISOString().slice(0, 7); // YYYY-MM
          monthlyData[month] = (monthlyData[month] || 0) + Number(payment.amount);
        });

      analytics.monthlyRevenue = Object.entries(monthlyData).map(([month, revenue]) => ({
        month,
        revenue
      }));

      return analytics;
    } catch (error) {
      logger.error('❌ Failed to get payment analytics:', error);
      return null;
    }
  }

  /**
   * Make authenticated request to Paystack API
   */
  private static async makePaystackRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<any> {
    try {
      const config = {
        method: method,
        url: `${PAYSTACK_CONFIG.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        logger.error('Paystack API Error:', error.response.data);
        throw new Error(error.response.data.message || 'Paystack API error');
      }
      throw error;
    }
  }

  /**
   * Generate unique payment reference
   */
  private static generateReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `AIJC_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Create payment record in database
   */
  private static async createPaymentRecord(paymentData: {
    userId?: string;
    amount: number;
    currency: string;
    reference: string;
    status: string;
    subscriptionPlan?: string;
    metadata?: any;
  }): Promise<void> {
    try {
      await db.insert(payments).values({
        userId: paymentData.userId,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency,
        status: paymentData.status,
        paystackReference: paymentData.reference,
        subscriptionPlan: paymentData.subscriptionPlan,
        description: paymentData.subscriptionPlan 
          ? `Subscription: ${paymentData.subscriptionPlan}` 
          : 'One-time payment',
        metadata: paymentData.metadata
      });

      logger.info(`💾 Payment record created: ${paymentData.reference}`);
    } catch (error) {
      logger.error('❌ Failed to create payment record:', error);
    }
  }

  /**
   * Update payment record in database
   */
  private static async updatePaymentRecord(
    reference: string,
    updates: {
      status?: string;
      paidAt?: Date;
      paystackTransactionId?: string;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      await db
        .update(payments)
        .set({
          status: updates.status,
          paidAt: updates.paidAt,
          paystackTransactionId: updates.paystackTransactionId,
          metadata: updates.metadata,
          updatedAt: new Date()
        })
        .where(eq(payments.paystackReference, reference));

      logger.info(`💾 Payment record updated: ${reference}`);
    } catch (error) {
      logger.error('❌ Failed to update payment record:', error);
    }
  }

  /**
   * Handle successful payment
   */
  private static async handleSuccessfulPayment(transaction: any): Promise<void> {
    try {
      const metadata = transaction.metadata;
      const userId = metadata?.userId || metadata?.user_id;
      const plan = metadata?.plan;

      if (userId && plan && plan !== 'one-time') {
        // Update user's subscription
        await db
          .update(users)
          .set({
            subscriptionPlan: plan,
            subscriptionStatus: 'active',
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));

        logger.info(`👤 User subscription updated: ${userId} -> ${plan}`);
      }

      // TODO: Send payment confirmation email
      // await EmailService.sendPaymentConfirmation(transaction);
      
    } catch (error) {
      logger.error('❌ Failed to handle successful payment:', error);
    }
  }

  /**
   * Verify webhook signature
   */
  private static verifyWebhookSignature(payload: any, signature: string): boolean {
    if (!PAYSTACK_CONFIG.webhookSecret) {
      logger.warn('⚠️ Webhook secret not configured, skipping verification');
      return true; // Skip verification in development
    }

    const hash = crypto
      .createHmac('sha512', PAYSTACK_CONFIG.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  }

  /**
   * Handle charge success webhook
   */
  private static async handleChargeSuccess(data: any): Promise<void> {
    try {
      const reference = data.reference;
      
      await this.updatePaymentRecord(reference, {
        status: 'successful',
        paidAt: new Date(data.paid_at),
        paystackTransactionId: data.id.toString(),
        metadata: {
          channel: data.channel,
          fees: data.fees / 100,
          authorization: data.authorization,
          gateway_response: data.gateway_response
        }
      });

      await this.handleSuccessfulPayment(data);
      logger.info(`✅ Charge success handled: ${reference}`);
    } catch (error) {
      logger.error('❌ Failed to handle charge success:', error);
    }
  }

  /**
   * Handle subscription creation webhook
   */
  private static async handleSubscriptionCreate(data: any): Promise<void> {
    try {
      const customerCode = data.customer.customer_code;
      const subscriptionCode = data.subscription_code;

      // Find user by Paystack customer code
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.paystackCustomerId, customerCode))
        .limit(1);

      if (user) {
        await db
          .update(users)
          .set({
            subscriptionStatus: 'active',
            metadata: {
              ...user.metadata as any,
              subscriptionCode: subscriptionCode
            },
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));

        logger.info(`📋 Subscription created for user: ${user.id}`);
      }
    } catch (error) {
      logger.error('❌ Failed to handle subscription creation:', error);
    }
  }

  /**
   * Handle subscription disable webhook
   */
  private static async handleSubscriptionDisable(data: any): Promise<void> {
    try {
      const subscriptionCode = data.subscription_code;
      
      // Find user by subscription code in metadata
      const allUsers = await db.select().from(users);
      const user = allUsers.find(u => {
        const metadata = u.metadata as any;
        return metadata?.subscriptionCode === subscriptionCode;
      });

      if (user) {
        await db
          .update(users)
          .set({
            subscriptionPlan: 'free',
            subscriptionStatus: 'cancelled',
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));

        logger.info(`❌ Subscription cancelled for user: ${user.id}`);
      }
    } catch (error) {
      logger.error('❌ Failed to handle subscription disable:', error);
    }
  }

  /**
   * Handle invoice creation webhook
   */
  private static async handleInvoiceCreate(data: any): Promise<void> {
    try {
      logger.info(`📄 Invoice created: ${data.invoice_code}`);
      // TODO: Send invoice notification email
    } catch (error) {
      logger.error('❌ Failed to handle invoice creation:', error);
    }
  }

  /**
   * Handle invoice payment failed webhook
   */
  private static async handleInvoicePaymentFailed(data: any): Promise<void> {
    try {
      logger.info(`❌ Invoice payment failed: ${data.invoice_code}`);
      // TODO: Send payment failure notification
    } catch (error) {
      logger.error('❌ Failed to handle invoice payment failure:', error);
    }
  }

  /**
   * Get available payment channels for South Africa
   */
  static getAvailableChannels(): string[] {
    return [
      'card',         // Credit/Debit cards
      'bank',         // Bank account
      'ussd',         // USSD codes (*737#)
      'qr',          // QR codes
      'mobile_money', // Mobile money (limited in SA)
      'bank_transfer' // EFT/Bank transfer
    ];
  }

  /**
   * Get supported South African banks
   */
  static getSupportedBanks(): Array<{code: string, name: string}> {
    return [
      { code: '044', name: 'Standard Bank' },
      { code: '051', name: 'ABSA Bank' },
      { code: '032', name: 'FNB (First National Bank)' },
      { code: '058', name: 'Nedbank' },
      { code: '462', name: 'Capitec Bank' },
      { code: '050', name: 'Investec' },
      { code: '030', name: 'African Bank' },
      { code: '410', name: 'Discovery Bank' },
      { code: '678', name: 'Tyme Bank' },
      { code: '470', name: 'Access Bank South Africa' }
    ];
  }

  /**
   * Get USSD codes for popular SA banks
   */
  static getUSSDCodes(): Array<{bank: string, code: string, description: string}> {
    return [
      { bank: 'GTBank', code: '*737#', description: 'GTBank USSD Banking' },
      { bank: 'Access Bank', code: '*901#', description: 'Access Bank QuickBanking' },
      { bank: 'Standard Bank', code: '*120*2345#', description: 'Standard Bank USSD' },
      { bank: 'FNB', code: '*120*321#', description: 'FNB Cellphone Banking' },
      { bank: 'ABSA', code: '*120*2272#', description: 'ABSA USSD Banking' }
    ];
  }

  /**
   * Test Paystack connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await this.makePaystackRequest('GET', '/bank');
      return response.status === true;
    } catch (error) {
      logger.error('❌ Paystack connection test failed:', error);
      return false;
    }
  }
}
