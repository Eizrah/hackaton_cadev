import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Fichier, Audio


def supprimer_fichier(path):
    """Supprime un fichier physique s'il existe."""
    if path and os.path.isfile(path):
        os.remove(path)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression du fichier physique quand un Fichier est supprimé.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_delete, sender=Fichier)
def supprimer_fichier_message(sender, instance, **kwargs):
    if instance.fichier:
        supprimer_fichier(instance.fichier.path)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression du fichier audio physique quand un Audio est supprimé.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_delete, sender=Audio)
def supprimer_audio_message(sender, instance, **kwargs):
    if instance.fichier_audio:
        supprimer_fichier(instance.fichier_audio.path)
