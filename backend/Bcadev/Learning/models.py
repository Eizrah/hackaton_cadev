from django.db import models
import uuid

class Competence(models.Model):
    DIFFICULTE=[
        ('Facile','Facile'),
        ('Moyen','Moyen'),
        ('Difficile','Difficile')
    ]
    id_competence=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom_competence=models.CharField(max_length=100)
    domaine=models.CharField(max_length=100)
    difficulte=models.CharField(max_length=10,choices=DIFFICULTE, default='Facile')
  

    class Meta:
        db_table="competences"


class Apprentissage(models.Model):
    AVANCEMENT=[
        ('en_cours','En cours'),
        ('termine','Termine')
    ]
    avancement=models.CharField(choices=AVANCEMENT,max_length=10)
    date_debut=models.DateField()
    date_fin=models.DateField(blank=True,null=True)
    id_competence=models.ForeignKey(Competence, on_delete=models.CASCADE)
    id_apprenant=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE)
    class Meta:
        db_table="apprentissage"

    

    
    
    

