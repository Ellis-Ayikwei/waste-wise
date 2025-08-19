import 'package:bytedev/app/redux/actions/auth_actions.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/services/auth_service.dart';
import 'package:redux/redux.dart';

class AuthMiddleware extends MiddlewareClass<AppState> {
  final AuthService _authService;

  AuthMiddleware(this._authService);

  @override
  Future<void> call(Store<AppState> store, dynamic action, NextDispatcher next) async {
    next(action);

    if (action is SendPhoneNumberAction) {
      try {
        final response = await _authService.sendPhoneNumber(action.phoneNumber);
        store.dispatch(UpdatePhoneNumberSuccess(response.message));
      } catch (e) {
        store.dispatch(AuthErrorAction(e.toString()));
      }
    }
    // Handle other actions...
  }
}
