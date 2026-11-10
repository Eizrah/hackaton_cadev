import { androidBuildCommand } from "../lib/localStudio";
import {
  androidWrapperAssets,
  androidWrapperProperties,
} from "./androidWrapper";
import type { WebFiles } from "./webCourseTypes";

export const javaAndroidPath = "app/src/main/java/devafrica/atelier";
export const androidRes = "app/src/main/res";
export const javaMainActivity = `${javaAndroidPath}/MainActivity.java`;
export const androidMainLayout = `${androidRes}/layout/activity_main.xml`;

type JavaAndroidProject = {
  id: string;
  activity: string;
  layout: string;
  notes: string;
  extra?: Record<string, string>;
  dependencies?: string[];
  permissions?: string[];
  activities?: string[];
};

export function javaAndroidFiles(
  title: string,
  {
    id,
    activity,
    layout,
    notes,
    extra,
    dependencies = [],
    permissions = [],
    activities = [],
  }: JavaAndroidProject,
): WebFiles {
  return {
    html: "",
    css: "",
    entry: javaMainActivity,
    local: {
      runtime: "java-android",
      assets: androidWrapperAssets,
      sources: {
        [javaMainActivity]: activity.trim() + "\n",
        [androidMainLayout]: layout.trim() + "\n",
        [`${javaAndroidPath}/AtelierActivity.java`]: `package devafrica.atelier;

import android.app.Activity;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

abstract class AtelierActivity extends Activity {
    protected void showLayout(int layout) {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView())
                .setAppearanceLightStatusBars(true);
        WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView())
                .setAppearanceLightNavigationBars(true);
        setContentView(layout);
        View screen = findViewById(R.id.screen);
        ViewCompat.setOnApplyWindowInsetsListener(screen, (view, windowInsets) -> {
            Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars()
                    | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
            view.setPadding(insets.left, insets.top, insets.right, insets.bottom);
            return windowInsets;
        });
        ViewCompat.requestApplyInsets(screen);
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
rootProject.name = "DevAfrica-${id}"
include(":app")
`,
        "build.gradle.kts": `plugins {
    id("com.android.application") version "8.13.2" apply false
}
`,
        "app/build.gradle.kts": `plugins {
    id("com.android.application")
}

android {
    namespace = "devafrica.atelier"
    compileSdk = 35
    defaultConfig {
        applicationId = "devafrica.atelier.java.${id}"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.core:core:1.15.0")
${dependencies.map((dependency) => `    implementation("${dependency}")\n`).join("")}}
`,
        "gradle.properties":
          "android.useAndroidX=true\norg.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8\n",
        "gradle/wrapper/gradle-wrapper.properties": androidWrapperProperties,
        "app/src/main/AndroidManifest.xml": `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
${permissions.map((permission) => `    <uses-permission android:name="android.permission.${permission}" />\n`).join("")}    <application android:label="@string/app_name" android:theme="@style/AtelierTheme"
        android:allowBackup="false" android:supportsRtl="true">
        <activity android:name=".MainActivity" android:exported="true" android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
${activities.map((name) => `        <activity android:name=".${name}" android:exported="false" />\n`).join("")}    </application>
</manifest>
`,
        [`${androidRes}/values/strings.xml`]: `<resources>
    <string name="app_name">${title.replaceAll("&", "&amp;").replaceAll("'", "’")}</string>
</resources>
`,
        [`${androidRes}/values/styles.xml`]: `<resources>
    <style name="AtelierTheme" parent="@android:style/Theme.Material.Light.NoActionBar">
        <item name="android:windowBackground">#F2F7FD</item>
        <item name="android:colorAccent">#185D9B</item>
        <item name="android:textColorPrimary">#17324A</item>
        <item name="android:textColorSecondary">#415D73</item>
    </style>
    <style name="AtelierTitle" parent="@android:style/TextAppearance.Material.Headline">
        <item name="android:layout_width">match_parent</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:textColor">#17324A</item>
        <item name="android:textStyle">bold</item>
    </style>
</resources>
`,
        [`${androidRes}/drawable/card.xml`]: `<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#FFFFFF" />
    <stroke android:width="1dp" android:color="#CBDDEE" />
    <corners android:radius="16dp" />
</shape>
`,
        ".gitignore": "/.gradle/\n/.idea/\n/local.properties\n**/build/\n",
        "README.md": `# ${title}

1. Extrais le ZIP, puis ouvre le dossier qui contient settings.gradle.kts dans Android Studio.
2. Dans SDK Manager, installe Android SDK Platform 35 et Build-Tools 35.0.0.
3. Configure le JDK Gradle sur Java 17 et attends la synchronisation.
4. Choisis un émulateur ou un appareil Android API 24 ou supérieur et clique sur Run.

Le Gradle Wrapper 8.13 est inclus. La première synchronisation télécharge ses dépendances.
Pour compiler, lance ${androidBuildCommand(true)} sous PowerShell ou
${androidBuildCommand(false)} sous macOS ou Linux. L’APK se trouve dans app/build/outputs/apk/debug/.

Le fichier activity_main.xml définit l’écran. MainActivity.java relie les vues et la logique.
AtelierActivity applique les marges système aux écrans, notamment sous Android 15.

${notes}
`,
        ...extra,
      },
    },
  };
}

export function scrollLayout(content: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/screen" android:layout_width="match_parent"
    android:layout_height="match_parent" android:fillViewport="true" android:clipToPadding="false">
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
        android:orientation="vertical" android:padding="20dp">
${content}
    </LinearLayout>
</ScrollView>
`;
}

export const recyclerView = "androidx.recyclerview:recyclerview:1.4.0";
export const retrofit = [
  "com.squareup.retrofit2:retrofit:2.11.0",
  "com.squareup.retrofit2:converter-gson:2.11.0",
];
