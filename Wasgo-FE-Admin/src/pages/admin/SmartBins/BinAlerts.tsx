import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconBell,
    IconAlertTriangle,
    IconCheck,
    IconX,
    IconRefresh,
    IconDownload
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck, faBell } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import StatCard from '../../../components/ui/statCard';
import { setPageTitle } from '../../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../../services/fetcher';

// Interface for bin data
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

const BinAlerts: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    // Fetch bin data
    const { data: binData, isLoading } = useSwr<SmartBinData[]>('bins/', fetcher);

    useEffect(() => {
        dispatch(setPageTitle('Bin Alerts'));
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

    // Calculate alert statistics
    const activeAlerts = binDataFinal.filter(bin => bin.fill_level > 80).length;
    const criticalAlerts = binDataFinal.filter(bin => bin.fill_level > 90).length;
    const resolvedAlerts = binDataFinal.filter(bin => bin.fill_level <= 50).length; // Assuming resolved when fill level is low
    const totalAlerts = activeAlerts + resolvedAlerts;

    if (loading || isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading bin alerts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bin Alerts</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage smart bin alerts and notifications</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button>
                        <IconBell className="w-4 h-4 mr-2" />
                        Acknowledge All
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
                    icon={faExclamationTriangle}
                    title="Active Alerts"
                    value={activeAlerts.toString()}
                    color="red"
                    delay={0.1}
                />
                <StatCard
                    icon={faExclamationTriangle}
                    title="Critical"
                    value={criticalAlerts.toString()}
                    color="orange"
                    delay={0.2}
                />
                <StatCard
                    icon={faCheck}
                    title="Resolved"
                    value={resolvedAlerts.toString()}
                    color="green"
                    delay={0.3}
                />
                <StatCard
                    icon={faBell}
                    title="Total Today"
                    value={totalAlerts.toString()}
                    color="blue"
                    delay={0.4}
                />
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Alert Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <IconBell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Bin Alert System</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Monitor and respond to alerts from smart bins including fill levels, malfunctions, and maintenance needs.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button>
                                <IconCheck className="w-4 h-4 mr-2" />
                                Acknowledge Alerts
                            </Button>
                            <Button variant="outline">
                                <IconAlertTriangle className="w-4 h-4 mr-2" />
                                View Critical
                            </Button>
                            <Button variant="outline">
                                <IconDownload className="w-4 h-4 mr-2" />
                                Export Alerts
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BinAlerts;

