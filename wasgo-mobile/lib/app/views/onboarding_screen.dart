import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> with TickerProviderStateMixin {
  late PageController _pageController;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  
  int _currentPage = 0;
  final List<OnboardingPage> _pages = [
    OnboardingPage(
      title: 'Welcome to WasteWise',
      subtitle: 'Smart waste management for a cleaner future',
      description: 'Join thousands of users who are making a difference in waste management and environmental conservation.',
      icon: Icons.recycling,
      image: 'assets/images/1.jpg',
    ),
    OnboardingPage(
      title: 'Smart Bin Monitoring',
      subtitle: 'Real-time waste tracking',
      description: 'Monitor your waste levels in real-time with our smart bin technology. Get alerts when bins need emptying.',
      icon: Icons.sensors,
      image: 'assets/images/2.jpg',
    ),
    OnboardingPage(
      title: 'Eco-Friendly Rewards',
      subtitle: 'Earn while you recycle',
      description: 'Get rewarded for your environmental efforts. Earn points, badges, and credits for sustainable practices.',
      icon: Icons.emoji_events,
      image: 'assets/images/3.jpg',
    ),
    OnboardingPage(
      title: 'Professional Pickup',
      subtitle: 'Reliable waste collection',
      description: 'Schedule pickups with certified waste management professionals. Track your collection in real-time.',
      icon: Icons.local_shipping,
      image: 'assets/images/4.jpg',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      Get.offAllNamed('/login');
    }
  }

  void _skipToLogin() {
    Get.offAllNamed('/login');
  }

  // Responsive helper methods
  double _getResponsiveFontSize(BuildContext context, double baseSize) {
    final width = MediaQuery.of(context).size.width;
    if (width < 480) return baseSize * 0.85;
    if (width < 600) return baseSize * 0.9;
    if (width < 768) return baseSize * 0.95;
    return baseSize;
  }

  double _getResponsiveIconSize(BuildContext context, double baseSize) {
    final width = MediaQuery.of(context).size.width;
    if (width < 480) return baseSize * 0.8;
    if (width < 600) return baseSize * 0.85;
    if (width < 768) return baseSize * 0.9;
    return baseSize;
  }

  EdgeInsets _getResponsivePadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < 480) return const EdgeInsets.all(16);
    if (width < 600) return const EdgeInsets.all(20);
    if (width < 768) return const EdgeInsets.all(24);
    return const EdgeInsets.all(32);
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isSmallScreen = screenSize.width < 600;
    final padding = _getResponsivePadding(context);
    final titleSize = _getResponsiveFontSize(context, 32);
    final subtitleSize = _getResponsiveFontSize(context, 18);
    final descriptionSize = _getResponsiveFontSize(context, 16);
    final iconSize = _getResponsiveIconSize(context, 80);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppColors.primary,
              AppColors.primaryDark,
              AppColors.primaryDarker,
            ],
            stops: const [0.0, 0.7, 1.0],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Skip button
              Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: padding,
                  child: TextButton(
                    onPressed: _skipToLogin,
                    child: Text(
                      'Skip',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: _getResponsiveFontSize(context, 16),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ),
              
              // Page content
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentPage = index;
                    });
                    _animationController.reset();
                    _animationController.forward();
                  },
                  itemCount: _pages.length,
                  itemBuilder: (context, index) {
                    final page = _pages[index];
                    return FadeTransition(
                      opacity: _fadeAnimation,
                      child: SlideTransition(
                        position: _slideAnimation,
                        child: Padding(
                          padding: padding,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              // Icon
                              Container(
                                width: iconSize,
                                height: iconSize,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(iconSize / 2),
                                  border: Border.all(
                                    color: Colors.white.withOpacity(0.3),
                                    width: 2,
                                  ),
                                ),
                                child: Icon(
                                  page.icon,
                                  color: Colors.white,
                                  size: iconSize * 0.5,
                                ),
                              ),
                              
                              SizedBox(height: _getResponsiveFontSize(context, 32)),
                              
                              // Title
                              Text(
                                page.title,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: titleSize,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              
                              SizedBox(height: _getResponsiveFontSize(context, 16)),
                              
                              // Subtitle
                              Text(
                                page.subtitle,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: subtitleSize,
                                  color: Colors.white.withOpacity(0.9),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              
                              SizedBox(height: _getResponsiveFontSize(context, 24)),
                              
                              // Description
                              Text(
                                page.description,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: descriptionSize,
                                  color: Colors.white.withOpacity(0.8),
                                  height: 1.5,
                                ),
                              ),
                              
                              SizedBox(height: _getResponsiveFontSize(context, 40)),
                              
                              // Image
                              Expanded(
                                child: Container(
                                  width: double.infinity,
                                  margin: EdgeInsets.symmetric(
                                    horizontal: _getResponsiveFontSize(context, 16),
                                  ),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 20)),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.2),
                                        blurRadius: 20,
                                        offset: const Offset(0, 10),
                                        spreadRadius: 2,
                                      ),
                                    ],
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 20)),
                                    child: Image.asset(
                                      page.image,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              // Bottom section with indicators and buttons
              Container(
                padding: padding,
                child: Column(
                  children: [
                    // Page indicators
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _pages.length,
                        (index) => AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: EdgeInsets.symmetric(
                            horizontal: _getResponsiveFontSize(context, 4),
                          ),
                          width: _currentPage == index 
                              ? _getResponsiveFontSize(context, 24)
                              : _getResponsiveFontSize(context, 8),
                          height: _getResponsiveFontSize(context, 8),
                          decoration: BoxDecoration(
                            color: _currentPage == index 
                                ? Colors.white 
                                : Colors.white.withOpacity(0.3),
                            borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 4)),
                          ),
                        ),
                      ),
                    ),
                    
                    SizedBox(height: _getResponsiveFontSize(context, 32)),
                    
                    // Action buttons
                    Row(
                      children: [
                        // Previous button (only show if not first page)
                        if (_currentPage > 0)
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                _pageController.previousPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.easeInOut,
                                );
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: BorderSide(color: Colors.white.withOpacity(0.5)),
                                padding: EdgeInsets.symmetric(
                                  vertical: _getResponsiveFontSize(context, 16),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 12)),
                                ),
                              ),
                              child: Text(
                                'Previous',
                                style: TextStyle(
                                  fontSize: _getResponsiveFontSize(context, 16),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        
                        if (_currentPage > 0)
                          SizedBox(width: _getResponsiveFontSize(context, 16)),
                        
                        // Next/Get Started button
                        Expanded(
                          flex: _currentPage > 0 ? 1 : 1,
                          child: ElevatedButton(
                            onPressed: _nextPage,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: AppColors.primary,
                              padding: EdgeInsets.symmetric(
                                vertical: _getResponsiveFontSize(context, 16),
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(_getResponsiveFontSize(context, 12)),
                              ),
                              elevation: 4,
                              shadowColor: Colors.black.withOpacity(0.2),
                            ),
                            child: Text(
                              _currentPage == _pages.length - 1 ? 'Get Started' : 'Next',
                              style: TextStyle(
                                fontSize: _getResponsiveFontSize(context, 16),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    
                    SizedBox(height: _getResponsiveFontSize(context, 16)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class OnboardingPage {
  final String title;
  final String subtitle;
  final String description;
  final IconData icon;
  final String image;

  OnboardingPage({
    required this.title,
    required this.subtitle,
    required this.description,
    required this.icon,
    required this.image,
  });
}
