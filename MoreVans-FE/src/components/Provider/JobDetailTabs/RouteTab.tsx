import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBox, faChevronUp, faChevronDown, faDirections, faPhone } from '@fortawesome/free-solid-svg-icons';

interface JourneyItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    fragile?: boolean;
    needs_disassembly?: boolean;
}

interface JourneyStop {
    id: string;
    type: 'pickup' | 'dropoff' | 'stop';
    location: string;
    address: string;
    contact_name?: string;
    contact_phone?: string;
    instructions?: string;
    scheduled_time?: string;
    completed_time?: string;
    items?: JourneyItem[];
    linked_items?: string[];
}

interface RouteTabProps {
    job: {
        request: {
            journey_stops?: JourneyStop[];
            all_locations?: any[];
        };
    };
}

const RouteTab: React.FC<RouteTabProps> = ({ job }) => {
    const [expandedStops, setExpandedStops] = useState<{ [key: string]: boolean }>({});

    const toggleStop = (stopId: string) => {
        setExpandedStops((prev) => ({ ...prev, [stopId]: !prev[stopId] }));
    };

    // Create a memoized lookup for all pickup items
    const pickupItems = React.useMemo(() => {
        const pickupStops = job.request.journey_stops?.filter((stop) => stop.type === 'pickup') || [];
        return pickupStops.reduce((acc, stop) => {
            if (stop.items) {
                stop.items.forEach((item) => {
                    acc[item.id] = item;
                });
            }
            return acc;
        }, {} as { [key: string]: JourneyItem });
    }, [job.request.journey_stops]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-600 dark:text-blue-400" />
                    Journey Route
                </h3>
            </div>

            <div className="p-4">
                {job.request.journey_stops && job.request.journey_stops.length > 0 && (
                    <div className="space-y-3">
                        {job.request.journey_stops.map((stop, index) => (
                            <div key={stop.id || index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                                                    stop.type === 'pickup' ? 'bg-blue-500' : stop.type === 'dropoff' ? 'bg-green-500' : 'bg-orange-500'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <span
                                                        className={`px-2 py-0.5 text-xs rounded-lg font-medium border ${
                                                            stop.type === 'pickup'
                                                                ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700'
                                                                : stop.type === 'dropoff'
                                                                ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700'
                                                                : 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700'
                                                        }`}
                                                    >
                                                        {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                                                    </span>
                                                    <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{stop.location}</h4>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stop.address}</p>
                                                {stop.contact_name && (
                                                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                                                        Contact: {stop.contact_name}
                                                        {stop.contact_phone && ` (${stop.contact_phone})`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-gray-900 dark:text-white">{stop.scheduled_time || 'Not scheduled'}</div>
                                            {stop.completed_time && (
                                                <span className="text-xs text-green-600 dark:text-green-400">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {stop.instructions && (
                                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                                <strong>Instructions:</strong> {stop.instructions}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-2 flex items-center justify-between">
                                        <button
                                            onClick={() => toggleStop(stop.id || index.toString())}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                                        >
                                            <FontAwesomeIcon icon={expandedStops[stop.id || index.toString()] ? faChevronUp : faChevronDown} className="mr-1 text-xs" />
                                            {expandedStops[stop.id || index.toString()] ? 'Hide Details' : 'Show Details'}
                                        </button>
                                        <div className="flex items-center space-x-2">
                                            <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                                                <FontAwesomeIcon icon={faDirections} className="mr-1 text-xs" />
                                                Directions
                                            </button>
                                            <span className="text-gray-300 dark:text-gray-600">|</span>
                                            <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                                                <FontAwesomeIcon icon={faPhone} className="mr-1 text-xs" />
                                                Call
                                            </button>
                                        </div>
                                    </div>

                                    {expandedStops[stop.id || index.toString()] && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            {(stop.type === 'pickup' || stop.type === 'dropoff') && (
                                                <div>
                                                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                                        <FontAwesomeIcon icon={faBox} className="mr-1 text-gray-500 dark:text-gray-400 text-xs" />
                                                        {stop.type === 'pickup' ? 'Items to Pick Up' : 'Items to Deliver'}
                                                    </h5>
                                                    <div className="space-y-2">
                                                        {stop.type === 'pickup' &&
                                                            stop.items?.map((item, itemIndex) => (
                                                                <div key={itemIndex} className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <p className="text-xs font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                                            {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>}
                                                                            {(item.fragile || item.needs_disassembly) && (
                                                                                <div className="flex gap-1 mt-1">
                                                                                    {item.fragile && (
                                                                                        <span className="text-xs px-1.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                                                                                            Fragile
                                                                                        </span>
                                                                                    )}
                                                                                    {item.needs_disassembly && (
                                                                                        <span className="text-xs px-1.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                                                                                            Assembly
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                                            {item.quantity || 1}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        {stop.type === 'dropoff' &&
                                                            stop.linked_items?.map((itemId, itemIndex) => {
                                                                const item = pickupItems[itemId];
                                                                if (!item) return null;
                                                                return (
                                                                    <div key={itemIndex} className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                                                        <div className="flex justify-between items-start">
                                                                            <div>
                                                                                <p className="text-xs font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                                                {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>}
                                                                                {(item.fragile || item.needs_disassembly) && (
                                                                                    <div className="flex gap-1 mt-1">
                                                                                        {item.fragile && (
                                                                                            <span className="text-xs px-1.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                                                                                                Fragile
                                                                                            </span>
                                                                                        )}
                                                                                        {item.needs_disassembly && (
                                                                                            <span className="text-xs px-1.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                                                                                                Assembly
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-xs px-2 py-0.5 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                                                                {item.quantity || 1}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteTab;
