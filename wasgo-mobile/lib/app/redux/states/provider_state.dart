class ProviderState {
  final bool isLoading;
  final String? error;
  final List<dynamic> jobRequests;
  final List<dynamic> activeJobs;
  final List<dynamic> completedJobs;
  final Map<String, dynamic>? currentJob;
  final Map<String, dynamic>? earnings;
  final List<dynamic> fleet;
  final List<dynamic> drivers;
  final Map<String, dynamic>? analytics;
  final double rating;
  final int totalReviews;

  ProviderState({
    this.isLoading = false,
    this.error,
    this.jobRequests = const [],
    this.activeJobs = const [],
    this.completedJobs = const [],
    this.currentJob,
    this.earnings,
    this.fleet = const [],
    this.drivers = const [],
    this.analytics,
    this.rating = 0.0,
    this.totalReviews = 0,
  });

  static ProviderState get initialState => ProviderState();

  ProviderState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? jobRequests,
    List<dynamic>? activeJobs,
    List<dynamic>? completedJobs,
    Map<String, dynamic>? currentJob,
    Map<String, dynamic>? earnings,
    List<dynamic>? fleet,
    List<dynamic>? drivers,
    Map<String, dynamic>? analytics,
    double? rating,
    int? totalReviews,
  }) {
    return ProviderState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      jobRequests: jobRequests ?? this.jobRequests,
      activeJobs: activeJobs ?? this.activeJobs,
      completedJobs: completedJobs ?? this.completedJobs,
      currentJob: currentJob ?? this.currentJob,
      earnings: earnings ?? this.earnings,
      fleet: fleet ?? this.fleet,
      drivers: drivers ?? this.drivers,
      analytics: analytics ?? this.analytics,
      rating: rating ?? this.rating,
      totalReviews: totalReviews ?? this.totalReviews,
    );
  }
}