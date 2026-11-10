import { flutterLaunchCommands } from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

export const flutterMain = "lib/main.dart";
const atelierTheme = `import 'package:flutter/material.dart';

class AtelierApp extends StatelessWidget {
  const AtelierApp({super.key, required this.title, required this.home});

  final String title;
  final Widget home;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: title,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF155D99)),
        useMaterial3: true,
      ),
      home: home,
    );
  }
}
`;

type FlutterProject = {
  id: string;
  main: string;
  notes: string;
  dependencies?: Record<string, string>;
  development?: Record<string, string>;
  extra?: Record<string, string>;
  assets?: Record<string, string>;
  internet?: boolean;
};

function yamlDependencies(dependencies: Record<string, string>) {
  return Object.entries(dependencies)
    .map(([name, version]) => `  ${name}: ${version}\n`)
    .join("");
}

export function flutterFiles(
  title: string,
  {
    id,
    main,
    notes,
    dependencies = {},
    development,
    extra,
    assets,
    internet,
  }: FlutterProject,
): WebFiles {
  const bundledAssets = Object.keys(assets ?? {}).filter((name) =>
    name.startsWith("assets/"),
  );
  return {
    html: "",
    css: "",
    entry: flutterMain,
    local: {
      runtime: "flutter",
      assets,
      sources: {
        [flutterMain]: main.trim() + "\n",
        "lib/atelier_app.dart": atelierTheme,
        "pubspec.yaml": `name: devafrica_${id}
description: Atelier DevAfrica pour apprendre Flutter.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.11.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
${yamlDependencies(dependencies)}${development ? `\ndev_dependencies:\n${yamlDependencies(development)}` : ""}
flutter:
  uses-material-design: true
${bundledAssets.length ? `  assets:\n${bundledAssets.map((name) => `    - ${name}\n`).join("")}` : ""}`,
        "analysis_options.yaml": "analyzer:\n  exclude:\n    - '**/*.g.dart'\n",
        ".gitignore":
          ".dart_tool/\n.flutter-plugins-dependencies\nbuild/\n.idea/\n",
        ...(internet
          ? {
              "android/app/src/main/AndroidManifest.xml": `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application android:label="${title.replaceAll("&", "&amp;")}" android:name="\${applicationName}" android:icon="@mipmap/ic_launcher">
        <activity android:name=".MainActivity" android:exported="true" android:launchMode="singleTop"
            android:theme="@style/LaunchTheme" android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode">
            <meta-data android:name="io.flutter.embedding.android.NormalTheme" android:resource="@style/NormalTheme" />
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <meta-data android:name="flutterEmbedding" android:value="2" />
    </application>
</manifest>
`,
            }
          : {}),
        "README.md": `# ${title}

1. Installe le SDK Flutter stable et configure Android Studio ou VS Code avec les extensions Flutter et Dart.
2. Démarre un émulateur Android ou connecte un téléphone avec le débogage USB activé.
3. Ouvre un terminal dans le dossier extrait qui contient pubspec.yaml.
4. Lance les commandes suivantes, une par une.

\`\`\`text
${flutterLaunchCommands}
\`\`\`

La commande flutter create ajoute les dossiers Android et iOS à l’atelier.
Sur Mac, tu peux aussi sélectionner un simulateur iOS configuré dans Xcode.
Utilise flutter devices pour voir les cibles détectées.

${notes}
`,
        ...extra,
      },
    },
  };
}
