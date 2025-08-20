import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconGift,
    IconCheck,
    IconX,
    IconClock,
    IconUsers,
    IconTrendingUp,
    IconRefresh,
    IconDownload
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';

const Redemptions: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setPageTitle('Redemptions'));
        setLoading(false);
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading redemptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Redemptions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer point redemptions and rewards</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button>
                        <IconGift className="w-4 h-4 mr-2" />
                        Process Redemption
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
                        <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
                        <IconGift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <IconClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <IconCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,189</div>
                        <p className="text-xs text-muted-foreground">Successfully processed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <IconX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">35</div>
                        <p className="text-xs text-muted-foreground">Declined requests</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Redemption Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <IconGift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Point Redemption System</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Review and process customer redemption requests for rewards and benefits.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button>
                                <IconCheck className="w-4 h-4 mr-2" />
                                Approve Redemption
                            </Button>
                            <Button variant="outline">
                                <IconX className="w-4 h-4 mr-2" />
                                Reject Redemption
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

export default Redemptions;

