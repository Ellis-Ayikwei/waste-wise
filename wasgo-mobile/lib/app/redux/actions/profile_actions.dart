class UpdateProfileSuccess {
  final String name;
  final String email;
  final String profilePicture;

  UpdateProfileSuccess({
    required this.name,
    required this.email,
    required this.profilePicture,
  });
}

class ProfileErrorAction {
  final String error;

  ProfileErrorAction({required this.error});
}

class UpdateProfileLoadingAction {}
