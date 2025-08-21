import 'package:bytedev/app/controllers/auth_controller.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/core/theme/app_theme.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:bytedev/core/widgets/app_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/route_manager.dart';

class PasswordReset extends StatelessWidget {
  final AuthController controller;

  const PasswordReset({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return StoreConnector<AppState, AuthState>(
      converter: (store) => store.state.authState,
      builder: (context, authState) {
        final phoneController = TextEditingController();
        final passwordController = TextEditingController();

        return GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
          },
          child: Scaffold(
            appBar: AppBar(
              backgroundColor: Colors.transparent,
              foregroundColor: AppTheme.softWhite,
              leading: IconButton(
                style: IconButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  padding: EdgeInsets.all(isSmallScreen ? 8 : 12),
                ),
                icon: Icon(Icons.chevron_left,
                    size: isSmallScreen ? 28 : 32, color: Colors.black),
                onPressed: () => Get.back(),
              ),
            ),
            body: SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(
                    horizontal: screenSize.width * 0.05,
                    vertical: screenSize.height * 0.02),
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: screenSize.height * 0.7,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: screenSize.height * 0.07),
                      Text(
                        'Create new password',
                        style: TextStyle(
                          fontSize: isSmallScreen ? 22 : 28,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 8.0),
                      Text(
                        'Your new password must be different\nfrom previous passwords',
                        style: TextStyle(
                          fontSize: isSmallScreen ? 14 : 16,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      const SizedBox(height: 40),
                      AppTextField(
                        labelText: "New Password",
                        labelStyle: const TextStyle(
                          color: Colors.black,
                          fontSize: 20,
                          fontWeight: FontWeight.normal,
                        ),
                        hintText: 'Must be at least 8 characters',
                        bottomText: 'Use a mix of letters, numbers, and symbols', // Add bottom text
                        bottomTextStyle: const TextStyle(
                          color: Colors.blueGrey,
                          fontSize: 12.0,
                        ), // Customize bottom text style
                        controller: phoneController,
                        keyboardType: TextInputType.text,
                        obscureText: true,
                      ),
                      const SizedBox(height: 40),
                      AppTextField(
                        labelText: "Confirm Password",
                        labelStyle: const TextStyle(
                          color: Colors.black,
                          fontSize: 20,
                          fontWeight: FontWeight.normal,
                        ),
                        hintText: 'Both passwords must match',
                        bottomText: 'Ensure both passwords are identical', // Add bottom text
                        bottomTextStyle: const TextStyle(
                          color: Colors.blueGrey,
                          fontSize: 12.0,
                        ), // Customize bottom text style
                        keyboardType: TextInputType.visiblePassword,
                        controller: passwordController,
                        obscureText: true,
                      ),
                      const SizedBox(height: 40),
                      AppButton(
                        text: 'Reset Password',
                        isLoading: authState.isLoading,
                        type: AppButtonType.primary,
                        size: AppButtonSize.large,
                        onPressed: () {
                          Get.toNamed('/login');
                        },
                        width: double.infinity,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}