# 🔒 Production Security Configuration

## Overview
This document outlines comprehensive security configurations and hardening measures for the AI Job Chommie platform in production.

## 1. Server Security Hardening

### System Updates & Patches
```bash
# Automated security updates (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Enable automatic security updates
echo 'Unattended-Upgrade::Automatic-Reboot "false";' >> /etc/apt/apt.conf.d/20auto-upgrades
```

### SSH Hardening
Edit `/etc/ssh/sshd_config`:
```
# Disable root login
PermitRootLogin no

# Use key-based authentication only
PasswordAuthentication no
PubkeyAuthentication yes

# Change default port (optional)
Port 2222

# Limit user access
AllowUsers deploy

# Disable X11 forwarding
X11Forwarding no

# Set idle timeout
ClientAliveInterval 300
ClientAliveCountMax 2

# Disable empty passwords
PermitEmptyPasswords no

# Use Protocol 2 only
Protocol 2
```

### Firewall Configuration (UFW)
```bash
# Reset UFW to default
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH access (adjust port if changed)
sudo ufw allow 2222/tcp

# HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Database (localhost only)
sudo ufw allow from 127.0.0.1 to any port 5432

# Redis (localhost only)
sudo ufw allow from 127.0.0.1 to any port 6379

# Monitoring (localhost only)
sudo ufw allow from 127.0.0.1 to any port 9090
sudo ufw allow from 127.0.0.1 to any port 3001

# Rate limiting for SSH
sudo ufw limit ssh

# Enable firewall
sudo ufw enable
```

### Fail2Ban Configuration
```bash
# Install Fail2Ban
sudo apt install fail2ban

# Configure Fail2Ban for SSH
sudo tee /etc/fail2ban/jail.local > /dev/null << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
ignoreip = 127.0.0.1/8

[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 2. Application Security

### Environment Variables Security
```bash
# Create secure environment file with proper permissions
sudo touch /opt/aijobchommie-platform/.env.production
sudo chmod 600 /opt/aijobchommie-platform/.env.production
sudo chown deploy:deploy /opt/aijobchommie-platform/.env.production

# Use strong secrets (minimum 32 characters)
# Generate secure JWT secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For JWT_REFRESH_SECRET
openssl rand -hex 32  # For ENCRYPTION_KEY
```

### Database Security
```bash
# PostgreSQL security configuration
sudo tee -a /var/lib/postgresql/data/postgresql.conf > /dev/null << EOF

# Connection settings
listen_addresses = 'localhost'
port = 5432
max_connections = 20

# SSL settings
ssl = on
ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'

# Logging
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_statement = 'mod'
log_min_duration_statement = 1000

# Security
password_encryption = scram-sha-256
row_security = on
EOF

# PostgreSQL access control (pg_hba.conf)
sudo tee /var/lib/postgresql/data/pg_hba.conf > /dev/null << EOF
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             aijobchommie_app                        md5
host    all             aijobchommie_app  127.0.0.1/32         scram-sha-256
host    all             aijobchommie_readonly  127.0.0.1/32    scram-sha-256
EOF
```

### Redis Security
```bash
# Create secure Redis configuration
sudo tee /etc/redis/redis.conf > /dev/null << EOF
# Network security
bind 127.0.0.1
protected-mode yes
port 6379

# Authentication
requirepass your_very_strong_redis_password_here

# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""
rename-command CONFIG "CONFIG_d1f2a3b4c5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7"

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log

# Security
tcp-keepalive 60
timeout 300

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF
```

### API Security Configuration
Update your API configuration with these security headers:

```typescript
// Security middleware configuration
const securityHeaders = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://js.paystack.co"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.paystack.co"],
      frameSrc: ["https://js.paystack.co"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
};

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
};

// API-specific rate limits
const apiRateLimits = {
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts per 15 minutes
  },
  registration: {
    windowMs: 60 * 60 * 1000,
    max: 3, // 3 registrations per hour
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000,
    max: 3, // 3 password reset attempts per hour
  },
};
```

### CORS Security
```typescript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://aijobchommie.co.za',
      'https://www.aijobchommie.co.za',
      'https://admin.aijobchommie.co.za',
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  maxAge: 86400, // 24 hours
};
```

## 3. Nginx Security Configuration

### Security Headers
```nginx
# Security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.paystack.co https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.paystack.co https://www.google-analytics.com; frame-src https://js.paystack.co; object-src 'none';" always;

# Remove server information
server_tokens off;
more_clear_headers Server;
```

### Rate Limiting
```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=general:10m rate=30r/m;

# Connection limiting
limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;

# Apply rate limits
server {
    # General rate limiting
    limit_req zone=general burst=50 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # Specific endpoints
    location /api/auth {
        limit_req zone=login burst=10 nodelay;
    }
    
    location /api/ {
        limit_req zone=api burst=200 nodelay;
    }
}
```

### Block Malicious Requests
```nginx
# Block common attack patterns
location ~* \.(php|jsp|asp|aspx|cgi)$ {
    return 444;
}

# Block SQL injection attempts
location ~* (union.*select|insert.*into|delete.*from|drop.*table) {
    return 444;
}

# Block file inclusion attacks
location ~* \.\./\.\. {
    return 444;
}

# Block common bot patterns
if ($http_user_agent ~* (bot|crawler|spider|scraper)) {
    return 429;
}

# Block requests without User-Agent
if ($http_user_agent = "") {
    return 444;
}
```

## 4. SSL/TLS Security

### Advanced SSL Configuration
```nginx
# SSL protocols and ciphers
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;

# SSL session optimization
ssl_session_cache shared:SSL:50m;
ssl_session_timeout 1d;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/aijobchommie.co.za/chain.pem;

# DNS resolver for OCSP
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

### Certificate Security
```bash
# Set proper permissions for SSL certificates
sudo chmod 600 /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem
sudo chown root:root /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem

# Create certificate monitoring script
sudo tee /usr/local/bin/ssl-monitor.sh > /dev/null << 'EOF'
#!/bin/bash
DOMAIN="aijobchommie.co.za"
CERT_FILE="/etc/letsencrypt/live/$DOMAIN/cert.pem"
DAYS_BEFORE_EXPIRY=30

if [ -f "$CERT_FILE" ]; then
    EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
    EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
    CURRENT_TIMESTAMP=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(((EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400))
    
    if [ $DAYS_UNTIL_EXPIRY -lt $DAYS_BEFORE_EXPIRY ]; then
        echo "WARNING: SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days"
        # Send alert (email, Slack, etc.)
    fi
fi
EOF

sudo chmod +x /usr/local/bin/ssl-monitor.sh
```

## 5. Container Security

### Docker Security
```yaml
# Docker Compose security settings
version: '3.8'
services:
  api-prod:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    read_only: true
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
    user: "1000:1000"
    restart: unless-stopped
    
  postgres-prod:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - SETGID
      - SETUID
      - DAC_OVERRIDE
    read_only: false  # PostgreSQL needs write access to data directory
    user: "999:999"
```

### Docker Daemon Security
```json
// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "seccomp-profile": "/etc/docker/seccomp.json",
  "storage-driver": "overlay2"
}
```

## 6. Monitoring & Incident Response

### Security Monitoring
```bash
# Install and configure AIDE (intrusion detection)
sudo apt install aide
sudo aide --init
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Create daily AIDE check
echo "0 6 * * * root /usr/bin/aide --check" | sudo tee -a /etc/crontab

# Log monitoring with rsyslog
sudo tee /etc/rsyslog.d/50-security.conf > /dev/null << EOF
# Security logs
auth,authpriv.*                /var/log/auth.log
*.err                          /var/log/error.log
mail.*                         /var/log/mail.log
cron.*                         /var/log/cron.log
EOF
```

### Alerting Configuration
```bash
# Create security alert script
sudo tee /usr/local/bin/security-alert.sh > /dev/null << 'EOF'
#!/bin/bash
ALERT_EMAIL="security@aijobchommie.co.za"
SLACK_WEBHOOK="your_slack_webhook_url"

send_alert() {
    local message="$1"
    local severity="$2"
    
    # Send email alert
    echo "$message" | mail -s "[$severity] Security Alert - AI Job Chommie" "$ALERT_EMAIL"
    
    # Send Slack alert
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚨 [$severity] $message\"}" \
        "$SLACK_WEBHOOK"
}

# Monitor failed login attempts
FAILED_LOGINS=$(tail -n 100 /var/log/auth.log | grep "Failed password" | wc -l)
if [ $FAILED_LOGINS -gt 10 ]; then
    send_alert "High number of failed login attempts: $FAILED_LOGINS" "HIGH"
fi

# Monitor disk usage
DISK_USAGE=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    send_alert "High disk usage: $DISK_USAGE%" "HIGH"
fi

# Monitor running processes
SUSPICIOUS_PROCESSES=$(ps aux | grep -E "(nc|netcat|nmap|sqlmap)" | grep -v grep | wc -l)
if [ $SUSPICIOUS_PROCESSES -gt 0 ]; then
    send_alert "Suspicious processes detected" "CRITICAL"
fi
EOF

sudo chmod +x /usr/local/bin/security-alert.sh
```

## 7. Backup Security

### Encrypted Backups
```bash
# Create encrypted backup script
sudo tee /usr/local/bin/secure-backup.sh > /dev/null << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/aijobchommie"
ENCRYPTION_KEY="/etc/ssl/private/backup.key"
DATE=$(date +%Y%m%d_%H%M%S)

# Generate encryption key if it doesn't exist
if [ ! -f "$ENCRYPTION_KEY" ]; then
    openssl rand -base64 32 > "$ENCRYPTION_KEY"
    chmod 600 "$ENCRYPTION_KEY"
fi

# Create encrypted database backup
docker exec aijobchommie-postgres-prod pg_dump -U aijobchommie_app aijobchommie_prod | \
    gzip | \
    openssl enc -aes-256-cbc -salt -in - -out "$BACKUP_DIR/db_backup_${DATE}.sql.gz.enc" -pass file:"$ENCRYPTION_KEY"

# Create encrypted file backup
tar -czf - /var/lib/aijobchommie/uploads | \
    openssl enc -aes-256-cbc -salt -in - -out "$BACKUP_DIR/uploads_backup_${DATE}.tar.gz.enc" -pass file:"$ENCRYPTION_KEY"

# Upload to secure cloud storage (example with AWS S3)
# aws s3 cp "$BACKUP_DIR/db_backup_${DATE}.sql.gz.enc" s3://your-secure-backup-bucket/
# aws s3 cp "$BACKUP_DIR/uploads_backup_${DATE}.tar.gz.enc" s3://your-secure-backup-bucket/

# Clean up old backups (keep 30 days)
find "$BACKUP_DIR" -name "*.enc" -mtime +30 -delete
EOF

sudo chmod +x /usr/local/bin/secure-backup.sh
```

## 8. Security Checklist

### Pre-Deployment Security Checklist
- [ ] All default passwords changed
- [ ] SSH key-based authentication configured
- [ ] Firewall properly configured
- [ ] SSL certificates installed and configured
- [ ] Database access restricted to localhost
- [ ] Redis authentication enabled
- [ ] Rate limiting configured
- [ ] Security headers implemented
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Container security hardened
- [ ] Monitoring and alerting configured
- [ ] Backup encryption enabled
- [ ] Incident response plan documented

### Regular Security Maintenance
- [ ] Weekly security updates
- [ ] Monthly penetration testing
- [ ] Quarterly security audit
- [ ] SSL certificate monitoring
- [ ] Log analysis and review
- [ ] Backup integrity testing
- [ ] Access review and cleanup
- [ ] Security training for team

### Incident Response Plan
1. **Detection**: Monitor logs and alerts
2. **Assessment**: Determine severity and impact
3. **Containment**: Isolate affected systems
4. **Investigation**: Analyze the incident
5. **Recovery**: Restore services safely
6. **Documentation**: Record lessons learned

This comprehensive security configuration ensures the AI Job Chommie platform is protected against common threats and follows security best practices for production deployment.
