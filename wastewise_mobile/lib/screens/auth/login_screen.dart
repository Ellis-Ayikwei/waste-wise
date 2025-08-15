import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:get/get.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../redux/app_state.dart';
import '../../redux/auth/auth_actions.dart';
import '../../utils/constants.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormBuilderState>();
  late TabController _tabController;
  bool _obscurePassword = true;
  bool _isLoading = false;
  String _selectedRole = 'customer'; // 'customer' or 'provider'

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() {
      setState(() {
        _selectedRole = _tabController.index == 0 ? 'customer' : 'provider';
      });
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState?.saveAndValidate() ?? false) {
      final values = _formKey.currentState!.value;
      
      setState(() => _isLoading = true);
      
      StoreProvider.of<AppState>(context).dispatch(
        LoginAction(
          email: values['email'],
          password: values['password'],
          role: _selectedRole,
          onSuccess: () {
            setState(() => _isLoading = false);
            if (_selectedRole == 'provider') {
              Get.offAllNamed('/provider/dashboard');
            } else {
              Get.offAllNamed('/customer/home');
            }
          },
          onError: (error) {
            setState(() => _isLoading = false);
            Get.snackbar(
              'Login Failed',
              error,
              snackPosition: SnackPosition.BOTTOM,
              backgroundColor: Colors.red,
              colorText: Colors.white,
            );
          },
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                
                // Logo and Title
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          FontAwesomeIcons.recycle,
                          size: 50,
                          color: AppColors.primary,
                        ),
                      ).animate().scale(duration: 500.ms),
                      const SizedBox(height: 20),
                      Text(
                        'WasteWise',
                        style: theme.textTheme.headlineLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ).animate().fadeIn(delay: 200.ms),
                      const SizedBox(height: 8),
                      Text(
                        'Smart Waste Management',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: Colors.grey,
                        ),
                      ).animate().fadeIn(delay: 300.ms),
                    ],
                  ),
                ),
                
                const SizedBox(height: 40),
                
                // Role Selection Tabs
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    indicator: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    labelColor: Colors.white,
                    unselectedLabelColor: Colors.grey[600],
                    tabs: [
                      Tab(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(FontAwesomeIcons.user, size: 16),
                            SizedBox(width: 8),
                            Text('Customer'),
                          ],
                        ),
                      ),
                      Tab(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(FontAwesomeIcons.truck, size: 16),
                            SizedBox(width: 8),
                            Text('Provider'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 400.ms),
                
                const SizedBox(height: 30),
                
                // Login Form
                FormBuilder(
                  key: _formKey,
                  child: Column(
                    children: [
                      CustomTextField(
                        name: 'email',
                        label: 'Email Address',
                        prefixIcon: FontAwesomeIcons.envelope,
                        keyboardType: TextInputType.emailAddress,
                        validators: [
                          FormBuilderValidators.required(),
                          FormBuilderValidators.email(),
                        ],
                      ).animate().slideX(delay: 500.ms),
                      
                      const SizedBox(height: 20),
                      
                      CustomTextField(
                        name: 'password',
                        label: 'Password',
                        prefixIcon: FontAwesomeIcons.lock,
                        obscureText: _obscurePassword,
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? FontAwesomeIcons.eye
                                : FontAwesomeIcons.eyeSlash,
                            size: 18,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                        validators: [
                          FormBuilderValidators.required(),
                          FormBuilderValidators.minLength(6),
                        ],
                      ).animate().slideX(delay: 600.ms),
                      
                      const SizedBox(height: 16),
                      
                      // Remember Me and Forgot Password
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              FormBuilderCheckbox(
                                name: 'remember_me',
                                initialValue: false,
                                title: Text(
                                  'Remember me',
                                  style: theme.textTheme.bodyMedium,
                                ),
                              ),
                            ],
                          ),
                          TextButton(
                            onPressed: () {
                              Get.toNamed('/auth/forgot-password');
                            },
                            child: const Text('Forgot Password?'),
                          ),
                        ],
                      ).animate().fadeIn(delay: 700.ms),
                      
                      const SizedBox(height: 30),
                      
                      // Login Button
                      CustomButton(
                        text: 'Login',
                        onPressed: _handleLogin,
                        isLoading: _isLoading,
                        width: double.infinity,
                      ).animate().scale(delay: 800.ms),
                      
                      const SizedBox(height: 20),
                      
                      // OR Divider
                      Row(
                        children: [
                          const Expanded(child: Divider()),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Text(
                              'OR',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: Colors.grey,
                              ),
                            ),
                          ),
                          const Expanded(child: Divider()),
                        ],
                      ).animate().fadeIn(delay: 900.ms),
                      
                      const SizedBox(height: 20),
                      
                      // Social Login Buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _SocialLoginButton(
                            icon: FontAwesomeIcons.google,
                            color: Colors.red,
                            onPressed: () {
                              // Handle Google login
                            },
                          ),
                          const SizedBox(width: 20),
                          _SocialLoginButton(
                            icon: FontAwesomeIcons.facebook,
                            color: Colors.blue,
                            onPressed: () {
                              // Handle Facebook login
                            },
                          ),
                          const SizedBox(width: 20),
                          _SocialLoginButton(
                            icon: FontAwesomeIcons.apple,
                            color: Colors.black,
                            onPressed: () {
                              // Handle Apple login
                            },
                          ),
                        ],
                      ).animate().scale(delay: 1000.ms),
                      
                      const SizedBox(height: 30),
                      
                      // Sign Up Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Don't have an account? ",
                            style: theme.textTheme.bodyMedium,
                          ),
                          TextButton(
                            onPressed: () {
                              Get.toNamed('/auth/register', arguments: {
                                'role': _selectedRole,
                              });
                            },
                            child: Text(
                              'Sign Up',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ).animate().fadeIn(delay: 1100.ms),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SocialLoginButton extends StatelessWidget {
  final IconData icon;
  final Color color;
  final VoidCallback onPressed;

  const _SocialLoginButton({
    Key? key,
    required this.icon,
    required this.color,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: IconButton(
        onPressed: onPressed,
        icon: FaIcon(icon, color: color, size: 20),
        padding: const EdgeInsets.all(12),
      ),
    );
  }
}