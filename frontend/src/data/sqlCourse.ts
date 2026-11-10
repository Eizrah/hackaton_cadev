import { lesson, levelColors, quiz, section } from "./courseAuthoring";
import { sqlFiles } from "./scriptAuthoring";
import {
  contactsSchema,
  ordersSchema,
  sqlContacts,
  sqlOrders,
  sqlSales,
} from "./sqlProjects";
import type { WebLevel } from "./webCourseTypes";
const docs = "https://www.sqlite.org/";
const beginner: WebLevel["chapters"] = [
  {
    id: "sql-structures",
    title: "Base, tables et identifiants",
    description: "Comprends l’organisation relationnelle et son vocabulaire.",
    lessons: [
      lesson({
        id: "sql-base-table",
        title: "Base, table, colonne et ligne",
        minutes: 19,
        summary:
          "Une base regroupe des tables. Une table définit des colonnes et contient des lignes. Chaque ligne représente ici un contact et chaque colonne décrit une propriété comme son prénom.",
        sections: [
          section(
            "Lire une table",
            "SELECT choisit les colonnes à présenter et FROM nomme la table à lire. L’ordre écrit dans SELECT devient l’ordre des colonnes du résultat.",
            [
              "Une ligne est aussi appelée enregistrement.",
              "Un résultat de requête est présenté dans son propre tableau.",
            ],
          ),
          section(
            "Découvrir le terminal",
            "Le bouton Exécuter le SQL lance le fichier actif. Tu peux aussi écrire une instruction dans Terminal SQL puis utiliser Exécuter la requête.",
            [
              "L’onglet Tables montre la structure de la base de cet atelier.",
              "Le terminal conserve sa base pour cet exercice dans ce navigateur.",
            ],
          ),
        ],
        files: sqlFiles(
          contactsSchema,
          "SELECT prenom, nom, telephone FROM contacts;",
        ),
        task: "Exécute puis inverse l’ordre nom et prenom dans SELECT.",
        takeaway:
          "La table organise les données et la requête choisit leur présentation.",
        quiz: quiz(
          "Que représente une ligne de contacts ?",
          [
            "Une propriété seule",
            "Un fichier de style",
            "Un contact enregistré",
          ],
          2,
          "Les colonnes décrivent les propriétés et chaque ligne contient un contact.",
        ),
        link: docs + "lang_select.html",
      }),
      lesson({
        id: "sql-types-cle",
        title: "Types, clé primaire et valeurs absentes",
        minutes: 23,
        summary:
          "Une clé primaire identifie une ligne. Dans SQLite, INTEGER PRIMARY KEY permet un identifiant entier généré à l’insertion. NOT NULL interdit une valeur absente dans la colonne concernée.",
        sections: [
          section(
            "Lire le schéma",
            "Le schéma des contacts donne un identifiant, des noms, un téléphone et un email. Le téléphone reste un texte pour conserver les préfixes et les zéros.",
            [
              "TEXT conserve le texte dans les exercices SQLite.",
              "NULL exprime une valeur absente et se teste avec IS NULL.",
            ],
          ),
          section(
            "Connaître le dialecte utilisé",
            "Le terminal utilise SQLite et ouvre une base depuis son fichier. MySQL propose notamment CREATE DATABASE et AUTO_INCREMENT. SQLite emploie ici INTEGER PRIMARY KEY et des dates textuelles au format ISO.",
            [
              "Les mots-clés et certains types varient selon le moteur.",
              "SQLite applique des affinités de type. Une contrainte CHECK peut ajouter une règle de valeur.",
            ],
          ),
        ],
        files: sqlFiles(
          contactsSchema,
          "SELECT id, nom, email FROM contacts WHERE email IS NULL;",
        ),
        task: "Repère le contact sans email puis consulte schema.sql pour comprendre les contraintes.",
        takeaway:
          "Les identifiants et les contraintes décrivent les règles de chaque ligne.",
        quiz: quiz(
          "Comment tester un email absent ?",
          ["email IS NULL", "email = NULL", "email = 'NULL'"],
          0,
          "IS NULL teste l’absence de valeur SQL.",
        ),
        link: docs + "lang_createtable.html",
      }),
    ],
  },
  {
    id: "sql-creer-lire",
    title: "Création et première lecture",
    description: "Crée une table, insère des valeurs puis consulte-les.",
    lessons: [
      lesson({
        id: "sql-create-table",
        title: "Créer une table avec CREATE TABLE",
        minutes: 23,
        summary:
          "CREATE TABLE définit le nom d’une table et ses colonnes. Chaque colonne peut recevoir un type et des contraintes. Le point-virgule termine l’instruction.",
        sections: [
          section(
            "Décrire le modèle",
            "La table competences possède un identifiant et un nom obligatoire. UNIQUE interdit deux noms identiques dans cet exercice.",
            [
              "Les parenthèses rassemblent les définitions de colonnes.",
              "La virgule sépare les colonnes et leurs définitions.",
            ],
          ),
          section(
            "Observer la création",
            "Exécute le fichier puis ouvre Tables pour voir la nouvelle structure. Pour refaire la création depuis zéro, utilise Réinitialiser la base.",
            [
              "Les noms expriment le rôle de la donnée.",
              "Une nouvelle table existe avant qu’on y ajoute des lignes.",
            ],
          ),
        ],
        files: sqlFiles(
          "",
          "CREATE TABLE competences (\n    id INTEGER PRIMARY KEY,\n    nom TEXT NOT NULL UNIQUE\n);\nSELECT name FROM sqlite_schema WHERE type = 'table';",
        ),
        task: "Crée la table puis ajoute une colonne domaine dans sa définition et recommence depuis une base réinitialisée.",
        takeaway:
          "CREATE TABLE définit une structure et ses contraintes avant l’insertion des lignes.",
        quiz: quiz(
          "Quelle contrainte exige un nom présent ?",
          ["ORDER BY", "NOT NULL", "LIMIT"],
          1,
          "NOT NULL interdit la valeur SQL NULL pour cette colonne.",
        ),
        link: docs + "lang_createtable.html",
      }),
      lesson({
        id: "sql-insert-select",
        title: "Insérer des lignes puis choisir les colonnes",
        minutes: 23,
        summary:
          "INSERT INTO annonce la table et les colonnes à remplir. VALUES fournit les valeurs correspondantes. SELECT permet ensuite de lire les lignes enregistrées.",
        sections: [
          section(
            "Associer colonnes et valeurs",
            "L’ordre des valeurs suit l’ordre des colonnes nommées. Le moteur génère ici l’identifiant de chaque compétence.",
            [
              "Les textes utilisent des apostrophes SQL.",
              "Une apostrophe dans un texte est doublée dans un littéral SQL.",
            ],
          ),
          section(
            "Lire le résultat",
            "Le SELECT final présente id et nom. Chaque instruction s’exécute dans le lot demandé et les erreurs conservent la base précédente dans cet atelier.",
            [
              "Le terminal peut afficher plusieurs résultats d’un même lot.",
              "Teste une valeur respectant les contraintes de la table.",
            ],
          ),
        ],
        files: sqlFiles(
          "CREATE TABLE competences (id INTEGER PRIMARY KEY, nom TEXT NOT NULL UNIQUE);",
          "INSERT INTO competences (nom) VALUES ('Python'), ('JavaScript'), ('SQL');\nSELECT id, nom FROM competences ORDER BY id;",
        ),
        task: "Ajoute une quatrième compétence puis sélectionne uniquement sa colonne nom.",
        takeaway:
          "INSERT crée les lignes et SELECT choisit les colonnes à consulter.",
        quiz: quiz(
          "À quoi correspond l’ordre des valeurs de INSERT ?",
          [
            "Au tri alphabétique automatique",
            "À l’heure de lancement",
            "À l’ordre des colonnes nommées",
          ],
          2,
          "Les valeurs sont associées aux colonnes listées dans l’instruction.",
        ),
        link: docs + "lang_insert.html",
      }),
    ],
  },
  {
    id: "sql-filtrer-trier",
    title: "Filtres, tri et pagination",
    description: "Affiche les lignes utiles dans un ordre déterminé.",
    lessons: [
      lesson({
        id: "sql-where-like",
        title: "WHERE, AND, OR et LIKE",
        minutes: 25,
        summary:
          "WHERE conserve les lignes dont la condition est vraie. AND et OR combinent les conditions. LIKE permet une recherche selon un motif textuel.",
        sections: [
          section(
            "Construire le motif",
            "'R%' recherche les noms commençant par R. Le joker % représente une suite de caractères et _ un caractère dans le motif.",
            [
              "Les parenthèses rendent l’ordre des conditions explicite.",
              "IS NULL et IS NOT NULL permettent de vérifier les valeurs absentes.",
            ],
          ),
          section(
            "Vérifier le choix des lignes",
            "Le programme demande aussi un email présent. Compare le résultat avec la même requête sans cette condition.",
            [
              "Le comportement de casse de LIKE dépend du moteur et de ses règles.",
              "Les exemples utilisent des préfixes simples pour observer le filtre.",
            ],
          ),
        ],
        files: sqlFiles(
          contactsSchema,
          "SELECT nom, prenom, email\nFROM contacts\nWHERE nom LIKE 'R%' AND email IS NOT NULL;",
        ),
        task: "Compare les résultats avec et sans le filtre sur email puis essaie 'M%'.",
        takeaway:
          "WHERE exprime les critères des lignes et LIKE recherche un motif de texte.",
        quiz: quiz(
          "Que représente % dans ce motif LIKE ?",
          [
            "Une suite de caractères",
            "Une colonne obligatoire",
            "Le nombre de lignes",
          ],
          0,
          "% correspond à une séquence de caractères de longueur variable.",
        ),
        link: docs + "lang_expr.html#like",
      }),
      lesson({
        id: "sql-order-limit",
        title: "ORDER BY, LIMIT et OFFSET",
        minutes: 24,
        summary:
          "ORDER BY fixe le tri du résultat. ASC trie dans le sens croissant et DESC dans le sens décroissant. LIMIT borne le nombre de lignes et OFFSET décale le point de départ.",
        sections: [
          section(
            "Rendre le tri déterminé",
            "Le nom est le premier critère puis le prénom départage les noms identiques. Un identifiant peut compléter le tri pour rendre la pagination stable.",
            [
              "Le tri explicite permet de comparer plusieurs exécutions.",
              "LIMIT porte sur les lignes du résultat final.",
            ],
          ),
          section(
            "Parcourir plusieurs pages",
            "Une première requête affiche deux contacts. OFFSET 2 affiche ensuite les lignes suivantes du même ordre.",
            [
              "Une page vide peut indiquer que l’on a dépassé la fin du résultat.",
              "Le projet répertoire combine motif et tri alphabétique.",
            ],
          ),
        ],
        files: sqlFiles(
          contactsSchema,
          "SELECT id, nom, prenom FROM contacts ORDER BY nom, prenom, id LIMIT 2;\nSELECT id, nom, prenom FROM contacts ORDER BY nom, prenom, id LIMIT 2 OFFSET 2;",
        ),
        task: "Exécute les deux pages puis passe leur taille à trois en adaptant le décalage.",
        takeaway:
          "Le tri donne l’ordre et la limite ainsi que le décalage définissent la page.",
        quiz: quiz(
          "Que fait LIMIT 2 ?",
          [
            "Il crée deux colonnes",
            "Il renvoie au maximum deux lignes",
            "Il supprime deux lignes",
          ],
          1,
          "LIMIT borne ici le nombre de lignes affichées.",
        ),
        link: docs + "lang_select.html#limitoffset",
      }),
    ],
  },
];
const intermediate: WebLevel["chapters"] = [
  {
    id: "sql-modifier",
    title: "Mettre à jour et supprimer",
    description: "Cible les lignes concernées par une modification.",
    lessons: [
      lesson({
        id: "sql-update",
        title: "UPDATE avec une condition précise",
        minutes: 24,
        summary:
          "UPDATE modifie des colonnes de lignes existantes. SET indique les nouvelles valeurs et WHERE choisit les lignes concernées. Une condition sur la clé primaire vise ici une seule ligne.",
        sections: [
          section(
            "Lire avant de modifier",
            "Le premier SELECT présente le contact ciblé. UPDATE remplace son téléphone puis le dernier SELECT montre le résultat.",
            [
              "Une condition absente applique l’opération à toutes les lignes de la table.",
              "Le nombre de lignes modifiées aide à vérifier l’effet attendu.",
            ],
          ),
          section(
            "Tester une modification",
            "Vérifie que les autres contacts conservent leur téléphone. L’export de base permet de conserver le résultat de tes essais.",
            [
              "Les textes se placent entre apostrophes SQL.",
              "Une contrainte violée fait échouer ce lot et conserve la base précédente.",
            ],
          ),
        ],
        files: sqlFiles(
          contactsSchema,
          "SELECT id, nom, telephone FROM contacts WHERE id = 1;\nUPDATE contacts SET telephone = '034 99 888 77' WHERE id = 1;\nSELECT id, nom, telephone FROM contacts WHERE id = 1;",
        ),
        task: "Modifie l’email du contact 2 et vérifie cette ligne avec SELECT.",
        takeaway:
          "La condition WHERE définit les lignes affectées par la mise à jour.",
        quiz: quiz(
          "Quelle clause cible la ligne à modifier ?",
          ["GROUP BY", "ORDER BY", "WHERE"],
          2,
          "WHERE définit ici le critère des lignes modifiées.",
        ),
        link: docs + "lang_update.html",
      }),
      lesson({
        id: "sql-delete",
        title: "DELETE et vérification des lignes restantes",
        minutes: 23,
        summary:
          "DELETE FROM retire les lignes choisies par sa condition. Il conserve la table et sa structure. Un SELECT avant puis après aide à vérifier le périmètre de l’action.",
        sections: [
          section(
            "Décrire le périmètre",
            "Le script supprime le contact dont id vaut cinq. La lecture finale permet de compter les contacts restants.",
            [
              "Une suppression sans condition concerne toutes les lignes de la table.",
              "La clé primaire fournit une cible précise pour cet exemple.",
            ],
          ),
          section(
            "Repartir des données de départ",
            "La réinitialisation restaure le schéma et les contacts initiaux de cet atelier. Chaque leçon dispose de sa propre base.",
            [
              "Les exemples sont des données d’exercice.",
              "Un lot invalide est abandonné entièrement par le terminal.",
            ],
          ),
        ],
        files: sqlFiles(
          contactsSchema,
          "SELECT id, nom FROM contacts WHERE id = 5;\nDELETE FROM contacts WHERE id = 5;\nSELECT id, nom FROM contacts ORDER BY id;",
        ),
        task: "Supprime un autre identifiant puis réinitialise la base et vérifie les cinq contacts.",
        takeaway:
          "DELETE retire les lignes ciblées et une lecture permet de vérifier le résultat.",
        quiz: quiz(
          "Que conserve DELETE FROM contacts WHERE id = 5 ?",
          [
            "La table et les autres lignes",
            "Uniquement la ligne cinq",
            "Aucune structure",
          ],
          0,
          "L’instruction retire la ligne correspondante tout en conservant la table.",
        ),
        link: docs + "lang_delete.html",
      }),
    ],
  },
  {
    id: "sql-relations",
    title: "Relations et intégrité",
    description: "Relie des commandes à leurs clients.",
    lessons: [
      lesson({
        id: "sql-foreign-key",
        title: "Décrire une clé étrangère",
        minutes: 25,
        summary:
          "Une clé étrangère associe une colonne à la clé d’une autre table. Chaque commande possède ici un client_id qui référence clients.id.",
        sections: [
          section(
            "Comprendre un-à-plusieurs",
            "Un client peut avoir plusieurs commandes et chaque commande désigne un client. La colonne étrangère est placée du côté des commandes.",
            [
              "Le nom du client reste dans sa table clients.",
              "La relation utilise l’identifiant pour conserver un lien stable.",
            ],
          ),
          section(
            "Vérifier l’intégrité",
            "Le terminal active les clés étrangères de SQLite. Une commande doit référencer un client existant.",
            [
              "NOT NULL oblige ici à fournir le client de la commande.",
              "Les règles ON DELETE peuvent préciser le comportement d’une suppression de parent.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "SELECT id, client_id, montant_centimes FROM commandes ORDER BY id;\nPRAGMA foreign_key_list(commandes);",
        ),
        task: "Consulte les tables et retrouve les deux commandes associées à Tiana.",
        takeaway:
          "La clé étrangère exprime la relation et le moteur en vérifie l’intégrité lorsqu’elle est activée.",
        quiz: quiz(
          "Quelle colonne relie une commande au client ?",
          ["email uniquement", "client_id", "date_commande"],
          1,
          "client_id référence l’identifiant du client.",
        ),
        link: docs + "foreignkeys.html",
      }),
      lesson({
        id: "sql-contraintes",
        title: "CHECK, UNIQUE et lots cohérents",
        minutes: 25,
        summary:
          "Les contraintes vérifient les règles lors des écritures. UNIQUE contrôle ici l’email et CHECK impose un montant positif ou nul. Le terminal conserve la base précédente lorsqu’un lot échoue.",
        sections: [
          section(
            "Observer une règle acceptée",
            "La commande ajoutée utilise un client existant et un montant positif. Une lecture vérifie son insertion.",
            [
              "Une clé étrangère vérifie la relation avec le parent.",
              "CHECK exprime une règle sur la valeur ou la combinaison de valeurs.",
            ],
          ),
          section(
            "Essayer une violation",
            "Remplace le montant par une valeur négative et relance depuis la base initiale. Le moteur fournit le diagnostic et le lot est abandonné.",
            [
              "Le tableau de résultat précédent peut rester visible avec le message d’erreur.",
              "Une nouvelle lecture confirme les données effectivement conservées.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "INSERT INTO commandes (client_id, montant_centimes, date_commande) VALUES (3, 15000, '2026-11-07');\nSELECT id, client_id, montant_centimes FROM commandes ORDER BY id;",
        ),
        task: "Essaie ensuite un client_id inexistant et lis le diagnostic de clé étrangère.",
        takeaway:
          "Les contraintes complètent les règles de l’application au moment de l’écriture.",
        quiz: quiz(
          "Que vérifie CHECK (montant_centimes >= 0) ?",
          [
            "Le nom du client",
            "Le tri de la table",
            "La valeur autorisée du montant",
          ],
          2,
          "Cette contrainte refuse un montant négatif.",
        ),
        link: docs + "lang_createtable.html#check_constraints",
      }),
    ],
  },
  {
    id: "sql-jointures",
    title: "Jointures et lignes correspondantes",
    description: "Présente plusieurs tables dans un même résultat.",
    lessons: [
      lesson({
        id: "sql-inner-join",
        title: "INNER JOIN et condition ON",
        minutes: 26,
        summary:
          "INNER JOIN associe les lignes qui satisfont sa condition de relation. La requête présente ici une commande avec le nom et l’email de son client.",
        sections: [
          section(
            "Lire les alias",
            "c désigne commandes et cl désigne clients. ON cl.id = c.client_id décrit la correspondance entre les deux tables.",
            [
              "Les préfixes évitent une ambiguïté quand plusieurs tables possèdent id.",
              "Le résultat contient une ligne par correspondance trouvée.",
            ],
          ),
          section(
            "Vérifier plusieurs commandes",
            "Tiana apparaît dans plusieurs lignes parce qu’elle possède plusieurs commandes. Le client sans commande reste absent de ce résultat INNER JOIN.",
            [
              "La jointure peut fournir des colonnes de chacune des tables.",
              "Le projet système de commandes utilise cette relation.",
            ],
          ),
        ],
        files: sqlOrders.files,
        task: "Ajoute la date de commande à SELECT puis vérifie les lignes de chaque client.",
        takeaway:
          "La condition ON décrit comment les lignes des tables sont associées.",
        quiz: quiz(
          "Quelle condition relie ces tables ?",
          [
            "cl.id = c.client_id",
            "cl.nom = c.id",
            "c.id = c.client_id dans tous les cas",
          ],
          0,
          "La commande référence le client par son client_id.",
        ),
        link:
          docs +
          "lang_select.html#determination_of_input_data_from_clause_processing",
      }),
      lesson({
        id: "sql-outer-joins",
        title: "LEFT JOIN, RIGHT JOIN et absence de correspondance",
        minutes: 27,
        summary:
          "LEFT JOIN conserve toutes les lignes de gauche. Les colonnes de droite deviennent NULL lorsque la correspondance est absente. RIGHT JOIN conserve symétriquement les lignes de droite.",
        sections: [
          section(
            "Observer le client sans commande",
            "La première requête part des clients et conserve Soa même si elle possède zéro commande. Les colonnes de sa commande sont alors absentes.",
            [
              "Le choix du côté conservé détermine les lignes présentes.",
              "La jointure et la clause WHERE doivent être combinées selon le résultat recherché.",
            ],
          ),
          section(
            "Comparer les deux écritures",
            "La seconde requête inverse les tables et utilise RIGHT JOIN pour conserver le même ensemble de clients.",
            [
              "SQLite récent prend en charge RIGHT JOIN.",
              "Une écriture LEFT JOIN avec les tables inversées peut exprimer la même intention.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "SELECT cl.nom, c.id AS commande FROM clients AS cl LEFT JOIN commandes AS c ON c.client_id = cl.id ORDER BY cl.id, c.id;\nSELECT cl.nom, c.id AS commande FROM commandes AS c RIGHT JOIN clients AS cl ON c.client_id = cl.id ORDER BY cl.id, c.id;",
        ),
        task: "Compare les deux tableaux et repère la ligne dont commande vaut NULL.",
        takeaway:
          "Une jointure externe conserve le côté choisi même lorsque la relation est absente.",
        quiz: quiz(
          "Que vaut c.id pour un client sans commande dans le LEFT JOIN ?",
          ["Toujours zéro", "NULL", "Le nom du client"],
          1,
          "Les colonnes du côté sans correspondance sont remplies avec NULL.",
        ),
        link: docs + "lang_select.html#rjoin",
      }),
    ],
  },
];
const advanced: WebLevel["chapters"] = [
  {
    id: "sql-statistiques",
    title: "Calculs et groupes",
    description: "Résume les lignes puis filtre les résultats agrégés.",
    lessons: [
      lesson({
        id: "sql-agregations",
        title: "COUNT, SUM, AVG, MIN et MAX",
        minutes: 25,
        summary:
          "Une fonction d’agrégation calcule un résultat à partir d’un ensemble de lignes. COUNT compte, SUM additionne, AVG calcule une moyenne et MIN ainsi que MAX trouvent les extrêmes.",
        sections: [
          section(
            "Définir la mesure",
            "Le montant des commandes est conservé en centimes. La présentation en euros utilise une division par 100.0.",
            [
              "COUNT(*) compte les lignes.",
              "COUNT(colonne) compte les valeurs présentes de cette colonne.",
            ],
          ),
          section(
            "Traiter les valeurs absentes",
            "Plusieurs agrégations ignorent les valeurs NULL. Une somme sur un ensemble vide peut être NULL et COALESCE peut fournir une valeur de présentation.",
            [
              "L’unité du calcul doit être explicite.",
              "Compare les résultats avec une addition manuelle des exemples.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "SELECT COUNT(*) AS commandes, SUM(montant_centimes) / 100.0 AS total_euros, AVG(montant_centimes) / 100.0 AS moyenne_euros, MIN(montant_centimes) / 100.0 AS minimum_euros, MAX(montant_centimes) / 100.0 AS maximum_euros FROM commandes;",
        ),
        task: "Vérifie le total des trois commandes puis ajoute un filtre qui conserve une seule commande.",
        takeaway:
          "Les agrégations résument les lignes sélectionnées selon une mesure définie.",
        quiz: quiz(
          "Quelle fonction additionne les montants ?",
          ["COUNT", "MAX", "SUM"],
          2,
          "SUM additionne les valeurs présentes de l’expression.",
        ),
        link: docs + "lang_aggfunc.html",
      }),
      lesson({
        id: "sql-group-having",
        title: "GROUP BY et HAVING",
        minutes: 28,
        summary:
          "GROUP BY rassemble les lignes selon une ou plusieurs clés de groupe. Les agrégations sont calculées par groupe. HAVING conserve ensuite les groupes satisfaisant une condition.",
        sections: [
          section(
            "Suivre le chiffre d’affaires",
            "La jointure associe chaque vente au prix et à la catégorie du produit. Le montant de ligne est le prix multiplié par la quantité.",
            [
              "Le groupement utilise la catégorie.",
              "La somme des lignes donne le chiffre d’affaires de cette catégorie.",
            ],
          ),
          section(
            "Placer le filtre",
            "WHERE agirait avant le regroupement sur les lignes. HAVING agit ici sur la somme de chaque groupe pour exiger plus de 100 000 centimes.",
            [
              "Le seuil correspond à 1 000 euros.",
              "ORDER BY classe ensuite les catégories selon leur total.",
            ],
          ),
        ],
        files: sqlSales.files,
        task: "Exécute puis enlève temporairement HAVING pour voir la catégorie qui était filtrée.",
        takeaway:
          "GROUP BY définit les groupes et HAVING filtre leurs résultats calculés.",
        quiz: quiz(
          "Quelle clause filtre la somme de chaque catégorie ?",
          ["HAVING", "LIMIT uniquement", "CREATE TABLE"],
          0,
          "HAVING reçoit la condition sur l’agrégation du groupe.",
        ),
        link: docs + "lang_select.html#resultset",
      }),
    ],
  },
  {
    id: "sql-sous-requetes",
    title: "Sous-requêtes et existence",
    description: "Utilise le résultat d’une requête dans une autre.",
    lessons: [
      lesson({
        id: "sql-sous-requete",
        title: "Comparer avec une valeur calculée",
        minutes: 26,
        summary:
          "Une sous-requête peut produire une valeur utilisée par une requête externe. La comparaison sélectionne ici les commandes dont le montant dépasse la moyenne.",
        sections: [
          section(
            "Lire la requête intérieure",
            "SELECT AVG calcule une seule valeur depuis l’ensemble des commandes. La requête externe compare chaque montant à cette valeur.",
            [
              "Les parenthèses délimitent la sous-requête.",
              "Une sous-requête scalaire est attendue ici dans la comparaison.",
            ],
          ),
          section(
            "Vérifier le raisonnement",
            "Calcule la moyenne à la main avec les données d’exercice puis retrouve les commandes retenues.",
            [
              "Une nouvelle commande peut faire évoluer la moyenne et donc le résultat.",
              "Une sélection vide est un résultat valide lorsque les critères l’exigent.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "SELECT id, montant_centimes / 100.0 AS euros\nFROM commandes\nWHERE montant_centimes > (SELECT AVG(montant_centimes) FROM commandes)\nORDER BY montant_centimes DESC;",
        ),
        task: "Ajoute une commande élevée puis observe le nouveau seuil moyen.",
        takeaway:
          "La sous-requête fournit une valeur qui participe au filtre de la requête externe.",
        quiz: quiz(
          "Que calcule la sous-requête de cet exemple ?",
          [
            "Le nombre de tables",
            "La moyenne des montants",
            "Le nom du client",
          ],
          1,
          "AVG fournit le montant moyen utilisé dans la comparaison.",
        ),
        link: docs + "lang_expr.html#subquery_expressions",
      }),
      lesson({
        id: "sql-exists",
        title: "EXISTS et sous-requête corrélée",
        minutes: 27,
        summary:
          "EXISTS vérifie si une sous-requête produit au moins une ligne. Une sous-requête corrélée utilise une valeur de la ligne actuellement examinée dans la requête externe.",
        sections: [
          section(
            "Relier les deux niveaux",
            "Le client cl.id est utilisé pour chercher une commande correspondante. Le client est conservé dès que cette recherche trouve une ligne.",
            [
              "EXISTS exprime une condition d’existence.",
              "NOT EXISTS permet d’exprimer l’absence de correspondance.",
            ],
          ),
          section(
            "Éviter une répétition inutile",
            "Un client peut posséder plusieurs commandes et apparaître une seule fois dans ce résultat de clients.",
            [
              "La requête externe sélectionne les lignes de clients.",
              "Le filtre porte sur l’existence d’une ligne liée.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "SELECT cl.nom FROM clients AS cl\nWHERE EXISTS (SELECT 1 FROM commandes AS c WHERE c.client_id = cl.id)\nORDER BY cl.nom;\nSELECT cl.nom FROM clients AS cl\nWHERE NOT EXISTS (SELECT 1 FROM commandes AS c WHERE c.client_id = cl.id);",
        ),
        task: "Compare les deux résultats et retrouve le client sans commande.",
        takeaway:
          "EXISTS vérifie une relation sans demander d’afficher les lignes de la sous-requête.",
        quiz: quiz(
          "Quand EXISTS est-il vrai ?",
          [
            "Quand toutes les tables sont vides",
            "Uniquement si une ligne vaut 1",
            "Lorsque la sous-requête produit au moins une ligne",
          ],
          2,
          "L’existence d’au moins une ligne suffit à rendre EXISTS vrai.",
        ),
        link: docs + "lang_expr.html#the_exists_operator",
      }),
    ],
  },
  {
    id: "sql-index-plans",
    title: "Index et plan d’exécution",
    description: "Observe comment le moteur peut rechercher les lignes.",
    lessons: [
      lesson({
        id: "sql-index",
        title: "Créer un index utile à la recherche",
        minutes: 26,
        summary:
          "Un index est une structure supplémentaire qui peut aider le moteur à retrouver des lignes. Il utilise de l’espace et doit être maintenu lors des écritures.",
        sections: [
          section(
            "Choisir la colonne",
            "La relation commandes.client_id est utilisée dans les recherches et les jointures. Un index sur cette colonne peut aider à retrouver les commandes d’un client.",
            [
              "Le moteur décide de l’utilisation selon son plan et les données.",
              "Un index unique peut aussi imposer une contrainte d’unicité.",
            ],
          ),
          section(
            "Décrire son coût",
            "Une insertion ou une modification de colonne indexée implique la mise à jour de l’index. Le choix dépend des recherches et des écritures attendues.",
            [
              "Une petite table peut être parcourue rapidement.",
              "Le plan d’exécution aide à examiner la stratégie réellement choisie.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "CREATE INDEX IF NOT EXISTS idx_commandes_client ON commandes(client_id);\nSELECT id, montant_centimes FROM commandes WHERE client_id = 1;\nPRAGMA index_list(commandes);",
        ),
        task: "Crée l’index puis consulte sa présence dans le résultat de PRAGMA index_list.",
        takeaway:
          "L’index propose un chemin de recherche et son intérêt dépend des requêtes ainsi que des données.",
        quiz: quiz(
          "Quel effet accompagne un index ?",
          [
            "Un coût d’espace et de maintenance lors des écritures",
            "La disparition de toutes les lignes",
            "Une vitesse identique garantie pour toutes les requêtes",
          ],
          0,
          "L’index est une structure stockée qui doit suivre les changements des données.",
        ),
        link: docs + "lang_createindex.html",
      }),
      lesson({
        id: "sql-query-plan",
        title: "Lire EXPLAIN QUERY PLAN",
        minutes: 28,
        summary:
          "EXPLAIN QUERY PLAN décrit les grandes étapes retenues par SQLite. Il permet notamment d’observer un parcours de table ou une recherche utilisant un index.",
        sections: [
          section(
            "Comparer les stratégies",
            "La première instruction examine la recherche avant la création de l’index. La dernière examine la même recherche après sa création.",
            [
              "SCAN indique un parcours de l’ensemble concerné.",
              "SEARCH décrit une recherche sur une partie des lignes, souvent avec un index.",
            ],
          ),
          section(
            "Relier le plan au besoin",
            "Le choix du moteur dépend du schéma, des statistiques et des données. Le projet de rapport doit conserver des calculs corrects avant de mesurer ses performances.",
            [
              "Une mesure sérieuse utilise des données et des requêtes représentatives.",
              "Le terminal peut exporter le résultat et sa base pour poursuivre l’analyse.",
            ],
          ),
        ],
        files: sqlFiles(
          ordersSchema,
          "EXPLAIN QUERY PLAN SELECT * FROM commandes WHERE client_id = 1;\nCREATE INDEX IF NOT EXISTS idx_commandes_client ON commandes(client_id);\nEXPLAIN QUERY PLAN SELECT * FROM commandes WHERE client_id = 1;",
        ),
        task: "Compare les détails des deux plans puis explique quel index peut servir à la recherche.",
        takeaway:
          "Le plan d’exécution montre la stratégie choisie et complète l’observation du résultat métier.",
        quiz: quiz(
          "Quelle instruction expose le plan simplifié de SQLite ?",
          ["DELETE FROM", "EXPLAIN QUERY PLAN", "GROUP BY"],
          1,
          "EXPLAIN QUERY PLAN décrit les étapes de recherche du moteur.",
        ),
        link: docs + "eqp.html",
      }),
    ],
  },
];
export const sqlLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Tables, lecture et filtres",
    definition:
      "SQL est un langage utilisé pour définir, interroger et modifier des données relationnelles. Ce terminal utilise le moteur SQLite.",
    objective: "Crée des tables et présente des lignes filtrées et triées.",
    color: levelColors[0],
    prerequisites:
      "Savoir saisir du texte. Les leçons expliquent la base, la table, la colonne et la ligne.",
    outcomes: [
      "Comprendre clé primaire, contraintes et types SQLite.",
      "Créer une table et insérer des lignes.",
      "Utiliser SELECT, WHERE, LIKE, ORDER BY et LIMIT.",
    ],
    chapters: beginner,
    projects: [sqlContacts],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "CRUD, relations et jointures",
    definition:
      "Une clé étrangère relie les tables et une jointure associe leurs lignes selon une condition.",
    objective:
      "Modifie des données avec un périmètre précis et relie les commandes aux clients.",
    color: levelColors[1],
    prerequisites: "Savoir créer et lire une table.",
    outcomes: [
      "Cibler une mise à jour ou une suppression.",
      "Décrire une relation et comprendre les contraintes.",
      "Comparer INNER JOIN, LEFT JOIN et RIGHT JOIN.",
    ],
    chapters: intermediate,
    projects: [sqlOrders],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Statistiques, sous-requêtes et index",
    definition:
      "Les agrégations résument des ensembles de lignes. Les index et les plans d’exécution aident à comprendre la recherche réalisée par le moteur.",
    objective:
      "Construis un rapport par catégorie et examine sa stratégie de recherche.",
    color: levelColors[2],
    prerequisites: "Comprendre les jointures et les relations.",
    outcomes: [
      "Calculer des agrégations avec GROUP BY et HAVING.",
      "Utiliser une sous-requête et EXISTS.",
      "Créer un index et lire EXPLAIN QUERY PLAN.",
    ],
    chapters: advanced,
    projects: [sqlSales],
  },
];
