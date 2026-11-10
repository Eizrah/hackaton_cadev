import { sqlFiles } from "./scriptAuthoring";
import type { WebProject } from "./webCourseTypes";

export const contactsSchema = `CREATE TABLE contacts (
    id INTEGER PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT NOT NULL,
    email TEXT UNIQUE
);
INSERT INTO contacts VALUES
(1, 'Rakoto', 'Tiana', '034 12 345 67', 'tiana@example.com'),
(2, 'Rabe', 'Soa', '032 44 555 66', 'soa@example.com'),
(3, 'Diallo', 'Amina', '+221 77 123 45 67', 'amina@example.com'),
(4, 'Ranaivo', 'Hery', '033 11 222 33', NULL),
(5, 'Mensah', 'Kofi', '+233 24 111 22 33', 'kofi@example.com');`;
export const ordersSchema = `CREATE TABLE clients (
    id INTEGER PRIMARY KEY,
    nom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);
CREATE TABLE commandes (
    id INTEGER PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    montant_centimes INTEGER NOT NULL CHECK (montant_centimes >= 0),
    date_commande TEXT NOT NULL
);
INSERT INTO clients VALUES (1, 'Tiana', 'tiana@example.com'), (2, 'Amina', 'amina@example.com'), (3, 'Soa', 'soa@example.com');
INSERT INTO commandes VALUES (1, 1, 25000, '2026-11-01'), (2, 1, 12000, '2026-11-03'), (3, 2, 40000, '2026-11-05');`;
export const salesSchema = `CREATE TABLE produits (
    id INTEGER PRIMARY KEY,
    nom TEXT NOT NULL,
    categorie TEXT NOT NULL,
    prix_centimes INTEGER NOT NULL CHECK (prix_centimes >= 0)
);
CREATE TABLE ventes (
    id INTEGER PRIMARY KEY,
    produit_id INTEGER NOT NULL REFERENCES produits(id),
    quantite INTEGER NOT NULL CHECK (quantite > 0)
);
INSERT INTO produits VALUES (1, 'Clavier', 'Accessoires', 5000), (2, 'Souris', 'Accessoires', 2500), (3, 'Tablette', 'Équipement', 40000), (4, 'Stylet', 'Création', 2000);
INSERT INTO ventes VALUES (1, 1, 20), (2, 2, 20), (3, 3, 4), (4, 4, 5);`;
export const sqlContacts: WebProject = {
  id: "repertoire-sql",
  title: "Le répertoire téléphonique",
  description: "Crée cinq contacts puis filtre et trie les noms.",
  minutes: 60,
  requirements: [
    "Définir une clé primaire et les champs des contacts.",
    "Insérer cinq contacts.",
    "Sélectionner les noms commençant par R avec LIKE.",
    "Trier par nom puis prénom.",
  ],
  hints: [
    "Le joker % accepte une suite de caractères.",
    "Regarde Tables pour vérifier les colonnes disponibles.",
  ],
  files: sqlFiles(
    contactsSchema,
    "SELECT nom, prenom, telephone\nFROM contacts\nWHERE nom LIKE 'R%'\nORDER BY nom, prenom;",
  ),
};
export const sqlOrders: WebProject = {
  id: "commandes-sql",
  title: "Le système de commandes",
  description: "Relie chaque commande à son client puis explore les jointures.",
  minutes: 90,
  requirements: [
    "Créer clients et commandes avec une clé étrangère.",
    "Insérer plusieurs commandes pour un même client.",
    "Afficher le numéro, le nom et l’email associés à chaque commande.",
    "Comparer INNER JOIN et LEFT JOIN avec un client sans commande.",
  ],
  hints: [
    "Les alias rendent les noms de colonnes plus courts.",
    "La condition ON décrit la relation entre les deux tables.",
  ],
  files: sqlFiles(
    ordersSchema,
    "SELECT c.id AS commande, cl.nom, cl.email, c.montant_centimes / 100.0 AS euros\nFROM commandes AS c\nINNER JOIN clients AS cl ON cl.id = c.client_id\nORDER BY c.id;",
  ),
};
export const sqlSales: WebProject = {
  id: "rapport-ventes-sql",
  title: "Le rapport statistique du magasin",
  description:
    "Calcule le chiffre d’affaires par catégorie avec un seuil et un classement.",
  minutes: 120,
  requirements: [
    "Joindre les produits aux ventes.",
    "Additionner prix × quantité par catégorie.",
    "Afficher seulement les catégories dépassant 1 000 euros.",
    "Classer du chiffre d’affaires le plus grand au plus petit.",
    "Créer un index puis consulter le plan d’exécution.",
  ],
  hints: [
    "Stocke les prix en centimes et divise par 100.0 pour la présentation.",
    "WHERE filtre les lignes et HAVING filtre les groupes.",
    "Un index est choisi selon le plan et les données.",
  ],
  files: sqlFiles(
    salesSchema,
    "SELECT p.categorie, SUM(p.prix_centimes * v.quantite) / 100.0 AS chiffre_affaires_euros\nFROM produits AS p\nINNER JOIN ventes AS v ON v.produit_id = p.id\nGROUP BY p.categorie\nHAVING SUM(p.prix_centimes * v.quantite) > 100000\nORDER BY chiffre_affaires_euros DESC;",
  ),
};
