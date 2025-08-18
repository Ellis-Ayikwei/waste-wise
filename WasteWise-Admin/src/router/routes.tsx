import { lazy, useEffect, useState } from 'react';
import AdminDashboard from '../pages/admin/AdminDashboard';
import EnhancedAdminDashboard from '../pages/admin/EnhancedAdminDashboard';
import SmartBinManagement from '../pages/admin/SmartBinManagement';
import AnalyticsReporting from '../pages/admin/AnalyticsReporting';
// import Homepage from '../pages/website-preauth/Homepage';
// import HowItWorks from '../pages/website-preauth/HowItWorks';
// import About from '../pages/website-preauth/About';
// import Contact from '../pages/website-preauth/Contact';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import AuthRedirect from '../components/Auth/AuthRedirect';

// import AnalyticsPage from '../pages/analytics';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import FAQPage from '../pages/help and support/faq';

import ServiceDetail from '../pages/service/ServiceDetail';
import ContactSupportPage from '../pages/help and support/supportPage';
import BookingConfirmation from '../pages/user/BookingConfirmation';
import BookingTracking from '../pages/user/BookingTracking';
import ProviderListings from '../pages/user/ProviderListings';
import UserDashboard from '../pages/user/UserDashboard';
import UserSettings from '../pages/user/userAccoutSettings/UserSettings';
import MyBookings from '../pages/user/MyBookings';
import CustomerPayments from '../pages/user/MyPayments';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import NotificationDetail from '../pages/Notifications/NotificationDetail';
import BookingDetail from '../components/ServiceRequest/BookingDetail';
import BidSelection from '../pages/user/BidSelection';
import EditRequestForm from '../pages/EditRequestForm';
import DisputesPage from '../pages/help and support/DisputesPage';
import SavedProviders from '../pages/user/SavedProvider';
import ChatPage from '../pages/chat/ChatPage';
import LeaveReviewPage from '../pages/user/LeaveAReview';
import Home from '../pages/Home';
import ServiceRequestForm from '../pages/ServiceRequest/ServiceRequestForm';
import DriversManagement from '../pages/DriverManagement/driverManagement';
import UserManagement from '../pages/admin/usermanagment';
import ProviderManagement from '../pages/admin/ProviderManagement';
import RevenueManagement from '../pages/admin/RevenueManagement';
import SystemMaintenance from '../pages/admin/SystemMaintenance';
import DisputeManagement from '../pages/admin/DisputeManagement';

import SupportTickets from '../pages/admin/SupportTickets';
import ProviderDetail from '../pages/admin/ProviderManagement/ProviderDetail/ProviderDetail';
import UserEdit from '../pages/admin/usermanagment/UserEdit';
import UserDetail from '../pages/user/UserDetail';
import AdminSettings from '../pages/admin/AdminSettings';

// Import new notification and messaging pages
import NotificationManagement from '../pages/admin/Notifications/NotificationManagement';
import NotificationTemplates from '../pages/admin/Notifications/NotificationTemplates';
import NotificationSettings from '../pages/admin/Notifications/NotificationSettings';
import MessagingDashboard from '../pages/admin/Messaging/MessagingDashboard';
import BidChats from '../pages/admin/Messaging/BidChats';
import PaymentPage from '../pages/PaymentPage';
import ServiceRequestDetailPage from '../pages/ServiceRequestDetailPage';
import ProviderJobDetailPage from '../pages/ProviderJobDetailPage';
import PaymentDetail from '../components/Payment/PaymentDetail';
import UserBookingDetail from '../pages/user/UserBookingDetail';

import PaymentSuccess from '../pages/user/PaymentSuccess';
import PaymentCancel from '../pages/user/PaymentCancel';

// Import vehicle components
import VehicleList from '../components/vehicle/VehicleList';
import VehicleDetail from '../components/vehicle/VehicleDetail';

import PricingAdmin from '../pages/admin/pricing';

import ForgotPassword from '../pages/auth/forgot-password';
import TestMapApi from '../pages/testMapApi';

// Import new user form pages
import CustomerForm from '../pages/admin/CustomerForm';
import ProviderForm from '../pages/admin/ProviderForm';
import AdminForm from '../pages/admin/AdminForm';

// Import new admin management pages
import JobManagement from '../pages/admin/JobManagement/JobManagement';
import AdminBookingDetail from '../pages/admin/BookingDetail';
import AdminJobDetail from '../pages/admin/JobManagement/JobDetails/JobDetail';
import EnhancedBookingDetail from '../pages/admin/BookingManagement/bookingDetail/EnhancedBookingDetail';
import UserView from '../pages/admin/usermanagment/UserView';
import DriverDetail from '../pages/admin/DriverDetail';
import EditDriver from '../pages/admin/EditDriver';
import CommonItems from '../pages/admin/CommonItems/index'

// Import new service request pages
import NewRequests from '../pages/admin/ServiceRequests/NewRequests';
import ScheduledRequests from '../pages/admin/ServiceRequests/ScheduledRequests';
import ActiveRequests from '../pages/admin/ServiceRequests/ActiveRequests';
import RequestHistory from '../pages/admin/ServiceRequests/RequestHistory';

// Import new rewards pages
import RewardPrograms from '../pages/admin/RewardsLoyalty/RewardPrograms';
import BadgeManagement from '../pages/admin/RewardsLoyalty/BadgeManagement';
import PointsSystem from '../pages/admin/RewardsLoyalty/PointsSystem';
import Redemptions from '../pages/admin/RewardsLoyalty/Redemptions';

// Import new smart bins pages
import BinOverview from '../pages/admin/SmartBins/BinOverview';
import BinAlerts from '../pages/admin/SmartBins/BinAlerts';

import CreateUser from '../pages/admin/usermanagment/createUser';
import CreateJob from '../pages/admin/CreateJob';
import SystemConfigurations from '../pages/admin/configurations';
import AddEditVehiclePage from '../pages/admin/ProviderManagement/ProviderDetail/tabs/vehiclesTab/AddEditVehiclePage';
import ViewVehiclePage from '../pages/admin/ProviderManagement/ProviderDetail/tabs/vehiclesTab/ViewVehiclePage';
import ProviderEdit from '../pages/admin/ProviderManagement/ProviderDetail/ProviderEdit';
import RolesPermissions from '../pages/admin/usermanagment/RolesPermissions';
import BookingManagement from '../pages/admin/BookingManagement/BookingManagement';

const userRole = localStorage.getItem('userRole') || '';
const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

const ConditionalDashboard = () => {
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const storedUserRole = localStorage.getItem('userRole');
        setUserRole(storedUserRole || '');
    }, []);

    if (!userRole) {
        return <div>Loading...</div>;
    }

    if (isAdmin) {
        return <AdminDashboard />;
    }

    // if (personalUsers.includes(userRole)) {
    //     return <MemberDashboard />;
    // }

    return <div>Unauthorized Access</div>;
};

const routes = [
    // Default route - Enhanced Admin Dashboard
    {
        path: '/',
        element: (
            <ProtectedRoute adminOnly>
                <EnhancedAdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    // Public routes (no authentication required)

    // Auth routes (redirect if already authenticated)
    {
        path: '/login',
        element: (
            <AuthRedirect>
                <Login />
            </AuthRedirect>
        ),
        layout: 'blank',
    },
    {
        path: '/register',
        element: (
            <AuthRedirect>
                <Register />
            </AuthRedirect>
        ),
        layout: 'blank',
    },
    {
        path: '/forgot-password',
        element: (
            <AuthRedirect>
                <ForgotPassword />
            </AuthRedirect>
        ),
        layout: 'blank',
    },

    // Protected routes for authenticated users
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute customerOnly>
                <UserDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/faq',
        element: (
            <ProtectedRoute>
                <FAQPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/disputes',
        element: (
            <ProtectedRoute>
                <DisputesPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/testmap-api',
        element: (
            <ProtectedRoute>
                <TestMapApi />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Customer routes
    {
        path: '/service-request',
        element: <ServiceRequestForm />,
        layout: 'flexible',
    },
    {
        path: '/service-request2',
        element: <ServiceRequestForm />,
        layout: 'flexible',
    },
    {
        path: '/service-requests/:id',
        element: (
            <ProtectedRoute>
                <ServiceRequestDetailPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/:bookingId/review',
        element: (
            <ProtectedRoute customerOnly>
                <LeaveReviewPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/edit-request/:id',
        element: (
            <ProtectedRoute customerOnly>
                <EditRequestForm />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/notifications',
        element: (
            <ProtectedRoute>
                <NotificationsPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/notifications/:id',
        element: (
            <ProtectedRoute>
                <NotificationDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/saved-providers',
        element: (
            <ProtectedRoute customerOnly>
                <SavedProviders />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/chat',
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/chat/:id',
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // My Moves/Bookings routes
    {
        path: '/my-bookings',
        element: (
            <ProtectedRoute customerOnly>
                <MyBookings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/new',
        element: (
            <ProtectedRoute customerOnly>
                <ServiceRequestForm />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/:id',
        element: (
            <ProtectedRoute>
                <BookingDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/:id/review',
        element: (
            <ProtectedRoute customerOnly>
                <LeaveReviewPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bidding/:serviceId',
        element: (
            <ProtectedRoute customerOnly>
                <BidSelection />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Payment routes
    {
        path: '/payments',
        element: (
            <ProtectedRoute>
                <CustomerPayments />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/:requestId?',
        element: (
            <ProtectedRoute>
                <PaymentPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/detail/:requestId',
        element: (
            <ProtectedRoute>
                <PaymentDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/success',
        element: (
            <ProtectedRoute>
                <PaymentSuccess />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/cancel',
        element: (
            <ProtectedRoute>
                <PaymentCancel />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Support routes
    {
        path: '/contact-support',
        element: (
            <ProtectedRoute>
                <ContactSupportPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Account settings
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <UserSettings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

   
  
   

    // // Vehicle management
    {
        path: '/vehicle-management/add',
        element: (
            <ProtectedRoute>
                <AddEditVehiclePage />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/vehicle-management/edit/:vehicleId',
        element: (
            <ProtectedRoute>
                <AddEditVehiclePage />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/vehicle-management/view/:vehicleId',
        element: (
            <ProtectedRoute>
                <ViewVehiclePage />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: 'driver-management',
        element: (
            <ProtectedRoute providerOnly>
                <DriversManagement />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/vehicles',
        element: (
            <ProtectedRoute>
                <VehicleList />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/vehicles/:id',
        element: (
            <ProtectedRoute>
                <VehicleDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Provider flow routes
    {
        path: '/providers/:requestId',
        element: (
            <ProtectedRoute customerOnly>
                <ProviderListings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
   
    {
        path: '/booking-confirmation/:requestId/:providerId',
        element: (
            <ProtectedRoute customerOnly>
                <BookingConfirmation />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/tracking/:id',
        element: (
            <ProtectedRoute>
                <BookingTracking />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Admin routes
    {
        path: '/admin/dashboard',
        element: <EnhancedAdminDashboard />,
        layout: 'default',
    },
    {
        path: '/admin/users',
        element: <UserManagement />,
        layout: 'default',
    },
    {
        path: '/admin/users/new',
        element: <CreateUser />,
        layout: 'default',
    },
    {
        path: '/admin/users/list',
        element: (
            <ProtectedRoute adminOnly>
                <UserManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/roles',
        element: (
            <ProtectedRoute adminOnly>
                <RolesPermissions />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/customers/new',
        element: (
            <ProtectedRoute adminOnly>
                <CustomerForm />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/providers/new',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderForm />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/admins/new',
        element: (
            <ProtectedRoute adminOnly>
                <AdminForm />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/:id',
        element: (
            <ProtectedRoute adminOnly>
                <UserView />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/providers',
        element: <ProviderManagement />,
        layout: 'default',
    },
    {
        path: '/admin/providers/:id',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderDetail />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
        {
            path: '/admin/drivers/:id',
            element: (
                <ProtectedRoute adminOnly>
                    <DriverDetail />
                </ProtectedRoute>
            ),
            layout: 'admin',
        },
        {
            path: '/admin/drivers/:id/edit',
            element: (
                <ProtectedRoute adminOnly>
                    <EditDriver />
                </ProtectedRoute>
            ),
            layout: 'admin',
        },
    {
        path: '/admin/providers/list',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/common-items',
        element: (
            <ProtectedRoute adminOnly>
                <CommonItems />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/configurations',
        element: (
            <ProtectedRoute adminOnly>
                <SystemConfigurations />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/providers/:id/edit',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderEdit />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/bookings',
        element: <BookingManagement />,
        layout: 'default',
    },
    {
        path: '/admin/bookings/:id',
        element: <EnhancedBookingDetail />,
        layout: 'default',
    },
    {
        path: '/admin/jobs',
        element: <JobManagement />,
        layout: 'default',
    },
    {
        path: '/admin/jobs/new',
        element: <CreateJob />,
        layout: 'default',
    },
    {
        path: '/admin/jobs/:id',
        element: (
            
                <AdminJobDetail />
        ),
        layout: 'admin',
    },
    {
        path: '/admin/jobs/:id/edit',
        element: (
            <ProtectedRoute adminOnly>
                <AdminJobDetail />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/revenue',
        element: <RevenueManagement />,
        layout: 'default',
    },
    {
        path: '/admin/pricing',
        element: <PricingAdmin />,
        layout: 'default',
    },
    {
        path: '/admin/disputes',
        element: <DisputeManagement />,
        layout: 'default',
    },
    {
        path: '/admin/settings',
        element: <AdminSettings />,
        layout: 'default',
    },
    {
        path: '/admin/permissions',
        element: <RolesPermissions />,
        layout: 'default',
    },
    {
        path: '/admin/maintenance',
        element: <SystemMaintenance />,
        layout: 'default',
    },
    {
        path: '/admin/support',
        element: <SupportTickets />,
        layout: 'default',
    },
    {
        path: '/admin/smart-bins',
        element: (
            <ProtectedRoute adminOnly>
                <SmartBinManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/analytics',
        element: (
            <ProtectedRoute adminOnly>
                <AnalyticsReporting />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/support-tickets/:ticketId',
        element: <SupportTickets />,
        layout: 'default',
    },

    // Notification Management Routes
    {
        path: '/admin/notifications/management',
        element: (
            <ProtectedRoute adminOnly>
                <NotificationManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/notifications/templates',
        element: (
            <ProtectedRoute adminOnly>
                <NotificationTemplates />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/notifications/settings',
        element: (
            <ProtectedRoute adminOnly>
                <NotificationSettings />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Messaging Routes
    {
        path: '/admin/messaging/dashboard',
        element: (
            <ProtectedRoute adminOnly>
                <MessagingDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/messaging/bid-chats',
        element: (
            <ProtectedRoute adminOnly>
                <BidChats />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/messaging/booking-chats',
        element: (
            <ProtectedRoute adminOnly>
                <MessagingDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/messaging/provider-support',
        element: (
            <ProtectedRoute adminOnly>
                <MessagingDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/messaging/customer-support',
        element: (
            <ProtectedRoute adminOnly>
                <MessagingDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Smart Bins Routes
    {
        path: '/admin/smart-bins/overview',
        element: (
            <ProtectedRoute adminOnly>
                <BinOverview />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/smart-bins/alerts',
        element: (
            <ProtectedRoute adminOnly>
                <BinAlerts />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/smart-bins/analytics',
        element: (
            <ProtectedRoute adminOnly>
                <SmartBinManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/smart-bins/maintenance',
        element: (
            <ProtectedRoute adminOnly>
                <SmartBinManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Service Requests Routes
    {
        path: '/admin/requests/new',
        element: (
            <ProtectedRoute adminOnly>
                <NewRequests />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/requests/scheduled',
        element: (
            <ProtectedRoute adminOnly>
                <ScheduledRequests />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/requests/active',
        element: (
            <ProtectedRoute adminOnly>
                <ActiveRequests />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/requests/history',
        element: (
            <ProtectedRoute adminOnly>
                <RequestHistory />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Revenue Routes
    {
        path: '/admin/revenue/overview',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/revenue/payments',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/revenue/transactions',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/revenue/analytics',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Analytics Routes
    {
        path: '/admin/analytics/dashboard',
        element: (
            <ProtectedRoute adminOnly>
                <AnalyticsReporting />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/analytics/performance',
        element: (
            <ProtectedRoute adminOnly>
                <AnalyticsReporting />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/analytics/impact',
        element: (
            <ProtectedRoute adminOnly>
                <AnalyticsReporting />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/analytics/export',
        element: (
            <ProtectedRoute adminOnly>
                <AnalyticsReporting />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Support Routes
    {
        path: '/admin/support/tickets',
        element: (
            <ProtectedRoute adminOnly>
                <SupportTickets />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/support/disputes',
        element: (
            <ProtectedRoute adminOnly>
                <DisputeManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/support/faq',
        element: (
            <ProtectedRoute adminOnly>
                <FAQPage />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/support/live-chat',
        element: (
            <ProtectedRoute adminOnly>
                <MessagingDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Fleet Management Routes
    {
        path: '/admin/fleet/vehicles',
        element: (
            <ProtectedRoute adminOnly>
                <VehicleList />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/fleet/drivers',
        element: (
            <ProtectedRoute adminOnly>
                <DriversManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/fleet/routes',
        element: (
            <ProtectedRoute adminOnly>
                <BookingManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/fleet/tracking',
        element: (
            <ProtectedRoute adminOnly>
                <BookingManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Rewards Routes
    {
        path: '/admin/rewards/programs',
        element: (
            <ProtectedRoute adminOnly>
                <RewardPrograms />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/rewards/badges',
        element: (
            <ProtectedRoute adminOnly>
                <BadgeManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/rewards/points',
        element: (
            <ProtectedRoute adminOnly>
                <PointsSystem />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/rewards/redemptions',
        element: (
            <ProtectedRoute adminOnly>
                <Redemptions />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Recycling Centers Routes
    {
        path: '/admin/recycling/centers',
        element: (
            <ProtectedRoute adminOnly>
                <EnhancedAdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/recycling/materials',
        element: (
            <ProtectedRoute adminOnly>
                <EnhancedAdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/recycling/rates',
        element: (
            <ProtectedRoute adminOnly>
                <EnhancedAdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/recycling/impact',
        element: (
            <ProtectedRoute adminOnly>
                <EnhancedAdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Wallet Routes
    {
        path: '/admin/wallet/overview',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/wallet/transactions',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/wallet/credits',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/wallet/refunds',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Configurations Routes
    {
        path: '/admin/configurations/system',
        element: (
            <ProtectedRoute adminOnly>
                <SystemConfigurations />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/configurations/business',
        element: (
            <ProtectedRoute adminOnly>
                <SystemConfigurations />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/configurations/integrations',
        element: (
            <ProtectedRoute adminOnly>
                <SystemConfigurations />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/configurations/backup',
        element: (
            <ProtectedRoute adminOnly>
                <SystemConfigurations />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // System Maintenance Routes
    {
        path: '/admin/maintenance/overview',
        element: (
            <ProtectedRoute adminOnly>
                <SystemMaintenance />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/maintenance/logs',
        element: (
            <ProtectedRoute adminOnly>
                <SystemMaintenance />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/maintenance/updates',
        element: (
            <ProtectedRoute adminOnly>
                <SystemMaintenance />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/maintenance/health',
        element: (
            <ProtectedRoute adminOnly>
                <SystemMaintenance />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Notification History Route
    {
        path: '/admin/notifications/history',
        element: (
            <ProtectedRoute adminOnly>
                <NotificationManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // Provider Management Sub-routes
    {
        path: '/admin/providers/verification',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/providers/fleet',
        element: (
            <ProtectedRoute adminOnly>
                <VehicleList />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/providers/earnings',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },

    // User Management Sub-routes
    {
        path: '/admin/users/customers',
        element: (
            <ProtectedRoute adminOnly>
                <UserManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/providers',
        element: (
            <ProtectedRoute adminOnly>
                <UserManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/drivers',
        element: (
            <ProtectedRoute adminOnly>
                <UserManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
];

export { routes };
