#!/usr/bin/env python3
"""
Check if sensor and bin records exist in database
"""
import os
import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
django.setup()

from apps.WasteBin.models import SmartBin, Sensor


def check_records():
    print("Checking database records...")

    # Check sensors
    print("\n=== SENSORS ===")
    sensors = Sensor.objects.all()
    print(f"Total sensors: {sensors.count()}")
    for sensor in sensors:
        print(f"  - ID: {sensor.id}, Name: {sensor.name}")

    # Check bins
    print("\n=== BINS ===")
    bins = SmartBin.objects.all()
    print(f"Total bins: {bins.count()}")
    for bin_obj in bins:
        print(
            f"  - ID: {bin_obj.id}, Number: {bin_obj.bin_number}, Name: {bin_obj.name}"
        )

    # Check specific IDs from ESP32
    print("\n=== ESP32 IDs ===")
    sensor_id = "sensor_001"
    bin_id = "bin_001"

    try:
        sensor = Sensor.objects.get(id=sensor_id)
        print(f"✅ Sensor {sensor_id} found: {sensor.name}")
    except Sensor.DoesNotExist:
        print(f"❌ Sensor {sensor_id} NOT found")

    try:
        bin_obj = SmartBin.objects.get(id=bin_id)
        print(f"✅ Bin {bin_id} found: {bin_obj.name}")
    except SmartBin.DoesNotExist:
        print(f"❌ Bin {bin_id} NOT found")

    # Check by bin_number instead
    try:
        bin_obj = SmartBin.objects.get(bin_number=bin_id)
        print(
            f"✅ Bin with bin_number {bin_id} found: {bin_obj.name} (ID: {bin_obj.id})"
        )
    except SmartBin.DoesNotExist:
        print(f"❌ Bin with bin_number {bin_id} NOT found")


if __name__ == "__main__":
    check_records()
