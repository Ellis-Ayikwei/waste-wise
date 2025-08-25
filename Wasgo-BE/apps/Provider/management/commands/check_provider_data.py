from django.core.management.base import BaseCommand
from apps.Provider.models import ServiceProvider
from apps.User.models import User


class Command(BaseCommand):
    help = "Check existing ServiceProvider records for data issues"

    def handle(self, *args, **options):
        self.stdout.write("Checking existing ServiceProvider records...")

        providers = ServiceProvider.objects.all()
        self.stdout.write(f"Total providers: {providers.count()}")

        for provider in providers:
            self.stdout.write(f"\nProvider {provider.id}:")
            self.stdout.write(
                f"  User: {provider.user.email if provider.user else 'None'}"
            )
            self.stdout.write(
                f"  Phone: '{provider.phone}' (length: {len(provider.phone) if provider.phone else 0})"
            )
            self.stdout.write(
                f"  Business Name: '{provider.business_name}' (length: {len(provider.business_name) if provider.business_name else 0})"
            )
            self.stdout.write(
                f"  Postcode: '{provider.postcode}' (length: {len(provider.postcode) if provider.postcode else 0})"
            )

            # Check for any fields that might be too long
            if provider.phone and len(provider.phone) > 20:
                self.stdout.write(
                    self.style.ERROR(
                        f"  WARNING: Phone number too long ({len(provider.phone)} chars)"
                    )
                )
            if provider.business_name and len(provider.business_name) > 200:
                self.stdout.write(
                    self.style.ERROR(
                        f"  WARNING: Business name too long ({len(provider.business_name)} chars)"
                    )
                )
            if provider.postcode and len(provider.postcode) > 20:
                self.stdout.write(
                    self.style.ERROR(
                        f"  WARNING: Postcode too long ({len(provider.postcode)} chars)"
                    )
                )

        # Check provider users
        self.stdout.write(
            f"\nProvider users: {User.objects.filter(user_type='provider').count()}"
        )
        for user in User.objects.filter(user_type="provider"):
            self.stdout.write(
                f"  User {user.id}: {user.email} - Phone: '{user.phone_number}' (length: {len(user.phone_number) if user.phone_number else 0})"
            )
