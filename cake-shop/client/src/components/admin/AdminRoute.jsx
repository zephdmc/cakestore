import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../common/Loader'; // Assuming you have a Loader component

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin, authLoading } = useAuth();
    const location = useLocation();

    // if (authLoading) return <Loader />; // Better than returning null

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    console.log('AdminRoute check:', { currentUser, isAdmin, authLoading });
    if (authLoading) return <div>Loading auth...</div>;
    return children;
};

export default AdminRoute;