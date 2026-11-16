import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, CalendarDays, Check, Clock, ExternalLink, Flag, Mail, Plus, Search, Send, Trash2, X } from "lucide-react";
import "./offers-detail.css";
import { type Profile } from "../../data/models";
import { useI18n } from "../../i18n/context";
import { CountryFlag } from "../CountryFlag";
import { SkillChip } from "../TechIcon";
import CountrySelect from "../shared/CountrySelect";
import SkillSearch from "../shared/SkillSearch";
import Modal from "../Modal";
import ConfirmDialog from "../shared/ConfirmDialog";
import { publicationApi } from "../../api/publication";
import { apiError } from "../../api/client";
import { useSavedPublications } from "../../hooks/useSavedPublications";
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
  developper_pseudo: string
  feu_vert: boolean
  ma_candidature?: {
    id: number
    etat: 'accepte' | 'refuse' | 'en_attente'
    date_postule: string
  } | null
}

export default function Offers({ profile, onNotice, onNavigate, route }: { profile: Profile; onNotice: (text: string) => void; onNavigate: (path: string) => void; route: string[] }) {
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
  const [publishing, setPublishing] = useState(false)
  const [removing, setRemoving] = useState<Offre | null>(null)
  const [reporting, setReporting] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportSuccess, setReportSuccess] = useState(false)
  const [reportCategory, setReportCategory] = useState("")
  const [showReportModal, setShowReportModal] = useState(false)
  
  const savedPublications = useSavedPublications();
  const focusOffer = route[0] === "offre" ? route[1] : undefined;

  useEffect(() => {
    if (!focusOffer) return;
    let active = true;
    void publicationApi.getOffre(focusOffer).then(({ data }) => {
      if (active) setDetail(data);
    }).catch(error => {
      if (active) onNotice(apiError(error, t("Cette offre est indisponible.", "This offer is unavailable.")));
    });
    return () => { active = false; };
  }, [focusOffer]);

  async function toggleSaved(offre: Offre) {
    if (savedPublications.error) {
      savedPublications.retry();
      return;
    }
    const saved = savedPublications.saved("offre_emploi", offre.id_publication);
    try {
      if (await savedPublications.toggle({
        type: "offre_emploi",
        publication: {
          id: offre.id_publication, nom_poste: offre.nom_poste, localisation: offre.localisation,
          date: offre.date_publication, auteur: offre.developper_pseudo,
        },
      })) onNotice(saved ? t("Offre retirée des enregistrements.", "Offer removed from saved items.")
        : t("Offre enregistrée.", "Offer saved."));
    } catch (err) {
      onNotice(apiError(err, t("Impossible de modifier l’enregistrement.", "Could not update the saved item.")));
    }
  }

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

  function deleteOffre(offre: Offre) {
    setDetail(null) // Fermer le modal de détail avant d'ouvrir la confirmation
    setRemoving(offre)
  }

  function isOfferExpired(deadline: string): boolean {
    return new Date(deadline) < new Date()
  }

  async function publish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (publishing) return
    
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

    // Validation de la durée
    if (needsDuration) {
      const durationStr = get("duration")
      const duration = parseInt(durationStr, 10)
      
      if (!durationStr || isNaN(duration)) {
        setError(t("Veuillez entrer une durée valide en mois.", "Please enter a valid duration in months."))
        return
      }
      
      if (duration <= 0) {
        setError(t("La durée doit être supérieure à 0 mois.", "Duration must be greater than 0 months."))
        return
      }
      
      if (duration > 60) {
        setError(t("La durée ne peut pas dépasser 60 mois (5 ans).", "Duration cannot exceed 60 months (5 years)."))
        return
      }
    }

    setPublishing(true)
    setError("")

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
      
      // Gérer les erreurs spécifiques du backend
      if (err.response?.data?.duree) {
        setError(err.response.data.duree[0])
      } else {
        setError(err.response?.data?.message || t("Erreur lors de la création de l'offre", "Error creating job offer"))
      }
    } finally {
      setPublishing(false)
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
            {offre.duree && <span>{offre.duree} {t("mois", "months")}</span>}
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
          {offre.developper_email === profile.email ? (
            <button
              className="btn-outline"
              onClick={() => onNavigate(`profil/recrutement/${offre.id_publication}`)}>
              {t("Mes candidatures", "My applications")}
            </button>
          ) : isOfferExpired(offre.deadline) ? (
            <div className="application-status-badge expired">
              <Clock size={16} />
              {t("Expirée", "Expired")}
            </div>
          ) : offre.ma_candidature ? (
            offre.ma_candidature.etat === 'refuse' ? (
              <div className="application-status-badge failed">
                <X size={16} />
                {t("Refusée", "Failed")}
              </div>
            ) : offre.ma_candidature.etat === 'accepte' ? (
              <div className="application-status-badge success">
                <Check size={16} />
                {t("Acceptée", "Success")}
              </div>
            ) : (
              <div className="application-status-badge submitted">
                <Check size={16} />
                {t("Postulée", "Submitted")}
              </div>
            )
          ) : (
            <button
              className="btn-primary"
              onClick={() => startApply(offre)}>
              <Send size={16} />
              {t("Postuler", "Apply")}
            </button>
          )}
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
          {detail.duree && <span>{detail.duree} {t("mois", "months")}</span>}
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
        
        {/* Actions pour l'auteur de l'offre */}
        {detail.developper_email === profile.email ? (
          <div className="offer-actions-author">
            <button
              className="btn-primary"
              onClick={() => { setDetail(null); onNavigate(`profil/recrutement/${detail.id_publication}`); }}>
              {t("Voir les candidats", "View applicants")}
            </button>
            <button
              className="btn-danger"
              onClick={() => deleteOffre(detail)}>
              <Trash2 size={16} />
              {t("Supprimer", "Delete")}
            </button>
          </div>
        ) : (
          /* Actions pour les autres utilisateurs */
          <>
            {/* Bandeau si déjà postulé */}
            {detail.ma_candidature && (
              <div className="application-status-banner">
                <Check size={16} />
                <span>
                  {t("Vous avez déjà postulé le", "You already applied on")} {formatDate(detail.ma_candidature.date_postule)}
                </span>
              </div>
            )}

            {/* Boutons Enregistrer et Signaler */}
            <div className="offer-action-buttons">
              <button
                type="button"
                className={savedPublications.saved("offre_emploi", detail.id_publication) ? "btn-saved" : "btn-save"}
                disabled={savedPublications.loading || savedPublications.busy}
                onClick={() => void toggleSaved(detail)}>
                <Bookmark size={16} fill={savedPublications.saved("offre_emploi", detail.id_publication) ? "currentColor" : "none"} />
                {savedPublications.saved("offre_emploi", detail.id_publication)
                  ? t("Enregistrée", "Saved")
                  : t("Enregistrer", "Save")}
              </button>

              <button
                type="button"
                className={reportSuccess ? "btn-reported" : "btn-report"}
                disabled={reporting || reportSuccess}
                onClick={() => setShowReportModal(true)}>
                <Flag size={16} />
                {reportSuccess ? t("Signalée", "Reported") : t("Signaler", "Report")}
              </button>
            </div>

            {/* Message de succès signalement */}
            {reportSuccess && (
              <div className="report-success-message">
                {t("Merci, votre signalement a été envoyé à notre équipe.", "Thank you, your report has been sent to our team.")}
              </div>
            )}

            {/* Badge de statut de candidature ou bouton Postuler */}
            {isOfferExpired(detail.deadline) ? (
              <div className="application-status-badge expired">
                <Clock size={16} />
                {t("Expirée", "Expired")}
              </div>
            ) : detail.ma_candidature ? (
              detail.ma_candidature.etat === 'refuse' ? (
                <div className="application-status-badge failed">
                  <X size={16} />
                  {t("Refusée", "Failed")}
                </div>
              ) : detail.ma_candidature.etat === 'accepte' ? (
                <div className="application-status-badge success">
                  <Check size={16} />
                  {t("Acceptée", "Success")}
                </div>
              ) : (
                <div className="application-status-badge submitted">
                  <Check size={16} />
                  {t("Candidature envoyée", "Submitted")}
                </div>
              )
            ) : (
              <button
                className="btn-apply"
                onClick={() => startApply(detail)}>
                <Send size={16} />
                {t("Postuler à cette offre", "Apply for this job")}
              </button>
            )}
          </>
        )}
      </div>
    </Modal>}

    {/* ─── Modal signalement ─── */}
    {showReportModal && detail && (
      <Modal
        title={t("Signaler une offre", "Report a job offer")}
        onClose={() => {
          setShowReportModal(false);
          setReportCategory("");
          setReportReason("");
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const detail_text = String(new FormData(e.currentTarget).get("reason") || "").trim();
            if (!reportCategory || (reportCategory === "Autres" && !detail_text)) return;
            const reason = `${reportCategory}${detail_text ? ` : ${detail_text}` : ""}`;
            
            setReporting(true);
            try {
              await publicationApi.signalerOffre(detail.id_publication, reason);
              onNotice(t("Signalement envoyé. Merci de contribuer à une communauté bienveillante.", "Report sent. Thank you for helping keep the community welcoming."));
              setShowReportModal(false);
              setReportCategory("");
              setReportReason("");
              setReportSuccess(true);
            } catch (err: any) {
              if (err.response?.data?.erreur) {
                onNotice(err.response.data.erreur);
              } else {
                onNotice(t("Erreur lors de l'envoi du signalement.", "Error sending report."));
              }
            } finally {
              setReporting(false);
            }
          }}
        >
          <p>{t("Explique la raison de ton signalement.", "Explain why you are reporting this offer.")}</p>
          <label>
            {t("Motif du signalement", "Report category")}
            <select
              className="rounded-select report-category"
              required
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
            >
              <option value="" disabled>{t("Choisir un motif", "Choose a reason")}</option>
              {[
                ["Harcèlement", "Harassment"],
                ["Propos inappropriés ou haineux", "Inappropriate or hateful language"],
                ["Fausses informations", "False information"],
                ["Arnaque ou fraude", "Scam or fraud"],
                ["Spam ou publicité abusive", "Spam or abusive advertising"],
                ["Atteinte à la vie privée", "Privacy violation"],
                ["Autres", "Other"],
              ].map(([fr, en]) => (
                <option key={fr} value={fr}>{t(fr, en)}</option>
              ))}
            </select>
          </label>
          {reportCategory && (
            <label>
              {reportCategory === "Autres"
                ? t("Explique la raison de ton signalement.", "Explain why you are reporting this offer.")
                : t("Précisions (facultatif)", "Details (optional)")}
              <textarea
                name="reason"
                required={reportCategory === "Autres"}
                maxLength={1000}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder={t("Décris les faits pour aider la modération…", "Describe what happened to help moderation…")}
              />
            </label>
          )}
          <button className="btn-primary" disabled={reporting}>
            <Flag size={16} />
            {reporting ? t("Envoi...", "Sending...") : t("Envoyer le signalement", "Send report")}
          </button>
        </form>
      </Modal>
    )}


    {applying && (
      <ApplicationForm
        offreId={applying.id_publication}
        onClose={() => setApplying(null)}
        onSuccess={async () => {
          setApplying(null)
          onNotice(t("Candidature envoyée avec succès !", "Application sent successfully!"))
          // Recharger le détail de l'offre pour afficher le statut de candidature
          if (applying) {
            try {
              const { data } = await publicationApi.getOffre(applying.id_publication)
              setDetail(data)
              
              // Mettre à jour aussi l'offre dans la liste pour afficher le badge immédiatement
              setOffres(prevOffres => 
                prevOffres.map(offre => 
                  offre.id_publication === applying.id_publication ? data : offre
                )
              )
            } catch (err) {
              console.error('Erreur rechargement offre:', err)
            }
          }
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
            {t("Durée du contrat (en mois)", "Contract duration (in months)")}
            <input
              name="duration"
              type="number"
              min="1"
              max="60"
              required
              placeholder={t("Ex: 6", "Ex: 6")} />
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
            onSelect={(name) => { setSkills(current => [...current, name]); setError(""); }} />
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
          className="btn-primary"
          disabled={publishing}>
          {publishing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus size={17} />
          )}
          {publishing ? t("Publication…", "Publishing…") : t("Publier l'offre", "Post job")}
        </button>
      </form>
    </Modal>}

    {removing && <ConfirmDialog
      title={t("Supprimer cette offre ?", "Delete this offer?")}
      description={removing.nom_poste}
      onClose={() => setRemoving(null)}
      onConfirm={async () => {
        await publicationApi.supprimerOffre(removing.id_publication)
        setOffres(current => current.filter(offre => offre.id_publication !== removing.id_publication))
        onNotice(t("Offre supprimée avec succès", "Offer deleted successfully"))
      }}
    />}
  </div>;
}
