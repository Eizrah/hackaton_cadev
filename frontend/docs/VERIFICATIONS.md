# Vérifications — 31 octobre 2026

Historique des versions précédentes. Pour les changements actuels et leurs validations, consulte `MODIFICATIONS_V16.md` et `VERIFICATIONS_V16.md`.

## Construction

- `npm run build` : TypeScript et construction Vite réussis.
- `npm run lint` : réussi sans avertissement au dernier passage.
- Aucun nouveau package applicatif ajouté ; les SVG restent locaux.

## Parcours contrôlés dans Chromium

- Accueil bord à bord et préférence FR/EN conservée après rechargement ; commandes principales et drapeau anglais vérifiés.
- Menu latéral collé au bord ; réduction en rail d’icônes par la flèche et développement à nouveau ; bouton Quitter présent.
- Compteur d’étoiles actif/inactif, passage de 999 à `1k`, retour à 999 en retirant son étoile ; absence de sélecteur 1–5.
- Deux catégories de publication, menu à quatre actions, activation de la collaboration, action d’aide conditionnelle, enregistrement et signalement avec motif.
- « Voir le profil » ouvre le bon auteur, sans bouton de modification de son compte.
- Nouvelle publication et signalement visibles dans la file locale ; validation de la publication depuis l’interface du modérateur.
- Publication d’une offre et validation via la file locale : état de l’offre mis à jour.
- Candidature envoyée depuis Offres visible en cours dans le profil ; indicateur sans numéros.
- Affichage des trois états de candidature avec données de test, reprise des anciens identifiants de candidature.
- Fullstack absent des choix Web ; recherche Python ; défilement conservé entre catégorie et domaine, puis entre Langages et fiche Python ; retour à la position enregistrée avec Retour.
- Aide « Tu ne sais pas par où commencer ? » vers l’agent apprentissage ; réponse avec exemple de code ; nouvelle discussion ; reprise d’historique après rechargement.
- Messagerie : trois filtres, création de groupe, envoi et reprise d’un message, sélection d’un fichier dont seul le nom est conservé.
- Anciennes notes migrées en nombre de participants, sans utiliser la somme pondérée ; ancien favori de question repris comme enregistrement.
- Menu mobile ouvert et refermé avec Échap.

Aucun événement JavaScript `pageerror` et aucune réponse HTTP en erreur observés pendant ces parcours.

## Responsive et examen visuel

Absence de débordement horizontal vérifiée sur **70 combinaisons** : 14 pages à chacune des largeurs **320, 390, 768, 1024, 1440 pixels**.

Pages : accueil, connexion, inscription, communauté, profil, modification de profil, catalogue, parcours frontend, fiche React, messagerie, groupes, agent apprentissage, agent modérateur et offres.

Captures examinées : accueil bleu bord à bord, communauté, profil et candidatures, modération, agent avec historique, messagerie à trois colonnes et variantes mobiles. Les exemples de code défilent dans leur propre panneau.

## Limites

Les contrôles ont été exécutés dans l’environnement de développement, pas sur tous les navigateurs et appareils de l’équipe. Le build de production est validé ; les services Django ne sont pas raccordés. Les deux espaces d’agents sont en démonstration locale par défaut. Le client d’agent Django est préparé, mais aucun vrai modèle, compte, e-mail, employeur ou échange entre appareils n’a été utilisé pendant les tests. La traduction concerne les commandes de l’interface ; les fiches pédagogiques et les contenus des membres conservent leur langue d’origine.

## Contrôle ciblé de la nouvelle authentification

Après le remplacement des formulaires, un nouveau parcours Chromium a vérifié :

- Les six champs personnels et les deux niveaux exclusivement Junior/Senior.
- Blocage des champs obligatoires vides et des pseudos contenant un caractère spécial ; pseudo composé de lettres accepté.
- Passage et retour entre les trois étapes avec conservation de la saisie.
- Ajout et suppression de plusieurs expériences et compétences ; saisie des diplômes, certificats, difficultés et domaines.
- Refus de mots de passe différents, confirmation correcte et absence de mot de passe dans le stockage local.
- Affichage des données personnelles et professionnelles sur le profil, reprise après rechargement, puis modification et enregistrement.
- Inscription Junior sans expérience ni compétence, avec listes vides conservées et sans données professionnelles fictives ajoutées.
- Connexion, affichage/masquage du mot de passe, récupération et messages explicites de démonstration.
- Deux boutons sociaux seulement, Google et GitHub ; SVG Google à quatre couleurs et bonne illustration locale.
- Nouveaux libellés en français et en anglais.
- Migration d’un ancien profil, conservation du texte d’expérience et reprise des anciennes compétences avec détails inconnus indiqués.

**54 combinaisons** contrôlées sans débordement horizontal aux largeurs **320, 390, 620, 768, 1024 et 1440 px** : accueil, connexion, inscription, récupération, profil, modification du profil et chacune des trois étapes d’inscription renseignées. Captures examinées du formulaire sur ordinateur, tablette et téléphone, de l’étape compétences sur téléphone et du profil détaillé.

Aucune erreur JavaScript `pageerror` ni réponse HTTP en erreur pendant ces contrôles. Le build et le lint de la nouvelle version passent. Ces vérifications ne constituent pas un test d’authentification serveur : Django et OAuth restent à connecter.

## Apprentissage Web — 4 novembre 2026

Un contrôle ciblé Chromium a vérifié le nouveau parcours :

- Choix Web puis Frontend, avec un seul bloc HTML5 & CSS3 et aucun bloc CSS web séparé.
- Trois niveaux, neuf chapitres, 21 leçons et deux projets par niveau.
- Sommaire cliquable, chapitres repliables, leçon sélectionnée, précédent/suivant et historique Retour.
- Anciennes adresses HTML/CSS ouvrant les leçons correspondantes.
- Présence des outils dans la leçon d’environnement et de l’illustration fournie dans le bandeau.
- Réponse erronée sans validation ; bonne réponse enregistrée une seule fois ; validation des 21 leçons.
- Validation globale du bloc seulement après les 21 leçons et les six projets, sans supprimer une ancienne fiche validée.
- Saisie et rendu réels du HTML et du CSS, couleur calculée vérifiée dans l’aperçu, puis brouillons retrouvés après rechargement.
- Édition au clavier : Tab insère des espaces et Échap rend le focus au bouton d’aperçu.
- Formats d’aperçu 375 et 768 px, export autonome avec CSS intégré, ajout d’image, refus d’un type non pris en charge.
- Réinitialisation confirmée et annulation conservant le brouillon.
- Aperçu isolé sans permission de script ; script et redirection meta retirés ; tentative d’accès au document de la plateforme sans effet.
- Six ateliers de projet accessibles, consignes et auto-évaluation explicites ; bouton de fin actif après vérification des critères.
- Critères d’un projet terminé affichés cochés après rechargement.
- Recherche CSS et Python, commandes nouvelles FR/EN et indication des leçons rédigées en français.

**62 configurations** contrôlées sans débordement horizontal aux largeurs **320, 390, 620, 768, 1024 et 1440 px** : catalogue, choix Web, parcours Frontend, une leçon de chacun des trois niveaux, un projet de chacun des trois niveaux et l’atelier d’une leçon. Deux cas supplémentaires ont contrôlé le sommaire ouvert et l’aperçu mobile à 390 px.

Captures examinées : salle de cours, sommaire numéroté, atelier sur ordinateur, leçon mobile, sommaire mobile et atelier mobile. L’aperçu mobile a aussi été vérifié après son chargement : le texte saisi est visible dans le document, et le brouillon est repris après rechargement.

Contrôle de chargement des autres modules et vérification des fiches Python/JavaScript, du parcours Backend et de l’inscription. Aucun événement JavaScript `pageerror`, aucune réponse HTTP en erreur et aucun débordement horizontal observés pendant le contrôle principal. Le contrôle complémentaire mobile n’a relevé aucune erreur JavaScript.

Le build et le lint de cette version passent. Ces essais ne couvrent pas tous les navigateurs : l’atelier n’est pas une validation serveur, un service de compilation multilangage ni une certification des projets. Les autres technologies gardent leurs fiches précédentes.

## Apprentissage JavaScript et React · 5 novembre 2026

- `npm ci`, `npm run build` et `npm run lint` ont réussi avec le nouveau fichier de verrouillage.
- Le catalogue présente trois domaines et 24 fiches. Les cinq fiches Backend, les neuf fiches de langages et la présence de Kotlin dans Mobile ont été vérifiées.
- Les 39 exemples JavaScript et React ont été ouverts et exécutés dans Chromium. Les boîtes à outils, le quiz et la séparation des progressions ont été vérifiés.
- Les douze mini-projets ont été essayés avec leurs interactions principales. Le contrôle couvre notamment la Todo List après rechargement, les erreurs de météo, la lecture audio, les routes de films, le déplacement d’une tâche Kanban, le panier partagé et les publications du mini réseau social.
- L’atelier affiche une erreur de syntaxe, permet d’ajouter puis d’importer un module et exporte une page HTML. L’aperçu ne peut pas accéder au stockage de la plateforme. Le brouillon HTML/CSS et l’ancienne adresse HTML ont aussi été vérifiés.
- Les scénarios d’API ont utilisé des réponses simulées pour contrôler les résultats et les erreurs de manière reproductible. Les requêtes des exercices pointent vers les services décrits dans le guide.
- 30 configurations ont été vérifiées de 320 à 1 440 px. Aucun débordement horizontal ni erreur JavaScript inattendue n’a été observé pendant ces parcours.
- La version construite a été ouverte en mode aperçu de production. Le rendu HTML/CSS, les modules JavaScript et le projet React de vote ont fonctionné.
# Vérification actuelle

Les résultats actuels du 10 novembre 2026 sont dans [VERIFICATIONS_V18.md](VERIFICATIONS_V18.md). Les notes ci-dessous concernent les versions antérieures.

