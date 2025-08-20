import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/app/views/main_screen.dart';

class DisputesView extends StatelessWidget {
  const DisputesView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomerMainScreen(
      title: 'Dispute Resolution',
      child: const Center(
        child: Text(
          'Dispute Resolution - Coming Soon',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
