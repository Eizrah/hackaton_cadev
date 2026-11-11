# DevAfrica Connect · version 17

Mise à jour du 10 novembre 2026. Cette version reprend le frontend précédent et conserve les cours, les ateliers et leurs ressources.

## Après extraction du ZIP

1. Conserve une copie de ton ancien dossier.
2. Extrais le ZIP. Ouvre le dossier `frontend` qui contient `package.json` et `package-lock.json` dans VS Code.
3. Dans **Terminal → Nouveau terminal**, exécute :

```powershell
npm ci
npm run dev
```

Si ton terminal est dans `hackaton_cadev`, commence par `cd frontend`. Ouvre l’adresse donnée par Vite. Pour ces changements d’interface, reconstruire l’image Docker n’est pas nécessaire : le compilateur n’a pas changé. Docker reste nécessaire pour exécuter les exercices qui utilisent les consoles serveur.

## Inscription et profil

Le parcours possède trois écrans : **Informations personnelles → Expérience & compétences → Accès au compte**. Le dernier contient uniquement l’e-mail et les mots de passe. Le niveau général est Débutant, Intermédiaire ou Avancé.

La recherche de compétences possède une loupe dans la barre. `Rea` propose React, React Native et les outils correspondants ; `jav` propose notamment Java, JavaFX et JavaScript. Les noms proviennent des technologies et outils du catalogue d’apprentissage. **Autre compétence…** autorise un nom absent, comme Angular. Chaque sélection produit une pastille avec son icône et un bouton pour la retirer. Le niveau et le domaine ne sont plus demandés pour une compétence.

**Diplôme** et **Certificat** sont sous la recherche, dans le bloc des compétences. Le trombone ouvre le choix de fichier. Le nom, la taille, le téléchargement et le retrait sont affichés. Les expériences demandent poste, description et année. Les anciens intitulés de diplôme/certificat sont conservés séparément sur les anciens profils.

Le profil possède une section **Mes annonces enregistrées**. On peut ouvrir une publication enregistrée ou la retirer. Les enregistrements sont liés à l’identifiant du profil local.

## Offres et recrutement

- À la candidature : ajouter un CV avec le trombone, ou saisir son lien HTTP(S), puis écrire la lettre de motivation.
- À la publication : rechercher un pays africain, choisir une suggestion triée par ordre alphabétique, puis rechercher les compétences avec la même barre que l’inscription.
- **Stage** et **CDD** font apparaître une durée obligatoire, avec choix jours, semaines ou mois. Une ancienne offre sans durée reste signalée comme « à préciser ».
- Dans le profil, l’espace recruteur permet de rechercher le nom d’un poste et de choisir une offre dans les suggestions. Les candidatures gardent le profil, les compétences, le CV et la motivation ; les décisions et compteurs locaux sont conservés.

La saisie `Afr` trouve **Afrique du Sud** en français. En anglais, `South` trouve **South Africa** ; les libellés français sont également reconnus pour la recherche. La valeur conservée reste compatible avec les anciennes données.

## Communauté

Le formulaire contient le texte, les fichiers, un lien facultatif et la demande d’aide/collaboration. Le titre et le type de publication sont retirés, ainsi que les filtres Projets, Questions & découvertes et Enregistrées. La demande d’aide n’est plus répétée dans le menu des publications.

Les trois points conservent **Voir le profil**, **Enregistrer l’annonce** et **Signaler**. Les motifs de signalement existants et les confirmations flottantes sont préservés. Les réponses apparaissent immédiatement sous le commentaire auquel elles répondent, y compris pour plusieurs niveaux de réponse. Les commentaires indépendants gardent leur ordre.

Quand le modérateur local bloque une publication, son auteur reçoit une notification. La publication bloquée est masquée aux autres profils locaux et son auteur voit son état. Les permissions réelles devront être appliquées par Django.

## Messagerie et groupes

L’étoile des favoris est retirée. Les trois points proposent **Sourdine**, **Bloquer**, **Effacer la discussion** et **Informations**. Sourdine et blocage sont conservés par profil et conversation. Bloquer désactive l’envoi local ; effacer masque l’historique pour ce profil, sans supprimer la copie des autres participants.

La fenêtre **Médias, fichiers et liens** s’ouvre depuis l’icône de galerie ou le panneau d’informations. Elle possède trois onglets, leurs compteurs, une recherche, les aperçus des photos, les téléchargements et les liens détectés dans les messages. Les anciens fichiers sans octets restent indiqués comme indisponibles.

Le créateur d’un groupe devient son administrateur. Il peut changer la photo, modifier la description, ajouter ou retirer des membres et confirmer la suppression du groupe. Ces commandes ne sont pas affichées aux membres ordinaires et leurs gestionnaires vérifient aussi le rôle. La suppression locale marque le groupe comme supprimé et crée une notification pour chaque membre. Les conversations privées n’affichent pas de liste de participants.

## Langues et affichage

Les commandes, formulaires, menus, confirmations, erreurs, noms de pays et cartes du catalogue utilisent le sélecteur français/anglais. Le choix de langue est conservé. Les publications, noms de fichiers, biographies et contenus pédagogiques détaillés gardent leur langue d’origine ; un message le précise dans les cours lorsque l’interface est anglaise.

Le bouton d’aide flottant est limité à **Apprentissage** et **Offres**. Le robot des exemples continue d’ouvrir la discussion à côté du code. L’accueil, la connexion et l’inscription gardent leur adaptation aux petits écrans. Les nouvelles barres, pièces jointes et galeries utilisent des colonnes qui se réorganisent selon la largeur.

## Ce qui est local et ce qui doit être partagé

Les nouveaux fichiers sont conservés dans **IndexedDB**, une base locale du navigateur. `localStorage` conserve uniquement leurs métadonnées, avec les autres données de démonstration. Limites de sélection : 5 fichiers à la fois, 10 Mo par fichier. Ces documents ne sont ni envoyés à Django ni accessibles depuis un autre appareil. Retirer une pièce jointe retire sa référence de l’interface ; cela ne purge pas automatiquement les anciens blobs locaux.

La connexion peut utiliser l’adaptateur optionnel `VITE_AUTH_MODE=api`. Un refus serveur `account_banned` ouvre la fenêtre « Compte banni ». La démonstration sait aussi reconnaître ce statut dans ses profils locaux. L’inscription, la récupération et les boutons sociaux attendent encore leurs endpoints réels. Voir [INTEGRATION_DJANGO.md](INTEGRATION_DJANGO.md).

## Où modifier le code

| Fichier | Rôle |
| --- | --- |
| `components/Authentication.tsx`, `ProfileFields.tsx` | Trois étapes, champs partagés et contrôles. |
| `components/shared/SkillSearch.tsx`, `CountrySelect.tsx` | Suggestions, loupe intégrée et navigation au clavier. |
| `components/shared/Attachments.tsx`, `CredentialFields.tsx` | Sélection, téléchargement et retrait des documents. |
| `lib/attachments.ts` | Conservation des blobs, métadonnées et nettoyage des URL d’aperçu. |
| `components/modules/Offers.tsx`, `RecruiterDashboard.tsx` | CV, pays, durée et recherche par poste. |
| `components/modules/Community.tsx`, `SavedPosts.tsx` | Publication simplifiée, réponses et annonces enregistrées. |
| `components/modules/Messages.tsx`, `ConversationMedia.tsx` | Conversations, outils administrateur et galerie. |
| `data/chat.ts`, `data/lifecycle.ts` | Préférences, vérifications de rôle et notifications de cycle de vie. |
| `lib/auth.ts`, `lib/api.ts` | Adaptateur de connexion Django et reconnaissance du compte banni. |
| `i18n/`, `revision-v17.css` | Traductions et nouveaux styles. |
| `tests/workflows.test.ts` | Régressions sur réponses, profils, droits, notifications, connexion et traductions. |

Les chemins de la table commencent dans `src/`, sauf `tests/`. Pour vérifier : `npm run lint`, `npm run check:workflows`, puis `npm run build`.
