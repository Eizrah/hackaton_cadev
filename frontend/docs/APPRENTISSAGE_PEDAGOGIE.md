# Des cours accessibles dès le premier jour

Cette mise à jour conserve les 22 salles de cours, leurs 408 leçons et leurs 109 mini-projets. Elle enrichit les 141 leçons débutantes sans remplacer leurs fichiers d’exemple, quiz ou identifiants de progression.

## Ce qui change pour l’apprenant

- Chaque cours explique ce qu’est la technologie et comment son code est exécuté. HTML/CSS, frameworks, compilation, interprétation, bytecode et JIT sont distingués. Le texte reste en français ; les nouveaux contrôles proposent aussi leurs libellés anglais.
- Le catalogue conserve aussi sa fiche Swift, reliée au programme détaillé Swift & SwiftUI.

- Les leçons débutantes utilisent le titre « Pas à pas ». L’encadré « Quelques définitions à savoir » présente seulement les nouvelles notions utiles à la leçon, sans champ de recherche. Dans un même cours, une définition n’est affichée qu’à sa leçon d’introduction, y compris entre les niveaux. Un volet de révision contient de simples liens vers les leçons antérieures.
- HTML/CSS détaille HTML5 et CSS3, les balises ouvrantes et fermantes, les éléments vides dits orphelins, les attributs, head, body, h1, title, UTF-8 et le DOM.
- Django explique MTV, modèle, template, vue, projet et application. La création d’un projet et d’une application est décomposée pour Windows, en distinguant ce nouvel essai du projet atelier déjà exporté.
- Django intermédiaire développe l’ORM, les migrations, les QuerySets et le CRUD sur Task. L’admin explique les comptes actifs, staff et superutilisateurs, les utilisateurs, groupes et permissions view/add/change/delete. Des règles par objet ne sont pas supposées automatiquement présentes.
- Les autres passages concernés détaillent le CRUD avec le contexte du cours : tâches et chaussures Node/Express, modèles Project/Task Laravel, étudiants et persistance JPA Spring Boot, contacts SQLite.
- SQL indique le moteur SQLite dans les trois niveaux. Le lien « Guide détaillé : SQLite et les autres SGBD » ouvre un document français comparant PostgreSQL, MySQL et SQL Server avec des références officielles. Ce guide est aussi accessible directement à `/guides/sqlite-et-sgbd.html` et peut être imprimé.

## Robot et agent apprentissage

Le robot unique, dans le coin supérieur droit du bloc de code, et l’icône seule de la barre de l’atelier ouvrent l’agent avec le fichier sélectionné, son code, le cours, le niveau et le passage pédagogique. La question est préremplie, modifiable et n’est pas envoyée automatiquement. Un bouton retourne au cours ou à l’atelier. Le code édité dans l’atelier est celui transmis ; les consignes du mini-projet accompagnent un exemple de projet.

L’historique conserve le contexte avec la discussion. En mode démo, le système répond à partir des définitions locales et du passage associé : ce n’est pas un modèle IA capable d’expliquer tout code arbitraire. Pour des réponses personnalisées, l’endpoint Django de l’agent doit être opérationnel et `VITE_AGENT_MODE=api` activé. Aucun secret d’API de modèle ne se place dans le frontend.

Le contexte temporaire de navigation est enregistré dans sessionStorage. Les discussions et brouillons restent dans le stockage local existant. Le retour du robot ne réinitialise pas le brouillon de l’éditeur.

## Une page pour coder

« Essayer dans l’atelier », « Ouvrir l’atelier libre » et les mini-projets ouvrent une page dédiée utilisant toute la largeur. Le bandeau de cours et le menu communautaire laissent place aux fichiers, au code et au résultat. Le bouton de retour retrouve la leçon. Les consignes des mini-projets sont dépliables pour garder de la place.

Sur ordinateur, l’explorateur, le code et le résultat restent côte à côte. Sur petit écran, les onglets Code et Aperçu/Console permettent de basculer. Les mécanismes existants d’exécution sont conservés : aperçu web, moteur SQLite du navigateur, compilateur Docker pour les consoles prises en charge, et guide/export pour les projets natifs.

Pour un fichier créé par l’apprenant, une croix apparaît à côté du nom dans l’explorateur et dans son onglet au survol ou au focus clavier. Elle reste visible sur écran tactile. Un clic supprime le fichier et « Annuler la suppression » restaure son contenu pendant cette session d’atelier. Les fichiers de départ restent protégés. Les nouveaux noms sont blancs et les suppressions sont enregistrées dans le brouillon.

## Fichiers à connaître

| Fichier | Rôle |
| --- | --- |
| `src/data/courseFoundations.ts` | Définition de chaque technologie, mode d’exécution et repères de départ. |
| `src/data/beginnerNotes.ts`, `beginnerNotesOther.ts` | Déroulés complémentaires des 141 leçons débutantes. |
| `src/data/learningGlossary.ts` | Définitions, acronymes et exemples de vocabulaire adaptés aux sujets. |
| `src/data/coursePedagogy.ts` | Assemblage des explications avec les cours existants ; détails ORM, admin et CRUD. |
| `src/data/courseVocabulary.ts` | Introduction de chaque notion à une seule leçon du cours et liens de révision. |
| `src/components/learning/LessonVocabulary.tsx` | Nouvelles définitions de la leçon et révision, sans recherche. |
| `src/lib/learningTutorContext.ts` | Fichier joint, question préremplie et retour vers le cours. |
| `src/components/learning/HtmlCssClassroom.tsx` | Salle de cours, boutons robot et ouverture de la page atelier. |
| `src/components/learning/WebCodeStudio.tsx` | Éditeur, croix de suppression et annulation. |
| `src/components/learning/learning-enhancements.css` | Lecture, dégradés bleus, atelier et adaptations d’écran. |
| `public/guides/sqlite-et-sgbd.html` | Guide autonome SQL/SGBD, comparaison et liens officiels. |

## Installer cette version dans VS Code

Conserve une copie de ton ancien frontend puis remplace-le par le dossier extrait. Ouvre le dossier qui contient package.json. Dans Terminal → Nouveau terminal, lance `npm ci`, puis `npm run dev`. Garde Docker Desktop ouvert pour les consoles qui l’utilisent. La commande `npm run compiler:build` prépare l’image si elle n’est pas encore disponible ; cette mise à jour pédagogique ne change pas le Dockerfile ni les compilateurs.

Les commandes de vérification du frontend restent `npm run lint` et `npm run build`.

## Vérifications de cette mise à jour

- `npm run lint` et `npm run build` réussis.
- Les 141 leçons débutantes possèdent un nouveau déroulé ; les définitions sont réparties selon la progression des leçons.
- Les sources d’exemples des 408 leçons, leurs quiz et les 109 mini-projets sont conservés par rapport à la version précédente.
- Les 408 leçons des 22 cours ont été ouvertes dans le navigateur ; les encadrés de définitions ne répètent aucun identifiant de notion dans un même cours.
- 42 affichages de contrôle entre 320 et 1 920 pixels ont été vérifiés sans débordement horizontal.
- Essais réels de l’aperçu HTML, de JavaScript et du terminal SQLite, du robot avec contexte et retour au brouillon, de la suppression au clavier ou à la souris, de l’annulation et de la persistance après rechargement.
- Un export ZIP de projet a été comparé aux sources et au fichier ajouté ; un second export confirme l’absence du fichier supprimé.

Le backend d’IA Django et l’exécution des conteneurs sur ton ordinateur ne sont pas validés par ces contrôles du frontend. Le guide et les mécanismes Docker existants sont conservés.
