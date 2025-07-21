#!/bin/bash

echo "=== Testing Config Server Layertools ==="

# Clean and build
echo "1. Building the application..."
./mvnw clean package -DskipTests -Dcheckstyle.skip=true

# Check JAR file
echo "2. Checking JAR file..."
ls -la target/*.jar

# Test if JAR is executable
echo "3. Testing JAR execution..."
java -jar target/*.jar --version || echo "JAR is not executable"

# Extract layers
echo "4. Extracting layers..."
java -Djarmode=layertools -jar target/*.jar extract

# Check extracted structure
echo "5. Checking extracted structure..."
echo "=== Dependencies ==="
ls -la target/dependencies/ 2>/dev/null || echo "dependencies folder missing"

echo "=== Spring Boot Loader ==="
ls -la target/spring-boot-loader/ 2>/dev/null || echo "spring-boot-loader folder missing"

echo "=== Application ==="
ls -la target/application/ 2>/dev/null || echo "application folder missing"

# Check for Launcher class
echo "6. Looking for Launcher class..."
find target/spring-boot-loader -name "Launcher.class" 2>/dev/null || echo "Launcher.class not found"

echo "=== Test Complete ===" 