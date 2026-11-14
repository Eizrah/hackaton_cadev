from functools import partial

from django.db import transaction
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Developper, Experience


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression de la photo de profil quand un Dev est supprimé
#
# post_delete → ce signal se déclenche APRÈS que la ligne Developper
# a été supprimée de la base de données.
# On supprime ensuite le fichier physique correspondant dans media/.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_delete, sender=Developper)
def supprimer_photo_profil(sender, instance, using, **kwargs):
    supprimer_fichier_apres_commit(instance.photoprofil, using)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression de l'ancienne photo quand un Dev change sa photo
#
# Retire l'ancienne photo une fois la modification confirmée en base.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(pre_save, sender=Developper)
def supprimer_ancienne_photo(sender, instance, using, update_fields, **kwargs):
    if not instance.pk or (update_fields is not None and 'photoprofil' not in update_fields):
        return
    
    try:
        # Récupère l'état actuel du dev en base AVANT la modification
        ancienne = Developper.objects.using(using).get(pk=instance.pk)
    except Developper.DoesNotExist:
        return
    
    if ancienne.photoprofil and ancienne.photoprofil != instance.photoprofil:
        supprimer_fichier_apres_commit(ancienne.photoprofil, using)


def supprimer_fichier_apres_commit(fichier, using):
    # Un enregistrement du profil peut encore échouer après le signal.
    if fichier:
        transaction.on_commit(partial(fichier.storage.delete, fichier.name), using=using, robust=True)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression des fichiers diplôme et certificat quand une
# expérience est supprimée.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_delete, sender=Experience)
def supprimer_fichiers_experience(sender, instance, using, **kwargs):
    supprimer_fichier_apres_commit(instance.fichier_diplome, using)
    supprimer_fichier_apres_commit(instance.fichier_certificat, using)


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL : Suppression des anciens fichiers quand une expérience est modifiée.
# ─────────────────────────────────────────────────────────────────────────────
@receiver(pre_save, sender=Experience)
def supprimer_anciens_fichiers_experience(sender, instance, using, **kwargs):
    if not instance.pk:
        return
    try:
        ancienne = Experience.objects.using(using).get(pk=instance.pk)
    except Experience.DoesNotExist:
        return

    # supprime l'ancien diplôme si changé
    if ancienne.fichier_diplome and ancienne.fichier_diplome != instance.fichier_diplome:
        supprimer_fichier_apres_commit(ancienne.fichier_diplome, using)

    # supprime l'ancien certificat si changé
    if ancienne.fichier_certificat and ancienne.fichier_certificat != instance.fichier_certificat:
        supprimer_fichier_apres_commit(ancienne.fichier_certificat, using)
