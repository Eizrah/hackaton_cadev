import SavedPosts from "./SavedPosts";
import MyPosts from "./MyPosts";
import MyOffers from "./MyOffers";
import { AttachmentCard } from "../shared/Attachments";
import { useI18n } from "../../i18n/context";
import ApplicationDashboard from "./ApplicationDashboard";
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
  KeyRound,
  AtSign,
  Pencil,
  Share2,
  Sparkles,
  UserRound,
  Trash2,
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
} from "../../data/profile";
import { safePortfolio } from "../../lib/urls";
import TechIcon, { SkillChip } from "../TechIcon";
import { authApi } from "../../api/auth";
import { apiError } from "../../api/client";
import Modal from "../Modal";
function Avatar({
  profile,
  large = false,
}: {
  profile: Profile;
  large?: boolean;
}) {
  return (
    <div className={large ? "profile-avatar" : "avatar"}>
      {profile.photo ? (
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
function CredentialsActions({ profile, onNotice, onSaved }: {
  profile: Profile;
  onNotice: (message: string) => void;
  onSaved: (credentials: Pick<Profile, "email" | "pseudo">) => void;
}) {
  const { t } = useI18n();
  const [popup, setPopup] = useState<"password" | "credentials" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function close() {
    setPopup(null);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const current = String(form.get("currentPassword") || "");
    setBusy(true);
    setError("");
    try {
      if (popup === "credentials") {
        const email = String(form.get("email") || "").trim();
        const pseudo = String(form.get("pseudo") || "").trim();
        if (email === profile.email && pseudo === profile.pseudo) {
          setError(t("Modifie ton e-mail ou ton pseudo.", "Change your email or username."));
          return;
        }
        const { data } = await authApi.modifierEmailPseudo({
          email: email === profile.email ? undefined : email,
          pseudo: pseudo === profile.pseudo ? undefined : pseudo,
          mot_de_passe: current,
        });
        onSaved(data);
        onNotice(t("Identifiants mis à jour.", "Account details updated."));
      } else {
        const password = String(form.get("password") || "");
        const confirmation = String(form.get("confirmation") || "");
        if (password !== confirmation) {
          setError(t("Les mots de passe ne correspondent pas.", "Passwords do not match."));
          return;
        }
        await authApi.changerMotDePasse({
          ancien_mot_de_passe: current, nouveau_mot_de_passe: password, confirmation,
        });
        onNotice(t("Mot de passe modifié avec succès.", "Password changed successfully."));
      }
      close();
    } catch (err) {
      setError(apiError(err, t("Impossible de modifier les identifiants.", "Could not update your credentials.")));
    } finally {
      setBusy(false);
    }
  }

  return <section className="panel editor-tips profile-security" aria-labelledby="profile-security-title">
    <div className="section-title">
      <span className="round-icon"><KeyRound size={20} /></span>
      <h2 id="profile-security-title">{t("Sécurité", "Security")}</h2>
    </div>
    <button type="button" className="btn-outline" onClick={() => setPopup("credentials")}>
      <AtSign size={16} /> {t("Modifier l’e-mail ou le pseudo", "Edit email or username")}
    </button>
    <button type="button" className="btn-outline" onClick={() => setPopup("password")}>
      <KeyRound size={16} /> {t("Changer le mot de passe", "Change password")}
    </button>

    {popup && <Modal
      title={popup === "delete"
        ? t("Supprimer mon compte", "Delete my account")
        : popup === "credentials"
        ? t("Modifier l’e-mail ou le pseudo", "Edit email or username")
        : t("Changer le mot de passe", "Change password")}
      onClose={close} busy={busy}>
      <form className="job-form" onSubmit={submit}>
        {popup === "delete" && (
          <div style={{ marginBottom: "1rem", padding: "1rem", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px" }}>
            <p style={{ margin: 0, color: "#991b1b", fontWeight: 500 }}>
              {t("?? Cette action est irr�versible. Toutes vos donn�es seront d�finitivement supprim�es.", "?? This action is irreversible. All your data will be permanently deleted.")}
            </p>
          </div>
        )}
        {popup === "credentials" && <label>
          {t("Adresse e-mail", "Email address")}
          <input name="email" type="email" autoComplete="email" defaultValue={profile.email} required />
        </label>}
        <label>
          {t("Mot de passe actuel", "Current password")}
          <input name="currentPassword" type="password" autoComplete="current-password" required />
        </label>
        {popup === "credentials" ? <label>
          {t("Pseudo", "Username")}
          <input name="pseudo" autoComplete="username" defaultValue={profile.pseudo} required maxLength={50} />
        </label> : popup === "password" ? <>
          <label>
            {t("Nouveau mot de passe", "New password")}
            <input name="password" type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <label>
            {t("Confirmer le nouveau mot de passe", "Confirm new password")}
            <input name="confirmation" type="password" autoComplete="new-password" minLength={8} required />
          </label>
        </> : null}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={close} disabled={busy}>{t("Annuler", "Cancel")}</button>
          <button type="submit" className="btn-primary" disabled={busy}>{t("Enregistrer", "Save")}</button>
        </div>
      </form>
    </Modal>}
  </section>;
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
  focusJob?: string;
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
      const url = new URL(window.location.href);
      url.hash = `workspace/profil/membre/${encodeURIComponent(profile.publicId || profile.pseudo || profile.email)}`;
      await navigator.clipboard.writeText(url.href);
      onNotice(
        t(
          "Lien du profil copié.",
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
                      {[entry.year, entry.nbr_annee_exp && `${entry.nbr_annee_exp} ${t("an(s) d’expérience", "year(s) of experience")}`]
                        .filter(Boolean).join(" · ")}
                    </span>
                    <h3>{entry.position}</h3>
                    <p>{entry.description}</p>
                    {(entry.diploma || entry.certificate || entry.diplomaUrl || entry.certificateUrl || entry.diplomaFile || entry.certificateFile) && (
                      <div className="experience-credentials">
                        {entry.diploma && (
                          <span className="credential-badge">
                            <GraduationCap size={14} />
                            {entry.diploma}
                          </span>
                        )}
                        {entry.certificate && (
                          <span className="credential-badge">
                            <GraduationCap size={14} />
                            {entry.certificate}
                          </span>
                        )}
                        {isOwn && ([
                          [safePortfolio(entry.diplomaUrl || ""), entry.diplomaFile, t("Ouvrir le diplôme", "Open diploma")],
                          [safePortfolio(entry.certificateUrl || ""), entry.certificateFile, t("Ouvrir le certificat", "Open certificate")],
                        ] as const).map(([url, file, label]) => file
                          ? <AttachmentCard key={label} file={file} preview={false} />
                          : url && <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
                        )}
                      </div>
                    )}
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
        <SavedPosts onNavigate={onNavigate} onNotice={onNotice} />
        <ApplicationDashboard onNotice={onNotice} />
        <MyPosts profile={profile} onNotice={onNotice} />
        <MyOffers key={focusJob || "all"} onNavigate={onNavigate} onNotice={onNotice} focusJob={focusJob} />
      </>}
    </>
  );
}
export function ProfileEditor({
  profile,
  onSave,
  onCredentialsSaved,
  onCancel,
  onNotice,
}: {
  profile: Profile;
  onSave: (profile: Profile) => Promise<void>;
  onCredentialsSaved: (credentials: Pick<Profile, "email" | "pseudo">) => void;
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
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    if (!deletePassword.trim()) {
      setDeleteError(t("Le mot de passe est requis.", "Password is required."));
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      await authApi.supprimerCompte({
        password: deletePassword,
        refresh: refreshToken || undefined,
      });
      
      // Déconnexion et redirection
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("devafrica:profile");
      
      onNotice(t("Votre compte a été supprimé.", "Your account has been deleted."));
      window.location.hash = "#login";
    } catch (err) {
      setDeleteError(apiError(err, t("Impossible de supprimer le compte.", "Could not delete your account.")));
    } finally {
      setDeleting(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (uploadCount || saving) return;
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
    setSaving(true);
    try {
      await onSave({
        ...draft,
        name: `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim(),
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        pseudo: profile.pseudo,
        email: profile.email,
        skills: draft.skillDetails.map(skill => skill.name.trim()).join(", "),
        portfolio: draft.portfolio.trim(),
      });
    } catch (err) {
      setError(apiError(err, t("Impossible d’enregistrer le profil.", "Could not save your profile.")));
    } finally {
      setSaving(false);
    }
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
            showPseudo={false}
            onChange={(next) => setDraft({ ...draft, ...next })}
          />
          <div className="form-grid">
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
              onChange={experiences => setDraft(current => ({ ...current, experiences }))}
              onBusy={busy => setUploadCount(n => Math.max(0, n + (busy ? 1 : -1)))}
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
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              style={{ 
                backgroundColor: "#dc2626", 
                color: "white", 
                border: "none", 
                padding: "0.75rem 1.5rem", 
                borderRadius: "0.375rem", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: 500
              }}
              onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={16} /> {t("Supprimer mon compte", "Delete my account")}
            </button>
          </div>
          <div className="editor-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}>
              {t("Annuler")}
            </button>
            <button
              className="btn-primary"
              disabled={saving || uploadCount > 0}>
              <Check size={18} />
              {t("Enregistrer mon profil")}
            </button>
          </div>
        </form>
        <aside className="profile-editor-sidebar">
          <CredentialsActions profile={profile} onNotice={onNotice} onSaved={onCredentialsSaved} />
          <section className="panel editor-tips">
            <Sparkles size={28} />
            <h2>{t("Fais découvrir ton potentiel.")}</h2>
            <p>{t(
              "Racontez votre parcours, même s’il débute. Chaque compétence peut ouvrir une nouvelle collaboration.",
              "Share your journey, even if it is just beginning. Every skill can open up a collaboration.",
            )}</p>
          </section>
        </aside>
      </div>
      {showDeleteConfirm && <Modal
        title={t("Supprimer mon compte", "Delete my account")}
        onClose={() => { setShowDeleteConfirm(false); setDeletePassword(""); setDeleteError(""); }}
        busy={deleting}>
        <div className="job-form">
          <div style={{ marginBottom: "1rem", padding: "1rem", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px" }}>
            <p style={{ margin: 0, color: "#991b1b", fontWeight: 500 }}>
              {t("⚠️ Cette action est irréversible. Toutes vos données seront définitivement supprimées.", "⚠️ This action is irreversible. All your data will be permanently deleted.")}
            </p>
          </div>
          <label>
            {t("Confirmer avec votre mot de passe", "Confirm with your password")}
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              autoComplete="current-password"
              disabled={deleting}
              required
            />
          </label>
          {deleteError && <p className="form-error" role="alert">{deleteError}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); setDeleteError(""); }} disabled={deleting}>
              {t("Annuler", "Cancel")}
            </button>
            <button
              type="button"
              style={{ backgroundColor: "#dc2626", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "0.375rem", cursor: "pointer" }}
              onClick={handleDeleteAccount}
              disabled={deleting}>
              {t("Supprimer définitivement", "Delete permanently")}
            </button>
          </div>
        </div>
      </Modal>}
    </section>
  );
}


