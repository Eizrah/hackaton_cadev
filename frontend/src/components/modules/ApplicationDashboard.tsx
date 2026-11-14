import { useEffect, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, CircleX, Clock3, Trash2 } from "lucide-react";
import { publicationApi, type Candidature, type EtatCandidature } from "../../api/publication";
import { useI18n } from "../../i18n/context";
import ConfirmDialog from "../shared/ConfirmDialog";

const states = {
  en_attente: { className: "pending", Icon: Clock3 },
  accepte: { className: "accepted", Icon: CheckCircle2 },
  refuse: { className: "rejected", Icon: CircleX },
};

export default function ApplicationDashboard({ onNotice }: { onNotice: (message: string) => void }) {
  const { t, locale } = useI18n();
  const [applications, setApplications] = useState<Candidature[]>([]);
  const [filter, setFilter] = useState<"all" | EtatCandidature>("all");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [removing, setRemoving] = useState<Candidature>();
  const [refresh, setRefresh] = useState(0);
  const labels = {
    en_attente: t("En cours", "In progress"),
    accepte: t("Validée", "Accepted"),
    refuse: t("Non retenue", "Not selected"),
  };
  const visible = applications.filter(item => filter === "all" || item.etat === filter);

  useEffect(() => {
    let active = true;
    void publicationApi.mesCandidatures().then(({ data }) => {
      if (active) { setApplications(data); setFailed(false); }
    }).catch(() => {
      if (active) setFailed(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    const reload = () => setRefresh(value => value + 1);
    window.addEventListener("focus", reload);
    return () => { active = false; window.removeEventListener("focus", reload); };
  }, [refresh]);

  return <section className="applications-dashboard panel" id="candidatures">
    <div className="section-title">
      <span className="round-icon"><BriefcaseBusiness size={20} /></span>
      <div>
        <h2>{t("Mes candidatures", "My applications")}</h2>
        <p>{t("Retrouve les offres auxquelles tu as postulé et leur état.", "Follow the jobs you applied for and their status.")}</p>
      </div>
    </div>
    <div className="application-filters">
      {([
        ["all", t("Toutes", "All")], ["en_attente", labels.en_attente],
        ["accepte", t("Validées", "Accepted")], ["refuse", t("Non retenues", "Not selected")],
      ] as const).map(([key, label]) => <button key={key} type="button"
        onClick={() => setFilter(key)} className={filter === key ? "active" : ""} aria-pressed={filter === key}>{label}</button>)}
    </div>
    {loading && <p className="muted" role="status">{t("Chargement…", "Loading…")}</p>}
    {failed && <p className="form-error" role="alert">{t("Impossible de charger les candidatures.", "Could not load applications.")}</p>}
    {visible.length > 0 && <div className="applications-list">
      {visible.map(item => {
        const { Icon, className } = states[item.etat];
        return <article className={`application-card status-${className}`} key={item.id}>
          <div>
            <span className="application-company">{item.offre_localisation}</span>
            <h3>{item.nom_offre}</h3>
            <small>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(item.date_postule + "T00:00:00"))}</small>
          </div>
          <div className="application-progress">
            <div className="application-card-actions">
              <span className="application-status"><Icon size={14} />{labels[item.etat]}</span>
              {item.etat !== "en_attente" && <button type="button" className="quiet"
                aria-label={`${t("Supprimer la candidature", "Remove application")} · ${item.nom_offre}`}
                title={t("Supprimer la candidature", "Remove application")}
                onClick={() => setRemoving(item)}><Trash2 size={16} /></button>}
            </div>
            <div className="status-track" aria-hidden="true"><i /><i /><i /></div>
          </div>
        </article>;
      })}
    </div>}
    {!loading && !failed && !visible.length && <div className="applications-empty">
      <BriefcaseBusiness size={25} />
      <p>{t("Aucune candidature dans cette catégorie.", "No applications in this category.")}</p>
      <a href="#workspace/offres">{t("Découvrir les offres", "Explore jobs")} <ArrowUpRight size={15} /></a>
    </div>}
    {removing && <ConfirmDialog
      title={t("Retirer cette candidature ?", "Remove this application?")}
      description={t("Elle sera retirée de ton historique. Le recruteur gardera sa décision.", "It will be removed from your history. The recruiter will keep their decision.")}
      onClose={() => setRemoving(undefined)}
      onConfirm={async () => {
        await publicationApi.retirerMaCandidature(removing.id);
        setApplications(current => current.filter(item => item.id !== removing.id));
        setRefresh(value => value + 1);
        onNotice(t("Candidature retirée.", "Application removed."));
      }} />}
  </section>;
}
