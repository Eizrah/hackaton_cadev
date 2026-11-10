# Derniers ajustements de la salle de cours

## Présentation

Le bouton « Comprendre ce code » sous l’exemple est retiré. Un seul robot est placé dans le coin supérieur droit du bloc de code. Il utilise toujours le fichier sélectionné et permet de revenir à la leçon depuis l’assistant.

Dans l’atelier, le bouton de l’agent est aussi une icône seule. Son nom reste annoncé aux lecteurs d’écran et apparaît au survol.

Le lexique s’intitule « Quelques définitions à savoir ». La barre de recherche est retirée. Le titre des explications débutantes devient simplement « Pas à pas ».

## Définitions réparties au fil du cours

Une notion possède une leçon d’introduction unique dans chaque cours. Le parcours est lu dans l’ordre Débutant → Intermédiaire → Avancé : les notions déjà introduites ne sont pas redéfinies dans les encadrés des leçons suivantes. Chaque cours reste autonome ; un nouvel apprenant peut commencer un autre langage sans dépendre de son historique de navigation.

Les notions qui réapparaissent dans le texte sont accessibles via « Revoir une définition déjà présentée ». Ce volet est replié par défaut et contient des liens vers les leçons antérieures, sans reproduire les définitions.

Exemple HTML5 & CSS3 :

| Leçon | Nouvelles définitions |
| --- | --- |
| 1.1 · HTML et CSS | HTML5, CSS3, balise, head, body, titres et propriété CSS. |
| 1.2 · Environnement | DOM, fichier/dossier/extension, éditeur et URL. |
| 2.1 · Structure HTML | DOCTYPE, UTF-8, attribut, élément vide et viewport. |
| 2.2 · Contenu | Lien hypertexte et destination. |
| 3.1 · Sélecteurs | Sélecteur CSS. |
| 3.2 · Texte | Couleurs et typographie. |
| 3.3 · Boîtes | Modèle de boîte. |

Le choix des notions est également filtré selon le sujet : un identifiant CSS ne déclenche plus une définition de clé primaire SQL, et l’héritage des templates n’est pas présenté comme l’héritage des classes Python.

Les encadrés généraux de présentation et de mode d’exécution n’accompagnent plus chaque leçon. Les compléments identiques sur le CRUD ne sont ajoutés qu’une fois par cours. Les explications propres aux exercices sont conservées.

## Modifier la progression des définitions

`src/data/courseVocabulary.ts` contient les emplacements de première introduction et les notions pertinentes pour chaque cours. `LessonVocabulary.tsx` affiche les nouvelles définitions ou leurs liens de révision. Le code de l’agent demeure dans `learningTutorContext.ts` et `modules/Assistant.tsx`.

La répartition est déterminée par le programme, sans effacer les définitions selon les visites de l’apprenant. Recharger une page ou ouvrir directement une leçon garde une présentation stable. Les exemples, quiz, projets, brouillons et identifiants de progression sont conservés.

## Vérifications

La compilation et le contrôle du code réussissent. Les 408 leçons ont été ouvertes et leurs encadrés vérifiés sans répétition de notion dans un même cours. Les essais couvrent les liens de révision, le robot et le fichier actif, le retour au brouillon, l’aperçu HTML/JavaScript, les tables SQLite, la suppression/restauration des fichiers et l’export ZIP. Les 42 affichages de contrôle entre 320 et 1 920 pixels n’ont pas de débordement horizontal.

Le backend de l’agent IA et les conteneurs Docker sur l’ordinateur de l’apprenant gardent leur configuration existante.
