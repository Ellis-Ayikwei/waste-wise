import 'package:flutter/material.dart';

class AppHorizontalLine extends StatelessWidget {
  final double? height;
  final Color? color;
  final String text;

  const AppHorizontalLine({
    super.key,
    this.height = 1.0,
    this.color = const Color(0xFFBDBDBD),
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: Colors.black,
            thickness: 1,
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 8.0),
          child: Text(
            text, // Text in the middle of the divider
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
        Expanded(
          child: Divider(
            color: Colors.black,
            thickness: 1,
          ),
        ),
      ],
    );
  }
}
