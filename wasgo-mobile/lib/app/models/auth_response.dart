class AuthResponse {
  final String message;
  final String? token;
  final bool success;
  final String? userType;
  final String? userId;

  AuthResponse({
    required this.message, 
    this.token,
    this.success = false,
    this.userType,
    this.userId,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      message: json['message'] ?? '',
      token: json['token'],
      success: json['success'] ?? false,
      userType: json['user_type'],
      userId: json['user_id'],
    );
  }
}
