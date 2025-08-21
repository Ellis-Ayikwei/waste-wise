import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';

enum AppButtonType {
  primary,
  secondary,
  outline,
  text,
  danger,
}

enum AppButtonSize {
  small,
  medium,
  large,
}

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonType type;
  final AppButtonSize size;
  final bool isLoading;
  final bool isDisabled;
  final IconData? icon;
  final Widget? trailingIcon;
  final double? width;
  final double? height;
  final BorderRadius? borderRadius;

  const AppButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.type = AppButtonType.primary,
    this.size = AppButtonSize.medium,
    this.isLoading = false,
    this.isDisabled = false,
    this.icon,
    this.trailingIcon,
    this.width,
    this.height,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isEnabled = onPressed != null && !isDisabled && !isLoading;
    
    return SizedBox(
      width: width ?? _getButtonWidth(),
      height: height ?? _getButtonHeight(),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isEnabled ? onPressed : null,
          borderRadius: borderRadius ?? BorderRadius.circular(_getBorderRadius()),
          child: Container(
            decoration: BoxDecoration(
              color: _getBackgroundColor(isEnabled),
              borderRadius: borderRadius ?? BorderRadius.circular(_getBorderRadius()),
              border: _getBorder(isEnabled),
              boxShadow: _getShadow(),
            ),
            child: Center(
              child: _buildContent(),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (isLoading) {
      return SizedBox(
        width: _getIconSize(),
        height: _getIconSize(),
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(_getTextColor(true)),
        ),
      );
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(
            icon,
            color: _getTextColor(isDisabled),
            size: _getIconSize(),
          ),
          SizedBox(width: _getSpacing()),
        ],
        Text(
          text,
          style: TextStyle(
            color: _getTextColor(isDisabled),
            fontSize: _getFontSize(),
            fontWeight: FontWeight.w600,
          ),
        ),
        if (trailingIcon != null) ...[
          SizedBox(width: _getSpacing()),
          trailingIcon!,
        ],
      ],
    );
  }

  Color _getBackgroundColor(bool isEnabled) {
    if (!isEnabled) return Colors.grey[300] ?? Colors.grey;
    
    switch (type) {
      case AppButtonType.primary:
        return AppColors.primary;
      case AppButtonType.secondary:
        return AppColors.primary.withOpacity(0.1);
      case AppButtonType.outline:
        return Colors.transparent;
      case AppButtonType.text:
        return Colors.transparent;
      case AppButtonType.danger:
        return Colors.red;
    }
  }

  Color _getTextColor(bool isDisabled) {
    if (isDisabled) return Colors.grey[600] ?? Colors.grey;
    
    switch (type) {
      case AppButtonType.primary:
        return Colors.white;
      case AppButtonType.secondary:
        return AppColors.primary;
      case AppButtonType.outline:
        return AppColors.primary;
      case AppButtonType.text:
        return AppColors.primary;
      case AppButtonType.danger:
        return Colors.white;
    }
  }

  Border? _getBorder(bool isEnabled) {
    if (!isEnabled) return Border.all(color: Colors.grey[400] ?? Colors.grey);
    
    switch (type) {
      case AppButtonType.outline:
        return Border.all(color: AppColors.primary, width: 1.5);
      case AppButtonType.danger:
        return Border.all(color: Colors.red, width: 1.5);
      default:
        return null;
    }
  }

  List<BoxShadow>? _getShadow() {
    switch (type) {
      case AppButtonType.primary:
        return [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ];
      case AppButtonType.danger:
        return [
          BoxShadow(
            color: Colors.red.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ];
      default:
        return null;
    }
  }

  double _getButtonWidth() {
    switch (size) {
      case AppButtonSize.small:
        return 80;
      case AppButtonSize.medium:
        return 120;
      case AppButtonSize.large:
        return double.infinity;
    }
  }

  double _getButtonHeight() {
    switch (size) {
      case AppButtonSize.small:
        return 36;
      case AppButtonSize.medium:
        return 48;
      case AppButtonSize.large:
        return 56;
    }
  }

  double _getBorderRadius() {
    switch (size) {
      case AppButtonSize.small:
        return 8;
      case AppButtonSize.medium:
        return 12;
      case AppButtonSize.large:
        return 16;
    }
  }

  double _getFontSize() {
    switch (size) {
      case AppButtonSize.small:
        return 12;
      case AppButtonSize.medium:
        return 14;
      case AppButtonSize.large:
        return 16;
    }
  }

  double _getIconSize() {
    switch (size) {
      case AppButtonSize.small:
        return 16;
      case AppButtonSize.medium:
        return 20;
      case AppButtonSize.large:
        return 24;
    }
  }

  double _getSpacing() {
    switch (size) {
      case AppButtonSize.small:
        return 4;
      case AppButtonSize.medium:
        return 8;
      case AppButtonSize.large:
        return 12;
    }
  }
}


// class CustomPinField extends StatelessWidget {
//   CustomPinField({super.key});

//   final pinController = TextEditingController();

//   @override
//   Widget build(BuildContext context) {
//     return SizedBox(
//       // width: 300,
//       child: PinCodeTextField(
//         // keyboardType: TextInputType.numberWithOptions(),
//         appContext: context,
//         length: 6,
//         obscureText: false,
//         animationType: AnimationType.fade,
//         pinTheme: PinTheme(
//           shape: PinCodeFieldShape.box,
//           borderRadius: BorderRadius.circular(5),
//           fieldHeight: 40,
//           fieldWidth: 40,
//           activeColor: Colors.pink,
//           inactiveColor: AppTheme.primary,
//           selectedColor: Colors.pinkAccent,
//           activeFillColor: Colors.white,
//         ),
//         // animationDuration: Duration(milliseconds: 300),
//         // backgroundColor: Colors.blue.shade50,
//         // enableActiveFill: true,
//         // errorAnimationController: errorController,
//         controller: pinController,
//         onCompleted: (v) {
//           print("Completed");
//         },
//         onChanged: (value) {
//           // print(value);
//           // setState(() {
//           //   currentText = value;
//           // });
//         },
//         // beforeTextPaste: (text) {
//         //   print("Allowing to paste $text");
//         //   //if you return true then it will show the paste confirmation dialog. Otherwise if false, then nothing will happen.
//         //   //but you can show anything you want here, like your pop up saying wrong paste format or etc
//         //   return true;
//         // },
//       ),
//     );
//   }
// }


// class TestOtp extends StatelessWidget {
//   TestOtp({super.key});

//   // final _otpPinFieldController = GlobalKey<OtpPinFieldState>();
//   TextEditingController otpController = TextEditingController();

//   @override
//   Widget build(BuildContext context) {
//     return SizedBox(
//       child: OtpPinField(
//         controller: otpController,
//         maxLength: 6,
//         otpPinFieldStyle:OtpPinFieldStyle(
//          activeFieldBackgroundColor:  Colors.pink,
//          defaultFieldBorderColor: AppTheme.primary,
//          activeFieldBorderColor: Colors.pinkAccent,
//          filledFieldBorderColor:Colors.white
//         ),
//         onSubmit: (String text) {}, 
//         onChange: (String text) {},
//       ),
//     );
//   }
// }
