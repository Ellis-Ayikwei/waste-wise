#!/usr/bin/env python3
"""
Script to identify old management commands that can be cleaned up
since we now have the consolidated setup_complete_waste_system.py command.
"""

import os

# List of old commands that can be deleted
OLD_COMMANDS = [
    "apps/WasteBin/management/commands/populate_wastebins.py",
    "apps/WasteBin/management/commands/test_bin_creation.py",
    "apps/WasteBin/management/commands/test_bin_id_generation.py",
    "apps/WasteBin/management/commands/test_enhanced_sensors.py",
    "apps/WasteBin/management/commands/test_sensor_bin_relationship.py",
    "apps/WasteBin/management/commands/insert_sample_sensor_readings.py",
    "apps/WasteBin/management/commands/assign_sensors_to_readings.py",
    "apps/WasteBin/management/commands/show_sensor_readings.py",
    "apps/WasteBin/management/commands/update_bin_online_status.py",
]

# Commands to keep (still useful for specific tasks)
KEEP_COMMANDS = [
    "apps/WasteBin/management/commands/setup_complete_waste_system.py",  # Our new consolidated command
]


def check_files():
    """Check which files exist and can be cleaned up"""
    existing_old = []
    missing_old = []

    for file_path in OLD_COMMANDS:
        if os.path.exists(file_path):
            existing_old.append(file_path)
        else:
            missing_old.append(file_path)

    print("🗑️ OLD COMMANDS THAT CAN BE DELETED:")
    print("=" * 50)
    for file_path in existing_old:
        print(f"  ✅ {file_path}")

    if missing_old:
        print(f"\n❌ MISSING FILES (already deleted):")
        for file_path in missing_old:
            print(f"  ❌ {file_path}")

    print(f"\n📊 SUMMARY:")
    print(f"  Total old commands: {len(OLD_COMMANDS)}")
    print(f"  Existing (can delete): {len(existing_old)}")
    print(f"  Missing (already deleted): {len(missing_old)}")

    print(f"\n💡 NEW CONSOLIDATED COMMAND:")
    print(f"  🎯 setup_complete_waste_system.py")
    print(
        f"  Usage: python manage.py setup_complete_waste_system --bins 20 --sensors 15 --readings 100 --users 5"
    )


if __name__ == "__main__":
    check_files()
