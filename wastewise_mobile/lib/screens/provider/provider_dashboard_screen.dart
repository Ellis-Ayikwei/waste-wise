import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/get.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../redux/app_state.dart';
import '../../models/job_model.dart';
import '../../widgets/job_card.dart';
import '../../widgets/earnings_card.dart';
import '../../utils/constants.dart';

class ProviderDashboardScreen extends StatefulWidget {
  const ProviderDashboardScreen({Key? key}) : super(key: key);

  @override
  State<ProviderDashboardScreen> createState() => _ProviderDashboardScreenState();
}

class _ProviderDashboardScreenState extends State<ProviderDashboardScreen> {
  int _selectedIndex = 0;
  bool _isOnline = true;
  GoogleMapController? _mapController;
  
  final List<Widget> _pages = [
    const _DashboardHome(),
    const _JobsPage(),
    const _EarningsPage(),
    const _ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WasteWise Provider'),
        actions: [
          // Online/Offline Toggle
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
              color: _isOnline ? Colors.green : Colors.grey,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text(
                    _isOnline ? 'Online' : 'Offline',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Switch(
                  value: _isOnline,
                  onChanged: (value) {
                    setState(() => _isOnline = value);
                    // Update provider availability
                    StoreProvider.of<AppState>(context).dispatch(
                      UpdateAvailabilityAction(isAvailable: value),
                    );
                  },
                  activeColor: Colors.white,
                  activeTrackColor: Colors.green[300],
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () => Get.toNamed('/notifications'),
          ),
        ],
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.work),
            label: 'Jobs',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet),
            label: 'Earnings',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

// Dashboard Home Page
class _DashboardHome extends StatelessWidget {
  const _DashboardHome({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _DashboardViewModel>(
      converter: (store) => _DashboardViewModel.fromStore(store),
      builder: (context, vm) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Header
              Text(
                'Welcome back, ${vm.providerName}!',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ).animate().fadeIn(),
              
              const SizedBox(height: 8),
              Text(
                'Here\'s your performance today',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey,
                ),
              ).animate().fadeIn(delay: 100.ms),
              
              const SizedBox(height: 20),
              
              // Stats Cards
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 1.5,
                children: [
                  _StatCard(
                    title: 'Jobs Today',
                    value: '${vm.jobsToday}',
                    icon: FontAwesomeIcons.briefcase,
                    color: Colors.blue,
                  ).animate().scale(delay: 200.ms),
                  _StatCard(
                    title: 'Earnings',
                    value: 'GHS ${vm.earningsToday}',
                    icon: FontAwesomeIcons.moneyBill,
                    color: Colors.green,
                  ).animate().scale(delay: 300.ms),
                  _StatCard(
                    title: 'Rating',
                    value: '${vm.rating}',
                    icon: FontAwesomeIcons.star,
                    color: Colors.orange,
                  ).animate().scale(delay: 400.ms),
                  _StatCard(
                    title: 'Completion',
                    value: '${vm.completionRate}%',
                    icon: FontAwesomeIcons.chartLine,
                    color: Colors.purple,
                  ).animate().scale(delay: 500.ms),
                ],
              ),
              
              const SizedBox(height: 24),
              
              // Active Jobs Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Active Jobs',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () => Get.toNamed('/provider/jobs'),
                    child: const Text('View All'),
                  ),
                ],
              ),
              
              // Active Jobs List
              if (vm.activeJobs.isEmpty)
                Container(
                  padding: const EdgeInsets.all(32),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(
                          Icons.inbox,
                          size: 64,
                          color: Colors.grey[300],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No active jobs',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: vm.activeJobs.length,
                  itemBuilder: (context, index) {
                    final job = vm.activeJobs[index];
                    return JobCard(
                      job: job,
                      onTap: () => Get.toNamed('/provider/job-details', arguments: job),
                      onAccept: () {
                        StoreProvider.of<AppState>(context).dispatch(
                          AcceptJobAction(jobId: job.id),
                        );
                      },
                      onReject: () {
                        StoreProvider.of<AppState>(context).dispatch(
                          RejectJobAction(jobId: job.id),
                        );
                      },
                    ).animate().slideX(delay: Duration(milliseconds: 600 + (index * 100)));
                  },
                ),
              
              const SizedBox(height: 24),
              
              // Pending Offers
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'New Offers',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (vm.pendingOffers.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${vm.pendingOffers.length}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Pending Offers List
              if (vm.pendingOffers.isEmpty)
                Container(
                  padding: const EdgeInsets.all(32),
                  child: Center(
                    child: Text(
                      'No new offers',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.grey,
                      ),
                    ),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: vm.pendingOffers.length,
                  itemBuilder: (context, index) {
                    final offer = vm.pendingOffers[index];
                    return _OfferCard(
                      offer: offer,
                      onAccept: () {
                        StoreProvider.of<AppState>(context).dispatch(
                          AcceptOfferAction(offerId: offer.id),
                        );
                      },
                      onReject: () {
                        StoreProvider.of<AppState>(context).dispatch(
                          RejectOfferAction(offerId: offer.id),
                        );
                      },
                    );
                  },
                ),
            ],
          ),
        );
      },
    );
  }
}

// Jobs Page
class _JobsPage extends StatefulWidget {
  const _JobsPage({Key? key}) : super(key: key);

  @override
  State<_JobsPage> createState() => _JobsPageState();
}

class _JobsPageState extends State<_JobsPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Active'),
            Tab(text: 'Pending'),
            Tab(text: 'Completed'),
          ],
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              _JobsList(status: 'active'),
              _JobsList(status: 'pending'),
              _JobsList(status: 'completed'),
            ],
          ),
        ),
      ],
    );
  }
}

// Jobs List Widget
class _JobsList extends StatelessWidget {
  final String status;
  
  const _JobsList({Key? key, required this.status}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, List<Job>>(
      converter: (store) {
        switch (status) {
          case 'active':
            return store.state.providerState.activeJobs;
          case 'pending':
            return store.state.providerState.pendingJobs;
          case 'completed':
            return store.state.providerState.completedJobs;
          default:
            return [];
        }
      },
      builder: (context, jobs) {
        if (jobs.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.inbox,
                  size: 64,
                  color: Colors.grey[300],
                ),
                const SizedBox(height: 16),
                Text(
                  'No $status jobs',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          );
        }
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: jobs.length,
          itemBuilder: (context, index) {
            final job = jobs[index];
            return JobCard(
              job: job,
              onTap: () => Get.toNamed('/provider/job-details', arguments: job),
            );
          },
        );
      },
    );
  }
}

// Earnings Page
class _EarningsPage extends StatelessWidget {
  const _EarningsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _EarningsViewModel>(
      converter: (store) => _EarningsViewModel.fromStore(store),
      builder: (context, vm) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Balance Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primary, AppColors.primary.withOpacity(0.8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Available Balance',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'GHS ${vm.balance.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => Get.toNamed('/provider/withdraw'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: AppColors.primary,
                            ),
                            child: const Text('Withdraw'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Get.toNamed('/provider/earnings-history'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.white,
                              side: const BorderSide(color: Colors.white),
                            ),
                            child: const Text('History'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ).animate().scale(),
              
              const SizedBox(height: 24),
              
              // Earnings Chart
              Text(
                'Weekly Earnings',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              
              Container(
                height: 200,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: LineChart(
                  LineChartData(
                    gridData: FlGridData(show: false),
                    titlesData: FlTitlesData(
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (value, meta) {
                            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                            return Text(
                              days[value.toInt()],
                              style: const TextStyle(fontSize: 10),
                            );
                          },
                        ),
                      ),
                    ),
                    borderData: FlBorderData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: vm.weeklyEarnings
                            .asMap()
                            .entries
                            .map((e) => FlSpot(e.key.toDouble(), e.value))
                            .toList(),
                        isCurved: true,
                        color: AppColors.primary,
                        barWidth: 3,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: AppColors.primary.withOpacity(0.1),
                        ),
                      ),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: 200.ms),
              
              const SizedBox(height: 24),
              
              // Recent Transactions
              Text(
                'Recent Transactions',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: vm.recentTransactions.length,
                itemBuilder: (context, index) {
                  final transaction = vm.recentTransactions[index];
                  return _TransactionTile(transaction: transaction);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

// Profile Page
class _ProfilePage extends StatelessWidget {
  const _ProfilePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Profile Header
          CircleAvatar(
            radius: 50,
            backgroundColor: AppColors.primary,
            child: const Icon(
              Icons.person,
              size: 50,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'John Doe',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.green,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'Verified Provider',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
              ),
            ),
          ),
          
          const SizedBox(height: 32),
          
          // Profile Options
          _ProfileOption(
            icon: Icons.person_outline,
            title: 'Personal Information',
            onTap: () => Get.toNamed('/provider/personal-info'),
          ),
          _ProfileOption(
            icon: Icons.directions_car,
            title: 'Vehicle Information',
            onTap: () => Get.toNamed('/provider/vehicle-info'),
          ),
          _ProfileOption(
            icon: Icons.category,
            title: 'Waste Categories',
            onTap: () => Get.toNamed('/provider/categories'),
          ),
          _ProfileOption(
            icon: Icons.document_scanner,
            title: 'Documents',
            onTap: () => Get.toNamed('/provider/documents'),
          ),
          _ProfileOption(
            icon: Icons.settings,
            title: 'Settings',
            onTap: () => Get.toNamed('/settings'),
          ),
          _ProfileOption(
            icon: Icons.help_outline,
            title: 'Help & Support',
            onTap: () => Get.toNamed('/support'),
          ),
          _ProfileOption(
            icon: Icons.logout,
            title: 'Logout',
            onTap: () {
              Get.dialog(
                AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Get.back(),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () {
                        StoreProvider.of<AppState>(context).dispatch(LogoutAction());
                        Get.offAllNamed('/auth/login');
                      },
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

// Helper Widgets
class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    Key? key,
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: color,
              size: 20,
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _OfferCard extends StatelessWidget {
  final JobOffer offer;
  final VoidCallback onAccept;
  final VoidCallback onReject;

  const _OfferCard({
    Key? key,
    required this.offer,
    required this.onAccept,
    required this.onReject,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.orange, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orange,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'NEW OFFER',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                'Expires in ${offer.expiresIn}',
                style: const TextStyle(
                  color: Colors.red,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            offer.wasteCategory,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.location_on, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  offer.address,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.scale, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    '${offer.weight} kg',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
              Row(
                children: [
                  const Icon(Icons.route, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    '${offer.distance} km',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
              Text(
                'GHS ${offer.price}',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onReject,
                  child: const Text('Reject'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: onAccept,
                  child: const Text('Accept'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _TransactionTile extends StatelessWidget {
  final Transaction transaction;

  const _TransactionTile({Key? key, required this.transaction}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: transaction.type == 'credit' 
              ? Colors.green.withOpacity(0.1)
              : Colors.red.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(
          transaction.type == 'credit' 
              ? Icons.arrow_downward
              : Icons.arrow_upward,
          color: transaction.type == 'credit' ? Colors.green : Colors.red,
        ),
      ),
      title: Text(transaction.description),
      subtitle: Text(transaction.date),
      trailing: Text(
        '${transaction.type == 'credit' ? '+' : '-'} GHS ${transaction.amount}',
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: transaction.type == 'credit' ? Colors.green : Colors.red,
        ),
      ),
    );
  }
}

class _ProfileOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _ProfileOption({
    Key? key,
    required this.icon,
    required this.title,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary),
      title: Text(title),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}

// View Models
class _DashboardViewModel {
  final String providerName;
  final int jobsToday;
  final double earningsToday;
  final double rating;
  final int completionRate;
  final List<Job> activeJobs;
  final List<JobOffer> pendingOffers;

  _DashboardViewModel({
    required this.providerName,
    required this.jobsToday,
    required this.earningsToday,
    required this.rating,
    required this.completionRate,
    required this.activeJobs,
    required this.pendingOffers,
  });

  static _DashboardViewModel fromStore(Store<AppState> store) {
    final state = store.state.providerState;
    return _DashboardViewModel(
      providerName: state.providerName ?? 'Provider',
      jobsToday: state.jobsToday,
      earningsToday: state.earningsToday,
      rating: state.rating,
      completionRate: state.completionRate,
      activeJobs: state.activeJobs,
      pendingOffers: state.pendingOffers,
    );
  }
}

class _EarningsViewModel {
  final double balance;
  final List<double> weeklyEarnings;
  final List<Transaction> recentTransactions;

  _EarningsViewModel({
    required this.balance,
    required this.weeklyEarnings,
    required this.recentTransactions,
  });

  static _EarningsViewModel fromStore(Store<AppState> store) {
    final state = store.state.providerState;
    return _EarningsViewModel(
      balance: state.balance,
      weeklyEarnings: state.weeklyEarnings,
      recentTransactions: state.recentTransactions,
    );
  }
}

// Placeholder classes (should be defined in models)
class Job {
  final String id;
  final String category;
  final String address;
  final double weight;
  final double price;
  final String status;

  Job({
    required this.id,
    required this.category,
    required this.address,
    required this.weight,
    required this.price,
    required this.status,
  });
}

class JobOffer {
  final String id;
  final String wasteCategory;
  final String address;
  final double weight;
  final double distance;
  final double price;
  final String expiresIn;

  JobOffer({
    required this.id,
    required this.wasteCategory,
    required this.address,
    required this.weight,
    required this.distance,
    required this.price,
    required this.expiresIn,
  });
}

class Transaction {
  final String description;
  final String date;
  final double amount;
  final String type;

  Transaction({
    required this.description,
    required this.date,
    required this.amount,
    required this.type,
  });
}

// Placeholder actions
class UpdateAvailabilityAction {
  final bool isAvailable;
  UpdateAvailabilityAction({required this.isAvailable});
}

class AcceptJobAction {
  final String jobId;
  AcceptJobAction({required this.jobId});
}

class RejectJobAction {
  final String jobId;
  RejectJobAction({required this.jobId});
}

class AcceptOfferAction {
  final String offerId;
  AcceptOfferAction({required this.offerId});
}

class RejectOfferAction {
  final String offerId;
  RejectOfferAction({required this.offerId});
}

class LogoutAction {}