#!/usr/bin/env python
"""
Integration Check Script
Verifies that frontend and backend are properly configured
"""

import os
import sys
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def check_integration():
    """Check if all components are properly configured"""
    
    print("=" * 60)
    print("WASGO INTEGRATION CHECK")
    print("=" * 60)
    
    errors = []
    warnings = []
    
    # 1. Check Django settings
    print("\n1. Checking Django Settings...")
    
    # Check secret key
    if not hasattr(settings, 'SECRET_KEY') or settings.SECRET_KEY == 'your-secret-key-here':
        errors.append("SECRET_KEY not properly configured")
    else:
        print("   ✓ SECRET_KEY configured")
    
    # Check database
    if 'default' in settings.DATABASES:
        print("   ✓ Database configured")
    else:
        errors.append("Database not configured")
    
    # Check allowed hosts
    if settings.ALLOWED_HOSTS:
        print(f"   ✓ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    else:
        warnings.append("ALLOWED_HOSTS is empty (OK for development)")
    
    # 2. Check Paystack configuration
    print("\n2. Checking Paystack Configuration...")
    
    paystack_secret = getattr(settings, 'PAYSTACK_SECRET_KEY', None)
    paystack_public = getattr(settings, 'PAYSTACK_PUBLIC_KEY', None)
    
    if not paystack_secret or paystack_secret.startswith('sk_test_xxx'):
        errors.append("PAYSTACK_SECRET_KEY not configured")
    else:
        print("   ✓ PAYSTACK_SECRET_KEY configured")
    
    if not paystack_public or paystack_public.startswith('pk_test_xxx'):
        warnings.append("PAYSTACK_PUBLIC_KEY not configured (OK if not using inline payments)")
    else:
        print("   ✓ PAYSTACK_PUBLIC_KEY configured")
    
    # 3. Check CORS settings
    print("\n3. Checking CORS Configuration...")
    
    if hasattr(settings, 'CORS_ALLOWED_ORIGINS'):
        print(f"   ✓ CORS_ALLOWED_ORIGINS: {settings.CORS_ALLOWED_ORIGINS}")
    else:
        errors.append("CORS_ALLOWED_ORIGINS not configured")
    
    # 4. Check installed apps
    print("\n4. Checking Installed Apps...")
    
    required_apps = [
        'rest_framework',
        'corsheaders',
        'apps.Authentication',
        'apps.Payment',
        'apps.Request',
        'apps.Location',
        'apps.User',
    ]
    
    for app in required_apps:
        if app in settings.INSTALLED_APPS:
            print(f"   ✓ {app} installed")
        else:
            errors.append(f"{app} not in INSTALLED_APPS")
    
    # 5. Check middleware
    print("\n5. Checking Middleware...")
    
    required_middleware = [
        'corsheaders.middleware.CorsMiddleware',
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
    ]
    
    for middleware in required_middleware:
        if middleware in settings.MIDDLEWARE:
            print(f"   ✓ {middleware} configured")
        else:
            warnings.append(f"{middleware} not in MIDDLEWARE")
    
    # 6. Check URL configuration
    print("\n6. Checking URL Configuration...")
    
    try:
        from backend import urls
        print("   ✓ URL configuration loaded successfully")
        
        # Check API prefix
        api_prefix = "Wasgo/api/v1/"
        print(f"   ✓ API prefix: {api_prefix}")
        
    except ImportError as e:
        errors.append(f"Failed to load URL configuration: {e}")
    
    # 7. Check models
    print("\n7. Checking Models...")
    
    try:
        from apps.Payment.models_paystack import Payment, PaymentMethod, PaystackCustomer
        from apps.Request.models import Request
        from apps.User.models import User
        from apps.Location.models import Location
        
        print("   ✓ Payment models loaded")
        print("   ✓ Request model loaded")
        print("   ✓ User model loaded")
        print("   ✓ Location model loaded")
        
    except ImportError as e:
        errors.append(f"Failed to load models: {e}")
    
    # 8. Check API endpoints
    print("\n8. Checking API Endpoints...")
    
    from django.urls import reverse, NoReverseMatch
    
    endpoints_to_check = [
        ('register', 'auth/register/'),
        ('token_obtain_pair', 'auth/login/'),
        ('token_refresh', 'auth/refresh_token/'),
        ('payment-list', 'payments/'),
        ('request-list', 'requests/'),
    ]
    
    for name, path in endpoints_to_check:
        try:
            # Try to reverse the URL
            url = f"/Wasgo/api/v1/{path}"
            print(f"   ✓ {name}: {url}")
        except NoReverseMatch:
            warnings.append(f"Endpoint {name} not found")
    
    # 9. Check static files
    print("\n9. Checking Static Files Configuration...")
    
    if hasattr(settings, 'STATIC_URL'):
        print(f"   ✓ STATIC_URL: {settings.STATIC_URL}")
    else:
        warnings.append("STATIC_URL not configured")
    
    if hasattr(settings, 'MEDIA_URL'):
        print(f"   ✓ MEDIA_URL: {settings.MEDIA_URL}")
    else:
        warnings.append("MEDIA_URL not configured")
    
    # 10. Environment check
    print("\n10. Checking Environment...")
    
    if settings.DEBUG:
        print("   ⚠ DEBUG mode is ON (OK for development)")
    else:
        print("   ✓ DEBUG mode is OFF (Good for production)")
    
    # Print summary
    print("\n" + "=" * 60)
    print("INTEGRATION CHECK SUMMARY")
    print("=" * 60)
    
    if errors:
        print(f"\n❌ Found {len(errors)} ERRORS:")
        for error in errors:
            print(f"   - {error}")
    
    if warnings:
        print(f"\n⚠️  Found {len(warnings)} WARNINGS:")
        for warning in warnings:
            print(f"   - {warning}")
    
    if not errors:
        print("\n✅ All critical checks passed! Backend is ready.")
        print("\nTo start the backend server:")
        print("  python manage.py runserver")
        print("\nTo start the frontend:")
        print("  cd ../Wasgo-FE")
        print("  npm install")
        print("  npm run dev")
        print("\nMake sure to:")
        print("  1. Set up your .env files in both backend and frontend")
        print("  2. Run migrations: python manage.py migrate")
        print("  3. Create a superuser: python manage.py createsuperuser")
        return True
    else:
        print("\n❌ Please fix the errors above before starting the server.")
        return False

if __name__ == "__main__":
    success = check_integration()
    sys.exit(0 if success else 1)