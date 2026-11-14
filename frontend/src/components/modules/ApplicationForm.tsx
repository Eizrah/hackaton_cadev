import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Paperclip, Send, X } from "lucide-react";
import { publicationApi } from "../../api/publication";
import { apiError } from "../../api/client";
import { useI18n } from "../../i18n/context";
import { safePortfolio } from "../../lib/urls";
import Modal from "../Modal";

export default function ApplicationForm({ offreId, onClose, onSuccess }: {
  offreId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useI18n();
  const fileInput = useRef<HTMLInputElement>(null);
  const [cv, setCv] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(t("Le CV ne doit pas dépasser 5 Mo.", "The CV must be 5 MB or smaller."));
      return;
    }
    if (!/\.pdf$/i.test(file.name) || await file.slice(0, 5).text() !== "%PDF-") {
      setError(t("Choisis un CV au format PDF.", "Choose a PDF CV."));
      return;
    }
    setCv(new File([file], file.name, { type: "application/pdf" }));
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) return;
    const form = new FormData(event.currentTarget);
    const motivation = String(form.get("motivation") || "").trim();
    const link = String(form.get("cvLink") || "").trim();
    const url = link ? safePortfolio(link) : null;
    if (!motivation || (link && !url) || (!cv && !url)) {
      setError(!motivation ? t("Ajoute ta lettre de motivation.", "Enter your cover letter.")
        : link && !url ? t("Indique un lien de CV HTTP ou HTTPS.", "Enter an HTTP or HTTPS CV link.")
          : t("Ajoute un lien vers ton CV ou joins un PDF.", "Enter a CV link or attach a PDF."));
      return;
    }
    setUploading(true);
    setError("");
    try {
      await publicationApi.postuler(offreId, { lettre_motivation: motivation, lien_cv: url || undefined, pj: cv });
      onSuccess();
    } catch (err) {
      setError(apiError(err, t("Impossible d’envoyer la candidature.", "Could not send the application.")));
    } finally {
      setUploading(false);
    }
  }

  return <Modal title={t("Postuler à cette offre", "Apply for this job")} onClose={onClose} busy={uploading}>
    <form className="job-form application-form" onSubmit={submit}>
      <label>
        {t("Lettre de motivation", "Cover letter")}
        <textarea name="motivation" rows={7} maxLength={2000} required disabled={uploading}
          placeholder={t("Présente ton parcours et ce qui te motive pour cette offre…", "Tell us about your experience and why you’re applying…")} />
      </label>
      <div>
        <label htmlFor="application-cv-link">
          <span>{t("Lien du CV", "CV link")} <small>({t("PDF uniquement", "PDF only")})</small></span>
        </label>
        <div className="application-cv-field">
          <input id="application-cv-link" name="cvLink" type="url" placeholder="https://…" maxLength={500} disabled={uploading} />
          <button type="button" className="quiet" onClick={() => fileInput.current?.click()} disabled={uploading}
            aria-label={t("Joindre un PDF", "Attach a PDF")} title={t("Joindre un PDF", "Attach a PDF")}><Paperclip size={20} /></button>
        </div>
        <input ref={fileInput} type="file" accept=".pdf,application/pdf" hidden disabled={uploading}
          onChange={event => void selectFile(event)} />
        {cv && <div className="application-cv-file">
          <span>{cv.name}</span>
          <button type="button" className="quiet" onClick={() => setCv(undefined)} disabled={uploading}
            aria-label={t("Retirer le PDF", "Remove PDF")}><X size={16} /></button>
        </div>}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onClose} disabled={uploading}>{t("Annuler", "Cancel")}</button>
        <button type="submit" className="btn-primary" disabled={uploading}>
          <Send size={17} /> {uploading ? t("Envoi…", "Sending…") : t("Envoyer ma candidature", "Send application")}
        </button>
      </div>
    </form>
  </Modal>;
}
