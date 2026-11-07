import os
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Forum_post


def supprimer_fichier(path):
    """Supprime un fichier physique s'il existe."""
    if path and os.path.isfile(path):
        os.remove(path)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression du fichier d'un post quand il est supprimé.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_delete, sender=Forum_post)
def supprimer_fichier_post(sender, instance, **kwargs):
    if instance.fichier:
        supprimer_fichier(instance.fichier.path)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression de l'ancien fichier quand un post est modifié.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(pre_save, sender=Forum_post)
def supprimer_ancien_fichier_post(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        ancien = Forum_post.objects.get(pk=instance.pk)
    except Forum_post.DoesNotExist:
        return

    if ancien.fichier and ancien.fichier != instance.fichier:
        supprimer_fichier(ancien.fichier.path)
