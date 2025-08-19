import 'package:bytedev/core/theme/app_theme.dart';
import 'package:flutter/material.dart';

class AppTextField extends StatelessWidget {
  final String labelText;
  final TextStyle? labelStyle;
  final String? hintText;
  final String? bottomText; 
  final TextStyle? bottomTextStyle; 
  final TextEditingController controller;
  final bool obscureText;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;

  const AppTextField({
    super.key,
    required this.labelText,
    required this.controller,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.hintText,
    this.labelStyle,
    this.bottomText, 
    this.bottomTextStyle, 
  });

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          labelText,
          style: labelStyle,
        ),
        const SizedBox(height: 8.0), 
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          validator: validator,
          decoration: InputDecoration(
            hintText: hintText,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: const BorderSide(
                color: AppTheme.primary,
                width: 2.0,
                style: BorderStyle.solid,
              ),
            ),
          ),
        ),
        if (bottomText != null) ...[
          const SizedBox(height: 4.0),
          Text(
            bottomText!,
            style: bottomTextStyle ??
                TextStyle(
                  fontSize: 12.0,
                  color: colors.onSurface.withOpacity(0.6), 
                ),
          ),
        ],
      ],
    );
  }
}