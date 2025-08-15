import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_paystack/flutter_paystack.dart';
import '../config/app_config.dart';
import '../utils/logger.dart';

enum PaymentMethod {
  mobileMoney,
  card,
  cash,
  wallet,
}

enum MobileMoneyProvider {
  mtn,
  vodafone,
  airtelTigo,
}

class PaymentService {
  static final PaymentService _instance = PaymentService._internal();
  factory PaymentService() => _instance;
  PaymentService._internal();

  final Dio _dio = Dio();
  final PaystackPlugin _paystackPlugin = PaystackPlugin();
  
  // Initialize payment services
  Future<void> initialize() async {
    try {
      // Initialize Paystack
      await _paystackPlugin.initialize(
        publicKey: AppConfig.paystackPublicKey,
      );
      
      // Initialize other payment providers
      await _initializeMobileMoney();
      
      Logger.info('Payment services initialized successfully');
    } catch (e) {
      Logger.error('Failed to initialize payment services', e);
    }
  }
  
  Future<void> _initializeMobileMoney() async {
    // Initialize MTN MoMo, Vodafone Cash, AirtelTigo Money
    // This would involve setting up API credentials for each provider
  }
  
  // Process payment based on method
  Future<PaymentResult> processPayment({
    required double amount,
    required String reference,
    required PaymentMethod method,
    required String customerEmail,
    String? customerPhone,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      switch (method) {
        case PaymentMethod.mobileMoney:
          return await _processMobileMoneyPayment(
            amount: amount,
            reference: reference,
            phone: customerPhone!,
            metadata: metadata,
          );
          
        case PaymentMethod.card:
          return await _processCardPayment(
            amount: amount,
            reference: reference,
            email: customerEmail,
            metadata: metadata,
          );
          
        case PaymentMethod.wallet:
          return await _processWalletPayment(
            amount: amount,
            reference: reference,
            metadata: metadata,
          );
          
        case PaymentMethod.cash:
          return PaymentResult(
            success: true,
            reference: reference,
            message: 'Cash payment will be collected on delivery',
            method: 'cash',
          );
          
        default:
          throw Exception('Unsupported payment method');
      }
    } catch (e) {
      Logger.error('Payment processing failed', e);
      return PaymentResult(
        success: false,
        reference: reference,
        message: e.toString(),
        method: method.toString(),
      );
    }
  }
  
  // Mobile Money Payment (MTN, Vodafone, AirtelTigo)
  Future<PaymentResult> _processMobileMoneyPayment({
    required double amount,
    required String reference,
    required String phone,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      // Determine provider from phone number
      final provider = _getMobileMoneyProvider(phone);
      
      switch (provider) {
        case MobileMoneyProvider.mtn:
          return await _processMTNMoMo(
            amount: amount,
            reference: reference,
            phone: phone,
            metadata: metadata,
          );
          
        case MobileMoneyProvider.vodafone:
          return await _processVodafoneCash(
            amount: amount,
            reference: reference,
            phone: phone,
            metadata: metadata,
          );
          
        case MobileMoneyProvider.airtelTigo:
          return await _processAirtelTigoMoney(
            amount: amount,
            reference: reference,
            phone: phone,
            metadata: metadata,
          );
          
        default:
          throw Exception('Unknown mobile money provider');
      }
    } catch (e) {
      throw Exception('Mobile money payment failed: $e');
    }
  }
  
  // MTN Mobile Money
  Future<PaymentResult> _processMTNMoMo({
    required double amount,
    required String reference,
    required String phone,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      // MTN MoMo API integration
      final response = await _dio.post(
        '${AppConfig.mtnMomoApiUrl}/collection/v1_0/requesttopay',
        data: {
          'amount': amount.toString(),
          'currency': 'GHS',
          'externalId': reference,
          'payer': {
            'partyIdType': 'MSISDN',
            'partyId': phone,
          },
          'payerMessage': 'WasteWise Payment',
          'payeeNote': 'Waste collection service',
        },
        options: Options(
          headers: {
            'X-Reference-Id': reference,
            'X-Target-Environment': AppConfig.environment,
            'Ocp-Apim-Subscription-Key': AppConfig.mtnMomoApiKey,
            'Authorization': 'Bearer ${await _getMTNAccessToken()}',
          },
        ),
      );
      
      if (response.statusCode == 202) {
        // Payment request accepted, check status
        return await _checkMTNPaymentStatus(reference);
      } else {
        throw Exception('MTN MoMo request failed');
      }
    } catch (e) {
      Logger.error('MTN MoMo payment failed', e);
      throw e;
    }
  }
  
  // Vodafone Cash
  Future<PaymentResult> _processVodafoneCash({
    required double amount,
    required String reference,
    required String phone,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      // Vodafone Cash API integration
      final response = await _dio.post(
        '${AppConfig.vodafoneCashApiUrl}/payment/request',
        data: {
          'amount': amount,
          'currency': 'GHS',
          'reference': reference,
          'customerMsisdn': phone,
          'description': 'WasteWise Payment',
          'clientReference': reference,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer ${AppConfig.vodafoneCashApiKey}',
            'Content-Type': 'application/json',
          },
        ),
      );
      
      if (response.data['status'] == 'success') {
        return PaymentResult(
          success: true,
          reference: reference,
          transactionId: response.data['transactionId'],
          message: 'Payment successful',
          method: 'vodafone_cash',
        );
      } else {
        throw Exception('Vodafone Cash payment failed');
      }
    } catch (e) {
      Logger.error('Vodafone Cash payment failed', e);
      throw e;
    }
  }
  
  // AirtelTigo Money
  Future<PaymentResult> _processAirtelTigoMoney({
    required double amount,
    required String reference,
    required String phone,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      // AirtelTigo Money API integration
      final response = await _dio.post(
        '${AppConfig.airtelTigoApiUrl}/merchant/v1/payments/',
        data: {
          'reference': reference,
          'subscriber': {
            'country': 'GH',
            'currency': 'GHS',
            'msisdn': phone,
          },
          'transaction': {
            'amount': amount,
            'country': 'GH',
            'currency': 'GHS',
            'id': reference,
          },
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer ${AppConfig.airtelTigoApiKey}',
            'X-Country': 'GH',
            'X-Currency': 'GHS',
          },
        ),
      );
      
      if (response.data['status']['success']) {
        return PaymentResult(
          success: true,
          reference: reference,
          transactionId: response.data['data']['transaction']['id'],
          message: 'Payment initiated',
          method: 'airteltigo_money',
        );
      } else {
        throw Exception('AirtelTigo Money payment failed');
      }
    } catch (e) {
      Logger.error('AirtelTigo Money payment failed', e);
      throw e;
    }
  }
  
  // Card Payment via Paystack
  Future<PaymentResult> _processCardPayment({
    required double amount,
    required String reference,
    required String email,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final charge = Charge()
        ..amount = (amount * 100).toInt() // Convert to pesewas
        ..reference = reference
        ..email = email
        ..currency = 'GHS'
        ..metadata = metadata;
      
      final response = await _paystackPlugin.checkout(
        context,
        charge: charge,
        method: CheckoutMethod.card,
      );
      
      if (response.status) {
        return PaymentResult(
          success: true,
          reference: reference,
          transactionId: response.reference,
          message: response.message,
          method: 'card',
        );
      } else {
        throw Exception(response.message);
      }
    } catch (e) {
      Logger.error('Card payment failed', e);
      throw e;
    }
  }
  
  // Wallet Payment
  Future<PaymentResult> _processWalletPayment({
    required double amount,
    required String reference,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      // Call backend API to process wallet payment
      final response = await _dio.post(
        '${AppConfig.apiUrl}/payments/wallet',
        data: {
          'amount': amount,
          'reference': reference,
          'metadata': metadata,
        },
      );
      
      if (response.data['success']) {
        return PaymentResult(
          success: true,
          reference: reference,
          transactionId: response.data['transactionId'],
          message: 'Payment successful',
          method: 'wallet',
        );
      } else {
        throw Exception(response.data['message']);
      }
    } catch (e) {
      Logger.error('Wallet payment failed', e);
      throw e;
    }
  }
  
  // Verify payment status
  Future<PaymentStatus> verifyPayment(String reference) async {
    try {
      final response = await _dio.get(
        '${AppConfig.apiUrl}/payments/verify/$reference',
      );
      
      return PaymentStatus.fromJson(response.data);
    } catch (e) {
      Logger.error('Payment verification failed', e);
      throw e;
    }
  }
  
  // Get payment history
  Future<List<PaymentHistory>> getPaymentHistory() async {
    try {
      final response = await _dio.get(
        '${AppConfig.apiUrl}/payments/history',
      );
      
      return (response.data['data'] as List)
          .map((item) => PaymentHistory.fromJson(item))
          .toList();
    } catch (e) {
      Logger.error('Failed to fetch payment history', e);
      throw e;
    }
  }
  
  // Process refund
  Future<RefundResult> processRefund({
    required String transactionId,
    required double amount,
    required String reason,
  }) async {
    try {
      final response = await _dio.post(
        '${AppConfig.apiUrl}/payments/refund',
        data: {
          'transactionId': transactionId,
          'amount': amount,
          'reason': reason,
        },
      );
      
      return RefundResult.fromJson(response.data);
    } catch (e) {
      Logger.error('Refund processing failed', e);
      throw e;
    }
  }
  
  // Helper methods
  MobileMoneyProvider _getMobileMoneyProvider(String phone) {
    // Remove country code if present
    String normalizedPhone = phone.replaceAll('+233', '0');
    
    // MTN prefixes: 024, 054, 055, 059
    if (normalizedPhone.startsWith('024') ||
        normalizedPhone.startsWith('054') ||
        normalizedPhone.startsWith('055') ||
        normalizedPhone.startsWith('059')) {
      return MobileMoneyProvider.mtn;
    }
    
    // Vodafone prefixes: 020, 050
    if (normalizedPhone.startsWith('020') ||
        normalizedPhone.startsWith('050')) {
      return MobileMoneyProvider.vodafone;
    }
    
    // AirtelTigo prefixes: 026, 056, 027, 057
    if (normalizedPhone.startsWith('026') ||
        normalizedPhone.startsWith('056') ||
        normalizedPhone.startsWith('027') ||
        normalizedPhone.startsWith('057')) {
      return MobileMoneyProvider.airtelTigo;
    }
    
    throw Exception('Unknown mobile network operator');
  }
  
  Future<String> _getMTNAccessToken() async {
    try {
      final response = await _dio.post(
        '${AppConfig.mtnMomoApiUrl}/collection/token/',
        options: Options(
          headers: {
            'Ocp-Apim-Subscription-Key': AppConfig.mtnMomoApiKey,
            'Authorization': 'Basic ${base64Encode(utf8.encode('${AppConfig.mtnMomoUserId}:${AppConfig.mtnMomoApiSecret}'))}',
          },
        ),
      );
      
      return response.data['access_token'];
    } catch (e) {
      Logger.error('Failed to get MTN access token', e);
      throw e;
    }
  }
  
  Future<PaymentResult> _checkMTNPaymentStatus(String reference) async {
    try {
      final response = await _dio.get(
        '${AppConfig.mtnMomoApiUrl}/collection/v1_0/requesttopay/$reference',
        options: Options(
          headers: {
            'X-Target-Environment': AppConfig.environment,
            'Ocp-Apim-Subscription-Key': AppConfig.mtnMomoApiKey,
            'Authorization': 'Bearer ${await _getMTNAccessToken()}',
          },
        ),
      );
      
      if (response.data['status'] == 'SUCCESSFUL') {
        return PaymentResult(
          success: true,
          reference: reference,
          transactionId: response.data['financialTransactionId'],
          message: 'Payment successful',
          method: 'mtn_momo',
        );
      } else if (response.data['status'] == 'FAILED') {
        throw Exception('Payment failed: ${response.data['reason']}');
      } else {
        // Payment is still pending
        return PaymentResult(
          success: false,
          reference: reference,
          message: 'Payment pending',
          method: 'mtn_momo',
          isPending: true,
        );
      }
    } catch (e) {
      Logger.error('Failed to check MTN payment status', e);
      throw e;
    }
  }
  
  // Generate unique payment reference
  String generateReference() {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final random = DateTime.now().microsecond;
    return 'WW-$timestamp-$random';
  }
  
  // Calculate transaction fee
  double calculateTransactionFee(double amount, PaymentMethod method) {
    switch (method) {
      case PaymentMethod.mobileMoney:
        // Mobile money typically charges 1% fee
        return amount * 0.01;
      case PaymentMethod.card:
        // Card payments typically charge 2.95% + GHS 1.00
        return (amount * 0.0295) + 1.00;
      case PaymentMethod.wallet:
        // No fee for wallet payments
        return 0.0;
      case PaymentMethod.cash:
        // No fee for cash payments
        return 0.0;
    }
  }
}

// Payment Result Model
class PaymentResult {
  final bool success;
  final String reference;
  final String? transactionId;
  final String message;
  final String method;
  final bool isPending;
  
  PaymentResult({
    required this.success,
    required this.reference,
    this.transactionId,
    required this.message,
    required this.method,
    this.isPending = false,
  });
}

// Payment Status Model
class PaymentStatus {
  final String reference;
  final String status;
  final double amount;
  final String method;
  final DateTime createdAt;
  final DateTime? completedAt;
  
  PaymentStatus({
    required this.reference,
    required this.status,
    required this.amount,
    required this.method,
    required this.createdAt,
    this.completedAt,
  });
  
  factory PaymentStatus.fromJson(Map<String, dynamic> json) {
    return PaymentStatus(
      reference: json['reference'],
      status: json['status'],
      amount: json['amount'].toDouble(),
      method: json['method'],
      createdAt: DateTime.parse(json['createdAt']),
      completedAt: json['completedAt'] != null 
          ? DateTime.parse(json['completedAt']) 
          : null,
    );
  }
}

// Payment History Model
class PaymentHistory {
  final String id;
  final String reference;
  final double amount;
  final String method;
  final String status;
  final String description;
  final DateTime createdAt;
  
  PaymentHistory({
    required this.id,
    required this.reference,
    required this.amount,
    required this.method,
    required this.status,
    required this.description,
    required this.createdAt,
  });
  
  factory PaymentHistory.fromJson(Map<String, dynamic> json) {
    return PaymentHistory(
      id: json['id'],
      reference: json['reference'],
      amount: json['amount'].toDouble(),
      method: json['method'],
      status: json['status'],
      description: json['description'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

// Refund Result Model
class RefundResult {
  final bool success;
  final String refundId;
  final String message;
  final double amount;
  
  RefundResult({
    required this.success,
    required this.refundId,
    required this.message,
    required this.amount,
  });
  
  factory RefundResult.fromJson(Map<String, dynamic> json) {
    return RefundResult(
      success: json['success'],
      refundId: json['refundId'],
      message: json['message'],
      amount: json['amount'].toDouble(),
    );
  }
}

// Global context for Paystack
late BuildContext context;