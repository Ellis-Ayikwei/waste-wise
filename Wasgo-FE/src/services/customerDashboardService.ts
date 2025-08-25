import authAxiosInstance from './authAxiosInstance';

export interface CustomerStats {
    totalPickups: number;
    activePickups: number;
    totalRecycled: number;
    carbonSaved: number;
    rewardsEarned: number;
    nextPickup: string;
}

export interface CustomerActivity {
    id: number;
    type: string;
    title: string;
    description: string;
    time: string;
    status: 'completed' | 'scheduled' | 'reward' | 'pending';
}

export interface SmartBin {
    id: number;
    name: string;
    location: string;
    fillLevel: number;
    status: 'active' | 'full' | 'maintenance' | 'offline';
    lastCollection: string;
    type: 'general' | 'recycling' | 'compost' | 'battery' | 'electronics';
}

export interface Campaign {
    id: number;
    title: string;
    description: string;
    progress: number;
    target: number;
    reward: number;
    endDate: string;
    type: 'challenge' | 'achievement' | 'referral' | 'community';
}

export interface CustomerDashboardData {
    stats: CustomerStats;
    recentActivity: CustomerActivity[];
    upcomingPickups: any[];
    smartBins: SmartBin[];
    campaigns: Campaign[];
    environmentalImpact: {
        totalWasteCollected: number;
        carbonFootprintReduced: number;
        treesEquivalent: number;
    };
}

class CustomerDashboardService {
    /**
     * Get customer dashboard data
     */
    async getCustomerDashboard(customerId: string): Promise<CustomerDashboardData> {
        try {
            const response = await authAxiosInstance.get(`/requests/?user_id=${customerId}`);
            
            // Calculate stats from requests data
            const requests = response.data;
            const stats = this.calculateStats(requests);
            const recentActivity = this.formatRecentActivity(requests);
            const smartBins = this.getMockSmartBins();
            const campaigns = this.getMockCampaigns();
            
            return {
                stats,
                recentActivity,
                upcomingPickups: this.getUpcomingPickups(requests),
                smartBins,
                campaigns,
                environmentalImpact: this.calculateEnvironmentalImpact(requests)
            };
        } catch (error) {
            console.error('Error fetching customer dashboard:', error);
            throw error;
        }
    }

    /**
     * Get customer requests
     */
    async getCustomerRequests(customerId: string, status?: string): Promise<any[]> {
        try {
            let url = `/requests/?user_id=${customerId}`;
            if (status) {
                url += `&status=${status}`;
            }
            const response = await authAxiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer requests:', error);
            throw error;
        }
    }

    /**
     * Get customer profile
     */
    async getCustomerProfile(customerId: string): Promise<any> {
        try {
            const response = await authAxiosInstance.get(`/auth/users/${customerId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer profile:', error);
            throw error;
        }
    }

    /**
     * Get smart bins for customer
     */
    async getSmartBins(customerId: string): Promise<SmartBin[]> {
        try {
            // For now, return mock data. In the future, this would call a real API
            return this.getMockSmartBins();
        } catch (error) {
            console.error('Error fetching smart bins:', error);
            throw error;
        }
    }

    /**
     * Get campaigns for customer
     */
    async getCampaigns(customerId: string): Promise<Campaign[]> {
        try {
            // For now, return mock data. In the future, this would call a real API
            return this.getMockCampaigns();
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            throw error;
        }
    }

    /**
     * Calculate dashboard stats from requests data
     */
    private calculateStats(requests: any[]): CustomerStats {
        const totalPickups = requests.length;
        const activePickups = requests.filter(req => 
            ['pending', 'in_progress', 'assigned'].includes(req.status)
        ).length;
        
        // Calculate total recycled (assuming each request has a weight)
        const totalRecycled = requests
            .filter(req => req.status === 'completed')
            .reduce((sum, req) => sum + (req.total_weight || 0), 0);
        
        // Calculate carbon saved (rough estimate: 1kg waste = 0.5kg CO2 saved)
        const carbonSaved = totalRecycled * 0.5;
        
        // Calculate rewards (assuming points based on completed requests)
        const rewardsEarned = requests
            .filter(req => req.status === 'completed')
            .length * 50; // 50 points per completed request
        
        // Get next pickup date
        const upcomingPickups = requests
            .filter(req => ['pending', 'scheduled'].includes(req.status))
            .sort((a, b) => new Date(a.scheduled_date || a.created_at).getTime() - new Date(b.scheduled_date || b.created_at).getTime());
        
        const nextPickup = upcomingPickups.length > 0 
            ? new Date(upcomingPickups[0].scheduled_date || upcomingPickups[0].created_at).toISOString().split('T')[0]
            : 'No upcoming pickups';

        return {
            totalPickups,
            activePickups,
            totalRecycled: Math.round(totalRecycled * 100) / 100,
            carbonSaved: Math.round(carbonSaved * 100) / 100,
            rewardsEarned,
            nextPickup
        };
    }

    /**
     * Format recent activity from requests data
     */
    private formatRecentActivity(requests: any[]): CustomerActivity[] {
        const activities: CustomerActivity[] = [];
        
        // Add recent requests as activities
        requests.slice(0, 5).forEach((request, index) => {
            const activity: CustomerActivity = {
                id: request.id,
                type: 'pickup_' + request.status,
                title: this.getActivityTitle(request.status),
                description: this.getActivityDescription(request),
                time: this.getTimeAgo(request.created_at),
                status: this.mapRequestStatusToActivityStatus(request.status)
            };
            activities.push(activity);
        });

        // Add reward activities for completed requests
        const completedRequests = requests.filter(req => req.status === 'completed');
        if (completedRequests.length > 0) {
            activities.unshift({
                id: 999,
                type: 'reward_earned',
                title: 'Reward Earned',
                description: `Earned ${completedRequests.length * 50} points for recycling`,
                time: '2 days ago',
                status: 'reward'
            });
        }

        return activities;
    }

    /**
     * Get upcoming pickups
     */
    private getUpcomingPickups(requests: any[]): any[] {
        return requests
            .filter(req => ['pending', 'scheduled'].includes(req.status))
            .sort((a, b) => new Date(a.scheduled_date || a.created_at).getTime() - new Date(b.scheduled_date || b.created_at).getTime())
            .slice(0, 3);
    }

    /**
     * Calculate environmental impact
     */
    private calculateEnvironmentalImpact(requests: any[]): any {
        const totalWasteCollected = requests
            .filter(req => req.status === 'completed')
            .reduce((sum, req) => sum + (req.total_weight || 0), 0);
        
        const carbonFootprintReduced = totalWasteCollected * 0.5;
        const treesEquivalent = carbonFootprintReduced / 22; // 1 tree absorbs ~22kg CO2 per year

        return {
            totalWasteCollected: Math.round(totalWasteCollected * 100) / 100,
            carbonFootprintReduced: Math.round(carbonFootprintReduced * 100) / 100,
            treesEquivalent: Math.round(treesEquivalent * 100) / 100
        };
    }

    /**
     * Get mock smart bins data
     */
    private getMockSmartBins(): SmartBin[] {
        return [
            {
                id: 1,
                name: 'Kitchen Bin',
                location: 'Kitchen',
                fillLevel: 75,
                status: 'active',
                lastCollection: '2024-01-10',
                type: 'general'
            },
            {
                id: 2,
                name: 'Recycling Bin',
                location: 'Backyard',
                fillLevel: 45,
                status: 'active',
                lastCollection: '2024-01-08',
                type: 'recycling'
            },
            {
                id: 3,
                name: 'Compost Bin',
                location: 'Garden',
                fillLevel: 90,
                status: 'full',
                lastCollection: '2024-01-12',
                type: 'compost'
            },
            {
                id: 4,
                name: 'Battery Bin',
                location: 'Garage',
                fillLevel: 30,
                status: 'active',
                lastCollection: '2024-01-05',
                type: 'battery'
            },
            {
                id: 5,
                name: 'Electronics Bin',
                location: 'Office',
                fillLevel: 60,
                status: 'active',
                lastCollection: '2024-01-09',
                type: 'electronics'
            }
        ];
    }

    /**
     * Get mock campaigns data
     */
    private getMockCampaigns(): Campaign[] {
        return [
            {
                id: 1,
                title: 'Zero Waste Challenge',
                description: 'Join our 30-day zero waste challenge and earn bonus rewards',
                progress: 65,
                target: 100,
                reward: 500,
                endDate: '2024-02-15',
                type: 'challenge'
            },
            {
                id: 2,
                title: 'Recycling Hero',
                description: 'Recycle 50 items this month to become a recycling hero',
                progress: 32,
                target: 50,
                reward: 200,
                endDate: '2024-01-31',
                type: 'achievement'
            },
            {
                id: 3,
                title: 'Green Neighbor',
                description: 'Refer 3 friends and help them start their recycling journey',
                progress: 1,
                target: 3,
                reward: 300,
                endDate: '2024-02-28',
                type: 'referral'
            },
            {
                id: 4,
                title: 'Community Cleanup',
                description: 'Participate in local community cleanup events',
                progress: 2,
                target: 5,
                reward: 400,
                endDate: '2024-03-15',
                type: 'community'
            }
        ];
    }

    /**
     * Helper methods for activity formatting
     */
    private getActivityTitle(status: string): string {
        const titles: { [key: string]: string } = {
            'completed': 'Pickup Completed',
            'pending': 'Pickup Scheduled',
            'in_progress': 'Pickup In Progress',
            'assigned': 'Driver Assigned',
            'cancelled': 'Pickup Cancelled'
        };
        return titles[status] || 'Pickup Updated';
    }

    private getActivityDescription(request: any): string {
        const baseDescription = `Waste pickup ${request.status === 'completed' ? 'completed' : 'scheduled'}`;
        if (request.location) {
            return `${baseDescription} from ${request.location}`;
        }
        return baseDescription;
    }

    private getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return '1 day ago';
        return `${Math.floor(diffInHours / 24)} days ago`;
    }

    private mapRequestStatusToActivityStatus(status: string): CustomerActivity['status'] {
        const statusMap: { [key: string]: CustomerActivity['status'] } = {
            'completed': 'completed',
            'pending': 'scheduled',
            'in_progress': 'pending',
            'assigned': 'pending',
            'cancelled': 'pending'
        };
        return statusMap[status] || 'pending';
    }
}

export default new CustomerDashboardService();
