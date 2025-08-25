import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';
import { 
    IconUsers, 
    IconTruck, 
    IconPackage, 
    IconCurrencyDollar, 
    IconChartBar, 
    IconAlertTriangle,
    IconCircleCheck,
    IconClock,
    IconTrendingUp,
    IconTrendingDown,
    IconMapPin,
    IconBell,
    IconSettings,
    IconShield,
    IconDatabase,
    IconMessage,
    IconFileText,
    IconCalendar,
    IconGauge,
    IconRecycle,
    IconThermometer,
    IconWifi,
    IconBattery,
    IconActivity
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTruck, faBox, faDollarSign, faCheck, faClock, faExclamationTriangle, faRecycle, faWifi } from '@fortawesome/free-solid-svg-icons';
import ReactApexChart from 'react-apexcharts';
import Ghc from '../../helper/CurrencyFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import StatCard from '../../components/ui/statCard';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../services/fetcher';

import dayjs from 'dayjs';
import IconLoader from '../../components/Icon/IconLoader';

// Types for the enhanced dashboard
interface DashboardMetrics {
    totalCustomers: number;
    totalProviders: number;
    activeJobs: number;
    completedJobs: number;
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    customerSatisfaction: number;
    providerPerformance: number;
    systemHealth: number;
}

interface SmartBinData {
    id: string;
    bin_id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    area: string;
    fill_level: number;
    fill_status: string;
    status: string;
    bin_type: number;
    bin_type_display: string;
    user_id: string | null;
    user_name: string | null;
    sensor_id: string | null;
    battery_level: number | null;
    signal_strength: number | null;
    is_online: boolean;
    last_reading_at: string | null;
}

interface RealtimeActivity {
    id: string;
    type: 'job' | 'payment' | 'support' | 'alert' | 'system';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'resolved' | 'in_progress';
}

interface ComplianceAlert {
    id: string;
    type: 'regulatory' | 'security' | 'environmental' | 'safety';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    createdAt: string;
    status: 'open' | 'investigating' | 'resolved';
}

const EnhancedAdminDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark');
    
    // State for real-time updates
    const [realTimeData, setRealTimeData] = useState<DashboardMetrics | null>(null);
    const [smartBins, setSmartBins] = useState<SmartBinData[]>([]);
    const [activities, setActivities] = useState<RealtimeActivity[]>([]);
    const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

    useEffect(() => {
        dispatch(setPageTitle('Wasgo Admin Dashboard'));
        
        // Simulate real-time data updates
        const interval = setInterval(() => {
            updateRealTimeData();
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [dispatch]);

    // Fetch dashboard data
    const { data: dashboardData, isLoading } = useSwr<DashboardMetrics>('admin/dashboard/metrics', fetcher);
    const { data: binData } = useSwr('waste/bins/', fetcher);
    const { data: usersData } = useSwr('users/', fetcher);
    const { data: providersData } = useSwr('providers/', fetcher);
    const { data: serviceRequestsData } = useSwr('service-requests/', fetcher);
    const { data: sensorsData } = useSwr('waste/sensors/', fetcher);
    const { data: activityData } = useSwr<RealtimeActivity[]>('activities/', fetcher);
    const { data: complianceData } = useSwr<ComplianceAlert[]>('compliance-alerts/', fetcher);

    const updateRealTimeData = () => {
        // Simulate real-time updates
        if (realTimeData) {
            setRealTimeData({
                ...realTimeData,
                activeJobs: realTimeData.activeJobs + Math.floor(Math.random() * 3) - 1,
                totalRevenue: realTimeData.totalRevenue + Math.floor(Math.random() * 100),
            });
        }
    };

    // Chart configurations
    const revenueChartOptions = {
        chart: {
            type: 'area' as const,
            height: 350,
            toolbar: { show: false },
            background: 'transparent',
        },
        colors: ['#10B981'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' as const, width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: { style: { colors: isDark ? '#9CA3AF' : '#6B7280' } },
        },
        yaxis: {
            labels: { 
                style: { colors: isDark ? '#9CA3AF' : '#6B7280' },
                formatter: (value: number) => `${Ghc(value / 1000)}k`,
            },
        },
        grid: { borderColor: isDark ? '#374151' : '#E5E7EB' },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            y: { formatter: (value: number) => `${Ghc(value)}` },
        },
    };

    const jobStatusChartOptions = {
        chart: {
            type: 'donut' as const,
            height: 300,
        },
        colors: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
        labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
        legend: { position: 'bottom' as const },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: { show: true, label: 'Total Jobs' },
                    },
                },
            },
        },
    };





    const data = dashboardData;
    
    // Helper function to extract array data
    const extractArrayData = (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'object' && data !== null) {
            if ('results' in data && Array.isArray(data.results)) return data.results;
            if ('data' in data && Array.isArray(data.data)) return data.data;
        }
        return [];
    };
    
    // Extract data from API responses
    const binDataFinal: SmartBinData[] = extractArrayData(binData);
    const usersDataFinal = extractArrayData(usersData);
    const providersDataFinal = extractArrayData(providersData);
    const serviceRequestsDataFinal = extractArrayData(serviceRequestsData);
    const sensorsDataFinal = extractArrayData(sensorsData);
    
    const activityDataFinal: RealtimeActivity[] = extractArrayData(activityData);
    const complianceDataFinal: ComplianceAlert[] = extractArrayData(complianceData);
    
    // Calculate metrics from real data
    const totalCustomers = usersDataFinal.filter((user: any) => user.user_type === 'customer').length;
    const totalProviders = providersDataFinal.length;
    const totalBins = binDataFinal.length;
    const totalSensors = sensorsDataFinal.length;
    const activeServiceRequests = serviceRequestsDataFinal.filter((request: any) => 
        ['pending', 'assigned', 'en_route', 'arrived', 'in_progress'].includes(request.status)
    ).length;
    const completedServiceRequests = serviceRequestsDataFinal.filter((request: any) => 
        request.status === 'completed'
    ).length;
    const totalRevenue = serviceRequestsDataFinal
        .filter((request: any) => request.status === 'completed' && request.final_price)
        .reduce((sum: number, request: any) => sum + (request.final_price || 0), 0);
    const onlineBins = binDataFinal.filter(bin => bin.is_online).length;
    const highFillBins = binDataFinal.filter(bin => bin.fill_level > 80).length;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };



    // Show loading state if data is still loading
    if (isLoading) {
        return (
            <ErrorBoundary>
                <div className="p-6 space-y-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center gap-4">
<IconLoader />
                            <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Wasgo Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Complete oversight and control over the waste management platform
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                        <IconSettings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                    <Button variant="outline" size="sm">
                        <IconBell className="w-4 h-4 mr-2" />
                        Notifications
                    </Button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={faUsers}
                    title="Total Customers"
                    value={totalCustomers.toLocaleString()}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faTruck}
                    title="Active Providers"
                    value={totalProviders.toLocaleString()}
                    color="purple"
                    delay={0.2}
                />
                <StatCard
                    icon={faBox}
                    title="Active Service Requests"
                    value={activeServiceRequests.toLocaleString()}
                    color="green"
                    delay={0.3}
                />
                <StatCard
                    icon={faDollarSign}
                    title="Total Revenue"
                    value={`${Ghc(totalRevenue.toLocaleString())}`}
                    color="indigo"
                    delay={0.4}
                />
            </div>

            {/* Additional Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={faCheck}
                    title="Completed Requests"
                    value={completedServiceRequests.toLocaleString()}
                    color="green"
                    delay={0.5}
                />
                <StatCard
                    icon={faRecycle}
                    title="Smart Bins"
                    value={totalBins.toLocaleString()}
                    color="green"
                    delay={0.6}
                />
                <StatCard
                    icon={faWifi}
                    title="Sensors"
                    value={totalSensors.toLocaleString()}
                    color="yellow"
                    delay={0.7}
                />
                <StatCard
                    icon={faClock}
                    title="Online Bins"
                    value={`${onlineBins}/${totalBins}`}
                    color="blue"
                    delay={0.8}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReactApexChart
                            options={revenueChartOptions}
                            series={[{ name: 'Revenue', data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000] }]}
                            type="area"
                            height={350}
                        />
                    </CardContent>
                </Card>

                {/* Job Status Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReactApexChart
                            options={jobStatusChartOptions}
                            series={[data?.completedJobs || 0, data?.activeJobs || 0, 12, 3]}
                            type="donut"
                            height={300}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Smart Bin Management */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Smart Bin Management</CardTitle>
                        <div className="flex space-x-2">
                            <Badge variant="outline" className="text-green-500">
                                <IconCircleCheck className="w-3 h-3 mr-1" />
                                {onlineBins} Online
                            </Badge>
                            <Badge variant="outline" className="text-red-500">
                                <IconAlertTriangle className="w-3 h-3 mr-1" />
                                {highFillBins} High Fill Level
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(binDataFinal) && binDataFinal.length > 0 ? binDataFinal.slice(0, 6).map((bin) => (
                            <div key={bin.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{bin.name}</h4>
                                        <p className="text-sm text-gray-600">{bin.area}</p>
                                    </div>
                                    <Badge variant={bin.is_online ? 'default' : 'destructive'}>
                                        {bin.is_online ? 'Online' : 'Offline'}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Fill Level</span>
                                        <span>{bin.fill_level}%</span>
                                    </div>
                                    <Progress value={bin.fill_level} className="h-2" />
                                    
                                    {bin.battery_level !== null && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span>Battery</span>
                                                <span>{bin.battery_level}%</span>
                                            </div>
                                            <Progress value={bin.battery_level} className="h-2" />
                                        </>
                                    )}
                                    
                                    {bin.signal_strength !== null && (
                                        <div className="flex justify-between text-sm">
                                            <span>Signal Strength</span>
                                            <span>{bin.signal_strength}%</span>
                                        </div>
                                    )}
                                </div>
                                
                                {bin.fill_level > 80 && (
                                    <div className="text-sm text-red-600">
                                        <IconAlertTriangle className="inline w-3 h-3 mr-1" />
                                        High fill level alert
                                    </div>
                                )}
                                
                                <div className="text-xs text-gray-500">
                                    {bin.last_reading_at ? `Last updated: ${bin.last_reading_at}` : 'No recent readings'}
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-8">
                                <IconRecycle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">No smart bins data available</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Real-time Activity and Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real-time Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Real-time Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activityDataFinal.length > 0 ? activityDataFinal.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(activity.priority)}`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.message}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                                            <Badge variant="outline" size="sm">
                                                {activity.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <IconActivity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">No activity data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance & Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.isArray(complianceDataFinal) && complianceDataFinal.length > 0 ? complianceDataFinal.map((alert) => (
                                <div key={alert.id} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-sm">{alert.title}</h4>
                                            <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                                        </div>
                                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'}>
                                            {alert.severity}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">{alert.createdAt}</span>
                                        <Badge variant="outline" size="sm">
                                            {alert.status}
                                        </Badge>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <IconShield className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">No compliance alerts available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <Link to="/admin/users">
                            <Button variant="outline" className="w-full h-20 flex flex-col">
                                <IconUsers className="w-6 h-6 mb-2" />
                                <span className="text-xs">User Management</span>
                            </Button>
                        </Link>
                        <Link to="/admin/providers">
                            <Button variant="outline" className="w-full h-20 flex flex-col">
                                <IconTruck className="w-6 h-6 mb-2" />
                                <span className="text-xs">Provider Management</span>
                            </Button>
                        </Link>
                        <Link to="/admin/service-requests">
                            <Button variant="outline" className="w-full h-20 flex flex-col">
                                <IconPackage className="w-6 h-6 mb-2" />
                                <span className="text-xs">Service Requests</span>
                            </Button>
                        </Link>
                        <Link to="/admin/revenue">
                            <Button variant="outline" className="w-full h-20 flex flex-col">
                                <IconCurrencyDollar className="w-6 h-6 mb-2" />
                                <span className="text-xs">Financial Management</span>
                            </Button>
                        </Link>
                        <Link to="/admin/support">
                            <Button variant="outline" className="w-full h-20 flex flex-col">
                                <IconMessage className="w-6 h-6 mb-2" />
                                <span className="text-xs">Support Tickets</span>
                            </Button>
                        </Link>
                        <Link to="/admin/analytics">
                            <Button variant="outline" className="w-full h-20 flex flex-col">
                                <IconChartBar className="w-6 h-6 mb-2" />
                                <span className="text-xs">Analytics</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
        </ErrorBoundary>
    );
};

export default EnhancedAdminDashboard;


