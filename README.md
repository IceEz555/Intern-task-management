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
- **AI Integration**:
  - AI Assistant for project queries (Streamlit integration).

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
# Configure .env: PORT=5001, GATEWAY_PORT=5000
npm start --prefix apiGateway # Start Gateway (Port 5000)
npm start # Start Backend Service (Port 5001)
```
- **Gateway**: `http://localhost:5000` (Main Entry Point)
- **Backend Service**: `http://localhost:5001`

### 3. AI Service Setup
The AI Service consists of a FastAPI backend (for RAG logic) and a Streamlit UI.

1. **Install Dependencies**
   ```bash
   cd task-ai
   # Create virtual env (Recommended)
   python -m venv venv
   # Activate: .\venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
   pip install -r requirements.txt
   ```

2. **Run AI Services**
   - **Option A: Full AI System (API + UI)**
     ```bash
     # Terminal 1: Run FastAPI (Logic Layer)
     # Runs on http://localhost:8000
     fastapi dev src/server.py
     
     # Terminal 2: Run Streamlit (Chat UI)
     # Runs on http://localhost:8501
     streamlit run src/streamlit.py
     ```


3. **Run with Docker (Recommended) 🐳**
   This runs all services (Frontend, Backend, Gateway, AI, DB) automatically.
   ```bash
   # Build and Start
   docker-compose up --build
   ```
   - **Frontend**: `http://localhost:5173`
   - **Gateway**: `http://localhost:5000`
   - **Streamlit**: `http://localhost:8501`
   - **Backend**: `http://localhost:5001`
   - **DB**: `localhost:5432`

### 4. Manual Setup (Without Docker)
   **Backend:**
   ```bash
   cd task-backend
   npm install
   # ... (rest of manual setup)
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
