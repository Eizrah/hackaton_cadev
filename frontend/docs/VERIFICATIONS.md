# Vérifications — 28 octobre 2026

## Code

- `npm run build` réussi : TypeScript et construction Vite.
- `npm run lint` réussi, sans avertissement de code au dernier passage.
- Les nouvelles ressources sont intégrées dans `public/` ; aucun nouveau package applicatif à installer en plus du lockfile existant.

## Parcours vérifiés dans Chromium

- Connexion : deux choix sociaux seulement, Google et GitHub.
- Communauté : publication avec titre, date, pays et drapeau ; commentaire ; vote 1–5 ; calcul de moyenne ; modification d’un vote sans augmentation du compteur d’avis ; persistance après rechargement.
- Profil : lecture sans formulaire ; ouverture de la page de modification ; compétences ; refus d’un portfolio en `ftp://` ; sauvegarde d’un lien HTTPS ; retour et persistance.
- Apprentissage : cinq cartes de catégories ; recherche `PyThOn` dans plusieurs domaines ; recherche sans résultat ; Web/Frontend (six fiches) ; Web/Fullstack (douze fiches) ; sous-parcours mobile et desktop ; dix-huit langages ; question React et progression conservée.
- Messagerie : groupes intégrés ; création d’un groupe ; ouverture et envoi de message ; pièce jointe conservée comme nom uniquement ; historique après rechargement ; ancienne adresse des groupes redirigée.
- Offres : filtre Remote et candidature simulée préservés.
- Aide : réponse prédéfinie Python.
- Mobile : ouverture du menu latéral, accès au profil et fermeture avec Échap.
- Migration : une publication de l’ancien modèle conserve son texte ; elle indique sa date inconnue ; un ancien profil reçoit les nouveaux champs facultatifs sans erreur.

Aucun événement `pageerror` et aucune réponse HTTP en erreur observés pendant ces parcours.

## Responsive et examen visuel

Absence de débordement horizontal du document contrôlée pour 12 adresses à chacune des largeurs **320, 390, 768, 1024 et 1440 pixels**, soit **60 combinaisons** :

- Accueil, connexion, inscription.
- Communauté, profil, modification du profil.
- Catalogue, parcours frontend, fiche React.
- Conversations privées, groupes, offres.

Les exemples de code défilent dans leur propre panneau au lieu d’élargir la page. Des captures de profil, menu mobile, catalogue, résultats Python, parcours frontend et conversation de groupe ont été examinées. La coupure du titre « Langages de programmation » sur mobile a été corrigée.

## Limites pratiques

Les tests ont été exécutés dans l’environnement de développement, pas sur le PC Windows de l’équipe ni sur tous les navigateurs. La construction de production a été validée ; la connexion à Django n’est pas implémentée. Les votes, les utilisateurs, les e-mails, l’IA, les fichiers et les conversations partagées ne sont pas des services réels dans cette démonstration.

Pour refaire une vérification manuelle : lancer `npm run dev`, créer un projet et le noter ; modifier son profil avec et sans portfolio ; chercher Python ; ouvrir un parcours et répondre à sa question ; créer un groupe et y écrire un message ; enfin recharger les pages et vérifier la persistance locale.
