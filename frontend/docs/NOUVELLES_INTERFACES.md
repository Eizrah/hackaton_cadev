# Nouvelles interfaces — 28 octobre 2026

## Les directives appliquées

| Demande | Résultat |
| --- | --- |
| Retirer LinkedIn | Les écrans d’authentification gardent seulement Google et GitHub. Ces deux boutons restent désactivés tant qu’OAuth n’est pas configuré côté serveur. |
| Réunir groupes et messagerie | Le menu contient « Messagerie ». À l’intérieur : « Conversations privées » et « Groupes ». On peut chercher, créer, rejoindre, quitter un groupe et ouvrir sa discussion. |
| Remplacer les cœurs | Les projets et découvertes ont une note de 1 à 5 étoiles, une moyenne et un nombre d’avis. Une deuxième note du même visiteur remplace la précédente. Les questions peuvent être enregistrées avec une étoile. |
| Drapeaux des pays | Les publications et les profils montrent le nom du pays avec un drapeau SVG local. Pas de dépendance à l’affichage des emojis sous Windows. |
| Dates des projets | Les nouvelles publications enregistrent leur date et l’affichent en français, heure de Madagascar. Une ancienne publication sans date indique « Date de publication non renseignée » ; sa date n’est pas inventée. |
| Profil suivant la première image | Carte translucide, bordure blanche, teinte cyan, avatar, compétences, statistiques locales et bouton de modification. Les revenus fictifs de la référence sont remplacés par des informations utiles au projet. |
| Modification séparée | « Modifier mon profil » ouvre une autre page, avec retour, annulation, compétences et portfolio facultatif. Une photo locale peut être ajoutée. |
| Icônes de compétences | React, Python, Vue.js, Angular, TypeScript, Figma, Blender et plusieurs autres technologies disposent d’icônes locales. Un symbole générique est utilisé pour une compétence inconnue. |
| Catégories d’apprentissage | Web, Desktop, Mobile, Design, Langages de programmation. |
| Style des choix | Cartes blanches avec ombres, icône, texte et tranche colorée numérotée, comme la deuxième référence. |
| Menu de la troisième référence | Colonne bleue verticale en dégradé, logo dans une découpe claire, sélection arrondie et fond principal clair. Menu réductible en icônes, puis tiroir sur mobile. |

## L’apprentissage, concrètement

Le catalogue comprend **47 fiches de découverte**, chacune avec explication, exemple de lecture et petite question corrigée. Il s’agit d’introductions, pas de 47 formations complètes ni de vidéos.

- **Web → Frontend** : HTML, CSS, JavaScript, React, Vue.js, Angular.
- **Web → Backend** : Python, Django, Node.js/Express, PHP/Laravel, Java/Spring Boot, C#/ASP.NET Core.
- **Web → Fullstack** : les bases du frontend et du backend réunies.
- **Mobile → Android** : Kotlin, Java, Jetpack Compose.
- **Mobile → iOS** : Swift, SwiftUI.
- **Mobile → Multiplateforme** : Flutter/Dart, React Native, .NET MAUI.
- **Desktop → Windows** : C#, WPF, WinUI.
- **Desktop → Multiplateforme** : Python/Tkinter/PySide6, Java/JavaFX, C++/Qt.
- **Desktop → Technologies web** : Electron, Tauri.
- **Design** : UI/UX et Figma, 3D avec Blender, motion avec Rive.
- **Langages** : C, C++, C#, Java, Python, JavaScript, TypeScript, PHP, Kotlin, Swift, Dart, Go, Rust, Ruby, SQL, R, Lua et Scala.

La recherche traverse les domaines, titres, descriptions et technologies associées. « Python » retrouve notamment les fiches backend, Django, desktop et langage Python. Les accents et majuscules ne bloquent pas la recherche.

Les descriptions distinguent l’interface visible (frontend), les règles et données côté serveur (backend), un langage, un framework et une bibliothèque. HTML est présenté comme un langage de balisage et CSS comme un langage de style.

## Le parcours de profil

1. Ouvrir « Mon profil » dans le menu.
2. Consulter la carte et les compétences.
3. Cliquer sur « Modifier mon profil ».
4. Modifier les champs. Le portfolio peut rester vide ; s’il est rempli, fournir une URL `https://` ou `http://`.
5. Enregistrer pour revenir à la présentation, ou annuler pour abandonner les modifications.

Le formulaire de photo accepte JPG, PNG ou WebP jusqu’à 2 Mo et prépare une petite image carrée. Cette photo reste dans la démonstration locale ; elle n’est pas envoyée à Django.

## Fichiers à modifier pour la suite

| Fichier | Rôle |
| --- | --- |
| `src/components/Workspace.tsx` | Menu, titre des modules et navigation interne. |
| `src/workspace.css` | Toutes les nouvelles interfaces, sidebar, cartes, responsive. |
| `src/components/modules/Community.tsx` | Publications, dates, notes et commentaires. |
| `src/components/modules/Profile.tsx` | Présentation et modification du profil. |
| `src/components/modules/Learning.tsx` | Catégories, parcours, recherche, fiches et questions. |
| `src/data/learning.ts` | Contenu des 47 fiches et structure des cinq domaines. |
| `src/components/modules/Messages.tsx` | Conversations privées et groupes. |
| `src/components/modules/Offers.tsx` | Offres et candidatures de démo. |
| `src/components/modules/Assistant.tsx` | Aide à réponses prédéfinies. |
| `src/components/TechIcon.tsx` | Association entre le nom d’une compétence et son icône. |
| `src/components/CountryFlag.tsx` | Association du nom d’un pays et de son drapeau. |
| `src/data/models.ts` | Données de départ et migration des anciennes publications/profils. |

## Compatibilité avec la première version

Les clés locales `devafrica:profile`, `posts`, `groups`, `messages`, `jobs`, `applications` et `progress` sont conservées. Les nouveaux champs ont des valeurs par défaut ; les anciens « j’aime » ne sont pas transformés en fausses notes. L’ancienne adresse `#workspace/groupes` redirige vers les groupes dans la messagerie.

Un ancien projet conserve ses anciennes données plutôt que de réinjecter tous les exemples. Pour retrouver les exemples initiaux, effacer uniquement les clés `devafrica:` du stockage du navigateur, après avoir conservé ce que tu souhaites garder.

## Les limites restent explicites

Les données restent sur cet appareil. Les vrais comptes, votes partagés, modérateurs, messages entre utilisateurs, fichiers et progressions doivent être raccordés à Django. Les notes initiales sont des exemples. Le lien copié du profil ne publie pas ses données locales sur Internet. Le portfolio est une adresse externe fournie par l’utilisateur, ouverte uniquement lors d’un clic.
