import 'package:bytedev/app/controllers/auth_controller.dart';
import 'package:bytedev/app/controllers/user_controller.dart';
import 'package:bytedev/app/views/forgot_password.dart';
import 'package:bytedev/app/views/login_view.dart';
import 'package:bytedev/app/views/main_screen.dart';
import 'package:bytedev/app/views/onboarding_screen.dart';
import 'package:bytedev/app/views/password_reset.dart';
import 'package:bytedev/app/views/signup_view.dart';
import 'package:bytedev/app/views/verify_email.dart';
// Customer Views
import 'package:bytedev/app/views/customer/dashboard.dart';
import 'package:bytedev/app/views/customer/request_pickup.dart';
import 'package:bytedev/app/views/customer/schedule_pickup.dart';
import 'package:bytedev/app/views/customer/active_pickups.dart';
import 'package:bytedev/app/views/customer/pickup_history.dart';
import 'package:bytedev/app/views/customer/wallet.dart';
import 'package:bytedev/app/views/customer/rewards.dart';
import 'package:bytedev/app/views/customer/impact_reports.dart';
import 'package:bytedev/app/views/customer/smart_bins.dart';
import 'package:bytedev/app/views/customer/recycling_centers.dart';
import 'package:bytedev/app/views/customer/messages.dart';
import 'package:bytedev/app/views/customer/help_center.dart';
import 'package:bytedev/app/views/customer/live_chat.dart';
import 'package:bytedev/app/views/customer/disputes.dart';
import 'package:bytedev/app/views/customer/account_settings.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/core/routes/route_guard.dart';
import 'package:get/get.dart';
import 'package:redux/redux.dart';

class AppRoutes {
  // Route names
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String signup = '/signup';
  static const String forgotPassword = '/forgot_password';
  static const String verifyEmail = '/verify_email';
  static const String resetPassword = '/reset_password';
  static const String home = '/home';
  static const String mainPage = '/mainPage';

  // Customer routes
  static const String dashboard = '/dashboard';
  static const String smartBins = '/smart-bins';
  static const String requestPickup = '/request-pickup';
  static const String schedulePickup = '/schedule-pickup';
  static const String activePickups = '/active-pickups';
  static const String pickupHistory = '/pickup-history';
  static const String recyclingCenters = '/recycling-centers';
  static const String wallet = '/wallet';
  static const String rewards = '/rewards';
  static const String impactReports = '/impact-reports';
  static const String messages = '/messages';
  static const String helpCenter = '/help-center';
  static const String liveChat = '/live-chat';
  static const String disputes = '/disputes';
  static const String accountSettings = '/account-settings';

  // Get all routes
  static List<GetPage> getRoutes(Store<AppState> store) {
    return [
      // Auth routes
      GetPage(
        name: login,
        page: () => LoginView(controller: AuthController(store)),
      ),
      GetPage(
        name: onboarding,
        page: () => const OnboardingScreen(),
      ),
      GetPage(
        name: home,
        page: () => MainScreen(child: const CustomerDashboard(), title: 'Dashboard'),
      ),
      GetPage(
        name: mainPage, 
        page: () => MainScreen(child: const CustomerDashboard(), title: 'Dashboard'),
      ),
      GetPage(
        name: dashboard,
        page: () => MainScreen(child: const CustomerDashboard(), title: 'Dashboard'),
      ),
      GetPage(
        name: signup,
        page: () => SignupView(controller: AuthController(store)),
      ),
      GetPage(
        name: forgotPassword,
        page: () => ForgotPassword(controller: AuthController(store)),
      ),
      GetPage(
        name: verifyEmail,
        page: () => VerifyEmail(controller: AuthController(store)),
      ),
      GetPage(
        name: resetPassword,
        page: () => PasswordReset(controller: AuthController(store)),
      ),
      
      // Customer routes - Wrapped with MainScreen for consistent app bar
      GetPage(
        name: smartBins,
        page: () => MainScreen(
          title: 'Smart Bins',
          child: const SmartBinsView(),
        ),
      ),
      GetPage(
        name: requestPickup,
        page: () => MainScreen(
          title: 'Request Pickup',
          child: const RequestPickupView(),
        ),
      ),
      GetPage(
        name: schedulePickup,
        page: () => MainScreen(
          title: 'Schedule Pickup',
          child: const SchedulePickupView(),
        ),
      ),
      GetPage(
        name: activePickups,
        page: () => MainScreen(
          title: 'Active Pickups',
          child: const ActivePickupsView(),
        ),
      ),
      GetPage(
        name: pickupHistory,
        page: () => MainScreen(
          title: 'Pickup History',
          child: const PickupHistoryView(),
        ),
      ),
      GetPage(
        name: recyclingCenters,
        page: () => MainScreen(
          title: 'Recycling Centers',
          child: const RecyclingCentersView(),
        ),
      ),
      GetPage(
        name: wallet,
        page: () => MainScreen(
          title: 'Wallet & Credits',
          child: const WalletView(),
        ),
      ),
      GetPage(
        name: rewards,
        page: () => MainScreen(
          title: 'Rewards & Badges',
          child: const RewardsView(),
        ),
      ),
      GetPage(
        name: impactReports,
        page: () => MainScreen(
          title: 'Impact Reports',
          child: const ImpactReportsView(),
        ),
      ),
      GetPage(
        name: messages,
        page: () => MainScreen(
          title: 'Messages',
          child: const MessagesView(),
        ),
      ),
      GetPage(
        name: helpCenter,
        page: () => MainScreen(
          title: 'Help Center',
          child: const HelpCenterView(),
        ),
      ),
      GetPage(
        name: liveChat,
        page: () => MainScreen(
          title: 'Live Chat',
          child: const LiveChatView(),
        ),
      ),
      GetPage(
        name: disputes,
        page: () => MainScreen(
          title: 'Disputes',
          child: const DisputesView(),
        ),
      ),
      GetPage(
        name: accountSettings,
        page: () => MainScreen(
          title: 'Account Settings',
          child: const AccountSettingsView(),
        ),
      ),
    ];
  }

  // Navigation helpers with route guard
  static void goToOnboarding() => Get.offAllNamed(onboarding);
  static void goToLogin() => Get.offAllNamed(login);
  static void goToSignup() => RouteGuard.navigateTo(signup);
  static void goToForgotPassword() => RouteGuard.navigateTo(forgotPassword);
  static void goToVerifyEmail() => RouteGuard.navigateTo(verifyEmail);
  static void goToResetPassword() => RouteGuard.navigateTo(resetPassword);
  static void goToHome() => RouteGuard.navigateAndReplace(home);
  
  // Navigation
  static void goToDashboard() => RouteGuard.navigateAndReplace(home);
  static void goToSmartBins() => RouteGuard.navigateTo(smartBins);
  static void goToRequestPickup() => RouteGuard.navigateTo(requestPickup);
  static void goToSchedulePickup() => RouteGuard.navigateTo(schedulePickup);
  static void goToActivePickups() => RouteGuard.navigateTo(activePickups);
  static void goToPickupHistory() => RouteGuard.navigateTo(pickupHistory);
  static void goToRecyclingCenters() => RouteGuard.navigateTo(recyclingCenters);
  static void goToWallet() => RouteGuard.navigateTo(wallet);
  static void goToRewards() => RouteGuard.navigateTo(rewards);
  static void goToImpactReports() => RouteGuard.navigateTo(impactReports);
  static void goToMessages() => RouteGuard.navigateTo(messages);
  static void goToHelpCenter() => RouteGuard.navigateTo(helpCenter);
  static void goToLiveChat() => RouteGuard.navigateTo(liveChat);
  static void goToDisputes() => RouteGuard.navigateTo(disputes);
  static void goToAccountSettings() => RouteGuard.navigateTo(accountSettings);
}
