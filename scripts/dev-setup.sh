#!/bin/bash

# AI Job Chommie Platform - Development Environment Setup
# World-class development experience with comprehensive tooling

set -e

echo "🚀 AI Job Chommie Platform - Development Setup"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check system requirements
check_requirements() {
    print_header "Checking system requirements..."
    
    # Check Node.js version
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_NODE="18.0.0"
        if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]; then
            print_error "Node.js $REQUIRED_NODE or higher is required. Current version: $NODE_VERSION"
            exit 1
        fi
        print_status "Node.js version: $NODE_VERSION ✅"
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check npm version
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_status "npm version: $NPM_VERSION ✅"
    else
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker >/dev/null 2>&1; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_status "Docker version: $DOCKER_VERSION ✅"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker not found - optional for development but recommended"
        DOCKER_AVAILABLE=false
    fi
    
    # Check Git
    if command -v git >/dev/null 2>&1; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_status "Git version: $GIT_VERSION ✅"
    else
        print_error "Git is required but not installed"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Make sure you're in the project root directory."
        exit 1
    fi
    
    print_status "Installing npm dependencies..."
    npm install
    
    print_status "Dependencies installed successfully ✅"
}

# Set up environment files
setup_environment() {
    print_header "Setting up environment configuration..."
    
    # Root .env file
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_status "Created root .env file from .env.example"
        else
            print_warning "No .env.example found in root, creating basic .env file"
            cat > .env << 'EOF'
# AI Job Chommie Platform - Environment Configuration
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/aijobchommie_dev
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret_key_here_make_it_secure
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Redis
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_TOKEN=your_huggingface_token

# Payments
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# Development
API_PORT=3001
WEB_PORT=3000
ADMIN_PORT=3002
EOF
        fi
        print_status "Root environment file created ✅"
    else
        print_status "Root .env file already exists ✅"
    fi
    
    # API package .env
    if [ -d "packages/api" ] && [ ! -f "packages/api/.env" ]; then
        cat > packages/api/.env << 'EOF'
# API Package Environment
PORT=3001
NODE_ENV=development

# Inherit from root .env or override here
DATABASE_URL=postgresql://postgres:password@localhost:5432/aijobchommie_dev
JWT_SECRET=your_jwt_secret_key_here_make_it_secure

# API-specific configurations
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
EOF
        print_status "API environment file created ✅"
    fi
    
    # Web package .env.local
    if [ -d "packages/web" ] && [ ! -f "packages/web/.env.local" ]; then
        cat > packages/web/.env.local << 'EOF'
# Web Application Environment
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Public keys (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=
NEXT_PUBLIC_HOTJAR_ID=

# Feature flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_PREMIUM_FEATURES=true
EOF
        print_status "Web environment file created ✅"
    fi
    
    # Admin package .env.local
    if [ -d "packages/admin" ] && [ ! -f "packages/admin/.env.local" ]; then
        cat > packages/admin/.env.local << 'EOF'
# Admin Dashboard Environment
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3002

# Admin-specific configurations
NEXT_PUBLIC_ADMIN_SESSION_TIMEOUT=3600000
NEXT_PUBLIC_ENABLE_SYSTEM_LOGS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
EOF
        print_status "Admin environment file created ✅"
    fi
    
    print_warning "🔐 Remember to update the environment files with your actual API keys and secrets!"
}

# Set up development databases
setup_databases() {
    print_header "Setting up development databases..."
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        print_status "Starting development services with Docker..."
        
        if [ -f "docker-compose.dev.yml" ]; then
            docker-compose -f docker-compose.dev.yml up -d postgres redis
            sleep 5 # Wait for services to start
            print_status "PostgreSQL and Redis started via Docker ✅"
        else
            print_warning "docker-compose.dev.yml not found, skipping Docker setup"
        fi
    else
        print_warning "Docker not available. Please ensure PostgreSQL and Redis are running locally:"
        print_warning "  - PostgreSQL: localhost:5432 (database: aijobchommie_dev)"
        print_warning "  - Redis: localhost:6379"
    fi
}

# Generate database schema
setup_database_schema() {
    print_header "Setting up database schema..."
    
    if [ -d "packages/api" ]; then
        cd packages/api
        
        if [ -f "package.json" ] && grep -q "prisma" package.json; then
            print_status "Generating Prisma client..."
            npx prisma generate
            
            print_status "Running database migrations..."
            npx prisma db push
            
            print_status "Database schema setup complete ✅"
        else
            print_warning "Prisma not found in API package, skipping database setup"
        fi
        
        cd ../..
    fi
}

# Install development tools
setup_dev_tools() {
    print_header "Setting up development tools..."
    
    # Install global development dependencies if needed
    print_status "Checking global npm packages..."
    
    # List of useful global packages for development
    GLOBAL_PACKAGES=("@turbo/gen" "prisma" "typescript" "ts-node" "nodemon")
    
    for package in "${GLOBAL_PACKAGES[@]}"; do
        if ! npm list -g "$package" >/dev/null 2>&1; then
            print_status "Installing global package: $package"
            npm install -g "$package"
        fi
    done
    
    print_status "Development tools setup complete ✅"
}

# Verify installation
verify_setup() {
    print_header "Verifying installation..."
    
    # Check if all packages can be built
    print_status "Running type checks..."
    if npm run type-check >/dev/null 2>&1; then
        print_status "TypeScript type checking passed ✅"
    else
        print_warning "TypeScript type checking failed - check your configuration"
    fi
    
    # Check if linting passes
    print_status "Running linter..."
    if npm run lint >/dev/null 2>&1; then
        print_status "Linting passed ✅"
    else
        print_warning "Linting failed - some code quality issues may exist"
    fi
    
    # Test build
    print_status "Testing build process..."
    if npm run build >/dev/null 2>&1; then
        print_status "Build process successful ✅"
    else
        print_warning "Build process failed - check package configurations"
    fi
}

# Main setup flow
main() {
    echo "Setting up AI Job Chommie Platform development environment..."
    echo "This script will:"
    echo "  ✨ Check system requirements"
    echo "  📦 Install dependencies"
    echo "  ⚙️  Configure environment files"
    echo "  🗄️  Set up development databases"
    echo "  🛠️  Install development tools"
    echo "  ✅ Verify the installation"
    echo
    
    read -p "Do you want to continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled by user"
        exit 0
    fi
    
    check_requirements
    install_dependencies
    setup_environment
    setup_databases
    setup_database_schema
    setup_dev_tools
    verify_setup
    
    echo
    print_header "🎉 Development environment setup complete!"
    echo
    echo "Next steps:"
    echo "  1. 📝 Update environment files with your API keys:"
    echo "     - .env (root configuration)"
    echo "     - packages/api/.env (API configuration)"
    echo "     - packages/web/.env.local (Web app configuration)"
    echo "     - packages/admin/.env.local (Admin dashboard configuration)"
    echo
    echo "  2. 🚀 Start the development servers:"
    echo "     npm run dev"
    echo
    echo "  3. 🌐 Access the applications:"
    echo "     - Web App: http://localhost:3000"
    echo "     - API: http://localhost:3001"
    echo "     - Admin Dashboard: http://localhost:3002"
    echo
    echo "  4. 📚 Read the documentation in the docs/ folder"
    echo
    echo "Happy coding! 🚀"
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
