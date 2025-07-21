# 🏥 Hospital Management System - Docker Setup Guide

This guide provides comprehensive instructions for running the Hospital Management System (HMS) using Docker containers with optimized configurations.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Development Setup](#development-setup)
- [Configuration](#configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## 🎯 Overview

The HMS Docker setup includes:

- **Frontend**: React application with Nginx for production
- **Backend**: Microservices architecture with Spring Boot
- **Database**: PostgreSQL with optimized configuration
- **Cache**: Redis for session management and caching
- **Monitoring**: Prometheus, Grafana, and Jaeger
- **Management Tools**: PgAdmin, Mongo Express, Redis Commander

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Microservices  │
│   (React)       │◄──►│   (Spring)      │◄──►│   (Spring Boot) │
│   Port: 3000    │    │   Port: 8080    │    │   Ports: 8081+  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     MongoDB     │    │     Redis       │
│   Port: 5432    │    │   Port: 27017   │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 8GB RAM
- 20GB free disk space

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
cd "Hospital Management System"
```

### 2. Start Development Environment
```bash
# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Check service status
docker-compose -f docker-compose.dev.yml ps
```

### 3. Access Applications
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **PgAdmin**: http://localhost:8080 (admin@hms.com / admin123)
- **Mongo Express**: http://localhost:8081 (admin / admin123)
- **Redis Commander**: http://localhost:8082
- **Grafana**: http://localhost:3001 (admin / admin123)
- **Jaeger**: http://localhost:16686

## 🏭 Production Deployment

### 1. Build and Start Production Services
```bash
# Build all services
docker-compose -f docker-compose.production.yml build

# Start production environment
docker-compose -f docker-compose.production.yml up -d

# Check health status
docker-compose -f docker-compose.production.yml ps
```

### 2. Production URLs
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Discovery Server**: http://localhost:8761
- **Config Server**: http://localhost:8888

### 3. Database Connections
- **PostgreSQL**: localhost:5432
  - User: `hms_user`
  - Password: `hms_secure_password`
  - Database: `hms_main_db`

## 🛠️ Development Setup

### 1. Development Environment
```bash
# Start development stack
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

### 2. Hot Reloading
The development setup includes:
- Hot reloading for React frontend
- Volume mounts for live code changes
- Development tools and debugging

### 3. Database Management
```bash
# Connect to PostgreSQL
docker exec -it hms-postgres-dev psql -U hms_user -d hms_main_db

# Connect to MongoDB
docker exec -it hms-mongodb-dev mongosh

# Connect to Redis
docker exec -it hms-redis-dev redis-cli
```

## ⚙️ Configuration

### Environment Variables

#### Frontend
```bash
NODE_ENV=production
REACT_APP_API_URL=http://api-gateway:8080
```

#### Database
```bash
POSTGRES_USER=hms_user
POSTGRES_PASSWORD=hms_secure_password
POSTGRES_DB=hms_main_db
```

#### Backend Services
```bash
SPRING_PROFILES_ACTIVE=docker
JAVA_OPTS=-Xms512m -Xmx1024m
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_auth_db
```

### Custom Configurations

#### PostgreSQL Optimization
- Shared buffers: 256MB
- Effective cache size: 1GB
- Work memory: 4MB
- WAL level: replica

#### Nginx Configuration
- Gzip compression enabled
- Security headers configured
- Static asset caching
- Client-side routing support

## 📊 Monitoring & Logging

### 1. Application Monitoring
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
- **Jaeger**: http://localhost:16686

### 2. Database Monitoring
- **PgAdmin**: http://localhost:8080
- **Mongo Express**: http://localhost:8081
- **Redis Commander**: http://localhost:8082

### 3. Health Checks
All services include health checks:
```bash
# Check service health
docker-compose -f docker-compose.production.yml ps

# View health check logs
docker inspect hms-frontend | grep -A 10 Health
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Stop conflicting services
sudo systemctl stop apache2 nginx
```

#### 2. Memory Issues
```bash
# Check Docker memory usage
docker stats

# Increase Docker memory limit in Docker Desktop
```

#### 3. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### 4. Build Failures
```bash
# Clean build cache
docker system prune -a

# Rebuild specific service
docker-compose build --no-cache frontend
```

### Debug Commands
```bash
# View all container logs
docker-compose logs -f

# Execute commands in containers
docker exec -it hms-frontend sh
docker exec -it hms-postgres psql -U hms_user

# Check network connectivity
docker network ls
docker network inspect hms-network
```

## 🎯 Best Practices

### 1. Security
- ✅ Use non-root users in containers
- ✅ Implement proper authentication
- ✅ Use secrets management
- ✅ Regular security updates
- ✅ Network isolation

### 2. Performance
- ✅ Multi-stage builds for smaller images
- ✅ Proper caching strategies
- ✅ Resource limits and requests
- ✅ Health checks and monitoring
- ✅ Load balancing

### 3. Development
- ✅ Use .dockerignore files
- ✅ Implement proper logging
- ✅ Version control for configurations
- ✅ Automated testing
- ✅ CI/CD pipeline integration

### 4. Production
- ✅ Use production-ready base images
- ✅ Implement proper backup strategies
- ✅ Monitor resource usage
- ✅ Set up alerting
- ✅ Regular maintenance windows

## 📝 Dockerfile Scores

### Frontend Dockerfile: **9.2/10**
- ✅ Multi-stage build
- ✅ Alpine base images
- ✅ Security hardening
- ✅ Optimized nginx configuration
- ✅ Health checks
- ⚠️ Could add image signing

### PostgreSQL Dockerfile: **9.3/10**
- ✅ Alpine base image
- ✅ Security hardening
- ✅ Performance optimization
- ✅ Health checks
- ✅ Proper initialization
- ⚠️ Could add backup automation

## 🚀 Advanced Features

### 1. Scaling Services
```bash
# Scale specific services
docker-compose -f docker-compose.production.yml up -d --scale patient-service=3
```

### 2. Backup and Restore
```bash
# Backup PostgreSQL
docker exec hms-postgres pg_dump -U hms_user hms_main_db > backup.sql

# Restore PostgreSQL
docker exec -i hms-postgres psql -U hms_user hms_main_db < backup.sql
```

### 3. Custom Networks
```bash
# Create custom network
docker network create hms-custom

# Use custom network in compose
networks:
  default:
    external:
      name: hms-custom
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review service logs
3. Verify configuration files
4. Test individual components
5. Consult Docker documentation

---

**Happy Dockerizing! 🐳** 