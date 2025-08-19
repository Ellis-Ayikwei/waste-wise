class ProfileState {
  final bool isLoading;
  final String? name;
  final String? email;
  final String? profilePicture;
  final String? error;

  ProfileState({
    this.isLoading = false,
    this.name,
    this.email,
    this.profilePicture,
    this.error,
  });

  // Static initial state for the ProfileState
  static ProfileState get initialState => ProfileState();

  ProfileState copyWith({
    bool? isLoading,
    String? name,
    String? email,
    String? profilePicture,
    String? error,
  }) {
    return ProfileState(
      isLoading: isLoading ?? this.isLoading,
      name: name ?? this.name,
      email: email ?? this.email,
      profilePicture: profilePicture ?? this.profilePicture,
      error: error ?? this.error,
    );
  }
}

