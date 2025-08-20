import 'package:bytedev/app/redux/actions/profile_actions.dart';
import 'package:bytedev/app/redux/states/profile_state.dart';

ProfileState profileReducer(ProfileState state, dynamic action) {
  if (action is UpdateProfileLoadingAction) {
    return state.copyWith(isLoading: true, error: null);
  } else if (action is UpdateProfileSuccess) {
    return state.copyWith(
      name: action.name,
      email: action.email,
      profilePicture: action.profilePicture,
      isLoading: false,
    );
  } else if (action is ProfileErrorAction) {
    return state.copyWith(
      isLoading: false,
      error: action.error,
    );
  }
  return state;
}
