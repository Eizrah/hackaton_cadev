#!/usr/bin/env python
"""
Script de test pour le système de modération amélioré.
Teste que les cas légitimes sont approuvés et les cas problématiques sont bloqués.
"""

import os
import sys
import django

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bcadev.settings')
django.setup()

from Agents.services.verification_services import verifier_post

# ─── TESTS : CAS LÉGITIMES (doivent être APPROUVÉS) ────────────────────────────

cas_legitimes = [
    "ceci est une conversation",
    "console.log('Hello World')",
    "comment construire une API REST ?",
    "je cherche une formation en Python",
    "discussion sur les conditions de travail",
    "const config = { mode: 'production' }",
    "React vs Vue : quel framework choisir ?",
    "offre : développeur Full Stack, 50k€/an à Paris",
    "mon portfolio : github.com/username/project",
    "conversation intéressante sur Docker",
    "j'ai construit un système de notifications",
]

# ─── TESTS : CAS PROBLÉMATIQUES (doivent être REFUSÉS) ─────────────────────────

cas_problematiques = [
    "tu es con et stupide",
    "va te suicider",
    "kill yourself idiot",
    "sale arabe retourne dans ton pays",
    "nigger faggot asshole",
    "je vais te tuer connard",
    "site porno gratuit xxx videos",
    "gagne 100000€ par mois sans travailler, clique ici",
]

# ─── EXÉCUTION DES TESTS ────────────────────────────────────────────────────────

print("=" * 80)
print("TEST DU SYSTÈME DE MODÉRATION AMÉLIORÉ")
print("=" * 80)

print("\n" + "─" * 80)
print("✅ CAS LÉGITIMES (doivent être APPROUVÉS)")
print("─" * 80)

for i, texte in enumerate(cas_legitimes, 1):
    print(f"\n[{i}] Texte : \"{texte}\"")
    resultat = verifier_post(description=texte, lien=None)
    
    approuve = resultat.get("approuve", False)
    raison = resultat.get("raison", "N/A")
    confiance = resultat.get("niveau_confiance", "N/A")
    
    statut = "✅ PASS" if approuve else "❌ FAIL"
    print(f"    Résultat : {statut}")
    print(f"    Approuvé : {approuve}")
    print(f"    Confiance : {confiance}")
    if raison:
        print(f"    Raison : {raison}")

print("\n" + "─" * 80)
print("❌ CAS PROBLÉMATIQUES (doivent être REFUSÉS)")
print("─" * 80)

for i, texte in enumerate(cas_problematiques, 1):
    print(f"\n[{i}] Texte : \"{texte}\"")
    resultat = verifier_post(description=texte, lien=None)
    
    approuve = resultat.get("approuve", False)
    raison = resultat.get("raison", "N/A")
    confiance = resultat.get("niveau_confiance", "N/A")
    
    statut = "✅ PASS" if not approuve else "❌ FAIL"
    print(f"    Résultat : {statut}")
    print(f"    Approuvé : {approuve}")
    print(f"    Confiance : {confiance}")
    if raison:
        print(f"    Raison : {raison}")

print("\n" + "=" * 80)
print("FIN DES TESTS")
print("=" * 80)
