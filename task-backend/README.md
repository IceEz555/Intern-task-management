# Task Management System - Backend

This is the RESTful API backend for the Task Management System, handling data persistence, authentication, and business logic.

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Driver**: [node-postgres (pg)](https://node-postgres.com/)
- **Utilities**: `dotenv` (Config), `cors` (Cross-Origin Resource Sharing)

## 📂 Project Structure

```
src/
├── config/         # Database configuration (db.js)
├── controllers/    # Request handlers (auth, user, etc.)
├── middleware/     # JWT Authentication (checkAuth.js)
├── routes/         # API Route definitions
└── server.js       # Backend Service Entry (Port 5001)

apiGateway/         # API Gateway Entry (Port 5000)
└── gatewayServer.js
```

## 🚀 Getting Started

1.  **Prerequisites**

    - Ensure PostgreSQL is installed and running.
    - Create a database (e.g., `intern_task_db`).

2.  **Install Dependencies**

    ```bash
    # Install Backend Deps
    npm install

    # Install Gateway Deps
    cd apiGateway && npm install && cd ..
    ```

3.  **Configure Environment**

    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Verify `DB_CREDENTIALS` and `JWT_SECRET`.

4.  **Run Services**
    You need to run both Backend and Gateway (or use Docker).

    ```bash
    # Terminal 1: Backend Service
    npm run dev  # Runs on Port 5001

    # Terminal 2: API Gateway
    cd apiGateway && npm start # Runs on Port 5000
    ```

    > **Note**: Frontend connects to **Port 5000** (Gateway).

## 📚 Documentation

Detailed API documentation is recommended to be moved to `docs/backend/`.

- [Backend API Documentation](../docs/backend/backend_api_documentation.md)

## 📡 API Endpoints

### Authentication

- `POST /api/login`: Authenticate users (Admin/PM/Member).

### User Management

- `GET /api/users`: List all users.
- `POST /api/users`: Create a new user.
- `PUT /api/users/:id`: Update a user.
- `DELETE /api/users/:id`: Delete a user.

---

_Part of the Intern Task Management Project_
