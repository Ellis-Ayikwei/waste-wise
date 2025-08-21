import 'package:bytedev/app/controllers/auth_controller.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/core/theme/app_theme.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:bytedev/core/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/get.dart';

class VerifyEmail extends StatelessWidget {
  final AuthController controller;

  const VerifyEmail({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return StoreConnector<AppState, AuthState>(
      converter: (store) => store.state.authState,
      builder: (context, authState) {

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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(height: screenSize.height * 0.07),
                          Text(
                            'Verify Your Email Address',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 22 : 28,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          SizedBox(height: screenSize.height * 0.01),
                          Text(
                            'Enter the email registered with your\naccount. we\'ll send you a link to reset your password....',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 14 : 16,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                          SizedBox(height: screenSize.height * 0.05),
                          // TODO: Add OTP input field
                          SizedBox(height: screenSize.height * 0.01),
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
                          SizedBox(height: screenSize.height * 0.03),
                            Container(
                            margin: EdgeInsets.only(left: 50, right: 50),
                            child: AppButton(
                              text: 'Confirm',
                              isLoading: authState.isLoading,
                              type: AppButtonType.primary,
                              size: AppButtonSize.large,
                              onPressed: () => AppRoutes.goToResetPassword(),
                              width: double.infinity,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      }
    );
  }
}