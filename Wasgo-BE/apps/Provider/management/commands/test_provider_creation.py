from django.core.management.base import BaseCommand
from apps.Provider.models import ServiceProvider
from apps.User.models import User
from django.contrib.gis.geos import Point


class Command(BaseCommand):
    help = 'Test ServiceProvider creation with minimal data'

    def handle(self, *args, **options):
        self.stdout.write("Testing ServiceProvider creation...")
        
        # Get the provider user
        try:
            user = User.objects.filter(user_type='provider').first()
            if not user:
                self.stdout.write(self.style.ERROR("No provider user found"))
                return
                
            self.stdout.write(f"Found user: {user.email}")
            
            # Test with minimal data
            test_data = {
                "business_type": "sole_trader",
                "business_name": "Test Service",
                "verification_status": "unverified",
                "base_location": Point(-0.1276, 51.5074, srid=4326),
                "phone": "1234567890",  # Short phone number
                "email": user.email,
                "address_line1": "Test Address",
                "city": "Test City",
                "county": "Test County",
                "postcode": "TEST123",  # Short postcode
            }
            
            self.stdout.write("Attempting to create ServiceProvider...")
            provider = ServiceProvider.objects.create(user=user, **test_data)
            self.stdout.write(self.style.SUCCESS(f"Successfully created provider: {provider.id}"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
            import traceback
            self.stdout.write(traceback.format_exc())
