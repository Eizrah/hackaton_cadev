from django.db import models
import uuid
from fonction_utils.gestion_fichier import getPhotoGroup
class Group(models.Model):
    id_group = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom=models.CharField(max_length=100)
    motif_creation=models.TextField()
    photo=models.ImageField(upload_to=getPhotoGroup, blank=True, null=True) 
    motif_suppression=models.TextField(blank=True, null=True)
    point_penalite=models.IntegerField(default=0)
    date_suppression=models.DateField(blank=True, null=True)
    date_creation=models.DateField(auto_now_add=True)
    actif=models.BooleanField(default=True)
    
    
    class Meta:
        db_table='group'
        
class Membre(models.Model):
    TYPE=[
        ('A','Admin'),
        ('M','Membre'),
        ('MB','Moderateur')
    ]
    id_groupe=models.ForeignKey(Group,on_delete=models.CASCADE)
    id_personne=models.ForeignKey('Accounts.Developper',on_delete=models.CASCADE)
    type=models.CharField(max_length=2,choices=TYPE,default='M')
    date_adhesion=models.DateField(auto_now_add=True)
    
    class Meta:
        db_table='membre'
        unique_together = ('id_groupe', 'id_personne')


class InvitationGroupe(models.Model):
    """Invitation à rejoindre un groupe"""
    STATUS = [
        ('P', 'En attente'),
        ('A', 'Acceptée'),
        ('R', 'Refusée'),
    ]
    id_invitation = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    groupe = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='invitations')
    inviteur = models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE, related_name='invitations_envoyees')
    invite = models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE, related_name='invitations_recues')
    statut = models.CharField(max_length=1, choices=STATUS, default='P')
    date_invitation = models.DateTimeField(auto_now_add=True)
    date_reponse = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'invitation_groupe'
        unique_together = ('groupe', 'invite')  # Une seule invitation par personne par groupe



