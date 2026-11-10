import { swiftFiles, swiftPath } from "./swiftAuthoring";
import type { WebProject } from "./webCourseTypes";

const quoteClient = String.raw`import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

enum Asset: String, CaseIterable, Sendable {
    case bitcoin = "BTC"
    case ethereum = "ETH"
    case solana = "SOL"

    var name: String {
        switch self {
        case .bitcoin: return "Bitcoin"
        case .ethereum: return "Ethereum"
        case .solana: return "Solana"
        }
    }
}

struct Quote: Identifiable, Sendable {
    let asset: Asset
    let price: Decimal
    var id: String { asset.rawValue }
}

enum QuoteError: Error {
    case invalidURL
    case invalidResponse
}

enum QuoteClient {
    private struct Envelope: Decodable {
        let data: Value
    }

    private struct Value: Decodable {
        let amount: String
        let base: String
        let currency: String
    }

    static func fetch(_ asset: Asset) async throws -> Quote {
        guard let url = URL(string: "https://api.coinbase.com/v2/prices/\(asset.rawValue)-USD/spot") else {
            throw QuoteError.invalidURL
        }
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw QuoteError.invalidResponse
        }
        return try decode(data, asset: asset)
    }

    static func decode(_ data: Data, asset: Asset) throws -> Quote {
        let value = try JSONDecoder().decode(Envelope.self, from: data).data
        guard value.base == asset.rawValue, value.currency == "USD",
              let price = Decimal(string: value.amount, locale: Locale(identifier: "en_US_POSIX")),
              price > 0 else {
            throw QuoteError.invalidResponse
        }
        return Quote(asset: asset, price: price)
    }
}
`;

const quoteViewModel = `import Combine
import Foundation

@MainActor
final class QuoteViewModel: ObservableObject {
    @Published private(set) var quotes: [Quote] = []
    @Published private(set) var loading = false
    @Published private(set) var error: String?
    @Published private(set) var updatedAt: Date?

    func load() async {
        guard !loading else { return }
        loading = true
        error = nil
        defer { loading = false }

        do {
            async let btc = QuoteClient.fetch(.bitcoin)
            async let eth = QuoteClient.fetch(.ethereum)
            async let sol = QuoteClient.fetch(.solana)
            let values = try await [btc, eth, sol]
            try Task.checkCancellation()
            quotes = values
            updatedAt = .now
        } catch {
            if !Task.isCancelled {
                self.error = "Actualisation indisponible. Réessaie après avoir vérifié ta connexion."
            }
        }
    }
}
`;

const cryptoView = String.raw`import SwiftUI

@MainActor
struct ContentView: View {
    @StateObject private var model = QuoteViewModel()
    @State private var search = ""
    @State private var sortByPrice = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var shownQuotes: [Quote] {
        let query = search.trimmingCharacters(in: .whitespacesAndNewlines)
        let filtered = model.quotes.filter { quote in
            query.isEmpty || quote.id.localizedCaseInsensitiveContains(query)
                || quote.asset.name.localizedCaseInsensitiveContains(query)
        }
        return sortByPrice
            ? filtered.sorted { lhs, rhs in lhs.price == rhs.price ? lhs.id < rhs.id : lhs.price > rhs.price }
            : filtered
    }

    var body: some View {
        NavigationStack {
            List {
                Section("Cours spot · USD") {
                    if model.loading { ProgressView("Chargement…") }
                    if let error = model.error {
                        Text(error).foregroundStyle(.red)
                        Button("Réessayer") {
                            Task { await model.load() }
                        }
                    }
                    if let updatedAt = model.updatedAt {
                        Text("Dernier relevé : \(updatedAt.formatted(date: .abbreviated, time: .shortened))")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }

                    ForEach(shownQuotes) { quote in
                        LabeledContent {
                            Text(quote.price.formatted(.currency(code: "USD")))
                                .monospacedDigit()
                        } label: {
                            VStack(alignment: .leading) {
                                Text(quote.asset.name).fontWeight(.semibold)
                                Text(quote.id).font(.caption).foregroundStyle(.secondary)
                            }
                        }
                    }
                    if !model.quotes.isEmpty && shownQuotes.isEmpty {
                        Text("Aucune crypto ne correspond à ta recherche.")
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Cours des cryptos")
            .searchable(text: $search, prompt: "Bitcoin, ETH…")
            .toolbar {
                Button(sortByPrice ? "Ordre initial" : "Trier par prix") {
                    withAnimation(reduceMotion ? nil : .easeInOut) {
                        sortByPrice.toggle()
                    }
                }
            }
            .animation(reduceMotion ? nil : .easeInOut, value: shownQuotes.map(\.id))
            .refreshable { await model.load() }
            .task { await model.load() }
        }
    }
}
`;

const journalEntry = `import Foundation
import SwiftData

@Model
final class JournalEntry {
    var title: String
    var text: String
    var createdAt: Date

    init(title: String, text: String, createdAt: Date = .now) {
        self.title = title
        self.text = text
        self.createdAt = createdAt
    }
}
`;

const journalApp = `import SwiftData
import SwiftUI

@main
struct DevAfricaApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: JournalEntry.self)
    }
}
`;

const journalView = String.raw`import SwiftData
import SwiftUI

struct ContentView: View {
    @Environment(\.modelContext) private var context
    @Query(sort: \JournalEntry.createdAt, order: .reverse)
    private var entries: [JournalEntry]
    @State private var title = ""
    @State private var text = ""
    @State private var saveError = false

    var body: some View {
        NavigationStack {
            List {
                Section("Nouvelle entrée") {
                    TextField("Titre", text: $title)
                    TextEditor(text: $text)
                        .frame(minHeight: 100)
                        .accessibilityLabel("Texte du journal")
                    Button("Enregistrer", action: addEntry)
                        .disabled(cleanedTitle.isEmpty || cleanedText.isEmpty)
                }
                Section("Entrées enregistrées") {
                    if entries.isEmpty {
                        Text("Ton journal attend sa première entrée.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(entries) { entry in
                        NavigationLink {
                            ScrollView {
                                VStack(alignment: .leading, spacing: 16) {
                                    Text(entry.createdAt.formatted(date: .long, time: .shortened))
                                        .font(.footnote)
                                        .foregroundStyle(.secondary)
                                    Text(entry.text)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .textSelection(.enabled)
                                }
                                .padding()
                            }
                            .navigationTitle(entry.title)
                            .navigationBarTitleDisplayMode(.inline)
                        } label: {
                            VStack(alignment: .leading) {
                                Text(entry.title).font(.headline)
                                Text(entry.createdAt, style: .date)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    .onDelete(perform: deleteEntries)
                }
            }
            .navigationTitle("Mon journal")
            .toolbar { EditButton() }
            .alert("Le journal n’a pas pu être enregistré.", isPresented: $saveError) {
                Button("Fermer", role: .cancel) {}
            }
        }
    }

    private var cleanedTitle: String { title.trimmingCharacters(in: .whitespacesAndNewlines) }
    private var cleanedText: String { text.trimmingCharacters(in: .whitespacesAndNewlines) }

    private func addEntry() {
        context.insert(JournalEntry(title: cleanedTitle, text: cleanedText))
        if saveChanges() {
            title = ""
            text = ""
        }
    }

    private func deleteEntries(at offsets: IndexSet) {
        let deleted = offsets.map { entries[$0] }
        for entry in deleted { context.delete(entry) }
        _ = saveChanges()
    }

    private func saveChanges() -> Bool {
        do {
            try context.save()
            return true
        } catch {
            context.rollback()
            saveError = true
            return false
        }
    }
}
`;

export const swiftAdvancedProjects: WebProject[] = [
  {
    id: "crypto-swiftui-animee",
    title: "Les cours des cryptos",
    description:
      "Récupère trois cours spot publics, puis ajoute une recherche et un tri animé.",
    minutes: 135,
    requirements: [
      "Charge les valeurs BTC, ETH et SOL en USD et affiche l’heure du dernier relevé.",
      "Filtre la liste avec une recherche et trie-la par prix avec une transition.",
      "Teste l’échec du réseau et le bouton Réessayer.",
    ],
    hints: [
      "Utilise URLSession et vérifie le code HTTP avant de décoder le JSON.",
      "async let permet de lancer les trois requêtes en parallèle. Garde la mise à jour de l’interface sur le MainActor.",
      "Anime le changement des identifiants affichés. Le prix reste représenté par un Decimal.",
    ],
    files: swiftFiles("Cours des cryptos", {
      id: "cryptos",
      view: cryptoView,
      notes:
        "L’application lit des cours spot indicatifs via les points d’accès publics de Coinbase. Recherche « ETH », efface le filtre et utilise Trier par prix. Coupe le réseau puis tire la liste vers le bas pour tester l’erreur. Les derniers cours de la session restent visibles avec leur heure.",
      extra: {
        [`${swiftPath}/QuoteClient.swift`]: quoteClient,
        [`${swiftPath}/QuoteViewModel.swift`]: quoteViewModel,
      },
    }),
  },
  {
    id: "journal-swiftdata",
    title: "Le journal intime persistant",
    description:
      "Enregistre des entrées avec SwiftData et retrouve-les même après une relance hors ligne.",
    minutes: 140,
    requirements: [
      "Ajoute deux entrées datées et affiche la plus récente en haut.",
      "Relance l’application et ouvre le texte complet d’une entrée sans connexion.",
      "Supprime une entrée puis relance pour vérifier que la suppression est persistante.",
    ],
    hints: [
      "Déclare JournalEntry avec @Model. Le point d’entrée fournit le conteneur SwiftData à l’interface.",
      "Lis les entrées avec @Query et passe par modelContext pour insérer ou retirer une entrée.",
      "Appelle save puis présente une erreur si le stockage échoue.",
    ],
    files: swiftFiles("Mon journal", {
      id: "journal",
      view: journalView,
      app: journalApp,
      notes:
        "Écris deux entrées de test. Arrête l’application dans Xcode puis relance-la sur le même simulateur. Les entrées restent dans le stockage de l’application. La suppression de l’application efface ce stockage. Utilise des entrées de démonstration pendant l’exercice.",
      extra: { [`${swiftPath}/JournalEntry.swift`]: journalEntry },
    }),
  },
];
