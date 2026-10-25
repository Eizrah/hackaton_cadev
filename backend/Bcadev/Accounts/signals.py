import os
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Developper


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression de la photo de profil quand un Dev est supprimé
#
# post_delete → ce signal se déclenche APRÈS que la ligne Developper
# a été supprimée de la base de données.
# On supprime ensuite le fichier physique correspondant dans media/.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_delete, sender=Developper)
def supprimer_photo_profil(sender, instance, **kwargs):
    # Vérifie que le dev avait bien une photo de profil
    if instance.photoprofil:
        # Vérifie que le fichier existe physiquement sur le disque
        if os.path.isfile(instance.photoprofil.path):
            # Supprime le fichier du dossier media/profil_pictures/
            os.remove(instance.photoprofil.path)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression de l'ancienne photo quand un Dev change sa photo
#
# pre_save → ce signal se déclenche AVANT que les modifications
# soient sauvegardées en base de données.
# On compare l'ancienne photo avec la nouvelle — si elles sont différentes,
# on supprime l'ancienne du disque pour ne pas accumuler des fichiers inutiles.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(pre_save, sender=Developper)
def supprimer_ancienne_photo(sender, instance, **kwargs):
    # Si c'est une création (pas encore de pk), on ne fait rien
    if not instance.pk:
        return
    
    try:
        # Récupère l'état actuel du dev en base AVANT la modification
        ancienne = Developper.objects.get(pk=instance.pk)
    except Developper.DoesNotExist:
        return
    
    # Compare l'ancienne photo avec la nouvelle
    if ancienne.photoprofil and ancienne.photoprofil != instance.photoprofil:
        # Si elles sont différentes, supprime l'ancienne du disque
        if os.path.isfile(ancienne.photoprofil.path):
            os.remove(ancienne.photoprofil.path)
