export function djangoLaunchCommands(windows: boolean) {
  const python = windows
    ? ".\\.venv\\Scripts\\python.exe"
    : "./.venv/bin/python";
  return [
    windows ? "py -m venv .venv" : "python3 -m venv .venv",
    `${python} -m pip install -r requirements.txt`,
    `${python} manage.py makemigrations atelier`,
    `${python} manage.py migrate`,
    `${python} manage.py runserver`,
  ].join("\n");
}

export const laravelLaunchCommands = [
  "composer install",
  "php scripts/setup.php",
  "php artisan migrate",
  "php artisan serve --host=127.0.0.1 --port=8001",
].join("\n");

export const springLaunchCommands =
  "java -version\nmvn -v\nmvn spring-boot:run";

export const nodeLaunchCommands =
  "npm install\nnpm run setup --if-present\nnpm start";

export const kotlinLaunchCommands =
  "java -version\nmvn -v\nmvn -q compile exec:java";

export function androidBuildCommand(windows: boolean) {
  return windows
    ? ".\\gradlew.bat assembleDebug"
    : "sh ./gradlew assembleDebug";
}

export const flutterLaunchCommands =
  "flutter doctor\nflutter create --empty --platforms=android,ios .\nflutter pub get\nflutter run";

export const expoLaunchCommands = "npm install\nnpm start";

export const cLaunchCommands = "gcc -std=c17 main.c -lm -o atelier\n./atelier";
export const cppLaunchCommands =
  "g++ -std=c++20 main.cpp -o atelier\n./atelier";
export const javaLaunchCommands = "javac -encoding UTF-8 *.java\njava Main";

export const gtkLaunchCommands =
  "gcc -std=c17 main.c -o atelier $(pkg-config --cflags --libs gtk4)\n./atelier";
export const qtLaunchCommands =
  "cmake -S . -B build\ncmake --build build --config Debug";
export const javafxLaunchCommands = "mvn javafx:run";
