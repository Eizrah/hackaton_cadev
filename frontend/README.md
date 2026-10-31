# DevAfrica Connect — frontend du hackathon

Version des interfaces : 31 octobre 2026.

L’accueil garde son dégradé bleu/cyan. L’authentification reprend désormais la maquette claire fournie : carte blanche, fond bleu pâle, boutons bleus et illustration du développeur à droite sur ordinateur. L’espace communautaire conserve son menu bleu vertical, ses profils translucides et son catalogue d’apprentissage à cartes colorées. La messagerie suit une disposition à trois colonnes.

## Démarrer dans VS Code sous Windows

1. Conserver une copie de l’ancien projet.
2. Extraire le ZIP et ouvrir dans VS Code le dossier `frontend` **qui contient `package.json`**.
3. Ouvrir **Terminal → Nouveau terminal**.
4. Installer les dépendances, puis lancer le serveur :

```bash
npm ci
npm run dev
```

Ouvrir l’adresse affichée dans le terminal, habituellement `http://localhost:5173`. Garder le terminal ouvert. Ne pas ouvrir `index.html` par double-clic.

Si PowerShell bloque `npm.ps1`, utiliser `npm.cmd ci` puis `npm.cmd run dev`, ou choisir **Command Prompt** comme terminal VS Code. Pas besoin de modifier la sécurité Windows.

Le projet a été vérifié avec Node 24.22.1. `node -v` affiche ta version. `node_modules` est volontairement absent du ZIP ; `npm ci` installe les versions du lockfile sur chaque machine. Aucun nouveau package applicatif n’est nécessaire pour ces interfaces.

## Comprendre les outils

| Outil | Son rôle |
| --- | --- |
| VS Code | Éditeur des fichiers du projet. |
| Node.js / npm | Exécution des outils, installation des paquets et commandes. |
| React | Assemblage de composants, mise à jour de l’écran quand les données changent. |
| TypeScript | Types ajoutés à JavaScript pour détecter des erreurs avant l’exécution ; composants en `.tsx`. |
| Vite | Serveur local et construction du site final dans `dist/`. |
| Tailwind CSS | Classes CSS utilitaires, version installée 4.3.3 ; les formes spécifiques des maquettes utilisent aussi du CSS classique. |
| Git | Historique du code et travail en équipe ; indépendant du lancement local. |
| Django | Backend de ton coéquipier : comptes, validations, permissions et base de données. |

Pour connaître Tailwind : `npm list tailwindcss`. Une plage dans `package.json` indique les versions autorisées ; `package-lock.json` fixe celles installées par `npm ci`.

## Explorer les interfaces

- Depuis l’accueil, ouvrir les cartes des modules ou « Explorer la démonstration des 7 modules ».
- **S’inscrire** ouvre trois étapes : informations personnelles, expériences et compétences. Le niveau propose uniquement Junior ou Senior. L’e-mail et les mots de passe se saisissent à la fin ; le profil local reprend ensuite les informations renseignées. Google et GitHub sont les deux seules options sociales visibles, avec le logo Google multicolore.
- Dans l’espace, le menu bleu passe de la version avec texte à une version avec icônes. Sur mobile, le bouton en haut à gauche ouvre le tiroir.
- **Messagerie** propose Toutes les conversations, Messages privés et Groupes, avec informations et fichiers récents.
- **Mon profil** présente ton parcours et tes candidatures (en cours, validées, non retenues). « Modifier mon profil » ouvre une autre page.
- **Apprentissage** propose cinq domaines, une recherche globale et les parcours frontend/backend du web. Fullstack est retiré. Le défilement est conservé entre les choix et restauré par Retour/Avancer.
- **Assistant IA** contient l’agent apprentissage avec historique et l’agent modérateur avec une file locale de publications/offres/signalements.
- Le sélecteur en haut à droite passe les commandes de l’interface en français ou anglais, avec drapeau. Les contenus des membres gardent leur langue ; les fiches pédagogiques détaillées restent en français.
- Les projets et découvertes de **Communauté** peuvent recevoir une étoile d’appréciation. Le compteur indique le nombre de personnes ; 1 000 devient `1k`.

Lire `docs/DIRECTIVES_31_OCTOBRE.md` pour le détail des directives et des limites.

## Ce qui fonctionne et ce qui reste à brancher

| Module | Dans le frontend | À raccorder ou compléter avec Django |
| --- | --- | --- |
| Authentification | Nouveau design responsive, inscription en trois étapes et profil local ; Google et GitHub visibles | Comptes, sessions, déconnexion, e-mails et OAuth. |
| Profil | Informations personnelles, expériences et compétences structurées, édition, photo locale, portfolio et candidatures | Utilisateur identifié et synchronisation de ces données avec le serveur. |
| Communauté | Publications, collaboration, commentaires, étoiles, drapeaux, dates, signalements locaux | Compteurs partagés, pagination, droits, modération et pièces jointes de projet. |
| Apprentissage | 5 domaines, sous-parcours, 47 fiches introductives et progression locale | Véritables contenus longs, exercices serveur, synchronisation et IA. |
| Offres | Recherche, filtre, création et candidature simulée | CV, état des candidatures, durée CDD, date limite et employeurs. |
| Groupes | Dans Messagerie : recherche, création, rejoindre/quitter, discussion | Membres réels, rôles, droits et messages partagés. |
| Messagerie | Conversations privées et groupes, historique, sélection de fichier | Transmission des messages, stockage de fichiers et temps réel. |

Aucun compte réel n’est créé. L’inscription construit un profil local puis propose de l’afficher ; la connexion et la récupération affichent un message de démonstration. Les boutons Google/GitHub restent désactivés en attendant OAuth. L’option « Se souvenir de moi » est actuellement visuelle.

Les pièces jointes de messagerie conservent uniquement leur **nom**, jamais leurs octets. Limite de sélection locale : 5 Mo. L’agent apprentissage fonctionne avec des exemples/règles locales par défaut. Sa connexion à l’API Django est préparée via `VITE_AGENT_MODE=api`, mais nécessite un endpoint fonctionnel côté backend. Le modérateur simule une file et des vérifications locales ; il n’est pas une IA de modération réelle. Les données locales ne sont visibles que sur ce navigateur.

## Lire le code dans cet ordre

1. `index.html` fournit `<div id="root">`, où React s’affiche.
2. `src/main.tsx` charge le CSS, puis l’application.
3. `src/App.tsx` contient l’accueil et la navigation par adresse `#...`. `src/components/Authentication.tsx` contient les nouveaux formulaires ; `ProfileFields.tsx` partage les champs avec l’édition du profil.
4. `src/components/Workspace.tsx` compose le menu et le module actif.
5. `src/components/modules/` contient un fichier par module pour faciliter tes modifications.
6. `src/data/learning.ts` décrit les catégories, parcours et fiches ; tu peux y ajouter du contenu.
7. `src/workspace.css` définit l’espace communautaire. `src/index.css` garde l’accueil ; `src/authentication.css` définit la nouvelle authentification et `src/components/profile-fields.css` ses champs partagés.
8. `src/lib/storage.ts` conserve les exemples avec `localStorage`. Aucun mot de passe ni jeton n’y est enregistré.
9. `src/lib/api.ts` est préparé pour l’API mais n’est pas encore appelé par les écrans de démo.
10. `src/data/profile.ts` décrit les informations personnelles, expériences et compétences, leurs validations et la reprise des anciens profils.

`useState` conserve une valeur d’interface. Un appel comme `setQuery` la modifie et React actualise l’affichage. Un composant réutilisable comme `CountryFlag` évite de recopier la logique dans chaque module.

La navigation par hash, par exemple `#workspace/profil/modifier`, permet de recharger une page et d’utiliser Retour/Avancer sans ajouter de dépendance de routage.

Les animations sont désactivées si l’appareil demande une réduction des mouvements. Les fenêtres de création et le menu mobile peuvent être fermés avec Échap et conservent le focus au clavier dans leur contenu.

## Origine de l’écran blanc initial

Le code importait `Github` depuis `lucide-react`, alors que cet export n’existe pas dans la version installée. Cet échec de module empêchait React de démarrer. `src/components/GithubIcon.tsx` remplace cet import par un SVG local. La protection `ErrorBoundary` traite les erreurs React à l’exécution, mais ne peut pas réparer un import incorrect : compiler reste nécessaire.

## Commandes utiles

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
npm list tailwindcss
```

`npm run build` vérifie TypeScript puis construit `dist/`. `npm run preview` sert la version construite pour contrôle. Le proxy local `/api` de Vite vise `http://127.0.0.1:8000` pour un futur backend Django.

Si l’écran reste blanc sur ton PC, lire la première erreur du terminal Vite puis celle de **F12 → Console**. Vérifier le dossier ouvert et l’adresse utilisée. Le port peut devenir 5174 si 5173 est occupé.

## Tes anciennes données

Les données locales de la première version sont reprises, avec des valeurs par défaut pour les nouveaux champs. Un ancien post sans date ne reçoit pas de date inventée. Les anciens compteurs et avis sont repris comme appréciations, sans utiliser la somme des notes comme nombre de personnes. Les anciens groupes restent accessibles dans Messagerie.

Pour remettre les exemples à zéro : F12 → Application → Local Storage, supprimer uniquement les clés commençant par `devafrica:`. Cela efface les données locales correspondantes, donc conserver ce que tu veux garder avant cette action.

## Travailler avec ton coéquipier

Lire `docs/INTEGRATION_DJANGO.md` ensemble, confirmer les URL et les champs puis brancher d’abord authentification/profil, ensuite les publications/étoiles, groupes/messages et offres.

Si le dossier est déjà un dépôt de l’équipe, commencer par `git status`, puis travailler dans une branche :

```bash
git switch -c frontend/nouvelles-interfaces
git add src public docs README.md
git commit -m "Adapte les profils, étoiles, messagerie et parcours d'apprentissage"
```

Un commit est un point d’historique local. `git push` demande un dépôt distant configuré et les droits correspondants. Ne pas créer un dépôt imbriqué si l’équipe en possède déjà un. Ne jamais versionner `node_modules`, un secret ou un `.env` sensible. Les variables `VITE_` sont publiques.

## Documentation fournie

- `docs/AUTHENTIFICATION.md` : nouvelle maquette, inscription pas à pas, données et fichiers à modifier.

- `docs/DIRECTIVES_31_OCTOBRE.md` : directives actuelles et fonctionnement.
- `docs/NOUVELLES_INTERFACES.md` : point d’entrée vers la documentation actuelle.
- `docs/CHANGEMENTS.md` : changements fichier par fichier.
- `docs/INTEGRATION_DJANGO.md` : contrat proposé à confirmer avec le backend.
- `docs/VERIFICATIONS.md` : tests effectués et limites.
- `docs/ASSETS.md` : origine des icônes et drapeaux.
