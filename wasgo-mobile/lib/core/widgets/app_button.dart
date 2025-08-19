import 'package:bytedev/core/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final bool isOutlined;
  final TextStyle? textStyle;
  final OutlinedBorder? shape;
  final TextStyle? buttonTextStyle;
  final double? width;
  final double? height;

  const AppButton(
      {super.key,
      required this.text,
      required this.onPressed,
      this.isLoading = false,
      this.isOutlined = false,
      this.textStyle,
      this.shape,
      this.width,
      this.height,
      this.buttonTextStyle});

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return SizedBox(
      height: height,
      width: width,
      child: TextButton(
        onPressed: isLoading ? null : onPressed,
        style: isOutlined
            ? TextButton.styleFrom(
                side: BorderSide(color: colors.primary),
                backgroundColor: Colors.transparent,
                foregroundColor:
                    colors.primary, // Text color for outlined button
                shape: shape ??
                    RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(12), // Rounded corners
                    ),
              )
            : TextButton.styleFrom(
                backgroundColor:AppTheme.primary, // Deep Blue background for filled
                foregroundColor:Colors.white, // White text color for filled button
                shape: shape ??
                    RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(12), // Rounded corners
                    ),
              ),
        child: isLoading
            ? const CircularProgressIndicator(
                color: Colors.white, // White progress indicator
              )
            : Text(
                text,
                style: buttonTextStyle ??
                    TextStyle(
                      color: isOutlined ? colors.primary : Colors.white,
                      fontSize: 16,
                    ),
              ),
      ),
    );
  }
}

class CustomPinField extends StatelessWidget {
  CustomPinField({super.key});

  final pinController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      // width: 300,
      child: PinCodeTextField(
        // keyboardType: TextInputType.numberWithOptions(),
        appContext: context,
        length: 6,
        obscureText: false,
        animationType: AnimationType.fade,
        pinTheme: PinTheme(
          shape: PinCodeFieldShape.box,
          borderRadius: BorderRadius.circular(5),
          fieldHeight: 40,
          fieldWidth: 40,
          activeColor: Colors.pink,
          inactiveColor: AppTheme.primary,
          selectedColor: Colors.pinkAccent,
          activeFillColor: Colors.white,
        ),
        // animationDuration: Duration(milliseconds: 300),
        // backgroundColor: Colors.blue.shade50,
        // enableActiveFill: true,
        // errorAnimationController: errorController,
        controller: pinController,
        onCompleted: (v) {
          print("Completed");
        },
        onChanged: (value) {
          // print(value);
          // setState(() {
          //   currentText = value;
          // });
        },
        // beforeTextPaste: (text) {
        //   print("Allowing to paste $text");
        //   //if you return true then it will show the paste confirmation dialog. Otherwise if false, then nothing will happen.
        //   //but you can show anything you want here, like your pop up saying wrong paste format or etc
        //   return true;
        // },
      ),
    );
  }
}


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
