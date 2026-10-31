# Contrat Django à valider en équipe

Ce document propose des routes. Elles ne sont pas déclarées comme existantes. Le backend reste responsable des permissions, des règles métier et des validations.

## Choisir une méthode d’authentification

Le client `src/lib/api.ts` est préparé pour une session Django par cookies, avec `credentials: include` et le jeton CSRF lu dans le cookie `csrftoken`. Si l’équipe choisit des JWT, adapter le client et les règles de renouvellement ; ne pas mélanger les deux stratégies implicitement.

Pour la session, Django doit initialiser le cookie CSRF avant le premier POST. Proposition : `GET /api/auth/csrf/` avec `ensure_csrf_cookie`, puis `POST /api/auth/login/`. Le client actuel suppose un cookie CSRF lisible par JavaScript ; une autre configuration demande une autre méthode de transmission du jeton. Les cookies de session peuvent rester HttpOnly. Prévoir HTTPS en production.

En développement, Vite transmet `/api/*` à `http://127.0.0.1:8000`. Si Django refuse les POST, vérifier le message serveur et configurer l’origine de développement dans `CSRF_TRUSTED_ORIGINS` ainsi que les hôtes autorisés. Ne pas désactiver CSRF pour contourner le problème. Si les deux serveurs sont sur des origines distinctes sans proxy, configurer CORS et les cookies explicitement. En production, le proxy Vite ne tourne plus : configurer le serveur qui sert `dist/` pour transmettre `/api/` à Django, ou définir une URL API et CORS adaptés.

## Routes proposées

| Module | Routes proposées | Données importantes |
| --- | --- | --- |
| Auth | `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/logout/`, `GET /api/auth/me/` | nom, email, password ; session serveur |
| Récupération | `POST /api/auth/password-reset/`, `POST /api/auth/password-reset/confirm/` | email puis uid/token/nouveau mot de passe |
| Profil | `GET/PATCH /api/profiles/me/`, `GET /api/profiles/{id}/` | nom, prénom, pseudo, pays, niveau, compétences, expériences |
| Publications | `GET/POST /api/posts/`, `POST /api/posts/{id}/comments/` | description, catégorie/projet, auteur, date, fichiers |
| Signalements | `POST /api/reports/` | cible (publication/dev/groupe), identifiant, motif |
| Apprentissage | `GET /api/skills/`, `GET /api/exercises/`, `POST /api/exercises/{id}/attempts/`, `GET /api/progress/` | compétence, difficulté, réponse, score, progression |
| IA | `POST /api/assistant/` | question, contexte autorisé ; appel du modèle géré par Django |
| Offres | `GET/POST /api/jobs/`, `POST /api/jobs/{id}/applications/` | poste, compétences, lieu, contrat, durée, mode, deadline |
| Groupes | `GET/POST /api/groups/`, `POST /api/groups/{id}/join/`, `POST /api/groups/{id}/leave/` | nom, motif, photo, membres, rôles |
| Conversations | `GET/POST /api/conversations/`, `GET/POST /api/conversations/{id}/messages/` | participants, texte, date, statut |
| Fichiers | route multipart à confirmer | type, taille, URL autorisée et accès contrôlé |

Décider ensemble : noms des champs JSON (français ou anglais), IDs, pagination, dates ISO 8601, valeurs d’énumérations, champs obligatoires et format des erreurs. Exemple de liste paginée proposé : `{ "count": 2, "next": null, "previous": null, "results": [...] }`.

Le diagramme contient des règles qui ne sont pas encore toutes implémentées : signalements individuels et groupes, pénalités/bannissement, validation de contenu, membres, durée CDD, état des candidatures, messages audio. La relation de discussion porte une indication `3..15` : confirmer son sens avant d’imposer une taille de groupe. Ne pas exposer une API permettant au navigateur de modifier directement ses propres pénalités ou son état de bannissement.

## Exemple de branchement après confirmation des routes

```ts
import { apiRequest } from './lib/api'

// D’abord initialiser CSRF via l’endpoint réellement choisi.
await apiRequest('auth/csrf/')
await apiRequest('auth/login/', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
})
// Ensuite charger le profil réel et afficher l’espace connecté.
```

Prévoir des états chargement/vide/erreur/succès, empêcher les doubles envois, traiter 400 (validation), 401/403 (session/permissions), 429 et erreurs réseau. Les mots de passe passent uniquement par HTTPS en production ; ne pas les journaliser. Les clés du fournisseur IA restent exclusivement côté Django.

Pour les messages temps réel, convenir d’un WebSocket (par exemple via l’infrastructure choisie par le backend) ou d’un polling initial. Une interface de chat locale n’envoie actuellement rien à un autre utilisateur.

Pour les fichiers : envoyer un `FormData` ; le client HTTP évite alors de fixer `Content-Type` afin que le navigateur génère la boundary multipart. Valider côté Django taille, type, droits et stockage. La limite locale de 5 Mo du prototype n’est pas une protection serveur.

## Contrat à adapter aux interfaces du 31 octobre 2026

| Sujet | Proposition à confirmer |
| --- | --- |
| Appréciations | `PUT /api/posts/{id}/star/` avec `{ "starred": true/false }`, réponse `{ "star_count": 1000, "starred": true }`. Unicité utilisateur/publication côté serveur ; aucune moyenne 1–5. |
| Publications | Deux catégories : `project`, `question_discovery` ; `title`, `body`, `collaboration_open`, `published_at`, état de modération. Seul l’auteur peut changer sa demande d’aide. |
| Enregistrements | `PUT /api/posts/{id}/bookmark/` avec état actif/inactif, liste personnelle des enregistrements. |
| Profils | Identifiant stable, nom affiché, code pays ISO, compétences, portfolio facultatif et photo. Consulter un membre ne doit pas ouvrir l’édition du profil connecté. |
| Candidatures | `GET /api/applications/me/` : identifiant, offre, organisation, date et `pending/accepted/rejected`. Les anciens nombres seuls du prototype ne suffisent pas. |
| Agent apprentissage | `POST /api/agents/learning/chat/` reçoit `{ messages: [{role,content}], language }` et renvoie `{ answer }`. Client préparé dans `lib/agents.ts` ; activer `VITE_AGENT_MODE=api` seulement avec un endpoint opérationnel. |
| Agent modérateur | File des publications/offres/signalements, vérification et décision, accès protégé par rôle serveur. La file et les boutons actuels sont une simulation locale ; aucun endpoint réel de décision n’est encore appelé. |
| Conversations | Identifiants de conversations privées/groupes, participants, messages, fichiers autorisés et pagination. Présence réelle et statut lu ne doivent pas être inférés des exemples visuels. |
| Langues | Codes `fr/en` pour les commandes et réponses d’agent. La traduction des contenus publiés par les membres est une fonction séparée non implémentée. |

La clé du fournisseur IA reste exclusivement côté serveur. Le backend contrôle les rôles et l’unicité des étoiles, définit les dates, décide des candidatures et valide les fichiers. Les vérifications locales du prototype ne remplacent pas ces décisions. Traiter un signalement doit être séparé d’une suppression de contenu ou d’une sanction.

## Inscription en trois étapes et profil structuré

Le nouveau composant `src/components/Authentication.tsx` prépare le profil local avec les types de `src/data/profile.ts`. Il n’envoie encore aucune requête d’authentification. L’e-mail et les mots de passe sont saisis en fin de troisième étape ; les mots de passe restent en mémoire uniquement. Le backend devra créer le compte, ses relations et la session selon la stratégie retenue.

Exemple de corps JSON **proposé** pour `POST /api/auth/register/` — noms à confirmer avec les sérialiseurs Django :

```json
{
  "first_name": "Diana",
  "last_name": "Rakoto",
  "age": 23,
  "level": "Senior",
  "country": "Madagascar",
  "username": "Diana23",
  "email": "diana@example.test",
  "password": "<mot de passe saisi, transmis uniquement au serveur>",
  "experiences": [
    {
      "position": "Développeuse React",
      "description": "Création d’une interface communautaire.",
      "year": 2025,
      "diploma": "Master 1 informatique",
      "certificate": "React Fundamentals"
    }
  ],
  "skills": [
    {
      "name": "React",
      "difficulty": "Intermédiaire",
      "domain": "Web"
    }
  ]
}
```

| Frontend local | Proposition API / diagramme |
| --- | --- |
| `firstName`, `lastName`, `pseudo` | `first_name`, `last_name`, `username` ; nom, prénom et pseudo du développeur. |
| `age`, `year` en chaînes de saisie | Convertir en entiers après validation avant le POST. |
| `level` | Seulement `Junior` ou `Senior` ; convenir des codes serveur si différents. |
| `experiences[].position/description/year/diploma/certificate` | Nom_poste, Description, Année_Exp, Diplome, Certificat du diagramme. |
| `skillDetails[].name/difficulty/domain` | Nom, Difficulté, Domaine de Compétence. Le champ local `skills` contient encore un résumé textuel pour compatibilité avec les anciens modules ; l’API devrait utiliser une liste structurée. |
| `id` local d’une expérience/compétence | Identifiant temporaire d’interface ; laisser Django produire les identifiants persistants et renvoyer les relations. |
| `country` | Libellé de pays actuel ; convenir d’un code ISO si le backend l’exige. |
| `portfolio`, `photo`, `bio`, `role` | Champs du profil complétés depuis l’édition ; portfolio facultatif. |

Expériences et compétences peuvent être des listes vides. Une expérience ajoutée exige poste, description et année ; diplôme et certificat sont facultatifs et textuels. Une compétence ajoutée exige nom, difficulté (`Facile`, `Intermédiaire`, `Avancée`) et domaine (`Web`, `Desktop`, `Mobile`, `Design`, `Langages de programmation`). Ces listes devront être partagées avec le backend. La difficulté d’une compétence est distincte du niveau Junior/Senior du développeur.

Revalider côté Django : champs obligatoires, âge, pseudo, unicité e-mail/pseudo, mots de passe, domaines, difficultés et relations. Ne jamais renvoyer le mot de passe dans la réponse. L’API doit également distinguer les informations du profil privé de celles visibles publiquement. Les boutons Google/GitHub nécessitent chacun un flux OAuth serveur ; leurs logos seuls ne réalisent aucune connexion.
