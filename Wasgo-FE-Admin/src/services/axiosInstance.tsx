import axios from 'axios';
import { getJWTToken, getRefreshToken, setJWTToken, removeJWTTokens } from './authAxiosInstance';

export const apiUrl = import.meta.env.VITE_API_URL;
//const apiUrl = 'http://172.20.10.4:5004/alumni/api/v1';

const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: false, // Changed to false for JWT
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getJWTToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!config.data) {
            config.data = {
                user_id: localStorage.getItem('userId') ?? 'default_user_id',
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(new Error(error.message));
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('intercepting response');
        if (error.response?.status === 401) {
            const originalRequest = error.config;
            
            // If we haven't tried to refresh yet
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                
                try {
                    const refreshToken = getRefreshToken();
                    if (refreshToken) {
                        // Try to refresh the token
                        const response = await axios.post(`${apiUrl}auth/refresh_token/`, {
                            refresh: refreshToken
                        });
                        
                        if (response.data.access) {
                            setJWTToken(response.data.access);
                            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                            return axiosInstance(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Clear tokens and redirect to login
                    removeJWTTokens();
                    const currentPath = window.location.pathname + window.location.search;
                    window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
