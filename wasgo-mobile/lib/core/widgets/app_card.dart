import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';

enum AppCardType {
  default_,
  elevated,
  outlined,
  filled,
}

enum AppCardSize {
  small,
  medium,
  large,
}

class AppCard extends StatelessWidget {
  final Widget child;
  final AppCardType type;
  final AppCardSize size;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final Color? borderColor;
  final double? elevation;
  final Widget? header;
  final Widget? footer;
  final bool isLoading;

  const AppCard({
    Key? key,
    required this.child,
    this.type = AppCardType.default_,
    this.size = AppCardSize.medium,
    this.onTap,
    this.padding,
    this.margin,
    this.borderRadius,
    this.backgroundColor,
    this.borderColor,
    this.elevation,
    this.header,
    this.footer,
    this.isLoading = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final cardWidget = Container(
      margin: margin ?? _getDefaultMargin(),
      decoration: BoxDecoration(
        color: _getBackgroundColor(),
        borderRadius: borderRadius ?? _getDefaultBorderRadius(),
        border: _getBorder(),
        boxShadow: _getShadow(),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (header != null) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.only(
                  topLeft: borderRadius?.topLeft ?? _getDefaultBorderRadius().topLeft,
                  topRight: borderRadius?.topRight ?? _getDefaultBorderRadius().topRight,
                ),
              ),
              child: header!,
            ),
          ],
          if (isLoading)
            Container(
              padding: padding ?? _getDefaultPadding(),
              child: const Center(
                child: CircularProgressIndicator(),
              ),
            )
          else
            Container(
              padding: padding ?? _getDefaultPadding(),
              child: child,
            ),
          if (footer != null) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.only(
                  bottomLeft: borderRadius?.bottomLeft ?? _getDefaultBorderRadius().bottomLeft,
                  bottomRight: borderRadius?.bottomRight ?? _getDefaultBorderRadius().bottomRight,
                ),
              ),
              child: footer!,
            ),
          ],
        ],
      ),
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: borderRadius ?? _getDefaultBorderRadius(),
          child: cardWidget,
        ),
      );
    }

    return cardWidget;
  }

  Color _getBackgroundColor() {
    if (backgroundColor != null) return backgroundColor!;
    
    switch (type) {
      case AppCardType.default_:
        return Colors.white;
      case AppCardType.elevated:
        return Colors.white;
      case AppCardType.outlined:
        return Colors.white;
      case AppCardType.filled:
        return Colors.grey[50]!;
    }
  }

  Border? _getBorder() {
    if (borderColor != null) {
      return Border.all(color: borderColor!, width: 1);
    }
    
    switch (type) {
      case AppCardType.outlined:
        return Border.all(color: Colors.grey[300]!, width: 1);
      default:
        return null;
    }
  }

  List<BoxShadow>? _getShadow() {
    if (elevation != null) {
      return [
        BoxShadow(
          color: Colors.black.withOpacity(0.1),
          blurRadius: elevation!,
          offset: const Offset(0, 2),
        ),
      ];
    }
    
    switch (type) {
      case AppCardType.elevated:
        return [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ];
      default:
        return null;
    }
  }

  EdgeInsetsGeometry _getDefaultMargin() {
    switch (size) {
      case AppCardSize.small:
        return const EdgeInsets.all(8);
      case AppCardSize.medium:
        return const EdgeInsets.all(12);
      case AppCardSize.large:
        return const EdgeInsets.all(16);
    }
  }

  EdgeInsetsGeometry _getDefaultPadding() {
    switch (size) {
      case AppCardSize.small:
        return const EdgeInsets.all(12);
      case AppCardSize.medium:
        return const EdgeInsets.all(16);
      case AppCardSize.large:
        return const EdgeInsets.all(20);
    }
  }

  BorderRadius _getDefaultBorderRadius() {
    switch (size) {
      case AppCardSize.small:
        return BorderRadius.circular(8);
      case AppCardSize.medium:
        return BorderRadius.circular(12);
      case AppCardSize.large:
        return BorderRadius.circular(16);
    }
  }
}

// Specialized card widgets for common use cases
class InfoCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final Color? color;

  const InfoCard({
    Key? key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
    this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      backgroundColor: color?.withOpacity(0.1),
      borderColor: color?.withOpacity(0.3),
      child: Row(
        children: [
          if (leading != null) ...[
            leading!,
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (subtitle != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    subtitle!,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (trailing != null) ...[
            const SizedBox(width: 12),
            trailing!,
          ],
        ],
      ),
    );
  }
}

class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color? color;
  final String? trend;
  final bool isPositive;

  const StatCard({
    Key? key,
    required this.title,
    required this.value,
    required this.icon,
    this.color,
    this.trend,
    this.isPositive = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final cardColor = color ?? AppColors.primary;
    
    return AppCard(
      type: AppCardType.elevated,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: cardColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  icon,
                  color: cardColor,
                  size: 20,
                ),
              ),
              const Spacer(),
              if (trend != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isPositive ? Colors.green[50] : Colors.red[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isPositive ? Icons.trending_up : Icons.trending_down,
                        color: isPositive ? Colors.green : Colors.red,
                        size: 14,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        trend ?? '',
                        style: TextStyle(
                          color: isPositive ? Colors.green : Colors.red,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: cardColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600] ?? Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}

