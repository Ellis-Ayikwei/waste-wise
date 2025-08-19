import axios from 'axios';

// const authApiUrl = 'https://127.0.0.1/sc/api/v1';
export const authApiUrl = import.meta.env.VITE_API_URL + 'auth';

//export const authApiUrl = 'http://127.0.0.1:5004/alumni/api/v1/auth';
//const authApiUrl = 'http://172.20.10.4:5004/alumni/api/v1/auth';

export const getCookie = (name: string): string | undefined => {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();
            return cookieValue ? decodeURIComponent(cookieValue) : undefined;
        }
        return undefined;
    } catch (error) {
        console.error(`Error getting cookie ${name}:`, error);
        return undefined;
    }
};

// Get JWT token from localStorage (Django JWT approach)
export const getJWTToken = (): string | null => {
    return localStorage.getItem('access_token');
};

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

// Set JWT token in localStorage
export const setJWTToken = (token: string): void => {
    localStorage.setItem('access_token', token);
};

// Set refresh token in localStorage
export const setRefreshToken = (token: string): void => {
    localStorage.setItem('refresh_token', token);
};

// Remove JWT tokens
export const removeJWTTokens = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

const authAxiosInstance = axios.create({
    baseURL: authApiUrl,
    withCredentials: false, // Changed to false for JWT
    headers: {
        'Content-Type': 'application/json',
    },
});

// Enhanced interceptor with JWT token handling
authAxiosInstance.interceptors.request.use(
    (config) => {
        try {
            const token = getJWTToken();
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Add user ID to request data if it exists
            const userId = localStorage.getItem('userId');
            if (userId && !config.data) {
                config.data = { user_id: userId };
            } else if (userId) {
                config.data = { ...config.data, user_id: userId };
            }
            
            return config;
        } catch (error) {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for JWT token refresh
authAxiosInstance.interceptors.response.use(
    (response) => {
        try {
            // Check for new tokens in response headers
            const newAccessToken = response.headers['new-access-token'];
            const newRefreshToken = response.headers['new-refresh-token'];
            
            if (newAccessToken) {
                setJWTToken(newAccessToken);
            }
            if (newRefreshToken) {
                setRefreshToken(newRefreshToken);
            }
            
            return response;
        } catch (error) {
            console.error('Response interceptor error:', error);
            return response;
        }
    },
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 error and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    // Try to refresh the token
                    const response = await axios.post(`${authApiUrl}/refresh_token/`, {
                        refresh: refreshToken
                    });
                    
                    if (response.data.access) {
                        setJWTToken(response.data.access);
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        return authAxiosInstance(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear tokens and redirect to login
                removeJWTTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default authAxiosInstance;
