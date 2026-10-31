# Changements — 31 octobre 2026

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
