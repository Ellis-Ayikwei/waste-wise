import React from 'react';
import { Job } from '../../../../types/job';

interface JobMetricsProps {
    job: Job;
}

const JobMetrics: React.FC<JobMetricsProps> = ({ job }) => {
    // Convert a unit label to a multiplier that turns values into centimeters
    const unitToCm = (unit?: string) => {
        const u = (unit || 'cm').toLowerCase();
        if (u === 'cm') return 1;
        if (u === 'mm') return 0.1;
        if (u === 'm' || u === 'meter' || u === 'metre') return 100;
        if (u === 'in' || u === 'inch' || u === 'inches') return 2.54;
        return 1; // default assume cm
    };

    // Parse dimensions provided either as a string like "10x20x30 cm" or as an object { width, height, length, unit }
    const parseDimsToCm = (dims: any) => {
        if (!dims) return { l: 0, w: 0, h: 0 };

        if (typeof dims === 'string') {
            // Match flexible patterns with separators and optional unit
            const match = dims.match(/([0-9]*\.?[0-9]+)\s*[xX×]\s*([0-9]*\.?[0-9]+)\s*[xX×]\s*([0-9]*\.?[0-9]+)\s*(mm|cm|m|in|inch|inches)?/i);
            if (match) {
                const l = parseFloat(match[1]);
                const w = parseFloat(match[2]);
                const h = parseFloat(match[3]);
                const factor = unitToCm(match[4]);
                return { l: l * factor, w: w * factor, h: h * factor };
            }
            return { l: 0, w: 0, h: 0 };
        }

        if (typeof dims === 'object') {
            const { width, height, length, unit } = (dims as any) || {};
            const factor = unitToCm(unit);
            const l = parseFloat(String(length ?? 0)) * factor;
            const w = parseFloat(String(width ?? 0)) * factor;
            const h = parseFloat(String(height ?? 0)) * factor;
            return { l, w, h };
        }

        return { l: 0, w: 0, h: 0 };
    };

    const calculateTotalVolume = () => {
        const totalVolumeCm3 = (job?.request?.moving_items || []).reduce((sum: number, item: any) => {
            const dims = item?.dimensions as any;
            const { l, w, h } = parseDimsToCm(dims);
            const qty = (item?.quantity ?? 1) as number;
            const vol = l > 0 && w > 0 && h > 0 ? l * w * h * qty : 0;
            return sum + vol;
        }, 0);

        const totalVolumeM3 = totalVolumeCm3 / 1_000_000; // cm³ -> m³
        return totalVolumeM3 > 0 ? `${totalVolumeM3.toFixed(2)}\u00A0m\u00B3` : 'N/A';
    };

    const calculateTotalDimensions = () => {
        let totalLengthCm = 0;
        let totalWidthCm = 0;
        let totalHeightCm = 0;

        (job?.request?.moving_items || []).forEach((item: any) => {
            const qty = (item?.quantity ?? 1) as number;
            const { l, w, h } = parseDimsToCm((item as any)?.dimensions);
            totalLengthCm += l * qty;
            totalWidthCm += w * qty;
            totalHeightCm += h * qty;
        });

        if (totalLengthCm === 0 && totalWidthCm === 0 && totalHeightCm === 0) return 'N/A';
        return `${Math.round(totalLengthCm).toLocaleString()} x ${Math.round(totalWidthCm).toLocaleString()} x ${Math.round(totalHeightCm).toLocaleString()} cm`;
    };

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bottom Row - Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Total Weight */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-black dark:text-white mb-1">
                            {(job.request?.moving_items || []).reduce((sum: number, item: any) => {
                                const weight = typeof item.weight === 'string' ? parseFloat(item.weight) || 0 : item.weight || 0;
                                return sum + weight;
                            }, 0)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Weight (lbs)</div>
                    </div>
                </div>

                {/* Item Count */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-black dark:text-white mb-1">{(job.request?.moving_items || []).length}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Items</div>
                    </div>
                </div>

                {/* Distance */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-black dark:text-white mb-1">{job.request?.estimated_distance || 0}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Distance (mi)</div>
                    </div>
                </div>

                {/* Base Price */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-black dark:text-white mb-1">£{job.price || 0}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Amount Due to You(£)</div>
                    </div>
                </div>

                {/* Volume & Max Dimensions */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-black dark:text-white mb-1">
                            {calculateTotalVolume()}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Volume (m³)</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            Total Dimensions: {calculateTotalDimensions()}
                        </div>
                    </div>
                </div>

                {/* Insurance Value */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-black dark:text-white mb-1">
                            £
                            {(job.request?.moving_items || [])
                                .reduce((sum: number, item: any) => sum + (item.declared_value || 0), 0)
                                .toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Insurance Value</div>
                    </div>
                </div>
            </div>

            {/* Additional Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {/* Fragile Items */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-2 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-base font-bold text-black dark:text-white mb-1">{(job.request?.items || []).filter((item: any) => item.fragile).length}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Fragile Items</div>
                    </div>
                </div>

                {/* Disassembly Required */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-2 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-base font-bold text-black dark:text-white mb-1">{(job.request?.items || []).filter((item: any) => item.needs_disassembly).length}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Disassembly</div>
                    </div>
                </div>

                {/* Insurance Required */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-2 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-base font-bold text-black dark:text-white mb-1">{job.request?.insurance_required ? 'Yes' : 'No'}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Insurance</div>
                    </div>
                </div>

                {/* Priority */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-2 border-2 border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                        <div className="text-base font-bold text-black dark:text-white mb-1">{job.request?.service_level?.toUpperCase() || 'NORMAL'}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Priority</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobMetrics;
