class AuthResponse {
  final String message;
  final String? token;

  AuthResponse({required this.message, this.token});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      message: json['message'],
      token: json['token'],
    );
  }
}
