# Backend API Documentation

เอกสารนี้รวบรวมรายละเอียดของ Backend API ที่ใช้ในโปรเจกต์ Task Management System เชื่อมต่อระหว่าง React Frontend และ PostgreSQL Database

---

## 🛠️ Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Driver**: `pg` (node-postgres)
- **Middleware**: `cors` (Cross-Origin Resource Sharing)

## 📂 Folder Structure
```
task-backend/
├── src/
│   ├── config/         # Database configuration (db.js)
│   ├── controllers/    # Business logic (authController.js, userController.js)
│   ├── routes/         # API Route definitions
│   └── app.js          # Express app setup
├── server.js           # Server entry point
└── .env                # Environment variables
```

---

## 🔐 Authentication APIs

### 1. Login
ตรวจสอบอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ

- **Endpoint**: `POST /api/login`
- **Request Body**:
  ```json
  {
    "email": "admin@internflow.com",
    "password": "password123"
  }
  ```
- **Response (Success - 200 OK)**:
  ```json
  {
    "user": {
      "user_id": 1,
      "fullname": "Admin User",
      "email": "admin@internflow.com",
      "role": "Admin",
      "status": "Active",
      "avatar": null
    }
  }
  ```
- **Response (Error - 401/403)**:
  ```json
  {
    "message": "Email or password is incorrect" // หรือ messages อื่นๆ
  }
  ```

---

## 👥 User Management APIs

### 1. Get All Users
ดึงรายชื่อผู้ใช้ทั้งหมดในระบบ (สำหรับหน้า Admin User Management)

- **Endpoint**: `GET /api/users`
- **Request**: ไม่ต้องส่ง Body
- **Response (Success - 200 OK)**:
  ส่งกลับเป็น Array ของ User Object
  ```json
  [
    {
      "user_id": 1,
      "name": "Admin User", // Aliased from fullname
      "email": "admin@internflow.com",
      "role": "Admin",
      "status": "Active"
    },
    {
      "user_id": 2,
      "name": "Sarah PM",
      "email": "sarah@internflow.com",
      "role": "PM",
      "status": "Active"
    }
    // ...
  ]
  ```

---

## 🗄️ Database Connection
ไฟล์ `src/config/db.js` ทำหน้าที่สร้าง Pool Connection ไปยัง PostgreSQL

```javascript
/* src/config/db.js */
import pkg from 'pg';
import dotenv from 'dotenv';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
```

> **Note**: ใน Local Environment ต้องตรวจสอบไฟล์ `.env` ให้ค่าตรงกับเครื่องของท่าน
