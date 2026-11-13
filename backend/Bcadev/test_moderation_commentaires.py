#!/usr/bin/env python
"""
Script de test pour la modération des commentaires.
Vérifie que les commentaires légitimes passent et les problématiques sont bloquées.
"""

import os
import sys
import django

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bcadev.settings')
django.setup()

from Agents.services.verification_services import verifier_commentaire

# ─── TESTS : COMMENTAIRES LÉGITIMES (doivent être APPROUVÉS) ───────────────────

commentaires_legitimes = [
    "Merci pour ce partage !",
    "Excellente explication sur les API REST",
    "J'ai eu le même problème avec console.log",
    "La conversation est très intéressante",
    "Je construis actuellement une app similaire",
    "const config = { mode: 'dev' } marche bien chez moi",
    "Tu peux consulter mon GitHub pour des exemples",
    "React ou Vue pour ce projet ?",
    "Débat intéressant, je ne suis pas d'accord mais respecte ton point de vue",
    "Cette configuration ne fonctionne pas chez moi 🤔",
]

# ─── TESTS : COMMENTAIRES PROBLÉMATIQUES (doivent être REFUSÉS) ────────────────

commentaires_problematiques = [
    "Tu es vraiment con",
    "Ferme ta gueule idiot",
    "Va te suicider tu sers à rien",
    "Kill yourself noob",
    "Retourne dans ton pays sale arabe",
    "T'es un gros con d'abruti",
    "Fuck you asshole",
    "Ton code c'est de la merde, t'es nul",
]

# ─── EXÉCUTION DES TESTS ────────────────────────────────────────────────────────

print("=" * 80)
print("TEST DE MODÉRATION DES COMMENTAIRES")
print("=" * 80)

print("\n" + "─" * 80)
print("✅ COMMENTAIRES LÉGITIMES (doivent être APPROUVÉS)")
print("─" * 80)

legitimes_ok = 0
legitimes_fail = 0

for i, texte in enumerate(commentaires_legitimes, 1):
    print(f"\n[{i}] Commentaire : \"{texte}\"")
    resultat = verifier_commentaire(commentaire=texte)
    
    approuve = resultat.get("approuve", False)
    raison = resultat.get("raison", "N/A")
    confiance = resultat.get("niveau_confiance", "N/A")
    
    if approuve:
        statut = "✅ PASS"
        legitimes_ok += 1
    else:
        statut = "❌ FAIL"
        legitimes_fail += 1
        
    print(f"    Résultat : {statut}")
    print(f"    Approuvé : {approuve}")
    print(f"    Confiance : {confiance}")
    if raison:
        print(f"    Raison : {raison}")

print("\n" + "─" * 80)
print("❌ COMMENTAIRES PROBLÉMATIQUES (doivent être REFUSÉS)")
print("─" * 80)

problematiques_ok = 0
problematiques_fail = 0

for i, texte in enumerate(commentaires_problematiques, 1):
    print(f"\n[{i}] Commentaire : \"{texte}\"")
    resultat = verifier_commentaire(commentaire=texte)
    
    approuve = resultat.get("approuve", False)
    raison = resultat.get("raison", "N/A")
    confiance = resultat.get("niveau_confiance", "N/A")
    
    if not approuve:
        statut = "✅ PASS"
        problematiques_ok += 1
    else:
        statut = "❌ FAIL"
        problematiques_fail += 1
        
    print(f"    Résultat : {statut}")
    print(f"    Approuvé : {approuve}")
    print(f"    Confiance : {confiance}")
    if raison:
        print(f"    Raison : {raison}")

# ─── RÉSUMÉ ─────────────────────────────────────────────────────────────────────

print("\n" + "=" * 80)
print("RÉSUMÉ DES TESTS")
print("=" * 80)
print(f"\n✅ Commentaires légitimes :")
print(f"   - Passés : {legitimes_ok}/{len(commentaires_legitimes)}")
print(f"   - Échoués : {legitimes_fail}/{len(commentaires_legitimes)}")

print(f"\n❌ Commentaires problématiques :")
print(f"   - Bloqués : {problematiques_ok}/{len(commentaires_problematiques)}")
print(f"   - Échoués : {problematiques_fail}/{len(commentaires_problematiques)}")

total_ok = legitimes_ok + problematiques_ok
total_tests = len(commentaires_legitimes) + len(commentaires_problematiques)
pourcentage = (total_ok / total_tests * 100) if total_tests > 0 else 0

print(f"\n📊 Score global : {total_ok}/{total_tests} ({pourcentage:.1f}%)")

if pourcentage >= 90:
    print("\n🎉 Excellent ! Le système fonctionne très bien.")
elif pourcentage >= 75:
    print("\n👍 Bon ! Quelques ajustements à faire.")
else:
    print("\n⚠️ Attention ! Le système nécessite des améliorations.")

print("\n" + "=" * 80)
