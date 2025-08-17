/**
 * 👨‍💼 MEET THE FOUNDER PAGE
 * 
 * Fernando Steyn's authentic journey from welder to AI innovator
 * A story of resilience, innovation, and democratizing employment
 */

import React from 'react';
import { User, Award, Target, Heart, Lightbulb, Users, MapPin, Mail, Phone, ExternalLink, Quote, Star, TrendingUp, Globe, Wrench, Cpu, Code, Palette } from 'lucide-react';
import { Helmet } from 'react-helmet';

const FounderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Meet the Founder | AI Job Chommie - From Welding Yards to AI Innovation</title>
        <meta name="description" content="Meet Fernando Steyn, founder of AI Job Chommie. From skilled welder to AI innovator - a journey of resilience and the mission to democratize employment for all South Africans." />
        <meta name="keywords" content="Fernando Steyn, founder, CEO, welder, AI innovation, South Africa, employment, Port Elizabeth, technology" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-8">
              <User className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Meet the Founder</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              From the welding yards of Port Elizabeth to the forefront of AI innovation
            </p>
            <p className="text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed">
              One man's journey to democratize employment for all South Africans. Discover how personal experience 
              with unemployment transformed into a mission to help every job seeker access the same advanced 
              technology that big corporations use to find the best talent.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Founder Introduction with Real Story */}
        <div className="mb-16">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Photo Section */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  {/* Placeholder for founder photo */}
                  <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="h-24 w-24" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Fernando Steyn</h2>
                  <p className="text-xl text-blue-100 mb-2">Founder & CEO</p>
                  <p className="text-sm text-blue-200 mb-6">From Skilled Welder to AI Innovator</p>
                  <p className="text-blue-200 leading-relaxed">
                    Transforming personal struggle into technological solutions that empower every South African job seeker
                  </p>
                  
                  {/* Contact Info */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Port Elizabeth, Eastern Cape</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:admin@aijobchommie.co.za" className="hover:text-white">
                        admin@aijobchommie.co.za
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <a href="tel:0683015006" className="hover:text-white">
                        068 301 5006
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Section */}
              <div className="p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">A Story of Resilience and Innovation</h3>
                
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg">
                    Fernando Steyn's journey to founding AI Job Chommie is a testament to the power of perseverance 
                    and the belief that technology can transform lives. Born and raised in the vibrant community 
                    of Port Elizabeth, Fernando's path wasn't traditional – but it was authentic.
                  </p>
                  
                  <p>
                    As a skilled welder who experienced unemployment firsthand, Fernando understands the frustration 
                    of job searching in South Africa. He knows what it's like to have valuable skills but struggle 
                    to find opportunities that recognize and reward that potential.
                  </p>

                  <p>
                    This personal experience became the driving force behind AI Job Chommie. Fernando realized that 
                    while large corporations had access to sophisticated recruitment technologies, individual job 
                    seekers were left to navigate an increasingly complex employment landscape with outdated tools.
                  </p>

                  <p>
                    His unique combination of blue-collar work experience and self-taught technical expertise gives 
                    him an unparalleled understanding of both the job seeker's struggle and the technological 
                    solutions that can address it.
                  </p>
                </div>

                <div className="mt-8 p-6 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <Quote className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-orange-800 italic text-lg leading-relaxed">
                        "As a welder who faced unemployment, I understand the struggle. This app is my way of 
                        giving back to the community. Every job seeker deserves the same advanced technology 
                        that big corporations use to find the best talent."
                      </p>
                      <p className="text-orange-600 text-sm mt-3 font-medium">- Fernando Steyn, Founder & CEO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Journey Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Personal Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to technological innovation – the experiences that shaped AI Job Chommie's vision
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-blue-200 h-full"></div>
            
            <div className="space-y-12">
              
              {/* Early Career */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center ml-auto mb-4">
                      <Wrench className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Skilled Welder</h3>
                    <p className="text-sm text-gray-600 mb-2">Port Elizabeth Industrial Area</p>
                    <p className="text-gray-700">
                      Developed strong work ethic and problem-solving skills in the welding yards. 
                      Learned the value of precision, attention to detail, and craftsmanship.
                    </p>
                  </div>
                </div>
                
                <div className="relative z-10 w-8 h-8 bg-blue-600 rounded-full border-4 border-white"></div>
                
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Unemployment Experience */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                
                <div className="relative z-10 w-8 h-8 bg-red-600 rounded-full border-4 border-white"></div>
                
                <div className="w-1/2 pl-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">The Struggle</h3>
                    <p className="text-sm text-gray-600 mb-2">Experiencing unemployment firsthand</p>
                    <p className="text-gray-700">
                      Faced the harsh reality of job searching in South Africa. Despite having valuable skills, 
                      struggled to find opportunities that matched his expertise and potential.
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Technology */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center ml-auto mb-4">
                      <Code className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Self-Taught Developer</h3>
                    <p className="text-sm text-gray-600 mb-2">Teaching himself to code</p>
                    <p className="text-gray-700">
                      Recognized technology's potential to solve real-world problems. Dedicated countless hours 
                      to learning programming, AI/ML concepts, and full-stack development.
                    </p>
                  </div>
                </div>
                
                <div className="relative z-10 w-8 h-8 bg-green-600 rounded-full border-4 border-white"></div>
                
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* AI Job Chommie Birth */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                
                <div className="relative z-10 w-8 h-8 bg-purple-600 rounded-full border-4 border-white"></div>
                
                <div className="w-1/2 pl-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <Cpu className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI Job Chommie</h3>
                    <p className="text-sm text-gray-600 mb-2">Founding the company in 2025</p>
                    <p className="text-gray-700">
                      Combined personal experience with technical expertise to create South Africa's most 
                      advanced job matching platform, democratizing access to employment opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Innovation Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Innovation Meets Real-World Experience</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Fernando's unique combination of blue-collar work experience and self-taught technical expertise gives him 
              an unparalleled understanding of both the job seeker's struggle and the technological solutions that can address it.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-xl p-12 mb-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Grounded in Practical Problem-Solving</h3>
              <p className="text-blue-100 max-w-3xl mx-auto">
                His approach to AI development is grounded in practical problem-solving rather than theoretical concepts. 
                Every algorithm is designed with the real needs of South African job seekers in mind.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cpu className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">AI/ML Engineering</h4>
                <p className="text-sm text-blue-200">
                  Self-taught machine learning and artificial intelligence, focusing on employment matching algorithms
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">Full-Stack Development</h4>
                <p className="text-sm text-blue-200">
                  Complete web and mobile application development, from backend APIs to responsive user interfaces
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">UX/UI Design</h4>
                <p className="text-sm text-blue-200">
                  User-centered design principles ensuring the platform is accessible and intuitive for all users
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">Product Strategy</h4>
                <p className="text-sm text-blue-200">
                  Strategic thinking about product development, market needs, and sustainable business growth
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why AI Job Chommie? */}
        <div className="mb-16">
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why AI Job Chommie?</h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              The personal experiences and observations that drove Fernando to create South Africa's most advanced job matching platform.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-red-600" />
                  The Problem I Lived
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Having experienced unemployment as a skilled tradesman, I witnessed firsthand how traditional 
                    job search methods fail both job seekers and employers. Talented individuals remain 
                    unemployed while companies struggle to find the right candidates.
                  </p>
                  <p>
                    The existing job platforms weren't designed with the South African context in mind. 
                    They didn't understand our unique challenges – from geographical barriers to skills 
                    mismatches to language preferences.
                  </p>
                  <p>
                    I realized that while large corporations had access to sophisticated AI-powered 
                    recruitment tools, individual job seekers were left with outdated, ineffective methods.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  The Solution I Built
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    AI Job Chommie democratizes access to advanced recruitment technology. Every job seeker, 
                    regardless of their background or resources, can now benefit from the same AI-powered 
                    matching that was previously only available to large corporations.
                  </p>
                  <p>
                    Our platform understands the South African job market – from local companies to 
                    regional preferences, from entry-level positions to executive roles. It's designed 
                    by someone who has been on both sides of the employment equation.
                  </p>
                  <p>
                    Most importantly, it's built with empathy. Every feature is designed to address 
                    real frustrations I experienced during my own job search journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Philosophy */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Philosophy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fernando's approach to building technology that serves humanity rather than replacing it
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Human-Centered Technology</h3>
              <p className="text-sm text-gray-600">
                Technology should amplify human potential, not replace human connection and understanding
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Empathy-Driven Solutions</h3>
              <p className="text-sm text-gray-600">
                Every feature is developed with deep understanding of user struggles and real-world needs
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Community Impact</h3>
              <p className="text-sm text-gray-600">
                Success is measured not just in profits, but in the positive impact on South African communities
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Authentic Leadership</h3>
              <p className="text-sm text-gray-600">
                Leading by example, staying connected to grassroots experiences, and remaining humble
              </p>
            </div>
          </div>
        </div>

        {/* Vision for the Future */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Vision for the Future</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Building a world where every South African has equal access to meaningful employment opportunities, 
                regardless of their background or starting point
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Immediate Goals</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Democratize Access</h4>
                      <p className="text-sm text-blue-100">Ensure every job seeker has access to AI-powered job matching technology</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Bridge the Skills Gap</h4>
                      <p className="text-sm text-blue-100">Connect skilled tradespeople with opportunities that value their expertise</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Reduce Unemployment</h4>
                      <p className="text-sm text-blue-100">Make a measurable impact on South Africa's unemployment statistics</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Long-term Vision</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Pan-African Expansion</h4>
                      <p className="text-sm text-blue-100">Extend our impact across the African continent</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Heart className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Community Empowerment</h4>
                      <p className="text-sm text-blue-100">Build tools that strengthen local communities and economies</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Lightbulb className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Innovation Leadership</h4>
                      <p className="text-sm text-blue-100">Pioneer new AI technologies for employment and social good</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div className="mb-16">
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">A Personal Message</h2>
              
              <div className="text-gray-700 space-y-6 text-lg leading-relaxed">
                <p>
                  To every job seeker who has felt the frustration of being overlooked despite having valuable skills – 
                  I see you, I understand your struggle, and AI Job Chommie was built for you.
                </p>
                
                <p>
                  My journey from the welding yards to building AI technology wasn't easy, but it taught me that 
                  our backgrounds don't define our potential. What matters is having access to the right opportunities 
                  and the tools to showcase our true capabilities.
                </p>

                <p>
                  AI Job Chommie is more than a business to me – it's my way of ensuring that no one else has to 
                  experience the isolation and uncertainty that comes with prolonged unemployment. It's my commitment 
                  to democratizing opportunity and leveling the playing field for all South Africans.
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-gray-900">Fernando Steyn</p>
                    <p className="text-gray-600">Founder & CEO, AI Job Chommie</p>
                    <p className="text-sm text-gray-500">From Welder to AI Innovator</p>
                  </div>
                </div>
                
                <p className="text-gray-600 italic">
                  "Technology should serve people, not the other way around."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Connect */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl p-12">
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Whether you're a job seeker, employer, fellow entrepreneur, or someone who believes in the power 
              of technology to create positive change – I'd love to hear from you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:admin@aijobchommie.co.za"
                className="flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
              >
                <Mail className="h-5 w-5" />
                Email Fernando
              </a>
              <a 
                href="tel:0683015006"
                className="flex items-center gap-2 px-8 py-4 bg-white bg-opacity-20 text-white rounded-lg hover:bg-white hover:bg-opacity-30 font-semibold text-lg"
              >
                <Phone className="h-5 w-5" />
                Call: 068 301 5006
              </a>
              <a 
                href="https://wa.me/27683015006"
                className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
              >
                <ExternalLink className="h-5 w-5" />
                WhatsApp Chat
              </a>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white border-opacity-20 text-center">
              <p className="text-orange-200 text-sm">
                Based in Port Elizabeth, Eastern Cape • Available for meetings at Baywest Mall office
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FounderPage;
