# Vérifications — 31 octobre 2026

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
