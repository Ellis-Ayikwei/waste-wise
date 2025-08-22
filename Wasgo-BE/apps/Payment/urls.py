from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_paystack_secure import SecurePaystackPaymentViewSet, paystack_webhook

# Create router for viewset
router = DefaultRouter(trailing_slash=True)
router.register(r'payments', SecurePaystackPaymentViewSet, basename='payment')

urlpatterns = [
    # Include router URLs (provides /payments/ endpoints)
    path('', include(router.urls)),
    
    # Webhook endpoint (no trailing slash for webhooks)
    path('payments/webhook/', paystack_webhook, name='paystack_webhook'),
    
    # Additional custom endpoints if needed
    # These are already handled by the viewset actions:
    # - /payments/initialize_payment/ (POST)
    # - /payments/verify_payment/ (GET)
    # - /payments/charge_authorization/ (POST)
    # - /payments/payment_methods/ (GET)
    # - /payments/set_default_payment_method/ (POST)
    # - /payments/delete_payment_method/ (DELETE)
    # - /payments/create_refund/ (POST)
]