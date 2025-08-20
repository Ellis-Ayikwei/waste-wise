class CustomerState {
  final bool isLoading;
  final String? error;
  final List<dynamic> activePickups;
  final List<dynamic> pickupHistory;
  final Map<String, dynamic>? currentPickup;
  final Map<String, dynamic>? wallet;
  final int rewardPoints;
  final List<dynamic> savedProviders;
  final Map<String, dynamic>? impactStats;

  CustomerState({
    this.isLoading = false,
    this.error,
    this.activePickups = const [],
    this.pickupHistory = const [],
    this.currentPickup,
    this.wallet,
    this.rewardPoints = 0,
    this.savedProviders = const [],
    this.impactStats,
  });

  static CustomerState get initialState => CustomerState();

  CustomerState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? activePickups,
    List<dynamic>? pickupHistory,
    Map<String, dynamic>? currentPickup,
    Map<String, dynamic>? wallet,
    int? rewardPoints,
    List<dynamic>? savedProviders,
    Map<String, dynamic>? impactStats,
  }) {
    return CustomerState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      activePickups: activePickups ?? this.activePickups,
      pickupHistory: pickupHistory ?? this.pickupHistory,
      currentPickup: currentPickup ?? this.currentPickup,
      wallet: wallet ?? this.wallet,
      rewardPoints: rewardPoints ?? this.rewardPoints,
      savedProviders: savedProviders ?? this.savedProviders,
      impactStats: impactStats ?? this.impactStats,
    );
  }
}