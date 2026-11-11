# Vérifications de la version 18 · 10 novembre 2026

## Tests automatisés

Résultat final : **analyse sans avertissement, 13 tests réussis sur 13, compilation réussie** avec Node 24.22.1. Le lockfile et les dépendances de la version 17 sont conservés.

Les commandes de contrôle sont `npm run lint`, `npm run check:workflows` et `npm run build`.

Les treize tests couvrent les comportements de la version 17 et les régressions suivantes : suggestions limitées aux fiches, exclusion des outils annexes, lecture de liens complets/incomplets, confirmation des mots de passe, lien expiré, différence entre contexte de leçon et contexte de code, appels de récupération avec CSRF, échange du code contre une preuve de réinitialisation et confirmation depuis un lien.

Les tests de récupération interceptent les requêtes. Ils n’appellent aucun serveur réel et n’utilisent aucun compte ni mot de passe réel.

## Contrôles observés dans Chromium

| Contrôle | Résultat observé |
| --- | --- |
| Menu | Une seule commande de réduction ; expansion et réduction fonctionnelles ; Quitter seul dans le pied du menu, aligné en bas ; retour effectif à l’accueil. |
| Offres | Aucun bouton d’aide flottant. |
| Compétences | Rea propose React et React Native ; Artisan se saisit via Autre compétence et devient une pastille. Les outils annexes sont aussi exclus par les tests de données. |
| Aide à la leçon | Le point d’interrogation ouvre Comprendre la leçon, avec son titre actuel. Une question sur DOM renvoie Document Object Model et le passage du cours. |
| Robot | Ouvre Comprendre le code avec index.html et le contexte de l’exemple. |
| Récupération | Depuis la connexion : demande par e-mail, écran après demande, choix code/mot de passe temporaire, aperçu du nouveau mot de passe. |
| Lien incomplet | Écran dédié avec demande d’un nouveau lien ; aucune étape présentée comme vérifiée. |
| FR/EN | Libellés de récupération et champs du formulaire final traduits. |
| Défilement | Sommaire réellement défilant ; rail gris-bleu, dégradé turquoise et rayon arrondi confirmés dans les styles calculés. |

## Largeurs contrôlées

Le contrôle utilise le zoom de Chromium pour réduire la largeur CSS disponible, sans modifier les données de l’application.

- Environ **1 349 px** : menu complet et nouvelle carte de récupération avec illustration.
- Environ **765 px** : récupération sans débordement horizontal, illustration masquée.
- Environ **326 px** : demande et formulaire du nouveau mot de passe sans débordement horizontal ; titre, étapes et commandes accessibles par défilement vertical.

Il ne s’agit pas d’un essai sur téléphone physique. Les différences de rendu natif de la barre de défilement Firefox n’ont pas été testées dans ce navigateur.

## Limites

Aucun code, mot de passe temporaire ou nouveau mot de passe n’a été saisi dans le navigateur pendant les essais. Les règles de confirmation et les transitions réseau sont testées séparément avec des données fictives. L’envoi d’e-mails, la validité réelle des jetons, le changement d’un mot de passe serveur et les réponses d’un modèle IA doivent être vérifiés après raccordement de Django.

La construction conserve les avertissements habituels de taille des paquets pédagogiques. Aucun changement de dépendances, de compilateur Docker ou de programme de cours n’est nécessaire pour cette révision.
