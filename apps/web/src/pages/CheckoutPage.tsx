import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Crown,
  Loader,
  Lock,
  Shield,
  Star
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  AmbientLighting,
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  MetallicInput,
  MetallicToggle
} from '../components/ui/MetallicComponents';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  badge?: string;
  popular?: boolean;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'professional';
  const billingCycle = searchParams.get('billing') || 'monthly';

  const [isAnnual, setIsAnnual] = useState(billingCycle === 'annual');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const plans: Record<string, PricingPlan> = {
    professional: {
      id: 'professional',
      name: 'Professional',
      description: 'Enhanced features for serious job seekers',
      price: { monthly: 49, annual: 39 },
      features: [
        '25 AI job matches per day',
        'Advanced profile analytics',
        'Priority email & SMS alerts',
        'Application tracking',
        'Resume optimization tips',
        'Interview preparation',
        'Career insights dashboard',
        'Priority support'
      ],
      badge: 'Most Popular',
      popular: true
    },
    premium: {
      id: 'premium',
      name: 'Premium Elite',
      description: 'Complete career acceleration package',
      price: { monthly: 149, annual: 119 },
      features: [
        'Unlimited AI job matches',
        'AI-powered resume writing',
        'Personal career coach',
        'Priority job applications',
        'Salary negotiation guidance',
        'Industry networking events',
        'Skills assessment & training',
        'Direct employer connections',
        'Interview guarantee program',
        '24/7 dedicated support'
      ],
      badge: 'Best Value'
    }
  };

  const selectedPlan = plans[planId];
  const price = isAnnual ? selectedPlan.price.annual : selectedPlan.price.monthly;
  const originalPrice = selectedPlan.price.monthly;
  const savings = isAnnual ? ((originalPrice - selectedPlan.price.annual) / originalPrice * 100).toFixed(0) : 0;

  const provinces = [
    'Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Eastern Cape',
    'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const initializePaystack = () => {
    setLoading(true);

    // Paystack configuration
    const paystackConfig = {
      email: customerInfo.email,
      amount: price * 100, // Convert to kobo (cents)
      currency: 'ZAR',
      ref: `aijc_${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan",
            value: selectedPlan.name
          },
          {
            display_name: "Billing Cycle",
            variable_name: "billing_cycle",
            value: isAnnual ? 'Annual' : 'Monthly'
          }
        ]
      },
      callback: (response: any) => {
        console.log('Payment successful:', response);
        // Verify payment on backend
        verifyPayment(response.reference);
      },
      onClose: () => {
        setLoading(false);
        console.log('Payment cancelled');
      }
    };

    // Initialize Paystack (this would normally use the Paystack SDK)
    // For demo purposes, we'll simulate the payment process
    setTimeout(() => {
      setLoading(false);
      // Simulate successful payment
      navigate('/payment-success?ref=' + paystackConfig.ref);
    }, 2000);
  };

  const verifyPayment = async (reference: string) => {
    try {
      // Call backend to verify payment
      const response = await fetch(`/api/v1/payments/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        navigate('/payment-success?ref=' + reference);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      navigate('/payment-error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !customerInfo[field as keyof typeof customerInfo]);

    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    initializePaystack();
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      <AmbientLighting />

      {/* Header */}
      <section className="section-responsive safe-area-top">
        <div className="responsive-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-8">
              <MetallicButton
                variant="ghost"
                onClick={() => navigate('/pricing')}
                icon={<ArrowLeft />}
              >
                Back to Pricing
              </MetallicButton>

              <div>
                <h1 className="text-3xl font-heading font-bold text-chrome">
                  Secure Checkout
                </h1>
                <p className="text-text-secondary">
                  Complete your subscription to AI Job Chommie
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid-responsive-2 gap-8">

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MetallicCard className="p-8 sticky top-24" glow="medium">
                <h2 className="text-2xl font-heading font-bold mb-6">Order Summary</h2>

                {/* Plan Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center">
                      {selectedPlan.id === 'premium' ? (
                        <Crown className="w-6 h-6 text-void-black" />
                      ) : (
                        <Star className="w-6 h-6 text-void-black" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
                      <p className="text-sm text-text-secondary">{selectedPlan.description}</p>
                    </div>
                  </div>

                  {selectedPlan.badge && (
                    <MetallicBadge variant="tech">{selectedPlan.badge}</MetallicBadge>
                  )}
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center justify-between p-4 bg-glass-chrome rounded-lg mb-6">
                  <span className="font-medium">Billing Cycle</span>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm ${!isAnnual ? 'text-tech-cyan' : 'text-text-tertiary'}`}>
                      Monthly
                    </span>
                    <MetallicToggle
                      checked={isAnnual}
                      onChange={setIsAnnual}
                    />
                    <span className={`text-sm ${isAnnual ? 'text-tech-cyan' : 'text-text-tertiary'}`}>
                      Annual
                    </span>
                    {isAnnual && (
                      <MetallicBadge variant="tech" size="sm">
                        Save {savings}%
                      </MetallicBadge>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>{selectedPlan.name} Plan</span>
                    <span>R{isAnnual ? selectedPlan.price.annual : selectedPlan.price.monthly}</span>
                  </div>

                  {isAnnual && (
                    <div className="flex justify-between text-state-success">
                      <span>Annual Discount</span>
                      <span>-R{selectedPlan.price.monthly - selectedPlan.price.annual}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>VAT (15%)</span>
                    <span>R{(price * 0.15).toFixed(2)}</span>
                  </div>

                  <ChromeSeparator />

                  <div className="flex justify-between text-xl font-bold text-tech-cyan">
                    <span>Total</span>
                    <span>R{(price * 1.15).toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-text-tertiary text-center">
                    Billed {isAnnual ? 'annually' : 'monthly'} • Cancel anytime
                  </div>
                </div>

                {/* Features Preview */}
                <div className="border-t border-border-light pt-6">
                  <h4 className="font-semibold mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-state-success mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                    {selectedPlan.features.length > 4 && (
                      <li className="text-sm text-tech-cyan">
                        +{selectedPlan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-text-tertiary">
                    <Shield className="w-4 h-4" />
                    <span>Secured by Paystack</span>
                  </div>
                </div>
              </MetallicCard>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MetallicCard className="p-8">
                <h2 className="text-2xl font-heading font-bold mb-6">Payment Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>

                    <div className="grid-responsive-2 gap-4 mb-4">
                      <MetallicInput
                        label="First Name"
                        type="text"
                        name="firstName"
                        value={customerInfo.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="John"
                      />

                      <MetallicInput
                        label="Last Name"
                        type="text"
                        name="lastName"
                        value={customerInfo.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Doe"
                      />
                    </div>

                    <div className="grid-responsive-2 gap-4">
                      <MetallicInput
                        label="Email Address"
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        icon={<CreditCard />}
                      />

                      <MetallicInput
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+27 82 123 4567"
                      />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Billing Address</h3>

                    <div className="space-y-4">
                      <MetallicInput
                        label="Street Address"
                        type="text"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                      />

                      <div className="grid-responsive-3 gap-4">
                        <MetallicInput
                          label="City"
                          type="text"
                          name="city"
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          placeholder="Cape Town"
                        />

                        <div>
                          <label className="block text-text-secondary text-sm font-medium mb-2">
                            Province
                          </label>
                          <select
                            name="province"
                            value={customerInfo.province}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all text-text-primary"
                          >
                            <option value="">Select Province</option>
                            {provinces.map((province) => (
                              <option key={province} value={province}>{province}</option>
                            ))}
                          </select>
                        </div>

                        <MetallicInput
                          label="Postal Code"
                          type="text"
                          name="postalCode"
                          value={customerInfo.postalCode}
                          onChange={handleInputChange}
                          placeholder="8001"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

                    <div className="space-y-3 mb-6">
                      <label className="flex items-center p-4 border border-border-light rounded-lg cursor-pointer hover:border-tech-cyan transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3 text-tech-cyan"
                        />
                        <CreditCard className="w-5 h-5 mr-3 text-tech-cyan" />
                        <span>Credit/Debit Card</span>
                        <div className="ml-auto flex space-x-2">
                          <img src="/api/placeholder/30/20" alt="Visa" className="h-5" />
                          <img src="/api/placeholder/30/20" alt="Mastercard" className="h-5" />
                        </div>
                      </label>
                    </div>

                    <div className="p-4 bg-glass-chrome rounded-lg mb-6">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-tech-cyan mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Secure Payment</p>
                          <p className="text-xs text-text-secondary">
                            Your payment information is encrypted and processed securely through Paystack.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <MetallicButton
                    type="submit"
                    variant="tech"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={loading ? <Loader /> : <Lock />}
                    iconPosition="right"
                  >
                    {loading ? 'Processing...' : `Pay R${(price * 1.15).toFixed(2)} Securely`}
                  </MetallicButton>

                  <div className="text-center text-xs text-text-tertiary">
                    By proceeding, you agree to our{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/terms')}
                      className="text-tech-cyan hover:underline"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/privacy')}
                      className="text-tech-cyan hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </div>
                </form>
              </MetallicCard>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <div className="flex items-center justify-center space-x-8 text-text-tertiary text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>POPI Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default CheckoutPage;
