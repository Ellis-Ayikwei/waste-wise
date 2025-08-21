import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/app_button.dart';

class SlidingMenu extends StatefulWidget {
  final bool isOpen;
  final VoidCallback onClose;
  final Widget child;
  final double height;
  final Color backgroundColor;
  final BorderRadius? borderRadius;
  final Widget? handleBar;
  final bool enableDragToDismiss;

  const SlidingMenu({
    Key? key,
    required this.isOpen,
    required this.onClose,
    required this.child,
    this.height = 0.8,
    this.backgroundColor = Colors.white,
    this.borderRadius,
    this.handleBar,
    this.enableDragToDismiss = true,
  }) : super(key: key);

  @override
  State<SlidingMenu> createState() => _SlidingMenuState();
}

class _SlidingMenuState extends State<SlidingMenu>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _slideAnimation;
  late Animation<double> _fadeAnimation;
  double _dragStartY = 0;
  double _currentDragY = 0;
  bool _isDragging = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _slideAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    if (widget.isOpen) {
      _animationController.forward();
    }
  }

  @override
  void didUpdateWidget(SlidingMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isOpen != oldWidget.isOpen) {
      if (widget.isOpen) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final menuHeight = screenHeight * widget.height;

    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        final slideValue = _slideAnimation.value;
        final fadeValue = _fadeAnimation.value;
        final currentHeight = menuHeight * slideValue;

        return Stack(
          children: [
            // Backdrop
            if (fadeValue > 0)
              Positioned.fill(
                child: GestureDetector(
                  onTap: widget.onClose,
                  child: Container(
                    color: Colors.black.withOpacity(0.5 * fadeValue),
                  ),
                ),
              ),

            // Sliding menu
            Positioned(
              left: 0,
              right: 0,
              bottom: -menuHeight + currentHeight,
              child: GestureDetector(
                onPanStart: widget.enableDragToDismiss ? _onPanStart : null,
                onPanUpdate: widget.enableDragToDismiss ? _onPanUpdate : null,
                onPanEnd: widget.enableDragToDismiss ? _onPanEnd : null,
                child: Container(
                  height: menuHeight,
                  decoration: BoxDecoration(
                    color: widget.backgroundColor,
                    borderRadius: widget.borderRadius ??
                        const BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                        ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, -2),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Handle bar
                      widget.handleBar ??
                          Container(
                            margin: const EdgeInsets.only(top: 12, bottom: 8),
                            width: 40,
                            height: 4,
                            decoration: BoxDecoration(
                              color: Colors.grey[300],
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                      
                      // Content
                      Expanded(child: widget.child),
                    ],
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  void _onPanStart(DragStartDetails details) {
    _dragStartY = details.globalPosition.dy;
    _currentDragY = _dragStartY;
    _isDragging = true;
  }

  void _onPanUpdate(DragUpdateDetails details) {
    if (!_isDragging) return;
    
    _currentDragY = details.globalPosition.dy;
    final dragDistance = _currentDragY - _dragStartY;
    
    // Only allow downward dragging
    if (dragDistance > 0) {
      final screenHeight = MediaQuery.of(context).size.height;
      final menuHeight = screenHeight * widget.height;
      final dragProgress = (dragDistance / menuHeight).clamp(0.0, 1.0);
      
      _animationController.value = 1.0 - dragProgress;
    }
  }

  void _onPanEnd(DragEndDetails details) {
    if (!_isDragging) return;
    
    _isDragging = false;
    final dragDistance = _currentDragY - _dragStartY;
    final screenHeight = MediaQuery.of(context).size.height;
    final menuHeight = screenHeight * widget.height;
    final dragProgress = dragDistance / menuHeight;
    
    // If dragged more than 30% of the menu height, close it
    if (dragProgress > 0.3) {
      widget.onClose();
    } else {
      // Snap back to open position
      _animationController.forward();
    }
  }
}

// Menu item data class
class MenuItemData {
  final IconData icon;
  final String label;
  final String? route;
  final String? badge;
  final Color color;
  final VoidCallback? onTap;

  MenuItemData({
    required this.icon,
    required this.label,
    this.route,
    this.badge,
    required this.color,
    this.onTap,
  });
}

// Menu item widget
class MenuItem extends StatelessWidget {
  final MenuItemData item;
  final VoidCallback? onTap;

  const MenuItem({
    Key? key,
    required this.item,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap ?? item.onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: item.color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: item.color.withOpacity(0.3),
              width: 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: item.color.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      item.icon,
                      color: item.color,
                      size: 24,
                    ),
                  ),
                  if (item.badge != null)
                    Positioned(
                      right: -2,
                      top: -2,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 16,
                          minHeight: 16,
                        ),
                        child: Text(
                          item.badge!,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                item.label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Menu grid widget
class MenuGrid extends StatelessWidget {
  final List<MenuItemData> items;
  final int crossAxisCount;
  final double childAspectRatio;
  final double crossAxisSpacing;
  final double mainAxisSpacing;
  final Function(MenuItemData)? onItemTap;

  const MenuGrid({
    Key? key,
    required this.items,
    this.crossAxisCount = 3,
    this.childAspectRatio = 1.2,
    this.crossAxisSpacing = 12,
    this.mainAxisSpacing = 12,
    this.onItemTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: childAspectRatio,
        crossAxisSpacing: crossAxisSpacing,
        mainAxisSpacing: mainAxisSpacing,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return MenuItem(
          item: item,
          onTap: onItemTap != null ? () => onItemTap!(item) : null,
        );
      },
    );
  }
}
