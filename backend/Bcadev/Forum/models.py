from django.db import models
import uuid
from fonction_utils.gestion_fichier  import getFichierPub

class Publication(models.Model):
    id_publication=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    description=models.TextField()
    date_publication=models.DateField(auto_now_add=True)
    point_penalite_obtenu=models.IntegerField(default=0)
    feu_vert=models.BooleanField(default=False)
    developper=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE)
    fichier=models.FileField(upload_to=getFichierPub,blank=True,null=True)
    lien=models.URLField(blank=True,null=True)
    
    class Meta:
       
        abstract=True
        

class Forum_post(Publication):
       
    class Meta:
        db_table='forum_post'


class Commentaire(models.Model):
    id_commentaire=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commentaire=models.TextField()
    date_commentaire=models.DateField(auto_now_add=True)
    point_penalite_obtenu=models.IntegerField(default=0)
    developper=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE)
    forum_post=models.ForeignKey('Forum.Forum_post', on_delete=models.CASCADE)
    
    class Meta:
        db_table='commentaire'


class Note(models.Model):
    date_note=models.DateField(auto_now_add=True)
    developper=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE)
    forum_post=models.ForeignKey('Forum.Forum_post', on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'note'
        unique_together = ('developper', 'forum_post')

    

    

    



    