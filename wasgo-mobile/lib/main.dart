import 'package:bytedev/app/redux/reducers/app_reducer.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/app/redux/states/user_state.dart';
import 'package:bytedev/core/routes/app_routes.dart';
import 'package:bytedev/core/storage/app_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

import 'src/app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Determine initial route based on app state
  String initialRoute = await _determineInitialRoute();

  final store = Store<AppState>(
    appReducer,
    initialState: AppState(
      authState: AuthState.initialState,
      userState: UserState.initialState,
    ),
  );

  // Run the app and pass in the store
  runApp(
    StoreProvider<AppState>(
      store: store,
      child: MyApp(
        initialRoute: initialRoute,
      ),
    ),
  );
}

Future<String> _determineInitialRoute() async {
  try {
    // Check if onboarding is completed
    final isOnboardingCompleted = await AppStorage.isOnboardingCompleted();
    
    if (!isOnboardingCompleted) {
      // First time user - show onboarding
      return AppRoutes.onboarding;
    }
    
    // Check if user is authenticated
    final isAuthenticated = await AppStorage.isAuthenticated();
    
    if (isAuthenticated) {
      // User is logged in - go to home (with MainScreen wrapper)
      return AppRoutes.home;
    } else {
      // User has completed onboarding but not logged in
      return AppRoutes.login;
    }
  } catch (e) {
    // If there's any error, default to onboarding
    print('Error determining initial route: $e');
    return AppRoutes.onboarding;
  }
}
