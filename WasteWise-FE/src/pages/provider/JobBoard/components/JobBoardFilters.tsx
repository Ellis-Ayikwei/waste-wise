import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes, faSortAmountUp, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import { FilterState } from '../../types';

interface JobBoardFiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    filtersRef: React.RefObject<HTMLDivElement>;
}

const JobBoardFilters: React.FC<JobBoardFiltersProps> = ({ filters, setFilters, filtersRef }) => {
    const clearFilters = () => {
        setFilters({
            jobType: 'all',
            distance: null,
            minValue: null,
            maxValue: null,
            date: null,
            itemType: null,
            sortBy: 'date',
            sortDirection: 'desc',
        });
    };

    return (
        <div ref={filtersRef} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faFilter} className="text-gray-500 dark:text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
                </div>
                <button onClick={clearFilters} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                    <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="instant">Instant</option>
                        <option value="auction">Auction</option>
                        <option value="journey">Journey</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance (miles)</label>
                    <input
                        type="number"
                        value={filters.distance || ''}
                        onChange={(e) => setFilters({ ...filters, distance: e.target.value ? Number(e.target.value) : null })}
                        placeholder="Max distance"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={filters.minValue || ''}
                            onChange={(e) => setFilters({ ...filters, minValue: e.target.value ? Number(e.target.value) : null })}
                            placeholder="Min"
                            className="w-1/2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                            type="number"
                            value={filters.maxValue || ''}
                            onChange={(e) => setFilters({ ...filters, maxValue: e.target.value ? Number(e.target.value) : null })}
                            placeholder="Max"
                            className="w-1/2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                        type="date"
                        value={filters.date || ''}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value || null })}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Type</label>
                    <select
                        value={filters.itemType || ''}
                        onChange={(e) => setFilters({ ...filters, itemType: e.target.value || null })}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">All Types</option>
                        <option value="furniture">Furniture</option>
                        <option value="electronics">Electronics</option>
                        <option value="boxes">Boxes</option>
                        <option value="specialty">Specialty</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <div className="flex space-x-2">
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="w-3/4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="date">Date</option>
                            <option value="value">Value</option>
                            <option value="distance">Distance</option>
                            <option value="urgency">Urgency</option>
                        </select>
                        <button
                            onClick={() => setFilters({ ...filters, sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' })}
                            className="w-1/4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={filters.sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobBoardFilters;
