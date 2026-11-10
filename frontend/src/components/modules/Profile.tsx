import SavedPosts from "./SavedPosts";
import { AttachmentCard } from "../shared/Attachments";
import { useI18n } from "../../i18n/context";
import ApplicationDashboard from "./ApplicationDashboard";
import RecruiterDashboard from "./RecruiterDashboard";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Code2,
  ExternalLink,
  Globe2,
  GraduationCap,
  Pencil,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { type Profile } from "../../data/models";
import { useLocalData } from "../../lib/storage";
import { CountryFlag } from "../CountryFlag";
import {
  PersonalFields,
  ExperienceFields,
  SkillFields,
} from "../ProfileFields";
import {
  migrateProfile,
  experienceError,
  skillError,
  validPseudo,
} from "../../data/profile";
import { safePortfolio } from "../../lib/urls";
import TechIcon, { SkillChip } from "../TechIcon";
function Avatar({
  profile,
  large = false,
}: {
  profile: Profile;
  large?: boolean;
}) {
  return (
    <div className={large ? "profile-avatar" : "avatar"}>
      {profile.photo.startsWith("data:image/") ? (
        <img
          src={profile.photo}
          alt={`Photo de ${profile.name}`} />
      ) : (
        <span>
          {profile.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "DA"}
        </span>
      )}
    </div>
  );
}
export default function ProfileView({
  profile,
  onEdit,
  onNotice,
  isOwn = true,
  onMessage,
  onNavigate,
  focusJob,
}: {
  profile: Profile;
  onNavigate: (path: string) => void;
  focusJob?: number;
  onEdit: () => void;
  onNotice: (message: string) => void;
  isOwn?: boolean;
  onMessage?: () => void;
}) {
  const { t } = useI18n();

  const [posts] = useLocalData<{ author: string }[]>("posts", []);
  const [progress] = useLocalData<string[]>("progress", []);
  const skills = profile.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const portfolio = safePortfolio(profile.portfolio);
  const contributions = posts.filter((p) => p.author === profile.name).length;
  async function shareProfile() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onNotice(
        t(
          "Lien du profil copié. Dans cette démo, les données du profil restent sur cet appareil.",
        ),
      );
    } catch {
      onNotice(
        t(
          "La copie automatique est indisponible. Tu peux copier l’adresse de cette page.",
        ),
      );
    }
  }
  return (
    <>
      <div className="profile-layout">
        <section
          className="glass-profile"
          aria-label={t("Carte de profil")}>
          <div className="profile-card-top">
            <span className="mini-label">
              {t("DÉVELOPPEUR · DEVAfrica")}
            </span>
            <button
              className="glass-icon"
              aria-label={t("Copier le lien du profil")}
              onClick={shareProfile}
            >
              <Share2 size={22} />
            </button>
          </div>
          <Avatar
            profile={profile}
            large />
          <h2>
            {profile.name}
          </h2>
          <p className="profile-role">
            {profile.role || "Développeur de la communauté"}
          </p>
          {profile.pseudo && (
            <p className="profile-pseudo">@{profile.pseudo}</p>
          )}
          <CountryFlag country={profile.country} />
          <div className="profile-skill-preview">
            {skills.slice(0, 4).map((s) => (
              <SkillChip
                key={s}
                name={s} />
            ))}
          </div>
          <div className="profile-stats">
            <div>
              <strong>
                {skills.length}
              </strong>
              <span>
                {t("Compétences")}
              </span>
            </div>
            <div>
              <strong>
                {isOwn ? progress.length : "—"}
              </strong>
              <span>
                {t("Fiches validées")}
              </span>
            </div>
            <div>
              <strong>
                {contributions}
              </strong>
              <span>
                {t("Publications")}
              </span>
            </div>
          </div>
          <div className="profile-card-bottom">
            <button
              className="glass-edit"
              onClick={isOwn ? onEdit : onMessage}>
              {isOwn ? t("Modifier mon profil") : t("Contacter")}
              <Pencil size={18} />
            </button>
            {portfolio ? (
              <a
                className="glass-portfolio"
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("Ouvrir mon portfolio")}
              >
                <ExternalLink size={23} />
              </a>
            ) : (
              <button
                className="glass-portfolio"
                onClick={isOwn ? onEdit : onMessage}
                aria-label={t("Ajouter mon portfolio")}
              >
                <Globe2 size={23} />
              </button>
            )}
          </div>
        </section>
        <div className="profile-details">
          {isOwn && (
            <section className="panel">
              <div className="section-title">
                <span className="round-icon">
                  <UserRound size={20} />
                </span>
                <h2>
                  {t("Informations personnelles", "Personal information")}
                </h2>
              </div>
              <dl className="profile-personal-list">
                {[
                  [t("Nom", "Last name"), profile.lastName],
                  [t("Prénom", "First name"), profile.firstName],
                  [
                    t("Âge", "Age"),
                    profile.age ? `${profile.age} ${t("ans", "years")}` : "",
                  ],
                  [t("Niveau", "Level"), t(profile.level)],
                  [t("Pays", "Country"), profile.country],
                  [
                    t("Pseudo", "Username"),
                    profile.pseudo ? `@${profile.pseudo}` : "",
                  ],
                  [t("Adresse e-mail", "Email address"), profile.email],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>
                      {label}
                    </dt>
                    <dd>
                      {value || t("Non renseigné", "Not provided")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <section className="panel">
            <div className="section-title">
              <span className="round-icon">
                <UserRound size={20} />
              </span>
              <h2>
                {t("À propos de moi")}
              </h2>
              <span className="level-pill">
                {t(profile.level)}
              </span>
            </div>
            <p className="preserve-lines">
              {profile.bio ||
                t("Ajoute quelques mots sur ce que tu aimes construire.", "Add a few words about what you like to build.")}
            </p>
          </section>
          <section className="panel">
            <div className="section-title">
              <span className="round-icon">
                <Code2 size={20} />
              </span>
              <h2>
                {t("Mes compétences")}
              </h2>
            </div>
            {profile.skillDetails.length ? (
              <div className="profile-skill-list">
                {profile.skillDetails.map((skill) => (
                  <article
                    className="profile-skill-detail"
                    key={skill.id}>
                    <TechIcon
                      name={skill.name}
                      size={26} />
                    <div>
                      <strong>
                        {skill.name}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="skills-wall">
                {skills.length ? (
                  skills.map((name) => <SkillChip
                    key={name}
                    name={name} />)
                ) : (
                  <p>
                    {t("Aucune compétence renseignée pour le moment.")}
                  </p>
                )}
              </div>
            )}
          </section>
          <section className="panel">
            <div className="section-title">
              <span className="round-icon">
                <GraduationCap size={20} />
              </span>
              <h2>
                {t("Mon parcours")}
              </h2>
            </div>
            {profile.experiences.length ? (
              <div className="profile-experience-list">
                {profile.experiences.map((entry) => (
                  <article
                    className="profile-experience-item"
                    key={entry.id}>
                    <span className="experience-year">
                      {entry.year ||
                        t("Année non renseignée", "Year unavailable")}
                    </span>
                    <h3>
                      {entry.position}
                    </h3>
                    <p>
                      {entry.description}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="preserve-lines">
                {profile.experience ||
                  t(
                    "Votre parcours commence ici. Ajoutez une expérience quand vous le souhaitez.",
                    "Your journey starts here. Add experience whenever you like.",
                  )}
              </p>
            )}
          </section>
          {profile.documents.length > 0 && <section className="panel profile-documents">
            <div className="section-title">
              <GraduationCap size={21} />
              <h2>
                {t("Diplômes et certificats", "Diplomas and certificates")}
              </h2>
            </div>
            {profile.documents.map(document => <div key={document.id}>
              <small>
                {document.kind === "diploma" ? t("Diplôme", "Diploma") : t("Certificat", "Certificate")}
              </small>
              <AttachmentCard
                file={document.file}
                preview={false} />
            </div>)}
          </section>}
          {profile.experiences.some(e => e.diploma || e.certificate) && <section className="panel">
            <h2>
              {t("Diplômes et certificats", "Diplomas and certificates")}
            </h2>
            {profile.experiences.map(e => <p key={e.id}>
              {[e.diploma, e.certificate].filter(Boolean).join(" · ")}
            </p>)}
          </section>}
          <section className="panel portfolio-panel">
            <div>
              <h2>
                {t("Mon portfolio")}
              </h2>
              <p>
                {portfolio
                  ? t("Une autre façon de découvrir mon univers.")
                  : t(
                    "Un site, des projets, ton univers créatif. Le lien est facultatif.",
                  )}
              </p>
            </div>
            {portfolio ? (
              <a
                className="btn-primary"
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Voir le portfolio")}
                <ExternalLink size={17} />
              </a>
            ) : (
              <button
                className="text-link"
                onClick={isOwn ? onEdit : onMessage}
              >
                {isOwn ? t("Ajouter un lien") : t("Contacter")}
                <ArrowRight size={17} />
              </button>
            )}
          </section>
        </div>
      </div>
      {isOwn && <>
        <SavedPosts
          profile={profile}
          onNavigate={onNavigate} />
        <ApplicationDashboard profile={profile} />
        <RecruiterDashboard
          key={focusJob || "all"}
          focusJob={focusJob}
          profile={profile}
          onNavigate={onNavigate}
          onNotice={onNotice} />
      </>}
    </>
  );
}
export function ProfileEditor({
  profile,
  onSave,
  onCancel,
  onNotice,
}: {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
  onNotice: (text: string) => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(() =>
    migrateProfile({
      ...profile,
      skillDetails: profile.skillDetails.length
        ? profile.skillDetails
        : undefined,
    }),
  );
  const [error, setError] = useState("");
  const [uploadCount, setUploadCount] = useState(0);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (uploadCount) return;
    setError("");
    if (!draft.firstName.trim() || !draft.lastName.trim() || !draft.country) {
      setError(
        t(
          "Renseignez votre nom, votre prénom et votre pays.",
          "Enter your last name, first name and country.",
        ),
      );
      return;
    }
    if (!validPseudo(draft.pseudo)) {
      setError(
        t(
          "Le pseudo doit contenir 3 à 30 caractères : lettres et chiffres uniquement.",
          "Your username must have 3–30 characters: letters and numbers only.",
        ),
      );
      return;
    }
    if (draft.portfolio.trim() && !safePortfolio(draft.portfolio.trim())) {
      setError(
        t("Le portfolio doit être une adresse http:// ou https:// valide."),
      );
      return;
    }
    const invalid =
      experienceError(draft.experiences) || skillError(draft.skillDetails);
    if (invalid) {
      setError(t(invalid));
      return;
    }
    onSave({
      ...draft,
      name: `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      pseudo: draft.pseudo.trim(),
      email: draft.email.trim(),
      skills: draft.skillDetails.map((s) => s.name.trim()).join(", "),
      portfolio: draft.portfolio.trim(),
    });
  }
  function uploadPhoto(file: File | undefined) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError(t("Choisis une image JPG, PNG ou WebP de 2 Mo maximum."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 240;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError(t("Impossible de préparer cette image."));
          return;
        }
        const side = Math.min(image.width, image.height);
        ctx.drawImage(
          image,
          (image.width - side) / 2,
          (image.height - side) / 2,
          side,
          side,
          0,
          0,
          240,
          240,
        );
        setDraft((current) => ({
          ...current,
          photo: canvas.toDataURL("image/jpeg", 0.85),
        }));
        setError(t(""));
      };
      image.onerror = () => setError(t("Cette image ne peut pas être lue."));
      image.src = data;
    };
    reader.onerror = () => setError(t("Impossible de lire cette image."));
    reader.readAsDataURL(file);
  }

  return (
    <section className="profile-edit-page">
      <button
        className="back-link"
        onClick={onCancel}>
        <ArrowLeft size={17} />
        {t("Revenir à mon profil")}
      </button>
      <div className="profile-editor-layout">
        <form
          className="panel edit-profile-form"
          onSubmit={submit}>
          <div className="section-title">
            <span className="round-icon">
              <Pencil size={20} />
            </span>
            <div>
              <h2>
                {t("Un profil qui te ressemble")}
              </h2>
              <p>
                {t(
                  "Vos informations, votre parcours et vos compétences.",
                  "Your details, experience and skills.",
                )}
              </p>
            </div>
          </div>
          <div className="photo-editor">
            <Avatar
              profile={draft}
              large />
            <div>
              <label className="upload-photo">
                <Camera size={17} />
                {t("Choisir une photo")}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => uploadPhoto(e.target.files?.[0])}
                />
              </label>
              <small>
                {t("Facultatif · JPG, PNG ou WebP · 2 Mo max.")}
              </small>
              {draft.photo && (
                <button
                  className="text-link"
                  type="button"
                  onClick={() => setDraft({ ...draft, photo: "" })}
                >
                  {t("Retirer la photo")}
                </button>
              )}
            </div>
          </div>
          <PersonalFields
            value={draft}
            onChange={(next) => setDraft({ ...draft, ...next })}
          />
          <div className="form-grid">
            <label>
              {t("Adresse e-mail")}
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                autoComplete="email"
              />
            </label>
            <label>
              {t("Intitulé du profil")}
              <input
                value={draft.role}
                maxLength={100}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </label>
          </div>
          <label>
            {t("Présentation")}
            <textarea
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              maxLength={1000}
            />
          </label>
          <section className="structured-editor-section">
            <ExperienceFields
              value={draft.experiences}
              onChange={(experiences) => setDraft({ ...draft, experiences })}
            />
            {draft.experience && (
              <details className="profile-legacy-note">
                <summary>
                  {t("Texte du profil précédent", "Previous profile text")}
                </summary>
                <textarea
                  aria-label={t("Ancien parcours", "Previous experience")}
                  value={draft.experience}
                  onChange={(e) =>
                    setDraft({ ...draft, experience: e.target.value })
                  }
                  maxLength={2000}
                />
              </details>
            )}
          </section>
          <section className="structured-editor-section">
            <SkillFields
              value={draft.skillDetails}
              documents={draft.documents}
              onBusy={busy => setUploadCount(n => Math.max(0, n + (busy ? 1 : -1)))}
              onDocumentsChange={documents => setDraft(current => ({ ...current, documents }))}
              onChange={(skillDetails) => setDraft({ ...draft, skillDetails })}
            />
          </section>
          <label>
            {t("Portfolio")}
            {" "}
            <span className="field-optional">
              {t("facultatif")}
            </span>
            <input
              type="url"
              value={draft.portfolio}
              placeholder="https://mon-portfolio.com"
              maxLength={500}
              onChange={(e) =>
                setDraft({ ...draft, portfolio: e.target.value })
              }
            />
          </label>
          {error && (
            <p
              className="form-error"
              role="alert">
              {t(error)}
            </p>
          )}
          <div className="editor-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}>
              {t("Annuler")}
            </button>
            <button
              className="btn-primary"
              disabled={uploadCount > 0}>
              <Check size={18} />
              {t("Enregistrer mon profil")}
            </button>
          </div>
        </form>
        <aside className="panel editor-tips">
          <Sparkles size={28} />
          <h2>
            {t("Fais découvrir ton potentiel.")}
          </h2>
          <p>
            {t(
              "Racontez votre parcours, même s’il débute. Chaque compétence peut ouvrir une nouvelle collaboration.",
              "Share your journey, even if it is just beginning. Every skill can open up a collaboration.",
            )}
          </p>
          <button
            className="text-link"
            onClick={() =>
              onNotice(
                t(
                  "Toutes les modifications restent sur cet appareil tant que Django n’est pas connecté.",
                ),
              )
            }
          >
            {t("Où sont enregistrées mes données ?")}
          </button>
        </aside>
      </div>
    </section>
  );
}
