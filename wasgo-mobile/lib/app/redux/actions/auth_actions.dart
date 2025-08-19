abstract class AuthAction {}

class SendPhoneNumberAction extends AuthAction {
  final String phoneNumber;
  SendPhoneNumberAction(this.phoneNumber);
}

class VerifyOtpAction extends AuthAction {
  final String phoneNumber;
  final String otp;
  VerifyOtpAction(this.phoneNumber, this.otp);
}

class RegisterPasswordAction extends AuthAction {
  final String phoneNumber;
  final String password;
  final String confirmPassword;
  RegisterPasswordAction(this.phoneNumber, this.password, this.confirmPassword);
}

class LoginAction extends AuthAction {
  final String phoneNumber;
  final String password;
  LoginAction(this.phoneNumber, this.password);
}

class UpdatePhoneNumberSuccess extends AuthAction {
  final String phoneNumber;
  UpdatePhoneNumberSuccess(this.phoneNumber);
}

class AuthErrorAction extends AuthAction {
  final String error;
  AuthErrorAction(this.error);
}
