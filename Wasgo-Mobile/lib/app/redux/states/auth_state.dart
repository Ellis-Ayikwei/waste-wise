class AuthState {
  final bool isLoading;
  final String? phoneNumber;
  final String? token;
  final String? error;
  final bool isAuthenticated;

  AuthState({
    this.isLoading = false,
    this.phoneNumber,
    this.token,
    this.error,
    this.isAuthenticated = false,
  });

  // Static initial state for the AuthState
  static AuthState get initialState => AuthState();

  AuthState copyWith({
    bool? isLoading,
    String? phoneNumber,
    String? token,
    String? error,
    bool? isAuthenticated,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      token: token ?? this.token,
      error: error ?? this.error,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
  }
}
