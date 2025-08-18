import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconChartBar, 
    IconTrendingUp, 
    IconTrendingDown, 
    IconUsers, 
    IconTruck, 
    IconPackage, 
    IconCurrencyDollar,
    IconCalendar,
    IconFilter,
    IconDownload,
    IconRefresh,
    IconEye,
    IconSettings,
    IconActivity,
    IconMapPin,
    IconClock,
    IconStar,
    IconAlertTriangle,
    IconRecycle,
    IconGauge,
    IconTarget,
    IconBrain,
    IconChartLine,
    IconChartPie,
    IconChartArea
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { setPageTitle } from '../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../services/fetcher';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import { CheckCircle } from 'lucide-react';

interface AnalyticsData {
    revenue: RevenueData;
    users: UserData;
    jobs: JobData;
    performance: PerformanceData;
    environmental: EnvironmentalData;
    predictions: PredictionData;
}

interface RevenueData {
    total: number;
    monthly: number;
    growth: number;
    byService: { service: string; amount: number }[];
    byRegion: { region: string; amount: number }[];
    trends: { date: string; amount: number }[];
}

interface UserData {
    totalCustomers: number;
    totalProviders: number;
    newCustomers: number;
    newProviders: number;
    retentionRate: number;
    satisfactionScore: number;
    growth: { date: string; customers: number; providers: number }[];
}

interface JobData {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    averageCompletionTime: number;
    byType: { type: string; count: number }[];
    byStatus: { status: string; count: number }[];
    trends: { date: string; completed: number; pending: number }[];
}

interface PerformanceData {
    customerSatisfaction: number;
    providerPerformance: number;
    systemUptime: number;
    responseTime: number;
    completionRate: number;
    trends: { date: string; satisfaction: number; performance: number }[];
}

interface EnvironmentalData {
    totalWasteCollected: number;
    recycledPercentage: number;
    carbonFootprintReduction: number;
    binsOptimized: number;
    routesOptimized: number;
    impact: { date: string; waste: number; recycled: number }[];
}

interface PredictionData {
    revenueForecast: { date: string; predicted: number; actual?: number }[];
    demandForecast: { date: string; predicted: number; actual?: number }[];
    capacityPlanning: { date: string; required: number; current: number }[];
    riskAssessment: { risk: string; probability: number; impact: number }[];
}

const AnalyticsReporting: React.FC = () => {
    const dispatch = useDispatch();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
    const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'predictions'>('overview');

    useEffect(() => {
        dispatch(setPageTitle('Analytics & Reporting'));
    }, [dispatch]);

    // Fetch analytics data
    const { data: analyticsData, isLoading, mutate } = useSwr<AnalyticsData>(`admin/analytics?range=${timeRange}`, fetcher);

    // Mock data for demonstration
    const mockData: AnalyticsData = {
        revenue: {
            total: 1247500,
            monthly: 456000,
            growth: 12.5,
            byService: [
                { service: 'General Waste', amount: 450000 },
                { service: 'Recyclable', amount: 320000 },
                { service: 'Organic', amount: 280000 },
                { service: 'Hazardous', amount: 197500 },
            ],
            byRegion: [
                { region: 'Downtown', amount: 380000 },
                { region: 'Suburbs', amount: 320000 },
                { region: 'Industrial', amount: 280000 },
                { region: 'Residential', amount: 267500 },
            ],
            trends: Array.from({ length: 30 }, (_, i) => ({
                date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                amount: 15000 + Math.random() * 5000,
            })),
        },
        users: {
            totalCustomers: 1247,
            totalProviders: 89,
            newCustomers: 45,
            newProviders: 3,
            retentionRate: 94.2,
            satisfactionScore: 4.6,
            growth: Array.from({ length: 30 }, (_, i) => ({
                date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                customers: 1200 + i * 2,
                providers: 85 + Math.floor(i / 10),
            })),
        },
        jobs: {
            total: 2340,
            completed: 2156,
            pending: 134,
            cancelled: 50,
            averageCompletionTime: 2.4,
            byType: [
                { type: 'Residential', count: 1200 },
                { type: 'Commercial', count: 680 },
                { type: 'Industrial', count: 320 },
                { type: 'Emergency', count: 140 },
            ],
            byStatus: [
                { status: 'Completed', count: 2156 },
                { status: 'In Progress', count: 134 },
                { status: 'Pending', count: 45 },
                { status: 'Cancelled', count: 5 },
            ],
            trends: Array.from({ length: 30 }, (_, i) => ({
                date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                completed: 70 + Math.random() * 20,
                pending: 5 + Math.random() * 10,
            })),
        },
        performance: {
            customerSatisfaction: 94.2,
            providerPerformance: 87.8,
            systemUptime: 99.1,
            responseTime: 1.2,
            completionRate: 92.1,
            trends: Array.from({ length: 30 }, (_, i) => ({
                date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                satisfaction: 92 + Math.random() * 6,
                performance: 85 + Math.random() * 8,
            })),
        },
        environmental: {
            totalWasteCollected: 1250,
            recycledPercentage: 68.5,
            carbonFootprintReduction: 45.2,
            binsOptimized: 156,
            routesOptimized: 23,
            impact: Array.from({ length: 30 }, (_, i) => ({
                date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                waste: 40 + Math.random() * 10,
                recycled: 25 + Math.random() * 8,
            })),
        },
        predictions: {
            revenueForecast: Array.from({ length: 90 }, (_, i) => ({
                date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
                predicted: 15000 + Math.random() * 3000 + i * 50,
            })),
            demandForecast: Array.from({ length: 90 }, (_, i) => ({
                date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
                predicted: 80 + Math.random() * 20 + i * 0.5,
            })),
            capacityPlanning: Array.from({ length: 90 }, (_, i) => ({
                date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
                required: 100 + i * 0.8,
                current: 95 + i * 0.6,
            })),
            riskAssessment: [
                { risk: 'Provider Shortage', probability: 0.15, impact: 0.8 },
                { risk: 'System Downtime', probability: 0.05, impact: 0.9 },
                { risk: 'Regulatory Changes', probability: 0.25, impact: 0.6 },
                { risk: 'Competition', probability: 0.35, impact: 0.4 },
            ],
        },
    };

    const data = analyticsData || mockData;

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
            type: 'datetime',
            categories: data.revenue.trends.map(item => item.date),
        },
        yaxis: {
            labels: { formatter: (value: number) => `$${(value / 1000).toFixed(1)}k` },
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' },
            y: { formatter: (value: number) => `$${value.toLocaleString()}` },
        },
    };

    const userGrowthChartOptions = {
        chart: {
            type: 'line' as const,
            height: 350,
            toolbar: { show: false },
        },
        colors: ['#3B82F6', '#EF4444'],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            type: 'datetime',
            categories: data.users.growth.map(item => item.date),
        },
        yaxis: {
            labels: { formatter: (value: number) => value.toLocaleString() },
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' },
        },
        legend: { position: 'top' as const },
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

    const performanceChartOptions = {
        chart: {
            type: 'line' as const,
            height: 350,
            toolbar: { show: false },
        },
        colors: ['#8B5CF6', '#F59E0B'],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            type: 'datetime',
            categories: data.performance.trends.map(item => item.date),
        },
        yaxis: {
            labels: { formatter: (value: number) => `${value}%` },
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' },
            y: { formatter: (value: number) => `${value}%` },
        },
        legend: { position: 'top' as const },
    };

    const environmentalChartOptions = {
        chart: {
            type: 'area' as const,
            height: 350,
            toolbar: { show: false },
        },
        colors: ['#059669', '#3B82F6'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
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
            type: 'datetime',
            categories: data.environmental.impact.map(item => item.date),
        },
        yaxis: {
            labels: { formatter: (value: number) => `${value} tons` },
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' },
            y: { formatter: (value: number) => `${value} tons` },
        },
        legend: { position: 'top' as const },
    };

    const predictionChartOptions = {
        chart: {
            type: 'line' as const,
            height: 350,
            toolbar: { show: false },
        },
        colors: ['#10B981', '#EF4444'],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            type: 'datetime',
            categories: data.predictions.revenueForecast.map(item => item.date),
        },
        yaxis: {
            labels: { formatter: (value: number) => `$${(value / 1000).toFixed(1)}k` },
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' },
            y: { formatter: (value: number) => `$${value.toLocaleString()}` },
        },
        legend: { position: 'top' as const },
    };

    const handleExport = (type: string) => {
        // Export functionality
        const csvContent = "data:text/csv;charset=utf-8," + 
            `Type,Value,Date\n` +
            `${type},${data.revenue.total},${new Date().toISOString()}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${type}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? 'text-green-500' : 'text-red-500';
    };

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? <IconTrendingUp className="w-4 h-4" /> : <IconTrendingDown className="w-4 h-4" />;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Analytics & Reporting
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Business intelligence and performance insights
                    </p>
                </div>
                <div className="flex space-x-3">
                    <select
                        className="px-3 py-2 border rounded-md text-sm"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                    <Button variant="outline" onClick={() => mutate()}>
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={() => handleExport('analytics')}>
                        <IconDownload className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-center">
                <div className="flex border rounded-md">
                    <button
                        className={`px-4 py-2 text-sm ${viewMode === 'overview' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        onClick={() => setViewMode('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`px-4 py-2 text-sm ${viewMode === 'detailed' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        onClick={() => setViewMode('detailed')}
                    >
                        Detailed Analysis
                    </button>
                    <button
                        className={`px-4 py-2 text-sm ${viewMode === 'predictions' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        onClick={() => setViewMode('predictions')}
                    >
                        Predictions & AI
                    </button>
                </div>
            </div>

            {viewMode === 'overview' && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${(data.revenue.total / 1000000).toFixed(1)}M</div>
                                <div className={`flex items-center text-xs ${getGrowthColor(data.revenue.growth)}`}>
                                    {getGrowthIcon(data.revenue.growth)}
                                    <span className="ml-1">+{data.revenue.growth}% from last month</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <IconUsers className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.users.totalCustomers.toLocaleString()}</div>
                                <div className="flex items-center text-xs text-green-500">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    <span>+{data.users.newCustomers} new this month</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Job Completion Rate</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.performance.completionRate}%</div>
                                <div className="flex items-center text-xs text-green-500">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    <span>+2.1% from last month</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                                <IconStar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.performance.customerSatisfaction}%</div>
                                <div className="flex items-center text-xs text-green-500">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    <span>+1.2% from last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactApexChart
                                    options={revenueChartOptions}
                                    series={[{ name: 'Revenue', data: data.revenue.trends.map(item => item.amount) }]}
                                    type="area"
                                    height={350}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>User Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactApexChart
                                    options={userGrowthChartOptions}
                                    series={[
                                        { name: 'Customers', data: data.users.growth.map(item => item.customers) },
                                        { name: 'Providers', data: data.users.growth.map(item => item.providers) }
                                    ]}
                                    type="line"
                                    height={350}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactApexChart
                                    options={jobStatusChartOptions}
                                    series={[
                                        data.jobs.completed,
                                        data.jobs.pending,
                                        data.jobs.pending,
                                        data.jobs.cancelled
                                    ]}
                                    type="donut"
                                    height={300}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactApexChart
                                    options={performanceChartOptions}
                                    series={[
                                        { name: 'Customer Satisfaction', data: data.performance.trends.map(item => item.satisfaction) },
                                        { name: 'Provider Performance', data: data.performance.trends.map(item => item.performance) }
                                    ]}
                                    type="line"
                                    height={350}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {viewMode === 'detailed' && (
                <>
                    {/* Detailed Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue by Service Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.revenue.byService.map((service, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm">{service.service}</span>
                                            <span className="font-medium">${(service.amount / 1000).toFixed(1)}k</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue by Region</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.revenue.byRegion.map((region, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm">{region.region}</span>
                                            <span className="font-medium">${(region.amount / 1000).toFixed(1)}k</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Job Distribution by Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.jobs.byType.map((jobType, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm">{jobType.type}</span>
                                            <span className="font-medium">{jobType.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Environmental Impact */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Environmental Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{data.environmental.totalWasteCollected} tons</div>
                                    <div className="text-sm text-gray-600">Total Waste Collected</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{data.environmental.recycledPercentage}%</div>
                                    <div className="text-sm text-gray-600">Recycled</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{data.environmental.carbonFootprintReduction}%</div>
                                    <div className="text-sm text-gray-600">Carbon Footprint Reduction</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{data.environmental.binsOptimized}</div>
                                    <div className="text-sm text-gray-600">Bins Optimized</div>
                                </div>
                            </div>
                            <ReactApexChart
                                options={environmentalChartOptions}
                                series={[
                                    { name: 'Total Waste', data: data.environmental.impact.map(item => item.waste) },
                                    { name: 'Recycled', data: data.environmental.impact.map(item => item.recycled) }
                                ]}
                                type="area"
                                height={350}
                            />
                        </CardContent>
                    </Card>
                </>
            )}

            {viewMode === 'predictions' && (
                <>
                    {/* AI Predictions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Forecast (90 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactApexChart
                                    options={predictionChartOptions}
                                    series={[
                                        { name: 'Predicted Revenue', data: data.predictions.revenueForecast.map(item => item.predicted) }
                                    ]}
                                    type="line"
                                    height={350}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Capacity Planning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Current Capacity</span>
                                        <span className="font-medium">{data.predictions.capacityPlanning[0].current}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Required Capacity (90 days)</span>
                                        <span className="font-medium">{data.predictions.capacityPlanning[89].required}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Capacity Gap</span>
                                        <span className="font-medium text-red-600">
                                            {data.predictions.capacityPlanning[89].required - data.predictions.capacityPlanning[89].current}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Risk Assessment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.predictions.riskAssessment.map((risk, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <div className="font-medium">{risk.risk}</div>
                                            <div className="text-sm text-gray-600">
                                                Probability: {(risk.probability * 100).toFixed(1)}% | Impact: {(risk.impact * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <Badge variant={risk.probability * risk.impact > 0.3 ? 'destructive' : 'outline'}>
                                            {(risk.probability * risk.impact * 100).toFixed(1)}% Risk
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default AnalyticsReporting;


