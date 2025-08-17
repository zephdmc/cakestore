// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// export default function PrivateRoute() {
//     const { currentUser } = useAuth();

//     return currentUser ? <Outlet /> : <Navigate to="/login" />;
// }



import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const { currentUser, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}