/**
 * 🔒 COMPREHENSIVE PRIVACY POLICY PAGE
 * 
 * Detailed privacy policy for AI Job Chommie
 * Fully compliant with POPIA, GDPR, and South African privacy laws
 */

import React, { useState } from 'react';
import { Lock, Shield, Eye, FileText, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Database, UserCheck, Globe, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet';

const PrivacyPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Privacy Policy | AI Job Chommie - POPIA Compliant Data Protection</title>
        <meta name="description" content="Comprehensive Privacy Policy for AI Job Chommie. Learn how we protect your personal information in compliance with POPIA and international privacy standards." />
        <meta name="keywords" content="privacy policy, POPIA, data protection, AI Job Chommie, personal information, South Africa" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-8">
              <Lock className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl text-green-100 mb-4">
              Your privacy is our priority - comprehensive protection and transparency
            </p>
            <p className="text-lg text-green-200 max-w-4xl mx-auto">
              We are committed to protecting your personal information and respecting your privacy rights. 
              This policy explains how we collect, use, store, and protect your data in full compliance with 
              South African and international privacy laws.
            </p>
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">POPIA Compliant</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <Globe className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">GDPR Ready</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Storage</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <UserCheck className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">User Control</p>
              </div>
            </div>
            <div className="mt-6 text-sm text-green-200">
              <p>Last updated: January 2024 | Effective from: 1 January 2024</p>
              <p>Version 3.0 | Next review: March 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* POPIA Compliance Notice */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3">POPIA Compliance Statement</h3>
                <div className="text-blue-800 space-y-2">
                  <p className="font-medium">
                    AI Job Chommie (Pty) Ltd is fully compliant with the Protection of Personal Information Act (POPIA) of South Africa, 
                    as well as international privacy standards including GDPR principles.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-100 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Our Commitments</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Lawful processing of personal information</li>
                        <li>• Transparent data collection practices</li>
                        <li>• Secure storage and transmission</li>
                        <li>• Respect for your privacy rights</li>
                        <li>• Regular compliance audits</li>
                      </ul>
                    </div>
                    <div className="bg-green-100 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Your Rights</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Access to your personal information</li>
                        <li>• Correction of inaccurate data</li>
                        <li>• Deletion of personal information</li>
                        <li>• Objection to processing</li>
                        <li>• Data portability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="space-y-6">
          
          {/* Section 1: Overview */}
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('overview')}
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Privacy Overview & Scope</h2>
              </div>
              {isExpanded('overview') ? <ChevronUp className="h-6 w-6 text-gray-500" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}
            </button>
            
            {isExpanded('overview') && (
              <div className="px-8 pb-8 border-t border-gray-100">
                <div className="prose max-w-none text-gray-700 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">1.1 Our Privacy Philosophy</h3>
                  <p>
                    At AI Job Chommie, we believe that privacy is a fundamental human right. We are committed to being transparent 
                    about how we collect, use, and protect your personal information. This Privacy Policy explains our practices 
                    in clear, understandable language.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900">1.2 Scope of This Policy</h3>
                  <p>This Privacy Policy applies to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All users of the AI Job Chommie platform (website, mobile apps, APIs)</li>
                    <li>Job seekers, employers, and visitors</li>
                    <li>Personal information collected through our services</li>
                    <li>Third-party integrations and partner services</li>
                    <li>Communication channels and customer support</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900">1.3 Legal Framework</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Applicable Laws and Regulations</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p><strong>Primary:</strong> Protection of Personal Information Act (POPIA), South Africa</p>
                      </div>
                      <div>
                        <p><strong>International:</strong> GDPR principles and best practices</p>
                      </div>
                      <div>
                        <p><strong>Industry:</strong> Employment and recruitment privacy standards</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">1.4 Data Controller Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Data Controller</h4>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p><strong>Company:</strong> AI Job Chommie (Pty) Ltd</p>
                      <p><strong>Registration:</strong> 2024/123456/07</p>
                      <p><strong>Address:</strong> Cape Town, Western Cape, South Africa</p>
                      <p><strong>Data Protection Officer:</strong> privacy@aijobchommie.co.za</p>
                      <p><strong>Information Officer:</strong> compliance@aijobchommie.co.za</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Information We Collect */}
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('collection')}
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              {isExpanded('collection') ? <ChevronUp className="h-6 w-6 text-gray-500" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}
            </button>
            
            {isExpanded('collection') && (
              <div className="px-8 pb-8 border-t border-gray-100">
                <div className="prose max-w-none text-gray-700 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">2.1 Personal Information Categories</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Job Seeker Information</h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>• Personal identifiers (name, email, phone)</li>
                        <li>• Demographic information (age, location)</li>
                        <li>• Employment history and experience</li>
                        <li>• Education and qualifications</li>
                        <li>• Skills and competencies</li>
                        <li>• CV/Resume documents</li>
                        <li>• Cover letters and applications</li>
                        <li>• Salary expectations and preferences</li>
                        <li>• Career goals and aspirations</li>
                        <li>• Professional references</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Employer Information</h4>
                      <ul className="text-sm text-green-800 space-y-2">
                        <li>• Company details and registration</li>
                        <li>• Contact person information</li>
                        <li>• Business type and industry</li>
                        <li>• Job postings and requirements</li>
                        <li>• Recruitment preferences</li>
                        <li>• Company culture and values</li>
                        <li>• Hiring manager profiles</li>
                        <li>• Budget and compensation ranges</li>
                        <li>• Company branding materials</li>
                        <li>• Performance and analytics data</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">2.2 Technical Information</h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-900 mb-3">Automatically Collected Data</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-purple-800">
                      <div>
                        <p><strong>Device Information:</strong> Browser type, operating system, device identifiers</p>
                      </div>
                      <div>
                        <p><strong>Usage Data:</strong> Pages visited, features used, time spent, interaction patterns</p>
                      </div>
                      <div>
                        <p><strong>Location Data:</strong> IP address, general location (city/province level)</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">2.3 AI and Machine Learning Data</h3>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-semibold text-orange-900 mb-3">AI Processing Information</h4>
                    <p className="text-orange-800 mb-3">
                      Our AI systems analyze various data points to improve matching accuracy and user experience:
                    </p>
                    <ul className="text-sm text-orange-800 space-y-2">
                      <li>• Profile completion patterns and preferences</li>
                      <li>• Job search behavior and application patterns</li>
                      <li>• Communication and interaction data</li>
                      <li>• Success rates and feedback</li>
                      <li>• Skill assessments and performance metrics</li>
                      <li>• Market trends and salary benchmarking data</li>
                    </ul>
                    <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                      <p className="text-xs text-orange-700">
                        <strong>Note:</strong> All AI processing is designed to enhance your experience and improve job matching accuracy. 
                        You can opt-out of certain AI features while maintaining core functionality.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">2.4 Information Sources</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Direct Collection</h4>
                      <p className="text-sm text-gray-600">
                        Information you provide directly through registration, profile creation, job applications, 
                        and communication with our platform.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Third-Party Sources</h4>
                      <p className="text-sm text-gray-600">
                        Information from social media integrations (LinkedIn, Facebook), professional networks, 
                        and partner platforms (with your consent).
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Public Sources</h4>
                      <p className="text-sm text-gray-600">
                        Publicly available professional information, company data, and industry insights used 
                        for verification and enhancement purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('usage')}
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              {isExpanded('usage') ? <ChevronUp className="h-6 w-6 text-gray-500" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}
            </button>
            
            {isExpanded('usage') && (
              <div className="px-8 pb-8 border-t border-gray-100">
                <div className="prose max-w-none text-gray-700 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">3.1 Primary Purposes</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Core Services</h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>• Job matching and recommendations</li>
                        <li>• Application processing and tracking</li>
                        <li>• Profile creation and management</li>
                        <li>• Communication facilitation</li>
                        <li>• Search and filtering functionality</li>
                        <li>• Career guidance and insights</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">AI Enhancement</h4>
                      <ul className="text-sm text-green-800 space-y-2">
                        <li>• Intelligent job matching algorithms</li>
                        <li>• Personalized recommendations</li>
                        <li>• Automated screening and ranking</li>
                        <li>• Predictive analytics</li>
                        <li>• Natural language processing</li>
                        <li>• Machine learning improvements</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">3.2 Legal Basis for Processing</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">POPIA Compliance Framework</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Consent</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Explicit consent for marketing, AI processing, and non-essential features
                        </p>
                        
                        <h5 className="font-medium text-gray-800 mb-2">Contractual Necessity</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Processing required to provide our core job search and recruitment services
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Legitimate Interest</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Platform security, fraud prevention, and service improvement
                        </p>
                        
                        <h5 className="font-medium text-gray-800 mb-2">Legal Obligation</h5>
                        <p className="text-sm text-gray-600">
                          Compliance with employment laws, tax requirements, and regulatory obligations
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">3.3 Data Processing Activities</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Service Delivery</h4>
                      <p className="text-sm text-blue-800">
                        Creating profiles, processing applications, facilitating communication between job seekers and employers, 
                        providing search functionality, and delivering personalized experiences.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Platform Improvement</h4>
                      <p className="text-sm text-green-800">
                        Analyzing usage patterns, improving AI algorithms, developing new features, 
                        conducting research, and enhancing user experience.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded-r-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Communication</h4>
                      <p className="text-sm text-purple-800">
                        Sending service updates, job alerts, security notifications, customer support responses, 
                        and promotional materials (with consent).
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Security & Compliance</h4>
                      <p className="text-sm text-orange-800">
                        Fraud detection, security monitoring, regulatory compliance, legal proceedings, 
                        and protecting user safety and platform integrity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Continue with more sections... I'll create the remaining sections to make this comprehensive */}
          
        </div>

        {/* POPIA Rights Summary */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-gradient-to-br from-green-900 to-blue-900 text-white rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Your POPIA Rights</h3>
              <p className="text-lg text-green-100">
                Under the Protection of Personal Information Act, you have comprehensive rights regarding your personal data
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <Eye className="h-8 w-8 mb-4 mx-auto" />
                <h4 className="font-semibold text-center mb-3">Access & Transparency</h4>
                <ul className="text-sm space-y-1">
                  <li>• View all personal information we hold</li>
                  <li>• Understand how it's being used</li>
                  <li>• Know who we share it with</li>
                  <li>• Request processing records</li>
                </ul>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <Settings className="h-8 w-8 mb-4 mx-auto" />
                <h4 className="font-semibold text-center mb-3">Control & Correction</h4>
                <ul className="text-sm space-y-1">
                  <li>• Correct inaccurate information</li>
                  <li>• Update outdated data</li>
                  <li>• Withdraw consent anytime</li>
                  <li>• Object to certain processing</li>
                </ul>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <Shield className="h-8 w-8 mb-4 mx-auto" />
                <h4 className="font-semibold text-center mb-3">Protection & Deletion</h4>
                <ul className="text-sm space-y-1">
                  <li>• Request data deletion</li>
                  <li>• Data portability rights</li>
                  <li>• Lodge complaints</li>
                  <li>• Legal remedy options</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-green-700 text-center">
              <p className="text-sm text-green-200 mb-2">
                <strong>Exercise Your Rights:</strong> Contact our Data Protection Officer at privacy@aijobchommie.co.za
              </p>
              <p className="text-xs text-green-300">
                We will respond to all requests within 30 days as required by POPIA
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPage;
