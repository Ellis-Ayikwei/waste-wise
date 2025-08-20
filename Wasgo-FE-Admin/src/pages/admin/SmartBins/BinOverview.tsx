import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconDatabase,
    IconMapPin,
    IconAlertTriangle,
    IconCheck,
    IconX,
    IconRefresh,
    IconDownload
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';

const BinOverview: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setPageTitle('Smart Bins Overview'));
        setLoading(false);
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading smart bins overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Bins Overview</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage smart waste collection bins</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button>
                        <IconDatabase className="w-4 h-4 mr-2" />
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
                        <IconDatabase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">247</div>
                        <p className="text-xs text-muted-foreground">Installed bins</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bins</CardTitle>
                        <IconCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">234</div>
                        <p className="text-xs text-muted-foreground">Online and operational</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                        <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">13</div>
                        <p className="text-xs text-muted-foreground">Active alerts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Fill Level</CardTitle>
                        <IconMapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">67%</div>
                        <p className="text-xs text-muted-foreground">Current average</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Smart Bins Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <IconDatabase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">IoT Waste Management</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Monitor smart bins, track fill levels, and optimize collection routes in real-time.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button>
                                <IconMapPin className="w-4 h-4 mr-2" />
                                View Map
                            </Button>
                            <Button variant="outline">
                                <IconAlertTriangle className="w-4 h-4 mr-2" />
                                View Alerts
                            </Button>
                            <Button variant="outline">
                                <IconDownload className="w-4 h-4 mr-2" />
                                Export Data
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BinOverview;

