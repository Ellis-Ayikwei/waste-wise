import 'package:flutter/foundation.dart';
import 'auth/auth_state.dart';
import 'provider/provider_state.dart';
import 'customer/customer_state.dart';
import 'tracking/tracking_state.dart';
import 'payment/payment_state.dart';

@immutable
class AppState {
  final AuthState authState;
  final ProviderState providerState;
  final CustomerState customerState;
  final TrackingState trackingState;
  final PaymentState paymentState;
  final AppSettings settings;
  final bool isLoading;
  final String? error;
  
  const AppState({
    required this.authState,
    required this.providerState,
    required this.customerState,
    required this.trackingState,
    required this.paymentState,
    required this.settings,
    this.isLoading = false,
    this.error,
  });
  
  factory AppState.initial() {
    return AppState(
      authState: AuthState.initial(),
      providerState: ProviderState.initial(),
      customerState: CustomerState.initial(),
      trackingState: TrackingState.initial(),
      paymentState: PaymentState.initial(),
      settings: AppSettings.initial(),
      isLoading: false,
      error: null,
    );
  }
  
  AppState copyWith({
    AuthState? authState,
    ProviderState? providerState,
    CustomerState? customerState,
    TrackingState? trackingState,
    PaymentState? paymentState,
    AppSettings? settings,
    bool? isLoading,
    String? error,
  }) {
    return AppState(
      authState: authState ?? this.authState,
      providerState: providerState ?? this.providerState,
      customerState: customerState ?? this.customerState,
      trackingState: trackingState ?? this.trackingState,
      paymentState: paymentState ?? this.paymentState,
      settings: settings ?? this.settings,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'authState': authState.toJson(),
      'providerState': providerState.toJson(),
      'customerState': customerState.toJson(),
      'trackingState': trackingState.toJson(),
      'paymentState': paymentState.toJson(),
      'settings': settings.toJson(),
      'isLoading': isLoading,
      'error': error,
    };
  }
  
  static AppState fromJson(dynamic json) {
    if (json == null) return AppState.initial();
    
    return AppState(
      authState: AuthState.fromJson(json['authState']),
      providerState: ProviderState.fromJson(json['providerState']),
      customerState: CustomerState.fromJson(json['customerState']),
      trackingState: TrackingState.fromJson(json['trackingState']),
      paymentState: PaymentState.fromJson(json['paymentState']),
      settings: AppSettings.fromJson(json['settings']),
      isLoading: json['isLoading'] ?? false,
      error: json['error'],
    );
  }
}

@immutable
class AppSettings {
  final bool isDarkMode;
  final bool notificationsEnabled;
  final bool locationEnabled;
  final String language;
  final String currency;
  final bool autoAcceptJobs;
  final double maxDistance;
  final List<String> selectedWasteCategories;
  
  const AppSettings({
    required this.isDarkMode,
    required this.notificationsEnabled,
    required this.locationEnabled,
    required this.language,
    required this.currency,
    required this.autoAcceptJobs,
    required this.maxDistance,
    required this.selectedWasteCategories,
  });
  
  factory AppSettings.initial() {
    return const AppSettings(
      isDarkMode: false,
      notificationsEnabled: true,
      locationEnabled: true,
      language: 'en',
      currency: 'GHS',
      autoAcceptJobs: false,
      maxDistance: 10.0,
      selectedWasteCategories: [],
    );
  }
  
  AppSettings copyWith({
    bool? isDarkMode,
    bool? notificationsEnabled,
    bool? locationEnabled,
    String? language,
    String? currency,
    bool? autoAcceptJobs,
    double? maxDistance,
    List<String>? selectedWasteCategories,
  }) {
    return AppSettings(
      isDarkMode: isDarkMode ?? this.isDarkMode,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      locationEnabled: locationEnabled ?? this.locationEnabled,
      language: language ?? this.language,
      currency: currency ?? this.currency,
      autoAcceptJobs: autoAcceptJobs ?? this.autoAcceptJobs,
      maxDistance: maxDistance ?? this.maxDistance,
      selectedWasteCategories: selectedWasteCategories ?? this.selectedWasteCategories,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'isDarkMode': isDarkMode,
      'notificationsEnabled': notificationsEnabled,
      'locationEnabled': locationEnabled,
      'language': language,
      'currency': currency,
      'autoAcceptJobs': autoAcceptJobs,
      'maxDistance': maxDistance,
      'selectedWasteCategories': selectedWasteCategories,
    };
  }
  
  static AppSettings fromJson(dynamic json) {
    if (json == null) return AppSettings.initial();
    
    return AppSettings(
      isDarkMode: json['isDarkMode'] ?? false,
      notificationsEnabled: json['notificationsEnabled'] ?? true,
      locationEnabled: json['locationEnabled'] ?? true,
      language: json['language'] ?? 'en',
      currency: json['currency'] ?? 'GHS',
      autoAcceptJobs: json['autoAcceptJobs'] ?? false,
      maxDistance: (json['maxDistance'] ?? 10.0).toDouble(),
      selectedWasteCategories: List<String>.from(json['selectedWasteCategories'] ?? []),
    );
  }
}