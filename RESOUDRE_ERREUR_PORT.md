# 🔧 Résoudre l'erreur EACCES port 5173/5174

## Problème

```
Error: listen EACCES: permission denied 127.0.0.1:5174
```

Cette erreur signifie que **Windows bloque Node.js** d'écouter sur le port.

---

## ✅ Solution 1 : Mode Administrateur (LE PLUS SIMPLE)

### Étapes :
1. **Ferme PowerShell**
2. **Ouvre le menu Démarrer**
3. **Tape "PowerShell"**
4. **Clique droit** sur "Windows PowerShell"
5. **"Exécuter en tant qu'administrateur"**
6. Dans le terminal admin :

```powershell
cd e:\Cadev\frontend
npm run dev
```

✅ Ça devrait fonctionner !

---

## ✅ Solution 2 : Autoriser Node.js dans le pare-feu

### Méthode A : Via Panneau de configuration

1. **Ouvre le Panneau de configuration**
2. **Système et sécurité** → **Pare-feu Windows Defender**
3. **Autoriser une application via le pare-feu**
4. **Modifier les paramètres** (bouton en haut)
5. **Autoriser une autre application...**
6. **Parcourir** et trouve :
   - `C:\Program Files\nodejs\node.exe`
   - Ou là où Node.js est installé
7. **Ajouter**
8. ✅ Coche **Privé** et **Public**
9. **OK**

### Méthode B : Via ligne de commande (Admin)

Dans PowerShell **en mode Administrateur** :

```powershell
# Autoriser Node.js dans le pare-feu
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
```

Puis relance :
```powershell
cd e:\Cadev\frontend
npm run dev
```

---

## ✅ Solution 3 : Utiliser un port > 1024

Les ports < 1024 nécessitent des privilèges admin. Utilisons un port plus élevé :

<function_calls>
<invoke name="str_replace">
<parameter name="path">e:\Cadev\frontend\vite.config.ts