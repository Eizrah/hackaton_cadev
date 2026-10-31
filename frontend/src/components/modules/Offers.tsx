import { useI18n } from "../../i18n/context";
import { useApplications, useReviews, makeReview } from "../../data/workflow";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Plus,
  Search,
} from "lucide-react";
import { useLocalData } from "../../lib/storage";
import { initialJobs, normalizeText } from "../../data/models";
import { CountryFlag } from "../CountryFlag";
import Modal from "../Modal";
export default function Offers({
  onNotice,
}: {
  onNotice: (message: string) => void;
}) {
  const { t } = useI18n();

  const [jobs, setJobs] = useLocalData("jobs", initialJobs);
  const [applications, setApplications] = useApplications();
  const [, setReviews] = useReviews();
  const [query, setQuery] = useState(""),
    [mode, setMode] = useState("Tous"),
    [creating, setCreating] = useState(false);
  const filtered = jobs.filter(
    (j) =>
      j.moderation !== "rejected" &&
      (mode === "Tous" || mode === j.mode) &&
      normalizeText(
        `${j.title} ${j.country} ${j.skills} ${j.company}`,
      ).includes(normalizeText(query)),
  );
  return (
    <>
      <div className="toolbar">
        <label className="search-box">
          <Search size={19} />
          <input
            aria-label={t("Rechercher une offre")}
            placeholder={t("Poste, compétence, pays…")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label={t("Mode de travail")}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {["Tous", "Remote", "Hybride", "Local"].map((m) => (
            <option key={m} value={m}>
              {t(m)}
            </option>
          ))}
        </select>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} />
          {t("Publier une offre")}
        </button>
      </div>
      <p className="muted results-count">
        {filtered.length}
        {t("offre")}
        {filtered.length > 1 ? t("s") : ""}
        {t("à découvrir")}
      </p>
      <div className="module-grid offers-grid">
        {filtered.map((j) => (
          <article className="panel job" key={j.id}>
            <span className="feature-icon orange">
              <BriefcaseBusiness size={26} />
            </span>
            <h2>{j.title}</h2>
            <p>{j.company}</p>
            <CountryFlag country={j.country} />
            <div className="tag-list">
              <span>{j.contract}</span>
              <span>{j.mode}</span>
            </div>
            <p>{j.skills}</p>
            {j.moderation === "pending" && (
              <span className="pending-review">
                {t("En attente de modération · démo")}
              </span>
            )}
            <button
              className="btn-primary"
              disabled={applications.some((a) => a.jobId === j.id)}
              onClick={() => {
                setApplications((current) => [
                  ...current,
                  {
                    id: Date.now(),
                    jobId: j.id,
                    title: j.title,
                    company: j.company,
                    status: "pending",
                    sentAt: new Date().toISOString(),
                  },
                ]);
                onNotice(
                  t(
                    "Candidature simulée enregistrée. Aucun employeur n’a été contacté.",
                  ),
                );
              }}
            >
              {applications.some((a) => a.jobId === j.id) ? (
                <>
                  <Check size={16} />
                  {t("Candidature enregistrée")}
                </>
              ) : (
                <>
                  {t("Postuler")}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="panel empty-state">
          <Search />
          <h2>{t("Aucune offre trouvée.")}</h2>
          <p>{t("Essaie un autre mot-clé ou un autre mode de travail.")}</p>
        </div>
      )}
      {creating && (
        <Modal
          title={t("Publier une offre")}
          onClose={() => setCreating(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const id = Date.now();
              setReviews((current) => [
                makeReview(
                  "offer",
                  id,
                  String(d.get("title")),
                  String(d.get("skills")),
                ),
                ...current,
              ]);
              setJobs((current) => [
                {
                  id,
                  moderation: "pending",
                  title: String(d.get("title")).trim(),
                  company: String(d.get("company")).trim(),
                  country: String(d.get("country")).trim(),
                  mode: String(d.get("mode")),
                  contract: String(d.get("contract")),
                  skills: String(d.get("skills")).trim(),
                },
                ...current,
              ]);
              setCreating(false);
              onNotice(t("Offre ajoutée à la démonstration locale."));
            }}
          >
            <label>
              {t("Intitulé du poste")}
              <input name="title" required maxLength={120} pattern=".*\S.*" />
            </label>
            <label>
              {t("Organisation")}
              <input name="company" required maxLength={80} />
            </label>
            <label>
              {t("Pays")}
              <input name="country" required maxLength={80} />
            </label>
            <div className="form-grid">
              <label>
                {t("Contrat")}
                <select name="contract">
                  <option value="CDI">{t("CDI")}</option>
                  <option value="CDD">{t("CDD")}</option>
                  <option value="Stage">{t("Stage")}</option>
                  <option value="Freelance">{t("Freelance")}</option>
                </select>
              </label>
              <label>
                {t("Mode de travail")}
                <select name="mode">
                  <option value="Remote">{t("Remote")}</option>
                  <option value="Hybride">{t("Hybride")}</option>
                  <option value="Local">{t("Local")}</option>
                </select>
              </label>
            </div>
            <label>
              {t("Compétences recherchées")}
              <textarea name="skills" required maxLength={1000} />
            </label>
            <button className="btn-primary">
              {t("Créer l’offre")}
              <ArrowRight size={17} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
