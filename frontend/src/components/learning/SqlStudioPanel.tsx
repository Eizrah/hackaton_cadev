import { useId, useState } from "react";
import {
  Database,
  Download,
  History,
  Play,
  RotateCcw,
  Table2,
} from "lucide-react";
import { useI18n } from "../../i18n/context";
import { quoteIdentifier, type SqlResult } from "../../lib/sql/protocol";
import type { SqlStudio } from "../../lib/sql/useSqlStudio";

function download(name: string, bytes: Uint8Array | string, type: string) {
  const blob = new Blob(
    [typeof bytes === "string" ? bytes : Uint8Array.from(bytes)],
    { type },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function csv(result: SqlResult) {
  return (
    "\uFEFF" +
    [result.columns, ...result.rows]
      .map((row) =>
        row
          .map((value) => {
            const text = value === null ? "" : String(value);
            const safe =
              /^[=+\-@\t\r]/.test(text) && typeof value === "string"
                ? "'" + text
                : text;
            return '"' + safe.replaceAll('"', '""') + '"';
          })
          .join(","),
      )
      .join("\r\n")
  );
}
export default function SqlStudioPanel({
  studio,
  busy,
  onRun,
  onReset,
}: {
  studio: SqlStudio;
  busy: boolean;
  onRun: (query: string) => void;
  onReset: () => void;
}) {
  const { t } = useI18n();
  const id = useId();
  const [query, setQuery] = useState(
    "SELECT name FROM sqlite_schema WHERE type = 'table';",
  );
  const [tab, setTab] = useState<"results" | "tables" | "history">("results");
  const [confirmReset, setConfirmReset] = useState(false);
  function execute(sql: string) {
    setTab("results");
    onRun(sql);
  }
  return (
    <div className="sql-panel">
      <header>
        <span>
          <Database size={17} /> SQLite ·{" "}
          {t("Ton espace SQL", "Your SQL workspace")}
        </span>
        <button
          disabled={busy || !studio.snapshot}
          onClick={() =>
            studio.snapshot &&
            download(
              "devafrica.sqlite",
              studio.snapshot,
              "application/vnd.sqlite3",
            )
          }
          title={t("Exporter la base SQLite", "Export SQLite database")}
          aria-label={t("Exporter la base SQLite", "Export SQLite database")}
        >
          <Download size={16} />
        </button>
      </header>
      <p>
        {t(
          "Exécute le fichier SQL avec le bouton de l’éditeur ou écris une requête ci-dessous.",
          "Run the SQL file using the editor button or write a query below.",
        )}
      </p>
      <label htmlFor={id}>{t("Terminal SQL", "SQL terminal")}</label>
      <textarea
        id={id}
        value={query}
        maxLength={64000}
        rows={4}
        spellCheck={false}
        disabled={busy || !studio.ready}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            if (!busy && studio.ready) execute(query);
          }
        }}
      />
      <div className="sql-actions">
        <button
          className="sql-execute"
          disabled={busy || !studio.ready || !query.trim()}
          onClick={() => execute(query)}
        >
          <Play size={14} />{" "}
          {busy
            ? t("Exécution…", "Running…")
            : t("Exécuter la requête", "Run query")}
        </button>
        <button
          disabled={busy || !studio.ready}
          onClick={() => setConfirmReset(!confirmReset)}
        >
          <RotateCcw size={14} /> {t("Réinitialiser la base", "Reset database")}
        </button>
      </div>
      {confirmReset && (
        <div className="sql-reset">
          <p>
            {t(
              "Restaurer les tables et données de départ de cet atelier ?",
              "Restore this workshop’s original tables and data?",
            )}
          </p>
          <button
            disabled={busy}
            onClick={() => {
              setConfirmReset(false);
              onReset();
            }}
          >
            {t("Restaurer la base", "Restore database")}
          </button>
          <button onClick={() => setConfirmReset(false)}>
            {t("Annuler", "Cancel")}
          </button>
        </div>
      )}
      <div
        className={studio.error ? "sql-message sql-error" : "sql-message"}
        role="status"
      >
        {studio.error ||
          (busy
            ? t("Requête en cours…", "Running query…")
            : studio.ready
              ? t(
                  `${studio.changed} ligne(s) modifiée(s).`,
                  `${studio.changed} row(s) changed.`,
                )
              : t("Préparation de SQLite…", "Preparing SQLite…"))}
      </div>
      {!studio.saved && (
        <p>
          {t(
            "La session reste ouverte. Exporte la base pour conserver tes données.",
            "The session is open. Export the database to keep your data.",
          )}
        </p>
      )}
      <div
        className="sql-tabs"
        role="tablist"
        aria-label={t("Données SQL", "SQL data")}
      >
        {(
          [
            ["results", Table2, t("Résultats", "Results")],
            ["tables", Database, t("Tables", "Tables")],
            ["history", History, t("Historique", "History")],
          ] as const
        ).map(([value, Icon, label]) => (
          <button
            key={value}
            id={id + value}
            role="tab"
            aria-selected={tab === value}
            aria-controls={id + "panel"}
            onClick={() => setTab(value)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
      <div
        id={id + "panel"}
        role="tabpanel"
        aria-labelledby={id + tab}
        className="sql-data"
      >
        {tab === "results" &&
          (studio.results.length ? (
            studio.results.map((result, index) => (
              <section key={index}>
                <div className="sql-result-heading">
                  <strong>
                    {t(`Résultat ${index + 1}`, `Result ${index + 1}`)} ·{" "}
                    {result.rows.length} {t("ligne(s)", "row(s)")}
                  </strong>
                  <button
                    aria-label={t(
                      `Exporter le résultat ${index + 1} en CSV`,
                      `Export result ${index + 1} as CSV`,
                    )}
                    onClick={() =>
                      download(
                        `resultat-${index + 1}.csv`,
                        csv(result),
                        "text/csv;charset=utf-8",
                      )
                    }
                  >
                    <Download size={14} />
                    CSV
                  </button>
                </div>
                <div
                  className="sql-table-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label={t(
                    `Tableau du résultat ${index + 1}`,
                    `Result table ${index + 1}`,
                  )}
                >
                  <table>
                    <thead>
                      <tr>
                        {result.columns.map((column, col) => (
                          <th scope="col" key={col}>
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, n) => (
                        <tr key={n}>
                          {row.map((value, col) => (
                            <td key={col}>
                              {value === null ? <em>NULL</em> : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.truncated && (
                  <p>
                    {t(
                      "L’aperçu est limité à 200 lignes et 256 Kio. Ajoute WHERE ou LIMIT pour préciser la recherche.",
                      "The preview is limited to 200 rows and 256 KiB. Add WHERE or LIMIT to refine the query.",
                    )}
                  </p>
                )}
              </section>
            ))
          ) : (
            <p>
              {t(
                "Les tableaux de tes requêtes SELECT apparaîtront ici.",
                "Your SELECT result tables will appear here.",
              )}
            </p>
          ))}
        {tab === "tables" &&
          (studio.tables.length ? (
            studio.tables.map((table) => (
              <button
                className="sql-schema"
                key={table.name}
                disabled={busy}
                onClick={() => {
                  const sql = `SELECT * FROM ${quoteIdentifier(table.name)} LIMIT 50;`;
                  setQuery(sql);
                  execute(sql);
                }}
              >
                <strong>
                  <Table2 size={15} />
                  {table.name}
                </strong>
                <span>{table.columns.join(" · ")}</span>
              </button>
            ))
          ) : (
            <p>
              {t(
                "Commence par CREATE TABLE pour créer une table.",
                "Start with CREATE TABLE to create a table.",
              )}
            </p>
          ))}
        {tab === "history" &&
          (studio.history.length ? (
            studio.history.map((sql, index) => (
              <button
                className="sql-history"
                key={index}
                onClick={() => {
                  setQuery(sql);
                  document.getElementById(id)?.focus();
                }}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                <code>{sql}</code>
              </button>
            ))
          ) : (
            <p>
              {t(
                "Tes vingt dernières requêtes réussies seront conservées ici.",
                "Your last twenty successful queries will be kept here.",
              )}
            </p>
          ))}
      </div>
      <small>
        {t(
          "Base enregistrée pour cet atelier dans ce navigateur. Un lot échoué conserve les données précédentes.",
          "Database saved for this workshop in this browser. Failed batches preserve the previous data.",
        )}
      </small>
    </div>
  );
}
