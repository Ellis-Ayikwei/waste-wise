"""
Migration to add Paystack payment models
"""
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Payment', '0001_initial'),
        ('User', '0001_initial'),
        ('Request', '0001_initial'),
    ]

    operations = [
        # Create PaystackCustomer model
        migrations.CreateModel(
            name='PaystackCustomer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer_code', models.CharField(max_length=100, unique=True)),
                ('customer_id', models.IntegerField(null=True, unique=True)),
                ('email', models.EmailField(max_length=254)),
                ('first_name', models.CharField(blank=True, max_length=100)),
                ('last_name', models.CharField(blank=True, max_length=100)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='paystack_customer', to='User.user')),
            ],
            options={
                'db_table': 'paystack_customer',
                'managed': True,
            },
        ),
        
        # Update PaymentMethod for Paystack
        migrations.AddField(
            model_name='paymentmethod',
            name='authorization_code',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='bin',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='last4',
            field=models.CharField(blank=True, max_length=4, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='exp_month',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='exp_year',
            field=models.CharField(blank=True, max_length=4, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='card_type',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='bank',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='country_code',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='brand',
            field=models.CharField(blank=True, choices=[('visa', 'Visa'), ('mastercard', 'Mastercard'), ('verve', 'Verve'), ('americanexpress', 'American Express')], max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='reusable',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='signature',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='account_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='account_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='bank_code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        
        # Update Payment model for Paystack
        migrations.AddField(
            model_name='payment',
            name='reference',
            field=models.CharField(max_length=100, unique=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='access_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='authorization_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='transaction_id',
            field=models.BigIntegerField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='domain',
            field=models.CharField(default='live', max_length=20),
        ),
        migrations.AddField(
            model_name='payment',
            name='gateway_response',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='message',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='channel',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='ip_address',
            field=models.GenericIPAddressField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='fees',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='paid_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='cancelled_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='metadata',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='payment',
            name='refund_reference',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='refund_amount',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='refund_reason',
            field=models.TextField(blank=True),
        ),
        
        # Create PaymentWebhook model
        migrations.CreateModel(
            name='PaymentWebhook',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('event', models.CharField(choices=[
                    ('charge.success', 'Charge Success'),
                    ('charge.failed', 'Charge Failed'),
                    ('transfer.success', 'Transfer Success'),
                    ('transfer.failed', 'Transfer Failed'),
                    ('transfer.reversed', 'Transfer Reversed'),
                    ('refund.processed', 'Refund Processed'),
                    ('refund.failed', 'Refund Failed'),
                    ('subscription.create', 'Subscription Created'),
                    ('subscription.disable', 'Subscription Disabled'),
                    ('invoice.create', 'Invoice Created'),
                    ('invoice.payment_failed', 'Invoice Payment Failed'),
                ], max_length=50)),
                ('reference', models.CharField(max_length=100)),
                ('payload', models.JSONField()),
                ('processed', models.BooleanField(default=False)),
                ('processed_at', models.DateTimeField(blank=True, null=True)),
                ('error_message', models.TextField(blank=True)),
            ],
            options={
                'db_table': 'payment_webhook',
                'managed': True,
                'ordering': ['-created_at'],
            },
        ),
        
        # Create TransferRecipient model
        migrations.CreateModel(
            name='TransferRecipient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('recipient_code', models.CharField(max_length=100, unique=True)),
                ('type', models.CharField(choices=[
                    ('nuban', 'Nigerian Bank Account'),
                    ('mobile_money', 'Mobile Money'),
                    ('basa', 'South African Bank Account'),
                    ('authorization', 'Authorization'),
                ], default='nuban', max_length=20)),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('account_number', models.CharField(blank=True, max_length=20, null=True)),
                ('bank_code', models.CharField(blank=True, max_length=10, null=True)),
                ('bank_name', models.CharField(blank=True, max_length=100, null=True)),
                ('currency', models.CharField(default='NGN', max_length=3)),
                ('is_active', models.BooleanField(default=True)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transfer_recipients', to='User.user')),
            ],
            options={
                'db_table': 'transfer_recipient',
                'managed': True,
                'ordering': ['-created_at'],
            },
        ),
        
        # Create Transfer model
        migrations.CreateModel(
            name='Transfer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('reference', models.CharField(max_length=100, unique=True)),
                ('transfer_code', models.CharField(max_length=100, null=True, unique=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('currency', models.CharField(default='NGN', max_length=3)),
                ('status', models.CharField(choices=[
                    ('pending', 'Pending'),
                    ('success', 'Success'),
                    ('failed', 'Failed'),
                    ('reversed', 'Reversed'),
                ], default='pending', max_length=20)),
                ('reason', models.CharField(max_length=255)),
                ('paystack_id', models.BigIntegerField(blank=True, null=True)),
                ('fees', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('transferred_at', models.DateTimeField(blank=True, null=True)),
                ('failed_at', models.DateTimeField(blank=True, null=True)),
                ('reversed_at', models.DateTimeField(blank=True, null=True)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transfers', to='Payment.transferrecipient')),
            ],
            options={
                'db_table': 'transfer',
                'managed': True,
                'ordering': ['-created_at'],
            },
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='payment',
            index=models.Index(fields=['reference'], name='payment_ref_idx'),
        ),
        migrations.AddIndex(
            model_name='payment',
            index=models.Index(fields=['status'], name='payment_status_idx'),
        ),
        migrations.AddIndex(
            model_name='paymentwebhook',
            index=models.Index(fields=['event', 'processed'], name='webhook_event_proc_idx'),
        ),
        migrations.AddIndex(
            model_name='paymentwebhook',
            index=models.Index(fields=['reference'], name='webhook_ref_idx'),
        ),
        migrations.AddIndex(
            model_name='transfer',
            index=models.Index(fields=['reference'], name='transfer_ref_idx'),
        ),
        migrations.AddIndex(
            model_name='transfer',
            index=models.Index(fields=['status'], name='transfer_status_idx'),
        ),
    ]