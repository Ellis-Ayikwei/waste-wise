#!/usr/bin/env python3
"""
Test script to verify that the missing routes are now accessible
"""

import requests
import json

BASE_URL = "http://localhost:8000/wasgo/api/v1"


def test_route(url, method="GET", data=None):
    """Test a route and return the response"""
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5)
        else:
            return {"error": f"Unsupported method: {method}"}

        return {
            "url": url,
            "method": method,
            "status_code": response.status_code,
            "success": response.status_code < 400,
            "response": response.text[:200] if response.text else "No response body",
        }
    except requests.exceptions.ConnectionError:
        return {
            "url": url,
            "method": method,
            "status_code": None,
            "success": False,
            "response": "Connection error - server may not be running",
        }
    except Exception as e:
        return {
            "url": url,
            "method": method,
            "status_code": None,
            "success": False,
            "response": f"Error: {str(e)}",
        }


def main():
    """Test all the missing routes"""
    print("Testing previously missing routes...")
    print("=" * 50)

    # Routes that were causing 404 errors
    routes_to_test = [
        f"{BASE_URL}/permissions/by_content_type/",
        f"{BASE_URL}/user-groups/users_with_groups/",
        f"{BASE_URL}/groups/",
        f"{BASE_URL}/providers/activities/",
        f"{BASE_URL}/waste/analytics/dashboard_metrics/",
    ]

    results = []
    for route in routes_to_test:
        result = test_route(route)
        results.append(result)
        print(f"Testing: {route}")
        print(f"Status: {result['status_code']}")
        print(f"Success: {result['success']}")
        print(f"Response: {result['response']}")
        print("-" * 30)

    # Summary
    print("\nSUMMARY:")
    print("=" * 50)
    successful = sum(1 for r in results if r["success"])
    total = len(results)
    print(f"Successful routes: {successful}/{total}")

    if successful == total:
        print("✅ All routes are now accessible!")
    else:
        print("❌ Some routes are still missing:")
        for result in results:
            if not result["success"]:
                print(f"  - {result['url']}")


if __name__ == "__main__":
    main()
