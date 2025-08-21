import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';


class SmartBinsView extends StatefulWidget {
  const SmartBinsView({Key? key}) : super(key: key);

  @override
  State<SmartBinsView> createState() => _SmartBinsViewState();
}

class _SmartBinsViewState extends State<SmartBinsView> {
  String _filterStatus = 'all';
  String _viewMode = 'grid';

  // Mock data matching frontend structure
  final List<Map<String, dynamic>> _smartBins = [
    {
      'id': 'BIN-001',
      'name': 'Kitchen Smart Bin',
      'type': 'General Waste',
      'location': 'Kitchen',
      'fillLevel': 85,
      'capacity': 120,
      'lastCollection': '2024-01-15T10:30:00',
      'nextCollection': '2024-01-18T14:00:00',
      'status': 'full',
      'iotStatus': {
        'connected': true,
        'batteryLevel': 78,
        'signalStrength': 4,
        'wifiConnected': true,
        'lastUpdate': '2024-01-16T08:45:00',
        'temperature': 22.5,
        'humidity': 45,
        'weight': 85.2,
        'odorLevel': 'low',
        'lidStatus': 'closed',
        'sensorStatus': 'all_working'
      },
      'alerts': [
        {'type': 'fill_level', 'message': 'Bin is 85% full', 'priority': 'high'},
        {'type': 'collection_due', 'message': 'Collection due in 2 days', 'priority': 'medium'}
      ],
    },
    {
      'id': 'BIN-002',
      'name': 'Recycling Smart Bin',
      'type': 'Recyclables',
      'location': 'Backyard',
      'fillLevel': 45,
      'capacity': 200,
      'lastCollection': '2024-01-14T09:15:00',
      'nextCollection': '2024-01-21T10:00:00',
      'status': 'medium',
      'iotStatus': {
        'connected': true,
        'batteryLevel': 92,
        'signalStrength': 5,
        'wifiConnected': true,
        'lastUpdate': '2024-01-16T08:42:00',
        'temperature': 18.2,
        'humidity': 52,
        'weight': 45.8,
        'odorLevel': 'none',
        'lidStatus': 'closed',
        'sensorStatus': 'all_working'
      },
      'alerts': [],
    },
    {
      'id': 'BIN-003',
      'name': 'Compost Smart Bin',
      'type': 'Organic Waste',
      'location': 'Garden',
      'fillLevel': 12,
      'capacity': 150,
      'lastCollection': '2024-01-13T11:00:00',
      'nextCollection': '2024-01-20T09:30:00',
      'status': 'low',
      'iotStatus': {
        'connected': false,
        'batteryLevel': 15,
        'signalStrength': 1,
        'wifiConnected': false,
        'lastUpdate': '2024-01-16T06:20:00',
        'temperature': 25.8,
        'humidity': 68,
        'weight': 12.4,
        'odorLevel': 'medium',
        'lidStatus': 'open',
        'sensorStatus': 'battery_low'
      },
      'alerts': [
        {'type': 'connection_lost', 'message': 'IoT device disconnected', 'priority': 'critical'},
        {'type': 'battery_low', 'message': 'Battery level critical (15%)', 'priority': 'high'}
      ],
    },
  ];

  List<Map<String, dynamic>> get _filteredBins {
    if (_filterStatus == 'all') return _smartBins;
    return _smartBins.where((bin) => bin['status'] == _filterStatus).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildHeader(),
        _buildControls(),
        Expanded(
          child: _viewMode == 'grid' 
              ? _buildGridView() 
              : _buildListView(),
        ),
      ],
    );
  }

  Widget _buildHeader() {
    final onlineBins = _smartBins.where((bin) => bin['iotStatus']['connected']).length;
    final totalBins = _smartBins.length;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(16),
          bottomRight: Radius.circular(16),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Smart Bin Network',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '$onlineBins of $totalBins bins online',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.sensors,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildStatCard('Online', onlineBins.toString(), Icons.wifi, Colors.green),
              const SizedBox(width: 8),
              _buildStatCard('Offline', (totalBins - onlineBins).toString(), Icons.wifi_off, Colors.red),
              const SizedBox(width: 8),
              _buildStatCard('Alerts', _smartBins.fold(0, (sum, bin) => sum + (bin['alerts'] as List).length).toString(), Icons.warning, Colors.orange),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 16),
            const SizedBox(height: 2),
            Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControls() {
    return Container(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(6),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _filterStatus,
                  isExpanded: true,
                  icon: const Icon(Icons.arrow_drop_down, size: 16),
                  onChanged: (String? newValue) {
                    setState(() {
                      _filterStatus = newValue!;
                    });
                  },
                  items: [
                    DropdownMenuItem(value: 'all', child: Text('All Status', style: TextStyle(fontSize: 12))),
                    DropdownMenuItem(value: 'empty', child: Text('Empty', style: TextStyle(fontSize: 12))),
                    DropdownMenuItem(value: 'low', child: Text('Low', style: TextStyle(fontSize: 12))),
                    DropdownMenuItem(value: 'medium', child: Text('Medium', style: TextStyle(fontSize: 12))),
                    DropdownMenuItem(value: 'full', child: Text('Full', style: TextStyle(fontSize: 12))),
                    DropdownMenuItem(value: 'critical', child: Text('Critical', style: TextStyle(fontSize: 12))),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: () {
              setState(() {
                _viewMode = _viewMode == 'grid' ? 'list' : 'grid';
              });
            },
            icon: Icon(
              _viewMode == 'grid' ? Icons.view_list : Icons.grid_view,
              color: AppColors.primary,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGridView() {
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.85,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: _filteredBins.length,
      itemBuilder: (context, index) {
        return _buildBinCard(_filteredBins[index]);
      },
    );
  }

  Widget _buildListView() {
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: _filteredBins.length,
      itemBuilder: (context, index) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          child: _buildBinCard(_filteredBins[index]),
        );
      },
    );
  }

  Widget _buildBinCard(Map<String, dynamic> bin) {
    final iotStatus = bin['iotStatus'] as Map<String, dynamic>;
    final alerts = bin['alerts'] as List;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Gradient header based on fill level
          Container(
            height: 3,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: _getFillLevelGradient(bin['fillLevel']),
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
          ),
          
          // Bin header
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Icon(
                        _getBinTypeIcon(bin['type']),
                        color: AppColors.primary,
                        size: 16,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            bin['name'],
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            bin['type'],
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: _getStatusColor(bin['status']).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: _getStatusColor(bin['status'])),
                      ),
                      child: Text(
                        bin['status'].toUpperCase(),
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                          color: _getStatusColor(bin['status']),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.location_on, size: 12, color: AppColors.textSecondary),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        bin['location'],
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Fill level
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Fill Level',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      '${bin['fillLevel']}%',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: _getFillLevelColor(bin['fillLevel']),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Container(
                  height: 6,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(3),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: bin['fillLevel'] / 100,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: _getFillLevelGradient(bin['fillLevel']),
                        ),
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${(bin['fillLevel'] / 100 * bin['capacity']).round()}L / ${bin['capacity']}L',
                  style: const TextStyle(
                    fontSize: 10,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // IoT Status Grid - Compact version
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.sensors, size: 12, color: AppColors.textSecondary),
                    const SizedBox(width: 4),
                    const Text(
                      'Device Status',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  crossAxisSpacing: 6,
                  mainAxisSpacing: 6,
                  childAspectRatio: 4.0,
                  children: [
                    _buildIoTStatusItem(
                      _getBatteryIcon(iotStatus['batteryLevel']),
                      'Battery',
                      '${iotStatus['batteryLevel']}%',
                      _getBatteryColor(iotStatus['batteryLevel']),
                    ),
                    _buildIoTStatusItem(
                      _getSignalIcon(iotStatus['signalStrength']),
                      'Signal',
                      '${iotStatus['signalStrength']}/5',
                      AppColors.success,
                    ),
                    _buildIoTStatusItem(
                      Icon(
                        iotStatus['wifiConnected'] ? Icons.wifi : Icons.wifi_off,
                        size: 12,
                        color: iotStatus['wifiConnected'] ? AppColors.success : AppColors.error,
                      ),
                      'WiFi',
                      iotStatus['wifiConnected'] ? 'On' : 'Off',
                      iotStatus['wifiConnected'] ? AppColors.success : AppColors.error,
                    ),
                    _buildIoTStatusItem(
                      Icon(
                        Icons.sensors,
                        size: 12,
                        color: iotStatus['connected'] ? AppColors.success : AppColors.error,
                      ),
                      'Status',
                      iotStatus['connected'] ? 'Online' : 'Offline',
                      iotStatus['connected'] ? AppColors.success : AppColors.error,
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Weight & Temperature - Compact
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Weight',
                        style: TextStyle(
                          fontSize: 10,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        '${iotStatus['weight']}kg',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Temp',
                        style: TextStyle(
                          fontSize: 10,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        '${iotStatus['temperature']}°C',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Alerts - Compact
          if (alerts.isNotEmpty) ...[
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (var alert in alerts.take(1)) // Show only first alert to save space
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.error.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: AppColors.error.withOpacity(0.3)),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.warning,
                            size: 12,
                            color: AppColors.error,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              alert['message'],
                              style: TextStyle(
                                fontSize: 10,
                                color: AppColors.error,
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 12),

          // Actions - Compact
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // TODO: Schedule pickup
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    child: const Text(
                      'Schedule',
                      style: TextStyle(fontSize: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      // TODO: View details
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      side: BorderSide(color: AppColors.border),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    child: const Text(
                      'Details',
                      style: TextStyle(fontSize: 10),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIoTStatusItem(Widget icon, String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        children: [
          icon,
          const SizedBox(width: 4),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 8,
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  IconData _getBinTypeIcon(String type) {
    switch (type) {
      case 'General Waste':
        return Icons.delete;
      case 'Recyclables':
        return Icons.recycling;
      case 'Organic Waste':
        return Icons.eco;
      default:
        return Icons.delete;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'empty':
        return AppColors.success;
      case 'low':
        return AppColors.info;
      case 'medium':
        return AppColors.warning;
      case 'full':
        return AppColors.error;
      case 'critical':
        return Colors.red;
      default:
        return AppColors.textSecondary;
    }
  }

  Color _getFillLevelColor(int level) {
    if (level >= 90) return Colors.red;
    if (level >= 75) return Colors.orange;
    if (level >= 50) return AppColors.warning;
    if (level >= 25) return AppColors.info;
    return AppColors.success;
  }

  List<Color> _getFillLevelGradient(int level) {
    if (level >= 90) return [Colors.red, Colors.red.shade600];
    if (level >= 75) return [Colors.orange, Colors.orange.shade600];
    if (level >= 50) return [AppColors.warning, AppColors.warning];
    if (level >= 25) return [AppColors.info, AppColors.info];
    return [AppColors.success, AppColors.success];
  }

  Widget _getBatteryIcon(int level) {
    IconData iconData;
    Color color;
    
    if (level <= 10) {
      iconData = Icons.battery_alert;
      color = AppColors.error;
    } else if (level <= 25) {
      iconData = Icons.battery_1_bar;
      color = AppColors.error;
    } else if (level <= 50) {
      iconData = Icons.battery_2_bar;
      color = AppColors.warning;
    } else if (level <= 75) {
      iconData = Icons.battery_3_bar;
      color = AppColors.info;
    } else {
      iconData = Icons.battery_full;
      color = AppColors.success;
    }
    
    return Icon(iconData, size: 12, color: color);
  }

  Color _getBatteryColor(int level) {
    if (level <= 25) return AppColors.error;
    if (level <= 50) return AppColors.warning;
    if (level <= 75) return AppColors.info;
    return AppColors.success;
  }

  Widget _getSignalIcon(int strength) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        return Container(
          width: 1.5,
          height: (index + 1) * 1.5,
          margin: const EdgeInsets.only(right: 0.5),
          decoration: BoxDecoration(
            color: index < strength ? AppColors.success : AppColors.border,
            borderRadius: BorderRadius.circular(0.5),
          ),
        );
      }),
    );
  }
}
