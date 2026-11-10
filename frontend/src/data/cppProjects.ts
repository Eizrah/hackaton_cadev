import { consoleFiles, qtFiles } from "./desktopAuthoring";
import type { WebProject } from "./webCourseTypes";

const accountHeader = `#ifndef COMPTE_HPP
#define COMPTE_HPP

#include <limits>
#include <string>
#include <utility>

class CompteBancaire {
public:
    explicit CompteBancaire(std::string nom) : titulaire_(std::move(nom)) {}

    const std::string& titulaire() const { return titulaire_; }
    long long solde() const { return solde_; }

    bool deposer(long long montant) {
        if (montant <= 0 || montant > std::numeric_limits<long long>::max() - solde_) return false;
        solde_ += montant;
        return true;
    }

    bool retirer(long long montant) {
        if (montant <= 0 || montant > solde_) return false;
        solde_ -= montant;
        return true;
    }

private:
    std::string titulaire_;
    long long solde_ = 0;
};

#endif
`;

const bank = String.raw`#include <iostream>
#include <string>
#include "compte.hpp"

int main() {
    std::string nom;
    std::cout << "Nom du titulaire : ";
    if (!std::getline(std::cin, nom) || nom.empty()) {
        std::cerr << "Entre un nom.\n";
        return 1;
    }
    CompteBancaire compte(nom);

    while (true) {
        std::cout << "1. Déposer  2. Retirer  3. Solde  0. Quitter\n";
        int choix;
        if (!(std::cin >> choix) || choix == 0) break;
        if (choix == 3) {
            std::cout << compte.titulaire() << " possède " << compte.solde() << " Ar.\n";
        } else if (choix == 1 || choix == 2) {
            long long montant;
            std::cout << "Montant en ariary : ";
            if (!(std::cin >> montant)) {
                std::cerr << "Entre un montant entier.\n";
                return 1;
            }
            bool ok = choix == 1 ? compte.deposer(montant) : compte.retirer(montant);
            std::cout << (ok ? "Opération acceptée." : "Montant ou solde insuffisant.") << '\n';
        } else {
            std::cout << "Choix inconnu.\n";
        }
    }
}
`;

const qtProgress = `#include <QApplication>
#include <QLabel>
#include <QMainWindow>
#include <QProgressBar>
#include <QPushButton>
#include <QVBoxLayout>
#include <algorithm>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    QMainWindow window;
    window.setWindowTitle("Progression DevAfrica");
    window.resize(460, 230);

    auto *central = new QWidget;
    auto *column = new QVBoxLayout(central);
    column->setContentsMargins(24, 24, 24, 24);
    auto *label = new QLabel("Prêt à commencer");
    auto *progress = new QProgressBar;
    progress->setRange(0, 100);
    progress->setValue(0);
    auto *button = new QPushButton("Avancer de 10 %");

    column->addWidget(label);
    column->addWidget(progress);
    column->addWidget(button);
    window.setCentralWidget(central);

    QObject::connect(button, &QPushButton::clicked, &window, [progress, label, button] {
        int next = std::min(progress->value() + 10, progress->maximum());
        progress->setValue(next);
        if (next == progress->maximum()) {
            label->setText("Terminé !");
            label->setStyleSheet("color: #176c4a; font-weight: bold;");
            button->setEnabled(false);
        } else {
            label->setText(QString("Progression : %1 %").arg(next));
        }
    });

    window.show();
    return app.exec();
}
`;

const employee = `#ifndef EMPLOYE_HPP
#define EMPLOYE_HPP

#include <string>
#include <utility>

class Employe {
public:
    Employe(std::string nom, std::string role)
        : nom_(std::move(nom)), role_(std::move(role)) {}

    const std::string& nom() const { return nom_; }
    const std::string& role() const { return role_; }

private:
    std::string nom_;
    std::string role_;
};

#endif
`;

const qtEmployeeManager = `#include <QApplication>
#include <QHeaderView>
#include <QMainWindow>
#include <QTableWidgetItem>
#include <vector>
#include "employe.hpp"
#include "ui_fenetre.h"

class Fenetre final : public QMainWindow {
public:
    Fenetre() {
        ui.setupUi(this);
        ui.tableEmployees->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
        ui.tableEmployees->setEditTriggers(QAbstractItemView::NoEditTriggers);
        connect(ui.addButton, &QPushButton::clicked, this, &Fenetre::ajouterEmploye);
        connect(ui.nameEdit, &QLineEdit::returnPressed, this, &Fenetre::ajouterEmploye);
    }

private:
    void ajouterEmploye() {
        const QString nom = ui.nameEdit->text().trimmed();
        if (nom.isEmpty()) {
            ui.statusLabel->setText("Saisis le nom de l’employé.");
            ui.nameEdit->setFocus();
            return;
        }

        employes.emplace_back(nom.toStdString(), ui.roleBox->currentText().toStdString());
        const Employe& employe = employes.back();
        const int row = ui.tableEmployees->rowCount();
        ui.tableEmployees->insertRow(row);
        ui.tableEmployees->setItem(row, 0, new QTableWidgetItem(QString::fromStdString(employe.nom())));
        ui.tableEmployees->setItem(row, 1, new QTableWidgetItem(QString::fromStdString(employe.role())));
        ui.statusLabel->setText(QString("%1 profil(s) ajouté(s)").arg(row + 1));
        ui.nameEdit->clear();
        ui.nameEdit->setFocus();
    }

    Ui::Fenetre ui;
    std::vector<Employe> employes;
};

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    Fenetre window;
    window.resize(660, 440);
    window.show();
    return app.exec();
}
`;

const employeeForm = `<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>Fenetre</class>
 <widget class="QMainWindow" name="Fenetre">
  <property name="windowTitle"><string>Profils d’employés</string></property>
  <widget class="QWidget" name="centralWidget">
   <layout class="QVBoxLayout" name="page">
    <property name="leftMargin"><number>18</number></property>
    <property name="topMargin"><number>18</number></property>
    <property name="rightMargin"><number>18</number></property>
    <property name="bottomMargin"><number>18</number></property>
    <property name="spacing"><number>12</number></property>
    <item><widget class="QLabel" name="intro"><property name="text"><string>Ajoute les profils de ton équipe.</string></property></widget></item>
    <item>
     <layout class="QHBoxLayout" name="formulaire">
      <item><widget class="QLabel" name="nameLabel">
       <property name="text"><string>Nom</string></property>
       <property name="buddy"><cstring>nameEdit</cstring></property>
      </widget></item>
      <item><widget class="QLineEdit" name="nameEdit">
       <property name="maxLength"><number>100</number></property>
       <property name="placeholderText"><string>Ex. Soa Rakoto</string></property>
      </widget></item>
      <item><widget class="QLabel" name="roleLabel">
       <property name="text"><string>Rôle</string></property>
       <property name="buddy"><cstring>roleBox</cstring></property>
      </widget></item>
      <item><widget class="QComboBox" name="roleBox">
       <item><property name="text"><string>Développement</string></property></item>
       <item><property name="text"><string>Design</string></property></item>
       <item><property name="text"><string>Support</string></property></item>
      </widget></item>
      <item><widget class="QPushButton" name="addButton"><property name="text"><string>Ajouter</string></property></widget></item>
     </layout>
    </item>
    <item><widget class="QTableWidget" name="tableEmployees">
     <column><property name="text"><string>Nom</string></property></column>
     <column><property name="text"><string>Rôle</string></property></column>
    </widget></item>
    <item><widget class="QLabel" name="statusLabel"><property name="text"><string>Aucun profil.</string></property></widget></item>
   </layout>
  </widget>
 </widget>
 <resources/>
 <connections/>
</ui>
`;

export const cppBank: WebProject = {
  id: "compte-console-cpp",
  title: "Le simulateur de compte en console",
  description:
    "Crée un compte qui contrôle ses dépôts et retraits puis affiche son solde.",
  minutes: 90,
  requirements: [
    "Crée une instance de CompteBancaire et affiche le nom de son titulaire.",
    "Effectue un dépôt et un retrait, puis consulte le solde.",
    "Vérifie que les montants négatifs et les retraits trop élevés sont refusés.",
  ],
  hints: [
    "Les montants fictifs sont des entiers en ariary.",
    "Le solde est private. Les méthodes publiques contrôlent les changements.",
    "Les valeurs par défaut créent le compte de Soa, déposent 25 000 Ar puis retirent 3 000 Ar.",
  ],
  files: consoleFiles("cpp", bank, {
    stdin: "Soa\n1\n25000\n2\n3000\n3\n0\n",
    extra: { "compte.hpp": accountHeader },
  }),
};

export const qtProgressProject: WebProject = {
  id: "progression-qt",
  title: "La barre de progression Qt",
  description: "Relie le signal d’un bouton à une action qui avance une barre.",
  minutes: 105,
  requirements: [
    "Affiche une barre de progression initialisée à zéro.",
    "Incrémente la barre de 10 % à chaque clic.",
    "Passe le texte en vert et désactive le bouton à 100 %.",
  ],
  hints: [
    "QMainWindow héberge un QWidget qui reçoit le QVBoxLayout.",
    "QObject::connect relie clicked à une lambda.",
    "Le contexte &window lie la connexion à la durée de vie de la fenêtre.",
  ],
  files: qtFiles(
    "Barre de progression Qt",
    qtProgress,
    "Clique dix fois sur Avancer de 10 %. Le texte devient vert et indique Terminé.",
  ),
};

export const qtEmployees: WebProject = {
  id: "profils-qt-designer",
  title: "Le gestionnaire de profils avec Qt Designer",
  description:
    "Utilise un formulaire .ui et ajoute des objets Employe dans un tableau.",
  minutes: 145,
  requirements: [
    "Ouvre fenetre.ui dans Qt Designer et repère les layouts du formulaire.",
    "Saisis un nom, choisis un rôle et ajoute deux employés au tableau.",
    "Vérifie la validation d’un nom vide et redimensionne la fenêtre.",
    "Relie l’instance Employe à la ligne affichée dans QTableWidget.",
  ],
  hints: [
    "Qt génère ui_fenetre.h à partir de fenetre.ui pendant la compilation.",
    "La classe Employe conserve les données séparément de la fenêtre.",
    "Les identifiants de widgets dans Qt Designer correspondent aux noms dans ui.",
  ],
  files: qtFiles(
    "Profils d’employés avec Qt Designer",
    qtEmployeeManager,
    "Ouvre fenetre.ui dans l’onglet Design de Qt Creator ou dans Qt Designer. Ajuste l’espacement du formulaire et recompile. Les profils sont conservés pendant la session.",
    { "fenetre.ui": employeeForm, "employe.hpp": employee },
  ),
};
