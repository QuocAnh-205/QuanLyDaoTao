// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Nếu đã đăng nhập mà cố vào /login, đẩy thẳng vào /dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Nếu chưa đăng nhập, cho phép render trang Login
    return <Outlet />;
};

export default PublicRoute;