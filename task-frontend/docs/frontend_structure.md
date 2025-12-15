# Frontend Structure & Component Hierarchy

เอกสารนี้แสดงโครงสร้างไฟล์และ Component ของระบบ Frontend ที่อัปเดตล่าสุด

## 📂 Folder Structure

```
task-frontend/src/
├── assets/
│   ├── styles/               # CSS Files (Global & Specific)
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── Modal.css
│   │   ├── ProjectList.css
│   │   ├── ProjectDetails.css
│   │   ├── ProfilePage.css   (New!)
│   │   ├── AdminDashboard.css (New!)
│   │   └── NotFound.css      (New!)
├── components/
│   ├── common/               # Reusable Components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── ...
│   ├── dashboard/            # Dashboard specific components
│   │   ├── StatCard.jsx
│   │   ├── ProjectCard.jsx
│   ├── layout/               # Layout wrappers
│   │   ├── PageLayout.jsx    (Renamed from AdminLayout)
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── project/              # Project specific components (New!)
│   │   ├── CreateTaskModal.jsx
│   │   ├── AddMemberModal.jsx
│   │   ├── TaskItem.jsx
│   │   └── TeamMembers.jsx
│   ├── kanban/               # Kanban Board System (New!)
│   │   ├── SharedKanbanBoard.jsx    (Presenter UI - Reusable)
│   │   ├── KanbanColumn.jsx
│   │   └── KanbanCard.jsx
├── context/
│   └── AuthContext.jsx       # Authentication Logic
├── pages/
│   ├── Admin/
│   │   ├── AdminDashboard.jsx
│   │   └── UserManagement.jsx
│   ├── Auth/
│   │   └── Login.jsx
│   ├── Shared/
│   │   ├── ProfilePage.jsx   (New!)
│   │   └── NotFound.jsx      (New!)
│   ├── ProjectManager/       # PM Specific Pages
│   │   ├── ProjectList.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── ProjectKanbanBoard.jsx   (New!)
│   │   └── PersonalKanbanBoard.jsx  (New!)
├── routes/
│   └── RoleRoute.jsx         # Protected Routes
├── App.jsx
└── main.jsx
```

## 🧩 Component Relationships

### 1. Project Management Module

**Page: `ProjectDetails.jsx`**
*   **Layout**: `PageLayout` (Wraps everything)
*   **Children Components**:
    *   `TaskItem`: แสดงรายการงาน (Loop render)
    *   `TeamMembers`: แสดงรูปสมาชิกทีม
    *   `CreateTaskModal`: ป๊อปอัพสร้างงานใหม่ (Triggered by Button)
    *   `AddMemberModal`: ป๊อปอัพเพิ่มสมาชิก (Triggered by Manage Team)

**Page: `ProjectList.jsx`**
*   **Layout**: `PageLayout`
*   **Children Components**:
    *   `StatCard`: แสดงสถิติด้านบน
    *   `ProjectCard`: แสดงการ์ดโปรเจกต์ (Loop render)
    *   `Modal` (Generic): ใช้สำหรับสร้างโปรเจกต์ใหม่ (Inline Form)

---

## 🎨 Design System

*   **Tailwind CSS**: ใช้สำหรับ Utility classes ส่วนใหญ่
*   **Custom CSS**: ใช้สำหรับ override หรือ complex layout
    *   `ProjectList.css`: Grid layout สำหรับ project cards
    *   `ProjectDetails.css`: Layout 2 คอลัมน์ (Tasks vs Members) และ Header
