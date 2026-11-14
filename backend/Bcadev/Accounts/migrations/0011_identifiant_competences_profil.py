import uuid

from django.db import migrations, models


def renseigner_identifiants(apps, schema_editor):
    Developper = apps.get_model('Accounts', 'Developper')
    comptes = Developper.objects.using(schema_editor.connection.alias)
    # Chaque compte existant reçoit son propre UUID avant la contrainte unique.
    for email in comptes.values_list('pk', flat=True).iterator():
        comptes.filter(pk=email).update(identifiant=uuid.uuid4())


class Migration(migrations.Migration):
    dependencies = [('Accounts', '0010_notif_groupe_id')]

    operations = [
        migrations.AddField(
            model_name='developper', name='identifiant',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.RunPython(renseigner_identifiants, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='developper', name='identifiant',
            field=models.UUIDField(default=uuid.uuid4, unique=True, editable=False),
        ),
        migrations.AddField(
            model_name='developper', name='competences_personnalisees',
            field=models.JSONField(blank=True, null=True),
        ),
        # NULL signale les anciens profils dont les compétences pouvaient être uniquement locales.
        migrations.AlterField(
            model_name='developper', name='competences_personnalisees',
            field=models.JSONField(default=list, blank=True, null=True),
        ),
    ]
