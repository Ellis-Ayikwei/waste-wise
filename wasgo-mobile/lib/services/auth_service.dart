import 'package:bytedev/app/models/auth_response.dart';
import 'package:bytedev/core/api/api_constants.dart';
import 'package:bytedev/core/storage/app_storage.dart';
import 'package:dio/dio.dart';

class AuthService {
  final dio = Dio();

  Future<AuthResponse> sendPhoneNumber(String phoneNumber) async {
    final response = await dio.post('${ApiConstants.baseUrl}/phone_number/',
      data: {'phone_number': phoneNumber});
    return AuthResponse.fromJson(response.data);
  }

  Future<AuthResponse> verifyOtp(String phoneNumber, String otp) async {
    final response = await dio.post('${ApiConstants.baseUrl}/verify-registration-otp/',
      data: {'phone_number': phoneNumber, 'otp': otp});
    return AuthResponse.fromJson(response.data);
  }

  Future<AuthResponse> registerPassword({
    required String phoneNumber,
    required String password,
    required String confirmPassword,
  }) async {
    final response = await dio.post('${ApiConstants.baseUrl}/register-password/',
      data: {'phone_number': phoneNumber, 'password': password, 'confirmPassword': confirmPassword});
    return AuthResponse.fromJson(response.data);
  }

  Future<AuthResponse> login(String phoneNumber, String password) async {
    final response = await dio.post('${ApiConstants.baseUrl}/login/',
      data: {'phone_number': phoneNumber, 'password': password});
    final authResponse = AuthResponse.fromJson(response.data);
    
    // Save auth data if login is successful
    if (authResponse.success && authResponse.token != null) {
      await AppStorage.saveAuthToken(authResponse.token!);
      if (authResponse.userType != null) {
        await AppStorage.saveUserType(authResponse.userType!);
      }
      if (authResponse.userId != null) {
        await AppStorage.saveUserId(authResponse.userId!);
      }
    }
    
    return authResponse;
  }

  Future<void> logout() async {
    await AppStorage.clearAllData();
  }
}
