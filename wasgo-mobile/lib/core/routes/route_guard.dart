import 'package:bytedev/core/storage/app_storage.dart';
import 'package:bytedev/core/routes/app_routes.dart';
import 'package:get/get.dart';

class RouteGuard {
  // List of protected routes that require authentication
  static const List<String> _protectedRoutes = [
    AppRoutes.dashboard,
    AppRoutes.smartBins,
    AppRoutes.requestPickup,
    AppRoutes.schedulePickup,
    AppRoutes.activePickups,
    AppRoutes.pickupHistory,
    AppRoutes.recyclingCenters,
    AppRoutes.wallet,
    AppRoutes.rewards,
    AppRoutes.impactReports,
    AppRoutes.messages,
    AppRoutes.helpCenter,
    AppRoutes.liveChat,
    AppRoutes.disputes,
    AppRoutes.accountSettings,
  ];

  // List of routes that should redirect to login if user is not authenticated
  static const List<String> _authRequiredRoutes = [
    AppRoutes.login,
    AppRoutes.signup,
    AppRoutes.forgotPassword,
    AppRoutes.verifyEmail,
    AppRoutes.resetPassword,
  ];

  /// Check if a route is protected (requires authentication)
  static bool isProtectedRoute(String route) {
    return _protectedRoutes.contains(route);
  }

  /// Check if a route requires authentication check
  static bool isAuthRequiredRoute(String route) {
    return _authRequiredRoutes.contains(route);
  }

  /// Validate route access based on authentication status
  static Future<String?> validateRouteAccess(String route) async {
    try {
      // Skip validation for onboarding
      if (route == AppRoutes.onboarding) {
        return null;
      }

      // Check if user has completed onboarding
      final isOnboardingCompleted = await AppStorage.isOnboardingCompleted();
      if (!isOnboardingCompleted) {
        return AppRoutes.onboarding;
      }

      // Check if route is protected
      if (isProtectedRoute(route)) {
        final isAuthenticated = await AppStorage.isAuthenticated();
        if (!isAuthenticated) {
          return AppRoutes.login;
        }
      }

      // Check if user is trying to access auth routes while already authenticated
      if (isAuthRequiredRoute(route)) {
        final isAuthenticated = await AppStorage.isAuthenticated();
        if (isAuthenticated) {
          // Redirect to dashboard
          return AppRoutes.dashboard;
        }
      }

      return null; // Route access allowed
    } catch (e) {
      print('Error validating route access: $e');
      return AppRoutes.onboarding; // Default to onboarding on error
    }
  }

  /// Navigate to route with validation
  static Future<void> navigateTo(String route) async {
    final redirectRoute = await validateRouteAccess(route);
    if (redirectRoute != null && redirectRoute != route) {
      Get.offAllNamed(redirectRoute);
    } else {
      Get.toNamed(route);
    }
  }

  /// Navigate and replace current route with validation
  static Future<void> navigateAndReplace(String route) async {
    final redirectRoute = await validateRouteAccess(route);
    if (redirectRoute != null && redirectRoute != route) {
      Get.offAllNamed(redirectRoute);
    } else {
      Get.offAllNamed(route);
    }
  }
}
