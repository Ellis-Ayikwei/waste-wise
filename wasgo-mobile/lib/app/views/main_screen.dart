import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/sliding_menu.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:bytedev/core/widgets/app_card.dart';

class MainScreen extends StatefulWidget {
  final Widget child;
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;

  const MainScreen({
    Key? key,
    required this.child,
    required this.title,
    this.actions,
    this.showBackButton = true,
  }) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  bool _isMenuOpen = false;

  List<MenuItemData> get _menuItems {
    return [
      MenuItemData(
        icon: Icons.home,
        label: 'Dashboard',
        route: '/dashboard',
        color: Colors.blue,
      ),
      MenuItemData(
        icon: Icons.storage,
        label: 'Smart Bins',
        route: '/smart-bins',
        badge: '3',
        color: Colors.green,
      ),
      MenuItemData(
        icon: Icons.delete_outline,
        label: 'Request Pickup',
        route: '/request-pickup',
        color: Colors.orange,
      ),
      MenuItemData(
        icon: Icons.calendar_today,
        label: 'Schedule Pickup',
        route: '/schedule-pickup',
        color: Colors.purple,
      ),
      MenuItemData(
        icon: Icons.map,
        label: 'Active Pickups',
        route: '/active-pickups',
        badge: '2',
        color: Colors.indigo,
      ),
      MenuItemData(
        icon: Icons.history,
        label: 'Pickup History',
        route: '/pickup-history',
        color: Colors.teal,
      ),
      MenuItemData(
        icon: Icons.recycling,
        label: 'Recycling Centers',
        route: '/recycling-centers',
        color: Colors.amber,
      ),
      MenuItemData(
        icon: Icons.account_balance_wallet,
        label: 'Wallet & Credits',
        route: '/wallet',
        color: Colors.lime,
      ),
      MenuItemData(
        icon: Icons.emoji_events,
        label: 'Rewards & Badges',
        route: '/rewards',
        color: Colors.pink,
      ),
      MenuItemData(
        icon: Icons.analytics,
        label: 'Impact Reports',
        route: '/impact-reports',
        color: Colors.cyan,
      ),
      MenuItemData(
        icon: Icons.message,
        label: 'Messages',
        route: '/messages',
        badge: '3',
        color: Colors.deepOrange,
      ),
      MenuItemData(
        icon: Icons.headset_mic,
        label: 'Support',
        route: '/help-center',
        color: Colors.red,
      ),
      MenuItemData(
        icon: Icons.person,
        label: 'Account Settings',
        route: '/account-settings',
        color: Colors.grey,
             ),
     ];
   }

  void _toggleMenu() {
    setState(() {
      _isMenuOpen = !_isMenuOpen;
    });
  }

  void _onMenuItemTap(MenuItemData item) {
    _toggleMenu(); // Close menu
    if (item.route != null) {
      Get.toNamed(item.route!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Main content
          Column(
            children: [
              _buildAppBar(),
              Expanded(
                child: widget.child,
              ),
            ],
          ),
          
          // Sliding menu
          SlidingMenu(
            isOpen: _isMenuOpen,
            onClose: _toggleMenu,
            child: _buildMenuContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.primary,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: SafeArea(
        child: Container(
          height: 60,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              // Menu button
              IconButton(
                onPressed: _toggleMenu,
                icon: Icon(
                  _isMenuOpen ? Icons.close : Icons.menu,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              
              // Title
              Expanded(
                child: Text(
                  widget.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              
              // Actions
              if (widget.actions != null) ...[
                ...widget.actions!,
              ] else ...[
                // Default actions
                IconButton(
                  onPressed: () {
                    // TODO: Navigate to notifications
                  },
                  icon: const Icon(
                    Icons.notifications_outlined,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                IconButton(
                  onPressed: () {
                    // TODO: Navigate to profile
                  },
                  icon: const Icon(
                    Icons.person_outline,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuContent() {
    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.recycling,
                  color: Colors.white,
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
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Smart Waste Management',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        
        // Menu items
        Expanded(
          child: MenuGrid(
            items: _menuItems,
            crossAxisCount: 3,
            childAspectRatio: 1.2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            onItemTap: _onMenuItemTap,
          ),
        ),
        
        // Logout button
        Container(
          padding: const EdgeInsets.all(20),
          child: AppButton(
            text: 'Logout',
            type: AppButtonType.danger,
            size: AppButtonSize.large,
            icon: Icons.logout,
            onPressed: () {
              _toggleMenu();
              Get.offAllNamed('/login');
            },
          ),
        ),
      ],
    );
  }
}
