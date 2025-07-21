# syntax=docker/dockerfile:1.4

### 1. Build Stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies for better caching
COPY package.json package-lock.json ./
RUN npm ci  && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

### 2. Production Nginx Stage
FROM nginx:stable-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built assets from build stage
COPY --from=build /app/dist/public /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf


# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Switch to non-root user
#USER nginx

# Expose port
EXPOSE 80



# Start nginx
CMD ["nginx", "-g", "daemon off;"] 