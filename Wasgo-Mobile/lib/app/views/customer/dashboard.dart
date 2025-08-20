import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/controllers/customer_controller.dart';
import 'package:bytedev/app/views/main_screen.dart';
import 'package:redux/redux.dart';
// TODO: Install lucide_icons_flutter package and uncomment the import below
// import 'package:lucide_icons_flutter/lucide_icons.dart';

class CustomerDashboard extends StatefulWidget {
  const CustomerDashboard({Key? key}) : super(key: key);

  @override
  State<CustomerDashboard> createState() => _CustomerDashboardState();
}

class _CustomerDashboardState extends State<CustomerDashboard> with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  // Responsive helper methods
  double _getResponsiveFontSize(BuildContext context, double baseSize) {
    final width = MediaQuery.of(context).size.width;
    if (width < 480) return baseSize * 0.85;
    if (width < 600) return baseSize * 0.9;
    if (width < 768) return baseSize * 0.95;
    return baseSize;
  }

  double _getResponsiveIconSize(BuildContext context, double baseSize) {
    final width = MediaQuery.of(context).size.width;
    if (width < 480) return baseSize * 0.8;
    if (width < 600) return baseSize * 0.85;
    if (width < 768) return baseSize * 0.9;
    return baseSize;
  }

  EdgeInsets _getResponsivePadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < 480) return const EdgeInsets.all(12);
    if (width < 600) return const EdgeInsets.all(16);
    if (width < 768) return const EdgeInsets.all(20);
    return const EdgeInsets.all(24);
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ViewModel>(
      converter: (store) => _ViewModel(
        state: store.state,
        controller: CustomerController(store),
      ),
      builder: (context, vm) {
        return CustomerMainScreen(
          title: 'Dashboard',
          child: RefreshIndicator(
            onRefresh: () async {
              // TODO: Refresh dashboard data
            },
            child: vm.state.customerState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : FadeTransition(
                    opacity: _fadeAnimation,
                    child: SlideTransition(
                      position: _slideAnimation,
                      child: SingleChildScrollView(
                        padding: _getResponsivePadding(context),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildWelcomeSection(),
                            SizedBox(height: _getResponsiveFontSize(context, 24)),
                            _buildStatsSection(),
                            SizedBox(height: _getResponsiveFontSize(context, 24)),
                            _buildQuickActions(),
                            SizedBox(height: _getResponsiveFontSize(context, 24)),
                            _buildRecentPickups(),
                            SizedBox(height: _getResponsiveFontSize(context, 24)),
                            _buildEnvironmentalImpact(),
                          ],
                        ),
                      ),
                    ),
                  ),
          ),
        );
      },
    );
  }

  Widget _buildWelcomeSection() {
    return Container(
      padding: _getResponsivePadding(context),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 16)),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(_getResponsiveFontSize(context, 12)),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 12)),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Icon(
                  Icons.eco,
                  color: Colors.white,
                  size: _getResponsiveIconSize(context, 24),
                ),
              ),
              SizedBox(width: _getResponsiveFontSize(context, 12)),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome back!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: _getResponsiveFontSize(context, 18),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      'Keep making Ghana cleaner',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: _getResponsiveFontSize(context, 14),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: _getResponsiveFontSize(context, 16)),
          Text(
            'You\'ve helped divert 45kg of waste from landfills this month!',
            style: TextStyle(
              color: Colors.white,
              fontSize: _getResponsiveFontSize(context, 16),
              fontWeight: FontWeight.w500,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'This Month',
          style: TextStyle(
            fontSize: _getResponsiveFontSize(context, 20),
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: _getResponsiveFontSize(context, 16)),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          crossAxisSpacing: _getResponsiveFontSize(context, 16),
          mainAxisSpacing: _getResponsiveFontSize(context, 16),
          childAspectRatio: 1.8,
          children: [
            _buildStatCard(
              'Pickups',
              '12',
              Icons.local_shipping,
              AppColors.primary,
            ),
            _buildStatCard(
              'Recycled',
              '45kg',
              Icons.recycling,
              AppColors.recyclable,
            ),
            _buildStatCard(
              'Points',
              '1,250',
              Icons.stars,
              AppColors.warning,
            ),
            _buildStatCard(
              'Savings',
              '₵180',
              Icons.account_balance_wallet,
              AppColors.success,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(_getResponsiveFontSize(context, 16)),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 12)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(
          color: AppColors.border,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(_getResponsiveFontSize(context, 8)),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 8)),
                ),
                child: Icon(
                  icon, 
                  color: color, 
                  size: _getResponsiveIconSize(context, 20)
                ),
              ),
              const Spacer(),
                              Icon(
                  Icons.trending_up, 
                  color: AppColors.success, 
                  size: _getResponsiveIconSize(context, 16)
                ),
            ],
          ),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: _getResponsiveFontSize(context, 24),
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: _getResponsiveFontSize(context, 14),
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: _getResponsiveFontSize(context, 20),
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: _getResponsiveFontSize(context, 16)),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                'Request Pickup',
                Icons.add_circle_outline,
                AppColors.primary,
                () => Get.toNamed('/customer/request-pickup'),
              ),
            ),
            SizedBox(width: _getResponsiveFontSize(context, 12)),
            Expanded(
              child: _buildActionCard(
                'Schedule Pickup',
                Icons.calendar_today,
                AppColors.info,
                () => Get.toNamed('/customer/schedule-pickup'),
              ),
            ),
          ],
        ),
        SizedBox(height: _getResponsiveFontSize(context, 12)),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                'Active Pickups',
                Icons.local_shipping,
                AppColors.warning,
                () => Get.toNamed('/customer/active-pickups'),
              ),
            ),
            SizedBox(width: _getResponsiveFontSize(context, 12)),
            Expanded(
              child: _buildActionCard(
                'View History',
                Icons.history,
                AppColors.textSecondary,
                () => Get.toNamed('/customer/pickup-history'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard(String title, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(_getResponsiveFontSize(context, 16)),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 12)),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(_getResponsiveFontSize(context, 12)),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 12)),
              ),
              child: Icon(
                icon, 
                color: color, 
                size: _getResponsiveIconSize(context, 24)
              ),
            ),
            SizedBox(height: _getResponsiveFontSize(context, 8)),
            Text(
              title,
              style: TextStyle(
                fontSize: _getResponsiveFontSize(context, 14),
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentPickups() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Pickups',
              style: TextStyle(
                fontSize: _getResponsiveFontSize(context, 20),
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            TextButton(
              onPressed: () => Get.toNamed('/customer/pickup-history'),
              child: Text(
                'View All',
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w500,
                  fontSize: _getResponsiveFontSize(context, 14),
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: _getResponsiveFontSize(context, 16)),
        Container(
          padding: EdgeInsets.all(_getResponsiveFontSize(context, 16)),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 12)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
            border: Border.all(
              color: AppColors.border,
              width: 1,
            ),
          ),
          child: Column(
            children: [
              _buildPickupItem(
                'General Waste',
                '2 days ago',
                'Completed',
                AppColors.success,
                Icons.check_circle,
              ),
              Divider(color: AppColors.borderLight),
              _buildPickupItem(
                'Recyclables',
                '1 week ago',
                'Completed',
                AppColors.success,
                Icons.check_circle,
              ),
              Divider(color: AppColors.borderLight),
              _buildPickupItem(
                'Organic Waste',
                '2 weeks ago',
                'Completed',
                AppColors.success,
                Icons.check_circle,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPickupItem(String type, String date, String status, Color statusColor, IconData statusIcon) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: _getResponsiveFontSize(context, 8)),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(_getResponsiveFontSize(context, 8)),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 8)),
            ),
            child: Icon(
              Icons.delete_outline,
              color: AppColors.primary,
              size: _getResponsiveIconSize(context, 20),
            ),
          ),
          SizedBox(width: _getResponsiveFontSize(context, 12)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  type,
                  style: TextStyle(
                    fontSize: _getResponsiveFontSize(context, 16),
                    fontWeight: FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  date,
                  style: TextStyle(
                    fontSize: _getResponsiveFontSize(context, 14),
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Row(
            children: [
              Icon(
                statusIcon, 
                color: statusColor, 
                size: _getResponsiveIconSize(context, 16)
              ),
              SizedBox(width: _getResponsiveFontSize(context, 4)),
              Text(
                status,
                style: TextStyle(
                  fontSize: _getResponsiveFontSize(context, 14),
                  color: statusColor,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEnvironmentalImpact() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Environmental Impact',
          style: TextStyle(
            fontSize: _getResponsiveFontSize(context, 20),
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: _getResponsiveFontSize(context, 16)),
        Container(
          padding: EdgeInsets.all(_getResponsiveFontSize(context, 20)),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.success.withOpacity(0.1), AppColors.primary.withOpacity(0.1)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 16)),
            border: Border.all(color: AppColors.success.withOpacity(0.3)),
            boxShadow: [
              BoxShadow(
                color: AppColors.success.withOpacity(0.1),
                blurRadius: 15,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.eco,
                        color: AppColors.success,
                        size: _getResponsiveIconSize(context, 20),
                      ),
                      SizedBox(width: _getResponsiveFontSize(context, 8)),
                      Text(
                        'CO₂ Saved',
                        style: TextStyle(
                          fontSize: _getResponsiveFontSize(context, 16),
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    '12.5 kg',
                    style: TextStyle(
                      fontSize: _getResponsiveFontSize(context, 20),
                      fontWeight: FontWeight.w700,
                      color: AppColors.success,
                    ),
                  ),
                ],
              ),
              SizedBox(height: _getResponsiveFontSize(context, 12)),
              ClipRRect(
                borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 8)),
                child: LinearProgressIndicator(
                  value: 0.75,
                  backgroundColor: AppColors.border,
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.success),
                  minHeight: _getResponsiveFontSize(context, 8),
                ),
              ),
              SizedBox(height: _getResponsiveFontSize(context, 8)),
              Text(
                '75% of monthly goal achieved',
                style: TextStyle(
                  fontSize: _getResponsiveFontSize(context, 12),
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ViewModel {
  final AppState state;
  final CustomerController controller;

  _ViewModel({
    required this.state,
    required this.controller,
  });
}