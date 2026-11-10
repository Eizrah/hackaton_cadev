import { springLaunchCommands } from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

export const springJava = "src/main/java/devafrica/atelier";
export const springTest = "src/test/java/devafrica/atelier";

const application = `package devafrica.atelier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AtelierApplication {
    public static void main(String[] args) {
        SpringApplication.run(AtelierApplication.class, args);
    }
}
`;

const errors = `package devafrica.atelier;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(ResponseStatusException.class)
    ProblemDetail handleStatus(ResponseStatusException error) {
        String reason = error.getReason() == null ? "La requête a échoué." : error.getReason();
        return ProblemDetail.forStatusAndDetail(error.getStatusCode(), reason);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail handleValidation(MethodArgumentNotValidException error) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Corrige les données envoyées.");
        Map<String, String> fields = new LinkedHashMap<>();
        error.getBindingResult().getFieldErrors()
                .forEach(field -> fields.putIfAbsent(field.getField(), field.getDefaultMessage()));
        problem.setProperty("fields", fields);
        return problem;
    }
}
`;

const postgresProfile = `spring.datasource.url=\${ATELIER_DB_URL}
spring.datasource.username=\${ATELIER_DB_USER}
spring.datasource.password=\${ATELIER_DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
`;

const dockerfile = `FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/atelier.jar ./atelier.jar
RUN mkdir -p /app/data && chown 10001:10001 /app/data
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "atelier.jar", "--server.address=0.0.0.0"]
`;

type SpringOptions = {
  entry: string;
  sources: Record<string, string>;
  intro: string;
  endpoints: string[];
  jpa?: boolean;
  postgres?: boolean;
  security?: boolean;
  notes?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function home(title: string, { intro, endpoints }: SpringOptions) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; background: #edf5fc; color: #173b5b; font: 1rem/1.6 system-ui, sans-serif; }
    main { max-width: 50rem; margin: auto; padding: clamp(1rem, 5vw, 3rem); }
    h1 { line-height: 1.2; }
    li { background: white; border: 1px solid #cbddec; border-radius: .65rem; margin-block: .6rem; padding: .7rem 1rem; }
    a { color: #12548d; }
    code { overflow-wrap: anywhere; }
  </style>
</head>
<body><main>
  <p>DEVAFRICA · ATELIER SPRING BOOT</p>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(intro)}</p>
  <ul>
${endpoints
  .map((endpoint) => {
    const text = escapeHtml(endpoint);
    return /^GET \/[\w/-]+$/.test(endpoint)
      ? `    <li><a href="${escapeHtml(endpoint.slice(4))}"><code>${text}</code></a></li>`
      : `    <li><code>${text}</code></li>`;
  })
  .join("\n")}
  </ul>
  <p>Ouvre README.md dans VS Code pour copier les requêtes d’exemple.</p>
</main></body>
</html>
`;
}

export function springFiles(title: string, options: SpringOptions): WebFiles {
  const { entry, sources, jpa, postgres, security, notes } = options;
  const dependencies = [
    ["org.springframework.boot", "spring-boot-starter-web"],
    ["org.springframework.boot", "spring-boot-starter-validation"],
    ...(jpa
      ? [
          ["org.springframework.boot", "spring-boot-starter-data-jpa"],
          ["com.h2database", "h2", "runtime"],
        ]
      : []),
    ...(postgres ? [["org.postgresql", "postgresql", "runtime"]] : []),
    ...(security
      ? [
          [
            "org.springframework.boot",
            "spring-boot-starter-oauth2-resource-server",
          ],
        ]
      : []),
    ["org.springframework.boot", "spring-boot-starter-test", "test"],
  ];
  return {
    html: "",
    css: "",
    entry,
    local: {
      runtime: "spring",
      sources: {
        ...sources,
        [`${springJava}/AtelierApplication.java`]: application,
        [`${springJava}/ApiErrors.java`]: errors,
        "src/main/resources/static/index.html": home(title, options),
        "src/main/resources/application.properties": `spring.application.name=devafrica-atelier
spring.profiles.default=dev
server.address=127.0.0.1
server.port=8080
server.error.include-message=never
spring.jackson.deserialization.fail-on-unknown-properties=true
${jpa ? "spring.jpa.open-in-view=false\n" : ""}${security ? "atelier.demo-password=${ATELIER_DEMO_PASSWORD:DevAfrica-Local-42}\n" : ""}`,
        "src/main/resources/application-dev.properties": jpa
          ? "spring.datasource.url=jdbc:h2:file:./data/atelier\nspring.datasource.username=sa\nspring.jpa.hibernate.ddl-auto=update\n"
          : "# Paramètres du profil de développement.\n",
        ...(jpa
          ? {
              "src/test/resources/application-test.properties":
                "spring.datasource.url=jdbc:h2:mem:atelier-test;DB_CLOSE_DELAY=-1\nspring.datasource.username=sa\nspring.jpa.hibernate.ddl-auto=create-drop\n",
              "data/.gitignore": "*\n!.gitignore\n",
            }
          : {}),
        ...(postgres
          ? {
              "src/main/resources/application-postgres.properties":
                postgresProfile,
            }
          : {}),
        ...(security
          ? {
              Dockerfile: dockerfile,
              ".dockerignore": "target\ndata\n.git\n",
              "src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker":
                "mock-maker-subclass\n",
            }
          : {}),
        ".gitignore": "/target/\n/data/*.db\n",
        "pom.xml": `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.16</version>
    <relativePath/>
  </parent>
  <groupId>devafrica</groupId>
  <artifactId>atelier</artifactId>
  <version>1.0.0</version>
  <properties><java.version>17</java.version></properties>
  <dependencies>
${dependencies
  .map(
    ([group, artifact, scope]) => `    <dependency>
      <groupId>${group}</groupId>
      <artifactId>${artifact}</artifactId>
${scope ? `      <scope>${scope}</scope>\n` : ""}    </dependency>`,
  )
  .join("\n")}
  </dependencies>
  <build>
    <finalName>atelier</finalName>
    <plugins>
      <plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
    </plugins>
  </build>
</project>
`,
        "README.md": `# ${title}

Installe un JDK Java 17 ou plus récent et Maven 3.6.3 ou plus récent.
Ouvre le dossier contenant pom.xml dans VS Code et lance les commandes.

\`\`\`powershell
${springLaunchCommands}
\`\`\`

Ouvre http://127.0.0.1:8080/. Les exemples PowerShell utilisent un second
terminal. Arrête le serveur avec Ctrl+C.
${jpa ? "\nLe profil dev utilise H2 et conserve la base dans data/. Le profil test utilise H2 en mémoire.\n" : ""}
${
  postgres
    ? `\nPour PostgreSQL, prépare une base vide, définis ATELIER_DB_URL
(par exemple jdbc:postgresql://localhost:5432/atelier), ATELIER_DB_USER et
ATELIER_DB_PASSWORD. Lance mvn spring-boot:run '-Dspring-boot.run.profiles=postgres'.\n`
    : ""
}
${
  security
    ? `\nPour vérifier le projet, lance mvn test. Pour produire target/atelier.jar,
lance mvn package. Le Dockerfile permet un test local avec docker build -t
devafrica-atelier . puis docker run --rm -p 127.0.0.1:8080:8080 devafrica-atelier.
Les comptes et la clé JWT générée au démarrage servent à l’exercice local.\n`
    : ""
}
${notes ?? ""}`,
      },
    },
  };
}
