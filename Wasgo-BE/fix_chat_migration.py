#!/usr/bin/env python3
"""
Script to fix the chat_participant table migration issue
"""

import os
import django
import sys

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import connection
from django.core.management import call_command


def check_chat_tables():
    """Check if chat tables exist in the database"""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'chat_%'
        """
        )
        tables = [row[0] for row in cursor.fetchall()]
        return tables


def fix_chat_migration():
    """Fix the chat migration issue"""
    print("🔍 Checking chat tables...")
    existing_tables = check_chat_tables()
    print(f"Existing chat tables: {existing_tables}")

    if "chat_participant" in existing_tables:
        print("✅ chat_participant table exists - no fix needed")
        return True

    print("❌ chat_participant table missing - attempting to create...")

    try:
        # Try to make migrations for Chat app
        print("📝 Making migrations for Chat app...")
        call_command("makemigrations", "Chat", verbosity=1)

        # Try to migrate
        print("🔄 Running migrations...")
        call_command("migrate", "Chat", verbosity=1)

        # Check again
        updated_tables = check_chat_tables()
        print(f"Updated chat tables: {updated_tables}")

        if "chat_participant" in updated_tables:
            print("✅ Successfully created chat_participant table")
            return True
        else:
            print("❌ Failed to create chat_participant table")
            return False

    except Exception as e:
        print(f"❌ Error during migration: {e}")
        return False


def temporary_fix():
    """Temporary fix by modifying the model to avoid cascade delete"""
    print("🔧 Applying temporary fix...")

    try:
        # Import the model
        from apps.Chat.models import ConversationParticipant

        # Temporarily change the on_delete behavior
        original_on_delete = ConversationParticipant._meta.get_field(
            "user"
        ).remote_field.on_delete

        # Change to SET_NULL temporarily
        ConversationParticipant._meta.get_field("user").remote_field.on_delete = (
            models.SET_NULL
        )

        print("✅ Temporarily changed user field to SET_NULL")
        return True

    except Exception as e:
        print(f"❌ Error applying temporary fix: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Fixing chat migration issue...")

    # Try the proper fix first
    if fix_chat_migration():
        print("✅ Chat migration issue resolved!")
    else:
        print("⚠️ Could not fix with migrations, trying temporary fix...")
        if temporary_fix():
            print("✅ Applied temporary fix")
        else:
            print("❌ Could not apply any fix")
            print("\n💡 Manual steps to fix:")
            print("1. Run: python manage.py makemigrations Chat")
            print("2. Run: python manage.py migrate Chat")
            print("3. Or manually create the chat_participant table")
