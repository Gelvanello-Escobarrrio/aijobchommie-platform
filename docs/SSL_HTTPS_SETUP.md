#  SSL Certificate & HTTPS Setup Guide

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

## Nginx HTTPS Configuration

[...truncated for brevity in file content]
