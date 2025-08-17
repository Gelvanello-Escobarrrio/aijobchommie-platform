import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ParticleSystem from '../components/ParticleSystem';
import GeometricBackground from '../components/GeometricBackground';

const RefundPage = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div>
      {/* Background Effects */}
      <GeometricBackground />
      <ParticleSystem />
      
      {/* Cinematic Lighting */}
      <div className="spotlight-container">
        <div className="main-spotlight" style={{ left: '30%', top: '20%' }}></div>
        <div className="secondary-spotlight" style={{ left: '70%', top: '60%', animationDelay: '-3s' }}></div>
      </div>
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '60vh', paddingTop: '120px' }}>
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <h1 style={{ marginBottom: '30px' }}>
              <span className="text-gradient">Refund Policy</span>
            </h1>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '20px', maxWidth: '800px', margin: '0 auto 20px' }}>
              Fair and transparent refund terms designed to protect your investment while 
              supporting our mission to help South Africans find meaningful employment.
            </p>
            <div style={{ padding: 'var(--space-md)', background: 'rgba(0, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', maxWidth: '600px', margin: '0 auto' }}>
              <p style={{ color: 'var(--primary-cyan)', fontWeight: '600', margin: 0 }}>
                💰 30-Day Money-Back Guarantee | Last Updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '900px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))' }}>
            <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Refund Overview</h2>
            <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
              <div>
                <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>What's Refundable</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>✅</span>
                    Monthly subscription fees (within 30 days)
                  </li>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>✅</span>
                    Unused portion of current billing period
                  </li>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>✅</span>
                    Accidental duplicate payments
                  </li>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>✅</span>
                    Technical issues preventing service use
                  </li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Simple Process</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>1.</span>
                    Contact us within 30 days of payment
                  </li>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>2.</span>
                    Provide your account details and reason
                  </li>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>3.</span>
                    We review and process within 5-7 business days
                  </li>
                  <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>4.</span>
                    Refund appears in your account within 10 days
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Refund Policy */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="legal-document" style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            {/* Introduction */}
            <div className="card" style={{ marginBottom: 'var(--space-4xl)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>1. Refund Policy Overview</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                At AI Job Chommie, we're confident in the value our AI-powered job matching platform provides to South African job seekers. 
                However, we understand that circumstances may require a refund, and we've designed our refund policy to be fair, 
                transparent, and compliant with South African consumer protection laws.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                This Refund Policy forms part of our Terms of Service and applies to all subscription payments made for 
                AI Job Chommie services. By subscribing to our service, you agree to the terms outlined in this policy.
              </p>
              <div style={{ padding: 'var(--space-lg)', background: 'rgba(157, 0, 255, 0.1)', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent-violet)' }}>
                <h4 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Consumer Protection Compliance</h4>
                <ul style={{ marginBottom: 0 }}>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Fully compliant with South African Consumer Protection Act</li>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Respects cooling-off period rights for distance sales</li>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Clear terms with no hidden conditions</li>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Fair processing timelines with regular updates</li>
                </ul>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="card" style={{ marginBottom: 'var(--space-4xl)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>2. Refund Eligibility Criteria</h2>
              
              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>2.1 30-Day Money-Back Guarantee</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                We offer a comprehensive 30-day money-back guarantee for all new subscribers to both our Basic (R8/month) 
                and Premium (R17/month) plans. This guarantee begins from the date of your first paid subscription, 
                not including the free trial period.
              </p>
              
              <div className="grid grid-2" style={{ gap: 'var(--space-4xl)', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <h4 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>Eligible for Full Refund</h4>
                  <ul style={{ fontSize: '0.95rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Dissatisfaction with Service:</strong> If our platform doesn't meet your expectations</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Technical Issues:</strong> Persistent technical problems preventing normal use</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Service Unavailability:</strong> If our service is unavailable for more than 48 hours</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Billing Errors:</strong> Incorrect charges or duplicate payments</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Accidental Subscription:</strong> Unintended subscription activation</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Prorated Refunds</h4>
                  <ul style={{ fontSize: '0.95rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Plan Downgrades:</strong> Refund difference for unused premium features</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Early Cancellation:</strong> Unused portion of current billing cycle</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Service Disruption:</strong> Compensation for significant outages</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Feature Limitations:</strong> If advertised features become unavailable</li>
                  </ul>
                </div>
              </div>

              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>2.2 Conditions and Limitations</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                While we aim to accommodate reasonable refund requests, certain conditions apply:
              </p>
              <ul style={{ marginBottom: 'var(--space-lg)' }}>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Time Limit:</strong> Refund requests must be made within 30 days of the original payment</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Account in Good Standing:</strong> No violations of our Terms of Service</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Reasonable Use:</strong> No excessive or abusive use of platform resources</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Valid Reason:</strong> Genuine reason for dissatisfaction (not buyer's remorse only)</li>
              </ul>

              <div style={{ padding: 'var(--space-lg)', background: 'rgba(255, 0, 255, 0.1)', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary-magenta)' }}>
                <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Free Trial Clarification</h4>
                <p style={{ margin: 0 }}>
                  Our 3-day free trial allows you to test our service before any payment. The 30-day refund period 
                  begins after the free trial ends and your first payment is processed. This ensures you have 
                  adequate time to evaluate our platform's value.
                </p>
              </div>
            </div>

            {/* Refund Process */}
            <div className="card" style={{ marginBottom: 'var(--space-4xl)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>3. Refund Request Process</h2>
              
              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>3.1 How to Request a Refund</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                We've made requesting a refund as simple as possible. You can initiate a refund request through multiple channels:
              </p>

              <div className="grid grid-2" style={{ gap: 'var(--space-4xl)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ padding: 'var(--space-lg)', background: 'rgba(0, 255, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>📧 Email Request (Recommended)</h4>
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Email:</strong> refunds@aijobchommie.co.za</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Response Time:</strong> Within 24 hours</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Processing Time:</strong> 5-7 business days</p>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Email requests receive priority handling and provide a clear paper trail for your refund.
                  </p>
                </div>
                <div style={{ padding: 'var(--space-lg)', background: 'rgba(255, 0, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>💬 Support Channels</h4>
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Live Chat:</strong> Available in your account dashboard</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>WhatsApp:</strong> Premium users only</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Contact Form:</strong> Available at aijobchommie.co.za/contact</p>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Our support team can guide you through the refund process and answer any questions.
                  </p>
                </div>
              </div>

              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>3.2 Required Information</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                To process your refund quickly, please include the following information in your request:
              </p>
              <div className="grid grid-2" style={{ gap: 'var(--space-4xl)', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <h4 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Account Details</h4>
                  <ul>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Full name on the account</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Email address associated with your account</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Last 4 digits of payment method used</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Approximate date of payment</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Subscription plan (Basic or Premium)</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Refund Details</h4>
                  <ul>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Reason for requesting refund</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Preferred refund method</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Any relevant screenshots or documentation</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Feedback on how we can improve</li>
                  </ul>
                </div>
              </div>

              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>3.3 Processing Timeline</h3>
              <div style={{ padding: 'var(--space-lg)', background: 'rgba(0, 255, 65, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', border: '2px solid var(--accent-lime)' }}>
                <h4 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Step-by-Step Process</h4>
                <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
                  <div>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>Days 1-2: Initial Review</strong></p>
                    <ul style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                      <li>Request acknowledgment within 24 hours</li>
                      <li>Verification of account and payment details</li>
                      <li>Initial assessment of refund eligibility</li>
                    </ul>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>Days 3-5: Decision and Processing</strong></p>
                    <ul style={{ fontSize: '0.9rem' }}>
                      <li>Final refund decision communicated</li>
                      <li>If approved, refund initiated with payment processor</li>
                      <li>Refund confirmation details sent to you</li>
                    </ul>
                  </div>
                  <div>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>Days 6-7: Account Updates</strong></p>
                    <ul style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                      <li>Subscription cancelled or adjusted as appropriate</li>
                      <li>Account access modified based on refund terms</li>
                      <li>Final confirmation email sent</li>
                    </ul>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>Days 8-15: Payment Arrival</strong></p>
                    <ul style={{ fontSize: '0.9rem' }}>
                      <li>Refund appears in your payment method</li>
                      <li>Timing depends on your bank/payment provider</li>
                      <li>We provide tracking reference for follow-up</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Methods */}
            <div className="card" style={{ marginBottom: 'var(--space-4xl)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>4. Refund Methods and Timing</h2>
              
              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>4.1 Available Refund Methods</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                All refunds are processed through Paystack, our secure South African payment gateway. 
                The refund method will typically match your original payment method:
              </p>
              
              <div className="grid grid-3" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(0, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>💳</div>
                  <h4 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-sm)' }}>Credit/Debit Cards</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>Refunded to original card</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>3-7 business days</p>
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 0, 255, 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🏦</div>
                  <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-sm)' }}>EFT/Bank Transfer</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>Direct bank deposit</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1-3 business days</p>
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(0, 255, 65, 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>💰</div>
                  <h4 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-sm)' }}>Alternative Methods</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>Account credit/Other</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>By arrangement</p>
                </div>
              </div>

              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>4.2 Refund Processing Times</h3>
              <div style={{ padding: 'var(--space-lg)', background: 'rgba(157, 0, 255, 0.1)', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent-violet)' }}>
                <h4 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Timeline Factors</h4>
                <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
                  <div>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>Our Processing:</strong> 5-7 business days</p>
                    <ul style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                      <li>Request review and approval</li>
                      <li>Verification of account details</li>
                      <li>Initiation with payment processor</li>
                      <li>Confirmation and documentation</li>
                    </ul>
                  </div>
                  <div>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>Bank/Payment Provider:</strong> 3-10 business days</p>
                    <ul style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                      <li>Payment processor handling time</li>
                      <li>Bank processing schedules</li>
                      <li>International payment delays (if applicable)</li>
                      <li>Weekend and public holiday considerations</li>
                    </ul>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
                  <strong>Note:</strong> During South African public holidays or bank processing delays, 
                  refunds may take an additional 2-3 business days. We'll keep you informed of any delays.
                </p>
              </div>
            </div>

            {/* Special Circumstances */}
            <div className="card" style={{ marginBottom: 'var(--space-4xl)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>5. Special Circumstances and Exceptions</h2>
              
              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>5.1 Partial Refunds</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                In certain situations, partial refunds may be appropriate rather than full refunds:
              </p>
              <ul style={{ marginBottom: 'var(--space-lg)' }}>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Service Interruptions:</strong> Prorated refund for days of service unavailability</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Plan Downgrades:</strong> Difference refunded when switching from Premium to Basic mid-cycle</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Feature Limitations:</strong> Partial refund if key advertised features become unavailable</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Usage-Based Adjustments:</strong> Fair calculation based on actual platform usage</li>
              </ul>

              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>5.2 Non-Refundable Situations</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                While we strive to accommodate reasonable requests, certain circumstances may not qualify for refunds:
              </p>
              
              <div className="grid grid-2" style={{ gap: 'var(--space-4xl)', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <h4 style={{ color: 'var(--accent-amber)', marginBottom: 'var(--space-md)' }}>Policy Violations</h4>
                  <ul style={{ fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Account suspension for Terms of Service violations</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Fraudulent or abusive use of the platform</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Sharing account credentials with unauthorized users</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Attempt to game or manipulate our AI systems</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent-amber)', marginBottom: 'var(--space-md)' }}>Time Limitations</h4>
                  <ul style={{ fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Refund requests made after 30-day window</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Subscriptions active for more than 3 billing cycles</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Accounts with previous refund history (abuse prevention)</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Promotional pricing or discount subscriptions</li>
                  </ul>
                </div>
              </div>

              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>5.3 Dispute Resolution</h3>
              <div style={{ padding: 'var(--space-lg)', background: 'rgba(255, 0, 255, 0.1)', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary-magenta)' }}>
                <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>If Your Refund Request is Denied</h4>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  If we cannot approve your refund request, we will provide a clear explanation of our decision. 
                  You have the right to escalate the matter through these channels:
                </p>
                <ul style={{ marginBottom: 'var(--space-md)' }}>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Request a supervisory review by emailing: manager@aijobchommie.co.za</li>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Contact our founder directly for complex cases: founder@aijobchommie.co.za</li>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Lodge a complaint with South African consumer protection authorities</li>
                  <li style={{ marginBottom: 'var(--space-sm)' }}>Pursue resolution through your bank's chargeback process</li>
                </ul>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  We're committed to fair resolution and will work with you to find a mutually acceptable solution.
                </p>
              </div>
            </div>

            {/* Account Impact */}
            <div className="card" style={{ marginBottom: 'var(--space-4xl)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>6. Account Access After Refund</h2>
              
              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>6.1 Immediate Effects</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                When a refund is approved and processed, certain changes to your account access will take effect:
              </p>
              
              <div className="grid grid-2" style={{ gap: 'var(--space-4xl)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ padding: 'var(--space-lg)', background: 'rgba(0, 255, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>Full Refund Impact</h4>
                  <ul style={{ fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Immediate termination of paid subscription features</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Profile becomes invisible to employers</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>No access to premium AI matching or analytics</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Loss of priority support access</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Account data preserved for 30 days for reactivation</li>
                  </ul>
                </div>
                <div style={{ padding: 'var(--space-lg)', background: 'rgba(255, 0, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Partial Refund Impact</h4>
                  <ul style={{ fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Subscription continues with adjusted benefits</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Access maintained to paid features you've retained</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Profile remains active and visible</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>No interruption to ongoing job applications</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Continued customer support access</li>
                  </ul>
                </div>
              </div>

              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>6.2 Data and Reactivation</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                We understand that circumstances change, and you may want to return to our platform in the future:
              </p>
              <ul style={{ marginBottom: 'var(--space-lg)' }}>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Data Preservation:</strong> Your profile and application history preserved for 30 days</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Easy Reactivation:</strong> Simple resubscription process with all data restored</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>No Penalty:</strong> Previous refund doesn't affect future subscription eligibility</li>
                <li style={{ marginBottom: 'var(--space-sm)' }}><strong>Fresh Trial:</strong> May be eligible for another trial period after 6 months</li>
              </ul>

              <div style={{ padding: 'var(--space-lg)', background: 'rgba(0, 255, 65, 0.1)', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent-lime)' }}>
                <h4 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Data Export Option</h4>
                <p style={{ margin: 0 }}>
                  Before your refund is processed, you can request an export of your profile data, 
                  application history, and career insights. This ensures you don't lose valuable 
                  information about your job search progress and can import it if you return to the platform.
                </p>
              </div>
            </div>

            {/* Consumer Rights */}
            <div className="card" style={{ marginBottom: 'var(--space-4xl)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>7. Your Consumer Rights</h2>
              
              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>7.1 South African Consumer Protection</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                As a South African consumer, you have specific rights under the Consumer Protection Act that 
                complement our refund policy:
              </p>
              
              <div className="grid grid-2" style={{ gap: 'var(--space-4xl)', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <h4 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Cooling-Off Period</h4>
                  <ul style={{ fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>5-day cooling-off period for distance sales</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Right to cancel without penalty or reason</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Full refund if cancelled during cooling-off period</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Written notice requirement to exercise right</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Service Quality Rights</h4>
                  <ul style={{ fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Right to services performed with reasonable skill</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Reasonable time and manner of performance</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Remedy if service doesn't meet quality standards</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Protection against unfair contract terms</li>
                  </ul>
                </div>
              </div>

              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>7.2 External Complaint Procedures</h3>
              <div style={{ padding: 'var(--space-lg)', background: 'rgba(157, 0, 255, 0.1)', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent-violet)' }}>
                <h4 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>If Internal Resolution Fails</h4>
                <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
                  <div>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>Consumer Goods and Services Ombud</strong></p>
                    <ul style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                      <li>Free dispute resolution service</li>
                      <li>Independent mediation and arbitration</li>
                      <li>Binding decisions on consumer complaints</li>
                      <li>Contact: consumer@thecgso.org.za</li>
                    </ul>
                  </div>
                  <div>
                    <p style={{ marginBottom: 'var(--space-md)' }}><strong>National Consumer Commission</strong></p>
                    <ul style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                      <li>Regulatory oversight and enforcement</li>
                      <li>Investigation of consumer complaints</li>
                      <li>Legal action against non-compliant businesses</li>
                      <li>Contact: complaints-ncc@thedtic.gov.za</li>
                    </ul>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  We encourage you to contact us first for faster resolution, but you have the right 
                  to escalate to these external bodies if needed.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))', border: '2px solid var(--primary-cyan)' }}>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)' }}>8. Refund Support Contact</h2>
              
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                Our refund support team is here to help you through every step of the process. 
                We're committed to fair, fast, and friendly resolution of all refund requests.
              </p>

              <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
                <div>
                  <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Refund Team</h3>
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Primary Email:</strong> refunds@aijobchommie.co.za</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Response Time:</strong> Within 24 hours</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Processing Time:</strong> 5-7 business days</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Business Hours:</strong> Monday - Friday, 08:00 - 17:00 SAST</p>
                  </div>
                  
                  <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Escalation Contacts</h3>
                  <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Manager Review:</strong> manager@aijobchommie.co.za</p>
                  <p style={{ marginBottom: 'var(--space-sm)' }}><strong>Founder Direct:</strong> founder@aijobchommie.co.za</p>
                  <p style={{ marginBottom: 'var(--space-sm)' }}><strong>General Support:</strong> admin@aijobchommie.co.za</p>
                </div>
                <div>
                  <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Company Information</h3>
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <p style={{ marginBottom: 'var(--space-sm)' }}><strong>AI Job Chommie (Pty) Ltd</strong></p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}>Registration: [Company Registration Number]</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}>Address: Port Elizabeth, Eastern Cape, South Africa</p>
                    <p style={{ marginBottom: 'var(--space-sm)' }}>VAT Number: [VAT Registration Number]</p>
                  </div>
                  
                  <h3 style={{ color: 'var(--accent-amber)', marginBottom: 'var(--space-md)' }}>Payment Processor</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    All payments and refunds are processed through <strong>Paystack (South Africa)</strong>, 
                    ensuring secure and compliant financial transactions. For payment-specific inquiries, 
                    you may also contact Paystack support directly.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))' }}>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Need a Refund?</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
              We're here to help process your refund quickly and fairly
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:refunds@aijobchommie.co.za" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                💰 Request Refund
              </a>
              <Link to="/contact" className="btn btn-secondary" style={{ fontSize: '1rem' }}>
                💬 General Support
              </Link>
            </div>
            <p style={{ fontSize: '0.9rem', marginTop: 'var(--space-md)', color: 'var(--text-secondary)' }}>
              🕐 24-hour response time • 💯 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPage;

