import { useI18n } from "../i18n/context";
import LanguageSwitcher from "./LanguageSwitcher";
import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  LogOut,
  Menu,
  MessageCircle,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useLocalData } from "../lib/storage";
import { initialProfile, migrateProfile, type Profile } from "../data/models";
import NotificationCenter from "./shared/NotificationCenter";
import { useToast } from "../lib/toastContext";
import { usePeople } from "../data/people";
import { authApi } from "../api/auth";
import { mapDjangoProfile, profileForm, withLocalProfile } from "../lib/auth";
import Community from "./modules/Community";
import ProfileView, { ProfileEditor } from "./modules/Profile";
import Learning from "./modules/Learning";
import Messages from "./modules/Messages";
import Offers from "./modules/Offers";
import Assistant from "./modules/Assistant";
import "../workspace.css";
const modules = [
  {
    id: "profil",
    label: "Mon profil",
    Icon: UserRound,
    description:
      "Ton parcours, tes compétences et ce que tu as envie de construire.",
  },
  {
    id: "communaute",
    label: "Communauté",
    Icon: UsersRound,
    description: "Des idées, des projets et des talents qui se rencontrent.",
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
  const studioPage = parts[0] === "apprentissage" && parts[1] === "cours" && ["atelier", "projet"].includes(parts[4]);
  const active = modules.find((m) => m.id === parts[0]) || modules[0];
  const [profile, setProfile] = useLocalData(
    "profile",
    initialProfile,
    migrateProfile,
  );
  const [profileVersion, setProfileVersion] = useState(0);
  const [, setPeople] = usePeople();
  useEffect(() => { setPeople(current => { const previous = current.find(p => p.id === profile.id); return JSON.stringify(previous) === JSON.stringify(profile) ? current : [...current.filter(p=>p.id!==profile.id),profile]; }); }, [profile, setPeople]);
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
  const setNotice = useToast();
  const wideModule = active.id === "messages" || active.id === "ia";
  const [wideMenuExpanded, setWideMenuExpanded] = useState(false);
  const effectiveCollapsed = !isMobile && (wideModule ? !wideMenuExpanded : collapsed);
  const toggleMenuWidth = () => wideModule ? setWideMenuExpanded(!wideMenuExpanded) : setCollapsed(!collapsed);
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
    onNavigate(path);
  }
  const memberRoute = active.id === "profil" && parts[1] === "membre";
  let member = "";
  try {
    if (memberRoute) member = decodeURIComponent(parts.slice(2).join("/"));
  } catch {
    /* Adresse invalide. */
  }
  const ownMember = !!member && [profile.publicId, profile.id, profile.email, profile.pseudo].includes(member);
  const [memberResult, setMemberResult] = useState<{
    member: string;
    profile?: Profile;
    error?: "missing" | "network";
  }>();
  useEffect(() => {
    if (!member || ownMember) return;
    const request = new AbortController();
    setMemberResult(undefined);
    void authApi.getProfilMembre(member, request.signal).then(({ data }) => {
      if (!request.signal.aborted) setMemberResult({ member, profile: mapDjangoProfile(data) });
    }).catch((error: unknown) => {
      if (!request.signal.aborted) setMemberResult({
        member,
        error: isAxiosError(error) && error.response?.status === 404 ? "missing" : "network",
      });
    });
    return () => request.abort();
  }, [member, ownMember]);
  const result = memberResult?.member === member ? memberResult : undefined;
  const viewedProfile = !memberRoute || ownMember ? profile : result?.profile;
  const focusSection = active.id === "profil" && ["candidatures","recrutement"].includes(parts[1]) ? parts[1] : "";
  useEffect(()=>{if(focusSection)requestAnimationFrame(()=>document.getElementById(focusSection)?.scrollIntoView({block:"start"}));},[focusSection,route]);
  const editing = active.id === "profil" && parts[1] === "modifier";
  return (
    <div
      className={`workspace ${studioPage ? "studio-workspace" : ""} ${effectiveCollapsed ? "sidebar-collapsed" : ""} ${wideModule ? "workspace-wide" : ""} ${mobileOpen ? "mobile-menu-open" : ""}`}
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
          <div className="sidebar-menu-control">
            <button
              className="sidebar-menu-toggle"
              aria-label={effectiveCollapsed ? t("Développer le menu") : t("Réduire le menu")}
              title={effectiveCollapsed ? t("Développer le menu") : t("Réduire le menu")}
              onClick={toggleMenuWidth}
            >
              {effectiveCollapsed ? <ArrowRightToLine size={22} /> : <ArrowLeftToLine size={22} />}
            </button>
          </div>
          <div className="sidebar-bottom">
            <button
              className="sidebar-link sidebar-quit"
              title={t("Quitter")}
              aria-label={t("Quitter")}
              onClick={onHome}
            >
              <LogOut size={19} />
              <span>{t("Quitter")}</span>
            </button>
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
            <NotificationCenter onNavigate={navigate}/>
            <button
              className="header-profile"
              onClick={() => navigate("profil")}
              aria-label={t("Ouvrir mon profil")}
            >
              <span className="avatar">
                {profile.photo ? (
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
          <h1 className="sr-only" ref={mainTitle} tabIndex={-1}>{editing ? t("Modifier mon profil") : t(active.label)}</h1>
          {active.id === "communaute" && (
            <Community
              profile={profile}
              key={parts[1] === "publication" ? route : "feed"}
              focusPostId={parts[1] === "publication" ? parts[2] : undefined}
              focusCommentId={parts[1] === "publication" ? parts[3] : undefined}
              onNavigate={navigate}
              onNotice={setNotice}
            />
          )}
          {active.id === "profil" &&
            (editing ? (
              <ProfileEditor
                key={route}
                profile={profile}
                onCredentialsSaved={({ email, pseudo }) => setProfile(current => ({ ...current, email, pseudo }))}
                onSave={async (next) => {
                  const before = new Map(profile.experiences.map(row => [row.id, row]));
                  const kept = new Set(next.experiences.map(row => row.id));
                  const removed = profile.experiences.flatMap(row =>
                    row.serverId !== undefined && !kept.has(row.id) ? [row.serverId] : [],
                  );
                  const edited = next.experiences.filter(row =>
                    row.serverId === undefined || JSON.stringify(row) !== JSON.stringify(before.get(row.id)),
                  );
                  const payload = {
                    nom: next.lastName,
                    prenom: next.firstName,
                    age: Number(next.age) || 0,
                    niveau: next.level === "Débutant" ? "D" : next.level === "Intermédiaire" ? "I" : "A",
                    pays: next.country,
                    sexe: next.sexe || "M",
                    presentation: next.bio,
                    lien_portfolio: next.portfolio,
                    noms_competences: next.skillDetails.map(skill => skill.name.trim()),
                    experiences_a_supprimer: removed,
                  };
                  const fields: Parameters<typeof profileForm>[0] = payload;
                  if (next.photo !== profile.photo) {
                    if (next.photo.startsWith("data:image/")) {
                      fields.photoprofil = await (await fetch(next.photo)).blob();
                    } else if (!next.photo) fields.photoprofil = null;
                  }
                  const form = await profileForm(fields, "experiences_a_enregistrer", edited);
                  const { data } = await authApi.updateProfil(form);
                  const written = new Map(edited.map((row, i) => [row.id, data.experiences_enregistrees[i]]));
                  const saved = mapDjangoProfile(data.profil);
                  const merged = withLocalProfile(saved, next, next.experiences.map(row =>
                    written.get(row.id) ?? row.serverId,
                  ));
                  const experiences = merged.experiences.length
                    ? merged.experiences
                    : next.experiences.map(row => ({
                        ...row,
                        serverId: written.get(row.id) ?? row.serverId,
                      }));

                  // Les champs saisis priment : la fiche affichée suit l'enregistrement, pas l'ancienne copie.
                  setProfile({
                    ...merged,
                    name: next.name,
                    firstName: next.firstName,
                    lastName: next.lastName,
                    age: next.age,
                    level: next.level,
                    country: next.country,
                    sexe: next.sexe,
                    bio: next.bio,
                    portfolio: next.portfolio,
                    role: next.role,
                    skills: next.skills,
                    skillDetails: next.skillDetails,
                    photo: saved.photo || next.photo,
                    experiences,
                  });
                  setProfileVersion(v => v + 1); // Force le re-render de ProfileView
                  setNotice(t("Profil mis à jour.", "Profile updated."));
                  
                  // Navigation vers la vue du profil
                  navigate("profil");
                }}
                onCancel={() => navigate("profil")}
                onNotice={setNotice}
              />
            ) : viewedProfile ? (
              <ProfileView
                key={`profile-v${profileVersion}-${viewedProfile.email}`}
                profile={viewedProfile}
                isOwn={!memberRoute || ownMember || viewedProfile.email === profile.email}
                onNavigate={navigate}
                focusJob={parts[1] === "recrutement" ? parts[2] : undefined}
                onMessage={() =>
                  navigate(`messages/prive/${encodeURIComponent(viewedProfile.email)}`)
                }
                onEdit={() => navigate("profil/modifier")}
                onNotice={setNotice}
              />
            ) : (
              <section className="panel" role="status">
                {!member || result?.error === "missing"
                  ? t("Membre introuvable.", "Member not found.")
                  : result?.error === "network"
                    ? t("Impossible de charger le profil.", "Could not load the profile.")
                    : t("Chargement du profil…", "Loading profile…")}
              </section>
            ))}
          {active.id === "apprentissage" && (
            <Learning
              key={route}
              route={parts.slice(1)}
              onNavigate={navigate}
            />
          )}
          {active.id === "offres" && <Offers key={route} profile={profile} route={parts.slice(1)} onNavigate={navigate} onNotice={setNotice} />}
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
