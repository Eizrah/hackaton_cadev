import { useEffect, useRef, useState } from "react";
import { Download, FileText, LoaderCircle, Paperclip, X } from "lucide-react";
import { fileSize, saveAttachment, useAttachmentState, type StoredAttachment } from "../../lib/attachments";
import { useI18n } from "../../i18n/context";
export function AttachmentPicker({ onAdd, label, accept, multiple = false, onBusy }: { onAdd: (files: StoredAttachment[]) => void; label: string; accept?: string; multiple?: boolean; onBusy?: (busy: boolean) => void }) {
  const { t } = useI18n(), input = useRef<HTMLInputElement>(null), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  return <div className="attachment-picker">
    <button
      type="button"
      className="attachment-pick-button"
      title={label}
      aria-label={label}
      disabled={busy}
      onClick={() => input.current?.click()}>
      {busy ? <LoaderCircle
        size={20}
        className="spin" /> : <Paperclip size={21} />}
      <span>
        {label}
      </span>
    </button>
    <input
      ref={input}
      aria-hidden="true"
      tabIndex={-1}
      className="file-picker-input"
      type="file"
      accept={accept}
      multiple={multiple}
      aria-label={label}
      onChange={async event => { const element = event.currentTarget, files = Array.from(element.files || []); if (!files.length) return; setError(""); if (files.some(f => f.size > 10 * 1024 * 1024) || files.length > 5) { setError(t("Choisis jusqu’à 5 fichiers de 10 Mo maximum chacun.", "Choose up to 5 files, at most 10 MB each.")); element.value = ""; return; } setBusy(true); onBusy?.(true); try { const saved = await Promise.all(files.map(saveAttachment)); if (mounted.current) onAdd(saved); } catch { if (mounted.current) setError(t("Impossible de conserver le fichier sur cet appareil. Vérifie l’espace disponible.", "Could not save the file on this device. Check the available storage.")); } finally { if (mounted.current) setBusy(false); onBusy?.(false); element.value = ""; } }} />
    {error && <p
      className="form-error"
      role="alert">
      {t(error)}
    </p>}
  </div>;
}
export function AttachmentCard({ file, onRemove, preview = true }: { file: StoredAttachment; onRemove?: () => void; preview?: boolean }) {
  const { t } = useI18n(), { url, loading } = useAttachmentState(file);
  return <div className={`attachment-card ${file.type.startsWith("image/") && preview ? "with-image" : ""}`}>
    {file.type.startsWith("image/") && preview && url ? <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="attachment-image">
      <img
        src={url}
        alt={file.name} />
    </a> : <FileText size={23} />}
    <div>
      {url ? <a
        href={url}
        target="_blank"
        rel="noopener noreferrer">
        {file.name}
        <Download size={14} />
      </a> : <span>
        {file.name}
      </span>}
      <small>
        {fileSize(file.size)}
        {!url && ` · ${loading ? t("Chargement du fichier…", "Loading file…") : t("Fichier indisponible sur cet appareil", "File unavailable on this device")}`}
      </small>
    </div>
    {onRemove && <button
      className="quiet"
      type="button"
      aria-label={`${t("Retirer", "Remove")} ${file.name}`}
      onClick={onRemove}>
      <X size={16} />
    </button>}
  </div>;
}
