from Accounts.models import Sourdine
from .models import Notif


def creer_notif(destinataire, type_notif, message, post_id=None, commentaire_id=None, offre_id=None, groupe_id=None, envoyeur=None):
    """
    Crée une notification pour un dev.
    
    Paramètres :
    - destinataire    : instance de Developper
    - type_notif      : une des valeurs de Notif.TYPE
    - message         : texte de la notification
    - post_id         : ID de la publication concernée (optionnel)
    - commentaire_id  : ID du commentaire concerné (optionnel)
    - offre_id        : ID de l'offre d'emploi concernée (optionnel)
    - groupe_id       : ID du groupe concerné (optionnel)
    - envoyeur        : instance de Developper qui cause la notification (optionnel)
    
    Exemple d'utilisation :
        creer_notif(
            post.developper, 
            'commentaire', 
            f'{dev.pseudo} a commenté votre post.',
            post_id=post.id_publication,
            envoyeur=dev
        )
    """
    # Si envoyeur fourni, vérifier la sourdine
    if envoyeur:
        # Sourdine sur une personne : ne pas créer la notification
        if Sourdine.objects.filter(dev=destinataire, dev_sourdine=envoyeur).exists():
            return  # Notification ignorée
    
    # Créer la notification normalement
    Notif.objects.create(
        destinataire=destinataire,
        type=type_notif,
        message=message,
        post_id=post_id,
        commentaire_id=commentaire_id,
        offre_id=offre_id,
        groupe_id=groupe_id
    )
