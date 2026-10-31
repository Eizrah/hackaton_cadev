# Nouvelle authentification DevAfrica

Cette version utilise la première image comme référence de mise en page et la troisième image comme illustration. L’en-tête porte le logo Afrique et le nom DevAfrica. La carte blanche, le fond bleu pâle, les pastilles d’étapes et le bouton bleu reprennent le style demandé.

## Essayer dans VS Code

Ouvre le dossier `frontend` contenant `package.json`, puis **Terminal → Nouveau terminal** :

```bash
npm ci
npm run dev
```

Ouvre l’adresse donnée par Vite. Sur l’accueil, choisis **S’inscrire**. Pour tester la version mobile sur ordinateur, ouvre F12 et active la barre d’outils des appareils, puis essaie une largeur de 390 px. Les routes directes sont `/#signup`, `/#login`, `/#forgot` et `/#workspace/profil`.

## Les trois étapes

1. **Informations personnelles** : nom, prénom, âge, niveau, pays et pseudo. Les choix de niveau sont exclusivement **Junior** et **Senior**. Le pseudo accepte 3 à 30 lettres et/ou chiffres, sans espace ni caractère spécial. Le pays vient de la liste des pays africains déjà utilisée dans le projet.
2. **Expérience** : **Ajouter une expérience** crée une entrée avec nom du poste, description, année, diplôme et certificat. Tu peux en ajouter plusieurs ou les retirer. Une personne débutante peut continuer sans expérience. Si une entrée existe, le poste, la description et l’année sont obligatoires ; le diplôme et le certificat restent facultatifs. L’année doit être comprise entre 1900 et l’année actuelle.
3. **Compétences** : ajoute une compétence avec son nom, sa difficulté et son domaine. Les suggestions React, Python, HTML, CSS, Figma et Kotlin accélèrent la saisie ; elles ne limitent pas les choix. Une compétence peut être ajoutée manuellement. Le nom ne peut pas apparaître deux fois. Tu peux aussi commencer sans compétence. L’e-mail, le mot de passe et sa confirmation sont placés en bas de cette dernière étape pour garder les six champs personnels de la maquette sur le premier écran.

Les boutons **Retour** et **Continuer** gardent la saisie. Une étape déjà parcourue peut être rouverte depuis les pastilles ; les informations sont à nouveau contrôlées à la validation finale. Recharger ou quitter l’inscription avant sa validation réinitialise le formulaire.

Le mot de passe doit contenir au moins huit caractères et les deux saisies doivent correspondre. Le bouton avec l’œil affiche ou masque chaque mot de passe. Ces contrôles devront être harmonisés avec la politique choisie dans Django.

Les boutons sociaux en bas sont uniquement **Google** et **GitHub**. Google utilise son logo multicolore. Ces boutons restent désactivés tant que les fournisseurs OAuth ne sont pas raccordés.

## Ce qui apparaît dans le profil

Après **Créer mon compte**, un écran indique que le profil local est prêt. **Découvrir mon profil** ouvre sa page :

- Informations personnelles et e-mail, visibles dans le panneau privé de son propre profil.
- Compétences avec icône, nom, difficulté et domaine.
- Expériences avec poste, description, année, diplôme et certificat si renseignés.
- Niveau Junior ou Senior repris dans le profil.

**Modifier mon profil** utilise les mêmes champs et permet d’ajouter, modifier ou retirer des expériences et compétences. La photo, la présentation, le titre professionnel et le lien de portfolio facultatif restent modifiables. Le diplôme et le certificat sont des intitulés textuels, pas des fichiers à téléverser dans cette version.

Les données validées sont conservées sous `devafrica:profile` dans le `localStorage` du navigateur, comme les autres données de démonstration. Un rechargement conserve ce profil. Aucun mot de passe, aucune confirmation et aucun jeton ne sont enregistrés. Une nouvelle inscription locale remplace le profil local précédent : ce prototype n’a pas de gestion de plusieurs comptes.

## Anciennes données

La migration conserve le nom, le pays, la présentation, la photo, le portfolio et l’ancien texte d’expérience. Les anciennes compétences séparées par des virgules deviennent des entrées structurées ; leurs difficultés et domaines inconnus sont marqués comme à préciser. L’ancien texte d’expérience reste affichable et modifiable dans la section dédiée de l’éditeur.

Les anciens niveaux sont ramenés aux deux choix autorisés : `Senior` reste Senior ; toute autre ancienne valeur prend Junior par défaut. L’utilisateur peut corriger son niveau dans l’éditeur. Aucun âge, pseudo ou diplôme n’est inventé. Pour enregistrer un ancien profil, il faut compléter les nouveaux champs obligatoires et les métadonnées des compétences conservées, ou retirer les entrées concernées.

## Comprendre les fichiers

| Fichier | À quoi il sert |
| --- | --- |
| `src/components/Authentication.tsx` | Affichage des écrans, étape active, passage d’une étape à l’autre et validation finale. `useState` garde la saisie pendant le parcours. |
| `src/authentication.css` | Couleurs, disposition du formulaire et de l’illustration, boutons et adaptation aux largeurs d’écran. |
| `src/components/ProfileFields.tsx` | Champs réutilisés dans l’inscription et l’éditeur de profil. Une modification d’un libellé ici est commune aux deux écrans. |
| `src/components/profile-fields.css` | Apparence des champs, cartes d’expériences et de compétences, et détail affiché sur le profil. |
| `src/data/profile.ts` | Description TypeScript des données, création d’une entrée, validation et compatibilité avec les anciens profils. |
| `src/components/modules/Profile.tsx` | Lecture du profil et formulaire de modification. |
| `src/components/GoogleIcon.tsx` | Logo Google local en quatre couleurs. |
| `public/images/auth-developer.jpg` | Illustration fournie, conservée sans modification. |

Sur ordinateur, le formulaire et l’illustration sont côte à côte. Sur tablette, la carte est centrée et l’illustration est masquée pour préserver la largeur des champs. Sur téléphone, les champs passent en une colonne, les libellés d’étapes sont sous les pastilles et la navigation passe dans un menu. Les animations respectent la préférence de réduction des mouvements.

## Prochaine étape avec Django

L’inscription prépare un **profil local de démonstration**. Elle ne crée pas de compte sur un serveur. La connexion ne vérifie pas d’identifiants et la récupération n’envoie aucun e-mail. Le message affiché le précise. L’option « Se souvenir de moi » reste visuelle.

Ton coéquipier peut reprendre la structure des expériences et compétences dans les sérialiseurs Django, puis remplacer la sauvegarde locale par les appels réels. Le contrat proposé et les différences de noms des champs sont dans `INTEGRATION_DJANGO.md`. Les contrôles de saisie du navigateur améliorent l’expérience ; Django doit toujours refaire la validation et gérer les permissions.
