"""
Paystack Configuration Settings
Add these to your Django settings.py file
"""

# Paystack API Keys
PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'  # Replace with your public key
PAYSTACK_SECRET_KEY = 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'  # Replace with your secret key

# Paystack Webhook URL (configure this in your Paystack dashboard)
PAYSTACK_WEBHOOK_URL = 'https://yourdomain.com/api/payments/webhook/'

# Paystack Settings
PAYSTACK_SETTINGS = {
    'CURRENCY': 'NGN',  # Default currency
    'ALLOWED_CURRENCIES': ['NGN', 'GHS', 'ZAR', 'USD'],
    'CHANNELS': ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    'CALLBACK_URL': 'https://yourdomain.com/payment/callback',
    'WEBHOOK_IP_WHITELIST': [
        '52.31.139.75',
        '52.49.173.169',
        '52.214.14.220',
    ],  # Paystack IP addresses for webhook validation
}

# Payment Settings
PAYMENT_SETTINGS = {
    'AUTO_VERIFY': True,  # Automatically verify payments after initialization
    'SEND_RECEIPT': True,  # Send email receipts
    'ALLOW_PARTIAL_PAYMENT': False,  # Allow partial payments
    'MINIMUM_AMOUNT': 100,  # Minimum payment amount in Naira
    'MAXIMUM_AMOUNT': 10000000,  # Maximum payment amount in Naira
}

# Add to INSTALLED_APPS if not already present
INSTALLED_APPS = [
    # ... other apps
    'apps.Payment',
    'corsheaders',  # For CORS support
]

# Add to MIDDLEWARE if not already present
MIDDLEWARE = [
    # ... other middleware
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# CORS settings for frontend integration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
    "http://localhost:3001",  # Alternative port
    "https://yourdomain.com",  # Production domain
]

# Update requirements.txt with:
"""
# Payment Dependencies
requests==2.31.0
python-dotenv==1.0.0
"""