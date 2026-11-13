# Exemple fil rouge cohérent pour TOUS les frameworks backend

## 🎯 Objectif
Utiliser **le même exemple de modèle Animal** dans tous les frameworks backend pour garantir la cohérence de l'apprentissage.

## 📊 Modèle Animal (cohérent dans tous les frameworks)

### Structure du modèle
```
Animal
  - id (auto-incrémenté, clé primaire)
  - nom (string, max 100 caractères)
  - espece (string, max 50 caractères)
  - age (integer)
  - disponible (boolean, défaut: true)
  - date_ajout (datetime, auto)
```

### Pourquoi Animal ?
✅ Simple et universel  
✅ Tous les types de champs (string, int, boolean, datetime)  
✅ Applicable à tous les frameworks  
✅ Facile à visualiser (zoo, refuge, clinique vétérinaire)  
✅ Permet CRUD complet  

---

## 🔄 Progression cohérente dans chaque framework

### Niveau Débutant
1. Introduction au framework
2. Structure du projet
3. Premier modèle : **Animal** (models.py)
4. Routes/URLs de base

### Niveau Intermédiaire
5. ORM : Créer des **Animaux**
6. CRUD complet avec **Animal** :
   - **Create** : Ajouter un animal
   - **Read** : Liste des animaux + Détail d'un animal
   - **Update** : Modifier un animal
   - **Delete** : Supprimer un animal

### Niveau Avancé
7. API REST avec **Animal** :
   - GET /api/animaux/ (liste)
   - GET /api/animaux/1/ (détail)
   - POST /api/animaux/ (créer)
   - PUT /api/animaux/1/ (modifier)
   - DELETE /api/animaux/1/ (supprimer)

---

## 💾 Implémentation par framework

### Django (Python)

#### models.py
```python
from django.db import models

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

#### views.py (CRUD)
```python
from django.shortcuts import render, get_object_or_404, redirect
from .models import Animal
from .forms import AnimalForm

# Read (Liste)
def liste_animaux(request):
    animaux = Animal.objects.all()
    return render(request, 'animaux/liste.html', {'animaux': animaux})

# Read (Détail)
def detail_animal(request, id):
    animal = get_object_or_404(Animal, id=id)
    return render(request, 'animaux/detail.html', {'animal': animal})

# Create
def creer_animal(request):
    if request.method == 'POST':
        form = AnimalForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('liste_animaux')
    else:
        form = AnimalForm()
    return render(request, 'animaux/form.html', {'form': form})

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
    return render(request, 'animaux/form.html', {'form': form, 'animal': animal})

# Delete
def supprimer_animal(request, id):
    animal = get_object_or_404(Animal, id=id)
    if request.method == 'POST':
        animal.delete()
        return redirect('liste_animaux')
    return render(request, 'animaux/confirm_delete.html', {'animal': animal})
```

#### urls.py
```python
from django.urls import path
from . import views

app_name = 'animaux'
urlpatterns = [
    path('', views.liste_animaux, name='liste'),
    path('<int:id>/', views.detail_animal, name='detail'),
    path('creer/', views.creer_animal, name='creer'),
    path('<int:id>/modifier/', views.modifier_animal, name='modifier'),
    path('<int:id>/supprimer/', views.supprimer_animal, name='supprimer'),
]
```

#### API REST (DRF)
```python
# serializers.py
from rest_framework import serializers
from .models import Animal

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'nom', 'espece', 'age', 'disponible', 'date_ajout']

# views.py (API)
from rest_framework import viewsets
from .models import Animal
from .serializers import AnimalSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

# urls.py (API)
from rest_framework.routers import DefaultRouter
from .views import AnimalViewSet

router = DefaultRouter()
router.register('animaux', AnimalViewSet, basename='animal')
urlpatterns = router.urls
```

---

### Express (Node.js + JavaScript)

#### Model (Sequelize ORM)
```javascript
// models/Animal.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  espece: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'date_ajout',
  updatedAt: false
});

module.exports = Animal;
```

#### Routes + Controllers (CRUD)
```javascript
// routes/animaux.js
const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');

// Read (Liste)
router.get('/', async (req, res) => {
  try {
    const animaux = await Animal.findAll();
    res.json(animaux);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read (Détail)
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal non trouvé' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal non trouvé' });
    }
    await animal.update(req.body);
    res.json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal non trouvé' });
    }
    await animal.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### Laravel (PHP)

#### Model (Eloquent)
```php
// app/Models/Animal.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Animal extends Model
{
    protected $fillable = ['nom', 'espece', 'age', 'disponible'];
    
    protected $casts = [
        'disponible' => 'boolean',
        'date_ajout' => 'datetime'
    ];
    
    const CREATED_AT = 'date_ajout';
    const UPDATED_AT = null;
}
```

#### Controller (CRUD)
```php
// app/Http/Controllers/AnimalController.php
namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    // Read (Liste)
    public function index()
    {
        $animaux = Animal::all();
        return view('animaux.index', compact('animaux'));
    }
    
    // Read (Détail)
    public function show($id)
    {
        $animal = Animal::findOrFail($id);
        return view('animaux.show', compact('animal'));
    }
    
    // Create (Form)
    public function create()
    {
        return view('animaux.create');
    }
    
    // Create (Store)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|max:100',
            'espece' => 'required|max:50',
            'age' => 'required|integer|min:0',
            'disponible' => 'boolean'
        ]);
        
        Animal::create($validated);
        return redirect()->route('animaux.index');
    }
    
    // Update (Form)
    public function edit($id)
    {
        $animal = Animal::findOrFail($id);
        return view('animaux.edit', compact('animal'));
    }
    
    // Update (Update)
    public function update(Request $request, $id)
    {
        $animal = Animal::findOrFail($id);
        $validated = $request->validate([
            'nom' => 'required|max:100',
            'espece' => 'required|max:50',
            'age' => 'required|integer|min:0',
            'disponible' => 'boolean'
        ]);
        
        $animal->update($validated);
        return redirect()->route('animaux.show', $id);
    }
    
    // Delete
    public function destroy($id)
    {
        $animal = Animal::findOrFail($id);
        $animal->delete();
        return redirect()->route('animaux.index');
    }
}
```

#### Routes
```php
// routes/web.php
use App\Http\Controllers\AnimalController;

Route::resource('animaux', AnimalController::class);

// API routes (routes/api.php)
Route::apiResource('animaux', AnimalController::class);
```

---

### Spring Boot (Java)

#### Entity (JPA)
```java
// src/main/java/com/example/demo/model/Animal.java
package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "animaux")
public class Animal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nom;
    
    @Column(nullable = false, length = 50)
    private String espece;
    
    @Column(nullable = false)
    private Integer age;
    
    @Column(nullable = false)
    private Boolean disponible = true;
    
    @Column(name = "date_ajout", updatable = false)
    private LocalDateTime dateAjout = LocalDateTime.now();
    
    // Getters and Setters
    // Constructors
}
```

#### Repository
```java
// src/main/java/com/example/demo/repository/AnimalRepository.java
package com.example.demo.repository;

import com.example.demo.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    // Spring Data JPA génère automatiquement les méthodes CRUD
}
```

#### Controller (REST API)
```java
// src/main/java/com/example/demo/controller/AnimalController.java
package com.example.demo.controller;

import com.example.demo.model.Animal;
import com.example.demo.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animaux")
public class AnimalController {
    
    @Autowired
    private AnimalRepository animalRepository;
    
    // Read (Liste)
    @GetMapping
    public List<Animal> getAllAnimaux() {
        return animalRepository.findAll();
    }
    
    // Read (Détail)
    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable Long id) {
        return animalRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Create
    @PostMapping
    public Animal createAnimal(@RequestBody Animal animal) {
        return animalRepository.save(animal);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Animal> updateAnimal(@PathVariable Long id, @RequestBody Animal animalDetails) {
        return animalRepository.findById(id)
            .map(animal -> {
                animal.setNom(animalDetails.getNom());
                animal.setEspece(animalDetails.getEspece());
                animal.setAge(animalDetails.getAge());
                animal.setDisponible(animalDetails.getDisponible());
                return ResponseEntity.ok(animalRepository.save(animal));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnimal(@PathVariable Long id) {
        return animalRepository.findById(id)
            .map(animal -> {
                animalRepository.delete(animal);
                return ResponseEntity.noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
```

---

## ✅ Avantages de cette approche

1. **Cohérence totale** : Même modèle dans tous les frameworks
2. **Transfert de compétences facile** : Si tu sais faire en Django, tu sais conceptuellement en Express
3. **Comparaison directe** : Compare facilement les syntaxes entre frameworks
4. **Progression claire** : Du modèle → CRUD → API REST dans tous les frameworks
5. **Exemples réalistes** : Un zoo/refuge est un cas d'usage compréhensible

---

## 📝 Application dans les cours

### Cours à mettre à jour avec Animal
1. ✅ Django (à faire)
2. ✅ Express/Node.js (à faire)
3. ✅ Laravel (à faire)
4. ✅ Spring Boot (à faire)

### Remplacement des exemples actuels
- Django : PROFILES → Animal, Task → Animal
- Autres : adapter tous les exemples vers Animal

---

**Date** : 12 novembre 2026  
**Validation** : En attente de l'approbation utilisateur avant mise en œuvre
