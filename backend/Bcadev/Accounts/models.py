from django.db import models
from fonction_utils.gestion_fichier import getProfilDev
from django.contrib.auth.models import AbstractUser


class Developper(AbstractUser):
    NIVEAU=[
       ( 'D','Debutant'),
       ( 'I','Intermediaire'),
       ( 'A','Avance'),
    ]
    SEXE=[
        ('M','Masculin'),
        ('F','Feminin')
   ]
    email = models.EmailField(primary_key=True, unique=True)
    nom=models.CharField(max_length=20)
    prenom = models.CharField(max_length=40,blank=True,null=True)
    pseudo=models.CharField(max_length=50, unique=True)
    age=models.IntegerField()
    niveau=models.CharField(choices=NIVEAU, max_length=1)
    pays=models.CharField(max_length=50)
    point_penalite=models.IntegerField(default=0)
    banne=models.BooleanField(default=False)
    sexe=models.CharField(choices=SEXE,max_length=1)
    photoprofil=models.ImageField(upload_to=getProfilDev,blank=True,null=True)
    lien_portfolio=models.URLField(blank=True,null=True)
    lien_github=models.URLField(blank=True,null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['pseudo', 'nom']
    username=None

    class Meta:
        db_table='developper'

class Experience(models.Model):
    nom_poste=models.CharField(max_length=100)
    description=models.TextField()
    developper=models.ForeignKey(Developper, on_delete=models.CASCADE)
    nbr_annee_exp=models.IntegerField()
    diplome=models.CharField(max_length=200, blank=True,null=True)
    certificat=models.CharField(max_length=100,blank=True,null=True)
    
    

    class Meta:
        db_table='experience'
        



