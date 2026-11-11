# Intégration Django · contrat actuel de la version 18

Ce document décrit les attentes du frontend. Il ne déclare pas que ces endpoints existent déjà. Les adaptateurs de connexion et de récupération sont branchables avec VITE_AUTH_MODE=api ; les autres écrans fonctionnent encore avec leurs données locales.

## Connexion déjà préparée

Copier .env.example en .env.local, puis définir VITE_AUTH_MODE=api uniquement lorsque le backend est prêt. VITE_API_URL=/api utilise le proxy Vite vers http://127.0.0.1:8000. Redémarrer Vite après un changement de variable.

Le client src/lib/api.ts envoie les cookies de session avec credentials: include. Il lit le cookie csrftoken pour les POST. Les clés VITE_ sont publiques ; elles ne doivent pas contenir de secret.

| Étape | Attente actuelle du client |
| --- | --- |
| Initialiser CSRF | GET /api/auth/csrf/ ; Django fournit le cookie CSRF lisible par JavaScript. Une réponse 204 convient. |
| Connexion | POST /api/auth/login/ ; JSON : email, password, remember. |
| Succès | Objet JSON contenant profile ou user, avec la forme de profil ci-dessous. |
| Compte banni | HTTP 403 ou 423 avec code: account_banned, ou profil retourné avec accountStatus: banned. Le client ouvre une fenêtre dédiée et n’ouvre pas le profil. |
| Autre erreur | Mauvais identifiants, CSRF ou indisponibilité : erreur de connexion, sans message de bannissement. |

Exemple minimal de réponse de connexion :

```json
{
  "profile": {
    "id": "42",
    "firstName": "Diana",
    "lastName": "Rakoto",
    "name": "Diana Rakoto",
    "pseudo": "Diana23",
    "email": "diana@example.test",
    "age": "23",
    "level": "Intermédiaire",
    "country": "Madagascar",
    "skillDetails": [
      { "id": "skill-1", "name": "React", "difficulty": "", "domain": "" }
    ],
    "experiences": [],
    "documents": [],
    "accountStatus": "active"
  }
}
```

Le client reconnaît aussi first_name, last_name, username, un id numérique, et les niveaux beginner/intermediate/advanced. Les autres champs doivent être sérialisés selon ce modèle, ou adaptés explicitement dans src/lib/auth.ts. Les âges et années sont actuellement des chaînes de saisie. Les anciens noms difficulty et domain restent présents pour compatibilité ; ils ne sont plus demandés dans l’interface.

En production, le serveur doit vérifier le bannissement sur la connexion et chaque opération protégée. Il doit aussi choisir la durée de session selon remember. Le statut local ne constitue pas un mécanisme d’authentification.

Le client ne restaure pas encore automatiquement une session avec GET /auth/me/, et n’appelle pas encore logout. Brancher ces parcours avant l’utilisation avec de vrais comptes. OAuth attend également son intégration.

## Récupération de mot de passe préparée en version 18

`src/lib/passwordRecovery.ts` et `src/components/PasswordRecovery.tsx` utilisent le même VITE_AUTH_MODE. Le mode demo ne transmet rien ; le mode api initialise CSRF avant chaque POST.

| Endpoint attendu | Corps JSON | Réponse attendue |
| --- | --- | --- |
| POST /api/auth/password-reset/ | email | 200 ou 204 avec un message neutre, sans révéler l’existence d’un compte. |
| POST /api/auth/password-reset/verify/ | email, code, method: code ou temporary_password | reset_token : preuve courte de réinitialisation après vérification du code ou du mot de passe temporaire. |
| POST /api/auth/password-reset/confirm/ depuis un lien | uid, token, new_password1, new_password2 | 200 ou 204 après modification réussie. |
| POST /api/auth/password-reset/confirm/ après vérification manuelle | email, reset_token, new_password1, new_password2 | 200 ou 204 après modification réussie. Le code initial n’est pas renvoyé. |

Le lien envoyé par le serveur doit pointer vers l’URL frontend `/#reset?uid=<uid>&token=<token>` avec valeurs encodées ; `uidb64` est aussi reconnu. Un lien incomplet affiche directement une fenêtre de récupération de nouveau lien. Un refus HTTP 410, ou HTTP 400 avec code invalid_token / expired_token / token_expired / invalid_reset_token, affiche le même état après la tentative de confirmation. Une autre validation de mot de passe reste une erreur du formulaire.

Le serveur crée, vérifie, expire et consomme les jetons. Il vérifie les règles du nouveau mot de passe, limite les tentatives, gère l’e-mail et définit l’effet sur les sessions existantes. Le frontend ne stocke ni mots de passe, ni codes, ni jetons de récupération dans localStorage. Le champ method permet de distinguer code et mot de passe temporaire ; si le backend ne propose qu’un des deux modes, garder seulement celui pris en charge.

## Inscription et profil à brancher

Le formulaire possède trois écrans ; sa validation actuelle crée un profil local. VITE_AUTH_MODE=api n’active pas l’inscription serveur. Ajouter un appel POST /api/auth/register/ avant d’annoncer une création de compte réelle.

| Donnée | Contrat proposé |
| --- | --- |
| Informations personnelles | first_name, last_name, username, email, âge, niveau, pays. |
| Niveau général | beginner, intermediate ou advanced ; affichage Débutant, Intermédiaire, Avancé. |
| Expériences | Liste position, description, year. Diplômes et certificats sortent de cette liste dans la nouvelle interface. |
| Compétences | Liste de noms ou d’identifiants, plus autorisation de noms personnalisés. Le niveau et le domaine ne sont plus obligatoires. |
| Documents | Relations de fichiers avec kind: diploma ou certificate. |
| Profil privé/public | Définir les champs visibles publiquement et les documents que le membre accepte de partager. E-mail, CV et lettres de motivation ne doivent pas être renvoyés dans un profil public par défaut. |

Valider les noms, l’âge, l’unicité e-mail/pseudo, les mots de passe et les relations côté serveur. Une réponse de profil ne doit jamais contenir les mots de passe.

## Fichiers : remplacer le stockage local par le stockage serveur

Actuellement, src/lib/attachments.ts conserve les blobs dans IndexedDB. La métadonnée StoredAttachment contient id, name, type, size et éventuellement une URL HTTP(S). Les identifiants locaux ne permettent pas à Django de lire les fichiers.

Proposition : POST /api/files/ en multipart FormData, puis réponse id/name/type/size/url. Après téléversement, utiliser l’identifiant serveur dans la publication, le message, le document ou la candidature. Le client HTTP évite de fixer Content-Type pour FormData afin que le navigateur ajoute la bonne boundary.

Le backend contrôle taille, type réel, autorisations de lecture et conservation. La sélection locale est limitée à cinq fichiers à la fois et 10 Mo par fichier ; ce contrôle d’interface ne remplace pas la validation serveur. Prévoir le téléchargement authentifié des CV et documents privés, ainsi que le renouvellement des liens expirés.

## Publications, commentaires et enregistrements

| Action | Route proposée | Règle |
| --- | --- | --- |
| Publier | POST /api/posts/ | body, attachment_ids, links, collaboration_open. Le titre et le type ne sont plus demandés. Auteur déduit de la session. Statut initial en modération. |
| Lister | GET /api/posts/ | Contenus approuvés, plus ceux de l’auteur selon leurs états. Dates et compteurs serveur. |
| Commenter / répondre | POST /api/posts/{id}/comments/ | text et parent_id facultatif. Le parent appartient à la même publication. Réponse avec profil public, pays et date. |
| Apprécier | PUT /api/posts/{id}/star/ | starred booléen ; unicité utilisateur/publication. Réponse star_count et starred. |
| Enregistrer | PUT /api/posts/{id}/bookmark/ | État personnel ; liste GET /api/bookmarks/me/ pour le profil. |
| Signaler | POST /api/reports/ | target_type, target_id, category, reason ; texte requis pour other. |

Le frontend garde les catégories historiques dans les anciennes données, sans réafficher les filtres retirés. Le serveur peut conserver ces anciennes valeurs en migration.

## Offres et candidatures

| Action | Route proposée | Données et droits |
| --- | --- | --- |
| Publier | POST /api/jobs/ | title, company, country, contract, mode, skills, description, contact_email facultatif. Auteur déduit de la session. |
| Durée | Même offre | duration entier positif et duration_unit: days/weeks/months obligatoires pour Stage et CDD. |
| Suggestions | GET /api/skills/?search=rea | Noms du catalogue et compétences personnalisées normalisées. Les pays peuvent venir du référentiel local ou du serveur. |
| Candidater | POST /api/jobs/{id}/applications/ | cv_file_id ou cv_url HTTP(S), motivation obligatoire. Interdire doublon, auto-candidature et offre fermée. |
| Suivi candidat | GET /api/applications/mine/ | Uniquement les candidatures du profil authentifié. |
| Espace recruteur | GET /api/recruitment/jobs/?search=frontend | Offres du recruteur, compteurs et recherche par poste. |
| Liste des candidats | GET /api/jobs/{id}/applications/ | Réservée au propriétaire autorisé de l’offre ; profil public, compétences, CV, motivation et état. |
| Décision | PATCH /api/applications/{id}/ | pending/accepted/rejected ; permission du recruteur vérifiée côté serveur. |

Le modèle local Application possède cvFile facultatif, cvUrl, motivation, applicantId, applicant, ownerId et status. Ne pas faire confiance à l’instantané applicant fourni par le navigateur : retrouver les identités depuis la session et l’offre.

Stage est un type de contrat ; le mode reste Remote, Hybride ou Local. Une offre de stage peut être à distance. Pour les offres anciennes sans durée, le frontend affiche qu’elle reste à préciser.

## Conversations et droits des groupes

| Action | Proposition serveur |
| --- | --- |
| Conversations/messages | GET/POST /api/conversations/ et GET/POST /api/conversations/{id}/messages/ avec pagination, date, auteur et identifiants de fichiers. |
| Préférences personnelles | PATCH /api/conversations/{id}/preferences/ : muted, blocked, cleared_before. Effacer sa copie ne doit pas effacer celle des autres. |
| Éléments partagés | GET /api/conversations/{id}/shared/?type=photos/files/links, avec recherche et téléchargements autorisés. |
| Groupe | Créateur administrateur ; identifiants de membres stables. |
| Photo, description et membres | Endpoints protégés : seul l’administrateur autorisé peut modifier, ajouter ou retirer. |
| Supprimer un groupe | DELETE /api/groups/{id}/, avec vérification de rôle et notification de ses membres. |

Le frontend vérifie ces rôles pour ses commandes locales ; Django doit répéter ces vérifications pour chaque requête. Les clés locales group:id servent à reprendre les anciennes conversations nommées Groupe : nom. Prévoir un identifiant serveur stable pour les conversations privées également.

La sourdine locale ne modifie actuellement aucun service de notification distant ; le blocage local empêche l’envoi dans l’interface. Les services de réception et de temps réel doivent appliquer leurs propres règles. Le frontend n’envoie aucun message à un autre compte sans ce raccordement.

## Notifications

GET /api/notifications/, PATCH /api/notifications/{id}/ et POST /api/notifications/read-all/ doivent filtrer par destinataire authentifié.

| Événement | Destinataire |
| --- | --- |
| Offre adaptée à des compétences | Profil correspondant après approbation de l’offre. |
| Candidature reçue | Recruteur de l’offre. |
| Candidature acceptée/refusée | Candidat concerné. |
| Publication bloquée | Auteur de la publication. |
| Groupe supprimé | Chaque membre au moment de la suppression. |
| Membre retiré | Membre concerné. |

Créer décision et notification dans la même transaction. Renvoyer un code d’événement et ses paramètres traduisibles, ou des textes fr/en. Le modèle local accepte textEn pour afficher les nouveaux événements dans les deux langues. Le serveur doit éviter les doublons lors des reprises et gérer les événements pour les utilisateurs déconnectés.

## Apprentissage et agents

Le catalogue garde 23 fiches ; 22 parcours détaillés distincts sont réutilisés, Swift étant aussi accessible dans Mobile. Les cours et compilateurs n’ont pas été remplacés par cette révision.

- Programme : GET /api/learning/courses/{course_id}/.
- Progression : GET /api/learning/progress/me/ et PUT /api/learning/courses/{course_id}/progress/.
- Brouillons : GET/PUT /api/learning/drafts/{draft_id}/, avec propriétaire déduit de la session.
- L’assistant et l’aide des cours utilisent `POST /api/agents/learning/chat/` avec `messages`, `language` et `context` facultatif. La réponse contient `answer`. Activer `VITE_AGENT_MODE=api` avec un endpoint fonctionnel. Pour une discussion sans contexte de cours, l’assistant guide sur les métiers, les parcours et les questions de développement.
- Le contexte de code possède courseId, courseTitle, level, lessonTitle, file, code, explanation et returnPath.
- Le robot ouvre une discussion flottante près du code. Le point d’interrogation général est présent uniquement dans Apprentissage pour expliquer les mots et phrases de la leçon active.
- Pour ce second usage, context contient kind: lesson, courseId, courseTitle, level, lessonTitle, explanation et returnPath ; il ne contient pas de fichier ni de code. L’agent connecté doit adapter sa réponse à ce contexte pédagogique.
- La file du modérateur est une simulation locale ; ses décisions serveur demandent des endpoints et un rôle protégé.

Les clés du fournisseur IA restent côté Django. Pour la compilation, conserver un service isolé avec langages autorisés et limites de ressources ; les guides APPRENTISSAGE_LANGAGES.md et APPRENTISSAGE_SCRIPTS_SQL.md décrivent l’environnement existant.

## Développement et production

Le proxy Vite de développement n’existe pas dans dist/. En production, transmettre /api/ vers Django avec le serveur qui sert le frontend, ou configurer explicitement l’URL API, CORS et les cookies. Pour les POST de développement, configurer les hôtes et origines CSRF autorisés selon les URL réellement utilisées.

Le backend n’était pas fourni pour cette révision. Les tests de connexion et de récupération utilisent des réponses interceptées ; ils ne valident pas un serveur réel. Voir [VERIFICATIONS_V18.md](VERIFICATIONS_V18.md).
