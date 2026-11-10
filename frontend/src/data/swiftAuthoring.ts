import type { WebFiles } from "./webCourseTypes";

export const swiftPath = "Atelier";
export const swiftView = `${swiftPath}/ContentView.swift`;
export const swiftApp = `${swiftPath}/DevAfricaApp.swift`;
const projectPath = "DevAfrica.xcodeproj";

const ids = {
  project: "DAF100000000000000000001",
  group: "DAF100000000000000000002",
  sources: "DAF100000000000000000003",
  products: "DAF100000000000000000004",
  app: "DAF100000000000000000005",
  target: "DAF100000000000000000006",
  sourcesPhase: "DAF100000000000000000007",
  frameworksPhase: "DAF100000000000000000008",
  resourcesPhase: "DAF100000000000000000009",
  projectConfigs: "DAF100000000000000000010",
  targetConfigs: "DAF100000000000000000011",
  projectDebug: "DAF100000000000000000012",
  projectRelease: "DAF100000000000000000013",
  targetDebug: "DAF100000000000000000014",
  targetRelease: "DAF100000000000000000015",
};

const sharedScheme = `<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion="1600" version="1.7">
   <BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES">
      <BuildActionEntries>
         <BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES">
            <BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="${ids.target}"
                BuildableName="DevAfrica.app" BlueprintName="DevAfrica" ReferencedContainer="container:DevAfrica.xcodeproj"/>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB"
       selectedLauncherIdentifier="Xcode.DebuggerFoundation.Launcher.LLDB" launchStyle="0"
       useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES"
       debugServiceExtension="internal" allowLocationSimulation="YES">
      <BuildableProductRunnable runnableDebuggingMode="0">
         <BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="${ids.target}"
             BuildableName="DevAfrica.app" BlueprintName="DevAfrica" ReferencedContainer="container:DevAfrica.xcodeproj"/>
      </BuildableProductRunnable>
   </LaunchAction>
   <AnalyzeAction buildConfiguration="Debug"/>
   <ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"/>
</Scheme>
`;

function xcodeProject(title: string, id: string) {
  const projectSettings = `IPHONEOS_DEPLOYMENT_TARGET = 17.0;
            SDKROOT = iphoneos;
            CLANG_ENABLE_MODULES = YES;
            SUPPORTED_PLATFORMS = "iphoneos iphonesimulator";`;
  const appSettings = `CODE_SIGN_STYLE = Automatic;
            CURRENT_PROJECT_VERSION = 1;
            GENERATE_INFOPLIST_FILE = YES;
            INFOPLIST_KEY_CFBundleDisplayName = ${JSON.stringify(title)};
            INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
            INFOPLIST_KEY_UILaunchScreen_Generation = YES;
            LD_RUNPATH_SEARCH_PATHS = ("$(inherited)", "@executable_path/Frameworks");
            MARKETING_VERSION = 1.0;
            PRODUCT_BUNDLE_IDENTIFIER = "devafrica.atelier.ios.${id}";
            PRODUCT_NAME = "$(TARGET_NAME)";
            SWIFT_VERSION = 5.0;
            TARGETED_DEVICE_FAMILY = "1,2";`;
  return `// !$*UTF8*$!
{
    archiveVersion = 1;
    classes = {};
    objectVersion = 77;
    objects = {
        ${ids.project} = {
            isa = PBXProject;
            attributes = { BuildIndependentTargetsInParallel = 1; LastUpgradeCheck = 1600; };
            buildConfigurationList = ${ids.projectConfigs};
            developmentRegion = fr;
            hasScannedForEncodings = 0;
            knownRegions = (fr, en, Base);
            mainGroup = ${ids.group};
            preferredProjectObjectVersion = 77;
            productRefGroup = ${ids.products};
            projectDirPath = "";
            projectRoot = "";
            targets = (${ids.target});
        };
        ${ids.group} = {
            isa = PBXGroup;
            children = (${ids.sources}, ${ids.products});
            sourceTree = "<group>";
        };
        ${ids.sources} = {
            isa = PBXFileSystemSynchronizedRootGroup;
            path = Atelier;
            sourceTree = "<group>";
        };
        ${ids.products} = {
            isa = PBXGroup;
            children = (${ids.app});
            name = Products;
            sourceTree = "<group>";
        };
        ${ids.app} = {
            isa = PBXFileReference;
            explicitFileType = wrapper.application;
            includeInIndex = 0;
            path = DevAfrica.app;
            sourceTree = BUILT_PRODUCTS_DIR;
        };
        ${ids.target} = {
            isa = PBXNativeTarget;
            buildConfigurationList = ${ids.targetConfigs};
            buildPhases = (${ids.sourcesPhase}, ${ids.frameworksPhase}, ${ids.resourcesPhase});
            buildRules = ();
            dependencies = ();
            fileSystemSynchronizedGroups = (${ids.sources});
            name = DevAfrica;
            packageProductDependencies = ();
            productName = DevAfrica;
            productReference = ${ids.app};
            productType = "com.apple.product-type.application";
        };
        ${ids.sourcesPhase} = {
            isa = PBXSourcesBuildPhase;
            buildActionMask = 2147483647;
            files = ();
            runOnlyForDeploymentPostprocessing = 0;
        };
        ${ids.frameworksPhase} = {
            isa = PBXFrameworksBuildPhase;
            buildActionMask = 2147483647;
            files = ();
            runOnlyForDeploymentPostprocessing = 0;
        };
        ${ids.resourcesPhase} = {
            isa = PBXResourcesBuildPhase;
            buildActionMask = 2147483647;
            files = ();
            runOnlyForDeploymentPostprocessing = 0;
        };
        ${ids.projectConfigs} = {
            isa = XCConfigurationList;
            buildConfigurations = (${ids.projectDebug}, ${ids.projectRelease});
            defaultConfigurationIsVisible = 0;
            defaultConfigurationName = Release;
        };
        ${ids.targetConfigs} = {
            isa = XCConfigurationList;
            buildConfigurations = (${ids.targetDebug}, ${ids.targetRelease});
            defaultConfigurationIsVisible = 0;
            defaultConfigurationName = Release;
        };
        ${ids.projectDebug} = {
            isa = XCBuildConfiguration;
            buildSettings = {
            ${projectSettings}
            SWIFT_OPTIMIZATION_LEVEL = "-Onone";
            SWIFT_ACTIVE_COMPILATION_CONDITIONS = "DEBUG $(inherited)";
            };
            name = Debug;
        };
        ${ids.projectRelease} = {
            isa = XCBuildConfiguration;
            buildSettings = {
            ${projectSettings}
            };
            name = Release;
        };
        ${ids.targetDebug} = {
            isa = XCBuildConfiguration;
            buildSettings = {
            ${appSettings}
            };
            name = Debug;
        };
        ${ids.targetRelease} = {
            isa = XCBuildConfiguration;
            buildSettings = {
            ${appSettings}
            };
            name = Release;
        };
    };
    rootObject = ${ids.project};
}
`;
}

type SwiftProject = {
  id: string;
  view: string;
  notes: string;
  extra?: Record<string, string>;
  app?: string;
};

export function swiftFiles(
  title: string,
  { id, view, notes, extra, app }: SwiftProject,
): WebFiles {
  return {
    html: "",
    css: "",
    entry: swiftView,
    local: {
      runtime: "swift",
      sources: {
        [swiftView]: view.trim() + "\n",
        [swiftApp]:
          app ??
          `import SwiftUI

@main
struct DevAfricaApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
`,
        [`${projectPath}/project.pbxproj`]: xcodeProject(title, id),
        [`${projectPath}/xcshareddata/xcschemes/DevAfrica.xcscheme`]:
          sharedScheme,
        ".gitignore": ".DS_Store\nDerivedData/\nxcuserdata/\n",
        "README.md": `# ${title}

1. Sur un Mac, extrais le ZIP et ouvre DevAfrica.xcodeproj avec Xcode 16 ou plus récent.
2. Choisis le schéma DevAfrica et un simulateur iPhone sous iOS 17 ou plus récent.
3. Clique sur Run ou utilise Cmd + R. Pour un iPhone physique, sélectionne ton équipe de signature dans Xcode.

Le dossier Atelier contient les sources compilées par Xcode. Un fichier Swift ajouté sous
Atelier depuis l’éditeur est inclus dans le dossier synchronisé du projet.
ContentView.swift contient l’écran d’accueil. DevAfricaApp.swift définit le point d’entrée.
Pour choisir une version de Xcode compatible avec ton Mac, consulte https://developer.apple.com/xcode/system-requirements/.

${notes}
`,
        ...extra,
      },
    },
  };
}
