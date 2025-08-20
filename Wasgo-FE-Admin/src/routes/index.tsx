// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from '../pages/auth/Login';
// import Register from '../pages/auth/Register';
// import ForgotPassword from '../pages/auth/ForgotPassword';
// import ResetPassword from '../pages/auth/ResetPassword';
// import AdminLayout from '../layouts/AdminLayout';
// import Dashboard from '../pages/admin/Dashboard';
// import Providers from '../pages/admin/Providers';
// import ProviderDetail from '../pages/admin/ProviderDetail';
// import DriverDetail from '../pages/admin/DriverDetail';
// import EditDriver from '../pages/admin/EditDriver';
// import AddProvider from '../pages/admin/AddProvider';
// import EditProvider from '../pages/admin/EditProvider';
// import AddDriver from '../pages/admin/AddDriver';
// import { useAuth } from '../contexts/AuthContext';

// const AppRoutes: React.FC = () => {
//     const { isAuthenticated } = useAuth();

//     return (
//         <Routes>
//             {/* Auth Routes */}
//             <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/admin" />} />
//             <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/admin" />} />
//             <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/admin" />} />
//             <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/admin" />} />

//             {/* Admin Routes */}
//             <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
//                 <Route index element={<Dashboard />} />
//                 <Route path="providers" element={<Providers />} />
//                 <Route path="providers/new" element={<AddProvider />} />
//                 <Route path="providers/:id" element={<ProviderDetail />} />
//                 <Route path="providers/:id/edit" element={<EditProvider />} />
//                 <Route path="providers/:id/drivers/new" element={<AddDriver />} />
                
//                 {/* Driver Routes */}
//                 <Route path="drivers/:id" element={<DriverDetail />} />
//                 <Route path="drivers/:id/edit" element={<EditDriver />} />
//             </Route>

//             {/* Catch all route */}
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/admin" : "/login"} />} />
//         </Routes>
//     );
// };

// export default AppRoutes; 