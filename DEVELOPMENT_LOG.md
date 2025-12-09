# Development Log & API Documentation

## 🔄 Recent Updates (User Management Feature)

We have successfully implemented a full CRUD (Create, Read, Update, Delete) system for User Management.

### 1. 💻 Code Explanation

#### **Backend (`task-backend`)**
- **Controller (`userController.js`)**:
  - **`getUsers`**: Fetches all users ordered by ID.
  - **`createUser`**: 
    - Validates inputs.
    - Hashes password using **bcrypt** (`bcrypt.hash`) for security.
    - Inserts into DB and returns the new user data immediately.
  - **`updateUser`**: 
    - Updates user details (`PUT`).
    - Checks if a new password is provided; if yes, hashes it before updating. If no, keeps the old password.
  - **`deleteUser`**: 
    - Removes a user by ID (`DELETE`).
  - **Error Handling**: Uses `try-catch` blocks. Specifically catches PostgreSQL error code `23505` to handle duplicate emails gracefully.

- **Routes (`userRoutes.js`)**:
  - Defined RESTful endpoints mapping to the controller functions.

#### **Frontend (`task-frontend`)**
- **`UserManagement.jsx`**:
  - Connected buttons (Create, Edit, Delete) to the real Backend APIs using **Axios**.
  - **State Management**: Updates the UI immediately after successful API calls (Optimistic UI / local state update) without needing a full page refresh.
  - **Validation**: Added strict password validation (8+ chars, uppercase, lowercase, special char) and Confirm Password field before creating a user.
  - **Data Mapping**: Corrected the usage of `user.id` to `user.user_id` to match the PostgreSQL database schema.

---

### 2. 📡 API Endpoints

| Method | Endpoint | Description | Body Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | List all users | - |
| **POST** | `/api/users` | Create new user | `{ name, email, role, status, password }` |
| **PUT** | `/api/users/:id` | Update user | `{ name, email, role, status, password (optional) }` |
| **DELETE** | `/api/users/:id` | Delete user | - |

---

### 3. 🛠 Troubleshooting & Fixes

During development, we encountered and resolved the following issues:

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **`ReferenceError: bcrypt is not defined`** | Forgot to import `bcrypt` in `authController.js` after adding hash comparison logic. | Added `import bcrypt from 'bcrypt';` at the top of the file. |
| **Cannot delete user (Foreign Key Constraint)** | Users were referenced in the `Projects` table, preventing deletion. | Used `TRUNCATE TABLE users RESTART IDENTITY CASCADE;` to clear data properly during testing. |
| **UI Keys Warning / Undefined ID** | Frontend was looking for `user.id`, but Database returns `user.user_id`. | Updated Frontend `map` keys and references to use `user.user_id`. |
| **SQL Syntax Error on Truncate** | `TRUNCATE TABLE users CASCADE RESTART IDENTITY` caused a syntax error in some PG versions. | Corrected the order to `TRUNCATE TABLE users RESTART IDENTITY CASCADE;`. |

---
