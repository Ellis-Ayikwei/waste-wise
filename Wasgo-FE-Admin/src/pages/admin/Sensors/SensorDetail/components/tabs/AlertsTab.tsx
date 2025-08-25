import React from 'react';
import { IconLoader2, IconCheck } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/Card';
import { Badge } from '../../../../../../components/ui/Badge';
import { Button } from '../../../../../../components/ui/Button';

interface SensorAlert {
    id: string;
    sensor: string; // Changed from sensor_id to sensor
    alert_type: 'battery_low' | 'signal_weak' | 'offline' | 'error' | 'maintenance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    is_resolved: boolean;
    resolved_at: string | null;
}

interface AlertsTabProps {
    alerts: SensorAlert[] | undefined | null;
    loading: boolean;
}

const AlertsTab: React.FC<AlertsTabProps> = ({ alerts, loading }) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getAlertTypeColor = (type: string) => {
        switch (type) {
            case 'battery_low':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'signal_weak':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'offline':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'error':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'maintenance':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const handleResolveAlert = (alertId: string) => {
        // TODO: Implement resolve alert functionality
        console.log('Resolve alert:', alertId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <IconLoader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading alerts...</span>
            </div>
        );
    }

    // Ensure alerts is an array and has items
    if (!Array.isArray(alerts) || alerts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No alerts for this sensor.</p>
            </div>
        );
    }

    const activeAlerts = alerts.filter(alert => !alert.is_resolved);
    const resolvedAlerts = alerts.filter(alert => alert.is_resolved);

    return (
        <div className="space-y-6">
            {/* Active Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Active Alerts</span>
                        <Badge variant="destructive">{activeAlerts.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activeAlerts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No active alerts</p>
                    ) : (
                        <div className="space-y-4">
                            {activeAlerts.map((alert) => (
                                <div 
                                    key={alert.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Badge 
                                                variant="default" 
                                                className={getAlertTypeColor(alert.alert_type)}
                                            >
                                                {alert.alert_type.replace('_', ' ')}
                                            </Badge>
                                            <Badge 
                                                variant="default" 
                                                className={getSeverityColor(alert.severity)}
                                            >
                                                {alert.severity}
                                            </Badge>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleResolveAlert(alert.id)}
                                            className="flex items-center space-x-1"
                                        >
                                            <IconCheck className="w-3 h-3" />
                                            <span>Resolve</span>
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {alert.message}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resolved Alerts */}
            {resolvedAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Resolved Alerts</span>
                            <Badge variant="default">{resolvedAlerts.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {resolvedAlerts.map((alert) => (
                                <div 
                                    key={alert.id}
                                    className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Badge 
                                            variant="default" 
                                            className={getAlertTypeColor(alert.alert_type)}
                                        >
                                            {alert.alert_type.replace('_', ' ')}
                                        </Badge>
                                        <Badge 
                                            variant="default" 
                                            className={getSeverityColor(alert.severity)}
                                        >
                                            {alert.severity}
                                        </Badge>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Resolved
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {alert.message}
                                    </p>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Created: {new Date(alert.timestamp).toLocaleString()}</span>
                                        {alert.resolved_at && (
                                            <span>Resolved: {new Date(alert.resolved_at).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">
                                {alerts.filter(a => a.severity === 'critical').length}
                            </p>
                            <p className="text-sm text-gray-500">Critical</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">
                                {alerts.filter(a => a.severity === 'high').length}
                            </p>
                            <p className="text-sm text-gray-500">High</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                                {alerts.filter(a => a.severity === 'medium').length}
                            </p>
                            <p className="text-sm text-gray-500">Medium</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {alerts.filter(a => a.severity === 'low').length}
                            </p>
                            <p className="text-sm text-gray-500">Low</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AlertsTab;
