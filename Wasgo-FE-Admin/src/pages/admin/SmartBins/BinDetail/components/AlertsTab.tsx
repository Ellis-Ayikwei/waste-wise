import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';

interface BinAlert {
    id: string;
    bin_id: string;
    alert_type: string;
    alert_type_display: string;
    priority: string;
    priority_display: string;
    message: string;
    is_resolved: boolean;
    resolved_at: string | null;
    resolved_by: string | null;
    created_at: string;
}

interface AlertsTabProps {
    alerts: BinAlert[];
    onResolveAlert?: (alertId: string) => void;
}

const AlertsTab: React.FC<AlertsTabProps> = ({ alerts, onResolveAlert }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                {alerts.length > 0 ? (
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className={`p-4 rounded-lg border ${
                                alert.is_resolved ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
                            }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant={alert.is_resolved ? 'outline' : 'destructive'}>
                                                {alert.alert_type_display}
                                            </Badge>
                                            <Badge variant={alert.priority === 'high' ? 'destructive' : 'outline'}>
                                                {alert.priority_display}
                                            </Badge>
                                            {alert.is_resolved && (
                                                <Badge variant="outline" className="text-green-600">
                                                    Resolved
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm mb-2">{alert.message}</p>
                                        <p className="text-xs text-gray-500">
                                            Created: {new Date(alert.created_at).toLocaleString()}
                                            {alert.resolved_at && (
                                                <span className="ml-4">
                                                    Resolved: {new Date(alert.resolved_at).toLocaleString()}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {!alert.is_resolved && onResolveAlert && (
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => onResolveAlert(alert.id)}
                                        >
                                            Resolve
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No alerts found</p>
                )}
            </CardContent>
        </Card>
    );
};

export default AlertsTab;
