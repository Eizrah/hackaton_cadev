import { springFiles, springJava } from "./springAuthoring";
import type { WebProject } from "./webCourseTypes";

const students: WebProject = {
  id: "api-etudiants",
  title: "L’API de gestion d’étudiants",
  description:
    "Construis un CRUD REST avec une liste Java et un service injecté dans le contrôleur.",
  minutes: 55,
  requirements: [
    "Créer, lire, modifier et supprimer des étudiants.",
    "Filtrer la liste par nom et lire un étudiant par identifiant.",
    "Renvoyer un statut 400 pour une donnée invalide et 404 pour un identifiant absent.",
  ],
  hints: [
    "Le contrôleur reçoit le service dans son constructeur.",
    "La liste du service est en mémoire. Relance le serveur pour repartir des données de départ.",
  ],
  files: springFiles("API des étudiants", {
    entry: `${springJava}/StudentController.java`,
    intro:
      "Essaye une API CRUD dont les données vivent en mémoire pendant le démarrage du serveur.",
    endpoints: [
      "GET /api/students",
      "GET /api/students/1",
      "POST /api/students",
      "PUT /api/students/{id}",
      "DELETE /api/students/{id}",
    ],
    sources: {
      [`${springJava}/Student.java`]: `package devafrica.atelier;

public record Student(long id, String name, String email) {
}
`,
      [`${springJava}/StudentController.java`]: `package devafrica.atelier;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
class StudentController {
    private final StudentService service;

    StudentController(StudentService service) {
        this.service = service;
    }

    record StudentInput(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email @Size(max = 255) String email) {
    }

    @GetMapping
    List<Student> list(@RequestParam(defaultValue = "") String name) {
        return service.search(name);
    }

    @GetMapping("/{id}")
    Student find(@PathVariable long id) {
        return service.find(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Student create(@Valid @RequestBody StudentInput input) {
        return service.create(input.name(), input.email());
    }

    @PutMapping("/{id}")
    Student update(@PathVariable long id, @Valid @RequestBody StudentInput input) {
        return service.update(id, input.name(), input.email());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable long id) {
        service.delete(id);
    }
}
`,
      [`${springJava}/StudentService.java`]: `package devafrica.atelier;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
class StudentService {
    private final List<Student> students = new ArrayList<>(
            List.of(new Student(1, "Tiana Rakoto", "tiana@example.test")));
    private long nextId = 2;

    synchronized List<Student> search(String name) {
        String query = name.trim().toLowerCase(Locale.ROOT);
        return students.stream()
                .filter(student -> student.name().toLowerCase(Locale.ROOT).contains(query))
                .toList();
    }

    synchronized Student find(long id) {
        return students.get(index(id));
    }

    synchronized Student create(String name, String email) {
        Student student = new Student(nextId++, name.trim(), email.trim());
        students.add(student);
        return student;
    }

    synchronized Student update(long id, String name, String email) {
        Student student = new Student(id, name.trim(), email.trim());
        students.set(index(id), student);
        return student;
    }

    synchronized void delete(long id) {
        students.remove(index(id));
    }

    private int index(long id) {
        for (int i = 0; i < students.size(); i++) {
            if (students.get(i).id() == id) return i;
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant introuvable.");
    }
}
`,
    },
    notes: `## Essayer le CRUD

\`\`\`powershell
$base = 'http://127.0.0.1:8080/api/students'
Invoke-RestMethod -Uri 'http://127.0.0.1:8080/api/students?name=Tiana'
$etudiant = Invoke-RestMethod -Uri $base -Method Post -ContentType 'application/json' -Body '{"name":"Amina Dia","email":"amina@example.test"}'
Invoke-RestMethod -Uri "$base/$($etudiant.id)" -Method Put -ContentType 'application/json' -Body '{"name":"Amina D.","email":"amina@example.test"}'
Invoke-RestMethod -Uri "$base/$($etudiant.id)" -Method Delete
\`\`\`

Essaie un e-mail invalide pour observer 400 et demande un identifiant absent pour observer 404.`,
  }),
};

const loan: WebProject = {
  id: "calculateur-pret",
  title: "Le calculateur de prêt",
  description:
    "Reçois trois paramètres, valide le JSON et retourne un échéancier pédagogique.",
  minutes: 55,
  requirements: [
    "Valider un montant, un taux annuel et une durée en mois.",
    "Calculer les mensualités et distinguer capital, intérêts et solde restant.",
    "Vérifier les cas taux zéro et dernière échéance.",
  ],
  hints: [
    "Utilise BigDecimal pour conserver une précision décimale.",
    "Le taux mensuel vaut le taux annuel en pourcentage divisé par 1 200.",
    "L’exemple calcule un prêt à taux fixe avec un modèle simplifié, sans frais ni assurance.",
  ],
  files: springFiles("Calculateur de prêt", {
    entry: `${springJava}/LoanController.java`,
    intro:
      "Une API d’exercice pour manipuler les nombres décimaux et valider les entrées. Les résultats illustrent un modèle mathématique simplifié.",
    endpoints: ["POST /api/loans/estimate"],
    sources: {
      [`${springJava}/LoanController.java`]: `package devafrica.atelier;

import java.math.BigDecimal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loans")
class LoanController {
    private final LoanService service;

    LoanController(LoanService service) {
        this.service = service;
    }

    record LoanInput(
            @NotNull @DecimalMin("100") @DecimalMax("100000000") @Digits(integer = 9, fraction = 2) BigDecimal principal,
            @NotNull @DecimalMin("0") @DecimalMax("25") @Digits(integer = 2, fraction = 4) BigDecimal annualRate,
            @NotNull @Min(1) @Max(480) Integer months) {
    }

    @PostMapping("/estimate")
    LoanService.Schedule estimate(@Valid @RequestBody LoanInput input) {
        return service.calculate(input.principal(), input.annualRate(), input.months());
    }
}
`,
      [`${springJava}/LoanService.java`]: `package devafrica.atelier;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
class LoanService {
    private static final MathContext PRECISION = MathContext.DECIMAL128;
    private static final RoundingMode ROUND = RoundingMode.HALF_UP;

    record Payment(int month, BigDecimal payment, BigDecimal capital, BigDecimal interest, BigDecimal remaining) {
    }

    record Schedule(BigDecimal monthlyPayment, BigDecimal totalInterest, List<Payment> payments) {
    }

    Schedule calculate(BigDecimal principal, BigDecimal annualRate, int months) {
        BigDecimal rate = annualRate.divide(new BigDecimal("1200"), PRECISION);
        BigDecimal payment = monthly(principal, rate, months);
        BigDecimal remaining = principal.setScale(2, ROUND);
        BigDecimal totalInterest = BigDecimal.ZERO.setScale(2);
        List<Payment> payments = new ArrayList<>();
        for (int month = 1; month <= months && remaining.signum() > 0; month++) {
            BigDecimal interest = remaining.multiply(rate).setScale(2, ROUND);
            BigDecimal capital = month == months ? remaining :
                    payment.subtract(interest).max(BigDecimal.ZERO.setScale(2)).min(remaining);
            remaining = remaining.subtract(capital);
            totalInterest = totalInterest.add(interest);
            payments.add(new Payment(month, capital.add(interest), capital, interest, remaining));
        }
        return new Schedule(payment, totalInterest, List.copyOf(payments));
    }

    private BigDecimal monthly(BigDecimal principal, BigDecimal rate, int months) {
        if (rate.signum() == 0) {
            return principal.divide(BigDecimal.valueOf(months), 2, ROUND);
        }
        BigDecimal factor = BigDecimal.ONE.add(rate, PRECISION).pow(months, PRECISION);
        return principal.multiply(rate, PRECISION).multiply(factor, PRECISION)
                .divide(factor.subtract(BigDecimal.ONE), 2, ROUND);
    }
}
`,
    },
    notes: `## Essayer un calcul

\`\`\`powershell
$body = '{"principal":1200,"annualRate":0,"months":12}'
$echeancier = Invoke-RestMethod -Uri 'http://127.0.0.1:8080/api/loans/estimate' -Method Post -ContentType 'application/json' -Body $body
$echeancier.payments | Format-Table
\`\`\`

Compare 0 % et 5 %. Vérifie que le solde final est à zéro. Les arrondis sont ajustés à la dernière échéance.
`,
  }),
};

const recipes: WebProject = {
  id: "api-recettes",
  title: "L’API de recettes et catégories",
  description:
    "Crée un catalogue persistant avec une catégorie par recette et des étiquettes réutilisables.",
  minutes: 75,
  requirements: [
    "Créer une catégorie et une recette qui lui appartient.",
    "Lister les recettes et filtrer par catégorie.",
    "Lier des étiquettes à plusieurs recettes et retrouver les données au redémarrage.",
  ],
  hints: [
    "Commence avec H2. Le README montre comment essayer PostgreSQL.",
    "Le GET /api/tags donne les identifiants des étiquettes d’exemple.",
  ],
  files: springFiles("API de recettes", {
    entry: `${springJava}/Recipe.java`,
    jpa: true,
    postgres: true,
    intro:
      "Essaye la persistance avec Spring Data JPA, Hibernate et une base H2 locale.",
    endpoints: [
      "GET /api/recipes",
      "GET /api/categories",
      "GET /api/tags",
      "POST /api/categories",
      "POST /api/recipes",
      "GET /api/recipes?category=Desserts",
    ],
    sources: {
      [`${springJava}/Category.java`]: `package devafrica.atelier;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, length = 100)
    String name;
    @OneToMany(mappedBy = "category")
    List<Recipe> recipes = new ArrayList<>();

    protected Category() {}

    Category(String name) {
        this.name = name;
    }
}
`,
      [`${springJava}/Recipe.java`]: `package devafrica.atelier;

import java.util.LinkedHashSet;
import java.util.Set;
import jakarta.persistence.*;

@Entity
public class Recipe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, length = 140)
    String title;
    @Column(nullable = false, length = 2000)
    String instructions;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    Category category;
    @ManyToMany
    @JoinTable(name = "recipe_tags",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    Set<Tag> tags = new LinkedHashSet<>();

    protected Recipe() {}

    Recipe(String title, String instructions, Category category, Set<Tag> tags) {
        this.title = title;
        this.instructions = instructions;
        this.category = category;
        this.tags.addAll(tags);
    }
}
`,
      [`${springJava}/Tag.java`]: `package devafrica.atelier;

import jakarta.persistence.*;

@Entity
public class Tag {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, unique = true, length = 60)
    String name;

    protected Tag() {}

    Tag(String name) {
        this.name = name;
    }
}
`,
      [`${springJava}/RecipeRepository.java`]: `package devafrica.atelier;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @EntityGraph(attributePaths = {"category", "tags"})
    List<Recipe> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"category", "tags"})
    List<Recipe> findByCategory_NameIgnoreCaseOrderByIdAsc(String category);
}

interface CategoryRepository extends JpaRepository<Category, Long> {
}

interface TagRepository extends JpaRepository<Tag, Long> {
}
`,
      [`${springJava}/RecipeService.java`]: `package devafrica.atelier;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
class RecipeService {
    private final RecipeRepository recipes;
    private final CategoryRepository categories;
    private final TagRepository tags;

    RecipeService(RecipeRepository recipes, CategoryRepository categories, TagRepository tags) {
        this.recipes = recipes;
        this.categories = categories;
        this.tags = tags;
    }

    record Label(long id, String name) {}
    record Card(long id, String title, String instructions, Label category, List<Label> tags) {}

    @Transactional(readOnly = true)
    public List<Card> list(String category) {
        List<Recipe> results = category.isBlank() ? recipes.findAllByOrderByIdAsc() :
                recipes.findByCategory_NameIgnoreCaseOrderByIdAsc(category.trim());
        return results.stream().map(this::card).toList();
    }

    @Transactional
    public Card create(String title, String instructions, long categoryId, Set<Long> tagIds) {
        Category category = categories.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catégorie introuvable."));
        Set<Long> requested = tagIds == null ? Set.of() : tagIds;
        Set<Tag> labels = new LinkedHashSet<>(tags.findAllById(requested));
        if (labels.size() != requested.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Une étiquette est inconnue.");
        }
        return card(recipes.save(new Recipe(title.trim(), instructions.trim(), category, labels)));
    }

    List<Label> categories() {
        return categories.findAll().stream().map(category -> new Label(category.id, category.name)).toList();
    }

    Label addCategory(String name) {
        Category category = categories.save(new Category(name.trim()));
        return new Label(category.id, category.name);
    }

    List<Label> tags() {
        return tags.findAll().stream().map(tag -> new Label(tag.id, tag.name)).toList();
    }

    private Card card(Recipe recipe) {
        return new Card(recipe.id, recipe.title, recipe.instructions,
                new Label(recipe.category.id, recipe.category.name),
                recipe.tags.stream().map(tag -> new Label(tag.id, tag.name)).toList());
    }
}

@Configuration
class RecipeDemoData {
    @Bean
    CommandLineRunner seedTags(TagRepository tags) {
        return args -> {
            if (tags.count() == 0) tags.saveAll(List.of(new Tag("Rapide"), new Tag("Végétarien")));
        };
    }
}
`,
      [`${springJava}/RecipeController.java`]: `package devafrica.atelier;

import java.util.List;
import java.util.Set;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
class RecipeController {
    private final RecipeService service;

    RecipeController(RecipeService service) {
        this.service = service;
    }

    record CategoryInput(@NotBlank @Size(max = 100) String name) {}
    record RecipeInput(
            @NotBlank @Size(max = 140) String title,
            @NotBlank @Size(max = 2000) String instructions,
            @NotNull @Positive Long categoryId,
            @Size(max = 12) Set<@NotNull @Positive Long> tagIds) {}

    @GetMapping("/recipes")
    List<RecipeService.Card> recipes(@RequestParam(defaultValue = "") String category) {
        return service.list(category);
    }

    @PostMapping("/recipes")
    @ResponseStatus(HttpStatus.CREATED)
    RecipeService.Card create(@Valid @RequestBody RecipeInput input) {
        return service.create(input.title(), input.instructions(), input.categoryId(), input.tagIds());
    }

    @GetMapping("/categories")
    List<RecipeService.Label> categories() { return service.categories(); }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    RecipeService.Label category(@Valid @RequestBody CategoryInput input) {
        return service.addCategory(input.name());
    }

    @GetMapping("/tags")
    List<RecipeService.Label> tags() { return service.tags(); }
}
`,
    },
    notes: `## Ajouter une recette

\`\`\`powershell
$base = 'http://127.0.0.1:8080/api'
$categorie = Invoke-RestMethod -Uri "$base/categories" -Method Post -ContentType 'application/json' -Body '{"name":"Desserts"}'
$tags = Invoke-RestMethod -Uri "$base/tags"
$recette = @{title='Salade de fruits'; instructions='Couper et melanger les fruits.'; categoryId=$categorie.id; tagIds=@($tags[0].id)} | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$base/recipes" -Method Post -ContentType 'application/json' -Body $recette
Invoke-RestMethod -Uri 'http://127.0.0.1:8080/api/recipes?category=Desserts'
\`\`\`
`,
  }),
};

const library: WebProject = {
  id: "bibliotheque-virtuelle",
  title: "La bibliothèque virtuelle",
  description:
    "Gère la disponibilité d’un livre et protège l’emprunt contre deux demandes concurrentes.",
  minutes: 80,
  requirements: [
    "Afficher les livres et les lecteurs disponibles.",
    "Emprunter ou rendre un livre dans une transaction.",
    "Renvoyer 409 quand le livre est déjà emprunté et 404 quand un identifiant est absent.",
  ],
  hints: [
    "Verrouille le livre pendant la transaction avant de vérifier son état.",
    "Les deux livres et les lecteurs de démonstration sont créés au premier lancement.",
  ],
  files: springFiles("Bibliothèque virtuelle", {
    entry: `${springJava}/LibraryService.java`,
    jpa: true,
    intro:
      "Une API pour emprunter et rendre des livres en conservant un état cohérent dans la base.",
    endpoints: [
      "GET /api/books",
      "GET /api/borrowers",
      "POST /api/books/{id}/borrow",
      "POST /api/books/{id}/return",
    ],
    sources: {
      [`${springJava}/Book.java`]: `package devafrica.atelier;

import jakarta.persistence.*;

@Entity
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String title;
    @ManyToOne(fetch = FetchType.LAZY)
    Borrower borrower;

    protected Book() {}
    Book(String title) { this.title = title; }
}
`,
      [`${springJava}/Borrower.java`]: `package devafrica.atelier;

import jakarta.persistence.*;

@Entity
public class Borrower {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String name;

    protected Borrower() {}
    Borrower(String name) { this.name = name; }
}
`,
      [`${springJava}/BookRepository.java`]: `package devafrica.atelier;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

interface BookRepository extends JpaRepository<Book, Long> {
    @EntityGraph(attributePaths = "borrower")
    List<Book> findAllByOrderByIdAsc();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select book from Book book where book.id = :id")
    Optional<Book> lockById(@Param("id") long id);
}

interface BorrowerRepository extends JpaRepository<Borrower, Long> {
}
`,
      [`${springJava}/LibraryService.java`]: `package devafrica.atelier;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
class LibraryService {
    private final BookRepository books;
    private final BorrowerRepository borrowers;

    LibraryService(BookRepository books, BorrowerRepository borrowers) {
        this.books = books;
        this.borrowers = borrowers;
    }

    record BookCard(long id, String title, boolean available, Long borrowerId) {}
    record Reader(long id, String name) {}

    @Transactional(readOnly = true)
    public List<BookCard> list() {
        return books.findAllByOrderByIdAsc().stream().map(this::card).toList();
    }

    public List<Reader> borrowers() {
        return borrowers.findAll().stream().map(member -> new Reader(member.id, member.name)).toList();
    }

    @Transactional
    public BookCard borrow(long bookId, long borrowerId) {
        Book book = lock(bookId);
        if (book.borrower != null) throw new AlreadyBorrowed();
        book.borrower = borrowers.findById(borrowerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecteur introuvable."));
        return card(book);
    }

    @Transactional
    public BookCard giveBack(long id) {
        Book book = lock(id);
        if (book.borrower == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce livre est déjà disponible.");
        }
        book.borrower = null;
        return card(book);
    }

    private Book lock(long id) {
        return books.lockById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre introuvable."));
    }

    private BookCard card(Book book) {
        return new BookCard(book.id, book.title, book.borrower == null,
                book.borrower == null ? null : book.borrower.id);
    }
}

class AlreadyBorrowed extends ResponseStatusException {
    AlreadyBorrowed() { super(HttpStatus.CONFLICT, "Ce livre est déjà emprunté."); }
}

@Configuration
class LibraryDemoData {
    @Bean
    CommandLineRunner seedLibrary(BookRepository books, BorrowerRepository borrowers) {
        return args -> {
            if (books.count() == 0) books.saveAll(List.of(new Book("Apprendre Java"), new Book("Architectures web")));
            if (borrowers.count() == 0) borrowers.saveAll(List.of(new Borrower("Amina"), new Borrower("Tiana")));
        };
    }
}
`,
      [`${springJava}/LibraryController.java`]: `package devafrica.atelier;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
class LibraryController {
    private final LibraryService service;

    LibraryController(LibraryService service) {
        this.service = service;
    }

    record BorrowInput(@NotNull @Positive Long borrowerId) {}

    @GetMapping("/books")
    List<LibraryService.BookCard> list() { return service.list(); }

    @GetMapping("/borrowers")
    List<LibraryService.Reader> borrowers() { return service.borrowers(); }

    @PostMapping("/books/{id}/borrow")
    LibraryService.BookCard borrow(@PathVariable long id, @Valid @RequestBody BorrowInput input) {
        return service.borrow(id, input.borrowerId());
    }

    @PostMapping("/books/{id}/return")
    LibraryService.BookCard giveBack(@PathVariable long id) { return service.giveBack(id); }
}
`,
    },
    notes: `## Tester une transaction

\`\`\`powershell
$base = 'http://127.0.0.1:8080/api'
Invoke-RestMethod -Uri "$base/books"
Invoke-RestMethod -Uri "$base/borrowers"
Invoke-RestMethod -Uri "$base/books/1/borrow" -Method Post -ContentType 'application/json' -Body '{"borrowerId":1}'
Invoke-RestMethod -Uri "$base/books/1/return" -Method Post
\`\`\`

Envoie deux demandes d’emprunt successives avant le retour. La deuxième obtient le statut 409 avec un message.
`,
  }),
};

export const springFoundationProjects: [WebProject[], WebProject[]] = [
  [students, loan],
  [recipes, library],
];
