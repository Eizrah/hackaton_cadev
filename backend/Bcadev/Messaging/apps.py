from django.apps import AppConfig


class MessagingConfig(AppConfig):
    name = 'Messaging'

    def ready(self):
        import Messaging.signals
