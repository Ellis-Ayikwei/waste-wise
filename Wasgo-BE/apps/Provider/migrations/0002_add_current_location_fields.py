# Generated migration for adding current location fields to ServiceProvider

from django.db import migrations, models
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ("Provider", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="serviceprovider",
            name="current_location",
            field=django.contrib.gis.db.models.fields.PointField(
                srid=4326,
                null=True,
                blank=True,
                help_text="Provider's current real-time location",
            ),
        ),
        migrations.AddField(
            model_name="serviceprovider",
            name="last_location_update",
            field=models.DateTimeField(
                null=True,
                blank=True,
                help_text="Last time the provider's location was updated",
            ),
        ),
        migrations.AddField(
            model_name="serviceprovider",
            name="location_accuracy",
            field=models.FloatField(
                null=True, blank=True, help_text="Accuracy of the location in meters"
            ),
        ),
    ]
