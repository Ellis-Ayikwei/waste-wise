import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/app/views/main_screen.dart';

class HelpCenterView extends StatelessWidget {
  const HelpCenterView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomerMainScreen(
      title: 'Help Center',
      child: const Center(
        child: Text(
          'Help Center - Coming Soon',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
