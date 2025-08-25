import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ShowRequestError from '../helper/showRequestError';
import axiosInstance from '../services/axiosInstance';
import authAxiosInstance from '../services/authAxiosInstance';
import { getDeviceInfo, getOrCreateDeviceId } from '../utils/deviceFingerprint';

interface AuthState {
    isLoggedIn: boolean;
    loading: boolean;
    user: any | null;
    error: string | null;
    message: string | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    loading: false,
    user: null,
    error: null,
    message: null,
};

const ERROR_MESSAGES = {
    DEFAULT: 'An error occurred',
    LOGIN_FAILED: 'Invalid username or password',
    REGISTER_FAILED: 'signup failed. Please try again.',
    RESET_PASSWORD_FAILED: 'Failed to reset the password. Please try again.',
    FORGOT_PASSWORD_FAILED: 'Failed to request password reset. Please try again.',
};

export const LoginUser = createAsyncThunk('auth/LoginUser', async ({ email_or_phone, password, extra }: { email_or_phone: string; password: string; extra?: any }, { rejectWithValue }) => {
    const payload = { email_or_phone, password };

    try {
        const response = await authAxiosInstance.post('/login/', payload);

        const accessToken = response?.headers['authorization'];
        const refreshToken = response?.headers['x-refresh-token'];
        console.log('the response...............SS', accessToken, refreshToken);

        const user = response.data;

        // if (!accessToken |.............| !refreshToken) {
        //     console.error('Error: Missing tokens from server response');
        //     throw new Error('Invalid token response from server');
        // }

        const { signIn } = extra;
        const isSignedIn = signIn({
            auth: {
                token: accessToken,
                type: 'Bearer',
            },
            refresh: refreshToken,
            userState: user,
        });
        localStorage.setItem('userId', user?.id);

        if (!isSignedIn) {
            console.error('Frontend sign-in failed');
            throw new Error('Frontend sign-in failed');
        }

        return user;
    } catch (error: any) {
        ShowRequestError(error);
        console.error('Error during login:', error);

        // Handle different error response formats
        let errorMessage = 'An error occurred';
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                // Handle HTML error responses
                const parser = new DOMParser();
                const errorData = error.response.data;
                const doc = parser.parseFromString(errorData, 'text/html');
                const errorMess = doc.querySelector('body')?.innerText ?? 'An error occurred';
                errorMessage = errorMess.split('\n')[1] || errorMess;
            } else if (error.response.data.detail) {
                // Handle JSON error responses
                errorMessage = error.response.data.detail;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        }

        return rejectWithValue(errorMessage);
    }
});


export const MfaLoginUser = createAsyncThunk('auth/MfaLoginUser', async (
    { email_or_phone, password, extra }: { email_or_phone: string; password: string; extra?: any },
    { rejectWithValue }
) => {
    // Attach device context for trusted-device fast-path
    const { device_id, device_name, fingerprint, device_info } = getDeviceInfo();
    getOrCreateDeviceId();
    const payload = { email_or_phone, password, device_id, device_name, fingerprint, device_info };

    try {
        const response = await authAxiosInstance.post('/mfa/login/', payload);
        const data = response.data;
        console.log('the data...............SS', data);

        // Fast-path: trusted device recognized, backend returns tokens directly
        if (response.status === 200 && data && data.requires_otp === false) {
            const accessToken = response?.headers['authorization'];
            const refreshToken = response?.headers['x-refresh-token'];
            const user = response.data;

            if (extra && extra.signIn) {
                const { signIn } = extra;
                
                const isSignedIn = signIn({
                    auth: {
                        token: accessToken,
                        type: 'Bearer',
                    },
                    refresh: refreshToken,
                    userState: user,
                });
                localStorage.setItem('userId', user?.id);
                if (!isSignedIn) {
                    throw new Error('Frontend sign-in failed');
                }
            }

            return {
                success: true,
                requires_otp: false,
                user,
            };
        }

        // Default path: proceed to OTP verification
        if (response.status === 200 && data.next_step === 'verify_otp') {
            return {
                success: true,
                message: data.message,
                masked_email: data.masked_email,
                validity_minutes: data.validity_minutes,
                user_id: data.user_id,
                session_id: data.session_id,
                next_step: 'verify_otp'
            };
        }

        // If we get here, something unexpected happened
        throw new Error('Unexpected response from server');

    } catch (error: any) {
        console.error('MFA Login Error:', error);
        
        // Handle different error response formats
        let errorMessage = 'MFA login failed. Please try again.';
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                // Handle HTML error responses
                const parser = new DOMParser();
                const errorData = error.response.data;
                const doc = parser.parseFromString(errorData, 'text/html');
                const errorMess = doc.querySelector('body')?.innerText ?? 'An error occurred';
                errorMessage = errorMess.split('\n')[1] || errorMess;
            } else if (error.response.data.detail) {
                // Handle JSON error responses
                errorMessage = error.response.data.detail;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        }
        
        return rejectWithValue(errorMessage);
    }
});


export const VerifyMfaLogin = createAsyncThunk(
    'auth/VerifyMfaLogin',
    async (
        {
            email_or_phone,
            otp_code,
            extra,
            trust_device,
            device_id,
            device_name,
            fingerprint,
            user_id,
            session_id,
            device_info,
        }: {
            email_or_phone?: string;
            otp_code: string;
            extra?: any;
            trust_device?: boolean;
            device_id?: string;
            device_name?: string;
            fingerprint?: string;
            user_id?: string;
            session_id?: string;
            device_info?: any;
        },
        { rejectWithValue }
    ) => {
    const payload: any = {
        email_or_phone,
        user_id,
        session_id,
        otp_code,
        otp_type: 'login',
        trust_device: Boolean(trust_device),
        device_id,
        device_name,
        fingerprint,
        device_info,
    };

    try {
        const response = await authAxiosInstance.post('mfa/verify/', payload);

        const accessToken = response?.headers['authorization'];
        const refreshToken = response?.headers['x-refresh-token'];
        console.log('the response...............SS', accessToken, refreshToken);

        const user = response.data.user; // Backend returns { user: {...} }

        // if (!accessToken |.............| !refreshToken) {
        //     console.error('Error: Missing tokens from server response');
        //     throw new Error('Invalid token response from server');
        // }

        const { signIn } = extra;
        const isSignedIn = signIn({
            auth: {
                token: accessToken,
                type: 'Bearer',
            },
            refresh: refreshToken,
            userState: user,
        });
        localStorage.setItem('userId', user?.id);

        if (!isSignedIn) {
            console.error('Frontend sign-in failed');
            throw new Error('Frontend sign-in failed');
        }

        return user;
    } catch (error: any) {
        console.error('Error during MFA verification:', error);

        // Handle different error response formats
        let errorMessage = 'MFA verification failed. Please try again.';
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                // Handle HTML error responses
                const parser = new DOMParser();
                const errorData = error.response.data;
                const doc = parser.parseFromString(errorData, 'text/html');
                const errorMess = doc.querySelector('body')?.innerText ?? 'An error occurred';
                errorMessage = errorMess.split('\n')[1] || errorMess;
            } else if (error.response.data.detail) {
                // Handle JSON error responses
                errorMessage = error.response.data.detail;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        }

        return rejectWithValue(errorMessage);
    }
});


export const LogoutUser = createAsyncThunk('auth/LogoutUser', async (extra: any, { dispatch }) => {
    try {
        console.log(authAxiosInstance.defaults.headers.Authorization);
        const response = await authAxiosInstance.post('/logout/');

        if (response.status === 200) {
            dispatch(resetAuth());
            const { signOut } = extra;
            signOut();
        }
    } catch (error: any) {
        console.error('Logout error:', error);
        throw new Error(error.response?.data?.message || ERROR_MESSAGES.DEFAULT);
    }
});

export const RegisterUser = createAsyncThunk(
    'auth/RegisterUser',
    async ({ email, password, password2, first_name, last_name, phone_number, accountType }: { 
        email: string; 
        password: string; 
        password2: string; 
        first_name: string; 
        last_name: string; 
        phone_number: string; 
        accountType: string 
    }, { rejectWithValue }) => {
        const payload = { 
            email, 
            password, 
            password2, 
            first_name, 
            last_name, 
            phone_number, 
            account_type: accountType 
        };
        
        try {
            const response = await authAxiosInstance.post('/register/', payload);
            return response.data;
        } catch (error: any) {
            ShowRequestError(error);
            console.error('Error during register:', error);
    
            // Handle different error response formats
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    // Handle HTML error responses
                    const parser = new DOMParser();
                    const errorData = error.response.data;
                    const doc = parser.parseFromString(errorData, 'text/html');
                    const errorMess = doc.querySelector('body')?.innerText ?? 'An error occurred';
                    errorMessage = errorMess.split('\n')[1] || errorMess;
                } else if (error.response.data.message) {
                    // Handle JSON error responses
                    errorMessage = error.response.data.message;
                } else if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                }
            }
    
            return rejectWithValue(errorMessage);
        }
    }
);

export const ProviderRegisterUser = createAsyncThunk(
    'auth/RegisterUser',
    async (providerPayload: any, { rejectWithValue }) => {
        try {
            const response = await authAxiosInstance.post('/register/provider/', providerPayload);
            return response;
        } catch (error: any) {
            console.error('Error during register:', error);
    
            const parser = new DOMParser();
            const errorData = error.response.data;
            const doc = parser.parseFromString(errorData, 'text/html');
            const errorMess = doc.querySelector('body')?.innerText ?? 'An error occurred';
            const errorMessage = errorMess.split('\n')[1];
    
            return rejectWithValue(error);
        }
    }
);

export const ForgetPassword = createAsyncThunk('auth/ForgetPassword', async ({ email }: { email: string }) => {
    try {
        const response = await authAxiosInstance.post('/forget_password/', { email });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || ERROR_MESSAGES.FORGOT_PASSWORD_FAILED);
    }
});

export const ResetPassword = createAsyncThunk('auth/ResetPassword', async ({ password, uidb64, token }: { password: string; uidb64:string, token: string }) => {
    try {
        const response = await authAxiosInstance.post('/reset_password/uidb64/token/', { password, uidb64, token });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || ERROR_MESSAGES.RESET_PASSWORD_FAILED);
    }
});

export const SendOTP = createAsyncThunk('auth/SendOTP', async ({ email, type }: { email: string; type: 'signup' | 'login' }) => {
    try {
        const endpoint = type === 'signup' ? '/send_signup_otp/' : '/send_login_otp/';
        const response = await authAxiosInstance.post(endpoint, { email });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
});

export const VerifyOTP = createAsyncThunk('auth/VerifyOTP', async ({ email, otp, type }: { email: string; otp: string; type: 'signup' | 'login' }, { rejectWithValue }) => {
    try {
        const response = await authAxiosInstance.post("/otp/verify/", { email, otp_code:otp, otp_type: type });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error || 'Invalid OTP code');
    }
});

export const ResendOTP = createAsyncThunk('auth/ResendOTP', async ({ email, otp_type }: { email: string; otp_type: string }, { rejectWithValue }) => {
    try {
        const response = await authAxiosInstance.post("otp/resend/", { email, otp_type });
        return response.data;
    } catch (error: any) {
        console.error('Error during resend OTP:', error);

        const parser = new DOMParser();
        const errorData = error.response.data;
        const doc = parser.parseFromString(errorData, 'text/html');
        const errorMess = doc.querySelector('body')?.innerText ?? 'An error occurred';
        const errorMessage = errorMess.split('\n')[1];

        return rejectWithValue(error);
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                console.log('the state user', state.user);
                state.isLoggedIn = true;
                localStorage.setItem('userRole', state.user.role);
                state.loading = false;
                state.message = 'Login successful';
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? ERROR_MESSAGES.LOGIN_FAILED;
                state.message = null;
            })
            .addCase(LogoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(LogoutUser.fulfilled, (state) => {
                state.user = null;
                state.isLoggedIn = false;
                state.loading = false;
                state.message = 'Logged out successfully';
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || ERROR_MESSAGES.DEFAULT;
            })
            .addCase(RegisterUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.loading = false;
            })
            .addCase(RegisterUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || ERROR_MESSAGES.REGISTER_FAILED;
                state.message = null;
            })
            .addCase(ForgetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(ForgetPassword.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.loading = false;
            })
            .addCase(ForgetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || ERROR_MESSAGES.FORGOT_PASSWORD_FAILED;
                state.message = null;
            })
            .addCase(ResetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(ResetPassword.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.loading = false;
            })
            .addCase(ResetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || ERROR_MESSAGES.RESET_PASSWORD_FAILED;
                state.message = null;
            })
            .addCase(SendOTP.pending, (state) => {
                state.loading = true;
            })
            .addCase(SendOTP.fulfilled, (state, action) => {
                state.message = action.payload.message || 'OTP sent successfully';
                state.loading = false;
                state.error = null;
            })
            .addCase(SendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to send OTP';
                state.message = null;
            })
            .addCase(VerifyOTP.pending, (state) => {
                state.loading = true;
            })
            .addCase(VerifyOTP.fulfilled, (state, action) => {
                state.message = action.payload.message || 'OTP verified successfully';
                state.loading = false;
                state.error = null;
            })
            .addCase(VerifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Invalid OTP code';
                state.message = null;
            })
            .addCase(ResendOTP.pending, (state) => {
                state.loading = true;
            })
            .addCase(ResendOTP.fulfilled, (state, action) => {
                state.message = action.payload.message || 'OTP resent successfully';
                state.loading = false;
                state.error = null;
            })
            .addCase(ResendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to resend OTP';
                state.message = null;
            });
    },
});

export const { resetAuth } = authSlice.actions;

export default authSlice.reducer;
