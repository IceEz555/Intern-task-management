import { Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import { Login } from './page/Auth/Login';
import { Home } from './page/home/Home';

function App() {

  return (
    <>
      <div>
        <Routes>
          {/* 1. หน้าแรก (Home) */}
          <Route path="/" element={<Home />} />

          {/* 2. หน้า Login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App
