import 'package:bytedev/app/controllers/auth_controller.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:bytedev/core/widgets/app_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/get.dart';

import '../../core/widgets/socials.dart';

class LoginView extends StatefulWidget {
  final AuthController controller;

  const LoginView({super.key, required this.controller});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _showOtpField = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return StoreConnector<AppState, AuthState>(
      converter: (store) => store.state.authState,
      builder: (context, authState) {
        return Scaffold(
          backgroundColor: AppColors.background,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(
                  horizontal: screenSize.width * 0.05,
                  vertical: screenSize.height * 0.02),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: screenSize.height * 0.8,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Back Button
                        IconButton(
                          onPressed: () => Get.back(),
                          icon: Icon(Icons.arrow_back, color: AppColors.textPrimary),
                          style: IconButton.styleFrom(
                            backgroundColor: AppColors.surface,
                            elevation: 2,
                            padding: EdgeInsets.all(12),
                          ),
                        ),
                        SizedBox(height: screenSize.height * 0.04),
                        
                        // Welcome Text
                        Text(
                          'Welcome back!',
                          style: TextStyle(
                            fontSize: isSmallScreen ? 28 : 32,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        SizedBox(height: screenSize.height * 0.01),
                        Text(
                          'Sign in to continue with wasgo',
                          style: TextStyle(
                            fontSize: isSmallScreen ? 16 : 18,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        SizedBox(height: screenSize.height * 0.04),
                        
                        // Form
                        Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              // Phone Number Field
                              AppTextField(
                                labelText: 'Phone Number',
                                controller: _phoneController,
                                hintText: 'Enter your phone number',
                                keyboardType: TextInputType.phone,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter your phone number';
                                  }
                                  if (value.length < 10) {
                                    return 'Please enter a valid phone number';
                                  }
                                  return null;
                                },
                              ),
                              SizedBox(height: screenSize.height * 0.02),
                              
                              // OTP Field (shown after phone number is entered)
                              if (_showOtpField) ...[
                                AppTextField(
                                  labelText: 'OTP Code',
                                  controller: _otpController,
                                  hintText: 'Enter 6-digit OTP',
                                  keyboardType: TextInputType.number,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter OTP';
                                    }
                                    if (value.length != 6) {
                                      return 'Please enter 6-digit OTP';
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(height: screenSize.height * 0.02),
                              ],
                              
                              // Error Message
                              if (authState.error != null)
                                Container(
                                  padding: EdgeInsets.all(12),
                                  margin: EdgeInsets.only(bottom: 16),
                                  decoration: BoxDecoration(
                                    color: AppColors.error.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: AppColors.error.withOpacity(0.3)),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(Icons.error_outline, color: AppColors.error, size: 20),
                                      SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          authState.error!,
                                          style: TextStyle(
                                            color: AppColors.error,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              
                              // Login Button
                              AppButton(
                                text: _showOtpField ? 'Verify OTP' : 'Send OTP',
                                onPressed: authState.isLoading
                                    ? () {}
                                    : () => _handleLogin(authState),
                                isLoading: authState.isLoading,
                                width: double.infinity,
                              ),
                              
                              // Resend OTP (shown when OTP field is visible)
                              if (_showOtpField) ...[
                                SizedBox(height: screenSize.height * 0.02),
                                TextButton(
                                  onPressed: () => _resendOtp(),
                                  child: Text(
                                    'Resend OTP',
                                    style: TextStyle(
                                      color: AppColors.primary,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                    
                    // Social Login Section
                    Column(
                      children: [
                        Row(
                          children: [
                            Expanded(child: Divider(color: AppColors.border)),
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 16),
                              child: Text(
                                'Or continue with',
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            Expanded(child: Divider(color: AppColors.border)),
                          ],
                        ),
                        SizedBox(height: screenSize.height * 0.02),
                        BuildSocialLoginSection(),
                        SizedBox(height: screenSize.height * 0.02),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Don't have an account? ",
                              style: TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 14,
                              ),
                            ),
                            TextButton(
                              onPressed: () => Get.toNamed('/signup'),
                              child: Text(
                                'Sign up',
                                style: TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  void _handleLogin(AuthState authState) {
    if (_formKey.currentState!.validate()) {
      if (!_showOtpField) {
        // Send OTP
        setState(() {
          _showOtpField = true;
        });
        // TODO: Implement OTP sending logic
        Get.snackbar(
          'OTP Sent',
          'Please check your phone for the OTP code',
          backgroundColor: AppColors.success,
          colorText: AppColors.textWhite,
          snackPosition: SnackPosition.TOP,
        );
      } else {
        // Verify OTP and login
        // TODO: Implement OTP verification logic
        Get.toNamed('/home');
      }
    }
  }

  void _resendOtp() {
    // TODO: Implement resend OTP logic
    Get.snackbar(
      'OTP Resent',
      'A new OTP has been sent to your phone',
      backgroundColor: AppColors.info,
      colorText: AppColors.textWhite,
      snackPosition: SnackPosition.TOP,
    );
  }
}
