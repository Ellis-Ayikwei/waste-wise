"""
Payment models updated for Paystack integration
"""
from django.db import models
from apps.Basemodel.models import Basemodel
from apps.ServiceRequest.models import ServiceRequest
from apps.User.models import User


class PaystackCustomer(Basemodel):
    """Model to store Paystack customer information"""
    
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="paystack_customer"
    )
    customer_code = models.CharField(max_length=100, unique=True)
    customer_id = models.IntegerField(unique=True, null=True)
    email = models.EmailField()
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = "paystack_customer"
        managed = True
        
    def __str__(self):
        return f"{self.user.email} - {self.customer_code}"


class PaystackPaymentMethod(Basemodel):
    """Model to store user payment methods for Paystack integration"""

    PAYMENT_TYPES = [
        ("card", "Credit/Debit Card"),
        ("bank", "Bank Transfer"),
        ("mobile_money", "Mobile Money"),
        ("ussd", "USSD"),
        ("qr", "QR Code"),
    ]
    
    CARD_BRANDS = [
        ("visa", "Visa"),
        ("mastercard", "Mastercard"),
        ("verve", "Verve"),
        ("americanexpress", "American Express"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="paystack_payment_methods"
    )
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    is_default = models.BooleanField(default=False)
    last_used = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # Paystack-specific fields
    authorization_code = models.CharField(
        max_length=100, null=True, blank=True, unique=True
    )
    bin = models.CharField(max_length=6, null=True, blank=True)  # First 6 digits of card
    last4 = models.CharField(max_length=4, null=True, blank=True)
    exp_month = models.CharField(max_length=2, null=True, blank=True)
    exp_year = models.CharField(max_length=4, null=True, blank=True)
    card_type = models.CharField(max_length=20, null=True, blank=True)
    bank = models.CharField(max_length=100, null=True, blank=True)
    country_code = models.CharField(max_length=2, null=True, blank=True)
    brand = models.CharField(max_length=20, choices=CARD_BRANDS, null=True, blank=True)
    reusable = models.BooleanField(default=True)
    signature = models.CharField(max_length=100, null=True, blank=True)
    
    # For bank accounts
    account_name = models.CharField(max_length=100, null=True, blank=True)
    account_number = models.CharField(max_length=20, null=True, blank=True)
    bank_code = models.CharField(max_length=10, null=True, blank=True)
    bank_name = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = "paystack_payment_method"
        managed = True
        ordering = ["-created_at"]

    def __str__(self):
        if self.payment_type == 'card':
            return f"{self.user.email} - {self.brand} ****{self.last4}"
        elif self.payment_type == 'bank':
            return f"{self.user.email} - {self.bank_name} ****{self.account_number[-4:] if self.account_number else ''}"
        return f"{self.user.email} - {self.payment_type}"


class PaystackPayment(Basemodel):
    """Payment transaction model for Paystack"""
    
    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("success", "Success"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
        ("abandoned", "Abandoned"),
        ("refunded", "Refunded"),
        ("partially_refunded", "Partially Refunded"),
    ]

    PAYMENT_TYPE = [
        ("deposit", "Deposit"),
        ("full_payment", "Full Payment"),
        ("partial_payment", "Partial Payment"),
        ("final_payment", "Final Payment"),
        ("additional_fee", "Additional Fee"),
        ("refund", "Refund"),
    ]
    
    CURRENCY_CHOICES = [
        ("NGN", "Nigerian Naira"),
        ("GHS", "Ghanaian Cedi"),
        ("ZAR", "South African Rand"),
        ("USD", "US Dollar"),
    ]

    request = models.ForeignKey(
        ServiceRequest, on_delete=models.CASCADE, related_name="paystack_payments", null=True, blank=True
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_payments"
    )
    payment_method = models.ForeignKey(
        PaystackPaymentMethod, on_delete=models.SET_NULL, null=True, blank=True
    )
    
    # Payment details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="NGN")
    status = models.CharField(max_length=30, choices=PAYMENT_STATUS, default="pending")
    payment_type = models.CharField(
        max_length=20, choices=PAYMENT_TYPE, default="full_payment"
    )
    
    # Paystack-specific fields
    reference = models.CharField(max_length=100, unique=True)
    access_code = models.CharField(max_length=100, null=True, blank=True)
    authorization_url = models.URLField(null=True, blank=True)
    
    # Transaction details from Paystack
    transaction_id = models.BigIntegerField(null=True, blank=True, unique=True)
    domain = models.CharField(max_length=20, default="live")
    gateway_response = models.CharField(max_length=255, null=True, blank=True)
    message = models.CharField(max_length=255, null=True, blank=True)
    channel = models.CharField(max_length=20, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    fees = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Timestamps
    paid_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)
    
    # Additional info
    metadata = models.JSONField(default=dict, blank=True)
    description = models.TextField(blank=True)
    
    # For refunds
    refund_reference = models.CharField(max_length=100, null=True, blank=True)
    refund_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    refund_reason = models.TextField(blank=True)

    class Meta:
        db_table = "paystack_payment"
        managed = True
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["reference"]),
            models.Index(fields=["status"]),
            models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.reference} - {self.amount} {self.currency} - {self.status}"
    
    def amount_in_kobo(self):
        """Convert amount to kobo (smallest unit)"""
        return int(self.amount * 100)


class PaymentWebhook(Basemodel):
    """Store Paystack webhook events for auditing"""
    
    EVENT_TYPES = [
        ("charge.success", "Charge Success"),
        ("charge.failed", "Charge Failed"),
        ("transfer.success", "Transfer Success"),
        ("transfer.failed", "Transfer Failed"),
        ("transfer.reversed", "Transfer Reversed"),
        ("refund.processed", "Refund Processed"),
        ("refund.failed", "Refund Failed"),
        ("subscription.create", "Subscription Created"),
        ("subscription.disable", "Subscription Disabled"),
        ("invoice.create", "Invoice Created"),
        ("invoice.payment_failed", "Invoice Payment Failed"),
    ]
    
    event = models.CharField(max_length=50, choices=EVENT_TYPES)
    reference = models.CharField(max_length=100)
    payload = models.JSONField()
    processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    
    class Meta:
        db_table = "payment_webhook"
        managed = True
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["event", "processed"]),
            models.Index(fields=["reference"]),
        ]
    
    def __str__(self):
        return f"{self.event} - {self.reference} - {'Processed' if self.processed else 'Pending'}"


class TransferRecipient(Basemodel):
    """Store transfer recipient details for payouts"""
    
    RECIPIENT_TYPES = [
        ("nuban", "Nigerian Bank Account"),
        ("mobile_money", "Mobile Money"),
        ("basa", "South African Bank Account"),
        ("authorization", "Authorization"),
    ]
    
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transfer_recipients"
    )
    recipient_code = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=20, choices=RECIPIENT_TYPES, default="nuban")
    name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    description = models.CharField(max_length=255, blank=True)
    
    # Bank details
    account_number = models.CharField(max_length=20, null=True, blank=True)
    bank_code = models.CharField(max_length=10, null=True, blank=True)
    bank_name = models.CharField(max_length=100, null=True, blank=True)
    
    currency = models.CharField(max_length=3, default="NGN")
    is_active = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = "transfer_recipient"
        managed = True
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"{self.name} - {self.bank_name} ({self.account_number})"


class Transfer(Basemodel):
    """Store transfer/payout transactions"""
    
    TRANSFER_STATUS = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
        ("reversed", "Reversed"),
    ]
    
    recipient = models.ForeignKey(
        TransferRecipient, on_delete=models.CASCADE, related_name="transfers"
    )
    reference = models.CharField(max_length=100, unique=True)
    transfer_code = models.CharField(max_length=100, unique=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="NGN")
    status = models.CharField(max_length=20, choices=TRANSFER_STATUS, default="pending")
    reason = models.CharField(max_length=255)
    
    # Paystack response
    paystack_id = models.BigIntegerField(null=True, blank=True)
    fees = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Timestamps
    transferred_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    reversed_at = models.DateTimeField(null=True, blank=True)
    
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = "transfer"
        managed = True
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["reference"]),
            models.Index(fields=["status"]),
        ]
    
    def __str__(self):
        return f"{self.reference} - {self.amount} {self.currency} to {self.recipient.name}"