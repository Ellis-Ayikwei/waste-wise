#!/usr/bin/env python3
"""
Script to demonstrate inserting sensor readings via API
"""

import requests
import json
from datetime import datetime, timedelta
import random

# Configuration
BASE_URL = "http://localhost:8000/wasgo/api/v1"
API_ENDPOINT = f"{BASE_URL}/waste/sensor-data/"


def insert_sensor_reading_via_api(bin_id, sensor_data):
    """Insert a sensor reading via API"""

    # Prepare the data
    payload = {
        "bin": bin_id,
        "fill_level": sensor_data["fill_level"],
        "weight_kg": sensor_data["weight_kg"],
        "temperature": sensor_data["temperature"],
        "humidity": sensor_data["humidity"],
        "battery_level": sensor_data["battery_level"],
        "signal_strength": sensor_data["signal_strength"],
        "motion_detected": sensor_data["motion_detected"],
        "lid_open": sensor_data["lid_open"],
        "error_code": sensor_data["error_code"],
        "raw_data": sensor_data["raw_data"],
    }

    try:
        response = requests.post(API_ENDPOINT, json=payload)

        if response.status_code == 201:
            print(f"✅ Successfully inserted reading for bin {bin_id}")
            return response.json()
        else:
            print(
                f"❌ Failed to insert reading for bin {bin_id}: {response.status_code}"
            )
            print(f"Response: {response.text}")
            return None

    except Exception as e:
        print(f"❌ Error inserting reading for bin {bin_id}: {e}")
        return None


def generate_realistic_sensor_data():
    """Generate realistic sensor data"""

    fill_level = random.randint(0, 100)
    weight_kg = random.uniform(0.5, 25.0) if fill_level > 0 else 0.0
    temperature = random.uniform(15.0, 35.0)  # Celsius
    humidity = random.uniform(30.0, 80.0)  # Percentage
    battery_level = random.randint(20, 100)
    signal_strength = random.randint(30, 100)
    motion_detected = random.choice([True, False])
    lid_open = random.choice([True, False])

    return {
        "fill_level": fill_level,
        "weight_kg": round(weight_kg, 2),
        "temperature": round(temperature, 1),
        "humidity": round(humidity, 1),
        "battery_level": battery_level,
        "signal_strength": signal_strength,
        "motion_detected": motion_detected,
        "lid_open": lid_open,
        "error_code": "" if random.random() > 0.05 else "SENSOR_ERROR",
        "raw_data": {
            "timestamp": datetime.now().isoformat(),
            "source": "api_script",
            "version": "1.0",
        },
    }


def get_available_bins():
    """Get list of available bins"""
    try:
        response = requests.get(f"{BASE_URL}/waste/bins/?format=json")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Failed to get bins: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error getting bins: {e}")
        return []


def main():
    """Main function to demonstrate API usage"""

    print("🔍 Getting available bins...")
    bins = get_available_bins()

    if not bins:
        print("❌ No bins found. Please create some bins first.")
        return

    print(f"📦 Found {len(bins)} bins")

    # Show available bins
    print("\nAvailable bins:")
    for bin in bins[:5]:  # Show first 5 bins
        print(
            f"  - {bin['bin_id']}: {bin['name']} (Fill: {bin.get('fill_level', 'N/A')}%)"
        )

    # Insert sample readings
    print(f"\n📊 Inserting sample sensor readings...")

    successful_inserts = 0
    total_attempts = 5

    for i in range(total_attempts):
        # Pick a random bin
        bin = random.choice(bins)
        bin_id = bin["id"]

        # Generate sensor data
        sensor_data = generate_realistic_sensor_data()

        print(f"\n📡 Inserting reading {i+1}/{total_attempts} for bin {bin['bin_id']}:")
        print(f"   Fill Level: {sensor_data['fill_level']}%")
        print(f"   Weight: {sensor_data['weight_kg']}kg")
        print(f"   Temperature: {sensor_data['temperature']}°C")
        print(f"   Battery: {sensor_data['battery_level']}%")
        print(f"   Signal: {sensor_data['signal_strength']}%")

        # Insert via API
        result = insert_sensor_reading_via_api(bin_id, sensor_data)

        if result:
            successful_inserts += 1

    # Summary
    print(f"\n📈 Summary:")
    print(f"   Successful inserts: {successful_inserts}/{total_attempts}")
    print(f"   Success rate: {(successful_inserts/total_attempts)*100:.1f}%")

    if successful_inserts > 0:
        print(f"\n✅ Successfully inserted {successful_inserts} sensor readings!")
        print(f"   You can now view the readings via:")
        print(f"   GET {BASE_URL}/waste/sensor-data/")
    else:
        print(f"\n❌ No readings were inserted. Check the error messages above.")


if __name__ == "__main__":
    main()
