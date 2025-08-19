import 'package:bytedev/app/redux/actions/auth_actions.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';

AuthState authReducer(AuthState state, dynamic action) {
  switch (action.runtimeType) {
    case SendPhoneNumberAction:
      return state.copyWith(isLoading: true, error: null);
    case UpdatePhoneNumberSuccess:
      return state.copyWith(isLoading: false, phoneNumber: (action as UpdatePhoneNumberSuccess).phoneNumber);
    case AuthErrorAction:
      return state.copyWith(isLoading: false, error: (action as AuthErrorAction).error);
    default:
      return state;
  }
}
