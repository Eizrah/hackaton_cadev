import Modal from "./Modal";
import { bannedLoginError, loginWithDjango } from "../lib/auth";
import { usePeople } from "../data/people";
import type { CredentialAttachment } from "../data/profile";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useI18n } from "../i18n/context";
import { useLocalData } from "../lib/storage";
import {
  completeProfile,
  emptyPersonal,
  experienceError,
  skillError,
  validPseudo,
  initialProfile,
  migrateProfile,
  type Experience,
  type DeveloperSkill,
  type PersonalInformation,
} from "../data/profile";
import { ExperienceFields, PersonalFields, SkillFields } from "./ProfileFields";
import GithubIcon from "./GithubIcon";
import GoogleIcon from "./GoogleIcon";
import LanguageSwitcher from "./LanguageSwitcher";
import "../authentication.css";
type AuthMode = "signup" | "login" | "forgot";
type Destination = "home" | "signup" | "login" | "forgot" | "workspace";
export function PasswordField({
  label,
  value,
  onChange,
  confirm = false,
  newPassword = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  confirm?: boolean;
  newPassword?: boolean;
}) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  return (
    <label>
      {label}
      <span className="onboard-input">
        <LockKeyhole size={18} />
        <input
          type={visible ? "text" : "password"}
          autoComplete={
            confirm || newPassword ? "new-password" : "current-password"
          }
          name={confirm ? "passwordConfirmation" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={8}
          maxLength={128}
          placeholder={
            confirm
              ? t("Confirmez votre mot de passe", "Confirm your password")
              : t("Votre mot de passe", "Your password")
          }
        />
        <button
          type="button"
          className="register-eye"
          aria-label={
            visible
              ? t("Masquer le mot de passe", "Hide password")
              : t("Afficher le mot de passe", "Show password")
          }
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}
function SocialOptions() {
  const { t } = useI18n();
  return (
    <div className="register-social">
      <div className="register-divider">
        <span>
          {t("ou continuer avec", "or continue with")}
        </span>
      </div>
      <div className="register-social-buttons">
        <button
          type="button"
          disabled
          aria-label={t(
            "Google, connexion à configurer",
            "Google, sign-in not configured",
          )}
          title={t(
            "Connexion Google à configurer avec Django",
            "Configure Google sign-in with Django",
          )}
        >
          <GoogleIcon />
        </button>
        <button
          type="button"
          disabled
          aria-label={t(
            "GitHub, connexion à configurer",
            "GitHub, sign-in not configured",
          )}
          title={t(
            "Connexion GitHub à configurer avec Django",
            "Configure GitHub sign-in with Django",
          )}
        >
          <GithubIcon size={25} />
        </button>
      </div>
    </div>
  );
}
import { useToast } from "../lib/toastContext";
export default function Authentication({
  mode,
  onNavigate,
  onOpenProfile,
}: {
  mode: AuthMode;
  onNavigate: (destination: Destination) => void;
  onOpenProfile: () => void;
}) {
  const { t } = useI18n();
  const [profile, setProfile] = useLocalData(
    "profile",
    initialProfile,
    migrateProfile,
  );
  const [personal, setPersonal] = useState<PersonalInformation>(emptyPersonal),
    [experiences, setExperiences] = useState<Experience[]>([]),
    [skills, setSkills] = useState<DeveloperSkill[]>([]);
  const [documents, setDocuments] = useState<CredentialAttachment[]>([]);
  const [uploadCount, setUploadCount] = useState(0), [banned, setBanned] = useState(false), [logging, setLogging] = useState(false);
  const [people] = usePeople();
  const [step, setStep] = useState(0),
    [furthest, setFurthest] = useState(0),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [remember, setRemember] = useState(true),
    [error, setError] = useState(""),
    [done, setDone] = useState(false),
    [menu, setMenu] = useState(false);
  const form = useRef<HTMLFormElement>(null),
    card = useRef<HTMLElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const notify = useToast();
  const signup = mode === "signup",
    forgot = mode === "forgot";
  const labels = [
    t("Informations personnelles", "Personal information"),
    t("Expérience & compétences", "Experience & skills"),
    t("Accès au compte", "Account access"),
  ];
  function personalMessage() {
    if (!personal.firstName.trim() || !personal.lastName.trim())
      return t(
        "Indiquez votre nom et votre prénom.",
        "Enter your last name and first name.",
      );
    if (
      !Number.isInteger(Number(personal.age)) ||
      Number(personal.age) < 1 ||
      Number(personal.age) > 120
    )
      return t(
        "Indiquez un âge valide, entre 1 et 120 ans.",
        "Enter a valid age between 1 and 120.",
      );
    if (!["Débutant", "Intermédiaire", "Avancé"].includes(personal.level) || !personal.country)
      return t(
        "Choisissez votre niveau et votre pays.",
        "Choose your level and country.",
      );
    if (!validPseudo(personal.pseudo))
      return t(
        "Le pseudo doit contenir 3 à 30 caractères : lettres et chiffres uniquement.",
        "Your username must have 3–30 characters: letters and numbers only.",
      );
    return null;
  }
  function goStep(next: number) {
    setStep(next);
    setError("");
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      if (window.innerWidth < 1000)
        card.current?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  }
  function nextStep() {
    const problem =
      step === 0 ? personalMessage() : experienceError(experiences) || skillError(skills);
    if (problem) {
      setError(t(problem));
      return;
    }
    const next = step + 1;
    setFurthest(Math.max(furthest, next));
    goStep(next);
  }
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (uploadCount || logging) return;
    setError("");
    if (!signup) {
      if (forgot) {
        notify(
          t(
            "Formulaire validé en démonstration. Aucun e-mail n’a été envoyé : la récupération doit être reliée à Django.",
            "Demo form validated. No email was sent: connect password recovery to Django.",
          ),
        );
        return;
      }
      const known = [profile, ...people].find(person => person.email && person.email.toLowerCase() === email.trim().toLowerCase());
      if (known?.accountStatus === "banned") { setBanned(true); setPassword(""); return; }
      if (import.meta.env.VITE_AUTH_MODE === "api") {
        setLogging(true);
        try { const authenticated = await loginWithDjango(email.trim(), password, remember); if (authenticated.accountStatus === "banned") setBanned(true); else { setProfile(authenticated); setPassword(""); onOpenProfile(); } }
        catch (error) { if (bannedLoginError(error)) setBanned(true); else setError(t("Connexion impossible. Vérifie tes identifiants et réessaie.", "Could not sign in. Check your credentials and try again.")); }
        finally { setLogging(false); }
        return;
      }
      if (password.length < 8) {
        setError(
          t(
            "Le mot de passe doit contenir au moins 8 caractères.",
            "Your password must have at least 8 characters.",
          ),
        );
        return;
      }
      notify(
        t(
          "Formulaire de connexion prêt. Aucun compte n’est authentifié tant que Django n’est pas connecté.",
          "Sign-in form ready. No account is authenticated until Django is connected.",
        ),
      );
      return;
    }
    if (step < 2) {
      nextStep();
      return;
    }
    const invalidPersonal = personalMessage();
    if (invalidPersonal) {
      goStep(0);
      setError(invalidPersonal);
      return;
    }
    const invalidExperience = experienceError(experiences);
    if (invalidExperience) {
      goStep(1);
      setError(t(invalidExperience));
      return;
    }
    const invalidSkill = skillError(skills);
    if (invalidSkill) {
      goStep(1);
      setError(t(invalidSkill));
      return;
    }
    if (password !== confirmation) {
      setError(
        t("Les mots de passe ne correspondent pas.", "Passwords do not match."),
      );
      return;
    }
    if (password.length < 8) {
      setError(
        t(
          "Le mot de passe doit contenir au moins 8 caractères.",
          "Your password must have at least 8 characters.",
        ),
      );
      return;
    }
    setProfile(
      completeProfile(
        personal,
        experiences.map((e) => ({
          ...e,
          position: e.position.trim(),
          description: e.description.trim(),
          diploma: e.diploma.trim(),
          certificate: e.certificate.trim(),
        })),
        skills.map((s) => ({ ...s, name: s.name.trim() })),
        email,
        documents,
      ),
    );
    setPassword("");
    setConfirmation("");
    setDone(true);
    notify(t("Profil enregistré. Bienvenue dans la communauté DevAfrica !", "Profile saved. Welcome to the DevAfrica community!"));
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  }
  return (
    <main className={`registration-page registration-${mode}`}>
      {banned && <Modal
        title={t("Compte banni", "Account banned")}
        onClose={() => setBanned(false)}>
        <div className="banned-account">
          <p>
            {t("Ce compte a été banni. La connexion est suspendue. Tu peux contacter la modération pour demander un réexamen.", "This account has been banned. Sign-in is suspended. You can contact moderation to request a review.")}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setBanned(false)}>
            {t("J’ai compris", "Understood")}
          </button>
        </div>
      </Modal>}
      <header className="registration-header">
        <button
          className="register-brand"
          onClick={() => onNavigate("home")}
          aria-label={t(
            "DevAfrica Connect, accueil",
            "DevAfrica Connect, home",
          )}
        >
          <img
            src="/images/africa-mark.png"
            alt="" />
          <span>
            <strong>
              Dev<span>Africa</span>
            </strong>
            <small>CONNECT</small>
          </span>
        </button>
        <nav
          className={`registration-nav ${menu ? "open" : ""}`}
          aria-label={t("Navigation principale", "Main navigation")}
        >
          {[
            ["communaute", t("Communauté", "Community")],
            ["apprentissage", t("Apprentissage", "Learning")],
            ["offres", t("Offres", "Jobs")],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#workspace/${id}`}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="registration-header-actions">
          <span className="registration-account-question">
            {signup
              ? t("Déjà un compte ?", "Already have an account?")
              : t("Pas encore de compte ?", "Don’t have an account?")}
          </span>
          <button
            className="register-header-link"
            onClick={() => onNavigate(signup ? "login" : "signup")}
          >
            {signup
              ? t("Se connecter", "Sign in")
              : t("Créer un compte", "Create an account")}
          </button>
          <LanguageSwitcher />
          <button
            className="registration-menu"
            aria-label={
              menu
                ? t("Fermer le menu", "Close menu")
                : t("Ouvrir le menu", "Open menu")
            }
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <div className="registration-layout">
        <section
          className={`registration-card ${done ? "registration-complete" : ""}`}
          ref={card}
        >
          <div className="registration-card-heading">
            <h1
              ref={heading}
              tabIndex={-1}>
              {done
                ? t("Votre profil est prêt !", "Your profile is ready!")
                : signup
                  ? t("Créer votre compte", "Create your account")
                  : forgot
                    ? t("Retrouver votre accès", "Recover your access")
                    : t("Bon retour !", "Welcome back!")}
            </h1>
            <p>
              {done
                ? t(
                  "Vos informations sont réunies. Découvrez votre espace DevAfrica.",
                  "Your information is ready. Explore your DevAfrica space.",
                )
                : signup
                  ? t(
                    "Rejoignez une communauté de développeurs passionnés et développez vos compétences.",
                    "Join a community of passionate developers and grow your skills.",
                  )
                  : forgot
                    ? t(
                      "Indiquez votre adresse e-mail pour préparer la récupération de votre compte.",
                      "Enter your email to prepare account recovery.",
                    )
                    : t(
                      "Connectez-vous pour retrouver vos projets, vos échanges et votre communauté.",
                      "Sign in to find your projects, conversations and community.",
                    )}
            </p>
          </div>
          {signup && !done && (
            <nav
              className="registration-stepper"
              aria-label={t(
                "Étapes de création du compte",
                "Account creation steps",
              )}
            >
              <ol>
                {labels.map((label, index) => (
                  <li
                    key={label}
                    className={
                      step === index ? "active" : step > index ? "complete" : ""
                    }
                  >
                    <button
                      type="button"
                      aria-current={step === index ? "step" : undefined}
                      aria-label={`${t("Étape", "Step")} ${index + 1} : ${label}`}
                      disabled={index > furthest || uploadCount > 0}
                      onClick={() => {
                        if (index <= step) goStep(index);
                        else if (form.current?.reportValidity()) {
                          const problem =
                            step === 0
                              ? personalMessage()
                              : experienceError(experiences) || skillError(skills);
                          if (problem) setError(t(problem));
                          else goStep(index);
                        }
                      }}
                    >
                      <span className="step-number">
                        {step > index ? <Check size={17} /> : index + 1}
                      </span>
                      <span>
                        {label}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {done ? (
            <div className="registration-success">
              <span className="registration-success-symbol">
                <CheckCircle2 size={39} />
              </span>
              <h2>
                {personal.firstName}
                {" "}
                {personal.lastName}
              </h2>
              <p>
                @{personal.pseudo} · {t(personal.level)} · {personal.country}
              </p>
              <div className="registration-summary">
                <span>
                  {experiences.length}
                  {" "}
                  {t("expérience(s)", "experience(s)")}
                </span>
                <span>
                  {skills.length}
                  {" "}
                  {t("compétence(s)", "skill(s)")}
                </span>
              </div>
              <div
                className="registration-demo-message"
                role="status">
                {t(
                  "Profil de démonstration enregistré sur cet appareil. Aucun compte serveur n’a été créé et aucun mot de passe n’a été conservé.",
                  "Demo profile saved on this device. No server account was created and no password was stored.",
                )}
              </div>
              <button
                className="register-continue"
                onClick={onOpenProfile}>
                {t("Découvrir mon profil", "View my profile")}
                <ArrowRight size={19} />
              </button>
            </div>
          ) : (
            <form
              className="registration-form"
              ref={form}
              onSubmit={onSubmit}>
              {signup ? (
                step === 0 ? (
                  <PersonalFields
                    value={personal}
                    onChange={setPersonal} />
                ) : step === 1 ? (
                  <>
                    <ExperienceFields
                      value={experiences}
                      onChange={setExperiences} />
                    <SkillFields
                      value={skills}
                      onChange={setSkills}
                      documents={documents}
                      onDocumentsChange={setDocuments}
                      onBusy={busy => setUploadCount(n => Math.max(0, n + (busy ? 1 : -1)))} />
                  </>
                ) : (
                  <>
                    <fieldset className="account-access">
                      <legend>
                        {t("Accès au compte", "Account access")}
                      </legend>
                      <p>
                        {t(
                          "Vos identifiants pour vous connecter à DevAfrica.",
                          "Your credentials for signing in to DevAfrica.",
                        )}
                      </p>
                      <label>
                        {t("Adresse e-mail", "Email address")}
                        <span className="onboard-input">
                          <Mail size={18} />
                          <input
                            name="email"
                            type="email"
                            value={email}
                            autoComplete="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("vous@exemple.com", "you@example.com")}
                            maxLength={254}
                          />
                        </span>
                      </label>
                      <PasswordField
                        label={t("Mot de passe", "Password")}
                        value={password}
                        onChange={setPassword}
                        newPassword
                      />
                      <PasswordField
                        label={t(
                          "Confirmer le mot de passe",
                          "Confirm password",
                        )}
                        value={confirmation}
                        onChange={setConfirmation}
                        confirm
                      />
                      <small>
                        {t(
                          "8 caractères minimum. Le mot de passe n’est pas enregistré dans la démonstration.",
                          "At least 8 characters. The demo does not store passwords.",
                        )}
                      </small>
                    </fieldset>
                  </>
                )
              ) : (
                <div className="signin-fields">
                  <label>
                    {t("Adresse e-mail", "Email address")}
                    <span className="onboard-input">
                      <Mail size={18} />
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("vous@exemple.com", "you@example.com")}
                        maxLength={254}
                      />
                    </span>
                  </label>
                  {!forgot && (
                    <>
                      <PasswordField
                        label={t("Mot de passe", "Password")}
                        value={password}
                        onChange={setPassword}
                      />
                      <div className="register-remember">
                        <label>
                          <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                          />
                          {t("Se souvenir de moi", "Remember me")}
                        </label>
                        <button
                          type="button"
                          onClick={() => onNavigate("forgot")}
                        >
                          {t("Mot de passe oublié ?", "Forgot password?")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {error && (
                <p
                  className="registration-error"
                  role="alert">
                  {t(error)}
                </p>
              )}
              <div className="register-form-actions">
                {signup && step > 0 && (
                  <button
                    type="button"
                    className="register-previous"
                    onClick={() => goStep(step - 1)}
                  >
                    <ArrowLeft size={16} />
                    {t("Retour", "Back")}
                  </button>
                )}
                <button
                  className="register-continue"
                  type="submit"
                  disabled={uploadCount > 0 || logging}>
                  {signup
                    ? step < 2
                      ? t("Continuer", "Continue")
                      : t("Créer mon compte", "Create my account")
                    : forgot
                      ? t("Préparer la récupération", "Prepare recovery")
                      : t("Se connecter", "Sign in")}
                  <ArrowRight size={19} />
                </button>
              </div>
            </form>
          )}
          {!done && (
            <>
              <p className="registration-switch">
                {signup
                  ? t("Déjà un compte ?", "Already have an account?")
                  : forgot
                    ? t(
                      "Vous connaissez votre mot de passe ?",
                      "Remember your password?",
                    )
                    : t(
                      "Pas encore de compte ?",
                      "Don’t have an account?",
                    )}
                {" "}
                <button
                  onClick={() =>
                    onNavigate(signup || forgot ? "login" : "signup")
                  }
                >
                  {signup || forgot
                    ? t("Se connecter", "Sign in")
                    : t("Créer un compte", "Create an account")}
                </button>
              </p>
              <SocialOptions />
            </>
          )}
        </section>
        <aside
          className="registration-art"
          aria-label={t(
            "Illustration de développement",
            "Development illustration",
          )}
        >
          <span className="register-art-badge">
            <Code2 size={23} />
            <span>
              {t("Un continent de talents.", "A continent of talent.")}
              <strong>
                {t("Construisons ensemble.", "Let’s build together.")}
              </strong>
            </span>
          </span>
          <img
            src="/images/auth-developer.jpg"
            alt={t(
              "Développeur devant des interfaces de code",
              "Developer working with code interfaces",
            )}
            className="registration-illustration"
          />
          <div className="register-art-caption">
            <span />
            <p>
              {t(
                "Apprendre. Partager. Faire grandir ses idées.",
                "Learn. Share. Bring ideas to life.",
              )}
            </p>
          </div>
        </aside>
      </div>
      <footer className="registration-footer">
        <button onClick={() => onNavigate("home")}>
          <ArrowLeft size={14} />
          {t("Retour à l’accueil", "Back to home")}
        </button>
        <span>
          {t(
            "Démonstration frontend · intégration Django à venir",
            "Frontend demo · Django integration to follow",
          )}
        </span>
        <button onClick={() => onNavigate("workspace")}>
          {t("Explorer la démonstration", "Explore the demo")}
          <ArrowRight size={14} />
        </button>
      </footer>
    </main>
  );
}
