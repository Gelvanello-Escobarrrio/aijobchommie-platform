import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">Terms and Conditions</h1>
        <div className="w-8" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d mb-8"
      >
        <div className="space-y-6">
          <section>
            <h3 className="text-xl text-neon-cyan mb-3">Service Description</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              AI Job Chommie is an AI-powered job search platform designed specifically for South African job seekers. 
              We provide intelligent job matching, application assistance, and career development tools.
            </p>
          </section>

          <section>
            <h3 className="text-xl text-neon-pink mb-3">User Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Provide accurate and truthful information in your profile</li>
              <li>Use the platform professionally and respectfully</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Report any suspicious activity or technical issues</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl text-neon-green mb-3">Subscription & Payments</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Basic Plan: R8/month with 3-day free trial</li>
              <li>Premium Plan: R17/month with advanced features</li>
              <li>All payments processed securely through Paystack</li>
              <li>30-day money-back guarantee for new subscribers</li>
              <li>Subscriptions auto-renew unless cancelled</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl text-neon-yellow mb-3">Limitation of Liability</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              While we strive to provide the best service possible, we cannot guarantee job placement success. 
              Our platform facilitates connections between job seekers and employers but does not guarantee employment outcomes.
            </p>
          </section>

          <section>
            <h3 className="text-xl text-neon-purple mb-3">Contact Information</h3>
            <p className="text-gray-300 leading-relaxed">
              For questions about these terms, contact us at:
              <br />Email: legal@aijobchommie.co.za
              <br />Address: Port Elizabeth, Eastern Cape, South Africa
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;

