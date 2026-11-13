import type { WebFiles } from "./webCourseTypes";

export const swiftMain = "ContentView.swift";
export const swiftPath = "Sources/DevAfrica";

type SwiftProject = {
  id?: string;
  /** Code source de la vue principale (ContentView.swift) */
  main?: string;
  /** Alias de main — accepté dans les projets avancés */
  view?: string;
  notes: string;
  /** Fichier App.swift personnalisé (remplace le défaut généré) */
  app?: string;
  extra?: Record<string, string>;
};

const defaultApp = `import SwiftUI

@main
struct AtelierApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
`;

export function swiftFiles(
  title: string,
  { main, view, notes, app, extra }: SwiftProject,
): WebFiles {
  // `view` est un alias de `main` utilisé dans les projets avancés
  const contentView = (main ?? view ?? "").trim() + "\n";
  return {
    html: "",
    css: "",
    entry: swiftMain,
    local: {
      runtime: "swift",
      sources: {
        [swiftMain]: contentView,
        "App.swift": app ?? defaultApp,
        "README.md": `# ${title}

Ouvre le projet dans Xcode (iOS 17+, Xcode 16+) et choisis un simulateur.
Lance le schéma principal avec ⌘R.

${notes}
`,
        ...extra,
      },
    },
  };
}
