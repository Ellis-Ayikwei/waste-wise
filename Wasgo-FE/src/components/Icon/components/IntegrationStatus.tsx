import React, { useState, useEffect } from 'react';
import { IconCheck, IconX, IconAlertTriangle, IconRefresh, IconDatabase, IconWifi, IconShield } from '@tabler/icons-react';
import integrationTester, { IntegrationTestReport, IntegrationTestResult } from '../utils/integrationTest';

interface IntegrationStatusProps {
    showDetails?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
    showDetails = false,
    autoRefresh = true,
    refreshInterval = 30000 // 30 seconds
}) => {
    const [report, setReport] = useState<IntegrationTestReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const runTests = async () => {
        setIsLoading(true);
        try {
            const testReport = await integrationTester.runAllTests();
            setReport(testReport);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Integration test failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        runTests();

        if (autoRefresh) {
            const interval = setInterval(runTests, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass':
                return <IconCheck className="w-4 h-4 text-green-500" />;
            case 'fail':
                return <IconX className="w-4 h-4 text-red-500" />;
            case 'warning':
                return <IconAlertTriangle className="w-4 h-4 text-yellow-500" />;
            default:
                return <IconAlertTriangle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pass':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'fail':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    if (!report) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Backend Integration Status</h3>
                    <button
                        onClick={runTests}
                        disabled={isLoading}
                        className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        <IconRefresh className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Testing...' : 'Test Now'}
                    </button>
                </div>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Running integration tests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Backend Integration Status</h3>
                    <div className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.overallStatus)}`}>
                        {report.overallStatus.toUpperCase()}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {lastUpdated && (
                        <span className="text-xs text-gray-500">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={runTests}
                        disabled={isLoading}
                        className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        <IconRefresh className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Testing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{report.summary.total}</div>
                    <div className="text-xs text-gray-500">Total Tests</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{report.summary.passed}</div>
                    <div className="text-xs text-gray-500">Passed</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{report.summary.warnings}</div>
                    <div className="text-xs text-gray-500">Warnings</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{report.summary.failed}</div>
                    <div className="text-xs text-gray-500">Failed</div>
                </div>
            </div>

            {/* Quick Status */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <IconDatabase className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">API</span>
                    {getStatusIcon(report.results.find(r => r.test === 'API Connectivity')?.status || 'warning')}
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <IconWifi className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm font-medium">WebSocket</span>
                    {getStatusIcon(report.results.find(r => r.test === 'WebSocket Connectivity')?.status || 'warning')}
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <IconShield className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-sm font-medium">Auth</span>
                    {getStatusIcon(report.results.find(r => r.test.includes('Auth Endpoint'))?.status || 'warning')}
                </div>
            </div>

            {/* Detailed Results */}
            {showDetails && (
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Test Details</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {report.results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <div className="flex items-center">
                                    {getStatusIcon(result.status)}
                                    <span className="ml-2 text-sm text-gray-700">{result.test}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(result.status)}`}>
                                    {result.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {report.overallStatus !== 'pass' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Recommendations</h4>
                    <ul className="text-xs text-yellow-700 space-y-1">
                        {report.summary.failed > 0 && (
                            <li>• Check Django backend server is running on port 8000</li>
                        )}
                        {report.summary.warnings > 0 && (
                            <li>• Verify environment variables are properly configured</li>
                        )}
                        <li>• Ensure all required Django apps are installed and migrated</li>
                        <li>• Check CORS configuration allows admin dashboard domain</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default IntegrationStatus;
