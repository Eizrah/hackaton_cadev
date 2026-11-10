import { flutterFiles } from "./flutterAuthoring";
import type { WebProject } from "./webCourseTypes";

export const dartBasics = "bin/bases.dart";
const basics = `class Profil {
  const Profil({required this.nom, this.courriel});
  const Profil.invite() : nom = 'Invité', courriel = null;

  final String nom;
  final String? courriel;
}

String contact(Profil profil) {
  final adresse = profil.courriel?.trim();
  return adresse == null || adresse.isEmpty ? 'Courriel à renseigner' : adresse;
}

void main() {
  const profil = Profil(nom: 'Soa Rakoto', courriel: 'soa@example.org');
  const invite = Profil.invite();
  var essais = 1;
  essais += 1;

  print('\${profil.nom} • \${contact(profil)}');
  print('\${invite.nom} • \${contact(invite)}');
  print('Essais : $essais');
}
`;

const identity = `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'atelier_app.dart';

void main() => runApp(const AtelierApp(title: 'Ma carte', home: IdentityPage()));

class IdentityPage extends StatelessWidget {
  const IdentityPage({super.key});

  static const email = 'soa@example.org';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Mon profil')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Card(
                clipBehavior: Clip.antiAlias,
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          CircleAvatar(
                            radius: 54,
                            backgroundImage: AssetImage('assets/avatar.png'),
                          ),
                          CircleAvatar(radius: 13, child: Icon(Icons.code, size: 16)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text('Soa Rakoto', style: theme.textTheme.headlineSmall),
                      const Text('Développement mobile · Toamasina'),
                      const Divider(height: 32),
                      const ListTile(
                        leading: Icon(Icons.email_outlined),
                        title: Text(email),
                        contentPadding: EdgeInsets.zero,
                      ),
                      FilledButton.icon(
                        onPressed: () async {
                          await Clipboard.setData(const ClipboardData(text: email));
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Adresse copiée.')),
                            );
                          }
                        },
                        icon: const Icon(Icons.copy),
                        label: const Text('Copier le courriel'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`;

const counter = `import 'package:flutter/material.dart';
import 'atelier_app.dart';

void main() => runApp(const AtelierApp(title: 'Compteur', home: CounterPage()));

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int count = 0;

  void changeBy(int amount) {
    setState(() {
      count += amount;
    });
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Compteur de clics')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Le score change à chaque appui.'),
                const SizedBox(height: 16),
                Semantics(
                  liveRegion: true,
                  child: Text('$count', style: textTheme.displayLarge),
                ),
                const SizedBox(height: 18),
                Wrap(
                  spacing: 14,
                  runSpacing: 10,
                  alignment: WrapAlignment.center,
                  children: [
                    OutlinedButton.icon(
                      onPressed: () => changeBy(-1),
                      icon: const Icon(Icons.remove),
                      label: const Text('Retirer 1'),
                    ),
                    FilledButton.icon(
                      onPressed: () => changeBy(1),
                      icon: const Icon(Icons.add),
                      label: const Text('Ajouter 1'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`;

export const flutterBeginnerProjects: WebProject[] = [
  {
    id: "carte-profil-flutter",
    title: "La carte de profil virtuelle",
    description:
      "Crée un écran Flutter centré qui réunit un avatar, des coordonnées et une action.",
    minutes: 75,
    requirements: [
      "Dispose l’avatar, le nom et le domaine dans une Column.",
      "Affiche le courriel et rends le bouton Copier le courriel fonctionnel.",
      "Personnalise les informations et teste la carte sur un petit écran.",
    ],
    hints: [
      "CircleAvatar charge l’image locale déclarée dans pubspec.yaml.",
      "Stack place la petite icône sur l’avatar. Padding ménage de l’espace autour des textes.",
      "Essaie les types et les constructeurs avec dart run bin/bases.dart.",
    ],
    files: flutterFiles("Carte de profil", {
      id: "carte",
      main: identity,
      notes:
        "Le portrait est une illustration locale et les coordonnées sont fictives. Change le nom et le métier dans lib/main.dart. Le script Dart autonome se lance avec dart run bin/bases.dart.",
      assets: { "assets/avatar.png": "learning/mobile/avatar.png" },
      extra: { [dartBasics]: basics },
    }),
  },
  {
    id: "compteur-clics-flutter",
    title: "Le compteur de clics",
    description:
      "Utilise setState pour actualiser un score quand un bouton est pressé.",
    minutes: 65,
    requirements: [
      "Affiche un compteur initialisé à zéro.",
      "Ajoute et retire un point depuis les deux boutons.",
      "Vérifie que le nombre visible correspond à l’état après plusieurs clics.",
    ],
    hints: [
      "Le nombre appartient à l’objet State de CounterPage.",
      "Une méthode commune reçoit la variation et l’applique dans setState.",
      "Wrap permet aux boutons de passer à la ligne si la place manque.",
    ],
    files: flutterFiles("Compteur de clics", {
      id: "compteur",
      main: counter,
      notes:
        "Essaie Ajouter 1 deux fois puis Retirer 1 une fois. Le résultat attendu est 1. Ajoute ensuite une action pour remettre le compteur à zéro.",
    }),
  },
];

const tasksStore = `import 'package:flutter/foundation.dart';

class TaskItem {
  const TaskItem(this.id, this.title, {this.done = false});

  final int id;
  final String title;
  final bool done;

  TaskItem flipped() => TaskItem(id, title, done: !done);
}

class TasksStore extends ChangeNotifier {
  final _tasks = <TaskItem>[const TaskItem(1, 'Ouvrir l’atelier Flutter')];
  int _nextId = 2;

  List<TaskItem> get tasks => List.unmodifiable(_tasks);

  void add(String text) {
    final title = text.trim();
    if (title.isEmpty) return;
    _tasks.add(TaskItem(_nextId++, title));
    notifyListeners();
  }

  void toggle(int id) {
    final index = _tasks.indexWhere((task) => task.id == id);
    if (index < 0) return;
    _tasks[index] = _tasks[index].flipped();
    notifyListeners();
  }
}
`;

const taskForm = `import 'package:flutter/material.dart';

class TaskFormPage extends StatefulWidget {
  const TaskFormPage({super.key});

  @override
  State<TaskFormPage> createState() => _TaskFormPageState();
}

class _TaskFormPageState extends State<TaskFormPage> {
  final form = GlobalKey<FormState>();
  final title = TextEditingController();

  @override
  void dispose() {
    title.dispose();
    super.dispose();
  }

  void submit() {
    if (form.currentState!.validate()) {
      Navigator.of(context).pop(title.text.trim());
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Nouvelle tâche')),
    body: SafeArea(
      child: Form(
        key: form,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            TextFormField(
              controller: title,
              autofocus: true,
              maxLength: 100,
              decoration: const InputDecoration(labelText: 'Titre de la tâche'),
              validator: (value) =>
                  value == null || value.trim().isEmpty ? 'Saisis un titre.' : null,
              onFieldSubmitted: (_) => submit(),
            ),
            FilledButton(onPressed: submit, child: const Text('Ajouter')),
          ],
        ),
      ),
    ),
  );
}
`;

const todo = `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'atelier_app.dart';
import 'task_form_page.dart';
import 'tasks_store.dart';

void main() => runApp(
  ChangeNotifierProvider(
    create: (_) => TasksStore(),
    child: const AtelierApp(title: 'Mes tâches', home: TasksPage()),
  ),
);

class TasksPage extends StatelessWidget {
  const TasksPage({super.key});

  Future<void> openForm(BuildContext context) async {
    final title = await Navigator.of(context).push<String>(
      MaterialPageRoute(builder: (_) => const TaskFormPage()),
    );
    if (context.mounted && title != null) {
      context.read<TasksStore>().add(title);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tasks = context.watch<TasksStore>().tasks;
    return Scaffold(
      appBar: AppBar(title: const Text('Mes tâches')),
      body: SafeArea(
        child: ListView.builder(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 92),
          itemCount: tasks.length,
          itemBuilder: (_, index) {
            final task = tasks[index];
            return CheckboxListTile(
              key: ValueKey(task.id),
              title: Text(task.title),
              value: task.done,
              onChanged: (_) => context.read<TasksStore>().toggle(task.id),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => openForm(context),
        icon: const Icon(Icons.add),
        label: const Text('Nouvelle tâche'),
      ),
    );
  }
}
`;

const cartStore = `import 'package:flutter/foundation.dart';

class Product {
  const Product(this.id, this.name, this.price);

  final int id;
  final String name;
  final int price;
}

const products = [
  Product(1, 'Carnet', 6000),
  Product(2, 'Sac en toile', 18000),
  Product(3, 'Gourde', 24000),
];

class CartStore extends ChangeNotifier {
  final _quantities = <int, int>{};

  int quantity(Product product) => _quantities[product.id] ?? 0;
  int get count => _quantities.values.fold(0, (a, b) => a + b);
  int get total => products.fold(0, (sum, product) => sum + product.price * quantity(product));

  void change(Product product, int difference) {
    final next = quantity(product) + difference;
    if (next <= 0) {
      _quantities.remove(product.id);
    } else {
      _quantities[product.id] = next;
    }
    notifyListeners();
  }
}
`;

const catalog = `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'atelier_app.dart';
import 'cart_store.dart';

void main() => runApp(
  ChangeNotifierProvider(
    create: (_) => CartStore(),
    child: const AtelierApp(title: 'La boutique', home: CatalogPage()),
  ),
);

class CartBadge extends StatelessWidget {
  const CartBadge({super.key});

  @override
  Widget build(BuildContext context) {
    final count = context.select<CartStore, int>((cart) => cart.count);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      child: Center(child: Text('Panier · $count', semanticsLabel: '$count articles au panier')),
    );
  }
}

class CatalogPage extends StatelessWidget {
  const CatalogPage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Catalogue'), actions: const [CartBadge()]),
    body: SafeArea(
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: products.length,
        itemBuilder: (_, index) {
          final product = products[index];
          return Card(
            child: ListTile(
              leading: const Icon(Icons.shopping_bag_outlined),
              title: Text(product.name),
              subtitle: Text('\${product.price} Ar'),
              trailing: IconButton.filled(
                tooltip: 'Ajouter \${product.name}',
                onPressed: () => context.read<CartStore>().change(product, 1),
                icon: const Icon(Icons.add),
              ),
            ),
          );
        },
      ),
    ),
    floatingActionButton: FloatingActionButton.extended(
      onPressed: () => Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const CartPage()),
      ),
      icon: const Icon(Icons.shopping_cart_outlined),
      label: const Text('Ouvrir le panier'),
    ),
  );
}

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartStore>();
    final selected = products.where((product) => cart.quantity(product) > 0).toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Mon panier'), actions: const [CartBadge()]),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Total · \${cart.total} Ar', style: Theme.of(context).textTheme.titleLarge),
            if (selected.isEmpty) const Text('Ton panier est vide.'),
            for (final product in selected)
              ListTile(
                title: Text(product.name),
                subtitle: Text('Quantité : \${cart.quantity(product)}'),
                trailing: IconButton(
                  tooltip: 'Retirer une unité de \${product.name}',
                  onPressed: () => cart.change(product, -1),
                  icon: const Icon(Icons.remove_circle_outline),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
`;

const provider = { provider: "6.1.5+1" };
export const flutterIntermediateProjects: WebProject[] = [
  {
    id: "taches-flutter-provider",
    title: "Le gestionnaire de tâches",
    description:
      "Ajoute des tâches depuis un écran de formulaire et partage la liste avec Provider.",
    minutes: 95,
    requirements: [
      "Affiche les tâches avec ListView.builder et un identifiant stable.",
      "Ouvre le formulaire avec Navigator.push et renvoie un titre validé avec Navigator.pop.",
      "Ajoute une tâche et coche-la dans la liste sans recharger l’application.",
    ],
    hints: [
      "Le ChangeNotifierProvider entoure l’application pour rendre l’état accessible aux écrans.",
      "La liste observe TasksStore avec context.watch. Les boutons appellent les méthodes du store.",
      "Un retour sans titre signifie que le formulaire a été annulé.",
    ],
    files: flutterFiles("Mes tâches", {
      id: "taches",
      main: todo,
      dependencies: provider,
      notes:
        "Ouvre Nouvelle tâche, ajoute un titre puis coche sa ligne. Reviens du formulaire sans saisir de titre pour tester l’annulation. La liste vit en mémoire pendant la session.",
      extra: {
        "lib/tasks_store.dart": tasksStore,
        "lib/task_form_page.dart": taskForm,
      },
    }),
  },
  {
    id: "panier-flutter-provider",
    title: "Le catalogue et son panier",
    description:
      "Partage les articles et les quantités entre le catalogue et le panier.",
    minutes: 95,
    requirements: [
      "Ajoute deux produits depuis le catalogue.",
      "Vérifie que le nombre d’articles est identique sur les deux écrans.",
      "Retire une unité du panier et vérifie le nouveau total.",
    ],
    hints: [
      "CartStore associe l’identifiant d’un produit à sa quantité.",
      "CartBadge observe seulement le nombre d’articles avec context.select.",
      "Les totaux sont calculés à partir de la liste de produits et des quantités.",
    ],
    files: flutterFiles("Le catalogue et son panier", {
      id: "panier",
      main: catalog,
      dependencies: provider,
      notes:
        "Ajoute deux carnets et une gourde. Le compteur doit afficher 3 et le total 36 000 Ar. Retire un carnet et vérifie le total de 30 000 Ar.",
      extra: { "lib/cart_store.dart": cartStore },
    }),
  },
];
