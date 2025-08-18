/**
 * 💳 ENTERPRISE PAYMENTS MANAGEMENT SYSTEM
 * 
 * World-class payment processing with Paystack integration,
 * subscription management, and comprehensive financial analytics
 * for the South African market - AI Job Chommie Platform
 */

import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthenticatedRequest, authenticateToken } from '../services/authService';
import { supabaseAdmin } from '../config/database';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const router = Router();
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET!;

// AI Job Chommie Subscription Plans (Affordable South African Pricing)
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 8, // R8/month - Affordable for all South Africans
    currency: 'ZAR',
    description: 'Perfect for job seekers starting their career journey',
    features: [
      '✅ Apply to 20 jobs per month',
      '✅ Basic AI job matching',
      '✅ Email job alerts (weekly)',
      '✅ Standard profile visibility',
      '✅ Resume upload and storage',
      '✅ Basic application tracking',
      '✅ South African job market focus',
      '✅ Mobile-friendly interface'
    ],
    limitations: [
      'Limited to 20 applications per month',
      'Weekly job alerts only',
      'Basic support via email'
    ]
  },
  premium: {
    name: 'Premium Plan',
    price: 17, // R17/month - Premium value for serious job seekers
    currency: 'ZAR',
    description: 'Advanced features for serious job seekers who want the best opportunities',
    features: [
      '🚀 Unlimited job applications',
      '🤖 Advanced AI job recommendations',
      '⚡ Real-time job alerts (instant notifications)',
      '⭐ Premium profile visibility (2x more views)',
      '📄 AI-powered resume optimization',
      '🎯 Personalized career insights',
      '📊 Advanced application analytics',
      '💬 Priority customer support (WhatsApp & Email)',
      '🔍 Advanced job search filters',
      '📱 Mobile app priority features',
      '🎓 Interview preparation resources',
      '💼 Skills gap analysis and recommendations'
    ],
    savings: 'Save time and get hired faster with premium features'
  }
};

/**
 * @route   GET /api/v1/payments/plans
 * @desc    Get available subscription plans with South African pricing
 * @access  Public
 */
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    message: 'AI Job Chommie subscription plans - Designed for South African job seekers',
    data: {
      plans: SUBSCRIPTION_PLANS,
      currency: 'ZAR',
      region: 'South Africa',
      market_focus: 'Entry-level and professional opportunities across all 9 provinces',
      payment_info: {
        methods: ['Credit Card', 'Debit Card', 'EFT', 'Mobile Money via Paystack'],
        security: 'PCI DSS compliant with Paystack',
        billing: 'Monthly subscription, cancel anytime',
        trial: 'Free plan available with limited features'
      },
      company_plans: {
        status: 'under_construction',
        message: 'Employer job posting plans coming soon! Contact support for early access.',
        expected_features: [
          'Job posting and management',
          'Candidate screening tools',
          'Applicant tracking system',
          'Company branding options'
        ]
      },
      value_proposition: {
        basic: 'Less than the cost of 1 taxi fare per month for better job opportunities',
        premium: 'Less than R1 per day for unlimited access to South Africa\'s best jobs'
      }
    }
  });
});

/**
 * @route   POST /api/v1/payments/initialize
 * @desc    Initialize Paystack payment for subscription upgrade
 * @access  Private
 */
router.post('/initialize', [
  authenticateToken,
  body('plan').isIn(['basic', 'premium']).withMessage('Invalid subscription plan - only basic (R8) and premium (R17) available'),
  body('billingCycle').optional().isIn(['monthly']).withMessage('Only monthly billing available currently')
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
    }

    const userId = req.user!.id;
    const { plan } = req.body;
    
    // Get user profile
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('email, first_name, last_name, subscription_plan')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    // Check if user is already on this plan
    if (userProfile.subscription_plan === plan) {
      return res.status(400).json({
        success: false,
        error: 'Already subscribed',
        message: `You are already on the ${SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS].name}`
      });
    }

    const selectedPlan = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    const amount = selectedPlan.price;
    
    // Initialize Paystack transaction
    const paystackData = {
      email: userProfile.email,
      amount: amount * 100, // Paystack expects amount in kobo (cents)
      currency: 'ZAR',
      reference: `ajc_${plan}_${userId}_${Date.now()}`,
      callback_url: `${process.env.WEB_URL || 'http://localhost:3000'}/payment/success`,
      channels: ['card', 'bank', 'ussd', 'mobile_money'],
      metadata: {
        user_id: userId,
        plan: plan,
        billing_cycle: 'monthly',
        platform: 'AI Job Chommie',
        custom_fields: [
          {
            display_name: 'Subscription Plan',
            variable_name: 'subscription_plan',
            value: selectedPlan.name
          },
          {
            display_name: 'User Name',
            variable_name: 'user_name',
            value: `${userProfile.first_name} ${userProfile.last_name}`
          }
        ]
      }
    };

    const response = await axios.post('https://api.paystack.co/transaction/initialize', paystackData, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data.status) {
      throw new Error(response.data.message || 'Payment initialization failed');
    }

    // Store payment record
    const paymentRecord = {
      id: uuidv4(),
      user_id: userId,
      amount: amount,
      currency: 'ZAR',
      status: 'pending',
      paystack_reference: paystackData.reference,
      description: `${selectedPlan.name} subscription upgrade - Monthly billing`,
      created_at: new Date().toISOString()
    };

    await supabaseAdmin.from('payments').insert(paymentRecord);

    logger.info('Payment initialized successfully', {
      userId,
      plan,
      amount,
      reference: paystackData.reference,
      userEmail: userProfile.email
    });

    res.json({
      success: true,
      message: `Payment initialized for ${selectedPlan.name} upgrade`,
      data: {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference,
        plan: {
          name: selectedPlan.name,
          price: selectedPlan.price,
          currency: 'ZAR',
          features: selectedPlan.features
        },
        payment_info: {
          amount: amount,
          currency: 'ZAR',
          billing: 'Monthly',
          next_billing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        instructions: [
          '1. Click the authorization_url to complete payment',
          '2. Choose your preferred payment method (card, bank, mobile money)',
          '3. Complete the secure payment process',
          '4. Your account will be upgraded immediately after successful payment'
        ]
      }
    });

  } catch (error: any) {
    logger.error('Payment initialization failed', {
      error: error.message,
      userId: req.user?.id,
      plan: req.body.plan
    });

    res.status(500).json({
      success: false,
      error: 'Payment initialization failed',
      message: 'Unable to process payment request. Please try again or contact support.'
    });
  }
});

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Handle Paystack webhooks for payment processing
 * @access  Public (but validated with webhook signature)
 */
router.post('/webhook', async (req, res) => {
  try {
    // Verify Paystack signature
    const hash = crypto.createHmac('sha512', PAYSTACK_WEBHOOK_SECRET || 'fallback-secret')
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      logger.warn('Invalid webhook signature', {
        received: req.headers['x-paystack-signature'],
        expected: hash.substring(0, 10) + '...'
      });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    logger.info('Webhook received', { event: event.event, reference: event.data?.reference });
    
    if (event.event === 'charge.success') {
      const { reference, amount, currency, customer } = event.data;
      const metadata = event.data.metadata;

      // Update payment record
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          paystack_transaction_id: event.data.id,
          updated_at: new Date().toISOString()
        })
        .eq('paystack_reference', reference);

      if (paymentError) {
        logger.error('Failed to update payment record', { error: paymentError.message, reference });
      }

      // Upgrade user subscription
      if (metadata.user_id && metadata.plan) {
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // Monthly billing

        const { error: subscriptionError } = await supabaseAdmin
          .from('user_profiles')
          .update({
            subscription_plan: metadata.plan,
            subscription_end_date: subscriptionEndDate.toISOString(),
            paystack_customer_id: customer.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', metadata.user_id);

        if (subscriptionError) {
          logger.error('Failed to update user subscription', {
            error: subscriptionError.message,
            userId: metadata.user_id,
            reference
          });
        } else {
          logger.info('Subscription activated successfully', {
            userId: metadata.user_id,
            plan: metadata.plan,
            reference,
            amount: amount / 100, // Convert back from kobo
            nextBilling: subscriptionEndDate.toISOString().split('T')[0]
          });
        }
      }
    }

    // Handle failed payments
    if (event.event === 'charge.failed') {
      const { reference } = event.data;
      
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('paystack_reference', reference);

      logger.info('Payment failed', { reference });
    }

    res.json({ received: true, event: event.event });

  } catch (error: any) {
    logger.error('Webhook processing failed', { error: error.message });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * @route   GET /api/v1/payments/history
 * @desc    Get user's payment history and subscription status
 * @access  Private
 */
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get payment history
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Get current subscription info
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('subscription_plan, subscription_end_date, paystack_customer_id')
      .eq('id', userId)
      .single();

    // Calculate analytics
    const analytics = {
      totalSpent: payments?.reduce((sum, payment) => {
        return payment.status === 'completed' ? sum + Number(payment.amount) : sum;
      }, 0) || 0,
      totalTransactions: payments?.length || 0,
      successfulPayments: payments?.filter(p => p.status === 'completed').length || 0,
      currentPlan: userProfile?.subscription_plan || 'free',
      subscriptionActive: userProfile?.subscription_end_date ? 
        new Date(userProfile.subscription_end_date) > new Date() : false,
      nextBilling: userProfile?.subscription_end_date || null
    };

    res.json({
      success: true,
      message: 'Payment history and subscription status retrieved successfully',
      data: {
        payments: payments || [],
        subscription: {
          current_plan: analytics.currentPlan,
          is_active: analytics.subscriptionActive,
          next_billing_date: analytics.nextBilling,
          features: analytics.currentPlan !== 'free' ? 
            SUBSCRIPTION_PLANS[analytics.currentPlan as keyof typeof SUBSCRIPTION_PLANS]?.features || [] 
            : ['Limited job applications', 'Basic job alerts']
        },
        analytics,
        available_upgrades: analytics.currentPlan === 'free' ? ['basic', 'premium'] :
                           analytics.currentPlan === 'basic' ? ['premium'] : []
      }
    });

  } catch (error: any) {
    logger.error('Failed to retrieve payment history', {
      error: error.message,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payment history',
      message: 'Unable to fetch payment information. Please try again.'
    });
  }
});

/**
 * @route   POST /api/v1/payments/cancel-subscription
 * @desc    Cancel user subscription (downgrade to free)
 * @access  Private
 */
router.post('/cancel-subscription', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Update user to free plan
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_plan: 'free',
        subscription_end_date: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    logger.info('Subscription cancelled', { userId });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: {
        new_plan: 'free',
        message: 'You have been downgraded to the free plan. You can upgrade again anytime.',
        free_plan_features: [
          'Browse available jobs',
          'Apply to limited jobs per month',
          'Basic job alerts'
        ]
      }
    });

  } catch (error: any) {
    logger.error('Failed to cancel subscription', {
      error: error.message,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription',
      message: 'Unable to process cancellation. Please contact support.'
    });
  }
});

export default router;
