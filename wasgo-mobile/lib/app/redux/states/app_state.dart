import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/app/redux/states/profile_state.dart';
import 'package:bytedev/app/redux/states/user_state.dart';

class AppState {
  final AuthState authState;
  final ProfileState profileState;
  final UserState userState;

  // Constructor
  AppState({
    required this.authState,
    ProfileState? profileState,
    UserState? userState,
  }) : profileState = profileState ?? ProfileState.initialState,
       userState = userState ?? UserState.initialState;
}
