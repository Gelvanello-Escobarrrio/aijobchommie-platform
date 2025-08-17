# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 🚀 AI Job Chommie Platform

**AI-powered job search platform built specifically for South Africa** - A complete SaaS solution combining intelligent job matching, seamless applications, and integrated payments, with a focus on entry-level opportunities.

## 🛠️ Development Commands

### Quick Start
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development services (Docker)
npm run docker:dev

# Start all development servers
npm run dev
```

### Core Development Commands
```bash
# Development
npm run dev          # Start all packages in development mode
npm run build        # Build all packages for production
npm run clean        # Clean all build artifacts

# Code Quality
npm run lint         # Lint all packages
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage reports

# Database Operations
npm run db:generate  # Generate Prisma/Drizzle client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database

# Docker Operations
npm run docker:dev   # Start development environment
npm run docker:prod  # Start production environment
```

### Package-Specific Commands
```bash
# Work with specific packages
npm run dev --workspace=@aijobchommie/api     # API only
npm run dev --workspace=@aijobchommie/web     # Web app only
npm run dev --workspace=@aijobchommie/admin   # Admin dashboard only
npm run test --workspace=@aijobchommie/shared # Shared package tests

# Build specific packages
npm run build --workspace=@aijobchommie/api
npm run build --workspace=@aijobchommie/web
```

### Single Test Execution
```bash
# Run specific test files
npm run test packages/api/src/__tests__/auth.test.ts
npm run test packages/web/src/components/JobCard.test.tsx

# Run tests matching pattern
npm run test --testNamePattern="entry-level"
npm run test --testPathPattern="api"
```

### Development URLs
- **API Server**: http://localhost:3001
- **Web Application**: http://localhost:3000  
- **Admin Dashboard**: http://localhost:3002
- **Database Admin (Adminer)**: http://localhost:8080
- **Redis Commander**: http://localhost:8081
- **Email Testing (MailHog)**: http://localhost:8025
- **Grafana Monitoring**: http://localhost:3001 (admin/admin123)
- **Prometheus Metrics**: http://localhost:9090
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601

## 🏗️ Architecture Overview

### Monorepo Structure
This is a **Turborepo monorepo** with the following structure:

```
aijobchommie-platform/
├── apps/
│   ├── admin/          # Admin Dashboard (Vite + React + TypeScript)
│   └── web/            # Main SaaS Application (Vite + React + TypeScript)
├── packages/
│   ├── api/            # Node.js REST API (Express + TypeScript)
│   └── shared/         # Shared types, utilities, and constants
├── docker/             # Docker configurations
├── docs/               # Documentation
└── scripts/            # Development scripts
```

### Technology Stack

#### Backend (`packages/api`)
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with comprehensive middleware
- **Database**: PostgreSQL with Drizzle ORM (type-safe database access)
- **Cache**: Redis for session management and caching
- **Authentication**: JWT with refresh tokens
- **AI Integration**: OpenAI + Hugging Face APIs
- **Payments**: Paystack (South African market focus)
- **File Processing**: Multer + Sharp for image processing
- **Testing**: Jest with supertest for API testing

#### Frontend (`apps/web` & `apps/admin`)
- **Framework**: Vite + React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components + Radix UI primitives
- **State Management**: Zustand + TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts for analytics
- **Build Tool**: Vite with SWC for fast builds

#### Shared (`packages/shared`)
- **Types**: Comprehensive TypeScript definitions for entire platform
- **Utilities**: Common functions for validation, formatting, API handling
- **Constants**: Application constants, South African job market data
- **Validation**: Zod schemas for data validation across packages

### Key Architectural Patterns

#### API Design
- **RESTful endpoints** with consistent response structure
- **Route-based organization** (`/api/v1/entry-level/*`)
- **Priority routing** - Entry-level job endpoints take precedence
- **Comprehensive error handling** with structured error responses
- **Rate limiting** and security middleware (helmet, CORS)

#### Frontend Architecture  
- **Component-driven development** with shadcn/ui base components
- **Lazy loading** for all pages and heavy components
- **Route-based code splitting** with React.lazy()
- **Context providers** for auth, theme, notifications, i18n
- **Custom hooks** for data fetching and state management

#### State Management
- **Zustand** for global state (lightweight, TypeScript-friendly)
- **TanStack Query** for server state and caching
- **React Context** for feature-specific state (auth, theme)
- **Form state** managed by React Hook Form

#### Data Flow
1. **User interaction** → React components
2. **API calls** → TanStack Query → Express routes  
3. **Business logic** → Service layer → Database (PostgreSQL)
4. **Caching** → Redis for frequently accessed data
5. **Real-time updates** → WebSocket connections where needed

## 🎯 South African Market Focus

This platform is specifically designed for the South African job market with:

- **Entry-level job prioritization** - Special routing and filtering for entry-level opportunities
- **Quick application system** - Optimized for immediate job applications
- **Local payment integration** - Paystack for ZAR transactions
- **Multi-language support** - English and Afrikaans planned
- **Mobile-first design** - Optimized for South African mobile usage patterns
- **Regional job categories** - Tailored to SA employment sectors

### Priority Job Categories
The platform prioritizes these entry-level categories:
- General Labour (highest priority)
- Cleaning & Domestic Services
- Security & Safety
- Food Service
- Retail & Customer Service
- Transport & Delivery

## 🔧 Development Guidelines

### Code Organization
- **API routes** in `packages/api/src/routes/` - organized by feature
- **Shared utilities** in `packages/shared/src/utils/`
- **Type definitions** in `packages/shared/src/types/`
- **Constants** in `packages/shared/src/constants/`
- **React components** in `apps/{web|admin}/src/components/`

### Key Development Practices
- **TypeScript strict mode** - All packages use strict TypeScript
- **Zod validation** - All data validation uses Zod schemas
- **Error boundaries** - React error boundaries for graceful error handling
- **Responsive design** - Mobile-first approach with Tailwind CSS
- **Accessibility** - WCAG compliance for South African users
- **Testing required** - Unit tests for services, integration tests for APIs
- **ESLint + Prettier** - Consistent code formatting across packages

### Environment Configuration
- **Development**: Uses Docker Compose for services (PostgreSQL, Redis, etc.)
- **Environment files**: `.env.example` shows all required variables
- **Database**: Drizzle ORM with migrations in `packages/api/drizzle/`
- **Caching**: Redis for sessions, API responses, and job search results

### AI Integration
- **OpenAI**: For resume analysis and job matching
- **Hugging Face**: For skills extraction and text processing
- **Configurable providers**: Easy to switch between AI services

### Security Features
- **JWT authentication** with refresh token rotation
- **Password hashing** with bcrypt
- **Input validation** and sanitization at all entry points
- **CORS protection** with environment-specific origins
- **Rate limiting** on all API endpoints
- **File upload security** with type and size validation

## 📊 Monitoring & Observability

The platform includes comprehensive monitoring:
- **Health checks** at `/api/v1/health` with business metrics
- **Prometheus** metrics collection
- **Grafana** dashboards for visualization  
- **Jaeger** for distributed tracing
- **Custom logging** with Winston
- **Error tracking** with Sentry integration

## 🚀 Deployment Notes

- **Docker** containerization for all services
- **Environment-specific** configurations
- **Database migrations** run automatically on deployment
- **Static asset optimization** with Vite build
- **CDN-ready** for South African edge locations

## 🔍 Key Files to Reference

- **API Routes**: `packages/api/src/routes/entry-level.ts` (main job search logic)
- **Shared Types**: `packages/shared/src/types/` (comprehensive type system)
- **Constants**: `packages/shared/src/constants/south-africa.ts` (SA market data)
- **Main App**: `apps/web/src/App.tsx` (frontend routing and structure)
- **Environment**: `.env.example` (required configuration)
- **Docker Setup**: `docker-compose.dev.yml` (local development services)

## 📚 Documentation References

- **Contributing Guide**: `CONTRIBUTING.md` - Detailed contribution guidelines
- **Security Policy**: `SECURITY.md` - Security practices and reporting
- **API Documentation**: Generated from route comments and schemas
- **Component Library**: Built on shadcn/ui with custom SA-specific components
