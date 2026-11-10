import type { WebLesson, WebLevel } from "./webCourseTypes";

export function webPage(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
</body>
</html>`;
}
const foundationCss = `* { box-sizing: border-box; }
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; line-height: 1.6; color: #173d55; background: #f0f7f8; }
h1, h2 { line-height: 1.2; }
a { color: #067c85; }
img { max-width: 100%; height: auto; }
button, input { font: inherit; }`;
function lesson(
  id: string,
  title: string,
  minutes: number,
  summary: string,
  sections: WebLesson["sections"],
  body: string,
  css: string,
  task: string,
  takeaway: string,
  question: string,
  options: string[],
  answer: number,
  explanation: string,
  url: string,
): WebLesson {
  return {
    id,
    title,
    minutes,
    summary,
    sections,
    files: {
      html: body.startsWith("<!DOCTYPE") ? body : webPage(title, body),
      css: `${foundationCss}\n\n${css}`,
    },
    task,
    takeaway,
    quiz: { question, options, answer, explanation },
    resource: {
      label: url.includes("visualstudio")
        ? "Documentation de l’outil"
        : "Approfondir avec MDN",
      url,
    },
  };
}
const section = (title: string, text: string, points: string[]) => ({
  title,
  text,
  points,
});
const mdn = "https://developer.mozilla.org/fr/docs/";
export const webLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Les fondations & la structure",
    color: "#1a75b8",
    objective:
      "Comprendre le web, structurer une page simple et lui donner ses premiers styles.",
    prerequisites:
      "Aucune expérience en code. Un navigateur et l’envie d’essayer suffisent.",
    outcomes: [
      "Distinguer le rôle de HTML et de CSS.",
      "Créer et relier index.html et styles.css.",
      "Utiliser les balises, les attributs et le modèle de boîte.",
    ],
    chapters: [
      {
        id: "fondations",
        title: "Fondations et rôle des langages",
        description: "Comprendre avant d’écrire sa première ligne.",
        lessons: [
          lesson(
            "roles",
            "HTML et CSS : deux rôles complémentaires",
            10,
            "HTML donne du sens au contenu ; CSS organise son apparence. Ils travaillent ensemble dans le navigateur.",
            [
              section(
                "La structure et la présentation",
                "Imagine une maison : HTML décrit les pièces et leur contenu, CSS choisit les couleurs et la disposition. HTML est un langage de balisage ; CSS est un langage de style.",
                [
                  "HTML : un titre, un paragraphe, une liste, un lien.",
                  "CSS : une couleur, une police, un espacement, une grille.",
                  "JavaScript ajoutera des comportements ; il n’est pas nécessaire pour commencer ce parcours.",
                ],
              ),
              section(
                "Ce que tu vas manipuler",
                "Un fichier est un document enregistré sur ton appareil. Son extension indique son rôle : .html pour la page, .css pour ses styles.",
                [
                  "index.html contient les éléments de la page.",
                  "styles.css contient les règles appliquées à ces éléments.",
                  "La balise link, dans head, relie les deux fichiers.",
                ],
              ),
            ],
            "<h1>Bonjour DevAfrica !</h1>\n<p>HTML présente mon message. CSS lui donne sa couleur.</p>",
            "h1 { color: #078f83; }\np { font-size: 1.125rem; }",
            "Dans l’atelier, remplace le titre par ton prénom, puis change sa couleur dans styles.css.",
            "Le contenu doit garder son sens même si les styles ne se chargent pas.",
            "Quel langage définit la couleur d’un titre ?",
            ["HTML", "CSS", "SQL"],
            1,
            "HTML indique que le contenu est un titre ; la propriété CSS color définit sa couleur.",
            mdn + "Learn_web_development/Core/Styling_basics/What_is_CSS",
          ),
          lesson(
            "environnement",
            "Navigateur, fichiers et outils de travail",
            15,
            "Prépare ton dossier de travail et découvre comment le navigateur transforme des fichiers en page visible.",
            [
              section(
                "Un premier dossier dans VS Code",
                "Crée un dossier mon-premier-site, ouvre ce dossier dans VS Code, puis crée index.html et styles.css au même niveau. Enregistre tes fichiers avec Ctrl+S.",
                [
                  "VS Code aide à écrire : coloration du code, suggestions et Emmet.",
                  "Dans Extensions, cherche Live Server de Ritwick Dey ; vérifie le nom de l’éditeur avant l’installation.",
                  "Clic droit sur index.html → Open with Live Server : l’aperçu se recharge après l’enregistrement.",
                ],
              ),
              section(
                "Du fichier à l’écran",
                "Le navigateur lit le HTML et construit le DOM, une représentation des éléments. Il associe les règles CSS, calcule les positions puis peint le résultat à l’écran.",
                [
                  "F12 ouvre les outils de développement dans les navigateurs courants sur Windows.",
                  "Elements/Inspecteur montre le HTML ; Styles affiche les règles CSS.",
                  "Une modification dans l’inspecteur est temporaire : reporte-la dans ton fichier pour la conserver.",
                ],
              ),
            ],
            "<main>\n  <h1>Mon environnement est prêt</h1>\n  <p>Je modifie, j’enregistre, puis je vérifie le résultat.</p>\n</main>",
            "main { max-width: 40rem; margin: auto; padding: 2rem; background: white; border-radius: 1rem; }",
            "Ouvre cet exemple dans l’atelier intégré. Ensuite, reproduis les deux fichiers dans VS Code pour t’entraîner aussi sur ton ordinateur.",
            "L’atelier de DevAfrica évite une installation pour les exercices ; VS Code servira à organiser tes vrais projets.",
            "Une modification faite seulement dans l’inspecteur est-elle enregistrée dans styles.css ?",
            [
              "Oui, toujours",
              "Non, il faut modifier le fichier source",
              "Seulement si la page est bleue",
            ],
            1,
            "L’inspecteur sert à tester. Pour garder le changement, modifie et enregistre le fichier source.",
            "https://code.visualstudio.com/docs/languages/html",
          ),
        ],
      },
      {
        id: "html",
        title: "Le fondement de HTML5",
        description: "Une structure claire pour un contenu qui a du sens.",
        lessons: [
          lesson(
            "structure",
            "HTML : structurer une page",
            15,
            "Construis le squelette d’un document HTML et distingue les informations de la page de son contenu visible.",
            [
              section(
                "Le document minimal",
                "<!DOCTYPE html> active le mode standard du navigateur. L’élément html contient toute la page et lang indique sa langue. head rassemble les métadonnées ; body contient ce que l’utilisateur consulte.",
                [
                  'meta charset="UTF-8" permet d’afficher correctement les accents.',
                  "title nomme l’onglet du navigateur ; h1 est un titre visible dans la page.",
                  "La métadonnée viewport aide la page à utiliser la largeur réelle d’un écran mobile.",
                ],
              ),
              section(
                "Ouvrir, imbriquer, fermer",
                "Un élément courant a une balise ouvrante, un contenu et une balise fermante : <p>Bonjour</p>. Les éléments imbriqués se ferment dans l’ordre inverse de leur ouverture.",
                [
                  "Une indentation régulière rend le code plus lisible.",
                  "img, input, br et meta sont des éléments vides : ils n’ont pas de balise fermante.",
                  'Un attribut complète l’élément, par exemple lang="fr" ou class="intro".',
                ],
              ),
            ],
            `<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Mon Premier Site</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Bienvenue</h1>\n  <p>Ma première page HTML.</p>\n</body>\n</html>`,
            "h1 { color: #078f83; }",
            "Modifie title puis h1. Repère ce qui change dans le code et dans l’aperçu ; title ne s’affiche pas comme un titre dans la page.",
            "head décrit le document ; body présente son contenu. Ils ont des fonctions différentes.",
            "Où place-t-on le contenu visible d’une page ?",
            ["Dans head", "Dans body", "Dans le nom du fichier"],
            1,
            "body contient le contenu principal rendu dans la page ; head porte ses métadonnées.",
            mdn +
              "Learn_web_development/Core/Structuring_content/Basic_HTML_syntax",
          ),
          lesson(
            "balises",
            "Titres, liens, images et listes",
            18,
            "Choisis la bonne balise pour chaque type d’information au lieu de tout écrire dans des blocs génériques.",
            [
              section(
                "Une hiérarchie de contenu",
                "Les titres h1 à h6 décrivent des niveaux de section. Utilise-les selon l’organisation du contenu, pas selon leur taille visuelle. Le paragraphe p contient un bloc de texte.",
                [
                  "Garde un titre principal clair, puis des h2 et h3 pour les sous-parties.",
                  "ul crée une liste sans ordre ; ol une liste ordonnée ; chaque élément utilise li.",
                  "Un texte de lien doit annoncer sa destination : « Consulter mon portfolio » est plus clair que « Clique ici ».",
                ],
              ),
              section(
                "Les attributs utiles",
                "L’attribut href du lien a indique une destination. src désigne la source d’une image et alt en fournit une alternative textuelle adaptée à son rôle.",
                [
                  "Un lien comme #competences pointe vers un élément dont id vaut competences.",
                  'Une image décorative peut recevoir alt="" ; une image informative doit être décrite.',
                  "Un chemin relatif comme images/photo.webp se lit depuis l’emplacement du fichier HTML.",
                ],
              ),
            ],
            '<h1>Le carnet de Juliana</h1>\n<p>Je crée des interfaces pour apprendre et partager.</p>\n<a href="#competences">Découvrir mes compétences</a>\n<h2 id="competences">Mes compétences</h2>\n<ul>\n  <li>Structurer une page</li>\n  <li>Donner du style avec CSS</li>\n</ul>\n<h2>Mes étapes</h2>\n<ol><li>Lire</li><li>Pratiquer</li><li>Améliorer</li></ol>',
            "li { margin-block: .4rem; }",
            "Ajoute une deuxième section avec trois centres d’intérêt et un lien interne pour la rejoindre.",
            "Une bonne balise donne du sens aux lecteurs, aux outils d’assistance et aux moteurs de recherche ; elle ne garantit pas un classement SEO.",
            "Quel attribut décrit une image lorsque sa description est nécessaire ?",
            ["href", "alt", "class"],
            1,
            "alt fournit une alternative textuelle. src indique l’emplacement de l’image.",
            mdn +
              "Learn_web_development/Core/Structuring_content/Headings_and_paragraphs",
          ),
        ],
      },
      {
        id: "css",
        title: "Premiers styles et modèle de boîte",
        description: "Transformer une structure en une première interface.",
        lessons: [
          lesson(
            "selecteurs",
            "Syntaxe CSS, sélecteurs et cascade",
            16,
            "Une règle CSS sélectionne des éléments puis leur applique des propriétés.",
            [
              section(
                "Lire une règle",
                "Dans p { color: #176b87; }, p est le sélecteur, color la propriété et #176b87 sa valeur. Les accolades contiennent les déclarations, séparées par des points-virgules.",
                [
                  "p cible toutes les balises p.",
                  '.intro cible les éléments portant class="intro" ; une classe est réutilisable.',
                  "#presentation cible l’id presentation, qui doit être unique dans le document.",
                ],
              ),
              section(
                "Pourquoi un style gagne-t-il ?",
                "La cascade départage les déclarations. À origine, couche et importance comparables, la spécificité intervient ; à spécificité égale, la règle écrite plus tard l’emporte.",
                [
                  "Une classe est généralement plus spécifique qu’un simple sélecteur de balise.",
                  "Certaines propriétés, comme color, peuvent être héritées du parent.",
                  "Inspecte les règles barrées dans DevTools avant d’ajouter !important.",
                ],
              ),
            ],
            '<h1 id="presentation">Mon premier style</h1>\n<p>Un paragraphe normal.</p>\n<p class="intro">Une introduction mise en valeur.</p>',
            "p { color: #526e80; }\n.intro { color: #078f83; font-weight: 700; }\n#presentation { border-bottom: 3px solid #a6e5d4; }",
            "Ajoute la classe intro au premier paragraphe et observe comment les deux paragraphes partagent le même style.",
            "Préfère des classes lisibles et réutilisables ; un id sert aussi de repère pour les liens internes.",
            'Quel sélecteur cible class="carte" ?',
            ["#carte", ".carte", "carte()"],
            1,
            "Le point introduit un sélecteur de classe ; le dièse introduit un sélecteur d’id.",
            mdn + "Learn_web_development/Core/Styling_basics/Basic_selectors",
          ),
          lesson(
            "texte-couleurs",
            "Couleurs, polices et lisibilité",
            14,
            "Donne une identité visuelle à ta page tout en gardant un texte facile à lire.",
            [
              section(
                "Une palette simple",
                "Une couleur CSS peut être un nom, un code hexadécimal comme #087f8c ou une fonction comme rgb(). Commence par une couleur de texte, un fond et une couleur d’accent.",
                [
                  "color agit sur le texte ; background-color sur le fond.",
                  "Un texte et son fond doivent rester suffisamment contrastés.",
                  "N’utilise pas seulement la couleur pour transmettre un état : ajoute aussi un texte ou un symbole.",
                ],
              ),
              section(
                "Une hiérarchie typographique",
                "font-family choisit la famille, font-size la taille et font-weight l’épaisseur. Une famille de secours comme sans-serif aide quand une police n’est pas disponible.",
                [
                  "line-height espace les lignes ; une valeur sans unité, comme 1.6, s’adapte à la taille du texte.",
                  "text-align règle l’alignement du texte.",
                  "Évite les paragraphes trop larges et les longs textes entièrement en majuscules.",
                ],
              ),
            ],
            '<main>\n<h1>Une interface qui respire</h1>\n<p class="intro">Apprendre est plus simple quand le contenu reste lisible.</p>\n<p>Une palette courte, une hiérarchie claire et des lignes confortables suffisent pour commencer.</p>\n</main>',
            "main { max-width: 42rem; margin-inline: auto; }\nh1 { color: #076b78; font-size: 2.25rem; }\n.intro { font-size: 1.25rem; }\np { line-height: 1.7; }",
            "Choisis deux couleurs, change la taille du titre puis vérifie que le texte reste lisible à 200 % de zoom.",
            "La lisibilité passe avant les effets visuels. Une police système permet de commencer sans téléchargement.",
            "Quelle propriété règle l’espace entre les lignes de texte ?",
            ["line-height", "border", "display"],
            0,
            "line-height règle la hauteur des lignes. Une valeur sans unité est souvent pratique pour l’héritage.",
            mdn + "Learn_web_development/Core/Text_styling/Fundamentals",
          ),
          lesson(
            "boites",
            "Le modèle de boîte : margin et padding",
            18,
            "Chaque élément occupe une boîte : contenu, espace intérieur, bordure puis espace extérieur.",
            [
              section(
                "Les quatre couches",
                "Le contenu est entouré de padding, puis de border. margin crée de l’espace autour de la boîte, à l’extérieur de sa bordure.",
                [
                  "padding espace le texte de la bordure.",
                  "border dessine le contour de l’élément.",
                  "margin sépare l’élément de ses voisins ; certaines marges verticales de blocs peuvent fusionner.",
                ],
              ),
              section(
                "Une taille plus prévisible",
                "Avec box-sizing: border-box, une largeur annoncée inclut le contenu, le padding et la bordure. La marge reste à l’extérieur.",
                [
                  "Sans border-box, width décrit généralement la largeur du contenu.",
                  "max-width fixe une limite sans imposer une largeur trop grande sur mobile.",
                  "margin-inline: auto peut centrer un bloc dont la largeur est limitée.",
                ],
              ),
            ],
            '<article class="carte">\n<h1>Ma première carte</h1>\n<p>Le padding me laisse respirer ; la marge m’éloigne des autres éléments.</p>\n</article>\n<p>Un contenu voisin.</p>',
            ".carte { max-width: 28rem; padding: 1.5rem; border: 3px solid #0f9788; margin: 2rem auto; border-radius: 1rem; background: white; }",
            "Passe le padding à 3rem puis la marge à 3rem. Compare les deux effets dans l’aperçu.",
            "Border-box inclut le padding et la bordure dans width ; margin reste extérieur.",
            "Quelle propriété ajoute de l’espace entre le contenu et la bordure ?",
            ["margin", "padding", "font-size"],
            1,
            "padding agit à l’intérieur de la boîte ; margin crée l’espace extérieur.",
            mdn + "Learn_web_development/Core/Styling_basics/Box_model",
          ),
        ],
      },
    ],
    projects: [
      {
        id: "cv",
        title: "Mon CV en ligne",
        description:
          "Présente-toi avec une page claire, une photo ou une illustration, tes expériences et tes liens.",
        minutes: 60,
        requirements: [
          "Un h1 avec ton nom et une présentation courte.",
          "Des sections Expériences et Compétences avec des listes.",
          "Un lien de contact ou de portfolio au texte explicite.",
          "Une image avec un alt adapté, ou un emplacement prévu pour ta photo.",
          "Une carte centrée, avec padding, bordure et typographie lisible.",
        ],
        hints: [
          "Commence par le contenu, sans CSS. Vérifie l’ordre de tes titres.",
          "Ajoute une classe .cv à ton bloc principal et limite sa largeur.",
          "Teste margin, padding et border séparément pour voir leur rôle.",
        ],
        files: {
          html: webPage(
            "Mon CV",
            '<main class="cv">\n  <h1>Ton prénom et ton nom</h1>\n  <p>Ta présentation en une phrase.</p>\n  <!-- Ajoute ton image, tes expériences, tes compétences et tes liens. -->\n  <h2>Mes compétences</h2>\n  <ul><li>HTML5 & CSS3 en cours d’apprentissage</li></ul>\n</main>',
          ),
          css:
            foundationCss +
            "\n\n/* Personnalise la carte, les couleurs et les espacements. */\n.cv { background: white; padding: 1rem; }",
        },
      },
      {
        id: "recette",
        title: "Ma recette de cuisine",
        description:
          "Partage une recette que tu aimes : ingrédients, étapes et présentation appétissante.",
        minutes: 60,
        requirements: [
          "Un titre, une introduction et une illustration du plat.",
          "Une liste ul pour les ingrédients.",
          "Une liste ol pour les étapes de préparation.",
          "Des couleurs, bordures et espaces cohérents.",
          "Un texte lisible et une image qui ne déborde pas de sa carte.",
        ],
        hints: [
          "Choisis par exemple une recette de crêpes ou de vary amin’anana.",
          "Les étapes ont un ordre ; les ingrédients n’en ont généralement pas.",
          "Tu peux ajouter une image depuis le bouton Image de l’atelier.",
        ],
        files: {
          html: webPage(
            "Ma recette",
            '<main class="recette">\n<h1>Mes crêpes maison</h1>\n<p>Une recette à partager.</p>\n<h2>Ingrédients</h2>\n<ul><li>Farine</li><li>Lait</li></ul>\n<h2>Préparation</h2>\n<ol><li>Préparer les ingrédients.</li></ol>\n<!-- Complète les quantités, les étapes et ajoute une image. -->\n</main>',
          ),
          css:
            foundationCss +
            "\n\n.recette { max-width: 40rem; margin: auto; background: #fff; padding: 1.5rem; }\n/* Ajoute ta palette, une bordure et une hiérarchie de titres. */",
        },
      },
    ],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Mise en page professionnelle & adaptative",
    color: "#2863a6",
    objective:
      "Construire des pages sémantiques et des interfaces qui s’adaptent aux ordinateurs, tablettes et téléphones.",
    prerequisites:
      "Savoir écrire une page HTML, relier un fichier CSS et utiliser le modèle de boîte.",
    outcomes: [
      "Utiliser les repères sémantiques et des formulaires étiquetés.",
      "Choisir entre Flexbox et Grid selon la disposition.",
      "Concevoir mobile d’abord avec des unités fluides et des media queries.",
    ],
    chapters: [
      {
        id: "semantique",
        title: "HTML5 sémantique et formulaires",
        description: "Donner du sens aux zones et aux interactions.",
        lessons: [
          lesson(
            "semantique",
            "Une page sémantique et bien organisée",
            18,
            "Les balises sémantiques décrivent le rôle des zones d’une page, au-delà de leur apparence.",
            [
              section(
                "Des repères explicites",
                "header présente une page ou une section, nav rassemble des liens de navigation, main porte le contenu principal et footer ses informations de fin.",
                [
                  "article regroupe un contenu autonome, comme une publication.",
                  "section regroupe un sujet, généralement avec un titre ; aside accueille un contenu complémentaire.",
                  "div reste utile quand aucun élément sémantique ne convient ; remplacer chaque div n’est pas un objectif.",
                ],
              ),
              section(
                "Structure, lecture et référencement",
                "Un titre descriptif, une hiérarchie cohérente et des liens explicites aident à comprendre la page. Le balisage sémantique facilite aussi son exploitation par les outils d’assistance.",
                [
                  "Conserve un ordre de lecture logique dans le HTML.",
                  "Évite de choisir une balise seulement pour son style par défaut.",
                  "Une bonne structure contribue à la qualité du site sans garantir une position dans les résultats de recherche.",
                ],
              ),
            ],
            '<header><p>DevAfrica Studio</p><nav aria-label="Principale"><a href="#projets">Projets</a></nav></header>\n<main>\n<h1>Des idées qui prennent forme</h1>\n<section id="projets"><h2>Mes projets</h2><article><h3>Une communauté ouverte</h3><p>Un projet pour apprendre ensemble.</p></article></section>\n</main>\n<footer><p>Créé à Madagascar.</p></footer>',
            "header, main, footer { max-width: 60rem; margin: auto; }\narticle { background: white; padding: 1.5rem; border-radius: 1rem; }",
            "Transforme le contenu de ton CV débutant en page sémantique en gardant le même ordre de lecture.",
            "La sémantique exprime un rôle ; CSS décide ensuite de son apparence.",
            "Quelle balise désigne le contenu principal de la page ?",
            ["nav", "main", "footer"],
            1,
            "main désigne le contenu principal. nav regroupe la navigation et footer les informations de fin.",
            mdn + "Glossary/Semantics",
          ),
          lesson(
            "formulaires",
            "Formulaires, labels et validation native",
            22,
            "Un formulaire utilisable associe chaque champ à une étiquette et explique ce qui est attendu.",
            [
              section(
                "Les bons contrôles",
                "form regroupe les champs. input, textarea et select permettent différentes saisies ; button déclenche une action. label doit être relié au champ par for et id, ou entourer ce champ.",
                [
                  "Le placeholder est une aide temporaire ; il ne remplace pas une étiquette.",
                  "name donne un nom au champ pour son envoi.",
                  'Précise type="button" pour un bouton qui ne doit pas soumettre le formulaire.',
                ],
              ),
              section(
                "Guider sans faire confiance au navigateur seul",
                'required impose une saisie et type="email" active une vérification de format. Ces contrôles améliorent l’interface ; un serveur doit toujours valider les données reçues.',
                [
                  "Associe une aide par aria-describedby lorsque c’est utile.",
                  "Utilise autocomplete pour les données personnelles courantes.",
                  "Dans cet atelier HTML/CSS, les formulaires ne transmettent aucune inscription à un serveur.",
                ],
              ),
            ],
            '<form>\n<h1>Recevoir les nouvelles</h1>\n<label for="email">Adresse e-mail</label>\n<input id="email" name="email" type="email" autocomplete="email" required aria-describedby="aide">\n<p id="aide">Nous utiliserons cette adresse pour la newsletter.</p>\n<label for="message">Ton message</label>\n<textarea id="message" name="message" rows="3"></textarea>\n<button type="submit">M’inscrire</button>\n</form>',
            "form { max-width: 32rem; padding: 2rem; background: white; border-radius: 1rem; }\nlabel { display: block; margin-block: 1rem .3rem; }\ninput, textarea { width: 100%; padding: .7rem; border: 1px solid #688393; border-radius: .4rem; }\nbutton { margin-top: 1rem; padding: .7rem 1rem; background: #086b78; color: white; border: 0; border-radius: .4rem; }",
            "Ajoute un champ prénom avec son label et un select permettant de choisir Web, Mobile ou Design.",
            "Une étiquette persistante est indispensable ; la validation serveur reste distincte de la validation du navigateur.",
            "Quel élément fournit une étiquette persistante à un champ ?",
            ["placeholder seulement", "label", "br"],
            1,
            "label donne un nom au contrôle. Un placeholder disparaît pendant la saisie et ne suffit pas.",
            mdn + "Learn_web_development/Extensions/Forms/Your_first_form",
          ),
        ],
      },
      {
        id: "disposition",
        title: "Le positionnement moderne en CSS",
        description: "Aligner les composants avec Flexbox et Grid.",
        lessons: [
          lesson(
            "flexbox",
            "Flexbox : aligner sur un axe",
            20,
            "Flexbox répartit des éléments sur un axe principal, avec un axe transversal pour leur alignement.",
            [
              section(
                "Du parent aux enfants",
                "display: flex transforme un conteneur en conteneur flexible. Ses enfants directs deviennent des éléments flexibles. flex-direction choisit un axe principal en ligne ou en colonne.",
                [
                  "justify-content répartit les éléments le long de l’axe principal.",
                  "align-items agit sur l’axe transversal.",
                  "gap espace les éléments sans ajouter des marges à chacun.",
                ],
              ),
              section(
                "Accepter les changements de taille",
                "flex-wrap: wrap autorise les éléments à passer à la ligne. flex: 1 permet de partager l’espace restant selon les contraintes des éléments.",
                [
                  "Un menu, une barre d’actions ou une section texte-image sont de bons usages.",
                  "row ne veut pas toujours dire gauche-droite : le sens dépend aussi de l’écriture.",
                  "Évite de réordonner visuellement des éléments si cela casse l’ordre de lecture au clavier.",
                ],
              ),
            ],
            '<nav class="navigation" aria-label="Principale">\n<strong>DevAfrica</strong>\n<div class="liens"><a href="#">Accueil</a><a href="#">Projets</a><a href="#">Contact</a></div>\n</nav>\n<section class="hero"><div><h1>Un projet commun</h1><p>Les idées avancent quand on les partage.</p></div><div class="visuel" aria-label="Illustration abstraite">✦</div></section>',
            ".navigation, .liens, .hero { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }\n.navigation { justify-content: space-between; }\n.hero { margin-top: 3rem; }\n.hero > * { flex: 1 1 15rem; }\n.visuel { display: grid; place-items: center; min-height: 12rem; background: #b6e9df; font-size: 5rem; border-radius: 1rem; }",
            "Passe flex-direction de row à column sur .hero, puis observe quel axe est concerné par align-items.",
            "Flexbox organise principalement un axe à la fois, même quand les éléments passent à la ligne.",
            "Quelle propriété espace les enfants d’un conteneur flex ?",
            ["gap", "font-style", "alt"],
            0,
            "gap fixe l’espacement entre les éléments flexibles.",
            mdn + "Learn_web_development/Core/CSS_layout/Flexbox",
          ),
          lesson(
            "grid",
            "CSS Grid : penser en lignes et colonnes",
            22,
            "Grid définit une grille bidimensionnelle pour organiser une galerie, un tableau de bord ou une page.",
            [
              section(
                "Définir les pistes",
                "display: grid active la grille. grid-template-columns décrit les colonnes ; grid-template-rows peut définir les lignes. L’unité fr partage l’espace disponible entre les pistes.",
                [
                  "repeat(3, 1fr) crée trois colonnes de même part.",
                  "gap ajoute de l’espace entre les cellules.",
                  "grid-column: span 2 permet à un élément d’occuper deux colonnes.",
                ],
              ),
              section(
                "Choisir la bonne méthode",
                "Utilise Flexbox pour un groupe qui suit un axe et Grid quand les lignes et colonnes doivent travailler ensemble. Les deux peuvent être combinés dans une même interface.",
                [
                  "minmax() donne une taille minimale et maximale à une piste.",
                  "minmax(0, 1fr) aide à éviter qu’un contenu long impose une colonne trop large.",
                  "Le placement visuel ne doit pas rendre l’ordre du HTML incompréhensible.",
                ],
              ),
            ],
            '<h1>Mes projets</h1>\n<section class="galerie" aria-label="Galerie de projets">\n<article>Communauté</article><article>Portfolio</article><article>Apprentissage</article><article>Design</article>\n</section>',
            ".galerie { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }\narticle { padding: 2rem 1rem; background: white; border-radius: 1rem; border: 1px solid #bcd9d8; }",
            "Essaie trois colonnes, puis ajoute deux articles. Observe comment Grid crée de nouvelles lignes.",
            "Une grille contrôle les lignes et les colonnes ; son contenu reste dans un ordre HTML logique.",
            "Que signifie repeat(3, 1fr) pour les colonnes ?",
            [
              "Trois colonnes de parts égales",
              "Trois lignes fixes de 1 pixel",
              "Une seule colonne",
            ],
            0,
            "La fonction repeat répète trois fois une piste de 1fr.",
            mdn + "Learn_web_development/Core/CSS_layout/Grids",
          ),
        ],
      },
      {
        id: "responsive",
        title: "Responsive design et adaptabilité",
        description: "Une même page, plusieurs tailles d’écran.",
        lessons: [
          lesson(
            "media-queries",
            "Mobile d’abord et media queries",
            20,
            "Commence par une mise en page simple sur petit écran, puis ajoute des colonnes quand le contenu a la place de respirer.",
            [
              section(
                "Des ruptures dictées par le contenu",
                "Une media query applique des styles lorsque sa condition est vraie. Avec min-width, les styles supplémentaires s’activent à partir d’une certaine largeur.",
                [
                  "Définis d’abord une colonne sans media query.",
                  "Ajoute deux colonnes sur un écran plus large, puis quatre si le contenu le permet.",
                  "Les seuils sont des choix de mise en page, pas une liste de modèles de téléphones.",
                ],
              ),
              section(
                "Tester plutôt que deviner",
                "Redimensionne progressivement l’aperçu de l’atelier et teste les modes Mobile et Tablette. Vérifie les textes longs, les images et les champs de formulaire.",
                [
                  "Une image souple utilise souvent max-width: 100% et height: auto.",
                  "La métadonnée viewport est nécessaire pour une largeur mobile cohérente.",
                  "Vérifie l’absence de défilement horizontal à l’échelle de toute la page.",
                ],
              ),
            ],
            '<h1>Une galerie adaptative</h1>\n<section class="galerie"><article>Projet A</article><article>Projet B</article><article>Projet C</article><article>Projet D</article></section>',
            ".galerie { display: grid; grid-template-columns: 1fr; gap: 1rem; }\narticle { padding: 2rem; background: #fff; border-radius: 1rem; }\n@media (min-width: 600px) { .galerie { grid-template-columns: repeat(2, minmax(0, 1fr)); } }\n@media (min-width: 1000px) { .galerie { grid-template-columns: repeat(4, minmax(0, 1fr)); } }",
            "Lance l’aperçu aux largeurs 375 px, 768 px puis en mode Bureau. Observe le nombre de colonnes.",
            "Le responsive adapte la disposition ; il ne consiste pas seulement à réduire tous les éléments.",
            "Quand @media (min-width: 600px) s’applique-t-il ?",
            [
              "Sous 600 px seulement",
              "À partir de 600 px",
              "Seulement à 600 px exactement",
            ],
            1,
            "min-width inclut la largeur indiquée et toutes les largeurs supérieures.",
            mdn + "Learn_web_development/Core/CSS_layout/Responsive_Design",
          ),
          lesson(
            "unites",
            "Unités relatives et dimensions fluides",
            18,
            "Choisis des dimensions qui suivent le contenu, les réglages de texte ou la fenêtre.",
            [
              section(
                "Des repères différents",
                "Un pourcentage dépend de la propriété et de son conteneur de référence. rem se rapporte à la taille de police de la racine ; em dépend de la taille de police de l’élément ou, pour font-size, de celle du parent.",
                [
                  "vw et vh correspondent à des pourcentages de la largeur et de la hauteur de la fenêtre de référence.",
                  "Les pixels CSS restent utiles pour certaines bordures ; ils ne sont pas interdits.",
                  "Évite des hauteurs fixes pour de longs textes et teste les réglages de zoom.",
                ],
              ),
              section(
                "Combiner souplesse et limites",
                "Une largeur de 100% peut remplir le conteneur ; max-width limite la longueur des lignes sur grand écran. Les fonctions min() et clamp() seront approfondies au niveau avancé.",
                [
                  "Une carte ne doit pas dépasser la largeur disponible.",
                  "Préserve la taille de texte choisie par l’utilisateur.",
                  "Les unités dvh/svh peuvent aider sur les navigateurs mobiles ; vérifie leur comportement pour ton interface.",
                ],
              ),
            ],
            '<main class="lecture"><h1>Une page à ta mesure</h1><p>Les dimensions suivent l’écran, mais le texte garde une largeur confortable pour la lecture.</p><a class="bouton" href="#">Continuer</a></main>',
            ".lecture { width: 100%; max-width: 42rem; margin-inline: auto; padding: 1.5rem; background: white; }\nh1 { font-size: 2rem; }\np { font-size: 1rem; }\n.bouton { display: inline-block; padding: .7em 1.1em; border: 1px solid currentColor; border-radius: .5rem; }",
            "Change la taille de police du bouton : son padding en em suit sa taille de texte. Compare avec un padding fixe en pixels.",
            "Le choix d’une unité dépend de ce à quoi la dimension doit se rapporter.",
            "À quoi se rapporte rem ?",
            [
              "À la taille de police de la racine",
              "Au nombre d’images",
              "À la largeur du bouton",
            ],
            0,
            "rem dépend de la taille de police de l’élément racine, généralement html.",
            mdn + "Learn_web_development/Core/Styling_basics/Values_and_units",
          ),
        ],
      },
    ],
    projects: [
      {
        id: "landing",
        title: "Landing page d’un produit",
        description:
          "Imagine une application utile à ta communauté et présente-la dans une page responsive.",
        minutes: 90,
        requirements: [
          "Un header, une navigation, un main et un footer sémantiques.",
          "Une section de présentation texte et visuel disposés avec Flexbox.",
          "Un formulaire de newsletter avec labels et type email.",
          "Un affichage utilisable sur mobile et tablette.",
          "Des liens, boutons et champs accessibles au clavier.",
        ],
        hints: [
          "Écris la version mobile en premier, puis élargis la section avec Flexbox.",
          "Utilise flex-wrap ou une media query pour empiler le visuel et le texte.",
          "Le formulaire est une maquette : aucun abonnement n’est transmis depuis l’aperçu.",
        ],
        files: {
          html: webPage(
            "Ma nouvelle application",
            '<header><strong>Mon application</strong><nav aria-label="Principale"><a href="#avantages">Avantages</a> <a href="#newsletter">Newsletter</a></nav></header>\n<main>\n<section class="hero"><div><h1>Une idée qui aide au quotidien</h1><p>Présente ici le problème que ton application résout.</p></div><div class="visuel" role="img" aria-label="Illustration de l’application">✦</div></section>\n<section id="avantages"><h2>Pourquoi la choisir ?</h2><p>Ajoute trois avantages concrets.</p></section>\n<section id="newsletter"><h2>Rester informé</h2><!-- Ajoute ton formulaire avec labels. --></section>\n</main>\n<footer>Créé par toi, pour ta communauté.</footer>',
          ),
          css:
            foundationCss +
            "\n\nheader, main, footer { max-width: 65rem; margin: auto; }\n.hero { padding-block: 2rem; }\n.visuel { background: #b9e8df; padding: 3rem; font-size: 4rem; border-radius: 1rem; }\n/* Complète Flexbox et les règles responsive. */",
        },
      },
      {
        id: "galerie",
        title: "Galerie de projets responsive",
        description:
          "Construis une galerie de portfolio : quatre colonnes sur grand écran, deux sur tablette et une sur mobile.",
        minutes: 90,
        requirements: [
          "Une galerie composée d’au moins quatre projets avec titre et description.",
          "CSS Grid pour organiser les cartes.",
          "Quatre colonnes sur grand écran, deux sur tablette, une sur mobile.",
          "Des images ou illustrations souples avec alternatives adaptées.",
          "Un espacement cohérent et aucun débordement de page.",
        ],
        hints: [
          "Commence par grid-template-columns: 1fr.",
          "Ajoute deux media queries adaptées à tes cartes, par exemple à 600 px et 1000 px.",
          "Teste aussi un titre de projet très long pour vérifier la solidité de ta grille.",
        ],
        files: {
          html: webPage(
            "Mon portfolio",
            '<main><h1>Mes projets</h1>\n<section class="galerie" aria-label="Projets du portfolio">\n<article><div class="vignette" role="img" aria-label="Illustration du projet Communauté">01</div><h2>Communauté</h2><p>Un espace pour échanger.</p></article>\n<article><div class="vignette" role="img" aria-label="Illustration du projet Carte">02</div><h2>Carte interactive</h2><p>Découvrir sa ville.</p></article>\n<article><div class="vignette" role="img" aria-label="Illustration du projet Apprentissage">03</div><h2>Apprentissage</h2><p>Une leçon à la fois.</p></article>\n<article><div class="vignette" role="img" aria-label="Illustration du projet Studio">04</div><h2>Studio créatif</h2><p>Donner vie aux idées.</p></article>\n</section></main>',
          ),
          css:
            foundationCss +
            "\n\n.galerie { display: grid; gap: 1rem; }\narticle { padding: 1rem; background: white; border-radius: 1rem; }\n.vignette { padding: 2rem; background: #c4ebe1; border-radius: .5rem; font-size: 2rem; }\n/* Crée les colonnes et les deux media queries. */",
        },
      },
    ],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Animations, optimisation & CSS moderne",
    color: "#244a83",
    objective:
      "Créer des interfaces animées, maintenables et attentives à l’accessibilité comme aux performances.",
    prerequisites:
      "Maîtriser les bases HTML/CSS, les formulaires, Flexbox, Grid et les media queries.",
    outcomes: [
      "Créer des micro-interactions respectueuses des préférences de mouvement.",
      "Organiser le CSS avec des variables et des fonctions fluides.",
      "Évaluer clavier, sémantique, images et coûts de chargement.",
    ],
    chapters: [
      {
        id: "animations",
        title: "Dynamisme, effets et animations",
        description: "Un mouvement utile, mesuré et accessible.",
        lessons: [
          lesson(
            "transitions",
            "États interactifs et transitions",
            20,
            "Une transition adoucit le passage entre deux valeurs de propriété lorsqu’un état change.",
            [
              section(
                "Les états d’un composant",
                ":hover correspond au survol, :active à l’activation et :focus-visible à un focus que le navigateur estime devoir rendre visible, souvent lors d’une navigation clavier.",
                [
                  "Une information utile au survol doit aussi être accessible autrement, notamment au clavier.",
                  "Garde un indicateur de focus visible.",
                  "Choisis les propriétés à animer plutôt que transition: all.",
                ],
              ),
              section(
                "Rester confortable",
                "Une durée courte suffit souvent pour un bouton. La préférence prefers-reduced-motion permet de réduire ou supprimer les mouvements non indispensables.",
                [
                  "Privilégie des retours visuels simples.",
                  "Ne fais pas dépendre une action essentielle d’une animation.",
                  "Teste les états avec Tab, Entrée, Espace et une souris.",
                ],
              ),
            ],
            '<h1>Une action claire</h1>\n<button type="button" class="action">Rejoindre la communauté</button>',
            ".action { padding: 1rem 1.5rem; border: 0; border-radius: .7rem; background: #086d7b; color: white; transition: background-color .18s, transform .18s; }\n.action:hover { background: #084b59; transform: translateY(-2px); }\n.action:active { transform: translateY(0); }\n.action:focus-visible { outline: 3px solid #bc6b15; outline-offset: 4px; }\n@media (prefers-reduced-motion: reduce) { .action { transition: none; transform: none; } }",
            "Teste ce bouton à la souris et au clavier. Ajoute un état de focus qui reste lisible sur le fond.",
            "Un état interactif doit être perceptible sans imposer de mouvement à tout le monde.",
            "Quelle media query respecte une préférence de réduction des mouvements ?",
            [
              "prefers-reduced-motion: reduce",
              "width: animation",
              "hover: blue",
            ],
            0,
            "prefers-reduced-motion: reduce correspond à la préférence utilisateur de réduction des mouvements.",
            mdn + "Web/CSS/@media/prefers-reduced-motion",
          ),
          lesson(
            "transformations",
            "Transformations 2D et 3D",
            20,
            "Déplace, tourne ou agrandis visuellement une boîte sans réorganiser automatiquement ses voisins.",
            [
              section(
                "Transformer une boîte",
                "translate déplace, rotate tourne et scale change l’échelle. Plusieurs fonctions peuvent être combinées dans transform ; leur ordre influence le résultat.",
                [
                  "transform ne recalcule généralement pas le flux comme un changement de width.",
                  "Un élément agrandi peut recouvrir ses voisins : prévois l’espace nécessaire.",
                  "transform-origin choisit le point autour duquel s’effectue la transformation.",
                ],
              ),
              section(
                "Donner une profondeur mesurée",
                "perspective rend la profondeur perceptible pour une rotation 3D. L’effet doit rester léger pour préserver la lecture.",
                [
                  "Teste le texte et les contrôles après transformation.",
                  "Un effet décoratif ne doit pas masquer le focus.",
                  "Propose un état stable quand la réduction des mouvements est demandée.",
                ],
              ),
            ],
            '<h1>Une carte en perspective</h1>\n<div class="scene"><article class="carte"><h2>Construire ensemble</h2><p>Une idée devient un projet.</p></article></div>',
            ".scene { perspective: 800px; }\n.carte { max-width: 25rem; padding: 2rem; background: #c9eee4; border-radius: 1rem; transform: rotateY(-8deg) rotateX(4deg); transition: transform .25s; }\n.carte:hover { transform: rotateY(0) rotateX(0) scale(1.02); }\n@media (prefers-reduced-motion: reduce) { .carte { transform: none; transition: none; } }",
            "Inverse l’ordre de deux transformations et compare le résultat, puis teste une version sans rotation.",
            "Une transformation change le rendu de la boîte ; elle ne garantit pas une nouvelle place dans le flux.",
            "Quelle fonction CSS change l’échelle visuelle ?",
            ["scale()", "font-family()", "margin()"],
            0,
            "scale() modifie l’échelle d’une transformation ; rotate() effectue une rotation.",
            mdn + "Web/CSS/transform",
          ),
          lesson(
            "keyframes",
            "Animations avec @keyframes",
            22,
            "Une animation décrit plusieurs étapes d’un mouvement, sans attendre nécessairement un survol.",
            [
              section(
                "Définir le scénario",
                "@keyframes nomme un scénario avec des étapes comme from/to ou 0%, 50%, 100%. animation associe ce scénario à un élément.",
                [
                  "animation-duration fixe la durée d’un cycle.",
                  "animation-iteration-count fixe le nombre de répétitions ; infinite les répète sans fin.",
                  "animation-fill-mode peut conserver certaines valeurs avant ou après l’animation.",
                ],
              ),
              section(
                "Animer avec une intention",
                "Une apparition légère peut guider la lecture. Les mouvements répétés ou importants demandent davantage de précautions et parfois un contrôle de pause.",
                [
                  "Pour une entrée, préfère un cycle court plutôt qu’un mouvement permanent.",
                  "Transform et opacity sont souvent de bons candidats, mais les performances se mesurent.",
                  "La version sans animation doit rester entièrement lisible.",
                ],
              ),
            ],
            '<article class="apparition"><h1>Bienvenue dans ton atelier</h1><p>Tu peux maintenant expérimenter tes propres interfaces.</p></article>',
            "@keyframes apparition { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }\n.apparition { background: white; padding: 2rem; border-radius: 1rem; animation: apparition .55s ease-out both; }\n@media (prefers-reduced-motion: reduce) { .apparition { animation: none; } }",
            "Modifie la durée et le déplacement. Relance l’aperçu pour rejouer l’apparition.",
            "L’animation accompagne le contenu ; le contenu ne doit jamais dépendre de son exécution.",
            "Quelle règle décrit les étapes d’une animation CSS ?",
            ["@keyframes", "@font-face", "@import"],
            0,
            "@keyframes définit les étapes d’un scénario, ensuite utilisé par la propriété animation.",
            mdn + "Web/CSS/@keyframes",
          ),
        ],
      },
      {
        id: "architecture",
        title: "Architecture et CSS moderne",
        description: "Moins de répétitions, plus de cohérence.",
        lessons: [
          lesson(
            "variables",
            "Variables CSS et thèmes",
            20,
            "Les propriétés personnalisées centralisent des valeurs et peuvent changer selon le contexte.",
            [
              section(
                "Déclarer et utiliser",
                "Une propriété personnalisée commence par deux tirets, par exemple --accent. var(--accent) lit sa valeur et accepte une valeur de repli.",
                [
                  ":root est pratique pour les valeurs globales.",
                  "Une variable peut être redéfinie dans un composant ou un thème.",
                  "Sépare les couleurs de fond, de texte, de bordure et d’accent pour garder des contrastes cohérents.",
                ],
              ),
              section(
                "Un thème sans JavaScript pour cet exercice",
                "Une case à cocher et le sélecteur de frère suivant ~ peuvent appliquer un autre jeu de variables à un panneau. Une application complète pourra gérer la préférence avec JavaScript et son stockage.",
                [
                  "Le contrôle doit avoir une étiquette visible.",
                  "Le CSS peut réagir à :checked sans programmation.",
                  "Teste chaque thème, y compris le focus et les textes secondaires.",
                ],
              ),
            ],
            '<input id="theme" type="checkbox"><label for="theme">Activer le thème sombre</label>\n<main class="interface"><h1>Mes projets</h1><p>Le même contenu, deux ambiances.</p><a href="#">Voir les projets</a></main>',
            ":root { --fond: #ffffff; --texte: #173d55; --accent: #086e7a; }\n.interface { margin-top: 1rem; padding: 2rem; background: var(--fond); color: var(--texte); border-radius: 1rem; }\n.interface a { color: var(--accent); }\n#theme:checked ~ .interface { --fond: #122a3a; --texte: #edf8fb; --accent: #8ce5dc; }",
            "Ajoute une variable --rayon pour les angles et une variable --espace pour le padding. Vérifie les deux thèmes.",
            "Les variables suivent la cascade et l’héritage ; elles sont utiles au-delà des seules couleurs.",
            "Comment lit-on la propriété personnalisée --accent ?",
            ["var(--accent)", "get(accent)", "$accent"],
            0,
            "var(--accent) utilise la valeur d’une propriété personnalisée CSS.",
            mdn + "Web/CSS/Using_CSS_custom_properties",
          ),
          lesson(
            "nesting",
            "Imbrication native et organisation du CSS",
            20,
            "Regroupe des règles liées sans transformer ton fichier en une longue cascade de sélecteurs trop spécifiques.",
            [
              section(
                "Lire les règles imbriquées",
                "L’imbrication native permet d’écrire un sélecteur dans un autre. Le symbole & se rapporte au sélecteur parent, notamment pour ses états.",
                [
                  ".carte { & h2 { ... } } cible les h2 à l’intérieur de .carte.",
                  "&:hover représente le parent dans son état de survol.",
                  "L’imbrication native est du CSS ; elle n’exige pas Sass sur les navigateurs qui la prennent en charge.",
                ],
              ),
              section(
                "Garder une architecture simple",
                "Un petit nombre de niveaux facilite la lecture et la maintenance. Définis des conventions de noms et regroupe les composants par responsabilité.",
                [
                  "Évite les chaînes de sélecteurs profondément imbriquées.",
                  "Place les variables de thème à un endroit facile à trouver.",
                  "Vérifie les navigateurs cibles ; des règles plates restent une solution de repli.",
                ],
              ),
            ],
            '<article class="carte"><h1>Une carte bien organisée</h1><p>Le style reste proche du composant.</p><a href="#">Découvrir</a></article>',
            ".carte {\n  background: white; padding: 2rem; border-radius: 1rem;\n  & h1 { color: #087b84; }\n  & a { text-decoration-thickness: 2px; }\n  &:hover { box-shadow: 0 10px 30px #173d5518; }\n}",
            "Réécris les règles imbriquées avec des sélecteurs plats, puis compare : le résultat doit rester identique.",
            "L’imbrication aide à regrouper ; elle ne justifie pas une spécificité inutilement élevée.",
            "Dans une règle imbriquée, que représente & ?",
            [
              "Le sélecteur parent",
              "Un fichier JavaScript",
              "La racine de tous les documents",
            ],
            0,
            "& représente le sélecteur parent de la règle imbriquée.",
            mdn + "Web/CSS/Guides/Nesting/Using",
          ),
          lesson(
            "fonctions",
            "calc(), min(), max() et clamp()",
            22,
            "Exprime des dimensions fluides avec des bornes explicites plutôt que multiplier les exceptions.",
            [
              section(
                "Calculer et borner",
                "calc() combine des valeurs compatibles dans un calcul. min() choisit la plus petite valeur et max() la plus grande. clamp(minimum, valeur souhaitée, maximum) encadre une dimension.",
                [
                  "width: min(100%, 60rem) limite une largeur sans dépasser son conteneur.",
                  "font-size: clamp(1.8rem, 1.2rem + 2vw, 3rem) crée un titre fluide borné.",
                  "Les espaces autour de + et - sont nécessaires dans les calculs CSS concernés.",
                ],
              ),
              section(
                "La fluidité n’annule pas les tests",
                "Un calcul correct peut produire une interface peu confortable. Vérifie les petits écrans, le zoom et les langues qui génèrent des textes plus longs.",
                [
                  "Pour les textes, combine des unités relatives à la police et à la fenêtre.",
                  "Garde des largeurs minimales réalistes pour les contrôles.",
                  "Les media queries restent utiles quand la structure doit changer.",
                ],
              ),
            ],
            '<main class="conteneur"><h1>Des interfaces à toutes les échelles</h1><p>Une largeur limitée et une typographie fluide gardent un rythme confortable.</p></main>',
            ".conteneur { width: min(100%, 60rem); margin-inline: auto; padding: clamp(1rem, 3vw, 3rem); background: white; border-radius: 1rem; }\nh1 { font-size: clamp(1.8rem, 1.2rem + 2vw, 3rem); }",
            "Teste le titre en mobile et tablette, puis change ses bornes. Le plus grand écran ne doit pas produire un titre démesuré.",
            "Une dimension fluide a besoin de limites et de tests, pas seulement d’une formule.",
            "Combien de paramètres reçoit clamp() ?",
            ["Un", "Deux", "Trois : minimum, valeur souhaitée, maximum"],
            2,
            "clamp() définit une valeur souhaitée, bornée par un minimum et un maximum.",
            mdn + "Web/CSS/clamp",
          ),
        ],
      },
      {
        id: "qualite",
        title: "Accessibilité et performance web",
        description: "Des interfaces utilisables et plus légères.",
        lessons: [
          lesson(
            "accessibilite",
            "Clavier, alternatives et ARIA utile",
            24,
            "Une interface accessible commence par des éléments HTML adaptés et des interactions compréhensibles.",
            [
              section(
                "Le HTML natif en premier",
                "Un button fournit déjà un comportement clavier ; un lien sert à naviguer. Les attributs ARIA peuvent compléter un nom ou un état, mais ne créent pas automatiquement les comportements nécessaires.",
                [
                  "Teste tout le parcours avec Tab, Maj+Tab, Entrée et Espace.",
                  "Ne supprime pas l’indicateur de focus sans remplacement visible.",
                  "Les images informatives ont une alternative ; les décorations n’ajoutent pas de bruit inutile.",
                ],
              ),
              section(
                "Compléter lorsque c’est utile",
                "aria-label peut nommer une navigation ; aria-describedby relie une aide à un contrôle. Évite d’ajouter un rôle qui contredit l’élément ou de reproduire une sémantique native déjà correcte.",
                [
                  "Les noms accessibles doivent correspondre au sens de l’action.",
                  "Un état annoncé doit suivre l’état réel du composant.",
                  "Les outils automatiques aident, mais ne remplacent pas les essais manuels et les retours des utilisateurs.",
                ],
              ),
            ],
            '<a class="evitement" href="#contenu">Aller au contenu</a>\n<nav aria-label="Principale"><a href="#contenu">Accueil</a></nav>\n<main id="contenu"><h1>Un parcours pour tout le monde</h1><p>Teste les liens au clavier.</p><button type="button">Enregistrer le projet</button></main>',
            ".evitement { position: absolute; top: .5rem; left: .5rem; transform: translateY(-200%); background: white; padding: .8rem; z-index: 2; }\n.evitement:focus { transform: translateY(0); }\na:focus-visible, button:focus-visible { outline: 3px solid #a65213; outline-offset: 4px; }\nbutton { padding: .8rem 1rem; background: #086c7a; color: white; border: 0; border-radius: .5rem; }",
            "Clique dans l’aperçu, puis parcours ses liens et son bouton au clavier. Vérifie la visibilité du focus à chaque étape.",
            "ARIA complète une interface correcte ; il ne répare pas à lui seul un mauvais choix de contrôle.",
            "Que privilégier pour une action déclenchée au clavier ?",
            [
              "Un div cliquable sans comportement clavier",
              "Un vrai button",
              "Un texte coloré",
            ],
            1,
            "Un élément button possède une sémantique et des comportements clavier natifs.",
            mdn + "Web/Accessibility/ARIA",
          ),
          lesson(
            "performance",
            "Images, chargement et vérifications finales",
            24,
            "Optimise ce que tu mesures et vérifie que l’interface reste utilisable pendant le chargement.",
            [
              section(
                "Des images adaptées",
                "Choisis des dimensions adaptées à l’affichage et un format comme WebP ou AVIF lorsque cela convient au contenu et aux navigateurs visés. Donner width et height aide à réserver l’espace.",
                [
                  'loading="lazy" convient souvent aux images sous la ligne de flottaison.',
                  "Évite de retarder systématiquement l’image principale visible dès l’ouverture.",
                  "srcset et sizes peuvent proposer plusieurs tailles d’une même image.",
                ],
              ),
              section(
                "Mesurer la page complète",
                "Les outils de réseau et de performance du navigateur aident à comprendre les transferts, le rendu et les ralentissements. Le CSS critique peut accélérer un premier affichage, mais sa gestion doit être mesurée.",
                [
                  "Supprime le CSS inutilisé avec prudence et regroupe les styles maintenables.",
                  "Teste aussi un réseau lent et un appareil moins puissant.",
                  "Fais une dernière revue : clavier, contraste, responsive, contenus et liens.",
                ],
              ),
            ],
            '<main><h1>Avant de publier</h1>\n<ul><li>Images dimensionnées et alternatives présentes.</li><li>Navigation utilisable au clavier.</li><li>Page vérifiée sur plusieurs largeurs.</li></ul>\n<!-- Exemple dans un vrai dossier :\n<img src="images/projet.webp" alt="Vue du projet" width="800" height="600" loading="lazy">\n-->\n<p>Dans l’atelier, ajoute ta propre image avec le bouton Image.</p></main>',
            "main { max-width: 45rem; margin: auto; background: white; padding: 2rem; border-radius: 1rem; }\nli { margin-block: .7rem; }\nimg { display: block; max-width: 100%; height: auto; }",
            "Relis ton projet intermédiaire avec ces critères, puis inspecte les transferts dans DevTools sur une copie locale.",
            "Un aperçu local ne mesure pas les performances d’un vrai hébergement. Teste ensuite la page dans son contexte réel.",
            'Quelle image est généralement une bonne candidate à loading="lazy" ?',
            [
              "Une image sous la zone visible au premier affichage",
              "Toujours le logo principal",
              "Toutes les images sans exception",
            ],
            0,
            "Le chargement différé est utile aux images qui ne sont pas nécessaires immédiatement.",
            mdn + "Web/Performance/Lazy_loading",
          ),
        ],
      },
    ],
    projects: [
      {
        id: "dashboard",
        title: "Tableau de bord clair / sombre",
        description:
          "Conçois un dashboard responsive, avec menu rétractable, cartes d’information et thème commutable.",
        minutes: 120,
        requirements: [
          "Une disposition en Grid ou Flexbox adaptée au mobile.",
          "Un menu rétractable avec un contrôle clavier étiqueté.",
          "Un thème clair et un thème sombre basés sur des variables CSS.",
          "Des cartes d’information ou des graphiques CSS accompagnés de leurs valeurs textuelles.",
          "Des états hover/focus et un respect de prefers-reduced-motion.",
        ],
        hints: [
          "Pour cet exercice sans JavaScript, essaie details/summary pour le menu et :checked pour le thème.",
          "Les variables de couleur peuvent être redéfinies sur le conteneur du dashboard.",
          "Un graphique décoratif ne remplace pas les valeurs textuelles accessibles.",
        ],
        files: {
          html: webPage(
            "Mon dashboard",
            '<input id="theme" type="checkbox"><label for="theme">Thème sombre</label>\n<div class="dashboard">\n<aside><details open><summary>Menu de navigation</summary><nav aria-label="Dashboard"><a href="#contenu">Vue d’ensemble</a></nav></details></aside>\n<main id="contenu"><h1>Mon activité créative</h1><section class="cartes" aria-label="Indicateurs"><article><h2>Projets</h2><p>3 projets terminés</p></article><article><h2>Apprentissage</h2><p>2 parcours suivis</p></article></section></main>\n</div>',
          ),
          css:
            foundationCss +
            "\n\n:root { --fond: #ffffff; --texte: #173d55; --accent: #087f8c; }\n.dashboard { margin-top: 1rem; padding: 1.5rem; background: var(--fond); color: var(--texte); border-radius: 1rem; }\n.dashboard a { color: var(--accent); }\narticle { border: 1px solid currentColor; border-radius: .5rem; padding: 1rem; }\n/* Crée la grille, les variables du thème sombre et les interactions. */",
        },
      },
      {
        id: "vitrine",
        title: "Site vitrine animé en une page",
        description:
          "Raconte l’histoire d’un studio ou d’un projet avec une page fluide et des animations mesurées.",
        minutes: 120,
        requirements: [
          "Une page sémantique avec présentation, projets et contact.",
          "Des apparitions avec @keyframes et des boutons aux micro-interactions visibles.",
          "Un menu mobile plein écran ou déployable, utilisable au clavier.",
          "Une typographie fluide avec clamp() et une architecture CSS lisible.",
          "Une version sans mouvement, un focus visible et une page sans débordement.",
        ],
        hints: [
          "Utilise un details/summary pour un menu fonctionnel sans JavaScript.",
          "Un effet d’onde peut venir d’un pseudo-élément transformé au survol et au focus.",
          "La décoration 3D doit rester discrète et disparaître si les mouvements sont réduits.",
        ],
        files: {
          html: webPage(
            "Mon studio créatif",
            '<header><strong>Studio Île</strong><details class="menu"><summary>Navigation</summary><nav aria-label="Principale"><a href="#projets">Projets</a> <a href="#contact">Contact</a></nav></details></header>\n<main><section class="hero"><h1>Des idées, du mouvement, du sens.</h1><p>Un studio imaginé par toi.</p><a class="bouton" href="#projets">Découvrir mes créations</a></section>\n<section id="projets"><h2>Mes créations</h2><p>Présente deux projets.</p></section>\n<section id="contact"><h2>Construisons ensemble</h2><a href="mailto:studio@example.test">Écrire au studio</a></section></main>\n<footer>Studio Île · Créativité partagée.</footer>',
          ),
          css:
            foundationCss +
            "\n\n:root { --accent: #087e89; --fond: #eaf6f3; }\nbody { background: var(--fond); }\nheader, main, footer { width: min(100%, 65rem); margin: auto; }\nsection { padding-block: 3rem; }\nh1 { font-size: clamp(2rem, 1.2rem + 3vw, 4rem); }\n.bouton { display: inline-block; padding: 1rem; background: var(--accent); color: white; border-radius: 1rem; }\n/* Ajoute keyframes, menu responsive, focus et réduction des mouvements. */",
        },
      },
    ],
  },
];
export const webTools = [
  {
    name: "Visual Studio Code",
    role: "Écrire et organiser les fichiers ; suggestions HTML/CSS et Emmet intégrés.",
    url: "https://code.visualstudio.com/docs/languages/html",
  },
  {
    name: "Live Server",
    role: "Ouvrir une page statique sur un serveur local et la recharger après enregistrement.",
    url: "https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer",
  },
  {
    name: "DevTools",
    role: "Inspecter les règles CSS, tester les largeurs et examiner l’accessibilité.",
    url: "https://developer.chrome.com/docs/devtools/css/",
  },
  {
    name: "MDN Web Docs",
    role: "Vérifier la syntaxe, les exemples et la compatibilité des fonctionnalités.",
    url: "https://developer.mozilla.org/fr/docs/Learn_web_development",
  },
];
