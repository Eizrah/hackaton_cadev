# Generated manually to convert DurationField to IntegerField

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Jobs', '0004_alter_offre_emploi_type_contrat'),
    ]

    operations = [
        # Étape 1 : Supprimer l'ancien champ duree (DurationField)
        migrations.RemoveField(
            model_name='offre_emploi',
            name='duree',
        ),
        
        # Étape 2 : Ajouter le nouveau champ duree (IntegerField)
        migrations.AddField(
            model_name='offre_emploi',
            name='duree',
            field=models.IntegerField(blank=True, help_text='Durée en mois (pour CDD et Stage)', null=True),
        ),
    ]
