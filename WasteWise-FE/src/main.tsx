import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.layer.css';
import { DatesProvider } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { ContextMenuProvider } from 'mantine-contextmenu';
import 'mantine-contextmenu/styles.css';
import 'mantine-datatable/styles.layer.css';
import React, { Suspense } from 'react';
import createRefresh from 'react-auth-kit/createRefresh';
import ReactDOM from 'react-dom/client';
import './layout.css';
// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// Custom component styles
import './assets/css/service-cards.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import { Provider } from 'react-redux';
import store from './store/index';
import { ChatProvider } from './contexts/ChatContext';
import authAxiosInstance from './services/authAxiosInstance';

// Dynamic imports for non-critical paths
const i18n = import('./i18n');

// Memoized auth configuration
// const refresh = createRefresh({
//   interval: 60,
//   refreshApiCallback: async (param) => {
//     try {
//       const response = await authAxiosInstance('/refresh_token/', param);
//       return {
//         isSuccess: true,
//         newAuthToken: response.data.token,
//         newAuthTokenExpireIn: 60,
//         newRefreshTokenExpiresIn: 3600,
//       };
//     } catch (error) {
//       console.error(error);
//       return { isSuccess: false, newAuthToken: '' };
//     }
//   },
// });

const authStore = createStore({
    authType: 'cookie',
    authName: '_auth',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
    debug: true,
    refresh: createRefresh({
        interval: 60,
        refreshApiCallback: async () => {
            try {
                const response = await authAxiosInstance.post('/refresh_token/', {
                    withCredentials: true,
                    // Automatically sends refresh cookie
                });
                return {
                    isSuccess: true,
                    newAuthToken: response.headers.authorization,
                    newAuthTokenExpireIn: 1900, // 15 minutes
                };
            } catch (error) {
                console.log('Error refreshing token:', error);
                window.location.href = '/';
                return {
                    isSuccess: false,
                    newAuthToken: '', // Ensure newAuthToken is always a string
                    newAuthTokenExpireIn: undefined,
                };
            }
        },
    }),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            <ColorSchemeScript defaultColorScheme="auto" />
            <MantineProvider withGlobalClasses>
                <ContextMenuProvider zIndex={5000} shadow="md" borderRadius="md">
                    <DatesProvider settings={{ locale: 'en' }}>
                        <Provider store={store}>
                            <AuthProvider store={authStore}>
                                <ChatProvider>
                                    {/* <PersistGate loading={null} persistor={persistor}> */}
                                    <RouterProvider router={router} />
                                    {/* </PersistGate> */}
                                </ChatProvider>
                            </AuthProvider>
                        </Provider>
                    </DatesProvider>
                </ContextMenuProvider>
            </MantineProvider>
        </Suspense>
    </React.StrictMode>
);
