import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { publicationApi, type Enregistrement, type Signet } from "../api/publication";

export function useSavedPublications() {
  const [items, setItems] = useState<Enregistrement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const changing = useRef(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    void publicationApi.getEnregistrements().then(({ data }) => {
      if (active) setItems(data);
    }).catch(() => {
      if (active) setError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [reload]);

  async function change(action: () => Promise<void>) {
    if (changing.current || loading || error) return false;
    changing.current = true;
    setBusy(true);
    try {
      await action();
      return true;
    } finally {
      changing.current = false;
      setBusy(false);
    }
  }

  function remove(id: number) {
    return change(async () => {
      try {
        await publicationApi.supprimerEnregistrement(id);
      } catch (err) {
        if (!isAxiosError(err) || err.response?.status !== 404) throw err;
      }
      setItems(current => current.filter(item => item.id !== id));
    });
  }

  function saved(type: Signet["type"], publicationId: string) {
    return items.find(item => item.type === type && item.publication.id === publicationId);
  }

  function toggle(item: Signet) {
    const existing = saved(item.type, item.publication.id);
    if (existing) return remove(existing.id);
    return change(async () => {
      const { data } = await publicationApi.enregistrer(item.type, item.publication.id);
      setItems(current => [{ ...item, id: data.id, date_enregistrement: new Date().toISOString() }, ...current]);
    });
  }

  return { items, loading, error, busy, saved, toggle, remove, retry: () => setReload(value => value + 1) };
}
