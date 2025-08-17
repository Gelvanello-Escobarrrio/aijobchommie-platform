<div align="center">
  <img src="https://github.com/FernandoSteyn/aijobchommie-platform/assets/logos/aijobchommie-logo.png" alt="AI Job Chommie" width="200" height="200" />
  
  # 🚀 AI Job Chommie Platform
  
  ### **World-Class AI-Powered Job Search Platform for South Africa**
  
  *A complete enterprise SaaS solution combining intelligent job matching, seamless applications, AI-driven insights, and integrated payments - specifically designed for the South African job market.*
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
  [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
  [![Made in South Africa](https://img.shields.io/badge/Made%20in-South%20Africa-green?style=for-the-badge&flag=🇿🇦)](https://en.wikipedia.org/wiki/South_Africa)
  
  [🌟 **Live Demo**](https://aijobchommie.co.za) • [📚 **API Docs**](#-restful-api-documentation) • [🚀 **Get Started**](#-quick-start) • [📖 **Full Docs**](./docs/)
  
</div>

---

## 🌍 **Overview**

AI Job Chommie Platform is a **world-class, enterprise-grade SaaS solution** that revolutionizes job searching and recruitment in South Africa. Built with cutting-edge AI technology and modern web architecture, this platform serves three distinct user groups with tailored experiences:

- 🔍 **Job Seekers**: AI-powered job matching, resume optimization, and career insights
- 🏢 **Employers**: Intelligent candidate screening, job posting management, and hiring analytics
- ⚙️ **Administrators**: Comprehensive platform management with advanced analytics

### 🎯 **Why AI Job Chommie?**

- **🇿🇦 South African Focus**: Built specifically for the SA job market with local payment integration (Paystack)
- **🤖 AI-Powered**: Advanced OpenAI and Hugging Face integration for intelligent job matching
- **⚡ Lightning Fast**: Modern React + TypeScript frontend with optimized performance
- **🛡️ Enterprise Security**: JWT authentication, role-based access, and comprehensive data protection
- **📱 Mobile-First**: Responsive design optimized for South African mobile usage patterns
- **🚀 Production-Ready**: Complete Docker infrastructure with monitoring and analytics

## ✨ **World-Class Features**

### 🔍 **For Job Seekers**
- 🤖 **AI-Powered Job Matching** - Intelligent recommendations using OpenAI and Hugging Face
- 📄 **Smart Resume Analysis** - AI-driven resume optimization and keyword matching
- 🔔 **Personalized Job Alerts** - Real-time notifications for relevant opportunities
- 📊 **Application Tracking** - Complete application lifecycle with status updates
- 📈 **Career Analytics** - Track job search progress and success metrics
- 💳 **Premium Subscriptions** - Advanced features with Paystack ZAR integration
- 🎯 **One-Click Apply** - Streamlined application process with auto-fill
- 📱 **Mobile Optimization** - Perfect experience on all South African networks

### 🏢 **For Employers**
- 🏆 **Company Profiles** - Showcase organization culture and values
- ⚡ **Job Posting Management** - Easy-to-use creation and management tools
- 🧠 **AI Candidate Screening** - Intelligent candidate evaluation and ranking
- 📊 **Hiring Analytics** - Track job performance and candidate quality metrics
- 💰 **Flexible Pricing** - Pay-per-post or subscription models in ZAR
- 🔍 **Advanced Search** - Find candidates with specific skills and experience
- 📧 **Communication Tools** - Built-in messaging and interview scheduling

### ⚙️ **For Administrators**
- 🖥️ **Platform Management** - Complete admin dashboard with real-time monitoring
- 📊 **Advanced Analytics** - User engagement, job performance, and revenue insights
- 👥 **User Management** - Account administration and comprehensive support tools
- 💳 **Payment Oversight** - Transaction monitoring and financial reporting
- 🛡️ **Security Dashboard** - Monitor security events and system health
- 📈 **Business Intelligence** - Advanced reporting and data visualization

## 🏗️ **World-Class Architecture**

Built as a **production-grade monorepo** using cutting-edge technologies and enterprise best practices:

```
aijobchommie-platform/
├── apps/
│   └── web/              # React + Vite SaaS Application
├── packages/
│   ├── api/              # Express.js REST API + TypeScript
│   └── shared/           # Shared types, utilities & validation
├── docker/               # Multi-stage Docker configurations
├── docs/                 # Comprehensive documentation
├── scripts/              # Automation and deployment scripts
└── .github/workflows     # CI/CD pipelines with GitHub Actions
```

## 🌐 **RESTful API Documentation**

Our **world-class REST API** powers the entire platform with enterprise-grade features:

### 🚀 **API Base URL**
```
Development:  http://localhost:3001/api/v1
Production:   https://api.aijobchommie.co.za/api/v1
```

### 🔐 **Authentication**
The API uses **JWT Bearer tokens** with refresh token rotation for maximum security:

```bash
# Include in all authenticated requests
Authorization: Bearer <your-access-token>
Content-Type: application/json
```

### 📚 **Core API Endpoints**

#### 🔑 **Authentication Endpoints**
```http
POST   /auth/register          # Register new user
POST   /auth/login             # User login
POST   /auth/refresh           # Refresh access token
POST   /auth/logout            # User logout
GET    /auth/me                # Get current user profile
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password with token
```

#### 💼 **Job Management Endpoints**
```http
GET    /jobs                   # List all jobs (with filters)
POST   /jobs                   # Create new job (employers only)
GET    /jobs/:id               # Get job details
PUT    /jobs/:id               # Update job (employers only)
DELETE /jobs/:id               # Delete job (employers only)
GET    /jobs/categories        # Get job categories
GET    /jobs/featured          # Get featured jobs
GET    /jobs/search            # Advanced job search with AI
POST   /jobs/:id/apply         # Apply to job
GET    /jobs/stats             # Job statistics (admin only)
```

#### 👤 **User Management Endpoints**
```http
GET    /users/profile          # Get user profile
PUT    /users/profile          # Update user profile
POST   /users/avatar           # Upload profile picture
GET    /users/applications     # Get user's job applications
GET    /users/saved-jobs       # Get saved jobs
POST   /users/save-job/:id     # Save/unsave job
GET    /users/analytics        # User career analytics
```

#### 📄 **Application Management**
```http
GET    /applications           # List applications (filtered by user)
POST   /applications           # Submit job application
GET    /applications/:id       # Get application details
PUT    /applications/:id       # Update application status
DELETE /applications/:id       # Withdraw application
```

#### 💳 **Payment & Subscription Endpoints**
```http
POST   /payments/initialize    # Initialize Paystack payment
POST   /payments/verify        # Verify payment status
GET    /payments/history       # Get payment history
POST   /payments/webhook       # Paystack webhook handler
GET    /subscriptions          # Get user subscriptions
POST   /subscriptions/upgrade  # Upgrade subscription plan
```

#### 📁 **File Upload Endpoints**
```http
POST   /files/upload           # Upload files (resume, images)
GET    /files/download/:id     # Download file
GET    /files/                 # List user files
DELETE /files/:id              # Delete file
POST   /files/analyze-resume   # AI resume analysis
```

#### ⚙️ **Admin Endpoints**
```http
GET    /admin/dashboard        # Admin dashboard data
GET    /admin/users            # Manage users
GET    /admin/jobs             # Manage jobs
GET    /admin/analytics        # Platform analytics
GET    /admin/payments         # Payment overview
POST   /admin/users/:id/ban    # Ban/unban users
```

### 📊 **API Request/Response Examples**

#### **Create Job Posting**
```http
POST /api/v1/jobs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Senior React Developer",
  "company": "AI Job Chommie",
  "location": "Cape Town, Western Cape",
  "province": "Western Cape",
  "description": "We're looking for a senior React developer...",
  "requirements": [
    "5+ years React experience",
    "TypeScript proficiency",
    "South African citizen or valid work permit"
  ],
  "jobType": "full-time",
  "category": "Technology",
  "salaryMin": 45000,
  "salaryMax": 65000,
  "salaryCurrency": "ZAR",
  "isRemote": false,
  "contactEmail": "jobs@aijobchommie.co.za"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Senior React Developer",
    "company": "AI Job Chommie",
    "location": "Cape Town, Western Cape",
    "province": "Western Cape",
    "isActive": true,
    "isFeatured": false,
    "viewCount": 0,
    "applicationCount": 0,
    "postedAt": "2024-01-20T10:30:00.000Z",
    "expiresAt": "2024-02-20T10:30:00.000Z"
  }
}
```

#### **Advanced Job Search with AI**
```http
GET /api/v1/jobs/search?q=react+developer&location=cape+town&salary_min=40000&ai_match=true
```

**Response:**
```json
{
  "success": true,
  "message": "Jobs found successfully",
  "data": {
    "jobs": [...],
    "total": 45,
    "page": 1,
    "limit": 20,
    "ai_insights": {
      "recommended_skills": ["React", "TypeScript", "Node.js"],
      "salary_analysis": {
        "average": 52500,
        "range": { "min": 35000, "max": 85000 }
      },
      "location_insights": {
        "top_locations": ["Cape Town", "Johannesburg", "Durban"]
      }
    }
  }
}
```

### 🔥 **Advanced API Features**

- **🤖 AI Integration**: OpenAI and Hugging Face powered job matching
- **🔍 Advanced Search**: Elasticsearch-powered semantic search
- **📊 Real-time Analytics**: Live job performance and user metrics
- **💳 Paystack Integration**: Complete ZAR payment processing
- **📁 File Processing**: AI-powered resume parsing and analysis
- **🔔 Real-time Notifications**: WebSocket-based live updates
- **📧 Email Integration**: Automated notifications and alerts
- **📱 SMS Integration**: South African SMS providers support
- **🔐 Enterprise Security**: Rate limiting, CORS, validation, monitoring
- **📈 Comprehensive Logging**: Winston with structured logging

### 📋 **API Status Codes**

| Code | Status | Description |
|------|---------|-------------|
| 200  | OK | Request successful |
| 201  | Created | Resource created successfully |
| 400  | Bad Request | Invalid request data |
| 401  | Unauthorized | Invalid or missing authentication |
| 403  | Forbidden | Insufficient permissions |
| 404  | Not Found | Resource not found |
| 409  | Conflict | Resource already exists |
| 422  | Unprocessable Entity | Validation errors |
| 429  | Too Many Requests | Rate limit exceeded |
| 500  | Internal Server Error | Server error |

### 🛡️ **API Security & Rate Limiting**

- **Rate Limits**: 1000 requests per 15 minutes per IP
- **Authentication**: JWT with 24h access tokens, 7d refresh tokens
- **Validation**: Comprehensive Zod schema validation
- **CORS**: Configured for production security
- **Helmet**: Security headers protection
- **File Upload**: 10MB limit with type validation

Technology Stack

### Backend (`packages/api`)
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with advanced middleware
- **Database**: PostgreSQL with Supabase
- **ORM**: Prisma for type-safe database access
- **Cache**: Redis for session management and caching
- **AI Integration**: Hugging Face + OpenAI APIs
- **Payments**: Paystack (South African market)
- **Authentication**: JWT with refresh tokens
- **File Uploads**: Multer with image processing
- **Testing**: Jest with comprehensive test coverage

### Frontend (`packages/web`)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts for analytics

### Admin Dashboard (`packages/admin`)
- **Framework**: Next.js 14 with TypeScript
- **UI Components**: shadcn/ui with custom admin themes
- **Data Tables**: TanStack Table for complex data management
- **Charts**: Multiple chart libraries for comprehensive analytics

### Shared (`packages/shared`)
- **Types**: Comprehensive TypeScript definitions
- **Components**: Reusable UI component library
- **Utilities**: Common functions and helpers
- **Validation**: Zod schemas for data validation

## 🚀 **Quick Start**

### ⚙️ **Prerequisites**
- **Node.js** 18.17.0+ ([Download](https://nodejs.org/))
- **npm** 9.6.7+ (comes with Node.js)
- **Docker** (optional) ([Download](https://docker.com/))
- **PostgreSQL** or **Supabase** account ([Get Started](https://supabase.com/))
- **Redis** (optional, for caching)

### 💻 **Installation**

```bash
# 1️⃣ Clone the repository
git clone https://github.com/FernandoSteyn/aijobchommie-platform.git
cd aijobchommie-platform

# 2️⃣ Install dependencies
npm install

# 3️⃣ Validate project setup
npm run validate

# 4️⃣ Set up environment (copies .env.example to .env)
npm run setup

# 5️⃣ Configure your .env file with your credentials
# Edit .env with your database, API keys, and other settings

# 6️⃣ Set up the database
npm run db:generate    # Generate database schema
npm run db:migrate     # Run database migrations

# 7️⃣ Start the development servers
npm run dev
```

### 🎆 **You're Ready!**

Your world-class AI job platform is now running:

- 🌐 **Web App**: http://localhost:3000 - Main SaaS application
- 📡 **API Server**: http://localhost:3001 - RESTful API with AI features
- 📊 **API Docs**: http://localhost:3001/api/v1 - Interactive API documentation
- ⚙️ **Health Check**: http://localhost:3001/health - System status

### 🐳 **Docker Quick Start**

```bash
# Start entire development stack with Docker
npm run docker:dev

# Or for production deployment
npm run docker:prod
```

This includes PostgreSQL, Redis, monitoring, and all services!

Development

### Available Scripts

```bash
# Development
npm run dev          # Start all packages in development mode
npm run build        # Build all packages
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run type-check   # TypeScript type checking

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database

# Docker
npm run docker:dev   # Start development environment
npm run docker:prod  # Start production environment

# Code Quality
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Project Structure

```
packages/
├── api/                 # Backend API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── middleware/ # Express middleware
│   │   ├── services/   # Business logic
│   │   ├── models/     # Data models
│   │   └── utils/      # Utility functions
│   ├── prisma/         # Database schema and migrations
│   └── tests/          # API tests
├── web/                 # Main SaaS Application
│   ├── app/            # Next.js 14 app directory
│   ├── components/     # React components
│   ├── lib/            # Utilities and configurations
│   └── public/         # Static assets
├── admin/               # Admin Dashboard
│   ├── app/            # Admin-specific pages
│   ├── components/     # Admin components
│   └── lib/            # Admin utilities
└── shared/              # Shared code
    ├── types/          # TypeScript definitions
    ├── components/     # Reusable components
    └── utils/          # Common utilities
```

South African Market Focus

This platform is specifically designed for the South African job market:

- **Local Payment Integration**: Paystack for secure ZAR transactions
- **Regional Job Categories**: Tailored to SA employment sectors
- **Multi-language Support**: English and Afrikaans
- **Local Employment Laws**: Compliance with SA labor regulations
- **Mobile-First Design**: Optimized for South African mobile usage patterns

Security Features

- **Authentication**: JWT tokens with refresh mechanisms
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row-level security with Supabase
- **Input Validation**: Comprehensive Zod schema validation
- **Rate Limiting**: API protection against abuse
- **CORS Protection**: Configured for production security
- **File Upload Security**: Type validation and size limits
- **Password Security**: Bcrypt hashing with strong policies

Performance Optimizations

- **Caching Strategy**: Redis for session and data caching
- **Database Indexing**: Optimized queries with proper indexing
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Sharp for image processing and compression
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Lazy Loading**: Components and routes loaded on demand

Testing

We maintain high test coverage across all packages:

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test --workspace=@aijobchommie/api

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Deployment

### Production Build

```bash
npm run build
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up
```

### Environment Variables

See `.env.example` for required environment variables:

- **Database**: Supabase connection strings
- **Authentication**: JWT secrets
- **AI Services**: Hugging Face and OpenAI API keys
- **Payments**: Paystack credentials
- **Storage**: File upload configurations
- **Email**: SMTP settings for notifications

Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/FernandoSteyn/aijobchommie-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FernandoSteyn/aijobchommie-platform/discussions)

Acknowledgments

- Built with ❤️ for the South African job market
- Powered by cutting-edge AI technology
- Designed for scalability and performance

---

**Made in South Africa 🇿🇦 by Fernando Steyn**
