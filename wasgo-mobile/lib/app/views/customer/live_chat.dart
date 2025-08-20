import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/app/views/main_screen.dart';

class LiveChatView extends StatelessWidget {
  const LiveChatView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomerMainScreen(
      title: 'Live Chat',
      child: const Center(
        child: Text(
          'Live Chat - Coming Soon',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
