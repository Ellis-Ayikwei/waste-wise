import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconMapPin, 
    IconThermometer, 
    IconBattery, 
    IconWifi, 
    IconAlertTriangle,
    IconClock,
    IconSettings,
    IconPlus,
    IconFilter,
    IconDownload,
    IconRefresh,
    IconEye,
    IconEdit,
    IconTrash,
    IconRecycle,
    IconGauge,
    IconActivity,
    IconCalendar,
    IconRoute
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faCheckCircle, faExclamationTriangle, faGauge } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Progress } from '../../../components/ui/Progress';
import StatCard from '../../../components/ui/statCard';
import { setPageTitle } from '../../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../../services/fetcher';
import ReactApexChart from 'react-apexcharts';
import { CheckCircle } from 'lucide-react';

interface SmartBin {
    id: string;
    name: string;
    location: string;
    coordinates: { lat: number; lng: number };
    fillLevel: number;
    temperature: number;
    batteryLevel: number;
    signalStrength: number;
    lastUpdated: string;
    status: 'online' | 'offline' | 'maintenance' | 'error';
    alerts: Alert[];
    maintenanceHistory: MaintenanceRecord[];
    deploymentDate: string;
    capacity: number;
    currentWeight: number;
    binType: 'general' | 'recyclable' | 'organic' | 'hazardous';
    routeId?: string;
}

interface Alert {
    id: string;
    type: 'high_fill' | 'low_battery' | 'temperature' | 'signal' | 'maintenance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    resolved: boolean;
}

interface MaintenanceRecord {
    id: string;
    type: 'scheduled' | 'emergency' | 'preventive';
    description: string;
    date: string;
    technician: string;
    cost: number;
    status: 'completed' | 'in_progress' | 'scheduled';
}

interface RouteOptimization {
    routeId: string;
    bins: string[];
    estimatedTime: number;
    distance: number;
    efficiency: number;
    lastOptimized: string;
}

const SmartBinManagement: React.FC = () => {
    const dispatch = useDispatch();
    const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

    useEffect(() => {
        dispatch(setPageTitle('Smart Bin Management'));
    }, [dispatch]);

    // Fetch data
    const { data: binsData, isLoading, mutate } = useSwr<SmartBin[]>('waste/bins/', fetcher);
    const { data: routesData } = useSwr<RouteOptimization[]>('admin/bin-routes', fetcher);

    // Mock data for demonstration

    const bins = binsData ;
    const routes = routesData;

    // Filter bins based on search and filters
    const filteredBins = Array.isArray(bins) ? bins.filter(bin => {
        const matchesSearch = bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            bin.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || bin.status === filterStatus;
        const matchesType = filterType === 'all' || bin.binType === filterType;
        
        return matchesSearch && matchesStatus && matchesType;
    }) : [];

    // Statistics
    const stats = {
        totalBins: bins?.length || 0,
        onlineBins: bins?.filter(bin => bin?.status === 'online').length || 0,
        offlineBins: bins?.filter(bin => bin?.status === 'offline').length || 0,
        maintenanceBins: bins?.filter(bin => bin?.status === 'maintenance').length || 0,
        criticalAlerts: bins?.reduce((count, bin) => 
            count + (bin?.alerts?.filter(alert => alert.severity === 'critical' && !alert.resolved).length || 0), 0
        ) || 0,
        averageFillLevel: bins?.reduce((sum, bin) => sum + (bin?.fillLevel || 0), 0) / (bins?.length || 1) || 0,
        averageBatteryLevel: bins?.reduce((sum, bin) => sum + (bin?.batteryLevel || 0), 0) / (bins?.length || 1) || 0,
    };

    // Chart options
    const fillLevelChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 300,
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
            categories: filteredBins.slice(0, 10).map(bin => bin.name),
            labels: { style: { colors: '#6B7280' } },
        },
        yaxis: {
            labels: { style: { colors: '#6B7280' } },
        },
        grid: { borderColor: '#E5E7EB' },
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'text-green-500';
            case 'offline': return 'text-red-500';
            case 'maintenance': return 'text-yellow-500';
            case 'error': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const getAlertColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const handleRefresh = () => {
        mutate();
    };

    const handleExport = () => {
        // Export functionality
        const csvContent = "data:text/csv;charset=utf-8," + 
            "ID,Name,Location,Fill Level,Battery,Status,Last Updated\n" +
            filteredBins?.map(bin => 
                `${bin.id},${bin.name},${bin.location},${bin.fillLevel}%,${bin.batteryLevel}%,${bin.status},${bin.lastUpdated}`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "smart_bins_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Smart Bins
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor and manage IoT-enabled waste bins across the city
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleRefresh}>
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <IconDownload className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button>
                        <IconPlus className="w-4 h-4 mr-2" />
                        Add New Bin
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={faRecycle}
                    title="Total Bins"
                    value={stats.totalBins.toString()}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faCheckCircle}
                    title="Online Bins"
                    value={stats.onlineBins.toString()}
                    color="green"
                    delay={0.2}
                />
                <StatCard
                    icon={faExclamationTriangle}
                    title="Critical Alerts"
                    value={stats.criticalAlerts.toString()}
                    color="red"
                    delay={0.3}
                />
                <StatCard
                    icon={faGauge}
                    title="Avg Fill Level"
                    value={`${stats.averageFillLevel.toFixed(1)}%`}
                    color="yellow"
                    delay={0.4}
                />
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <CardTitle>Smart Bins Overview</CardTitle>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <input
                                type="text"
                                placeholder="Search bins..."
                                className="px-3 py-2 border rounded-md text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="px-3 py-2 border rounded-md text-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="error">Error</option>
                            </select>
                            <select
                                className="px-3 py-2 border rounded-md text-sm"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="general">General</option>
                                <option value="recyclable">Recyclable</option>
                                <option value="organic">Organic</option>
                                <option value="hazardous">Hazardous</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* View Mode Toggle */}
                    <div className="flex justify-end mb-4">
                        <div className="flex border rounded-md">
                            <button
                                className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                Grid
                            </button>
                            <button
                                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                onClick={() => setViewMode('list')}
                            >
                                List
                            </button>
                            <button
                                className={`px-3 py-1 text-sm ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                onClick={() => setViewMode('map')}
                            >
                                Map
                            </button>
                        </div>
                    </div>

                    {/* Bins Grid */}
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBins?.map((bin) => (
                                <div key={bin.id} className="border rounded-lg p-4 space-y-4 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{bin.name}</h4>
                                            <p className="text-sm text-gray-600">{bin.location}</p>
                                        </div>
                                        <Badge variant={bin.status === 'online' ? 'default' : 'destructive'}>
                                            {bin.status}
                                        </Badge>
                                    </div>

                                    {/* Metrics */}
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Fill Level</span>
                                                <span>{bin.fillLevel}%</span>
                                            </div>
                                            <Progress value={bin.fillLevel} className="h-2" />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Battery</span>
                                                <span>{bin.batteryLevel}%</span>
                                            </div>
                                            <Progress value={bin.batteryLevel} className="h-2" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center">
                                                <IconThermometer className="w-4 h-4 mr-2 text-gray-500" />
                                                <span>{bin.temperature}°C</span>
                                            </div>
                                            <div className="flex items-center">
                                                <IconWifi className="w-4 h-4 mr-2 text-gray-500" />
                                                <span>{bin.signalStrength}%</span>
                                            </div>
                                        </div>
                                    </div>

                                                                         {/* Alerts */}
                                     {bin.alerts?.filter(alert => !alert.resolved).length > 0 && (
                                         <div className="space-y-2">
                                             {bin.alerts?.filter(alert => !alert.resolved).map((alert) => (
                                                <div key={alert.id} className="flex items-center text-sm">
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${getAlertColor(alert.severity)}`} />
                                                    <span className="text-red-600">{alert.message}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="text-xs text-gray-500">
                                            Last updated: {bin.lastUpdated}
                                        </span>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                <IconEye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <IconEdit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                                         {/* Bins List */}
                     {viewMode === 'list' && (
                         <div className="space-y-4">
                             {filteredBins?.map((bin) => (
                                <div key={bin.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h4 className="font-medium">{bin.name}</h4>
                                                <p className="text-sm text-gray-600">{bin.location}</p>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span>Fill: {bin.fillLevel}%</span>
                                                <span>Battery: {bin.batteryLevel}%</span>
                                                <span>Temp: {bin.temperature}°C</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={bin.status === 'online' ? 'default' : 'destructive'}>
                                                {bin.status}
                                            </Badge>
                                            <Button variant="outline" size="sm">
                                                <IconEye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <IconEdit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Map View Placeholder */}
                    {viewMode === 'map' && (
                        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <IconMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Map view coming soon</p>
                                <p className="text-sm text-gray-500">Interactive map showing bin locations</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Fill Level Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                                                 <ReactApexChart
                             options={fillLevelChartOptions}
                             series={[{ name: 'Fill Level', data: filteredBins?.slice(0, 10).map(bin => bin.fillLevel) || [] }]}
                             type="bar"
                             height={300}
                         />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Route Optimization</CardTitle>
                    </CardHeader>
                                         <CardContent>
                         <div className="space-y-4">
                                                          {Array.isArray(routes) ? routes.map((route) => (
                                 <div key={route.routeId} className="border rounded-lg p-4">
                                     <div className="flex justify-between items-center mb-2">
                                         <h4 className="font-medium">Route {route.routeId}</h4>
                                         <Badge variant="outline">
                                             {route.efficiency}% efficient
                                         </Badge>
                                     </div>
                                     <div className="grid grid-cols-2 gap-4 text-sm">
                                         <div>
                                             <span className="text-gray-600">Bins:</span>
                                             <span className="ml-2">{route.bins.length}</span>
                                         </div>
                                         <div>
                                             <span className="text-gray-600">Distance:</span>
                                             <span className="ml-2">{route.distance} km</span>
                                         </div>
                                         <div>
                                             <span className="text-gray-600">Time:</span>
                                             <span className="ml-2">{route.estimatedTime} min</span>
                                         </div>
                                         <div>
                                             <span className="text-gray-600">Last optimized:</span>
                                             <span className="ml-2">{route.lastOptimized}</span>
                                         </div>
                                     </div>
                                 </div>
                             )) : (
                                 <div className="text-center py-8">
                                     <p className="text-gray-500">No route data available</p>
                                 </div>
                             )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SmartBinManagement;


