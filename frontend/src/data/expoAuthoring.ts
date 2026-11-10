import { expoLaunchCommands } from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

export const expoApp = "App.tsx";
const baseDependencies = {
  expo: "54.0.38",
  react: "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-web": "~0.21.0",
  "react-native-safe-area-context": "~5.6.0",
  "@expo/metro-runtime": "~6.1.2",
};

export const nativeNavigation = {
  "@react-navigation/native": "7.5.1",
  "react-native-screens": "~4.16.0",
};

const sharedStyles = `import { StyleSheet } from 'react-native';

export const colors = {
  background: '#edf5ff',
  card: '#ffffff',
  ink: '#18354c',
  muted: '#425e73',
  primary: '#185d99',
  border: '#b9d1e5',
  accent: '#d7eaff',
  error: '#912d34',
};

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 18, fontWeight: '700', color: colors.ink },
  muted: { color: colors.muted, fontSize: 15 },
  panel: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 18, padding: 16, gap: 8 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, color: colors.ink, padding: 12, minHeight: 46, fontSize: 16 },
  action: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  actionText: { color: 'white', fontSize: 15, fontWeight: '700' },
  error: { color: colors.error, fontWeight: '600' },
});
`;

type ExpoProject = {
  id: string;
  app: string;
  notes: string;
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  extra?: Record<string, string>;
  assets?: Record<string, string>;
};

export function expoFiles(
  title: string,
  { id, app, notes, dependencies, scripts, extra, assets }: ExpoProject,
): WebFiles {
  const projectName = `devafrica-${id}`;
  const identifier = `devafrica.atelier.expo.${id.replaceAll("-", "")}`;
  return {
    html: "",
    css: "",
    entry: expoApp,
    local: {
      runtime: "expo",
      assets,
      sources: {
        [expoApp]: app.trim() + "\n",
        "src/ui.ts": sharedStyles,
        "package.json":
          JSON.stringify(
            {
              name: projectName,
              private: true,
              version: "1.0.0",
              main: "index.js",
              scripts: {
                start: "expo start --go",
                android: "expo start --go --android",
                web: "expo start --web",
                typecheck: "tsc --noEmit",
                ...scripts,
              },
              dependencies: { ...baseDependencies, ...dependencies },
              devDependencies: {
                "@types/react": "~19.1.10",
                typescript: "~5.9.2",
              },
            },
            null,
            2,
          ) + "\n",
        "app.json":
          JSON.stringify(
            {
              expo: {
                name: title,
                slug: projectName,
                version: "1.0.0",
                newArchEnabled: true,
                android: { package: identifier },
                ios: { bundleIdentifier: identifier, supportsTablet: true },
                web: { bundler: "metro" },
              },
            },
            null,
            2,
          ) + "\n",
        "index.js": `import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
`,
        "tsconfig.json":
          JSON.stringify(
            {
              extends: "expo/tsconfig.base",
              compilerOptions: { strict: true },
              include: ["App.tsx", "src/**/*.ts", "src/**/*.tsx"],
            },
            null,
            2,
          ) + "\n",
        ".gitignore":
          "node_modules/\n.expo/\ndist/\n.env.local\nserver/data/\n",
        "README.md": `# ${title}

1. Utilise Node.js 24 et ouvre le dossier qui contient package.json.
2. Installe Expo Go compatible avec le SDK 54. Pour Android, sélectionne SDK 54 sur https://expo.dev/go.
3. Lance les commandes suivantes dans le terminal de l’atelier.

\`\`\`text
${expoLaunchCommands}
\`\`\`

Connecte ton téléphone au même réseau que ton ordinateur et scanne le QR code.
Avec un émulateur Android démarré, appuie sur a dans le terminal Expo.
Exécute npm run typecheck pour vérifier les types TypeScript.

${notes}
`,
        ...extra,
      },
    },
  };
}
