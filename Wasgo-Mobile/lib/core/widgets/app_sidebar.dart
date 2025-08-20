import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';

class AppSidebar extends StatefulWidget {
  final bool isOpen;
  final VoidCallback onToggle;
  final String userType; // 'customer' or 'provider'

  const AppSidebar({
    Key? key,
    required this.isOpen,
    required this.onToggle,
    required this.userType,
  }) : super(key: key);

  @override
  State<AppSidebar> createState() => _AppSidebarState();
}

class _AppSidebarState extends State<AppSidebar> {
  String? currentMenu;

  void toggleMenu(String menuName) {
    setState(() {
      currentMenu = currentMenu == menuName ? null : menuName;
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: widget.isOpen ? 280 : 0,
      child: widget.isOpen
          ? Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [AppColors.primary, AppColors.primaryDark],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(2, 0),
                  ),
                ],
              ),
              child: Column(
                children: [
                  _buildHeader(),
                  Expanded(
                    child: _buildMenuItems(),
                  ),
                  _buildLogoutButton(),
                ],
              ),
            )
          : null,
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.recycling,
              color: AppColors.primary,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'wasgo',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Smart Waste Management',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: widget.onToggle,
            icon: const Icon(
              Icons.close,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItems() {
    final menuItems = widget.userType == 'provider' ? _getProviderMenuItems() : _getCustomerMenuItems();
    
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      children: menuItems.map((item) => _buildMenuItem(item)).toList(),
    );
  }

  List<MenuItemData> _getCustomerMenuItems() {
    return [
      MenuItemData(
        name: 'dashboard',
        label: 'Dashboard',
        icon: Icons.home,
        route: '/customer/dashboard',
      ),
      MenuItemData(
        name: 'smart-bins',
        label: 'Smart Bins',
        icon: Icons.storage,
        route: '/smart-bins',
        badge: '3',
      ),
      MenuItemData(
        name: 'request-pickup',
        label: 'Request Pickup',
        icon: Icons.delete_outline,
        route: '/customer/request-pickup',
      ),
      MenuItemData(
        name: 'schedule-pickup',
        label: 'Schedule Pickup',
        icon: Icons.calendar_today,
        route: '/customer/schedule-pickup',
      ),
      MenuItemData(
        name: 'active-pickups',
        label: 'Active Pickups',
        icon: Icons.map,
        route: '/customer/active-pickups',
        badge: '2',
      ),
      MenuItemData(
        name: 'history',
        label: 'Pickup History',
        icon: Icons.history,
        route: '/customer/pickup-history',
      ),
      MenuItemData(
        name: 'recycling-centers',
        label: 'Recycling Centers',
        icon: Icons.recycling,
        route: '/customer/recycling-centers',
      ),
      MenuItemData(
        name: 'wallet',
        label: 'Wallet & Credits',
        icon: Icons.account_balance_wallet,
        route: '/customer/wallet',
      ),
      MenuItemData(
        name: 'rewards',
        label: 'Rewards & Badges',
        icon: Icons.emoji_events,
        route: '/customer/rewards',
      ),
      MenuItemData(
        name: 'impact-reports',
        label: 'Impact Reports',
        icon: Icons.analytics,
        route: '/customer/impact-reports',
      ),
      MenuItemData(
        name: 'messages',
        label: 'Messages',
        icon: Icons.message,
        route: '/customer/messages',
        badge: '3',
      ),
      MenuItemData(
        name: 'support',
        label: 'Support',
        icon: Icons.headset_mic,
        children: [
          MenuItemData(
            name: 'help-center',
            label: 'Help Center',
            icon: Icons.help,
            route: '/customer/help-center',
          ),
          MenuItemData(
            name: 'live-chat',
            label: 'Live Chat',
            icon: Icons.chat,
            route: '/customer/live-chat',
          ),
          MenuItemData(
            name: 'disputes',
            label: 'Dispute Resolution',
            icon: Icons.gavel,
            route: '/customer/disputes',
          ),
        ],
      ),
      MenuItemData(
        name: 'account-settings',
        label: 'Account Settings',
        icon: Icons.person,
        route: '/customer/account-settings',
      ),
    ];
  }

  List<MenuItemData> _getProviderMenuItems() {
    return [
      MenuItemData(
        name: 'provider-dashboard',
        label: 'Dashboard',
        icon: Icons.home,
        route: '/provider/dashboard',
      ),
      MenuItemData(
        name: 'job-requests',
        label: 'Job Requests',
        icon: Icons.notifications,
        route: '/provider/job-requests',
        badge: '5',
      ),
      MenuItemData(
        name: 'active-jobs',
        label: 'Active Jobs',
        icon: Icons.local_shipping,
        route: '/provider/active-jobs',
        badge: '2',
      ),
      MenuItemData(
        name: 'smart-bin-alerts',
        label: 'Smart Bin Alerts',
        icon: Icons.storage,
        route: '/provider/smart-bin-alerts',
        badge: '3',
      ),
      MenuItemData(
        name: 'fleet-management',
        label: 'Fleet Management',
        icon: Icons.directions_car,
        route: '/provider/fleet',
      ),
      MenuItemData(
        name: 'analytics',
        label: 'Analytics',
        icon: Icons.analytics,
        route: '/provider/analytics',
      ),
      MenuItemData(
        name: 'earnings',
        label: 'Earnings',
        icon: Icons.credit_card,
        route: '/provider/earnings',
      ),
      MenuItemData(
        name: 'messages',
        label: 'Messages',
        icon: Icons.message,
        route: '/provider/messages',
        badge: '3',
      ),
      MenuItemData(
        name: 'support',
        label: 'Support',
        icon: Icons.headset_mic,
        route: '/provider/support',
      ),
      MenuItemData(
        name: 'profile',
        label: 'Account Settings',
        icon: Icons.person,
        route: '/provider/account-settings',
      ),
    ];
  }

  Widget _buildMenuItem(MenuItemData item) {
    if (item.children != null) {
      return Column(
        children: [
          _buildMenuButton(
            item,
            onTap: () => toggleMenu(item.name),
            showArrow: true,
            isExpanded: currentMenu == item.name,
          ),
          if (currentMenu == item.name)
            ...item.children!.map((child) => _buildSubMenuItem(child)).toList(),
        ],
      );
    }

    return _buildMenuButton(
      item,
      onTap: () {
        widget.onToggle(); // Close sidebar
        Get.toNamed(item.route!);
      },
    );
  }

  Widget _buildMenuButton(
    MenuItemData item, {
    required VoidCallback onTap,
    bool showArrow = false,
    bool isExpanded = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            child: Row(
              children: [
                Icon(
                  item.icon,
                  color: Colors.white,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    item.label,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                if (item.badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      item.badge!,
                      style: TextStyle(
                        color: AppColors.primary,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                if (showArrow) ...[
                  const SizedBox(width: 8),
                  Icon(
                    isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    color: Colors.white,
                    size: 16,
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSubMenuItem(MenuItemData item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 2, left: 16),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            widget.onToggle(); // Close sidebar
            Get.toNamed(item.route!);
          },
          borderRadius: BorderRadius.circular(6),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                Icon(
                  item.icon,
                  color: Colors.white.withOpacity(0.8),
                  size: 16,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    item.label,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            color: Colors.white.withOpacity(0.2),
            width: 1,
          ),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            // TODO: Implement logout logic
            Get.offAllNamed('/login');
          },
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            child: Row(
              children: [
                const Icon(
                  Icons.logout,
                  color: Colors.white,
                  size: 20,
                ),
                const SizedBox(width: 12),
                const Text(
                  'Logout',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class MenuItemData {
  final String name;
  final String label;
  final IconData icon;
  final String? route;
  final String? badge;
  final List<MenuItemData>? children;

  MenuItemData({
    required this.name,
    required this.label,
    required this.icon,
    this.route,
    this.badge,
    this.children,
  });
}
