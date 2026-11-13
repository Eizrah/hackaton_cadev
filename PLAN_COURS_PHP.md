# 📋 PLAN DÉTAILLÉ - COURS PHP

## Structure globale

Le cours PHP suivra la structure des autres cours avec une spécificité pour le niveau avancé (backend uniquement).

---

## 🟢 NIVEAU DÉBUTANT (similaire Java/C++/Python)

### Chapitre 1 : Introduction à PHP
- Leçon : Qu'est-ce que PHP et déroulement formation

### Chapitre 2 : Variables et types
- Leçon 1 : Variables et types de données
- Leçon 2 : Opérateurs

### Chapitre 3 : Structures conditionnelles
- Leçon 1 : if, else, elseif
- Leçon 2 : switch

### Chapitre 4 : Boucles
- Leçon : for, while, foreach

### Chapitre 5 : Fonctions
- Leçon : Déclaration, paramètres, return

### Chapitre 6 : Tableaux
- Leçon : Tableaux indexés et associatifs

### Chapitre 7 : Gestion d'erreurs
- Leçon : try/catch/throw

### Chapitre 8 : Fichiers
- Leçon : Lire et écrire des fichiers

### Chapitre 9 : Exercice final
- Leçon : Mini-projet console

**Total débutant : 9 chapitres, ~15-20 leçons**

---

## 🟡 NIVEAU INTERMÉDIAIRE (similaire Java/C++/Python)

### Chapitre 1 : POO en PHP
- Leçon 1 : Classes et objets
- Leçon 2 : Héritage (simple en PHP)
- Leçon 3 : Interfaces et traits (alternative à héritage multiple)
- Leçon 4 : Visibilité (public, private, protected)

### Chapitre 2 : POO avancée
- Leçon 1 : Classes abstraites
- Leçon 2 : Méthodes magiques (__construct, __toString, etc.)
- Leçon 3 : Namespaces et autoloading

### Chapitre 3 : Tableaux et manipulation
- Leçon : Fonctions avancées tableaux (array_map, array_filter, etc.)

### Chapitre 4 : Dates et JSON
- Leçon 1 : DateTime et manipulation dates
- Leçon 2 : JSON (encode/decode)

### Chapitre 5 : Fichiers avancés
- Leçon : CSV, lectures complexes

### Chapitre 6 : Introduction bases de données
- Leçon : MySQL/SQLite avec mysqli de base

### Chapitre 7 : Exercice final
- Leçon : Projet console avec POO

**Total intermédiaire : 7 chapitres, ~12-15 leçons**

---

## 🔴 NIVEAU AVANCÉ (SPÉCIFIQUE PHP - Backend)

### ⭐ SPÉCIFICITÉ : POO vs PDO avant CRUD

### Chapitre 1 : POO en PHP - Approfondi
**Objectif :** Comprendre POO avant de l'appliquer aux bases de données

- Leçon 1 : Rappel POO et architecture
  - Classes métier (Model)
  - Encapsulation et getters/setters
  - Constructeur et initialisation

- Leçon 2 : Design patterns pour BD
  - Pattern DAO (Data Access Object)
  - Singleton pour connexion
  - Repository pattern

### Chapitre 2 : PDO - PHP Data Objects
**Objectif :** Maîtriser PDO avant le CRUD

- Leçon 1 : Introduction à PDO
  - Qu'est-ce que PDO ?
  - PDO vs mysqli (anciennes méthodes)
  - Connexion à SQLite avec PDO
  - Gestion des erreurs (PDO::ERRMODE_EXCEPTION)

- Leçon 2 : Requêtes préparées (PreparedStatements)
  - Pourquoi les prepared statements ?
  - Protection contre injection SQL
  - prepare() et execute()
  - bindParam() vs bindValue()
  - fetch(), fetchAll(), fetchColumn()

### Chapitre 3 : CRUD avec POO (approche orientée objet)
**Objectif :** CRUD en écrivant tout manuellement (POO pure)

- Leçon : CRUD SQLite avec POO
  - Classes métier (Produit, Client, etc.)
  - Classes DAO manuelles
  - Requêtes SQL écrites à la main
  - Pas de framework, pure PHP
  - Exemple complet : Gestionnaire de produits

### Chapitre 4 : CRUD avec PDO (approche procédurale/mixte)
**Objectif :** CRUD en utilisant PDO de manière plus directe

- Leçon : CRUD SQLite avec PDO
  - Utilisation directe de PDO
  - Moins d'abstraction que POO
  - Plus simple mais moins maintenable
  - Comparaison avec approche POO
  - Quand utiliser quelle approche ?

### Chapitre 5 : Différences POO vs PDO - Synthèse
**Objectif :** Comparer et choisir la bonne approche

- Leçon : POO vs PDO - Quelle approche choisir ?
  - POO : Organisation en classes, DAO, maintenabilité
  - PDO : Outil d'accès BD, utilisé DANS la POO
  - POO = architecture, PDO = technologie
  - Tableau comparatif
  - Recommandations selon projet
  - Les deux ne sont PAS opposés !

### Chapitre 6 : Projet Final
**Objectif :** Application backend complète

- Leçon : Projet : API REST simple avec PHP
  - API CRUD complète
  - Architecture POO + PDO
  - Réponses JSON
  - Gestion erreurs
  - Pas de framework (PHP pur)
  - Exemple : API de gestion de bibliothèque

**Total avancé : 6 chapitres, ~8-10 leçons**

---

## 📊 Comparaison avec les autres cours

| Aspect | Python/Java/C++ | PHP |
|--------|-----------------|-----|
| **Débutant** | Syntaxe de base | ✅ Identique |
| **Intermédiaire** | POO + Collections + BD | ✅ Identique |
| **Avancé** | GUI + SQLite + Projet desktop | Backend : POO vs PDO + CRUD + API REST |

---

## 🎯 Objectifs pédagogiques niveau avancé PHP

### Compétences acquises

1. ✅ Maîtriser POO en PHP pour architecture
2. ✅ Comprendre PDO comme outil d'accès BD
3. ✅ Distinguer POO (organisation) de PDO (technologie)
4. ✅ Implémenter CRUD avec les deux approches
5. ✅ Choisir la bonne approche selon contexte
6. ✅ Créer API REST sans framework
7. ✅ Gérer sécurité (prepared statements)
8. ✅ Architecture propre et maintenable

### Points clés

**POO (Programmation Orientée Objet) :**
- Architecture du code
- Classes, héritage, encapsulation
- Design patterns (DAO, Repository, Singleton)
- Organisation maintenable
- Utilisée AVEC PDO

**PDO (PHP Data Objects) :**
- Extension PHP pour accès BD
- Remplace mysqli (ancien)
- Prepared statements (sécurité)
- Support multi-BD (SQLite, MySQL, PostgreSQL)
- Outil utilisé DANS les classes POO

**La confusion à éviter :**
```
❌ FAUX : "POO vs PDO" comme si c'était l'un OU l'autre
✅ VRAI : "POO (architecture) + PDO (outil BD)"
```

---

## 💡 Spécificités PHP vs autres langages

### Similitudes
- Syntaxe proche de C/Java (accolades, point-virgule)
- POO complète (classes, héritage, interfaces)
- Gestion erreurs (try/catch)
- Base de données

### Différences
- Variables avec $ (obligatoire)
- Typage dynamique par défaut (PHP 7+ : types optionnels)
- Traits au lieu héritage multiple
- Namespaces avec \
- Pas de compilation (interprété)
- Idéal pour backend web

---

## 📚 Technologies couvertes

### Niveau Débutant
- PHP CLI
- Variables, conditions, boucles
- Fonctions
- Tableaux
- Fichiers

### Niveau Intermédiaire
- POO (classes, objets, héritage)
- Interfaces et traits
- Namespaces
- JSON
- DateTime
- Introduction BD

### Niveau Avancé
- POO avancée (design patterns)
- PDO (PHP Data Objects)
- SQLite
- Prepared statements
- Architecture DAO
- API REST JSON
- Sécurité (injection SQL)

---

## ✅ Validation du plan

Ce plan permet de :

1. ✅ Garder cohérence avec autres cours (débutant/intermédiaire)
2. ✅ Adapter niveau avancé à la spécificité PHP (backend)
3. ✅ Clarifier confusion POO vs PDO
4. ✅ Enseigner les deux approches CRUD
5. ✅ Préparer à Laravel (POO + PDO acquis)
6. ✅ Rester pratique (API REST finale)

---

**Prêt à implémenter ce plan ?** 🚀
