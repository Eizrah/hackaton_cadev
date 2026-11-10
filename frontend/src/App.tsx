import { useI18n } from "./i18n/context";
import { useHashRoute, navigateHash } from "./lib/navigation";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useState, type ComponentType } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Code2,
  Globe2,
  HeartHandshake,
  Menu,
  MessagesSquare,
  Rocket,
  Search,
  Sparkles,
  UsersRound,
  X,
  type LucideProps,
} from "lucide-react";
import Authentication from "./components/Authentication";
import PasswordRecovery from "./components/PasswordRecovery";
import Workspace from "./components/Workspace";
import HomeHighlights from "./components/HomeHighlights";

type Page = "home" | "login" | "signup" | "forgot" | "reset" | "workspace";
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
    id: "messages",
    title: "Messagerie",
    description:
      "Conversations privées et groupes par technologie ou centres d’intérêt",
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
  const { t } = useI18n();

  return (
    <div
      className={`brand ${compact ? "brand-compact" : ""}`}
      aria-label={t("DevAfrica Connect")}
    >
      <img
        src="/images/africa-mark.png"
        alt={t("Afrique et Madagascar connectées", "Connected Africa and Madagascar")}
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
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Accueil", action: () => onNavigate("home") },
    { label: "Communauté", action: () => onChooseFeature("communaute") },
    { label: "Apprentissage", action: () => onChooseFeature("apprentissage") },
    { label: "Offres", action: () => onChooseFeature("offres") },
    { label: "Messagerie", action: () => onChooseFeature("messages") },
    { label: "IA Assistant", action: () => onChooseFeature("ia") },
  ];
  return (
    <header className="site-header">
      <button
        className="brand-button"
        onClick={() => onNavigate("home")}
        aria-label={t("Retour à l'accueil")}
      >
        <Brand />
      </button>
      <nav
        className={`main-nav ${open ? "nav-open" : ""}`}
        aria-label={t("Navigation principale")}
      >
        {nav.map((item, index) => (
          <button
            key={t(item.label)}
            className={`nav-item ${index === 0 ? "current" : ""}`}
            onClick={() => {
              item.action();
              setOpen(false);
            }}
          >
            {t(item.label)}
          </button>
        ))}
        <div className="mobile-auth-actions">
          <button onClick={() => onNavigate("login")}>
            {t("Se connecter")}
          </button>
          <button onClick={() => onNavigate("signup")}>
            {t("S'inscrire")}
          </button>
        </div>
      </nav>
      <div className="header-actions">
        <button
          className="icon-button nav-search"
          aria-label={t("Aller à la recherche")}
          onClick={() => document.getElementById("search-input")?.focus()}
        >
          <Search size={24} />
        </button>
        <button className="btn-ghost" onClick={() => onNavigate("login")}>
          {t("Se connecter")}
        </button>
        <button className="btn-primary" onClick={() => onNavigate("signup")}>
          {t("S'inscrire")}
        </button>
      </div>
      <div className="landing-language-slot">
        <LanguageSwitcher />
      </div>
      <button
        className="menu-toggle"
        aria-label={open ? t("Fermer le menu") : t("Ouvrir le menu")}
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
  const { t } = useI18n();

  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const found = features.filter((item) =>
    `${t(item.title)} ${t(item.description)}`
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
            <p className="eyebrow">
              {t("UNE COMMUNAUTÉ DE DÉVELOPPEURS AFRICAINS")}
            </p>
            <h1 id="hero-title">
              {t("Construire aujourd’hui une") + " "}
              <span>{t("Afrique plus innovante")}</span> {" " + t("demain")}
            </h1>
            <p className="hero-description">
              {t(
                "DevAfrica Connect est une plateforme de développeurs, faite par des développeurs, pour échanger, apprendre, collaborer, trouver des opportunités et construire l’avenir technologique de l’Afrique.",
              )}
            </p>
            <button
              className="cta-primary"
              onClick={() => onNavigate("signup")}
            >
              {t("Rejoindre la communauté")}
              <ArrowRight size={22} />
            </button>
          </div>
          <div
            className="hero-visual"
            aria-label={t(
              "Illustration d'un ordinateur de développement entouré d'interfaces connectées",
            )}
          >
            <img
              src="/images/hero-tech.png"
              alt={t("Ordinateur, code et interfaces communautaires technologiques", "Laptop, code and connected community interfaces")}
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
          {t("Explorer DevAfrica Connect")}
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
            aria-label={t("Rechercher parmi les fonctionnalités")}
            placeholder={t(
              "Rechercher des discussions, des offres, des membres, des compétences...",
            )}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="btn-primary" type="submit">
            {t("Rechercher")}
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
                  <strong>{t(item.title)}</strong>
                  <span>{t(item.description)}</span>
                </span>
                <span className={`feature-arrow ${item.tint}`}>
                  <ArrowRight size={22} />
                </span>
              </button>
            );
          })}
          {found.length === 0 && (
            <p className="no-results">
              {t(
                "Aucun module trouvé. Essaie « communauté », « offres » ou « apprentissage ».",
              )}
            </p>
          )}
        </div>
        {feature && (
          <div className="feature-details" role="status">
            <div>
              <strong>{feature.title}</strong>
              <p>{feature.details}</p>
              <button onClick={() => onModule(feature.id)}>
                {t("Explorer le module")}
              </button>
            </div>
            <button
              aria-label={t("Fermer le détail")}
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="values-row">
          <span>
            <Globe2 />
            {t("Par des développeurs africains")}
          </span>
          <span>
            <Code2 />
            {t("Open source & collaboratif")}
          </span>
          <span>
            <HeartHandshake />
            {t("Une communauté bienveillante")}
          </span>
          <span>
            <Rocket />
            {t("Des opportunités réelles")}
          </span>
        </div>
      </section>
      <HomeHighlights onExplore={() => onModule("communaute")}/>
      <section className="welcome-bottom">
        <div>
          <span>
            <Sparkles size={18} />
            {t("ENSEMBLE, ALLONS PLUS LOIN")}
          </span>
          <h2>{t("Une communauté qui fait grandir les talents africains.")}</h2>
          <p>
            {t(
              "Partage tes idées, pose tes questions et trouve des personnes avec qui créer.",
            )}
          </p>
        </div>
        <button className="cta-primary" onClick={() => onNavigate("signup")}>
          {t("Commencer l'aventure")}
          <ArrowRight size={20} />
        </button>
      </section>
      <div className="demo-entry">
        <button className="text-link" onClick={() => onNavigate("workspace")}>
          {t("Explorer la démonstration des 7 modules")}
          <ArrowRight size={18} />
        </button>
      </div>
      <footer className="site-footer">
        {t(
          "© DevAfrica Connect · Une plateforme par des développeurs, pour des développeurs.",
        )}
      </footer>
    </main>
  );
}

// La navigation par hash permet le retour navigateur et fonctionne sur un hébergement statique.
export default function App() {
  const route = useHashRoute();
  function navigate(next: Page) {
    navigateHash(next);
  }
  if (route === "workspace" || route.startsWith("workspace/"))
    return (
      <Workspace
        route={route.split("/").slice(1).join("/") || "communaute"}
        onNavigate={(path) => {
          navigateHash("workspace/" + path);
        }}
        onHome={() => navigate("home")}
      />
    );
  if (route === "forgot" || route === "reset" || route.startsWith("reset?"))
    return <PasswordRecovery key={route} route={route} onNavigate={navigate}/>;
  if (route === "login" || route === "signup")
    return (
      <Authentication
        key={route}
        mode={route}
        onNavigate={navigate}
        onOpenProfile={() => navigateHash("workspace/profil")}
      />
    );
  return (
    <Home
      onNavigate={navigate}
      onModule={(id) => {
        navigateHash("workspace/" + id);
      }}
    />
  );
}
