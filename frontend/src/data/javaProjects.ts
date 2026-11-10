import {
  consoleFiles,
  fxPath,
  fxResources,
  javafxFiles,
} from "./desktopAuthoring";
import type { WebProject } from "./webCourseTypes";

const taskModel = `final class Tache {
    private String titre;

    Tache(String titre) {
        setTitre(titre);
    }

    String getTitre() {
        return titre;
    }

    void setTitre(String nouveauTitre) {
        if (nouveauTitre == null || nouveauTitre.isBlank()) {
            throw new IllegalArgumentException("Une tâche doit avoir un titre.");
        }
        titre = nouveauTitre.strip();
    }
}
`;

const taskList = `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        ArrayList<Tache> taches = new ArrayList<>();
        try (Scanner input = new Scanner(System.in, "UTF-8")) {
            while (true) {
                System.out.println("1. Ajouter  2. Lister  3. Supprimer  0. Quitter");
                if (!input.hasNextLine()) return;
                String choix = input.nextLine().strip();
                if (choix.equals("0")) return;
                switch (choix) {
                    case "1" -> ajouter(input, taches);
                    case "2" -> afficher(taches);
                    case "3" -> supprimer(input, taches);
                    default -> System.out.println("Choix inconnu.");
                }
            }
        }
    }

    private static void ajouter(Scanner input, ArrayList<Tache> taches) {
        System.out.println("Titre de la tâche :");
        if (!input.hasNextLine()) return;
        String titre = input.nextLine();
        if (titre.isBlank()) {
            System.out.println("Titre vide.");
            return;
        }
        taches.add(new Tache(titre));
        System.out.println("Tâche ajoutée.");
    }

    private static void afficher(ArrayList<Tache> taches) {
        if (taches.isEmpty()) System.out.println("Aucune tâche.");
        for (int i = 0; i < taches.size(); i++) {
            System.out.println((i + 1) + ". " + taches.get(i).getTitre());
        }
    }

    private static void supprimer(Scanner input, ArrayList<Tache> taches) {
        System.out.println("Numéro de la tâche à supprimer :");
        if (!input.hasNextLine()) return;
        try {
            int numero = Integer.parseInt(input.nextLine().strip());
            if (numero < 1 || numero > taches.size()) {
                System.out.println("Numéro hors de la liste.");
                return;
            }
            taches.remove(numero - 1);
            System.out.println("Tâche supprimée.");
        } catch (NumberFormatException error) {
            System.out.println("Entre un numéro entier.");
        }
    }
}
`;

const currency = `package devafrica.atelier;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class Conversion {
    private static final BigDecimal TAUX_EXERCICE = new BigDecimal("5000");

    private Conversion() {}

    public static BigDecimal enAriary(String saisie) {
        String texte = saisie.strip();
        if (!texte.matches("[0-9]{1,9}([,.][0-9]{1,4})?")) {
            throw new NumberFormatException("Montant décimal attendu.");
        }
        BigDecimal euros = new BigDecimal(texte.replace(',', '.'));
        return euros.multiply(TAUX_EXERCICE).setScale(0, RoundingMode.HALF_UP);
    }
}
`;

const converterWindow = `package devafrica.atelier;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage stage) {
        Label intro = new Label("Taux d’exercice fixe · 1 EUR = 5 000 Ar");
        Label label = new Label("Montant en euros");
        TextField montant = new TextField();
        montant.setPromptText("Ex. 12,50");
        label.setLabelFor(montant);
        Button convertir = new Button("Convertir");
        convertir.setDefaultButton(true);
        Label resultat = new Label("Le résultat s’affichera ici.");

        convertir.setOnAction(event -> {
            try {
                resultat.setText(Conversion.enAriary(montant.getText()).toPlainString() + " Ar");
                resultat.setStyle("-fx-text-fill: #155d46;");
            } catch (NumberFormatException error) {
                resultat.setText("Entre un montant décimal positif, par exemple 12,50.");
                resultat.setStyle("-fx-text-fill: #942b36;");
            }
        });

        VBox contenu = new VBox(12, intro, label, montant, convertir, resultat);
        contenu.setPadding(new Insets(24));
        resultat.setWrapText(true);
        stage.setTitle("Convertisseur JavaFX");
        stage.setScene(new Scene(contenu, 440, 245));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
`;

const contactsEntry = `package devafrica.atelier;

import java.io.IOException;
import java.util.Objects;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader loader = new FXMLLoader(Objects.requireNonNull(
            Main.class.getResource("contacts.fxml"), "contacts.fxml introuvable"));
        stage.setTitle("Carnet de contacts DevAfrica");
        stage.setScene(new Scene(loader.load(), 710, 440));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
`;

const contactModel = `package devafrica.atelier;

public record Contact(String nom, String telephone, String email) {
    @Override
    public String toString() {
        return nom;
    }
}
`;

const contactsController = String.raw`package devafrica.atelier;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;

public class ContactsController {
    @FXML private ListView<Contact> contactsView;
    @FXML private TextField nom;
    @FXML private TextField telephone;
    @FXML private TextField email;
    @FXML private Label statut;
    @FXML private Label details;

    private final ObservableList<Contact> contacts = FXCollections.observableArrayList();

    @FXML
    private void initialize() {
        contactsView.setItems(contacts);
        contactsView.getSelectionModel().selectedItemProperty().addListener(
            (observable, precedent, contact) -> {
                if (contact == null) {
                    details.setText("Sélectionne un contact pour voir ses coordonnées.");
                } else {
                    details.setText(contact.nom() + "\n" + contact.telephone() + "\n" + contact.email());
                }
            }
        );
    }

    @FXML
    private void enregistrer() {
        String nomSaisi = nom.getText().strip();
        String telSaisi = telephone.getText().strip();
        String emailSaisi = email.getText().strip();
        if (nomSaisi.isEmpty() || nomSaisi.length() > 100) {
            statut.setText("Saisis un nom de 1 à 100 caractères.");
            nom.requestFocus();
            return;
        }
        if (!telSaisi.matches("[+0-9 ()-]{5,30}") || telSaisi.replaceAll("[^0-9]", "").length() < 5) {
            statut.setText("Saisis un numéro de téléphone avec au moins cinq chiffres.");
            telephone.requestFocus();
            return;
        }
        if (emailSaisi.length() > 254 || !emailSaisi.matches("[^@\\s]+@[^@\\s]+\\.[^@\\s]+")) {
            statut.setText("Saisis une adresse e-mail valide.");
            email.requestFocus();
            return;
        }

        Contact contact = new Contact(nomSaisi, telSaisi, emailSaisi);
        contacts.add(contact);
        contactsView.getSelectionModel().select(contact);
        contactsView.scrollTo(contact);
        nom.clear();
        telephone.clear();
        email.clear();
        statut.setText(contacts.size() + " contact(s) enregistré(s) pour cette session.");
        nom.requestFocus();
    }
}
`;

const contactsForm = `<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.geometry.Insets?>
<?import javafx.scene.control.Button?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.control.ListView?>
<?import javafx.scene.control.SplitPane?>
<?import javafx.scene.control.TextField?>
<?import javafx.scene.layout.VBox?>

<VBox xmlns="http://javafx.com/javafx/21" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="devafrica.atelier.ContactsController" spacing="14" stylesheets="@atelier.css">
  <padding><Insets top="18" right="18" bottom="18" left="18"/></padding>
  <Label text="Carnet de contacts" styleClass="heading"/>
  <SplitPane dividerPositions="0.36" VBox.vgrow="ALWAYS">
    <VBox spacing="10" minWidth="135">
      <padding><Insets top="12" right="12" bottom="12" left="12"/></padding>
      <Label text="Contacts"/>
      <ListView fx:id="contactsView" VBox.vgrow="ALWAYS"/>
    </VBox>
    <VBox spacing="9" minWidth="260">
      <padding><Insets top="12" right="12" bottom="12" left="12"/></padding>
      <Label text="Nouveau contact" styleClass="heading"/>
      <TextField fx:id="nom" promptText="Nom" accessibleText="Nom"/>
      <TextField fx:id="telephone" promptText="Téléphone" accessibleText="Téléphone"/>
      <TextField fx:id="email" promptText="Email" accessibleText="Email"/>
      <Button text="Enregistrer" onAction="#enregistrer" defaultButton="true"/>
      <Label fx:id="statut" wrapText="true" styleClass="status" text="Ajoute un contact."/>
      <Label fx:id="details" wrapText="true" text="Sélectionne un contact pour voir ses coordonnées."/>
    </VBox>
  </SplitPane>
</VBox>
`;

const contactStyles = `.root {
    -fx-background-color: #edf5fc;
    -fx-font-size: 14px;
}
.heading {
    -fx-text-fill: #153a5d;
    -fx-font-size: 19px;
    -fx-font-weight: bold;
}
.button {
    -fx-background-color: #185d99;
    -fx-text-fill: white;
    -fx-padding: 8px 16px;
}
.status {
    -fx-text-fill: #245778;
}
`;

export const javaTasks: WebProject = {
  id: "taches-console-java",
  title: "Le gestionnaire de tâches en console",
  description:
    "Utilise Scanner, ArrayList et une classe Tache pour gérer une liste.",
  minutes: 90,
  requirements: [
    "Ajoute deux tâches et affiche-les dans l’ordre.",
    "Supprime une tâche en saisissant le numéro visible.",
    "Vérifie que les choix inconnus et numéros invalides affichent un message.",
  ],
  hints: [
    "Le menu lit une ligne complète avec Scanner.",
    "Le premier numéro visible vaut 1. L’index de la première tâche vaut 0.",
    "Chaque ajout construit une instance de Tache. Le titre passe par le setter.",
  ],
  files: consoleFiles("java", taskList, {
    stdin: "1\nLire une leçon\n1\nTester Java\n2\n3\n1\n2\n0\n",
    extra: { "Tache.java": taskModel },
  }),
};

export const fxConverter: WebProject = {
  id: "convertisseur-javafx",
  title: "Le convertisseur de devises JavaFX",
  description: "Valide une saisie puis actualise le résultat avec une lambda.",
  minutes: 100,
  requirements: [
    "Affiche un champ de montant, un bouton et un résultat.",
    "Saisis 12,50 et vérifie le résultat de 62 500 Ar au taux d’exercice.",
    "Saisis des lettres et vérifie que la fenêtre reste utilisable.",
  ],
  hints: [
    "Le taux de 5 000 Ar par euro est une valeur fixe pour l’exercice.",
    "BigDecimal effectue le calcul décimal. Conversion sépare ce calcul de l’interface.",
    "setOnAction reçoit une lambda qui appelle la conversion dans un bloc try/catch.",
  ],
  files: javafxFiles(
    "Convertisseur JavaFX",
    "convertisseur",
    converterWindow,
    "Entre 12,50 et clique sur Convertir. Essaie ensuite une valeur invalide. Le taux est une valeur pédagogique fixe.",
    { [`${fxPath}/Conversion.java`]: currency },
  ),
};

export const fxContacts: WebProject = {
  id: "contacts-javafx-fxml",
  title: "Le carnet de contacts avec Scene Builder",
  description:
    "Sépare la mise en page FXML, la classe Contact et le contrôleur JavaFX.",
  minutes: 150,
  requirements: [
    "Ouvre contacts.fxml dans Scene Builder et repère les fx:id.",
    "Enregistre deux contacts et vérifie qu’ils apparaissent dans la liste.",
    "Sélectionne un contact et vérifie l’affichage de ses coordonnées.",
    "Teste un email invalide et redimensionne la fenêtre.",
  ],
  hints: [
    "fx:controller désigne ContactsController. fx:id et @FXML relient les champs.",
    "Le bouton appelle enregistrer grâce à onAction.",
    "ObservableList alimente la ListView et signale chaque ajout.",
  ],
  files: javafxFiles(
    "Carnet de contacts JavaFX",
    "contacts",
    contactsEntry,
    "Ouvre src/main/resources/devafrica/atelier/contacts.fxml dans Scene Builder. Déplace un élément, sauvegarde et relance Maven. Les données de démonstration vivent pendant la session.",
    {
      [`${fxPath}/Contact.java`]: contactModel,
      [`${fxPath}/ContactsController.java`]: contactsController,
      [`${fxResources}/contacts.fxml`]: contactsForm,
      [`${fxResources}/atelier.css`]: contactStyles,
    },
    true,
  ),
};
