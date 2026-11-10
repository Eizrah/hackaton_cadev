import { courses, domains } from "../data/learning";
const descriptions:Record<string,[string,string,string]>={
"html-css-web":["HTML5 & CSS3","Frontend · markup and styling","Structure, style and responsive interfaces: three levels, guided lessons and six mini-projects in your code studio."],
"javascript-web":["JavaScript: making a page interactive","Frontend · programming","Three levels covering the DOM, fetching data and organizing applications. Six mini-projects to run in the studio."],
"react-web":["React: thinking in components","Frontend · UI library","Three levels covering JSX, hooks, routing and TypeScript. Six mini-projects with an interactive preview."],
"vue-web":["Vue.js: a progressive interface","Frontend · framework","Three levels for reactive Vue 3 interfaces, from components to Pinia and Nuxt. Six mini-projects to practice."],
"django-web":["Django","Backend · Python framework","Three levels connecting URLs, templates, databases and REST APIs. Six exportable mini-projects to run with Python."],
"node-web":["Node.js & Express","Backend · runtime and framework","Three levels for Express APIs, MongoDB, JWT and Socket.IO. Six projects to run with Node.js."],
"php-web":["Laravel","Backend · PHP framework","Three levels for Blade pages, Eloquent databases and Sanctum APIs. Six projects to run with PHP."],
"java-web":["Spring Boot","Backend · Java framework","Three levels for Java APIs, JPA and Spring Security. Six projects to run with Maven."],
"kotlin-mobile":["Kotlin: the language","Mobile · Android language","Three levels of console Kotlin: variables, null safety, collections, coroutines and Flow through six projects."],
"compose-mobile":["Jetpack Compose: building a screen","Mobile · UI toolkit","Three levels for Android screens, state, navigation and animations. Six Android Studio projects."],
"java-mobile":["Java for Android","Mobile · Java and XML views","Three levels for XML screens, lists and connecting APIs to SQLite. Six Android Studio projects."],
"swift-mobile":["Swift & SwiftUI: building for iOS","Mobile · language and interface","Three levels for Swift, SwiftUI views, APIs and SwiftData. Six Xcode projects."],
"flutter-mobile":["Flutter & Dart: a shared interface","Mobile · framework and language","Three levels for widgets, navigation, shared state and Isar persistence. Six Flutter projects."],
"react-native-mobile":["React Native: React on mobile","Mobile · framework","Three levels for native screens, navigation, a shop and an exchange-rate dashboard. Six Expo projects."],
"lang-c":["C","Systems and native programming","From console programs to GTK 4 interfaces, with variables, functions and pointers."],
"lang-cpp":["C++","Desktop and systems","From functions and instances to Qt 6 windows and Qt Designer."],
"lang-java":["Java","Backend, desktop and Android","From your first classes to JavaFX interfaces, FXML and Scene Builder."],
"lang-python":["Python","Backend, data and desktop","From scripts, instances and files to CustomTkinter windows."],
"lang-javascript":["JavaScript","Frontend and backend","Node.js script logic, followed by Electron applications."],
"lang-typescript":["TypeScript","Frontend and backend","Types, interfaces and generics, followed by Qt windows with NodeGui."],
"lang-php":["PHP","Web backend","From CLI scripts to objects and PHP Desktop interfaces."],
"lang-swift":["Swift","Apple mobile and desktop","A language from the Apple ecosystem."],
"lang-sql":["SQL","Databases","A SQLite terminal to create, query and join tables."]
};
export const catalogEnglish:Record<string,string>={};
for(const course of courses){const value=descriptions[course.id];if(value){catalogEnglish[course.title]=value[0];catalogEnglish[course.role]=value[1];catalogEnglish[course.description]=value[2];}}
const domainEnglish=[['Web','FROM SITES TO APPLICATIONS','Build what you see in a browser, what runs on a server, or both.'],['Mobile','IDEAS IN YOUR POCKET','Learn to build applications for Android, iPhone or both.'],['Programming languages','WORDS THAT MAKE MACHINES ACT','Explore Python, C, C++, Java, JavaScript, TypeScript, PHP, Swift and SQL.']];
for(const [index,domain]of domains.entries()){catalogEnglish[domain.title]=domainEnglish[index][0];catalogEnglish[domain.subtitle]=domainEnglish[index][1];catalogEnglish[domain.description]=domainEnglish[index][2];}
Object.assign(catalogEnglish,{
"Un même langage peut servir dans plusieurs domaines. Les fiches précisent ses usages et outils associés.":"One language can serve several fields. Each course explains its uses and related tools.",
"Choisis un parcours ou explore les fiches ci-dessous.":"Choose a path or explore the courses below.",
"La partie visuelle : pages, boutons, animations et interactions. Commence par HTML, CSS et JavaScript.":"The visual part: pages, buttons, animations and interactions. Start with HTML, CSS and JavaScript.",
"Les frameworks du serveur pour construire des routes, des API et des applications reliées à une base de données.":"Server frameworks for routes, APIs and applications connected to a database.",
"Apprends Kotlin et Jetpack Compose, ou construis des écrans Android avec Java et XML.":"Learn Kotlin and Jetpack Compose, or build Android screens with Java and XML.",
"Flutter avec Dart ou React Native avec JavaScript et TypeScript.":"Flutter with Dart, or React Native with JavaScript and TypeScript.",
"Projet":"Project","Question & découverte":"Question & discovery","Publication":"Post","Multiplateforme":"Cross-platform","CDI":"Permanent","CDD":"Fixed-term","Freelance":"Freelance","Alternance":"Work-study","Découverte":"Discovery","Publication bloquée":"Post blocked","Groupe supprimé":"Group deleted","Participation au groupe modifiée":"Group membership updated",
});
