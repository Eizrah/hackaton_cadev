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
    # Le badge de collaboration doit être visible sur le fil de chaque membre.
    collaboration = models.BooleanField(default=False)

    class Meta:
        db_table='forum_post'


class Commentaire(models.Model):
    id_commentaire=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commentaire=models.TextField()
    date_commentaire=models.DateField(auto_now_add=True)
    point_penalite_obtenu=models.IntegerField(default=0)
    developper=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE)
    forum_post=models.ForeignKey('Forum.Forum_post', on_delete=models.CASCADE)
    commentaire_parent = models.ForeignKey(
    'self',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='reponses'
)

    class Meta:
        db_table='commentaire'


class Note(models.Model):
    date_note=models.DateField(auto_now_add=True)
    developper=models.ForeignKey('Accounts.Developper', on_delete=models.CASCADE)
    forum_post=models.ForeignKey('Forum.Forum_post', on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'note'
        unique_together = ('developper', 'forum_post')

    


class Enregistrement(models.Model):
    dev = models.ForeignKey(
        'Accounts.Developper',
        on_delete=models.CASCADE,
        related_name='enregistrements'
    )
    forum_post = models.ForeignKey(
    'Forum.Forum_post',
    on_delete=models.CASCADE,
    null=True, blank=True,
    related_name='enregistrements'
    )
    offre_emploi = models.ForeignKey(
        'Jobs.Offre_Emploi',
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='enregistrements'
    )

    # pour savoir quel type de publication est enregistrée
    TYPE_PUB = [
        ('forum_post', 'Post Forum'),
        ('offre_emploi', 'Offre d\'emploi'),
    ]
    type_publication = models.CharField(max_length=20, choices=TYPE_PUB)
    date_enregistrement = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'enregistrement'
        constraints = [
            # un dev ne peut pas enregistrer deux fois le même post
            models.UniqueConstraint(
                fields=['dev', 'forum_post'],
                condition=models.Q(forum_post__isnull=False),
                name='unique_enregistrement_forum_post'
            ),
            # un dev ne peut pas enregistrer deux fois la même offre
            models.UniqueConstraint(
                fields=['dev', 'offre_emploi'],
                condition=models.Q(offre_emploi__isnull=False),
                name='unique_enregistrement_offre_emploi'
            ),
        ]



    



    
