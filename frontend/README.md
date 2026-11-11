# DevAfrica Connect — frontend du hackathon

**Version 18 — compétences limitées aux fiches du catalogue, menu simplifié, aide dédiée aux leçons, récupération du mot de passe par lien/code et défilement turquoise.** Commencer par [docs/MODIFICATIONS_V18.md](docs/MODIFICATIONS_V18.md) et [docs/VERIFICATIONS_V18.md](docs/VERIFICATIONS_V18.md).

Version du 10 novembre 2026.

Dernière mise à jour : les définitions sont réparties sans répétition dans un même cours, le robot apparaît seul en haut à droite du code et le lexique ne possède plus de recherche.

Mise à jour pédagogique : les 141 leçons débutantes des 22 cours sont enrichies, avec un lexique, des explications détaillées et un accès au robot depuis le code. L’atelier utilise maintenant une page entière et permet de supprimer un fichier créé avec une croix au survol, puis d’annuler. Voir [les changements expliqués](docs/APPRENTISSAGE_PEDAGOGIE.md) et le [guide SQLite et autres SGBD](public/guides/sqlite-et-sgbd.html).

L’accueil garde son dégradé bleu/cyan. L’authentification reprend désormais la maquette claire fournie : carte blanche, fond bleu pâle, boutons bleus et illustration du développeur à droite sur ordinateur. L’espace communautaire conserve son menu bleu vertical, ses profils translucides et son catalogue d’apprentissage à cartes colorées. La messagerie suit une disposition à trois colonnes.

## Démarrer dans VS Code sous Windows

1. Conserver une copie de l’ancien projet.
2. Extraire le ZIP et ouvrir dans VS Code le dossier `frontend` **qui contient `package.json`**.
3. Ouvrir **Terminal → Nouveau terminal**.
4. Installe les dépendances et lance le serveur depuis `frontend`. Si le terminal se trouve dans `hackaton_cadev`, entre d’abord `cd frontend`.

```bash
npm ci
npm run compiler:build (demarrage de docker oblige)
npm run dev
```

Ouvrir l’adresse affichée dans le terminal, habituellement `http://localhost:5173`. Garder le terminal ouvert. Ne pas ouvrir `index.html` par double-clic.

Si PowerShell bloque `npm.ps1`, utiliser `npm.cmd ci` puis `npm.cmd run dev`, ou choisir **Command Prompt** comme terminal VS Code. Pas besoin de modifier la sécurité Windows.

Le projet a été vérifié avec Node 24.22.1. `node -v` affiche ta version. `npm ci` installe les dépendances du frontend et des ateliers à partir du `package-lock.json` fourni.

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
- **S’inscrire** ouvre trois étapes : informations personnelles, expérience et compétences, puis accès au compte. Les niveaux sont Débutant, Intermédiaire et Avancé. Diplômes et certificats se joignent sous la recherche de compétences ; les compétences choisies apparaissent avec leurs icônes, sans niveau ni domaine. L’e-mail et les mots de passe sont dans la troisième étape. Google et GitHub restent visibles en attendant leur connexion serveur.
- Dans l’espace, le bouton avec une flèche sous la navigation réduit ou développe le menu. « Quitter » se trouve tout en bas et revient à l’accueil. Sur mobile, le bouton en haut à gauche ouvre le tiroir.
- **Messagerie** propose les conversations privées et les groupes. Les trois points ouvrent Sourdine, Bloquer et Effacer la discussion. La galerie rassemble photos, fichiers et liens, avec recherche et téléchargement. Le créateur d’un groupe gère sa photo, sa description, ses membres et sa suppression.
- **Mon profil** présente ton parcours, tes documents, tes annonces enregistrées, tes candidatures et ton espace recruteur. La recherche par poste permet de retrouver les candidatures d’une offre. « Modifier mon profil » ouvre une autre page.
- **Apprentissage** propose Web, Mobile et Langages de programmation. Dans **Mobile → Android**, ouvre Kotlin, Jetpack Compose ou Java pour Android. Dans **Mobile → iOS**, ouvre Swift & SwiftUI. Dans **Mobile → Multiplateforme**, ouvre Flutter & Dart ou React Native. Chaque cours détaillé propose un sommaire, des quiz, un éditeur et des projets exportables avec un guide de lancement.
- **Assistant IA** contient l’agent apprentissage avec historique et l’agent modérateur avec une file locale de publications/offres/signalements.
- Le sélecteur en haut à droite passe les commandes de l’interface en français ou anglais, avec drapeau. Les contenus des membres gardent leur langue ; les fiches pédagogiques détaillées restent en français.
- **Communauté** possède un champ de publication, un lien facultatif, des pièces jointes et la demande d’aide. Les réponses apparaissent sous leur commentaire parent. Les filtres de type et le champ titre sont retirés. Le menu du post conserve Voir le profil, Enregistrer et Signaler. Le compteur d’étoiles indique le nombre de personnes ; 1 000 devient `1k`.
- **Offres** accepte un CV joint ou un lien HTTP(S), accompagné d’une lettre de motivation. À la publication, pays et compétences sont recherchables ; Stage et CDD demandent une durée. Les compétences proposées correspondent aux fiches visibles ; les outils supplémentaires se saisissent avec « Autre compétence ».
- Le point d’interrogation flottant apparaît uniquement dans **Apprentissage** : il explique un mot ou une phrase avec le contexte de la leçon. Le robot des exemples reste consacré au code et à son fichier.
- **Mot de passe oublié ?** ouvre la demande d’instructions, puis la vérification par code ou mot de passe temporaire et le choix du nouveau mot de passe. Un lien de réinitialisation peut ouvrir directement ce dernier écran. Le mode démo ne modifie aucun compte réel.

Dans **Langages de programmation**, C, C++ et Java proposent chacun trois niveaux, 20 leçons, des quiz et un éditeur. Le bouton **Compiler et exécuter** utilise Docker Desktop en mode conteneurs Linux. Après `npm ci`, lance une fois `npm run compiler:build` puis `npm run dev`. Les interfaces GTK, Qt et JavaFX disposent d’un export et d’un guide pour lancer leurs fenêtres sur ton ordinateur. Consulte `docs/APPRENTISSAGE_LANGAGES.md` pour l’installation et l’intégration avec Django.

Les parcours Python, JavaScript, TypeScript, PHP et SQL ajoutent 90 leçons et 15 projets. SQL propose un terminal SQLite dans le navigateur avec résultats en tableaux, aperçu des tables, historique et exports CSV ou `.sqlite`. Les consoles de scripts demandent de reconstruire l’image avec `npm run compiler:build`. Le guide `docs/APPRENTISSAGE_SCRIPTS_SQL.md` explique chaque changement et les installations pour les fenêtres.

Consulte `docs/APPRENTISSAGE_WEB.md` pour les programmes, les ateliers et leurs fichiers. Les premières directives d’interface sont dans `docs/DIRECTIVES_31_OCTOBRE.md`.

## Ce qui fonctionne et ce qui reste à brancher

| Module | Dans le frontend | À raccorder ou compléter avec Django |
| --- | --- | --- |
| Authentification | Design responsive, inscription locale en trois étapes ; adaptateur de connexion Django optionnel et pop-up compte banni | Endpoint de connexion réel, inscription, restauration de session, déconnexion, e-mails et OAuth. |
| Profil | Informations, expériences, compétences, documents joints, annonces enregistrées, candidatures et recrutement | Utilisateur identifié, visibilité publique/privée et synchronisation serveur. |
| Communauté | Texte, fichiers, lien, collaboration, commentaires regroupés, étoiles, drapeaux, signalements et notification de blocage | Compteurs partagés, pagination, droits, modération et stockage serveur des pièces jointes. |
| Apprentissage | Trois domaines, vingt-deux cours détaillés, 408 leçons, 109 mini-projets et une progression locale. | Synchronisation des brouillons et de la progression avec les comptes. |
| Offres | Recherche, détails, durée Stage/CDD, CV joint ou lien et motivation ; suivi candidat/recruteur et notifications locales | Comptes réels, stockage des CV, transmission serveur, permissions et décisions synchronisées. |
| Groupes | Création, rejoindre/quitter, administrateur, photo, gestion des membres et notification de suppression | Appartenance et rôles contrôlés côté serveur, droits et messages partagés. |
| Messagerie | Conversations, préférences personnelles, fichiers conservés localement, galerie photos/fichiers/liens | Transmission, blocage et sourdine côté serveur, stockage partagé et temps réel. |

Aucun compte réel n’est créé par l’inscription actuelle. Par défaut, connexion et récupération restent des démonstrations. Avec `VITE_AUTH_MODE=api`, les adaptateurs de connexion et de récupération appellent Django selon le contrat décrit dans [docs/INTEGRATION_DJANGO.md](docs/INTEGRATION_DJANGO.md). Un backend compatible est nécessaire pour envoyer les e-mails, vérifier les codes et changer les mots de passe. Les boutons Google/GitHub attendent OAuth. « Se souvenir de moi » est transmis au serveur seulement dans ce mode API.

Les nouvelles pièces jointes conservent leurs octets dans IndexedDB sur ce navigateur : sélection de 5 fichiers maximum à la fois, de 10 Mo chacun. Les données de l’interface gardent leurs identifiants et métadonnées. Les anciens fichiers qui n’avaient qu’un nom ne peuvent pas être recréés. Aucun fichier n’est transmis à un autre utilisateur sans le backend. L’agent apprentissage utilise des exemples/règles locales par défaut ; `VITE_AGENT_MODE=api` demande un endpoint Django fonctionnel. Le modérateur simule une file locale.

## Lire le code dans cet ordre

1. `index.html` fournit `<div id="root">`, où React s’affiche.
2. `src/main.tsx` charge le CSS, puis l’application.
3. `src/App.tsx` contient l’accueil et la navigation par adresse `#...`. `src/components/Authentication.tsx` contient les nouveaux formulaires ; `ProfileFields.tsx` partage les champs avec l’édition du profil.
4. `src/components/Workspace.tsx` compose le menu et le module actif.
5. `src/components/modules/` contient un fichier par module pour faciliter tes modifications.
6. `src/data/learning.ts` décrit le catalogue. `src/data/webCurricula.ts` relie les programmes à la salle commune `src/components/learning/HtmlCssClassroom.tsx`. `WebCodeStudio.tsx` gère l’atelier, les fichiers et les exports.
7. `src/workspace.css` définit l’espace communautaire. `src/index.css` garde l’accueil ; `src/authentication.css` définit la nouvelle authentification et `src/components/profile-fields.css` ses champs partagés.
8. `src/lib/storage.ts` conserve les exemples avec `localStorage`. Aucun mot de passe ni jeton n’y est enregistré.
9. `src/lib/api.ts` fournit le client HTTP et CSRF. `src/lib/auth.ts` prépare la connexion et `src/lib/passwordRecovery.ts` prépare la récupération. `src/lib/attachments.ts` gère les fichiers locaux. `src/revision-v18.css` contient le dernier ajustement du menu, les écrans de récupération et les barres de défilement.
10. `src/data/profile.ts` décrit les informations personnelles, expériences et compétences, leurs validations et la reprise des anciens profils.

`useState` conserve une valeur d’interface. Un appel comme `setQuery` la modifie et React actualise l’affichage. Un composant réutilisable comme `CountryFlag` évite de recopier la logique dans chaque module.

La navigation par hash, par exemple `#workspace/profil/modifier`, permet de recharger une page et d’utiliser Retour/Avancer. React Router est fourni dans l’atelier React pour les exercices de navigation.

Les animations sont désactivées si l’appareil demande une réduction des mouvements. Les fenêtres de création et le menu mobile peuvent être fermés avec Échap et conservent le focus au clavier dans leur contenu.

## Origine de l’écran blanc initial

Le code importait `Github` depuis `lucide-react`, alors que cet export n’existe pas dans la version installée. Cet échec de module empêchait React de démarrer. `src/components/GithubIcon.tsx` remplace cet import par un SVG local. La protection `ErrorBoundary` traite les erreurs React à l’exécution, mais ne peut pas réparer un import incorrect : compiler reste nécessaire.

## Commandes utiles

```bash
npm ci
npm run dev
npm run lint
npm run check:workflows
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

- `docs/APPRENTISSAGE_WEB.md` : programme HTML/CSS, fonctionnement de l’atelier, progression et explications du code.

- `docs/AUTHENTIFICATION.md` : nouvelle maquette, inscription pas à pas, données et fichiers à modifier.

- `docs/DIRECTIVES_31_OCTOBRE.md` : directives actuelles et fonctionnement.
- `docs/NOUVELLES_INTERFACES.md` : point d’entrée vers la documentation actuelle.
- `docs/CHANGEMENTS.md` : changements fichier par fichier.
- `docs/INTEGRATION_DJANGO.md` : contrat proposé à confirmer avec le backend.
- `docs/VERIFICATIONS.md` : tests effectués et limites.
- `docs/ASSETS.md` : origine des icônes et drapeaux.
