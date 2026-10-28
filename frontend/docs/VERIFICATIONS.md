# Vérifications effectuées

- Erreur initiale reproduite avec TypeScript : export `Github` inexistant dans `lucide-react`.
- Installation propre `npm ci` réussie dans l’environnement de travail.
- `npm run build` : vérification TypeScript et compilation Vite réussies.
- `npm run lint` : contrôle oxlint réussi.
- `npm list tailwindcss --depth=0` : version installée 4.3.3.
- Parcours automatisés dans Chromium : accueil et connexion ; formulaire de récupération ; création et persistance d’une publication après rechargement ; édition du profil ; exercice React et progression ; filtre Remote et candidature ; création d’un groupe et message de discussion ; réponse de l’aide prédéfinie ; ouverture du menu mobile et accès à la communauté.
- Aucun événement `pageerror` relevé pendant ces parcours.
- Absence de débordement horizontal du document vérifiée aux largeurs 320, 390, 768, 1024 et 1440 px sur accueil, connexion, inscription, communauté, profil, offres et messagerie (35 combinaisons). Les barres de navigation mobiles peuvent défiler volontairement dans leur propre conteneur.
- Captures de l’accueil et de la connexion sur ordinateur, de l’accueil et de la communauté sur mobile examinées. Proportions du titre d’accueil et jonction de la vague du formulaire ajustées.

Ces vérifications ne prouvent pas une reproduction exacte au pixel et ne remplacent pas la validation sur le PC Windows et le smartphone de l’équipe. Le backend, les comptes, OAuth, les e-mails, l’IA, les fichiers et les échanges entre appareils ne sont pas intégrés et n’ont pas été testés comme services réels. L’option « Se souvenir de moi » est actuellement visuelle et ne conserve aucune session.
