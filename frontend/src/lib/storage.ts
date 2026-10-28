import { useRef, useState } from "react";
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
  const update: UpdateData<T> = (next) => {
    const result =
      typeof next === "function"
        ? (next as (value: T) => T)(current.current)
        : next;
    current.current = result;
    setValue(result);
    try {
      localStorage.setItem(`devafrica:${key}`, JSON.stringify(result));
    } catch {
      /* La session reste utilisable. */
    }
  };
  return [value, update] as const;
}
