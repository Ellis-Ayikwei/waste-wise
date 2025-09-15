"""
Management command to process expired offers and create new ones
"""

from django.core.management.base import BaseCommand
from apps.ServiceRequest.offer_service import offer_service
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Process expired offers and create new ones for pending service requests"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be done without actually doing it",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN: No changes will be made"))

        try:
            if not dry_run:
                offer_service.process_expired_offers()
                self.stdout.write(
                    self.style.SUCCESS("Successfully processed expired offers")
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS("Dry run completed - no changes made")
                )

        except Exception as e:
            logger.error(f"Error processing offers: {str(e)}")
            self.stdout.write(self.style.ERROR(f"Error processing offers: {str(e)}"))

