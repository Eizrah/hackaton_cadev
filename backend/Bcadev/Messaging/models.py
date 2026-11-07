from django.db import models
import uuid
from fonction_utils.gestion_fichier import getAudioMessage, getFichierMessage
class Message(models.Model):
    ETAT=[
        ('en_cours','En cours d\'envoie'),
        ('reçu','Reçu'),
        ('lu','Lu'),
        ('echec','Echec')
       
    ]
    ROLE = [
        ('user', 'Utilisateur'),
        ('assistant', 'Agent IA'),
    ]
    id_message=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contenu=models.TextField(blank=True, null=True)
    date_envoie=models.DateTimeField(auto_now_add=True)
    envoyeur=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE, related_name='messages_envoyes')
    destinataire = models.ForeignKey('Accounts.Developper', on_delete=models.SET_NULL, null=True, blank=True, related_name='messages_recus')
    groupe = models.ForeignKey('Groups.Group', on_delete=models.SET_NULL, null=True, blank=True, related_name='messages_groupe')
    message_parent=models.ForeignKey('self',on_delete=models.SET_NULL,null=True,blank=True,related_name='reponses')
    etat=models.CharField(max_length=10,choices=ETAT,default='en_cours')
    supprime = models.BooleanField(default=False)
    role=models.CharField(max_length=10, choices=ROLE, blank=True, null=True)
    session = models.ForeignKey('Session', on_delete=models.CASCADE, null=True, blank=True, related_name='messages')

    class Meta:
        db_table='message'


class Audio(Message):
    duree=models.DurationField()
    fichier_audio=models.FileField(upload_to=getAudioMessage)

    class Meta:
        db_table='audio'

class Fichier(models.Model):
    message=models.ForeignKey(Message, on_delete=models.CASCADE, related_name='fichiers')
    id_fichier=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fichier=models.FileField(upload_to=getFichierMessage)
    taille=models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  
    
    class Meta:
        db_table='fichier'

class Session(models.Model):
    id_session=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    developper=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE, related_name='sessions')
    date_session=models.DateField(auto_now_add=True)
    titre = models.CharField(max_length=200, blank=True, null=True)
    epingle = models.BooleanField(default=False)

    class Meta:
        db_table='session'
