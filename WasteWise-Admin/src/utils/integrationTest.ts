/**
 * Integration Test Utility for Admin Dashboard Backend Connectivity
 */

import axiosInstance from '../services/axiosInstance';
import { mapEndpoint } from '../services/apiMapping';
import websocketService from '../services/websocketService';

export interface IntegrationTestResult {
    test: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    details?: any;
}

export interface IntegrationTestReport {
    timestamp: string;
    overallStatus: 'pass' | 'fail' | 'warning';
    results: IntegrationTestResult[];
    summary: {
        total: number;
        passed: number;
        failed: number;
        warnings: number;
    };
}

class IntegrationTester {
    private results: IntegrationTestResult[] = [];

    /**
     * Run all integration tests
     */
    public async runAllTests(): Promise<IntegrationTestReport> {
        console.log('[Integration Test] Starting comprehensive backend integration tests...');
        
        this.results = [];
        
        // Test environment configuration
        await this.testEnvironmentConfig();
        
        // Test API connectivity
        await this.testAPIConnectivity();
        
        // Test authentication endpoints
        await this.testAuthenticationEndpoints();
        
        // Test core API endpoints
        await this.testCoreEndpoints();
        
        // Test WebSocket connectivity
        await this.testWebSocketConnectivity();
        
        // Test data transformation
        await this.testDataTransformation();
        
        // Generate report
        return this.generateReport();
    }

    /**
     * Test environment configuration
     */
    private async testEnvironmentConfig(): Promise<void> {
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
            this.addResult('Environment Configuration', 'fail', 'VITE_API_URL not configured');
            return;
        }
        
        this.addResult('Environment Configuration', 'pass', `API URL configured: ${apiUrl}`);
    }

    /**
     * Test basic API connectivity
     */
    private async testAPIConnectivity(): Promise<void> {
        try {
            const response = await axiosInstance.get('waste/bins/');
            this.addResult('API Connectivity', 'pass', 'Successfully connected to Django backend', {
                status: response.status,
                dataCount: Array.isArray(response.data) ? response.data.length : 'N/A'
            });
        } catch (error: any) {
            this.addResult('API Connectivity', 'fail', 'Failed to connect to Django backend', {
                error: error.message,
                status: error.response?.status
            });
        }
    }

    /**
     * Test authentication endpoints
     */
    private async testAuthenticationEndpoints(): Promise<void> {
        const authEndpoints = [
            'auth/login/',
            'auth/register/',
            'auth/refresh_token/',
            'auth/verify_token/'
        ];

        for (const endpoint of authEndpoints) {
            try {
                const response = await axiosInstance.get(endpoint);
                this.addResult(`Auth Endpoint: ${endpoint}`, 'pass', 'Endpoint accessible');
            } catch (error: any) {
                if (error.response?.status === 405) {
                    // Method not allowed is expected for GET on POST endpoints
                    this.addResult(`Auth Endpoint: ${endpoint}`, 'pass', 'Endpoint exists (method not allowed for GET)');
                } else {
                    this.addResult(`Auth Endpoint: ${endpoint}`, 'warning', 'Endpoint may not be accessible', {
                        error: error.message,
                        status: error.response?.status
                    });
                }
            }
        }
    }

    /**
     * Test core API endpoints
     */
    private async testCoreEndpoints(): Promise<void> {
        const coreEndpoints = [
            { admin: 'admin/smart-bins', django: 'waste/bins/' },
            { admin: 'users/', django: 'auth/users/' },
            { admin: 'providers/', django: 'provider/providers/' },
            { admin: 'jobs/', django: 'jobs/' },
            { admin: 'requests/', django: 'requests/' },
            { admin: 'payments/', django: 'payment/payments/' },
            { admin: 'admin/analytics', django: 'waste/analytics/dashboard_metrics/' }
        ];

        for (const endpoint of coreEndpoints) {
            try {
                const mappedUrl = mapEndpoint(endpoint.admin);
                const response = await axiosInstance.get(endpoint.django);
                
                this.addResult(`Core Endpoint: ${endpoint.admin}`, 'pass', 'Endpoint accessible', {
                    mappedUrl,
                    status: response.status,
                    hasData: !!response.data
                });
            } catch (error: any) {
                this.addResult(`Core Endpoint: ${endpoint.admin}`, 'warning', 'Endpoint may not be accessible', {
                    error: error.message,
                    status: error.response?.status
                });
            }
        }
    }

    /**
     * Test WebSocket connectivity
     */
    private async testWebSocketConnectivity(): Promise<void> {
        const isConnected = websocketService.getConnectionStatus();
        
        if (isConnected) {
            this.addResult('WebSocket Connectivity', 'pass', 'WebSocket connection established');
        } else {
            this.addResult('WebSocket Connectivity', 'warning', 'WebSocket connection not established (may be normal in development)');
        }
    }

    /**
     * Test data transformation
     */
    private async testDataTransformation(): Promise<void> {
        // Test smart bin data transformation
        const mockSmartBinData = {
            id: 1,
            name: 'Test Bin',
            fill_level: 75,
            temperature: 22.5,
            battery_level: 85,
            signal_strength: 90,
            status: 'active',
            created_at: '2024-01-15T10:00:00Z'
        };

        const { transformResponse } = await import('../services/apiMapping');
        const transformed = transformResponse([mockSmartBinData], 'admin/smart-bins');

        if (transformed[0]?.fillLevel === 75) {
            this.addResult('Data Transformation', 'pass', 'Smart bin data transformation working');
        } else {
            this.addResult('Data Transformation', 'fail', 'Smart bin data transformation failed');
        }
    }

    /**
     * Add test result
     */
    private addResult(test: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any): void {
        this.results.push({
            test,
            status,
            message,
            details
        });
    }

    /**
     * Generate test report
     */
    private generateReport(): IntegrationTestReport {
        const total = this.results.length;
        const passed = this.results.filter(r => r.status === 'pass').length;
        const failed = this.results.filter(r => r.status === 'fail').length;
        const warnings = this.results.filter(r => r.status === 'warning').length;

        let overallStatus: 'pass' | 'fail' | 'warning' = 'pass';
        if (failed > 0) {
            overallStatus = 'fail';
        } else if (warnings > 0) {
            overallStatus = 'warning';
        }

        const report: IntegrationTestReport = {
            timestamp: new Date().toISOString(),
            overallStatus,
            results: this.results,
            summary: {
                total,
                passed,
                failed,
                warnings
            }
        };

        console.log('[Integration Test] Report:', report);
        return report;
    }

    /**
     * Test specific endpoint
     */
    public async testEndpoint(adminEndpoint: string): Promise<IntegrationTestResult> {
        try {
            const mappedUrl = mapEndpoint(adminEndpoint);
            const response = await axiosInstance.get(mappedUrl);
            
            return {
                test: `Endpoint: ${adminEndpoint}`,
                status: 'pass',
                message: 'Endpoint accessible',
                details: {
                    mappedUrl,
                    status: response.status,
                    hasData: !!response.data
                }
            };
        } catch (error: any) {
            return {
                test: `Endpoint: ${adminEndpoint}`,
                status: 'fail',
                message: 'Endpoint not accessible',
                details: {
                    error: error.message,
                    status: error.response?.status
                }
            };
        }
    }
}

// Create singleton instance
const integrationTester = new IntegrationTester();

export default integrationTester;
