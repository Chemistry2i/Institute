# 🎓 Tertiary Institution Management System

<p align="center">
  <strong>A centralized, secure and scalable platform for managing tertiary institution operations and academic processes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Bootstrap-UI-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square" alt="Project Status">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Region-Uganda-green?style=flat-square" alt="Uganda">
</p>

---

## 📖 Overview

The **Tertiary Institution Management System (TIMS)** is a comprehensive web-based platform designed to digitize, automate and centralize the administrative, academic, financial and operational activities of tertiary institutions in Uganda.

The platform provides a unified environment where institution administrators, academic staff, lecturers, finance officers and students can interact with institutional services through role-specific dashboards.

It aims to reduce manual administrative processes, improve academic record management, enhance transparency and provide reliable access to institutional information.

The system is designed with scalability, security, maintainability and extensibility in mind.

## 🎯 Project Objectives

- Centralize student and institutional records.
- Automate admissions and student registration.
- Simplify academic programme and curriculum management.
- Improve examination, grading and results processing.
- Streamline tuition and other institutional payments.
- Provide real-time academic and administrative reporting.
- Improve communication between students and institutional departments.
- Support configurable academic policies and institutional structures.
- Provide secure role-based access to institutional resources.

## ✨ Core Features

### 1. Authentication and Access Control
- Secure user authentication.
- Role-based access control (RBAC).
- Permission-based authorization.
- Password reset and account recovery.
- Session and token management.
- User account activation and deactivation.
- Audit logging for sensitive activities.

### 2. Admissions Management
- Online application management.
- Applicant registration and application tracking.
- Admission requirements and eligibility configuration.
- Document submission and verification.
- Application review and approval workflows.
- Admission letters and reporting.

### 3. Student Information Management
- Centralized student profiles.
- Student identification and registration numbers.
- Academic history and progression.
- Faculty, department and programme allocation.
- Student status management.
- Next-of-kin and emergency contact records.
- Student document management.

### 4. Academic Structure Management
- Institution and campus management.
- Faculties and schools.
- Departments.
- Academic programmes.
- Course units and modules.
- Academic years and semesters.
- Curriculum and credit-unit management.
- Configurable grading systems.

### 5. Course Registration
- Semester-based course registration.
- Core and elective course selection.
- Registration approval workflows.
- Course prerequisites.
- Registration status tracking.
- Add/drop course management.

### 6. Timetable and Attendance
- Lecture timetable management.
- Examination timetable management.
- Room and venue allocation.
- Lecturer allocation.
- Student attendance tracking.
- Timetable conflict detection.

### 7. Examinations and Results
- Examination management.
- Continuous assessment records.
- Examination marks entry.
- Configurable grading scales.
- GPA and CGPA computation.
- Results moderation and approval.
- Transcript generation.
- Academic progression tracking.
- Results publication and student access.

### 8. Finance and Payments
- Tuition and functional fee management.
- Student billing and invoices.
- Payment recording and reconciliation.
- Outstanding balance tracking.
- Receipts generation.
- Scholarships and sponsorship management.
- Financial statements and reports.

### 9. Learning Resources
- Course materials management.
- Notes and document uploads.
- Academic resource sharing.
- Student access to learning materials.
- Resource categorization and search.

### 10. Library Management
- Library catalogue management.
- Book borrowing and returns.
- Member management.
- Due-date tracking.
- Overdue book management.
- Library usage reports.

### 11. Human Resource Management
- Staff profiles.
- Departmental staff allocation.
- Employment records.
- Staff attendance.
- Leave management.
- Staff-related reporting.

### 12. Communication and Notifications
- Institutional announcements.
- Student notifications.
- Staff notifications.
- Email notifications.
- Academic calendar announcements.
- Department-specific communication.

### 13. Accommodation Management
- Hostel and residence management.
- Room allocation.
- Student accommodation applications.
- Occupancy tracking.
- Accommodation fee management.

### 14. Reporting and Analytics
- Student enrolment reports.
- Admissions statistics.
- Academic performance reports.
- Financial reports.
- Staff reports.
- Course registration reports.
- Graduation reports.
- Exportable reports.

## 👥 User Roles

The platform supports configurable roles and permissions, including:

| Role | Responsibilities |
|---|---|
| Super Administrator | System-wide configuration and management |
| ICT Administrator | Technical administration and user support |
| Institution Head | Institutional oversight and reporting |
| Academic Registrar | Academic records and academic administration |
| Admissions Officer | Applicant processing and admissions |
| Faculty Dean | Faculty administration and oversight |
| Head of Department | Departmental academic management |
| Programme Coordinator | Programme and course coordination |
| Examination Officer | Examination and results administration |
| Lecturer | Course management, attendance and marks |
| Academic Adviser | Student academic guidance |
| Finance Officer | Fees, billing and financial reporting |
| Cashier | Payment recording and receipts |
| Librarian | Library operations |
| HR Officer | Staff records and HR processes |
| Student | Academic profile, registration and results |
| Parent/Sponsor | Authorized access to selected student information |
| Auditor | Read-only access to authorized audit records |

Permissions should be configurable rather than permanently tied to role names.

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe frontend development |
| Vite | Frontend build tooling |
| Bootstrap 5.3+ | Responsive layout and components |
| shadcn/ui | Reusable interface components |
| Tailwind CSS | Utility-based styling |
| Poppins | Primary typography |
| Font Awesome | Icons |
| React Router | Application routing |
| TanStack Query | Server state management |
| React Hook Form | Form management |
| Zod | Form and data validation |
| Axios | HTTP communication |
| SweetAlert2 | Alerts and confirmations |

### Backend

| Technology | Purpose |
|---|---|
| Java 21 LTS | Backend programming language |
| Spring Boot | Backend application framework |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database persistence |
| Hibernate | ORM |
| MySQL 8+ | Relational database |
| Flyway | Database migration management |
| BCrypt | Password hashing |
| OpenAPI / Swagger | API documentation |
| JUnit 5 | Backend testing |
| Maven | Dependency and build management |

### Infrastructure and Tools

- Git and GitHub — version control.
- Docker and Docker Compose — containerization.
- Nginx — frontend serving and reverse proxy.
- GitHub Actions — CI/CD automation.
- Object storage — documents and uploaded files.
- Centralized logging and monitoring — operational visibility.

## 🏗️ System Architecture

The application follows a modular, layered backend architecture with a separate frontend client.

```text
                  USERS
                    |
                    v
          REACT + TYPESCRIPT
                    |
                    v
              NGINX / API
                    |
                    v
          SPRING BOOT BACKEND
                    |
       +------------+------------+
       |            |            |
       v            v            v
   SECURITY     CONTROLLERS   VALIDATION
       |            |            |
       +------------+------------+
                    |
                    v
              SERVICE LAYER
                    |
       +------------+------------+
       |            |            |
       v            v            v
   ADMISSIONS   ACADEMICS     FINANCE
       |            |            |
       +------------+------------+
                    |
                    v
             REPOSITORY LAYER
                    |
                    v
                 MYSQL
                    |
          +---------+---------+
          |                   |
          v                   v
     FILE STORAGE         BACKUPS
```

### Architectural Principles

- Modular monolith as the initial deployment architecture.
- Clear separation of concerns.
- Layered backend architecture.
- RESTful API design.
- Role-based and permission-based security.
- Database normalization and referential integrity.
- Centralized exception handling.
- Database versioning with Flyway.
- Automated testing.
- Future-ready integration boundaries.

## 📁 Proposed Project Structure

```text
tertiary-institution-management/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── modules/
│   │   │   ├── admissions/
│   │   │   ├── students/
│   │   │   ├── academics/
│   │   │   ├── registration/
│   │   │   ├── examinations/
│   │   │   ├── finance/
│   │   │   ├── library/
│   │   │   ├── human-resources/
│   │   │   ├── accommodation/
│   │   │   └── reports/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── main.tsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/institution/tims/
│   │   │   │       ├── config/
│   │   │   │       ├── security/
│   │   │   │       ├── common/
│   │   │   │       ├── admissions/
│   │   │   │       ├── students/
│   │   │   │       ├── academics/
│   │   │   │       ├── registration/
│   │   │   │       ├── examinations/
│   │   │   │       ├── finance/
│   │   │   │       ├── library/
│   │   │   │       ├── humanresources/
│   │   │   │       └── reports/
│   │   │   └── resources/
│   │   │       ├── db/migration/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── docker/
├── docs/
├── scripts/
├── docker-compose.yml
├── .env.example
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Ensure you have installed:

- Node.js (LTS)
- npm
- Java 21
- Maven
- MySQL 8+
- Git
- Docker and Docker Compose (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tertiary-institution-management.git

cd tertiary-institution-management
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure your database connection in `application.yml` or through environment variables.

Example:

```properties
DB_URL=jdbc:mysql://localhost:3306/tims_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run the backend:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Start the development server:

```bash
npm run dev
```

### 4. Access the Application

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |

*These are the proposed local development addresses; actual ports depend on your configuration.*

## 🇺🇬 Uganda-Focused Capabilities

The platform is designed with the Ugandan tertiary education environment in mind.

- Uganda Shillings (UGX) as the default currency.
- Africa/Kampala timezone.
- Configurable academic years and semester structures.
- Configurable academic grading systems.
- Institution-specific admission requirements.
- Support for faculties, schools, departments and programmes.
- Configurable student identification and registration formats.
- Support for institution-specific fees and payment policies.
- Academic reporting aligned with institutional requirements.
- Configurable regulatory and accreditation reporting requirements.

The system should support institution-specific policies rather than assuming every Ugandan institution follows identical academic procedures.

## 🔐 Security

Security is a core requirement.

- Spring Security authentication and authorization.
- BCrypt password hashing.
- Role-based and permission-based access control.
- Input validation on frontend and backend.
- Secure API endpoints.
- Protection against unauthorized data access.
- Audit trails for sensitive operations.
- Environment-based secrets management.
- Secure file upload validation.
- Database backups and recovery procedures.
- HTTPS in production.
- Protection against common web application vulnerabilities.

## 🧪 Testing

The project should maintain automated tests across frontend and backend components.

**Backend**
- JUnit 5.
- Mockito.
- Spring Boot Test.
- Repository and service tests.
- API integration tests.

**Frontend**
- Vitest.
- React Testing Library.
- Component tests.
- Form validation tests.
- API integration tests.

**System**
- Authentication and authorization tests.
- Admission workflow tests.
- Course registration tests.
- Examination and results tests.
- Financial transaction tests.

## 🚀 Deployment

The application is designed to support containerized deployment.

A production environment may include:

- React frontend served through Nginx.
- Spring Boot backend container.
- MySQL database.
- Persistent document storage.
- Docker Compose orchestration.
- HTTPS reverse proxy.
- Automated database backups.
- CI/CD through GitHub Actions.

A sample Docker Compose configuration can be introduced as the infrastructure is implemented.

## 🗺️ Development Roadmap

- [ ] Project initialization and architecture setup.
- [ ] Database configuration and migrations.
- [ ] Authentication and authorization.
- [ ] Institution configuration.
- [ ] User and role management.
- [ ] Admissions management.
- [ ] Student information management.
- [ ] Academic structure management.
- [ ] Course registration.
- [ ] Timetable and attendance.
- [ ] Examination and results management.
- [ ] Finance and payments.
- [ ] Library management.
- [ ] Human resource management.
- [ ] Accommodation management.
- [ ] Notifications and communication.
- [ ] Reporting and analytics.
- [ ] Automated testing.
- [ ] Docker deployment.
- [ ] Production deployment and monitoring.

## 🤝 Contribution Guidelines

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Follow the established project architecture.
4. Write clean, maintainable and tested code.
5. Commit your changes with meaningful messages.
6. Push your branch.
7. Open a pull request.

Example:

```bash
git checkout -b feature/admissions-module

git add .

git commit -m "feat: implement admissions module"

git push origin feature/admissions-module
```

## 📌 Development Guidelines

- Follow consistent naming conventions.
- Keep modules independent and maintainable.
- Avoid unnecessary duplication.
- Use DTOs for API request and response objects.
- Validate all incoming data.
- Never expose passwords or sensitive records in API responses.
- Use database migrations for schema changes.
- Document important API endpoints.
- Write tests for critical business logic.
- Never commit credentials, secrets or production environment files.

## 📄 License

This project is intended to be distributed under the MIT License.

See the `LICENSE` file for details.

## 👨‍💻 Project Team

Developed as a technology initiative focused on modernizing tertiary institution administration and academic management in Uganda.

**Project:** Tertiary Institution Management System

**Focus:** Education Technology | Academic Information Systems | Digital Transformation

---

<p align="center">
  <strong>Transforming institutional operations through technology.</strong>
  <br>
  Built for efficient, transparent and connected higher education management.
</p>
