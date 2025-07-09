# Springdoc OpenAPI Integration

This document provides details on the Springdoc OpenAPI integration for the Spring Boot microservices in this project.

## Overview

The `springdoc-openapi-starter-webmvc-ui` dependency has been added to the following microservices to automatically generate interactive API documentation using Swagger UI.

- `appointment-scheduling-service`
- `authentication-service`
- `billing-invoicing-service`
- `doctor-management-service`
- `ehr-reports-service`
- `notification-service`
- `patient-management-service`

## Accessing API Documentation

Once a microservice is running, you can access its API documentation via the following URLs:

### Swagger UI

The interactive Swagger UI is available at:

`http://<service-host>:<service-port>/swagger-ui.html`

Replace `<service-host>` and `<service-port>` with the actual host and port of the running microservice. For example, if the `patient-management-service` is running locally on port `8081`, the URL would be:

`http://localhost:8081/swagger-ui.html`

### OpenAPI 3 Specification

The raw OpenAPI 3 specification in JSON format is available at:

`http://<service-host>:<service-port>/v3/api-docs`

The YAML format is available at:

`http://<service-host>:<service-port>/v3/api-docs.yaml` 