# IEM Admission Management System

An academic full-stack web application developed for the **Software Engineering Lab Project** representing an end-to-end admission portal for the **Institute of Engineering & Management (IEM), Kolkata**.

> **Note on Technology Stack**: The academic project assignment specifies the MEAN stack, but this implementation is intentionally built using **MERN (MongoDB, Express.js, React, Node.js)** as permitted for modern single-page frontend architecture.

---

## 1. Project Overview

The **IEM Admission Management System** automates the entire student admission lifecycle—from initial online application submission and document upload to entrance exam (IEMJEE) score tracking, admin verification, and final departmental seat allocation counselling.

### Key Capabilities:
- **For Applicants / Students**:
  - Register account and secure JWT login.
  - Multi-section application form (Personal, Contact, Academic, Course Selection, Entrance Exam).
  - Save progress as Draft and resume anytime.
  - Upload, inspect, and replace scanned certificates (Marksheets, ID proof, Photo) via Multer.
  - Mock application fee payment (₹500) with instant receipt generation.
  - Track real-time progress through a 7-stage visual admission tracker.
  - Download and print the complete, formatted official application dossier.
  - View entrance exam schedule, merit rank, and provisional seat allotment letter.
  - In-app notification inbox with unread status indicators.

- **For Administrators & Admissions Committee**:
  - Secure Admin authentication (`admin@iem.edu`).
  - Analytics Dashboard driven by **MongoDB Aggregation Pipelines** (`$match`, `$group`, `$sort`).
  - Searchable and filterable table of all candidate submissions.
  - Full applicant dossier inspector.
  - Document verification checklist with 1-click Verify/Reject controls and feedback remarks.
  - State-machine status transitions (enforced strictly on the server).
  - Entrance exam mark entry, rank calculation, and admit card tracking.
  - Departmental counselling & seat allocation module.
  - Course and program capacity management.

---

## 2. System Architecture

```
                    APPLICANT / ADMIN
                            │
                            ▼
                     REACT FRONTEND
             (Vite + React Router + CSS)
                            │
              HTTP / JSON / Multi-Part FormData
                            │
                            ▼
                     EXPRESS.JS API
                     (Node.js Server)
                            │
     ┌──────────────────────┼──────────────────────┐
     ▼                      ▼                      ▼
MongoDB Database       Local Disk Store        Auth Layer
  (Mongoose)              (/uploads)         (JWT + bcrypt)
```

---

## 3. Technology Stack

- **Frontend**:
  - **React 18** (Functional components, Hooks: `useState`, `useEffect`, `useContext`)
  - **Vite** (Next-generation lightning-fast build tool)
  - **React Router v6** (Declarative routing, Protected Route Guards)
  - **Plain CSS** (Design system tokens, responsive grids, zero heavy UI framework overhead)
- **Backend**:
  - **Node.js** & **Express.js** (REST API architecture)
  - **Mongoose** (Object Data Modeling for MongoDB)
  - **JWT (jsonwebtoken)** (Stateless session tokens)
  - **bcryptjs** (One-way salted password hashing)
  - **Multer** (Disk storage for multi-part file uploads)
  - **CORS & dotenv** (Cross-origin resource sharing & environment management)
- **Database**:
  - **MongoDB** (NoSQL document store with aggregation pipelines)

---

## 4. Project Folder Structure

```
iem-admission-system/
├── client/                              # React Frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/                  # Reusable UI components
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressTracker.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Auth provider & session hook
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   └── StudentLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/                   # Admin pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ApplicantDetail.jsx
│   │   │   │   ├── ApplicationsList.jsx
│   │   │   │   ├── CounsellingAlloc.jsx
│   │   │   │   ├── CourseManagement.jsx
│   │   │   │   └── ExamManagement.jsx
│   │   │   ├── public/                  # Public pages
│   │   │   │   ├── LandingPage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   └── student/                 # Student pages
│   │   │       ├── ApplicationForm.jsx
│   │   │       ├── ApplicationView.jsx
│   │   │       ├── CounsellingPage.jsx
│   │   │       ├── DocumentUpload.jsx
│   │   │       ├── ExamStatus.jsx
│   │   │       ├── Notifications.jsx
│   │   │       ├── PaymentPage.jsx
│   │   │       └── StudentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js                   # Central API client
│   │   ├── styles/
│   │   │   └── index.css                # Global design system
│   │   ├── App.jsx                      # Route definitions
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                              # Express & Node Backend
│   ├── config/
│   │   └── db.js                        # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js           # MongoDB Aggregations & search
│   │   ├── applicationController.js     # Form management & state transitions
│   │   ├── authController.js            # Register & Login
│   │   ├── counsellingController.js     # Seat allocation logic
│   │   ├── courseController.js          # Programs CRUD
│   │   ├── documentController.js        # Multer disk upload & verification
│   │   ├── examController.js            # Entrance exam schedules & ranks
│   │   ├── notificationController.js    # In-app alerts
│   │   └── paymentController.js         # Mock payment processing
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT guard
│   │   ├── roleMiddleware.js            # Role-based authorization
│   │   └── uploadMiddleware.js          # Multer storage configuration
│   ├── models/
│   │   ├── Application.js
│   │   ├── Course.js
│   │   ├── Document.js
│   │   ├── Exam.js
│   │   ├── Notification.js
│   │   ├── Payment.js
│   │   ├── SeatAllocation.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── counsellingRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── examRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── paymentRoutes.js
│   ├── seeds/
│   │   └── seedData.js                  # Database seeder with demo viva data
│   ├── uploads/                         # Local server document storage
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## 5. Quick Setup & Execution Guide

### Prerequisites:
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on `mongodb://localhost:27017` (or a MongoDB Atlas connection URI)

### Step 1: Install Backend Dependencies & Seed Sample Data
```bash
cd server
npm install

# Seed Admin account, courses, and sample applications across all workflow statuses
npm run seed
```

### Step 2: Start Backend Server
```bash
# In the server folder
npm run dev
# Express server runs on http://localhost:5000
```

### Step 3: Install Frontend Dependencies & Start React App
Open a second terminal window:
```bash
cd client
npm install
npm run dev
# React Vite application runs on http://localhost:3000
```

---

## 6. Demo Credentials for Viva / Presentation

The database seed script initializes the following pre-configured test accounts:

| Role | Email | Password | Description |
|---|---|---|---|
| **Admin** | `admin@iem.edu` | `Admin@123` | Admissions Dean (Full admin privileges, analytics, verification) |
| **Student 1** | `rohan.sharma@example.com` | `Student@123` | Application Status: **ALLOCATED** (Seat confirmed in B.Tech CSE) |
| **Student 2** | `ananya.sen@example.com` | `Student@123` | Application Status: **APPROVED** (Eligible for counselling) |
| **Student 3** | `arjun.m@example.com` | `Student@123` | Application Status: **DOCUMENT_VERIFICATION** (Awaiting doc check) |
| **Student 4** | `pooja.das@example.com` | `Student@123` | Application Status: **SUBMITTED** (Queued for review) |
| **Student 5** | `vikram.g@example.com` | `Student@123` | Application Status: **DRAFT** (Fresh application in-progress) |

> ⚡ **Viva Shortcut**: On the Login page (`/login`), click the **"Fill Student"** or **"Fill Admin"** buttons to auto-populate credentials instantly.

---

## 7. Core Software Engineering Concepts Demonstrated

### 1. Request-Response Lifecycle
Every user action flows through the complete MERN lifecycle:
`React Component` ➔ `Fetch API Call (JWT Header)` ➔ `Express Router` ➔ `Authentication & Role Middleware` ➔ `Controller Business Logic` ➔ `Mongoose Model & MongoDB Operation` ➔ `JSON Response` ➔ `React State Re-render`.

### 2. Document Uploads & Metadata Storage
- Handled via `Multer` middleware.
- Scanned marksheets/photos are saved to the server's local disk directory (`server/uploads/`).
- **MongoDB stores only document metadata and relative file paths** (`filePath: "/uploads/filename.pdf"`, `verificationStatus`, `fileSize`, `originalFileName`), adhering strictly to academic constraints.

### 3. Server-Enforced Status Workflow State Machine
The server rejects arbitrary status modifications. Only predefined, valid status transitions are permitted:
```
DRAFT ➔ SUBMITTED ➔ UNDER_REVIEW ➔ DOCUMENT_VERIFICATION ➔ APPROVED / REJECTED ➔ COUNSELLING ➔ ALLOCATED
```
If an invalid transition is attempted (e.g. `DRAFT` directly to `APPROVED`), the backend responds with HTTP 400 Bad Request.

### 4. MongoDB Aggregation Pipelines
The Admin Dashboard statistics are computed directly inside MongoDB using `$group`, `$match`, and `$sort` rather than manual client-side computation:
```javascript
// Example: Grouping applications by department
const departmentDistribution = await Application.aggregate([
  { $match: { 'courseSelection.department': { $exists: true, $ne: '' } } },
  { $group: { _id: '$courseSelection.department', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

### 5. Role-Based Access Control (RBAC)
- Client routes are guarded via `<ProtectedRoute allowedRoles={['student' | 'admin']} />`.
- Server routes strictly enforce authorization via `protect` and `authorize('admin')` middleware.

---

## 8. REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student
- `POST /api/auth/login` — Login user (Student or Admin)
- `GET /api/auth/me` — Fetch current user profile

### Applications (`/api/applications`)
- `GET /api/applications/me` — Fetch current student's application
- `POST /api/applications/draft` — Save application draft
- `POST /api/applications/:id/submit` — Submit application (validates fields & payment)
- `GET /api/applications/:id` — Get single application details

### Admin Management (`/api/admin`)
- `GET /api/admin/dashboard` — Aggregated metrics & distributions
- `GET /api/admin/applications` — Search & filter all applications
- `PUT /api/admin/applications/:id/status` — Update application status

### Documents (`/api/documents`)
- `POST /api/documents/upload` — Upload file via Multer
- `GET /api/documents/application/:applicationId` — List documents for application
- `DELETE /api/documents/:id` — Delete uploaded document
- `PUT /api/documents/:id/verify` — Admin document verification (VERIFIED / REJECTED)

### Payments, Courses, Exams & Counselling
- `POST /api/payments/mock` — Execute simulated ₹500 fee transaction
- `GET /api/courses` — List active IEM academic programs
- `GET /api/exams/me` — Student entrance exam hall ticket & score card
- `POST /api/admin/exams` — Admin score & rank entry
- `GET /api/counselling/me` — Student provisional seat allotment letter
- `POST /api/admin/counselling/allocate` — Admin seat allocation
- `GET /api/notifications` — In-app notification alerts

---

## 9. Viva / Demonstration Walkthrough

When presenting this project during a lab viva:
1. **Open Landing Page** (`http://localhost:3000`): Show IEM programs and the 4-step admission workflow.
2. **Student Flow**:
   - Register a new student or log in using `rohan.sharma@example.com`.
   - Show the **Student Dashboard** with progress stepper and notifications.
   - Navigate to **Application Form**: Demonstrate multi-section tabs, form validation, and "Save Draft".
   - Navigate to **Document Upload**: Demonstrate certificate upload with local `/uploads` storage and verification status.
   - Navigate to **Fee Payment**: Open demo payment gateway modal, execute ₹500 transaction, and inspect the generated receipt.
   - Click **Submit Application**: Demonstrate status transition to `SUBMITTED`.
   - Open **Print Application**: Show the formatted official dossier and browser print dialogue.
   - Open **Entrance Exam** & **Seat Allocation**: Show IEMJEE merit rank and provisional allotment letter.
3. **Admin Flow**:
   - Log out and log in as `admin@iem.edu`.
   - Show **Admin Dashboard**: Explain the MongoDB `$group` aggregation statistics for departments and status distributions.
   - Open **All Applications**: Use the live search and status/department filters.
   - Click **Inspect Dossier**: Show the applicant's complete profile.
   - Demonstrate **Document Verification**: Click "Verify" / "Reject" with remarks on individual documents.
   - Demonstrate **Status State Machine**: Advance application status to `DOCUMENT_VERIFICATION` or `APPROVED`.
   - Open **Seat Counselling**: Allocate a branch seat to an approved student.
   - Log back in as the student to show the real-time updated status badge and notification alert.

---

## 10. Authors & Acknowledgements

- **Course**: Software Engineering Laboratory
- **Institute**: Institute of Engineering & Management (IEM), Kolkata
- **Stack**: MongoDB, Express.js, React, Node.js (MERN)
