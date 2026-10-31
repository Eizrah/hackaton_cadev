import { useI18n } from "../i18n/context";
import LanguageSwitcher from "./LanguageSwitcher";
import { initialPosts, migratePosts } from "../data/models";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  LogOut,
  Menu,
  MessageCircle,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useLocalData } from "../lib/storage";
import { initialProfile, migrateProfile } from "../data/models";
import { CountryFlag } from "./CountryFlag";
import Community from "./modules/Community";
import ProfileView, { ProfileEditor } from "./modules/Profile";
import Learning from "./modules/Learning";
import Messages from "./modules/Messages";
import Offers from "./modules/Offers";
import Assistant from "./modules/Assistant";
import "../workspace.css";
const modules = [
  {
    id: "communaute",
    label: "Communauté",
    Icon: UsersRound,
    description: "Des idées, des projets et des talents qui se rencontrent.",
  },
  {
    id: "profil",
    label: "Mon profil",
    Icon: UserRound,
    description:
      "Ton parcours, tes compétences et ce que tu as envie de construire.",
  },
  {
    id: "apprentissage",
    label: "Apprentissage",
    Icon: BookOpen,
    description: "Trouve ta voie. Comprends les bases. Construis à ton rythme.",
  },
  {
    id: "offres",
    label: "Offres",
    Icon: BriefcaseBusiness,
    description:
      "Des opportunités pour transformer tes compétences en expérience.",
  },
  {
    id: "messages",
    label: "Messagerie",
    Icon: MessageCircle,
    description:
      "Tes conversations privées et tes groupes, dans un même espace.",
  },
  {
    id: "ia",
    label: "Assistant IA",
    Icon: Bot,
    description: "Pose une question et explore les premières notions.",
  },
] as const;
export default function Workspace({
  route,
  onNavigate,
  onHome,
}: {
  route: string;
  onNavigate: (path: string) => void;
  onHome: () => void;
}) {
  const { t } = useI18n();

  const parts = route.split("/").filter(Boolean);
  const active = modules.find((m) => m.id === parts[0]) || modules[0];
  const [profile, setProfile] = useLocalData(
    "profile",
    initialProfile,
    migrateProfile,
  );
  const [posts] = useLocalData("posts", initialPosts, migratePosts);
  const [collapsed, setCollapsed] = useLocalData("sidebar-collapsed", false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width:900px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width:900px)");
    const sync = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const [notice, setNotice] = useState("");
  const sidebar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mainTitle = useRef<HTMLHeadingElement>(null);
  const firstSegment = route.split("/")[0];
  useEffect(() => {
    if (firstSegment === "groupes") onNavigate("messages/groupes");
  }, [firstSegment, onNavigate]);
  useEffect(() => {
    mainTitle.current?.focus({ preventScroll: true });
  }, [route]);
  useEffect(() => {
    const closeNavigation = () => {
      setMobileOpen(false);
      setNotice("");
    };
    window.addEventListener("hashchange", closeNavigation);
    return () => window.removeEventListener("hashchange", closeNavigation);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const items = () =>
      Array.from(
        sidebar.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),a[href]",
        ) || [],
      ).filter((e) => e.getClientRects().length);
    items()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
      if (e.key !== "Tab") return;
      const focusable = items(),
        first = focusable[0],
        last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trap);
    };
  }, [mobileOpen]);
  function navigate(path: string) {
    setMobileOpen(false);
    setNotice("");
    onNavigate(path);
  }
  let memberName = "";
  try {
    memberName =
      parts[1] === "membre" ? decodeURIComponent(parts.slice(2).join("/")) : "";
  } catch {
    /* Adresse invalide. */
  }
  const memberPost = posts.find((p) => p.author === memberName);
  const viewedProfile = memberName
    ? {
        ...initialProfile,
        name: memberName,
        firstName: memberName.split(" ")[0],
        lastName: memberName.split(" ").slice(1).join(" "),
        age: "",
        email: "",
        pseudo: "",
        skillDetails: [],
        experiences: [],
        country: memberPost?.country || "",
        role: "Membre DevAfrica",
        bio: "Profil communautaire de démonstration.",
        skills: "",
        experience: "Parcours non renseigné.",
        portfolio: "",
        photo: "",
      }
    : profile;
  const editing = active.id === "profil" && parts[1] === "modifier";
  return (
    <div
      className={`workspace ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-menu-open" : ""}`}
    >
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label={t("Fermer le menu latéral")}
          onClick={() => {
            setMobileOpen(false);
            menuButton.current?.focus();
          }}
        />
      )}
      <aside
        className="sidebar"
        inert={isMobile && !mobileOpen}
        aria-hidden={isMobile && !mobileOpen}
        ref={sidebar}
        aria-label={t("Menu latéral")}
      >
        <div className="sidebar-brand">
          <button
            className="sidebar-home"
            onClick={onHome}
            aria-label={t("DevAfrica Connect, retour à l’accueil")}
          >
            <img src="/images/africa-mark.png" alt="" />
            <span className="sidebar-wordmark">
              <strong>
                Dev<span>Africa</span>
              </strong>
              <small>CONNECT</small>
            </span>
          </button>
          <button
            className="mobile-sidebar-close"
            onClick={() => {
              setMobileOpen(false);
              menuButton.current?.focus();
            }}
            aria-label={t("Fermer la navigation")}
          >
            <X size={19} />
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section-label">{t("TON ESPACE CRÉATIF")}</div>
          <nav className="sidebar-nav" aria-label={t("Modules")}>
            {modules.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`sidebar-link ${active.id === id ? "active" : ""}`}
                aria-current={active.id === id ? "page" : undefined}
                aria-label={t(label)}
                title={t(label)}
                onClick={() => navigate(id)}
              >
                <Icon size={19} />
                <span>{t(label)}</span>
                {active.id === id && <i />}
              </button>
            ))}
          </nav>
          <section className="sidebar-invitation">
            <button
              className="sidebar-invitation-icon"
              aria-label={t("Réduire le menu")}
              onClick={() => setCollapsed(true)}
            >
              <ArrowLeftToLine size={22} />
            </button>
            <strong>{t("Ensemble, on va plus loin.")}</strong>
            <button className="sidebar-quit" onClick={onHome}>
              <LogOut size={16} />
              {t("Quitter")}
            </button>
          </section>
          <div className="sidebar-bottom">
            <button
              className="sidebar-link"
              title={t("Retour à l’accueil")}
              aria-label={t("Retour à l’accueil")}
              onClick={onHome}
            >
              <LogOut size={19} />
              <span>{t("Retour à l’accueil")}</span>
            </button>
            <button
              className="sidebar-collapse-button"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? t("Développer le menu") : t("Réduire le menu")}
              aria-label={
                collapsed ? t("Développer le menu") : t("Réduire le menu")
              }
            >
              {collapsed ? (
                <ArrowRightToLine size={18} />
              ) : (
                <ArrowLeftToLine size={18} />
              )}
              <span>{t("Réduire le menu")}</span>
            </button>
            <small>{t("FAIT POUR CRÉER DES LIENS.")}</small>
          </div>
        </div>
      </aside>
      <main
        className="workspace-main"
        id="workspace-main"
        inert={isMobile && mobileOpen}
      >
        <header className="workspace-top">
          <div className="workspace-top-left">
            <button
              ref={menuButton}
              className="workspace-menu-button"
              aria-label={t("Ouvrir le menu latéral")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={21} />
            </button>
            <span className="workspace-context">
              DEVAfrica <strong>CONNECT</strong>
            </span>
            <span className="workspace-divider" />
            <span className="workspace-breadcrumb">
              {t("Ton espace")}
              <ChevronRight size={13} />
              {t(active.label)}
            </span>
          </div>
          <div className="workspace-top-actions">
            <LanguageSwitcher />
            <button
              className="header-help"
              title={t("Aide à l’apprentissage")}
              aria-label={t("Ouvrir l’aide")}
              onClick={() => navigate("ia")}
            >
              <CircleHelp size={19} />
            </button>
            <button
              className="header-profile"
              onClick={() => navigate("profil")}
              aria-label={t("Ouvrir mon profil")}
            >
              <span className="avatar">
                {profile.photo.startsWith("data:image/") ? (
                  <img src={profile.photo} alt="" />
                ) : (
                  profile.name.slice(0, 2).toUpperCase()
                )}
              </span>
              <span>{profile.name.split(" ")[0]}</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </header>
        <div className="workspace-page">
          <div className="module-heading">
            <div>
              <p className="eyebrow">{t("PAR LES DEVS, POUR LES DEVS")}</p>
              <h1 ref={mainTitle} tabIndex={-1}>
                {editing ? t("Modifier mon profil") : t(active.label)}
              </h1>
              <p>{t(active.description)}</p>
            </div>
            <span className="location-pill">
              <CountryFlag country={profile.country} />
            </span>
          </div>
          <div className="demo-banner">
            <span className="status-dot" />
            <span>
              {t(
                "Espace de démonstration · tes données restent sur cet appareil.",
              )}
            </span>
          </div>
          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button
                aria-label={t("Fermer la notification")}
                onClick={() => setNotice("")}
              >
                <X size={17} />
              </button>
            </div>
          )}
          {active.id === "communaute" && (
            <Community
              profile={profile}
              onNavigate={navigate}
              onNotice={setNotice}
            />
          )}
          {active.id === "profil" &&
            (editing ? (
              <ProfileEditor
                key={route}
                profile={profile}
                onSave={(next) => {
                  setProfile(next);
                  navigate("profil");
                }}
                onCancel={() => navigate("profil")}
                onNotice={setNotice}
              />
            ) : (
              <ProfileView
                profile={viewedProfile}
                isOwn={!memberName}
                onMessage={() =>
                  navigate(`messages/prive/${encodeURIComponent(memberName)}`)
                }
                onEdit={() => navigate("profil/modifier")}
                onNotice={setNotice}
              />
            ))}
          {active.id === "apprentissage" && (
            <Learning
              key={route}
              route={parts.slice(1)}
              onNavigate={navigate}
            />
          )}
          {active.id === "offres" && <Offers onNotice={setNotice} />}
          {active.id === "messages" && (
            <Messages
              profile={profile}
              route={parts.slice(1)}
              onNavigate={navigate}
              onNotice={setNotice}
            />
          )}
          {active.id === "ia" && (
            <Assistant route={parts.slice(1)} onNavigate={navigate} />
          )}
          <footer className="workspace-footer">
            <span>DevAfrica Connect</span>
            {t("· Apprendre, partager et construire ensemble.")}
          </footer>
        </div>
      </main>
    </div>
  );
}
