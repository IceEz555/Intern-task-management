import { useNavigate } from 'react-router-dom';
import '../../assets/styles/NotFound.css';
import { Home, ArrowLeft } from 'lucide-react';

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
                <div className="flex gap-4 justify-center mt-6">
                    <button onClick={() => navigate(-1)} className="btn-back flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        <ArrowLeft size={20} />
                        Go Back
                    </button>

                    <button onClick={() => navigate('/')} className="btn-home flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Home size={20} />
                        Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
}
