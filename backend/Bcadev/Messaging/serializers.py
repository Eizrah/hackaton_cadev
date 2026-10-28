from rest_framework import serializers
from .models import Message, Audio, Fichier
from fonction_utils.gestion_fichier import valider_fichier, valider_audio
from mutagen import File as MutagenFile
from django.conf import settings


class MessageSerializer(serializers.ModelSerializer):
    envoyeur_pseudo = serializers.CharField(source='envoyeur.pseudo', read_only=True)
    destinataire_pseudo = serializers.CharField(source='destinataire.pseudo', read_only=True)
    # affiche le contenu du message parent si c'est une réponse
    message_parent_contenu = serializers.SerializerMethodField()
    # affiche les fichiers joints au message
    fichiers = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id_message', 'contenu', 'date_envoie', 'etat',
            'envoyeur_pseudo', 'destinataire_pseudo',
            'message_parent', 'message_parent_contenu', 'fichiers','supprime'
        ]
        read_only_fields = [
            'id_message', 'date_envoie', 'etat',
            'envoyeur_pseudo', 'destinataire_pseudo',
            'message_parent_contenu', 'fichiers','supprime'
        ]

    def get_message_parent_contenu(self, obj):
        # retourne un résumé du message parent si c'est une réponse
        if obj.message_parent:
            return {
                'id': str(obj.message_parent.id_message),
                'contenu': obj.message_parent.contenu,
                'envoyeur': obj.message_parent.envoyeur.pseudo
            }
        return None

    def get_fichiers(self, obj):
        # retourne les fichiers joints au message
        fichiers = obj.fichiers.all()
        return FichierSerializer(fichiers, many=True).data

class AudioSerializer(serializers.ModelSerializer):
    envoyeur_pseudo = serializers.CharField(source='envoyeur.pseudo', read_only=True)
    destinataire_pseudo = serializers.CharField(source='destinataire.pseudo', read_only=True)
    message_parent_contenu = serializers.SerializerMethodField()

    class Meta:
        model = Audio
        fields = [
            'id_message', 'fichier_audio', 'duree', 'date_envoie', 'etat',
            'envoyeur_pseudo', 'destinataire_pseudo',
            'message_parent', 'message_parent_contenu'
        ]
        read_only_fields = [
            'id_message', 'date_envoie', 'etat', 'duree',
            'envoyeur_pseudo', 'destinataire_pseudo',
            'message_parent_contenu'
        ]

    def get_message_parent_contenu(self, obj):
        if obj.message_parent:
            return {
                'id': str(obj.message_parent.id_message),
                'contenu': obj.message_parent.contenu,
                'envoyeur': obj.message_parent.envoyeur.pseudo
            }
        return None

    def validate_fichier_audio(self, value):
        if value:
            valider_audio(value)
            # vérifie la durée avec mutagen
           
            audio = MutagenFile(value)
            if audio and audio.info.length > settings.MAX_AUDIO_DURATION:
                raise serializers.ValidationError(
                    f'La durée maximale est 2min30. Votre audio fait {round(audio.info.length, 0)} secondes.'
                )
        return value

class FichierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fichier
        fields = ['id_fichier', 'fichier', 'taille']
        read_only_fields = ['id_fichier', 'taille']

    def validate_fichier(self, value):
        if value:
            # types autorisés — pas d'exécutables ni de fichiers dangereux
            types_autorises = [
                # images
                'image/jpeg', 'image/png', 'image/webp', 'image/gif',
                # vidéos
                'video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska',
                # documents
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                # archives
                'application/zip',
                'application/x-zip-compressed',
                'application/x-rar-compressed',
                'application/x-tar',
            ]
            if value.content_type not in types_autorises:
                raise serializers.ValidationError(
                    'Type de fichier non autorisé. Les exécutables (.exe, .bat, .sh...) sont interdits.'
                )
            
            if value.size > settings.MAX_UPLOAD_SIZE_FICHIER:
                raise serializers.ValidationError(
                    f'Taille maximale 20Mo. Votre fichier fait {round(value.size / 1024 / 1024, 2)}Mo.'
                )
        return value
