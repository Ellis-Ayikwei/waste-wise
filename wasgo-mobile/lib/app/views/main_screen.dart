import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/app_sidebar.dart';

class MainScreen extends StatefulWidget {
  final Widget child;
  final String title;
  final String userType; // 'customer' or 'provider'
  final List<Widget>? actions;
  final bool showBackButton;

  const MainScreen({
    Key? key,
    required this.child,
    required this.title,
    required this.userType,
    this.actions,
    this.showBackButton = true,
  }) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  bool _isSidebarOpen = false;

  void _toggleSidebar() {
    setState(() {
      _isSidebarOpen = !_isSidebarOpen;
    });
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
          
          // Sidebar overlay
          if (_isSidebarOpen)
            GestureDetector(
              onTap: _toggleSidebar,
              child: Container(
                color: Colors.black.withOpacity(0.5),
              ),
            ),
          
          // Sidebar
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: AppSidebar(
              isOpen: _isSidebarOpen,
              onToggle: _toggleSidebar,
              userType: widget.userType,
            ),
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
                onPressed: _toggleSidebar,
                icon: const Icon(
                  Icons.menu,
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
}

// Convenience widget for customer screens
class CustomerMainScreen extends StatelessWidget {
  final Widget child;
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;

  const CustomerMainScreen({
    Key? key,
    required this.child,
    required this.title,
    this.actions,
    this.showBackButton = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MainScreen(
      userType: 'customer',
      title: title,
      actions: actions,
      showBackButton: showBackButton,
      child: child,
    );
  }
}

// Convenience widget for provider screens
class ProviderMainScreen extends StatelessWidget {
  final Widget child;
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;

  const ProviderMainScreen({
    Key? key,
    required this.child,
    required this.title,
    this.actions,
    this.showBackButton = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MainScreen(
      userType: 'provider',
      title: title,
      actions: actions,
      showBackButton: showBackButton,
      child: child,
    );
  }
}
