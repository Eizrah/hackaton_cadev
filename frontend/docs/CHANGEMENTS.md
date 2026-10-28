# Détail de la livraison

| Fichier | Changement et raison |
| --- | --- |
| `src/components/GithubIcon.tsx` | SVG local pour remplacer l’import Lucide inexistant, cause confirmée d’échec de compilation. |
| `src/App.tsx` | Suppression de l’import cassé ; liens vers les modules ; formulaire de récupération ; navigation par hash ; libellés accessibles sur les champs ; accès démo sans compte. |
| `src/components/Workspace.tsx` | Espace de démonstration avec profil, fil, commentaires/likes/signalements, exercices, offres, groupes, chat et aide à règles fixes. Fenêtres de création fermables par Échap avec gestion du focus. |
| `src/lib/storage.ts` | Hook partagé de sauvegarde locale pour conserver les données d’exemple au rechargement. |
| `src/lib/api.ts` | Client HTTP à intégrer, gestion des erreurs, cookies de session, CSRF et FormData. Pas de requête automatique vers un backend supposé. |
| `src/components/ErrorBoundary.tsx` | Message utile en cas d’erreur React à l’exécution. Ne remplace pas les vérifications de compilation. |
| `src/main.tsx` | Ajout du filet de sécurité autour de l’application. |
| `src/index.css` | Styles des modules, états actifs, grille responsive, sidebar mobile, micro-interactions et animations respectant la réduction des mouvements. Styles d’accueil/authentification conservés et étendus. |
| `src/App.css` | Ancien style de la page de démonstration Vite supprimé ; il n’était pas utilisé par le composant actuel. |
| `index.html` | Langue française, titre et description du projet, favicon utilisant la marque disponible. |
| `vite.config.ts` | Plugin Tailwind conservé ; proxy local vers le serveur Django sur le port 8000. |
| `.env.example` | URL publique de l’API exemple, sans secret. |
| `README.md` | Guide VS Code, explication des outils, cause de l’écran blanc, état réel et prochaines étapes. |
| `docs/INTEGRATION_DJANGO.md` | Proposition de contrat à valider avec le backend et points manquants des diagrammes. |

Les images `public/images/africa-mark.png` et `hero-tech.png` sont conservées. Aucun nouveau service externe, aucune inscription réelle et aucun message externe n’est déclenché. Les dépendances du projet ne nécessitent pas de nouveau package applicatif.
