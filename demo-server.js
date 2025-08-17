// AI Job Chommie Platform - Demo Server
// Simple Node.js server to demonstrate the platform structure

const http = require('http');
const url = require('url');

// Sample job data focusing on South African entry-level jobs
const entryLevelJobs = [
  {
    id: 1,
    title: 'General Worker - Factory',
    company: 'Manufacturing SA',
    location: 'Johannesburg, Gauteng',
    category: 'general_labor',
    urgentHire: true,
    salary: 'R8,000 - R12,000',
    requirements: ['Grade 10', 'Physical fitness', 'Reliable transport'],
    description: 'Seeking reliable general workers for our manufacturing facility. Entry-level position with training provided.',
    postedDate: new Date().toISOString(),
    applicationCount: 23
  },
  {
    id: 2,
    title: 'Office Cleaner',
    company: 'Clean Pro Services',
    location: 'Cape Town, Western Cape',
    category: 'cleaning',
    urgentHire: true,
    salary: 'R6,500 - R9,000',
    requirements: ['Grade 9 minimum', 'Experience preferred', 'Own transport'],
    description: 'Professional cleaning services company seeking dedicated cleaners for office buildings in Cape Town CBD.',
    postedDate: new Date(Date.now() - 86400000).toISOString(),
    applicationCount: 45
  },
  {
    id: 3,
    title: 'Security Guard',
    company: 'SecureMax Security',
    location: 'Durban, KwaZulu-Natal',
    category: 'security',
    urgentHire: false,
    salary: 'R7,500 - R11,000',
    requirements: ['Grade 12', 'Security training', 'Valid ID'],
    description: 'Join our team of professional security guards. Training provided. Night and day shifts available.',
    postedDate: new Date(Date.now() - 172800000).toISOString(),
    applicationCount: 12
  },
  {
    id: 4,
    title: 'Kitchen Assistant',
    company: 'Golden Spoon Restaurant',
    location: 'Pretoria, Gauteng',
    category: 'food_service',
    urgentHire: true,
    salary: 'R6,000 - R8,500',
    requirements: ['Food handling certificate preferred', 'Teamwork skills', 'Flexible hours'],
    description: 'Busy restaurant seeking kitchen assistants. Great opportunity for career growth in hospitality.',
    postedDate: new Date(Date.now() - 43200000).toISOString(),
    applicationCount: 31
  },
  {
    id: 5,
    title: 'Delivery Driver',
    company: 'FastTrack Logistics',
    location: 'Port Elizabeth, Eastern Cape',
    category: 'transport',
    urgentHire: false,
    salary: 'R9,000 - R13,000',
    requirements: ['Valid drivers license', 'Clean driving record', 'Own vehicle preferred'],
    description: 'Delivery driver needed for local deliveries. Flexible schedule and fuel allowance provided.',
    postedDate: new Date(Date.now() - 259200000).toISOString(),
    applicationCount: 8
  }
];

// Platform statistics 
const platformStats = {
  totalJobs: 1247,
  entryLevelJobs: 856,
  urgentJobs: 234,
  activeJobSeekers: 12453,
  successfulPlacements: 1834,
  averageResponseTime: '2.3 hours',
  topCategories: [
    { name: 'General Labor', count: 298, priority: 'critical' },
    { name: 'Cleaning & Domestic', count: 234, priority: 'critical' },
    { name: 'Security & Safety', count: 167, priority: 'high' },
    { name: 'Food Service', count: 134, priority: 'high' },
    { name: 'Transport & Delivery', count: 112, priority: 'high' }
  ],
  regions: [
    { name: 'Gauteng', jobs: 445 },
    { name: 'Western Cape', jobs: 298 },
    { name: 'KwaZulu-Natal', jobs: 234 },
    { name: 'Eastern Cape', jobs: 123 },
    { name: 'Free State', jobs: 89 }
  ]
};

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // API Routes
    if (path === '/health') {
      // Health check endpoint
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        message: '🚀 AI Job Chommie Platform is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mission: 'Connecting South African job seekers with opportunities, especially entry-level positions'
      }));

    } else if (path === '/api/jobs/entry-level') {
      // Entry-level jobs endpoint
      let filteredJobs = [...entryLevelJobs];
      
      // Filter by category
      if (query.category) {
        filteredJobs = filteredJobs.filter(job => job.category === query.category);
      }
      
      // Filter by urgent jobs
      if (query.urgent === 'true') {
        filteredJobs = filteredJobs.filter(job => job.urgentHire);
      }
      
      // Filter by location
      if (query.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(query.location.toLowerCase())
        );
      }
      
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Entry-level jobs retrieved successfully',
        data: filteredJobs,
        meta: {
          total: filteredJobs.length,
          urgent: filteredJobs.filter(j => j.urgentHire).length,
          categories: [...new Set(filteredJobs.map(j => j.category))],
          priority: 'Entry-level jobs prioritized for South African job seekers'
        }
      }));

    } else if (path === '/api/stats') {
      // Platform statistics
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Platform statistics',
        data: platformStats,
        focus: 'Prioritizing entry-level opportunities in South Africa'
      }));

    } else if (path === '/api/quick-apply') {
      // Quick apply simulation
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        
        req.on('end', () => {
          try {
            const application = JSON.parse(body);
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              message: 'Application submitted successfully!',
              applicationId: `APP-${Date.now()}`,
              estimatedResponse: '24-48 hours',
              nextSteps: [
                'Your application has been received',
                'Employer will review within 24-48 hours',
                'SMS notification will be sent with updates',
                'Check your profile for status updates'
              ],
              supportedJobTypes: 'Especially welcoming entry-level applications'
            }));
          } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }

    } else if (path === '/') {
      // Root endpoint - Platform info
      res.writeHead(200);
      res.end(JSON.stringify({
        platform: 'AI Job Chommie',
        version: '1.0.0',
        description: '🇿🇦 World-class job search platform for South Africa',
        mission: 'Transforming lives through employment opportunities',
        focus: 'Entry-level jobs for general workers, cleaners, security, food service, and transport',
        endpoints: {
          health: '/health',
          entryLevelJobs: '/api/jobs/entry-level',
          statistics: '/api/stats',
          quickApply: '/api/quick-apply'
        },
        socialImpact: {
          targetAudience: 'Entry-level job seekers in South Africa',
          priorityCategories: ['General Labor', 'Cleaning', 'Security', 'Food Service', 'Transport'],
          accessibility: 'Mobile-first design for users with limited data',
          languages: ['English', 'Afrikaans', 'isiZulu', 'isiXhosa'],
          paymentIntegration: 'Paystack for South African ZAR transactions'
        },
        architecture: {
          monorepo: true,
          packages: ['API (Node.js/TypeScript)', 'Web App (React/Vite)', 'Admin Dashboard', 'Shared Types'],
          infrastructure: 'Docker, PostgreSQL, Redis, AI Integration',
          deployment: 'Cloud-ready with CI/CD pipeline'
        },
        status: 'Demo running - full platform ready for deployment'
      }));

    } else {
      // 404 - Not found
      res.writeHead(404);
      res.end(JSON.stringify({
        error: 'Endpoint not found',
        availableEndpoints: ['/', '/health', '/api/jobs/entry-level', '/api/stats', '/api/quick-apply'],
        platform: 'AI Job Chommie - South African Job Platform'
      }));
    }

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }));
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('\n🚀 AI Job Chommie Platform - Demo Server');
  console.log('==========================================');
  console.log(`🌍 Server running on http://localhost:${PORT}`);
  console.log('🇿🇦 Focused on South African job opportunities');
  console.log('🎯 Prioritizing entry-level positions');
  console.log('\n📋 Available endpoints:');
  console.log(`   • GET  http://localhost:${PORT}/          - Platform info`);
  console.log(`   • GET  http://localhost:${PORT}/health    - Health check`);
  console.log(`   • GET  http://localhost:${PORT}/api/jobs/entry-level - Entry-level jobs`);
  console.log(`   • GET  http://localhost:${PORT}/api/stats - Platform statistics`);
  console.log(`   • POST http://localhost:${PORT}/api/quick-apply - Quick job application`);
  console.log('\n🔍 Try these examples:');
  console.log(`   • curl http://localhost:${PORT}/health`);
  console.log(`   • curl http://localhost:${PORT}/api/jobs/entry-level?urgent=true`);
  console.log(`   • curl http://localhost:${PORT}/api/jobs/entry-level?category=cleaning`);
  console.log(`   • curl http://localhost:${PORT}/api/stats`);
  console.log('\n🎉 Ready to transform South African job searching!');
  console.log('💼 Every job application brings someone closer to employment');
  console.log('\nPress Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down AI Job Chommie demo server...');
  console.log('💪 Keep building opportunities for South African job seekers!');
  process.exit(0);
});
