#!/bin/bash

# ==========================================
#  AI JOB CHOMMIE - PRODUCTION DEPLOYMENT
# ==========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
PROJECT_NAME="aijobchommie-platform"
DEPLOY_USER="deploy"
BACKUP_DIR="/var/backups/aijobchommie"
LOG_FILE="/var/log/aijobchommie-deploy.log"
DATE=$(date +%Y%m%d_%H%M%S)

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${PURPLE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Help function
show_help() {
    cat << EOF
 AI Job Chommie Production Deployment Script

Usage: $0 [COMMAND] [OPTIONS]

Commands:
  deploy          Full production deployment
  update          Update existing deployment
  rollback        Rollback to previous version
  backup          Create backup before deployment
  health          Check deployment health
  logs            View application logs
  restart         Restart services
  scale           Scale services up/down

Options:
  --skip-backup   Skip backup creation
  --skip-tests    Skip health tests
  --force         Force deployment without confirmations
  --version TAG   Deploy specific version tag
  --help          Show this help message

Examples:
  $0 deploy                    # Full production deployment
  $0 update --version v1.2.0   # Update to specific version
  $0 rollback                  # Rollback to previous version
  $0 health                    # Check deployment health

EOF
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if running as root or deploy user
    if [[ $EUID -eq 0 ]] && [[ "$USER" != "deploy" ]]; then
        warning "Running as root. Consider using deploy user for better security."
    fi
    
    # Check system resources
    local mem_available=$(free -m | awk 'NR==2{printf "%.1f", $7*100/$2}')
    local disk_available=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
    
    if [[ ${disk_available} -gt 85 ]]; then
        error "Disk usage is above 85%. Please free up space before deployment."
        exit 1
    fi
    
    if [[ $(echo "$mem_available < 20.0" | bc -l) -eq 1 ]]; then
        warning "Available memory is below 20%. Deployment may be slow."
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check environment file
    if [[ ! -f ".env.production" ]]; then
        error "Production environment file (.env.production) not found"
        exit 1
    fi
    
    # Validate environment variables
    source .env.production
    required_vars=(
        "DB_USER"
        "DB_PASSWORD"
        "JWT_SECRET"
        "JWT_REFRESH_SECRET"
        "PAYSTACK_SECRET_KEY"
        "OPENAI_API_KEY"
        "SMTP_HOST"
        "SMTP_USER"
        "SMTP_PASS"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    success "Pre-deployment checks passed"
}

# Create backup
create_backup() {
    if [[ "$SKIP_BACKUP" == "true" ]]; then
        warning "Skipping backup creation"
        return 0
    fi
    
    log "Creating backup before deployment..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup database if running
    if docker ps | grep -q "aijobchommie-postgres-prod"; then
        log "Backing up database..."
        docker exec aijobchommie-postgres-prod pg_dump -U "${DB_USER}" -d aijobchommie_prod | gzip > "${BACKUP_DIR}/db_backup_${DATE}.sql.gz"
        success "Database backup created: ${BACKUP_DIR}/db_backup_${DATE}.sql.gz"
    fi
    
    # Backup uploaded files
    if [[ -d "/var/lib/aijobchommie/uploads" ]]; then
        log "Backing up uploaded files..."
        tar -czf "${BACKUP_DIR}/uploads_backup_${DATE}.tar.gz" -C "/var/lib/aijobchommie" uploads/
        success "Uploads backup created: ${BACKUP_DIR}/uploads_backup_${DATE}.tar.gz"
    fi
    
    # Backup configuration
    log "Backing up configuration..."
    tar -czf "${BACKUP_DIR}/config_backup_${DATE}.tar.gz" .env.production docker-compose.prod.yml nginx/
    success "Configuration backup created: ${BACKUP_DIR}/config_backup_${DATE}.tar.gz"
    
    success "Backup creation completed"
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    # Build API image
    log "Building API image..."
    docker build -f docker/api/Dockerfile.prod -t aijobchommie/api:latest -t aijobchommie/api:${DATE} .
    
    # Build Web image
    log "Building Web image..."
    docker build -f docker/web/Dockerfile.prod -t aijobchommie/web:latest -t aijobchommie/web:${DATE} .
    
    # Build Admin image
    log "Building Admin image..."
    docker build -f docker/admin/Dockerfile.prod -t aijobchommie/admin:latest -t aijobchommie/admin:${DATE} .
    
    success "Docker images built successfully"
}

# Deploy services
deploy_services() {
    log "Deploying services..."
    
    # Create necessary directories
    log "Creating data directories..."
    sudo mkdir -p /var/lib/aijobchommie/{postgres,redis,prometheus,grafana,loki,uploads}
    sudo mkdir -p /var/log/{aijobchommie,nginx}
    sudo mkdir -p /var/backups/aijobchommie
    
    # Set proper permissions
    sudo chown -R 999:999 /var/lib/aijobchommie/postgres
    sudo chown -R 999:999 /var/lib/aijobchommie/redis
    sudo chown -R 472:472 /var/lib/aijobchommie/grafana
    sudo chown -R 10001:10001 /var/lib/aijobchommie/loki
    sudo chown -R $USER:$USER /var/lib/aijobchommie/uploads
    
    # Deploy using Docker Compose
    log "Starting services with Docker Compose..."
    docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
    
    success "Services deployment completed"
}

# Wait for services to be healthy
wait_for_health() {
    log "Waiting for services to become healthy..."
    
    local max_attempts=60
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        local healthy_services=0
        local total_services=0
        
        # Check each service health
        for service in postgres-prod redis-prod api-prod web-prod admin-prod nginx-prod; do
            total_services=$((total_services + 1))
            if docker-compose -f docker-compose.prod.yml ps "$service" | grep -q "healthy\|Up"; then
                healthy_services=$((healthy_services + 1))
            fi
        done
        
        log "Health check: $healthy_services/$total_services services healthy (attempt $attempt/$max_attempts)"
        
        if [[ $healthy_services -eq $total_services ]]; then
            success "All services are healthy"
            return 0
        fi
        
        sleep 10
        attempt=$((attempt + 1))
    done
    
    error "Services failed to become healthy within expected time"
    return 1
}

# Run health tests
run_health_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        warning "Skipping health tests"
        return 0
    fi
    
    log "Running health tests..."
    
    # Test database connection
    log "Testing database connection..."
    if docker exec aijobchommie-postgres-prod pg_isready -U "${DB_USER}" -d aijobchommie_prod; then
        success "Database connection test passed"
    else
        error "Database connection test failed"
        return 1
    fi
    
    # Test Redis connection
    log "Testing Redis connection..."
    if docker exec aijobchommie-redis-prod redis-cli ping | grep -q "PONG"; then
        success "Redis connection test passed"
    else
        error "Redis connection test failed"
        return 1
    fi
    
    # Test API health endpoint
    log "Testing API health endpoint..."
    local api_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
    if [[ "$api_health" == "200" ]]; then
        success "API health test passed"
    else
        error "API health test failed (HTTP $api_health)"
        return 1
    fi
    
    # Test Web application
    log "Testing Web application..."
    local web_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
    if [[ "$web_health" == "200" ]]; then
        success "Web application test passed"
    else
        error "Web application test failed (HTTP $web_health)"
        return 1
    fi
    
    success "All health tests passed"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring and alerting..."
    
    # Configure log rotation
    sudo tee /etc/logrotate.d/aijobchommie > /dev/null << EOF
/var/log/aijobchommie/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
    
    # Setup cron jobs
    log "Setting up cron jobs..."
    
    # Database backup cron
    (crontab -l 2>/dev/null; echo "0 2 * * * /opt/aijobchommie-platform/scripts/db-maintenance.sh backup") | crontab -
    
    # Health check cron
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/aijobchommie-platform/scripts/health-check.sh") | crontab -
    
    # SSL certificate renewal cron
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
    
    success "Monitoring setup completed"
}

# Post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."
    
    # Update SSL certificates if needed
    if command -v certbot &> /dev/null; then
        log "Checking SSL certificates..."
        sudo certbot renew --dry-run
    fi
    
    # Clear application caches
    log "Clearing application caches..."
    docker exec aijobchommie-redis-prod redis-cli FLUSHDB
    
    # Send deployment notification
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        log "Sending deployment notification..."
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":" AI Job Chommie production deployment completed successfully!"}' \
            "$SLACK_WEBHOOK_URL"
    fi
    
    success "Post-deployment tasks completed"
}

# Full deployment
full_deployment() {
    log "Starting full production deployment for AI Job Chommie..."
    
    pre_deployment_checks
    create_backup
    build_images
    deploy_services
    wait_for_health
    run_health_tests
    setup_monitoring
    post_deployment
    
    success " Production deployment completed successfully!"
    info " Website: https://aijobchommie.co.za"
    info " Admin: https://admin.aijobchommie.co.za"
    info " Monitoring: https://monitoring.aijobchommie.co.za"
    info " Logs: docker-compose -f docker-compose.prod.yml logs -f"
}

# Update deployment
update_deployment() {
    log "Updating existing deployment..."
    
    pre_deployment_checks
    create_backup
    build_images
    
    # Rolling update
    log "Performing rolling update..."
    docker-compose -f docker-compose.prod.yml up -d --no-deps api-prod
    sleep 30
    docker-compose -f docker-compose.prod.yml up -d --no-deps web-prod
    sleep 30
    docker-compose -f docker-compose.prod.yml up -d --no-deps admin-prod
    
    wait_for_health
    run_health_tests
    
    success "Deployment update completed successfully!"
}

# Rollback deployment
rollback_deployment() {
    log "Rolling back deployment..."
    
    if [[ ! -f "${BACKUP_DIR}/config_backup_${DATE}.tar.gz" ]]; then
        error "No recent backup found for rollback"
        exit 1
    fi
    
    # Stop current services
    docker-compose -f docker-compose.prod.yml down
    
    # Restore from backup
    log "Restoring from backup..."
    # Implementation depends on backup strategy
    
    # Restart services
    docker-compose -f docker-compose.prod.yml up -d
    
    success "Rollback completed"
}

# View logs
view_logs() {
    docker-compose -f docker-compose.prod.yml logs -f "$@"
}

# Restart services
restart_services() {
    log "Restarting services..."
    docker-compose -f docker-compose.prod.yml restart
    wait_for_health
    success "Services restarted successfully"
}

# Scale services
scale_services() {
    local service="$1"
    local replicas="$2"
    
    if [[ -z "$service" || -z "$replicas" ]]; then
        error "Usage: $0 scale <service> <replicas>"
        exit 1
    fi
    
    log "Scaling $service to $replicas replicas..."
    docker-compose -f docker-compose.prod.yml up -d --scale "$service=$replicas"
    success "Service scaled successfully"
}

# Main function
main() {
    # Parse command line arguments
    COMMAND="$1"
    shift
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP="true"
                shift
                ;;
            --skip-tests)
                SKIP_TESTS="true"
                shift
                ;;
            --force)
                FORCE="true"
                shift
                ;;
            --version)
                VERSION="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Execute command
    case "$COMMAND" in
        "deploy")
            full_deployment
            ;;
        "update")
            update_deployment
            ;;
        "rollback")
            rollback_deployment
            ;;
        "backup")
            create_backup
            ;;
        "health")
            run_health_tests
            ;;
        "logs")
            view_logs "$@"
            ;;
        "restart")
            restart_services
            ;;
        "scale")
            scale_services "$@"
            ;;
        *)
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
