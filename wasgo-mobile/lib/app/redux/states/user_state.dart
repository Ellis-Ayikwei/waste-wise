class UserState {
  final bool isLoading;
  final String? error;
  
  // Pickup Management
  final List<dynamic> activePickups;
  final List<dynamic> pickupHistory;
  final Map<String, dynamic>? currentPickup;
  
  // Wallet & Payments
  final Map<String, dynamic>? wallet;
  final int rewardPoints;
  
  // Smart Bins
  final List<dynamic> smartBins;
  
  // Recycling Centers
  final List<dynamic> recyclingCenters;
  
  // Messages & Notifications
  final List<dynamic> messages;
  final List<dynamic> notifications;
  
  // Impact Stats
  final Map<String, dynamic>? impactStats;
  
  // Rewards & Badges
  final List<dynamic> rewards;
  final List<dynamic> badges;

  UserState({
    this.isLoading = false,
    this.error,
    this.activePickups = const [],
    this.pickupHistory = const [],
    this.currentPickup,
    this.wallet,
    this.rewardPoints = 0,
    this.smartBins = const [],
    this.recyclingCenters = const [],
    this.messages = const [],
    this.notifications = const [],
    this.impactStats,
    this.rewards = const [],
    this.badges = const [],
  });

  static UserState get initialState => UserState();

  UserState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? activePickups,
    List<dynamic>? pickupHistory,
    Map<String, dynamic>? currentPickup,
    Map<String, dynamic>? wallet,
    int? rewardPoints,
    List<dynamic>? smartBins,
    List<dynamic>? recyclingCenters,
    List<dynamic>? messages,
    List<dynamic>? notifications,
    Map<String, dynamic>? impactStats,
    List<dynamic>? rewards,
    List<dynamic>? badges,
  }) {
    return UserState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      activePickups: activePickups ?? this.activePickups,
      pickupHistory: pickupHistory ?? this.pickupHistory,
      currentPickup: currentPickup ?? this.currentPickup,
      wallet: wallet ?? this.wallet,
      rewardPoints: rewardPoints ?? this.rewardPoints,
      smartBins: smartBins ?? this.smartBins,
      recyclingCenters: recyclingCenters ?? this.recyclingCenters,
      messages: messages ?? this.messages,
      notifications: notifications ?? this.notifications,
      impactStats: impactStats ?? this.impactStats,
      rewards: rewards ?? this.rewards,
      badges: badges ?? this.badges,
    );
  }
}
