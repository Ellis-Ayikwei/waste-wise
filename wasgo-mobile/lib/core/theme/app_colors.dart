import 'package:flutter/material.dart';

class AppColors {
  // Primary Green Colors (Eco-friendly system)
  static const Color primary = Color(0xFF2E7D32); // 500 - Eco Green (primary buttons, headings)
  static const Color primaryDark = Color(0xFF1B5E20); // 800 - Darker green
  static const Color primaryLight = Color(0xFFA5D6A7); // 200 - Fresh Mint (background sections)
  static const Color primaryDarker = Color(0xFF0D3E10); // 900 - Darkest green
  
  // Primary Color Shades
  static const Color primary50 = Color(0xFFE8F5E9); // 50 - Lightest eco green
  static const Color primary100 = Color(0xFFC8E6C9); // 100 - Very light green
  static const Color primary200 = Color(0xFFA5D6A7); // 200 - Fresh Mint (background sections)
  static const Color primary300 = Color(0xFF81C784); // 300 - Light green
  static const Color primary400 = Color(0xFF66BB6A); // 400 - Leaf Green (hover states)
  static const Color primary500 = Color(0xFF2E7D32); // 500 - Eco Green (primary buttons, headings)
  static const Color primary600 = Color(0xFF388E3C); // 600 - Slightly lighter than default
  static const Color primary700 = Color(0xFF2E7D32); // 700 - DEFAULT
  static const Color primary800 = Color(0xFF1B5E20); // 800 - Darker green
  static const Color primary900 = Color(0xFF0D3E10); // 900 - Darkest green
  
  // Background Colors
  static const Color background = Color(0xFFF9FAFB); // gray-50
  static const Color surface = Colors.white;
  static const Color cardBackground = Colors.white;
  
  // Text Colors
  static const Color textPrimary = Color(0xFF111827); // gray-900
  static const Color textSecondary = Color(0xFF6B7280); // gray-500
  static const Color textLight = Color(0xFF9CA3AF); // gray-400
  static const Color textWhite = Colors.white;
  
  // Status Colors
  static const Color success = Color(0xFF2E7D32); // primary500 - Eco Green
  static const Color warning = Color(0xFFF59E0B); // amber-500
  static const Color error = Color(0xFFEF4444); // red-500
  static const Color info = Color(0xFF3B82F6); // blue-500
  
  // Waste Type Colors
  static const Color recyclable = Color(0xFF3B82F6); // blue-500
  static const Color organic = Color(0xFF2E7D32); // primary500 - Eco Green
  static const Color hazardous = Color(0xFFEF4444); // red-500
  static const Color general = Color(0xFF6B7280); // gray-500
  
  // Gradient Colors
  static const Color gradientStart = Color(0xFF2E7D32); // primary500 - Eco Green
  static const Color gradientEnd = Color(0xFF1B5E20); // primary800 - Darker green
  
  // Border Colors
  static const Color border = Color(0xFFE5E7EB); // gray-200
  static const Color borderLight = Color(0xFFF3F4F6); // gray-100

  // Transparent Colors
  static const Color transparent = Colors.transparent;
  
  // Helper method for dark-light variant
  static Color get primaryDarkLight => const Color(0xFF2E7D32).withOpacity(0.15); // dark-light: rgba(46, 125, 50, 0.15)
}