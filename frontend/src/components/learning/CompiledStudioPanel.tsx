import { useId } from "react";
import { useI18n } from "../../i18n/context";
import {
  maxCompilerStdin,
  type CompilerLanguage,
  type CompilerResult,
} from "../../lib/compilerProtocol";

export default function CompiledStudioPanel({
  language,
  stdin,
  onInput,
  busy,
  result,
  error,
}: {
  language: CompilerLanguage;
  stdin: string;
  onInput: (text: string) => void;
  busy: boolean;
  result: CompilerResult | null;
  error: string;
}) {
  const { t } = useI18n();
  const inputId = useId();
  const interpreted = ["python", "nodejs", "php"].includes(language);
  const messages = {
    ok: interpreted
      ? t(
          "Vérification et exécution réussies.",
          "Checked and ran successfully.",
        )
      : t(
          "Compilation et exécution réussies.",
          "Compiled and ran successfully.",
        ),
    "compile-error": interpreted
      ? t(
          "Le code contient une erreur de syntaxe.",
          "The code contains a syntax error.",
        )
      : t(
          "Le compilateur a trouvé une erreur.",
          "The compiler found an error.",
        ),
    "runtime-error": t(
      "Le programme s’est arrêté avec une erreur.",
      "The program exited with an error.",
    ),
    timeout: t(
      "Le temps maximal a été atteint.",
      "The time limit was reached.",
    ),
    "output-limit": t(
      "La limite d’affichage a été atteinte.",
      "The output limit was reached.",
    ),
  };
  const errors: Record<string, string> = {
    busy: t(
      "Le compilateur est occupé. Réessaie dans un instant.",
      "The compiler is busy. Try again shortly.",
    ),
    invalid: t(
      "Vérifie les noms des fichiers et la taille du code ou de l’entrée.",
      "Check the filenames and the size of the code or input.",
    ),
    unavailable: t(
      "Le compilateur est indisponible. Ouvre les étapes de configuration ci-dessous.",
      "The compiler is unavailable. Open the setup instructions below.",
    ),
  };

  return (
    <div className="studio-local-guide studio-compiler">
      <h3>{t("Console de l’atelier", "Workshop console")}</h3>
      <label htmlFor={inputId}>
        {t("Entrée standard (stdin)", "Standard input (stdin)")}
      </label>
      <textarea
        id={inputId}
        rows={3}
        spellCheck={false}
        maxLength={maxCompilerStdin}
        value={stdin}
        onChange={(event) => onInput(event.target.value)}
        disabled={busy}
        placeholder={t(
          "Valeurs à lire par le programme",
          "Values for the program to read",
        )}
      />
      <p>
        {t(
          "Saisis les valeurs avant de lancer le programme. Tu peux en mettre une par ligne.",
          "Enter the values before running. You can place one value on each line.",
        )}
      </p>
      {language === "java" && (
        <p>
          {t(
            "Place la méthode main dans la classe Main du fichier Main.java.",
            "Put your main method in the Main class in Main.java.",
          )}
        </p>
      )}
      <div className="studio-compiler-result" role="status" aria-busy={busy}>
        {busy
          ? t("Compilation en cours…", "Compiling…")
          : error
            ? (errors[error] ?? errors.unavailable)
            : result
              ? messages[result.status]
              : t(
                  "Lance le programme pour voir le résultat.",
                  "Choose Compile and run to see the result.",
                )}
      </div>
      {result && (
        <div className="studio-compiler-streams">
          {result.diagnostics && (
            <section>
              <h4>{t("Messages du compilateur", "Compiler messages")}</h4>
              <pre>{result.diagnostics}</pre>
            </section>
          )}
          {result.stage === "run" && (
            <section>
              <h4>{t("Sortie du programme", "Program output")}</h4>
              <pre>
                {result.stdout ||
                  t(
                    "Programme terminé sans sortie.",
                    "Program finished with empty output.",
                  )}
              </pre>
            </section>
          )}
          {result.stderr && (
            <section>
              <h4>{t("Erreurs à l’exécution", "Runtime errors")}</h4>
              <pre>{result.stderr}</pre>
            </section>
          )}
        </div>
      )}
      <details open={error === "unavailable" || undefined}>
        <summary>{t("Activer la compilation", "Set up compilation")}</summary>
        <p>
          {t(
            "Démarre Docker en mode conteneurs Linux. Dans le dossier frontend, construis l’image de compilation une fois, puis lance DevAfrica avec npm run dev.",
            "Start Docker in Linux container mode. In the frontend folder, build the compiler image once, then launch DevAfrica with npm run dev.",
          )}
        </p>
        <pre>
          <code>npm run compiler:build</code>
        </pre>
      </details>
    </div>
  );
}
