import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    IconDatabase,
    IconMapPin,
    IconAlertTriangle,
    IconCheck,
    IconX,
    IconRefresh,
    IconDownload,
    IconPlus,
    IconSearch,
    IconFilter,
    IconEdit,
    IconTrash,
    IconEye,
    IconCpu
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCheck, faExclamationTriangle, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import StatCard from '../../../components/ui/statCard';
import DraggableDataTable from '../../../components/ui/DraggableDataTable';
import { setPageTitle } from '../../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../../services/fetcher';
import AssignUserModal from './BinDetail/components/AssignUserModal';
import AddBinModal from './AddBinModal';
import DateTimeUtil from '../../../utilities/dateTimeUtil';

// Interface for bin data
interface SmartBinData {
    created_at: string | number;
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
    user?: {
        id: string;
        first_name: string;
        last_name: string;
    };
    sensor_id: string | null;
    battery_level: number | null;
    signal_strength: number | null;
    is_online: boolean;
    last_reading_at: string | null;
}


const BinManagement: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignUserModal, setShowAssignUserModal] = useState(false);
    const [binToAssignUser, setBinToAssignUser] = useState<string | null>(null);

    // Fetch bin data
    const { data: binData, isLoading, mutate } = useSwr<SmartBinData[]>('waste/bins/', fetcher);

    console.log("the bin data", binData)

    useEffect(() => {
        dispatch(setPageTitle('Bin Management'));
        setLoading(false);
    }, [dispatch]);

    // Process bin data
    let binDataFinal: SmartBinData[] = [];
    if (binData) {
        if (Array.isArray(binData)) {
            binDataFinal = binData;
        } else if (typeof binData === 'object' && binData !== null && 'results' in binData && Array.isArray((binData as any).results)) {
            binDataFinal = (binData as any).results;
        } else if (typeof binData === 'object' && binData !== null && 'data' in binData && Array.isArray((binData as any).data)) {
            binDataFinal = (binData as any).data;
        }
    }

    // Filter data based on search and status
    const filteredData = binDataFinal.filter(bin => {
        const matchesSearch = bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             bin.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             bin.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             bin.bin_id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || bin.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Calculate statistics
    const totalBins = binDataFinal.length;
    const activeBins = binDataFinal.filter(bin => bin.is_online).length;
    const alerts = binDataFinal.filter(bin => bin.fill_level > 80).length;
    const avgFillLevel = binDataFinal.length > 0 
        ? Math.round(binDataFinal.reduce((sum, bin) => sum + bin.fill_level, 0) / binDataFinal.length)
        : 0;

    // Table columns configuration
    const columns = [
        {
            accessor: 'bin_number',
            title: 'Bin ID',
            sortable: true,
            render: (bin: SmartBinData) => (
                <span className="font-mono text-sm">{bin.bin_number}</span>
            )
        },
        {
            accessor: 'name',
            title: 'Name',
            sortable: true,
            render: (bin: SmartBinData) => (
                <div>
                    <div className="font-medium">{bin.name}</div>
                    <div className="text-sm text-gray-500">{bin.area}</div>
                </div>
            )
        },
        {
            accessor: 'address',
            title: 'Address',
            sortable: true,
            render: (bin: SmartBinData) => (
                <div className="max-w-xs truncate" title={bin.address}>
                    {bin.address}
                </div>
            )
        },
        {
            accessor: 'created_at',
            title: 'Created At',
            sortable: true,
            render: (bin: SmartBinData) => (
                <div className="max-w-xs truncate" title={bin.created_at}>
                    {bin.created_at ? DateTimeUtil({date: bin.created_at, format: 'MMM D, YYYY'}) : 'N/A'}
                </div>
            )
        },
        {
            accessor: 'user',
            title: 'Assigned User',
            sortable: true,
            render: (bin: SmartBinData) => (
                <div className="max-w-xs truncate" title={bin?.user?.first_name + ' ' + bin?.user?.last_name || 'N/A'}>
                    {bin?.user ? bin?.user?.first_name + ' ' 
                    + bin?.user?.last_name 
                    : (<button className="text-blue-500 hover:text-blue-600" onClick={() => {setShowAssignUserModal(true); setBinToAssignUser(bin.id)}}>Assign User</button>)}
                </div>
            )
        },
        {
            accessor: 'fill_level',
            title: 'Fill Level',
            sortable: true,
            render: (bin: SmartBinData) => (
                <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${
                                bin.fill_level > 80 ? 'bg-red-500' : 
                                bin.fill_level > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${bin.fill_level}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium">{bin.fill_level}%</span>
                </div>
            )
        },
        {
            accessor: 'status',
            title: 'Status',
            sortable: true,
            render: (bin: SmartBinData) => (
                <Badge variant={bin.is_online ? 'default' : 'destructive'}>
                    {bin.is_online ? 'Online' : 'Offline'}
                </Badge>
            )
        },
        {
            accessor: 'bin_type_display',
            title: 'Type',
            sortable: true,
            render: (bin: SmartBinData) => (
                <Badge variant="outline">{bin.bin_type_display}</Badge>
            )
        },
        {
            accessor: 'battery_level',
            title: 'Battery',
            sortable: true,
            render: (bin: SmartBinData) => (
                <div className="flex items-center gap-2">
                    {bin.battery_level !== null ? (
                        <>
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full ${
                                        bin.battery_level > 50 ? 'bg-green-500' : 
                                        bin.battery_level > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${bin.battery_level}%` }}
                                ></div>
                            </div>
                            <span className="text-xs">{bin.battery_level}%</span>
                        </>
                    ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                    )}
                </div>
            )
        },
        {
            accessor: 'actions',
            title: 'Actions',
            sortable: false,
            render: (bin: SmartBinData) => (
                <div className="flex items-center gap-2">
                    <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/admin/smart-bins/${bin.id}`)}
                        title="View Bin Details"
                    >
                        <IconEye className="w-3 h-3" />
                    </Button>
                    {bin.sensor_id && (
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/admin/sensors/${bin.sensor_id}`)}
                            title="View Sensor Details"
                        >
                            <IconCpu className="w-3 h-3" />
                        </Button>
                    )}
                    <Button size="sm" variant="outline" title="Edit Bin">
                        <IconEdit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" title="Delete Bin">
                        <IconTrash className="w-3 h-3" />
                    </Button>
                </div>
            )
        }
    ];


    if (loading || isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading bin management...</p>
                </div>
            </div>
        );
    }


    const renderBulkActions = (selectedRecords: SmartBinData[]) => (
        <div className="flex items-center gap-2">
            <button className="text-blue-500 hover:text-blue-600" onClick={() => {setShowAssignUserModal(true); setBinToAssignUser(selectedRecords.map(bin => bin.bin_number).join(','));}}>Assign User</button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bin Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor smart waste collection bins</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => setShowAddModal(true)}>
                        <IconPlus className="w-4 h-4 mr-2" />
                        Add Bin
                    </Button>
                    <Button variant="outline">
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={faDatabase}
                    title="Total Bins"
                    value={totalBins.toString()}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faCheck}
                    title="Active Bins"
                    value={activeBins.toString()}
                    color="green"
                    delay={0.2}
                />
                <StatCard
                    icon={faExclamationTriangle}
                    title="Alerts"
                    value={alerts.toString()}
                    color="red"
                    delay={0.3}
                />
                <StatCard
                    icon={faChartBar}
                    title="Avg Fill Level"
                    value={`${avgFillLevel}%`}
                    color="purple"
                    delay={0.4}
                />
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search bins by name, address, area, or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-48">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Smart Bins ({filteredData.length})</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <IconDownload className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DraggableDataTable
                        data={filteredData}
                        columns={columns}
                        title="Smart Bins"
                        loading={isLoading}
                        storeKey="bin-management-table"
                        bulkActions={renderBulkActions}      
                        onRefreshData={() => mutate()}              

/>
                </CardContent>
            </Card>

            {/* Assign User Modal */}
<AssignUserModal
    isOpen={showAssignUserModal}
    onClose={() => setShowAssignUserModal(false)}
    binData={binToAssignUser}
    onSuccess={() => mutate()}
/>

            {/* Add Bin Modal */}
            <AddBinModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={() => mutate()}
            />
        </div>
    );
};

export default BinManagement;

