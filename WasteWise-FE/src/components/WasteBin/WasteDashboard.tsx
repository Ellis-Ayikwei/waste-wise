import React, { useEffect, useState } from 'react';
import { 
  FaTrash, FaBatteryFull, FaExclamationTriangle, FaRoute, 
  FaRecycle, FaChartLine, FaUsers, FaTruck 
} from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { MdSensors } from 'react-icons/md';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  totalBins: number;
  activeBins: number;
  fullBins: number;
  offlineBins: number;
  maintenanceRequired: number;
  averageFillLevel: number;
  totalCollections: number;
  totalWeightCollected: number;
  collectionEfficiency: number;
  recyclingRate: number;
  citizenReports: number;
  resolvedReports: number;
  activeAlerts: number;
  co2Saved: number;
}

interface BinStatusData {
  empty: number;
  low: number;
  medium: number;
  high: number;
  full: number;
}

interface AreaData {
  area: string;
  bins: number;
  fillLevel: number;
}

export const WasteDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBins: 250,
    activeBins: 245,
    fullBins: 32,
    offlineBins: 5,
    maintenanceRequired: 8,
    averageFillLevel: 52.3,
    totalCollections: 1847,
    totalWeightCollected: 45320,
    collectionEfficiency: 97.8,
    recyclingRate: 42.5,
    citizenReports: 156,
    resolvedReports: 142,
    activeAlerts: 14,
    co2Saved: 2340,
  });

  const [binStatus, setBinStatus] = useState<BinStatusData>({
    empty: 45,
    low: 68,
    medium: 82,
    high: 38,
    full: 17,
  });

  const [areaData, setAreaData] = useState<AreaData[]>([
    { area: 'Accra Central', bins: 45, fillLevel: 58 },
    { area: 'Tema', bins: 38, fillLevel: 62 },
    { area: 'Madina', bins: 52, fillLevel: 48 },
    { area: 'Kasoa', bins: 41, fillLevel: 55 },
    { area: 'Achimota', bins: 35, fillLevel: 51 },
    { area: 'Dansoman', bins: 39, fillLevel: 49 },
  ]);

  // Chart configurations
  const fillLevelTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Average Fill Level (%)',
        data: [48, 52, 55, 51, 54, 58, 52],
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const binStatusChartData = {
    labels: ['Empty', 'Low', 'Medium', 'High', 'Full'],
    datasets: [
      {
        data: [binStatus.empty, binStatus.low, binStatus.medium, binStatus.high, binStatus.full],
        backgroundColor: ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'],
        borderWidth: 0,
      },
    ],
  };

  const collectionsByAreaData = {
    labels: areaData.map(d => d.area),
    datasets: [
      {
        label: 'Collections',
        data: [245, 198, 267, 212, 189, 201],
        backgroundColor: '#0288d1',
      },
      {
        label: 'Reports',
        data: [23, 18, 31, 25, 19, 22],
        backgroundColor: '#ffeb3b',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Stat Card Component
  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: number;
    color: string;
  }> = ({ icon, title, value, subtitle, trend, color }) => (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
              <span className="text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="waste-dashboard p-6 bg-gray-50 dark:bg-dark-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-400 mb-2">
          WasteWise Operations Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time monitoring and analytics for smart waste management
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaTrash className="text-white text-xl" />}
          title="Total Bins"
          value={stats.totalBins}
          subtitle={`${stats.activeBins} active`}
          color="bg-primary-500"
        />
        <StatCard
          icon={<IoMdAlert className="text-white text-xl" />}
          title="Bins Need Collection"
          value={stats.fullBins}
          subtitle="Above 80% capacity"
          trend={-12}
          color="bg-warning-500"
        />
        <StatCard
          icon={<MdSensors className="text-white text-xl" />}
          title="Average Fill Level"
          value={`${stats.averageFillLevel.toFixed(1)}%`}
          subtitle="Across all bins"
          trend={3.2}
          color="bg-secondary-500"
        />
        <StatCard
          icon={<FaBatteryFull className="text-white text-xl" />}
          title="System Health"
          value={`${((stats.activeBins / stats.totalBins) * 100).toFixed(0)}%`}
          subtitle={`${stats.offlineBins} offline`}
          color="bg-success-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Fill Level Trend */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Weekly Fill Level Trend
          </h3>
          <div className="h-64">
            <Line data={fillLevelTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Bin Status Distribution */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Bin Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={binStatusChartData} options={chartOptions} />
          </div>
        </div>

        {/* Collections by Area */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Collections & Reports by Area
          </h3>
          <div className="h-64">
            <Bar data={collectionsByAreaData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaTruck className="text-white text-xl" />}
          title="Collection Efficiency"
          value={`${stats.collectionEfficiency}%`}
          subtitle="On-time collections"
          trend={2.1}
          color="bg-info-500"
        />
        <StatCard
          icon={<FaRecycle className="text-white text-xl" />}
          title="Recycling Rate"
          value={`${stats.recyclingRate}%`}
          subtitle="Of total waste"
          trend={5.3}
          color="bg-success-500"
        />
        <StatCard
          icon={<FaUsers className="text-white text-xl" />}
          title="Citizen Reports"
          value={stats.citizenReports}
          subtitle={`${stats.resolvedReports} resolved`}
          color="bg-secondary-500"
        />
        <StatCard
          icon={<FaChartLine className="text-white text-xl" />}
          title="CO₂ Saved"
          value={`${(stats.co2Saved / 1000).toFixed(1)}t`}
          subtitle="This month"
          trend={8.7}
          color="bg-primary-500"
        />
      </div>

      {/* Area Performance Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Area Performance Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Area
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total Bins
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Avg Fill Level
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {areaData.map((area, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {area.area}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {area.bins}
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${area.fillLevel}%`,
                            backgroundColor: area.fillLevel > 70 ? '#ff9800' : area.fillLevel > 50 ? '#ffeb3b' : '#4caf50',
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {area.fillLevel}%
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      area.fillLevel > 70 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : area.fillLevel > 50
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {area.fillLevel > 70 ? 'High' : area.fillLevel > 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Active Alerts ({stats.activeAlerts})
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Bin Overflow - Market Street
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
              Critical
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center">
              <FaBatteryFull className="text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Low Battery - Bin #GH-042
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
              Medium
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteDashboard;