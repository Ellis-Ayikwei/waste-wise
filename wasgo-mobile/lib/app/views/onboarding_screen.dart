import 'package:flutter/material.dart';
import 'package:get/get.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;

    return Scaffold(
      body: Container(
        color: Color(0xFFFFD1DC),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            // Top text section
            Padding(
              padding: EdgeInsets.fromLTRB(
                20,
                isSmallScreen ? 100 : 142,
                20,
                20,
              ),
              child: Column(
                children: [
                  Text(
                    'Ghana Beauty',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 30 : 40,
                      color: Colors.white,
                      fontFamily: 'Monoton',
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    'Glow And Relax With Us',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: isSmallScreen ? 20 : 30,
                      color: Colors.black,
                      fontFamily: 'Montez',
                    ),
                  ),
                ],
              ),
            ),
            // Image and overlay section
            Expanded(
              child: Stack(
                alignment: Alignment.bottomCenter,
                children: [
                  // Full-screen image
                  Transform.scale(
                    scale: 1.25,
                    child: Image.asset(
                      'assets/images/onBoardingimage.png',
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  // Bottom overlay
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(height: isSmallScreen ? 20 : 30),
                        ElevatedButton(
                          onPressed: () {
                            Get.toNamed('/login');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: Colors.black,
                            minimumSize:
                                isSmallScreen ? Size(150, 50) : Size(200, 70),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          child: Text(
                            'Get Started',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: isSmallScreen ? 16 : 20,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
