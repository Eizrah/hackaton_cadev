# Authentification DevAfrica · version 18

L’accueil, la connexion et l’inscription reprennent l’identité DevAfrica et l’illustration fournie. Sur ordinateur, la carte et l’illustration sont côte à côte. À largeur réduite, l’illustration disparaît et les champs passent en une colonne.

## Trois étapes

1. **Informations personnelles** : nom, prénom, âge, niveau général, pays et pseudo. Les niveaux sont Débutant, Intermédiaire et Avancé. Les 54 pays africains sont recherchables et triés alphabétiquement selon la langue affichée.
2. **Expérience & compétences** : expériences facultatives, puis recherche de compétences. Une expérience ajoutée demande poste, description et année. La recherche propose les technologies des fiches visibles du catalogue ; Autre compétence permet un nom libre. Les outils internes cités dans les leçons, comme Artisan et Android SDK, ne sont plus proposés automatiquement. Les compétences choisies ont une icône et peuvent être retirées. Elles ne demandent plus de niveau ni de domaine. Les pièces jointes Diplôme et Certificat se trouvent sous la recherche, dans ce bloc.
3. **Accès au compte** : adresse e-mail, mot de passe et confirmation. Le mot de passe doit avoir au moins huit caractères ; la confirmation doit correspondre.

Les boutons Retour et Continuer gardent la saisie. Les pastilles autorisent le retour aux étapes déjà parcourues. Le formulaire contrôle à nouveau les informations à la validation finale. Recharger ou quitter l’inscription avant validation réinitialise les champs.

## Choisir une compétence ou un pays

La loupe est dans la barre de recherche. Écrire Rea propose React et React Native ; jav propose Java et JavaScript. Les fiches combinées restent nommées HTML5 & CSS3, Node.js & Express, Flutter & Dart et Swift & SwiftUI. Une sélection devient une pastille avec son icône. Autre compétence ouvre un champ libre pour JavaFX, Artisan, Android SDK ou un autre nom absent des fiches. Les compétences déjà enregistrées ne sont pas effacées.

Pour les pays, écrire Mad permet de choisir Madagascar ; Afr propose Afrique du Sud. Les flèches haut/bas, Entrée et Échap permettent également d’utiliser ces listes au clavier. Les mêmes composants servent au profil et à la publication d’une offre.

## Joindre un diplôme ou un certificat

Le trombone ouvre le choix de fichier. Formats proposés : PDF, documents Word et images. La sélection est limitée à cinq fichiers à la fois et 10 Mo par fichier. Le formulaire attend la fin de la copie locale avant de continuer. Chaque pièce jointe possède un nom, une taille, un téléchargement et un bouton de retrait.

Les octets sont enregistrés dans IndexedDB sur ce navigateur ; le profil ne garde que leurs identifiants et métadonnées. La suppression des données du site rend ces fichiers indisponibles. Un document ancien dont seul le nom avait été enregistré ne peut pas être récupéré par cette mise à jour.

## Profil après inscription

La validation crée le profil de démonstration, puis le bouton Découvrir mon profil permet de l’ouvrir. Il présente informations personnelles, compétences avec icônes, expériences et documents. Le profil ajoute aussi Mes annonces enregistrées, candidatures et espace recruteur. Modifier mon profil utilise les mêmes champs.

Les anciens niveaux Junior et Senior deviennent Débutant et Avancé. Les anciens champs de niveau/domaine par compétence sont conservés dans les données pour compatibilité, mais ne sont plus affichés ni exigés. Les anciens intitulés de diplôme/certificat sont affichés séparément des expériences.

Aucun mot de passe ni jeton n’est sauvegardé dans localStorage ou IndexedDB. Le prototype garde un seul profil courant par navigateur ; une nouvelle inscription locale le remplace.

## Connexion et compte banni

Par défaut, VITE_AUTH_MODE=demo : la connexion affiche un résultat de démonstration et ne prouve pas l’identité d’un compte. Si un profil local portant le même e-mail est marqué accountStatus: banned, le pop-up Compte banni apparaît.

Le mode optionnel VITE_AUTH_MODE=api appelle GET /api/auth/csrf/, puis POST /api/auth/login/ avec e-mail, mot de passe et remember. Une réponse de profil banni, ou un refus HTTP 403/423 portant le code account_banned, ouvre le même pop-up. Une erreur CSRF ou de mauvais identifiants ne doit pas être présentée comme un bannissement.

Ce mode demande un backend compatible ; voir [INTEGRATION_DJANGO.md](INTEGRATION_DJANGO.md). L’inscription, le rétablissement de session et la déconnexion serveur restent à raccorder. Les boutons Google/GitHub restent désactivés en attendant OAuth.

## Récupération par lien ou code

Le composant `src/components/PasswordRecovery.tsx` gère désormais les routes `/#forgot` et `/#reset` : demande par e-mail, écran après demande, code ou mot de passe temporaire, nouveau mot de passe, résultat et lien incomplet/expiré.

Le lien envoyé par Django doit viser `/#reset?uid=<uid>&token=<token>` ; `uidb64` est également accepté à la place de `uid`. Le lien ouvre le formulaire de nouveau mot de passe. Sa validité définitive reste contrôlée par le serveur à la confirmation. Sans lien, `/#reset` ouvre la vérification manuelle.

En mode démo, les écrans se prévisualisent sans code réel et le résultat précise qu’aucun mot de passe n’a changé. En mode API, la demande appelle `auth/password-reset/`, la vérification appelle `auth/password-reset/verify/`, et la confirmation appelle `auth/password-reset/confirm/`. Voir le contrat des corps JSON dans le guide Django.

Les codes, mots de passe et preuves de réinitialisation ne sont conservés que dans la mémoire du composant, jamais dans le stockage local. Les champs sont vidés après succès. Les tests de réseau utilisent des réponses simulées ; aucun serveur réel n’a été fourni pour cette révision.

## Fichiers à connaître

| Fichier | Utilité |
| --- | --- |
| src/components/Authentication.tsx | Étapes, validation et fenêtres de connexion. |
| src/components/ProfileFields.tsx | Champs communs à l’inscription et au profil. |
| src/components/shared/SkillSearch.tsx | Recherche et sélection d’une compétence. |
| src/components/shared/CountrySelect.tsx | Recherche et sélection d’un pays. |
| src/components/shared/CredentialFields.tsx | Diplômes et certificats. |
| src/components/shared/Attachments.tsx | Trombone, contrôle de taille, aperçu et téléchargement. |
| src/lib/attachments.ts | Conservation des fichiers dans IndexedDB. |
| src/lib/auth.ts | Connexion Django optionnelle et refus de compte banni. |
| src/data/profile.ts | Modèle, validation et migration du profil. |
| src/authentication.css, src/revision-v17.css | Maquette et adaptation aux largeurs d’écran. |

Les interfaces ont été contrôlées dans le navigateur ; les limites des vérifications figurent dans [VERIFICATIONS_V18.md](VERIFICATIONS_V18.md).
