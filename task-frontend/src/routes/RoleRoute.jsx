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
        // For now, just send them back to home or dashboard if possible
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;
