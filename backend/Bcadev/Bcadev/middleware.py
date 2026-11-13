"""
Middleware personnalisé pour DevAfrica Connect
"""
import re
from django.utils.deprecation import MiddlewareMixin


class DisableCSRFMiddleware(MiddlewareMixin):
    """
    Désactive la vérification CSRF pour certains patterns d'URL.
    Utilisé pour les endpoints OAuth (social-django) qui gèrent
    leur propre sécurité via state tokens OAuth.
    """
    
    EXEMPT_PATTERNS = [
        re.compile(r'^social-auth/'),  # Tous les endpoints OAuth (sans le / initial)
    ]
    
    def process_request(self, request):
        """
        Marque la requête comme exempte de CSRF si elle correspond
        à un des patterns définis.
        """
        # Enlever le / initial pour matcher le pattern
        path = request.path_info.lstrip('/')
        
        for pattern in self.EXEMPT_PATTERNS:
            if pattern.match(path):
                setattr(request, '_dont_enforce_csrf_checks', True)
                break
        
        return None
