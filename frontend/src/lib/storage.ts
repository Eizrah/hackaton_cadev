import { useState } from "react";
// Uniquement des données de démonstration : ne jamais enregistrer de mot de passe ici.
export function useLocalData<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(`devafrica:${key}`);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });
  function update(next: T) {
    setValue(next);
    try {
      localStorage.setItem(`devafrica:${key}`, JSON.stringify(next));
    } catch {
      /* La session reste utilisable si le stockage est bloqué. */
    }
  }
  return [value, update] as const;
}
