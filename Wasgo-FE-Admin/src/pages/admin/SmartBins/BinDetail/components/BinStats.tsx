import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCheck, faExclamationTriangle, faChartBar } from '@fortawesome/free-solid-svg-icons';
import StatCard from '../../../../../components/ui/statCard';

interface BinStatsProps {
    fillLevel: number;
    isOnline: boolean;
    activeAlertsCount: number;
    totalReadingsCount: number;
}

const BinStats: React.FC<BinStatsProps> = ({
    fillLevel,
    isOnline,
    activeAlertsCount,
    totalReadingsCount
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon={faDatabase}
                title="Fill Level"
                value={`${fillLevel}%`}
                color={fillLevel > 80 ? 'red' : fillLevel > 60 ? 'yellow' : 'green'}
                delay={0.1}
            />
            <StatCard
                icon={faCheck}
                title="Status"
                value={isOnline ? 'Online' : 'Offline'}
                color={isOnline ? 'green' : 'red'}
                delay={0.2}
            />
            <StatCard
                icon={faExclamationTriangle}
                title="Active Alerts"
                value={activeAlertsCount.toString()}
                color={activeAlertsCount > 0 ? 'red' : 'green'}
                delay={0.3}
            />
            <StatCard
                icon={faChartBar}
                title="Total Readings"
                value={totalReadingsCount.toString()}
                color="blue"
                delay={0.4}
            />
        </div>
    );
};

export default BinStats;
