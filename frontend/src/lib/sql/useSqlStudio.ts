import { useEffect, useRef, useState } from "react";
import { readSql, saveSql } from "./storage";
import type { SqlReply, SqlRequest, SqlResult, SqlTable } from "./protocol";

export function useSqlStudio(key: string | null, setup: string) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SqlResult[]>([]);
  const [tables, setTables] = useState<SqlTable[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [changed, setChanged] = useState(0);
  const [saved, setSaved] = useState(true);
  const [downloadSnapshot, setDownloadSnapshot] = useState<Uint8Array>();
  const worker = useRef<Worker | null>(null);
  const snapshot = useRef<Uint8Array | undefined>(undefined);
  const nextId = useRef(0);
  const request = useRef<
    ((data: Omit<SqlRequest, "id">) => Promise<SqlReply>) | null
  >(null);
  const cancel = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!key) return;
    let active = true;
    function recover() {
      if (!active) return;
      worker.current?.terminate();
      setReady(false);
      start();
      void request.current!({ setup, snapshot: snapshot.current })
        .then((reply) => {
          if (active && !reply.error) setReady(true);
          else if (active)
            setError(
              reply.error ?? "Recharge cet atelier pour relancer SQLite.",
            );
        })
        .catch(() => {
          if (active) setError("Recharge cet atelier pour relancer SQLite.");
        });
    }
    function start() {
      const instance = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });
      worker.current = instance;
      request.current = (data) =>
        new Promise((resolve, reject) => {
          const id = ++nextId.current;
          const timer = window.setTimeout(
            () => {
              cleanup();
              instance.terminate();
              reject(
                new Error(
                  "La requête a dépassé trois secondes. La base précédente est conservée.",
                ),
              );
              if (data.setup === undefined) recover();
            },
            data.setup !== undefined ? 15_000 : 3000,
          );
          function cleanup() {
            clearTimeout(timer);
            cancel.current = null;
          }
          cancel.current = () => {
            cleanup();
            reject(new Error("Atelier fermé."));
          };
          instance.onmessage = ({ data: reply }: MessageEvent<SqlReply>) => {
            if (reply.id === id) {
              cleanup();
              resolve(reply);
              if (
                data.setup === undefined &&
                reply.error?.includes("out of memory")
              )
                recover();
            }
          };
          instance.onerror = () => {
            cleanup();
            reject(new Error("SQLite est indisponible. Recharge l’atelier."));
            if (data.setup === undefined) recover();
          };
          instance.postMessage({ ...data, id });
        });
    }
    start();
    void (async () => {
      let stored;
      try {
        stored = await readSql(key);
      } catch {
        if (active) setSaved(false);
      }
      if (!active) return;
      snapshot.current = stored?.bytes;
      setHistory(stored?.history ?? []);
      try {
        const reply = await request.current!({
          setup,
          snapshot: stored?.bytes,
        });
        if (!active) return;
        if (reply.error) throw new Error(reply.error);
        snapshot.current = reply.snapshot;
        setDownloadSnapshot(reply.snapshot);
        setTables(reply.tables ?? []);
        setReady(true);
      } catch (failure) {
        if (active)
          setError(
            String(failure instanceof Error ? failure.message : failure),
          );
      }
    })();
    return () => {
      active = false;
      cancel.current?.();
      worker.current?.terminate();
      request.current = null;
    };
  }, [key, setup]);

  async function execute(query: string, reset = false) {
    if (!key || !request.current || !ready) return;
    setError("");
    try {
      const reply = await request.current(reset ? { setup } : { query });
      if (reply.error) throw new Error(reply.error);
      snapshot.current = reply.snapshot;
      setDownloadSnapshot(reply.snapshot);
      setResults(reply.results ?? []);
      setTables(reply.tables ?? []);
      setChanged(reply.changed ?? 0);
      const entries = reset
        ? []
        : [query, ...history.filter((previous) => previous !== query)].slice(
            0,
            20,
          );
      setHistory(entries);
      try {
        await saveSql(key, { bytes: reply.snapshot!, history: entries });
        setSaved(true);
      } catch {
        setSaved(false);
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    }
  }
  return {
    ready,
    error,
    results,
    tables,
    history,
    changed,
    saved,
    snapshot: downloadSnapshot,
    execute,
  };
}
export type SqlStudio = ReturnType<typeof useSqlStudio>;
