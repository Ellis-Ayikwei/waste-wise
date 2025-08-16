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
import JobBoard from '../pages/provider/JobBoard/JobBoard';
import JobDetail from '../pages/provider/JobdDeatail/JobDetail';
import ProviderDashboard from '../pages/provider/providerDashboard/ProviderDashboard';
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
import ServiceRequestForm from '../pages/ServiceRequest/ServiceRequestForm';
import VehicleManagement from '../pages/vehicleManagement/vehicleManagment';
import DriversManagement from '../pages/DriverManagement/driverManagement';

import UserDetail from '../pages/user/UserDetail';
import PaymentPage from '../pages/PaymentPage';
import ServiceRequestDetailPage from '../pages/ServiceRequestDetailPage';
import ProviderJobDetailPage from '../pages/ProviderJobDetailPage';
import PaymentDetail from '../components/Payment/PaymentDetail';
import UserBookingDetail from '../pages/user/UserBookingDetail';
import MyJobs from '../pages/provider/MyJobs/MyJobs';
import PaymentSuccess from '../pages/user/PaymentSuccess';
import PaymentCancel from '../pages/user/PaymentCancel';

// Import vehicle components
import VehicleList from '../components/vehicle/VehicleList';
import VehicleDetail from '../components/vehicle/VehicleDetail';
import BiddingJobs from '../pages/provider/MyJobs/BiddingJobs';
import WatchingJobs from '../pages/provider/MyJobs/WatchingJobs';
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
        path: '/provider/jobs',
        element: (
            <ProtectedRoute providerOnly>
                <JobBoard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/my-jobs',
        element: (
            <ProtectedRoute providerOnly>
                <MyJobs />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/my-jobs-bidding',
        element: (
            <ProtectedRoute providerOnly>
                <BiddingJobs />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/my-jobs-watching',
        element: (
            <ProtectedRoute providerOnly>
                <WatchingJobs />
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
