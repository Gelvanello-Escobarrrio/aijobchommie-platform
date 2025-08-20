#  Domain DNS Configuration Guide

## Overview
This guide will help you configure DNS records to link your existing `aijobchommie-website` domain to the new AI Job Chommie Platform.

## Required DNS Records

### 1. Main Website (A Records)
```dns
# Main website - points to your web server
aijobchommie.co.za          A     YOUR_SERVER_IP
www.aijobchommie.co.za      A     YOUR_SERVER_IP
```

### 2. API Subdomain (A Record)
```dns
# API server - can be same server or separate
api.aijobchommie.co.za      A     YOUR_API_SERVER_IP
```

### 3. Staging Environment (A Records)
```dns
# Staging environment for testing
staging.aijobchommie.co.za      A     YOUR_STAGING_SERVER_IP
api-staging.aijobchommie.co.za  A     YOUR_STAGING_SERVER_IP
```

### 4. Admin Panel (A Record)
```dns
# Admin dashboard
admin.aijobchommie.co.za    A     YOUR_SERVER_IP
```

### 5. CDN & Assets (CNAME Records)
```dns
# CDN and static assets
cdn.aijobchommie.co.za      CNAME  your-cdn-provider.com
assets.aijobchommie.co.za   CNAME  your-cdn-provider.com
```

### 6. Email Configuration (MX Records)
```dns
# Email services
aijobchommie.co.za          MX     10 mail.aijobchommie.co.za
                            MX     20 mail2.aijobchommie.co.za

# Email subdomain
mail.aijobchommie.co.za     A      YOUR_MAIL_SERVER_IP
```

### 7. Security & Verification (TXT Records)
```dns
# SPF record for email
aijobchommie.co.za          TXT    "v=spf1 include:_spf.google.com ~all"

# DKIM record (get from your email provider)
default._domainkey.aijobchommie.co.za  TXT  "YOUR_DKIM_RECORD"

# DMARC policy
_dmarc.aijobchommie.co.za   TXT    "v=DMARC1; p=quarantine; rua=mailto:dmarc@aijobchommie.co.za"

# Domain verification
aijobchommie.co.za          TXT    "v=verification_code_here"
```

## Implementation Steps

### Step 1: Prepare Server Infrastructure
Before updating DNS, ensure you have:
- [ ] Web server configured and running
- [ ] SSL certificates ready (Let's Encrypt or commercial)
- [ ] Load balancer configured (if using multiple servers)
- [ ] Firewall rules configured

### Step 2: Update DNS Records
1. **Login to your domain registrar's DNS management panel**
2. **Add the A records for main domains:**
   ```
   Host: @              Type: A    Value: YOUR_SERVER_IP    TTL: 300
   Host: www            Type: A    Value: YOUR_SERVER_IP    TTL: 300
   Host: api            Type: A    Value: YOUR_SERVER_IP    TTL: 300
   Host: admin          Type: A    Value: YOUR_SERVER_IP    TTL: 300
   ```

3. **Add staging environment records:**
   ```
   Host: staging        Type: A    Value: YOUR_STAGING_IP   TTL: 300
   Host: api-staging    Type: A    Value: YOUR_STAGING_IP   TTL: 300
   ```

4. **Add CNAME records for CDN:**
   ```
   Host: cdn            Type: CNAME  Value: your-cdn.com    TTL: 300
   Host: assets         Type: CNAME  Value: your-cdn.com    TTL: 300
   ```

### Step 3: SSL Certificate Configuration
```bash
# Using Let's Encrypt Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Test renewal
sudo certbot renew --dry-run
```

### Step 4: Nginx Configuration (if using Nginx)
```nginx
# /etc/nginx/sites-available/aijobchommie.co.za
server {
    listen 80;
    server_name aijobchommie.co.za www.aijobchommie.co.za;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aijobchommie.co.za www.aijobchommie.co.za;
    
    ssl_certificate /etc/letsencrypt/live/aijobchommie.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aijobchommie.co.za/privkey.pem;
    
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
```

## DNS Propagation Timeline
- **Local ISP**: 2-4 hours
- **Global**: 24-48 hours
- **TTL affects cache time**: Set to 300 seconds (5 minutes) during migration

## Verification Commands
```bash
# Check DNS propagation
dig aijobchommie.co.za
dig api.aijobchommie.co.za
nslookup aijobchommie.co.za

# Check from different locations
dig @8.8.8.8 aijobchommie.co.za
dig @1.1.1.1 aijobchommie.co.za

# Check SSL certificate
openssl s_client -connect aijobchommie.co.za:443 -servername aijobchommie.co.za
```

## Troubleshooting

### Common Issues:
1. **DNS not propagating**: Wait 24-48 hours, check TTL settings
2. **SSL certificate issues**: Verify certificate includes all subdomains
3. **502 Bad Gateway**: Check if application servers are running
4. **CORS errors**: Verify CORS_ORIGINS in environment variables

### Quick Fixes:
```bash
# Flush DNS cache (local)
sudo systemctl flush-dns         # Linux
ipconfig /flushdns               # Windows
sudo dscacheutil -flushcache     # macOS

# Restart web server
sudo systemctl restart nginx
sudo systemctl restart apache2

# Check server logs
sudo tail -f /var/log/nginx/error.log
sudo journalctl -f -u your-app-service
```

## Security Considerations
- Use HTTPS everywhere (HSTS enabled)
- Implement proper firewall rules
- Regular security updates
- Monitor for suspicious DNS queries
- Use DNS over HTTPS (DoH) where possible

## Post-Migration Checklist
- [ ] All subdomains resolve correctly
- [ ] SSL certificates valid for all domains
- [ ] Web application loads properly
- [ ] API endpoints accessible
- [ ] Admin panel functional
- [ ] Email delivery working
- [ ] Analytics tracking active
- [ ] SEO redirects in place
