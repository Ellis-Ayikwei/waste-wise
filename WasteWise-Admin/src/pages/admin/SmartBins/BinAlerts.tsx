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
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';

const BinAlerts: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setPageTitle('Bin Alerts'));
        setLoading(false);
    }, [dispatch]);

    if (loading) {
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                        <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">13</div>
                        <p className="text-xs text-muted-foreground">Unresolved alerts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical</CardTitle>
                        <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">High priority</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <IconCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">47</div>
                        <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Today</CardTitle>
                        <IconBell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">60</div>
                        <p className="text-xs text-muted-foreground">All alerts</p>
                    </CardContent>
                </Card>
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

