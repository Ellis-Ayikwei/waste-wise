import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

export interface Coordinates {
    lat: number;
    lng: number;
}

interface LocationState {
    current: Coordinates | null; // device/user location
    base: Coordinates | null; // provider base location (optional)
    isTracking: boolean; // whether live tracking is active
    loading: boolean;
    error: string | null;
    updatedAt: number | null;
}

const initialState: LocationState = {
    current: null,
    base: null,
    isTracking: false,
    loading: false,
    error: null,
    updatedAt: null,
};

// Start live location tracking
export const startLiveTracking = createAsyncThunk<{ coords: Coordinates; watchId: number }, void>(
    'location/startLiveTracking',
    async (_, { rejectWithValue }) => {
        if (!navigator.geolocation) {
            return rejectWithValue('Geolocation not supported');
        }

        return new Promise<{ coords: Coordinates; watchId: number }>((resolve, reject) => {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    resolve({ coords, watchId });
                },
                (err) => reject(err),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 30000, // 30 seconds
                }
            );
        });
    }
);

// Stop live location tracking
export const stopLiveTracking = createAsyncThunk<void, number>(
    'location/stopLiveTracking',
    async (watchId, { rejectWithValue }) => {
        try {
            navigator.geolocation.clearWatch(watchId);
        } catch (err: any) {
            return rejectWithValue(err?.message || 'Failed to stop tracking');
        }
    }
);

// Get browser location and store it as current
export const setUserLocationFromBrowser = createAsyncThunk<Coordinates, void>(
    'location/setUserLocationFromBrowser',
    async (_, { rejectWithValue }) => {
        const coords = await new Promise<Coordinates>((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err)
            );
        });
        return coords;
    }
);

// Persist provider base location to backend, then update state
export const saveProviderBaseLocation = createAsyncThunk<Coordinates, { providerId: string; coords: Coordinates }>(
    'location/saveProviderBaseLocation',
    async ({ providerId, coords }, { rejectWithValue }) => {
        try {
            // Endpoint name is assumed; adjust as needed in backend
            await axiosInstance.post(`/providers/${providerId}/update_base_location/`, {
                latitude: coords.lat,
                longitude: coords.lng,
            });
            return coords;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || 'Failed to save base location');
        }
    }
);

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setCurrentLocation(state, action: PayloadAction<Coordinates | null>) {
            state.current = action.payload;
            state.updatedAt = Date.now();
        },
        setBaseLocation(state, action: PayloadAction<Coordinates | null>) {
            state.base = action.payload;
            state.updatedAt = Date.now();
        },
        setTrackingStatus(state, action: PayloadAction<boolean>) {
            state.isTracking = action.payload;
        },
        clearLocationError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUserLocationFromBrowser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setUserLocationFromBrowser.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
                state.updatedAt = Date.now();
            })
            .addCase(setUserLocationFromBrowser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Unable to get user location';
            })
            .addCase(saveProviderBaseLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveProviderBaseLocation.fulfilled, (state, action) => {
                state.loading = false;
                state.base = action.payload;
                state.updatedAt = Date.now();
            })
            .addCase(saveProviderBaseLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Failed to save base location';
            })
            .addCase(startLiveTracking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startLiveTracking.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload.coords;
                state.isTracking = true;
                state.updatedAt = Date.now();
            })
            .addCase(startLiveTracking.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Failed to start live tracking';
            })
            .addCase(stopLiveTracking.fulfilled, (state) => {
                state.isTracking = false;
            });
    },
});

export const { setCurrentLocation, setBaseLocation, setTrackingStatus, clearLocationError } = locationSlice.actions;

// Selectors
export const selectCurrentLocation = (state: any): Coordinates | null => state.location?.current ?? null;
export const selectBaseLocation = (state: any): Coordinates | null => state.location?.base ?? null;
export const selectIsTracking = (state: any): boolean => state.location?.isTracking ?? false;
export const selectLocationLoading = (state: any): boolean => state.location?.loading ?? false;
export const selectLocationError = (state: any): string | null => state.location?.error ?? null;

export default locationSlice.reducer;

// Store the active watch ID for cleanup
let activeWatchId: number | null = null;

// Update current location from watch position
export const updateCurrentLocation = (coords: Coordinates) => {
    return (dispatch: any) => {
        dispatch(setCurrentLocation(coords));
    };
};

// Enhanced start tracking that updates location continuously
export const startEnhancedTracking = () => {
    return async (dispatch: any) => {
        if (activeWatchId) {
            navigator.geolocation.clearWatch(activeWatchId);
        }

        if (!navigator.geolocation) {
            dispatch(setCurrentLocation(null));
            return;
        }

        activeWatchId = navigator.geolocation.watchPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                dispatch(updateCurrentLocation(coords));
            },
            (err) => {
                console.error('Live tracking error:', err);
                dispatch(setCurrentLocation(null));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000, // 5 seconds for real-time updates
            }
        );

        dispatch(setTrackingStatus(true));
    };
};

// Stop enhanced tracking
export const stopEnhancedTracking = () => {
    return (dispatch: any) => {
        if (activeWatchId) {
            navigator.geolocation.clearWatch(activeWatchId);
            activeWatchId = null;
        }
        dispatch(setTrackingStatus(false));
    };
};


