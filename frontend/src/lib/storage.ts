import { useCallback, useEffect, useRef, useState } from "react";
export type UpdateData<T> = (next: T | ((current: T) => T)) => void;

// Les données locales servent uniquement à la démo. Aucun mot de passe ni jeton ici.
// Une migration optionnelle conserve les anciennes données quand le modèle évolue.
export function useLocalData<T>(
  key: string,
  initial: T,
  migrate?: (saved: unknown) => T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`devafrica:${key}`);
      if (!raw) return initial;
      const parsed: unknown = JSON.parse(raw);
      return migrate ? migrate(parsed) : (parsed as T);
    } catch {
      return initial;
    }
  });
  const current = useRef(value);
  useEffect(() => {
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; value: T }>).detail;
      if (detail.key === key && detail.value !== current.current) {
        current.current = detail.value;
        setValue(detail.value);
      }
    };
    window.addEventListener("devafrica:store", sync);
    return () => window.removeEventListener("devafrica:store", sync);
  }, [key]);
  const update = useCallback<UpdateData<T>>((next) => {
    const result =
      typeof next === "function"
        ? (next as (value: T) => T)(current.current)
        : next;
    current.current = result;
    setValue(result);
    window.dispatchEvent(
      new CustomEvent("devafrica:store", { detail: { key, value: result } }),
    );
    try {
      localStorage.setItem(`devafrica:${key}`, JSON.stringify(result));
    } catch {
      /* La session reste utilisable. */
    }
  }, [key]);
  return [value, update] as const;
}
