import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconCoin,
    IconPlus,
    IconMinus,
    IconUsers,
    IconTrendingUp,
    IconGift,
    IconRefresh,
    IconDownload
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';

const PointsSystem: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setPageTitle('Points System'));
        setLoading(false);
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading points system...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Points System</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer points and rewards system</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button>
                        <IconPlus className="w-4 h-4 mr-2" />
                        Add Points
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
                        <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                        <IconCoin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,847,392</div>
                        <p className="text-xs text-muted-foreground">Points in circulation</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">Users with points</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
                        <IconGift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">892,450</div>
                        <p className="text-xs text-muted-foreground">Total redeemed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Points</CardTitle>
                        <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,284</div>
                        <p className="text-xs text-muted-foreground">Per user</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Points System Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <IconCoin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customer Rewards System</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Manage points allocation, redemption rules, and reward tiers for customer engagement.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button>
                                <IconPlus className="w-4 h-4 mr-2" />
                                Add Points
                            </Button>
                            <Button variant="outline">
                                <IconMinus className="w-4 h-4 mr-2" />
                                Deduct Points
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

export default PointsSystem;

