"""
Commande de management Django pour peupler la table des compétences.

Usage :
    python manage.py populate_competences          # ajoute les entrées manquantes
    python manage.py populate_competences --reset  # supprime aussi les relations du catalogue

Les compétences correspondent exactement aux cours disponibles sur la plateforme.
"""
from django.core.management.base import BaseCommand
from django.db import transaction
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
            help="Supprime les compétences et leurs relations (possessions et apprentissages).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["reset"]:
            count = Competence.objects.count()
            Competence.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f"  {count} compétences supprimées.")
            )

        created = 0
        # Les noms historiques peuvent être présents plusieurs fois. Garder les UUID
        # et les métadonnées déjà renseignés pour préserver les liens des utilisateurs.
        for nom, domaine, difficulte in COMPETENCES:
            if not Competence.objects.filter(nom_competence__iexact=nom).exists():
                Competence.objects.create(nom_competence=nom, domaine=domaine, difficulte=difficulte)
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\n{created} compétences ajoutées."
                f"\n   Total en base : {Competence.objects.count()}"
            )
        )
