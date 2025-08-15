import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { motion } from 'framer-motion';
import { IconShield, IconLoader } from '@tabler/icons-react';

interface AuthUser {
    user: {
        id: string;
        email: string;
        user_type: string;
        name?: string;
    };
}

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    adminOnly?: boolean;
    customerOnly?: boolean;
    providerOnly?: boolean;
}

const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block mb-4">
                <IconLoader className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Checking Authentication</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your access...</p>
        </motion.div>
    </div>
);

const UnauthorizedScreen: React.FC<{ userType?: string }> = ({ userType }) => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto px-6">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6"
            >
                <IconShield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                You don't have permission to access this page.
                {userType && (
                    <span className="block mt-2 text-sm">
                        Current role: <span className="font-medium">{userType}</span>
                    </span>
                )}
            </p>

            <div className="space-y-3">
                <button onClick={() => window.history.back()} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Go Back
                </button>
                <button
                    onClick={() => (window.location.href = '/dashboard')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        </motion.div>
    </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, adminOnly, customerOnly, providerOnly }) => {
    const isAuthenticated = useIsAuthenticated();
    const authUser = useAuthUser() as AuthUser | null;
    console.log('the authUser...............SS45', authUser);
    const location = useLocation();

    // Show loading while checking authentication
    // if (isAuthenticated === null) {
    //     return <LoadingScreen />;
    // }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={`/login?from=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }

    // If authenticated but no user data, show loadng
    if (!authUser?.user) {
        console.log("theres no user data");
        return <LoadingScreen />;
    }

    const userType = authUser.user.user_type?.toLowerCase();

    // // Check role-based access
    // if (adminOnly) {
    //     const adminRoles = ['super_admin', 'admin', 'underwriter', 'premium_admin', 'sales'];
    //     if (!adminRoles.includes(userType)) {
    //         return <UnauthorizedScreen userType={userType} />;
    //     }
    // }

    // if (customerOnly) {
    //     const customerRoles = ['member', 'regular', 'customer'];
    //     if (!customerRoles.includes(userType)) {
    //         return <UnauthorizedScreen userType={userType} />;
    //     }
    // }

    // if (providerOnly) {
    //     const providerRoles = ['provider', 'business'];
    //     if (!providerRoles.includes(userType)) {
    //         return <UnauthorizedScreen userType={userType} />;
    //     }
    // }

    // if (allowedRoles && !allowedRoles.includes(userType)) {
    //     return <UnauthorizedScreen userType={userType} />;
    // }

    return <>{children}</>;
};

export default ProtectedRoute;
