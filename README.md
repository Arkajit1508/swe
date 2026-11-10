# IEM Admission Management System

A full-stack academic web application developed for the Software Engineering Laboratory Project, representing an end-to-end admission portal for the Institute of Engineering & Management (IEM), Kolkata.

**Live Application:** [https://iem-admission-frontend.onrender.com](https://iem-admission-frontend.onrender.com)

**Backend API:** [https://iem-admission-api.onrender.com](https://iem-admission-api.onrender.com)

> **Technology Stack Note:** Although the academic assignment specifies the MEAN stack, this implementation uses MERN (MongoDB, Express.js, React, Node.js), as permitted for a modern single-page frontend architecture.

---

## 1. Project Overview

The IEM Admission Management System streamlines the student admission lifecycle, from online registration and application submission to document verification, entrance examination management, merit ranking, and departmental seat allocation.

### Key Features

**For Applicants / Students**

- Student registration and secure JWT-based authentication.
- Multi-section application form covering personal, contact, academic, course selection, and entrance examination details.
- Save applications as drafts and resume later.
- Upload, view, and replace supporting documents.
- Simulated application fee payment of ₹500 with receipt generation.
- Seven-stage visual admission progress tracker.
- View and download application details.
- Access entrance examination schedules, merit ranks, and provisional seat allotment information.
- In-app notification system with unread status indicators.

**For Administrators / Admissions Committee**

- Secure administrator authentication.
- Analytics dashboard powered by MongoDB aggregation pipelines.
- Searchable and filterable applicant records.
- Detailed applicant profile and application inspection.
- Document verification with approve/reject actions and remarks.
- Server-enforced application status transitions.
- Entrance examination marks entry and rank management.
- Admit card and examination status tracking.
- Departmental counselling and seat allocation.
- Course and program capacity management.

---

## 2. Live Deployment

The application is deployed using Render.

| Component        | Deployment         |
| ---------------- | ------------------ |
| React frontend   | Render Static Site |
| Express backend  | Render Web Service |
| Database         | MongoDB Atlas      |
| Document storage | Supabase Storage   |
| Source code      | GitHub             |

**Live URLs**

- Frontend: [https://iem-admission-frontend.onrender.com](https://iem-admission-frontend.onrender.com)
- Backend: [https://iem-admission-api.onrender.com](https://iem-admission-api.onrender.com)
- Backend health check: [https://iem-admission-api.onrender.com/api/health](https://iem-admission-api.onrender.com/api/health)

The frontend communicates with the backend through REST API requests. The backend connects to MongoDB Atlas for application data and Supabase Storage for document storage.

---

## 3. System Architecture

```text
                APPLICANT / ADMIN
                       |
                       v
                REACT FRONTEND
              (Vite + React Router)
                       |
                       | HTTP / JSON /
                       | Multipart FormData
                       v
                EXPRESS.JS API
                 (Node.js Server)
                       |
          +------------+-------------+
          |            |             |
          v            v             v
      MongoDB       Supabase       Authentication
      Atlas         Storage        JWT + bcrypt
   (Application    (Documents)    (Role-based
       Data)                       Access)
```

---

## 4. Technology Stack

### Frontend

- React 18
- Vite
- React Router v6
- JavaScript (ES6+)
- React Hooks: useState, useEffect, useContext
- CSS (responsive layouts and custom design system)

### Backend

- Node.js
- Express.js
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- CORS
- dotenv

### Database and Storage

- MongoDB Atlas – application data and user records.
- Supabase Storage – uploaded admission documents.

### Deployment and Version Control

- Render – frontend and backend hosting.
- GitHub – source code and version control.

---

## 5. Project Folder Structure

```text
SWE-PROJECT/
|
|-- client/                         # React Frontend
|   |-- public/
|   |-- src/
|   |   |-- components/             # Reusable UI components
|   |   |-- context/                # Authentication context
|   |   |-- layouts/                # Student/Admin layouts
|   |   |-- pages/
|   |   |   |-- admin/              # Admin dashboard and modules
|   |   |   |-- public/             # Landing, login, registration
|   |   |   |-- student/            # Student portal modules
|   |   |-- services/               # API client
|   |   |-- styles/                 # Global styles
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- index.html
|   |-- package.json
|   |-- vercel.json                 # SPA routing configuration
|   |-- vite.config.js
|
|-- server/                         # Express Backend
|   |-- config/                     # Database configuration
|   |-- controllers/                # Application business logic
|   |-- middleware/                 # Authentication and upload
|   |-- models/                     # Mongoose schemas
|   |-- routes/                     # REST API routes
|   |-- seeds/                      # Database seed scripts
|   |-- .env.example
|   |-- package.json
|   |-- server.js
|
|-- .gitignore
|-- README.md
```

---

## 6. Local Setup and Execution

### Prerequisites

- Node.js 20 or later recommended.
- npm.
- MongoDB Atlas account or local MongoDB installation.
- Supabase project with a configured Storage bucket.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Swapnil-2004/SWE-PROJECT.git
cd SWE-PROJECT
```

### Step 2: Configure Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory using `.env.example` as a reference.

Configure the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=your_supabase_bucket_name
```

Never commit the actual `.env` file or privileged credentials to GitHub.

### Step 3: Start the Backend

```bash
npm run dev
```

The Express backend runs at:

`http://localhost:5000`

### Step 4: Configure and Start the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the React development server:

```bash
npm run dev
```

The frontend runs at the local development URL configured in `vite.config.js` (commonly `http://localhost:3000`).

---

## 7. Environment Variables

### Backend Environment

| Variable                  | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| NODE_ENV                  | Application environment                  |
| PORT                      | Backend server port                      |
| MONGO_URI                 | MongoDB connection string                |
| JWT_SECRET                | JWT signing secret                       |
| CLIENT_URL                | Allowed frontend origin for CORS         |
| SUPABASE_URL              | Supabase project URL                     |
| SUPABASE_SERVICE_ROLE_KEY | Private Supabase service-role credential |
| SUPABASE_BUCKET           | Document storage bucket                  |

### Frontend Environment

| Variable     | Purpose                          |
| ------------ | -------------------------------- |
| VITE_API_URL | Base URL of the backend REST API |

**Security:** Never expose `JWT_SECRET`, `MONGO_URI`, or `SUPABASE_SERVICE_ROLE_KEY` in frontend code, public repositories, or screenshots.

---

## 8. Database Initialization and Administrator Setup

The project includes seed scripts for initializing sample data and creating an administrator account.

For administrator creation, configure the following environment variables before running the existing administrator seed script:

```env
ADMIN_NAME=Your Administrator Name
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password
ADMIN_PHONE=your_phone_number
```

Run the administrator seed script from the `server` directory:

```bash
node seeds/createAdmin.js
```

Use a unique, secure password. Do not publish real administrator credentials in this repository.

The project may also include sample courses and application records for academic demonstration. Follow the seed script configuration in the repository before initializing a database.

---

## 9. Core Software Engineering Concepts Demonstrated

### 9.1 Request-Response Lifecycle

The application follows the complete MERN request-response lifecycle:

React Component → API Request → Express Router → Authentication Middleware → Controller → Mongoose Model → MongoDB → JSON Response → React State Update.

### 9.2 Document Upload and Storage

- Multer handles incoming multipart file uploads.
- Uploaded documents are stored in Supabase Storage.
- MongoDB stores document metadata and storage references.
- Private document access can be provided through signed URLs.
- Document verification status and administrator remarks are maintained in the database.

### 9.3 Server-Enforced Application Workflow

The backend enforces predefined application status transitions rather than allowing arbitrary client-side status modifications.

Example workflow:

```text
DRAFT
  |
  v
SUBMITTED
  |
  v
UNDER_REVIEW
  |
  v
DOCUMENT_VERIFICATION
  |
  +------> REJECTED
  |
  v
APPROVED
  |
  v
COUNSELLING
  |
  v
ALLOCATED
```

Invalid transitions are rejected by the backend with appropriate HTTP error responses.

### 9.4 MongoDB Aggregation Pipelines

The administrator dashboard uses MongoDB aggregation operations such as `$match`, `$group`, and `$sort` to generate application statistics and distributions.

Example:

```javascript
const departmentDistribution = await Application.aggregate([
  {
    $match: {
      'courseSelection.department': {
        $exists: true,
        $ne: ''
      }
    }
  },
  {
    $group: {
      _id: '$courseSelection.department',
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
]);
```

### 9.5 Role-Based Access Control

- JWT-based authentication identifies logged-in users.
- Protected frontend routes restrict access based on user roles.
- Backend middleware validates authentication and authorization.
- Administrative operations are restricted to authorized administrator accounts.

---

## 10. REST API Overview

### Authentication – `/api/auth`

| Method | Endpoint    | Description                         |
| ------ | ----------- | ----------------------------------- |
| POST   | `/register` | Register a student                  |
| POST   | `/login`    | Authenticate a user                 |
| GET    | `/me`       | Retrieve authenticated user profile |

### Applications – `/api/applications`

| Method | Endpoint      | Description                       |
| ------ | ------------- | --------------------------------- |
| GET    | `/me`         | Get current student's application |
| POST   | `/draft`      | Save application draft            |
| POST   | `/:id/submit` | Submit an application             |
| GET    | `/:id`        | Retrieve application details      |

### Administration – `/api/admin`

| Method | Endpoint                   | Description                    |
| ------ | -------------------------- | ------------------------------ |
| GET    | `/dashboard`               | Retrieve dashboard analytics   |
| GET    | `/applications`            | Search and filter applications |
| PUT    | `/applications/:id/status` | Update application status      |
| POST   | `/exams`                   | Manage examination scores      |

### Documents – `/api/documents`

| Method | Endpoint                      | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| POST   | `/upload`                     | Upload an admission document |
| GET    | `/application/:applicationId` | List application documents   |
| DELETE | `/:id`                        | Delete an uploaded document  |
| PUT    | `/:id/verify`                 | Verify or reject a document  |

### Other Modules

- Payments: `/api/payments`
- Courses: `/api/courses`
- Examinations: `/api/exams`
- Counselling: `/api/counselling`
- Notifications: `/api/notifications`

Refer to the backend route files for the complete endpoint definitions and request parameters.

---

## 11. Demonstration Notes

This is an academic software engineering project and includes simulated admission workflows.

- Application fee payments are mock transactions, not actual financial payments.
- Course capacities, fees, and sample application records may contain demonstration data.
- Sample course and seat information should not be interpreted as official IEM admission information.
- Administrator access is managed through the database initialization process; real credentials are not included in this README.

---

## 12. Authors and Acknowledgements

**Course:** Software Engineering Laboratory

**Authors:**

- Arkajit Bhattachary
- Swapnil Chakraborty
- Sayan Das
- Ritasmit Sarkar

**Institute:** Institute of Engineering & Management (IEM), Kolkata

**Technology Stack:** MongoDB, Express.js, React, Node.js (MERN)

---

*Developed as an academic full-stack software engineering project.*
