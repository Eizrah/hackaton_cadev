import { useEffect, useState } from "react";
import { Check, Clock3, Download, ExternalLink, UserRound, X } from "lucide-react";
import { publicationApi, type Candidature, type EtatCandidature } from "../../api/publication";
import { apiError, mediaUrl } from "../../api/client";
import { useI18n } from "../../i18n/context";
import { safePortfolio } from "../../lib/urls";
import Modal from "../Modal";

export default function OfferCandidates({ offreId, offreTitre, onClose, onNavigate }: {
  offreId: string;
  offreTitre: string;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}) {
  const { t } = useI18n();
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [filter, setFilter] = useState<"all" | EtatCandidature>("all");
  const [processing, setProcessing] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const labels = {
    en_attente: t("En attente", "Pending"),
    accepte: t("Validée", "Accepted"),
    refuse: t("Non retenue", "Not selected"),
  };
  const visible = candidatures.filter(candidature => filter === "all" || candidature.etat === filter);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void publicationApi.candidaturesOffre(offreId).then(({ data }) => {
      if (active) setCandidatures(data);
    }).catch(error => {
      if (active) setError(apiError(error, t("Impossible de charger les candidatures.", "Could not load applications.")));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [offreId]);

  async function decide(id: number, etat: "accepte" | "refuse") {
    if (processing !== undefined) return;
    setProcessing(id);
    setError("");
    try {
      await publicationApi.traiterCandidature(offreId, id, etat);
      setCandidatures(current => current.map(candidature => candidature.id === id ? { ...candidature, etat } : candidature));
    } catch (err) {
      setError(apiError(err, t("Impossible d’enregistrer la décision.", "Could not save the decision.")));
    } finally {
      setProcessing(undefined);
    }
  }

  return <Modal title={t("Candidatures reçues", "Applications received")} onClose={onClose}
    busy={processing !== undefined} size="wide">
    <p>{offreTitre}</p>
    <div className="application-filters">
      {([
        ["all", t("Toutes", "All")], ["en_attente", labels.en_attente],
        ["accepte", t("Validées", "Accepted")], ["refuse", t("Non retenues", "Not selected")],
      ] as const).map(([value, label]) => <button key={value} type="button"
        className={filter === value ? "active" : ""} aria-pressed={filter === value}
        onClick={() => setFilter(value)}>{label}</button>)}
    </div>
    {loading && <p className="muted" role="status">{t("Chargement…", "Loading…")}</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && !error && !visible.length && <p className="muted">{t("Aucune candidature dans cette catégorie.", "No applications in this category.")}</p>}
    <div className="candidate-list">
      {visible.map(candidature => {
        const name = candidature.developper_pseudo || candidature.developper_email;
        const photo = mediaUrl(candidature.developper_photo);
        const file = mediaUrl(candidature.pj);
        const link = candidature.lien_cv && safePortfolio(candidature.lien_cv);
        const profilePath = `profil/membre/${encodeURIComponent(candidature.developper_email)}`;
        const StatusIcon = { en_attente: Clock3, accepte: Check, refuse: X }[candidature.etat];
        return <article className="candidate-card" key={candidature.id}>
          <header>
            <a className="candidate-profile" href={`#workspace/${profilePath}`}
              onClick={onNavigate ? event => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                onClose();
                onNavigate(profilePath);
              } : undefined}
              aria-label={`${t("Voir le profil de", "View profile of")} ${name}`}>
              <span className="avatar">{photo ? <img src={photo} alt="" /> : <UserRound size={19} />}</span>
              <strong>{name}</strong>
            </a>
          </header>
          {candidature.lettre_motivation && <details>
            <summary>{t("Lire la lettre de motivation", "Read cover letter")}</summary>
            <p>{candidature.lettre_motivation}</p>
          </details>}
          <div className="candidate-cv-links">
            {file && <a className="candidate-cv" href={file} target="_blank" rel="noopener noreferrer">
              {t("Télécharger le CV joint", "Download attached CV")} <Download size={15} />
            </a>}
            {link && <a className="candidate-cv" href={link} target="_blank" rel="noopener noreferrer">
              {t("Ouvrir le lien du CV", "Open CV link")} <ExternalLink size={15} />
            </a>}
          </div>
          <div className="candidate-actions">
            <span className={`candidate-status ${candidature.etat === "accepte" ? "accepted" : candidature.etat === "refuse" ? "rejected" : ""}`}>
              <StatusIcon size={15} /> {labels[candidature.etat]}
            </span>
            {candidature.etat === "en_attente" && <>
              <button type="button" className="btn-outline" disabled={processing !== undefined}
                onClick={() => void decide(candidature.id, "refuse")}>{t("Refuser", "Decline")}</button>
              <button type="button" className="btn-primary" disabled={processing !== undefined}
                onClick={() => void decide(candidature.id, "accepte")}>{t("Valider", "Accept")}</button>
            </>}
          </div>
        </article>;
      })}
    </div>
  </Modal>;
}
