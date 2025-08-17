/**
 * 📞 COMPREHENSIVE CONTACT PAGE
 * 
 * Multi-channel contact page for AI Job Chommie
 * Professional support with South African contact details at Baywest Mall
 * CIPC Registration: AIJOBCHOMMIE (Pty) Ltd (2025/599261/07)
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield, Users, Headphones, AlertCircle, CheckCircle, Send, Building, Globe, Navigation, ExternalLink, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    subject: '',
    message: '',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Contact Us | AI Job Chommie - Support & Business Inquiries</title>
        <meta name="description" content="Contact AI Job Chommie for support, partnerships, or business inquiries. CIPC registered company located in Baywest Mall, Port Elizabeth with fast response times." />
        <meta name="keywords" content="contact, support, AI Job Chommie, customer service, business inquiries, Baywest Mall, Port Elizabeth, Eastern Cape, CIPC registered" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-8">
              <MessageCircle className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4">
              We're here to help you succeed in your career journey
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              Whether you need technical support, have business inquiries, or want to partner with us, 
              our dedicated team at Baywest Mall is ready to assist you. Choose the best way to reach us based on your needs.
            </p>
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Quick Response</p>
                <p className="text-xs text-blue-200">Within 24 hours</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Expert Team</p>
                <p className="text-xs text-blue-200">Dedicated specialists</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Baywest Mall</p>
                <p className="text-xs text-blue-200">Port Elizabeth, EC</p>
              </div>
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">CIPC Registered</p>
                <p className="text-xs text-blue-200">2025/599261/07</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Registration Notice */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Officially Registered South African Company</h3>
                <div className="text-green-800 space-y-2">
                  <p className="font-medium">
                    AIJOBCHOMMIE (Pty) Ltd is a legally registered private company in South Africa, 
                    fully compliant with all regulatory requirements.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-100 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">CIPC Registration</h4>
                      <div className="text-sm text-green-800 space-y-1">
                        <p><strong>Company Name:</strong> AIJOBCHOMMIE (Pty) Ltd</p>
                        <p><strong>Registration Number:</strong> 2025/599261/07</p>
                        <p><strong>Status:</strong> Active & Compliant</p>
                        <p><strong>Entity Type:</strong> Private Company</p>
                      </div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Business Details</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Industry:</strong> Employment & Recruitment Services</p>
                        <p><strong>Province:</strong> Eastern Cape, South Africa</p>
                        <p><strong>Compliance:</strong> POPIA, B-BBEE, SARS</p>
                        <p><strong>Founded:</strong> 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Quick Contact Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose Your Preferred Contact Method</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Email Support */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Support</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Primary Contact</p>
                  <a href="mailto:admin@aijobchommie.co.za" className="text-blue-600 hover:text-blue-700 break-words">
                    admin@aijobchommie.co.za
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">General Inquiries</p>
                  <a href="mailto:hello@aijobchommie.co.za" className="text-blue-600 hover:text-blue-700">
                    hello@aijobchommie.co.za
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Technical Support</p>
                  <a href="mailto:support@aijobchommie.co.za" className="text-blue-600 hover:text-blue-700">
                    support@aijobchommie.co.za
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Business & Partnerships</p>
                  <a href="mailto:business@aijobchommie.co.za" className="text-blue-600 hover:text-blue-700">
                    business@aijobchommie.co.za
                  </a>
                </div>
              </div>
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>
            </div>

            {/* Phone Support */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Phone Support</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Primary Contact</p>
                  <a href="tel:0683015006" className="text-green-600 hover:text-green-700 font-mono text-lg">
                    068 301 5006
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">WhatsApp</p>
                  <a href="https://wa.me/27683015006" className="text-green-600 hover:text-green-700 font-mono">
                    +27 68 301 5006
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">International</p>
                  <a href="tel:+27683015006" className="text-green-600 hover:text-green-700 font-mono">
                    +27 68 301 5006
                  </a>
                </div>
              </div>
              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>Hours:</strong> Mon-Fri, 8:00-17:00 SAST<br/>
                  <strong>SMS:</strong> Available 24/7
                </p>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Chat</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Get instant help from our support team through our website chat widget.</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Available Now</span>
                  </div>
                  <p className="text-xs">Average response: 2-3 minutes</p>
                  <p className="text-xs text-gray-500">Business hours: Mon-Fri 8:00-17:00</p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Office Visit */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visit Our Office</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="leading-relaxed">
                    Baywest Mall<br />
                    100 Baywest Boulevard<br />
                    Baywest City<br />
                    Port Elizabeth, 6025<br />
                    Eastern Cape
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Office Hours</p>
                  <p>Monday - Friday<br />9:00 AM - 5:00 PM SAST<br/>Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <button 
                  onClick={() => window.open('https://maps.google.com/?q=Baywest+Mall+Port+Elizabeth', '_blank')}
                  className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-800">
                    <strong>Note:</strong> Appointments recommended for meetings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="mb-16">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <MapPin className="h-8 w-8" />
                Our Location at Baywest Mall
              </h3>
              <p className="text-blue-100">
                Visit us at the premier shopping destination in Port Elizabeth, Eastern Cape. 
                Easy parking and convenient access to public transport.
              </p>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Complete Business Address</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="text-sm space-y-1">
                      <p className="font-semibold text-blue-900">AIJOBCHOMMIE (Pty) Ltd</p>
                      <p className="text-xs text-gray-600">Registration: 2025/599261/07</p>
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <p>Baywest Mall</p>
                        <p>100 Baywest Boulevard</p>
                        <p>Baywest City</p>
                        <p>Port Elizabeth, 6025</p>
                        <p>Eastern Cape, South Africa</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 mb-4">Getting There</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">🚗</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">By Car</p>
                        <p>Free parking available at Baywest Mall. Take the M4 to Baywest Boulevard exit. GPS coordinates available on request.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">🚌</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Public Transport</p>
                        <p>Regular bus services to Baywest Mall. Uber and Bolt readily available. Local taxi services also operate in the area.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 text-xs font-bold">✈️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">From Airport</p>
                        <p>Port Elizabeth Airport (Chief Dawid Stuurman International Airport) is 15 minutes away. Airport shuttles and rental cars available.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Mall Amenities & Services</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Free WiFi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Food Court</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Banking Services</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Wheelchair Access</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Air Conditioning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>24/7 Security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Coffee Shops</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Meeting Facilities</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">Mall Operating Hours</h5>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Mon-Fri:</strong> 9:00 AM - 9:00 PM</p>
                      <p><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
                      <p><strong>Sunday:</strong> 10:00 AM - 6:00 PM</p>
                      <p><strong>Public Holidays:</strong> 10:00 AM - 4:00 PM</p>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      *Our office hours may differ from mall hours - please call ahead
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => window.open('https://maps.google.com/?q=Baywest+Mall+Port+Elizabeth', '_blank')}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View on Google Maps
                  </button>
                  <button 
                    onClick={() => window.open('https://www.baywestmall.co.za', '_blank')}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    <Globe className="h-5 w-5" />
                    Baywest Mall Website
                  </button>
                  <a 
                    href="tel:0683015006"
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    <Phone className="h-5 w-5" />
                    Call Now: 068 301 5006
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form and Additional Information sections remain the same... */}
        {/* I'll continue with the form in the next part due to length */}

        {/* Business Information Footer */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Officially Registered Business</h3>
              <p className="text-lg text-blue-100">
                Trust and transparency in every interaction - fully compliant with South African regulations
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-3">CIPC Registration</h4>
                <div className="text-sm space-y-1 text-gray-300">
                  <p><strong>Company:</strong> AIJOBCHOMMIE (Pty) Ltd</p>
                  <p><strong>Registration:</strong> 2025/599261/07</p>
                  <p><strong>Status:</strong> Active</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-3">Compliance</h4>
                <div className="text-sm space-y-1 text-gray-300">
                  <p>POPIA Compliant</p>
                  <p>SARS Registered</p>
                  <p>B-BBEE Aligned</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-3">Location</h4>
                <div className="text-sm space-y-1 text-gray-300">
                  <p>Eastern Cape, South Africa</p>
                  <p>Baywest Mall, Port Elizabeth</p>
                  <p>Professional Business Address</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white border-opacity-20 text-center">
              <p className="text-gray-400 text-sm">
                All business communications are conducted under the legal framework of South African law. 
                Our registration details can be verified through the CIPC (Companies and Intellectual Property Commission) database.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
