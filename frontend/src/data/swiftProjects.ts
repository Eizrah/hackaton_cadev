import { swiftFiles } from "./swiftAuthoring";
import type { WebProject } from "./webCourseTypes";

// Code pour les variables Swift
const swiftBasics = `// VARIABLES ET CONSTANTES EN SWIFT
// var = variable (peut changer), let = constante (ne peut pas changer)

// Déclaration avec inférence de type
var nom = "Alice"              // String déduit
var age = 25                   // Int déduit
var taille = 1.75              // Double déduit
var estEtudiant = true         // Bool déduit

// Constantes avec let (préférée en Swift)
let pi = 3.14159
let maxUtilisateurs = 100

// Modification
nom = "Charlie"                // OK (var)
// pi = 3.14                   // ERREUR (let ne peut pas changer)

// Affichage
print("Nom: \\(nom)")
print("Age: \\(age) ans")

// Optionals (valeurs pouvant être nil)
var email: String? = nil       // Optional String

// Unwrapping sécurisé
if let emailValide = email {
    print("Email: \\(emailValide)")
} else {
    print("Pas d'email")
}

// Nil coalescing
let affichage = email ?? "Non renseigné"
print(affichage)`;

// Carte de visite
const identityCard = `import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.circle.fill")
                .font(.system(size: 100))
                .foregroundColor(.blue)
            
            Text("Alice Dupont")
                .font(.title)
                .fontWeight(.bold)
            
            Text("Développeuse iOS")
                .font(.headline)
                .foregroundColor(.gray)
            
            Divider()
                .padding(.horizontal, 50)
            
            VStack(alignment: .leading, spacing: 12) {
                ContactRow(icon: "envelope.fill", text: "alice@example.com")
                ContactRow(icon: "phone.fill", text: "+33 6 12 34 56 78")
                ContactRow(icon: "mappin.circle.fill", text: "Paris, France")
            }
            
            Spacer()
        }
        .padding()
    }
}

struct ContactRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.blue)
                .frame(width: 30)
            Text(text)
                .font(.body)
        }
    }
}

#Preview {
    ContentView()
}`;

// Compteur
const counter = `import SwiftUI

struct ContentView: View {
    @State private var count = 0
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Compteur")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("\\(count)")
                .font(.system(size: 80, weight: .bold))
                .foregroundColor(count >= 0 ? .green : .red)
            
            HStack(spacing: 20) {
                Button(action: { count -= 1 }) {
                    Label("Décrémenter", systemImage: "minus.circle.fill")
                        .font(.headline)
                        .padding()
                        .background(Color.red.opacity(0.2))
                        .cornerRadius(10)
                }
                
                Button(action: { count = 0 }) {
                    Label("Reset", systemImage: "arrow.counterclockwise")
                        .font(.headline)
                        .padding()
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(10)
                }
                
                Button(action: { count += 1 }) {
                    Label("Incrémenter", systemImage: "plus.circle.fill")
                        .font(.headline)
                        .padding()
                        .background(Color.green.opacity(0.2))
                        .cornerRadius(10)
                }
            }
            
            Spacer()
        }
        .padding()
    }
}

#Preview {
    ContentView()
}`;

// Projets débutants
export const swiftBeginnerProjects: WebProject[] = [
  {
    id: "carte-visite-swift",
    title: "La carte de visite iOS",
    description: "Crée un écran SwiftUI centré avec une image et des informations de contact.",
    minutes: 75,
    requirements: [
      "Utilise VStack pour disposer les éléments verticalement.",
      "Affiche une image SF Symbol comme avatar.",
      "Crée un composant ContactRow réutilisable.",
    ],
    hints: [
      "Image(systemName:) affiche des icônes SF Symbols gratuites.",
      ".font() et .foregroundColor() stylisent les textes.",
      "Spacer() pousse le contenu vers le haut.",
    ],
    files: swiftFiles("Carte de visite", {
      id: "carte",
      main: identityCard,
      notes: "Personnalise le nom et les informations de contact dans ContentView.swift.",
      extra: { "Variables.swift": swiftBasics },
    }),
  },
  {
    id: "compteur-swift",
    title: "Le compteur interactif",
    description: "Utilise @State pour gérer un compteur qui change avec des boutons.",
    minutes: 60,
    requirements: [
      "Déclare une variable @State private var count = 0.",
      "Affiche le compteur avec Text.",
      "Crée 3 boutons : incrémenter, reset, décrémenter.",
    ],
    hints: [
      "@State rend la variable mutable dans la vue.",
      "Button(action: { count += 1 }) modifie l'état au clic.",
    ],
    files: swiftFiles("Compteur", {
      id: "compteur",
      main: counter,
      notes: "Modifie les actions des boutons pour tester différentes opérations.",
      extra: { "Variables.swift": swiftBasics },
    }),
  },
];

// Todo List
const todoModel = `import Foundation

struct TodoItem: Identifiable {
    let id = UUID()
    var title: String
    var isCompleted: Bool = false
}`;

const todoList = `import SwiftUI

struct ContentView: View {
    @State private var todos: [TodoItem] = []
    @State private var showingAddSheet = false
    
    var body: some View {
        NavigationView {
            List {
                ForEach($todos) { $todo in
                    HStack {
                        Button(action: { todo.isCompleted.toggle() }) {
                            Image(systemName: todo.isCompleted ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(todo.isCompleted ? .green : .gray)
                        }
                        
                        Text(todo.title)
                            .strikethrough(todo.isCompleted)
                        
                        Spacer()
                    }
                }
                .onDelete(perform: deleteTodo)
            }
            .navigationTitle("Mes tâches")
            .toolbar {
                Button(action: { showingAddSheet = true }) {
                    Image(systemName: "plus")
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                AddTodoSheet(onAdd: addTodo)
            }
        }
    }
    
    func addTodo(title: String) {
        todos.append(TodoItem(title: title))
        showingAddSheet = false
    }
    
    func deleteTodo(at offsets: IndexSet) {
        todos.remove(atOffsets: offsets)
    }
}

struct AddTodoSheet: View {
    @Environment(\\.dismiss) var dismiss
    @State private var title = ""
    let onAdd: (String) -> Void
    
    var body: some View {
        NavigationView {
            Form {
                TextField("Titre de la tâche", text: $title)
            }
            .navigationTitle("Nouvelle tâche")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Ajouter") {
                        if !title.isEmpty {
                            onAdd(title)
                            dismiss()
                        }
                    }
                }
            }
        }
    }
}

#Preview {
    ContentView()
}`;

// Panier
const productModel = `import Foundation

struct Product: Identifiable, Codable {
    let id: Int
    let title: String
    let price: Double
    let description: String
}`;

const cartView = `import SwiftUI

struct ContentView: View {
    @State private var cartItems: [Product] = []
    
    var totalPrice: Double {
        cartItems.reduce(0) { $0 + $1.price }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                if cartItems.isEmpty {
                    EmptyCartView()
                } else {
                    List {
                        ForEach(cartItems) { product in
                            HStack {
                                Text(product.title)
                                Spacer()
                                Text(String(format: "%.2f €", product.price))
                            }
                        }
                        .onDelete(perform: removeFromCart)
                        
                        Section {
                            HStack {
                                Text("Total")
                                    .font(.headline)
                                Spacer()
                                Text(String(format: "%.2f €", totalPrice))
                                    .font(.title2)
                                    .foregroundColor(.green)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Mon panier")
        }
    }
    
    func removeFromCart(at offsets: IndexSet) {
        cartItems.remove(atOffsets: offsets)
    }
}

struct EmptyCartView: View {
    var body: some View {
        VStack {
            Image(systemName: "cart")
                .font(.system(size: 80))
                .foregroundColor(.gray)
            Text("Votre panier est vide")
        }
    }
}

#Preview {
    ContentView()
}`;

// Projets intermédiaires
export const swiftIntermediateProjects: WebProject[] = [
  {
    id: "todo-list-swift",
    title: "La liste de tâches",
    description: "Gère une liste de tâches avec ajout et suppression.",
    minutes: 90,
    requirements: [
      "Affiche les tâches avec List et ForEach.",
      "Implémente l'ajout avec un sheet modal.",
      "Active swipe-to-delete avec .onDelete.",
    ],
    hints: [
      "TodoItem doit être Identifiable pour ForEach.",
      ".sheet(isPresented:) affiche un modal.",
    ],
    files: swiftFiles("Todo List", {
      id: "todo",
      main: todoList,
      notes: "Teste l'ajout et la suppression. Le modèle TodoItem est dans TodoModel.swift.",
      extra: { "TodoModel.swift": todoModel },
    }),
  },
  {
    id: "panier-swift",
    title: "Le panier e-commerce",
    description: "Affiche un panier avec calcul du total.",
    minutes: 85,
    requirements: [
      "Calcule le total avec reduce.",
      "Gère l'état vide avec une vue conditionnelle.",
    ],
    hints: [
      "cartItems.reduce(0) { $0 + $1.price } additionne les prix.",
      "if cartItems.isEmpty affiche une vue différente.",
    ],
    files: swiftFiles("Panier", {
      id: "panier",
      main: cartView,
      notes: "Le panier démarre vide. Le modèle Product est dans ProductModel.swift.",
      extra: { "ProductModel.swift": productModel },
    }),
  },
];

// Application météo
const weatherService = `import Foundation

class WeatherService {
    func fetchWeather(for city: String) async throws -> WeatherResponse {
        let url = URL(string: "https://api.openweathermap.org/data/2.5/weather?q=\\(city)&units=metric")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(WeatherResponse.self, from: data)
    }
}

struct WeatherResponse: Codable {
    let name: String
    let main: Main
    
    struct Main: Codable {
        let temp: Double
        let humidity: Int
    }
}`;

const weatherView = `import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = WeatherViewModel()
    @State private var cityName = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                TextField("Entrez une ville", text: $cityName)
                    .textFieldStyle(.roundedBorder)
                    .padding()
                
                Button("Rechercher") {
                    Task {
                        await viewModel.searchWeather(for: cityName)
                    }
                }
                
                if viewModel.isLoading {
                    ProgressView()
                } else if let weather = viewModel.weather {
                    Text(weather.name)
                        .font(.largeTitle)
                    Text("\\(Int(weather.main.temp))°C")
                        .font(.system(size: 60))
                }
                
                Spacer()
            }
            .navigationTitle("Météo")
        }
    }
}

@MainActor
class WeatherViewModel: ObservableObject {
    @Published var weather: WeatherResponse?
    @Published var isLoading = false
    
    private let service = WeatherService()
    
    func searchWeather(for city: String) async {
        isLoading = true
        do {
            weather = try await service.fetchWeather(for: city)
        } catch {}
        isLoading = false
    }
}

#Preview {
    ContentView()
}`;

// Projets avancés
export const swiftAdvancedProjects: WebProject[] = [
  {
    id: "meteo-swift",
    title: "L'application météo",
    description: "Récupère la météo d'une ville avec URLSession.",
    minutes: 120,
    requirements: [
      "Implémente WeatherService avec async/await.",
      "Crée WeatherViewModel avec @Published.",
      "Utilise @StateObject dans la vue principale.",
    ],
    hints: [
      "URLSession.shared.data(from:) envoie la requête HTTP.",
      "JSONDecoder().decode() parse le JSON.",
    ],
    files: swiftFiles("Météo", {
      id: "meteo",
      main: weatherView,
      notes: "Le ViewModel utilise @Published pour notifier les changements.",
      extra: { "WeatherService.swift": weatherService },
    }),
  },
];
