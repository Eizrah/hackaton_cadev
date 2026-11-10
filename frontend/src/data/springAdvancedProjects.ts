import { springFiles, springJava, springTest } from "./springAuthoring";
import { demoTokenGuide, springSecurityFiles } from "./springSecurity";
import type { WebProject } from "./webCourseTypes";

const httpTestImports = `import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
`;
const testTokenMethod = `    private String bearer(String user) throws Exception {
        var response = mvc.perform(post("/api/token").contentType("application/json")
                .content(json.writeValueAsString(java.util.Map.of("username", user, "password", "DevAfrica-Local-42"))))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return "Bearer " + json.readTree(response).get("token").asText();
    }
`;

const shop: WebProject = {
  id: "commandes-jwt",
  title: "L’API sécurisée de commandes",
  description:
    "Publie un catalogue, contrôle les stocks et réserve les écritures et l’historique aux comptes autorisés.",
  minutes: 110,
  requirements: [
    "Créer un produit seulement avec le rôle ADMIN.",
    "Acheter depuis un compte connecté et vérifier la mise à jour du stock.",
    "Vérifier qu’un client ne voit que ses commandes et tester l’accès anonyme.",
  ],
  hints: [
    "Le README donne les commandes pour demander les jetons de test.",
    "Le service dérive le client du jeton vérifié et verrouille le produit avant de modifier son stock.",
    "Lance mvn test pour vérifier les parcours HTTP sur H2 en mémoire.",
  ],
  files: springFiles("Commandes sécurisées", {
    entry: `${springJava}/ShopController.java`,
    jpa: true,
    postgres: true,
    security: true,
    intro:
      "Les visiteurs lisent le catalogue. Les clients connectés commandent, et l’ajout de produits est réservé au rôle ADMIN.",
    endpoints: [
      "GET /api/products",
      "POST /api/token",
      "POST /api/products · ADMIN",
      "POST /api/orders",
      "GET /api/orders · historique du compte",
    ],
    sources: {
      ...springSecurityFiles(true),
      [`${springJava}/Product.java`]: `package devafrica.atelier;

import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, length = 120)
    String name;
    @Column(nullable = false, precision = 12, scale = 2)
    BigDecimal price;
    int stock;

    protected Product() {}

    Product(String name, BigDecimal price, int stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}
`,
      [`${springJava}/PurchaseOrder.java`]: `package devafrica.atelier;

import java.math.BigDecimal;
import java.time.Instant;
import jakarta.persistence.*;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String customer;
    long productId;
    String productName;
    int quantity;
    @Column(nullable = false, precision = 16, scale = 2)
    BigDecimal total;
    Instant orderedAt;

    protected PurchaseOrder() {}

    PurchaseOrder(String customer, Product product, int quantity) {
        this.customer = customer;
        this.productId = product.id;
        this.productName = product.name;
        this.quantity = quantity;
        this.total = product.price.multiply(BigDecimal.valueOf(quantity));
        this.orderedAt = Instant.now();
    }
}
`,
      [`${springJava}/ProductRepository.java`]: `package devafrica.atelier;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByIdAsc();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select product from Product product where product.id = :id")
    Optional<Product> lockById(@Param("id") long id);
}

interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByCustomerOrderByIdDesc(String customer);
}
`,
      [`${springJava}/ShopService.java`]: `package devafrica.atelier;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
class ShopService {
    private final ProductRepository products;
    private final OrderRepository orders;

    ShopService(ProductRepository products, OrderRepository orders) {
        this.products = products;
        this.orders = orders;
    }

    record ProductCard(long id, String name, BigDecimal price, int stock) {}
    record Receipt(long id, long productId, String productName, int quantity, BigDecimal total, Instant orderedAt) {}

    List<ProductCard> catalog() {
        return products.findAllByOrderByIdAsc().stream().map(this::card).toList();
    }

    ProductCard add(String name, BigDecimal price, int stock) {
        return card(products.save(new Product(name.trim(), price.setScale(2), stock)));
    }

    @Transactional
    public Receipt buy(String customer, long productId, int quantity) {
        Product product = products.lockById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit introuvable."));
        if (product.stock < quantity) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuffisant.");
        }
        product.stock -= quantity;
        return receipt(orders.save(new PurchaseOrder(customer, product, quantity)));
    }

    List<Receipt> history(String customer) {
        return orders.findByCustomerOrderByIdDesc(customer).stream().map(this::receipt).toList();
    }

    private ProductCard card(Product product) {
        return new ProductCard(product.id, product.name, product.price, product.stock);
    }

    private Receipt receipt(PurchaseOrder order) {
        return new Receipt(order.id, order.productId, order.productName, order.quantity, order.total, order.orderedAt);
    }
}
`,
      [`${springJava}/ShopController.java`]: `package devafrica.atelier;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
class ShopController {
    private final ShopService service;

    ShopController(ShopService service) {
        this.service = service;
    }

    record ProductInput(@NotBlank @Size(max = 120) String name,
            @NotNull @DecimalMin("0.01") @Digits(integer = 10, fraction = 2) BigDecimal price,
            @NotNull @Min(0) @Max(10000) Integer stock) {}
    record OrderInput(@NotNull @Positive Long productId, @NotNull @Min(1) @Max(99) Integer quantity) {}

    @GetMapping("/products")
    List<ShopService.ProductCard> products() { return service.catalog(); }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ShopService.ProductCard add(@Valid @RequestBody ProductInput product) {
        return service.add(product.name(), product.price(), product.stock());
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    ShopService.Receipt buy(Principal user, @Valid @RequestBody OrderInput order) {
        return service.buy(user.getName(), order.productId(), order.quantity());
    }

    @GetMapping("/orders")
    List<ShopService.Receipt> history(Principal user) { return service.history(user.getName()); }
}
`,
      [`${springTest}/ShopHttpTest.java`]: `package devafrica.atelier;

${httpTestImports}
@SpringBootTest(properties = "atelier.demo-password=DevAfrica-Local-42")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ShopHttpTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void publicCatalogAdminWritesAndPrivateOrders() throws Exception {
        mvc.perform(get("/api/products")).andExpect(status().isOk());
        mvc.perform(get("/api/orders")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/orders").header("Authorization", "Bearer invalid"))
                .andExpect(status().isUnauthorized());
        String alice = bearer("alice");
        String product = "{\\"name\\":\\"Carnet\\",\\"price\\":12.5,\\"stock\\":3}";
        mvc.perform(post("/api/products").header("Authorization", alice).contentType("application/json").content(product))
                .andExpect(status().isForbidden());
        String created = mvc.perform(post("/api/products").header("Authorization", bearer("admin"))
                        .contentType("application/json").content(product))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        long productId = json.readTree(created).get("id").asLong();
        String order = json.writeValueAsString(java.util.Map.of("productId", productId, "quantity", 2));
        mvc.perform(post("/api/orders").header("Authorization", alice).contentType("application/json").content(order))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.total").value(25.0));
        mvc.perform(get("/api/products")).andExpect(jsonPath("$[0].stock").value(1));
        mvc.perform(post("/api/orders").header("Authorization", alice).contentType("application/json").content(order))
                .andExpect(status().isConflict());
        mvc.perform(get("/api/orders").header("Authorization", alice)).andExpect(jsonPath("$.length()").value(1));
        mvc.perform(get("/api/orders").header("Authorization", bearer("bob"))).andExpect(jsonPath("$.length()").value(0));
    }

${testTokenMethod}}
`,
    },
    notes:
      demoTokenGuide +
      `
## Ajouter un produit et passer commande

\`\`\`powershell
$produit = Invoke-RestMethod -Uri "$base/products" -Method Post -Headers $admin -ContentType 'application/json' -Body '{"name":"Carnet","price":12.50,"stock":4}'
$body = @{productId=$produit.id; quantity=2} | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$base/orders" -Method Post -Headers $alice -ContentType 'application/json' -Body $body
Invoke-RestMethod -Uri "$base/orders" -Headers $alice
\`\`\`
`,
  }),
};

const teamwork: WebProject = {
  id: "taches-equipes",
  title: "Le backend de tâches par équipe",
  description:
    "Associe les comptes aux espaces de travail et applique une permission métier sur les tâches.",
  minutes: 105,
  requirements: [
    "Lister uniquement les espaces de travail dont le compte est membre.",
    "Modifier une tâche depuis son équipe.",
    "Vérifier le refus d’un autre compte et d’un identifiant de tâche appartenant à un autre espace.",
  ],
  hints: [
    "Alice appartient à l’espace 1 et Bob à l’espace 2.",
    "La vérification d’appartenance protège la route. La requête du dépôt inclut aussi l’espace de travail.",
    "Mvn test lance le test unitaire Mockito et le scénario HTTP.",
  ],
  files: springFiles("Tâches d’équipe", {
    entry: `${springJava}/WorkspaceTaskController.java`,
    jpa: true,
    postgres: true,
    security: true,
    intro:
      "Deux espaces et deux comptes de test permettent de comparer les autorisations de lecture et d’écriture.",
    endpoints: [
      "POST /api/token",
      "GET /api/workspaces",
      "GET /api/workspaces/{workspaceId}/tasks",
      "POST /api/workspaces/{workspaceId}/tasks",
      "PUT /api/workspaces/{workspaceId}/tasks/{taskId}",
    ],
    sources: {
      ...springSecurityFiles(false),
      [`${springJava}/Workspace.java`]: `package devafrica.atelier;

import jakarta.persistence.*;

@Entity
@Table(name = "team_workspaces")
public class Workspace {
    @Id Long id;
    @Column(nullable = false)
    String name;

    protected Workspace() {}

    Workspace(long id, String name) {
        this.id = id;
        this.name = name;
    }
}
`,
      [`${springJava}/WorkspaceMembership.java`]: `package devafrica.atelier;

import jakarta.persistence.*;

@Entity
@Table(name = "workspace_memberships",
        uniqueConstraints = @UniqueConstraint(columnNames = {"workspace_id", "username"}))
public class WorkspaceMembership {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    Workspace workspace;
    @Column(nullable = false)
    String username;

    protected WorkspaceMembership() {}

    WorkspaceMembership(Workspace workspace, String username) {
        this.workspace = workspace;
        this.username = username;
    }
}
`,
      [`${springJava}/TeamTask.java`]: `package devafrica.atelier;

import jakarta.persistence.*;

@Entity
public class TeamTask {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    Workspace workspace;
    @Column(nullable = false, length = 120)
    String title;
    boolean done;

    protected TeamTask() {}

    TeamTask(Workspace workspace, String title) {
        this.workspace = workspace;
        this.title = title;
    }
}
`,
      [`${springJava}/WorkspaceRepository.java`]: `package devafrica.atelier;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

interface WorkspaceRepository extends JpaRepository<Workspace, Long> {}

interface MembershipRepository extends JpaRepository<WorkspaceMembership, Long> {
    boolean existsByWorkspace_IdAndUsername(long workspaceId, String username);

    @EntityGraph(attributePaths = "workspace")
    List<WorkspaceMembership> findByUsernameOrderByIdAsc(String username);
}

interface TaskRepository extends JpaRepository<TeamTask, Long> {
    List<TeamTask> findByWorkspace_IdOrderByIdAsc(long workspaceId);
    Optional<TeamTask> findByIdAndWorkspace_Id(long id, long workspaceId);
}
`,
      [`${springJava}/WorkspaceAccess.java`]: `package devafrica.atelier;

import org.springframework.stereotype.Component;

@Component
public class WorkspaceAccess {
    private final MembershipRepository members;

    WorkspaceAccess(MembershipRepository members) {
        this.members = members;
    }

    public boolean isMember(long workspaceId, String username) {
        return members.existsByWorkspace_IdAndUsername(workspaceId, username);
    }
}
`,
      [`${springJava}/WorkspaceTaskController.java`]: `package devafrica.atelier;

import java.security.Principal;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/workspaces")
class WorkspaceController {
    private final MembershipRepository members;

    WorkspaceController(MembershipRepository members) {
        this.members = members;
    }

    record WorkspaceCard(long id, String name) {}

    @GetMapping
    List<WorkspaceCard> list(Principal user) {
        return members.findByUsernameOrderByIdAsc(user.getName()).stream()
                .map(member -> new WorkspaceCard(member.workspace.id, member.workspace.name))
                .toList();
    }
}

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/tasks")
@PreAuthorize("@workspaceAccess.isMember(#workspaceId, authentication.name)")
class WorkspaceTaskController {
    private final WorkspaceRepository workspaces;
    private final TaskRepository tasks;

    WorkspaceTaskController(WorkspaceRepository workspaces, TaskRepository tasks) {
        this.workspaces = workspaces;
        this.tasks = tasks;
    }

    record NewTask(@NotBlank @Size(max = 120) String title) {}
    record UpdatedTask(@NotBlank @Size(max = 120) String title, @NotNull Boolean done) {}
    record TaskCard(long id, String title, boolean done) {}

    @GetMapping
    public List<TaskCard> list(@PathVariable long workspaceId) {
        return tasks.findByWorkspace_IdOrderByIdAsc(workspaceId).stream().map(this::card).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskCard create(@PathVariable long workspaceId, @Valid @RequestBody NewTask input) {
        Workspace workspace = workspaces.findById(workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Espace introuvable."));
        return card(tasks.save(new TeamTask(workspace, input.title().trim())));
    }

    @PutMapping("/{taskId}")
    public TaskCard update(@PathVariable long workspaceId, @PathVariable long taskId, @Valid @RequestBody UpdatedTask input) {
        TeamTask task = tasks.findByIdAndWorkspace_Id(taskId, workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tâche introuvable dans cet espace."));
        task.title = input.title().trim();
        task.done = input.done();
        return card(tasks.save(task));
    }

    private TaskCard card(TeamTask task) {
        return new TaskCard(task.id, task.title, task.done);
    }
}

@Configuration
@Profile("!prod")
class WorkspaceDemoData {
    @Bean
    CommandLineRunner seedWorkspaces(WorkspaceRepository workspaces, MembershipRepository members,
            TaskRepository tasks, TransactionTemplate transactions) {
        return args -> transactions.executeWithoutResult(status -> {
            if (workspaces.count() != 0) return;
            Workspace frontend = workspaces.save(new Workspace(1, "Équipe Frontend"));
            Workspace backend = workspaces.save(new Workspace(2, "Équipe Backend"));
            members.save(new WorkspaceMembership(frontend, "alice"));
            members.save(new WorkspaceMembership(backend, "bob"));
            tasks.save(new TeamTask(frontend, "Relire l’interface"));
            tasks.save(new TeamTask(backend, "Documenter l’API"));
        });
    }
}
`,
      [`${springTest}/WorkspaceAccessTest.java`]: `package devafrica.atelier;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WorkspaceAccessTest {
    @Test
    void onlyMembersPass() {
        MembershipRepository repository = mock(MembershipRepository.class);
        when(repository.existsByWorkspace_IdAndUsername(1L, "alice")).thenReturn(true);
        WorkspaceAccess access = new WorkspaceAccess(repository);
        assertTrue(access.isMember(1L, "alice"));
        assertFalse(access.isMember(1L, "bob"));
        verify(repository).existsByWorkspace_IdAndUsername(1L, "bob");
    }
}
`,
      [`${springTest}/WorkspaceHttpTest.java`]: `package devafrica.atelier;

${httpTestImports}
@SpringBootTest(properties = "atelier.demo-password=DevAfrica-Local-42")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WorkspaceHttpTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void memberCanEditOnlyInsideOwnWorkspace() throws Exception {
        mvc.perform(get("/api/workspaces")).andExpect(status().isUnauthorized());
        String alice = bearer("alice");
        String bob = bearer("bob");
        mvc.perform(get("/api/workspaces").header("Authorization", alice))
                .andExpect(jsonPath("$.length()").value(1)).andExpect(jsonPath("$[0].id").value(1));
        String task = "{\\"title\\":\\"Relire la fiche\\",\\"done\\":true}";
        mvc.perform(put("/api/workspaces/1/tasks/1").header("Authorization", bob)
                .contentType("application/json").content(task)).andExpect(status().isForbidden());
        mvc.perform(put("/api/workspaces/1/tasks/2").header("Authorization", alice)
                .contentType("application/json").content(task)).andExpect(status().isNotFound());
        mvc.perform(put("/api/workspaces/1/tasks/1").header("Authorization", alice)
                .contentType("application/json").content(task)).andExpect(status().isOk())
                .andExpect(jsonPath("$.done").value(true));
    }

${testTokenMethod}}
`,
    },
    notes:
      demoTokenGuide +
      `
## Essayer les permissions

\`\`\`powershell
$bob = @{Authorization = "Bearer $(Atelier-Token 'bob')"}
Invoke-RestMethod -Uri "$base/workspaces" -Headers $alice
Invoke-RestMethod -Uri "$base/workspaces/1/tasks" -Headers $alice
Invoke-RestMethod -Uri "$base/workspaces/1/tasks/1" -Method Put -Headers $alice -ContentType 'application/json' -Body '{"title":"Relire le design","done":true}'
Invoke-RestMethod -Uri "$base/workspaces/1/tasks" -Headers $bob
\`\`\`

La dernière requête montre le statut 403. Avec Alice, essayer la tâche 2 dans
l’espace 1 renvoie 404, car elle appartient à l’espace 2.
`,
  }),
};

export const springAdvancedProjects: WebProject[] = [shop, teamwork];
