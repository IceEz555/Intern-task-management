import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to a default page based on their actual role, or unauthorized page
        // Redirect to their specific dashboard based on role instead of generic home
        switch (user.role) {
            case 'Admin':
                return <Navigate to="/AdminDashboard" replace />;
            case 'PM':
                return <Navigate to="/ProjectManagement" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default RoleRoute;
