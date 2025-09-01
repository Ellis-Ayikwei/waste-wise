#!/usr/bin/env python
"""
Simple test script to verify route integration with service requests
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.Provider.models import PickupRoute, RouteStop, ServiceProvider
from apps.ServiceRequest.models import ServiceRequest
from apps.User.models import User
from django.contrib.gis.geos import Point
from django.utils import timezone

def test_route_integration():
    """Test the integration between routes and service requests"""
    print("Testing Route Integration with Service Requests...")
    
    try:
        # Get a test provider
        provider = ServiceProvider.objects.first()
        if not provider:
            print("No service provider found. Please create one first.")
            return
        
        print(f"Using provider: {provider.business_name}")
        
        # Get a test service request
        service_request = ServiceRequest.objects.filter(status='pending').first()
        if not service_request:
            print("No pending service request found. Please create one first.")
            return
        
        print(f"Using service request: {service_request.id} - {service_request.title}")
        
        # Create a test route
        route = PickupRoute.objects.create(
            provider=provider,
            route_name="Test Integration Route",
            route_description="Testing route-service request integration",
            start_location=Point(0, 0, srid=4326),
            end_location=Point(0, 0, srid=4326),
            scheduled_date=timezone.now().date(),
            scheduled_start_time=timezone.now().time(),
            scheduled_end_time=timezone.now().time(),
            vehicle_type="truck"
        )
        
        print(f"Created test route: {route.id}")
        
        # Add service request to route
        route.add_service_request(service_request)
        print(f"Added service request {service_request.id} to route {route.id}")
        
        # Check route stops
        stops = route.stops.all()
        print(f"Route has {stops.count()} stops")
        
        for stop in stops:
            print(f"  Stop {stop.stop_order}: {stop.service_request.title} - Status: {stop.status}")
        
        # Complete a stop
        if stops.exists():
            stop = stops.first()
            print(f"\nCompleting stop {stop.id}...")
            
            # Update stop data
            stop.waste_collected_kg = 25.5
            stop.revenue_generated = 50.00
            stop.complete_stop()
            
            print(f"Stop completed. New status: {stop.status}")
            print(f"Service request status: {stop.service_request.status}")
            print(f"Service request actual weight: {stop.service_request.actual_weight_kg}")
            print(f"Service request completed at: {stop.service_request.completed_at}")
        
        # Check route metrics
        route.calculate_route_metrics()
        print(f"\nRoute metrics:")
        print(f"  Total stops: {route.total_stops}")
        print(f"  Completed stops: {route.completed_stops}")
        print(f"  Completion percentage: {route.completion_percentage}%")
        print(f"  Total waste collected: {route.total_waste_collected} kg")
        print(f"  Total revenue: {route.total_revenue}")
        
        print("\n✅ Route integration test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during test: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_route_integration()
