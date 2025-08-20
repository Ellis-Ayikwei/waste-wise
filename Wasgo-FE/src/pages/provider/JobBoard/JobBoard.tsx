import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import useSWR from 'swr';
import axiosInstance from '../../../services/axiosInstance';
import fetcher from '../../../services/fetcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faCalendarAlt,
    faLocationDot,
    faMoneyBill,
    faSearch,
    faStar,
    faTruck,
    faFilter,
    faMapMarkedAlt,
    faExchangeAlt,
    faTag,
    faClock,
    faListAlt,
    faChevronDown,
    faChevronUp,
    faInfoCircle,
    faToolbox,
    faSortAmountUp,
    faSortAmountDown,
    faBell,
    faLayerGroup,
    faArrowRight,
    faBolt,
    faGavel,
    faRoute,
    faEye,
    faThumbsUp,
    faHeart,
    faHeartBroken,
    faAward,
    faSave,
    faBookmark,
    faSyncAlt,
    faExclamationCircle,
    faUser,
    faWeight,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import JobBoardHeader from './components/JobBoardHeader';
import { FilterState, Job } from '../types';
import JobBoardList from './components/JobBoardList';
import JobBoardMap from './components/JobBoardMap';
import JobBoardGrid from './components/JobBoardGrid';
import JobBoardFilters from './components/JobBoardFilters';

const JobBoard: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid');
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        jobType: 'all',
        distance: null,
        minValue: null,
        maxValue: null,
        date: null,
        itemType: null,
        sortBy: 'date',
        sortDirection: 'desc',
    });
    const [activeTab, setActiveTab] = useState('all');

    const filtersRef = useRef<HTMLDivElement>(null);
    const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useSWR('/jobs/', fetcher);
    console.log('jobs', jobsData);

    // Setup debounced search
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            setDebouncedSearchTerm(term);
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    useEffect(() => {
        fetchJobs();

        // Load saved jobs from localStorage
        const savedJobsFromStorage = localStorage.getItem('savedJobs');
        if (savedJobsFromStorage) {
            setSavedJobs(JSON.parse(savedJobsFromStorage));
        }

        // Close filters when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (jobsData) {
            setJobs(jobsData);
            setLoading(false);
            setError(null);
        } else if (jobsError) {
            setError('Failed to load jobs');
            setLoading(false);
        }
    }, [jobsData, jobsError]);

    const fetchJobs = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await axiosInstance.get('/jobs/');
            setJobs(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load jobs. Please try again.');
            setLoading(false);
        }
    };

    const toggleSaveJob = (jobId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const updatedSavedJobs = savedJobs.includes(jobId) ? savedJobs?.filter((id) => id !== jobId) : [...savedJobs, jobId];

        setSavedJobs(updatedSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    };

    const handleJobCardClick = (job: Job) => {
        navigate(`/provider/job/${job.id}`);
    };

    // Apply all filters and search
    const filteredJobs = React.useMemo(() => {
        let filtered = jobs.filter((job) => {
            // Tab filter
            if (activeTab !== 'all') {
                if (activeTab === 'recommended') {
                    // TODO: Implement recommended jobs logic
                    return false;
                }
                if (job.request.request_type !== activeTab) {
                    return false;
                }
            }

            // Search term filter
            if (debouncedSearchTerm) {
                const searchLower = debouncedSearchTerm.toLowerCase();
                const matchesSearch =
                    job.id.toLowerCase().includes(searchLower) ||
                    job.request.tracking_number.toLowerCase().includes(searchLower) ||
                    job.request.contact_name.toLowerCase().includes(searchLower) ||
                    job.request.items_description.toLowerCase().includes(searchLower) ||
                    job.request.service_type.toLowerCase().includes(searchLower) ||
                    job.request.all_locations.some((location) => location.address.toLowerCase().includes(searchLower)) ||
                    job.request.moving_items.some((item) => item.name.toLowerCase().includes(searchLower) || item.category.toLowerCase().includes(searchLower));

                if (!matchesSearch) return false;
            }

            // Job type filter (from filters panel)
            if (filters.jobType !== 'all' && job.request.request_type !== filters.jobType) {
                return false;
            }

            // Distance filter
            if (filters.distance !== null && job.request.estimated_distance && job.request.estimated_distance > filters.distance) {
                return false;
            }

            // Value range filter
            const jobValue = parseFloat(job.request.base_price);
            if (filters.minValue !== null && jobValue < filters.minValue) {
                return false;
            }
            if (filters.maxValue !== null && jobValue > filters.maxValue) {
                return false;
            }

            // Date filter
            if (filters.date !== null && job.request.preferred_pickup_date) {
                const jobDate = new Date(job.request.preferred_pickup_date).toISOString().split('T')[0];
                if (jobDate !== filters.date) {
                    return false;
                }
            }

            // Item type filter
            if (filters.itemType !== null) {
                const hasMatchingItem = job.request.moving_items.some((item) => item.category.toLowerCase() === filters.itemType?.toLowerCase());
                if (!hasMatchingItem) return false;
            }

            return true;
        });

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const direction = filters.sortDirection === 'asc' ? 1 : -1;

            switch (filters.sortBy) {
                case 'date':
                    return direction * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                case 'value':
                    return direction * (parseFloat(b.request.base_price) - parseFloat(a.request.base_price));
                case 'distance':
                    return direction * ((b.request.estimated_distance || 0) - (a.request.estimated_distance || 0));
                case 'urgency':
                    const priorityMap: { [key: string]: number } = { high: 3, normal: 2, low: 1 };
                    return direction * ((priorityMap[b.request.priority] || 0) - (priorityMap[a.request.priority] || 0));
                default:
                    return 0;
            }
        });

        return filtered;
    }, [jobs, debouncedSearchTerm, filters, activeTab]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="mx-auto px-4 sm:px-6 py-8">
                <JobBoardHeader jobs={jobs} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="relative flex-grow max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by location, item type, customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                    title="Grid View"
                                >
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                    title="List View"
                                >
                                    <FontAwesomeIcon icon={faListAlt} />
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`p-2 rounded-md ${
                                        viewMode === 'map'
                                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                    title="Map View"
                                >
                                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                    showFilters
                                        ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400'
                                        : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                                }`}
                            >
                                <FontAwesomeIcon icon={faFilter} />
                                <span>Filters</span>
                                <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="ml-1" />
                            </button>
                        </div>
                    </div>

                    {showFilters && <JobBoardFilters filters={filters} setFilters={setFilters} filtersRef={filtersRef} />}
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{loading ? 'Loading jobs...' : `Found ${filteredJobs.length} job${filteredJobs.length === 1 ? '' : 's'}`}</div>

                    {viewMode !== 'map' && filteredJobs.length > 0 && (
                        <button className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" onClick={() => fetchJobs()}>
                            <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                                <div className="h-20 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-5">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mt-6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-md flex items-start">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mt-1 mr-3" />
                        <div>
                            <h3 className="font-medium">Error loading jobs</h3>
                            <p className="mt-1">{error}</p>
                            <button
                                onClick={fetchJobs}
                                className="mt-3 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 text-sm font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faSearch} className="text-blue-500 text-2xl" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                            {debouncedSearchTerm || Object.values(filters).some((value) => value !== null && value !== 'all')
                                ? "We couldn't find any jobs matching your filters. Try adjusting your search criteria."
                                : 'There are no available jobs at the moment. Check back later or adjust your search parameters.'}
                        </p>
                        {(debouncedSearchTerm || Object.values(filters).some((value) => value !== null && value !== 'all')) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
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
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <JobBoardGrid jobs={filteredJobs} savedJobs={savedJobs} onJobClick={handleJobCardClick} onSaveJob={toggleSaveJob} />
                ) : viewMode === 'list' ? (
                    <JobBoardList jobs={filteredJobs} savedJobs={savedJobs} onJobClick={handleJobCardClick} onSaveJob={toggleSaveJob} />
                ) : (
                    <JobBoardMap />
                )}
            </div>
        </div>
    );
};

export default JobBoard;
