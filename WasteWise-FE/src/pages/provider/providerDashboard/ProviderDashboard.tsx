import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import axiosInstance from '../../../services/axiosInstance';
import DashboardHeader from './components/DashboardHeader';
import ActionCards from './components/ActionCards';
import StatsGrid from './components/StatsGrid';
import FleetStatus from './components/FleetStatus';
import ActiveShipments from './components/ActiveShipments';
import LogisticsTools from './components/LogisticsTools';
import { Booking, Vehicle, ProviderInfo } from './types';
import IconLoader from '../../../components/Icon/IconLoader';
import { IRootState } from '../../../store/store';
import { useSelector } from 'react-redux';

interface AuthUser {
    user: {
        id: string;
        email: string;
        user_type: string;
        name?: string;
    };
}

const ProviderDashboard: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuthUser() as AuthUser;
    const userId = auth?.user?.id;
    console.log(auth?.user);
    
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const viewMode = useSelector((state: IRootState) => state.viewMode.isProviderMode);
    const getDashboardPath = () => {
        const userType = auth?.user?.user_type?.toLowerCase();
        if (userType === 'provider' || userType === 'admin' || userType === 'business') {
            if (viewMode) {
                return '/provider/dashboard';
            }
        }
        return '/dashboard';
    };

    useEffect(() => {
        if (userId) {
            navigate(getDashboardPath());
            fetchDashboardData();
        }
    }, [userId, viewMode]);

    const fetchDashboardData = async () => {
        if (!userId) return;
        
        setIsLoading(true);
        setError(null);

        try {
            // Fetch provider details
            const providerResponse = await axiosInstance.get(`/providers/?user_id=${userId}`);
            const provider = providerResponse.data;
            
            setProviderInfo({
                name: auth?.user?.first_name|| 'Provider',
                avatar: provider.user?.profile_picture || '',
                company: provider.company_name || 'Logistics Company',
                verificationBadges: provider.verification_status === 'verified' ? ['Verified'] : [],
                averageRating: provider.average_rating || 0,
            });

            // Fetch drivers
            const driversResponse = await axiosInstance.get('/drivers/', {
                params: { provider: provider.id }
            });
            setDrivers(driversResponse.data || []);

            // Fetch vehicles
            const vehiclesResponse = await axiosInstance.get('/vehicles/', {
                params: { provider: provider.id }
            });
            const vehiclesData = vehiclesResponse.data || [];
            
            // Transform vehicles data to match our interface
            const transformedVehicles: Vehicle[] = vehiclesData.map((vehicle: any) => ({
                id: vehicle.id,
                type: vehicle.vehicle_type?.name || vehicle.make + ' ' + vehicle.model,
                registration: vehicle.registration,
                status: vehicle.is_active ? 'available' : 'maintenance',
                location: 'Depot', // Default location
                capacity: vehicle.capacity || 'N/A',
                driver: vehicle.driver?.name || undefined,
            }));
            setVehicles(transformedVehicles);

            // Fetch recent bookings/jobs
            const bookingsResponse = await axiosInstance.get('/bookings/', {
                params: { provider: provider.id, limit: 10 }
            });
            const bookingsData = bookingsResponse.data || [];
            
            // Transform bookings data to match our interface
            const transformedBookings: Booking[] = bookingsData.map((booking: any) => ({
                id: booking.id,
                status: booking.status,
                date: booking.date,
                time: booking.time,
                pickupLocation: booking.pickup_location || 'N/A',
                dropoffLocation: booking.delivery_location || 'N/A',
                itemType: booking.item_type || 'General',
                itemSize: booking.item_size || 'Medium',
                price: booking.amount || 0,
                customerName: booking.customer?.name || 'Customer',
                customerRating: booking.customer_rating,
                paymentStatus: booking.payment_status || 'pending',
                isHighPriority: booking.is_priority || false,
                distance: booking.distance || 0,
                weight: booking.weight || 'N/A',
                urgency: booking.urgency || 'standard',
            }));
            setBookings(transformedBookings);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!userId) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 min-h-screen transition-colors duration-300">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-400">Please log in to view your dashboard.</p>
                            <button 
                                onClick={() => navigate('/login')} 
                                className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 min-h-screen transition-colors duration-300">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <IconLoader />
                    </div>
                </div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 min-h-screen transition-colors duration-300">
    //             <div className="container mx-auto px-6 py-8">
    //                 <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
    //                     <div className="flex items-center">
    //                         <p>{error}</p>
    //                     </div>
    //                     <div className="mt-4">
    //                         <button 
    //                             onClick={fetchDashboardData}
    //                             className="text-red-700 hover:text-red-900 font-medium"
    //                         >
    //                             Try Again
    //                         </button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 min-h-screen transition-colors duration-300">
            <div className="mx-auto px-6 py-8">
                {/* Dashboard Header */}
                <DashboardHeader providerName={auth?.user?.first_name} />

                {/* Action Cards */}
                <ActionCards />

                {/* Stats Grid */}
                <StatsGrid vehicles={vehicles} bookings={bookings} drivers={drivers} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Section - Active Operations */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Fleet Status */}
                        <FleetStatus vehicles={vehicles} />

                        {/* Active Shipments */}
                        <ActiveShipments bookings={bookings} />
                    </div>

                    {/* Right Section - Logistics Tools */}
                    <LogisticsTools 
                        totalBookings={bookings.length}
                        completedBookings={bookings.filter(b => b.status === 'completed').length}
                        averageRating={providerInfo?.averageRating || 0}
                        totalRevenue={bookings.reduce((sum, booking) => sum + booking.price, 0)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
