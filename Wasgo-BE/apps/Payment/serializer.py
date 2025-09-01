from rest_framework import serializers
from .models_paystack import (
    PaystackCustomer,
    PaystackPaymentMethod,
    PaystackPayment,
    PaymentWebhook,
    TransferRecipient,
    Transfer,
)
from apps.User.serializer import UserSerializer
from apps.ServiceRequest.serializers import ServiceRequestListSerializer


class PaystackCustomerSerializer(serializers.ModelSerializer):
    """Serializer for PaystackCustomer model"""

    user = UserSerializer(read_only=True)

    class Meta:
        model = PaystackCustomer
        fields = [
            "id",
            "user",
            "customer_code",
            "customer_id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["customer_code", "customer_id", "created_at", "updated_at"]


class PaystackPaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for PaystackPaymentMethod model"""

    user = UserSerializer(read_only=True)

    class Meta:
        model = PaystackPaymentMethod
        fields = [
            "id",
            "user",
            "payment_type",
            "is_default",
            "last_used",
            "is_active",
            "authorization_code",
            "bin",
            "last4",
            "exp_month",
            "exp_year",
            "card_type",
            "bank",
            "country_code",
            "brand",
            "reusable",
            "signature",
            "account_name",
            "account_number",
            "bank_code",
            "bank_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "authorization_code",
            "bin",
            "last4",
            "exp_month",
            "exp_year",
            "card_type",
            "bank",
            "country_code",
            "brand",
            "signature",
            "account_name",
            "account_number",
            "bank_code",
            "bank_name",
            "created_at",
            "updated_at",
        ]


class PaystackPaymentMethodCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating PaystackPaymentMethod"""

    class Meta:
        model = PaystackPaymentMethod
        fields = [
            "payment_type",
            "is_default",
            "authorization_code",
            "bin",
            "last4",
            "exp_month",
            "exp_year",
            "card_type",
            "bank",
            "country_code",
            "brand",
            "reusable",
            "signature",
            "account_name",
            "account_number",
            "bank_code",
            "bank_name",
        ]
        read_only_fields = [
            "authorization_code",
            "bin",
            "last4",
            "exp_month",
            "exp_year",
            "card_type",
            "bank",
            "country_code",
            "brand",
            "signature",
            "account_name",
            "account_number",
            "bank_code",
            "bank_name",
        ]


class PaystackPaymentSerializer(serializers.ModelSerializer):
    """Serializer for PaystackPayment model"""

    user = UserSerializer(read_only=True)
    request = ServiceRequestListSerializer(read_only=True)
    payment_method = PaystackPaymentMethodSerializer(read_only=True)

    class Meta:
        model = PaystackPayment
        fields = [
            "id",
            "request",
            "user",
            "payment_method",
            "amount",
            "currency",
            "status",
            "payment_type",
            "reference",
            "access_code",
            "authorization_url",
            "transaction_id",
            "domain",
            "gateway_response",
            "message",
            "channel",
            "ip_address",
            "fees",
            "paid_at",
            "failed_at",
            "cancelled_at",
            "refunded_at",
            "metadata",
            "description",
            "refund_reference",
            "refund_amount",
            "refund_reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "reference",
            "access_code",
            "authorization_url",
            "transaction_id",
            "domain",
            "gateway_response",
            "message",
            "channel",
            "ip_address",
            "fees",
            "paid_at",
            "failed_at",
            "cancelled_at",
            "refunded_at",
            "refund_reference",
            "refund_amount",
            "created_at",
            "updated_at",
        ]


class PaystackPaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating PaystackPayment"""

    class Meta:
        model = PaystackPayment
        fields = [
            "request",
            "payment_method",
            "amount",
            "currency",
            "payment_type",
            "description",
            "metadata",
        ]


class PaystackPaymentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating PaystackPayment"""

    class Meta:
        model = PaystackPayment
        fields = [
            "status",
            "gateway_response",
            "message",
            "channel",
            "ip_address",
            "fees",
            "paid_at",
            "failed_at",
            "cancelled_at",
            "refunded_at",
            "refund_reference",
            "refund_amount",
            "refund_reason",
        ]
        read_only_fields = [
            "gateway_response",
            "message",
            "channel",
            "ip_address",
            "fees",
            "paid_at",
            "failed_at",
            "cancelled_at",
            "refunded_at",
            "refund_reference",
            "refund_amount",
        ]


class PaymentWebhookSerializer(serializers.ModelSerializer):
    """Serializer for PaymentWebhook model"""

    class Meta:
        model = PaymentWebhook
        fields = [
            "id",
            "event",
            "reference",
            "payload",
            "processed",
            "processed_at",
            "error_message",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["processed", "processed_at", "created_at", "updated_at"]


class TransferRecipientSerializer(serializers.ModelSerializer):
    """Serializer for TransferRecipient model"""

    user = UserSerializer(read_only=True)

    class Meta:
        model = TransferRecipient
        fields = [
            "id",
            "user",
            "recipient_code",
            "type",
            "name",
            "email",
            "description",
            "account_number",
            "bank_code",
            "bank_name",
            "currency",
            "is_active",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["recipient_code", "created_at", "updated_at"]


class TransferRecipientCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating TransferRecipient"""

    class Meta:
        model = TransferRecipient
        fields = [
            "type",
            "name",
            "email",
            "description",
            "account_number",
            "bank_code",
            "bank_name",
            "currency",
            "metadata",
        ]


class TransferSerializer(serializers.ModelSerializer):
    """Serializer for Transfer model"""

    recipient = TransferRecipientSerializer(read_only=True)

    class Meta:
        model = Transfer
        fields = [
            "id",
            "recipient",
            "reference",
            "transfer_code",
            "amount",
            "currency",
            "status",
            "reason",
            "paystack_id",
            "fees",
            "transferred_at",
            "failed_at",
            "reversed_at",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "reference",
            "transfer_code",
            "paystack_id",
            "fees",
            "transferred_at",
            "failed_at",
            "reversed_at",
            "created_at",
            "updated_at",
        ]


class TransferCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Transfer"""

    class Meta:
        model = Transfer
        fields = ["recipient", "amount", "currency", "reason", "metadata"]


# Legacy serializers for backward compatibility (if needed)
class CreateCheckoutSessionSerializer(serializers.Serializer):
    """Legacy serializer for creating payment sessions (now Paystack)"""

    request_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=3, default="NGN")
    success_url = serializers.URLField()
    cancel_url = serializers.URLField()
    description = serializers.CharField(max_length=500, required=False)

    def validate_currency(self, value):
        """Validate currency code"""
        valid_currencies = ["NGN", "GHS", "ZAR", "USD"]
        if value.upper() not in valid_currencies:
            raise serializers.ValidationError(f"Currency {value} is not supported")
        return value.upper()

    def validate_amount(self, value):
        """Validate amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value


class CreateRefundSerializer(serializers.Serializer):
    """Serializer for creating refunds"""

    payment_reference = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    reason = serializers.CharField(max_length=500, required=False)

    def validate_amount(self, value):
        """Validate refund amount is positive if provided"""
        if value is not None and value <= 0:
            raise serializers.ValidationError("Refund amount must be greater than 0")
        return value


# Additional utility serializers
class PaymentStatusSerializer(serializers.Serializer):
    """Serializer for payment status updates"""

    status = serializers.ChoiceField(choices=PaystackPayment.PAYMENT_STATUS)
    message = serializers.CharField(max_length=255, required=False)
    gateway_response = serializers.CharField(max_length=255, required=False)


class PaymentMethodUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating payment method defaults"""

    class Meta:
        model = PaystackPaymentMethod
        fields = ["is_default", "is_active"]


class PaymentSummarySerializer(serializers.Serializer):
    """Serializer for payment summary statistics"""

    total_payments = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    successful_payments = serializers.IntegerField()
    failed_payments = serializers.IntegerField()
    pending_payments = serializers.IntegerField()
    currency = serializers.CharField()
