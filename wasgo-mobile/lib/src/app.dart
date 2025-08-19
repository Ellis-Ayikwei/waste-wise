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
          page: () => HomePage(controller: AuthController(store)),
        ),
        GetPage(name: '/mainPage', page: () => MainScreen()),
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
      ],
      initialRoute: widget.initialRoute,
    );
  }
}

