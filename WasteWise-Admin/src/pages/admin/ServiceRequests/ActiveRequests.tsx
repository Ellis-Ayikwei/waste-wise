import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconTruck,
    IconClock,
    IconMap,
    IconRoute,
    IconRefresh,
    IconEye,
    IconCheck,
    IconX
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';

const ActiveRequests: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setPageTitle('Active Service Requests'));
        setLoading(false);
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading active requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Active Service Requests</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage ongoing waste collection requests</p>
                </div>
                <div className="flex items-center gap-3">
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
                        <CardTitle className="text-sm font-medium">Total Active</CardTitle>
                        <IconTruck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Active requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <IconClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Currently being processed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Urgent Requests</CardTitle>
                        <IconClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">High priority</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                        <IconRoute className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">65%</div>
                        <p className="text-xs text-muted-foreground">Route completion</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Requests Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <IconTruck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Requests Dashboard</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Monitor and manage all active waste collection requests in real-time.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button>
                                <IconMap className="w-4 h-4 mr-2" />
                                View Map
                            </Button>
                            <Button variant="outline">
                                <IconRoute className="w-4 h-4 mr-2" />
                                Optimize Routes
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActiveRequests;
