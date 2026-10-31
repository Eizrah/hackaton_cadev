from .models import Notif


def creer_notif(destinataire, type_notif, message):
    """
    Crée une notification pour un dev.
    
    Paramètres :
    - destinataire : instance de Developper
    - type_notif   : une des valeurs de Notif.TYPE
    - message      : texte de la notification
    
    Exemple d'utilisation :
        creer_notif(post.developper, 'commentaire', f'{dev.pseudo} a commenté votre post.')
    """
    Notif.objects.create(
        destinataire=destinataire,
        type=type_notif,
        message=message
    )
