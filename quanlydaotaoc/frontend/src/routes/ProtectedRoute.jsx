// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Nếu chưa đăng nhập, đẩy về trang login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập, cho phép render các trang con (Dashboard, Profile...)
    return <Outlet />;
};

export default ProtectedRoute;