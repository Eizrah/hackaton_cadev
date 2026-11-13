# Code Django avec modèle Animal - Refonte partielle

## Leçon : Modèles et ORM (Intermédiaire)

### models.py
```python
from django.db import models

class Animal(models.Model):
    """Modèle représentant un animal dans un zoo ou refuge"""
    nom = models.CharField(max_length=100, help_text="Nom de l'animal")
    espece = models.CharField(max_length=50, help_text="Espèce (Lion, Éléphant, etc.)")
    age = models.IntegerField(help_text="Âge en années")
    disponible = models.BooleanField(
        default=True,
        help_text="L'animal est-il disponible pour adoption ?"
    )
    date_ajout = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_ajout']
        verbose_name = "Animal"
        verbose_name_plural = "Animaux"
    
    def __str__(self):
        return f"{self.nom} ({self.espece}, {self.age} ans)"
```

### admin.py
```python
from django.contrib import admin
from .models import Animal

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ['nom', 'espece', 'age', 'disponible', 'date_ajout']
    list_filter = ['espece', 'disponible', 'date_ajout']
    search_fields = ['nom', 'espece']
    list_editable = ['disponible']
    date_hierarchy = 'date_ajout'
```

### views.py (CRUD complet)
```python
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Animal
from .forms import AnimalForm

# Create - Ajouter un animal
def creer_animal(request):
    if request.method == 'POST':
        form = AnimalForm(request.POST)
        if form.is_valid():
            animal = form.save()
            messages.success(request, f"{animal.nom} a été ajouté avec succès !")
            return redirect('detail_animal', id=animal.id)
    else:
        form = AnimalForm()
    
    return render(request, 'zoo/form.html', {
        'form': form,
        'titre': 'Ajouter un animal'
    })

# Read - Liste des animaux
def liste_animaux(request):
    # Filtres optionnels
    espece = request.GET.get('espece')
    disponible = request.GET.get('disponible')
    
    animaux = Animal.objects.all()
    
    if espece:
        animaux = animaux.filter(espece__icontains=espece)
    if disponible == 'oui':
        animaux = animaux.filter(disponible=True)
    elif disponible == 'non':
        animaux = animaux.filter(disponible=False)
    
    return render(request, 'zoo/liste.html', {
        'animaux': animaux,
        'total': animaux.count()
    })

# Read - Détail d'un animal
def detail_animal(request, id):
    animal = get_object_or_404(Animal, id=id)
    return render(request, 'zoo/detail.html', {'animal': animal})

# Update - Modifier un animal
def modifier_animal(request, id):
    animal = get_object_or_404(Animal, id=id)
    
    if request.method == 'POST':
        form = AnimalForm(request.POST, instance=animal)
        if form.is_valid():
            form.save()
            messages.success(request, f"{animal.nom} a été modifié avec succès !")
            return redirect('detail_animal', id=animal.id)
    else:
        form = AnimalForm(instance=animal)
    
    return render(request, 'zoo/form.html', {
        'form': form,
        'animal': animal,
        'titre': f'Modifier {animal.nom}'
    })

# Delete - Supprimer un animal
def supprimer_animal(request, id):
    animal = get_object_or_404(Animal, id=id)
    
    if request.method == 'POST':
        nom = animal.nom
        animal.delete()
        messages.success(request, f"{nom} a été supprimé avec succès.")
        return redirect('liste_animaux')
    
    return render(request, 'zoo/confirm_delete.html', {'animal': animal})
```

### urls.py
```python
from django.urls import path
from . import views

app_name = 'zoo'

urlpatterns = [
    # Liste et détail
    path('', views.liste_animaux, name='liste_animaux'),
    path('animaux/<int:id>/', views.detail_animal, name='detail_animal'),
    
    # CRUD
    path('animaux/ajouter/', views.creer_animal, name='creer_animal'),
    path('animaux/<int:id>/modifier/', views.modifier_animal, name='modifier_animal'),
    path('animaux/<int:id>/supprimer/', views.supprimer_animal, name='supprimer_animal'),
]
```

### forms.py
```python
from django import forms
from .models import Animal

class AnimalForm(forms.ModelForm):
    class Meta:
        model = Animal
        fields = ['nom', 'espece', 'age', 'disponible']
        widgets = {
            'nom': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ex: Simba'
            }),
            'espece': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ex: Lion'
            }),
            'age': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'max': 100
            }),
            'disponible': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }
        labels = {
            'nom': 'Nom de l\'animal',
            'espece': 'Espèce',
            'age': 'Âge (en années)',
            'disponible': 'Disponible pour adoption'
        }
        help_texts = {
            'age': 'Indiquez l\'âge en années complètes',
            'disponible': 'Cochez si l\'animal peut être adopté'
        }
    
    def clean_age(self):
        age = self.cleaned_data.get('age')
        if age < 0:
            raise forms.ValidationError("L'âge ne peut pas être négatif.")
        if age > 100:
            raise forms.ValidationError("L'âge semble trop élevé.")
        return age
```

---

## Leçon : Relations (Avancé)

### models.py (avec relations)
```python
from django.db import models

class Gardien(models.Model):
    """Gardien qui s'occupe des animaux"""
    nom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    specialite = models.CharField(
        max_length=100,
        help_text="Spécialité du gardien (Félins, Primates, etc.)"
    )
    date_embauche = models.DateField(auto_now_add=True)
    
    class Meta:
        ordering = ['nom']
        verbose_name = "Gardien"
        verbose_name_plural = "Gardiens"
    
    def __str__(self):
        return f"{self.nom} ({self.specialite})"

class Regime(models.Model):
    """Régime alimentaire des animaux"""
    nom = models.CharField(
        max_length=100,
        unique=True,
        help_text="Type de régime (Carnivore, Herbivore, Omnivore, etc.)"
    )
    description = models.TextField()
    
    class Meta:
        ordering = ['nom']
        verbose_name = "Régime alimentaire"
        verbose_name_plural = "Régimes alimentaires"
    
    def __str__(self):
        return self.nom

class Animal(models.Model):
    """Modèle représentant un animal dans un zoo"""
    nom = models.CharField(max_length=100)
    espece = models.CharField(max_length=50)
    age = models.IntegerField()
    disponible = models.BooleanField(default=True)
    date_ajout = models.DateTimeField(auto_now_add=True)
    
    # ForeignKey : Un animal a UN gardien, un gardien a PLUSIEURS animaux
    gardien = models.ForeignKey(
        Gardien,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='animaux',
        help_text="Gardien responsable de cet animal"
    )
    
    # ManyToMany : Un animal a PLUSIEURS régimes, un régime pour PLUSIEURS animaux
    regimes = models.ManyToManyField(
        Regime,
        related_name='animaux',
        blank=True,
        help_text="Régimes alimentaires de cet animal"
    )
    
    class Meta:
        ordering = ['-date_ajout']
        verbose_name = "Animal"
        verbose_name_plural = "Animaux"
    
    def __str__(self):
        return f"{self.nom} ({self.espece})"

# Exemples de requêtes pour comprendre les relations :

# ForeignKey (One-to-Many)
# ---------------------
# Tous les animaux d'un gardien :
gardien = Gardien.objects.get(nom="Marie")
animaux_marie = gardien.animaux.all()

# Le gardien d'un animal :
simba = Animal.objects.get(nom="Simba")
gardien_simba = simba.gardien

# Filtrer les animaux par gardien :
animaux = Animal.objects.filter(gardien__nom="Marie")

# ManyToMany
# ----------
# Tous les régimes d'un animal :
simba = Animal.objects.get(nom="Simba")
regimes_simba = simba.regimes.all()

# Tous les animaux ayant un régime spécifique :
carnivore = Regime.objects.get(nom="Carnivore")
animaux_carnivores = carnivore.animaux.all()

# Ajouter un régime à un animal :
simba.regimes.add(carnivore)

# Retirer un régime :
simba.regimes.remove(carnivore)

# Filtrer les animaux par régime :
animaux = Animal.objects.filter(regimes__nom="Carnivore")
```

---

## Leçon : API REST avec DRF (Avancé)

### serializers.py
```python
from rest_framework import serializers
from .models import Animal, Gardien, Regime

class GardienSerializer(serializers.ModelSerializer):
    """Serializer pour les gardiens"""
    nombre_animaux = serializers.IntegerField(
        source='animaux.count',
        read_only=True
    )
    
    class Meta:
        model = Gardien
        fields = ['id', 'nom', 'email', 'specialite', 'date_embauche', 'nombre_animaux']
        read_only_fields = ['date_embauche']

class RegimeSerializer(serializers.ModelSerializer):
    """Serializer pour les régimes alimentaires"""
    class Meta:
        model = Regime
        fields = ['id', 'nom', 'description']

class AnimalListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste d'animaux"""
    gardien_nom = serializers.CharField(source='gardien.nom', read_only=True)
    
    class Meta:
        model = Animal
        fields = ['id', 'nom', 'espece', 'age', 'disponible', 'gardien_nom']

class AnimalDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un animal"""
    gardien = GardienSerializer(read_only=True)
    gardien_id = serializers.PrimaryKeyRelatedField(
        queryset=Gardien.objects.all(),
        source='gardien',
        write_only=True,
        required=False
    )
    regimes = RegimeSerializer(many=True, read_only=True)
    regime_ids = serializers.PrimaryKeyRelatedField(
        queryset=Regime.objects.all(),
        many=True,
        source='regimes',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Animal
        fields = [
            'id', 'nom', 'espece', 'age', 'disponible', 'date_ajout',
            'gardien', 'gardien_id', 'regimes', 'regime_ids'
        ]
        read_only_fields = ['date_ajout']
```

### views.py (API ViewSets)
```python
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Animal, Gardien, Regime
from .serializers import (
    AnimalListSerializer, 
    AnimalDetailSerializer,
    GardienSerializer,
    RegimeSerializer
)

class GardienViewSet(viewsets.ModelViewSet):
    """
    API pour gérer les gardiens.
    
    Liste : GET /api/gardiens/
    Détail : GET /api/gardiens/1/
    Créer : POST /api/gardiens/
    Modifier : PUT /api/gardiens/1/
    Supprimer : DELETE /api/gardiens/1/
    """
    queryset = Gardien.objects.annotate(
        nombre_animaux=models.Count('animaux')
    )
    serializer_class = GardienSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'specialite']
    ordering_fields = ['nom', 'date_embauche']
    ordering = ['nom']

class RegimeViewSet(viewsets.ModelViewSet):
    """
    API pour gérer les régimes alimentaires.
    """
    queryset = Regime.objects.all()
    serializer_class = RegimeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom']

class AnimalViewSet(viewsets.ModelViewSet):
    """
    API complète pour gérer les animaux.
    
    Endpoints principaux :
    - Liste : GET /api/animaux/
    - Détail : GET /api/animaux/1/
    - Créer : POST /api/animaux/
    - Modifier : PUT /api/animaux/1/
    - Supprimer : DELETE /api/animaux/1/
    
    Filtres disponibles :
    - ?espece=Lion
    - ?disponible=true
    - ?gardien=1
    - ?search=Simba
    """
    queryset = Animal.objects.select_related('gardien').prefetch_related('regimes')
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Filtres et recherche
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['espece', 'disponible', 'gardien']
    search_fields = ['nom', 'espece']
    ordering_fields = ['nom', 'age', 'date_ajout']
    ordering = ['-date_ajout']
    
    def get_serializer_class(self):
        """Utilise un serializer différent pour la liste et le détail"""
        if self.action == 'list':
            return AnimalListSerializer
        return AnimalDetailSerializer
    
    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """
        Endpoint custom : GET /api/animaux/disponibles/
        Retourne seulement les animaux disponibles pour adoption.
        """
        animaux = self.get_queryset().filter(disponible=True)
        serializer = self.get_serializer(animaux, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def adopter(self, request, pk=None):
        """
        Endpoint custom : POST /api/animaux/1/adopter/
        Marque un animal comme adopté (disponible=False).
        """
        animal = self.get_object()
        animal.disponible = False
        animal.save()
        serializer = self.get_serializer(animal)
        return Response({
            'message': f'{animal.nom} a été adopté !',
            'animal': serializer.data
        })
```

### urls.py (API)
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnimalViewSet, GardienViewSet, RegimeViewSet

# Router DRF pour générer les URLs automatiquement
router = DefaultRouter()
router.register('animaux', AnimalViewSet, basename='animal')
router.register('gardiens', GardienViewSet, basename='gardien')
router.register('regimes', RegimeViewSet, basename='regime')

urlpatterns = [
    path('api/', include(router.urls)),
]

# URLs générées automatiquement :
# GET    /api/animaux/              - Liste des animaux
# POST   /api/animaux/              - Créer un animal
# GET    /api/animaux/1/            - Détail d'un animal
# PUT    /api/animaux/1/            - Modifier un animal
# PATCH  /api/animaux/1/            - Modifier partiellement
# DELETE /api/animaux/1/            - Supprimer un animal
# GET    /api/animaux/disponibles/  - Custom action
# POST   /api/animaux/1/adopter/    - Custom action

# GET    /api/gardiens/             - Liste des gardiens
# GET    /api/regimes/              - Liste des régimes
```

### Exemples de requêtes API

```bash
# GET - Liste des animaux
GET /api/animaux/

# GET - Filtrer par espèce
GET /api/animaux/?espece=Lion

# GET - Animaux disponibles
GET /api/animaux/?disponible=true

# GET - Rechercher par nom
GET /api/animaux/?search=Simba

# GET - Détail d'un animal
GET /api/animaux/1/

# POST - Créer un animal
POST /api/animaux/
{
  "nom": "Dumbo",
  "espece": "Éléphant",
  "age": 3,
  "disponible": true,
  "gardien_id": 1,
  "regime_ids": [1, 2]
}

# PUT - Modifier un animal
PUT /api/animaux/1/
{
  "nom": "Simba",
  "espece": "Lion",
  "age": 6,
  "disponible": false,
  "gardien_id": 2
}

# DELETE - Supprimer un animal
DELETE /api/animaux/1/

# POST - Marquer comme adopté (custom action)
POST /api/animaux/1/adopter/
```

---

## Tests unitaires (Bonus)

### tests.py
```python
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Animal, Gardien, Regime

class AnimalModelTest(TestCase):
    """Tests du modèle Animal"""
    
    def setUp(self):
        self.gardien = Gardien.objects.create(
            nom="Marie",
            email="marie@zoo.com",
            specialite="Félins"
        )
        self.regime = Regime.objects.create(
            nom="Carnivore",
            description="Régime à base de viande"
        )
    
    def test_creation_animal(self):
        """Test de création d'un animal"""
        animal = Animal.objects.create(
            nom="Simba",
            espece="Lion",
            age=5,
            gardien=self.gardien
        )
        animal.regimes.add(self.regime)
        
        self.assertEqual(animal.nom, "Simba")
        self.assertEqual(animal.gardien.nom, "Marie")
        self.assertEqual(animal.regimes.count(), 1)
        self.assertTrue(animal.disponible)
    
    def test_str_animal(self):
        """Test de la représentation string"""
        animal = Animal.objects.create(
            nom="Simba",
            espece="Lion",
            age=5
        )
        self.assertEqual(str(animal), "Simba (Lion)")

class AnimalAPITest(APITestCase):
    """Tests de l'API REST"""
    
    def setUp(self):
        self.gardien = Gardien.objects.create(
            nom="Marie",
            email="marie@zoo.com",
            specialite="Félins"
        )
        self.animal = Animal.objects.create(
            nom="Simba",
            espece="Lion",
            age=5,
            gardien=self.gardien
        )
    
    def test_get_liste_animaux(self):
        """Test GET liste des animaux"""
        url = reverse('animal-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_get_detail_animal(self):
        """Test GET détail d'un animal"""
        url = reverse('animal-detail', args=[self.animal.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], "Simba")
    
    def test_create_animal(self):
        """Test POST créer un animal"""
        url = reverse('animal-list')
        data = {
            'nom': 'Dumbo',
            'espece': 'Éléphant',
            'age': 3,
            'gardien_id': self.gardien.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Animal.objects.count(), 2)
```

---

**Prêt pour l'implémentation !** 🚀

Ce code est prêt à être intégré dans le cours Django. Veux-tu que je l'intègre maintenant dans djangoCourse.ts ?
