import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/get.dart';

import '../../core/theme/app_theme.dart';
import '../../core/widgets/app_button.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/socials.dart';
import '../controllers/auth_controller.dart';
import '../redux/states/app_state.dart';
import '../redux/states/auth_state.dart';

class SignupView extends StatelessWidget {
  final AuthController controller;

  const SignupView({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return StoreConnector<AppState, AuthState>(
      converter: (store) => store.state.authState,
      builder: (context, authState) {
        final phoneController = TextEditingController();
        final passwordController = TextEditingController();
        final nameController = TextEditingController();

        return Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: Text('Sign up',
                style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: isSmallScreen ? 22 : 25)),
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
          body: SingleChildScrollView(
            padding: EdgeInsets.symmetric(
                horizontal: screenSize.width * 0.05,
                vertical: screenSize.height * 0.02),
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: screenSize.height * 0.7,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Let\'s get started',
                        style: TextStyle(
                          fontSize: isSmallScreen ? 22 : 28,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      SizedBox(height: screenSize.height * 0.03),
                      AppTextField(
                        hintText: 'Enter full name',
                        labelText: 'Full Name',
                        controller: nameController,
                        keyboardType: TextInputType.name,
                      ),
                      SizedBox(height: screenSize.height * 0.02),
                      AppTextField(
                        hintText: 'Enter your email',
                        labelText: 'Email',
                        controller: phoneController,
                        keyboardType: TextInputType.emailAddress,
                      ),
                      SizedBox(height: screenSize.height * 0.02),
                      AppTextField(
                        hintText: '********',
                        labelText: 'Password',
                        keyboardType: TextInputType.visiblePassword,
                        controller: passwordController,
                        obscureText: true,
                      ),
                      SizedBox(height: screenSize.height * 0.02),
                      AppTextField(
                        hintText: '********',
                        labelText: 'Confirm Password',
                        keyboardType: TextInputType.visiblePassword,
                        controller: passwordController,
                        obscureText: true,
                      ),
                      // SizedBox(height: screenSize.height * 0.02),
                      if (authState.error != null)
                        Padding(
                          padding: EdgeInsets.symmetric(
                              vertical: screenSize.height * 0.01),
                          child: Text(
                            authState.error!,
                            style: TextStyle(
                              color: Colors.red,
                              fontSize: isSmallScreen ? 14 : 16,
                            ),
                          ),
                        ),
                      SizedBox(height: screenSize.height * 0.02),
                      if (authState.error != null)
                        Padding(
                          padding: EdgeInsets.symmetric(
                              vertical: screenSize.height * 0.01),
                          child: Text(
                            authState.error!,
                            style: TextStyle(
                              color: Colors.red,
                              fontSize: isSmallScreen ? 14 : 16,
                            ),
                          ),
                        ),
                      TermsAndConditions(),
                      SizedBox(height: screenSize.height * 0.02),
                      AppButton(
                        text: 'SIGN UP',
                        isLoading: authState.isLoading,
                        shape: RoundedRectangleBorder(),
                        buttonTextStyle: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: isSmallScreen ? 20 : 25,
                        ),
                        onPressed: () {
                          Get.toNamed('/home');
                        },
                        width: double.infinity,
                      ),
                    ],
                  ),
                  BuildSocialLoginSection(
                    promptText: "Already have an account?",
                    actionText: "Sign in",
                    onActionPressed: () {
                      Get.toNamed('/login');
                    },
                  )
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
