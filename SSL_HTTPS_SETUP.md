# 🔒 SSL Certificate & HTTPS Setup Guide

## Overview
This guide covers setting up SSL certificates and HTTPS for the AI Job Chommie platform across all domains and subdomains.

## SSL Certificate Options

### Option 1: Let's Encrypt (Free & Recommended)
Let's Encrypt provides free SSL certificates with automatic renewal.

#### Prerequisites
```bash
# Install Certbot (Ubuntu/Debian)
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Install Certbot (CentOS/RHEL)
sudo yum install certbot python3-certbot-nginx
```

#### Single Certificate for All Domains
```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Request certificate for all domains
sudo certbot certonly --standalone \
  -d aijobchommie.co.za \
  -d www.aijobchommie.co.za \
  -d api.aijobchommie.co.za \
  -d admin.aijobchommie.co.za \
  -d staging.aijobchommie.co.za \
  -d api-staging.aijobchommie.co.za \
  -d cdn.aijobchommie.co.za \
  -d assets.aijobchommie.co.za \
  --email admin@aijobchommie.co.za \
  --agree-tos \
  --non-interactive

# Start Nginx
sudo systemctl start nginx
```

#### Wildcard Certificate (Alternative)
```bash
# Request wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual \
  --preferred-challenges dns \
  -d aijobchommie.co.za \
  -d *.aijobchommie.co.za \
  --email admin@aijobchommie.co.za \
  --agree-tos
```

### Option 2: Commercial SSL Certificate
If you prefer a commercial certificate:

1. **Purchase SSL certificate** from providers like:
   - DigiCert
   - GlobalSign
   - Sectigo
   - GoDaddy

2. **Generate CSR (Certificate Signing Request)**:
```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout aijobchommie.co.za.key \
  -out aijobchommie.co.za.csr \
  -subj "/C=ZA/ST=Eastern Cape/L=Port Elizabeth/O=AI Job Chommie (Pty) Ltd/CN=aijobchommie.co.za"
```

3. **Submit CSR to certificate authority**
4. **Install received certificate files**

## Nginx HTTPS Configuration

### Complete Nginx Configuration
Create `/etc/nginx/sites-available/aijobchommie.co.za`:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=general:10m rate=30r/m;

# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options DENY always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.paystack.co https://www.google-analytics.com; frame-src https://js.paystack.co; object-src 'none';" always;

# HTTP to HTTPS Redirect
server {
    listen 80;
    server_name aijobchommie.co.za www.aijobchommie.co.za api.aijobchommie.co.za admin.aijobchommie.co.za staging.aijobchommie.co.za api-staging.aijobchommie.co.za;
    return 301 https://$server_name$request_uri;
}

# Main Website
server {
    listen 443 ssl http2;
    server_name aijobchommie.co.za www.aijobchommie.co.za;
    
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
    # Rate limiting
    limit_req zone=general burst=50 nodelay;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security
    client_max_body_size 25M;
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
        access_log off;
    }
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# API Server
server {
    listen 443 ssl http2;
    server_name api.aijobchommie.co.za;
    
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
    # Rate limiting for API
    limit_req zone=api burst=200 nodelay;
    
    # API-specific settings
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin https://aijobchommie.co.za always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Accept, Authorization, Content-Type, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials true always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # API rate limiting for specific endpoints
    location /api/auth {
        limit_req zone=login burst=10 nodelay;
        proxy_pass http://localhost:3001;
        # ... other proxy settings
    }
}

# Admin Panel
server {
    listen 443 ssl http2;
    server_name admin.aijobchommie.co.za;
    
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
    # Admin panel security
    limit_req zone=general burst=20 nodelay;
    
    # IP whitelist for admin (optional)
    # allow 103.x.x.x;  # Your office IP
    # deny all;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_cache_bypass $http_upgrade;
    }
}

# Staging Environment
server {
    listen 443 ssl http2;
    server_name staging.aijobchommie.co.za;
    
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
    # Basic auth for staging (optional)
    # auth_basic "Staging Environment";
    # auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {
        proxy_pass http://localhost:3010;
        # ... other proxy settings
    }
}

# Staging API
server {
    listen 443 ssl http2;
    server_name api-staging.aijobchommie.co.za;
    
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3011;
        # ... other proxy settings
    }
}
```

## SSL Certificate Renewal

### Automatic Renewal Setup
```bash
# Test renewal
sudo certbot renew --dry-run

# Set up automatic renewal
sudo crontab -e

# Add this line for renewal check twice daily
0 12 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

### Renewal Script
Create `/usr/local/bin/renew-ssl.sh`:

```bash
#!/bin/bash

LOG_FILE="/var/log/ssl-renewal.log"
DATE=$(date)

echo "[$DATE] Starting SSL renewal check" >> $LOG_FILE

# Renew certificates
/usr/bin/certbot renew --quiet >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$DATE] SSL renewal check completed successfully" >> $LOG_FILE
    
    # Reload Nginx if certificates were renewed
    /usr/bin/systemctl reload nginx >> $LOG_FILE 2>&1
    
    if [ $? -eq 0 ]; then
        echo "[$DATE] Nginx reloaded successfully" >> $LOG_FILE
    else
        echo "[$DATE] ERROR: Failed to reload Nginx" >> $LOG_FILE
    fi
else
    echo "[$DATE] ERROR: SSL renewal check failed" >> $LOG_FILE
fi

echo "[$DATE] SSL renewal process completed" >> $LOG_FILE
```

Make it executable:
```bash
sudo chmod +x /usr/local/bin/renew-ssl.sh
```

## SSL Security Testing

### Test SSL Configuration
```bash
# Test SSL certificate
openssl s_client -connect aijobchommie.co.za:443 -servername aijobchommie.co.za

# Check certificate expiry
openssl x509 -in /etc/letsencrypt/live/aijobchommie.co.za/cert.pem -text -noout | grep "Not After"

# Test SSL rating (use online tools)
# https://www.ssllabs.com/ssltest/
# https://www.websecurity.digicert.com/security-report
```

### SSL Monitoring Script
Create `/usr/local/bin/check-ssl-expiry.sh`:

```bash
#!/bin/bash

DOMAINS=(
    "aijobchommie.co.za"
    "api.aijobchommie.co.za"
    "admin.aijobchommie.co.za"
    "staging.aijobchommie.co.za"
)

WARNING_DAYS=30
CRITICAL_DAYS=7

for domain in "${DOMAINS[@]}"; do
    expiry_date=$(openssl s_client -connect ${domain}:443 -servername ${domain} 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    
    if [ -n "$expiry_date" ]; then
        expiry_timestamp=$(date -d "$expiry_date" +%s)
        current_timestamp=$(date +%s)
        days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ $days_until_expiry -lt $CRITICAL_DAYS ]; then
            echo "CRITICAL: SSL certificate for $domain expires in $days_until_expiry days!"
        elif [ $days_until_expiry -lt $WARNING_DAYS ]; then
            echo "WARNING: SSL certificate for $domain expires in $days_until_expiry days"
        else
            echo "OK: SSL certificate for $domain expires in $days_until_expiry days"
        fi
    else
        echo "ERROR: Could not check SSL certificate for $domain"
    fi
done
```

## Security Best Practices

### 1. Perfect Forward Secrecy
Ensure your Nginx configuration includes ECDHE ciphers.

### 2. HSTS (HTTP Strict Transport Security)
Already included in the configuration above.

### 3. Certificate Transparency Monitoring
Monitor your certificates at:
- https://crt.sh/
- https://developers.facebook.com/tools/ct/

### 4. Regular Security Audits
- Run SSL Labs tests monthly
- Monitor certificate transparency logs
- Check for mixed content warnings
- Validate HSTS implementation

## Troubleshooting

### Common SSL Issues

1. **Certificate Chain Issues**
```bash
# Check certificate chain
openssl s_client -connect aijobchommie.co.za:443 -showcerts

# Fix chain issues by using fullchain.pem instead of cert.pem
ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
```

2. **Mixed Content Warnings**
```bash
# Ensure all resources use HTTPS
# Check for http:// links in your application
# Use relative URLs or HTTPS URLs only
```

3. **Renewal Failures**
```bash
# Check Certbot logs
sudo journalctl -u certbot

# Manual renewal
sudo certbot renew --force-renewal

# Check Nginx configuration
sudo nginx -t
```

## Performance Optimization

### 1. SSL Session Caching
Already configured in the Nginx setup above.

### 2. OCSP Stapling
Configured to reduce SSL handshake time.

### 3. HTTP/2
Enabled in the configuration for better performance.

### 4. SSL Cipher Optimization
Modern cipher suites prioritized for security and performance.

## Backup and Recovery

### Certificate Backup
```bash
# Backup Let's Encrypt certificates
sudo tar -czf /backup/letsencrypt-$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# Backup Nginx configuration
sudo tar -czf /backup/nginx-config-$(date +%Y%m%d).tar.gz /etc/nginx/
```

### Recovery Process
```bash
# Restore certificates
sudo tar -xzf /backup/letsencrypt-YYYYMMDD.tar.gz -C /

# Restore Nginx config
sudo tar -xzf /backup/nginx-config-YYYYMMDD.tar.gz -C /

# Reload Nginx
sudo systemctl reload nginx
```

This SSL setup provides enterprise-grade security with automatic renewal and comprehensive monitoring.
