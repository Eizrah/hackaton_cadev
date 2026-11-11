# Vérifications de la version 16 — 8 novembre 2026

## Construction

- `npm run lint` : passe sans avertissement de code.
- `npm run build` : TypeScript et construction Vite passent.
- Vite signale toujours les gros fichiers JavaScript associés aux cours et compilateurs chargés à la demande. Ce message n’empêche pas la construction. Aucune nouvelle dépendance n’a été ajoutée.

## Parcours testés dans Chromium

- Inscription en deux étapes ; trois niveaux ; recherche React ; suggestions Java/JavaFX ; compétence personnalisée Angular ; compétences affichées dans le profil ; aucun mot de passe conservé.
- Mon profil en première position de la barre latérale.
- Profil du commentateur, pays et drapeau, réponse liée au commentaire, compteur mis à jour.
- Signalement Autres avec texte obligatoire et confirmation flottante ; ancien bandeau de notification absent.
- Description détaillée d’une offre, CV par URL, lettre de motivation, envoi, compteur et blocage d’un doublon.
- Suivi de candidature dans le profil candidat.
- Notification recruteur, affichage des compétences, CV et profil du candidat, acceptation, notification candidat et état Validée ; réponse négative, notification et état Non retenue. Le bouton de contact ouvre une conversation au nom du candidat. Le changement de destinataire a été simulé dans les données locales pour tester les deux interfaces : il ne constitue pas un système de connexion à plusieurs comptes.
- Formulaire d’offre avec les 54 pays triés, Stage, Hybride, compétences, description, e-mail et passage par la modération.
- Robot à côté du code : même URL, contexte du fichier joint, réponse locale sur h1, historique conservé.
- Messagerie et assistant sur toute la hauteur disponible, menu réduit ; participants présents dans les groupes et absents en privé.

## Éditeur et agent

- Un document HTML saisi dans l’atelier affiche réellement son titre dans l’aperçu.
- Un script JavaScript est exécuté dans l’atelier et son message apparaît dans la console.
- Un fichier supplémentaire garde son nom blanc ; suppression, annulation avec le contenu, rechargement et export ZIP vérifiés.
- Le robot de l’éditeur envoie le code **actuel du brouillon**, sans changer d’onglet ni modifier la saisie.
- En mode API, la requête `/api/agents/learning/chat/` a été interceptée par un serveur de test : langue, messages, nom du fichier, code et contexte sont bien envoyés ; la réponse reçue apparaît dans la fenêtre flottante. Ce contrôle ne valide pas un véritable backend Django ou un fournisseur IA.
- Le terminal SQLite exécute une requête SELECT et affiche ses résultats en tableau.
- Un export de projet Django contient le fichier ajouté, puis l’exclut après suppression au clavier. Les sources initiales du projet restent identiques.
- Les 22 cours, 408 leçons et 109 projets sont présents. Les 79 fichiers de données pédagogiques préexistants sont identiques à ceux de la version 15.

## Responsive

48 vues contrôlées : accueil, inscription, profil, communauté, offres, messagerie privée, assistant et leçon HTML/CSS, chacune en **320, 390, 768, 1 024, 1 440 et 1 920 px**. Aucun débordement horizontal. Les champs d’envoi de la messagerie et de l’assistant restent dans la hauteur d’écran.

Contrôle supplémentaire en **320 × 568** : fenêtre du robot entièrement visible, envoi de question, fermeture par Échap, menu mobile et panneau de notifications accessibles.

Les tests de navigateur n’ont remonté aucune erreur JavaScript non interceptée. Les ateliers natifs/Docker n’ont pas été reconstruits : leur image et leurs sources ne changent pas dans cette version. Les essais ne remplacent pas une vérification sur de vrais appareils ni une recette avec le futur serveur Django.
