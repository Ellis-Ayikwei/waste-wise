import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

const JobBoardMap: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="text-center p-12">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-400 text-5xl mb-3" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Map View Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400">We're working on an interactive map view of nearby jobs. Stay tuned for this feature!</p>
            </div>
        </div>
    );
};

export default JobBoardMap;
