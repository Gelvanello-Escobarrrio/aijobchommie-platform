# AI Job Chommie Platform - Development Environment Setup (Windows PowerShell)
# World-class development experience with comprehensive tooling

param(
    [switch]$Force,
    [switch]$SkipDocker,
    [switch]$Quiet
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"

function Write-Status {
    param($Message)
    if (-not $Quiet) { Write-Host "[INFO] $Message" -ForegroundColor $Green }
}

function Write-Warning {
    param($Message)
    if (-not $Quiet) { Write-Host "[WARNING] $Message" -ForegroundColor $Yellow }
}

function Write-ErrorMessage {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Header {
    param($Message)
    if (-not $Quiet) {
        Write-Host ""
        Write-Host "[STEP] $Message" -ForegroundColor $Blue
        Write-Host ("=" * 50) -ForegroundColor $Cyan
    }
}

function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Test-NodeVersion {
    param($RequiredVersion)
    
    if (-not (Test-Command "node")) {
        return $false
    }
    
    $nodeVersion = (node --version).TrimStart('v')
    $required = [System.Version]$RequiredVersion
    $current = [System.Version]$nodeVersion
    
    return $current -ge $required
}

# Main setup functions
function Test-Requirements {
    Write-Header "Checking system requirements..."
    
    # Check Node.js
    if (Test-NodeVersion "18.0.0") {
        $nodeVersion = (node --version)
        Write-Status "Node.js version: $nodeVersion "
    }
    else {
        Write-ErrorMessage "Node.js 18.0.0 or higher is required. Please install from https://nodejs.org/"
        exit 1
    }
    
    # Check npm
    if (Test-Command "npm") {
        $npmVersion = (npm --version)
        Write-Status "npm version: $npmVersion "
    }
    else {
        Write-ErrorMessage "npm is not installed"
        exit 1
    }
    
    # Check Git
    if (Test-Command "git") {
        $gitVersion = (git --version).Split(" ")[2]
        Write-Status "Git version: $gitVersion "
    }
    else {
        Write-ErrorMessage "Git is required but not installed"
        exit 1
    }
    
    # Check Docker (optional)
    if (-not $SkipDocker -and (Test-Command "docker")) {
        $dockerVersion = (docker --version).Split(" ")[2].TrimEnd(",")
        Write-Status "Docker version: $dockerVersion "
        $script:DockerAvailable = $true
    }
    else {
        if (-not $SkipDocker) {
            Write-Warning "Docker not found - optional for development but recommended"
        }
        $script:DockerAvailable = $false
    }
    
    # Check PowerShell version
    $psVersion = $PSVersionTable.PSVersion
    Write-Status "PowerShell version: $psVersion "
}

function Install-Dependencies {
    Write-Header "Installing dependencies..."
    
    if (-not (Test-Path "package.json")) {
        Write-ErrorMessage "package.json not found. Make sure you're in the project root directory."
        exit 1
    }
    
    Write-Status "Installing npm dependencies..."
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMessage "Failed to install npm dependencies"
        exit 1
    }
    
    Write-Status "Dependencies installed successfully "
}

function Set-Environment {
    Write-Header "Setting up environment configuration..."
    
    # Root .env file
    if (-not (Test-Path ".env") -or $Force) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env" -Force
            Write-Status "Created root .env file from .env.example"
        }
        else {
            Write-Warning "No .env.example found in root, creating basic .env file"
            @"
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
"@ | Out-File -FilePath ".env" -Encoding UTF8
        }
        Write-Status "Root environment file created "
    }
    else {
        Write-Status "Root .env file already exists "
    }
    
    # API package .env
    if ((Test-Path "packages/api") -and (-not (Test-Path "packages/api/.env") -or $Force)) {
        @"
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
"@ | Out-File -FilePath "packages/api/.env" -Encoding UTF8
        Write-Status "API environment file created "
    }
    
    # Web package .env.local
    if ((Test-Path "packages/web") -and (-not (Test-Path "packages/web/.env.local") -or $Force)) {
        @"
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
"@ | Out-File -FilePath "packages/web/.env.local" -Encoding UTF8
        Write-Status "Web environment file created "
    }
    
    # Admin package .env.local
    if ((Test-Path "packages/admin") -and (-not (Test-Path "packages/admin/.env.local") -or $Force)) {
        @"
# Admin Dashboard Environment
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3002

# Admin-specific configurations
NEXT_PUBLIC_ADMIN_SESSION_TIMEOUT=3600000
NEXT_PUBLIC_ENABLE_SYSTEM_LOGS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
"@ | Out-File -FilePath "packages/admin/.env.local" -Encoding UTF8
        Write-Status "Admin environment file created "
    }
    
    Write-Warning " Remember to update the environment files with your actual API keys and secrets!"
}

function Set-Databases {
    Write-Header "Setting up development databases..."
    
    if ($script:DockerAvailable -and -not $SkipDocker) {
        Write-Status "Starting development services with Docker..."
        
        if (Test-Path "docker-compose.dev.yml") {
            docker-compose -f docker-compose.dev.yml up -d postgres redis
            Start-Sleep -Seconds 5
            Write-Status "PostgreSQL and Redis started via Docker "
        }
        else {
            Write-Warning "docker-compose.dev.yml not found, skipping Docker setup"
        }
    }
    else {
        Write-Warning "Docker not available or skipped. Please ensure PostgreSQL and Redis are running locally:"
        Write-Warning "  - PostgreSQL: localhost:5432 (database: aijobchommie_dev)"
        Write-Warning "  - Redis: localhost:6379"
    }
}

function Set-DatabaseSchema {
    Write-Header "Setting up database schema..."
    
    if (Test-Path "packages/api") {
        Push-Location "packages/api"
        
        try {
            if ((Test-Path "package.json") -and (Get-Content "package.json" | Select-String "prisma")) {
                Write-Status "Generating Prisma client..."
                npx prisma generate
                
                Write-Status "Running database migrations..."
                npx prisma db push
                
                Write-Status "Database schema setup complete "
            }
            else {
                Write-Warning "Prisma not found in API package, skipping database setup"
            }
        }
        finally {
            Pop-Location
        }
    }
}

function Install-DevTools {
    Write-Header "Setting up development tools..."
    
    Write-Status "Checking global npm packages..."
    
    $globalPackages = @("@turbo/gen", "prisma", "typescript", "ts-node", "nodemon")
    
    foreach ($package in $globalPackages) {
        try {
            npm list -g $package 2>$null | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-Status "Installing global package: $package"
                npm install -g $package
            }
        }
        catch {
            Write-Status "Installing global package: $package"
            npm install -g $package
        }
    }
    
    Write-Status "Development tools setup complete "
}

function Test-Setup {
    Write-Header "Verifying installation..."
    
    # Type checking
    Write-Status "Running type checks..."
    try {
        npm run type-check 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "TypeScript type checking passed "
        }
        else {
            Write-Warning "TypeScript type checking failed - check your configuration"
        }
    }
    catch {
        Write-Warning "Could not run type checks"
    }
    
    # Linting
    Write-Status "Running linter..."
    try {
        npm run lint 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Linting passed "
        }
        else {
            Write-Warning "Linting failed - some code quality issues may exist"
        }
    }
    catch {
        Write-Warning "Could not run linter"
    }
    
    # Build test
    Write-Status "Testing build process..."
    try {
        npm run build 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Build process successful "
        }
        else {
            Write-Warning "Build process failed - check package configurations"
        }
    }
    catch {
        Write-Warning "Could not run build test"
    }
}

function Show-NextSteps {
    Write-Header " Development environment setup complete!"
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor $Green
    Write-Host "  1.  Update environment files with your API keys:" -ForegroundColor $Yellow
    Write-Host "     - .env (root configuration)"
    Write-Host "     - packages/api/.env (API configuration)"
    Write-Host "     - packages/web/.env.local (Web app configuration)"
    Write-Host "     - packages/admin/.env.local (Admin dashboard configuration)"
    Write-Host ""
    Write-Host "  2.  Start the development servers:" -ForegroundColor $Yellow
    Write-Host "     npm run dev"
    Write-Host ""
    Write-Host "  3.  Access the applications:" -ForegroundColor $Yellow
    Write-Host "     - Web App: http://localhost:3000"
    Write-Host "     - API: http://localhost:3001"
    Write-Host "     - Admin Dashboard: http://localhost:3002"
    Write-Host ""
    Write-Host "  4.  Read the documentation in the docs/ folder" -ForegroundColor $Yellow
    Write-Host ""
    Write-Host "Happy coding! " -ForegroundColor $Green
}

# Main execution
function Main {
    Write-Host " AI Job Chommie Platform - Development Setup (Windows)" -ForegroundColor $Blue
    Write-Host "=========================================================" -ForegroundColor $Cyan
    Write-Host ""
    
    if (-not $Force -and -not $Quiet) {
        Write-Host "This script will set up your development environment." -ForegroundColor $Yellow
        Write-Host "It will install dependencies, configure environment files, and set up databases." -ForegroundColor $Yellow
        Write-Host ""
        
        $continue = Read-Host "Do you want to continue? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Status "Setup cancelled by user"
            return
        }
    }
    
    try {
        Test-Requirements
        Install-Dependencies
        Set-Environment
        Set-Databases
        Set-DatabaseSchema
        Install-DevTools
        Test-Setup
        Show-NextSteps
    }
    catch {
        Write-ErrorMessage "Setup failed: $($_.Exception.Message)"
        exit 1
    }
}

# Run main function
Main
