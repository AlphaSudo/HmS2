# syntax=docker/dockerfile:1.4

### 1. Build + deps resolution
FROM maven:3.9-eclipse-temurin-17 AS deps
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN ./mvnw -B -DskipTests -Dcheckstyle.skip=true dependency:go-offline
COPY src src
RUN ./mvnw -B -DskipTests -Dcheckstyle.skip=true package
RUN ls -la target/ && \
    jdeps --multi-release 17 --print-module-deps \
    -q --recursive --class-path target/*.jar > deps.info 2>/dev/null || \
    echo "java.base,java.logging,java.xml,java.naming,java.desktop,java.management,java.security.jgss,java.instrument" > deps.info

### 2. Create custom JRE with jlink
FROM openjdk:17-jdk-slim AS jre
RUN apt-get update && apt-get install -y binutils && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/deps.info /deps.info
RUN jlink \
    --module-path /usr/lib/jvm/java-17-openjdk-amd64/jmods \
    --add-modules "$(cat /deps.info)" \
    --strip-debug --compress=2 --no-header-files --no-man-pages \
    --output /opt/customjre

### 3. Build Spring Boot app
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN ./mvnw -B -DskipTests -Dcheckstyle.skip=true dependency:go-offline
COPY src src
RUN ./mvnw -B -DskipTests -Dcheckstyle.skip=true package 

### 4. Final runtime image (Distroless + non-root)
FROM gcr.io/distroless/java17-debian12:nonroot
WORKDIR /app

COPY --from=jre /opt/customjre /opt/customjre
ENV JAVA_HOME=/opt/customjre PATH="$JAVA_HOME/bin:$PATH"

# Copy built JAR
COPY --from=builder /app/target/*.jar ./app.jar
EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"] 