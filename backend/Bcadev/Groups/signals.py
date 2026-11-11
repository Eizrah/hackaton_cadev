import os
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Group


def supprimer_fichier(path):
    """Supprime un fichier physique s'il existe."""
    if path and os.path.isfile(path):
        os.remove(path)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression de la photo du groupe quand il est supprimé.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_delete, sender=Group)
def supprimer_photo_groupe(sender, instance, **kwargs):
    if instance.photo:
        supprimer_fichier(instance.photo.path)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression de l'ancienne photo quand le groupe change sa photo.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(pre_save, sender=Group)
def supprimer_ancienne_photo_groupe(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        ancien = Group.objects.get(pk=instance.pk)
    except Group.DoesNotExist:
        return

    if ancien.photo and ancien.photo != instance.photo:
        supprimer_fichier(ancien.photo.path)
