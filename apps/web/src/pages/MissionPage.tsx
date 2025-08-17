/**
 * 🎯 OUR MISSION PAGE
 * 
 * Comprehensive mission, vision, values, and impact goals for AI Job Chommie
 * Transforming employment through AI innovation in South Africa
 */

import React from 'react';
import { Target, Heart, Users, Globe, Zap, Shield, TrendingUp, Award, Star, CheckCircle, ArrowRight, Lightbulb, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet';

const MissionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Our Mission | AI Job Chommie - Transforming Employment Through AI Innovation</title>
        <meta name="description" content="Discover AI Job Chommie's mission to democratize employment opportunities in South Africa through AI innovation. Learn about our values, vision, and commitment to social impact." />
        <meta name="keywords" content="mission, vision, values, AI Job Chommie, employment transformation, South Africa, social impact, technology for good" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-8">
              <Target className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Mission</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Transforming employment through AI innovation
            </p>
            <p className="text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed">
              We exist to democratize access to employment opportunities in South Africa by leveraging 
              artificial intelligence to create meaningful connections between talent and opportunity. 
              Our mission extends beyond job matching – we're building a more equitable future for all South Africans.
            </p>
          </div>
        </div>
      </div>

      {/* Main Mission Statement */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Core Mission */}
        <div className="mb-16">
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Mission</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-gray-700 space-y-6 text-lg leading-relaxed">
                  <p className="text-2xl font-semibold text-blue-900">
                    To democratize employment opportunities for every South African by providing 
                    AI-powered tools that level the playing field between job seekers and employers.
                  </p>
                  
                  <p>
                    We believe that talent is equally distributed, but opportunity is not. Our mission 
                    is to bridge this gap by ensuring that every job seeker – regardless of their 
                    background, location, or resources – has access to the same advanced technology 
                    that was previously only available to large corporations.
                  </p>

                  <p>
                    Through intelligent job matching, personalized career guidance, and comprehensive 
                    support systems, we're not just helping people find jobs – we're empowering them 
                    to build meaningful careers that contribute to South Africa's economic growth and 
                    social development.
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">What This Means in Practice</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Equal Access to Technology</h4>
                        <p className="text-sm text-gray-600">Every user gets the same AI-powered matching regardless of their subscription level</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Comprehensive South African Coverage</h4>
                        <p className="text-sm text-gray-600">From Cape Town to Johannesburg, from rural areas to metropolitan centers</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Skills-First Approach</h4>
                        <p className="text-sm text-gray-600">Matching based on abilities and potential, not just formal qualifications</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Continuous Learning Support</h4>
                        <p className="text-sm text-gray-600">Career development tools and resources to help users grow professionally</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
                <Globe className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision for 2030</h2>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                A South Africa where unemployment is no longer a barrier to human potential and economic participation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Measurable Impact</h3>
                <p className="text-purple-100">
                  Contribute to reducing South Africa's unemployment rate by facilitating 1 million+ job placements 
                  and creating pathways for economic empowerment.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Inclusive Growth</h3>
                <p className="text-purple-100">
                  Ensure that economic opportunities reach every community, with special focus on previously 
                  disadvantaged groups and rural areas.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Continental Leadership</h3>
                <p className="text-purple-100">
                  Become Africa's leading employment platform, exporting our South African success to other 
                  African nations facing similar challenges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every decision we make and every feature we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Empathy */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Empathy First</h3>
              <p className="text-gray-600 mb-4">
                We understand the emotional and practical challenges of unemployment because our founder lived it. 
                Every feature is designed with deep empathy for user struggles.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• User-centered design approach</p>
                <p>• Accessible and intuitive interfaces</p>
                <p>• Supportive communication tone</p>
                <p>• Understanding diverse user needs</p>
              </div>
            </div>

            {/* Innovation */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation Excellence</h3>
              <p className="text-gray-600 mb-4">
                We leverage cutting-edge AI technology not for its own sake, but to solve real problems and 
                create meaningful value for our users.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• AI-powered job matching</p>
                <p>• Predictive career analytics</p>
                <p>• Continuous platform improvement</p>
                <p>• Emerging technology adoption</p>
              </div>
            </div>

            {/* Integrity */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Uncompromising Integrity</h3>
              <p className="text-gray-600 mb-4">
                We maintain the highest standards of honesty, transparency, and ethical behavior in all our 
                interactions with users, partners, and stakeholders.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Transparent business practices</p>
                <p>• Honest communication</p>
                <p>• Data privacy protection</p>
                <p>• Fair and ethical AI algorithms</p>
              </div>
            </div>

            {/* Inclusion */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Radical Inclusion</h3>
              <p className="text-gray-600 mb-4">
                We actively work to ensure that everyone, regardless of background, race, gender, age, or 
                location, has equal access to opportunities through our platform.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Bias-free AI algorithms</p>
                <p>• Multi-language support</p>
                <p>• Accessibility compliance</p>
                <p>• Rural area connectivity</p>
              </div>
            </div>

            {/* Excellence */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pursuit of Excellence</h3>
              <p className="text-gray-600 mb-4">
                We are committed to delivering the highest quality experience for our users, continuously 
                improving and setting new standards in the employment industry.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Quality assurance processes</p>
                <p>• Continuous improvement mindset</p>
                <p>• User feedback integration</p>
                <p>• Performance optimization</p>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Meaningful Impact</h3>
              <p className="text-gray-600 mb-4">
                Every decision we make is evaluated based on its potential to create positive, lasting change 
                in the lives of our users and the broader South African community.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Social impact measurement</p>
                <p>• Community engagement</p>
                <p>• Economic empowerment focus</p>
                <p>• Sustainable business practices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Goals & Metrics */}
        <div className="mb-16">
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to Impact</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Measurable goals that keep us accountable to our mission and to the South African people
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">2025-2027 Goals</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">100,000 Successful Job Placements</h4>
                      <p className="text-gray-600 text-sm">
                        Facilitate meaningful employment for 100,000 South Africans across all provinces and 
                        skill levels by the end of 2027.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">5,000+ Partner Companies</h4>
                      <p className="text-gray-600 text-sm">
                        Build a comprehensive network of South African employers, from SMEs to large corporations, 
                        providing diverse opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Rural Area Penetration</h4>
                      <p className="text-gray-600 text-sm">
                        Ensure 40% of our successful placements come from rural and township areas, 
                        addressing geographic employment disparities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Skills Development Impact</h4>
                      <p className="text-gray-600 text-sm">
                        Launch comprehensive training programs that upskill 25,000 job seekers in 
                        high-demand industries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Long-term Vision</h3>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Pan-African Expansion
                    </h4>
                    <p className="text-gray-700 text-sm">
                      By 2030, extend our platform to at least 5 other African countries, adapting our 
                      South African success to local contexts and needs.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Economic Impact
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Contribute R10 billion+ to South Africa's GDP through improved employment matching 
                      and reduced time-to-hire for businesses.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-600" />
                      Social Transformation
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Become a case study for how technology can address systemic unemployment and 
                      contribute to social cohesion and economic justice.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      Innovation Leadership
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Pioneer new AI technologies for employment matching, becoming a global reference 
                      for ethical AI in human resources.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How We Measure Success */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How We Measure Success</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Beyond business metrics – measuring our true impact on South African lives and communities
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100K+</div>
                <div className="text-blue-200 text-sm">Lives Transformed</div>
                <div className="text-xs text-blue-300 mt-1">Successful job placements</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">90%</div>
                <div className="text-blue-200 text-sm">User Satisfaction</div>
                <div className="text-xs text-blue-300 mt-1">Positive experience rating</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5M+</div>
                <div className="text-blue-200 text-sm">Economic Impact</div>
                <div className="text-xs text-blue-300 mt-1">Rand value generated</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">60%</div>
                <div className="text-blue-200 text-sm">Speed Improvement</div>
                <div className="text-xs text-blue-300 mt-1">Faster job matching</div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white border-opacity-20 text-center">
              <p className="text-blue-200 max-w-3xl mx-auto">
                Our success is ultimately measured by the stories of individuals who found meaningful employment, 
                businesses that found the right talent, and communities that grew stronger through economic opportunity.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-12">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Whether you're a job seeker looking for opportunities, an employer seeking talent, or someone who 
              believes in our vision – you can be part of transforming South Africa's employment landscape.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a 
                href="/jobs"
                className="flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
              >
                Find Your Opportunity
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="/contact"
                className="flex items-center gap-2 px-8 py-4 bg-white bg-opacity-20 text-white rounded-lg hover:bg-white hover:bg-opacity-30 font-semibold text-lg"
              >
                Partner With Us
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <div className="pt-6 border-t border-white border-opacity-20">
              <p className="text-green-200 text-sm">
                Together, we can build a South Africa where everyone has access to meaningful employment and economic opportunity.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MissionPage;
