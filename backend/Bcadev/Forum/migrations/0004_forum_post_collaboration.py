from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('Forum', '0003_commentaire_commentaire_parent')]

    operations = [
        # Les publications existantes gardent leur contenu et leur visibilité.
        migrations.AddField(
            model_name='forum_post',
            name='collaboration',
            field=models.BooleanField(default=False),
        ),
    ]
