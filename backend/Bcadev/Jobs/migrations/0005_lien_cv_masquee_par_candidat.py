from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('Jobs', '0004_alter_offre_emploi_type_contrat')]

    operations = [
        # Certaines bases ont déjà reçu la colonne du lien CV.
        migrations.RunSQL(
            sql=[
                'ALTER TABLE candidature ADD COLUMN IF NOT EXISTS lien_cv varchar(500)',
                # PostgreSQL stocke la taille de varchar(n) sous la forme n + 4.
                # Élargit les colonnes plus courtes et préserve les liens plus longs.
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM pg_catalog.pg_attribute
                        WHERE attrelid = 'candidature'::regclass
                          AND attname = 'lien_cv'
                          AND atttypid = 'varchar'::regtype
                          AND atttypmod > 4
                          AND atttypmod - 4 < 500
                    ) THEN
                        ALTER TABLE candidature ALTER COLUMN lien_cv TYPE varchar(500);
                    END IF;
                END;
                $$
                """,
                'ALTER TABLE candidature ALTER COLUMN lien_cv DROP NOT NULL',
            ],
            # Un retour à 0004 doit laisser les liens déjà enregistrés en place.
            reverse_sql=migrations.RunSQL.noop,
            state_operations=[
                migrations.AddField(
                    model_name='candidature', name='lien_cv',
                    field=models.URLField(max_length=500, blank=True, null=True),
                ),
            ],
        ),
        # Les candidatures restent visibles tant que le candidat ne les masque pas.
        migrations.RunSQL(
            sql=[
                'ALTER TABLE candidature ADD COLUMN IF NOT EXISTS '
                'masquee_par_candidat boolean NOT NULL DEFAULT false',
                'UPDATE candidature SET masquee_par_candidat = false '
                'WHERE masquee_par_candidat IS NULL',
                'ALTER TABLE candidature ALTER COLUMN masquee_par_candidat SET NOT NULL, '
                'ALTER COLUMN masquee_par_candidat DROP DEFAULT',
            ],
            # Les insertions de la version 0004 n'envoient pas cette colonne.
            reverse_sql=(
                'ALTER TABLE candidature ALTER COLUMN masquee_par_candidat SET DEFAULT false'
            ),
            state_operations=[
                migrations.AddField(
                    model_name='candidature', name='masquee_par_candidat',
                    field=models.BooleanField(default=False),
                ),
            ],
        ),
    ]
