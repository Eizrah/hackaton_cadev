import json
import math
import subprocess
from datetime import timedelta

from rest_framework import serializers
from .models import Message, Audio, Fichier,Session
from fonction_utils.gestion_fichier import valider_fichier, valider_audio
from mutagen import File as MutagenFile, MutagenError
from django.conf import settings


class MessageSerializer(serializers.ModelSerializer):
    envoyeur_email = serializers.EmailField(source='envoyeur_id', read_only=True)
    destinataire_email = serializers.EmailField(source='destinataire_id', read_only=True, allow_null=True)
    fichier_audio = serializers.FileField(source='audio.fichier_audio', read_only=True, default=None)
    duree = serializers.DurationField(source='audio.duree', read_only=True, default=None)
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
            'envoyeur_pseudo', 'destinataire_pseudo', 'envoyeur_email', 'destinataire_email',
            'message_parent', 'message_parent_contenu', 'fichiers', 'fichier_audio', 'duree', 'supprime'
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
        return FichierSerializer(fichiers, many=True, context=self.context).data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.supprime:
            data['fichier_audio'] = data['duree'] = None
        return data


def duree_webm(fichier):
    # Les WebM de MediaRecorder n'ont pas toujours de durée dans l'en-tête.
    # On mesure l'intervalle des paquets audio avec ffprobe, sur l'entrée locale uniquement.
    fichier.seek(0)
    resultat = subprocess.run(
        [
            'ffprobe', '-v', 'error', '-protocol_whitelist', 'pipe', '-f', 'matroska',
            '-i', 'pipe:0', '-select_streams', 'a:0',
            '-show_entries', 'packet=pts_time,duration_time', '-of', 'json',
        ],
        input=fichier.read(), capture_output=True, check=True, timeout=10,
    )
    paquets = [
        (float(paquet['pts_time']), float(paquet.get('duration_time', '0')))
        for paquet in json.loads(resultat.stdout).get('packets', [])
        if paquet.get('pts_time', 'N/A') != 'N/A'
    ]
    return max(debut + duree for debut, duree in paquets) - min(debut for debut, _ in paquets)


class AudioSerializer(serializers.ModelSerializer):
    envoyeur_pseudo = serializers.CharField(source='envoyeur.pseudo', read_only=True)
    destinataire_pseudo = serializers.CharField(source='destinataire.pseudo', read_only=True)
    message_parent_contenu = serializers.SerializerMethodField()

    class Meta:
        model = Audio
        fields = [
            'id_message', 'fichier_audio', 'duree', 'contenu', 'date_envoie', 'etat',
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

    def validate(self, attrs):
        fichier = attrs['fichier_audio']
        valider_audio(fichier)
        try:
            if fichier.read(4) == bytes.fromhex('1a45dfa3'):
                secondes = duree_webm(fichier)
            else:
                fichier.seek(0)
                audio = MutagenFile(fichier)
                secondes = audio.info.length if audio else 0
        except (OSError, ValueError, MutagenError, subprocess.SubprocessError):
            secondes = 0
        finally:
            fichier.seek(0)

        if not math.isfinite(secondes) or secondes <= 0:
            raise serializers.ValidationError({'fichier_audio': 'Impossible de lire ce fichier audio.'})
        if secondes > settings.MAX_AUDIO_DURATION:
            raise serializers.ValidationError({'fichier_audio': 'La durée maximale du vocal est de 2 min 30.'})
        # Le client ne fournit pas la durée. Le serveur la valide et l'enregistre.
        attrs['duree'] = timedelta(seconds=secondes)
        return attrs


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




class SessionSerializer(serializers.ModelSerializer):
    nombre_messages = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = ['id_session', 'titre', 'date_session', 'epingle', 'nombre_messages']
        read_only_fields = ['id_session', 'date_session', 'nombre_messages']

    def get_nombre_messages(self, obj):
        return obj.messages.count()
