# Task Management System

A web-based Task Management System built for managing projects, tasks, and users.

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Token) - *Planned/In-progress*

## 📂 Project Structure

- `task-frontend/`: React frontend application
- `task-backend/`: Node.js/Express backend application

## 🛠 Features

- **Authentication**: Login for Admin, Project Manager, and Member.
- **User Management**:
  - View all users (Admin only)
  - Create new users (Admin only) - *Backend Implemented, Frontend Integrated*
  - Edit user details (Admin only) - *Backend Implemented, Frontend Integrated*
  - Delete users (Admin only) - *Backend Implemented, Frontend Integrated*
- **Dashboard**: Role-based redirection and dashboard views.

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL

### 1. Database Setup
Ensure PostgreSQL is running and create a database (e.g., `intern_task_db`).
Import the schema (tables: `Users`, etc.) if available.

### 2. Backend Setup
```bash
cd task-backend
npm install
# Configure .env with DB credentials
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd task-frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## 📡 API Documentation

### Auth
- `POST /api/login`: Authenticate user.

### Users
- `GET /api/users`: Get all users.
- `POST /api/users`: Create a new user.
- `PUT /api/users/:id`: Update user details.
- `DELETE /api/users/:id`: Delete a user.

## 📝 Status
- **Frontend**: UI for Login, Dashboard, and User Management is ready. Tailwind CSS is configured.
- **Backend**: Basic Auth (Login) and User Management (CRUD) APIs are implemented.

---
*Created by Antigravity*
