# Interfaces — directives du 31 octobre 2026

## Ce qui a changé

| Directive | Mise en œuvre |
| --- | --- |
| Remplir les bords de l’accueil et de l’espace | Suppression des marges extérieures ; accueil bord à bord et menu à hauteur de fenêtre. |
| Harmoniser le bleu | L’accueil reprend un dégradé du bleu du menu latéral. Les espaces de travail gardent du blanc pour la lisibilité. |
| Modifier le bloc du menu | Texte « Trouve ton groupe, partage ton prochain projet » retiré. Le bouton devient « Quitter » et revient à l’accueil sans effacer les données locales. |
| Flèche vers mode compact | La flèche du bloc réduit le menu aux icônes. Le bouton de développement permet de revenir à la version complète. Sur mobile, le menu est un tiroir. |
| Étoile comme un j’aime | Une étoile active/inactive par visiteur dans la démo. Le total est un compteur de personnes, pas une note moyenne. Exemple : `1 000 → 1k`, `1 200 → 1.2k`. |
| Tableau de bord du profil | Candidatures envoyées, filtres en cours/validées/non retenues, indicateur segmenté sans chiffres. Les candidatures créées depuis Offres apparaissent immédiatement en cours. |
| Menu à trois points | Quatre actions avec icônes : demande d’aide/collaboration, voir le profil, enregistrer l’annonce, signaler. |
| Aide conditionnelle | « Proposer mon aide » apparaît seulement quand la demande d’aide/collaboration est activée. Seul l’auteur peut modifier ce réglage ; les autres membres le voient en lecture. |
| Fusionner deux types | Deux choix de publication : Projet et Question & découverte. Les anciens textes sont conservés lors de la migration. |
| Retirer Fullstack | Le domaine Web propose Frontend et Backend. |
| Conserver le défilement | Les navigations dans Apprentissage conservent le défilement, limité à la hauteur disponible de la nouvelle page. Retour/Avancer restaure la position enregistrée pendant cette navigation. |
| Deux agents | Agent apprentissage : discussion, exemples de code, nouvelle discussion, recherche et reprise d’historiques. Agent modérateur : file de publications/offres/signalements. |
| « Tu ne sais pas par où commencer ? » | Le bouton ouvre l’agent apprentissage. |
| Français et anglais | Sélecteur en haut à droite, drapeau France/Royaume-Uni, préférence locale conservée. Les commandes de l’interface sont traduites ; les contenus des membres et les notes pédagogiques détaillées ne sont pas traduits automatiquement. |
| Messagerie suivant la référence | Répertoire, discussion, informations ; trois filtres Toutes/Privés/Groupes ; bleu en dégradé, blanc et bulles ; fichiers récents, description et liens utiles. Sur mobile, le répertoire devient horizontal et les informations s’ouvrent à la demande. |

## Démonstration proposée

1. Ouvrir Communauté et publier un projet.
2. Ouvrir son menu à trois points, activer puis désactiver la demande d’aide : l’action d’aide doit apparaître puis disparaître.
3. Cliquer sur l’étoile pour l’ajouter ou la retirer ; enregistrer une annonce puis retrouver le filtre Enregistrées.
4. Envoyer un signalement avec son motif. Dans Assistant IA → Agent modérateur, retrouver ce signalement et la nouvelle publication.
5. Lancer une vérification locale de la publication ou la valider/refuser dans la démo.
6. Dans Offres, postuler puis ouvrir Mon profil → Mes candidatures.
7. Dans Apprentissage, cliquer sur « Demander à l’agent apprentissage », poser une question sur React et reprendre l’historique après rechargement.
8. Dans Messagerie, créer un groupe, envoyer un message, sélectionner une pièce jointe et ouvrir ses informations.
9. Changer la langue depuis le sélecteur en haut à droite.

## Reprise des données

- Les anciens projets et commentaires sont conservés.
- Les anciens avis 1–5 sont repris comme nombre de participants ayant donné un avis ; la somme des notes n’est pas utilisée comme nombre d’utilisateurs.
- Les anciens j’aime deviennent des appréciations. Une ancienne question marquée d’une étoile comme favori est reprise dans les enregistrements.
- Les anciennes candidatures stockées comme simples identifiants deviennent des candidatures en cours. Leur date inconnue reste indiquée comme telle.
- Les groupes et historiques de messages existants restent utilisables. Les premiers messages d’exemple ne sont ajoutés que si aucun historique local n’existe encore.

## Agents : état exact

Le mode par défaut est **demo**. L’agent apprentissage produit des réponses à partir de règles et des fiches locales ; ce n’est pas un grand modèle de langage. Il peut afficher et expliquer les exemples pris en charge, avec code lisible, sans l’exécuter.

Pour préparer le branchement : copier `.env.example` en `.env`, choisir `VITE_AGENT_MODE=api`, puis implémenter côté Django :

```text
POST /api/agents/learning/chat/
Entrée : { messages: [{ role, content }], language: "fr" | "en" }
Sortie : { answer: "texte de réponse" }
```

Le client HTTP suppose la stratégie session/CSRF décrite dans `INTEGRATION_DJANGO.md`. Aucune clé de modèle ne doit être mise dans une variable `VITE_`, car elle est publique.

Le modérateur possède une file locale et un contrôle élémentaire de structure. Les boutons de décision sont des actions de démonstration. Les nouveaux contenus portent un état d’attente ; une décision met à jour l’exemple local. Traiter un signalement ne supprime pas automatiquement son contenu cible. Pour un vrai service, Django devra gérer les rôles, l’accès à la file et les décisions, puis appeler le modèle ou les règles retenus par l’équipe.

## Candidatures : état exact

Le frontend connaît les états `pending`, `accepted`, `rejected`. Il crée `pending` au moment d’une candidature simulée. Il ne fabrique pas une décision d’employeur : les états validé/non retenu seront fournis par Django. Les filtres et leurs styles sont prêts pour ces réponses.

## Messagerie : état exact

Les messages, descriptions, favoris et liens sont locaux. Les noms de fichiers sont enregistrés, pas leurs octets ; aucun téléchargement réel n’est simulé. Les exemples de participants ne prouvent pas qu’ils sont en ligne. Les échanges entre appareils et la présence temps réel restent à connecter.

## Fichiers pour continuer dans VS Code

- `src/lib/navigation.ts` : navigation et défilement.
- `src/i18n/`, `LanguageProvider.tsx`, `LanguageSwitcher.tsx` : langue et traductions.
- `Community.tsx`, `data/models.ts`, `lib/format.ts` : publications, compteurs et migration.
- `ApplicationDashboard.tsx`, `data/workflow.ts` : suivi des candidatures et files de travail.
- `Assistant.tsx`, `lib/agents.ts` : deux espaces d’agents et adaptation API.
- `Messages.tsx` : nouvelle messagerie.
- `src/workspace.css` : styles des nouvelles interfaces ; `src/index.css` : accueil et authentification.
