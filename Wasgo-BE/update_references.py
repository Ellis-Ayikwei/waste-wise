#!/usr/bin/env python3
"""
Script to update all references from ServiceRequest/ServiceRequest to ServiceRequest throughout the codebase.
This script will help migrate the codebase to use the new unified ServiceRequest model.
"""

import os
import re
import shutil
from pathlib import Path


def update_file_content(file_path, content):
    """Update file content with replacements"""
    replacements = [
        # Import statements
        (
            r"from apps\.ServiceRequest\.models import ServiceRequest",
            "from apps.ServiceRequest.models import ServiceRequest",
        ),
        (
            r"from apps\.ServiceRequest\.models import ServiceRequest",
            "from apps.ServiceRequest.models import ServiceRequest",
        ),
        (
            r"from apps\.ServiceRequest\.serializer import ServiceRequestSerializer",
            "from apps.ServiceRequest.serializers import ServiceRequestSerializer",
        ),
        (
            r"from apps\.ServiceRequest\.serializers import ServiceRequestSerializer",
            "from apps.ServiceRequest.serializers import ServiceRequestSerializer",
        ),
        (
            r"from apps\.ServiceRequest\.views import ServiceRequestViewSet",
            "from apps.ServiceRequest.views import ServiceRequestViewSet",
        ),
        (
            r"from apps\.ServiceRequest\.views import ServiceRequestViewSet",
            "from apps.ServiceRequest.views import ServiceRequestViewSet",
        ),
        # Model references
        (r"\bRequest\b", "ServiceRequest"),
        (r"\bJob\b", "ServiceRequest"),
        # Serializer references
        (r"\bRequestSerializer\b", "ServiceRequestSerializer"),
        (r"\bJobSerializer\b", "ServiceRequestSerializer"),
        # ViewSet references
        (r"\bRequestViewSet\b", "ServiceRequestViewSet"),
        (r"\bJobViewSet\b", "ServiceRequestViewSet"),
        # Field mappings
        (r"\brequest_type\b", "service_type"),
        (r"\bjob_type\b", "service_type"),
        (r"\bjob_number\b", "request_id"),
        # URL patterns
        (r"service-requests/", "service-service-requests/"),
        (r"service-requests/", "service-service-requests/"),
    ]

    for old_pattern, new_pattern in replacements:
        content = re.sub(old_pattern, new_pattern, content)

    return content


def process_directory(directory_path):
    """Process all Python files in a directory"""
    python_files = []

    for root, dirs, files in os.walk(directory_path):
        # Skip certain directories
        dirs[:] = [
            d
            for d in dirs
            if d not in [".git", "__pycache__", "migrations", "venv", "env"]
        ]

        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                python_files.append(file_path)

    updated_files = []

    for file_path in python_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            original_content = content
            updated_content = update_file_content(file_path, content)

            if updated_content != original_content:
                # Backup original file
                backup_path = file_path + ".backup"
                shutil.copy2(file_path, backup_path)

                # Write updated content
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(updated_content)

                updated_files.append(file_path)
                print(f"Updated: {file_path}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    return updated_files


def main():
    """Main function to update all references"""
    print(
        "Starting codebase update from ServiceRequest/ServiceRequest to ServiceRequest..."
    )

    # Get the project root directory
    project_root = Path(__file__).parent

    # Process the entire project
    updated_files = process_directory(project_root)

    print(f"\nUpdate completed!")
    print(f"Updated {len(updated_files)} files:")
    for file_path in updated_files:
        print(f"  - {file_path}")

    print("\nBackup files have been created with .backup extension")
    print("Please review the changes and test your application")


if __name__ == "__main__":
    main()
