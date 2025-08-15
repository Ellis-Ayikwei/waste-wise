import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface MovingItem {
    name: string;
    category: string;
    quantity: number;
    weight?: string;
    dimensions?: string | {
        unit: string;
        width: number;
        height: number;
        length: number;
    };
    value?: string;
    fragile?: boolean;
    needs_disassembly?: boolean;
    notes?: string;
    photo?: File | string | null;
}

interface ItemSummaryProps {
    items: MovingItem[];
}

const ItemSummary: React.FC<ItemSummaryProps> = ({ items }) => {
    if (!items || items.length === 0) return null;

    const totalItems = items.reduce((sum, item) => sum + (parseInt(item.quantity.toString()) || 0), 0);
    const totalWeight = items
        .reduce((sum, item) => sum + (parseFloat(item.weight || '0') || 0) * (parseInt(item.quantity.toString()) || 0), 0)
        .toFixed(1);
    const hasFragileItems = items.some(item => item.fragile);
    const hasDisassemblyItems = items.some(item => item.needs_disassembly);

    return (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 dark:text-blue-400 mt-0.5 mr-3" />
            <div>
                <span className="block text-sm font-medium text-blue-700 dark:text-blue-300">Item Summary</span>
                <span className="block text-sm text-blue-600 dark:text-blue-400">
                    {totalItems} items · {totalWeight} kg
                    {hasFragileItems && ' · Includes fragile items'}
                    {hasDisassemblyItems && ' · Some items need disassembly'}
                </span>
            </div>
        </div>
    );
};

export default ItemSummary; 