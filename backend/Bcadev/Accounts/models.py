import uuid
from django.db import models
from fonction_utils.gestion_fichier import getProfilDev, getFichierDiplome, getFichierCertificat
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
    # Cet identifiant reste stable si l'adresse de connexion change.
    identifiant = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    competences_personnalisees = models.JSONField(default=list, blank=True, null=True)
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
    presentation=models.TextField(blank=True,null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['pseudo', 'nom']
    username=None

    class Meta:
        db_table='developper'

class Experience(models.Model):
    nom_poste=models.CharField(max_length=100)
    description=models.TextField()
    developper=models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        related_name='experiences'
    )
    nbr_annee_exp=models.IntegerField()
    diplome=models.CharField(max_length=200, blank=True,null=True)
    certificat=models.CharField(max_length=100,blank=True,null=True)
    fichier_diplome = models.FileField(
        upload_to=getFichierDiplome,
        blank=True,
        null=True
    )
    fichier_certificat = models.FileField(
        upload_to=getFichierCertificat,
        blank=True,
        null=True
    )

    

    class Meta:
        db_table='experience'
        

class Blocage(models.Model):
    # dev qui bloque
    bloqueur = models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        related_name='blocages_effectues'
    )
    # dev bloqué
    bloque = models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        related_name='blocages_recus'
    )
    date_blocage = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'blocage'
        # un dev ne peut pas bloquer deux fois le même dev
        unique_together = ('bloqueur', 'bloque')

class Sourdine(models.Model):
    dev = models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        related_name='sourdines'
    )
    # sourdine sur une personne (message privé)
    dev_sourdine = models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='mis_en_sourdine'
    )
    # sourdine sur un groupe
    groupe_sourdine = models.ForeignKey(
        'Groups.Group',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='sourdines'
    )
    date_sourdine = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sourdine'



class Notif(models.Model):
    TYPE = [
        ('post_valide', 'Post validé'),
        ('post_refuse', 'Post refusé'),
        ('post_supprime', 'Post supprimé'),
        ('commentaire', 'Nouveau commentaire'),
        ('reponse_commentaire', 'Réponse à commentaire'),
        ('like', 'Like sur publication'),
        ('candidature', 'Candidature reçue'),
        ('candidature_reponse', 'Réponse à candidature'),
        ('groupe_invitation', 'Invitation à un groupe'),
        ('groupe_acceptation', 'Invitation acceptée'),
        ('groupe_refus', 'Invitation refusée'),
        ('groupe_supprime', 'Groupe supprimé'),
        ('point_penalite', 'Point de pénalité reçu'),
        ('bannissement', 'Compte banni'),
    ]
    destinataire = models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=30, choices=TYPE)
    message = models.TextField()
    lu = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    
    # Références pour la navigation
    post_id = models.UUIDField(null=True, blank=True)  # ID de la publication concernée (UUID)
    commentaire_id = models.UUIDField(null=True, blank=True)  # ID du commentaire concerné (UUID)
    offre_id = models.UUIDField(null=True, blank=True)  # ID de l'offre d'emploi concernée (UUID)
    groupe_id = models.UUIDField(null=True, blank=True)  # ID du groupe concerné (UUID)

    class Meta:
        db_table = 'notif'
        ordering = ['-date']  # plus récentes en premier


class Possession(models.Model):
    """
    Relation entre un Dev et une Compétence qu'il possède déjà.
    Différent de Apprentissage (Learning) qui représente une compétence en cours d'acquisition.
    """
    developper = models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        related_name='possessions'
    )
    competence = models.ForeignKey(
        'Learning.Competence',
        on_delete=models.CASCADE,
        related_name='possessions'
    )
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'possession'
        # un dev ne peut pas avoir deux fois la même compétence
        unique_together = ('developper', 'competence')


class SessionConnexion(models.Model):
    """
    Enregistre les informations sur chaque connexion pour détecter
    les connexions depuis un nouvel appareil
    """
    developper = models.ForeignKey(
        Developper,
        on_delete=models.CASCADE,
        related_name='sessions_connexion'
    )
    date_connexion = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()  # Navigateur et OS
    device_type = models.CharField(max_length=50, blank=True, null=True)  # Mobile, Desktop, Tablet
    browser = models.CharField(max_length=50, blank=True, null=True)
    os = models.CharField(max_length=50, blank=True, null=True)
    pays = models.CharField(max_length=100, blank=True, null=True)
    ville = models.CharField(max_length=100, blank=True, null=True)
    email_envoye = models.BooleanField(default=False)  # Pour éviter de spam

    class Meta:
        db_table = 'session_connexion'
        ordering = ['-date_connexion']
        indexes = [
            models.Index(fields=['developper', '-date_connexion']),
        ]
    
    def __str__(self):
        return f"{self.developper.email} - {self.device_type} - {self.date_connexion}"
