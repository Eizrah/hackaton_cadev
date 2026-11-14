from django.db import migrations


class Migration(migrations.Migration):
    # Rattache les deux évolutions déjà livrées à une même suite de migrations.
    dependencies = [
        ('Accounts', '0011_identifiant_competences_profil'),
        ('Accounts', '0011_fix_experience_related_name'),
    ]

    operations = []
