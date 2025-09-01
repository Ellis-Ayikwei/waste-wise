import { lazy, useEffect, useState } from 'react';
import Homepage from '../pages/website-preauth/Homepage';
import HowItWorks from '../pages/website-preauth/HowItWorks';
import About from '../pages/website-preauth/About';
import Contact from '../pages/website-preauth/Contact';
import PrivacyPolicy from '../pages/website-preauth/PrivacyPolicy';
import TermsAndConditions from '../pages/website-preauth/TermsAndConditions';
import BinMap from '../pages/website-preauth/BinMap';
import ReportIssue from '../pages/website-preauth/ReportIssue';
import CollectionSchedule from '../pages/website-preauth/CollectionSchedule';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import AuthRedirect from '../components/Auth/AuthRedirect';

// import AnalyticsPage from '../pages/analytics';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import FAQPage from '../pages/help and support/faq';
import JobDetail from '../pages/provider/Jobs/JobDetail';

import ProviderOnboarding from '../pages/provider/providerOnboarding/ProviderOnboarding';
import ProviderVerifyAccount from '../pages/provider/providerOnboarding/ProviderVerifyAccount';
import ServiceDetail from '../pages/service/ServiceDetail';
import ContactSupportPage from '../pages/help and support/supportPage';
import BookingConfirmation from '../pages/user/BookingConfirmation';
import BookingTracking from '../pages/user/UserBookings/BookingTracking';
import ProviderListings from '../pages/user/ProviderListings';
import UserDashboard from '../pages/user/UserDashboard';
import UserSettings from '../pages/user/userAccoutSettings/UserSettings';
import MyBookings from '../pages/user/UserBookings/MyBookings';
import CustomerPayments from '../pages/user/MyPayments';
import ProviderPayments from '../pages/provider/ProviderPayments';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import NotificationDetail from '../pages/Notifications/NotificationDetail';
import BookingDetail from '../pages/user/UserBookings/BookingDetail';
import BidSelection from '../pages/user/BidSelection';
import EditRequestForm from '../pages/EditRequestForm';
import DisputesPage from '../pages/help and support/DisputesPage';
import SavedProviders from '../pages/user/SavedProvider';
import ChatPage from '../pages/chat/ChatPage';
import LeaveReviewPage from '../pages/user/LeaveAReview';
import ProviderReviews from '../pages/provider/reviews';
import ProviderManagement from '../pages/provider/ProviderManagement';
import Home from '../pages/Home';
import VehicleManagement from '../pages/vehicleManagement/vehicleManagment';
import DriversManagement from '../pages/DriverManagement/driverManagement';

import UserDetail from '../pages/user/UserDetail';
import PaymentPage from '../pages/PaymentPage';
import ServiceRequestDetailPage from '../pages/ServiceRequestDetailPage';
import ServiceRequestPage from '../pages/customer/ServiceRequest/ServiceRequestPage';
import ProviderJobDetailPage from '../pages/ProviderJobDetailPage';
import PaymentDetail from '../components/Payment/PaymentDetail';
import UserBookingDetail from '../pages/user/UserBookingDetail';
import PaymentSuccess from '../pages/user/PaymentSuccess';
import PaymentCancel from '../pages/user/PaymentCancel';

// Import vehicle components
import VehicleList from '../components/vehicle/VehicleList';
import VehicleDetail from '../components/vehicle/VehicleDetail';

import BlogPostDetail from '../pages/website-preauth/BlogPostDetail';
import Blog from '../pages/website-preauth/Blog';
import Services from '../pages/website-preauth/services/Services';
import ForgotPassword from '../pages/auth/forgot-password';
import ResetPassword from '../pages/auth/reset-password';
import ServiceDetailPage from '../pages/website-preauth/service-details/ServiceDetailPage';
import OTPVerification from '../pages/auth/otp-verification';
import LoginOTPVerification from '../pages/auth/login-otp-verification';
import NotFound from '../pages/NotFound';
import ProviderDetail from '../pages/provider/ProviderDetail/ProviderDetail';
import AddEditVehiclePage from '../pages/provider/ProviderDetail/tabs/vehiclesTab/AddEditVehiclePage';
import ViewVehiclePage from '../pages/provider/ProviderDetail/tabs/vehiclesTab/ViewVehiclePage';
import DriverDetail from '../pages/provider/ProviderDetail/tabs/driversTab/DriverDetail';
import EditDriver from '../pages/provider/ProviderDetail/tabs/driversTab/EditDriver';
import ProviderDashboard from '../pages/provider/Dashboard/providerDashboard';
import SmartBins from '../pages/customer/SmartBin/SmartBins';
import BinDetail from '../pages/customer/SmartBin/BinDetail/BinDetail';
import SmartBinAlerts from '../pages/provider/SmartBinAlerts';
import Rewards from '../pages/customer/Rewards';
import ImpactReports from '../pages/customer/ImpactReports';
import Analytics from '../pages/provider/Analytics';
import Performance from '../pages/provider/Performance';
import Training from '../pages/provider/Training';

// Import new customer dashboard pages
import RequestPickup from '../pages/customer/RequestPickup';
import SchedulePickup from '../pages/customer/SchedulePickup';
import ActivePickups from '../pages/customer/ActivePickups';
import PickupHistory from '../pages/customer/PickupHistory';
import RecyclingCenters from '../pages/customer/RecyclingCenters';
import Wallet from '../pages/customer/Wallet';
import Messages from '../pages/customer/Messages';
import HelpCenter from '../pages/customer/HelpCenter';
import LiveChat from '../pages/customer/LiveChat';
import DisputeResolution from '../pages/customer/DisputeResolution';
import PickupRequestsPage from '../pages/customer/PickupRequests/PickupRequestsPage';
import ServiceRequestDetail from '../pages/customer/ServiceRequest/ServiceRequestDetail';
import UserAccountSetting from '../pages/userAccountSetting';
import JobRequests from '../pages/provider/Jobs/JobRequests';
import PickupRoute from '../pages/provider/Jobs/PickupRoute';
import ActiveJobs from '../pages/provider/ActiveJobs';
import FleetManagement from '../pages/provider/FleetManagement';
import Earnings from '../pages/provider/Earnings';
import Dashboard from '../pages/Dasboard/Dashboard';
import CreateOrEditServiceRequest from '../pages/customer/ServiceRequest/CreateOrEditServiceRequest';
import AddSmartBinPage from '../pages/customer/SmartBin/AddSmartBinPage';
import CreateServiceRequestPage from '../pages/customer/ServiceRequest/CreateServiceRequestPage';
import VerifyPayments from '../pages/payments/verifyPayments';
import PaymentsPage from '../pages/customer/Payments/PaymentsPage';


const routes = [
    // Public routes (no authentication required)
    {
        path: '*',
        element: <NotFound />,
        layout: 'blank',
    },
    {
        path: '/',
        element: <Homepage />,
        layout: 'blank',
    },
    {
        path: '/about',
        element: <About />,
        layout: 'blank',
    },
    {
        path: '/contact',
        element: <Contact />,
        layout: 'blank',
    },
    {
        path: '/blog',
        element: <Blog />,
        layout: 'blank',
    },
    {
        path: '/blog/:id',
        element: <BlogPostDetail />,
        layout: 'blank',
    },
    {
        path: '/services',
        element: <Services />,
        layout: 'blank',
    },
    {
        path: '/services/:serviceId',
        element: <ServiceDetailPage />,
        layout: 'blank',
    },
    {
        path: '/how-it-works',
        element: <HowItWorks />,
        layout: 'blank',
    },
    {
        path: '/bin-map',
        element: <BinMap />,
        layout: 'blank',
    },
    {
        path: '/report-issue',
        element: <ReportIssue />,
        layout: 'blank',
    },
    {
        path: '/collection-schedule',
        element: <CollectionSchedule />,
        layout: 'blank',
    },
    {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
        layout: 'blank',
    },
    {
        path: '/terms-and-conditions',
        element: <TermsAndConditions />,
        layout: 'blank',
    },

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
    {
        path: '/reset-password/:uidb64/:token',
        element: (
            <AuthRedirect>
                <ResetPassword />
            </AuthRedirect>
        ),
        layout: 'blank',
    },
    {
        path: '/verify-account',
        element: (
            <AuthRedirect>
                <OTPVerification type="signup" />
            </AuthRedirect>
        ),
        layout: 'blank',
    },
    {
        path: '/login-verification',
        element: (
            <AuthRedirect>
                <LoginOTPVerification />
            </AuthRedirect>
        ),
        layout: 'blank',
    },

    // Protected routes for authenticated users
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute customerOnly>
                <Dashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/smart-bins',
        element: (
            <ProtectedRoute customerOnly>
                <SmartBins />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/bins/:id',
        element: (
            <ProtectedRoute customerOnly>
                <BinDetail />
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
        path: '/customer/request-pickup',
        element: (
            <ProtectedRoute customerOnly>
                <RequestPickup />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/schedule-pickup',
        element: (
            <ProtectedRoute customerOnly>
                <SchedulePickup />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/active-pickups',
        element: (
            <ProtectedRoute customerOnly>
                <ActivePickups />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/pickup-history',
        element: (
            <ProtectedRoute customerOnly>
                <PickupHistory />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/recycling-centers',
        element: (
            <ProtectedRoute customerOnly>
                <RecyclingCenters />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/wallet',
        element: (
            <ProtectedRoute customerOnly>
                <Wallet />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/messages',
        element: (
            <ProtectedRoute customerOnly>
                <Messages />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/help-center',
        element: (
            <ProtectedRoute customerOnly>
                <HelpCenter />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/live-chat',
        element: (
            <ProtectedRoute customerOnly>
                <LiveChat />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/disputes',
        element: (
            <ProtectedRoute customerOnly>
                <DisputeResolution />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/account-settings',
        element: (
            <ProtectedRoute customerOnly>
                <UserAccountSetting />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/pickup-requests',
        element: (
            <ProtectedRoute customerOnly>
                <PickupRequestsPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/service-requests/:id',
        element: (
            <ProtectedRoute customerOnly>
                <ServiceRequestDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/customer/payments',
        element: (
            <ProtectedRoute customerOnly>
                <PaymentsPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
   
    {
        path: '/customer/smart-bins/add',
        element: (
            <ProtectedRoute customerOnly>
                <AddSmartBinPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/job-requests',
        element: (
            <ProtectedRoute providerOnly>
                <JobRequests />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/active-jobs',
        element: (
            <ProtectedRoute providerOnly>
                <ActiveJobs />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/fleet',
        element: (
            <ProtectedRoute providerOnly>
                <FleetManagement />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/earnings',
        element: (
            <ProtectedRoute providerOnly>
                <Earnings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    // Legacy customer routes (keeping for backward compatibility)
   
  
    {
        path: '/active-pickups',
        element: (
            <ProtectedRoute customerOnly>
                <BookingTracking />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/pickup-history',
        element: (
            <ProtectedRoute customerOnly>
                <MyBookings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/recycling-centers',
        element: (
            <ProtectedRoute customerOnly>
                <ProviderListings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/wallet',
        element: (
            <ProtectedRoute customerOnly>
                <CustomerPayments />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/rewards',
        element: (
            <ProtectedRoute customerOnly>
                <Rewards />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/smart-bins',
        element: (
            <ProtectedRoute customerOnly>
                <SmartBins />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/impact-reports',
        element: (
            <ProtectedRoute customerOnly>
                <ImpactReports />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/smart-bin-alerts',
        element: (
            <ProtectedRoute customerOnly>
                <SmartBinAlerts />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
  
    {
        path: '/service-request/create',
        element: (
            <ProtectedRoute customerOnly>
                <CreateServiceRequestPage />
            </ProtectedRoute>
        ),
        layout: 'default',
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
                <PaymentSuccess />
        ),
        layout: 'blank',
    },
    {
        path: '/payment/cancel',
        element: (
            
                <PaymentCancel />
            
        ),
        layout: 'blank',
    },
    {
        path: '/payments/verify',
        element: <VerifyPayments />,
        layout: 'blank',
    },
    {
        path: '/payment/verify',
        element: (
            <ProtectedRoute>
                <VerifyPayments />
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

    // Provider routes
    {
        path: '/provider/dashboard',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
   
    
    {
        path: '/provider/fleet',
        element: (
            <ProtectedRoute providerOnly>
                <VehicleManagement />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/routes',
        element: (
            <ProtectedRoute providerOnly>
                <BookingTracking />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/pickup-routes',
        element: (
            <ProtectedRoute providerOnly>
                <PickupRoute />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
  
    {
        path: '/provider/analytics',
        element: (
            <ProtectedRoute providerOnly>
                <Analytics />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/earnings',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderPayments />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/ratings',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderReviews />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/performance',
        element: (
            <ProtectedRoute providerOnly>
                <Performance />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/messages',
        element: (
            <ProtectedRoute providerOnly>
                <ChatPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/help-center',
        element: (
            <ProtectedRoute providerOnly>
                <FAQPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/live-chat',
        element: (
            <ProtectedRoute providerOnly>
                <ChatPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/report-issue',
        element: (
            <ProtectedRoute providerOnly>
                <DisputesPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/smart-bin-alerts',
        element: (
            <ProtectedRoute providerOnly>
                <SmartBinAlerts />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/training',
        element: (
            <ProtectedRoute providerOnly>
                <Training />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    
    
    
    {
        path: '/provider/job/:id',
        element: (
            <ProtectedRoute providerOnly>
                <JobDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/payouts',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderPayments />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/onboarding',
        element: <ProviderOnboarding />,
        layout: 'blank',
    },
    {
        path: '/provider/verify-account',
        element: <ProviderVerifyAccount />,
        layout: 'blank',
    },

    // Provider Management (Admin)
    {
        path: '/provider/management',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderManagement />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/profile',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/vehicle-management/add',
        element: (
            <ProtectedRoute>
                <AddEditVehiclePage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/vehicle-management/edit/:vehicleId',
        element: (
            <ProtectedRoute>
                <AddEditVehiclePage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/vehicle-management/view/:vehicleId',
        element: (
            <ProtectedRoute>
                <ViewVehiclePage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/drivers/:id',
        element: (
            <ProtectedRoute providerOnly>
                <DriverDetail />
            </ProtectedRoute>
        ),
            layout: 'default',
    },
    {
        path: '/provider/drivers/:id/edit',
        element: (
            <ProtectedRoute providerOnly>
                <EditDriver />
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
        path: '/providers/:providerId/ratings',
        element: (
            <ProtectedRoute>
                <ProviderReviews />
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


];

export { routes };

