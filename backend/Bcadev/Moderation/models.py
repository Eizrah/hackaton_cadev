
from django.db import models
import uuid
class Signalement(models.Model):
    id_signalement=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date_signalement=models.DateField(auto_now_add=True)
    motif=models.TextField()
    id_signaleur=models.ForeignKey('Accounts.Developper',on_delete=models.CASCADE, related_name='%(class)s_signalements')
    class Meta:
        abstract=True 

class Signalement_Individuel(Signalement):
    
    id_personne_signale = models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE, related_name='signalements_recus')
    class Meta:
        db_table='signalement_individuel'
        unique_together = ('id_signaleur', 'id_personne_signale')

class SignalementOffre(Signalement):
   
    id_offre=models.ForeignKey('Jobs.Offre_Emploi', on_delete=models.CASCADE)
    class Meta:
        db_table='signalement_offre'
        unique_together = ('id_signaleur', 'id_offre')
class SignalementPost(Signalement):
    
    id_post=models.ForeignKey('Forum.Forum_post',on_delete=models.CASCADE)
    class Meta:
        db_table='signalement_poste'
        unique_together = ('id_signaleur', 'id_post')

class SignalementGroupe(Signalement):
    
    id_groupe=models.ForeignKey('Groups.Group', on_delete=models.CASCADE)
    class Meta:
        db_table='signalement_groupe'
        unique_together = ('id_signaleur', 'id_groupe')