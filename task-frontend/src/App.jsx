import { Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import { Login } from './pages/Auth/Login';
import { Home } from './pages/Home/HomePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RoleRoute from './routes/RoleRoute';
import UserManagement from './pages/Admin/UserManagement';
import ProjectList from './pages/ProjectManager/ProjectList';
import ProjectDetails from './pages/ProjectManager/ProjectDetails';
import ProjectKanbanBoard from './pages/ProjectManager/ProjectKanbanBoard';
import PersonalKanbanBoard from './pages/ProjectManager/PersonalKanbanBoard';

function App() {

  return (
    <>
      <div>
        <Routes>
          {/* 1. หน้าแรก (Home) */}
          <Route path="/" element={<Home />} />

          {/* 2. หน้า Login */}
          <Route path="/login" element={<Login />} />

          {/* 3. หน้า Admin Dashboard (Protected) */}
          <Route element={<RoleRoute allowedRoles={['Admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/user-management" element={<UserManagement />} />
          </Route>

          {/* 4. หน้า Project Manager (Protected) */}
          <Route element={<RoleRoute allowedRoles={['PM']} />}>
            <Route path="/project-management" element={<ProjectList />} />
            <Route path="/kanban-board/:projectId" element={<ProjectKanbanBoard />} />
            <Route path="/project-details/:projectId" element={<ProjectDetails />} />
            <Route path="/personal-kanban" element={<PersonalKanbanBoard />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
