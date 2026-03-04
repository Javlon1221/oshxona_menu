import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = React.lazy(() => import('./Home'));
const Menu = React.lazy(() => import('./Menu'));
const Login = React.lazy(() => import('./Login'));
const Register = React.lazy(() => import('./Register'));
const Cart = React.lazy(() => import('./Cart'));
const Profile = React.lazy(() => import('./Profile'));
const Admin = React.lazy(() => import('./Admin'));
const About = React.lazy(() => import('./About'));
const Contact = React.lazy(() => import('./Contact'));

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const storedUser = !user ? JSON.parse(localStorage.getItem('user') || 'null') : user;
    const authed = isAuthenticated || !!localStorage.getItem('token');

    if (!authed) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin) {
        const role = storedUser?.role || storedUser?.username;
        const isAdmin = role === 'admin' || storedUser?.username === 'admin';
        if (!isAdmin) return <Navigate to="/" replace />;
    }

    return children;
};

const MainRoutes = () => {
    const routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/menu', element: <Menu /> },
        { path: '/about', element: <About /> },
        { path: '/contact', element: <Contact /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        {
            path: '/cart',
            element: (
                <ProtectedRoute>
                    <Cart />
                </ProtectedRoute>
            ),
        },
        {
            path: '/profile',
            element: (
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            ),
        },
        {
            path: '/admin',
            element: (
                <ProtectedRoute requireAdmin={true}>
                    <Admin />
                </ProtectedRoute>
            ),
        },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);

    return (
        <React.Suspense fallback={<div className="flex justify-center items-center min-h-screen text-xl">Yuklanmoqda...</div>}>
            {routes}
        </React.Suspense>
    );
};

export default MainRoutes;
