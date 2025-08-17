import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">Privacy Policy</h1>
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
            <h3 className="text-xl text-neon-cyan mb-3">Information We Collect</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              At AI Job Chommie, we collect information necessary to provide our AI-powered job matching service:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Personal Information: Name, email address, phone number, location</li>
              <li>Professional Information: CV/Resume, work experience, skills, education</li>
              <li>Platform Usage: Job searches, applications, profile interactions</li>
              <li>Payment Information: Processed securely through Paystack</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl text-neon-pink mb-3">How We Use Your Information</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Provide AI-powered job matching and recommendations</li>
              <li>Process job applications and facilitate employer connections</li>
              <li>Improve our AI algorithms and platform functionality</li>
              <li>Send relevant job alerts and platform updates</li>
              <li>Provide customer support and account management</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl text-neon-green mb-3">Data Protection & Security</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>256-bit SSL encryption for all data transmission</li>
              <li>Secure cloud infrastructure with regular backups</li>
              <li>POPI Act compliance for South African data protection</li>
              <li>Limited access controls and regular security audits</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl text-neon-yellow mb-3">Contact Us</h3>
            <p className="text-gray-300 leading-relaxed">
              For privacy-related questions or to exercise your data rights, contact us at:
              <br />Email: privacy@aijobchommie.co.za
              <br />Address: Port Elizabeth, Eastern Cape, South Africa
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;

