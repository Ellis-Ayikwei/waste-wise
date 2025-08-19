import 'package:bytedev/app/controllers/auth_controller.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/get.dart';

class PhoneNumberScreen extends StatelessWidget {
  final AuthController controller;

  const PhoneNumberScreen({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, AuthState>(
      converter: (store) => store.state.authState,
      builder: (context, authState) {
        final phoneController = TextEditingController();

        return Scaffold(
          appBar: AppBar(
            title: const Text('Enter Phone Number'),
          ),
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 5,
                      blurRadius: 7,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextFormField(
                        controller: phoneController,
                        decoration: const InputDecoration(
                          labelText: 'Phone Number',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          final phoneNumber = phoneController.text.trim();
                          print("Sending phone number: $phoneNumber");
                          controller.sendPhoneNumber(phoneNumber);
                          Get.toNamed('/home');
                        },
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 32.0, vertical: 16.0),
                        ),
                        child: const Text('Send'),
                      ),
                      Text("some text"),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
