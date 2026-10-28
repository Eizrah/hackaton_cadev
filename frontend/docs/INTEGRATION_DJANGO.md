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
