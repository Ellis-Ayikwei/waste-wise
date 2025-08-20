import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconHistory,
    IconCalendar,
    IconFilter,
    IconDownload,
    IconRefresh,
    IconSearch,
    IconChartBar
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';

const RequestHistory: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setPageTitle('Request History'));
        setLoading(false);
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading request history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request History</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">View and analyze historical service requests</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <IconDownload className="w-4 h-4 mr-2" />
                        Export
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
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <IconHistory className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <IconHistory className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,189</div>
                        <p className="text-xs text-muted-foreground">95.3% success rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                        <IconHistory className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">58</div>
                        <p className="text-xs text-muted-foreground">4.7% cancellation rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IconChartBar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$89,450</div>
                        <p className="text-xs text-muted-foreground">From completed requests</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Request History Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <IconHistory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Historical Data Dashboard</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Analyze trends, performance metrics, and historical patterns from completed service requests.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button>
                                <IconFilter className="w-4 h-4 mr-2" />
                                Filter Data
                            </Button>
                            <Button variant="outline">
                                <IconSearch className="w-4 h-4 mr-2" />
                                Search History
                            </Button>
                            <Button variant="outline">
                                <IconChartBar className="w-4 h-4 mr-2" />
                                View Analytics
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RequestHistory;

