import 'package:bytedev/app/redux/actions/auth_actions.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:redux/redux.dart';

class AuthController {
  final Store<AppState> _store;

  AuthController(this._store);

  void sendPhoneNumber(String phoneNumber) {
    print("Sending phone number: $phoneNumber");
    _store.dispatch(SendPhoneNumberAction(phoneNumber));
  }

  void verifyOtp(String phoneNumber, String otp) {
    _store.dispatch(VerifyOtpAction(phoneNumber, otp));
  }

  void register({
    required String phoneNumber,
    required String password,
    required String confirmPassword,
  }) {
    _store.dispatch(
        RegisterPasswordAction(phoneNumber, password, confirmPassword));
  }

  void login(String phoneNumber, String password) {
    _store.dispatch(LoginAction(phoneNumber, password));
  }

  void forget_password(String phoneNumber, String password) {
    _store.dispatch(LoginAction(phoneNumber, password));
  }
}
