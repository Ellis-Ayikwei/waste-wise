import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static const Color deepBlue = Color(0xFF1F4E79); // Primary
  static const Color lightGray = Color(0xFFF1F1F1); // Light Gray
  static const Color brightTeal = Color(0xFF00BFAE); // Accent
  static const Color softBlack = Color(0xFF212121); // Secondary
  static const Color softWhite = Color(0xFFFDFDFD); // Soft White
  static const Color deepRed = Color(0xFFB00020);
  static const Color primary = AppColors.primary;

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary).copyWith(
      primary: AppColors.primary,
      primaryContainer: AppColors.primaryLight,
      secondary: AppColors.primaryDark,
      surface: AppColors.surface,
      background: AppColors.background,
      onPrimary: AppColors.textWhite,
      onSurface: AppColors.textPrimary,
      onBackground: AppColors.textPrimary,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: AppColors.background,
    cardTheme: CardThemeData(
      elevation: 2,
      color: AppColors.cardBackground,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.error),
      ),
      labelStyle: TextStyle(color: AppColors.textSecondary),
      hintStyle: TextStyle(color: AppColors.textLight),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.all(AppColors.primary),
        foregroundColor: WidgetStateProperty.all(AppColors.textWhite),
        shape: WidgetStateProperty.all(RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        )),
        elevation: WidgetStateProperty.all(0),
        padding: WidgetStateProperty.all(EdgeInsets.symmetric(vertical: 16, horizontal: 24)),
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
          fontSize: 96, fontWeight: FontWeight.w300, color: AppColors.textPrimary),
      displayMedium: TextStyle(
          fontSize: 60, fontWeight: FontWeight.w400, color: AppColors.textPrimary),
      displaySmall: TextStyle(
          fontSize: 48, fontWeight: FontWeight.w400, color: AppColors.textPrimary),
      headlineLarge: TextStyle(
          fontSize: 32, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
      headlineMedium: TextStyle(
          fontSize: 28, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
      headlineSmall: TextStyle(
          fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
      titleLarge: TextStyle(
          fontSize: 22, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
      titleMedium: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w500, color: AppColors.textPrimary),
      titleSmall: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary),
      bodyLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.textPrimary),
      bodyMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textPrimary),
      bodySmall: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.textSecondary),
      labelLarge: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textWhite),
      labelMedium: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
      labelSmall: TextStyle(
          fontSize: 10, fontWeight: FontWeight.w500, color: AppColors.textLight),
    ),
    appBarTheme: const AppBarTheme(
      titleTextStyle: TextStyle(
          fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.textWhite),
      foregroundColor: AppColors.textWhite,
      backgroundColor: AppColors.primary,
      elevation: 0,
      centerTitle: true,
      iconTheme: IconThemeData(color: AppColors.textWhite),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: AppColors.borderLight,
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(color: AppColors.textPrimary),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: Color(0xFF111827),
    colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary).copyWith(
      primary: AppColors.primary,
      primaryContainer: AppColors.primaryDark,
      secondary: AppColors.primaryLight,
      surface: Color(0xFF1F2937),
      background: Color(0xFF111827),
      onPrimary: AppColors.textWhite,
      onSurface: AppColors.textWhite,
      onBackground: AppColors.textWhite,
      brightness: Brightness.dark,
    ),
    cardTheme: CardThemeData(
      elevation: 2,
      color: Color(0xFF1F2937),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Color(0xFF374151),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Color(0xFF4B5563)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Color(0xFF4B5563)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.error),
      ),
      labelStyle: TextStyle(color: Color(0xFF9CA3AF)),
      hintStyle: TextStyle(color: Color(0xFF6B7280)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.all(AppColors.primary),
        foregroundColor: WidgetStateProperty.all(AppColors.textWhite),
        shape: WidgetStateProperty.all(RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        )),
        elevation: WidgetStateProperty.all(0),
        padding: WidgetStateProperty.all(EdgeInsets.symmetric(vertical: 16, horizontal: 24)),
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
          fontSize: 96, fontWeight: FontWeight.w300, color: AppColors.textWhite),
      displayMedium: TextStyle(
          fontSize: 60, fontWeight: FontWeight.w400, color: AppColors.textWhite),
      displaySmall: TextStyle(
          fontSize: 48, fontWeight: FontWeight.w400, color: AppColors.textWhite),
      headlineLarge: TextStyle(
          fontSize: 32, fontWeight: FontWeight.w700, color: AppColors.textWhite),
      headlineMedium: TextStyle(
          fontSize: 28, fontWeight: FontWeight.w600, color: AppColors.textWhite),
      headlineSmall: TextStyle(
          fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.textWhite),
      titleLarge: TextStyle(
          fontSize: 22, fontWeight: FontWeight.w600, color: AppColors.textWhite),
      titleMedium: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w500, color: AppColors.textWhite),
      titleSmall: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textWhite),
      bodyLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.textWhite),
      bodyMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textWhite),
      bodySmall: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w400, color: Color(0xFF9CA3AF)),
      labelLarge: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textWhite),
      labelMedium: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xFF9CA3AF)),
      labelSmall: TextStyle(
          fontSize: 10, fontWeight: FontWeight.w500, color: Color(0xFF6B7280)),
    ),
    appBarTheme: const AppBarTheme(
      titleTextStyle: TextStyle(
          fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.textWhite),
      foregroundColor: AppColors.textWhite,
      backgroundColor: AppColors.primary,
      elevation: 0,
      centerTitle: true,
      iconTheme: IconThemeData(color: AppColors.textWhite),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: Color(0xFF374151),
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(color: AppColors.textWhite),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
    ),
  );
}
