import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import {
  maxSqlBytes,
  quoteIdentifier,
  type SqlCell,
  type SqlReply,
  type SqlRequest,
  type SqlResult,
} from "./protocol";

let engine: SqlJsStatic;
let committed: Uint8Array;
const scope = self as unknown as Pick<Worker, "onmessage" | "postMessage">;

function cell(value: unknown): SqlCell {
  if (value instanceof Uint8Array) return `[BLOB ${value.byteLength} octets]`;
  return value === null || typeof value === "number" ? value : String(value);
}

function run(db: Database, query: string) {
  const results: SqlResult[] = [];
  let statements = 0;
  for (const statement of db.iterateStatements(query)) {
    if (++statements > 40)
      throw new Error("Un lot peut contenir au maximum 40 instructions.");
    const columns = statement.getColumnNames();
    if (columns.length > 100)
      throw new Error("Affiche au maximum 100 colonnes par résultat.");
    const rows: SqlCell[][] = [];
    let outputSize = 0;
    let truncated = false;
    while (statement.step()) {
      if (columns.length) {
        if (rows.length === 200) {
          truncated = true;
          break;
        }
        const row = statement.get().map(cell);
        outputSize += new TextEncoder().encode(JSON.stringify(row)).byteLength;
        if (outputSize > 262144) {
          truncated = true;
          break;
        }
        rows.push(row);
      }
    }
    if (columns.length) {
      if (results.length === 8)
        throw new Error("Affiche au maximum huit résultats par lot.");
      results.push({ columns, rows, truncated });
    }
  }
  return results;
}

scope.onmessage = async ({ data }: MessageEvent<SqlRequest>) => {
  const { id, setup, query, snapshot } = data;
  let db: Database | undefined;
  try {
    engine ??= await initSqlJs({ locateFile: () => wasmUrl });
    db = new engine.Database(snapshot ?? committed);
    db.run(
      "PRAGMA hard_heap_limit = 16777216; PRAGMA foreign_keys = ON; PRAGMA max_page_count = 512;",
    );
    let results: SqlResult[] = [];
    let changed = 0;
    if (setup !== undefined) {
      db.close();
      db = snapshot ? new engine.Database(snapshot) : new engine.Database();
      db.run(
        "PRAGMA hard_heap_limit = 16777216; PRAGMA foreign_keys = ON; PRAGMA max_page_count = 512;",
      );
      if (!snapshot) db.run(setup);
    } else if (query !== undefined) {
      if (query.length > 64_000 || !query.trim())
        throw new Error("Écris une requête de 1 à 64 000 caractères.");
      results = run(db, query);
      try {
        db.run("COMMIT");
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !error.message.includes("no transaction is active")
        )
          throw error;
      }
      changed = Number(db.exec("SELECT total_changes()")[0]?.values[0][0] ?? 0);
    }
    const tableNames =
      db.exec(
        "SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
      )[0]?.values ?? [];
    const tables = tableNames.map(([name]) => ({
      name: String(name),
      columns: (
        db!.exec(`PRAGMA table_info(${quoteIdentifier(String(name))})`)[0]
          ?.values ?? []
      ).map((row) => String(row[1])),
    }));
    const bytes = db.export();
    if (bytes.byteLength > maxSqlBytes)
      throw new Error(
        "La base dépasse la limite de 2 Mio. Réduis les données de l’exercice.",
      );
    committed = bytes;
    scope.postMessage({
      id,
      results,
      tables,
      changed,
      snapshot: bytes,
    } satisfies SqlReply);
  } catch (error) {
    scope.postMessage({
      id,
      error: error instanceof Error ? error.message : String(error),
    } satisfies SqlReply);
  } finally {
    db?.close();
  }
};
