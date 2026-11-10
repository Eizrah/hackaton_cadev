import { consoleFiles } from "./desktopAuthoring";
import { scriptGuiFiles } from "./scriptAuthoring";
import type { WebProject } from "./webCourseTypes";

const profiles = `interface CompteUtilisateur {
    id: number;
    pseudo: string;
    email: string;
}
function estCompte(valeur: unknown): valeur is CompteUtilisateur {
    if (typeof valeur !== "object" || valeur === null) return false;
    const compte = valeur as Record<string, unknown>;
    return typeof compte.id === "number" && Number.isInteger(compte.id) && compte.id > 0
        && typeof compte.pseudo === "string" && compte.pseudo.trim().length >= 2
        && typeof compte.email === "string" && /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(compte.email);
}
const compteInitial: CompteUtilisateur = { id: 1, pseudo: "Tiana", email: "tiana@example.com" };
const essais: unknown[] = [
    compteInitial,
    { id: "deux", pseudo: "Soa", email: "soa@example.com" },
    { id: 3, pseudo: "Amina" },
];
for (const valeur of essais) {
    if (estCompte(valeur)) console.log("Profil accepté : " + valeur.pseudo);
    else console.log("Profil à corriger : " + JSON.stringify(valeur));
}
`;
const packageJson = JSON.stringify(
  {
    name: "atelier-nodegui",
    version: "1.0.0",
    private: true,
    scripts: { build: "tsc", start: "npm run build && qode dist/main.js" },
    dependencies: { "@nodegui/nodegui": "0.74.2" },
    devDependencies: { typescript: "6.0.3", "@types/node": "24.19.2" },
  },
  null,
  2,
);
const config = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2022",
      module: "CommonJS",
      strict: true,
      outDir: "dist",
      rootDir: "src",
      skipLibCheck: true,
    },
    include: ["src/**/*.ts"],
  },
  null,
  2,
);
const votesModel = `export class Urne {
    private nombreVotes: number = 0;

    voter(): number {
        this.nombreVotes += 1;
        return this.nombreVotes;
    }

    total(): number {
        return this.nombreVotes;
    }
}
`;
const voteWindow = `import { FlexLayout, QLabel, QMainWindow, QPushButton, QWidget } from "@nodegui/nodegui";
import { Urne } from "./urne";

const urne = new Urne();
const fenetre = new QMainWindow();
fenetre.setWindowTitle("Votes DevAfrica");
fenetre.resize(460, 300);
const conteneur = new QWidget();
conteneur.setInlineStyle("flex-direction: column; padding: 24px; background-color: #142b45;");
const disposition = new FlexLayout();
conteneur.setLayout(disposition);
const titre = new QLabel();
titre.setText("Vote pour le prochain atelier");
titre.setInlineStyle("color: white; font-size: 20px; margin-bottom: 24px;");
const total = new QLabel();
total.setText("0 vote");
total.setInlineStyle("color: #83c6ff; font-size: 36px; margin-bottom: 24px;");
const bouton = new QPushButton();
bouton.setText("Ajouter mon vote");
bouton.addEventListener("clicked", () => {
    total.setText(urne.voter() + " vote(s)");
});
disposition.addWidget(titre);
disposition.addWidget(total);
disposition.addWidget(bouton);
fenetre.setCentralWidget(conteneur);
fenetre.show();
(globalThis as typeof globalThis & { fenetreAtelier: QMainWindow }).fenetreAtelier = fenetre;
`;
const ticketModels = `export enum Priorite { Basse = "Basse", Moyenne = "Moyenne", Haute = "Haute" }
export enum StatutTicket { Ouvert = "Ouvert", EnCours = "En cours", Ferme = "Fermé" }

export interface Ticket {
    id: number;
    titre: string;
    priorite: Priorite;
    statut: StatutTicket;
}

export class Depot<T extends { id: number }> {
    private elements: T[] = [];
    ajouter(element: T): void {
        if (this.elements.some(item => item.id === element.id)) throw new Error("Identifiant déjà utilisé.");
        this.elements.push(element);
    }
    tous(): readonly T[] { return this.elements; }
}

export class Support {
    private depot = new Depot<Ticket>();
    private prochainId: number = 1;

    creer(titre: string, priorite: Priorite): Ticket {
        const propre = titre.trim();
        if (propre.length < 3 || propre.length > 120) throw new Error("Saisis un titre de 3 à 120 caractères.");
        if (this.depot.tous().length >= 100) throw new Error("La session est limitée à 100 tickets.");
        const ticket: Ticket = { id: this.prochainId, titre: propre, priorite, statut: StatutTicket.Ouvert };
        this.depot.ajouter(ticket);
        this.prochainId++;
        return ticket;
    }
    tous(): readonly Ticket[] { return this.depot.tous(); }
}
`;
const ticketWindow = `import { EditTrigger, FlexLayout, QComboBox, QLabel, QLineEdit, QMainWindow, QPushButton, QTableWidget, QTableWidgetItem, QWidget } from "@nodegui/nodegui";
import { Priorite, Support } from "./modeles";

const support = new Support();
const fenetre = new QMainWindow();
fenetre.setWindowTitle("Support DevAfrica");
fenetre.resize(800, 560);
const page = new QWidget();
page.setInlineStyle("flex-direction: column; padding: 20px; background-color: #ecf4fc;");
const disposition = new FlexLayout();
page.setLayout(disposition);
const titre = new QLabel();
titre.setText("Mes tickets de support");
titre.setInlineStyle("font-size: 24px; color: #164572; margin-bottom: 16px;");
const saisie = new QLineEdit();
saisie.setPlaceholderText("Décris le besoin en quelques mots");
saisie.setMaxLength(120);
const priorite = new QComboBox();
const choix = [Priorite.Basse, Priorite.Moyenne, Priorite.Haute];
for (const valeur of choix) priorite.addItem(undefined, valeur);
const ajouter = new QPushButton();
ajouter.setText("Créer le ticket");
const statut = new QLabel();
statut.setText("Les tickets sont conservés pendant cette session.");
const table = new QTableWidget(0, 3);
table.setHorizontalHeaderLabels(["Titre", "Priorité", "Statut"]);
table.setEditTriggers(EditTrigger.NoEditTriggers);
table.setInlineStyle("flex: 1; margin-top: 18px;");
ajouter.addEventListener("clicked", () => {
    try {
        const ticket = support.creer(saisie.text(), choix[priorite.currentIndex()] ?? Priorite.Basse);
        const ligne = table.rowCount();
        table.insertRow(ligne);
        for (const [colonne, texte] of [ticket.titre, ticket.priorite, ticket.statut].entries()) {
            const cellule = new QTableWidgetItem();
            cellule.setText(texte);
            table.setItem(ligne, colonne, cellule);
        }
        saisie.clear();
        statut.setText(support.tous().length + " ticket(s) créé(s)");
    } catch (erreur) { statut.setText(erreur instanceof Error ? erreur.message : String(erreur)); }
});
for (const widget of [titre, saisie, priorite, ajouter, statut, table]) disposition.addWidget(widget);
fenetre.setCentralWidget(page);
fenetre.show();
(globalThis as typeof globalThis & { fenetreAtelier: QMainWindow }).fenetreAtelier = fenetre;
`;
export const tsProfiles: WebProject = {
  id: "profils-typescript",
  title: "Le validateur de profils utilisateurs",
  description:
    "Décris un compte avec une interface et vérifie les données externes à l’exécution.",
  minutes: 70,
  requirements: [
    "Définir une interface CompteUtilisateur.",
    "Typer les paramètres et les résultats.",
    "Valider une donnée unknown avant d’utiliser ses propriétés.",
    "Observer le diagnostic tsc en modifiant volontairement un type.",
  ],
  hints: [
    "Une interface aide le compilateur pendant le développement.",
    "Une donnée reçue de l’extérieur demande une validation à l’exécution.",
  ],
  files: consoleFiles("typescript", profiles),
};
export const tsVotes: WebProject = {
  id: "votes-nodegui",
  title: "L’application de vote typée",
  description: "Relie une classe Urne à un label et un bouton Qt natifs.",
  minutes: 105,
  requirements: [
    "Conserver le nombre de votes dans un attribut privé.",
    "Déclencher voter depuis clicked.",
    "Actualiser le label avec le total renvoyé.",
  ],
  hints: [
    "Compile le TypeScript avant de lancer Qode.",
    "Conserve une référence à la fenêtre pendant la session.",
  ],
  files: scriptGuiFiles("nodegui", "Votes TypeScript", "src/main.ts", {
    "src/main.ts": voteWindow,
    "src/urne.ts": votesModel,
    "package.json": packageJson,
    "tsconfig.json": config,
  }),
};
export const tsSupport: WebProject = {
  id: "support-nodegui",
  title: "Le logiciel de tickets de support",
  description:
    "Associe génériques, enums et formulaire Qt avec un tableau dynamique.",
  minutes: 155,
  requirements: [
    "Décrire la priorité et le statut avec des enums.",
    "Conserver les tickets dans un dépôt générique.",
    "Valider le titre avant insertion.",
    "Afficher titre, priorité et statut dans un tableau.",
    "Redimensionner la fenêtre avec FlexLayout.",
  ],
  hints: [
    "Le dépôt gère la collection et Support applique les règles.",
    "Le formulaire transforme la sélection en Priorite avant de créer un ticket.",
  ],
  files: scriptGuiFiles("nodegui", "Support TypeScript", "src/main.ts", {
    "src/main.ts": ticketWindow,
    "src/modeles.ts": ticketModels,
    "package.json": packageJson,
    "tsconfig.json": config,
  }),
};
