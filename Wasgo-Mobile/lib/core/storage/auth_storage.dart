class AuthStorage {
  static const String tokenKey = 'auth_token';

  Future<void> saveToken(String token) async {
    // Implementation using shared_preferences
  }

  Future<String?> getToken() async {
    // Implementation using shared_preferences
    return null;
  }
}