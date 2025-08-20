#  Production Security Configuration

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

[...truncated for brevity in file content]
