import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/app/redux/states/profile_state.dart';

class AppState {
  final AuthState authState;
  final ProfileState profileState;

  // Constructor
  AppState({
    required this.authState,
    ProfileState? profileState,
  }) : profileState = profileState ?? ProfileState.initialState;
}
