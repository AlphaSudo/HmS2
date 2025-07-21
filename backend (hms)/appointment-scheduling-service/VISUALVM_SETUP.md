# VisualVM Setup for Appointment Scheduling Service

This guide explains how to set up and use VisualVM for monitoring the Appointment Scheduling Service with two different approaches.

## What is VisualVM?

VisualVM is a visual tool integrating several command-line JDK tools and lightweight profiling capabilities. It provides detailed information about Java applications while they are running on a Java Virtual Machine (JVM).

## Two Approaches Available

### Option 1: Distroless with JMX Support (Recommended)
- **Base Image**: Distroless (minimal, secure)
- **Size**: Smallest footprint
- **Capabilities**: Basic JMX monitoring, memory/thread monitoring
- **Use Case**: Production monitoring, lightweight deployments

### Option 2: Full VisualVM Support
- **Base Image**: OpenJDK slim
- **Size**: Larger but still optimized
- **Capabilities**: Full VisualVM features, advanced profiling
- **Use Case**: Development, debugging, detailed analysis

## Features Available

- **Memory Monitoring**: Monitor heap memory usage, garbage collection, and memory leaks
- **Thread Monitoring**: Analyze thread states, deadlocks, and performance
- **CPU Profiling**: Identify performance bottlenecks and hot methods (full version only)
- **Application Monitoring**: Real-time application metrics and health checks

## Setup Instructions

### Option 1: Distroless with JMX Support

```bash
# Run the distroless version with JMX support
docker-compose -f docker-compose.visualvm.yml --profile distroless up -d

# Or build and run manually
docker build -t appointment-service-distroless .
docker run -d \
  --name appointment-service-distroless \
  -p 8083:8083 \
  -p 9010:9010 \
  appointment-service-distroless
```

### Option 2: Full VisualVM Support

```bash
# Run the full VisualVM version
docker-compose -f docker-compose.visualvm.yml --profile full-visualvm up -d

# Or build and run manually
docker build -f Dockerfile.visualvm -t appointment-service-visualvm .
docker run -d \
  --name appointment-service-visualvm \
  -p 8084:8083 \
  -p 9011:9010 \
  appointment-service-visualvm
```

### Connect VisualVM to the Container

1. **Install VisualVM** (if not already installed):
   - Download from: https://visualvm.github.io/
   - Or install via package manager: `sudo apt-get install visualvm`

2. **Connect to the JVM**:
   - Open VisualVM
   - Go to "File" → "Add JMX Connection"
   - Enter connection details:
     - **For Distroless**: Host: `localhost`, Port: `9010`
     - **For Full VisualVM**: Host: `localhost`, Port: `9011`
     - **Connection Name**: `Appointment Service`

3. **Alternative: Remote Connection**:
   - In VisualVM, go to "File" → "Add Remote Host"
   - Add your Docker host IP
   - Then add JMX connection to that host on the appropriate port

## JMX Configuration

Both services are configured with the following JMX settings:

- **Distroless Port**: 9010
- **Full VisualVM Port**: 9011
- **Authentication**: Disabled (for development)
- **SSL**: Disabled (for development)
- **Hostname**: 0.0.0.0 (accessible from any IP)

## Comparison of Approaches

| Feature | Distroless | Full VisualVM |
|---------|------------|---------------|
| Image Size | ~50MB | ~200MB |
| Security | High (minimal attack surface) | Medium |
| JMX Monitoring | ✅ | ✅ |
| Memory Monitoring | ✅ | ✅ |
| Thread Monitoring | ✅ | ✅ |
| CPU Profiling | ❌ | ✅ |
| Advanced Features | ❌ | ✅ |
| Production Ready | ✅ | ✅ |

## Security Considerations

⚠️ **Important**: The current configuration disables authentication and SSL for development purposes. For production environments:

1. Enable authentication:
   ```bash
   -Dcom.sun.management.jmxremote.authenticate=true
   -Dcom.sun.management.jmxremote.password.file=/path/to/password/file
   ```

2. Enable SSL:
   ```bash
   -Dcom.sun.management.jmxremote.ssl=true
   -Dcom.sun.management.jmxremote.registry.ssl=true
   ```

3. Use a firewall to restrict access to the JMX port

## Monitoring Features

### Memory Monitoring (Both Versions)
- Monitor heap and non-heap memory usage
- Track garbage collection activity
- Identify memory leaks

### Thread Monitoring (Both Versions)
- View all running threads
- Analyze thread states and stack traces
- Detect deadlocks

### CPU Profiling (Full VisualVM Only)
- Profile CPU usage by method
- Identify performance bottlenecks
- Analyze method call frequency

### Application Monitoring (Both Versions)
- Monitor application health
- Track request/response metrics
- View application logs

## Troubleshooting

### Connection Issues
1. **Check if the container is running**:
   ```bash
   # For distroless
   docker ps | grep appointment-service-distroless
   
   # For full VisualVM
   docker ps | grep appointment-service-visualvm
   ```

2. **Verify port mapping**:
   ```bash
   # For distroless
   docker port appointment-service-distroless
   
   # For full VisualVM
   docker port appointment-service-visualvm
   ```

3. **Check container logs**:
   ```bash
   # For distroless
   docker logs appointment-service-distroless
   
   # For full VisualVM
   docker logs appointment-service-visualvm
   ```

### VisualVM Connection Problems
1. **Firewall**: Ensure the correct JMX port is not blocked
2. **Network**: Verify Docker network configuration
3. **Hostname**: Use the correct Docker host IP address
4. **Port**: Use the correct port (9010 for distroless, 9011 for full VisualVM)

### Performance Impact
- JMX monitoring adds minimal overhead
- Profiling can impact performance - use sparingly in production
- Consider using sampling instead of instrumentation for production profiling

## Example Commands

```bash
# Start distroless version
docker-compose -f docker-compose.visualvm.yml --profile distroless up -d

# Start full VisualVM version
docker-compose -f docker-compose.visualvm.yml --profile full-visualvm up -d

# View logs for distroless
docker-compose -f docker-compose.visualvm.yml --profile distroless logs -f

# View logs for full VisualVM
docker-compose -f docker-compose.visualvm.yml --profile full-visualvm logs -f

# Stop services
docker-compose -f docker-compose.visualvm.yml down

# Rebuild and restart
docker-compose -f docker-compose.visualvm.yml --profile distroless up --build -d
```

## Recommendation

- **For Production**: Use the distroless version for its security and size benefits
- **For Development**: Use the full VisualVM version for advanced debugging capabilities
- **For CI/CD**: Use the distroless version for consistent, lightweight deployments

## Additional Resources

- [VisualVM Documentation](https://visualvm.github.io/documentation.html)
- [JMX Monitoring Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/management/agent.html)
- [Docker JMX Best Practices](https://docs.docker.com/engine/reference/builder/#expose)
- [Distroless Images](https://github.com/GoogleContainerTools/distroless) 