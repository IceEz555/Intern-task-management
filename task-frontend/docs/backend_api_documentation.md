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
      "name": "Admin User",
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

  ```

### 3. Update Project (New)
อัปเดตข้อมูลโปรเจกต์

- **Endpoint**: `PUT /api/projects/:id`
- **Request Body**:
  ```json
  {
    "project_name": "Updated Name",
    "project_description": "New Desc",
    "project_status": "Completed", 
    "start_date": "2023-01-01",
    "end_date": "2023-12-31"
  }
  ```
- **Response**: Project Object ที่อัปเดตแล้ว

### 3. Delete Project
ลบโปรเจกต์ออกจากระบบ (Cascading: ลบ Tasks และ Members ที่เกี่ยวข้องทั้งหมด)

- **Endpoint**: `DELETE /api/projects/:id`
- **Response**:
  ```json
  { "message": "Project deleted successfully" }
  ```

---


### 3. Get Project Details
ดึงรายละเอียดเจาะลึกของโปรเจกต์ รวมถึง Tasks และ Members

- **Endpoint**: `GET /api/projects/:id`
- **Response**: Object เดียวที่รวมทุกอย่าง
  ```json
  {
    "project_id": 1,
    "name": "Mobile App",
    "description": "...",
    "tasks": [
        { "id": 101, "title": "Design UI", "status": "To Do", "assignee": "Sarah" }
    ],
    "members": [
        { "user_id": 2, "name": "Sarah", "role": "PM" }
    ]
  }
  ```

---

## 📝 Task Management APIs

### 1. Create Task
สร้างงานใหม่

- **Endpoint**: `POST /api/tasks`
- **Request Body**:
  ```json
  {
    "title": "Fix Login Bug",
    "description": "Auth fails on mobile",
    "status": "To Do",
    "priority": "High",
    "project_id": 1,
    "assignee_id": 2,
    "due_date": "2023-12-31"
  }
  ```
- **Response**: Task Object ที่สร้างเสร็จ


---

### 2. Update Task
แก้ไขรายละเอียดงาน

- **Endpoint**: `PUT /api/tasks/:id`
- **Request Body**:
  ```json
  {
    "task_id": 101, // Optional: for redundancy check
    "title": "Fix Login Bug Updated",
    "description": "...",
    "status": "In Progress",
    "priority": "Low",
    "assignee_id": 3,
    "due_date": "2024-01-01"
  }
  ```
- **Response**: Task Object ที่อัปเดตแล้ว

### 3. Delete Task
ลบงานออกจากระบบ (Hard Delete)

- **Endpoint**: `DELETE /api/tasks/:id`
- **Response**:
  ```json
  { "message": "Task deleted successfully" }
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


---

## 5. Manage Project Members APIs

API สำหรับจัดการสมาชิกในโปรเจกต์ (เพิ่มและลบ)

### 1. Add Project Member
เพิ่มสมาชิกเข้าโปรเจกต์

- **Endpoint**: `POST /api/projects/:id/members`
- **Request Body**:
  ```json
  { "user_id": 5 }
  ```
- **Response**: 201 Created

### 2. Remove Project Member
ลบสมาชิกออกจากโปรเจกต์

- **Endpoint**: `DELETE /api/projects/:id/members/:userId`
- **Response**: 200 OK
