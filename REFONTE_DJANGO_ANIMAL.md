# Refonte complète du cours Django avec le modèle Animal

## 🎯 Objectif
Remplacer TOUS les exemples du cours Django par le modèle **Animal** (Débutant/Intermédiaire) et **Gardien/Animal/Regime** (Avancé).

## 📊 Mapping des remplacements

### Actuellement dans le cours
- **Niveau Débutant** : PROFILES dict (développeurs)
- **Niveau Intermédiaire** : 
  - Task (tâches à faire)
  - Listing/Product (annonces/produits)
- **Niveau Avancé** :
  - Post/Comment/Like (réseau social)
  - Product/Category (boutique)

### Nouveau avec Animal

#### Niveau Débutant
- **PROFILES** → **ANIMAUX** (dictionnaire Python simple)
  ```python
  ANIMAUX = {
      "simba": {"nom": "Simba", "espece": "Lion", "age": 5},
      "dumbo": {"nom": "Dumbo", "espece": "Éléphant", "age": 3},
      "nala": {"nom": "Nala", "espece": "Lionne", "age": 4},
  }
  ```

#### Niveau Intermédiaire
- **Task** → **Animal** (modèle Django complet)
  ```python
  class Animal(models.Model):
      nom = models.CharField(max_length=100)
      espece = models.CharField(max_length=50)
      age = models.IntegerField()
      disponible = models.BooleanField(default=True)
      date_ajout = models.DateTimeField(auto_now_add=True)
  ```
  
- CRUD complet :
  - Liste des animaux
  - Détail d'un animal
  - Ajouter un animal (formulaire)
  - Modifier un animal
  - Supprimer un animal

#### Niveau Avancé (Relations)
- **Post/Comment** → **Gardien/Animal** (ForeignKey)
  ```python
  class Gardien(models.Model):
      nom = models.CharField(max_length=100)
      email = models.EmailField()
      specialite = models.CharField(max_length=100)
  
  class Animal(models.Model):
      nom = models.CharField(max_length=100)
      espece = models.CharField(max_length=50)
      age = models.IntegerField()
      gardien = models.ForeignKey(
          Gardien, 
          on_delete=models.SET_NULL, 
          null=True,
          related_name='animaux'
      )
  ```

- **Post/Like (ManyToMany)** → **Animal/Regime** (ManyToMany)
  ```python
  class Regime(models.Model):
      nom = models.CharField(max_length=100)  # Carnivore, Herbivore, etc.
      description = models.TextField()
  
  class Animal(models.Model):
      # ... autres champs
      regimes = models.ManyToManyField(
          Regime, 
          related_name='animaux'
      )
  ```

- **Product/Category (boutique)** → On garde **Gardien/Animal** pour API REST
  - GET /api/gardiens/ (liste gardiens)
  - GET /api/animaux/ (liste animaux)
  - GET /api/animaux/1/ (détail animal)
  - POST /api/animaux/ (créer animal)
  - PUT /api/animaux/1/ (modifier)
  - DELETE /api/animaux/1/ (supprimer)

---

## 📝 Détail des changements par chapitre

### Chapitre 1 : Introduction Django ✅
**Pas de changement** (déjà fait avec les 2 nouvelles leçons intro)

### Chapitre 2 : Initialisation et architecture MTV
**Leçon "Du navigateur à Django"** :
- Remplacer l'exemple actuel par Animal
- Views simples : liste animaux (JSON), détail animal

**Leçon "Environnement virtuel, projet et application"** :
- Créer app `zoo` au lieu de `blog` ou `atelier`
- Premier modèle Animal simple

### Chapitre 3 : URLs et vues
**Leçon "Relier un chemin à une vue"** :
- Remplacer PROFILES dict par ANIMAUX dict
  ```python
  ANIMAUX = {
      "simba": {"nom": "Simba", "espece": "Lion", "age": 5},
      "dumbo": {"nom": "Dumbo", "espece": "Éléphant", "age": 3},
  }
  
  def liste_animaux(request):
      return render(request, 'zoo/liste.html', {'animaux': ANIMAUX.items()})
  
  def detail_animal(request, code):
      animal = ANIMAUX.get(code)
      if not animal:
          raise Http404("Animal introuvable")
      return render(request, 'zoo/detail.html', {'animal': animal})
  ```

- URLs :
  ```python
  path('', views.liste_animaux, name='liste'),
  path('<slug:code>/', views.detail_animal, name='detail'),
  ```

### Chapitre 4 : Templates Django
**Leçon "Afficher des données avec le DTL"** :
- Template liste :
  ```html
  <h1>Animaux du zoo</h1>
  <ul>
    {% for code, animal in animaux %}
      <li><a href="{% url 'detail' code %}">{{ animal.nom }}</a></li>
    {% endfor %}
  </ul>
  ```

- Template détail :
  ```html
  <h1>{{ animal.nom }}</h1>
  <p>Espèce : {{ animal.espece }}</p>
  <p>Âge : {{ animal.age }} ans</p>
  ```

**Leçon "Héritage de templates"** :
- Garder base.html avec menu
- Pages : liste animaux, détail animal

### Chapitre 5 : Modèles, migrations et ORM
**Leçon "Du modèle à la table SQLite"** :
- Créer le modèle Animal complet :
  ```python
  class Animal(models.Model):
      nom = models.CharField(max_length=100)
      espece = models.CharField(max_length=50)
      age = models.IntegerField()
      disponible = models.BooleanField(default=True)
      date_ajout = models.DateTimeField(auto_now_add=True)
      
      class Meta:
          ordering = ['-date_ajout']
      
      def __str__(self):
          return f"{self.nom} ({self.espece})"
  ```

**Leçon "Lire et filtrer avec l'ORM"** :
- Remplacer Task par Animal :
  ```python
  # Liste tous les animaux
  animaux = Animal.objects.all()
  
  # Filtrer animaux disponibles
  disponibles = Animal.objects.filter(disponible=True)
  
  # Trier par âge
  jeunes = Animal.objects.order_by('age')
  
  # Obtenir un animal spécifique
  animal = get_object_or_404(Animal, id=1)
  ```

### Chapitre 6 : Administration et CRUD
**Leçon "Configurer Django Admin"** :
- Enregistrer Animal dans admin :
  ```python
  from django.contrib import admin
  from .models import Animal
  
  @admin.register(Animal)
  class AnimalAdmin(admin.ModelAdmin):
      list_display = ['nom', 'espece', 'age', 'disponible', 'date_ajout']
      list_filter = ['espece', 'disponible']
      search_fields = ['nom', 'espece']
  ```

**Leçon "CRUD complet"** :
- Vues CRUD pour Animal :
  ```python
  # Create
  def creer_animal(request):
      if request.method == 'POST':
          form = AnimalForm(request.POST)
          if form.is_valid():
              form.save()
              return redirect('liste_animaux')
      else:
          form = AnimalForm()
      return render(request, 'zoo/form.html', {'form': form})
  
  # Read (Liste)
  def liste_animaux(request):
      animaux = Animal.objects.all()
      return render(request, 'zoo/liste.html', {'animaux': animaux})
  
  # Read (Détail)
  def detail_animal(request, id):
      animal = get_object_or_404(Animal, id=id)
      return render(request, 'zoo/detail.html', {'animal': animal})
  
  # Update
  def modifier_animal(request, id):
      animal = get_object_or_404(Animal, id=id)
      if request.method == 'POST':
          form = AnimalForm(request.POST, instance=animal)
          if form.is_valid():
              form.save()
              return redirect('detail_animal', id=animal.id)
      else:
          form = AnimalForm(instance=animal)
      return render(request, 'zoo/form.html', {'form': form, 'animal': animal})
  
  # Delete
  def supprimer_animal(request, id):
      animal = get_object_or_404(Animal, id=id)
      if request.method == 'POST':
          animal.delete()
          return redirect('liste_animaux')
      return render(request, 'zoo/confirm_delete.html', {'animal': animal})
  ```

### Chapitre 7 : Formulaires et sécurité CSRF
**Leçon "ModelForm"** :
- AnimalForm :
  ```python
  from django import forms
  from .models import Animal
  
  class AnimalForm(forms.ModelForm):
      class Meta:
          model = Animal
          fields = ['nom', 'espece', 'age', 'disponible']
          widgets = {
              'nom': forms.TextInput(attrs={'class': 'form-control'}),
              'espece': forms.TextInput(attrs={'class': 'form-control'}),
              'age': forms.NumberInput(attrs={'class': 'form-control'}),
          }
  ```

### Chapitre 8 : Relations et authentification (Avancé)
**Leçon "Clés étrangères et ManyToMany"** :
- Modèles avec relations :
  ```python
  class Gardien(models.Model):
      nom = models.CharField(max_length=100)
      email = models.EmailField(unique=True)
      specialite = models.CharField(max_length=100)
      
      def __str__(self):
          return self.nom
  
  class Regime(models.Model):
      nom = models.CharField(max_length=100)
      description = models.TextField()
      
      def __str__(self):
          return self.nom
  
  class Animal(models.Model):
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
          related_name='animaux'
      )
      
      # ManyToMany : Un animal a PLUSIEURS régimes, un régime pour PLUSIEURS animaux
      regimes = models.ManyToManyField(
          Regime,
          related_name='animaux',
          blank=True
      )
      
      def __str__(self):
          return f"{self.nom} ({self.espece})"
  ```

- Exemples de requêtes :
  ```python
  # ForeignKey : Tous les animaux d'un gardien
  gardien = Gardien.objects.get(nom="Marie")
  animaux_marie = gardien.animaux.all()
  
  # ManyToMany : Tous les régimes d'un animal
  simba = Animal.objects.get(nom="Simba")
  regimes_simba = simba.regimes.all()
  
  # ManyToMany : Tous les animaux carnivores
  carnivore = Regime.objects.get(nom="Carnivore")
  animaux_carnivores = carnivore.animaux.all()
  
  # Ajouter un régime à un animal
  simba.regimes.add(carnivore)
  
  # Créer un animal avec gardien
  Animal.objects.create(
      nom="Dumbo",
      espece="Éléphant",
      age=3,
      gardien=gardien
  )
  ```

### Chapitre 9 : API REST avec DRF
**Leçon "Serializers DRF"** :
- Serializers pour Animal, Gardien, Regime :
  ```python
  from rest_framework import serializers
  from .models import Animal, Gardien, Regime
  
  class GardienSerializer(serializers.ModelSerializer):
      animaux_count = serializers.IntegerField(
          source='animaux.count', 
          read_only=True
      )
      
      class Meta:
          model = Gardien
          fields = ['id', 'nom', 'email', 'specialite', 'animaux_count']
  
  class RegimeSerializer(serializers.ModelSerializer):
      class Meta:
          model = Regime
          fields = ['id', 'nom', 'description']
  
  class AnimalSerializer(serializers.ModelSerializer):
      gardien_nom = serializers.CharField(
          source='gardien.nom', 
          read_only=True
      )
      regimes = RegimeSerializer(many=True, read_only=True)
      
      class Meta:
          model = Animal
          fields = [
              'id', 'nom', 'espece', 'age', 'disponible',
              'date_ajout', 'gardien', 'gardien_nom', 'regimes'
          ]
          read_only_fields = ['date_ajout']
  ```

**Leçon "ViewSets et Permissions"** :
- ViewSets pour API complète :
  ```python
  from rest_framework import viewsets
  from rest_framework.permissions import IsAuthenticatedOrReadOnly
  from .models import Animal, Gardien, Regime
  from .serializers import AnimalSerializer, GardienSerializer, RegimeSerializer
  
  class GardienViewSet(viewsets.ModelViewSet):
      queryset = Gardien.objects.all()
      serializer_class = GardienSerializer
      permission_classes = [IsAuthenticatedOrReadOnly]
  
  class RegimeViewSet(viewsets.ModelViewSet):
      queryset = Regime.objects.all()
      serializer_class = RegimeSerializer
      permission_classes = [IsAuthenticatedOrReadOnly]
  
  class AnimalViewSet(viewsets.ModelViewSet):
      queryset = Animal.objects.select_related('gardien').prefetch_related('regimes')
      serializer_class = AnimalSerializer
      permission_classes = [IsAuthenticatedOrReadOnly]
      
      def get_queryset(self):
          queryset = super().get_queryset()
          # Filtrer par espèce si paramètre fourni
          espece = self.request.query_params.get('espece')
          if espece:
              queryset = queryset.filter(espece__icontains=espece)
          return queryset
  ```

- URLs (Router DRF) :
  ```python
  from rest_framework.routers import DefaultRouter
  from .api import AnimalViewSet, GardienViewSet, RegimeViewSet
  
  router = DefaultRouter()
  router.register('animaux', AnimalViewSet, basename='animal')
  router.register('gardiens', GardienViewSet, basename='gardien')
  router.register('regimes', RegimeViewSet, basename='regime')
  
  urlpatterns = router.urls
  ```

### Chapitre 10 : Optimisation (Avancé)
**Leçon "Requêtes N+1"** :
- Optimiser avec select_related et prefetch_related :
  ```python
  # Mauvais : N+1 requêtes
  animaux = Animal.objects.all()
  for animal in animaux:
      print(animal.gardien.nom)  # 1 requête par animal !
  
  # Bon : 2 requêtes seulement
  animaux = Animal.objects.select_related('gardien').all()
  for animal in animaux:
      print(animal.gardien.nom)  # Pas de requête supplémentaire
  
  # Avec ManyToMany
  animaux = Animal.objects.prefetch_related('regimes').all()
  for animal in animaux:
      for regime in animal.regimes.all():  # Pas de requête supplémentaire
          print(regime.nom)
  ```

---

## ✅ Avantages de cette refonte

1. **Cohérence totale** : Un seul modèle (Animal) du début à la fin
2. **Progression naturelle** : Dict Python → Modèle Django → Relations → API
3. **Exemples réalistes** : Zoo/refuge est un cas concret et compréhensible
4. **Facilite l'apprentissage** : Pas besoin de comprendre un nouveau domaine à chaque leçon
5. **Réutilisable** : Même logique applicable à Express, Laravel, Spring Boot

---

## ⚠️ Ampleur du travail

- **~1500 lignes** à réécrire dans djangoCourse.ts
- **Tous les exemples de code** à remplacer
- **Tous les templates HTML** à adapter
- **Toutes les tâches pratiques** à reformuler

---

## ❓ Confirmation avant de commencer

**Veux-tu que je procède à cette refonte complète du cours Django ?**

- ✅ **OUI** : Je remplace TOUT avec Animal/Gardien/Regime
- ❌ **NON** : On garde l'existant et on passe directement aux autres frameworks

Si OUI, le travail prendra du temps car c'est une réécriture complète, mais le résultat sera parfaitement cohérent ! 🎯
