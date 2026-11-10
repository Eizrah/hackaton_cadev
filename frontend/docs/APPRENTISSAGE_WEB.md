# Apprentissage Web et Mobile

Version du 7 novembre 2026. Dans VS Code, ouvre le dossier `frontend` qui contient `package.json` et `package-lock.json`. Lance `npm ci`, puis `npm run dev`.

Dans la plateforme, ouvre **Apprentissage → Web → Frontend** pour HTML5 & CSS3, JavaScript, React et Vue.js. Ouvre **Web → Backend** pour Django, Node.js & Express, Laravel et Spring Boot. Ouvre **Mobile → Android** pour Kotlin, Jetpack Compose et Java. Le parcours Swift & SwiftUI se trouve dans **Mobile → iOS**. Ouvre **Mobile → Multiplateforme** pour Flutter & Dart et React Native. Le sommaire donne accès aux leçons, quiz et projets. Le bloc **Ce que tu sauras à ce niveau** détaille les objectifs.

| Parcours | Débutant | Intermédiaire | Avancé |
| --- | --- | --- | --- |
| HTML5 & CSS3 | 7 leçons. CV et recette. | 6 leçons. Landing page et galerie responsive. | 8 leçons. Dashboard et site animé. |
| JavaScript | 7 leçons. Compteur et générateur de citations. | 6 leçons. Todo List et météo. | 7 leçons. Memory et lecteur audio. |
| React | 7 leçons. Votes et convertisseur de devises. | 6 leçons. Catalogue de films et Kanban. | 6 leçons. Boutique avec panier et mini réseau social. |
| Vue.js | 6 leçons. Liste de courses et carte de visite. | 6 leçons. Tableau crypto et quiz à composants. | 6 leçons. Lecteur Pinia et blog Nuxt. |
| Django | 6 leçons. Blog personnel et générateur de citations. | 6 leçons. Liste de tâches et petites annonces. | 6 leçons. API de boutique et réseau privé. |
| Laravel | 6 leçons. Annuaire et blog à partir de fichiers. | 6 leçons. Gestion de projets et calendrier de meetups. | 6 leçons. Forum Sanctum et tickets avec worker. |
| Spring Boot | 6 leçons. API d’étudiants et calculateur de prêt. | 6 leçons. API de recettes et bibliothèque. | 6 leçons. Commandes avec JWT et tâches d’équipe. |
| Node.js & Express | 6 leçons. Liste de tâches et convertisseur de devises. | 6 leçons. Magasin MongoDB et inscription avec Joi. | 6 leçons. Commandes avec JWT et chat Socket.IO. |
| Kotlin | 6 leçons. IMC en console et convertisseur de températures. | 6 leçons. Bibliothèque et simulateur de panier. | 6 leçons. Téléchargements simulés et compteur Flow. |
| Jetpack Compose | 6 leçons. Profil et formulaire de connexion. | 6 leçons. Tableau des scores et fil d’actualités. | 6 leçons. Boutique avec MVVM et tâches animées. |
| Java pour Android | 6 leçons. Tableau de scores et connexion en deux écrans. | 6 leçons. Carnet de notes et grille de films. | 6 leçons. Météo hors ligne et fil d’actualités avec favoris. |
| Swift & SwiftUI | 6 leçons. Carte de visite et compteur de points. | 6 leçons. Tâches avec MVVM et suivi de dépenses. | 6 leçons. Cours des cryptos et journal SwiftData. |
| Flutter & Dart | 6 leçons. Carte de profil et compteur de clics. | 6 leçons. Gestionnaire de tâches et panier Provider. | 6 leçons. Catalogue BLoC avec Hero et météo hors ligne avec Isar. |
| React Native | 6 leçons. Carte de profil et vote. | 6 leçons. Liste d’envies et fil d’actualités. | 6 leçons. Boutique avec API et tableau de taux Reanimated. |

Chaque leçon combine une explication, des fichiers d’exemple, une activité, un quiz et un lien de référence. Les projets contiennent un code de départ, des pistes et des critères à vérifier. Les niveaux de cours sont propres à l’apprentissage et indépendants du niveau général du profil (Débutant, Intermédiaire ou Avancé).

## Catalogue

Les domaines sont Web, Mobile et Langages de programmation. Le Backend propose quatre cours détaillés. Mobile propose trois cours Android, un cours iOS et deux cours multiplateformes détaillés.

| Domaine | Fiches et parcours |
| --- | --- |
| Web Frontend | HTML5 & CSS3, JavaScript, React, Vue.js |
| Web Backend | Django, Node.js & Express, Laravel, Spring Boot |
| Mobile | Kotlin, Jetpack Compose, Java Android, Swift et SwiftUI, Flutter avec Dart, React Native |
| Langages de programmation | C, C++, Java, Python, JavaScript, TypeScript, PHP, Swift, SQL |

Les cours détaillés C, C++ et Java sont accessibles dans Langages de programmation. Leurs 60 leçons et dix projets sont décrits dans `docs/APPRENTISSAGE_LANGAGES.md`, avec la préparation de la compilation intégrée et des fenêtres GTK, Qt et JavaFX.

Les anciennes adresses `cours/html-web` et `cours/css-web` restent utilisables. Elles ouvrent respectivement « HTML : structurer une page » et « Syntaxe CSS, sélecteurs et cascade » dans le nouveau bloc.

## Pratiquer dans l’atelier

Clique sur **Essayer dans l’atelier** dans une leçon ou ouvre un mini-projet depuis le sommaire. Les cours partagent les onglets, la coloration et les numéros de ligne. Sur téléphone, **Code** alterne avec **Aperçu** ou **Lancement**, selon l’exercice.

| Commande | Fonctionnement |
| --- | --- |
| Onglets de fichiers | Sélectionne les fichiers du projet. Laravel expose le PHP, les vues Blade et les migrations. Spring Boot expose le Java, le POM et les profils. |
| Lancer l’aperçu | Affiche le rendu HTML et CSS. |
| Exécuter | Lance JavaScript, React ou Vue.js et affiche le résultat interactif. |
| Console | Affiche les traces, les erreurs de syntaxe et les erreurs d’exécution. |
| Ajouter un fichier | Le bouton **+** crée un fichier de code adapté à l’atelier. Son nom s’affiche en blanc. Utilise un import relatif comme `./calcul.js` pour un module JavaScript. |
| Supprimer un fichier | Sélectionne un fichier que tu as créé, clique sur la corbeille et confirme. L’atelier enregistre la suppression et revient au fichier de départ. |
| Bureau, tablette et mobile | Utilise la largeur du panneau, 768 px ou 375 px. |
| Exporter .html | Télécharge une page avec les styles et le programme assemblés. Les projets qui appellent une API utilisent Internet. |
| Exporter le ZIP | Télécharge le code et la configuration du projet à exécuter sur ton ordinateur. **Guide de lancement** affiche les commandes ou les étapes Android Studio, Xcode, Flutter et Expo. |
| Image | Intègre une image locale PNG, JPEG, WebP ou GIF de 120 ko maximum dans le HTML. |
| Réinitialiser | Restaure le code de départ après confirmation. |

Ctrl+Entrée lance l’aperçu ou ouvre le guide du serveur local. Tab insère deux espaces dans la zone de code. Maj+Tab permet de revenir au contrôle précédent et Échap place le focus sur la commande d’exécution. La limite est de 250 000 caractères par fichier et de 16 fichiers ajoutés par atelier.

L’atelier exécute les scripts dans un cadre isolé de la plateforme. Il fournit React, React DOM et React Router aux exercices React. Les exercices Vue utilisent Vue 3, Vue Router et Pinia. La compilation des fichiers .vue accepte la Composition API, l’Options API, TypeScript et les styles CSS, y compris `scoped`. Les modules à importer se trouvent dans les fichiers de l’atelier ou les bibliothèques fournies. Utilise VS Code et le compilateur de ton projet pour vérifier les types.

Pour **Django**, exporte le ZIP, extrais-le et ouvre le dossier contenant `manage.py`. Le guide propose les commandes PowerShell et macOS/Linux. Elles créent un environnement Python, installent Django, génèrent et appliquent les migrations et lancent le serveur. L’exercice s’ouvre à `http://127.0.0.1:8000/`. Chaque ZIP contient un README avec les étapes et des indications propres au projet.

Pour **Laravel**, ouvre le dossier contenant `composer.json`. Le guide utilise PHP 8.2 ou plus récent, Composer 2 et PDO SQLite. Il installe les dépendances, prépare `.env`, applique les migrations et lance le serveur sur le port 8001. Les tickets utilisent une file database et un transport de courriel vers le journal local.

Pour **Spring Boot**, ouvre le dossier contenant `pom.xml` avec un JDK Java 17 ou plus récent et Maven. Lance `mvn spring-boot:run` puis ouvre `http://127.0.0.1:8080/`. Le README fournit les exemples de requêtes PowerShell. H2 démarre avec le projet, et les tests avancés s’exécutent avec `mvn test`.

Pour **Node.js & Express**, ouvre le dossier contenant `package.json` avec Node.js 24. Lance `npm install`, `npm run setup --if-present` puis `npm start`. Le serveur local écoute sur le port 3000. Les projets intermédiaires et avancés utilisent MongoDB. Le README précise le nom de la base, les réglages locaux et les requêtes à essayer.

Pour **Kotlin**, ouvre le dossier contenant `pom.xml` avec un JDK Java 17 ou plus récent et Maven. Lance `mvn -q compile exec:java`. Lis le résultat dans le terminal et saisis les valeurs demandées. Les ateliers Kotlin avancés ajoutent la bibliothèque de coroutines.

Pour **Jetpack Compose et Java Android**, extrais le ZIP et ouvre le dossier contenant `settings.gradle.kts` dans Android Studio. Synchronise avec un JDK 17 et le SDK Android 35, sélectionne un émulateur ou un appareil puis lance le projet. Sous PowerShell, `.\gradlew.bat assembleDebug` produit un APK de test. Sous macOS ou Linux, utilise `sh ./gradlew assembleDebug`. Le Gradle Wrapper est inclus dans chaque export Android.

Pour **Swift & SwiftUI**, extrais le ZIP sur un Mac et ouvre `DevAfrica.xcodeproj` dans Xcode 16 ou plus récent. Sélectionne le schéma DevAfrica et un simulateur sous iOS 17 ou plus récent, puis clique sur Run. Le dossier `Atelier` contient les fichiers compilés. Avec Swift installé sous Windows, tu peux pratiquer la syntaxe du projet Carte de visite depuis le terminal avec `swift Exemples/Bases.swift`.

Pour **Flutter & Dart**, ouvre le dossier qui contient `pubspec.yaml`. Installe le SDK Flutter et démarre un appareil. Le guide lance `flutter create --empty --platforms=android,ios .`, puis `flutter pub get` et `flutter run`. La météo ouvre une base Isar sur Android ou iOS et conserve une mesure datée de Toamasina. Pour modifier le modèle, régénère son schéma avec `dart run build_runner build`.

Pour **React Native**, installe les dépendances avec `npm install` puis lance `npm start`. Les ateliers ciblent Expo SDK 54. Le README de la boutique explique comment lancer `npm run api` et indiquer l’adresse de ton ordinateur. La boutique conserve le JWT dans SecureStore. Le tableau de taux conserve sa période avec AsyncStorage.

Pour **Nuxt**, exporte le ZIP et ouvre le dossier contenant `package.json`. Lance `npm install` puis `npm run dev`. Le serveur écoute sur `http://localhost:3000/`. Consulte le code source de la page pour voir le HTML rendu par le serveur.

Le brouillon de code et les données de `localStorage` sont propres à chaque atelier. La Todo List retrouve donc ses tâches après une relance. Réinitialiser le brouillon restaure les fichiers de départ et conserve les données de l’exercice et les validations enregistrées.

La météo utilise Open-Meteo. Le tableau crypto Vue charge des cours depuis CoinPaprika et indique si les prix affichés sont fictifs. Les lecteurs audio fournissent des pistes de synthèse locales. Les projets Django utilisent chacun leur base SQLite et leurs comptes de test.

## Progression

Une bonne réponse à la question de fin valide une leçon. Une mauvaise réponse affiche une explication et permet de réessayer. Une leçon n’est comptée qu’une fois.

Pour un projet, l’utilisateur teste son résultat puis coche les critères de la liste d’auto-évaluation. Le bouton **Marquer ce projet terminé** s’active lorsque tous les critères sont cochés. Cette liste est une auto-évaluation explicite : le code n’est pas noté automatiquement et aucun certificat n’est délivré.

La progression d’un niveau inclut ses leçons et les projets de ce niveau. La validation globale d’un parcours détaillé exige les trois niveaux terminés. Les validations des anciennes fiches de découverte restent séparées de celles des programmes détaillés. Le dernier choix de leçon est mémorisé par niveau.

## Comprendre le code et continuer

| Fichier | Rôle |
| --- | --- |
| `src/data/learning.ts` | Catalogue des trois domaines et fiches de découverte. |
| `src/data/htmlCssCourse.ts` | Leçons et projets HTML5 & CSS3. |
| `src/data/webCurricula.ts` | Programmes, niveaux et boîtes à outils de chaque cours. |
| `src/data/nodeCourse.ts`, `src/data/kotlinCourse.ts`, `src/data/composeCourse.ts` | Leçons, exemples, quiz et liens des nouveaux cours. |
| `src/data/androidJavaCourse.ts`, `src/data/swiftCourse.ts` | Leçons et quiz des cours Java Android et Swift & SwiftUI. |
| `src/data/androidJavaProjects.ts`, `src/data/swiftProjects.ts` et fichiers avancés correspondants | Consignes et fichiers des douze nouveaux mini-projets. |
| `src/components/modules/Learning.tsx` | Choix du domaine et du parcours, recherche et ouverture des fiches. |
| `src/components/learning/HtmlCssClassroom.tsx` | Salle de cours commune, niveaux, sommaire et progression. |
| `src/components/learning/WebCodeStudio.tsx` | Éditeur, aperçu, console, brouillons et auto-évaluation. |
| `src/lib/scriptPreview.ts`, `src/lib/vueStudioCompiler.ts` | Préparation des scripts et compilation des fichiers Vue. |
| `src/lib/webEditorFiles.ts` | Gestion des fichiers et restauration des brouillons. |
| `scripts/build-learning-runtime.mjs` | Prépare les bibliothèques React et Vue avant `npm run dev` et `npm run build`. |
| `src/components/learning/web-learning.css` | Dégradés bleus et adaptation du cours et de l’atelier à la largeur de l’écran. |

Les programmes sont chargés à l’ouverture d’un cours. Le compilateur Vue est chargé lors de la première exécution d’un atelier Vue. Les brouillons et la progression sont stockés dans le navigateur. La proposition de synchronisation avec le backend de la plateforme est dans `INTEGRATION_DJANGO.md`.

## Références pour approfondir

Références utilisées dans les cours et les ateliers.

- MDN, modèle de boîte : https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics/Box_model
- MDN, Flexbox : https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Flexbox
- MDN, responsive : https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- MDN, imbrication native : https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using
- MDN, ARIA : https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA
- MDN, iframe : https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/iframe
- VS Code, HTML : https://code.visualstudio.com/docs/languages/html
- Live Server, page de son extension : https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
- Chrome DevTools, inspection du CSS : https://developer.chrome.com/docs/devtools/css/

- [Guide JavaScript de MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide)
- [React Learn](https://react.dev/learn)
- [Guide de Vite](https://vite.dev/guide/)
- [Routage déclaratif de React Router](https://reactrouter.com/start/declarative/routing)
- [Composants serveur et client de Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [API météo Open-Meteo](https://open-meteo.com/en/docs)
- [API de géocodage Open-Meteo](https://open-meteo.com/en/docs/geocoding-api)
- [Documentation Studio Ghibli API](https://ghibliapi.vercel.app/)
- [Produits de démonstration DummyJSON](https://dummyjson.com/docs/products)
- [Guide Vue 3](https://vuejs.org/guide/introduction.html)
- [Pinia](https://pinia.vuejs.org/core-concepts/)
- [Vue Router](https://router.vuejs.org/guide/)
- [Rendu serveur Nuxt](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [Tutoriel Django 5.2](https://docs.djangoproject.com/fr/5.2/intro/tutorial01/)
- [Django REST Framework](https://www.django-rest-framework.org/tutorial/quickstart/)
- [Installation de Laravel 12](https://laravel.com/docs/12.x/installation)
- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)
- [Prérequis Spring Boot 3.5](https://docs.spring.io/spring-boot/3.5/system-requirements.html)
- [Spring Security et JWT](https://docs.spring.io/spring-security/reference/6.5/servlet/oauth2/resource-server/jwt.html)
- [Guide Express](https://expressjs.com/en/guide/routing.html)
- [Connexion MongoDB avec Mongoose](https://mongoosejs.com/docs/connections.html)
- [Salons Socket.IO](https://socket.io/docs/v4/rooms/)
- [Coroutines Kotlin](https://kotlinlang.org/docs/coroutines-guide.html)
- [État dans Jetpack Compose](https://developer.android.com/develop/ui/compose/state)
- [RecyclerView](https://developer.android.com/develop/ui/views/layout/recyclerview)
- [Permissions de localisation Android](https://developer.android.com/develop/sensors-and-location/location/permissions/runtime)
- [Configuration requise pour Xcode](https://developer.apple.com/xcode/system-requirements/)
- [Guide du langage Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Persistance avec SwiftData](https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches)
- [Installation de Flutter](https://docs.flutter.dev/install)
- [Versions compatibles d’Expo Go](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/)
- [Stockage de données avec Expo](https://docs.expo.dev/develop/user-interface/store-data/)
