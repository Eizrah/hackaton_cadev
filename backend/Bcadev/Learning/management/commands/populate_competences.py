"""
Commande de management Django pour peupler la table des compétences.

Usage :
    python manage.py populate_competences          # insère / met à jour
    python manage.py populate_competences --reset  # supprime tout puis réinsère

Les compétences correspondent exactement aux cours disponibles sur la plateforme.
"""
from django.core.management.base import BaseCommand
from Learning.models import Competence


# ─── Liste complète des compétences = tous les cours de la plateforme ─────────
# Format : (nom_competence, domaine, difficulte)
COMPETENCES = [
    # ── Frontend Web ──────────────────────────────────────────────────────────
    ("HTML / CSS",        "Frontend Web",    "Facile"),
    ("JavaScript",        "Frontend Web",    "Facile"),
    ("TypeScript",        "Frontend Web",    "Moyen"),
    ("React",             "Frontend Web",    "Moyen"),
    ("Vue.js",            "Frontend Web",    "Moyen"),

    # ── Backend Web ───────────────────────────────────────────────────────────
    ("Django",            "Backend Web",     "Moyen"),
    ("Node.js / Express", "Backend Web",     "Moyen"),
    ("Laravel",           "Backend Web",     "Moyen"),
    ("Spring Boot",       "Backend Web",     "Difficile"),

    # ── Mobile Android ────────────────────────────────────────────────────────
    ("Kotlin",            "Mobile Android",  "Moyen"),
    ("Jetpack Compose",   "Mobile Android",  "Moyen"),
    ("Java Android",      "Mobile Android",  "Moyen"),

    # ── Mobile iOS ────────────────────────────────────────────────────────────
    ("Swift / SwiftUI",   "Mobile iOS",      "Moyen"),

    # ── Mobile Multiplateforme ────────────────────────────────────────────────
    ("Flutter / Dart",    "Multiplateforme", "Moyen"),
    ("React Native",      "Multiplateforme", "Moyen"),

    # ── Langages de programmation ─────────────────────────────────────────────
    ("C",                 "Langages",        "Moyen"),
    ("C++",               "Langages",        "Difficile"),
    ("Java",              "Langages",        "Moyen"),
    ("Python",            "Langages",        "Facile"),
    ("PHP",               "Langages",        "Facile"),
    ("SQL",               "Langages",        "Facile"),
]


class Command(BaseCommand):
    help = "Peuple la table des compétences avec tous les cours disponibles sur la plateforme."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Supprime toutes les compétences existantes avant d'insérer.",
        )

    def handle(self, *args, **options):
        if options["reset"]:
            count = Competence.objects.count()
            Competence.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f"  {count} compétences supprimées.")
            )

        created = 0
        updated = 0

        for nom, domaine, difficulte in COMPETENCES:
            obj, is_new = Competence.objects.update_or_create(
                nom_competence=nom,
                defaults={"domaine": domaine, "difficulte": difficulte},
            )
            if is_new:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ Compétences peuplées : {created} créées, {updated} mises à jour."
                f"\n   Total en base : {Competence.objects.count()}"
            )
        )
