import {
  androidWrapperAssets,
  androidWrapperProperties,
} from "./androidWrapper";
import { androidBuildCommand } from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

export const composePath = "app/src/main/java/devafrica/atelier";
export const composeScreen = `${composePath}/AtelierScreen.kt`;
const resources = "app/src/main/res";

function vector(paths: [string, string][]) {
  return `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="120dp" android:height="120dp" android:viewportWidth="120" android:viewportHeight="120">
${paths.map(([color, data]) => `    <path android:fillColor="${color}" android:pathData="${data}" />`).join("\n")}
</vector>
`;
}

export const avatarDrawable = vector([
  ["#DCEEFF", "M0,0h120v120h-120z"],
  ["#315F93", "M13,120C17,92 35,84 59,84C84,84 102,92 107,120Z"],
  ["#693F31", "M36,55C29,30 41,13 60,13C84,13 94,31 85,58L80,62H41Z"],
  ["#B97653", "M54,70H68V91C65,97 58,97 54,91Z"],
  [
    "#CF8B63",
    "M39,40C50,40 63,32 66,27C73,36 80,39 83,40V55C83,71 74,81 61,81C48,81 39,69 39,55Z",
  ],
  ["#32262A", "M46,54h7v3h-7zM70,54h7v3h-7z"],
  ["#8C5046", "M54,66Q62,72 70,66Q63,76 54,66Z"],
]);

export const coverDrawable = vector([
  ["#D7EAFB", "M0,0h120v120h-120z"],
  ["#65A8DF", "M0,90L30,57L51,80L83,44L120,82V120H0Z"],
  ["#225A8C", "M0,105L40,84L73,98L96,75L120,91V120H0Z"],
  ["#F3BD5A", "M99,25A10,10 0,1 1,79 25A10,10 0,1 1,99 25Z"],
]);

export function iconDrawable(path: string) {
  return `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#172F47" android:pathData="${path}" />
</vector>
`;
}

type ComposeOptions = {
  appId: string;
  screen: string;
  extra?: Record<string, string>;
  advanced?: boolean;
  navigation?: boolean;
  notes?: string;
};

export function composeFiles(
  title: string,
  { appId, screen, extra, advanced, navigation, notes }: ComposeOptions,
): WebFiles {
  return {
    html: "",
    css: "",
    entry: composeScreen,
    local: {
      runtime: "compose",
      assets: androidWrapperAssets,
      sources: {
        [composeScreen]: screen.trim() + "\n",
        [`${composePath}/MainActivity.kt`]: `package devafrica.atelier

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme(colorScheme = lightColorScheme(
                primary = Color(0xFF195E9A), secondary = Color(0xFF436983),
                background = Color(0xFFF1F7FC), surface = Color(0xFFF1F7FC),
            )) {
                Surface(modifier = Modifier.fillMaxSize()) { AtelierScreen() }
            }
        }
    }
}
`,
        "settings.gradle.kts": `pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "DevAfrica-${appId}"
include(":app")
`,
        "build.gradle.kts": `plugins {
    id("com.android.application") version "8.13.2" apply false
    id("org.jetbrains.kotlin.android") version "2.2.21" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.2.21" apply false
}
`,
        "app/build.gradle.kts": `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "devafrica.atelier"
    compileSdk = 35
    defaultConfig {
        applicationId = "devafrica.atelier.${appId}"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
    buildFeatures { compose = true }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin { jvmToolchain(17) }

dependencies {
    implementation(platform("androidx.compose:compose-bom:2025.10.01"))
    implementation("androidx.activity:activity-compose:1.10.1")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.animation:animation")
    implementation("androidx.compose.material3:material3")
${
  advanced
    ? `    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.9.4")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.9.4")
`
    : ""
}${navigation ? '    implementation("androidx.navigation:navigation-compose:2.9.5")\n' : ""}}
`,
        "gradle.properties":
          "android.useAndroidX=true\nkotlin.code.style=official\norg.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8\n",
        "gradle/wrapper/gradle-wrapper.properties": androidWrapperProperties,
        "app/src/main/AndroidManifest.xml": `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:label="@string/app_name" android:theme="@android:style/Theme.Material.Light.NoActionBar"
        android:allowBackup="false" android:supportsRtl="true">
        <activity android:name=".MainActivity" android:exported="true" android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
        [`${resources}/values/strings.xml`]: `<resources><string name="app_name">${title.replaceAll("&", "&amp;")}</string></resources>\n`,
        ".gitignore": "/.gradle/\n/.idea/\n/local.properties\n**/build/\n",
        "README.md": `# ${title}

1. Extrais l’archive. Ouvre dans Android Studio le dossier qui contient settings.gradle.kts.
2. Dans SDK Manager, installe Android SDK Platform 35 et Build-Tools 35.0.0.
3. Sélectionne un JDK 17 pour Gradle et attends la synchronisation.
4. Choisis un émulateur ou un appareil Android API 24 ou supérieur et clique sur Run.

Le projet inclut le Gradle Wrapper 8.13. La première synchronisation
télécharge la distribution et les dépendances. Pour compiler depuis le terminal
du projet, utilise ${androidBuildCommand(true)} sous PowerShell ou
${androidBuildCommand(false)} sous macOS/Linux. L’APK de test se trouve
dans app/build/outputs/apk/debug/.

AtelierScreen.kt contient l’interface. MainActivity.kt installe le thème et
appelle cet écran. L’atelier utilise des données locales de démonstration.

${notes ?? ""}`,
        ...extra,
      },
    },
  };
}
