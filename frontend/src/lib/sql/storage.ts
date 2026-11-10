import { maxSqlBytes } from "./protocol";

type SavedSql = { bytes: Uint8Array; history: string[] };
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("devafrica-sql", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("workshops");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function readSql(key: string): Promise<SavedSql | undefined> {
  const db = await open();
  try {
    return await new Promise((resolve, reject) => {
      const request = db
        .transaction("workshops")
        .objectStore("workshops")
        .get(key);
      request.onsuccess = () => {
        const value = request.result as SavedSql | undefined;
        resolve(
          value?.bytes instanceof Uint8Array &&
            value.bytes.length <= maxSqlBytes &&
            Array.isArray(value.history)
            ? {
                bytes: value.bytes,
                history: value.history
                  .filter((q): q is string => typeof q === "string")
                  .slice(0, 20),
              }
            : undefined,
        );
      };
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
export async function saveSql(key: string, value: SavedSql) {
  const db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("workshops", "readwrite");
      tx.objectStore("workshops").put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
