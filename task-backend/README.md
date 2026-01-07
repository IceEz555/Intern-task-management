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
├── controllers/    # Request handlers (auth, user logic)
├── routes/         # API Route definitions
└── server.js       # Entry point (root)
```

## 🚀 Getting Started

1.  **Prerequisites**

    - Ensure PostgreSQL is installed and running.
    - Create a database (e.g., `intern_task_db`).

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment**

    - Create a `.env` file in this directory (or update the existing one).
    - You can copy the example file: `cp .env.example .env`
    - Add your DB credentials:
      ```env
      DB_USER=postgres
      DB_HOST=localhost
      DB_DATABASE=intern_task_db
      DB_PASSWORD=postgres
      DB_PORT=5432
      PORT=5000
      ```

4.  **Run Main Server**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

## 📡 API Endpoints

### Authentication

- `POST /api/login`: Authenticate users (Admin/PM/Member).

### User Management

- `GET /api/users`: List all users.
- `POST /api/users`: Create a new user (Planned).
- `PUT /api/users/:id`: Update a user (Planned).
- `DELETE /api/users/:id`: Delete a user (Planned).

---

_Part of the Intern Task Management Project_
