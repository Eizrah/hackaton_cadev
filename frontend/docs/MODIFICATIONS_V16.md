# DevAfrica — guide de la version 16

## Installer dans VS Code

1. Arrête l’ancien serveur avec **Ctrl+C** dans son terminal. Garde une copie de ton ancien dossier.
2. Extrais `frontend.zip`. Ouvre dans VS Code le dossier **frontend qui contient package.json**. Ne copie pas les fichiers dans un ancien `src` sans remplacer le reste du projet.
3. Dans **Terminal → Nouveau terminal**, vérifie que le chemin finit par `frontend`, puis lance :

```powershell
npm ci
npm run dev
```

Si tu es encore dans `hackaton_cadev`, fais d’abord `cd frontend`. Le fichier `package-lock.json` est fourni dans le ZIP : il permet à `npm ci` d’installer les mêmes versions. Garde le terminal ouvert et utilise l’adresse affichée par Vite.

Les dépendances et l’image du compilateur n’ont pas changé dans cette version. Il n’est pas nécessaire de reconstruire une image Docker déjà prête pour ces modifications d’interface. Pour une première installation des consoles, conserve Docker Desktop en mode Linux et suis `APPRENTISSAGE_LANGAGES.md`.

## Ce qui change à l’écran

| Partie | Nouveau fonctionnement |
| --- | --- |
| Inscription | Deux étapes. Les niveaux deviennent Débutant, Intermédiaire et Avancé. Expériences et compétences partagent la seconde étape, avec l’accès au compte à la fin. |
| Compétences | Barre bleue arrondie avec suggestions issues du catalogue des cours et de leurs outils. `Rea` retrouve React ; `jav` retrouve Java et JavaFX. Le choix **Autre compétence…** permet une saisie libre. Chaque choix crée une carte numérotée. |
| Profil | Mon profil passe en première position du menu. Les compétences et expériences saisies sont affichées. Les candidatures envoyées et l’espace recruteur apparaissent en dessous. |
| Communauté | Les nouveaux commentaires conservent leur auteur, son nom, son pays et son drapeau. **Répondre** lie le commentaire à celui auquel il répond. Le compteur inclut les réponses. Le nom ouvre le profil de l’auteur. |
| Signalement | Motifs : harcèlement, propos inappropriés ou haineux, fausses informations, fraude, spam, atteinte à la vie privée et Autres. Autres demande une explication ; les autres motifs acceptent des précisions facultatives. |
| Confirmations | Une petite carte flottante apparaît après l’envoi d’un commentaire, d’un signalement, d’une publication, d’une offre, d’une candidature ou d’une décision. Elle peut être fermée et disparaît automatiquement. Les erreurs de saisie restent près des champs. |
| Offres | Cliquer sur une carte ouvre sa description détaillée. Le nombre de candidatures est affiché. Le filtre **Stage** complète les filtres de lieu de travail ; Stage est un type de contrat et peut être Remote, Hybride ou Local. |
| Publier une offre | Pays africains triés, recherche de compétences identique à celle du profil, description de la mission et e-mail de contact facultatif. L’offre passe par la modération existante. |
| Postuler | Il faut un lien de CV HTTP(S) et une lettre de motivation. La candidature apparaît dans le profil avec son état. Un second envoi à la même offre est bloqué pour ce profil. |
| Recrutement | Le propriétaire de l’offre retrouve les candidatures, le CV, la lettre, les compétences et le profil. Il peut accepter, ne pas retenir ou remettre en cours. Les listes peuvent être filtrées par offre et par état. |
| Notifications | La cloche signale les offres correspondant aux compétences, les candidatures reçues et les décisions. Un clic ouvre l’offre, le recrutement ou le suivi personnel. On peut tout marquer comme lu. |
| Messagerie | L’espace remplit la hauteur disponible. Le menu est réduit par défaut et peut être développé. Les participants s’affichent uniquement pour les groupes. Les fichiers et les informations du contact restent accessibles en privé. |
| Assistant | Même occupation de l’écran, avec son historique. Sur téléphone, l’historique prend une bande compacte et la discussion garde l’espace principal. |
| Robot du cours | Il ouvre une fenêtre flottante près de l’exemple, sans changer de page. Le fichier et le passage du cours sont joints. L’historique est partagé avec le grand assistant. Sur téléphone, la fenêtre s’adapte à l’écran. |
| Aide | Le bouton bleu avec un point d’interrogation flotte en bas à droite. Dans la messagerie mobile, il remonte légèrement au-dessus de la saisie pour ne pas couvrir l’envoi. |
| Accueil | Dégradé bleu proche de celui du menu, actualités de la communauté et projets populaires. Les cartes utilisent les publications approuvées présentes dans la démonstration. |

Les grands titres répétés des modules et le bandeau de démonstration ont été retirés du contenu. Le petit fil de navigation, le menu actif et un titre accessible aux lecteurs d’écran restent présents.

## Comprendre les principaux fichiers

React assemble des composants : un composant est une fonction qui décrit un morceau de l’interface. `useState` garde une saisie ou un choix à l’écran. Les types TypeScript décrivent les données attendues pour éviter de mélanger un profil, une offre et une candidature.

| Fichier | Rôle |
| --- | --- |
| `src/data/profile.ts` | Niveaux, compétences, expériences et compatibilité avec les profils précédents. Un identifiant stable distingue les personnes même si elles changent de nom. |
| `src/data/skillCatalog.ts` | Liste des suggestions extraite des technologies et outils du catalogue d’apprentissage. |
| `src/components/shared/SkillSearch.tsx` | Recherche, navigation au clavier, sélection et ajout d’une compétence libre. |
| `src/components/ProfileFields.tsx` | Cartes de compétences et champs partagés entre inscription et modification du profil. |
| `src/components/shared/CountrySelect.tsx` | Choix réutilisable des pays africains. |
| `src/components/Authentication.tsx` | Deux étapes d’inscription, validation et ouverture du profil. |
| `src/data/models.ts` | Commentaires structurés et nouvelles informations des offres. |
| `src/data/people.ts` | Registre local des profils rencontrés, pour ouvrir le profil d’un commentateur ou d’un candidat. |
| `src/data/workflow.ts` | Candidatures : identité du candidat, CV, motivation et décision. |
| `src/data/notifications.ts` | Modèle de notification et rapprochement entre compétences et offres. Java n’est pas assimilé à JavaScript par simple début de mot. |
| `src/components/modules/Community.tsx` | Publication, commentaires, réponses et signalements par motif. |
| `src/components/modules/Offers.tsx` | Recherche, détails d’une offre, publication et formulaire de candidature. |
| `src/components/modules/RecruiterDashboard.tsx` | Revue des candidatures et changement d’état par le propriétaire de l’offre. |
| `src/components/modules/ApplicationDashboard.tsx` | Suivi personnel des candidatures, sans commande pour se valider soi-même. |
| `src/components/shared/NotificationCenter.tsx` | Cloche, compteur, liste et ouverture de la destination. |
| `src/components/shared/ToastProvider.tsx` | Confirmations flottantes disponibles dans tous les modules. |
| `src/components/shared/FloatingTutor.tsx` | Discussion près du code et bouton d’aide. Réutilise le client de l’agent et son historique. |
| `src/components/Workspace.tsx` | Ordre du menu, profil consulté, cloche et disposition des modules. |
| `src/components/HomeHighlights.tsx` | Actualités et classement des projets par nombre d’étoiles. |
| `src/enhancements.css` | Styles de cette version, transitions et adaptations mobile/tablette/ordinateur. |

## Données conservées et limites actuelles

Le frontend reste une démonstration locale. Il n’existe pas encore de connexion authentifiée à des comptes Django pour les offres, commentaires et notifications. Ces données sont enregistrées dans le navigateur de cet appareil, avec les clés `devafrica:profile`, `people`, `posts`, `jobs`, `applications` et `notifications`. Elles ne se synchronisent pas entre les ordinateurs des candidats et recruteurs. Les filtres côté React permettent de montrer les parcours ; ils ne remplacent pas les permissions du serveur.

L’inscription ne conserve jamais le mot de passe. Les boutons Google/GitHub restent à raccorder au backend. Le lien e-mail d’une offre ouvre le logiciel de courrier de l’utilisateur ; cette application n’envoie pas d’e-mail automatiquement. Le CV est un lien, pas un fichier téléversé.

L’assistant utilise les réponses locales déjà présentes tant que `VITE_AGENT_MODE=api` n’est pas activé. La fenêtre flottante utilise le même appel `POST /api/agents/learning/chat/` que le grand assistant ; un serveur Django et un agent doivent être configurés pour des réponses IA personnalisées.

La migration conserve les anciens profils et leurs compétences. Junior devient Débutant, Senior devient Avancé. Un ancien commentaire qui ne contenait que du texte reste lisible sous **Membre / pays non renseigné**, car son auteur ne peut pas être déduit. Les anciennes candidatures locales sans identité sont rattachées au profil historique Juliana. Les anciennes offres sans propriétaire connu restent consultables après modération ; aucun propriétaire n’est inventé pour une offre personnalisée.

## Essai rapide

1. Crée un profil avec React et une compétence libre. Vérifie ses deux cartes après l’inscription.
2. Dans Communauté, ouvre les commentaires d’Amina, réponds à Tiana et ouvre son profil. Vérifie le compteur.
3. Signale une publication avec Autres, écris la raison et vérifie la confirmation flottante.
4. Ouvre une offre, lis sa description et envoie une candidature avec un lien de CV et une lettre. Retrouve-la dans **Mon profil → Mes candidatures**.
5. Publie une offre. Elle apparaît dans ton profil ; les nouvelles offres attendent la validation dans la file de modération de démonstration. Les candidatures réelles provenant d’autres comptes demanderont le raccordement Django décrit dans `INTEGRATION_DJANGO.md`.
6. Dans un cours, clique sur le robot de l’exemple. Pose une question, ferme la fenêtre et constate que la leçon et le code n’ont pas changé. L’historique est disponible dans Assistant IA.
7. Réduis la fenêtre à 390 px. Ouvre le menu mobile, consulte les notifications et teste la messagerie.

Les validations effectuées pour cette version sont consignées dans `VERIFICATIONS_V16.md`.
