import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Crown, 
  Check, 
  X, 
  Star,
  Zap,
  Shield,
  Smartphone,
  Users,
  TrendingUp,
  Clock,
  Gift,
  Lock,
  Unlock
} from 'lucide-react';
import toast from 'react-hot-toast';

const MobilePayment = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('plans'); // plans, payment, confirmation
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      period: 'Forever',
      color: 'from-gray-500 to-gray-600',
      features: [
        'Curated Job Recommendations',
        'Basic CV Analysis',
        'Application Tracking',
        'Email Notifications',
        'Standard Support'
      ],
      limitations: [
        'No Job Search (Until 10k Users)',
        'Limited AI Insights',
        'No Priority Support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      period: 'per month',
      color: 'from-blue-500 to-purple-600',
      popular: true,
      features: [
        'Everything in Basic',
        'Advanced CV Analysis & Tips',
        'AI-Powered Application Optimization',
        'Interview Preparation Tools',
        'Salary Negotiation Insights',
        'Priority Support',
        'Advanced Analytics Dashboard',
        'Custom Job Alerts'
      ],
      benefits: [
        'First to access Job Search when unlocked',
        '50% More AI Insights',
        'Priority in Features Queue'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 29.99,
      period: 'per month',
      color: 'from-yellow-500 to-orange-600',
      features: [
        'Everything in Premium',
        'Unlimited CV Analysis',
        'Personal Career Coach AI',
        'Company Insider Information',
        'Network Expansion Tools',
        'White-label Solutions',
        'API Access',
        'Dedicated Account Manager'
      ],
      benefits: [
        'Beta Access to New Features',
        'Custom Integrations',
        'Advanced Analytics & Reporting'
      ]
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, popular: true },
    { id: 'paypal', name: 'PayPal', icon: Shield },
    { id: 'apple', name: 'Apple Pay', icon: Smartphone },
    { id: 'google', name: 'Google Pay', icon: Users }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    if (planId === 'basic') {
      handleSubscribe(); // Free plan, skip payment
    }
  };

  const handleSubscribe = async () => {
    const plan = plans.find(p => p.id === selectedPlan);
    
    if (plan.price === 0) {
      // Free plan
      setIsProcessing(true);
      try {
        // API call for free plan
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Welcome to AI JobChommie Basic! 🎉');
        setCurrentStep('confirmation');
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      toast.error('Please fill in all card details');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/v1/payments/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentMethod,
          cardDetails: paymentMethod === 'card' ? cardDetails : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Welcome to AI JobChommie ${plans.find(p => p.id === selectedPlan).name}! 🎉`);
        setCurrentStep('confirmation');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <Crown className="text-yellow-400" size={28} />
            <div>
              <h2 className="text-xl font-bold">Upgrade Your Experience</h2>
              <p className="text-blue-100 text-sm">Choose the perfect plan for you</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {['plans', 'payment', 'confirmation'].map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentStep === step ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {currentStep === 'plans' && (
              <motion.div
                key="plans"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="p-6 space-y-4"
              >
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-bold">${plan.price}</span>
                          <span className="text-gray-500 text-sm">{plan.period}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        {plan.id === 'basic' && <Users className="text-white" size={20} />}
                        {plan.id === 'premium' && <Star className="text-white" size={20} />}
                        {plan.id === 'enterprise' && <Crown className="text-white" size={20} />}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{plan.features.length - 3} more features
                        </p>
                      )}
                    </div>

                    {selectedPlan === plan.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : selectedPlan === 'basic' ? 'Start Free' : 'Continue to Payment'}
                </motion.button>
              </motion.div>
            )}

            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="p-6 space-y-6"
              >
                {/* Selected Plan Summary */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{plans.find(p => p.id === selectedPlan)?.name} Plan</h3>
                      <p className="text-sm text-gray-600">Monthly subscription</p>
                    </div>
                    <div className="text-xl font-bold">
                      ${plans.find(p => p.id === selectedPlan)?.price}/month
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <method.icon size={20} />
                            <span>{method.name}</span>
                            {method.popular && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          {paymentMethod === method.id && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: formatExpiry(e.target.value)})}
                          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </motion.div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep('plans')}
                    className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Subscribe Now'}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check size={40} className="text-green-500" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Welcome Aboard! 🎉</h3>
                  <p className="text-gray-600 mt-2">
                    You're now subscribed to {plans.find(p => p.id === selectedPlan)?.name}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">What's Next?</h4>
                  <ul className="text-sm text-gray-700 space-y-1 text-left">
                    <li>• Complete your profile for better job matches</li>
                    <li>• Upload your CV for AI analysis</li>
                    <li>• Explore premium features in your dashboard</li>
                    <li>• Get notified when job search unlocks at 10k users</li>
                  </ul>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  Start Exploring
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MobilePayment;
