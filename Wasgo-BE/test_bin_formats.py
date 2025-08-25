#!/usr/bin/env python3
"""
Test script to demonstrate both GeoJSON and regular JSON formats for bin lists
"""

import requests
import json

BASE_URL = "http://localhost:8000/wasgo/api/v1/waste/bins"

def test_bin_formats():
    """Test both GeoJSON and regular JSON formats"""
    
    print("Testing Bin List Formats")
    print("=" * 50)
    
    # Test 1: Default GeoJSON format
    print("\n1. Testing GeoJSON format (default):")
    print("-" * 30)
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Type: {data.get('type', 'N/A')}")
            print(f"Features count: {len(data.get('features', []))}")
            if data.get('features'):
                first_bin = data['features'][0]
                print(f"First bin structure: {list(first_bin.keys())}")
                print(f"Properties: {list(first_bin.get('properties', {}).keys())}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Regular JSON format
    print("\n2. Testing Regular JSON format:")
    print("-" * 30)
    try:
        response = requests.get(f"{BASE_URL}/?format=json", timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Data type: {type(data)}")
            print(f"Items count: {len(data) if isinstance(data, list) else 'N/A'}")
            if isinstance(data, list) and data:
                first_bin = data[0]
                print(f"First bin structure: {list(first_bin.keys())}")
                print(f"Sample data: {json.dumps(first_bin, indent=2)[:300]}...")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Compare both formats
    print("\n3. Format Comparison:")
    print("-" * 30)
    print("GeoJSON format:")
    print("  - Includes 'type': 'FeatureCollection'")
    print("  - Each bin is a 'Feature' with 'geometry' and 'properties'")
    print("  - Good for mapping applications")
    print("  - More complex structure")
    print()
    print("Regular JSON format:")
    print("  - Simple array of objects")
    print("  - Direct access to bin properties")
    print("  - Easier to work with in most applications")
    print("  - Latitude/longitude as separate fields")

if __name__ == "__main__":
    test_bin_formats()
