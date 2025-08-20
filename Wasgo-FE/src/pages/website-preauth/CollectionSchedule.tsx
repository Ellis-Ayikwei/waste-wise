import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faClock,
    faMapMarkerAlt,
    faRecycle,
    faTrash,
    faLeaf,
    faBell,
    faDownload,
    faSearch,
    faChevronLeft,
    faChevronRight,
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/Footer';

interface ScheduleEvent {
    id: string;
    date: string;
    time: string;
    type: 'recycling' | 'organic' | 'general' | 'hazardous';
    location: string;
    status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
    notes?: string;
}

const CollectionSchedule: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedArea, setSelectedArea] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    // Mock schedule data
    const scheduleEvents: ScheduleEvent[] = [
        {
            id: '1',
            date: '2024-01-15',
            time: '08:00 AM',
            type: 'recycling',
            location: 'Accra Mall Area',
            status: 'scheduled',
            notes: 'Please separate plastics and paper',
        },
        {
            id: '2',
            date: '2024-01-16',
            time: '09:00 AM',
            type: 'organic',
            location: 'Legon Residential',
            status: 'scheduled',
        },
        {
            id: '3',
            date: '2024-01-17',
            time: '07:30 AM',
            type: 'general',
            location: 'Osu District',
            status: 'completed',
        },
        {
            id: '4',
            date: '2024-01-18',
            time: '10:00 AM',
            type: 'hazardous',
            location: 'Industrial Area',
            status: 'scheduled',
            notes: 'Special handling required',
        },
        {
            id: '5',
            date: '2024-01-19',
            time: '08:30 AM',
            type: 'recycling',
            location: 'East Legon',
            status: 'rescheduled',
            notes: 'Moved from Jan 18',
        },
    ];

    const areas = [
        'All Areas',
        'Accra Mall Area',
        'Legon Residential',
        'Osu District',
        'East Legon',
        'Industrial Area',
        'Tema',
        'Madina',
    ];

    const wasteTypes = [
        { value: 'all', label: 'All Types', icon: faTrash, color: 'bg-gray-500' },
        { value: 'recycling', label: 'Recycling', icon: faRecycle, color: 'bg-blue-500' },
        { value: 'organic', label: 'Organic', icon: faLeaf, color: 'bg-green-500' },
        { value: 'general', label: 'General', icon: faTrash, color: 'bg-gray-500' },
        { value: 'hazardous', label: 'Hazardous', icon: faExclamationCircle, color: 'bg-red-500' },
    ];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'recycling':
                return 'bg-blue-500';
            case 'organic':
                return 'bg-green-500';
            case 'hazardous':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-50';
            case 'missed':
                return 'text-red-600 bg-red-50';
            case 'rescheduled':
                return 'text-yellow-600 bg-yellow-50';
            default:
                return 'text-blue-600 bg-blue-50';
        }
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        setSelectedMonth((prev) => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(selectedMonth);
        const firstDay = getFirstDayOfMonth(selectedMonth);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(
                2,
                '0'
            )}-${String(day).padStart(2, '0')}`;
            const dayEvents = scheduleEvents.filter((event) => event.date === dateStr);

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg border border-gray-200 p-2 h-24 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="font-semibold text-gray-900 mb-1">{day}</div>
                    <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                            <div
                                key={event.id}
                                className={`text-xs px-1 py-0.5 rounded ${getTypeColor(event.type)} text-white truncate`}
                            >
                                {event.time}
                            </div>
                        ))}
                        {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                        )}
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white py-20 overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-10 right-20 w-96 h-96 bg-green-500 rounded-full filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                                <span className="text-sm font-medium">Never Miss a Collection</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Collection
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400"> Schedule</span>
                            </h1>
                            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                                View and manage your waste collection schedule. Set reminders and never miss a pickup day.
                            </p>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => setShowNotificationModal(true)}
                                    className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faBell} className="mr-2" />
                                    Set Reminders
                                </button>
                                <button className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Download Schedule
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Controls Section */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Search and Filters */}
                            <div className="flex flex-col md:flex-row gap-3 flex-1">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Area Filter */}
                                <select
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    {areas.map((area) => (
                                        <option key={area} value={area.toLowerCase().replace(' ', '-')}>
                                            {area}
                                        </option>
                                    ))}
                                </select>

                                {/* Type Filter */}
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    {wasteTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        viewMode === 'calendar'
                                            ? 'bg-white text-green-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    Calendar
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-white text-green-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    {viewMode === 'calendar' ? (
                        /* Calendar View */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => changeMonth('prev')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
                                </button>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <button
                                    onClick={() => changeMonth('next')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Days of Week */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

                            {/* Legend */}
                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                {wasteTypes.slice(1).map((type) => (
                                    <div key={type.value} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded ${type.color}`}></div>
                                        <span className="text-sm text-gray-600">{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        /* List View */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {scheduleEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            {/* Date Box */}
                                            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg p-3 text-center min-w-[80px]">
                                                <div className="text-2xl font-bold">
                                                    {new Date(event.date).getDate()}
                                                </div>
                                                <div className="text-xs">
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                            </div>

                                            {/* Event Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`w-8 h-8 rounded-lg ${getTypeColor(event.type)} flex items-center justify-center`}>
                                                        <FontAwesomeIcon
                                                            icon={
                                                                event.type === 'recycling'
                                                                    ? faRecycle
                                                                    : event.type === 'organic'
                                                                    ? faLeaf
                                                                    : faTrash
                                                            }
                                                            className="text-white text-sm"
                                                        />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 text-lg">
                                                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Collection
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    {event.notes && (
                                                        <div className="flex items-start gap-2 mt-2">
                                                            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 mt-0.5" />
                                                            <span className="text-sm italic">{event.notes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                <FontAwesomeIcon icon={faBell} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Upcoming Collections Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Next Collections in Your Area</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {scheduleEvents
                                .filter((e) => e.status === 'scheduled')
                                .slice(0, 3)
                                .map((event) => (
                                    <div key={event.id} className="bg-white rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-lg ${getTypeColor(event.type)} flex items-center justify-center`}>
                                                <FontAwesomeIcon
                                                    icon={
                                                        event.type === 'recycling'
                                                            ? faRecycle
                                                            : event.type === 'organic'
                                                            ? faLeaf
                                                            : faTrash
                                                    }
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                                </p>
                                                <p className="text-sm text-gray-500">{event.location}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                            <p>{event.time}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </motion.div>
                </div>

                {/* Notification Modal */}
                {showNotificationModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowNotificationModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Set Collection Reminders</h3>
                            <p className="text-gray-600 mb-6">
                                Get notified before your scheduled waste collection times.
                            </p>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 text-green-500" defaultChecked />
                                    <span>1 day before collection</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 text-green-500" defaultChecked />
                                    <span>Morning of collection day</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 text-green-500" />
                                    <span>1 hour before collection</span>
                                </label>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setShowNotificationModal(false)}
                                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    Save Settings
                                </button>
                                <button
                                    onClick={() => setShowNotificationModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CollectionSchedule;