"""
Accounts/pipeline.py

Pipeline personnalisé pour social_django.
"""
import re
import os
import random
from Accounts.models import Developper


def _generer_pseudo_oauth(prenom: str, uid: str) -> str:
    """
    Génère un pseudo avec des chiffres aléatoires mélangés.
    Exemple : prenom='Lucas' → '21Lucas3' ou '1Luca45'
    Uniquement pour les connexions OAuth (GitHub/Google).
    """
    # nettoie le prénom — uniquement lettres
    base = re.sub(r'[^A-Za-z]', '', prenom)[:15] or f"user"

    # génère 2-3 chiffres aléatoires à placer avant et après
    chiffre_avant = str(random.randint(1, 99))
    chiffre_apres = str(random.randint(1, 99))

    # construit le pseudo : chiffres + prénom + chiffres
    pseudo = f"{chiffre_avant}{base}{chiffre_apres}"

    # s'assure qu'il fait entre 3 et 30 caractères
    return pseudo[:30]


def get_or_create_user(backend, details, response, uid, user=None, *args, **kwargs):
    """
    Crée ou récupère un Developper à partir des infos OAuth.
    """
    if user:
        return {'is_new': False}

    email = details.get('email', '').strip()
    if not email:
        email = f"oauth_{backend.name}_{uid}@cadev.placeholder"

    # compte existant → associe
    try:
        dev = Developper.objects.get(email=email)
        return {'is_new': False, 'user': dev}
    except Developper.DoesNotExist:
        pass

    # récupère prénom et nom séparément
    fullname = (details.get('fullname') or '').strip()
    first_name = (details.get('first_name') or '').strip()
    last_name = (details.get('last_name') or '').strip()

    if fullname and not first_name and not last_name:
        # GitHub — on divise fullname en prénom + nom
        parts = fullname.split(' ', 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

    # génère le pseudo avec chiffres aléatoires depuis le prénom
    base_prenom = first_name or details.get('username', '') or 'user'
    pseudo = _generer_pseudo_oauth(base_prenom, uid)

    # s'assure que le pseudo est unique
    tentative = pseudo
    counter = 1
    while Developper.objects.filter(pseudo=tentative).exists():
        tentative = f"{pseudo}{counter}"
        counter += 1
    pseudo = tentative

    # crée le compte
    dev = Developper(
        email=email,
        nom=last_name or first_name or pseudo,
        prenom=first_name,
        pseudo=pseudo,
        age=0,
        niveau='D',
        pays='',
        sexe='M',
    )
    dev.set_unusable_password()
    dev.save()

    return {'is_new': True, 'user': dev}
