import type { CompilerLanguage } from "../lib/compilerProtocol";
import {
  gtkLaunchCommands,
  javafxLaunchCommands,
  qtLaunchCommands,
} from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

export function consoleFiles(
  language: CompilerLanguage,
  code: string,
  {
    stdin = "",
    extra = {},
  }: { stdin?: string; extra?: Record<string, string> } = {},
): WebFiles {
  const entry = {
    c: "main.c",
    cpp: "main.cpp",
    java: "Main.java",
    python: "main.py",
    nodejs: "main.mjs",
    typescript: "main.ts",
    php: "main.php",
  }[language];
  const sources = { [entry]: code.trim() + "\n", ...extra };
  const unit = {
    c: /\.c$/,
    cpp: /\.(?:cpp|cc|cxx)$/,
    java: /\.java$/,
    python: /\.py$/,
    nodejs: /\.(?:mjs|cjs|js)$/,
    typescript: /\.ts$/,
    php: /\.php$/,
  }[language];
  const units = Object.keys(sources)
    .filter((name) => unit.test(name))
    .join(" ");
  const commands = {
    c: `gcc -std=c17 -Wall -Wextra ${units} -lm -o atelier\n./atelier`,
    cpp: `g++ -std=c++20 -Wall -Wextra ${units} -o atelier\n./atelier`,
    java: `javac -encoding UTF-8 ${units}\njava Main`,
    python: "python main.py",
    nodejs: "node main.mjs",
    typescript: "npm install\nnpm start",
    php: "php main.php",
  }[language];
  return {
    html: "",
    css: "",
    entry,
    local: {
      runtime: language,
      stdin,
      sources: {
        ...(language === "typescript"
          ? {
              "package.json": JSON.stringify(
                {
                  name: "atelier-typescript",
                  private: true,
                  scripts: {
                    build: "tsc",
                    start: "npm run build && node out/main.js",
                  },
                  devDependencies: {
                    typescript: "6.0.3",
                    "@types/node": "24.19.2",
                  },
                },
                null,
                2,
              ),
              "tsconfig.json": JSON.stringify(
                {
                  compilerOptions: {
                    target: "ES2022",
                    module: "CommonJS",
                    strict: true,
                    outDir: "out",
                    skipLibCheck: true,
                    types: ["node"],
                  },
                  include: ["**/*.ts"],
                  exclude: ["node_modules", "out"],
                },
                null,
                2,
              ),
            }
          : {}),
        ...sources,
        ...(stdin ? { "entree.txt": stdin } : {}),
        "README.md": `# Atelier console DevAfrica

Dans DevAfrica, ouvre la console, renseigne les valeurs dans Entrée standard
puis clique sur Compiler et exécuter. L’exemple d’entrée est fourni dans
entree.txt lorsqu’il y a une saisie.

Pour lancer le ZIP dans ton terminal, installe le compilateur approprié,
ouvre le dossier extrait et utilise les commandes suivantes.

\`\`\`text
${commands}
\`\`\`

${{ java: "Utilise un JDK 17 ou plus récent.", c: "Sous Windows, utilise MSYS2 UCRT64 avec GCC.", cpp: "Sous Windows, utilise MSYS2 UCRT64 avec G++.", python: "Installe Python 3.11 ou plus récent.", nodejs: "Installe Node.js 24.", typescript: "Installe Node.js 24. npm install prépare le compilateur TypeScript.", php: "Installe PHP 8.2 ou plus récent avec mbstring et readline." }[language]}
`,
      },
    },
  };
}

export function gtkFiles(title: string, code: string, notes: string): WebFiles {
  return {
    html: "",
    css: "",
    entry: "main.c",
    local: {
      runtime: "gtk",
      sources: {
        "main.c": code.trim() + "\n",
        "README.md": `# ${title}

Sous Windows, installe MSYS2 puis ouvre le terminal UCRT64. Mets les paquets
à jour avec pacman -Syu en suivant les instructions de MSYS2, puis installe
GTK 4 et le compilateur dans ce terminal.

\`\`\`sh
pacman -S --needed mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-gtk4 mingw-w64-ucrt-x86_64-pkgconf
\`\`\`

Sous Ubuntu ou Debian, installe build-essential, pkg-config et libgtk-4-dev.
Depuis le dossier du ZIP extrait, compile et lance le programme.

\`\`\`sh
${gtkLaunchCommands}
\`\`\`

${notes}

Guide Windows : https://www.gtk.org/docs/installations/windows
`,
      },
    },
  };
}

export function qtFiles(
  title: string,
  code: string,
  notes: string,
  extra: Record<string, string> = {},
): WebFiles {
  return {
    html: "",
    css: "",
    entry: "main.cpp",
    local: {
      runtime: "qt",
      sources: {
        "main.cpp": code.trim() + "\n",
        ...extra,
        "CMakeLists.txt": `cmake_minimum_required(VERSION 3.16)
project(AtelierDevAfrica LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets)
add_executable(atelier main.cpp${Object.keys(extra).length ? " " + Object.keys(extra).join(" ") : ""})
target_link_libraries(atelier PRIVATE Qt6::Widgets)
`,
        "README.md": `# ${title}

Installe Qt 6 avec le module Qt Widgets, Qt Creator et un kit de bureau.
Dans Qt Creator, ouvre CMakeLists.txt, choisis ce kit puis clique sur Exécuter.
Le kit doit associer la version de Qt à son compilateur.

Si ton terminal connaît déjà le kit Qt, tu peux également compiler avec CMake.

\`\`\`text
${qtLaunchCommands}
\`\`\`

Sous Linux avec un générateur à configuration unique, lance ./build/atelier.
Sous Windows, démarre l’exécutable produit ou utilise Exécuter dans Qt Creator.

${notes}

Documentation : https://doc.qt.io/qt-6/widgets-getting-started.html
`,
      },
    },
  };
}

export const fxPath = "src/main/java/devafrica/atelier";
export const fxResources = "src/main/resources/devafrica/atelier";
const fxMain = `${fxPath}/Main.java`;

export function javafxFiles(
  title: string,
  id: string,
  code: string,
  notes: string,
  extra: Record<string, string> = {},
  fxml = false,
): WebFiles {
  return {
    html: "",
    css: "",
    entry: fxMain,
    local: {
      runtime: "javafx",
      sources: {
        [fxMain]: code.trim() + "\n",
        ...extra,
        "pom.xml": `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>devafrica.atelier</groupId>
    <artifactId>${id}</artifactId>
    <version>1.0.0</version>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.release>17</maven.compiler.release>
        <javafx.version>21.0.13</javafx.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
${
  fxml
    ? `        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
`
    : ""
}    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.14.1</version>
            </plugin>
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>0.0.8</version>
                <configuration>
                    <mainClass>devafrica.atelier.Main</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`,
        "README.md": `# ${title}

Installe un JDK 17 ou plus récent et Maven. Vérifie java -version et mvn -v
dans le terminal. Ouvre le dossier extrait contenant pom.xml et lance la
commande suivante.

\`\`\`text
${javafxLaunchCommands}
\`\`\`

Maven récupère les modules JavaFX et les bibliothèques correspondant à ton système.
Sous Linux, la bibliothèque GTK et une session graphique sont requises.

${notes}

Documentation : https://openjfx.io/openjfx-docs/
`,
      },
    },
  };
}
