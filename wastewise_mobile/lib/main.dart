import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/get.dart';
import 'package:redux/redux.dart';
import 'package:redux_persist/redux_persist.dart';
import 'package:redux_persist_flutter/redux_persist_flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import 'config/app_config.dart';
import 'config/theme.dart';
import 'redux/app_state.dart';
import 'redux/app_reducer.dart';
import 'redux/app_middleware.dart';
import 'services/notification_service.dart';
import 'services/location_service.dart';
import 'utils/routes.dart';
import 'screens/splash_screen.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Initialize notifications
  await NotificationService.initialize(flutterLocalNotificationsPlugin);
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  
  // Create persistor
  final persistor = Persistor<AppState>(
    storage: FlutterStorage(),
    serializer: JsonSerializer<AppState>(AppState.fromJson),
  );
  
  // Load initial state
  AppState? initialState;
  try {
    initialState = await persistor.load();
  } catch (e) {
    print('Error loading persisted state: $e');
  }
  
  // Create Redux store
  final store = Store<AppState>(
    appReducer,
    initialState: initialState ?? AppState.initial(),
    middleware: createAppMiddleware(persistor),
  );
  
  runApp(WasteWiseApp(store: store));
}

class WasteWiseApp extends StatefulWidget {
  final Store<AppState> store;
  
  const WasteWiseApp({Key? key, required this.store}) : super(key: key);
  
  @override
  State<WasteWiseApp> createState() => _WasteWiseAppState();
}

class _WasteWiseAppState extends State<WasteWiseApp> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    
    // Initialize location service
    LocationService.instance.initialize();
  }
  
  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
  
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // App resumed, refresh data if needed
      widget.store.dispatch(RefreshDataAction());
    } else if (state == AppLifecycleState.paused) {
      // App paused, save state
      widget.store.dispatch(SaveStateAction());
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return StoreProvider<AppState>(
      store: widget.store,
      child: GetMaterialApp(
        title: AppConfig.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        
        // GetX configuration
        defaultTransition: Transition.cupertino,
        transitionDuration: const Duration(milliseconds: 300),
        
        // Localization
        locale: const Locale('en', 'US'),
        fallbackLocale: const Locale('en', 'US'),
        
        // Routes
        initialRoute: Routes.splash,
        getPages: AppRoutes.routes,
        
        // Error handling
        onUnknownRoute: (settings) {
          return GetPageRoute(
            settings: settings,
            page: () => const NotFoundScreen(),
          );
        },
        
        // Navigation observers
        navigatorObservers: [
          GetObserver(),
        ],
        
        // Builder for global overlays
        builder: (context, child) {
          return MediaQuery(
            data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
            child: GestureDetector(
              onTap: () {
                // Hide keyboard on tap outside
                FocusManager.instance.primaryFocus?.unfocus();
              },
              child: child!,
            ),
          );
        },
        
        home: const SplashScreen(),
      ),
    );
  }
}

// Not Found Screen
class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 100,
              color: Colors.grey,
            ),
            const SizedBox(height: 20),
            Text(
              '404',
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () => Get.offAllNamed(Routes.home),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    );
  }
}

// Placeholder actions (will be defined in Redux files)
class RefreshDataAction {}
class SaveStateAction {}