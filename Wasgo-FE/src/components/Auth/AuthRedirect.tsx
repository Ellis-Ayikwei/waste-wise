import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { useDispatch } from 'react-redux';
import { initializeViewMode } from '../../store/slices/viewModeSlice';

interface AuthUser {
    user: {
        id: string;
        email: string;
        user_type: string;
        name?: string;
    };
}

interface AuthRedirectProps {
    children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
    const isAuthenticated = useIsAuthenticated();
    const authUser = useAuthUser() as AuthUser | null;
    const location = useLocation();
    const dispatch = useDispatch();

    console.log('=== AUTH REDIRECT COMPONENT RENDERED ===');
    console.log('AuthRedirect - isAuthenticated:', isAuthenticated);
    console.log('AuthRedirect - authUser:', authUser);
    console.log('AuthRedirect - location:', location.pathname);
    console.log('AuthRedirect - timestamp:', new Date().toISOString());

    // If user is authenticated, redirect them away from auth pages
    if (isAuthenticated && authUser?.user) {
        const userType = authUser.user.user_type?.toLowerCase();
        console.log('AuthRedirect - userType:', userType);
        console.log('AuthRedirect - User is authenticated, redirecting...');
        
        const searchParams = new URLSearchParams(location.search);
        const from = searchParams.get('from');

        // If there's a 'from' parameter, redirect there
        if (from) {
            console.log('AuthRedirect - redirecting to from:', from);
            return <Navigate to={decodeURIComponent(from)} replace />;
        }

        // Redirect based on user type
        const adminRoles = ['super_admin', 'admin', 'underwriter', 'premium_admin', 'sales'];
        const providerRoles = ['provider', 'business', 'waste_provider'];

        if (adminRoles.includes(userType)) {
            console.log('AuthRedirect - redirecting admin to /admin/dashboard');
            dispatch(initializeViewMode("admin"));
            return <Navigate to="/admin/dashboard" replace />;
        } else if (providerRoles.includes(userType)) {
            console.log('AuthRedirect - redirecting provider to /provider/dashboard');
            dispatch(initializeViewMode("admin"));
            return <Navigate to="/provider/dashboard" replace />;
        } else {
            // Customer users (default case)
            console.log('AuthRedirect - redirecting customer to /dashboard');
            return <Navigate to="/dashboard" replace />;
        }
    }

    console.log('AuthRedirect - showing children (not authenticated)');
    return <>{children}</>;
};

export default AuthRedirect;
