import React from 'react';
import { 
    Layers, 
    CheckCircle, 
    Filter, 
    Plus, 
    Edit, 
    Trash, 
    Info, 
    MapPin, 
    Package, 
    Clock, 
    Cloud, 
    Car, 
    Shield, 
    Building, 
    Star, 
    Users, 
    Home, 
    Settings,
    Search,
    TrendingUp,
    Euro,
    Percent,
    Hash,
    Calendar,
    Thermometer,
    Zap,
    Truck,
    Palette,
    Navigation,
    Award,
    UserCheck,
    HomeIcon,
    Timer
} from 'lucide-react';

interface PricingFactor {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    category: string;
    [key: string]: any;
}

interface FactorsTabProps {
    factors: PricingFactor[];
    searchTerm: string;
    selectedCategory: string;
    onSearchChange: (term: string) => void;
    onCategoryChange: (category: string) => void;
    onAddFactor: () => void;
    onEditFactor: (factor: PricingFactor) => void;
    onDeleteFactor: (factor: PricingFactor) => void;
}

const FactorsTab: React.FC<FactorsTabProps> = ({
    factors,
    searchTerm,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    onAddFactor,
    onEditFactor,
    onDeleteFactor
}) => {
    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: any } = {
            distance: MapPin,
            weight: Package,
            time: Clock,
            weather: Cloud,
            vehicle_type: Car,
            special_requirements: Shield,
            location: Building,
            service_level: Star,
            staff_required: Users,
            property_type: Home,
            insurance: Shield,
            loading_time: Timer,
        };
        return icons[category] || Settings;
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            distance: 'bg-blue-500',
            weight: 'bg-orange-500',
            time: 'bg-purple-500',
            weather: 'bg-cyan-500',
            vehicle_type: 'bg-green-500',
            special_requirements: 'bg-red-500',
            location: 'bg-indigo-500',
            service_level: 'bg-yellow-500',
            staff_required: 'bg-pink-500',
            property_type: 'bg-teal-500',
            insurance: 'bg-emerald-500',
            loading_time: 'bg-violet-500',
        };
        return colors[category] || 'bg-gray-500';
    };

    const filteredFactors = factors.filter(factor => {
        const matchesSearch = factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            factor.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || factor.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...Array.from(new Set(factors.map(f => f.category)))];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Pricing Factors
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Manage individual pricing factors that affect final pricing calculations
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                        onClick={onAddFactor}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Factor
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search factors..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Layers className="text-purple-600 dark:text-purple-400 h-5 w-5" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Factors</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{factors.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Active</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {factors.filter(f => f.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Filter className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Categories</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {Array.from(new Set(factors.map(f => f.category))).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <TrendingUp className="text-orange-600 dark:text-orange-400 h-5 w-5" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Filtered</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {filteredFactors.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Factors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFactors.map((factor) => {
                    const CategoryIcon = getCategoryIcon(factor.category);
                    return (
                        <div key={`${factor.category}-${factor.id}`} className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Header */}
                            <div className="relative p-4 pb-3">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className={`p-2 rounded-lg ${getCategoryColor(factor.category)}`}>
                                                <CategoryIcon className="text-white h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                    {factor.name}
                                                </h3>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {factor.category.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                    {factor.description || 'No description provided'}
                                </p>

                                {/* Factor-specific details - Expanded to show more details */}
                                <div className="space-y-2">
                                    {factor.category === 'distance' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Rate per km</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_rate_per_km}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Rate per mile</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_rate_per_mile}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Distance Range</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {factor.min_distance}km - {factor.max_distance}km
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Additional Distance Threshold</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.additional_distance_threshold}km</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Distance Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.additional_distance_multiplier}x</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'weight' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Weight Rate</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_weight_rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Rate per kg</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.rate_per_kg}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Weight Range</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {factor.min_weight}kg - {factor.max_weight}kg
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Weight Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.weight_multiplier}x</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'insurance' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Rate</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Coverage Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.coverage_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Coverage Range</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    €{factor.min_coverage} - €{factor.max_coverage}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Insurance Type</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{factor.insurance_type}</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'weather' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Rain Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.rain_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Snow Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.snow_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Extreme Weather</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.extreme_weather_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Temperature Range</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {factor.min_temperature}°C - {factor.max_temperature}°C
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'vehicle_type' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Vehicle Type</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{factor.vehicle_type}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Rate</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Capacity Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.capacity_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Fuel Efficiency</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.fuel_efficiency}%</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'special_requirements' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Fragile Items</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.fragile_items_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Assembly Rate</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.assembly_required_rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Special Equipment</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.special_equipment_rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Handling Fee</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.handling_fee}</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'location' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">City</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{factor.city_name}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Zone Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.zone_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Congestion Charge</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.congestion_charge}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Parking Fee</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.parking_fee}</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'service_level' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Service Level</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{factor.service_level}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Price Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.price_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Response Time</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.response_time}hrs</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Priority Fee</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.priority_fee}</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'staff_required' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Rate per Staff</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_rate_per_staff}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Staff Range</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {factor.min_staff} - {factor.max_staff}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Overtime Rate</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.overtime_rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Specialist Fee</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.specialist_fee}</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'property_type' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Property Type</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{factor.property_type}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Rate</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Rate per Room</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.rate_per_room}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Floor Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.floor_multiplier}x</span>
                                            </div>
                                        </>
                                    )}

                                    {factor.category === 'loading_time' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Base Rate per Hour</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">€{factor.base_rate_per_hour}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Min Hours</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.min_hours}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Overtime Multiplier</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.overtime_multiplier}x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Setup Time</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{factor.setup_time}hrs</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex justify-end space-x-2">
                                    <button
                                        className="inline-flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs"
                                        onClick={() => onEditFactor(factor)}
                                    >
                                        <Edit className="mr-1 h-3 w-3" />
                                        Edit
                                    </button>
                                    <button
                                        className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs"
                                        onClick={() => onDeleteFactor(factor)}
                                    >
                                        <Trash className="mr-1 h-3 w-3" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredFactors.length === 0 && (
                <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Info className="text-gray-400 h-6 w-6" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">No factors found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {searchTerm || selectedCategory !== 'all' 
                            ? 'Try adjusting your search or filter criteria.'
                            : 'Get started by creating your first pricing factor.'
                        }
                    </p>
                    {!searchTerm && selectedCategory === 'all' && (
                        <button
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                            onClick={onAddFactor}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Factor
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FactorsTab; 