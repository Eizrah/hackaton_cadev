import { useI18n } from "../i18n/context";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
export default function Modal({
  title,
  children,
  onClose,
  busy = false,
  size = "normal",
}: {
  size?: "normal"|"wide";
  title: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  const { t } = useI18n();
  const titleId=useId();

  const ref = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = busy ? () => {} : onClose;
  }, [busy, onClose]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex="0"]',
        ) || [],
      ).filter(element=>element.tabIndex>=0 && !!element.getClientRects().length);
    focusable()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab") return;
      const items = focusable(),
        first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);
  return createPortal(
    <div className="modal-backdrop modal-layer" onClick={busy ? undefined : onClose}>
      <section
        ref={ref}
        className={`panel modal ${size === "wide" ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="quiet"
            onClick={onClose}
            disabled={busy}
            aria-label={t("Fermer la fenêtre")}
          >
            <X size={21} />
          </button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  );
}
