# Pharmacy Management Service

A comprehensive microservice for managing pharmaceutical operations including medications, prescriptions, and inventory within a hospital management system.

## Features

### Medication Management
- Create, read, update, and delete medications
- Track medication inventory and stock levels
- Monitor expiration dates
- Manage medication categories and manufacturers
- Handle prescription requirements
- Search medications by name, category, or manufacturer

### Prescription Management
- Create and manage prescriptions
- Track prescription status (pending, dispensed, partially dispensed, cancelled)
- Link prescriptions to patients and doctors
- Manage prescription items with dosage and frequency
- Dispense medications and update inventory

### Inventory Management
- Track inventory transactions
- Monitor low stock levels
- Handle stock adjustments
- Maintain audit trail of stock movements

### Dashboard & Analytics
- Real-time pharmacy statistics
- Low stock and expiring medication alerts
- Prescription status overview
- Category and manufacturer analytics

## Technology Stack

- **Java 17**
- **Spring Boot 3.4.5**
- **Spring Cloud 2024.0.1**
- **PostgreSQL** (Primary database)
- **Spring Data JPA** (Data persistence)
- **MapStruct** (Entity-DTO mapping)
- **Spring Security** (Security)
- **Maven** (Build tool)
- **Docker** (Containerization)

## API Endpoints

### Medication Endpoints
```
GET    /api/medications                     - Get all medications
POST   /api/medications                     - Create new medication
GET    /api/medications/{id}                - Get medication by ID
PUT    /api/medications/{id}                - Update medication
DELETE /api/medications/{id}                - Delete medication
GET    /api/medications/name/{name}         - Get medication by name
GET    /api/medications/category/{category} - Get medications by category
GET    /api/medications/low-stock           - Get low stock medications
GET    /api/medications/search              - Search medications
PUT    /api/medications/{id}/stock          - Update medication stock
PUT    /api/medications/{id}/adjust-stock   - Adjust medication stock
```

### Prescription Endpoints
```
GET    /api/prescriptions                   - Get all prescriptions
POST   /api/prescriptions                   - Create new prescription
GET    /api/prescriptions/{id}              - Get prescription by ID
GET    /api/prescriptions/number/{number}   - Get prescription by number
GET    /api/prescriptions/patient/{id}      - Get prescriptions by patient
GET    /api/prescriptions/doctor/{id}       - Get prescriptions by doctor
PUT    /api/prescriptions/{id}/dispense     - Dispense prescription
PUT    /api/prescriptions/{id}/cancel       - Cancel prescription
```

### Dashboard Endpoints
```
GET    /api/dashboard/stats                 - Get dashboard statistics
GET    /api/dashboard/alerts                - Get alerts (low stock, expiring)
GET    /api/dashboard/medications/categories - Get medication category counts
GET    /api/dashboard/health                - Health check
```

## Configuration

### Database Configuration
The service uses PostgreSQL as the primary database. Configure the following environment variables:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pharmacy_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Service Discovery
The service registers with Eureka Server for service discovery:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Configuration Server
External configuration is managed through Spring Cloud Config Server:

```yaml
spring:
  config:
    import: "optional:configserver:http://localhost:8888"
```

## Running the Service

### Local Development
1. Ensure PostgreSQL is running
2. Create database: `pharmacy_db`
3. Run the application:
```bash
./mvnw spring-boot:run
```

### Docker
Build and run with Docker:
```bash
docker build -t pharmacy-management-service .
docker run -p 8080:8080 pharmacy-management-service
```

### Docker Compose
Use with the complete hospital management system:
```bash
docker-compose up pharmacy-management-service
```

## Database Schema

### Key Tables
- **medications**: Stores medication information
- **prescriptions**: Stores prescription headers
- **prescription_items**: Stores individual prescription items
- **inventory_transactions**: Tracks stock movements

### Sample Data
The service includes sample medications:
- Paracetamol (Pain Relief)
- Amoxicillin (Antibiotic)
- Ibuprofen (Anti-inflammatory)
- Metformin (Diabetes medication)
- Cetirizine (Antihistamine)

## Security

- JWT-based authentication (when integrated with auth service)
- CORS enabled for frontend integration
- Input validation with Bean Validation
- SQL injection protection with JPA

## Monitoring

- Spring Boot Actuator endpoints enabled
- Health checks available at `/actuator/health`
- Metrics available at `/actuator/metrics`
- Custom health check at `/api/dashboard/health`

## Error Handling

Global exception handling provides consistent error responses:
- Validation errors with field-specific messages
- Runtime exceptions with appropriate HTTP status codes
- Structured error responses with timestamps

## Future Enhancements

- Integration with external pharmacy systems
- Barcode scanning support
- Advanced analytics and reporting
- Mobile app support
- Integration with insurance systems
- Drug interaction checking
- Automated reordering based on stock levels

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is part of the Hospital Management System and follows the same licensing terms. 