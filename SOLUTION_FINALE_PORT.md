# 🎯 Solution finale : Autoriser Node.js et utiliser le port 5173

## ✅ Étapes à suivre (dans l'ordre)

### Étape 1 : Réactiver le pare-feu Windows

**Dans PowerShell en mode Administrateur** :

```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

### Étape 2 : Autoriser Node.js dans le pare-feu

**Option A : Utiliser le script automatique (RECOMMANDÉ)**

1. **Ouvre PowerShell en mode Administrateur** (clique droit → "Exécuter en tant qu'administrateur")
2. **Va dans le dossier** :
   ```powershell
   cd e:\Cadev
   ```
3. **Autorise l'exécution de scripts** (une seule fois) :
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. **Lance le script** :
   ```powershell
   .\AUTORISER_NODEJS_PAREFEU.ps1
   ```

✅ **Node.js est maintenant autorisé sur les ports 5173, 8080 et 3000 !**

---

**Option B : Manuellement via interface graphique**

1. **Ouvre le menu Démarrer**
2. **Tape** "Pare-feu Windows Defender"
3. **Paramètres avancés** (dans le menu de gauche)
4. **Règles de trafic entrant** (à gauche)
5. **Nouvelle règle...** (à droite)
6. **Programme** → **Suivant**
7. **Parcourir** et trouve :
   - `C:\Program Files\nodejs\node.exe`
   - Ou tape `where node` dans PowerShell pour trouver le chemin
8. **Autoriser la connexion** → **Suivant**
9. ✅ **Coche** : Domaine, Privé, Public
10. **Nom** : "Node.js Server"
11. **Terminer**

---

**Option C : Via ligne de commande (PowerShell Admin)**

```powershell
# Trouver le chemin de Node.js
$nodePath = (Get-Command node).Path
Write-Host "Node.js trouvé : $nodePath"

# Créer la règle de pare-feu
New-NetFirewallRule -DisplayName "Node.js Server" `
    -Direction Inbound `
    -Program $nodePath `
    -Action Allow `
    -Profile Domain,Private,Public `
    -Protocol TCP `
    -LocalPort 5173,8080,3000
```

---

### Étape 3 : Lancer le frontend (port 5173)

**Dans PowerShell normal** (plus besoin d'admin maintenant !) :

```powershell
cd e:\Cadev\frontend
npm run dev
```

✅ **Le serveur devrait démarrer sur http://localhost:5173**

---

### Étape 4 : Lancer le backend Django

**Dans un autre terminal PowerShell** :

```powershell
cd e:\Cadev\backend\Bcadev
python manage.py runserver
```

✅ **Django tourne sur http://localhost:8000**

---

## 🧪 Tester la connexion

1. **Ouvre** http://localhost:5173 dans ton navigateur
2. **Tu devrais voir** la page d'accueil DevAfrica Connect
3. **Connecte-toi** avec ton compte
4. ✅ **Ça devrait fonctionner !**

---

## 🔍 Vérifier que Node.js est autorisé

```powershell
# Liste les règles de pare-feu pour Node.js
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Node*"} | Select-Object DisplayName, Enabled, Direction
```

Tu devrais voir :
```
DisplayName      Enabled Direction
-----------      ------- ---------
Node.js Server      True   Inbound
Node.js Outbound    True   Outbound
```

---

## ⚠️ Si ça ne marche toujours pas

### Problème 1 : Antivirus tiers

Si tu utilises **Norton, McAfee, Avast, Kaspersky, etc.** :
1. Ouvre l'antivirus
2. Paramètres → Pare-feu
3. Ajoute `node.exe` aux exceptions

### Problème 2 : Port déjà utilisé

Vérifier qui utilise le port :
```powershell
netstat -ano | findstr :5173
```

Si quelque chose apparaît, tue le processus :
```powershell
taskkill /F /PID <numéro_du_PID>
```

### Problème 3 : Permissions insuffisantes

Essaie de lancer PowerShell **en mode Administrateur** pour `npm run dev`.

---

## 📝 Configuration finale

### Frontend (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
})
```

### Backend (settings.py)
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",   # Frontend Vite
]
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_AUTH_MODE=api
VITE_AGENT_MODE=api
```

---

## ✅ Checklist finale

- [ ] Pare-feu réactivé
- [ ] Node.js autorisé dans le pare-feu
- [ ] Port 5173 configuré dans vite.config.ts
- [ ] Django CORS configuré pour 5173
- [ ] Frontend démarre : `npm run dev`
- [ ] Backend démarre : `python manage.py runserver`
- [ ] Connexion fonctionne

---

## 🎉 Résumé rapide

**Le problème** : Pare-feu Windows bloquait Node.js sur tous les ports

**La solution** :
1. ✅ Réactiver le pare-feu
2. ✅ Autoriser Node.js explicitement
3. ✅ Utiliser le port 5173 (attendu par Django)
4. ✅ Lancer frontend et backend

**Commande magique** (PowerShell Admin) :
```powershell
# Va dans le projet
cd e:\Cadev

# Autorise Node.js
.\AUTORISER_NODEJS_PAREFEU.ps1

# Lance tout (dans 2 terminaux normaux)
# Terminal 1 :
cd frontend ; npm run dev

# Terminal 2 :
cd backend\Bcadev ; python manage.py runserver
```

---

**Besoin d'aide ?** Dis-moi à quelle étape ça bloque ! 🚀
