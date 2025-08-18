import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconShield, 
    IconAlertTriangle, 
    IconCheckCircle, 
    IconClock, 
    IconFileText, 
    IconDownload,
    IconRefresh,
    IconEye,
    IconEdit,
    IconSettings,
    IconLock,
    IconUserCheck,
    IconDatabase,
    IconActivity,
    IconMapPin,
    IconCalendar,
    IconFilter,
    IconSearch,
    IconPlus,
    IconTrash,
    IconRecycle,
    IconGauge,
    IconTarget,
    IconBrain,
    IconChartLine,
    IconChartPie,
    IconChartArea,
    IconShieldCheck,
    IconShieldX,
    IconShieldLock,
    IconCertificate,
    IconClipboardCheck,
    IconClipboardList,
    IconAlertCircle,
    IconInfoCircle
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { setPageTitle } from '../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../services/fetcher';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';

interface ComplianceData {
    regulatory: RegulatoryCompliance;
    security: SecurityData;
    audit: AuditData;
    environmental: EnvironmentalCompliance;
    certifications: CertificationData;
}

interface RegulatoryCompliance {
    overallScore: number;
    pendingRequirements: number;
    overdueRequirements: number;
    completedRequirements: number;
    requirements: ComplianceRequirement[];
    trends: { date: string; score: number }[];
}

interface ComplianceRequirement {
    id: string;
    title: string;
    description: string;
    category: 'environmental' | 'safety' | 'operational' | 'financial' | 'data_protection';
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string;
    lastUpdated: string;
}

interface SecurityData {
    overallScore: number;
    activeThreats: number;
    resolvedThreats: number;
    securityIncidents: SecurityIncident[];
    accessLogs: AccessLog[];
    vulnerabilities: Vulnerability[];
    trends: { date: string; incidents: number; threats: number }[];
}

interface SecurityIncident {
    id: string;
    type: 'unauthorized_access' | 'data_breach' | 'malware' | 'phishing' | 'ddos';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    detectedAt: string;
    status: 'investigating' | 'contained' | 'resolved' | 'closed';
    affectedSystems: string[];
    assignedTo: string;
    resolutionTime?: string;
}

interface AccessLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    resource: string;
    ipAddress: string;
    timestamp: string;
    status: 'success' | 'failed' | 'blocked';
    location: string;
}

interface Vulnerability {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    cvssScore: number;
    affectedSystems: string[];
    discoveredAt: string;
    status: 'open' | 'in_progress' | 'patched' | 'closed';
    assignedTo: string;
}

interface AuditData {
    totalAudits: number;
    completedAudits: number;
    pendingAudits: number;
    failedAudits: number;
    auditLogs: AuditLog[];
    complianceReports: ComplianceReport[];
}

interface AuditLog {
    id: string;
    action: string;
    userId: string;
    userName: string;
    resource: string;
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    outcome: 'success' | 'failure' | 'warning';
}

interface ComplianceReport {
    id: string;
    title: string;
    type: 'monthly' | 'quarterly' | 'annual' | 'incident';
    generatedAt: string;
    status: 'draft' | 'review' | 'approved' | 'submitted';
    generatedBy: string;
    findings: string[];
    recommendations: string[];
}

interface EnvironmentalCompliance {
    wasteDisposalCompliance: number;
    recyclingTargets: number;
    carbonFootprintReduction: number;
    environmentalIncidents: EnvironmentalIncident[];
    permits: EnvironmentalPermit[];
}

interface EnvironmentalIncident {
    id: string;
    type: 'spill' | 'emission' | 'waste_misclassification' | 'permit_violation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location: string;
    reportedAt: string;
    status: 'reported' | 'investigating' | 'resolved' | 'closed';
    environmentalImpact: string;
    correctiveActions: string[];
}

interface EnvironmentalPermit {
    id: string;
    type: string;
    number: string;
    issuedDate: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'pending_renewal' | 'suspended';
    conditions: string[];
    complianceStatus: 'compliant' | 'non_compliant' | 'under_review';
}

interface CertificationData {
    totalCertifications: number;
    activeCertifications: number;
    expiringSoon: number;
    expiredCertifications: number;
    certifications: Certification[];
}

interface Certification {
    id: string;
    name: string;
    type: 'iso_14001' | 'iso_9001' | 'ohsas_18001' | 'waste_management' | 'safety';
    issuedDate: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'pending_renewal' | 'suspended';
    certifyingBody: string;
    scope: string;
    lastAudit: string;
    nextAudit: string;
}

const ComplianceSecurity: React.FC = () => {
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState<'overview' | 'regulatory' | 'security' | 'audit' | 'environmental' | 'certifications'>('overview');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        dispatch(setPageTitle('Compliance & Security Management'));
    }, [dispatch]);

    // Fetch compliance data
    const { data: complianceData, isLoading, mutate } = useSwr<ComplianceData>('admin/compliance-security', fetcher);

    // Mock data for demonstration
    const mockData: ComplianceData = {
        regulatory: {
            overallScore: 87.5,
            pendingRequirements: 12,
            overdueRequirements: 3,
            completedRequirements: 45,
            requirements: [
                {
                    id: '1',
                    title: 'Waste Disposal Permit Renewal',
                    description: 'Annual renewal of waste disposal permit required',
                    category: 'environmental',
                    status: 'pending',
                    dueDate: '2024-02-15',
                    priority: 'high',
                    assignedTo: 'John Smith',
                    lastUpdated: '2024-01-20',
                },
                {
                    id: '2',
                    title: 'Data Protection Impact Assessment',
                    description: 'DPIA required for new customer data processing',
                    category: 'data_protection',
                    status: 'overdue',
                    dueDate: '2024-01-10',
                    priority: 'critical',
                    assignedTo: 'Sarah Johnson',
                    lastUpdated: '2024-01-05',
                },
                {
                    id: '3',
                    title: 'Safety Training Certification',
                    description: 'Annual safety training for all employees',
                    category: 'safety',
                    status: 'completed',
                    dueDate: '2024-01-31',
                    priority: 'medium',
                    assignedTo: 'Mike Wilson',
                    lastUpdated: '2024-01-25',
                },
            ],
            trends: Array.from({ length: 30 }, (_, i) => ({
                date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                score: 85 + Math.random() * 10,
            })),
        },
        security: {
            overallScore: 92.3,
            activeThreats: 2,
            resolvedThreats: 15,
            securityIncidents: [
                {
                    id: '1',
                    type: 'unauthorized_access',
                    severity: 'medium',
                    description: 'Multiple failed login attempts detected',
                    detectedAt: '2024-01-20T10:30:00Z',
                    status: 'investigating',
                    affectedSystems: ['Admin Portal', 'User Database'],
                    assignedTo: 'Security Team',
                },
                {
                    id: '2',
                    type: 'phishing',
                    severity: 'low',
                    description: 'Phishing email reported by employee',
                    detectedAt: '2024-01-19T14:15:00Z',
                    status: 'resolved',
                    affectedSystems: ['Email System'],
                    assignedTo: 'IT Support',
                    resolutionTime: '2 hours',
                },
            ],
            accessLogs: [
                {
                    id: '1',
                    userId: 'admin001',
                    userName: 'Admin User',
                    action: 'LOGIN',
                    resource: 'Admin Dashboard',
                    ipAddress: '192.168.1.100',
                    timestamp: '2024-01-20T09:00:00Z',
                    status: 'success',
                    location: 'Office Network',
                },
                {
                    id: '2',
                    userId: 'unknown',
                    userName: 'Unknown',
                    action: 'LOGIN',
                    resource: 'Admin Dashboard',
                    ipAddress: '203.45.67.89',
                    timestamp: '2024-01-20T08:45:00Z',
                    status: 'failed',
                    location: 'External IP',
                },
            ],
            vulnerabilities: [
                {
                    id: '1',
                    title: 'SQL Injection Vulnerability',
                    description: 'Potential SQL injection in user input fields',
                    severity: 'high',
                    cvssScore: 8.5,
                    affectedSystems: ['User Portal', 'API Gateway'],
                    discoveredAt: '2024-01-18',
                    status: 'in_progress',
                    assignedTo: 'Development Team',
                },
            ],
            trends: Array.from({ length: 30 }, (_, i) => ({
                date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                incidents: Math.floor(Math.random() * 5),
                threats: Math.floor(Math.random() * 3),
            })),
        },
        audit: {
            totalAudits: 25,
            completedAudits: 22,
            pendingAudits: 2,
            failedAudits: 1,
            auditLogs: [
                {
                    id: '1',
                    action: 'USER_CREATED',
                    userId: 'admin001',
                    userName: 'Admin User',
                    resource: 'User Management',
                    timestamp: '2024-01-20T10:00:00Z',
                    ipAddress: '192.168.1.100',
                    userAgent: 'Mozilla/5.0...',
                    outcome: 'success',
                },
            ],
            complianceReports: [
                {
                    id: '1',
                    title: 'Q4 2023 Compliance Report',
                    type: 'quarterly',
                    generatedAt: '2024-01-15',
                    status: 'approved',
                    generatedBy: 'Compliance Officer',
                    findings: ['All major requirements met', 'Minor improvements needed in documentation'],
                    recommendations: ['Implement automated compliance monitoring', 'Enhance training programs'],
                },
            ],
        },
        environmental: {
            wasteDisposalCompliance: 94.2,
            recyclingTargets: 68.5,
            carbonFootprintReduction: 45.2,
            environmentalIncidents: [
                {
                    id: '1',
                    type: 'spill',
                    severity: 'low',
                    description: 'Minor liquid spill during waste collection',
                    location: 'Downtown Collection Center',
                    reportedAt: '2024-01-19T16:30:00Z',
                    status: 'resolved',
                    environmentalImpact: 'Minimal - contained within facility',
                    correctiveActions: ['Enhanced spill response procedures', 'Additional training scheduled'],
                },
            ],
            permits: [
                {
                    id: '1',
                    type: 'Waste Disposal',
                    number: 'WD-2024-001',
                    issuedDate: '2024-01-01',
                    expiryDate: '2024-12-31',
                    status: 'active',
                    conditions: ['Monthly reporting required', 'Annual inspection mandatory'],
                    complianceStatus: 'compliant',
                },
            ],
        },
        certifications: {
            totalCertifications: 8,
            activeCertifications: 7,
            expiringSoon: 2,
            expiredCertifications: 1,
            certifications: [
                {
                    id: '1',
                    name: 'ISO 14001 Environmental Management',
                    type: 'iso_14001',
                    issuedDate: '2023-01-15',
                    expiryDate: '2026-01-15',
                    status: 'active',
                    certifyingBody: 'BSI Group',
                    scope: 'Waste Management Operations',
                    lastAudit: '2023-12-15',
                    nextAudit: '2024-06-15',
                },
                {
                    id: '2',
                    name: 'Waste Management License',
                    type: 'waste_management',
                    issuedDate: '2023-03-01',
                    expiryDate: '2024-03-01',
                    status: 'expiring_soon',
                    certifyingBody: 'Environmental Agency',
                    scope: 'Commercial Waste Collection',
                    lastAudit: '2023-12-01',
                    nextAudit: '2024-02-01',
                },
            ],
        },
    };

    const data = complianceData || mockData;

    // Chart configurations
    const complianceScoreChartOptions = {
        chart: {
            type: 'line' as const,
            height: 300,
            toolbar: { show: false },
        },
        colors: ['#10B981'],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            type: 'datetime',
            categories: data.regulatory.trends.map(item => item.date),
        },
        yaxis: {
            labels: { formatter: (value: number) => `${value}%` },
            min: 0,
            max: 100,
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' },
            y: { formatter: (value: number) => `${value}%` },
        },
    };

    const securityTrendsChartOptions = {
        chart: {
            type: 'area' as const,
            height: 300,
            toolbar: { show: false },
        },
        colors: ['#EF4444', '#F59E0B'],
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
            categories: data.security.trends.map(item => item.date),
        },
        yaxis: {
            labels: { formatter: (value: number) => value.toFixed(0) },
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' },
        },
        legend: { position: 'top' as const },
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'active':
            case 'compliant':
            case 'resolved':
                return 'text-green-500';
            case 'pending':
            case 'in_progress':
            case 'investigating':
                return 'text-yellow-500';
            case 'overdue':
            case 'expired':
            case 'non_compliant':
            case 'failed':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const handleExport = (type: string) => {
        // Export functionality
        const csvContent = "data:text/csv;charset=utf-8," + 
            `Type,Score,Date\n` +
            `${type},${data.regulatory.overallScore},${new Date().toISOString()}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${type}_compliance_report.csv`);
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
                        Compliance & Security Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Regulatory compliance, security monitoring, and audit management
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => mutate()}>
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={() => handleExport('compliance')}>
                        <IconDownload className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                    <Button>
                        <IconPlus className="w-4 h-4 mr-2" />
                        New Assessment
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b">
                {[
                    { key: 'overview', label: 'Overview', icon: IconShield },
                    { key: 'regulatory', label: 'Regulatory', icon: IconFileText },
                    { key: 'security', label: 'Security', icon: IconLock },
                    { key: 'audit', label: 'Audit', icon: IconClipboardCheck },
                    { key: 'environmental', label: 'Environmental', icon: IconRecycle },
                    { key: 'certifications', label: 'Certifications', icon: IconCertificate },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
                            selectedTab === tab.key
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedTab(tab.key as any)}
                    >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {selectedTab === 'overview' && (
                <>
                    {/* Overview Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Regulatory Compliance</CardTitle>
                                <IconShieldCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.regulatory.overallScore}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.regulatory.pendingRequirements} pending requirements
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                                <IconShield className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.security.overallScore}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.security.activeThreats} active threats
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Environmental Compliance</CardTitle>
                                <IconRecycle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.environmental.wasteDisposalCompliance}%</div>
                                <p className="text-xs text-muted-foreground">
                                    Waste disposal compliance rate
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
                                <IconCertificate className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.certifications.activeCertifications}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.certifications.expiringSoon} expiring soon
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Compliance Score Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactApexChart
                                    options={complianceScoreChartOptions}
                                    series={[{ name: 'Compliance Score', data: data.regulatory.trends.map(item => item.score) }]}
                                    type="line"
                                    height={300}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Security Incidents & Threats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactApexChart
                                    options={securityTrendsChartOptions}
                                    series={[
                                        { name: 'Security Incidents', data: data.security.trends.map(item => item.incidents) },
                                        { name: 'Active Threats', data: data.security.trends.map(item => item.threats) }
                                    ]}
                                    type="area"
                                    height={300}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Security Incidents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.security.securityIncidents.slice(0, 5).map((incident) => (
                                        <div key={incident.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(incident.severity)}`} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{incident.description}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-gray-500">{dayjs(incident.detectedAt).format('MMM DD, YYYY')}</span>
                                                    <Badge variant="outline" size="sm">
                                                        {incident.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Compliance Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.regulatory.requirements
                                        .filter(req => req.status === 'pending' || req.status === 'overdue')
                                        .slice(0, 5)
                                        .map((requirement) => (
                                            <div key={requirement.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(requirement.priority)}`} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{requirement.title}</p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-xs text-gray-500">Due: {dayjs(requirement.dueDate).format('MMM DD, YYYY')}</span>
                                                        <Badge variant="outline" size="sm">
                                                            {requirement.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {selectedTab === 'regulatory' && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Regulatory Compliance Requirements</CardTitle>
                            <div className="flex space-x-2">
                                <select
                                    className="px-3 py-2 border rounded-md text-sm"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search requirements..."
                                    className="px-3 py-2 border rounded-md text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.regulatory.requirements
                                .filter(req => 
                                    (filterStatus === 'all' || req.status === filterStatus) &&
                                    (searchTerm === '' || req.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                )
                                .map((requirement) => (
                                    <div key={requirement.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{requirement.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span>Category: {requirement.category.replace('_', ' ')}</span>
                                                    <span>Assigned to: {requirement.assignedTo}</span>
                                                    <span>Due: {dayjs(requirement.dueDate).format('MMM DD, YYYY')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant={requirement.status === 'completed' ? 'default' : 'outline'}>
                                                    {requirement.status.replace('_', ' ')}
                                                </Badge>
                                                <Badge variant="outline" className={getPriorityColor(requirement.priority)}>
                                                    {requirement.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedTab === 'security' && (
                <div className="space-y-6">
                    {/* Security Incidents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Incidents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.security.securityIncidents.map((incident) => (
                                    <div key={incident.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{incident.description}</h4>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span>Type: {incident.type.replace('_', ' ')}</span>
                                                    <span>Detected: {dayjs(incident.detectedAt).format('MMM DD, YYYY HH:mm')}</span>
                                                    <span>Assigned to: {incident.assignedTo}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-sm text-gray-600">Affected Systems: </span>
                                                    <span className="text-sm">{incident.affectedSystems.join(', ')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                                                    {incident.severity}
                                                </Badge>
                                                <Badge variant={incident.status === 'resolved' ? 'default' : 'outline'}>
                                                    {incident.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vulnerabilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Vulnerabilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.security.vulnerabilities.map((vulnerability) => (
                                    <div key={vulnerability.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{vulnerability.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{vulnerability.description}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span>CVSS Score: {vulnerability.cvssScore}</span>
                                                    <span>Discovered: {vulnerability.discoveredAt}</span>
                                                    <span>Assigned to: {vulnerability.assignedTo}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className={getSeverityColor(vulnerability.severity)}>
                                                    {vulnerability.severity}
                                                </Badge>
                                                <Badge variant={vulnerability.status === 'patched' ? 'default' : 'outline'}>
                                                    {vulnerability.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {selectedTab === 'audit' && (
                <div className="space-y-6">
                    {/* Audit Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
                                <IconClipboardList className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.audit.totalAudits}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <IconCheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{data.audit.completedAudits}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                <IconClock className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{data.audit.pendingAudits}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                                <IconAlertTriangle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{data.audit.failedAudits}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Compliance Reports */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Compliance Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.audit.complianceReports.map((report) => (
                                    <div key={report.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{report.title}</h4>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span>Type: {report.type}</span>
                                                    <span>Generated: {dayjs(report.generatedAt).format('MMM DD, YYYY')}</span>
                                                    <span>By: {report.generatedBy}</span>
                                                </div>
                                                <div className="mt-3">
                                                    <h5 className="text-sm font-medium mb-1">Key Findings:</h5>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {report.findings.map((finding, index) => (
                                                            <li key={index}>• {finding}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <Badge variant={report.status === 'approved' ? 'default' : 'outline'}>
                                                {report.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {selectedTab === 'environmental' && (
                <div className="space-y-6">
                    {/* Environmental Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Waste Disposal Compliance</CardTitle>
                                <IconRecycle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.environmental.wasteDisposalCompliance}%</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Recycling Targets</CardTitle>
                                <IconRecycle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.environmental.recyclingTargets}%</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Carbon Footprint Reduction</CardTitle>
                                <IconRecycle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.environmental.carbonFootprintReduction}%</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Environmental Incidents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Environmental Incidents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.environmental.environmentalIncidents.map((incident) => (
                                    <div key={incident.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{incident.description}</h4>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span>Type: {incident.type.replace('_', ' ')}</span>
                                                    <span>Location: {incident.location}</span>
                                                    <span>Reported: {dayjs(incident.reportedAt).format('MMM DD, YYYY HH:mm')}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-sm text-gray-600">Environmental Impact: </span>
                                                    <span className="text-sm">{incident.environmentalImpact}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                                                    {incident.severity}
                                                </Badge>
                                                <Badge variant={incident.status === 'resolved' ? 'default' : 'outline'}>
                                                    {incident.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {selectedTab === 'certifications' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Certifications Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.certifications.certifications.map((certification) => (
                                <div key={certification.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{certification.name}</h4>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                <span>Type: {certification.type.replace('_', ' ')}</span>
                                                <span>Certifying Body: {certification.certifyingBody}</span>
                                                <span>Scope: {certification.scope}</span>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                <span>Issued: {dayjs(certification.issuedDate).format('MMM DD, YYYY')}</span>
                                                <span>Expires: {dayjs(certification.expiryDate).format('MMM DD, YYYY')}</span>
                                                <span>Next Audit: {dayjs(certification.nextAudit).format('MMM DD, YYYY')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={certification.status === 'active' ? 'default' : 'outline'}>
                                                {certification.status.replace('_', ' ')}
                                            </Badge>
                                            {certification.status === 'expiring_soon' && (
                                                <Badge variant="destructive">Expiring Soon</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ComplianceSecurity;

