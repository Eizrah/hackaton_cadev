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
    ]
    id_groupe=models.ForeignKey(Group,on_delete=models.CASCADE)
    id_personne=models.ForeignKey('Accounts.Developper',on_delete=models.CASCADE)
    type=models.CharField(max_length=1,choices=TYPE,default='M')
    date_adhesion=models.DateField(auto_now_add=True)
    
    class Meta:
        db_table='membre'
        unique_together = ('id_groupe', 'id_personne')



