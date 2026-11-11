from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'Accounts'

    def ready(self):
        # Connecte les signals au démarrage de l'application
        # Sans cette ligne, les signals dans signals.py ne seront jamais chargés
        import Accounts.signals
