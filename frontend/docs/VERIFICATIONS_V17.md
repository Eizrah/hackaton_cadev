# Vérifications · version 17 · 10 novembre 2026

## Vérifications automatisées

Résultat final : **analyse réussie, neuf tests réussis sur neuf, compilation réussie** avec Node 24.22.1. Aucun changement de dépendance ou de lockfile n’a été nécessaire.

- `npm run lint` : analyse du code avec Oxlint.
- `npm run check:workflows` : neuf tests de régression, sans serveur réel ni compte externe.
- `npm run build` : vérification TypeScript et construction Vite.

Les tests couvrent le regroupement des réponses, les cycles/parents absents dans d’anciennes données, les documents du profil, les compétences sans niveau/domaine, les identifiants et niveaux venant du serveur, le catalogue de compétences, les droits de suppression de groupe et leurs notifications, les enregistrements personnels, le blocage de publication, le refus de compte banni, le préappel CSRF et les traductions des nouveaux contrôles/catalogues.

La connexion est interceptée dans le test : aucun mot de passe réel et aucun appel vers un backend de production ne sont nécessaires. Les tests vérifient le client et ses données, pas l’implémentation de permissions Django.

## Parcours contrôlés dans le navigateur

| Zone | Observation |
| --- | --- |
| Inscription | Trois pastilles ; choix des trois niveaux ; recherche de pays ; suggestion React puis sélection avec icône ; absence de niveau/domaine par compétence ; diplôme/certificat dans le bon bloc ; troisième écran réservé à l’accès au compte. |
| Pièce jointe | Sélection d’un certificat PDF de test, nom et lien de téléchargement visibles. |
| Communauté | Formulaire simplifié ; commentaire indépendant et réponse à un commentaire antérieur ; ordre parent/réponse/commentaire indépendant confirmé dans la page. |
| Enregistrements | Publication enregistrée depuis les trois points, retrouvée dans Mes annonces enregistrées du profil. |
| Offre | Pays recherché avec Afr ; durée affichée pour Stage et CDD ; offre locale envoyée en modération ; recherche de son poste dans l’espace recruteur. |
| Candidature | Formulaire ouvert avec lien CV, trombone de pièce jointe et lettre de motivation. |
| Messagerie privée | Absence de favoris et de participants ; menu Sourdine/Bloquer/Effacer ; blocage puis déblocage de la saisie. |
| Éléments partagés | Lien de test détecté et retrouvé dans Liens ; image envoyée dans un groupe de test puis retrouvée dans Photos, avec aperçu chargé. L’image reste lisible après rechargement. |
| Groupes | Groupe existant non administré par le profil courant : pas de commandes de photo/suppression. Groupe de test créé par ce profil : outils administrateur présents, ajout puis retrait d’un membre local, confirmation de suppression ouverte puis annulée. |
| Langues | Aller-retour FR/EN ; formulaires, contrats, noms des pays, menus de conversation et cartes du catalogue traduits. |
| Aide | Icône flottante présente dans Offres et Apprentissage ; absente de la messagerie et des écrans d’authentification. |

## Adaptation aux largeurs d’écran

Le contrôle utilise Chromium avec un zoom qui réduit la largeur CSS disponible. Il ne remplace pas un essai sur un téléphone physique.

- À environ **1 348 px** : formulaires et illustration côte à côte, espace complet, menus et galerie contrôlés.
- À environ **770 px** : étape d’accès au compte sans débordement horizontal.
- À environ **337–340 px** : accueil, connexion, inscription, formulaire de candidature et messagerie contrôlés ; largeur du document égale à la largeur disponible lors des mesures. La navigation devient un tiroir et les fenêtres conservent leur défilement.

L’aperçu à très fort zoom possède aussi une hauteur réduite ; les panneaux se parcourent verticalement. Aucune simulation d’appareil iOS/Android ou de clavier virtuel n’a été effectuée.

## Limites des essais

L’inscription n’a pas été soumise avec des identifiants réels. Le serveur Django, les comptes partagés, les e-mails, OAuth, les fichiers distants et le temps réel ne sont pas fournis dans cette archive. Les refus pour compte banni et les notifications de suppression/blocage sont couverts par les tests de données ; les décisions réelles doivent être testées avec le backend.

Les cours, ressources et compilateur sont conservés. Docker n’a pas été reconstruit pour ces changements d’interface. La construction Vite peut garder des avertissements de taille de certains paquets pédagogiques ; ils ne bloquent pas la génération.
