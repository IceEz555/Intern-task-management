# Task Management System - Frontend

This is the frontend application for the Task Management System, built with modern web technologies to provide a responsive and interactive user experience.

## 💻 Tech Stack

- **Framework**: [React](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS
- **Routing**: [React Router](https://reactrouter.com/) (v7)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 🏗 Project Structure

```
src/
├── assets/         # Static assets (images, global styles)
├── components/     # Reusable components
│   ├── common/     # Generic components (Modal, Button, etc.)
│   └── layout/     # Layout components (Sidebar, Topbar)
├── context/        # Context API (AuthContext, etc.)
├── pages/          # Page components
│   ├── Admin/      # Admin-specific pages (Dashboard, UserManagement)
│   ├── Auth/       # Authentication pages (Login)
│   └── Home/       # Public home page
├── routes/         # Routing configuration (Protected Routes)
└── utils/          # Helper functions
```

## 🚀 Getting Started

1.  **Install Dependencies**

    ```bash
    npm install

    # Configure Environment
    cp .env.example .env
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## 🎨 Key Features

- **Authentication**:
  - Full **JWT Authentication** (Access Token + Refresh Token).
  - Role-based Access Control (Admin, PM, Member).
  - Secure Login/Logout with `AuthContext`.
- **Project Management (PM)**:
  - **Kanban Board**: Drag & Drop tasks with `@dnd-kit`.
  - **Project Details**: Manage members (`AddMemberModal` Multi-select), create/edit tasks.
  - **Personal Board**: "My Tasks" view for individual users.
- **Admin Dashboard**:
  - Real-time system stats & charts.
  - **User Management**: Full CRUD with **Toast Notifications** (`react-hot-toast`).
- **Member Features**:
  - Profile Management.
  - Task Status Updates.
- **AI Integration**:
  - Accessible via Sidebar (opens in new tab) for project assistance.

## 📚 Documentation

Detailed documentation is available in the `docs/frontend/` directory:

- [Frontend Structure](../docs/frontend/frontend_structure.md) - Component hierarchy.
- [Component Documentation](../docs/frontend/component_documentation.md) - Props & Usage.
- [Code Explanation](../docs/frontend/CODE_EXPLANATION.md) - Deep dive into logic.
- [Technical Deep Dive](../docs/frontend/TECHNICAL_DEEP_DIVE.md) - Architecture & Flows.

## 🔧 Configuration

- **Tailwind**: Configured in `tailwind.config.js` and `src/index.css`.
- **Vite**: Configured in `vite.config.js`.

---

_Part of the Intern Task Management Project_
