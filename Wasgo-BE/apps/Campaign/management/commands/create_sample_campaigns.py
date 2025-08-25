from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.Campaign.models import Campaign


class Command(BaseCommand):
    help = "Create sample recycling campaigns for testing"

    def handle(self, *args, **options):
        self.stdout.write("🌱 Creating sample recycling campaigns...")

        # Clear existing campaigns
        Campaign.objects.all().delete()

        # Create sample campaigns
        campaigns_data = [
            {
                "title": "Zero Waste Challenge",
                "description": "Join our 30-day zero waste challenge and earn bonus rewards. Reduce your waste footprint and track your progress daily.",
                "campaign_type": "challenge",
                "status": "active",
                "target_audience": "customers",
                "progress": 65,
                "target": 100,
                "reward": 500,
                "start_date": timezone.now() - timedelta(days=10),
                "end_date": timezone.now() + timedelta(days=20),
                "is_featured": True,
                "terms_conditions": "Complete daily waste tracking and achieve 80% reduction in waste generation.",
            },
            {
                "title": "Recycling Hero",
                "description": "Recycle 50 items this month to become a recycling hero. Track your recycling efforts and earn recognition.",
                "campaign_type": "achievement",
                "status": "active",
                "target_audience": "customers",
                "progress": 32,
                "target": 50,
                "reward": 200,
                "start_date": timezone.now() - timedelta(days=15),
                "end_date": timezone.now() + timedelta(days=15),
                "is_featured": False,
                "terms_conditions": "Properly sort and recycle items through our collection service.",
            },
            {
                "title": "Green Neighbor",
                "description": "Refer 3 friends and help them start their recycling journey. Spread environmental awareness in your community.",
                "campaign_type": "referral",
                "status": "active",
                "target_audience": "customers",
                "progress": 1,
                "target": 3,
                "reward": 300,
                "start_date": timezone.now() - timedelta(days=5),
                "end_date": timezone.now() + timedelta(days=25),
                "is_featured": True,
                "terms_conditions": "Friends must sign up and complete their first service request.",
            },
            {
                "title": "Plastic-Free July",
                "description": "Go plastic-free for the entire month of July. Track your plastic consumption and find alternatives.",
                "campaign_type": "challenge",
                "status": "active",
                "target_audience": "all",
                "progress": 0,
                "target": 31,
                "reward": 750,
                "start_date": timezone.now() + timedelta(days=5),
                "end_date": timezone.now() + timedelta(days=35),
                "is_featured": True,
                "terms_conditions": "Avoid single-use plastics and document your journey daily.",
            },
            {
                "title": "Compost Master",
                "description": "Start composting at home and divert 100kg of organic waste from landfills.",
                "campaign_type": "achievement",
                "status": "active",
                "target_audience": "customers",
                "progress": 25,
                "target": 100,
                "reward": 400,
                "start_date": timezone.now() - timedelta(days=20),
                "end_date": timezone.now() + timedelta(days=40),
                "is_featured": False,
                "terms_conditions": "Use our composting bins and track weight of composted material.",
            },
            {
                "title": "Eco-Warrior",
                "description": "Complete 10 eco-friendly actions in 30 days. From using reusable bags to switching to LED bulbs.",
                "campaign_type": "challenge",
                "status": "active",
                "target_audience": "all",
                "progress": 6,
                "target": 10,
                "reward": 250,
                "start_date": timezone.now() - timedelta(days=8),
                "end_date": timezone.now() + timedelta(days=22),
                "is_featured": False,
                "terms_conditions": "Document each eco-friendly action with photos or receipts.",
            },
        ]

        created_campaigns = []
        for campaign_data in campaigns_data:
            campaign = Campaign.objects.create(**campaign_data)
            created_campaigns.append(campaign)
            self.stdout.write(
                self.style.SUCCESS(f"✅ Created campaign: {campaign.title}")
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"🎉 Successfully created {len(created_campaigns)} recycling campaigns!"
            )
        )

        # Show summary
        active_campaigns = Campaign.objects.filter(status="active").count()
        featured_campaigns = Campaign.objects.filter(is_featured=True).count()

        self.stdout.write(f"📊 Summary:")
        self.stdout.write(f"   - Total campaigns: {len(created_campaigns)}")
        self.stdout.write(f"   - Active campaigns: {active_campaigns}")
        self.stdout.write(f"   - Featured campaigns: {featured_campaigns}")

        self.stdout.write(
            self.style.SUCCESS(
                "🚀 Sample campaigns are ready! Test the /campaigns/active/ endpoint."
            )
        )
