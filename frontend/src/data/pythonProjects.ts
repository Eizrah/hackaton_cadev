import { consoleFiles } from "./desktopAuthoring";
import { scriptGuiFiles } from "./scriptAuthoring";
import type { WebProject } from "./webCourseTypes";

const notes = `import math


def lire_notes():
    notes = []
    print("Entre des notes de 0 à 20, puis fin.")
    while True:
        try:
            texte = input().strip()
        except EOFError:
            break
        if texte.casefold() == "fin":
            break
        try:
            note = float(texte.replace(",", "."))
            if not math.isfinite(note) or not 0 <= note <= 20:
                raise ValueError
            notes.append(note)
        except ValueError:
            print("Choisis un nombre de 0 à 20.")
    return notes


def moyenne(notes):
    return sum(notes) / len(notes) if notes else None


if __name__ == "__main__":
    valeurs = lire_notes()
    resultat = moyenne(valeurs)
    if resultat is None:
        print("Ajoute au moins une note pour calculer la moyenne.")
    else:
        print(f"{len(valeurs)} notes · moyenne {resultat:.2f}/20")
`;

const scoreModel = `class Score:
    def __init__(self):
        self.valeur = 0

    def ajouter(self):
        self.valeur += 1
        return self.valeur

    def reinitialiser(self):
        self.valeur = 0
`;
const scoreWindow = `import customtkinter as ctk
from score import Score


class Application(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Mon score DevAfrica")
        self.geometry("450x320")
        self.minsize(340, 260)
        self.grid_columnconfigure(0, weight=1)
        self.score = Score()
        ctk.CTkLabel(self, text="Un clic, un pas de plus", font=("Arial", 20)).grid(row=0, column=0, padx=24, pady=(28, 12))
        self.affichage = ctk.CTkLabel(self, text="0", font=("Arial", 56, "bold"))
        self.affichage.grid(row=1, column=0, pady=12)
        self.ajouter = ctk.CTkButton(self, text="Ajouter un point", command=self.incrementer)
        self.ajouter.grid(row=2, column=0, padx=24, pady=10, sticky="ew")
        ctk.CTkButton(self, text="Recommencer", command=self.reinitialiser).grid(row=3, column=0, padx=24, pady=(0, 24), sticky="ew")

    def incrementer(self):
        self.affichage.configure(text=str(self.score.ajouter()))

    def reinitialiser(self):
        self.score.reinitialiser()
        self.affichage.configure(text="0")


if __name__ == "__main__":
    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("blue")
    Application().mainloop()
`;
const vaultModel = `import base64
import json
import os
from pathlib import Path
import tempfile

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt


class Coffre:
    def __init__(self, chemin, phrase):
        self.chemin = Path(chemin)
        if len(phrase) < 12:
            raise ValueError("Choisis une phrase maîtresse d’au moins 12 caractères.")
        if self.chemin.exists():
            document = json.loads(self.chemin.read_text(encoding="utf-8"))
            if document.get("version") != 1:
                raise ValueError("Version de coffre inconnue.")
            self.sel = base64.b64decode(document["sel"], validate=True)
            if len(self.sel) != 16:
                raise ValueError("Format de coffre invalide.")
        else:
            document = None
            self.sel = os.urandom(16)
        deriveur = Scrypt(salt=self.sel, length=32, n=2**15, r=8, p=1)
        cle = base64.urlsafe_b64encode(deriveur.derive(phrase.encode("utf-8")))
        self.chiffreur = Fernet(cle)
        try:
            self.entrees = json.loads(self.chiffreur.decrypt(document["contenu"].encode()).decode("utf-8")) if document else []
        except InvalidToken as erreur:
            raise ValueError("Phrase incorrecte ou coffre altéré.") from erreur
        if not isinstance(self.entrees, list) or any(not isinstance(item, dict) or set(item) != {"site", "secret"} or not all(isinstance(v, str) for v in item.values()) for item in self.entrees):
            raise ValueError("Contenu de coffre invalide.")

    def ajouter(self, site, secret):
        site = site.strip()
        if not site or not secret or len(site) > 150 or len(secret) > 500:
            raise ValueError("Saisis un site de 1 à 150 caractères et un secret de 1 à 500 caractères.")
        if len(self.entrees) >= 100:
            raise ValueError("Cet exercice est limité à 100 entrées.")
        nouvelles = [*self.entrees, {"site": site, "secret": secret}]
        contenu = json.dumps(nouvelles, ensure_ascii=False).encode("utf-8")
        document = {"version": 1, "sel": base64.b64encode(self.sel).decode(), "contenu": self.chiffreur.encrypt(contenu).decode()}
        fichier = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=self.chemin.parent, delete=False) as sortie:
                fichier = Path(sortie.name)
                json.dump(document, sortie, ensure_ascii=False)
                sortie.flush()
                os.fsync(sortie.fileno())
            os.replace(fichier, self.chemin)
            self.entrees = nouvelles
        finally:
            if fichier and fichier.exists():
                fichier.unlink()
`;
const vaultWindow = `from pathlib import Path
import customtkinter as ctk
from coffre import Coffre


class Application(ctk.CTk):
    def __init__(self, chemin=None):
        super().__init__()
        self.title("Coffre pédagogique DevAfrica")
        self.geometry("720x570")
        self.minsize(440, 440)
        self.chemin = Path(chemin) if chemin else Path(__file__).with_name("coffre.json")
        self.coffre = None
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(5, weight=1)
        ctk.CTkLabel(self, text="Coffre chiffré · données d’exercice", font=("Arial", 21, "bold")).grid(row=0, column=0, columnspan=2, padx=20, pady=20)
        ctk.CTkButton(self, text="Déverrouiller le coffre", command=self.deverrouiller).grid(row=1, column=0, columnspan=2, padx=20, pady=8, sticky="ew")
        ctk.CTkLabel(self, text="Site").grid(row=2, column=0, padx=20, pady=8, sticky="w")
        self.site = ctk.CTkEntry(self, placeholder_text="exemple.local")
        self.site.grid(row=2, column=1, padx=20, pady=8, sticky="ew")
        ctk.CTkLabel(self, text="Secret").grid(row=3, column=0, padx=20, pady=8, sticky="w")
        self.secret = ctk.CTkEntry(self, show="•")
        self.secret.grid(row=3, column=1, padx=20, pady=8, sticky="ew")
        actions = ctk.CTkFrame(self)
        actions.grid(row=4, column=0, columnspan=2, padx=20, pady=8, sticky="ew")
        self.visible = ctk.BooleanVar(value=False)
        ctk.CTkCheckBox(actions, text="Afficher les secrets", variable=self.visible, command=self.afficher).pack(side="left", padx=10, pady=10)
        ctk.CTkButton(actions, text="Enregistrer", command=self.enregistrer).pack(side="right", padx=10, pady=10)
        self.liste = ctk.CTkScrollableFrame(self)
        self.liste.grid(row=5, column=0, columnspan=2, padx=20, pady=8, sticky="nsew")
        self.liste.grid_columnconfigure(1, weight=1)
        self.statut = ctk.CTkLabel(self, text="Ouvre le coffre avec ta phrase maîtresse.", wraplength=540)
        self.statut.grid(row=6, column=0, columnspan=2, padx=20, pady=12)

    def demander_phrase(self, titre):
        dialogue = ctk.CTkToplevel(self)
        dialogue.title(titre)
        dialogue.geometry("420x180")
        dialogue.transient(self)
        resultat = []
        ctk.CTkLabel(dialogue, text="Phrase maîtresse, au moins 12 caractères").pack(padx=20, pady=14)
        champ = ctk.CTkEntry(dialogue, show="•", width=360)
        champ.pack(padx=20, pady=8)
        def valider():
            resultat.append(champ.get())
            dialogue.destroy()
        ctk.CTkButton(dialogue, text="Valider", command=valider).pack(pady=12)
        dialogue.grab_set()
        champ.focus_set()
        self.wait_window(dialogue)
        return resultat[0] if resultat else None

    def deverrouiller(self):
        phrase = self.demander_phrase("Ouvrir le coffre")
        if phrase is None:
            return
        if not self.chemin.exists():
            confirmation = self.demander_phrase("Confirmer la phrase maîtresse")
            if phrase != confirmation:
                self.statut.configure(text="Les deux phrases doivent correspondre.")
                return
        try:
            self.coffre = Coffre(self.chemin, phrase)
            self.statut.configure(text="Coffre ouvert. Utilise des données d’exercice.")
            self.afficher()
        except (OSError, ValueError, KeyError, TypeError) as erreur:
            self.statut.configure(text=str(erreur))

    def enregistrer(self):
        if self.coffre is None:
            self.statut.configure(text="Déverrouille d’abord le coffre.")
            return
        try:
            self.coffre.ajouter(self.site.get(), self.secret.get())
            self.site.delete(0, "end")
            self.secret.delete(0, "end")
            self.afficher()
            self.statut.configure(text="Entrée chiffrée et enregistrée.")
        except (OSError, ValueError) as erreur:
            self.statut.configure(text=str(erreur))

    def afficher(self):
        self.secret.configure(show="" if self.visible.get() else "•")
        for enfant in self.liste.winfo_children():
            enfant.destroy()
        if self.coffre:
            for ligne, entree in enumerate(self.coffre.entrees):
                ctk.CTkLabel(self.liste, text=entree["site"]).grid(row=ligne, column=0, padx=12, pady=8, sticky="w")
                texte = entree["secret"] if self.visible.get() else "••••••••"
                ctk.CTkLabel(self.liste, text=texte, wraplength=320).grid(row=ligne, column=1, padx=12, pady=8, sticky="w")


if __name__ == "__main__":
    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("blue")
    Application().mainloop()
`;

export const pythonNotes: WebProject = {
  id: "notes-python",
  title: "Le gestionnaire de notes",
  description: "Lis des notes, vérifie leurs limites puis affiche une moyenne.",
  minutes: 65,
  requirements: [
    "Lire plusieurs notes jusqu’à fin.",
    "Accepter uniquement des nombres de 0 à 20.",
    "Calculer la moyenne et traiter une liste vide.",
  ],
  hints: [
    "input renvoie du texte à convertir.",
    "Sépare lecture et calcul pour vérifier chaque fonction.",
  ],
  files: consoleFiles("python", notes, { stdin: "12\n16\n18\nfin\n" }),
};
export const pythonScore: WebProject = {
  id: "score-customtkinter",
  title: "Le compteur de score visuel",
  description:
    "Une classe de données et une fenêtre sombre qui réagit aux clics.",
  minutes: 85,
  requirements: [
    "Afficher un score initial de zéro.",
    "Ajouter un point à chaque clic.",
    "Réinitialiser le modèle et le label ensemble.",
  ],
  hints: [
    "command reçoit la fonction à appeler.",
    "configure met le texte du widget à jour.",
  ],
  files: scriptGuiFiles("customtkinter", "Compteur Python", "main.py", {
    "main.py": scoreWindow,
    "score.py": scoreModel,
    "requirements.txt": "customtkinter==5.2.2\n",
  }),
};
export const pythonVault: WebProject = {
  id: "coffre-customtkinter",
  title: "Le coffre pédagogique chiffré",
  description:
    "Construis un formulaire CustomTkinter et conserve ses entrées chiffrées avec Fernet.",
  minutes: 160,
  requirements: [
    "Ouvrir le coffre avec une phrase maîtresse.",
    "Chiffrer les données sur disque et les relire au prochain lancement.",
    "Valider les champs avant l’enregistrement.",
    "Masquer les secrets et permettre leur affichage volontaire.",
    "Présenter les entrées dans une grille défilante.",
  ],
  hints: [
    "Scrypt dérive la clé à partir de la phrase et du sel conservé.",
    "Fernet chiffre et authentifie le contenu.",
    "Le fichier temporaire est remplacé après une écriture réussie.",
  ],
  files: scriptGuiFiles("customtkinter", "Coffre Python", "main.py", {
    "main.py": vaultWindow,
    "coffre.py": vaultModel,
    "requirements.txt": "customtkinter==5.2.2\ncryptography==48.0.1\n",
  }),
};
