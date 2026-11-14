import os
from django.conf import settings
from rest_framework.exceptions import ValidationError

# ─── Chemins de stockage ───────────────────────────────────────────

def getProfilDev(instance, filename):
    return f'profil_pictures/{filename}'

def getPhotoGroup(instance, filename):
    return f'group_pictures/{filename}'

def getFichierDiplome(instance, filename):
    path = f'diplomes/{filename}'
    os.makedirs(os.path.join(settings.MEDIA_ROOT, 'diplomes'), exist_ok=True)
    return path

def getFichierCertificat(instance, filename):
    path = f'certificats/{filename}'
    os.makedirs(os.path.join(settings.MEDIA_ROOT, 'certificats'), exist_ok=True)
    return path

def getFichierPub(instance, filename):
    # distingue forum et offre selon le type de publication
    from Forum.models import Forum_post
    if isinstance(instance, Forum_post):
        return f'forum_files/{filename}'
    return f'offre_files/{filename}'

def getFichierMessage(instance, filename):
    if instance.message.groupe_id:
        return f'groupe_files/{filename}'  # → media/groupe_files/
    return f'message_files/{filename}'     # → media/message_files/

def getAudioMessage(instance, filename):
    if instance.groupe_id:
        return f'audio_groupe/{filename}'  # → media/audio_groupe/
    return f'audio/{filename}'             # → media/audio/

# ─── Validations ───────────────────────────────────────────────────

def valider_image(fichier):
    if fichier.size > settings.MAX_UPLOAD_SIZE_IMAGE:
        raise ValidationError(f'La taille maximale est 10 Mo. Votre fichier fait {round(fichier.size / 1024 / 1024, 2)} Mo.')
    types_autorises = ['image/jpeg', 'image/png', 'image/webp']
    if fichier.content_type not in types_autorises:
        raise ValidationError('Format non autorisé. Utilisez JPEG, PNG ou WEBP.')

def valider_fichier(fichier):
    if fichier.size > settings.MAX_UPLOAD_SIZE_FICHIER:
        raise ValidationError(f'La taille maximale est 20 Mo. Votre fichier fait {round(fichier.size / 1024 / 1024, 2)} Mo.')
    types_autorises = [
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if fichier.content_type not in types_autorises:
        raise ValidationError('Format non autorisé. Utilisez PDF, ZIP ou DOCX.')

def valider_diplome_certificat(fichier):
    """
    Validation spécifique pour les diplômes et certificats.
    Accepte PDF, DOCX et images (scan de document).
    """
    if fichier.size > settings.MAX_UPLOAD_SIZE_FICHIER:
        raise ValidationError(f'La taille maximale est 20 Mo. Votre fichier fait {round(fichier.size / 1024 / 1024, 2)} Mo.')
    types_autorises = [
        # documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        # images — pour les scans de diplômes
        'image/jpeg',
        'image/png',
        'image/webp',
    ]
    if fichier.content_type not in types_autorises:
        raise ValidationError('Format non autorisé. Utilisez PDF, DOCX, JPEG ou PNG.')

def valider_audio(fichier):
    if fichier.size > settings.MAX_UPLOAD_SIZE_FICHIER:
        raise ValidationError('Fichier audio trop volumineux.')
    types_autorises = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm']
    if fichier.content_type not in types_autorises:
        raise ValidationError('Format audio non autorisé.')
