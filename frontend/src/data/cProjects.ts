import { consoleFiles, gtkFiles } from "./desktopAuthoring";
import type { WebProject } from "./webCourseTypes";

const calculator = String.raw`#include <stdio.h>

int main(void) {
    double a, b, result;
    int operation;

    puts("Entre deux nombres (exemple : 12 3).");
    if (scanf("%lf %lf", &a, &b) != 2) {
        fputs("Deux nombres sont attendus.\n", stderr);
        return 1;
    }

    puts("1. Addition  2. Soustraction  3. Multiplication  4. Division");
    if (scanf("%d", &operation) != 1) {
        fputs("Choix invalide.\n", stderr);
        return 1;
    }

    switch (operation) {
        case 1: result = a + b; break;
        case 2: result = a - b; break;
        case 3: result = a * b; break;
        case 4:
            if (b == 0.0) {
                fputs("La division par zéro est impossible.\n", stderr);
                return 1;
            }
            result = a / b;
            break;
        default:
            fputs("Choisis une opération de 1 à 4.\n", stderr);
            return 1;
    }

    printf("Résultat : %.2f\n", result);
    return 0;
}
`;

const guessingGame = String.raw`#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    srand((unsigned)time(NULL));
    const int secret = rand() % 100 + 1;
    int attempts = 0;
    int guess;

    puts("Devine le nombre entre 1 et 100.");
    while (scanf("%d", &guess) == 1) {
        if (guess < 1 || guess > 100) {
            puts("Entre un entier entre 1 et 100.");
            continue;
        }
        attempts++;
        if (guess == secret) {
            printf("Trouvé en %d essai(s) !\n", attempts);
            return 0;
        }
        puts(guess < secret ? "C’est plus." : "C’est moins.");
    }
    printf("Partie terminée. Le nombre mystère était %d.\n", secret);
    return 0;
}
`;

const clicker = String.raw`#include <gtk/gtk.h>

typedef struct {
    unsigned int score;
    GtkLabel *label;
} Clicker;

static void increment_score(GtkButton *button, gpointer user_data) {
    (void)button;
    Clicker *state = user_data;
    char text[48];

    if (state->score < G_MAXUINT) state->score++;
    g_snprintf(text, sizeof text, "Score : %u", state->score);
    gtk_label_set_text(state->label, text);
}

static void activate(GtkApplication *application, gpointer unused) {
    (void)unused;
    GtkWidget *window = gtk_application_window_new(application);
    gtk_window_set_title(GTK_WINDOW(window), "Clicker DevAfrica");
    gtk_window_set_default_size(GTK_WINDOW(window), 400, 220);

    GtkWidget *column = gtk_box_new(GTK_ORIENTATION_VERTICAL, 16);
    gtk_widget_set_margin_top(column, 24);
    gtk_widget_set_margin_bottom(column, 24);
    gtk_widget_set_margin_start(column, 24);
    gtk_widget_set_margin_end(column, 24);

    GtkWidget *label = gtk_label_new("Score : 0");
    GtkWidget *button = gtk_button_new_with_label("Ajouter un point");
    gtk_box_append(GTK_BOX(column), label);
    gtk_box_append(GTK_BOX(column), button);
    gtk_window_set_child(GTK_WINDOW(window), column);

    Clicker *state = g_new0(Clicker, 1);
    state->label = GTK_LABEL(label);
    g_object_set_data_full(G_OBJECT(window), "clicker-state", state, g_free);
    g_signal_connect(button, "clicked", G_CALLBACK(increment_score), state);
    gtk_window_present(GTK_WINDOW(window));
}

int main(int argc, char **argv) {
    GtkApplication *application = gtk_application_new("org.devafrica.clicker", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(application, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(application), argc, argv);
    g_object_unref(application);
    return status;
}
`;

const notepad = String.raw`#include <gtk/gtk.h>

typedef struct {
    GtkTextBuffer *buffer;
    GtkLabel *status;
} Notepad;

static void update_count(GtkButton *button, gpointer user_data) {
    (void)button;
    Notepad *editor = user_data;
    GtkTextIter start, end;
    gtk_text_buffer_get_bounds(editor->buffer, &start, &end);

    /* GTK alloue la chaîne renvoyée. g_free libère cette mémoire. */
    char *text = gtk_text_buffer_get_text(editor->buffer, &start, &end, FALSE);
    glong length = g_utf8_strlen(text, -1);
    g_free(text);

    char count[64];
    g_snprintf(count, sizeof count, "%ld caractère(s) Unicode", (long)length);
    gtk_label_set_text(editor->status, count);
}

static void clear_text(GtkButton *button, gpointer user_data) {
    Notepad *editor = user_data;
    gtk_text_buffer_set_text(editor->buffer, "", -1);
    update_count(button, user_data);
}

static void rename_window(GtkEditable *entry, gpointer user_data) {
    GtkWindow *window = GTK_WINDOW(user_data);
    const char *title = gtk_editable_get_text(entry);
    gtk_window_set_title(window, *title ? title : "Bloc-notes DevAfrica");
}

static void activate(GtkApplication *application, gpointer unused) {
    (void)unused;
    GtkWidget *window = gtk_application_window_new(application);
    gtk_window_set_title(GTK_WINDOW(window), "Bloc-notes DevAfrica");
    gtk_window_set_default_size(GTK_WINDOW(window), 680, 460);

    GtkWidget *grid = gtk_grid_new();
    gtk_grid_set_row_spacing(GTK_GRID(grid), 12);
    gtk_widget_set_margin_top(grid, 16);
    gtk_widget_set_margin_bottom(grid, 16);
    gtk_widget_set_margin_start(grid, 16);
    gtk_widget_set_margin_end(grid, 16);

    GtkWidget *title = gtk_entry_new();
    gtk_entry_set_placeholder_text(GTK_ENTRY(title), "Titre de la note");
    gtk_entry_set_max_length(GTK_ENTRY(title), 100);
    gtk_widget_set_hexpand(title, TRUE);
    g_signal_connect(title, "changed", G_CALLBACK(rename_window), window);

    GtkWidget *actions = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 8);
    GtkWidget *count_button = gtk_button_new_with_label("Compter");
    GtkWidget *clear_button = gtk_button_new_with_label("Effacer");
    gtk_box_append(GTK_BOX(actions), count_button);
    gtk_box_append(GTK_BOX(actions), clear_button);

    GtkWidget *text_view = gtk_text_view_new();
    gtk_text_view_set_wrap_mode(GTK_TEXT_VIEW(text_view), GTK_WRAP_WORD_CHAR);
    gtk_text_view_set_top_margin(GTK_TEXT_VIEW(text_view), 8);
    gtk_text_view_set_left_margin(GTK_TEXT_VIEW(text_view), 8);
    GtkWidget *scroll = gtk_scrolled_window_new();
    gtk_widget_set_hexpand(scroll, TRUE);
    gtk_widget_set_vexpand(scroll, TRUE);
    gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scroll), text_view);
    GtkWidget *status = gtk_label_new("0 caractère(s) Unicode");
    gtk_label_set_xalign(GTK_LABEL(status), 0.0f);

    gtk_grid_attach(GTK_GRID(grid), title, 0, 0, 1, 1);
    gtk_grid_attach(GTK_GRID(grid), actions, 0, 1, 1, 1);
    gtk_grid_attach(GTK_GRID(grid), scroll, 0, 2, 1, 1);
    gtk_grid_attach(GTK_GRID(grid), status, 0, 3, 1, 1);
    gtk_window_set_child(GTK_WINDOW(window), grid);

    Notepad *editor = g_new0(Notepad, 1);
    editor->buffer = gtk_text_view_get_buffer(GTK_TEXT_VIEW(text_view));
    editor->status = GTK_LABEL(status);
    g_object_set_data_full(G_OBJECT(window), "notepad-state", editor, g_free);
    g_signal_connect(count_button, "clicked", G_CALLBACK(update_count), editor);
    g_signal_connect(clear_button, "clicked", G_CALLBACK(clear_text), editor);
    gtk_window_present(GTK_WINDOW(window));
}

int main(int argc, char **argv) {
    GtkApplication *application = gtk_application_new("org.devafrica.blocnotes", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(application, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(application), argc, argv);
    g_object_unref(application);
    return status;
}
`;

export const cCalculator: WebProject = {
  id: "calculatrice-c",
  title: "La calculatrice en console",
  description: "Lis deux nombres et choisis une opération avec switch.",
  minutes: 70,
  requirements: [
    "Teste les quatre opérations avec deux valeurs.",
    "Affiche un résultat à deux décimales.",
    "Vérifie les messages en cas de division par zéro ou de saisie invalide.",
  ],
  hints: [
    "Entre les deux nombres, puis le numéro du menu dans l’entrée standard.",
    "scanf renvoie le nombre de valeurs lues. Contrôle-le avant le calcul.",
    "Ajoute un break pour arrêter chaque branche du switch.",
  ],
  files: consoleFiles("c", calculator, { stdin: "12 3\n4\n" }),
};

export const cGuessing: WebProject = {
  id: "plus-ou-moins-c",
  title: "Le jeu du plus ou moins",
  description:
    "Utilise une boucle et des comparaisons pour retrouver un nombre mystère.",
  minutes: 80,
  requirements: [
    "Génère un entier entre 1 et 100.",
    "Donne un indice après chaque tentative valide.",
    "Arrête la partie si le nombre est trouvé ou si les valeurs d’entrée sont épuisées.",
  ],
  hints: [
    "Dans l’éditeur, saisis plusieurs tentatives sur des lignes séparées avant l’exécution.",
    "Vérifie le retour de scanf à chaque tour. Le terminal local permet de jouer en répondant après chaque indice.",
    "Le nombre secret change selon l’heure. Essaie les 100 valeurs pour vérifier qu’une partie peut être gagnée.",
  ],
  files: consoleFiles("c", guessingGame, { stdin: "1\n100\n50\n25\n75\n" }),
};

export const gtkClicker: WebProject = {
  id: "clicker-gtk",
  title: "Le compteur graphique GTK",
  description: "Crée une fenêtre qui met à jour un score à chaque clic.",
  minutes: 100,
  requirements: [
    "Affiche un score initial de zéro dans un GtkLabel.",
    "Connecte le signal clicked à une fonction C.",
    "Clique trois fois et retrouve le score 3 dans la fenêtre.",
  ],
  hints: [
    "Le pointeur Clicker réunit le score et le label.",
    "Le signal transmet ce pointeur au callback.",
    "g_object_set_data_full rattache la libération du bloc à la fenêtre.",
  ],
  files: gtkFiles(
    "Compteur graphique GTK",
    clicker,
    "Clique trois fois sur Ajouter un point. Redimensionne la fenêtre et vérifie que le texte et le bouton restent visibles.",
  ),
};

export const gtkNotepad: WebProject = {
  id: "bloc-notes-gtk",
  title: "Le bloc-notes graphique GTK",
  description:
    "Organise une zone d’écriture, une barre d’actions et un compteur Unicode.",
  minutes: 140,
  requirements: [
    "Place le titre, les commandes et la zone multiligne dans un GtkGrid.",
    "Écris « été » et vérifie que le bouton Compter affiche trois caractères.",
    "Efface la note et vérifie le retour à zéro.",
    "Redimensionne la fenêtre et vérifie que la zone de texte s’adapte.",
  ],
  hints: [
    "GtkEntry modifie le titre. GtkTextView conserve le corps dans son buffer.",
    "gtk_text_buffer_get_text crée une chaîne. Libère-la avec g_free après le comptage.",
    "g_utf8_strlen compte les points de code UTF-8. strlen compterait les octets.",
  ],
  files: gtkFiles(
    "Bloc-notes GTK",
    notepad,
    "Donne un titre à la note, écris « été », clique sur Compter puis sur Effacer. Le bouton Effacer remet le contenu à zéro.",
  ),
};
