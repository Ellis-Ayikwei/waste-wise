import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconPlus,
    IconFilter,
    IconSearch,
    IconEye,
    IconEdit,
    IconTrash,
    IconTrophy,
    IconStar,
    IconUsers,
    IconGift,
    IconTarget,
    IconTrendingUp,
    IconRefresh,
    IconSettings,
    IconDownload,
    IconUpload,
    IconCheck,
    IconX,
    IconCalendar,
    IconCoin,
    IconAward,
    IconChartBar
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';
import DraggableDataTable, { ColumnDefinition } from '../../../components/ui/DraggableDataTable';

interface RewardProgram {
    id: string;
    name: string;
    description: string;
    type: 'points' | 'badges' | 'discounts' | 'cashback' | 'tiered';
    status: 'active' | 'inactive' | 'draft' | 'scheduled';
    startDate: string;
    endDate?: string;
    targetAudience: 'all' | 'new_customers' | 'existing_customers' | 'premium';
    requirements: {
        minPickups: number;
        minRecycling: number;
        minSpend: number;
        referralCount?: number;
    };
    rewards: {
        pointsPerPickup: number;
        pointsPerRecycling: number;
        bonusPoints: number;
        discountPercentage?: number;
        cashbackPercentage?: number;
    };
    participationCount: number;
    totalRewardsGiven: number;
    totalValue: number;
    createdAt: string;
    updatedAt: string;
}

const RewardPrograms: React.FC = () => {
    const dispatch = useDispatch();
    const [programs, setPrograms] = useState<RewardProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProgram, setSelectedProgram] = useState<RewardProgram | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        dispatch(setPageTitle('Reward Programs'));
        fetchPrograms();
    }, [dispatch]);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            // Mock data for demonstration
            const mockPrograms: RewardProgram[] = [
                {
                    id: '1',
                    name: 'Eco Warrior Rewards',
                    description: 'Earn points for every recycling pickup and reduce your carbon footprint',
                    type: 'points',
                    status: 'active',
                    startDate: '2024-01-01',
                    targetAudience: 'all',
                    requirements: {
                        minPickups: 1,
                        minRecycling: 0,
                        minSpend: 0
                    },
                    rewards: {
                        pointsPerPickup: 100,
                        pointsPerRecycling: 50,
                        bonusPoints: 25
                    },
                    participationCount: 1250,
                    totalRewardsGiven: 125000,
                    totalValue: 12500.00,
                    createdAt: '2024-01-01T10:30:00Z',
                    updatedAt: '2024-01-10T15:45:00Z'
                },
                {
                    id: '2',
                    name: 'Referral Champions',
                    description: 'Earn rewards by referring friends and family to our service',
                    type: 'tiered',
                    status: 'active',
                    startDate: '2024-01-01',
                    targetAudience: 'existing_customers',
                    requirements: {
                        minPickups: 5,
                        minRecycling: 2,
                        minSpend: 100,
                        referralCount: 1
                    },
                    rewards: {
                        pointsPerPickup: 150,
                        pointsPerRecycling: 75,
                        bonusPoints: 500
                    },
                    participationCount: 450,
                    totalRewardsGiven: 67500,
                    totalValue: 6750.00,
                    createdAt: '2024-01-01T12:00:00Z',
                    updatedAt: '2024-01-08T09:30:00Z'
                },
                {
                    id: '3',
                    name: 'Premium Member Benefits',
                    description: 'Exclusive rewards for premium subscription members',
                    type: 'discounts',
                    status: 'active',
                    startDate: '2024-01-01',
                    targetAudience: 'premium',
                    requirements: {
                        minPickups: 10,
                        minRecycling: 5,
                        minSpend: 200
                    },
                    rewards: {
                        pointsPerPickup: 200,
                        pointsPerRecycling: 100,
                        bonusPoints: 100,
                        discountPercentage: 15
                    },
                    participationCount: 180,
                    totalRewardsGiven: 36000,
                    totalValue: 5400.00,
                    createdAt: '2024-01-01T14:15:00Z',
                    updatedAt: '2024-01-12T11:20:00Z'
                },
                {
                    id: '4',
                    name: 'New Customer Welcome',
                    description: 'Special rewards for new customers joining our platform',
                    type: 'cashback',
                    status: 'scheduled',
                    startDate: '2024-02-01',
                    targetAudience: 'new_customers',
                    requirements: {
                        minPickups: 3,
                        minRecycling: 1,
                        minSpend: 50
                    },
                    rewards: {
                        pointsPerPickup: 300,
                        pointsPerRecycling: 150,
                        bonusPoints: 1000,
                        cashbackPercentage: 10
                    },
                    participationCount: 0,
                    totalRewardsGiven: 0,
                    totalValue: 0.00,
                    createdAt: '2024-01-15T16:30:00Z',
                    updatedAt: '2024-01-15T16:30:00Z'
                }
            ];
            setPrograms(mockPrograms);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
        switch (status) {
            case 'active':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
            case 'inactive':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
            case 'draft':
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
            case 'scheduled':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
        }
    };

    const getTypeBadge = (type: string) => {
        const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
        switch (type) {
            case 'points':
                return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400`;
            case 'badges':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
            case 'discounts':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
            case 'cashback':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
            case 'tiered':
                return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'points':
                return <IconCoin className="w-4 h-4 text-purple-600" />;
            case 'badges':
                return <IconAward className="w-4 h-4 text-yellow-600" />;
            case 'discounts':
                return <IconGift className="w-4 h-4 text-green-600" />;
            case 'cashback':
                return <IconTrendingUp className="w-4 h-4 text-blue-600" />;
            case 'tiered':
                return <IconTarget className="w-4 h-4 text-orange-600" />;
            default:
                return <IconTrophy className="w-4 h-4 text-gray-600" />;
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    const handleActivate = async (program: RewardProgram) => {
        try {
            console.log('Activating program:', program.id);
            setPrograms(prev => prev.map(prog => 
                prog.id === program.id ? { ...prog, status: 'active' } : prog
            ));
        } catch (error) {
            console.error('Error activating program:', error);
        }
    };

    const handleDeactivate = async (program: RewardProgram) => {
        try {
            console.log('Deactivating program:', program.id);
            setPrograms(prev => prev.map(prog => 
                prog.id === program.id ? { ...prog, status: 'inactive' } : prog
            ));
        } catch (error) {
            console.error('Error deactivating program:', error);
        }
    };

    const handleDelete = async (program: RewardProgram) => {
        try {
            console.log('Deleting program:', program.id);
            setPrograms(prev => prev.filter(prog => prog.id !== program.id));
        } catch (error) {
            console.error('Error deleting program:', error);
        }
    };

    const columns: ColumnDefinition[] = [
        {
            accessor: 'program_info',
            title: 'Program',
            width: '25%',
            render: (item: RewardProgram) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <IconTrophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {item.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            {getTypeIcon(item.type)}
                            <span className={getTypeBadge(item.type)}>
                                {item.type}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessor: 'status',
            title: 'Status',
            width: '10%',
            render: (item: RewardProgram) => (
                <span className={getStatusBadge(item.status)}>
                    {item.status}
                </span>
            ),
        },
        {
            accessor: 'participation',
            title: 'Participation',
            width: '15%',
            render: (item: RewardProgram) => (
                <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.participationCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        participants
                    </div>
                </div>
            ),
        },
        {
            accessor: 'rewards',
            title: 'Rewards Given',
            width: '15%',
            render: (item: RewardProgram) => (
                <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.totalRewardsGiven.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        points
                    </div>
                </div>
            ),
        },
        {
            accessor: 'value',
            title: 'Total Value',
            width: '12%',
            render: (item: RewardProgram) => (
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${item.totalValue.toFixed(2)}
                </div>
            ),
        },
        {
            accessor: 'dates',
            title: 'Duration',
            width: '13%',
            render: (item: RewardProgram) => (
                <div>
                    <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(item.startDate)}
                    </div>
                    {item.endDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            to {formatDate(item.endDate)}
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessor: 'actions',
            title: 'Actions',
            width: '10%',
            textAlign: 'center',
            render: (item: RewardProgram) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => {
                            setSelectedProgram(item);
                            setShowDetailsModal(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <IconEye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedProgram(item);
                            // Handle edit
                        }}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Edit Program"
                    >
                        <IconEdit className="w-4 h-4" />
                    </button>
                    {item.status === 'inactive' && (
                        <button
                            onClick={() => handleActivate(item)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Activate Program"
                        >
                            <IconCheck className="w-4 h-4" />
                        </button>
                    )}
                    {item.status === 'active' && (
                        <button
                            onClick={() => handleDeactivate(item)}
                            className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                            title="Deactivate Program"
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Program"
                    >
                        <IconTrash className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    const getFilteredPrograms = () => {
        if (activeFilter === 'all') return programs;
        return programs.filter(program => program.status === activeFilter);
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading reward programs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reward Programs</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer loyalty and reward programs</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={fetchPrograms}>
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <IconPlus className="w-4 h-4 mr-2" />
                        Create Program
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
                        <IconTrophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{programs.length}</div>
                        <p className="text-xs text-muted-foreground">Active programs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
                        <IconCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{programs.filter(p => p.status === 'active').length}</div>
                        <p className="text-xs text-muted-foreground">Currently running</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{programs.reduce((sum, p) => sum + p.participationCount, 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all programs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${programs.reduce((sum, p) => sum + p.totalValue, 0).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Rewards distributed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <DraggableDataTable
                data={getFilteredPrograms()}
                columns={columns}
                loading={loading}
                title="Reward Programs"
                exportFileName="reward-programs"
                storeKey="reward-programs-table"
                onRefreshData={fetchPrograms}
                extraFilters={
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'All Programs', icon: IconTrophy },
                            { key: 'active', label: 'Active', icon: IconCheck },
                            { key: 'inactive', label: 'Inactive', icon: IconX },
                            { key: 'draft', label: 'Draft', icon: IconEdit },
                            { key: 'scheduled', label: 'Scheduled', icon: IconCalendar },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    activeFilter === filter.key
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                                onClick={() => setActiveFilter(filter.key)}
                            >
                                <filter.icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                }
                quickCheckFields={['id', 'name', 'description', 'type']}
            />

            {/* Program Details Modal */}
            {showDetailsModal && selectedProgram && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Program Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Program Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Program Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                                        <span className={getTypeBadge(selectedProgram.type)}>
                                            {selectedProgram.type}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                        <span className={getStatusBadge(selectedProgram.status)}>
                                            {selectedProgram.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Target Audience</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                            {selectedProgram.targetAudience.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.description}</p>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Minimum Pickups</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.requirements.minPickups}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Minimum Recycling</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.requirements.minRecycling}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Minimum Spend</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">${selectedProgram.requirements.minSpend}</p>
                                    </div>
                                    {selectedProgram.requirements.referralCount && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Referral Count</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.requirements.referralCount}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rewards */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rewards</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Points per Pickup</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.rewards.pointsPerPickup}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Points per Recycling</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.rewards.pointsPerRecycling}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Bonus Points</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.rewards.bonusPoints}</p>
                                    </div>
                                    {selectedProgram.rewards.discountPercentage && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Discount Percentage</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.rewards.discountPercentage}%</p>
                                        </div>
                                    )}
                                    {selectedProgram.rewards.cashbackPercentage && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Cashback Percentage</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.rewards.cashbackPercentage}%</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Statistics */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Statistics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.participationCount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Rewards Given</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedProgram.totalRewardsGiven.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">${selectedProgram.totalValue.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedProgram.startDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => setShowDetailsModal(false)}
                                className="flex-1"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    // Handle edit
                                    setShowDetailsModal(false);
                                }}
                                className="flex-1"
                            >
                                <IconEdit className="w-4 h-4 mr-2" />
                                Edit Program
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RewardPrograms;
