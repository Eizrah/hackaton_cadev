import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, ExternalLink, Mail, Plus, Search, Send, X } from "lucide-react";
import { type Profile } from "../../data/models";
import { useI18n } from "../../i18n/context";
import { CountryFlag } from "../CountryFlag";
import { SkillChip } from "../TechIcon";
import CountrySelect from "../shared/CountrySelect";
import SkillSearch from "../shared/SkillSearch";
import Modal from "../Modal";
import { publicationApi } from "../../api/publication";
import ApplicationForm from "./ApplicationForm";

interface Offre {
  id_publication: string
  description: string
  nom_poste: string
  localisation: string
  type_contrat: 'CDI' | 'CDD' | 'Stage' | 'Freelance'
  duree?: string
  competence_requise: string
  type_travail: 'R' | 'S' | 'H'
  deadline: string
  lien?: string
  email?: string
  fichier?: string
  date_publication: string
  developper_email: string
  feu_vert: boolean
}

export default function Offers({ profile, onNotice, onNavigate }: { profile: Profile; onNotice: (text: string) => void; onNavigate: (path: string) => void; route?: string[] }) {
  const { t } = useI18n();
  
  // État
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState("Tous")
  const [creating, setCreating] = useState(false)
  const [detail, setDetail] = useState<Offre | null>(null)
  const [applying, setApplying] = useState<Offre | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [country, setCountry] = useState("")
  const [error, setError] = useState("")
  const [contract, setContract] = useState("CDI")
  
  const needsDuration = contract === "CDD" || contract === "Stage";

  // Charger les offres
  useEffect(() => {
    loadOffres()
  }, [])

  const loadOffres = async () => {
    try {
      setLoading(true)
      const response = await publicationApi.getOffres()
      setOffres(response.data)
    } catch (err) {
      console.error('Erreur chargement offres:', err)
      onNotice('Erreur lors du chargement des offres')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les offres
  const visible = offres.filter(offre => {
    // Filtre par mode de travail
    if (mode !== "Tous") {
      const typeMap: Record<string, string> = {
        "Remote": "R",
        "Hybride": "H",
        "Local": "S"
      }
      if (offre.type_travail !== typeMap[mode]) return false
    }

    // Filtre par recherche
    const searchText = `${offre.nom_poste} ${offre.localisation} ${offre.competence_requise}`.toLowerCase()
    return searchText.includes(query.toLowerCase())
  })

  const getTypeTravail = (type: string) => {
    switch (type) {
      case 'R': return 'Remote'
      case 'S': return 'Sur site'
      case 'H': return 'Hybride'
      default: return type
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  function startApply(offre: Offre) {
    // Vérifier que ce n'est pas sa propre offre
    if (offre.developper_email === profile.email) {
      onNotice("Vous ne pouvez pas postuler à votre propre offre")
      return
    }
    setDetail(null)
    setApplying(offre)
  }

  async function publish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!skills.length) {
      setError(t("Ajoute au moins une compétence recherchée.", "Add at least one required skill."))
      return
    }
    if (!country) {
      setError("Veuillez sélectionner un pays")
      return
    }

    const form = new FormData(e.currentTarget)
    const get = (key: string) => String(form.get(key) || "").trim()

    try {
      const data = {
        nom_poste: get("title"),
        description: get("description"),
        localisation: country,
        type_contrat: get("contract") as 'CDI' | 'CDD' | 'Stage' | 'Freelance',
        duree: needsDuration ? get("duration") : undefined,
        competence_requise: skills.join(", "),
        type_travail: get("mode") === "Remote" ? "R" as const : get("mode") === "Hybride" ? "H" as const : "S" as const,
        deadline: get("deadline"),
        email: get("contactEmail") || undefined,
        lien: get("lien") || undefined,
      }

      await publicationApi.creerOffre(data)
      
      setCreating(false)
      setSkills([])
      setCountry("")
      setError("")
      onNotice(t("Offre créée avec succès !", "Job posted successfully!"))
      loadOffres() // Recharger les offres
    } catch (err: any) {
      console.error('Erreur création offre:', err)
      setError(err.response?.data?.message || "Erreur lors de la création de l'offre")
    }
  }

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
      {["Tous", "Remote", "Hybride", "Local"].map(value => <button
        className={mode === value ? "active" : ""}
        key={value}
        onClick={() => setMode(value)}
        aria-pressed={mode === value}>
        {t(value)}
      </button>)}
    </div>

    {loading && (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto" />
      </div>
    )}

    <div className="opportunity-grid">
      {visible.map(offre => <article
        className="panel opportunity-card"
        key={offre.id_publication}>
        <button
          className="job-open"
          onClick={() => setDetail(offre)}
          aria-label={`${t("Voir le détail de l'offre", "View job details")} : ${offre.nom_poste}`}>
          <span className="job-company-icon">
            <Building2 size={24} />
          </span>
          <span className="job-company-name">
            {offre.localisation}
          </span>
          <h2>
            {offre.nom_poste}
          </h2>
          <CountryFlag country={offre.localisation} />
          <div className="job-tags">
            <span>
              {t(offre.type_contrat)}
            </span>
            <span>
              {getTypeTravail(offre.type_travail)}
            </span>
            {offre.duree && <span>{offre.duree}</span>}
          </div>
          <p>
            {offre.description}
          </p>
          <div className="job-skill-list">
            {offre.competence_requise?.split(',').filter(Boolean).map(skill => <SkillChip
              key={skill}
              name={skill.trim()} />)}
          </div>
          <small>
            <CalendarDays size={14} />
            {formatDate(offre.date_publication)}
            <ArrowRight size={14} />
            {t("Voir les détails", "View details")}
          </small>
        </button>
        <div className="job-card-footer">
          {offre.developper_email === profile.email ? <button
            className="btn-outline"
            onClick={() => onNavigate(`profil/recrutement/${offre.id_publication}`)}>
            {t("Mes candidatures", "My applications")}
          </button> : <button
            className="btn-primary"
            onClick={() => startApply(offre)}>
            <Send size={16} />
            {t("Postuler", "Apply")}
          </button>}
        </div>
      </article>)}
    </div>

    {!loading && !visible.length && <section className="panel empty-state">
      <BriefcaseBusiness size={30} />
      <h2>
        {t("Aucune offre pour cette recherche", "No jobs match your search")}
      </h2>
      <p>
        {t("Essaie une autre compétence ou un autre filtre.", "Try a different skill or filter.")}
      </p>
    </section>}

    {detail && <Modal
      title={detail.nom_poste}
      onClose={() => setDetail(null)}>
      <div className="job-details">
        <p className="job-company-name">
          <Building2 size={18} />
          {detail.localisation}
        </p>
        <CountryFlag country={detail.localisation} />
        <div className="job-tags">
          <span>
            {t(detail.type_contrat)}
          </span>
          <span>
            {getTypeTravail(detail.type_travail)}
          </span>
          {detail.duree && <span>{detail.duree}</span>}
        </div>
        <small>
          <CalendarDays size={14} />
          {t("Publié le", "Published")}
          {" "}
          {formatDate(detail.date_publication)}
        </small>
        <small>
          <CalendarDays size={14} />
          {t("Date limite", "Deadline")}
          {" "}
          {formatDate(detail.deadline)}
        </small>
        <h3>
          {t("Description de l'offre", "Job description")}
        </h3>
        <p className="job-description">
          {detail.description}
        </p>
        <h3>
          {t("Compétences recherchées", "Required skills")}
        </h3>
        <div className="job-skill-list">
          {detail.competence_requise?.split(',').filter(Boolean).map(name => <SkillChip
            key={name}
            name={name.trim()} />)}
        </div>
        {detail.email && <a
          className="job-contact"
          href={`mailto:${detail.email}`}>
          <Mail size={17} />
          {detail.email}
          <ExternalLink size={14} />
        </a>}
        {detail.lien && <a
          className="job-contact"
          href={detail.lien}
          target="_blank"
          rel="noopener noreferrer">
          <ExternalLink size={17} />
          Lien externe
        </a>}
        {detail.developper_email === profile.email ? <button
          className="btn-primary"
          onClick={() => { setDetail(null); onNavigate(`profil/recrutement/${detail.id_publication}`); }}>
          {t("Voir les candidats", "View applicants")}
        </button> : <button
          className="btn-primary"
          onClick={() => startApply(detail)}>
          <Send size={16} />
          {t("Postuler à cette offre", "Apply for this job")}
        </button>}
      </div>
    </Modal>}

    {applying && (
      <ApplicationForm
        offreId={applying.id_publication}
        onClose={() => setApplying(null)}
        onSuccess={() => {
          setApplying(null)
          onNotice(t("Candidature envoyée avec succès !", "Application sent successfully!"))
        }}
      />
    )}

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
              {["CDI", "CDD", "Stage", "Freelance"].map(c => <option
                key={c}
                value={c}>
                {t(c)}
              </option>)}
            </select>
          </label>
          {needsDuration && <label>
            {t("Durée du contrat", "Contract duration")}
            <input
              name="duration"
              type="text"
              required
              placeholder="6 mois" />
          </label>}
          <label>
            {t("Mode de travail", "Work arrangement")}
            <select
              className="rounded-select"
              name="mode"
              defaultValue="Remote">
              {["Remote", "Hybride", "Local"].map(c => <option
                key={c}
                value={c}>
                {t(c)}
              </option>)}
            </select>
          </label>
          <label>
            {t("Date limite", "Deadline")}
            <input
              name="deadline"
              type="date"
              required />
          </label>
          <label>
            {t("E-mail de contact (facultatif)", "Contact email (optional)")}
            <input
              name="contactEmail"
              type="email"
              maxLength={254}
              placeholder="recrutement@exemple.com" />
          </label>
          <label>
            {t("Lien externe (facultatif)", "External link (optional)")}
            <input
              name="lien"
              type="url"
              maxLength={500}
              placeholder="https://..." />
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
          {t("Description de l'offre", "Job description")}
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
          className="btn-primary">
          <Plus size={17} />
          {t("Publier l'offre", "Post job")}
        </button>
      </form>
    </Modal>}
  </div>;
}
