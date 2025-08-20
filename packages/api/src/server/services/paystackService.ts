import axios from 'axios';
import { db } from '../../config/database';
import { payments, users } from '../../models/schema';
import { eq } from 'drizzle-orm';
import winston from 'winston';
import crypto from 'crypto';

const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

const PAYSTACK_CONFIG = {
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
  baseUrl: 'https://api.paystack.co',
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || ''
};

export const SUBSCRIPTION_PLANS = {
  basic: { name: 'Basic Plan', price: 800, currency: 'ZAR', interval: 'monthly' },
  premium: { name: 'Premium Plan', price: 1700, currency: 'ZAR', interval: 'monthly' }
};

export class PaystackService {
  static async initializePayment({ email, amount, currency = 'ZAR', plan, userId, metadata = {} }: any) {
    try {
      const reference = this.generateReference();
      const paymentData = {
        email,
        amount: Math.round(amount * 100),
        currency,
        reference,
        callback_url: `${process.env.PAYMENT_SUCCESS_URL || 'http://localhost:3000/payment/success'}?reference=${reference}`,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: { userId, plan, ...metadata }
      };

      const response = await this.makePaystackRequest('POST', '/transaction/initialize', paymentData);

      if (response.status && response.data) {
        await this.createPaymentRecord({ userId, amount, currency, reference, status: 'pending', subscriptionPlan: plan, metadata: paymentData.metadata });
        return { authorizationUrl: response.data.authorization_url, accessCode: response.data.access_code, reference };
      }
      throw new Error('Payment initialization failed');
    } catch (error: any) {
      logger.error('Payment initialization failed:', error);
      throw error;
    }
  }

  static async verifyPayment(reference: string) {
    try {
      const response = await this.makePaystackRequest('GET', `/transaction/verify/${reference}`);
      if (response.status && response.data) {
        const transaction = response.data;
        const verification = {
          status: transaction.status === 'success' ? 'success' : 'failed',
          reference: transaction.reference,
          amount: transaction.amount / 100,
          currency: transaction.currency,
          paidAt: transaction.paid_at ? new Date(transaction.paid_at) : undefined,
          channel: transaction.channel,
          fees: transaction.fees ? transaction.fees / 100 : undefined,
          authorization: transaction.authorization
        };

        await this.updatePaymentRecord(reference, { status: verification.status, paidAt: verification.paidAt, paystackTransactionId: transaction.id.toString(), metadata: { channel: verification.channel, fees: verification.fees, authorization: verification.authorization, gateway_response: transaction.gateway_response } });

        if (verification.status === 'success') await this.handleSuccessfulPayment(transaction);

        return verification;
      }
      throw new Error('Payment verification failed');
    } catch (error: any) {
      logger.error('Payment verification failed:', error);
      throw error;
    }
  }

  private static async makePaystackRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any) {
    try {
      const config = { method, url: `${PAYSTACK_CONFIG.baseUrl}${endpoint}`, headers: { Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`, 'Content-Type': 'application/json' }, data };
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        logger.error('Paystack API Error:', error.response.data);
        throw new Error(error.response.data.message || 'Paystack API error');
      }
      throw error;
    }
  }

  private static generateReference(): string { return `AIJC_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`.toUpperCase(); }

  private static async createPaymentRecord(paymentData: any) {
    try {
      await db.insert(payments).values({ userId: paymentData.userId, amount: paymentData.amount.toString(), currency: paymentData.currency, status: paymentData.status, paystackReference: paymentData.reference, subscriptionPlan: paymentData.subscriptionPlan, description: paymentData.subscriptionPlan ? `Subscription: ${paymentData.subscriptionPlan}` : 'One-time payment', metadata: paymentData.metadata });
    } catch (error) { logger.error('Failed to create payment record:', error); }
  }

  private static async updatePaymentRecord(reference: string, updates: any) {
    try {
      await db.update(payments).set({ status: updates.status, paidAt: updates.paidAt, paystackTransactionId: updates.paystackTransactionId, metadata: updates.metadata, updatedAt: new Date() }).where(eq(payments.paystackReference, reference));
    } catch (error) { logger.error('Failed to update payment record:', error); }
  }

  private static async handleSuccessfulPayment(transaction: any) {
    try {
      const metadata = transaction.metadata;
      const userId = metadata?.userId || metadata?.user_id;
      const plan = metadata?.plan;
      if (userId && plan && plan !== 'one-time') {
        await db.update(users).set({ subscriptionPlan: plan, subscriptionStatus: 'active', updatedAt: new Date() }).where(eq(users.id, userId));
      }
    } catch (error) { logger.error('Failed to handle successful payment:', error); }
  }

  static verifyWebhookSignature(payload: any, signature: string): boolean {
    if (!PAYSTACK_CONFIG.webhookSecret) return true;
    const hash = crypto.createHmac('sha512', PAYSTACK_CONFIG.webhookSecret).update(JSON.stringify(payload)).digest('hex');
    return hash === signature;
  }
}
