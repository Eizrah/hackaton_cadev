# Changements — 31 octobre 2026

Historique des versions précédentes. Pour les changements actuels et leurs validations, consulte `MODIFICATIONS_V16.md` et `VERIFICATIONS_V16.md`.

| Fichier | Modification |
| --- | --- |
| `src/App.tsx`, `src/index.css` | Accueil bord à bord avec dégradé bleu harmonisé, sélecteur de langue, navigation sans saut natif. |
| `components/Workspace.tsx`, `src/workspace.css` | Menu rempli, flèche de réduction, Quitter, traduction des repères et adaptation mobile des nouveaux modules. |
| `components/LanguageProvider.tsx`, `LanguageSwitcher.tsx`, `i18n/` | Préférence FR/EN, drapeaux, traductions des commandes et attribut `lang` du document. |
| `lib/navigation.ts` | Distinction entre navigation et Retour/Avancer ; conservation du défilement dans Apprentissage et restauration par page. |
| `modules/Community.tsx` | Compteur d’étoiles, deux types de publication, menu à quatre actions, demande d’aide modifiable par son auteur, annonces enregistrées, profils des membres, signalements vers la file. |
| `lib/format.ts` | Affichage compact des compteurs (`1k`, `1.2k`…). |
| `data/models.ts` | Nouveaux champs des publications et migration ; auteur des messages ; états locaux de modération. |
| `modules/Profile.tsx`, `ApplicationDashboard.tsx` | Profil de l’auteur consulté et tableau de bord des candidatures personnelles. |
| `modules/Offers.tsx`, `data/workflow.ts` | Candidatures structurées, file de travail partagée et offres en attente de modération locale. |
| `modules/Learning.tsx`, `data/learning.ts` | Retrait du choix Fullstack, aide vers l’agent et recherche conservée. Les 47 fiches restent introductives. |
| `modules/Assistant.tsx`, `lib/agents.ts` | Discussion avec historique, recherche, reprise/suppression locale ; exemples et code ; adaptateur API Django ; espace de modération séparé. |
| `modules/Messages.tsx` | Trois colonnes, filtres Toutes/Privés/Groupes, aperçu des messages, informations, favoris, liens utiles, emoji et adaptation mobile. |
| `lib/storage.ts` | Notification entre composants utilisant une même clé locale, pour synchroniser candidatures, file et publications. |
| `.env.example`, `docs/` | Modes des agents, état précis de l’intégration et guide actualisé. |

Les images, drapeaux et icônes restent locaux. Aucun package applicatif supplémentaire n’a été ajouté. Les vraies décisions, sessions, messages et modèles IA restent du ressort du backend Django.

## Nouvelle authentification

| Fichier | Changement et raison |
| --- | --- |
| `src/components/Authentication.tsx` | Remplace l’ancien formulaire par la maquette claire : en-tête DevAfrica, illustration à droite, trois étapes d’inscription, connexion et récupération assorties. |
| `src/authentication.css` | Disposition ordinateur à deux colonnes, carte centrée sur tablette, champs empilés sur mobile, focus au clavier et animations respectant la réduction des mouvements. |
| `src/components/ProfileFields.tsx`, `profile-fields.css` | Champs partagés entre inscription et modification du profil : six informations personnelles, plusieurs expériences et plusieurs compétences. |
| `src/data/profile.ts` | Types structurés, valeurs Junior/Senior, validations et reprise des anciennes données. Les mots de passe ne font pas partie du profil. |
| `src/data/models.ts` | Réexporte les nouveaux types et la migration de profil pour les modules existants. |
| `src/components/modules/Profile.tsx` | Affiche les informations personnelles sur son propre profil, le détail des compétences, les expériences, diplômes et certificats ; permet leur modification. |
| `src/components/Workspace.tsx` | Évite de recopier les informations personnelles du profil local lorsqu’on consulte un autre membre. |
| `src/components/GoogleIcon.tsx` | Logo Google multicolore local ; seules les options Google et GitHub restent présentes. |
| `src/App.tsx` | Utilise le nouveau composant d’authentification et ouvre le profil à la fin de l’inscription locale. |
| `src/i18n/en.ts` | Traductions des nouvelles erreurs de validation. Les nouveaux composants proposent également leurs libellés FR/EN. |
| `public/images/auth-developer.jpg` | Illustration exacte fournie par l’utilisatrice pour cet écran. |
| `README.md`, `docs/AUTHENTIFICATION.md`, `docs/INTEGRATION_DJANGO.md`, `docs/VERIFICATIONS.md`, `docs/ASSETS.md` | Installation, explication des changements, contrat proposé, contrôles et origine des ressources. |

Aucun nouveau package n’est nécessaire. Les modules de communauté, apprentissage, offres, groupes, messagerie et agents restent accessibles.

## Apprentissage HTML5 & CSS3 — 4 novembre 2026

| Fichier | Changement et raison |
| --- | --- |
| `src/data/learning.ts` | Un seul bloc HTML5 & CSS3 remplace les deux fiches web séparées ; le catalogue passe de 47 à 46 blocs. |
| `src/data/htmlCssCourse.ts` | Programme en trois niveaux, neuf chapitres, 21 leçons et six projets ; exemples, exercices, quiz et liens de référence. |
| `src/components/modules/Learning.tsx` | Choix Frontend/Backend avant les fiches web, carte commune à deux icônes, ouverture du cours et compatibilité des anciennes adresses. |
| `src/components/learning/HtmlCssClassroom.tsx` | Bandeau illustré, niveaux, sommaire numéroté cliquable, leçon sélectionnée, validation locale et progression. |
| `src/components/learning/WebCodeStudio.tsx` | Atelier HTML/CSS avec fichiers, coloration, lignes, aperçu, largeurs, image, brouillons, export et liste d’auto-évaluation. |
| `src/lib/webPreview.ts` | Composition du rendu dans un document isolé et export HTML avec CSS intégré. |
| `src/components/learning/web-learning.css` | Styles du sommaire, des leçons et de l’atelier ; menu repliable et alternance Code/Aperçu sur petit écran. |
| `public/images/learning-lab.jpg` | Visuel d’apprentissage fourni, conservé sans modification. |
| `README.md`, `docs/` | Guide d’utilisation et de lecture du code, état de l’intégration Django, références et contrôles. |

Aucun package applicatif ajouté. Les autres domaines gardent leurs fiches existantes ; l’exécution multilangage et la progression serveur ne sont pas raccordées.

## JavaScript et React · 5 novembre 2026

- `src/data/learning.ts` limite le catalogue à trois domaines et les fiches du Backend aux cinq outils demandés.
- `src/data/javascriptCourse.ts` et `src/data/reactCourse.ts` ajoutent 39 leçons. Les deux fichiers `Projects.ts` associés définissent douze mini-projets avec consignes et code de départ.
- `HtmlCssClassroom.tsx` reprend la salle de cours HTML5 & CSS3 pour les trois programmes. Chaque cours possède son sommaire, sa boîte à outils et sa progression.
- `WebCodeStudio.tsx` ouvre les fichiers de script, affiche la console et permet l’ajout d’un module. `scriptPreview.ts` prépare le code et les bibliothèques de l’aperçu isolé.
- `web-learning.css` applique la palette bleue de la barre latérale au cours, aux outils et à l’atelier.
- `package.json` et `package-lock.json` installent Sucrase, React Router et esbuild. Le script de préparation assemble le moteur de l’atelier React.
# Version 18 · 10 novembre 2026

Le détail actuel des fichiers et comportements est dans [MODIFICATIONS_V18.md](MODIFICATIONS_V18.md). Les changements des programmes et ateliers précédents sont conservés.

