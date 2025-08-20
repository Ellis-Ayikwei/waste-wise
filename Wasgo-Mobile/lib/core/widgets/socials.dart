import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../theme/app_theme.dart';
import 'hr.dart';

class GoogleSignInButton extends StatelessWidget {
  final VoidCallback onPressed;

  const GoogleSignInButton({super.key, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent, // Button background color
        foregroundColor: Colors.black, // Text color
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        elevation: 2,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Google logo image
          Image.asset(
            'assets/images/google_icon.png',
            height: 30,
          ),
          SizedBox(width: 12),
          Text(
            'Sign in with Google',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class BuildRememberMeSection extends StatelessWidget {
  const BuildRememberMeSection({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Row(
            children: [
              Checkbox(
                value: true,
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                onChanged: (bool? value) {},
              ),
              Flexible(
                child: Text('Keep me signed in',
                    style: TextStyle(fontSize: isSmallScreen ? 14 : 16)),
              ),
            ],
          ),
        ),
        TextButton(
          onPressed: () => Get.toNamed('/forgot_password'),
          child: Text('Forgot password',
              style: TextStyle(
                  color: AppTheme.primary, fontSize: isSmallScreen ? 14 : 16)),
        ),
      ],
    );
  }
}

class TermsAndConditions extends StatelessWidget {
  const TermsAndConditions({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Flexible(
          child: Row(
            children: [
              Transform.scale(
                scale: 1.3,
                child: Checkbox(
                  value: true,
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  onChanged: (bool? value) {},
                ),
              ),
              Flexible(
                child: Text(
                    'By creating an account, I accept Ghana Beauty Terms of\nUse and Privacy concerns',
                    style: TextStyle(fontSize: isSmallScreen ? 14 : 16,
                    height: 1.1,
                    ),
                  ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class BuildSocialLoginSection extends StatelessWidget {
  final String promptText;
  final String actionText;
  final VoidCallback? onActionPressed;

  const BuildSocialLoginSection({
    super.key,
    this.promptText = "Don't have an account?",
    this.actionText = "Sign up",
    this.onActionPressed,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return Column(
      children: [
        SizedBox(height: screenSize.height * 0.03),
        AppHorizontalLine(text: 'OR'),
        SizedBox(height: screenSize.height * 0.03),
        Center(
          child: GoogleSignInButton(onPressed: () {}),
        ),
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(promptText, style: TextStyle(fontSize: isSmallScreen ? 14 : 16)),
            TextButton(
              onPressed: onActionPressed ?? () => Get.toNamed('/signup'),
              child: Text(
                actionText,
                style: TextStyle(color: Color(0xFFFFD1DC), fontSize: isSmallScreen ? 14 : 16),
              ),
            ),
          ],
        ),
      ],
    );
  }
}