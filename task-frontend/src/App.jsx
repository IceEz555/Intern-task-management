import { Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import { Login } from './pages/Auth/Login';
import { Home } from './pages/Home/HomePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RoleRoute from './routes/RoleRoute';

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
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
