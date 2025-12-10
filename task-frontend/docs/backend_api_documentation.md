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
- **Response**: Array ของ User Object

### 2. Create User
สร้างผู้ใช้ใหม่ (Password จะถูก Hash อัตโนมัติ)

- **Endpoint**: `POST /api/users`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member", // Member, PM, Admin
    "status": "Active", // Active, OnLeave
    "password": "StrongPassword1!"
  }
  ```
- **Response (201 Created)**: User Object ที่เพิ่งสร้าง

### 3. Update User
แก้ไขข้อมูลผู้ใช้ (สามารถส่ง password เพื่อ reset ได้)

- **Endpoint**: `PUT /api/users/:id`
- **Request Body**:
  ```json
  {
    "name": "John Doe Updated",
    "email": "john@example.com",
    "role": "PM",
    "status": "Active",
    "password": "" // Optional: ส่งค่าว่างถ้าไม่ต้องการเปลี่ยน
  }
  ```
- **Response (200 OK)**: User Object ที่อัปเดตแล้ว

### 4. Delete User
ลบผู้ใช้อออกจากระบบ

- **Endpoint**: `DELETE /api/users/:id`
- **Response (200 OK)**:
  ```json
  { "message": "User deleted successfully", "id": "123" }
  ```

---
## 📂 Project Management APIs

### 1. Get All Projects
ดึงรายชื่อโปรเจกต์ทั้งหมดพร้อมสถิติ (Task Count, Progress) สำหรับหน้า Dashboard

- **Endpoint**: `GET /api/projects`
- **Response**: Array ของ Project Object
  ```json
  [
    {
      "project_id": 1,
      "name": "Marketing Website",
      "status": "In Progress",
      "task_count": "5",
      "done_task_count": "2",
      "progress": 40
    }
  ]
  ```

### 2. Create Project
สร้างโปรเจกต์ใหม่

- **Endpoint**: `POST /api/projects`
- **Request Body**:
  ```json
  {
    "project_name": "New Mobile App",
    "project_description": "App for Q4",
    "project_status": "Planning",
    "project_start_date": "2023-01-01",
    "project_end_date": "2023-03-31"
  }
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
