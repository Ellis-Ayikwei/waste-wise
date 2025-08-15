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

    // If user is authenticated, redirect them away from auth pages
    if (isAuthenticated && authUser?.user) {
        const userType = authUser.user.user_type?.toLowerCase();
        const searchParams = new URLSearchParams(location.search);
        const from = searchParams.get('from');
        const dispatch = useDispatch();
        

        // If there's a 'from' parameter, redirect there
        if (from) {
            return <Navigate to={decodeURIComponent(from)} replace />;
        }

        // Otherwise, redirect based on user type
        const adminRoles = ['super_admin', 'admin', 'underwriter', 'premium_admin', 'sales'];
        const providerRoles = ['provider', 'business'];

        if (adminRoles.includes(userType) || providerRoles.includes(userType)) {
            dispatch(initializeViewMode("admin"));
            return <Navigate to="/provider/dashboard" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
};

export default AuthRedirect;
