import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPricingConfigurations, getPricingFactors, deletePricingConfiguration, deletePricingFactor, setDefaultPricingConfiguration } from '../../../services/pricingService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faList, faCheckCircle, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import StatCard from '../../../components/ui/statCard';
import PricingConfigForm from './PricingConfigForm';
import PricingConfigurationForm from './PricingConfigurationForm';
import { 
    ConfigurationsTab, 
    FactorsTab, 
    TabNavigation, 
    LoadingSpinner, 
    ErrorAlert 
} from './components';
import PricingFactorForm from './components/factorsTab/PricingFactorFormRefactored';
import confirmDialog from '../../../helper/confirmDialog';

interface PricingFactor {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    category: string;
    [key: string]: any;
}

interface PricingConfiguration {
    id: number;
    name: string;
    is_active: boolean;
    is_default: boolean;
    base_price: number;
    min_price: number;
    max_price_multiplier: number;
    fuel_surcharge_percentage: number;
    carbon_offset_rate: number;
    active_factors: {
        [category: string]: number[];
    };
}

interface PricingFactorsResponse {
    distance: PricingFactor[];
    weight: PricingFactor[];
    time: PricingFactor[];
    weather: PricingFactor[];
    vehicle_type: PricingFactor[];
    special_requirements: PricingFactor[];
    location: PricingFactor[];
    service_level: PricingFactor[];
    staff_required: PricingFactor[];
    property_type: PricingFactor[];
    insurance: PricingFactor[];
    loading_time: PricingFactor[];
    configuration: PricingConfiguration[];
}

const PricingAdmin = () => {
    const [activeTab, setActiveTab] = useState('config');
    const [configurations, setConfigurations] = useState<PricingConfiguration[]>([]);
    const [factors, setFactors] = useState<PricingFactor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfigForm, setShowConfigForm] = useState(false);
    const [showFactorForm, setShowFactorForm] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<PricingConfiguration | null>(null);
    const [selectedFactor, setSelectedFactor] = useState<PricingFactor | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchPricingData();
    }, []);

    const fetchPricingData = async () => {
        try {
            setLoading(true);
            const [factorsResponse, configsResponse] = await Promise.all([
                getPricingFactors(),
                getPricingConfigurations()
            ]);

            // Ensure configurations is an array
            const configsData = configsResponse.data;
            const configsArray = Array.isArray(configsData) ? configsData : [];
            setConfigurations(configsArray);
            console.log('configsArray', configsResponse);
            console.log('factorsResponse', factorsResponse.data);

            // Flatten all factors into a single array, filtering for active ones
            const allFactors: PricingFactor[] = [];
            Object.entries(factorsResponse.data).forEach(([category, items]) => {
                if (category !== 'configuration' && Array.isArray(items)) {
                    items.forEach((item) => {
                        if (item.is_active) {
                            allFactors.push({
                                ...item,
                                category,
                            });
                        }
                    });
                }
            });

            setFactors(allFactors);
        } catch (err: any) {
            console.error('Error in fetchPricingData:', err);
            setError('Failed to load pricing data: ' + (err.response?.data?.message || err.message));
            setFactors([]);
            setConfigurations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfigEdit = (config: PricingConfiguration) => {
        setSelectedConfig(config);
        setShowConfigForm(true);
    };

    const handleConfigDelete = async (id: number) => {
        const isConfimed = await confirmDialog({
            title:"Delete Pricing Config",
            note: "This action cannot be undone", 
            recommended: "You should rather deactivate it",
            finalQuestion: "Are You Sure You Want To Delete This Configuration? ",
            type: 'warning',
        })
        if(isConfimed){

            try {
                await deletePricingConfiguration(id);
                setConfigurations(configurations.filter((config) => config.id !== id));
            } catch (err: any) {
                setError('Failed to delete configuration: ' + (err.response?.data?.message || err.message));
            }
        }

    };

    const handleFactorEdit = (factor: PricingFactor) => {
        setSelectedFactor(factor);
        setShowFactorForm(true);
    };

    const handleFactorDelete = async (factor: PricingFactor) => {
        const isConfimed = await confirmDialog({
            title:"Delete Factor",
            note: "This action cannot be undone", 
            recommended: "You should rather deactivate it",
            finalQuestion: "Are You Sure You Want To Delete ? ",
            type: 'warning',
        })
        if(isConfimed){
            try {
                await deletePricingFactor(factor.category, factor.id);
                setFactors(factors.filter((f) => f.id !== factor.id));
            } catch (err: any) {
                setError('Failed to delete factor: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultPricingConfiguration(id);
            await fetchPricingData(); // Refresh the data
        } catch (err: any) {
            setError('Failed to set default configuration: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleAddConfiguration = () => {
        setSelectedConfig(null);
        setShowConfigForm(true);
    };

    const handleAddFactor = () => {
        setSelectedFactor(null);
        setShowFactorForm(true);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ErrorAlert error={error} />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    icon={faCog}
                    title="Total Configurations"
                    value={configurations.length}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faList}
                    title="Active Factors"
                    value={factors.length}
                    color="green"
                    delay={0.2}
                />
                <StatCard
                    icon={faCheckCircle}
                    title="Default Config"
                    value={configurations.filter(c => c.is_default).length}
                    color="purple"
                    delay={0.3}
                />
                <StatCard
                    icon={faDollarSign}
                    title="Active Configs"
                    value={configurations.filter(c => c.is_active).length}
                    color="orange"
                    delay={0.4}
                />
            </div>

            <TabNavigation 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />

            {activeTab === 'config' ? (
                <ConfigurationsTab
                    configurations={configurations}
                    onAddConfiguration={handleAddConfiguration}
                    onEditConfiguration={handleConfigEdit}
                    onDeleteConfiguration={handleConfigDelete}
                    onSetDefault={handleSetDefault}
                />
            ) : (
                <FactorsTab
                    factors={factors}
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    onSearchChange={setSearchTerm}
                    onCategoryChange={setSelectedCategory}
                    onAddFactor={handleAddFactor}
                    onEditFactor={handleFactorEdit}
                    onDeleteFactor={handleFactorDelete}
                />
            )}

            {showConfigForm && (
                <PricingConfigurationForm
                    initialData={selectedConfig || undefined}
                    onClose={() => {
                        setShowConfigForm(false);
                        setSelectedConfig(null);
                    }}
                    onSuccess={fetchPricingData}
                />
            )}

            {showFactorForm && (
                <PricingFactorForm
                    initialData={selectedFactor || undefined}
                    onClose={() => {
                        setShowFactorForm(false);
                        setSelectedFactor(null);
                    }}
                    onSuccess={fetchPricingData}
                />
            )}
        </div>
    );
};

export default PricingAdmin;
