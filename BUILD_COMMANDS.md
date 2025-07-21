# 1. Create network
docker network create hms-core-network --subnet=172.20.0.0/16

# 2. Build the 3 core services
docker build -t hms-config-server:latest ./backend\ \(hms\)/config-server-service
docker build -t hms-discovery-server:latest ./backend\ \(hms\)/discovery-server-service
docker build -t hms-api-gateway:latest ./backend\ \(hms\)/api-gateway-service

# 3. Start in order
docker run -d --name hms-config-server -p 8888:8888 --network hms-core-network hms-config-server:latest
docker run -d --name hms-discovery-server -p 8761:8761 --network hms-core-network hms-discovery-server:latest
docker run -d --name hms-api-gateway -p 8080:8080 --network hms-core-network hms-api-gateway:latest



# 🐳 Individual Docker Build Commands

This guide provides individual Docker build commands for each service in the Hospital Management System. Use these commands when you want to build services individually or troubleshoot specific builds.

## 📋 Prerequisites

Make sure you're in the root directory of the project:
```bash
cd "Hospital Management System"
```

## 🏗️ Core Infrastructure Services

### 1. Config Server
```bash
# Build config server
docker build -t hms-config-server:latest ./backend\ \(hms\)/config-server-service

# Run config server
docker run -d --name hms-config-server \
  -p 8888:8888 \
  -v "$(pwd)/backend (hms)/config-server-service/config-repo:/app/config-repo:ro" \
  -e SPRING_PROFILES_ACTIVE=native \
  -e JAVA_OPTS="-Xms256m -Xmx512m" \
  hms-config-server:latest
```

### 2. Discovery Server
```bash
# Build discovery server
docker build -t hms-discovery-server:latest ./backend\ \(hms\)/discovery-server-service

# Run discovery server (requires config server to be running)
docker run -d --name hms-discovery-server \
  -p 8761:8761 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms256m -Xmx512m" \
  hms-discovery-server:latest
```

### 3. API Gateway
```bash
# Build API gateway
docker build -t hms-api-gateway:latest ./backend\ \(hms\)/api-gateway-service

# Run API gateway (requires config and discovery servers)
docker run -d --name hms-api-gateway \
  -p 8080:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  hms-api-gateway:latest
```

## 🔐 Authentication & User Services

### 4. Authentication Service
```bash
# Build authentication service
docker build -t hms-auth-service:latest ./backend\ \(hms\)/authentication-service

# Run authentication service
docker run -d --name hms-auth-service \
  -p 8081:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_auth_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-auth-service:latest
```

### 5. Patient Management Service
```bash
# Build patient service
docker build -t hms-patient-service:latest ./backend\ \(hms\)/patient-management-service

# Run patient service
docker run -d --name hms-patient-service \
  -p 8082:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_patients_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-patient-service:latest
```

### 6. Doctor Management Service
```bash
# Build doctor service
docker build -t hms-doctor-service:latest ./backend\ \(hms\)/doctor-management-service

# Run doctor service
docker run -d --name hms-doctor-service \
  -p 8083:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_doctors_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-doctor-service:latest
```

## 📅 Appointment & Scheduling Services

### 7. Appointment Scheduling Service
```bash
# Build appointment service
docker build -t hms-appointment-service:latest ./backend\ \(hms\)/appointment-scheduling-service

# Run appointment service
docker run -d --name hms-appointment-service \
  -p 8084:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_appointments_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-appointment-service:latest
```

## 💰 Billing & Financial Services

### 8. Billing Service
```bash
# Build billing service
docker build -t hms-billing-service:latest ./backend\ \(hms\)/billing-invoicing-service

# Run billing service
docker run -d --name hms-billing-service \
  -p 8085:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_billing_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-billing-service:latest
```

## 🏥 Medical Services

### 9. Pharmacy Management Service
```bash
# Build pharmacy service
docker build -t hms-pharmacy-service:latest ./backend\ \(hms\)/pharmacy-management-service

# Run pharmacy service
docker run -d --name hms-pharmacy-service \
  -p 8086:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_pharmacy_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-pharmacy-service:latest
```

### 10. Laboratory Service
```bash
# Build laboratory service
docker build -t hms-laboratory-service:latest ./backend\ \(hms\)/laboratory-diagnostic-service

# Run laboratory service
docker run -d --name hms-laboratory-service \
  -p 8087:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_laboratory_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-laboratory-service:latest
```

## 🔔 Support Services

### 11. Notification Service
```bash
# Build notification service
docker build -t hms-notification-service:latest ./backend\ \(hms\)/notification-service

# Run notification service
docker run -d --name hms-notification-service \
  -p 8088:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms256m -Xmx512m" \
  hms-notification-service:latest
```

### 12. EHR Reports Service
```bash
# Build reports service
docker build -t hms-reports-service:latest ./backend\ \(hms\)/ehr-reports-service

# Run reports service
docker run -d --name hms-reports-service \
  -p 8089:8080 \
  --network hms-core-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e JAVA_OPTS="-Xms512m -Xmx1024m" \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hms_reports_db \
  -e SPRING_DATASOURCE_USERNAME=hms_user \
  -e SPRING_DATASOURCE_PASSWORD=hms_secure_password \
  hms-reports-service:latest
```

## 🤖 AI/ML Prediction Services

### 13. Diabetes Prediction Service
```bash
# Build diabetes prediction service
docker build -t hms-diabetes-prediction:latest ./backend\ \(hms\)/diabetes-prediction-service

# Run diabetes prediction service
docker run -d --name hms-diabetes-prediction \
  -p 8090:8000 \
  --network hms-core-network \
  hms-diabetes-prediction:latest
```

### 14. Liver Disease Prediction Service
```bash
# Build liver disease prediction service
docker build -t hms-liver-prediction:latest ./backend\ \(hms\)/liver-disease-prediction-service

# Run liver disease prediction service
docker run -d --name hms-liver-prediction \
  -p 8091:8000 \
  --network hms-core-network \
  hms-liver-prediction:latest
```

### 15. Stroke Prediction Service
```bash
# Build stroke prediction service
docker build -t hms-stroke-prediction:latest ./backend\ \(hms\)/stroke-prediction-service

# Run stroke prediction service
docker run -d --name hms-stroke-prediction \
  -p 8092:8000 \
  --network hms-core-network \
  hms-stroke-prediction:latest
```

## 🎨 Frontend Application

### 16. React Frontend (Production)
```bash
# Build frontend production image
docker build -t hms-frontend:latest ./frontend

# Run frontend
docker run -d --name hms-frontend \
  -p 3000:80 \
  --network hms-core-network \
  -e NODE_ENV=production \
  -e REACT_APP_API_URL=http://api-gateway:8080 \
  hms-frontend:latest
```

### 17. React Frontend (Development)
```bash
# Build frontend development image
docker build -t hms-frontend-dev:latest -f ./frontend/Dockerfile.dev ./frontend

# Run frontend development
docker run -d --name hms-frontend-dev \
  -p 3000:3000 \
  -v "$(pwd)/frontend:/app" \
  -v /app/node_modules \
  --network hms-core-network \
  -e NODE_ENV=development \
  -e CHOKIDAR_USEPOLLING=true \
  -e REACT_APP_API_URL=http://localhost:8080 \
  hms-frontend-dev:latest
```

## 🗄️ Database Services

### 18. PostgreSQL Database
```bash
# Build PostgreSQL with custom configuration
docker build -t hms-postgres:latest -f ./database/Dockerfile.postgres ./database

# Run PostgreSQL
docker run -d --name hms-postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -v "$(pwd)/database/initdb.sh:/docker-entrypoint-initdb.d/01-init-hms.sh:ro" \
  -v "$(pwd)/database/setup-extensions.sql:/docker-entrypoint-initdb.d/02-setup-extensions.sql:ro" \
  --network hms-core-network \
  -e POSTGRES_USER=hms_user \
  -e POSTGRES_PASSWORD=hms_secure_password \
  -e POSTGRES_DB=hms_main_db \
  -e POSTGRES_INITDB_ARGS="--auth-host=scram-sha-256 --auth-local=scram-sha-256" \
  hms-postgres:latest
```

### 19. MongoDB
```bash
# Run MongoDB (using official image)
docker run -d --name hms-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  -v "$(pwd)/database/docker-mongodb-init.js:/docker-entrypoint-initdb.d/init-mongo.js:ro" \
  --network hms-core-network \
  -e MONGO_INITDB_DATABASE=hms_medical_history_db \
  mongo:7.0-alpine
```

### 20. Redis Cache
```bash
# Run Redis (using official image)
docker run -d --name hms-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  --network hms-core-network \
  redis:7-alpine redis-server --appendonly yes --requirepass hms_redis_password
```

## 🔧 Utility Commands

### Create Network
```bash
# Create the core network
docker network create hms-core-network --subnet=172.20.0.0/16
```

### Build All Services (Script)
```bash
#!/bin/bash
# Build all services at once
services=(
    "config-server"
    "discovery-server"
    "api-gateway"
    "authentication-service"
    "patient-management-service"
    "doctor-management-service"
    "appointment-scheduling-service"
    "billing-invoicing-service"
    "pharmacy-management-service"
    "laboratory-diagnostic-service"
    "notification-service"
    "ehr-reports-service"
    "diabetes-prediction-service"
    "liver-disease-prediction-service"
    "stroke-prediction-service"
)

for service in "${services[@]}"; do
    echo "Building $service..."
    docker build -t "hms-${service}:latest" "./backend (hms)/${service}"
done

echo "Building frontend..."
docker build -t hms-frontend:latest ./frontend

echo "Building PostgreSQL..."
docker build -t hms-postgres:latest -f ./database/Dockerfile.postgres ./database

echo "All services built successfully!"
```

### Clean Up Commands
```bash
# Stop all containers
docker stop $(docker ps -q --filter "name=hms-*")

# Remove all containers
docker rm $(docker ps -aq --filter "name=hms-*")

# Remove all images
docker rmi $(docker images -q --filter "reference=hms-*")

# Remove volumes
docker volume rm postgres_data mongodb_data redis_data

# Remove network
docker network rm hms-core-network

# Clean everything
docker system prune -a --volumes
```

## 📊 Health Check Commands

### Check Service Health
```bash
# Check if services are responding
curl -f http://localhost:8888/actuator/health  # Config Server
curl -f http://localhost:8761/actuator/health  # Discovery Server
curl -f http://localhost:8080/actuator/health  # API Gateway
curl -f http://localhost:3000/health           # Frontend
```

### Check Database Connections
```bash
# PostgreSQL
docker exec hms-postgres pg_isready -U hms_user -d hms_main_db

# MongoDB
docker exec hms-mongodb mongosh --eval "db.adminCommand('ping')"

# Redis
docker exec hms-redis redis-cli ping
```

## 🚀 Quick Start Sequence

For a minimal setup with just the core services:

```bash
# 1. Create network
docker network create hms-core-network --subnet=172.20.0.0/16

# 2. Build and start core services
docker build -t hms-config-server:latest ./backend\ \(hms\)/config-server-service
docker build -t hms-discovery-server:latest ./backend\ \(hms\)/discovery-server-service
docker build -t hms-api-gateway:latest ./backend\ \(hms\)/api-gateway-service

# 3. Start in order
docker run -d --name hms-config-server -p 8888:8888 --network hms-core-network hms-config-server:latest
docker run -d --name hms-discovery-server -p 8761:8761 --network hms-core-network hms-discovery-server:latest
docker run -d --name hms-api-gateway -p 8080:8080 --network hms-core-network hms-api-gateway:latest

# 4. Check status
docker ps --filter "name=hms-*"
```

## 📝 Notes

- **Port Conflicts**: Make sure ports are not already in use
- **Memory**: Some services require significant memory (especially Java services)
- **Dependencies**: Services have specific startup order requirements
- **Networking**: All services should be on the same network for communication
- **Volumes**: Database services require persistent volumes for data storage

## 🔍 Troubleshooting

### Build Issues
```bash
# Check build context
docker build --progress=plain -t test-image ./service-path

# Check for missing files
ls -la ./service-path/

# Check Dockerfile syntax
docker build --no-cache -t test-image ./service-path
```

### Runtime Issues
```bash
# Check container logs
docker logs container-name

# Check container status
docker inspect container-name

# Check network connectivity
docker network inspect hms-core-network
```

---

**Happy Building! 🐳** 