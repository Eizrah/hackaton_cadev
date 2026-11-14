import { useState } from "react";
import { apiError } from "../../api/client";
import { useI18n } from "../../i18n/context";
import Modal from "../Modal";

export default function ConfirmDialog({ title, description, onConfirm, onClose }: {
  title: string;
  description?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(apiError(err, t("La suppression a échoué.", "Deletion failed.")));
    } finally {
      setBusy(false);
    }
  }

  return <Modal title={title} onClose={onClose} busy={busy}>
    {description && <p>{description}</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="modal-actions">
      <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>{t("Annuler", "Cancel")}</button>
      <button type="button" className="btn-primary btn-danger" onClick={() => void submit()} disabled={busy}>
        {busy ? t("Suppression…", "Deleting…") : t("Supprimer", "Delete")}
      </button>
    </div>
  </Modal>;
}
