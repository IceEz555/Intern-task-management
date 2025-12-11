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

## 🚀 Update: Project Details Refactor & Features

We have enhanced the **Project Details** page, added **Edit Project** functionality, and refined the UI/UX.

### 1. 💻 Code Explanation

#### **Frontend (`task-frontend`)**
- **`ProjectDetails.jsx`**:
  - **Refactor**: Replaced the "Manage Team" button in the header with **"Edit Project"**.
  - **Integration**: Integrated `EditProjectModal` to allow editing project details.
  - **Team Management**: Moved the "Manage Team" button to the `TeamMembers` section (using `UserPlus` icon).
  - **State Management**: Connected `isEditProjectOpen` to control the modal visibility.
- **`EditProjectModal.jsx`**:
  - **Purpose**: A new modal component to edit Project Name, Description, Status, Start Date, and End Date.
  - **Prefill**: Automatically populates fields with existing project data using `useEffect`.
  - **API**: Calls `PUT /api/projects/:id` to save changes.
- **`TeamMembers.jsx`**:
  - **UI Update**: Renamed "Add Member" to "Manage Team".
  - **Styling**: Increased spacing (`gap: 1.75rem`) and header margin (`margin-bottom: 1.5rem`) in `ProjectDetails.css` for better readability.
- **Styling (`ProjectList.css`)**:
  - **Status**: Added **Yellow** styling for `On Hold` status (`.status-badge.on-hold`).

#### **Backend (`task-backend`)**
- **Controller (`projectController.js`)**:
  - **`updateProject`**: Added logic to update project fields (`name`, `description`, `status`, `dates`) in PostgreSQL.
  - **Sorting**: Updated `getProjects` query to force **Completed** projects to the bottom of the list using `ORDER BY CASE...`.
  - **Fallback**: Added fallback logic in `createProject` to handle `created_by` if `req.user` is missing.
- **Routes (`projectRoutes.js`)**:
  - Added `PUT /:id` endpoint mapped to `updateProject`.

### 2. 📡 New API Endpoints

| Method | Endpoint | Description | Body Parameters |
| :--- | :--- | :--- | :--- |
| **PUT** | `/api/projects/:id` | Update project details | `{ project_name, project_description, project_status, start_date, end_date }` |

### 3. 🛠 Fixes & Adjustments

| Feature | Change |
| :--- | :--- |
| **Edit Project** | Fixes issue where users couldn't update project status or deadlines. |
| **Manage Team** | Clarified UI by moving the add button to the Team list card. |
| **Sorting** | "Completed" projects now appear at the bottom of the Dashboard/List for better focus on active work. |
