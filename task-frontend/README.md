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
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## 🎨 Key Features

- **Authentication**: Login page with role-based simulation.
- **Admin Dashboard**: Overview of system stats.
- **User Management**:
  - Browse users with filtering.
  - Add, Edit, and Delete users via Modal popups.
  - *Note: Currently connects to a local backend API.*

- **Deployment**: Fully verified to run in Docker environment (`npm run dev` with host networking).
- **AI Integration**:
  - Accessible via Sidebar (opens in new tab) for project assistance.


## 🔧 Configuration

- **Tailwind**: Configured in `tailwind.config.js` and `src/index.css`.
- **Vite**: Configured in `vite.config.js`.

---
*Part of the Intern Task Management Project*
