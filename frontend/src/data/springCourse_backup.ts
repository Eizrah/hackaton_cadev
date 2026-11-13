import { lesson, levelColors, quiz, section } from "./courseAuthoring";
import { springJava, springTest } from "./springAuthoring";
import { springFoundationProjects } from "./springProjects";
import { springAdvancedProjects } from "./springAdvancedProjects";
import type { WebLevel, WebProject } from "./webCourseTypes";

const boot = "https://docs.spring.io/spring-boot/3.5/";
const spring = "https://docs.spring.io/spring-framework/reference/";
const jpa = "https://docs.spring.io/spring-data/jpa/reference/";
const security = "https://docs.spring.io/spring-security/reference/6.5/";
const [[students, loan], [recipes, library]] = springFoundationProjects;
const [shop, teamwork] = springAdvancedProjects;
const example = (project: WebProject, entry: string) => ({
  ...project.files,
  entry,
});

const beginner: WebLevel["chapters"] = [
  {
    id: "spring-initialisation-ioc",
    title: "Initialisation et injection de dépendances",
    description:
      "Lance une application Java et laisse Spring assembler ses composants.",
    lessons: [
      lesson({
        id: "initializr-maven",
        title: "Créer un projet avec Spring Initializr",
        minutes: 18,
        summary:
          "Spring Initializr génère la structure du projet et les dépendances choisies. Maven lit pom.xml pour télécharger les bibliothèques, compiler et construire le JAR.",
        sections: [
          section(
            "Préparer l’environnement Java",
            "Vérifie java -version et mvn -v. Installe un JDK pour disposer du compilateur. Sur start.spring.io, choisis Java, Maven, Spring Web et Validation.",
            [
              "Tu peux aussi choisir Gradle. Ses fichiers de configuration et ses commandes diffèrent.",
              "src/main/java contient les sources et src/main/resources contient les réglages et ressources.",
              "@SpringBootApplication marque le point d’entrée. SpringApplication.run démarre le contexte et le serveur.",
            ],
          ),
        ],
        files: example(students, `${springJava}/AtelierApplication.java`),
        task: "Exporte le projet, lance mvn spring-boot:run puis lis le port indiqué dans le terminal.",
        takeaway:
          "Initializr prépare le dossier. Maven construit le projet. Spring Boot le démarre.",
        quiz: quiz(
          "Quel fichier décrit les dépendances de l’atelier Maven ?",
          ["pom.xml", "index.html", "application-dev.properties"],
          0,
          "Le POM est la description du projet Maven.",
        ),
        link: "https://start.spring.io/",
      }),
      lesson({
        id: "injection-java",
        title: "Classes, composants et injection par constructeur",
        minutes: 20,
        summary:
          "Une classe Java regroupe des données et des méthodes. Une interface décrit un contrat. L’inversion de contrôle confie à Spring la création et l’assemblage des objets utilisés par l’application.",
        sections: [
          section(
            "Relier un contrôleur à un service",
            "Le contrôleur demande StudentService dans son constructeur. Spring repère @Service et fournit l’objet lors de la création du contrôleur.",
            [
              "@Component marque une classe gérée par Spring. @Service indique un rôle de service métier.",
              "@Autowired demande une injection explicite. Un bean avec un seul constructeur peut généralement omettre cette annotation.",
              "Déclarer une dépendance dans le constructeur facilite la lecture et les tests.",
            ],
          ),
        ],
        files: example(students, `${springJava}/StudentController.java`),
        task: "Ouvre StudentController puis StudentService. Repère le constructeur qui reçoit le service et la classe qui porte la liste.",
        takeaway:
          "Spring assemble les dépendances. Le contrôleur délègue les règles au service.",
        quiz: quiz(
          "Qui fournit StudentService au constructeur du contrôleur ?",
          ["Spring", "Le navigateur", "Le fichier CSS"],
          0,
          "Le conteneur Spring crée les composants et leur transmet leurs dépendances.",
        ),
        link: spring + "core/beans/dependencies/factory-collaborators.html",
      }),
    ],
  },
  {
    id: "spring-rest",
    title: "Contrôleurs REST et routes HTTP",
    description: "Mappe les opérations et lis les paramètres de la requête.",
    lessons: [
      lesson({
        id: "mappings-rest",
        title: "Associer les méthodes HTTP à un contrôleur",
        minutes: 19,
        summary:
          "@RestController déclare une classe qui renvoie des données dans la réponse HTTP. @RequestMapping peut ajouter un préfixe commun à ses routes.",
        sections: [
          section(
            "Construire un CRUD",
            "Le contrôleur étudiant associe GET à la lecture, POST à la création, PUT au remplacement d’une fiche et DELETE à la suppression.",
            [
              "@GetMapping, @PostMapping, @PutMapping et @DeleteMapping ciblent les méthodes correspondantes.",
              "Après une création, le projet renvoie 201. Après suppression, il répond 204 avec un corps vide.",
              "Le convertisseur JSON transforme les records et listes Java en corps de réponse.",
            ],
          ),
        ],
        files: example(students, `${springJava}/StudentController.java`),
        task: "Utilise les commandes du README pour créer puis modifier un étudiant. Compare le résultat de GET avant et après.",
        takeaway:
          "Les annotations lient une méthode Java à un chemin et une méthode HTTP.",
        quiz: quiz(
          "Quelle annotation convient à la suppression d’un étudiant ?",
          ["@GetMapping", "@DeleteMapping", "@RequestBody"],
          1,
          "DELETE exprime l’action de supprimer la ressource ciblée.",
        ),
        link: spring + "web/webmvc/mvc-controller/ann-requestmapping.html",
      }),
      lesson({
        id: "parametres-spring",
        title: "Lire un identifiant et un filtre",
        minutes: 16,
        summary:
          "@PathVariable lit une partie du chemin. @RequestParam lit une valeur de la chaîne de requête, par exemple un filtre ou un numéro de page.",
        sections: [
          section(
            "Identifier ou filtrer",
            "Dans /api/students/1, id désigne une fiche. Dans /api/students?name=Tiana, name sélectionne des éléments dans la liste.",
            [
              "Choisis un chemin pour l’identifiant de la ressource.",
              "Choisis un paramètre de requête pour une option de recherche.",
              "Une valeur par défaut permet de traiter l’absence d’un filtre.",
            ],
          ),
        ],
        files: example(students, `${springJava}/StudentController.java`),
        task: "Ouvre l’URL d’un étudiant par id puis filtre avec ?name=Tiana. Essaie un id inconnu.",
        takeaway:
          "Le chemin désigne la ressource. La chaîne de requête précise le résultat attendu.",
        quiz: quiz(
          "Que lit @RequestParam dans cet exemple ?",
          ["Le corps JSON", "Le filtre name", "Le fichier pom.xml"],
          1,
          "name est transmis dans la chaîne après le point d’interrogation.",
        ),
        link:
          spring + "web/webmvc/mvc-controller/ann-methods/requestparam.html",
      }),
    ],
  },
  {
    id: "spring-dto-validation",
    title: "Corps JSON, DTO et validation",
    description:
      "Décris les valeurs acceptées et rejette les entrées invalides.",
    lessons: [
      lesson({
        id: "dto-request-body",
        title: "Mapper le JSON vers un DTO",
        minutes: 19,
        summary:
          "Un DTO est un objet qui transporte des données entre deux couches. @RequestBody demande à Spring de lire le corps JSON et de créer l’objet attendu.",
        sections: [
          section(
            "Définir une entrée claire",
            "LoanInput contient principal, annualRate et months. Un record Java représente ce petit ensemble de valeurs et fournit ses accesseurs.",
            [
              "Le contrôleur délègue le calcul à LoanService.",
              "BigDecimal permet de garder une précision décimale explicite pour le calcul pédagogique.",
              "Utilise Content-Type: application/json lorsque tu envoies le corps JSON.",
            ],
          ),
        ],
        files: example(loan, `${springJava}/LoanController.java`),
        task: "Envoie le corps JSON donné dans le README et repère les champs dans LoanInput.",
        takeaway: "Le DTO décrit les données échangées avec le client.",
        quiz: quiz(
          "Quelle annotation lit le JSON du corps de la requête ?",
          ["@RequestBody", "@PathVariable", "@Component"],
          0,
          "Spring convertit le corps en l’objet passé à @RequestBody.",
        ),
        link: spring + "web/webmvc/mvc-controller/ann-methods/requestbody.html",
      }),
      lesson({
        id: "validation-spring",
        title: "Appliquer @Valid, @NotNull et @Size",
        minutes: 19,
        summary:
          "Les contraintes de Jakarta Validation décrivent ce que tu acceptes. @Valid demande leur vérification avant l’appel au traitement.",
        sections: [
          section(
            "Vérifier la forme et les bornes",
            "@NotNull exige une valeur. @Size borne une chaîne ou une collection. @NotBlank exige du texte et @Email vérifie la forme d’une adresse.",
            [
              "Pour un nombre, utilise une borne comme @Min ou @DecimalMin.",
              "Choisis un type objet comme Integer quand l’absence doit être distinguée de zéro.",
              "Une erreur de validation de l’atelier renvoie 400 avec le champ concerné.",
            ],
          ),
        ],
        files: example(students, `${springJava}/StudentController.java`),
        task: "Envoie un e-mail invalide et compare la réponse avec celle d’une création réussie.",
        takeaway: "Le serveur valide le DTO avant d’appeler la logique métier.",
        quiz: quiz(
          "Que déclenche @Valid sur le DTO d’entrée ?",
          [
            "L’exécution des contraintes de validation",
            "La suppression des données",
            "La compilation du CSS",
          ],
          0,
          "Spring applique les contraintes déclarées sur l’objet d’entrée.",
        ),
        link: spring + "web/webmvc/mvc-controller/ann-validation.html",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "spring-entites-jpa",
    title: "Entités et Spring Data JPA",
    description: "Décris les tables et crée des dépôts Java pour y accéder.",
    lessons: [
      lesson({
        id: "entite-jpa",
        title: "Relier une classe à une table avec JPA",
        minutes: 20,
        summary:
          "JPA définit la correspondance entre objets et données relationnelles. Hibernate implémente cette correspondance et produit les opérations SQL utilisées par l’atelier.",
        sections: [
          section(
            "Décrire la recette",
            "@Entity marque la classe persistante. @Id identifie sa clé primaire. @GeneratedValue indique comment sa valeur est générée.",
            [
              "Un constructeur sans argument permet à JPA d’instancier l’entité.",
              "L’atelier utilise H2 en local. Le profil PostgreSQL est disponible pour l’exercice de recettes.",
              "Le contrôleur renvoie un DTO et choisit les champs exposés.",
            ],
          ),
        ],
        files: example(recipes, `${springJava}/Recipe.java`),
        task: "Repère id, title et category. Explique comment chaque recette reste identifiable après redémarrage.",
        takeaway:
          "L’entité représente des données persistantes et possède une identité stable.",
        quiz: quiz(
          "Quelle annotation désigne la clé primaire ?",
          ["@Id", "@RequestParam", "@Valid"],
          0,
          "@Id marque le champ qui identifie l’entité.",
        ),
        link: "https://spring.io/guides/gs/accessing-data-jpa",
      }),
      lesson({
        id: "repository-jpa",
        title: "Construire des requêtes avec JpaRepository",
        minutes: 21,
        summary:
          "JpaRepository fournit les opérations courantes comme save, findAll, findById et delete. Spring Data peut aussi dériver une requête du nom d’une méthode.",
        sections: [
          section(
            "Filtrer sur une relation",
            "findByCategory_NameIgnoreCaseOrderByIdAsc filtre sur le nom de catégorie sans tenir compte de la casse, puis trie par identifiant.",
            [
              "L’interface JpaRepository<Recipe, Long> précise le type de l’entité et celui de son identifiant.",
              "findById renvoie un Optional. Prévois le cas où aucune ligne ne correspond.",
              "@EntityGraph indique quelles relations charger pour produire la fiche.",
            ],
          ),
        ],
        files: example(recipes, `${springJava}/RecipeRepository.java`),
        task: "Crée une recette dans une catégorie puis compare GET /api/recipes avec une recherche qui ne trouve rien.",
        takeaway:
          "Le dépôt centralise les accès aux données. Son contrat peut se lire dans les signatures Java.",
        quiz: quiz(
          "Que renvoie findById quand l’identifiant n’existe pas ?",
          ["Un Optional vide", "Un nouveau produit", "Un template HTML"],
          0,
          "Optional permet de traiter l’absence explicitement.",
        ),
        link: jpa + "jpa/query-methods.html",
      }),
    ],
  },
  {
    id: "spring-relations-transactions",
    title: "Relations et transactions",
    description:
      "Associe des entités et garde la base cohérente lors d’une modification.",
    lessons: [
      lesson({
        id: "relations-jpa",
        title: "Associer les catégories et les étiquettes",
        minutes: 23,
        summary:
          "Une recette appartient à une catégorie et une catégorie contient plusieurs recettes. Une étiquette peut être utilisée sur plusieurs recettes et une recette peut en recevoir plusieurs.",
        sections: [
          section(
            "Repérer le côté propriétaire",
            '@ManyToOne porte la clé category_id côté recette. @OneToMany(mappedBy = "category") lit la relation depuis la catégorie.',
            [
              "@ManyToMany peut s’appuyer sur une table intermédiaire. Ici recipe_tags associe les identifiants de recettes et d’étiquettes.",
              "Lis les associations dont le DTO a besoin dans la transaction de lecture.",
              "La catégorie d’une recette est obligatoire. Les étiquettes sont facultatives.",
            ],
          ),
        ],
        files: example(recipes, `${springJava}/Recipe.java`),
        task: "Ajoute la même étiquette à deux recettes. Vérifie la catégorie et les étiquettes dans la réponse JSON.",
        takeaway:
          "Une clé étrangère relie une recette à sa catégorie. Une table intermédiaire relie les recettes à leurs étiquettes.",
        quiz: quiz(
          "Quelle annotation décrit les étiquettes partagées ?",
          ["@ManyToMany", "@PostMapping", "@NotBlank"],
          0,
          "La relation peut contenir plusieurs objets des deux côtés.",
        ),
        link: "https://docs.jboss.org/hibernate/orm/6.6/userguide/html_single/Hibernate_User_Guide.html#associations",
      }),
      lesson({
        id: "transaction-spring",
        title: "Emprunter un livre dans une transaction",
        minutes: 24,
        summary:
          "@Transactional définit une unité de travail. La vérification de l’état et la modification d’un livre s’effectuent ensemble.",
        sections: [
          section(
            "Gérer deux demandes concurrentes",
            "Le service charge le livre avec un verrou d’écriture. Il vérifie sa disponibilité puis renseigne l’emprunteur avant la fin de la transaction.",
            [
              "Les exceptions non contrôlées entraînent généralement l’annulation de la transaction Spring.",
              "Une entité gérée est mise à jour par JPA lorsque la transaction se termine.",
              "Le second emprunt voit le livre déjà attribué et reçoit 409.",
            ],
          ),
        ],
        files: example(library, `${springJava}/LibraryService.java`),
        task: "Emprunte le même livre deux fois puis rends-le. Vérifie le statut et l’état dans GET /api/books à chaque étape.",
        takeaway:
          "La transaction fixe le périmètre de l’opération. Le verrou évite de prendre deux décisions sur le même état.",
        quiz: quiz(
          "Quand vérifier la disponibilité du livre dans cet exemple ?",
          [
            "Après avoir pris le verrou, dans la transaction",
            "Dans le HTML seul",
            "Après avoir envoyé la réponse",
          ],
          0,
          "La lecture et la modification doivent être protégées ensemble.",
        ),
        link: jpa + "jpa/locking.html",
      }),
    ],
  },
  {
    id: "spring-erreurs",
    title: "Gestion globale des exceptions",
    description: "Retourne des erreurs que le frontend peut interpréter.",
    lessons: [
      lesson({
        id: "rest-controller-advice",
        title: "Centraliser les réponses d’erreur",
        minutes: 20,
        summary:
          "@RestControllerAdvice rassemble des traitements communs aux contrôleurs. Une méthode @ExceptionHandler peut transformer une exception reconnue en réponse JSON.",
        sections: [
          section(
            "Garder les actions lisibles",
            "ApiErrors reçoit une ResponseStatusException et crée un ProblemDetail avec le statut et un message. Les contrôleurs gardent leur traitement principal.",
            [
              "Utilise 404 quand la ressource ciblée est absente.",
              "Utilise 409 quand l’état actuel empêche l’opération, par exemple un emprunt déjà en cours.",
              "Expose au client un message prévu pour lui et garde les détails techniques côté serveur.",
            ],
          ),
        ],
        files: example(library, `${springJava}/ApiErrors.java`),
        task: "Compare le JSON d’un livre absent et celui d’un emprunt déjà pris.",
        takeaway:
          "Une réponse d’erreur stable aide le client à afficher le bon retour.",
        quiz: quiz(
          "Où centraliser une réponse d’erreur commune aux contrôleurs ?",
          [
            "Dans un @RestControllerAdvice",
            "Dans pom.xml",
            "Dans le DTO d’entrée",
          ],
          0,
          "Le conseil intercepte les exceptions sélectionnées pour plusieurs contrôleurs.",
        ),
        link: spring + "web/webmvc/mvc-controller/ann-exceptionhandler.html",
      }),
      lesson({
        id: "problemes-http",
        title: "Choisir une exception et un statut précis",
        minutes: 17,
        summary:
          "Une exception métier décrit pourquoi une action ne peut pas aboutir. AlreadyBorrowed représente ici un conflit de disponibilité.",
        sections: [
          section(
            "Distinguer des situations proches",
            "Un livre inconnu donne 404. Un livre connu mais indisponible donne 409. Une donnée de requête mal formée donne 400.",
            [
              "ProblemDetail fournit des champs standards comme status et detail.",
              "L’atelier ajoute fields à l’erreur de validation pour aider à corriger la saisie.",
              "Teste chaque branche avec une requête adaptée.",
            ],
          ),
        ],
        files: example(library, `${springJava}/LibraryService.java`),
        task: "Envoie un emprunt avec un lecteur absent, puis avec un livre déjà pris. Note les statuts et messages.",
        takeaway:
          "Le statut indique la famille de problème. Le détail explique l’action possible.",
        quiz: quiz(
          "Quel statut convient à un livre déjà emprunté ?",
          ["409", "201", "204"],
          0,
          "Le conflit porte sur l’état courant d’un livre qui existe.",
        ),
        link: spring + "web/webmvc/mvc-ann-rest-exceptions.html",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "spring-security",
    title: "Spring Security, JWT et rôles",
    description:
      "Identifie l’appelant et applique ses droits avant de traiter la requête.",
    lessons: [
      lesson({
        id: "chaine-filtres-spring",
        title: "Configurer la chaîne de filtres",
        minutes: 23,
        summary:
          "Spring Security place des filtres avant les contrôleurs. SecurityFilterChain fixe les chemins publics, les chemins protégés et la façon dont un appel s’identifie.",
        sections: [
          section(
            "Suivre un jeton Bearer",
            "Dans l’atelier, le filtre BearerTokenAuthenticationFilter extrait le jeton. Le serveur de ressources le transmet au JwtDecoder puis crée l’authentification si la vérification réussit.",
            [
              "La chaîne autorise le catalogue en lecture et réserve les commandes aux comptes connectés.",
              "Un filtre personnalisé OncePerRequestFilter peut ajouter une mesure ou un traitement métier. Laisse le décodage et la validation du JWT à Spring Security.",
              "Cette API utilise des en-têtes Bearer sans session ni cookie d’authentification. Pour une application à session, configure aussi la protection CSRF.",
            ],
          ),
        ],
        files: example(shop, `${springJava}/SecurityConfig.java`),
        task: "Appelle /api/products et /api/orders sans jeton. Compare 200 et 401.",
        takeaway:
          "La chaîne choisit comment authentifier la requête et décide si elle peut atteindre le contrôleur.",
        quiz: quiz(
          "Quel composant valide le JWT dans cet atelier ?",
          ["JwtDecoder", "JpaRepository", "@RequestParam"],
          0,
          "Le serveur de ressources utilise JwtDecoder pour vérifier le jeton.",
        ),
        link: security + "servlet/oauth2/resource-server/jwt.html",
      }),
      lesson({
        id: "jwt-et-roles",
        title: "Émettre un jeton de test et vérifier un rôle",
        minutes: 24,
        summary:
          "Un JWT signé contient des claims, notamment un identifiant de compte et une expiration. Le serveur vérifie sa signature, son émetteur, son audience et sa validité temporelle.",
        sections: [
          section(
            "Passer de l’identité aux autorisations",
            "LocalTokens authentifie un compte de démonstration et émet un jeton de 15 minutes. SecurityConfig convertit le claim roles en autorités ROLE_…",
            [
              "@PreAuthorize(\"hasRole('ADMIN')\") protège l’ajout d’un produit.",
              "Un JWT signé reste lisible par son détenteur. Évite d’y mettre des secrets.",
              "Pour un serveur déployé, le profil prod attend un fournisseur d’identité qui émet les jetons. Le profil local génère sa propre clé de test.",
            ],
          ),
        ],
        files: example(shop, `${springJava}/LocalTokens.java`),
        task: "Demande les jetons Alice et Admin. Essaie de créer le même produit avec chacun et compare 403 et 201.",
        takeaway:
          "L’authentification établit l’identité. Les règles d’autorisation limitent l’action.",
        quiz: quiz(
          "Quel mécanisme protège la méthode d’ajout de produit ?",
          ["@PreAuthorize avec le rôle ADMIN", "@Entity", "@NotNull"],
          0,
          "@PreAuthorize évalue l’autorisation avant l’appel de méthode.",
        ),
        link: security + "servlet/authorization/method-security.html",
      }),
    ],
  },
  {
    id: "spring-tests",
    title: "Tests unitaires et tests d’intégration",
    description:
      "Teste une règle seule puis vérifie son effet dans l’application entière.",
    lessons: [
      lesson({
        id: "junit-mockito",
        title: "Isoler une règle avec JUnit et Mockito",
        minutes: 22,
        summary:
          "Un test unitaire vérifie une classe avec ses dépendances contrôlées. Mockito remplace le dépôt, et JUnit compare le résultat attendu au résultat obtenu.",
        sections: [
          section(
            "Tester l’appartenance à un espace",
            "WorkspaceAccessTest fabrique un faux MembershipRepository. Il définit une réponse pour Alice et vérifie le comportement pour Alice et Bob.",
            [
              "when(...).thenReturn(...) définit la réponse du mock.",
              "assertTrue et assertFalse vérifient le résultat de la règle. verify vérifie un appel attendu au dépôt.",
              "Aucun serveur HTTP ni moteur de base de données n’est nécessaire pour ce test.",
            ],
          ),
        ],
        files: example(teamwork, `${springTest}/WorkspaceAccessTest.java`),
        task: "Lance mvn test puis ajoute un scénario où Alice demande l’accès à l’espace 2.",
        takeaway:
          "Le test unitaire contrôle la règle en isolant ses dépendances.",
        quiz: quiz(
          "Pourquoi remplacer le dépôt dans ce test ?",
          [
            "Pour maîtriser les réponses sans démarrer la base",
            "Pour supprimer toutes les assertions",
            "Pour créer le JAR",
          ],
          0,
          "Le mock contrôle l’entrée de la règle testée.",
        ),
        link: "https://docs.spring.io/spring-boot/3.5/reference/testing/index.html",
      }),
      lesson({
        id: "mockmvc-integration",
        title: "Vérifier une API avec MockMvc et H2",
        minutes: 25,
        summary:
          "@SpringBootTest démarre le contexte de l’application. @AutoConfigureMockMvc permet d’envoyer des requêtes de test dans la pile web sans ouvrir un port réseau.",
        sections: [
          section(
            "Traverser les couches de l’application",
            "ShopHttpTest demande de vrais jetons locaux, fait des requêtes MockMvc et observe les opérations JPA sur la base H2 de test.",
            [
              "Teste le refus anonyme, le refus d’un rôle insuffisant et le succès d’un appel autorisé.",
              "Vérifie qu’une commande affecte le stock et que l’historique appartient au compte connecté.",
              '@ActiveProfiles("test") choisit la base en mémoire pour isoler les données.',
            ],
          ),
        ],
        files: example(shop, `${springTest}/ShopHttpTest.java`),
        task: "Lance mvn test et repère les vérifications 401, 403, 409 et 201. Ajoute un test de quantité zéro.",
        takeaway:
          "L’intégration vérifie le passage par les filtres, le contrôleur et la persistance.",
        quiz: quiz(
          "Que vérifie ici MockMvc avec le contexte Spring ?",
          [
            "Le parcours d’une requête de test dans l’application",
            "La capacité du disque du serveur",
            "Le style des boutons",
          ],
          0,
          "MockMvc traverse les filtres et les contrôleurs du contexte configuré.",
        ),
        link: boot + "reference/testing/spring-boot-applications.html",
      }),
    ],
  },
  {
    id: "spring-industrialisation",
    title: "Profils, architecture et conteneurs",
    description: "Sépare les réglages et prépare un artefact portable.",
    lessons: [
      lesson({
        id: "profils-architecture",
        title: "Séparer les profils et les dépendances métier",
        minutes: 24,
        summary:
          "Un profil Spring sélectionne des réglages selon l’environnement. Les contrôleurs, services et dépôts séparent déjà plusieurs responsabilités dans les projets.",
        sections: [
          section(
            "Isoler les réglages",
            "application-dev.properties configure H2 sur disque. application-test.properties fournit H2 en mémoire aux tests. application-prod.properties décrit PostgreSQL et l’émetteur de jetons.",
            [
              "SPRING_PROFILES_ACTIVE choisit le profil. Fournis les identifiants et secrets par l’environnement du processus.",
              "Le profil prod illustre une base dont le schéma est déjà migré et un fournisseur d’identité configuré.",
            ],
          ),
          section(
            "Aller vers une architecture hexagonale",
            "Définis le contrat métier dans un port Java, par exemple MembershipLookup. Un adaptateur JPA peut implémenter ce port. Un test peut utiliser une implémentation de mémoire.",
            [
              "L’atelier organise déjà les accès à l’espace via WorkspaceAccess et MembershipRepository.",
              "La prochaine étape de conception consiste à garder les règles métier indépendantes de l’interface HTTP et de la technologie de persistance.",
            ],
          ),
        ],
        files: example(
          teamwork,
          "src/main/resources/application-prod.properties",
        ),
        task: "Compare les profils et propose une interface MembershipLookup avec une méthode pour vérifier un membre.",
        takeaway:
          "Les profils changent la configuration. Les interfaces permettent de changer une implémentation sans réécrire la règle.",
        quiz: quiz(
          "Où fournir les identifiants de la base dans le profil de déploiement ?",
          [
            "Dans les variables du serveur",
            "Dans une page HTML",
            "Dans un DTO public",
          ],
          0,
          "Le service fournit les secrets par son environnement.",
        ),
        link: boot + "reference/features/profiles.html",
      }),
      lesson({
        id: "spring-docker",
        title: "Construire un JAR et une image Docker",
        minutes: 25,
        summary:
          "Maven compile le code, lance les tests et produit le JAR. Un Dockerfile multi-étapes sépare la construction de l’image qui exécute l’application.",
        sections: [
          section(
            "Lire les deux étapes",
            "L’image Maven télécharge les dépendances et lance mvn package. L’image finale copie target/atelier.jar et le lance avec un utilisateur dédié.",
            [
              "Tu peux lancer java -jar target/atelier.jar sans Docker pour vérifier le résultat local.",
              "Le README montre un lancement Docker publié sur le port local. Le profil de déploiement demande une configuration dédiée.",
              "Le JAR et les tests font partie de la vérification avant livraison.",
            ],
          ),
        ],
        files: example(shop, "Dockerfile"),
        task: "Lance mvn package et vérifie que le JAR répond sur /api/products. Si Docker est installé, essaie le Dockerfile sur ta machine.",
        takeaway:
          "L’étape de construction prépare l’artefact. L’image d’exécution contient le JAR et le runtime Java.",
        quiz: quiz(
          "Qu’est-ce qui est copié dans l’image finale ?",
          [
            "Le JAR construit",
            "Le dépôt Maven entier",
            "L’ensemble des tests source",
          ],
          0,
          "L’image finale récupère l’artefact nécessaire à l’exécution.",
        ),
        link: "https://docs.docker.com/build/building/multi-stage/",
      }),
    ],
  },
];

export const springLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Spring MVC et premières API REST",
    definition:
      "Spring Boot est un outil de l’écosystème Spring pour démarrer une application Java. Il configure automatiquement les composants correspondant aux dépendances choisies et peut embarquer le serveur HTTP. Avec Spring MVC, tu peux relier des URLs à des méthodes Java et renvoyer du JSON.",
    objective:
      "Démarre une application Java, injecte un service dans un contrôleur et réponds à des requêtes HTTP validées.",
    color: levelColors[0],
    prerequisites:
      "Pour démarrer, révise les classes, interfaces, listes et exceptions en Java.",
    outcomes: [
      "Générer un projet et lancer son serveur.",
      "Comprendre l’inversion de contrôle et l’injection.",
      "Mapper les méthodes HTTP et les paramètres.",
      "Décrire un DTO et rejeter les données invalides.",
    ],
    chapters: beginner,
    projects: springFoundationProjects[0],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "JPA, relations et transactions",
    objective:
      "Stocke les données dans une base relationnelle, applique des règles cohérentes et donne un statut clair aux erreurs.",
    color: levelColors[1],
    prerequisites:
      "Pour démarrer, sache lire un contrôleur REST et créer un DTO en Java.",
    outcomes: [
      "Modéliser des entités persistantes et des dépôts.",
      "Écrire des requêtes dérivées et des relations.",
      "Protéger une opération avec une transaction.",
      "Structurer les réponses d’erreur de l’API.",
    ],
    chapters: intermediate,
    projects: springFoundationProjects[1],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Sécurité, tests et déploiement",
    objective:
      "Protège une API par JWT et permissions métier, vérifie-la avec des tests et prépare son JAR.",
    color: levelColors[2],
    prerequisites:
      "Pour démarrer, maîtrise les contrôleurs, JPA et les transactions de l’atelier.",
    outcomes: [
      "Configurer la chaîne de filtres et les contrôles de rôles.",
      "Vérifier un jeton et l’appartenance à une équipe.",
      "Écrire des tests JUnit, Mockito et MockMvc.",
      "Séparer les environnements et construire un JAR conteneurisable.",
    ],
    chapters: advanced,
    projects: springAdvancedProjects,
  },
];
