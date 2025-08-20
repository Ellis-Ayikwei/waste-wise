import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/app/views/main_screen.dart';

class AccountSettingsView extends StatelessWidget {
  const AccountSettingsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomerMainScreen(
      title: 'Account Settings',
      child: const Center(
        child: Text(
          'Account Settings - Coming Soon',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
