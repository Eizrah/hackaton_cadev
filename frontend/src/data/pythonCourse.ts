import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { pythonNotes, pythonScore, pythonVault } from "./pythonProjects";
import type { WebLevel } from "./webCourseTypes";
const docs = "https://docs.python.org/fr/3/tutorial/";
const gui = "https://customtkinter.tomschimansky.com/documentation/";

const beginner: WebLevel["chapters"] = [
  {
    id: "py-premiers-pas",
    title: "Exécuter un script et manipuler des valeurs",
    description: "Découvre l’interpréteur, les types et les entrées.",
    lessons: [
      lesson({
        id: "py-interpreteur",
        title: "Python, le script et l’indentation",
        minutes: 18,
        summary:
          "Python est un langage dont l’interpréteur exécute les instructions de ton fichier. Un script main.py contient du texte source. print affiche les valeurs et l’indentation regroupe les instructions d’un même bloc.",
        sections: [
          section(
            "Lire le programme dans l’ordre",
            "Chaque ligne de cet exemple est exécutée de haut en bas. La variable nom reçoit une chaîne et print l’utilise ensuite dans un message.",
            [
              "Les guillemets délimitent une chaîne de caractères.",
              "Un bloc après if, for ou def utilise une indentation régulière, généralement quatre espaces.",
            ],
          ),
          section(
            "Faire un premier essai",
            "Dans l’atelier, Exécuter le script vérifie la syntaxe puis lance Python. La console présente les résultats et les erreurs avec leur ligne.",
            [
              "Sur ton ordinateur, python main.py lance le fichier.",
              "Commence par une modification puis compare le résultat.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'nom = "Tiana"\nprint("Bonjour", nom)\nprint("Je commence Python dans DevAfrica.")',
        ),
        task: "Remplace le nom puis ajoute une ligne présentant ton pays.",
        takeaway:
          "Un script exécute des instructions et l’indentation délimite ses blocs.",
        quiz: quiz(
          "Quelle fonction affiche une valeur ?",
          ["input", "print", "range"],
          1,
          "print écrit sur la sortie standard.",
        ),
        link: docs + "introduction.html",
      }),
      lesson({
        id: "py-types-saisie",
        title: "Types, input et conversions",
        minutes: 22,
        summary:
          "input renvoie une chaîne. int et float tentent de la convertir en nombre. str, int, float et bool représentent des catégories de valeurs que Python détermine pendant l’exécution.",
        sections: [
          section(
            "Passer du texte au nombre",
            "La quantité saisie est du texte avant int. Le prix utilise un point décimal dans le code. Le produit se calcule ensuite avec les valeurs numériques.",
            [
              "type permet d’observer le type courant.",
              "True et False sont les valeurs booléennes de Python.",
            ],
          ),
          section(
            "Traiter une saisie incorrecte",
            "Une conversion peut lever ValueError. Le bloc except donne une consigne de correction. Prépare le nom puis la quantité dans Entrée standard avant de lancer.",
            [
              "Le programme reçoit les lignes d’entrée dans l’ordre.",
              "Une donnée convertie doit aussi respecter la règle métier.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'try:\n    nom = input("Ton nom ? ")\n    quantite = int(input("Quantité ? "))\n    if quantite < 0:\n        print("Choisis une quantité positive ou nulle.")\n    else:\n        print(nom, "commande pour", quantite * 2500, "Ar")\nexcept (ValueError, EOFError):\n    print("Entre un nom puis un nombre entier.")',
          { stdin: "Soa\n3\n" },
        ),
        task: "Essaie 3 puis trois comme quantité. Explique les deux chemins suivis.",
        takeaway:
          "Une saisie fournit du texte et sa conversion demande une vérification.",
        quiz: quiz(
          "Quel type renvoie input ?",
          ["str", "int", "bool"],
          0,
          "input renvoie le texte lu, que tu peux ensuite convertir.",
        ),
        link: docs + "inputoutput.html",
      }),
    ],
  },
  {
    id: "py-logique",
    title: "Conditions et répétitions",
    description: "Exprime une décision puis répète un traitement.",
    lessons: [
      lesson({
        id: "py-conditions",
        title: "if, elif, else et les comparaisons",
        minutes: 20,
        summary:
          "Une condition produit une valeur booléenne. if choisit une branche, elif vérifie une autre possibilité et else couvre le cas restant. Les opérateurs and, or et not combinent les décisions.",
        sections: [
          section(
            "Lire les limites",
            "La note doit d’abord appartenir à l’intervalle de zéro à vingt. Le programme distingue ensuite la validation et le besoin de révision.",
            [
              "== compare les valeurs et = affecte une valeur.",
              "Les bornes incluses s’expriment avec <= et >=.",
            ],
          ),
          section(
            "Tester les branches",
            "Teste zéro, dix et vingt, puis une valeur hors de l’intervalle. Chaque cas permet de vérifier une partie de la règle.",
            [
              "elif est évalué lorsque les branches précédentes ont échoué.",
              "Un bloc indenté rassemble les instructions de sa branche.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'note = 10\nif note < 0 or note > 20:\n    print("Note hors limites")\nelif note >= 10:\n    print("Objectif atteint")\nelse:\n    print("Prévois une révision")',
        ),
        task: "Change note pour parcourir les trois branches et prédis chaque message.",
        takeaway: "Les conditions traduisent les règles de ton algorithme.",
        quiz: quiz(
          "Quand else est-il utilisé ?",
          [
            "À chaque ligne",
            "Pendant l’installation",
            "Lorsque les conditions précédentes sont fausses",
          ],
          2,
          "else traite le cas qui reste après les tests précédents.",
        ),
        link: docs + "controlflow.html",
      }),
      lesson({
        id: "py-boucles",
        title: "for, range et while",
        minutes: 22,
        summary:
          "for parcourt une suite de valeurs. range génère une suite d’entiers avec une limite de fin exclue. while répète un bloc tant que sa condition reste vraie.",
        sections: [
          section(
            "Suivre le compteur",
            "range(1, 6) fournit les entiers de un à cinq. Le total augmente à chaque tour. Une boucle while peut ensuite effectuer un compte à rebours.",
            [
              "La variable de boucle reçoit chaque élément de la suite.",
              "La mise à jour de restant permet à while de terminer.",
            ],
          ),
          section(
            "Choisir le parcours",
            "Une collection connue se parcourt naturellement avec for. Une lecture jusqu’à fin utilise une répétition conditionnelle.",
            [
              "break termine la boucle courante.",
              "continue passe directement au tour suivant.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'total = 0\nfor nombre in range(1, 6):\n    total += nombre\n    print(nombre, "total", total)\nrestant = 3\nwhile restant > 0:\n    print("Encore", restant)\n    restant -= 1',
        ),
        task: "Étends la somme jusqu’à dix puis explique la borne donnée à range.",
        takeaway:
          "La borne de range est exclue et la condition de while doit pouvoir évoluer.",
        quiz: quiz(
          "Quelles valeurs produit range(3) ?",
          ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"],
          1,
          "range(3) démarre à zéro et s’arrête avant trois.",
        ),
        link: docs + "controlflow.html",
      }),
    ],
  },
  {
    id: "py-fonctions-listes",
    title: "Fonctions et listes",
    description: "Sépare un calcul et organise plusieurs données.",
    lessons: [
      lesson({
        id: "py-fonctions",
        title: "def, paramètres et return",
        minutes: 23,
        summary:
          "def définit une fonction nommée. Ses paramètres reçoivent les arguments d’un appel. return transmet le résultat au code qui a demandé le calcul.",
        sections: [
          section(
            "Définir puis appeler",
            "La fonction moyenne reçoit une liste. Elle utilise sum et len pour calculer son résultat et renvoie None lorsque la liste est vide.",
            [
              "Une variable définie dans la fonction est locale à son appel.",
              "Une fonction peut être appelée plusieurs fois avec des données différentes.",
            ],
          ),
          section(
            "Observer le contrat",
            "L’appelant vérifie si le résultat vaut None avant de le présenter. Cette convention rend le cas vide explicite.",
            [
              "Le mot-clé is convient à la comparaison avec None.",
              "Le calcul est séparé de la saisie et de l’affichage.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'def moyenne(notes):\n    if not notes:\n        return None\n    return sum(notes) / len(notes)\n\n\nfor groupe in ([12, 16, 18], []):\n    resultat = moyenne(groupe)\n    if resultat is None:\n        print("La liste est vide")\n    else:\n        print(f"Moyenne {resultat:.2f}/20")',
        ),
        task: "Ajoute un troisième groupe et une fonction meilleure_note qui traite aussi la liste vide.",
        takeaway:
          "Une fonction exprime une tâche avec des entrées et une convention de résultat.",
        quiz: quiz(
          "Que fait return ?",
          [
            "Il transmet une valeur à l’appelant",
            "Il répète une boucle",
            "Il crée un fichier",
          ],
          0,
          "return termine l’appel et fournit son résultat.",
        ),
        link: docs + "controlflow.html#defining-functions",
      }),
      lesson({
        id: "py-listes",
        title: "Ajouter, retirer et parcourir une liste",
        minutes: 22,
        summary:
          "Une liste conserve des éléments dans un ordre. append ajoute à la fin et remove retire la première valeur égale à celle demandée. Les indices commencent à zéro.",
        sections: [
          section(
            "Faire évoluer la collection",
            "Le programme ajoute une note puis retire une valeur existante. len indique la taille actuelle et un parcours for lit les notes restantes.",
            [
              "notes[0] accède au premier élément d’une liste non vide.",
              "remove lève une erreur si la valeur demandée est absente.",
            ],
          ),
          section(
            "Préparer le projet",
            "Le gestionnaire de notes construit la liste à partir des entrées. Il valide chaque nombre puis calcule une moyenne lorsque la collecte est terminée.",
            [
              "Conserve seulement les notes de zéro à vingt.",
              "Teste aussi une fin immédiate pour vérifier le cas vide.",
            ],
          ),
        ],
        files: projectExample(pythonNotes),
        task: "Entre 12, une valeur invalide, 16 puis fin. Vérifie que la moyenne utilise les deux notes acceptées.",
        takeaway:
          "La liste regroupe les données et la validation précède chaque ajout.",
        quiz: quiz(
          "Quelle méthode ajoute en fin de liste ?",
          ["remove", "strip", "append"],
          2,
          "append ajoute un élément à la fin de la liste.",
        ),
        link: docs + "datastructures.html",
      }),
    ],
  },
];
const intermediate: WebLevel["chapters"] = [
  {
    id: "py-objets",
    title: "Classes, objets et état",
    description: "Distingue un type et ses instances.",
    lessons: [
      lesson({
        id: "py-instances",
        title: "class, __init__ et self",
        minutes: 25,
        summary:
          "Une classe décrit un type d’objet. L’appel de la classe crée une instance et __init__ initialise ses attributs. self désigne l’instance qui reçoit la méthode.",
        sections: [
          section(
            "Créer deux états",
            "Chaque Score possède une valeur initiale. Appeler ajouter sur tiana modifie son score et amina conserve le sien.",
            [
              "__init__ reçoit les informations nécessaires à la préparation de l’objet.",
              "self.valeur est un attribut de l’instance.",
            ],
          ),
          section(
            "Suivre une méthode",
            "La méthode ajoute un point puis renvoie le nouveau total. La vue graphique pourra réutiliser ce résultat pour son label.",
            [
              "Le nom de la classe commence généralement par une majuscule.",
              "Le point donne accès aux attributs et méthodes d’un objet.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'class Score:\n    def __init__(self):\n        self.valeur = 0\n\n    def ajouter(self):\n        self.valeur += 1\n        return self.valeur\n\n\ntiana = Score()\namina = Score()\ntiana.ajouter()\nprint("Tiana", tiana.valeur)\nprint("Amina", amina.valeur)',
        ),
        task: "Crée un troisième Score puis ajoute deux points à Amina.",
        takeaway:
          "Chaque instance possède ses attributs et self permet à ses méthodes de les utiliser.",
        quiz: quiz(
          "Que désigne self ?",
          [
            "Le fichier courant",
            "L’instance qui reçoit la méthode",
            "Le compilateur",
          ],
          1,
          "self permet à une méthode d’accéder à l’objet concerné.",
        ),
        link: docs + "classes.html",
      }),
      lesson({
        id: "py-modules",
        title: "Séparer le modèle de la fenêtre",
        minutes: 22,
        summary:
          "Un module est un fichier Python importable. score.py contient la classe de données et main.py organise la fenêtre. Cette séparation permet de tester le score en console.",
        sections: [
          section(
            "Importer une classe",
            "from score import Score rend la classe disponible. La fenêtre crée ensuite son instance et la conserve dans self.score.",
            [
              "Le fichier source reste placé dans le dossier du projet.",
              "Un import exécute les instructions de niveau module lors de son premier chargement.",
            ],
          ),
          section(
            "Protéger le démarrage",
            "Le test __name__ == '__main__' réserve le lancement de la fenêtre à l’exécution directe du fichier.",
            [
              "Un autre module peut importer la classe sans lancer cette partie du script.",
              "Le modèle reste utilisable depuis un test de console.",
            ],
          ),
        ],
        files: projectExample(pythonScore, "score.py"),
        task: "Repère l’import dans main.py et la création de self.score. Ajoute une méthode doubler au modèle.",
        takeaway:
          "Les modules organisent les responsabilités et rendent la logique réutilisable.",
        quiz: quiz(
          "Quel fichier porte le modèle du compteur ?",
          ["score.py", "requirements.txt", "README.md"],
          0,
          "score.py définit Score et ses opérations.",
        ),
        link: docs + "modules.html",
      }),
    ],
  },
  {
    id: "py-fenetre",
    title: "Première fenêtre CustomTkinter",
    description: "Découvre les widgets et la boucle d’événements.",
    lessons: [
      lesson({
        id: "py-ctk",
        title: "CTk, thème sombre et mainloop",
        minutes: 25,
        summary:
          "CustomTkinter fournit des widgets de bureau construits au-dessus de Tkinter. CTk représente la fenêtre principale et mainloop distribue les événements jusqu’à sa fermeture.",
        sections: [
          section(
            "Préparer l’environnement",
            "Le guide exporté crée un environnement virtuel puis installe requirements.txt. Lance main.py pour ouvrir la fenêtre.",
            [
              "Sous Windows, Python inclut généralement Tk avec son installation classique.",
              "Le thème blue règle les accents et le mode dark règle l’apparence sombre.",
            ],
          ),
          section(
            "Lire le démarrage",
            "Application hérite de CTk. super().__init__ prépare la fenêtre puis le constructeur ajoute les composants.",
            [
              "geometry propose la taille initiale.",
              "minsize définit une taille minimale de fenêtre.",
            ],
          ),
        ],
        files: pythonScore.files,
        task: "Exporte le projet, lance-le puis change son titre et sa taille initiale.",
        takeaway:
          "La fenêtre est construite avant le lancement de la boucle d’événements.",
        quiz: quiz(
          "Quel appel distribue les événements Tk ?",
          ["print", "append", "mainloop"],
          2,
          "mainloop maintient la session graphique et traite les événements.",
        ),
        link: gui + "windows/window/",
      }),
      lesson({
        id: "py-widgets",
        title: "CTkLabel, CTkButton et disposition",
        minutes: 23,
        summary:
          "Un widget est un élément de l’interface. CTkLabel présente du texte et CTkButton propose une action. Leur parent et leur placement déterminent leur place dans la fenêtre.",
        sections: [
          section(
            "Lire les relations",
            "Les labels et les boutons du compteur ont la fenêtre pour parent. grid les place sur des lignes successives.",
            [
              "padx et pady créent des espaces autour du widget.",
              "sticky='ew' autorise l’étirement horizontal dans la cellule.",
            ],
          ),
          section(
            "Adapter l’espace",
            "grid_columnconfigure avec weight=1 attribue l’espace supplémentaire à la colonne du contenu.",
            [
              "Les dimensions initiales donnent un point de départ.",
              "Teste le redimensionnement et les libellés plus longs.",
            ],
          ),
        ],
        files: pythonScore.files,
        task: "Modifie l’espacement du compteur puis observe sa disposition dans une fenêtre plus large.",
        takeaway:
          "Les widgets décrivent le contenu et le gestionnaire de géométrie organise leur place.",
        quiz: quiz(
          "Quel widget affiche le score ?",
          ["CTkEntry", "CTkLabel", "CTkButton"],
          1,
          "Le label affiche le texte de la valeur courante.",
        ),
        link: gui + "widgets/label/",
      }),
    ],
  },
  {
    id: "py-actions",
    title: "Actions et rafraîchissement",
    description: "Relie un événement aux données et à leur affichage.",
    lessons: [
      lesson({
        id: "py-command",
        title: "Transmettre une méthode à command",
        minutes: 24,
        summary:
          "command reçoit la fonction que le bouton appellera à son activation. self.incrementer désigne cette méthode. L’écriture self.incrementer() l’appellerait immédiatement pendant la construction.",
        sections: [
          section(
            "Enregistrer l’action",
            "Le bouton conserve le rappel. Lors d’un clic, le rappel appelle la méthode du modèle puis modifie le label.",
            [
              "Une référence de fonction permet de choisir un appel ultérieur.",
              "Les données nécessaires sont conservées sur l’instance de la fenêtre.",
            ],
          ),
          section(
            "Vérifier l’effet",
            "La méthode incrementer affiche le total renvoyé par Score.ajouter. Plusieurs clics doivent produire une progression régulière.",
            [
              "Teste un clic puis trois clics.",
              "Le modèle et l’affichage doivent présenter le même total.",
            ],
          ),
        ],
        files: pythonScore.files,
        task: "Fais ajouter deux points dans le modèle puis vérifie l’effet du bouton.",
        takeaway:
          "command enregistre une action qui s’exécutera lors de l’événement.",
        quiz: quiz(
          "Quelle valeur transmettre à command ?",
          ["self.incrementer", "self.incrementer()", "Le texte du score"],
          0,
          "La référence de méthode est appelée plus tard par le bouton.",
        ),
        link: gui + "widgets/button/",
      }),
      lesson({
        id: "py-reinitialiser",
        title: "Mettre le modèle et la vue en cohérence",
        minutes: 22,
        summary:
          "Réinitialiser est une action complète qui remet la donnée à zéro puis actualise son label. La fenêtre conserve son modèle entre les événements.",
        sections: [
          section(
            "Suivre la transition",
            "reinitialiser appelle d’abord la méthode du modèle. configure remplace ensuite le texte du label par zéro.",
            [
              "La méthode configure change les propriétés d’un widget existant.",
              "L’instance Score garde sa valeur entre deux clics.",
            ],
          ),
          section(
            "Préparer un scénario d’essai",
            "Ajoute trois points, recommence puis ajoute un point. Le résultat final attendu est un.",
            [
              "Une fermeture puis un nouveau lancement crée un nouveau score.",
              "La persistance sera introduite au niveau avancé.",
            ],
          ),
        ],
        files: pythonScore.files,
        task: "Teste la séquence trois clics, Recommencer, un clic et vérifie le résultat.",
        takeaway:
          "Chaque action met à jour la donnée puis la représentation qui en dépend.",
        quiz: quiz(
          "Quel appel modifie le texte d’un label existant ?",
          ["mainloop", "input", "configure"],
          2,
          "configure actualise une propriété du widget déjà construit.",
        ),
        link: gui + "widgets/label/",
      }),
    ],
  },
];
const advanced: WebLevel["chapters"] = [
  {
    id: "py-persistance",
    title: "Fichiers et données persistantes",
    description: "Écris, relis et valide un document.",
    lessons: [
      lesson({
        id: "py-fichiers",
        title: "with open et l’encodage UTF-8",
        minutes: 25,
        summary:
          "Un fichier conserve des octets sur disque. with open ouvre une ressource pour la durée d’un bloc puis la ferme. Le mode w remplace le contenu et le mode r le lit.",
        sections: [
          section(
            "Écrire puis relire",
            "Le programme utilise un dossier temporaire pour cet essai de console. Le texte accentué est encodé puis relu en UTF-8.",
            [
              "L’encodage choisi doit correspondre lors de l’écriture et de la lecture.",
              "Dans le service de console, les fichiers temporaires vivent pendant cet essai.",
            ],
          ),
          section(
            "Prévoir les erreurs",
            "Un accès peut échouer avec OSError. Une application graphique présente cette erreur dans son statut et permet un nouvel essai.",
            [
              "Les fichiers durables du projet exporté sont placés dans son dossier.",
              "Le contexte with termine la ressource même en cas d’exception.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as dossier:\n    fichier = Path(dossier) / "notes.txt"\n    with open(fichier, "w", encoding="utf-8") as sortie:\n        sortie.write("Apprendre à Toamasina\\n")\n    with open(fichier, "r", encoding="utf-8") as entree:\n        print(entree.read())',
        ),
        task: "Ajoute une seconde ligne puis vérifie sa lecture.",
        takeaway:
          "with organise la durée de vie du fichier et l’encodage organise sa conversion en texte.",
        quiz: quiz(
          "Que fait le mode w sur un fichier existant ?",
          [
            "Il ajoute toujours à la fin",
            "Il remplace son contenu",
            "Il lit uniquement",
          ],
          1,
          "Le mode w tronque le fichier avant d’écrire.",
        ),
        link: docs + "inputoutput.html#reading-and-writing-files",
      }),
      lesson({
        id: "py-json",
        title: "Sérialiser des structures avec JSON",
        minutes: 24,
        summary:
          "JSON représente des données sous forme textuelle. dumps produit un document à partir d’une structure compatible et loads reconstruit les valeurs correspondantes.",
        sections: [
          section(
            "Conserver une collection",
            "La liste de dictionnaires devient une chaîne JSON. ensure_ascii=False garde les caractères accentués lisibles dans le document.",
            [
              "Les clés des objets JSON sont des chaînes.",
              "Le résultat de loads doit être validé avant son utilisation.",
            ],
          ),
          section(
            "Séparer format et chiffrement",
            "Le coffre prépare d’abord ses entrées en JSON puis chiffre leurs octets. Le format aide à reconstruire les champs après déchiffrement.",
            [
              "Un format structuré décrit les données.",
              "Fernet apporte le chiffrement et l’authentification du contenu.",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          'import json\n\nentrees = [{"site": "exemple.local", "note": "Donnée d’exercice"}]\ntexte = json.dumps(entrees, ensure_ascii=False)\nprint(texte)\nrelues = json.loads(texte)\nif isinstance(relues, list):\n    print("Nombre d’entrées", len(relues))',
        ),
        task: "Ajoute un champ pays puis vérifie qu’il est présent après loads.",
        takeaway:
          "La sérialisation transforme une structure en document que l’application peut reconstruire.",
        quiz: quiz(
          "Quelle fonction lit une chaîne JSON ?",
          ["json.loads", "json.dumps", "print"],
          0,
          "loads analyse la chaîne et reconstruit ses valeurs.",
        ),
        link: docs + "inputoutput.html#saving-structured-data-with-json",
      }),
    ],
  },
  {
    id: "py-formulaires",
    title: "Grilles et formulaires",
    description: "Construis une fenêtre à plusieurs zones.",
    lessons: [
      lesson({
        id: "py-grid",
        title: "Lignes, colonnes et étirement",
        minutes: 25,
        summary:
          "grid organise les composants dans des cellules. row et column donnent la position, columnspan permet de couvrir plusieurs colonnes et les poids répartissent l’espace disponible.",
        sections: [
          section(
            "Lire le coffre",
            "La première colonne présente les libellés et la seconde contient les champs. La zone de liste couvre les deux colonnes et reçoit l’espace vertical supplémentaire.",
            [
              "sticky='nsew' autorise l’étirement dans les quatre directions.",
              "CTkScrollableFrame garde les entrées accessibles avec un défilement.",
            ],
          ),
          section(
            "Vérifier la disposition",
            "Teste une fenêtre étroite puis large. Les champs doivent rester accessibles et le statut doit expliquer le résultat de l’action.",
            [
              "Les conteneurs peuvent utiliser leur propre gestionnaire de géométrie.",
              "Dans un même parent, garde une organisation de placement cohérente.",
            ],
          ),
        ],
        files: pythonVault.files,
        task: "Change le poids de la colonne des champs puis redimensionne la fenêtre.",
        takeaway:
          "Les poids et les options sticky répartissent l’espace entre les zones de la grille.",
        quiz: quiz(
          "Quel réglage permet l’étirement dans toute la cellule ?",
          ["text", "show", "sticky='nsew'"],
          2,
          "Les directions n, s, e et w attachent le widget aux bords de sa cellule.",
        ),
        link: "https://customtkinter.tomschimansky.com/tutorial/grid-system/",
      }),
      lesson({
        id: "py-champs",
        title: "Lire les champs et piloter leur visibilité",
        minutes: 25,
        summary:
          "CTkEntry reçoit une valeur textuelle. get la lit et delete vide une plage. Une variable booléenne peut relier une case à cocher au choix d’afficher les secrets.",
        sections: [
          section(
            "Valider avant d’ajouter",
            "Le coffre vérifie la présence du site et du secret avant de préparer son écriture. Un échec conserve la saisie et donne une consigne.",
            [
              "Les limites de longueur sont des règles explicites du projet.",
              "La case Afficher exprime une action volontaire de l’apprenant.",
            ],
          ),
          section(
            "Présenter un résultat",
            "Après une écriture réussie, les champs sont vidés et la liste est reconstruite. Les secrets sont masqués selon le choix courant.",
            [
              "Un popup reçoit la phrase qui déverrouille le fichier.",
              "Le statut confirme l’enregistrement ou décrit l’erreur.",
            ],
          ),
        ],
        files: pythonVault.files,
        task: "Teste un site vide puis une entrée complète et vérifie le comportement des champs.",
        takeaway:
          "La lecture, la validation et l’affichage forment le parcours d’une action de formulaire.",
        quiz: quiz(
          "Quel appel lit le texte d’un CTkEntry ?",
          ["get()", "mainloop()", "grid()"],
          0,
          "get renvoie le texte contenu dans le champ.",
        ),
        link: gui + "widgets/entry/",
      }),
    ],
  },
  {
    id: "py-coffre",
    title: "Chiffrement et enregistrement",
    description: "Relie le modèle de données au cycle d’ouverture du coffre.",
    lessons: [
      lesson({
        id: "py-fernet",
        title: "Comprendre le sel, Scrypt et Fernet",
        minutes: 30,
        summary:
          "Le coffre dérive une clé depuis une phrase maîtresse et un sel aléatoire avec Scrypt. Fernet utilise cette clé pour chiffrer et authentifier le document JSON des entrées.",
        sections: [
          section(
            "Suivre les données",
            "Le fichier conserve le sel et le contenu chiffré. À l’ouverture, la même phrase et le même sel permettent de dériver la clé utilisée pour vérifier puis déchiffrer le document.",
            [
              "Le sel aide à distinguer les dérivations entre différents coffres.",
              "La phrase maîtresse est demandée lors de l’ouverture.",
            ],
          ),
          section(
            "Traiter un échec",
            "Une phrase incorrecte ou un contenu altéré provoque une erreur de vérification. Le projet présente un message et conserve le fichier existant.",
            [
              "Utilise des identifiants fictifs dans ce projet pédagogique.",
              "Observe le fichier JSON pour retrouver le sel et le jeton chiffré.",
            ],
          ),
        ],
        files: projectExample(pythonVault, "coffre.py"),
        task: "Enregistre une entrée fictive, ferme puis rouvre le projet. Essaie une phrase erronée avant la bonne.",
        takeaway:
          "La dérivation reconstruit la clé et le chiffrement authentifié vérifie le contenu avant sa lecture.",
        quiz: quiz(
          "Quel élément dérive la clé depuis la phrase ?",
          ["CTkLabel", "Scrypt", "grid"],
          1,
          "Scrypt utilise la phrase et le sel pour calculer la clé du coffre.",
        ),
        link: "https://cryptography.io/en/48.0.1/fernet/",
      }),
      lesson({
        id: "py-ecriture-atomique",
        title: "Écrire avant de remplacer le fichier",
        minutes: 28,
        summary:
          "Une sauvegarde peut échouer pendant l’écriture. Le modèle écrit d’abord un document chiffré dans un fichier temporaire du même dossier puis remplace le coffre après réussite.",
        sections: [
          section(
            "Conserver un état cohérent",
            "Les nouvelles entrées sont préparées dans une nouvelle liste. L’état en mémoire est remplacé après la réussite de os.replace.",
            [
              "flush transmet les données au flux sous-jacent et fsync demande leur synchronisation.",
              "finally nettoie le fichier temporaire qui resterait après une erreur.",
            ],
          ),
          section(
            "Vérifier le cycle complet",
            "Crée une entrée, relance, déverrouille puis vérifie la lecture. Ajoute ensuite une seconde entrée et vérifie les deux lignes.",
            [
              "L’erreur d’accès au disque est présentée dans le statut.",
              "Les essais de relecture vérifient la persistance du projet exporté.",
            ],
          ),
        ],
        files: projectExample(pythonVault, "coffre.py"),
        task: "Repère l’ordre écriture, remplacement puis mise à jour en mémoire. Vérifie deux enregistrements après un redémarrage.",
        takeaway:
          "Une nouvelle sauvegarde est préparée entièrement avant le remplacement du document courant.",
        quiz: quiz(
          "Quand remplacer les entrées en mémoire ?",
          [
            "Avant la validation",
            "Au début de chaque frappe",
            "Après la réussite de l’écriture",
          ],
          2,
          "Cet ordre conserve l’état courant si l’écriture échoue.",
        ),
        link: "https://docs.python.org/fr/3/library/os.html#os.replace",
      }),
    ],
  },
];
export const pythonLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Scripts, logique et listes",
    definition:
      "Python est un langage interprété qui permet d’exprimer des algorithmes avec une syntaxe fondée sur l’indentation.",
    objective:
      "Écris des scripts courts avec des saisies, des conditions, des fonctions et des listes.",
    color: levelColors[0],
    prerequisites: "Savoir créer un fichier et saisir du texte.",
    outcomes: [
      "Comprendre les types et convertir une entrée.",
      "Utiliser conditions et boucles.",
      "Définir une fonction puis calculer une moyenne.",
    ],
    chapters: beginner,
    projects: [pythonNotes],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Objets et CustomTkinter",
    definition:
      "CustomTkinter propose des widgets de bureau. Les méthodes d’une classe relient les actions à un état conservé entre les événements.",
    objective:
      "Construis des instances et une fenêtre sombre qui réagit aux boutons.",
    color: levelColors[1],
    prerequisites:
      "Comprendre fonctions et listes. Installer Python avec Tk pour les fenêtres.",
    outcomes: [
      "Utiliser class, __init__ et self.",
      "Assembler une fenêtre et ses widgets.",
      "Relier un rappel à une mise à jour du modèle et du label.",
    ],
    chapters: intermediate,
    projects: [pythonScore],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Fichiers, grilles et coffre chiffré",
    definition:
      "Une application persistante sérialise ses données, contrôle ses erreurs et organise leur écriture durable.",
    objective:
      "Construis un formulaire et relie-le à un document chiffré relisible après redémarrage.",
    color: levelColors[2],
    prerequisites: "Savoir construire une classe et une fenêtre à rappels.",
    outcomes: [
      "Lire et écrire un fichier UTF-8 ou JSON.",
      "Organiser des champs et une liste avec grid.",
      "Comprendre la dérivation de clé, Fernet et l’écriture avant remplacement.",
    ],
    chapters: advanced,
    projects: [pythonVault],
  },
];
