# 🔍 DEBUG - Photos et Profil

## Test 1 : Vérifier que l'API de recherche retourne les photos

**Commande à exécuter dans le terminal Django :**
```bash
curl http://localhost:8000/api/auth/rechercher/?q=24 -H "Authorization: Bearer TON_TOKEN_ICI"
```

**Résultat attendu :**
```json
[
  {
    "pseudo": "24Eizrah44",
    "email": "eizrahfdr@gmail.com",
    "photoprofil": "profil_pictures/profil_KaeBtE3.jpg"
  }
]
```

---

## Test 2 : Vérifier que l'API du profil membre fonctionne

**Commande à exécuter :**
```bash
curl http://localhost:8000/api/auth/profil/membre/eizrahfdr@gmail.com/ -H "Authorization: Bearer TON_TOKEN_ICI"
```

**Résultat attendu :**
```json
{
  "identifiant": "...",
  "email": "eizrahfdr@gmail.com",
  "pseudo": "24Eizrah44",
  "photoprofil": "/media/profil_pictures/profil_KaeBtE3.jpg",
  ...
}
```

---

## Test 3 : Vérifier que les photos sont accessibles

**URL à tester dans le navigateur :**
```
http://localhost:8000/media/profil_pictures/profil_KaeBtE3.jpg
```

**Résultat attendu :** L'image s'affiche

---

## Checklist Frontend

### Dans la console du navigateur (F12), vérifie :

1. **Requête de recherche**
   - Va dans l'onglet Network
   - Tape "24" dans la barre de recherche
   - Cherche la requête `/api/auth/rechercher/?q=24`
   - Vérifie la réponse contient `photoprofil`

2. **Console d'erreurs**
   - Ouvre l'onglet Console
   - Cherche des erreurs rouges
   - Particulièrement des erreurs 404 ou CORS

3. **Affichage des images**
   - Onglet Elements
   - Cherche `<img class="avatar-img"`
   - Vérifie l'attribut `src`
   - Devrait être `http://localhost:8000/media/profil_pictures/...`

---

## Actions à faire MAINTENANT

### 1. Vider COMPLÈTEMENT le cache
- F12 (DevTools)
- Onglet **Application**
- Section **Storage** → **Clear storage**
- Cocher **tout**
- Cliquer **"Clear site data"**
- Recharger la page

### 2. Vérifier la console
- F12 → Console
- Chercher des erreurs
- Me les copier si tu en vois

### 3. Tester l'URL du profil membre
Dans le navigateur, va sur :
```
http://localhost:5173/#workspace/profil/membre/eizrahfdr@gmail.com
```

---

## Problèmes possibles

### Si les photos ne s'affichent toujours pas :

**Problème 1 : CORS**
- Les images sont bloquées par la politique CORS
- Solution : Vérifier `settings.py` → `CORS_ALLOW_ALL_ORIGINS`

**Problème 2 : URL incorrecte**
- Le chemin de l'image est mal construit
- Vérifier dans la console Network la vraie URL demandée

**Problème 3 : Fichier manquant**
- La photo n'existe pas physiquement
- Vérifier dans `backend/Bcadev/media/profil_pictures/`

---

## Si "Membre introuvable" persiste

### Vérifier l'ordre des routes
Le fichier `backend/Bcadev/Accounts/urls.py` doit avoir cet ordre :

```python
path('profil/infos/', ...),
path('profil/email-pseudo/', ...),
path('profil/mot-de-passe/', ...),
path('profil/membre/<str:membre>/', ProfilMembreView.as_view()),  # ← AVANT profil/
path('profil/', ProfilView.as_view()),  # ← APRÈS profil/membre/
```

✅ **J'ai déjà corrigé ça dans le code**

---

## IMPORTANT

Le serveur Django a redémarré à **12:55:27**.

**Tu DOIS** :
1. ✅ Vider le cache du navigateur
2. ✅ Recharger la page `localhost:5173`
3. ✅ Tester à nouveau

Sans vider le cache, tu verras l'ancien JavaScript qui n'a pas les nouvelles modifications !
