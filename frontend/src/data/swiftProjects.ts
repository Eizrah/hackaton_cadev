import { swiftFiles, swiftPath } from "./swiftAuthoring";
import type { WebProject } from "./webCourseTypes";

export const swiftBasics = "Exemples/Bases.swift";

const basics = String.raw`struct Profil {
    let nom: String
    var domaine: String
    var portfolio: String?
}

func lienDuProfil(_ profil: Profil) -> String {
    guard let adresse = profil.portfolio, !adresse.isEmpty else {
        return "Portfolio à renseigner"
    }
    return adresse
}

var profil = Profil(nom: "Soa", domaine: "Mobile", portfolio: nil)
profil.domaine = "Développement iOS"

let niveau = "débutant"
switch niveau {
case "débutant":
    print("Bienvenue dans le parcours Swift.")
default:
    print("Prêt pour la suite.")
}

if let adresse = profil.portfolio {
    print("Voir le portfolio : \(adresse)")
} else {
    print("\(profil.nom) · \(profil.domaine)")
}
print(lienDuProfil(profil))
`;

const profileView = String.raw`import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(red: 0.08, green: 0.22, blue: 0.43), .indigo],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 18) {
                    Image(systemName: "person.crop.circle.fill")
                        .resizable()
                        .scaledToFit()
                        .padding(12)
                        .frame(width: 104, height: 104)
                        .background(Color.white.opacity(0.14), in: Circle())
                        .overlay(Circle().strokeBorder(Color.white.opacity(0.7), lineWidth: 2))
                        .accessibilityHidden(true)

                    Text("Soa Rakoto")
                        .font(.largeTitle.bold())
                        .accessibilityAddTraits(.isHeader)
                    Text("Développeuse iOS")
                        .font(.title3.weight(.medium))
                        .foregroundStyle(Color(red: 0.78, green: 0.90, blue: 1))

                    Label("Toamasina · Madagascar", systemImage: "location")
                        .font(.subheadline)
                    Text("J’aime transformer une idée en application.")
                        .multilineTextAlignment(.center)
                }
                .foregroundStyle(.white)
                .padding(24)
                .frame(maxWidth: 420)
                .background(Color.white.opacity(0.09), in: RoundedRectangle(cornerRadius: 28))
                .padding(24)
                .frame(maxWidth: .infinity)
            }
            .defaultScrollAnchor(.center)
        }
    }
}
`;

const pointsView = String.raw`import SwiftUI

struct ContentView: View {
    @State private var score = 0
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ScrollView {
            VStack(spacing: 22) {
                Text("Défi des points")
                    .font(.largeTitle.bold())
                    .accessibilityAddTraits(.isHeader)
                Text("Modifie le nombre avec les boutons.")
                    .foregroundStyle(.secondary)
                Text(score.formatted())
                    .font(.system(.largeTitle, design: .rounded).weight(.heavy))
                    .monospacedDigit()
                    .contentTransition(.numericText())
                    .accessibilityLabel("Score : \(score)")
                    .padding(28)
                    .frame(maxWidth: .infinity)
                    .background(Color.accentColor.opacity(0.12), in: RoundedRectangle(cornerRadius: 24))
                HStack {
                    Button("−1") { change(by: -1) }
                        .accessibilityLabel("Soustraire un point")
                    Button("+1") { change(by: 1) }
                        .accessibilityLabel("Ajouter un point")
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
            }
            .padding(24)
            .frame(maxWidth: 440)
            .frame(maxWidth: .infinity)
        }
        .defaultScrollAnchor(.center)
    }

    private func change(by amount: Int) {
        withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.22)) {
            score += amount
        }
    }
}
`;

export const swiftBeginnerProjects: WebProject[] = [
  {
    id: "carte-visite-swiftui",
    title: "La carte de visite virtuelle",
    description:
      "Crée une carte en SwiftUI avec un portrait circulaire, un nom et un arrière-plan personnalisé.",
    minutes: 70,
    requirements: [
      "Affiche un portrait circulaire, le nom et le métier dans une VStack.",
      "Place un fond personnalisé derrière la carte avec ZStack.",
      "Adapte les textes à ton profil et teste l’écran avec une taille de texte élevée.",
    ],
    hints: [
      "Text et Label décrivent le contenu. Image(systemName:) charge une icône SF Symbols.",
      "Une ZStack superpose le dégradé et le contenu. Les modificateurs s’appliquent dans leur ordre d’écriture.",
      "Le script Exemples/Bases.swift permet d’essayer les types et les optionnels dans un terminal.",
    ],
    files: swiftFiles("Carte de visite", {
      id: "carte",
      view: profileView,
      notes:
        "Remplace le nom et le domaine dans ContentView.swift. Dans l’exemple portable, modifie la valeur optionnelle du portfolio. Avec Swift installé, exécute swift Exemples/Bases.swift sur Mac, Windows ou Linux. Sur Windows, suis https://www.swift.org/install/windows/ pour installer le compilateur et ses outils.",
      extra: { [swiftBasics]: basics },
    }),
  },
  {
    id: "compteur-points-swiftui",
    title: "Le compteur de points",
    description:
      "Ajoute ou retire des points en faisant réagir une vue SwiftUI à son état local.",
    minutes: 65,
    requirements: [
      "Affiche le score dans un texte central lisible.",
      "Place les deux boutons dans une HStack et modifie le score à chaque appui.",
      "Anime le changement de nombre et essaie l’option Réduire les animations.",
    ],
    hints: [
      "Déclare le score avec @State private var score = 0.",
      "Utilise une fonction commune qui reçoit +1 ou −1.",
      "Applique contentTransition(.numericText()) puis change le score dans withAnimation.",
    ],
    files: swiftFiles("Compteur de points", {
      id: "points",
      view: pointsView,
      notes:
        "Appuie deux fois sur +1 et une fois sur −1. Le score attendu est 1. Active Réduire les animations dans Réglages → Accessibilité → Animation et recommence.",
    }),
  },
];

const taskModel = `import Foundation

struct TodoTask: Identifiable {
    let id = UUID()
    let title: String
    var completed = false
}
`;

const todoViewModel = `import Combine
import Foundation

@MainActor
final class TodoViewModel: ObservableObject {
    @Published private(set) var tasks = [
        TodoTask(title: "Ouvrir le projet dans Xcode"),
        TodoTask(title: "Créer ma première tâche"),
    ]

    func add(_ input: String) {
        let title = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !title.isEmpty else { return }
        tasks.append(TodoTask(title: title))
    }

    func toggle(_ id: UUID) {
        guard let index = tasks.firstIndex(where: { $0.id == id }) else { return }
        tasks[index].completed.toggle()
    }

    func remove(at offsets: IndexSet) {
        for index in offsets.reversed() {
            tasks.remove(at: index)
        }
    }
}
`;

const todoView = String.raw`import SwiftUI

@MainActor
struct ContentView: View {
    @StateObject private var model = TodoViewModel()
    @State private var title = ""

    var body: some View {
        NavigationStack {
            List {
                Section("Nouvelle tâche") {
                    TextField("Titre de la tâche", text: $title)
                        .onSubmit(addTask)
                    Button("Ajouter", action: addTask)
                        .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
                Section("Mes tâches") {
                    if model.tasks.isEmpty {
                        Text("Ajoute une tâche pour commencer.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(model.tasks) { task in
                        NavigationLink(value: task.id) {
                            Label(task.title, systemImage: task.completed ? "checkmark.circle.fill" : "circle")
                                .accessibilityValue(task.completed ? "Terminée" : "À faire")
                        }
                    }
                    .onDelete(perform: model.remove)
                }
            }
            .navigationTitle("Mes tâches")
            .toolbar { EditButton() }
            .navigationDestination(for: UUID.self) { id in
                TaskDetail(id: id, model: model)
            }
        }
    }

    private func addTask() {
        model.add(title)
        title = ""
    }
}

@MainActor
struct TaskDetail: View {
    let id: UUID
    @ObservedObject var model: TodoViewModel

    var body: some View {
        Form {
            if let task = model.tasks.first(where: { $0.id == id }) {
                Section("Titre") {
                    Text(task.title)
                }
                Section("Suivi") {
                    Text(task.completed ? "Terminée" : "À faire")
                    Button(task.completed ? "Remettre à faire" : "Marquer comme terminée") {
                        model.toggle(id)
                    }
                }
            } else {
                Text("Cette tâche a été retirée.")
            }
        }
        .navigationTitle("Détail de la tâche")
        .navigationBarTitleDisplayMode(.inline)
    }
}
`;

const expenseModel = `import Foundation

struct Expense: Identifiable {
    let id = UUID()
    let label: String
    let amount: Int
}
`;

const expenseBook = `import Combine
import Foundation

@MainActor
final class ExpenseBook: ObservableObject {
    @Published private(set) var expenses: [Expense] = []

    var total: Int {
        expenses.reduce(0) { $0 + $1.amount }
    }

    func add(label: String, amount: Int) -> Bool {
        let cleanedLabel = label.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleanedLabel.isEmpty, (1...1_000_000_000).contains(amount) else { return false }
        expenses.append(Expense(label: cleanedLabel, amount: amount))
        return true
    }

    func remove(at offsets: IndexSet) {
        for index in offsets.reversed() {
            expenses.remove(at: index)
        }
    }
}
`;

const expenseView = String.raw`import SwiftUI

@MainActor
struct ContentView: View {
    @StateObject private var book = ExpenseBook()
    @State private var label = ""
    @State private var amount = ""
    @State private var inputError = false

    var body: some View {
        NavigationStack {
            List {
                Section("Total") {
                    Text("\(book.total.formatted()) Ar")
                        .font(.title.bold())
                        .monospacedDigit()
                }

                Section("Nouvelle dépense") {
                    TextField("Intitulé", text: $label)
                    TextField("Montant entier en ariary", text: $amount)
                        .keyboardType(.numberPad)
                    Button("Ajouter la dépense", action: add)
                    if inputError {
                        Text("Saisis un intitulé et un montant de 1 à 1 000 000 000 Ar.")
                            .foregroundStyle(.red)
                    }
                }

                Section("Historique de la session") {
                    if book.expenses.isEmpty {
                        Text("Aucune dépense saisie.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(book.expenses) { expense in
                        LabeledContent(expense.label, value: "\(expense.amount.formatted()) Ar")
                    }
                    .onDelete(perform: book.remove)
                }
            }
            .navigationTitle("Mes dépenses")
            .toolbar { EditButton() }
        }
    }

    private func add() {
        guard let amountValue = Int(amount.trimmingCharacters(in: .whitespacesAndNewlines)),
              book.add(label: label, amount: amountValue) else {
            inputError = true
            return
        }
        inputError = false
        label = ""
        amount = ""
    }
}
`;

export const swiftIntermediateProjects: WebProject[] = [
  {
    id: "taches-swiftui-mvvm",
    title: "Le gestionnaire de tâches",
    description:
      "Crée une liste SwiftUI pilotée par un ViewModel et ouvre les détails par la navigation native.",
    minutes: 95,
    requirements: [
      "Ajoute une tâche et affiche toutes les tâches dans une List.",
      "Ouvre le détail d’une tâche via NavigationLink.",
      "Modifie son état depuis le détail et retrouve-le en revenant à la liste.",
    ],
    hints: [
      "Donne un UUID à chaque tâche pour que SwiftUI suive la bonne ligne après un ajout ou une suppression.",
      "La liste crée le ViewModel avec @StateObject. Le détail observe la même instance avec @ObservedObject.",
      "Passe l’identifiant de la tâche au détail pour lire sa valeur actuelle dans le ViewModel.",
    ],
    files: swiftFiles("Mes tâches", {
      id: "taches",
      view: todoView,
      notes:
        "Ajoute « Tester la navigation », ouvre la ligne, marque-la comme terminée puis reviens. Supprime une tâche avec le bouton Modifier ou par un balayage. Le tableau vit en mémoire pendant la session.",
      extra: {
        [`${swiftPath}/TodoTask.swift`]: taskModel,
        [`${swiftPath}/TodoViewModel.swift`]: todoViewModel,
      },
    }),
  },
  {
    id: "depenses-swiftui-mvvm",
    title: "Le suivi de dépenses",
    description:
      "Ajoute des dépenses en ariary. Le ViewModel calcule le total à partir de la liste.",
    minutes: 90,
    requirements: [
      "Ajoute deux dépenses avec un libellé et un montant entier positif.",
      "Affiche leur total puis vérifie qu’il se met à jour après une suppression.",
      "Traite un intitulé vide ou un montant invalide avec un message lisible.",
    ],
    hints: [
      "La vue garde le texte des champs avec @State.",
      "ExpenseBook valide les montants, conserve la liste et expose une propriété calculée total.",
      "Utilise les identifiants stables pour supprimer la dépense choisie.",
    ],
    files: swiftFiles("Mes dépenses", {
      id: "depenses",
      view: expenseView,
      notes:
        "Saisis « Transport » à 1 200 Ar puis « Cahier » à 800 Ar, en entrant les chiffres sans espaces dans le champ. Le total attendu est 2 000 Ar. Retire le transport pour obtenir 800 Ar. La liste est conservée pendant la session.",
      extra: {
        [`${swiftPath}/Expense.swift`]: expenseModel,
        [`${swiftPath}/ExpenseBook.swift`]: expenseBook,
      },
    }),
  },
];
