import { useState } from "react";
import { Terminal } from "lucide-react";
import { useI18n } from "../../i18n/context";
import type { LocalRuntime } from "../../data/webCourseTypes";
import {
  androidBuildCommand,
  cLaunchCommands,
  cppLaunchCommands,
  djangoLaunchCommands,
  gtkLaunchCommands,
  javafxLaunchCommands,
  javaLaunchCommands,
  qtLaunchCommands,
  expoLaunchCommands,
  flutterLaunchCommands,
  kotlinLaunchCommands,
  laravelLaunchCommands,
  nodeLaunchCommands,
  springLaunchCommands,
} from "../../lib/localStudio";

export default function StudioLocalGuide({
  runtime,
}: {
  runtime: LocalRuntime;
}) {
  const { t } = useI18n();
  const [windows, setWindows] = useState(true);
  const android = runtime === "compose" || runtime === "java-android";
  const swift = runtime === "swift";
  const platformSpecific =
    runtime === "django" || runtime === "customtkinter" || android;
  const commands = {
    django: djangoLaunchCommands(windows),
    nuxt: "npm install\nnpm run dev",
    laravel: laravelLaunchCommands,
    spring: springLaunchCommands,
    node: nodeLaunchCommands,
    kotlin: kotlinLaunchCommands,
    compose: androidBuildCommand(windows),
    "java-android": androidBuildCommand(windows),
    swift: "open DevAfrica.xcodeproj",
    flutter: flutterLaunchCommands,
    expo: expoLaunchCommands,
    c: cLaunchCommands,
    cpp: cppLaunchCommands,
    java: javaLaunchCommands,
    gtk: gtkLaunchCommands,
    qt: qtLaunchCommands,
    javafx: javafxLaunchCommands,
    python: "python main.py",
    nodejs: "node main.mjs",
    typescript: "npm install\nnpm start",
    php: "php main.php",
    customtkinter: windows
      ? "py -m venv .venv\n.\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt\n.\\.venv\\Scripts\\python.exe main.py"
      : "python3 -m venv .venv\n.venv/bin/python -m pip install -r requirements.txt\n.venv/bin/python main.py",
    electron: "npm install\nnpm start",
    nodegui: "npm install\nnpm start",
    "php-desktop": "php -S 127.0.0.1:8027 -t www",
    sql: "sqlite3 devafrica.sqlite",
  }[runtime];
  const url = {
    django: "http://127.0.0.1:8000/",
    nuxt: "http://localhost:3000/",
    laravel: "http://127.0.0.1:8001/",
    spring: "http://127.0.0.1:8080/",
    node: "http://127.0.0.1:3000/",
    kotlin: null,
    compose: null,
    "java-android": null,
    swift: null,
    flutter: null,
    expo: null,
    c: null,
    cpp: null,
    java: null,
    gtk: null,
    qt: null,
    javafx: null,
    python: null,
    nodejs: null,
    typescript: null,
    php: null,
    customtkinter: null,
    electron: null,
    nodegui: null,
    "php-desktop": "http://127.0.0.1:8027/",
    sql: null,
  }[runtime];
  const androidRequirements = t(
    "Ouvre le dossier extrait dans Android Studio. Synchronise Gradle avec un JDK 17, installe le SDK Android 35, sélectionne un appareil puis clique sur Run.",
    "Open the extracted folder in Android Studio. Sync Gradle with JDK 17, install Android SDK 35, choose a device, then click Run.",
  );
  const requirements = {
    django: t(
      "Installe Python 3.10 ou plus récent.",
      "Install Python 3.10 or later.",
    ),
    nuxt: t(
      "Utilise Node.js 24 à jour.",
      "Use an up-to-date Node.js 24 release.",
    ),
    laravel: t(
      "Installe PHP 8.2 ou plus récent, Composer 2 et l’extension PDO SQLite.",
      "Install PHP 8.2 or later, Composer 2 and PDO SQLite.",
    ),
    spring: t(
      "Installe un JDK Java 17 ou plus récent et Maven 3.6.3 ou plus récent.",
      "Install a Java 17 or later JDK and Maven 3.6.3 or later.",
    ),
    node: t("Utilise Node.js 24 et npm.", "Use Node.js 24 and npm."),
    kotlin: t(
      "Installe un JDK Java 17 ou plus récent et Maven.",
      "Install a Java 17 or later JDK and Maven.",
    ),
    compose: androidRequirements,
    "java-android": androidRequirements,
    flutter: t(
      "Installe le SDK Flutter stable et configure un appareil Android. Pour un simulateur iOS, utilise un Mac avec Xcode. Le dossier de travail doit contenir pubspec.yaml.",
      "Install the stable Flutter SDK and set up an Android device. For an iOS simulator, use a Mac with Xcode. Your working folder must contain pubspec.yaml.",
    ),
    expo: t(
      "Utilise Node.js 24. Pour scanner le QR code, installe la version d’Expo Go compatible SDK 54 et connecte le téléphone au même réseau que ton ordinateur.",
      "Use Node.js 24. Install the Expo Go build compatible with SDK 54 and connect the phone to the same network as your computer before scanning the QR code.",
    ),
    c: t(
      "Utilise GCC pour construire le programme.",
      "Use GCC to build the program.",
    ),
    cpp: t("Utilise G++ avec C++20.", "Use G++ with C++20."),
    java: t("Utilise un JDK 17 ou plus récent.", "Use JDK 17 or later."),
    gtk: t(
      "Sous Windows, installe GTK 4 et GCC dans le terminal MSYS2 UCRT64. Sous Linux, installe les fichiers de développement GTK 4 et pkg-config.",
      "On Windows, install GTK 4 and GCC in the MSYS2 UCRT64 terminal. On Linux, install the GTK 4 development files and pkg-config.",
    ),
    qt: t(
      "Ouvre CMakeLists.txt dans Qt Creator, sélectionne un kit Qt 6 avec un compilateur, puis lance le projet. Pour utiliser le terminal, configure d’abord l’environnement du kit Qt.",
      "Open CMakeLists.txt in Qt Creator, select a Qt 6 kit with a compiler, and run the project. To use the terminal, first set up the Qt kit environment.",
    ),
    python: t(
      "Installe Python 3.11 ou plus récent.",
      "Install Python 3.11 or later.",
    ),
    nodejs: t("Installe Node.js 24.", "Install Node.js 24."),
    typescript: t(
      "Installe Node.js 24 puis les dépendances du projet.",
      "Install Node.js 24 and the project dependencies.",
    ),
    php: t(
      "Installe PHP 8.2 avec mbstring et readline.",
      "Install PHP 8.2 with mbstring and readline.",
    ),
    customtkinter: t(
      "Installe Python 3.11 avec Tk. Le ZIP fournit requirements.txt. Le projet de coffre ajoute la bibliothèque cryptography pour le chiffrement.",
      "Install Python 3.11 with Tk. The ZIP includes requirements.txt. The vault project adds cryptography for encryption.",
    ),
    electron: t(
      "Installe Node.js 24. npm install télécharge Electron puis npm start ouvre la fenêtre.",
      "Install Node.js 24. npm install downloads Electron and npm start opens the window.",
    ),
    nodegui: t(
      "Utilise Node.js 24 et la chaîne C++ décrite dans le README. npm start compile le TypeScript puis lance Qode avec Qt.",
      "Use Node.js 24 and the C++ toolchain described in the README. npm start compiles TypeScript and launches Qode with Qt.",
    ),
    "php-desktop": t(
      "Sous Windows, copie le dossier www dans une distribution PHP Desktop Chrome équipée de PHP 8.2 ou plus récent et lance son exécutable. La commande ci-dessous permet d’essayer l’interface avec PHP local.",
      "On Windows, copy www into a PHP Desktop Chrome distribution with PHP 8.2 or later and launch its executable. The command below runs the interface with local PHP.",
    ),
    sql: t(
      "Utilise le terminal SQLite intégré ou ouvre l’export dans DB Browser for SQLite.",
      "Use the built-in SQLite terminal or open the export in DB Browser for SQLite.",
    ),
    javafx: t(
      "Installe un JDK 17 ou plus récent et Maven. Ouvre le dossier contenant pom.xml. Scene Builder permet d’éditer les fichiers FXML de l’atelier Contacts.",
      "Install JDK 17 or later and Maven. Open the folder containing pom.xml. Scene Builder can edit the Contacts workshop FXML files.",
    ),
    swift: t(
      "Sur un Mac, ouvre DevAfrica.xcodeproj avec Xcode 16 ou plus récent. Sélectionne le schéma DevAfrica et un simulateur iPhone sous iOS 17 ou plus récent, puis clique sur Run.",
      "On a Mac, open DevAfrica.xcodeproj in Xcode 16 or later. Select the DevAfrica scheme and an iPhone simulator running iOS 17 or later, then click Run.",
    ),
  }[runtime];
  return (
    <div className="studio-local-guide">
      <h3>
        <Terminal size={18} />{" "}
        {t("Lancer sur ton ordinateur", "Run on your computer")}
      </h3>
      <p>
        {android
          ? t(
              "Exporte le ZIP et décompresse le projet Android.",
              "Export the ZIP and extract the Android project.",
            )
          : swift
            ? t(
                "Exporte le ZIP et décompresse le projet iOS. Tu peux aussi ouvrir le projet depuis le terminal du Mac avec la commande ci-dessous.",
                "Export and extract the iOS project. You can also open it from the Mac terminal with the command below.",
              )
            : t(
                "Exporte le ZIP, décompresse-le et ouvre le dossier extrait dans VS Code. Ouvre un terminal dans ce dossier et lance les commandes une par une.",
                "Export and extract the ZIP, then open the extracted folder in VS Code. Run each command in a terminal in that folder.",
              )}
      </p>
      <p>{requirements}</p>
      {platformSpecific && (
        <div
          role="group"
          aria-label={t("Système d’exploitation", "Operating system")}
        >
          <button aria-pressed={windows} onClick={() => setWindows(true)}>
            Windows
          </button>
          <button aria-pressed={!windows} onClick={() => setWindows(false)}>
            macOS / Linux
          </button>
        </div>
      )}
      {android && (
        <p>
          {t(
            "Pour compiler depuis le terminal du projet",
            "To build from the project terminal",
          )}
        </p>
      )}
      <pre>
        <code>{commands}</code>
      </pre>
      {url && (
        <p>
          {t(
            "Quand le serveur démarre, ouvre ",
            "When the server starts, open ",
          )}
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </p>
      )}
      {runtime === "kotlin" && (
        <p>
          {t(
            "Lis le résultat dans le terminal. Si le programme attend une valeur, saisis-la puis appuie sur Entrée.",
            "Read the output in the terminal. If the program asks for a value, type it and press Enter.",
          )}
        </p>
      )}
      {runtime === "node" && (
        <p>
          {t(
            "Pour un projet MongoDB, démarre la base et suis les réglages indiqués dans le README.md.",
            "For a MongoDB project, start the database and follow the settings in README.md.",
          )}
        </p>
      )}
      {(runtime === "spring" ||
        runtime === "laravel" ||
        android ||
        swift ||
        runtime === "flutter" ||
        runtime === "expo" ||
        runtime === "gtk" ||
        runtime === "qt" ||
        runtime === "javafx") && (
        <p>
          {t(
            "Le README.md du ZIP détaille les étapes propres à cet exercice.",
            "The ZIP’s README.md includes the steps for this exercise.",
          )}
        </p>
      )}
    </div>
  );
}
