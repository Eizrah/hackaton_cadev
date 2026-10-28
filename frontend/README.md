# DevAfrica Connect — frontend du hackathon

 Le point d’entrée est ce dossier `frontend`, celui qui contient `package.json`.

## Démarrer dans VS Code sous Windows

2. Dans VS Code : **Fichier → Ouvrir le dossier**, sélectionner `frontend`.
3. Ouvrir **Terminal → Nouveau terminal**. Vérifier que le terminal se trouve dans `frontend`.
4. Vérifier Node : `node -v`. Le projet a été vérifié ici avec Node 24.22.1. Utiliser une version Node compatible avec les contraintes de Vite dans le lockfile (Node 22.12+ ou 24 LTS).
5. Exécuter `npm ci`. Cela installe exactement les versions de `package-lock.json`.
6. Exécuter `npm run dev` et laisser le terminal ouvert.
7. Ouvrir **l’adresse affichée dans le terminal**, habituellement http://localhost:5173. Si le port est occupé, Vite peut afficher 5174.

Si PowerShell bloque `npm.ps1`, employer `npm.cmd ci`, puis `npm run dev`, ou choisir comme terminal dans VS Code. Il n’est pas nécessaire de modifier la politique de sécurité Windows.

Ne pas ouvrir directement `index.html` par double-clic : les fichiers React doivent être servis par Vite.

## Ce que font les outils

| Outil | Son rôle dans notre projet |
| --- | --- |
| Node.js et npm | Node exécute les outils de développement ; npm installe les paquets et lance les commandes. |
| React | Assemble l’interface avec des composants et actualise l’affichage quand les données changent. |
| TypeScript | Ajoute les types à JavaScript pour détecter certaines erreurs avant l’exécution. Les composants portent l’extension `.tsx`. |
| Vite | Lance le serveur local et construit le dossier final `dist`. |
| Tailwind CSS | Fournit des classes CSS utilitaires. Le projet utilise Tailwind **4.3.3** avec le plugin Vite ; beaucoup de styles de la maquette sont écrits en CSS classique pour contrôler les formes. |
| Git | Conserve l’historique du code et permet de travailler à plusieurs. Il n’est pas nécessaire pour simplement lancer cette archive. |
| Django | Le serveur : comptes, validations, base de données, permissions et API. |

`npm list tailwindcss` affiche la version installée. `package.json` contient une plage de versions (par exemple `^4.3.3`), `package-lock.json` fixe les versions installées par `npm ci`.

## Première correction : l’écran blanc

La compilation initiale échouait sur :

```text
Module 'lucide-react' has no exported member 'Github'.
```

Le composant importait une icône absente de la version installée. L’import est remplacé par un petit composant SVG local `src/components/GithubIcon.tsx`. Un import de module invalide peut empêcher React de démarrer et laisser l’écran blanc. C’est une erreur confirmée dans l’archive ; d’autres problèmes propres à ton ordinateur doivent être vérifiés avec la console si nécessaire.

 installer les dépendances avec `npm ci` sur chaque machine.

## Explorer l’application

- L’accueil conserve les images fournies, la palette bleu nuit/cyan, les cartes de modules et les grandes formes arrondies.
- Les boutons Connexion et Inscription ouvrent les formulaires. « Mot de passe oublié » ouvre un formulaire dédié.
- Les URL utilisent `#login`, `#signup`, `#workspace`, etc. Le bouton Retour du navigateur fonctionne entre ces pages. Les onglets internes de l’espace utilisent un état React local ; ils ne créent pas tous une entrée dans l’historique.
- Sur mobile, ouvrir le menu de l’accueil. Dans l’espace communautaire, faire défiler horizontalement la barre des modules.

**Important : aucun vrai compte n’est créé. Les formulaires d’authentification valident l’interface, puis affichent un message.** La démo sans compte est volontaire et ne constitue pas une authentification.

## État réel des modules

| Module | Fonctionne dans ce frontend | À connecter ou compléter avec Django |
| --- | --- | --- |
| Authentification | Connexion, inscription, validation visuelle, afficher/masquer le mot de passe, récupération en maquette | Création de compte, session, déconnexion réelle, validation serveur, envoi du lien de réinitialisation, OAuth. |
| Profil | Édition du nom, pays, niveau, compétences, présentation et expériences | Profil partagé, photo, modèles structurés pour expériences, diplômes et certificats. |
| Communauté | Publication texte/projet, filtre de catégorie, j’aime, commentaires, signalement local | Pagination, pièces jointes de projets, modération, permissions, signalements d’utilisateurs et groupes. |
| Apprentissage | Trois exercices, correction et progression persistante locale | Cours/exercices du serveur, historique, compétences, véritable assistance IA. |
| Offres | Recherche par texte/pays/compétence, filtre de mode de travail, création, candidature simulée | Contrat métier complet, durée CDD, date limite, CV, suivi et décisions des candidatures. |
| Groupes et discussion | Recherche, création, rejoindre/quitter, discussion locale | Rôles, membres, capacité et règles de modération, messages partagés. |
| Messagerie | Conversations locales, saisie et historique, sélection d’une pièce jointe ≤ 5 Mo | Envoi/réception réels, fichiers stockés côté serveur, audio, statut et notifications, temps réel. |

La pièce jointe conserve **seulement son nom** : aucun fichier n’est envoyé, et aucun téléchargement n’est disponible. Les likes, offres, profils et messages sont des exemples locaux. Les réponses de l’assistant sont prédéfinies et annoncées comme telles.

## Comprendre le code, dans cet ordre

1. `index.html` fournit `<div id="root">`, le point où React s’affiche.
2. `src/main.tsx` charge le CSS et monte l’application dans cette div.
3. `src/App.tsx` contient l’accueil, la marque, les formulaires et la navigation principale.
4. `src/components/Workspace.tsx` contient les premiers parcours des sept modules.
5. `src/lib/storage.ts` conserve les exemples via `localStorage`, avec le préfixe `devafrica:`. Pas de mot de passe ni de jeton d’authentification enregistré.
6. `src/index.css` définit les couleurs, les grilles, les vagues, les points de rupture et les animations. Chercher les commentaires numérotés.
7. `src/lib/api.ts` est un client HTTP préparé mais **pas encore appelé par les écrans**.
8. `vite.config.ts` charge React/Tailwind et prépare le proxy `/api` vers Django.

Exemple : dans React, `useState` conserve une valeur locale ; une fonction comme `setPostText` change cette valeur et React actualise le composant. `onSubmit` reçoit l’envoi d’un formulaire. `event.preventDefault()` empêche le rechargement HTML classique.

Le CSS adapte les colonnes selon la largeur. `@media (prefers-reduced-motion: reduce)` désactive les animations pour les personnes qui ont réduit les mouvements sur leur appareil.

## Réinitialiser les données de démo

Dans les outils du navigateur (F12 → Application → Local Storage), supprimer uniquement les clés commençant par `devafrica:`. Cela efface tes publications et profils de démonstration sur cet appareil. Aucun serveur n’est concerné. Les exemples prédéfinis reviennent au rechargement.

## Avec ton coéquipier Django

Lire `docs/INTEGRATION_DJANGO.md` ensemble avant de remplacer le mode démo. Il faut convenir des routes, champs, erreurs et méthode d’authentification. Le frontend n’invente pas une API déjà disponible.

## Commandes utiles

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
npm list tailwindcss
```

`npm run build` vérifie TypeScript et produit `dist/`. `npm run preview` sert cette version construite pour la vérifier ; ce n’est pas le serveur Django.

Si l’écran est encore blanc : contrôler le terminal Vite, puis F12 → Console et Network ; noter la première erreur rouge. Vérifier que le dossier ouvert est le bon, que `npm ci` a terminé sans erreur et que l’URL provient du terminal. En dernier recours, arrêter Vite avec Ctrl+C, supprimer seulement `node_modules/.vite`, puis relancer.

## Git : premiers pas prudents

Commencer une fois le projet lancé. Ne pas créer un nouveau dépôt si le dossier fait déjà partie de celui de l’équipe.

```bash
git status
```

Si Git répond que ce dossier n’est pas un dépôt, décider avec l’équipe s’il faut cloner son dépôt existant ou créer le dépôt partagé. Pour un dépôt déjà existant, créer une branche de travail :

```bash
git switch -c frontend/devafrica-ui
git add src public index.html vite.config.ts package.json package-lock.json .env.example README.md docs
git commit -m "Corrige le démarrage et ajoute les parcours frontend"
```

Un commit est un point d’historique local. L’envoi vers GitHub se fait avec `git push` une fois le dépôt distant et les droits configurés. Ne jamais versionner `node_modules`, les mots de passe ou un fichier `.env` contenant des secrets. Les variables `VITE_` sont publiques dans le navigateur.

## Prochaines étapes

1. Vérifier ces interfaces sur vos appareils et comparer l’accueil et les formulaires aux maquettes.
2. Confirmer le contrat API avec le backend, puis brancher inscription/connexion et profil.
3. Brancher publications/commentaires, offres/candidatures, groupes et messagerie.
4. Ajouter les fichiers réels, la modération et la progression côté serveur.
5. Préparer un parcours de démonstration : créer un compte → compléter le profil → publier un projet → rejoindre un groupe → postuler.

Cette livraison est une base frontend interactive. Les maquettes sont approchées avec les visuels disponibles ; une identité parfaite au pixel nécessite une validation de vos captures et des dimensions cibles.
