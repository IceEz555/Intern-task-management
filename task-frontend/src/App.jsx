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
import PersonalKanbanBoard from './pages/Shared/PersonalKanbanBoard';
import ProfilePage from './pages/Shared/ProfilePage';
import NotFound from './pages/Shared/NotFound';
import MemberDashboard from './pages/Member/MemberDashboard';
import MemberTask from './pages/Member/MemberTask'

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

          {/* 5. หน้า Member Dashboard (Protected) */}
          <Route element={<RoleRoute allowedRoles={['Member']} />}>
            <Route path="/member-dashboard" element={<MemberDashboard />} />
            <Route path="/member-task" element={<MemberTask />} />
          </Route>

          {/* 6. Share Page */}
          <Route element={<RoleRoute allowedRoles={['PM', 'Admin', 'Member']} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/personal-kanban" element={<PersonalKanbanBoard />} />
          </Route>

          {/* 7. 404 Not Found */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </div>
    </>
  )
}

export default App
