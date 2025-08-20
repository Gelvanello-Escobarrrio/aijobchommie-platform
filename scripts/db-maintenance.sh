#!/bin/bash

# ==========================================
#  DATABASE MAINTENANCE & BACKUP SCRIPTS
# ==========================================

set -e

# Configuration
DB_NAME="aijobchommie_prod"
DB_USER="aijobchommie_app"
BACKUP_DIR="/var/backups/aijobchommie"
BACKUP_RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create backup directory if it doesn't exist
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log "Created backup directory: $BACKUP_DIR"
    fi
}

# Database backup function
backup_database() {
    log "Starting database backup..."
    
    local backup_file="${BACKUP_DIR}/aijobchommie_backup_${DATE}.sql.gz"
    
    # Create backup with compression
    if pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" --verbose --clean --no-owner --no-privileges | gzip > "$backup_file"; then
        success "Database backup created: $backup_file"
        
        # Get file size
        local file_size=$(du -h "$backup_file" | cut -f1)
        log "Backup file size: $file_size"
        
        # Test backup integrity
        if gunzip -t "$backup_file"; then
            success "Backup integrity verified"
        else
            error "Backup integrity check failed!"
            return 1
        fi
    else
        error "Database backup failed!"
        return 1
    fi
}

# Clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups (older than ${BACKUP_RETENTION_DAYS} days)..."
    
    local deleted_count=0
    
    # Find and delete old backup files
    while IFS= read -r -d '' file; do
        rm "$file"
        deleted_count=$((deleted_count + 1))
        log "Deleted old backup: $(basename "$file")"
    done < <(find "$BACKUP_DIR" -name "aijobchommie_backup_*.sql.gz" -mtime +${BACKUP_RETENTION_DAYS} -print0)
    
    if [ $deleted_count -eq 0 ]; then
        log "No old backups to clean up"
    else
        success "Cleaned up $deleted_count old backup files"
    fi
}

# Database health check
health_check() {
    log "Performing database health check..."
    
    # Check database connection
    if psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        success "Database connection: OK"
    else
        error "Database connection: FAILED"
        return 1
    fi
    
    # Check table integrity
    local table_count=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog');")
    log "Total tables: $table_count"
    
    # Check recent activity
    local recent_users=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours';")
    log "New users (24h): $recent_users"
    
    local recent_jobs=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM jobs.job_listings WHERE created_at > NOW() - INTERVAL '24 hours';")
    log "New jobs (24h): $recent_jobs"
    
    local recent_applications=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM jobs.applications WHERE applied_at > NOW() - INTERVAL '24 hours';")
    log "New applications (24h): $recent_applications"
    
    success "Health check completed"
}

# Database optimization
optimize_database() {
    log "Starting database optimization..."
    
    # Update table statistics
    log "Updating table statistics..."
    psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;" > /dev/null 2>&1
    success "Table statistics updated"
    
    # Vacuum analyze on critical tables
    log "Performing VACUUM ANALYZE on critical tables..."
    
    critical_tables=(
        "auth.users"
        "jobs.job_listings"
        "jobs.applications"
        "app.subscriptions"
        "app.payment_transactions"
        "analytics.job_views"
    )
    
    for table in "${critical_tables[@]}"; do
        log "Optimizing table: $table"
        psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "VACUUM ANALYZE $table;" > /dev/null 2>&1
    done
    
    success "Database optimization completed"
}

# Monitor database size
monitor_database_size() {
    log "Monitoring database size..."
    
    # Get database size
    local db_size=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));")
    log "Database size: $db_size"
    
    # Get largest tables
    log "Top 5 largest tables:"
    psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT 
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC 
        LIMIT 5;
    "
}

# Security audit
security_audit() {
    log "Performing security audit..."
    
    # Check for users without passwords (should not exist)
    local users_no_pass=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM auth.users WHERE password_hash IS NULL OR password_hash = '';")
    if [ "$users_no_pass" -gt 0 ]; then
        warning "Found $users_no_pass users without password hashes"
    else
        success "All users have password hashes"
    fi
    
    # Check for unverified admin accounts
    local unverified_admins=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM auth.users WHERE email LIKE '%admin%' AND email_verified = false;")
    if [ "$unverified_admins" -gt 0 ]; then
        warning "Found $unverified_admins unverified admin accounts"
    else
        success "All admin accounts are verified"
    fi
    
    # Check for old password reset tokens
    local old_tokens=$(psql -h localhost -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM auth.users WHERE password_reset_expires < NOW() AND password_reset_token IS NOT NULL;")
    if [ "$old_tokens" -gt 0 ]; then
        warning "Found $old_tokens expired password reset tokens"
        log "Cleaning up expired tokens..."
        psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "UPDATE auth.users SET password_reset_token = NULL, password_reset_expires = NULL WHERE password_reset_expires < NOW();" > /dev/null 2>&1
        success "Expired tokens cleaned up"
    else
        success "No expired password reset tokens found"
    fi
    
    success "Security audit completed"
}

# Main function
main() {
    case "$1" in
        "backup")
            create_backup_dir
            backup_database
            cleanup_old_backups
            ;;
        "health")
            health_check
            ;;
        "optimize")
            optimize_database
            ;;
        "monitor")
            monitor_database_size
            ;;
        "security")
            security_audit
            ;;
        "full")
            log "Running full maintenance routine..."
            create_backup_dir
            backup_database
            cleanup_old_backups
            health_check
            optimize_database
            monitor_database_size
            security_audit
            success "Full maintenance routine completed"
            ;;
        *)
            echo "Usage: $0 {backup|health|optimize|monitor|security|full}"
            echo ""
            echo "Commands:"
            echo "  backup   - Create database backup and clean old backups"
            echo "  health   - Perform database health check"
            echo "  optimize - Optimize database performance"
            echo "  monitor  - Monitor database size and usage"
            echo "  security - Perform security audit"
            echo "  full     - Run all maintenance tasks"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
