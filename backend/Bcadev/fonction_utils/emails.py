"""
Utilitaires pour l'envoi d'emails avec templates HTML
"""
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
import os


def envoyer_email_html(destinataire, sujet, template_name, context):
    """
    Envoie un email HTML avec un template.
    
    Args:
        destinataire: Email du destinataire (string)
        sujet: Sujet de l'email
        template_name: Nom du fichier template (ex: 'reset_password.html')
        context: Dictionnaire de variables pour le template
    """
    html_message = render_to_string(f'emails/{template_name}', context)
    
    email = EmailMessage(
        subject=sujet,
        body=html_message,
        from_email=os.environ.get('EMAIL_FROM', 'noreply@cadev.com'),
        to=[destinataire]
    )
    email.content_subtype = 'html'  # Important pour envoyer en HTML
    email.send()


def envoyer_reset_password(destinataire, nom, lien):
    """
    Envoie l'email de réinitialisation de mot de passe.
    """
    context = {
        'nom': nom,
        'lien': lien,
        'site_name': 'DevAfrica Connect'
    }
    envoyer_email_html(
        destinataire=destinataire,
        sujet='Réinitialisation de votre mot de passe',
        template_name='reset_password.html',
        context=context
    )


def envoyer_candidature_reponse(destinataire, nom, poste, accepte):
    """
    Envoie l'email de réponse à une candidature.
    """
    context = {
        'nom': nom,
        'poste': poste,
        'accepte': accepte,
        'site_name': 'DevAfrica Connect'
    }
    sujet = f"✅ Votre candidature a été acceptée — {poste}" if accepte else f"Réponse à votre candidature — {poste}"
    
    envoyer_email_html(
        destinataire=destinataire,
        sujet=sujet,
        template_name='candidature_reponse.html',
        context=context
    )


def envoyer_bannissement(destinataire, nom):
    """
    Envoie l'email de bannissement.
    """
    context = {
        'nom': nom,
        'site_name': 'DevAfrica Connect'
    }
    envoyer_email_html(
        destinataire=destinataire,
        sujet='⚠️ Votre compte a été banni',
        template_name='bannissement.html',
        context=context
    )


def envoyer_contenu_supprime(destinataire, nom, type_contenu):
    """
    Envoie l'email de suppression de contenu.
    """
    context = {
        'nom': nom,
        'type_contenu': type_contenu,
        'site_name': 'DevAfrica Connect'
    }
    envoyer_email_html(
        destinataire=destinataire,
        sujet=f'Votre {type_contenu} a été supprimé',
        template_name='contenu_supprime.html',
        context=context
    )
