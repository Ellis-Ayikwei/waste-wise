class AuthModel {
  String? phoneNumber;
  String? token;
  bool isAuthenticated;

  AuthModel({
    this.phoneNumber,
    this.token,
    this.isAuthenticated = false,
  });

  factory AuthModel.fromJson(Map<String, dynamic> json) {
    return AuthModel(
      phoneNumber: json['phone_number'],
      token: json['token'],
      isAuthenticated: json['token'] != null,
    );
  }
}