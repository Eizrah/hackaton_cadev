import { useState, useEffect, type FormEvent, type ComponentType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Eye,
  EyeOff,
  Globe2,
  GraduationCap,
  HeartHandshake,
  LockKeyhole,
  Mail,
  Menu,
  MessagesSquare,
  Rocket,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
  X,
  type LucideProps,
} from "lucide-react";
import Github from "./components/GithubIcon";
import Workspace from "./components/Workspace";

type Page = "home" | "login" | "signup" | "forgot" | "workspace";
type Feature = {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<LucideProps>;
  tint: string;
  details: string;
};

const features: Feature[] = [
  {
    id: "communaute",
    title: "Communauté",
    description: "Posez des questions, partagez vos projets, obtenez de l'aide",
    Icon: UsersRound,
    tint: "blue",
    details:
      "Un espace pour publier, commenter et échanger avec les développeurs de toute l’Afrique.",
  },
  {
    id: "apprentissage",
    title: "Apprentissage",
    description: "Cours, tutoriels, exercices et projets pratiques",
    Icon: BookOpen,
    tint: "green",
    details:
      "Développez vos compétences en programmation grâce aux ressources partagées par la communauté.",
  },
  {
    id: "offres",
    title: "Offres",
    description: "Trouvez des stages, freelance et emplois dans la tech",
    Icon: BriefcaseBusiness,
    tint: "orange",
    details:
      "Découvrez des opportunités et collaborez sur des projets à travers le continent.",
  },
  {
    id: "groupes",
    title: "Groupes",
    description: "Rejoignez des groupes par technologie ou centres d’intérêt",
    Icon: MessagesSquare,
    tint: "purple",
    details:
      "Créez des groupes thématiques et apprenez avec des développeurs qui partagent vos intérêts.",
  },
  {
    id: "ia",
    title: "Assistant IA",
    description: "Obtenez de l'aide, expliquez du code, résolvez des problèmes",
    Icon: Bot,
    tint: "cyan",
    details:
      "Un futur assistant pour vous accompagner lorsque vous rencontrez des difficultés.",
  },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`brand ${compact ? "brand-compact" : ""}`}
      aria-label="DevAfrica Connect"
    >
      <img
        src="/images/africa-mark.png"
        alt="Afrique et Madagascar connectées"
      />
      <div className="brand-wordmark">
        <strong>
          Dev<span>Africa</span>
        </strong>
        <small>CONNECT</small>
      </div>
    </div>
  );
}

function Header({
  onNavigate,
  onChooseFeature,
}: {
  onNavigate: (page: Page) => void;
  onChooseFeature: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Accueil", action: () => onNavigate("home") },
    { label: "Communauté", action: () => onChooseFeature("communaute") },
    { label: "Apprentissage", action: () => onChooseFeature("apprentissage") },
    { label: "Offres", action: () => onChooseFeature("offres") },
    { label: "Groupes", action: () => onChooseFeature("groupes") },
    { label: "IA Assistant", action: () => onChooseFeature("ia") },
  ];
  return (
    <header className="site-header">
      <button
        className="brand-button"
        onClick={() => onNavigate("home")}
        aria-label="Retour à l'accueil"
      >
        <Brand />
      </button>
      <nav
        className={`main-nav ${open ? "nav-open" : ""}`}
        aria-label="Navigation principale"
      >
        {nav.map((item, index) => (
          <button
            key={item.label}
            className={`nav-item ${index === 0 ? "current" : ""}`}
            onClick={() => {
              item.action();
              setOpen(false);
            }}
          >
            {item.label}
          </button>
        ))}
        <div className="mobile-auth-actions">
          <button onClick={() => onNavigate("login")}>Se connecter</button>
          <button onClick={() => onNavigate("signup")}>S'inscrire</button>
        </div>
      </nav>
      <div className="header-actions">
        <button
          className="icon-button nav-search"
          aria-label="Aller à la recherche"
          onClick={() => document.getElementById("search-input")?.focus()}
        >
          <Search size={24} />
        </button>
        <button className="btn-ghost" onClick={() => onNavigate("login")}>
          Se connecter
        </button>
        <button className="btn-primary" onClick={() => onNavigate("signup")}>
          S'inscrire
        </button>
      </div>
      <button
        className="menu-toggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function Home({
  onNavigate,
  onModule,
}: {
  onNavigate: (page: Page) => void;
  onModule: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const found = features.filter((item) =>
    `${item.title} ${item.description}`
      .toLowerCase()
      .includes(term.toLowerCase()),
  );
  const feature = features.find((item) => item.id === selected);

  function chooseFeature(id: string) {
    setTerm("");
    setQuery("");
    setSelected(id);
    document
      .getElementById("modules")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="landing">
      <div className="hero-shell">
        <Header
          onNavigate={onNavigate}
          onChooseFeature={(id) => {
            chooseFeature(id);
            onModule(id);
          }}
        />
        <section className="hero-content" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">UNE COMMUNAUTÉ DE DÉVELOPPEURS AFRICAINS</p>
            <h1 id="hero-title">
              Construire aujourd’hui une <span>Afrique plus innovante</span>{" "}
              demain
            </h1>
            <p className="hero-description">
              DevAfrica Connect est une plateforme de développeurs, faite par
              des développeurs, pour échanger, apprendre, collaborer, trouver
              des opportunités et construire l’avenir technologique de
              l’Afrique.
            </p>
            <button
              className="cta-primary"
              onClick={() => onNavigate("signup")}
            >
              Rejoindre la communauté <ArrowRight size={22} />
            </button>
          </div>
          <div
            className="hero-visual"
            aria-label="Illustration d'un ordinateur de développement entouré d'interfaces connectées"
          >
            <img
              src="/images/hero-tech.png"
              alt="Ordinateur, code et interfaces communautaires technologiques"
            />
          </div>
        </section>
      </div>

      <section
        className="discovery"
        id="modules"
        aria-labelledby="discovery-title"
      >
        <h2 className="sr-only" id="discovery-title">
          Explorer DevAfrica Connect
        </h2>
        <form
          className="search-panel"
          onSubmit={(event) => {
            event.preventDefault();
            setTerm(query.trim());
            setSelected(null);
          }}
        >
          <Search size={25} aria-hidden="true" />
          <input
            id="search-input"
            aria-label="Rechercher parmi les fonctionnalités"
            placeholder="Rechercher des discussions, des offres, des membres, des compétences..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="btn-primary" type="submit">
            Rechercher
          </button>
        </form>
        <div className="feature-grid">
          {found.map((item) => {
            const Icon = item.Icon;
            return (
              <button
                className={`feature-card ${selected === item.id ? "feature-selected" : ""}`}
                key={item.id}
                onClick={() => onModule(item.id)}
              >
                <span className={`feature-icon ${item.tint}`}>
                  <Icon size={30} strokeWidth={2.2} />
                </span>
                <span className="feature-content">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </span>
                <span className={`feature-arrow ${item.tint}`}>
                  <ArrowRight size={22} />
                </span>
              </button>
            );
          })}
          {found.length === 0 && (
            <p className="no-results">
              Aucun module trouvé. Essaie « communauté », « offres » ou «
              apprentissage ».
            </p>
          )}
        </div>
        {feature && (
          <div className="feature-details" role="status">
            <div>
              <strong>{feature.title}</strong>
              <p>{feature.details}</p>
              <button onClick={() => onModule(feature.id)}>
                Explorer le module
              </button>
            </div>
            <button
              aria-label="Fermer le détail"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="values-row">
          <span>
            <Globe2 /> Par des développeurs africains
          </span>
          <span>
            <Code2 /> Open source & collaboratif
          </span>
          <span>
            <HeartHandshake /> Une communauté bienveillante
          </span>
          <span>
            <Rocket /> Des opportunités réelles
          </span>
        </div>
      </section>
      <section className="welcome-bottom">
        <div>
          <span>
            <Sparkles size={18} /> ENSEMBLE, ALLONS PLUS LOIN
          </span>
          <h2>Une communauté qui fait grandir les talents africains.</h2>
          <p>
            Partage tes idées, pose tes questions et trouve des personnes avec
            qui créer.
          </p>
        </div>
        <button className="cta-primary" onClick={() => onNavigate("signup")}>
          Commencer l'aventure <ArrowRight size={20} />
        </button>
      </section>
      <div className="demo-entry">
        <button className="text-link" onClick={() => onNavigate("workspace")}>
          Explorer la démonstration des 7 modules <ArrowRight size={18} />
        </button>
      </div>
      <footer className="site-footer">
        © DevAfrica Connect · Une plateforme par des développeurs, pour des
        développeurs.
      </footer>
    </main>
  );
}

function Auth({
  mode,
  onNavigate,
}: {
  mode: "login" | "signup" | "forgot";
  onNavigate: (page: Page) => void;
}) {
  const signup = mode === "signup";
  const forgot = mode === "forgot";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (forgot) {
      setMessage(
        "Formulaire validé en démo. Aucun e-mail envoyé : le service Django de récupération reste à connecter.",
      );
      return;
    }
    if (signup && name.trim().length < 2) {
      setMessage("Indique ton nom complet.");
      return;
    }
    if (!email.includes("@")) {
      setMessage("Saisis une adresse e-mail valide.");
      return;
    }
    if (password.length < 8) {
      setMessage("Ton mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setMessage(
      "Maquette validée ! La connexion à Django sera ajoutée ensuite. Aucun compte n’a encore été créé.",
    );
  }

  return (
    <main className="auth-page">
      <button className="auth-back" onClick={() => onNavigate("home")}>
        <ArrowLeft size={18} /> Retour à l'accueil
      </button>
      <div className="auth-card">
        <div className="auth-top">
          <Brand compact />
          <h1>
            {forgot
              ? "Mot de passe oublié ?"
              : signup
                ? "Créer un compte"
                : "Bon retour !"}
          </h1>
          <p>
            {forgot
              ? "Indiquez votre e-mail pour récupérer votre accès."
              : signup
                ? "Rejoignez une communauté de développeurs passionnés."
                : "Connectez-vous à votre compte pour continuer l’aventure."}
          </p>
        </div>
        <div className="auth-white">
          <svg
            className="auth-wave"
            viewBox="0 0 600 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 80 L0 58 C0 -5 38 -4 105 12 C230 42 290 63 365 44 C485 13 600 -20 600 62 L600 80 Z"
              fill="#f7faff"
            />
          </svg>
          <form className="auth-form" onSubmit={onSubmit}>
            {signup && (
              <label className="auth-input">
                <UserRound aria-hidden="true" />
                <input
                  aria-label="Nom complet"
                  placeholder="Nom complet"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
            )}
            <label className="auth-input">
              <Mail aria-hidden="true" />
              <input
                aria-label="Adresse e-mail"
                type="email"
                placeholder="votre@email.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            {!forgot && (
              <label className="auth-input">
                <LockKeyhole aria-hidden="true" />
                <input
                  aria-label="Mot de passe"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  autoComplete={signup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="eye-button"
                  aria-label={
                    passwordVisible
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff /> : <Eye />}
                </button>
              </label>
            )}
            {!signup && !forgot && (
              <div className="remember-row">
                <label>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />{" "}
                  Se souvenir de moi
                </label>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => onNavigate("forgot")}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}
            <button className="auth-submit" type="submit">
              {forgot
                ? "Récupérer mon accès"
                : signup
                  ? "S'inscrire"
                  : "Se connecter"}{" "}
              <ArrowRight size={23} />
            </button>
            {message && (
              <div className="auth-message" role="status">
                <CheckCircle2 size={18} />
                {message}
              </div>
            )}
            <div className="social-divider">
              <span>ou continuer avec</span>
            </div>
            <div
              className="social-row"
              aria-label="Autres options de connexion (à venir)"
            >
              <button
                disabled
                title="Connexion Google à configurer"
                aria-label="Google, bientôt disponible"
              >
                <span className="google-g">G</span>
              </button>
              <button
                disabled
                title="Connexion GitHub à configurer"
                aria-label="GitHub, bientôt disponible"
              >
                <Github size={23} />
              </button>
              <button
                disabled
                title="Connexion LinkedIn à configurer"
                aria-label="LinkedIn, bientôt disponible"
              >
                <span className="linkedin-in">in</span>
              </button>
            </div>
            <p className="auth-switch">
              {signup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
              <button
                type="button"
                onClick={() => onNavigate(signup ? "login" : "signup")}
              >
                {signup ? "Se connecter" : "S'inscrire"}
              </button>
            </p>
          </form>
        </div>
      </div>
      <button className="auth-demo" onClick={() => onNavigate("workspace")}>
        Explorer la démonstration sans compte <ArrowRight size={17} />
      </button>
      <p className="auth-note">
        <GraduationCap size={17} /> Prototype frontend : les données ne sont pas
        encore envoyées à Django.
      </p>
    </main>
  );
}

// La navigation par hash permet le retour navigateur et fonctionne sur un hébergement statique.
export default function App() {
  const readRoute = () => window.location.hash.slice(1) || "home";
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const sync = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  function navigate(next: Page) {
    window.location.hash = next;
  }
  if (route === "workspace" || route.startsWith("workspace/"))
    return (
      <Workspace
        key={route}
        initialTab={route.split("/")[1] || "communaute"}
        onHome={() => navigate("home")}
      />
    );
  if (route === "login" || route === "signup" || route === "forgot")
    return <Auth key={route} mode={route} onNavigate={navigate} />;
  return (
    <Home
      onNavigate={navigate}
      onModule={(id) => {
        window.location.hash = "workspace/" + id;
      }}
    />
  );
}
