import React from 'react';
import { IconMapPin, IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';
import { Progress } from '../../../../../components/ui/Progress';

interface BinProperties {
    bin_id: string;
    bin_type_display: string;
    is_online: boolean;
    fill_status: string;
    address: string;
    area: string;
    user: any;
    sensor_id: string | null;
    battery_level: number | null;
    signal_strength: number | null;
    last_reading_at: string | null;
}

interface SensorReading {
    id: string;
    fill_level: number;
    motion_detected: boolean;
    created_at: string;
}

interface OverviewTabProps {
    binProperties: BinProperties;
    coordinates: [number, number]; // [longitude, latitude]
    recentReadings: SensorReading[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    binProperties,
    coordinates,
    recentReadings
}) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Bin ID</label>
                            <p className="text-sm font-mono">{binProperties.bin_id}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Type</label>
                            <Badge variant="outline">{binProperties.bin_type_display}</Badge>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Status</label>
                            <Badge variant={binProperties.is_online ? 'default' : 'destructive'}>
                                {binProperties.is_online ? 'Online' : 'Offline'}
                            </Badge>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Fill Status</label>
                            <Badge variant="outline">{binProperties.fill_status}</Badge>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-sm">{binProperties.address}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-500">Area</label>
                        <p className="text-sm">{binProperties.area}</p>
                    </div>

                    {binProperties.user && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">Assigned User</label>
                            <p className="text-sm">{binProperties.user.name || 'Unknown'}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Sensor Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Sensor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Sensor Status</label>
                        <div className="flex items-center gap-2 mt-1">
                            {binProperties.sensor_id ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    Sensor Assigned
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    No Sensor Assigned
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Sensor ID</label>
                        <p className="text-sm font-mono">{binProperties.sensor_id || 'Not assigned'}</p>
                    </div>

                    {binProperties.sensor_id && (
                        <>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Battery Level</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress 
                                        value={binProperties.battery_level || 0} 
                                        className="flex-1"
                                        color={binProperties.battery_level && binProperties.battery_level > 50 ? 'green' : 'red'}
                                    />
                                    <span className="text-sm">{binProperties.battery_level || 0}%</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Signal Strength</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress 
                                        value={binProperties.signal_strength || 0} 
                                        className="flex-1"
                                        color={binProperties.signal_strength && binProperties.signal_strength > 50 ? 'green' : 'red'}
                                    />
                                    <span className="text-sm">{binProperties.signal_strength || 0}%</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Reading</label>
                                <p className="text-sm">{binProperties.last_reading_at || 'No recent readings'}</p>
                            </div>

                            <Button 
                                variant="outline" 
                                className="w-full" 
                                onClick={() => navigate(`/admin/sensors/${binProperties.sensor_id}`)}
                            >
                                <IconArrowRight className="w-4 h-4 mr-2" />
                                View Sensor Details
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Latitude</label>
                                <p className="text-sm font-mono">
                                    {Array.isArray(coordinates) && coordinates.length >= 2 ? coordinates[1] : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Longitude</label>
                                <p className="text-sm font-mono">
                                    {Array.isArray(coordinates) && coordinates.length >= 2 ? coordinates[0] : 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                            <IconMapPin className="w-4 h-4 mr-2" />
                            View on Map
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentReadings.length > 0 ? (
                        <div className="space-y-3">
                            {recentReadings.map((reading) => (
                                <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Fill Level: {reading.fill_level}%</p>
                                            <p className="text-xs text-gray-500">{new Date(reading.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {reading.motion_detected && (
                                        <Badge variant="outline" className="text-xs">Motion</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OverviewTab;
