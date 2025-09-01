import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPercent, faExchangeAlt, faReceipt, faClock, faUndo, faCreditCard, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import StatCard from '../../../components/ui/statCard';
import Ghc from '../../../helper/CurrencyFormatter';
import { RevenueStats as RevenueStatsType } from './types';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

interface RevenueStatsProps {
    revenueStats: RevenueStatsType;
}

const RevenueStats: React.FC<RevenueStatsProps> = ({ revenueStats }) => {
    const formatCurrency = Ghc;
    const barChartRef = useRef<ChartJS<'bar'> | null>(null);
    const pieChartRef = useRef<ChartJS<'pie'> | null>(null);

    // Cleanup charts on unmount
    useEffect(() => {
        return () => {
            if (barChartRef.current) {
                barChartRef.current.destroy();
            }
            if (pieChartRef.current) {
                pieChartRef.current.destroy();
            }
        };
    }, []);

    // Generate dynamic colors based on data length
    const generateColors = (count: number) => {
        const colors = [
            'rgba(59, 130, 246, 0.5)',   // Blue
            'rgba(16, 185, 129, 0.5)',   // Green
            'rgba(251, 146, 60, 0.5)',   // Orange
            'rgba(139, 92, 246, 0.5)',   // Purple
            'rgba(239, 68, 68, 0.5)',    // Red
            'rgba(6, 182, 212, 0.5)',    // Cyan
            'rgba(168, 85, 247, 0.5)',   // Violet
            'rgba(34, 197, 94, 0.5)',    // Emerald
        ];
        
        const borderColors = colors.map(color => color.replace('0.5', '1'));
        
        return {
            backgrounds: colors.slice(0, count),
            borders: borderColors.slice(0, count)
        };
    };

    // Chart data
    const months = Object.keys(revenueStats?.revenueByMonth || {});
    const monthlyRevenue = Object.values(revenueStats?.revenueByMonth || {});
    const paymentMethodLabels = Object.keys(revenueStats?.revenueByPaymentMethod || {});
    const paymentMethodValues = Object.values(revenueStats?.revenueByPaymentMethod || {});

    // Generate colors for charts
    const barColors = generateColors(1);
    const pieColors = generateColors(paymentMethodLabels.length);

    const revenueChartData = {
        labels: months.length > 0 ? months : ['No Data'],
        datasets: [
            {
                label: 'Monthly Revenue',
                data: monthlyRevenue.length > 0 ? monthlyRevenue : [0],
                backgroundColor: barColors.backgrounds[0],
                borderColor: barColors.borders[0],
                borderWidth: 1,
            },
        ],
    };

    const paymentMethodChartData = {
        labels: paymentMethodLabels.length > 0 ? paymentMethodLabels : ['No Data'],
        datasets: [
            {
                label: 'Revenue by Payment Method',
                data: paymentMethodValues.length > 0 ? paymentMethodValues : [0],
                backgroundColor: pieColors.backgrounds,
                borderColor: pieColors.borders,
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
        },
    };

    // Check if we have any data to display
    const hasData = revenueStats && (
        revenueStats.totalRevenue > 0 ||
        revenueStats.platformFees > 0 ||
        revenueStats.providerPayouts > 0 ||
        revenueStats.netIncome > 0 ||
        revenueStats.pendingPayments > 0 ||
        revenueStats.refundsIssued > 0 ||
        revenueStats.transactionCount > 0 ||
        revenueStats.averageBookingValue > 0
    );

    if (!hasData) {
        return (
            <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-500 mb-4">
                        <FontAwesomeIcon icon={faChartLine} size="3x" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Revenue Data Available</h3>
                    <p className="text-gray-600">Revenue statistics will appear here once payment data is available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={faDollarSign}
                    title="Total Revenue"
                    value={formatCurrency(revenueStats.totalRevenue)}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faPercent}
                    title="Platform Fees"
                    value={formatCurrency(revenueStats.platformFees)}
                    color="green"
                    delay={0.2}
                />
                <StatCard
                    icon={faExchangeAlt}
                    title="Provider Payouts"
                    value={formatCurrency(revenueStats.providerPayouts)}
                    color="purple"
                    delay={0.3}
                />
                <StatCard
                    icon={faReceipt}
                    title="Net Income"
                    value={formatCurrency(revenueStats.netIncome)}
                    color="yellow"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={faClock}
                    title="Pending Payments"
                    value={formatCurrency(revenueStats.pendingPayments)}
                    color="indigo"
                    delay={0.5}
                />
                <StatCard
                    icon={faUndo}
                    title="Refunds Issued"
                    value={formatCurrency(revenueStats.refundsIssued)}
                    color="red"
                    delay={0.6}
                />
                <StatCard
                    icon={faCreditCard}
                    title="Transaction Count"
                    value={revenueStats.transactionCount}
                    color="blue"
                    delay={0.7}
                />
                <StatCard
                    icon={faChartLine}
                    title="Avg. Booking Value"
                    value={formatCurrency(revenueStats.averageBookingValue)}
                    color="green"
                    delay={0.8}
                />
            </div>

            {/* Only show charts if we have data */}
            {(months.length > 0 || paymentMethodLabels.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="font-semibold mb-4">Monthly Revenue</h3>
                        <div className="h-64">
                            <Bar
                                data={revenueChartData}
                                options={barChartOptions}
                                ref={(chart) => {
                                    if (chart) {
                                        barChartRef.current = chart;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="font-semibold mb-4">Revenue by Payment Method</h3>
                        <div className="h-64 flex justify-center">
                            <Pie
                                data={paymentMethodChartData}
                                options={pieChartOptions}
                                ref={(chart) => {
                                    if (chart) {
                                        pieChartRef.current = chart;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueStats;
