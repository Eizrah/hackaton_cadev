import { AttachmentCard } from "../shared/Attachments";
import { useState } from "react";
import { Search, CheckCircle2, Clock3, ExternalLink, UsersRound, XCircle } from "lucide-react";
import { initialJobs, migrateJobs, normalizeText, type Profile } from "../../data/models";
import { useApplications, type Application } from "../../data/workflow";
import { notification, useNotifications } from "../../data/notifications";
import { useLocalData } from "../../lib/storage";
import { useI18n } from "../../i18n/context";
import { safePortfolio } from "../../lib/urls";
import { CountryFlag } from "../CountryFlag";
import { SkillChip } from "../TechIcon";
export default function RecruiterDashboard({ profile, onNavigate, onNotice, focusJob }: { profile: Profile; onNavigate: (path: string) => void; onNotice: (text: string) => void; focusJob?: number }) {
  const { t } = useI18n(), [jobs] = useLocalData("jobs", initialJobs, migrateJobs), [applications, setApplications] = useApplications(), [, setNotifications] = useNotifications(), [filter, setFilter] = useState("all");
  const owned = jobs.filter(j => j.ownerId === profile.id), [selected, setSelected] = useState<number | undefined>(focusJob);
  const [jobQuery, setJobQuery] = useState(() => owned.find(j => j.id === focusJob)?.title || ""), [suggesting, setSuggesting] = useState(false);
  const matchingJobs = owned.filter(j => normalizeText(j.title).includes(normalizeText(jobQuery)));
  const currentJob = owned.find(j => j.id === selected);
  const candidates = applications.filter(a => owned.some(j => j.id === a.jobId) && (currentJob ? a.jobId === currentJob.id : matchingJobs.some(j => j.id === a.jobId)) && (filter === "all" || a.status === filter));
  function decide(application: Application, status: Application["status"]) {
    if (!owned.some(j => j.id === application.jobId) || application.status === status) return;
    setApplications(current => current.map(a => a.id === application.id ? { ...a, status, updatedAt: new Date().toISOString() } : a));
    setNotifications(current => [notification({ id: `decision:${application.id}:${Date.now()}`, recipientId: application.applicantId, title: status === "accepted" ? "Candidature acceptée" : status === "rejected" ? "Candidature non retenue" : "Candidature en cours", text: `${application.title} · ${application.company}`, target: "profil/candidatures", kind: "decision" }), ...current]);
    onNotice(t("Décision enregistrée. Le candidat a reçu une notification.", "Decision saved. The applicant has received a notification."));
  }
  return <section
    className="panel recruiter-dashboard"
    id="recrutement">
    <div className="section-title">
      <span className="round-icon">
        <UsersRound size={21} />
      </span>
      <div>
        <h2>
          {t("Mon espace recruteur", "My recruiting space")}
        </h2>
        <p>
          {t("Retrouve tes offres et choisis les profils pour tes projets.", "Review your jobs and find people for your projects.")}
        </p>
      </div>
    </div>
    {owned.length ? <>
      <div
        className="recruiter-job-select"
        onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSuggesting(false); }}>
        <label htmlFor="recruiter-job-search">
          {t("Rechercher un poste", "Search a job title")}
        </label>
        <div className="recruiter-search-bar">
          <Search size={19} />
          <input
            id="recruiter-job-search"
            type="search"
            placeholder={t("Écris le nom du poste…", "Type a job title…")}
            value={jobQuery}
            onFocus={() => setSuggesting(true)}
            onChange={e => { setJobQuery(e.target.value); setSelected(undefined); setSuggesting(true); }} />
        </div>
        {suggesting && <div className="recruiter-suggestions">
          {matchingJobs.map(job => <button
            type="button"
            key={job.id}
            onMouseDown={e => e.preventDefault()}
            onClick={() => { setSelected(job.id); setJobQuery(job.title); setSuggesting(false); }}>
            {job.title}
            <small>
              {applications.filter(a => a.jobId === job.id).length}{" "}
              {t("candidature(s)", "application(s)")}
            </small>
          </button>)}
          {!matchingJobs.length && <p>
            {t("Aucun poste correspondant.", "No matching job titles.")}
          </p>}
        </div>}
        {jobQuery && <button
          type="button"
          className="text-link"
          onClick={() => { setJobQuery(""); setSelected(undefined); }}>
          {t("Toutes mes offres", "All my jobs")}
        </button>}
      </div>
      <div className="application-filters">
        {[["all", "Toutes"], ["pending", "En cours"], ["accepted", "Acceptées"], ["rejected", "Non retenues"]].map(([key, label]) => <button
          key={key}
          aria-pressed={filter === key}
          className={filter === key ? "active" : ""}
          onClick={() => setFilter(key)}>
          {t(label)}
        </button>)}
      </div>
      <div className="candidate-list">
        {candidates.map(a => <article
          className={`candidate-card status-${a.status}`}
          key={a.id}>
          <header>
            <button
              className="candidate-profile"
              onClick={() => onNavigate(`profil/membre/${encodeURIComponent(a.applicantId)}`)}>
              <span className="avatar">
                {a.applicant.photo?.startsWith("data:image/") ? <img
                  src={a.applicant.photo}
                  alt="" /> : a.applicant.name.slice(0, 2)}
              </span>
              <span>
                <strong>
                  {a.applicant.name}
                </strong>
                <small>
                  {a.applicant.role || a.applicant.level}
                </small>
              </span>
              <ExternalLink size={14} />
            </button>
            <CountryFlag country={a.applicant.country} />
          </header>
          <small>
            {a.title}
          </small>
          <div className="job-skill-list">
            {a.applicant.skills.split(",").filter(Boolean).map(s => <SkillChip
              key={s}
              name={s.trim()} />)}
          </div>
          <details>
            <summary>
              {t("Lire la lettre de motivation", "Read cover letter")}
            </summary>
            <p>
              {a.motivation || t("Aucune lettre renseignée pour cette ancienne candidature.", "No letter was provided with this legacy application.")}
            </p>
          </details>
          {a.cvFile && <AttachmentCard
            file={a.cvFile}
            preview={false} />}
          {safePortfolio(a.cvUrl) && <a
            className="candidate-cv"
            href={safePortfolio(a.cvUrl)!}
            target="_blank"
            rel="noopener noreferrer">
            {t("Consulter le CV", "View CV")}
            <ExternalLink size={14} />
          </a>}
          <div className="candidate-actions">
            <span className={`candidate-status ${a.status}`}>
              {a.status === "accepted" ? <CheckCircle2 size={15} /> : a.status === "rejected" ? <XCircle size={15} /> : <Clock3 size={15} />}
              {" "}
              {t(a.status === "accepted" ? "Acceptée" : a.status === "rejected" ? "Non retenue" : "En cours")}
            </span>
            <button
              className="btn-outline"
              disabled={a.status === "rejected"}
              onClick={() => decide(a, "rejected")}>
              {t("Ne pas retenir", "Decline")}
            </button>
            <button
              className="btn-primary"
              disabled={a.status === "accepted"}
              onClick={() => decide(a, "accepted")}>
              {t("Accepter", "Accept")}
            </button>
            {a.status !== "pending" && <button
              className="text-link"
              onClick={() => decide(a, "pending")}>
              {t("Remettre en cours", "Set as pending")}
            </button>}
          </div>
        </article>)}
      </div>
      {!candidates.length && <p className="applications-empty">
        {t("Aucune candidature dans cette sélection pour le moment.", "No applications in this selection yet.")}
      </p>}
    </> : <div className="applications-empty">
      <p>
        {t("Tu n’as pas encore publié d’offre.", "You have not published any jobs yet.")}
      </p>
      <button
        className="btn-outline"
        onClick={() => onNavigate("offres")}>
        {t("Proposer une opportunité", "Post an opportunity")}
      </button>
    </div>}
  </section>;
}
