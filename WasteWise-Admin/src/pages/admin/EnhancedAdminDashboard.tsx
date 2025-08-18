import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../services/fetcher';
import dayjs from 'dayjs';

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
    location: string;
    fillLevel: number;
    temperature: number;
    batteryLevel: number;
    lastUpdated: string;
    status: 'online' | 'offline' | 'maintenance';
    alerts: string[];
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
    const { data: binData } = useSwr<SmartBinData[]>('admin/smart-bins', fetcher);
    const { data: activityData } = useSwr<RealtimeActivity[]>('admin/activities', fetcher);
    const { data: complianceData } = useSwr<ComplianceAlert[]>('admin/compliance-alerts', fetcher);

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
                formatter: (value: number) => `$${(value / 1000).toFixed(1)}k`,
            },
        },
        grid: { borderColor: isDark ? '#374151' : '#E5E7EB' },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            y: { formatter: (value: number) => `$${value.toLocaleString()}` },
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

    const smartBinChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 250,
            toolbar: { show: false },
        },
        colors: ['#3B82F6'],
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                dataLabels: { position: 'top' },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (value: number) => `${value}%`,
            style: { fontSize: '12px', colors: ['#fff'] },
        },
        xaxis: {
            categories: smartBins.slice(0, 10).map(bin => bin.location),
            labels: { style: { colors: isDark ? '#9CA3AF' : '#6B7280' } },
        },
        yaxis: {
            labels: { style: { colors: isDark ? '#9CA3AF' : '#6B7280' } },
        },
        grid: { borderColor: isDark ? '#374151' : '#E5E7EB' },
    };

    // Mock data for demonstration
    const mockData: DashboardMetrics = {
        totalCustomers: 1247,
        totalProviders: 89,
        activeJobs: 23,
        completedJobs: 156,
        totalRevenue: 124750,
        monthlyRevenue: 45600,
        revenueGrowth: 12.5,
        customerSatisfaction: 94.2,
        providerPerformance: 87.8,
        systemHealth: 99.1,
    };

    const mockSmartBins: SmartBinData[] = [
        {
            id: '1',
            location: 'Downtown Mall',
            fillLevel: 85,
            temperature: 22,
            batteryLevel: 78,
            lastUpdated: '2 min ago',
            status: 'online',
            alerts: ['High fill level'],
        },
        {
            id: '2',
            location: 'Central Park',
            fillLevel: 45,
            temperature: 24,
            batteryLevel: 92,
            lastUpdated: '1 min ago',
            status: 'online',
            alerts: [],
        },
        {
            id: '3',
            location: 'Business District',
            fillLevel: 95,
            temperature: 21,
            batteryLevel: 65,
            lastUpdated: '5 min ago',
            status: 'maintenance',
            alerts: ['Critical fill level', 'Low battery'],
        },
    ];

    const mockActivities: RealtimeActivity[] = [
        {
            id: '1',
            type: 'job',
            message: 'New job assigned to Provider ABC',
            timestamp: '2 min ago',
            priority: 'medium',
            status: 'pending',
        },
        {
            id: '2',
            type: 'payment',
            message: 'Payment completed for Job #1234',
            timestamp: '5 min ago',
            priority: 'low',
            status: 'resolved',
        },
        {
            id: '3',
            type: 'alert',
            message: 'Smart bin at Downtown Mall needs attention',
            timestamp: '8 min ago',
            priority: 'high',
            status: 'in_progress',
        },
    ];

    const mockComplianceAlerts: ComplianceAlert[] = [
        {
            id: '1',
            type: 'environmental',
            title: 'Waste Disposal Compliance Check Due',
            description: 'Monthly environmental compliance report is due in 3 days',
            severity: 'medium',
            createdAt: '1 hour ago',
            status: 'open',
        },
        {
            id: '2',
            type: 'security',
            title: 'Unusual Login Activity Detected',
            description: 'Multiple failed login attempts from unknown IP',
            severity: 'high',
            createdAt: '2 hours ago',
            status: 'investigating',
        },
    ];

    const data = dashboardData || mockData;
    const binDataFinal = binData || mockSmartBins;
    const activityDataFinal = activityData || mockActivities;
    const complianceDataFinal = complianceData || mockComplianceAlerts;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'text-green-500';
            case 'offline': return 'text-red-500';
            case 'maintenance': return 'text-yellow-500';
            default: return 'text-gray-500';
        }
    };

    return (
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <IconUsers className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalCustomers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <IconTrendingUp className="inline w-3 h-3 text-green-500 mr-1" />
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
                        <IconTruck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalProviders}</div>
                        <p className="text-xs text-muted-foreground">
                            <IconTrendingUp className="inline w-3 h-3 text-green-500 mr-1" />
                            +5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <IconPackage className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.activeJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            <IconClock className="inline w-3 h-3 text-blue-500 mr-1" />
                            In progress
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <IconTrendingUp className="inline w-3 h-3 text-green-500 mr-1" />
                            +{data.revenueGrowth}% from last month
                        </p>
                    </CardContent>
                </Card>
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
                            series={[data.completedJobs, data.activeJobs, 12, 3]}
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
                                {binDataFinal.filter(bin => bin.status === 'online').length} Online
                            </Badge>
                            <Badge variant="outline" className="text-red-500">
                                <IconAlertTriangle className="w-3 h-3 mr-1" />
                                {binDataFinal.filter(bin => bin.alerts.length > 0).length} Alerts
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {binDataFinal.map((bin) => (
                            <div key={bin.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{bin.location}</h4>
                                        <p className={`text-sm ${getStatusColor(bin.status)}`}>
                                            {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                                        </p>
                                    </div>
                                    <Badge variant={bin.status === 'online' ? 'default' : 'destructive'}>
                                        {bin.status}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Fill Level</span>
                                        <span>{bin.fillLevel}%</span>
                                    </div>
                                    <Progress value={bin.fillLevel} className="h-2" />
                                    
                                    <div className="flex justify-between text-sm">
                                        <span>Battery</span>
                                        <span>{bin.batteryLevel}%</span>
                                    </div>
                                    <Progress value={bin.batteryLevel} className="h-2" />
                                    
                                    <div className="flex justify-between text-sm">
                                        <span>Temperature</span>
                                        <span>{bin.temperature}°C</span>
                                    </div>
                                </div>
                                
                                {bin.alerts.length > 0 && (
                                    <div className="text-sm text-red-600">
                                        <IconAlertTriangle className="inline w-3 h-3 mr-1" />
                                        {bin.alerts.join(', ')}
                                    </div>
                                )}
                                
                                <div className="text-xs text-gray-500">
                                    Last updated: {bin.lastUpdated}
                                </div>
                            </div>
                        ))}
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
                            {activityDataFinal.map((activity) => (
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
                            ))}
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
                            {complianceDataFinal.map((alert) => (
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
                            ))}
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
                        <Link to="/admin/jobs">
                            <Button variant="outline" className="w-full h-20 flex flex-col">
                                <IconPackage className="w-6 h-6 mb-2" />
                                <span className="text-xs">Job Management</span>
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
    );
};

export default EnhancedAdminDashboard;


