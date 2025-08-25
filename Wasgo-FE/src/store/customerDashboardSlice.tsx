import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import customerDashboardService, { 
    CustomerDashboardData, 
    CustomerStats, 
    CustomerActivity,
    SmartBin,
    Campaign
} from '../services/customerDashboardService';

// Define the state interface
interface CustomerDashboardState {
    data: CustomerDashboardData | null;
    loading: boolean;
    error: string | null;
    stats: CustomerStats | null;
    recentActivity: CustomerActivity[];
    upcomingPickups: any[];
    smartBins: SmartBin[];
    campaigns: Campaign[];
    environmentalImpact: {
        totalWasteCollected: number;
        carbonFootprintReduced: number;
        treesEquivalent: number;
    } | null;
}

// Initial state
const initialState: CustomerDashboardState = {
    data: null,
    loading: false,
    error: null,
    stats: null,
    recentActivity: [],
    upcomingPickups: [],
    smartBins: [],
    campaigns: [],
    environmentalImpact: null
};

// Async thunk for fetching customer dashboard data
export const fetchCustomerDashboard = createAsyncThunk(
    'customerDashboard/fetchData',
    async (customerId: string, { rejectWithValue }) => {
        try {
            const data = await customerDashboardService.getCustomerDashboard(customerId);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    }
);

// Async thunk for fetching customer requests
export const fetchCustomerRequests = createAsyncThunk(
    'customerDashboard/fetchRequests',
    async ({ customerId, status }: { customerId: string; status?: string }, { rejectWithValue }) => {
        try {
            const data = await customerDashboardService.getCustomerRequests(customerId, status);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
        }
    }
);

// Async thunk for fetching customer profile
export const fetchCustomerProfile = createAsyncThunk(
    'customerDashboard/fetchProfile',
    async (customerId: string, { rejectWithValue }) => {
        try {
            const data = await customerDashboardService.getCustomerProfile(customerId);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Async thunk for fetching smart bins
export const fetchSmartBins = createAsyncThunk(
    'customerDashboard/fetchSmartBins',
    async (customerId: string, { rejectWithValue }) => {
        try {
            const data = await customerDashboardService.getSmartBins(customerId);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch smart bins');
        }
    }
);

// Async thunk for fetching campaigns
export const fetchCampaigns = createAsyncThunk(
    'customerDashboard/fetchCampaigns',
    async (customerId: string, { rejectWithValue }) => {
        try {
            const data = await customerDashboardService.getCampaigns(customerId);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch campaigns');
        }
    }
);

// Create the slice
const customerDashboardSlice = createSlice({
    name: 'customerDashboard',
    initialState,
    reducers: {
        clearDashboardData: (state) => {
            state.data = null;
            state.stats = null;
            state.recentActivity = [];
            state.upcomingPickups = [];
            state.smartBins = [];
            state.campaigns = [];
            state.environmentalImpact = null;
            state.error = null;
        },
        updateStats: (state, action: PayloadAction<CustomerStats>) => {
            state.stats = action.payload;
        },
        addActivity: (state, action: PayloadAction<CustomerActivity>) => {
            state.recentActivity.unshift(action.payload);
            // Keep only the latest 10 activities
            if (state.recentActivity.length > 10) {
                state.recentActivity = state.recentActivity.slice(0, 10);
            }
        },
        updateActivity: (state, action: PayloadAction<{ id: number; updates: Partial<CustomerActivity> }>) => {
            const { id, updates } = action.payload;
            const activityIndex = state.recentActivity.findIndex(activity => activity.id === id);
            if (activityIndex !== -1) {
                state.recentActivity[activityIndex] = {
                    ...state.recentActivity[activityIndex],
                    ...updates
                };
            }
        },
        removeActivity: (state, action: PayloadAction<number>) => {
            state.recentActivity = state.recentActivity.filter(activity => activity.id !== action.payload);
        },
        updateSmartBin: (state, action: PayloadAction<{ id: number; updates: Partial<SmartBin> }>) => {
            const { id, updates } = action.payload;
            const binIndex = state.smartBins.findIndex(bin => bin.id === id);
            if (binIndex !== -1) {
                state.smartBins[binIndex] = {
                    ...state.smartBins[binIndex],
                    ...updates
                };
            }
        },
        updateCampaign: (state, action: PayloadAction<{ id: number; updates: Partial<Campaign> }>) => {
            const { id, updates } = action.payload;
            const campaignIndex = state.campaigns.findIndex(campaign => campaign.id === id);
            if (campaignIndex !== -1) {
                state.campaigns[campaignIndex] = {
                    ...state.campaigns[campaignIndex],
                    ...updates
                };
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Handle fetchCustomerDashboard
        builder
            .addCase(fetchCustomerDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.stats = action.payload.stats;
                state.recentActivity = action.payload.recentActivity;
                state.upcomingPickups = action.payload.upcomingPickups;
                state.smartBins = action.payload.smartBins;
                state.campaigns = action.payload.campaigns;
                state.environmentalImpact = action.payload.environmentalImpact;
                state.error = null;
            })
            .addCase(fetchCustomerDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
        // Handle fetchCustomerRequests
        builder
            .addCase(fetchCustomerRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerRequests.fulfilled, (state, action) => {
                state.loading = false;
                // Update stats based on new requests data
                if (action.payload && action.payload.length > 0) {
                    const stats = customerDashboardService.calculateStats(action.payload);
                    state.stats = stats;
                }
                state.error = null;
            })
            .addCase(fetchCustomerRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
        // Handle fetchCustomerProfile
        builder
            .addCase(fetchCustomerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Profile data could be stored separately if needed
                state.error = null;
            })
            .addCase(fetchCustomerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
        // Handle fetchSmartBins
        builder
            .addCase(fetchSmartBins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSmartBins.fulfilled, (state, action) => {
                state.loading = false;
                state.smartBins = action.payload;
                state.error = null;
            })
            .addCase(fetchSmartBins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
        // Handle fetchCampaigns
        builder
            .addCase(fetchCampaigns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCampaigns.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = action.payload;
                state.error = null;
            })
            .addCase(fetchCampaigns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

// Export actions
export const {
    clearDashboardData,
    updateStats,
    addActivity,
    updateActivity,
    removeActivity,
    updateSmartBin,
    updateCampaign,
    setLoading,
    setError
} = customerDashboardSlice.actions;

// Export selectors
export const selectCustomerDashboard = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.data;

export const selectCustomerStats = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.stats;

export const selectCustomerRecentActivity = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.recentActivity;

export const selectCustomerUpcomingPickups = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.upcomingPickups;

export const selectCustomerSmartBins = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.smartBins;

export const selectCustomerCampaigns = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.campaigns;

export const selectCustomerEnvironmentalImpact = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.environmentalImpact;

export const selectCustomerDashboardLoading = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.loading;

export const selectCustomerDashboardError = (state: { customerDashboard: CustomerDashboardState }) => 
    state.customerDashboard.error;

// Export reducer
export default customerDashboardSlice.reducer;
