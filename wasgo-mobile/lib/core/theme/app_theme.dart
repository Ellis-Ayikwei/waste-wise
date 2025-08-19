import 'package:flutter/material.dart';

class AppTheme {
  static const Color deepBlue = Color(0xFF1F4E79); // Primary
  static const Color lightGray = Color(0xFFF1F1F1); // Light Gray
  static const Color brightTeal = Color(0xFF00BFAE); // Accent
  static const Color softBlack = Color(0xFF212121); // Secondary
  static const Color softWhite = Color(0xFFFDFDFD); // Soft White
  static const Color deepRed = Color(0xFFB00020);
  static const Color primary = Color(0xFFFFD1DC);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light, // Set brightness in ThemeData
    colorScheme: ColorScheme.fromSeed(seedColor: deepBlue).copyWith(
      primary: deepBlue,
      surface: lightGray,
      onSurface: softBlack,
      brightness: Brightness.light, // Ensure brightness matches here
    ),
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: lightGray,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: deepBlue),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.all(brightTeal),
        foregroundColor: WidgetStateProperty.all(softWhite),
        shape: WidgetStateProperty.all(RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        )),
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
          fontSize: 96, fontWeight: FontWeight.w300, color: softBlack),
      displayMedium: TextStyle(
          fontSize: 60, fontWeight: FontWeight.w400, color: softBlack),
      displaySmall: TextStyle(
          fontSize: 48, fontWeight: FontWeight.w400, color: softBlack),
      headlineMedium: TextStyle(
          fontSize: 34, fontWeight: FontWeight.w400, color: softBlack),
      headlineSmall: TextStyle(
          fontSize: 24, fontWeight: FontWeight.w400, color: softBlack),
      titleLarge: TextStyle(
          fontSize: 20, fontWeight: FontWeight.w500, color: softBlack),
      bodyLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w400, color: softBlack),
      bodyMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w400, color: softBlack),
      bodySmall: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w400, color: softBlack),
      labelLarge: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w500, color: softWhite),
    ),
    appBarTheme: const AppBarTheme(
      titleTextStyle: TextStyle(
          fontSize: 20, fontWeight: FontWeight.w500, color: softWhite),
      foregroundColor: softWhite,
      backgroundColor: deepBlue,
      iconTheme: IconThemeData(color: softWhite),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark, // Set brightness in ThemeData
    scaffoldBackgroundColor: softBlack,
    colorScheme: ColorScheme.fromSeed(seedColor: deepBlue).copyWith(
      primary: deepBlue,
      surface: softBlack,
      onSurface: softWhite,
      secondary: brightTeal,
      brightness: Brightness.dark, // Ensure brightness matches here
    ),
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: softBlack,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: brightTeal),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.all(brightTeal),
        foregroundColor: WidgetStateProperty.all(softWhite),
        shape: WidgetStateProperty.all(RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        )),
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
          fontSize: 96, fontWeight: FontWeight.w300, color: softWhite),
      displayMedium: TextStyle(
          fontSize: 60, fontWeight: FontWeight.w400, color: softWhite),
      displaySmall: TextStyle(
          fontSize: 48, fontWeight: FontWeight.w400, color: softWhite),
      headlineMedium: TextStyle(
          fontSize: 34, fontWeight: FontWeight.w400, color: softWhite),
      headlineSmall: TextStyle(
          fontSize: 24, fontWeight: FontWeight.w400, color: softWhite),
      titleLarge: TextStyle(
          fontSize: 20, fontWeight: FontWeight.w500, color: softWhite),
      bodyLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w400, color: softWhite),
      bodyMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w400, color: softWhite),
      bodySmall: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w400, color: softWhite),
      labelLarge: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w500, color: softWhite),
    ),
    appBarTheme: const AppBarTheme(
      titleTextStyle: TextStyle(
          fontSize: 20, fontWeight: FontWeight.w500, color: softWhite),
      foregroundColor: softWhite,
      backgroundColor: deepBlue,
      iconTheme: IconThemeData(color: softWhite),
    ),
  );
}
