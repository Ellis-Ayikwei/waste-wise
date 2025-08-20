import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/app/redux/states/profile_state.dart';
import 'package:bytedev/app/redux/states/customer_state.dart';
import 'package:bytedev/app/redux/states/provider_state.dart';

class AppState {
  final AuthState authState;
  final ProfileState profileState;
  final CustomerState customerState;
  final ProviderState providerState;

  // Constructor
  AppState({
    required this.authState,
    ProfileState? profileState,
    CustomerState? customerState,
    ProviderState? providerState,
  }) : profileState = profileState ?? ProfileState.initialState,
       customerState = customerState ?? CustomerState.initialState,
       providerState = providerState ?? ProviderState.initialState;
}
