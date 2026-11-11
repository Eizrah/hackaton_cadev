# Generated manually to fix ID type conversion

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Accounts', '0007_notif_commentaire_id_notif_offre_id_notif_post_id'),
    ]

    operations = [
        # Supprimer les anciennes colonnes integer
        migrations.RemoveField(
            model_name='notif',
            name='post_id',
        ),
        migrations.RemoveField(
            model_name='notif',
            name='commentaire_id',
        ),
        migrations.RemoveField(
            model_name='notif',
            name='offre_id',
        ),
        # Recréer les colonnes avec le bon type UUID
        migrations.AddField(
            model_name='notif',
            name='post_id',
            field=models.UUIDField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='notif',
            name='commentaire_id',
            field=models.UUIDField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='notif',
            name='offre_id',
            field=models.UUIDField(blank=True, null=True),
        ),
    ]
