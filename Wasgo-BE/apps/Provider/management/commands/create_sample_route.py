from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from django.utils import timezone
from datetime import time, timedelta
from apps.Provider.models import ServiceProvider, PickupRoute
from apps.ServiceRequest.models import ServiceRequest
from apps.User.models import User


class Command(BaseCommand):
    help = 'Create a sample pickup route with multiple service requests'

    def add_arguments(self, parser):
        parser.add_argument(
            '--provider_id',
            type=str,
            help='ID of the service provider to create route for'
        )

    def handle(self, *args, **options):
        try:
            # Get or create a provider
            if options['provider_id']:
                provider = ServiceProvider.objects.get(id=options['provider_id'])
            else:
                # Get the first available provider
                provider = ServiceProvider.objects.first()
                if not provider:
                    self.stdout.write(
                        self.style.ERROR('No service providers found. Please create one first.')
                    )
                    return

            # Create a sample route
            route = PickupRoute.objects.create(
                provider=provider,
                route_name="Daily Collection Route - Accra Central",
                route_description="Morning waste collection route covering Accra Central area",
                route_type="daily",
                route_status="planned",
                start_location=Point(-0.186964, 5.603717),  # Accra coordinates
                end_location=Point(-0.186964, 5.603717),
                scheduled_date=timezone.now().date() + timedelta(days=1),
                scheduled_start_time=time(8, 0),  # 8:00 AM
                scheduled_end_time=time(14, 0),   # 2:00 PM
                vehicle_type="truck",
                priority="normal",
                route_instructions="Start from central depot, collect from commercial areas first"
            )

            self.stdout.write(
                self.style.SUCCESS(f'Created route: {route.route_name}')
            )

            # Get some sample service requests to add to the route
            service_requests = ServiceRequest.objects.filter(
                status__in=['pending', 'assigned'],
                assigned_provider=provider
            )[:5]  # Limit to 5 requests

            if not service_requests.exists():
                self.stdout.write(
                    self.style.WARNING('No pending service requests found for this provider.')
                )
                return

            # Add service requests to the route
            for i, request in enumerate(service_requests, 1):
                try:
                    route.add_service_request(request, stop_order=i)
                    self.stdout.write(
                        f'Added service request {request.id} as stop {i}'
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error adding request {request.id}: {str(e)}')
                    )

            # Get route summary
            summary = route.get_route_summary()
            self.stdout.write(
                self.style.SUCCESS(f'\nRoute Summary:')
            )
            self.stdout.write(f'Total stops: {summary["total_stops"]}')
            self.stdout.write(f'Pending requests: {summary["pending_requests"]}')
            self.stdout.write(f'Next stop: {summary["next_stop"]["pickup_address"] if summary["next_stop"] else "None"}')

            self.stdout.write(
                self.style.SUCCESS(f'\nRoute created successfully with {summary["total_stops"]} stops!')
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating route: {str(e)}')
            )
