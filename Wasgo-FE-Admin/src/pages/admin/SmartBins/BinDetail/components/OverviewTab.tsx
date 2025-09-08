import React from 'react';
import { 
    IconMapPin, 
    IconArrowRight, 
    IconRuler, 
    IconWeight, 
    IconTools, 
    IconCalendar,
    IconCheck,
    IconX,
    IconBuilding,
    IconMapPin as IconLocation
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';
import { Progress } from '../../../../../components/ui/Progress';

interface BinProperties {
    bin_id: string;
    bin_number: string;
    name: string;
    bin_type_display: string;
    is_online: boolean;
    fill_status: string;
    fill_level: number;
    address: string;
    area: string;
    city: string;
    region: string;
    landmark: string;
    user: any;
    sensor_id: string | null;
    battery_level: number | null;
    signal_strength: number | null;
    last_reading_at: string | null;
    status: string;
    capacity_kg: number;
    current_weight_kg: number;
    installation_date: string;
    last_maintenance_date: string | null;
    next_maintenance_date: string | null;
    maintenance_notes: string;
    has_compactor: boolean;
    has_solar_panel: boolean;
    has_foot_pedal: boolean;
    is_public: boolean;
    // Physical dimensions
    width_cm: number;
    height_cm: number;
    depth_cm: number;
    volume_liters: number;
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

    const handleViewOnMap = () => {
        if (Array.isArray(coordinates) && coordinates.length >= 2) {
            const [longitude, latitude] = coordinates;
            const binName = binProperties?.name || binProperties?.bin_number || 'Smart Bin';
            
            // Create a more descriptive Google Maps URL with the bin name
            const encodedBinName = encodeURIComponent(binName);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodedBinName}`;
            
            // Alternative simpler URL if the above doesn't work well
            const fallbackUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            
            try {
                window.open(googleMapsUrl, '_blank');
            } catch (error) {
                // Fallback to simpler URL if there's an issue
                window.open(fallbackUrl, '_blank');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <IconWeight className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fill Level</p>
                                <p className="text-2xl font-bold">{binProperties?.fill_level || 0}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <IconCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <Badge variant={binProperties?.is_online ? 'default' : 'destructive'} className="mt-1">
                                    {binProperties?.is_online ? 'Online' : 'Offline'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <IconWeight className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Weight</p>
                                <p className="text-2xl font-bold">{binProperties?.current_weight_kg || 0}kg</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <IconRuler className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Capacity</p>
                                <p className="text-2xl font-bold">{binProperties?.capacity_kg || 0}kg</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <IconBuilding className="w-5 h-5 text-blue-600" />
                            <CardTitle>Basic Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Bin Number</label>
                                <p className="text-sm font-mono">{binProperties?.bin_number || binProperties?.bin_id || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Type</label>
                                <Badge variant="outline">{binProperties?.bin_type_display}</Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <Badge variant={binProperties?.status === 'active' ? 'default' : 'destructive'}>
                                    {binProperties?.status || 'Unknown'}
                                </Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fill Status</label>
                                <Badge variant="outline">{binProperties?.fill_status}</Badge>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-500">Name</label>
                            <p className="text-sm font-medium">{binProperties?.name || 'Unnamed Bin'}</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-500">Address</label>
                            <p className="text-sm">{binProperties?.address}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Area</label>
                                <p className="text-sm">{binProperties?.area}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">City</label>
                                <p className="text-sm">{binProperties?.city}</p>
                            </div>
                        </div>

                        {binProperties?.landmark && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Landmark</label>
                                <p className="text-sm">{binProperties?.landmark}</p>
                            </div>
                        )}

                        {binProperties?.user && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Assigned User</label>
                                <p className="text-sm">{binProperties?.user?.first_name} {binProperties?.user?.last_name}</p>
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
                            {binProperties?.sensor_id ? (
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
                        <p className="text-sm font-mono">{binProperties?.sensor_id || 'Not assigned'}</p>
                    </div>

                    {binProperties?.sensor_id && (
                        <>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Battery Level</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress 
                                        value={binProperties?.battery_level || 0} 
                                        className="flex-1"
                                        color={binProperties?.battery_level && binProperties?.battery_level > 50 ? 'green' : 'red'}
                                    />
                                    <span className="text-sm">{binProperties?.battery_level || 0}%</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Signal Strength</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress 
                                        value={binProperties?.signal_strength || 0} 
                                        className="flex-1"
                                        color={binProperties?.signal_strength && binProperties?.signal_strength > 50 ? 'green' : 'red'}
                                    />
                                    <span className="text-sm">{binProperties?.signal_strength || 0}%</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Reading</label>
                                <p className="text-sm">{binProperties?.last_reading_at || 'No recent readings'}</p>
                            </div>

                            <Button 
                                variant="outline" 
                                className="w-full" 
                                onClick={() => navigate(`/admin/sensors/${binProperties?.sensor_id}`)}
                            >
                                <IconArrowRight className="w-4 h-4 mr-2" />
                                View Sensor Details
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

                {/* Physical Dimensions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <IconRuler className="w-5 h-5 text-purple-600" />
                            <CardTitle>Physical Dimensions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Width</label>
                                <p className="text-sm font-mono">{binProperties?.width_cm || 0} cm</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Height</label>
                                <p className="text-sm font-mono">{binProperties?.height_cm || 0} cm</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Depth</label>
                                <p className="text-sm font-mono">{binProperties?.depth_cm || 0} cm</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Volume</label>
                                <p className="text-sm font-mono">{binProperties?.volume_liters || 0} L</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <IconTools className="w-5 h-5 text-red-600" />
                            <CardTitle>Maintenance</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Installation Date</label>
                                <p className="text-sm">{binProperties?.installation_date ? new Date(binProperties.installation_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Maintenance</label>
                                <p className="text-sm">{binProperties?.last_maintenance_date ? new Date(binProperties.last_maintenance_date).toLocaleDateString() : 'Never'}</p>
                            </div>
                        </div>
                        
                        {binProperties?.next_maintenance_date && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Next Maintenance</label>
                                <p className="text-sm">{new Date(binProperties.next_maintenance_date).toLocaleDateString()}</p>
                            </div>
                        )}
                        
                        {binProperties?.maintenance_notes && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Maintenance Notes</label>
                                <p className="text-sm bg-gray-50 p-2 rounded">{binProperties.maintenance_notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Additional Features */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <IconCheck className="w-5 h-5 text-indigo-600" />
                            <CardTitle>Additional Features</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Waste Compactor</span>
                            {binProperties?.has_compactor ? (
                                <IconCheck className="w-5 h-5 text-green-600" />
                            ) : (
                                <IconX className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Solar Panel</span>
                            {binProperties?.has_solar_panel ? (
                                <IconCheck className="w-5 h-5 text-green-600" />
                            ) : (
                                <IconX className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Foot Pedal</span>
                            {binProperties?.has_foot_pedal ? (
                                <IconCheck className="w-5 h-5 text-green-600" />
                            ) : (
                                <IconX className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Public Access</span>
                            {binProperties?.is_public ? (
                                <IconCheck className="w-5 h-5 text-green-600" />
                            ) : (
                                <IconX className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <IconLocation className="w-5 h-5 text-teal-600" />
                            <CardTitle>Location Information</CardTitle>
                        </div>
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
                            
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={handleViewOnMap}
                                disabled={!Array.isArray(coordinates) || coordinates.length < 2}
                                title={Array.isArray(coordinates) && coordinates.length >= 2 
                                    ? `View ${binProperties?.name || 'bin'} location on Google Maps` 
                                    : 'No coordinates available'}
                            >
                                <IconMapPin className="w-4 h-4 mr-2" />
                                View on Google Maps
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
