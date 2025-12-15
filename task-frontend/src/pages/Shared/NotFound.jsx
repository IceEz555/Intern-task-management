import { useNavigate } from 'react-router-dom';
import '../../assets/styles/NotFound.css';
import { Home } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Not Found</h2>
                <p className="not-found-text">
                    Oops! The page you are looking for does not exist. It might have been moved or deleted.
                </p>
                <button onClick={() => navigate('/')} className="btn-home">
                    <Home size={20} />
                    Back to Home
                </button>
            </div>
        </div>
    );
}
