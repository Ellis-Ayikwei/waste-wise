import 'package:bytedev/app/controllers/auth_controller.dart';
import 'package:bytedev/app/redux/middlewares/auth_middleware.dart';
import 'package:bytedev/app/redux/reducers/app_reducer.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/app/views/forgot_password.dart';
import 'package:bytedev/app/views/homepage.dart';
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
// Provider Views
import 'package:bytedev/app/views/provider/dashboard.dart';
import 'package:bytedev/app/views/provider/job_requests.dart';
import 'package:bytedev/app/views/provider/active_jobs.dart';
import 'package:bytedev/app/views/provider/fleet_management.dart';
import 'package:bytedev/app/views/provider/drivers_management.dart';
import 'package:bytedev/app/views/provider/earnings.dart';
import 'package:bytedev/app/views/provider/analytics.dart';
import 'package:bytedev/app/views/provider/smart_bin_alerts.dart';
import 'package:bytedev/app/views/provider/support.dart';
import 'package:bytedev/app/views/provider/account_settings.dart';
import 'package:bytedev/app/views/provider/messages.dart';
import 'package:bytedev/core/theme/app_theme.dart';
import 'package:bytedev/services/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:bytedev/src/localization/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:get/get.dart';
import 'package:redux/redux.dart';

/// The Widget that configures your application.
class MyApp extends StatefulWidget {
  const MyApp({
    super.key,
    required this.initialRoute,
  });

  final String initialRoute;

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  themeListener() {
    if (mounted) {
      setState(() {});
    }
  }

  final Store<AppState> store = Store<AppState>(
    appReducer,
    initialState: AppState(authState: AuthState()),
    middleware: [AuthMiddleware(AuthService()).call],
  );
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      // Providing a restorationScopeId allows the Navigator built by the
      // MaterialApp to restore the navigation stack when a user leaves and
      // returns to the app after it has been killed while running in the
      // background.
      debugShowCheckedModeBanner: false,
      // Provide the generated AppLocalizations to the MaterialApp. This
      // allows descendant Widgets to display the correct translations
      // depending on the user's locale.
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''), // English, no country code
      ],

      // Use AppLocalizations to configure the correct application title
      // depending on the user's locale.
      //
      // The appTitle is defined in .arb files found in the localization
      // directory.
      onGenerateTitle: (BuildContext context) =>
          AppLocalizations.of(context)!.appTitle,

      // Define a light and dark color theme. Then, read the user's
      // preferred ThemeMode (light, dark, or system default) from the
      // SettingsController to display the correct theme.
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,

      // Define a function to handle named routes in order to support
      // Flutter web url navigation and deep linking.
      getPages: [
        GetPage(
          name: '/login',
          page: () => LoginView(controller: AuthController(store)),
        ),
        GetPage(
          name: '/onboarding',
          page: () => OnboardingScreen(),
        ),
        GetPage(
          name: '/home',
           page: () => MainScreen(userType: 'customer', title: 'Customer', child: const CustomerDashboard()),
        ),
        GetPage(name: '/mainPage', page: () => MainScreen(userType: 'customer', title: 'Customer', child: const CustomerDashboard())),
        GetPage(
          name: '/signup',
          page: () => SignupView(controller: AuthController(store)),
        ),
        GetPage(
          name: '/forgot_password',
          page: () => ForgotPassword(controller: AuthController(store)),
        ),
        GetPage(
          name: '/verify_email',
          page: () => VerifyEmail(controller: AuthController(store)),
        ),
        GetPage(
          name: '/reset_password',
          page: () => PasswordReset(controller: AuthController(store)),
        ),
        
        // Customer Routes
        GetPage(
          name: '/customer/dashboard',
          page: () => const CustomerDashboard(),
        ),
        GetPage(
          name: '/smart-bins',
          page: () => const SmartBinsView(),
        ),
        GetPage(
          name: '/customer/request-pickup',
          page: () => const RequestPickupView(),
        ),
        GetPage(
          name: '/customer/schedule-pickup',
          page: () => const SchedulePickupView(),
        ),
        GetPage(
          name: '/customer/active-pickups',
          page: () => const ActivePickupsView(),
        ),
        GetPage(
          name: '/customer/pickup-history',
          page: () => const PickupHistoryView(),
        ),
        GetPage(
          name: '/customer/recycling-centers',
          page: () => const RecyclingCentersView(),
        ),
        GetPage(
          name: '/customer/wallet',
          page: () => const WalletView(),
        ),
        GetPage(
          name: '/customer/rewards',
          page: () => const RewardsView(),
        ),
        GetPage(
          name: '/customer/impact-reports',
          page: () => const ImpactReportsView(),
        ),
        GetPage(
          name: '/customer/messages',
          page: () => const MessagesView(),
        ),
        GetPage(
          name: '/customer/help-center',
          page: () => const HelpCenterView(),
        ),
        GetPage(
          name: '/customer/live-chat',
          page: () => const LiveChatView(),
        ),
        GetPage(
          name: '/customer/disputes',
          page: () => const DisputesView(),
        ),
        GetPage(
          name: '/customer/account-settings',
          page: () => const AccountSettingsView(),
        ),
        
        // Provider Routes
        GetPage(
          name: '/provider/dashboard',
          page: () => const ProviderDashboard(),
        ),
        GetPage(
          name: '/provider/job-requests',
          page: () => const JobRequestsView(),
        ),
        GetPage(
          name: '/provider/active-jobs',
          page: () => const ActiveJobsView(),
        ),
        GetPage(
          name: '/provider/fleet',
          page: () => const FleetManagementView(),
        ),
        GetPage(
          name: '/provider/drivers',
          page: () => const DriversManagementView(),
        ),
        GetPage(
          name: '/provider/earnings',
          page: () => const EarningsView(),
        ),
        GetPage(
          name: '/provider/analytics',
          page: () => const AnalyticsView(),
        ),
        GetPage(
          name: '/provider/smart-bin-alerts',
          page: () => const SmartBinAlertsView(),
        ),
        GetPage(
          name: '/provider/support',
          page: () => const ProviderSupportView(),
        ),
        GetPage(
          name: '/provider/account-settings',
          page: () => const ProviderAccountSettingsView(),
        ),
        GetPage(
          name: '/provider/messages',
          page: () => const ProviderMessagesView(),
        ),
      ],
      initialRoute: widget.initialRoute,
    );
  }
}

