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
import { africanCountries } from "../../data/countries";
import { safePortfolio } from "../../lib/urls";
import { SkillChip } from "../TechIcon";
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
        <img src={profile.photo} alt={`Photo de ${profile.name}`} />
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
}: {
  profile: Profile;
  onEdit: () => void;
  onNotice: (message: string) => void;
}) {
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
        "Lien du profil copié. Dans cette démo, les données du profil restent sur cet appareil.",
      );
    } catch {
      onNotice(
        "La copie automatique est indisponible. Tu peux copier l’adresse de cette page.",
      );
    }
  }
  return (
    <div className="profile-layout">
      <section className="glass-profile" aria-label="Carte de profil">
        <div className="profile-card-top">
          <span className="mini-label">DÉVELOPPEUR · DEVAfrica</span>
          <button
            className="glass-icon"
            aria-label="Copier le lien du profil"
            onClick={shareProfile}
          >
            <Share2 size={22} />
          </button>
        </div>
        <Avatar profile={profile} large />
        <h2>{profile.name}</h2>
        <p className="profile-role">
          {profile.role || "Développeur de la communauté"}
        </p>
        <CountryFlag country={profile.country} />
        <div className="profile-skill-preview">
          {skills.slice(0, 4).map((s) => (
            <SkillChip key={s} name={s} />
          ))}
        </div>
        <div className="profile-stats">
          <div>
            <strong>{skills.length}</strong>
            <span>Compétences</span>
          </div>
          <div>
            <strong>{progress.length}</strong>
            <span>Fiches validées</span>
          </div>
          <div>
            <strong>{contributions}</strong>
            <span>Publications</span>
          </div>
        </div>
        <div className="profile-card-bottom">
          <button className="glass-edit" onClick={onEdit}>
            Modifier mon profil
            <Pencil size={18} />
          </button>
          {portfolio ? (
            <a
              className="glass-portfolio"
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir mon portfolio"
            >
              <ExternalLink size={23} />
            </a>
          ) : (
            <button
              className="glass-portfolio"
              onClick={onEdit}
              aria-label="Ajouter mon portfolio"
            >
              <Globe2 size={23} />
            </button>
          )}
        </div>
      </section>
      <div className="profile-details">
        <section className="panel">
          <div className="section-title">
            <span className="round-icon">
              <UserRound size={20} />
            </span>
            <h2>À propos de moi</h2>
            <span className="level-pill">{profile.level}</span>
          </div>
          <p className="preserve-lines">
            {profile.bio ||
              "Ajoute quelques mots sur ce que tu aimes construire."}
          </p>
        </section>
        <section className="panel">
          <div className="section-title">
            <span className="round-icon">
              <Code2 size={20} />
            </span>
            <h2>Mes compétences</h2>
          </div>
          <div className="skills-wall">
            {skills.length ? (
              skills.map((s) => <SkillChip name={s} key={s} />)
            ) : (
              <p>Aucune compétence renseignée pour le moment.</p>
            )}
          </div>
        </section>
        <section className="panel">
          <div className="section-title">
            <span className="round-icon">
              <GraduationCap size={20} />
            </span>
            <h2>Mon parcours</h2>
          </div>
          <p className="preserve-lines">
            {profile.experience ||
              "Ton parcours se construit. Ajoute une expérience, un diplôme ou un projet."}
          </p>
        </section>
        <section className="panel portfolio-panel">
          <div>
            <h2>Mon portfolio</h2>
            <p>
              {portfolio
                ? "Une autre façon de découvrir mon univers."
                : "Un site, des projets, ton univers créatif. Le lien est facultatif."}
            </p>
          </div>
          {portfolio ? (
            <a
              className="btn-primary"
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir le portfolio
              <ExternalLink size={17} />
            </a>
          ) : (
            <button className="text-link" onClick={onEdit}>
              Ajouter un lien
              <ArrowRight size={17} />
            </button>
          )}
        </section>
      </div>
    </div>
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
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  const skills = draft.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!draft.name.trim() || !draft.country.trim()) {
      setError("Le nom et le pays sont obligatoires.");
      return;
    }
    if (draft.portfolio.trim() && !safePortfolio(draft.portfolio.trim())) {
      setError(
        "Le portfolio doit être une adresse http:// ou https:// valide.",
      );
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      country: draft.country.trim(),
      skills: [...new Set(skills)].join(", "),
      portfolio: draft.portfolio.trim(),
    });
  }
  function uploadPhoto(file: File | undefined) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError("Choisis une image JPG, PNG ou WebP de 2 Mo maximum.");
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
          setError("Impossible de préparer cette image.");
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
        setError("");
      };
      image.onerror = () => setError("Cette image ne peut pas être lue.");
      image.src = data;
    };
    reader.onerror = () => setError("Impossible de lire cette image.");
    reader.readAsDataURL(file);
  }
  return (
    <section className="profile-edit-page">
      <button className="back-link" onClick={onCancel}>
        <ArrowLeft size={17} />
        Revenir à mon profil
      </button>
      <div className="profile-editor-layout">
        <form className="panel edit-profile-form" onSubmit={submit}>
          <div className="section-title">
            <span className="round-icon">
              <Pencil size={20} />
            </span>
            <div>
              <h2>Un profil qui te ressemble</h2>
              <p>Présente tes compétences et ce que tu souhaites créer.</p>
            </div>
          </div>
          <div className="photo-editor">
            <Avatar profile={draft} large />
            <div>
              <label className="upload-photo">
                <Camera size={17} />
                Choisir une photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => uploadPhoto(e.target.files?.[0])}
                />
              </label>
              <small>Facultatif · JPG, PNG ou WebP · 2 Mo max.</small>
              {draft.photo && (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setDraft({ ...draft, photo: "" })}
                >
                  Retirer la photo
                </button>
              )}
            </div>
          </div>
          <div className="form-grid">
            <label>
              Nom complet
              <input
                required
                value={draft.name}
                maxLength={80}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label>
              Pays
              <input
                required
                list="african-countries"
                value={draft.country}
                maxLength={80}
                onChange={(e) =>
                  setDraft({ ...draft, country: e.target.value })
                }
              />
              <datalist id="african-countries">
                {africanCountries.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <label>
              Intitulé du profil
              <input
                value={draft.role}
                placeholder="Développeuse frontend · UI/UX"
                maxLength={100}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </label>
            <label>
              Niveau
              <select
                value={draft.level}
                onChange={(e) => setDraft({ ...draft, level: e.target.value })}
              >
                {["Débutant", "Intermédiaire", "Avancé", "Expert"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Présentation
            <textarea
              value={draft.bio}
              maxLength={1000}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            />
          </label>
          <label>
            Compétences
            <span className="field-help">
              Sépare les noms par des virgules. Exemple : React, Python, Figma.
            </span>
            <input
              value={draft.skills}
              maxLength={500}
              onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
            />
          </label>
          <div className="skills-wall">
            {skills.map((s, i) => (
              <SkillChip key={`${s}-${i}`} name={s} />
            ))}
          </div>
          <label>
            Expériences, diplômes et projets
            <textarea
              value={draft.experience}
              maxLength={2000}
              onChange={(e) =>
                setDraft({ ...draft, experience: e.target.value })
              }
            />
          </label>
          <label>
            Portfolio <span className="field-optional">facultatif</span>
            <input
              type="url"
              value={draft.portfolio}
              placeholder="https://mon-portfolio.com"
              maxLength={500}
              onChange={(e) =>
                setDraft({ ...draft, portfolio: e.target.value })
              }
            />
            <span className="field-help">Tu peux laisser ce champ vide.</span>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="editor-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} />
              Enregistrer mon profil
            </button>
          </div>
        </form>
        <aside className="panel editor-tips">
          <Sparkles size={28} />
          <h2>Fais découvrir ton potentiel.</h2>
          <p>
            Pas besoin d’être expert pour avoir sa place ici. Tes idées, ton
            envie d’apprendre et tes projets comptent.
          </p>
          <ul>
            <li>Utilise un intitulé simple.</li>
            <li>Ajoute tes outils et langages.</li>
            <li>Présente ce que tu aimerais construire.</li>
          </ul>
          <button
            className="text-link"
            onClick={() =>
              onNotice(
                "Toutes les modifications restent sur cet appareil tant que Django n’est pas connecté.",
              )
            }
          >
            Où sont enregistrées mes données ?
          </button>
        </aside>
      </div>
    </section>
  );
}
