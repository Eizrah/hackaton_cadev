# DevAfrica Connect · version 18 · 10 novembre 2026

Cette archive reprend la version 17 et applique les nouvelles directives de menu, compétences, aide, récupération de mot de passe et défilement.

## Ouvrir la mise à jour

Conserve une copie de l’ancien dossier, extrais le ZIP et ouvre le dossier frontend qui contient package.json dans VS Code. Dans le terminal de ce dossier :

```powershell
npm ci
npm run dev
```

Les dépendances et le compilateur n’ont pas changé. Pour cette mise à jour d’interface, il n’est pas nécessaire de reconstruire Docker.

## Compétences

Les suggestions reprennent les technologies des fiches visibles du catalogue : React, JavaScript, Django, Laravel, Spring Boot, Kotlin, etc. Les blocs combinés gardent les noms HTML5 & CSS3, Node.js & Express, Flutter & Dart et Swift & SwiftUI.

Les outils cités à l’intérieur des cours, comme Artisan, Android SDK, Maven, JavaFX ou Live Server, ne sont plus ajoutés automatiquement aux suggestions. Ils restent saisissables via **Autre compétence…**. Les anciennes compétences enregistrées sont conservées. La correction s’applique à l’inscription, au profil et aux offres parce que ces écrans partagent le même composant.

## Menu latéral

Le bloc « Ensemble, on va plus loin » est retiré. Sous la navigation, il reste uniquement le bouton avec la flèche pour réduire ou développer le menu. Le bouton **Quitter** se trouve tout en bas du panneau, à la place de l’ancienne commande de réduction. Il revient à l’accueil, comme auparavant. Il n’y a plus de commande de réduction en double.

## Deux usages de l’agent apprentissage

| Accès | Usage et contexte |
| --- | --- |
| Point d’interrogation en bas à droite | Uniquement dans Apprentissage. Explique un mot, un acronyme ou une phrase avec le texte de la leçon active. |
| Robot à côté d’un exemple | Explique le code. Conserve le nom du fichier, son contenu et les explications associées. |

Le point d’interrogation a disparu d’Offres. L’historique des discussions est conservé. En mode local, les définitions proviennent du lexique et la réponse rappelle que l’aide n’est pas un modèle IA connecté. Une question sans définition locale le précise et propose le passage de cours concerné. Les réponses libres avancées demandent le raccordement de l’agent Django existant.

## Récupération de mot de passe

Le lien **Mot de passe oublié ?** ouvre un parcours complet d’écrans :

1. Adresse e-mail et demande des instructions.
2. Écran après demande, avec accès à la saisie du code.
3. Vérification par code ou mot de passe temporaire reçu.
4. Nouveau mot de passe et confirmation.
5. Résultat, puis retour à la connexion.

Un lien de récupération peut ouvrir directement le formulaire du nouveau mot de passe. Un lien incomplet ou déclaré expiré par le serveur affiche un écran pour en demander un autre. Les nouveaux écrans suivent le style de l’authentification et sont traduits en français/anglais.

| Route frontend | Écran |
| --- | --- |
| /#forgot | Demande par e-mail. |
| /#reset | Vérification par code ou mot de passe temporaire. |
| /#reset?uid=…&token=… | Nouveau mot de passe à partir du lien ; uidb64 est aussi accepté. |

Avec **VITE_AUTH_MODE=demo**, aucun e-mail n’est envoyé et aucun mot de passe réel n’est changé. Le bouton de démonstration permet de voir le formulaire suivant sans inventer de code reçu.

Avec **VITE_AUTH_MODE=api**, les adaptateurs sont prêts pour Django : demande, vérification, confirmation, initialisation CSRF et traitement des erreurs de lien. Le contrat exact figure dans [INTEGRATION_DJANGO.md](INTEGRATION_DJANGO.md). Le serveur doit fournir ces endpoints et envoyer l’e-mail ; aucun backend n’était joint à cette demande.

## Barres de défilement

Le rail utilise un gris-bleu arrondi ; le curseur est turquoise clair avec un dégradé et un reflet lumineux, suivant la référence. Le style couvre la page et les panneaux défilants, notamment le sommaire des cours. Le curseur conserve sa taille et son déplacement natifs selon la quantité de contenu.

Chrome/Edge utilisent le dégradé des pseudo-éléments WebKit ; Firefox dispose du même couple de couleurs avec son rendu natif. Le mode de contraste forcé conserve les couleurs système.

## Fichiers principaux

| Chemin dans src/ | Rôle |
| --- | --- |
| data/skillCatalog.ts | Suggestions issues des fiches visibles, sans les outils internes. |
| components/Workspace.tsx | Commande de réduction unique et Quitter en bas. |
| components/shared/FloatingTutor.tsx | Aide limitée à Apprentissage, distinction leçon/code et historique. |
| lib/learningTutorContext.ts, lib/tutorOverlayContext.ts | Contexte du passage de cours et inscription de la leçon active. |
| components/learning/HtmlCssClassroom.tsx | Transmission du texte de la leçon à l’aide générale. |
| components/PasswordRecovery.tsx | Écrans de récupération et leurs états. |
| lib/passwordRecovery.ts | Lecture du lien, validation de confirmation et adaptateurs HTTP. |
| revision-v18.css | Menu, récupération et barres de défilement. |

Les programmes, mini-projets, fichiers d’atelier, compilateur et ressources pédagogiques restent présents. Les modifications précédentes sont archivées dans MODIFICATIONS_V17.md.
