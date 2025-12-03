import { Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import { Login } from './page/Auth/Login';
import { Home } from './page/home/Home';
import AdminDashboard from './page/Admin/Dashboard';

function App() {

  return (
    <>
      <div>
        <Routes>
          {/* 1. หน้าแรก (Home) */}
          <Route path="/" element={<Home />} />

          {/* 2. หน้า Login */}
          <Route path="/login" element={<Login />} />

          {/* 3. หน้า Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </>
  )
}

export default App
