#  Deployment Guide

This guide covers deploying the AI Job Chommie Platform to production and staging environments. Our platform is designed for high availability, scalability, and optimal performance for South African users.

##  Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Setup](#database-setup)
- [Security Configuration](#security-configuration)
- [Monitoring & Observability](#monitoring--observability)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

##  Overview

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │   Web Frontend  │
│    (nginx)      │────│   (API Server)  │────│   (React/Next)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         │              │    (Cache)      │              │
         │              └─────────────────┘              │
         │                       │                       │
         └─────────────────┐     │     ┌─────────────────┘
                          │     │     │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Database)    │
                    └─────────────────┘
```

### Deployment Options

1. **Docker Compose** (Recommended for small-scale)
2. **Kubernetes** (Recommended for enterprise-scale)
3. **Cloud Services** (Azure App Service, AWS ECS, Google Cloud Run)
4. **VPS/Dedicated Server** (Manual configuration)

##  Prerequisites

### System Requirements

**Minimum Production Requirements:**
- **CPU**: 4 vCPUs
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **Network**: 1 Gbps connection
- **OS**: Ubuntu 22.04 LTS (recommended) or CentOS 8

**Recommended Production Requirements:**
- **CPU**: 8 vCPUs
- **RAM**: 16 GB
- **Storage**: 200 GB NVMe SSD
- **Network**: 10 Gbps connection
- **OS**: Ubuntu 22.04 LTS

### Software Dependencies

- **Docker**: 20.10+ and Docker Compose 2.0+
- **Node.js**: 18.17+ (if running without containers)
- **PostgreSQL**: 14+ (or managed database service)
- **Redis**: 7+ (or managed cache service)
- **nginx**: 1.20+ (reverse proxy and load balancer)

### Domain & SSL

- Registered domain name (e.g., `aijobchommie.co.za`)
- SSL certificate (Let's Encrypt recommended)
- DNS configuration for subdomains:
  - `api.aijobchommie.co.za` → API server
  - `admin.aijobchommie.co.za` → Admin dashboard
  - `www.aijobchommie.co.za` → Web frontend

##  Environment Setup

### Production Environment Variables

Create a comprehensive `.env.production` file:

```bash
# Core Application
NODE_ENV=production
API_PORT=3001
WEB_PORT=3000
ADMIN_PORT=3002

# Database (Use managed service in production)
DATABASE_URL=postgresql://username:password@prod-db-host:5432/aijobchommie
DATABASE_SSL=true
DATABASE_POOL_SIZE=20

# Redis (Use managed service in production)
REDIS_URL=redis://username:password@prod-redis-host:6379
REDIS_TLS=true

# JWT & Security
JWT_SECRET=your_super_secure_production_jwt_secret_256_bits_minimum
JWT_REFRESH_SECRET=your_super_secure_production_refresh_secret_256_bits
SESSION_SECRET=your_super_secure_session_secret_256_bits_minimum

# API Configuration
CORS_ORIGIN=https://aijobchommie.co.za,https://admin.aijobchommie.co.za
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# SSL & Security Headers
FORCE_HTTPS=true
TRUST_PROXY=true
HELMET_CSP_ENABLED=true

# External Services
OPENAI_API_KEY=your_production_openai_key
HUGGINGFACE_API_TOKEN=your_production_huggingface_token
PAYSTACK_SECRET_KEY=sk_live_your_live_paystack_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_paystack_key

# Monitoring
SENTRY_DSN=your_production_sentry_dsn
LOG_LEVEL=warn
ENABLE_PROMETHEUS_METRICS=true

# Email (Production SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
FROM_EMAIL=noreply@aijobchommie.co.za

# File Storage (AWS S3 in production)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=af-south-1
AWS_S3_BUCKET=aijobchommie-prod-uploads
```

### Staging Environment

For staging environments, use `.env.staging` with similar configuration but separate resources:

```bash
# Use staging/test API keys
PAYSTACK_SECRET_KEY=sk_test_your_test_paystack_key
OPENAI_API_KEY=your_development_openai_key

# Use staging database
DATABASE_URL=postgresql://username:password@staging-db-host:5432/aijobchommie_staging

# Enable debug logging
LOG_LEVEL=debug
```

##  Docker Deployment

### Production Docker Compose

Create `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  # API Server
  api:
    build:
      context: .
      dockerfile: packages/api/Dockerfile
      target: production
    restart: unless-stopped
    ports:
      - "3001:3001"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

  # Web Frontend
  web:
    build:
      context: .
      dockerfile: packages/web/Dockerfile
      target: production
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  # Admin Dashboard
  admin:
    build:
      context: .
      dockerfile: packages/admin/Dockerfile
      target: production
    restart: unless-stopped
    ports:
      - "3002:3002"
    env_file:
      - .env.production
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: aijobchommie
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 30s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'

  # Redis Cache
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

  # nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - web
      - api
      - admin
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

  # Monitoring (Prometheus)
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  # Monitoring (Grafana)
  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
```

### Deployment Commands

```bash
# Build and deploy
docker-compose -f docker-compose.production.yml up -d --build

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Update services
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d

# Backup database
docker-compose -f docker-compose.production.yml exec postgres \
  pg_dump -U ${DB_USER} aijobchommie > backup_$(date +%Y%m%d_%H%M%S).sql

# Scale services
docker-compose -f docker-compose.production.yml up -d --scale api=3 --scale web=2
```

##  Cloud Deployment

### Azure App Service

#### 1. Azure Container Registry

```bash
# Login to Azure
az login

# Create resource group
az group create --name aijobchommie-rg --location "South Africa North"

# Create container registry
az acr create --resource-group aijobchommie-rg \
  --name aijobchommieacr --sku Standard

# Build and push images
az acr build --registry aijobchommieacr \
  --image aijobchommie/api:latest \
  --file packages/api/Dockerfile .

az acr build --registry aijobchommieacr \
  --image aijobchommie/web:latest \
  --file packages/web/Dockerfile .
```

#### 2. App Service Deployment

```bash
# Create App Service plan
az appservice plan create \
  --name aijobchommie-plan \
  --resource-group aijobchommie-rg \
  --is-linux \
  --sku P1V2

# Create web app for API
az webapp create \
  --resource-group aijobchommie-rg \
  --plan aijobchommie-plan \
  --name aijobchommie-api \
  --deployment-container-image-name aijobchommieacr.azurecr.io/aijobchommie/api:latest

# Configure app settings
az webapp config appsettings set \
  --resource-group aijobchommie-rg \
  --name aijobchommie-api \
  --settings @azure-app-settings.json
```

### AWS ECS Deployment

#### 1. ECS Cluster Setup

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name aijobchommie-cluster

# Create task definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json

# Create service
aws ecs create-service \
  --cluster aijobchommie-cluster \
  --service-name aijobchommie-api \
  --task-definition aijobchommie-api:1 \
  --desired-count 2
```

#### 2. Application Load Balancer

```bash
# Create load balancer
aws elbv2 create-load-balancer \
  --name aijobchommie-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678

# Create target group
aws elbv2 create-target-group \
  --name aijobchommie-targets \
  --protocol HTTP \
  --port 3001 \
  --vpc-id vpc-12345678 \
  --target-type ip
```

### Google Cloud Run

```bash
# Build and submit container
gcloud builds submit --tag gcr.io/PROJECT_ID/aijobchommie-api packages/api

# Deploy to Cloud Run
gcloud run deploy aijobchommie-api \
  --image gcr.io/PROJECT_ID/aijobchommie-api \
  --platform managed \
  --region africa-south1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production"
```

##  Database Setup

### PostgreSQL Production Setup

#### Managed Database Services (Recommended)

**Azure Database for PostgreSQL:**
```bash
az postgres flexible-server create \
  --resource-group aijobchommie-rg \
  --name aijobchommie-db \
  --location "South Africa North" \
  --admin-user dbadmin \
  --admin-password ${DB_PASSWORD} \
  --sku-name Standard_D2s_v3 \
  --tier GeneralPurpose \
  --version 14
```

**AWS RDS:**
```bash
aws rds create-db-instance \
  --db-instance-identifier aijobchommie-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 14.9 \
  --allocated-storage 100 \
  --storage-encrypted \
  --db-name aijobchommie \
  --master-username dbadmin \
  --master-user-password ${DB_PASSWORD}
```

#### Self-Managed PostgreSQL

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql-14 postgresql-contrib

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE aijobchommie;
CREATE USER aijobchommie_user WITH PASSWORD '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE aijobchommie TO aijobchommie_user;
ALTER USER aijobchommie_user CREATEDB;
EOF

# Configure PostgreSQL for production
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/14/main/postgresql.conf
sudo sed -i "s/#max_connections = 100/max_connections = 200/" /etc/postgresql/14/main/postgresql.conf
sudo sed -i "s/#shared_buffers = 128MB/shared_buffers = 256MB/" /etc/postgresql/14/main/postgresql.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Database Migrations

```bash
# Run migrations in production
cd packages/api
npm run db:migrate:deploy

# Seed initial data (if needed)
npm run db:seed:production
```

### Database Backup Strategy

```bash
#!/bin/bash
# backup-database.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="aijobchommie"

# Create backup
pg_dump -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} \
  --clean --create --if-exists \
  --format=custom \
  --file="${BACKUP_DIR}/aijobchommie_backup_${DATE}.dump"

# Upload to cloud storage (example: AWS S3)
aws s3 cp "${BACKUP_DIR}/aijobchommie_backup_${DATE}.dump" \
  s3://aijobchommie-backups/database/

# Clean old local backups (keep only last 7 days)
find ${BACKUP_DIR} -name "aijobchommie_backup_*.dump" -mtime +7 -delete

echo "Database backup completed: aijobchommie_backup_${DATE}.dump"
```

##  Security Configuration

### SSL/TLS Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d aijobchommie.co.za \
  -d api.aijobchommie.co.za \
  -d admin.aijobchommie.co.za

# Auto-renewal
sudo crontab -e
# Add line: 0 12 * * * /usr/bin/certbot renew --quiet
```

### nginx Configuration

Create `/etc/nginx/sites-available/aijobchommie`:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

# Main site
server {
    listen 443 ssl http2;
    server_name aijobchommie.co.za www.aijobchommie.co.za;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    
    # Proxy to web frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# API server
server {
    listen 443 ssl http2;
    server_name api.aijobchommie.co.za;
    
    # SSL configuration (same as above)
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
    # Rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        # Proxy to API server
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://aijobchommie.co.za' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    }
    
    # Special rate limiting for auth endpoints
    location /api/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3001;
        # ... (same proxy headers as above)
    }
}

# Admin dashboard
server {
    listen 443 ssl http2;
    server_name admin.aijobchommie.co.za;
    
    # SSL configuration (same as above)
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
    # Additional security for admin
    allow 10.0.0.0/8;     # Internal network
    allow 172.16.0.0/12;  # Private network
    allow 192.168.0.0/16; # Local network
    # Add specific IP addresses for admin access
    # allow 41.1.1.1;     # Example South African IP
    deny all;
    
    location / {
        proxy_pass http://localhost:3002;
        # ... (same proxy headers)
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name aijobchommie.co.za www.aijobchommie.co.za api.aijobchommie.co.za admin.aijobchommie.co.za;
    return 301 https://$server_name$request_uri;
}
```

### Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow internal communication
sudo ufw allow from 10.0.0.0/8 to any port 3001  # API
sudo ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL
sudo ufw allow from 10.0.0.0/8 to any port 6379  # Redis

# Apply rules
sudo ufw reload
```

##  Monitoring & Observability

### Prometheus Configuration

Create `monitoring/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'aijobchommie-api'
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: /metrics
    scrape_interval: 30s

  - job_name: 'aijobchommie-web'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: /metrics
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

### Health Check Endpoints

Implement comprehensive health checks in your API:

```typescript
// packages/api/src/routes/health.ts
import { Router, Request, Response } from 'express';
import { db } from '../database';
import { redis } from '../redis';

const router = Router();

// Basic health check
router.get('/', async (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});

// Detailed health check
router.get('/detailed', async (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      external_apis: 'unknown'
    }
  };

  try {
    // Check database
    await db.raw('SELECT 1');
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'degraded';
  }

  try {
    // Check Redis
    await redis.ping();
    health.services.redis = 'healthy';
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'degraded';
  }

  res.json(health);
});

export { router as healthRouter };
```

### Logging Configuration

```typescript
// packages/api/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'aijobchommie-api',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  },
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File logging
    new winston.transports.File({
      filename: '/var/log/aijobchommie/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: '/var/log/aijobchommie/combined.log'
    })
  ]
});

// In production, log to external service
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Http({
    host: 'logs.example.com',
    port: 443,
    ssl: true
  }));
}

export { logger };
```

##  Backup & Recovery

### Automated Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash

# AI Job Chommie Platform Backup Script
set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p ${BACKUP_DIR}/{database,files,config}

echo "Starting backup process at $(date)"

# 1. Database Backup
echo "Backing up PostgreSQL database..."
pg_dump -h ${DB_HOST} -U ${DB_USER} -d aijobchommie \
  --clean --create --if-exists \
  --format=custom \
  --file="${BACKUP_DIR}/database/aijobchommie_${DATE}.dump"

# 2. File Backup (uploads, logs, etc.)
echo "Backing up application files..."
tar -czf "${BACKUP_DIR}/files/files_${DATE}.tar.gz" \
  /var/log/aijobchommie \
  /app/uploads

# 3. Configuration Backup
echo "Backing up configuration files..."
tar -czf "${BACKUP_DIR}/config/config_${DATE}.tar.gz" \
  /etc/nginx/sites-available/aijobchommie \
  /app/.env.production \
  /app/docker-compose.production.yml

# 4. Upload to cloud storage
if [ ! -z "${AWS_BACKUP_BUCKET}" ]; then
  echo "Uploading backups to AWS S3..."
  aws s3 sync ${BACKUP_DIR} s3://${AWS_BACKUP_BUCKET}/backups/$(date +%Y/%m/%d)/
fi

if [ ! -z "${AZURE_BACKUP_CONTAINER}" ]; then
  echo "Uploading backups to Azure Blob Storage..."
  az storage blob upload-batch \
    --destination ${AZURE_BACKUP_CONTAINER} \
    --source ${BACKUP_DIR} \
    --destination-path backups/$(date +%Y/%m/%d)
fi

# 5. Cleanup old backups
echo "Cleaning up old backups..."
find ${BACKUP_DIR} -type f -mtime +${RETENTION_DAYS} -delete

# 6. Verify backups
echo "Verifying database backup..."
pg_restore --list "${BACKUP_DIR}/database/aijobchommie_${DATE}.dump" > /dev/null

echo "Backup completed successfully at $(date)"

# Send notification (optional)
if [ ! -z "${SLACK_WEBHOOK_URL}" ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\" AI Job Chommie backup completed successfully\"}" \
    ${SLACK_WEBHOOK_URL}
fi
```

### Recovery Procedures

```bash
#!/bin/bash
# scripts/restore.sh

# Restore from backup
BACKUP_FILE=$1
RESTORE_DATE=$(date +%Y%m%d_%H%M%S)

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

echo "Starting restore process from ${BACKUP_FILE}"

# 1. Stop services
echo "Stopping services..."
docker-compose -f docker-compose.production.yml stop

# 2. Backup current database (safety)
echo "Creating safety backup of current database..."
pg_dump -h ${DB_HOST} -U ${DB_USER} -d aijobchommie \
  --format=custom \
  --file="safety_backup_${RESTORE_DATE}.dump"

# 3. Restore database
echo "Restoring database..."
pg_restore -h ${DB_HOST} -U ${DB_USER} -d aijobchommie \
  --clean --if-exists \
  ${BACKUP_FILE}

# 4. Restart services
echo "Starting services..."
docker-compose -f docker-compose.production.yml up -d

# 5. Run health checks
echo "Running health checks..."
sleep 30
curl -f http://localhost:3001/health || echo "API health check failed"
curl -f http://localhost:3000 || echo "Web health check failed"

echo "Restore completed"
```

##  Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Issues

```bash
# Check database status
docker-compose -f docker-compose.production.yml logs postgres

# Test connection
docker-compose -f docker-compose.production.yml exec api \
  npx prisma db pull

# Reset connections
docker-compose -f docker-compose.production.yml restart postgres
```

#### 2. Memory Issues

```bash
# Check memory usage
docker stats

# Increase Node.js memory
docker-compose -f docker-compose.production.yml exec api \
  node --max-old-space-size=4096 dist/index.js
```

#### 3. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --dry-run

# Test SSL configuration
curl -I https://aijobchommie.co.za
```

#### 4. Performance Issues

```bash
# Check application metrics
curl http://localhost:3001/metrics

# Monitor database queries
docker-compose -f docker-compose.production.yml exec postgres \
  psql -U ${DB_USER} -d aijobchommie -c "SELECT * FROM pg_stat_activity;"

# Check Redis performance
docker-compose -f docker-compose.production.yml exec redis \
  redis-cli info stats
```

### Monitoring & Alerting

Set up alerts for critical metrics:

- API response time > 2 seconds
- Database connections > 80% of max
- Memory usage > 90%
- Disk usage > 85%
- SSL certificate expiring in < 30 days
- Failed login attempts > threshold

### Emergency Contacts

- **DevOps Team**: devops@aijobchommie.co.za
- **Security Team**: security@aijobchommie.co.za
- **On-call Pager**: +27-123-456-789

---

##  Support

For deployment issues:
- **Documentation**: Check our deployment docs
- **GitHub Issues**: Create deployment-related issues
- **Email**: devops@aijobchommie.co.za
- **Emergency**: +27-123-456-789 (24/7 support)

---

**🇿🇦 Deployed with  for South African Job Seekers**

*This deployment guide ensures your AI Job Chommie Platform is production-ready, secure, and scalable to serve South African job seekers effectively.*
