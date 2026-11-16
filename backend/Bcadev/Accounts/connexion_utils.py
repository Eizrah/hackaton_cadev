"""
Utilitaires pour gérer la détection de nouvelles connexions
"""
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from .models import SessionConnexion


def get_client_ip(request):
    """Récupère l'adresse IP réelle du client"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def parse_user_agent(user_agent_string):
    """
    Parse le user-agent pour extraire les informations de base
    Version simplifiée sans dépendance externe
    """
    ua_lower = user_agent_string.lower()
    
    # Détection du navigateur
    if 'edg' in ua_lower or 'edge' in ua_lower:
        browser = 'Microsoft Edge'
    elif 'firefox' in ua_lower or 'fxios' in ua_lower:
        browser = 'Firefox'
    elif 'chrome' in ua_lower or 'crios' in ua_lower:
        browser = 'Chrome'
    elif 'safari' in ua_lower:
        browser = 'Safari'
    elif 'opera' in ua_lower or 'opr' in ua_lower:
        browser = 'Opera'
    else:
        browser = 'Autre navigateur'
    
    # Détection du système d'exploitation
    if 'windows' in ua_lower:
        os = 'Windows'
        if 'windows nt 10' in ua_lower:
            os = 'Windows 10/11'
        elif 'windows nt 6.3' in ua_lower:
            os = 'Windows 8.1'
        elif 'windows nt 6.2' in ua_lower:
            os = 'Windows 8'
        elif 'windows nt 6.1' in ua_lower:
            os = 'Windows 7'
    elif 'android' in ua_lower:
        os = 'Android'
    elif 'iphone' in ua_lower or 'ipad' in ua_lower:
        os = 'iOS'
    elif 'mac os x' in ua_lower or 'macintosh' in ua_lower:
        os = 'macOS'
    elif 'linux' in ua_lower:
        os = 'Linux'
    else:
        os = 'Système inconnu'
    
    # Détection du type d'appareil
    if 'mobile' in ua_lower or 'android' in ua_lower or 'iphone' in ua_lower:
        device_type = 'Mobile'
    elif 'tablet' in ua_lower or 'ipad' in ua_lower:
        device_type = 'Tablette'
    else:
        device_type = 'Ordinateur'
    
    return {
        'browser': browser,
        'os': os,
        'device_type': device_type,
    }


def get_location_from_ip(ip_address):
    """
    Récupère la localisation à partir de l'IP
    Utilise une API gratuite (ipapi.co) - limite : 1000 requêtes/jour
    """
    import requests
    
    try:
        # API gratuite sans clé
        response = requests.get(f'https://ipapi.co/{ip_address}/json/', timeout=2)
        if response.status_code == 200:
            data = response.json()
            ville = data.get('city', 'Inconnue')
            pays = data.get('country_name', 'Inconnu')
            return ville, pays
    except Exception as e:
        print(f"Erreur géolocalisation: {e}")
    
    return 'Inconnue', 'Inconnu'


def is_new_device(developper, user_agent_string, ip_address):
    """
    Vérifie si c'est un nouvel appareil en comparant avec les connexions précédentes
    """
    device_info = parse_user_agent(user_agent_string)
    
    # Cherche une session similaire dans les 90 derniers jours
    recent_sessions = SessionConnexion.objects.filter(
        developper=developper,
        date_connexion__gte=timezone.now() - timezone.timedelta(days=90)
    )
    
    # Vérifie si on a déjà vu ce combo browser + OS + device_type
    for session in recent_sessions:
        if (session.browser == device_info['browser'] and 
            session.os == device_info['os'] and 
            session.device_type == device_info['device_type']):
            return False, None
    
    return True, device_info


def enregistrer_connexion(developper, request):
    """
    Enregistre une connexion et envoie un email si c'est un nouvel appareil
    """
    user_agent_string = request.META.get('HTTP_USER_AGENT', '')
    ip_address = get_client_ip(request)
    
    is_new, device_info = is_new_device(developper, user_agent_string, ip_address)
    
    # Récupère la localisation
    ville, pays = get_location_from_ip(ip_address)
    
    # Crée la session
    session = SessionConnexion.objects.create(
        developper=developper,
        ip_address=ip_address,
        user_agent=user_agent_string,
        device_type=device_info['device_type'] if device_info else 'Inconnu',
        browser=device_info['browser'] if device_info else 'Inconnu',
        os=device_info['os'] if device_info else 'Inconnu',
        pays=pays,
        ville=ville,
        email_envoye=is_new
    )
    
    # Envoie un email si c'est un nouvel appareil
    if is_new and device_info:
        envoyer_email_nouvelle_connexion(developper, session)


def envoyer_email_nouvelle_connexion(developper, session):
    """
    Envoie un email pour notifier d'une connexion depuis un nouvel appareil
    """
    try:
        context = {
            'site_name': 'DevAfrica Connect',
            'prenom': developper.prenom or developper.pseudo,
            'date_connexion': session.date_connexion.strftime('%d/%m/%Y à %H:%M'),
            'appareil': f"{session.device_type} - {session.os}",
            'navigateur': session.browser,
            'localisation': f"{session.ville}, {session.pays}",
            'ip': session.ip_address,
        }
        
        html_content = render_to_string('emails/nouvelle_connexion.html', context)
        
        email = EmailMultiAlternatives(
            subject='🔐 Nouvelle connexion détectée sur votre compte',
            body=f"Une nouvelle connexion a été détectée sur votre compte depuis {session.device_type} ({session.browser}) à {session.ville}, {session.pays}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[developper.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
    except Exception as e:
        print(f"Erreur envoi email nouvelle connexion: {e}")
