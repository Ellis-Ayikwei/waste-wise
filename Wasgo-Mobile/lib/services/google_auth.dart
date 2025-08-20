// import 'package:flutter/material.dart';
// import 'package:google_sign_in/google_sign_in.dart';
// import 'package:flutter_signin_button/flutter_signin_button.dart';

// class GoogleSignInButton extends StatelessWidget {
//   final Function onSignIn;

//   GoogleSignInButton({required this.onSignIn});

//   Future<void> _handleSignIn() async {
//     try {
//       GoogleSignIn googleSignIn = GoogleSignIn();
//       GoogleSignInAccount? account = await googleSignIn.signIn();
//       if (account != null) {
//         onSignIn(account);
//       }
//     } catch (error) {
//       print("Google Sign-In Error: $error");
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return SignInButton(
//       Buttons.Google,
//       text: "Sign in with Google",
//       onPressed: _handleSignIn,
//     );
//   }
// }
