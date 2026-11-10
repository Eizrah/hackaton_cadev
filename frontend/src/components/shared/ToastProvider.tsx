import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { useI18n } from "../../i18n/context";
import { ToastContext } from "../../lib/toastContext";
export default function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [items, setItems] = useState<{ id: number; message: string }[]>([]);
  const next = useRef(0), timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const notify = useCallback((message: string) => {
    const id = ++next.current;
    setItems(current => [...current.slice(-3), { id, message }]);
    timers.current.push(setTimeout(() => setItems(current => current.filter(t => t.id !== id)), 6500));
  }, []);
  return <ToastContext.Provider value={notify}>
    {children}
    <div
      className="toast-stack"
      aria-live="polite"
      aria-relevant="additions text">
      {items.map(item => <div
        className="toast-card"
        role="status"
        key={item.id}>
        <span className="toast-icon">
          {/impossible|erreur/i.test(item.message) ? <Info size={22} /> : <CheckCircle2 size={22} />}
        </span>
        <p>
          {t(item.message)}
        </p>
        <button
          type="button"
          aria-label={t("Fermer la confirmation", "Close confirmation")}
          onClick={() => setItems(current => current.filter(t => t.id !== item.id))}>
          <X size={18} />
        </button>
      </div>)}
    </div>
  </ToastContext.Provider>;
}
