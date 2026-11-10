import { AttachmentPicker, AttachmentCard } from "../shared/Attachments";
import type { StoredAttachment } from "../../lib/attachments";
import { useState, type FormEvent } from "react";
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, ExternalLink, Mail, Plus, Search, Send, UsersRound, X } from "lucide-react";
import { initialJobs, migrateJobs, type Job, type Profile } from "../../data/models";
import { makeReview, useApplications, useReviews } from "../../data/workflow";
import { notification, useNotifications } from "../../data/notifications";
import { useLocalData } from "../../lib/storage";
import { useI18n } from "../../i18n/context";
import { safePortfolio } from "../../lib/urls";
import { CountryFlag } from "../CountryFlag";
import { SkillChip } from "../TechIcon";
import CountrySelect from "../shared/CountrySelect";
import SkillSearch from "../shared/SkillSearch";
import Modal from "../Modal";
export default function Offers({ profile, onNotice, onNavigate, route = [] }: { profile: Profile; onNotice: (text: string) => void; onNavigate: (path: string) => void; route?: string[] }) {
  const { t, locale } = useI18n();
  const [jobs, setJobs] = useLocalData("jobs", initialJobs, migrateJobs), [applications, setApplications] = useApplications(), [, setReviews] = useReviews(), [, setNotifications] = useNotifications();
  const [query, setQuery] = useState(""), [mode, setMode] = useState("Tous"), [creating, setCreating] = useState(false), [detail, setDetail] = useState<Job | null>(() => jobs.find(j => j.id === Number(route[0]) && (j.moderation !== "pending" && j.moderation !== "rejected" || j.ownerId === profile.id)) || null), [applying, setApplying] = useState<Job | null>(null), [skills, setSkills] = useState<string[]>([]), [country, setCountry] = useState(""), [error, setError] = useState("");

  const [cvFile, setCvFile] = useState<StoredAttachment>(), [uploadCount, setUploadCount] = useState(0), [contract, setContract] = useState("CDI");
  const uploading = uploadCount > 0;
  const needsDuration = contract === "CDD" || contract === "Stage";
  const visible = jobs.filter(j => (j.moderation !== "pending" && j.moderation !== "rejected" || j.ownerId === profile.id) && (mode === "Tous" || mode === "Stage" ? mode === "Tous" || j.contract === "Stage" : j.mode === mode) && `${j.title} ${j.company} ${j.skills} ${j.country}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  function startApply(job: Job) { setDetail(null); setError(""); setCvFile(undefined); setApplying(job); }
  function publish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (uploading) return; if (!skills.length) { setError(t("Ajoute au moins une compétence recherchée.", "Add at least one required skill.")); return; }
    const form = new FormData(e.currentTarget), get = (key: string) => String(form.get(key) || "").trim();
    const job: Job = { id: Date.now(), ownerId: profile.id, ownerName: profile.name, title: get("title"), company: get("company"), country, contract: get("contract"), mode: get("mode"), skills: skills.join(" · "), description: get("description"), contactEmail: get("contactEmail"), createdAt: new Date().toISOString(), moderation: "pending", ...(needsDuration ? { duration: Number(form.get("duration")), durationUnit: String(form.get("durationUnit")) as "days" | "weeks" | "months" } : {}) };
    setJobs(current => [job, ...current]); setReviews(current => [makeReview("offer", job.id, job.title, `${job.description}\n${job.skills}`), ...current]); setCreating(false); setSkills([]); setCountry(""); setError(""); onNotice(t("Offre envoyée à la modération. Tu peux suivre ses candidatures depuis ton profil.", "Job sent for moderation. Track applications from your profile."));
  }
  function apply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!applying) return; const form = new FormData(e.currentTarget), cvUrl = safePortfolio(String(form.get("cvUrl") || "").trim()), motivation = String(form.get("motivation") || "").trim();
    if (uploading) return;
    if (!cvUrl && !cvFile) { setError(t("Joins ton CV ou indique un lien HTTP(S) valide.", "Attach your CV or provide a valid HTTP(S) link.")); return; }
    if (!motivation) { setError(t("Écris ta lettre de motivation.", "Write your cover letter.")); return; }
    if (applications.some(a => a.jobId === applying.id && a.applicantId === profile.id)) { onNotice(t("Tu as déjà postulé à cette offre.", "You have already applied for this job.")); setApplying(null); return; }
    const id = Date.now();
    setApplications(current => [...current, { id, jobId: applying.id, title: applying.title, company: applying.company, status: "pending", sentAt: new Date().toISOString(), applicantId: profile.id, applicant: profile, ownerId: applying.ownerId || "", cvUrl: cvUrl || "", cvFile, motivation }]);
    const recipientId = applying.ownerId;
    if (recipientId) setNotifications(current => [notification({ id: `application:${id}`, recipientId, title: "Nouvelle candidature", text: `${profile.name} a postulé : ${applying.title}`, target: `profil/recrutement/${applying.id}`, kind: "application" }), ...current]);
    setApplying(null); onNotice(t("Candidature envoyée ! Retrouve son suivi dans ton profil.", "Application sent! Track its status from your profile."));
  }
  function count(job: Job) { return applications.filter(a => a.jobId === job.id).length; }
  function applied(job: Job) { return applications.some(a => a.jobId === job.id && a.applicantId === profile.id); }
  return <div className="offers-page">
    <div className="offers-toolbar">
      <div className="offer-search">
        <Search size={20} />
        <input
          aria-label={t("Rechercher une offre", "Search jobs")}
          placeholder={t("Un métier, une compétence, un pays…", "A role, a skill, a country…")}
          value={query}
          onChange={e => setQuery(e.target.value)} />
      </div>
      <button
        className="btn-primary"
        onClick={() => { setError(""); setCreating(true); }}>
        <Plus size={17} />
        {t("Publier une offre", "Post a job")}
      </button>
    </div>
    <div
      className="filter-tabs"
      role="group"
      aria-label={t("Filtrer les offres", "Filter jobs")}>
      {["Tous", "Remote", "Hybride", "Local", "Stage"].map(value => <button
        className={mode === value ? "active" : ""}
        key={value}
        onClick={() => setMode(value)}
        aria-pressed={mode === value}>
        {t(value)}
      </button>)}
    </div>
    <div className="opportunity-grid">
      {visible.map(job => <article
        className="panel opportunity-card"
        key={job.id}>
        <button
          className="job-open"
          onClick={() => setDetail(job)}
          aria-label={`${t("Voir le détail de l’offre", "View job details")} : ${job.title}`}>
          <span className="job-company-icon">
            <Building2 size={24} />
          </span>
          <span className="job-company-name">
            {job.company}
          </span>
          <h2>
            {job.title}
          </h2>
          <CountryFlag country={job.country} />
          <div className="job-tags">
            <span>
              {t(job.contract)}
            </span>
            <span>
              {t(job.mode)}
            </span>
            {job.moderation === "pending" && <span className="pending-review">
              {t("En modération", "In review")}
            </span>}
            {job.moderation === "rejected" && <span>
              {t("À revoir", "Needs review")}
            </span>}
          </div>
          <p>
            {job.description}
          </p>
          <div className="job-skill-list">
            {job.skills.split(/[·,]/).filter(Boolean).map(skill => <SkillChip
              key={skill}
              name={skill.trim()} />)}
          </div>
          <small>
            <UsersRound size={14} />
            {count(job)}
            {" "}
            {t("candidature(s)", "application(s)")}
            <ArrowRight size={14} />
            {t("Voir les détails", "View details")}
          </small>
        </button>
        <div className="job-card-footer">
          {job.ownerId === profile.id ? <button
            className="btn-outline"
            onClick={() => onNavigate(`profil/recrutement/${job.id}`)}>
            <UsersRound size={16} />
            {t("Gérer les candidatures", "Manage applications")}
          </button> : <button
            className="btn-primary"
            disabled={applied(job)}
            onClick={() => startApply(job)}>
            {applied(job) ? <CheckCircle2 size={16} /> : <Send size={16} />}
            {" "}
            {applied(job) ? t("Candidature envoyée", "Application sent") : t("Postuler", "Apply")}
          </button>}
        </div>
      </article>)}
    </div>
    {!visible.length && <section className="panel empty-state">
      <BriefcaseBusiness size={30} />
      <h2>
        {t("Aucune offre pour cette recherche", "No jobs match your search")}
      </h2>
      <p>
        {t("Essaie une autre compétence ou un autre filtre.", "Try a different skill or filter.")}
      </p>
    </section>}
    {detail && <Modal
      title={detail.title}
      onClose={() => setDetail(null)}>
      <div className="job-details">
        <p className="job-company-name">
          <Building2 size={18} />
          {detail.company}
        </p>
        <CountryFlag country={detail.country} />
        <div className="job-tags">
          <span>
            {t(detail.contract)}
          </span>
          <span>
            {t(detail.mode)}
          </span>
          {detail.duration ? <span>
            {detail.duration}{" "}
            {t(detail.durationUnit === "days" ? "Jours" : detail.durationUnit === "weeks" ? "Semaines" : "Mois")}
          </span> : ["CDD", "Stage"].includes(detail.contract) ? <span>
            {t("Durée à préciser", "Duration to be confirmed")}
          </span> : null}
        </div>
        {detail.createdAt && <small>
          <CalendarDays size={14} />
          {t("Publié le", "Published")}
          {" "}
          {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(detail.createdAt))}
        </small>}
        <h3>
          {t("Description de l’offre", "Job description")}
        </h3>
        <p className="job-description">
          {detail.description}
        </p>
        <h3>
          {t("Compétences recherchées", "Required skills")}
        </h3>
        <div className="job-skill-list">
          {detail.skills.split(/[·,]/).filter(Boolean).map(name => <SkillChip
            key={name}
            name={name.trim()} />)}
        </div>
        {detail.contactEmail && <a
          className="job-contact"
          href={`mailto:${detail.contactEmail}`}>
          <Mail size={17} />
          {detail.contactEmail}
          <ExternalLink size={14} />
        </a>}
        <p>
          <UsersRound size={16} />
          {" "}
          {count(detail)}
          {" "}
          {t("candidature(s)", "application(s)")}
        </p>
        {detail.ownerId === profile.id ? <button
          className="btn-primary"
          onClick={() => { setDetail(null); onNavigate(`profil/recrutement/${detail.id}`); }}>
          {t("Voir les candidats", "View applicants")}
        </button> : <button
          className="btn-primary"
          disabled={applied(detail)}
          onClick={() => startApply(detail)}>
          <Send size={16} />
          {applied(detail) ? t("Candidature envoyée", "Application sent") : t("Postuler à cette offre", "Apply for this job")}
        </button>}
      </div>
    </Modal>}
    {applying && <Modal
      title={t("Envoyer ma candidature", "Send my application")}
      onClose={() => setApplying(null)}>
      <p>{applying.title} · {applying.company}</p>
      <form
        className="job-form"
        onSubmit={apply}>
        <label>
          {t("Lien vers ton CV", "Link to your CV")}
          <input
            aria-label={t("Lien vers ton CV", "Link to your CV")}
            name="cvUrl"
            type="url"
            maxLength={2000}
            placeholder="https://…" />
          <small>
            {t("Colle un lien ou joins directement ton fichier ci-dessous.", "Paste a link or attach your file below.")}
          </small>
        </label>
        <AttachmentPicker
          label={t("Joindre mon CV", "Attach my CV")}
          accept=".pdf,.doc,.docx"
          onBusy={busy => setUploadCount(n => Math.max(0, n + (busy ? 1 : -1)))}
          onAdd={files => setCvFile(files[0])} />
        {cvFile && <AttachmentCard
          file={cvFile}
          preview={false}
          onRemove={() => setCvFile(undefined)} />}
        <label>
          {t("Lettre de motivation", "Cover letter")}
          <textarea
            name="motivation"
            required
            maxLength={10000}
            rows={8}
            placeholder={t("Présente ton parcours, tes compétences et ce qui te motive pour cette mission…", "Tell us about your experience, skills and motivation for this role…")} />
        </label>
        {error && <p
          className="form-error"
          role="alert">
          {t(error)}
        </p>}
        <button
          className="btn-primary"
          disabled={uploading}>
          <Send size={17} />
          {t("Envoyer ma candidature", "Send my application")}
        </button>
      </form>
    </Modal>}
    {creating && <Modal
      title={t("Publier une offre", "Post a job")}
      onClose={() => setCreating(false)}>
      <form
        className="job-form"
        onSubmit={publish}>
        <div className="professional-grid">
          <label>
            {t("Nom du poste", "Job title")}
            <input
              name="title"
              required
              maxLength={120}
              placeholder={t("Développeur frontend…", "Frontend developer…")} />
          </label>
          <label>
            {t("Organisation", "Company")}
            <input
              name="company"
              required
              maxLength={100} />
          </label>
          <label>
            {t("Pays", "Country")}
            <CountrySelect
              value={country}
              onChange={setCountry} />
          </label>
          <label>
            {t("Type de contrat", "Contract")}
            <select
              className="rounded-select"
              name="contract"
              value={contract}
              onChange={e => setContract(e.target.value)}>
              {["CDI", "CDD", "Freelance", "Stage", "Alternance"].map(c => <option
                key={c}
                value={c}>
                {t(c)}
              </option>)}
            </select>
          </label>
          {needsDuration && <div className="contract-duration">
            <label>
              {t("Durée du contrat", "Contract duration")}
              <input
                name="duration"
                type="number"
                min={1}
                max={3650}
                step={1}
                required
                placeholder="6" />
            </label>
            <label>
              {t("Unité", "Unit")}
              <select
                name="durationUnit"
                defaultValue="months">
                <option value="days">
                  {t("Jours", "Days")}
                </option>
                <option value="weeks">
                  {t("Semaines", "Weeks")}
                </option>
                <option value="months">
                  {t("Mois", "Months")}
                </option>
              </select>
            </label>
          </div>}
          <label>
            {t("Mode de travail", "Work arrangement")}
            <select
              className="rounded-select"
              name="mode">
              {["Remote", "Hybride", "Local"].map(c => <option
                key={c}
                value={c}>
                {t(c)}
              </option>)}
            </select>
          </label>
          <label>
            {t("E-mail de contact (facultatif)", "Contact email (optional)")}
            <input
              name="contactEmail"
              type="email"
              maxLength={254}
              placeholder="recrutement@exemple.com" />
          </label>
        </div>
        <div className="job-skills-field">
          <h3>
            {t("Compétences recherchées", "Required skills")}
          </h3>
          <SkillSearch
            selected={skills}
            onSelect={name => { setSkills(current => [...current, name]); setError(""); }} />
          <div className="selected-skills">
            {skills.map(name => <span key={name}>
              <SkillChip name={name} />
              <button
                type="button"
                aria-label={`${t("Retirer", "Remove")} ${name}`}
                onClick={() => setSkills(current => current.filter(s => s !== name))}>
                <X size={14} />
              </button>
            </span>)}
          </div>
        </div>
        <label>
          {t("Description de l’offre", "Job description")}
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={10000}
            rows={7}
            placeholder={t("Décris la mission, les tâches attendues, le profil recherché et les conditions de travail…", "Describe the role, responsibilities, desired profile and working conditions…")} />
        </label>
        {error && <p
          className="form-error"
          role="alert">
          {t(error)}
        </p>}
        <button
          className="btn-primary"
          disabled={uploading}>
          <Plus size={17} />
          {t("Envoyer l’offre à la modération", "Submit job for review")}
        </button>
      </form>
    </Modal>}
  </div>;
}
