# Hospital Management System (HMS)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)

A comprehensive, scalable, and modular Hospital Management System (HMS) built with a microservices architecture. This system streamlines hospital operations, including patient management, doctor management, appointment scheduling and billing.

---

## 🚀 Features

- **Patient Management**: Register, update, and manage patient records.
- **Doctor Management**: Manage doctor profiles, schedules, and specialties.
- **Appointment Scheduling**: Book, update, and track appointments.
- **Billing & Invoicing**: Automated billing and invoice generation.
- **Pharmacy Management**: Manage pharmacy inventory and prescriptions.
- **Authentication & Authorization**: Secure login and role-based access.
- **Config & Discovery**: Centralized configuration and service discovery.
- **API Gateway**: Unified entry point for all backend services.
- **Modern Frontend**: Intuitive web interface for staff and admins.

---

## 🗂️ Monorepo Structure

```
backend (hms)/
  ├── api-gateway-service/
  ├── appointment-scheduling-service/
  ├── authentication-service/
  ├── billing-invoicing-service/
  ├── config-server-service/
  ├── discovery-server-service/
  ├── doctor-management-service/
  ├── patient-management-service/
  ├── pharmacy-management-service/
frontend/
database/
```

- **backend/**: Java Spring Boot microservices
- **database/**: SQL scripts, Docker Compose, and configs
- **frontend/**: React web client

---

## 🛠️ Tech Stack

- **Backend**: Java (Spring Boot)
- **Frontend**: React, TypeScript
- **Database**: PostgreSQL, MongoDB
- **Containerization**: Docker, Docker Compose
- **Service Discovery**: Eureka
- **API Gateway**: Spring Cloud Gateway
- **Configuration**: Spring Cloud Config

---

## ⚡ Setup & Installation

### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/) (for frontend development)
- [Java 17+](https://adoptopenjdk.net/) (for backend services development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/hospital-management-system.git
cd hospital-management-system
```

### 2. Environment Configuration
- Backend services: Edit `application.yml` or `application-docker.yml` in each service as needed.
- Database: See `database/docker-compose.yml` and SQL scripts in `database/dev-scripts/`.
- Frontend: Configure API endpoints in `frontend/client/src/lib/api.ts` if needed.

### 3. Build & Run with Docker Compose
```bash
# From the root directory
docker-compose -f docker-compose.core.yml up --build
```

### 4. Start the Frontend (Development Mode)
```bash
cd frontend/client
npm install
npm start
```

---

## ▶️ Running the Project

- **Backend**: All microservices are containerized. Use `docker-compose.core.yml` for orchestration.
- **Frontend**: Runs on [http://localhost:5000](http://localhost:5000) by default (served via Nginx container).
- **API Gateway**: [http://localhost:8080](http://localhost:8080)
- **Service Discovery (Eureka)**: [http://localhost:8761](http://localhost:8761)
- **Config Server**: [http://localhost:8888](http://localhost:8888)
- **PostgreSQL**: [localhost:5432](localhost:5432)
- **MongoDB**: [localhost:27017](localhost:27017)

---

## 🚀 Deployment

- See `DEPLOY_TO_AWS_EC2.md` and `DOCKER_SETUP.md` for cloud deployment and Docker best practices.
- Environment variables and secrets should be managed securely (not committed to the repo).

---

## 🤝 Contributing

Contributions are welcome! Please open issues and submit pull requests for new features, bug fixes, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📫 Contact

For questions, support, or feedback:
- **Email**: [ahmed.yasser.morra@gmail.com](mailto:ahmed.yasser.morra@gmail.com)
- **GitHub Issues**: [Open an issue](https://github.com/AlphaSudo/HmS2/issues)

---

> © 2025 Hospital Management System. All rights reserved. 