from django.db import models
from Forum.models import Publication



class Offre_Emploi(Publication):
    TYPE_CONTRACT=[
        ('CDI','CDI'),
        ('CDD','CDD'),
    ]
    TYPE_TRAVAIL=[
        ('R','Remote'),
        ('S','Sur site'),
        ('H','Hybride'),
    ]
    localisation=models.CharField(max_length=255)
    deadline=models.DateField()
    type_contrat=models.CharField(choices=TYPE_CONTRACT, max_length=3)
    nom_poste=models.CharField(max_length=255)
    duree=models.DurationField(blank=True, null=True)
    competence_requise=models.TextField()
    type_travail=models.CharField(choices=TYPE_TRAVAIL, max_length=1)
    
    class Meta:
        db_table='offre_emploi'


class Candidature(models.Model):
    ETAT_CANDIDATURE=[
        ('en_attente','En attente'),
        ('accepte','Accepté'),
        ('refuse','Refusé'),
    ]
    date_postule=models.DateField(auto_now_add=True)
    etat=models.CharField(choices=ETAT_CANDIDATURE, max_length=10, default='en_attente')
    lettre_motivation=models.TextField(blank=True,null=True)
    pj=models.FileField(upload_to='pj/',blank=True,null=True)
    developpeur=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE)
    offre_emploi=models.ForeignKey('Jobs.Offre_Emploi', on_delete=models.CASCADE)
    class Meta:
        db_table='candidature'
        unique_together = ('developpeur', 'offre_emploi')