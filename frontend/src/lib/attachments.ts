import { safePortfolio } from "./urls";
import { useEffect, useState } from "react";

export type StoredAttachment = { id: string; name: string; type: string; size: number; url?: string };
const database = "devafrica-files";
function openFiles(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(database, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains("files")) request.result.createObjectStore("files"); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("File storage unavailable"));
  });
}
export async function saveAttachment(file: File): Promise<StoredAttachment> {
  const db = await openFiles();
  const attachment = { id: crypto.randomUUID(), name: file.name, type: file.type || "application/octet-stream", size: file.size };
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").put(file, attachment.id);
      tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
    return attachment;
  } finally { db.close(); }
}
export async function discardAttachment(id: string): Promise<void> {
  const db = await openFiles();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").delete(id);
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}
export async function readAttachment(id: string): Promise<Blob | undefined> {
  const db = await openFiles();
  try { return await new Promise((resolve, reject) => { const request = db.transaction("files", "readonly").objectStore("files").get(id); request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : undefined); request.onerror = () => reject(request.error); }); }
  finally { db.close(); }
}
export function useAttachmentState(file?: StoredAttachment) {
  const [resolved, setResolved] = useState<{id:string;url?:string}>();
  const fileId=file?.id,remoteUrl=file?.url?safePortfolio(file.url):null;
  useEffect(() => {
    if (!fileId || remoteUrl) return;
    let cancelled = false, objectUrl = "";
    void readAttachment(fileId).then(blob => { if (cancelled) return; if (blob) objectUrl = URL.createObjectURL(blob); setResolved({id:fileId,url:objectUrl||undefined}); }).catch(() => { if (!cancelled) setResolved({id:fileId}); });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [fileId,remoteUrl]);
  return {url:remoteUrl || (resolved?.id === fileId ? resolved?.url : undefined),loading:!!fileId&&!remoteUrl&&resolved?.id!==fileId};
}
export function useAttachmentUrl(file?: StoredAttachment) { return useAttachmentState(file).url; }
export function fileSize(size: number) { return size >= 1024*1024 ? `${(size/(1024*1024)).toFixed(1)} MB` : `${Math.max(1,Math.round(size/1024))} KB`; }
export function attachmentsFrom(value: unknown): StoredAttachment[] {
  if (!Array.isArray(value)) return [];
  return value.filter((file):file is StoredAttachment => !!file && typeof file.id === "string" && typeof file.name === "string" && typeof file.type === "string" && typeof file.size === "number" && Number.isFinite(file.size) && file.size>=0);
}
