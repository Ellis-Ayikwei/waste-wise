#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.ServiceRequest.models import ServiceRequest
from apps.Provider.models import ServiceProvider
from apps.User.models import User
from django.utils import timezone

def test_offer_to_provider():
    """Test the offer_to_provider functionality"""
    print("Testing offer_to_provider functionality...")
    
    try:
        # Get or create test data
        user = User.objects.filter(user_type='customer').first()
        if not user:
            print("No customer user found, creating one...")
            user = User.objects.create(
                email='testcustomer@example.com',
                first_name='Test',
                last_name='Customer',
                user_type='customer'
            )
        
        provider = ServiceProvider.objects.first()
        if not provider:
            print("No provider found, creating one...")
            provider_user = User.objects.create(
                email='testprovider@example.com',
                first_name='Test',
                last_name='Provider',
                user_type='provider'
            )
            provider = ServiceProvider.objects.create(
                user=provider_user,
                business_name='Test Provider Service'
            )
        
        # Create a service request
        service_request = ServiceRequest.objects.create(
            user=user,
            service_type='waste_collection',
            waste_type='general',
            pickup_address='123 Test Street, Accra',
            estimated_volume_m3=2.0,
            status='pending'
        )
        
        print(f"Created service request: {service_request.id}")
        print(f"Initial status: {service_request.status}")
        print(f"Offered providers count: {service_request.offered_providers.count()}")
        
        # Test offering to provider
        offered_price = Decimal('60.00')
        expires_at = timezone.now() + timedelta(hours=24)
        
        # Add provider to offered_providers
        service_request.offered_providers.add(provider)
        service_request.status = "offered"
        service_request.offered_price = offered_price
        service_request.offer_expires_at = expires_at
        service_request.save()
        
        print(f"After offering:")
        print(f"Status: {service_request.status}")
        print(f"Offered providers count: {service_request.offered_providers.count()}")
        print(f"Offered price: {service_request.offered_price}")
        print(f"Expires at: {service_request.offer_expires_at}")
        
        # Test provider accepting the offer
        if provider.accept_service_request(service_request):
            print("Provider successfully accepted the offer!")
            print(f"Final status: {service_request.status}")
            print(f"Assigned provider: {service_request.assigned_provider}")
            print(f"Final price: {service_request.final_price}")
        else:
            print("Provider failed to accept the offer")
        
        print("Test completed successfully!")
        
    except Exception as e:
        print(f"Error during test: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_offer_to_provider()
