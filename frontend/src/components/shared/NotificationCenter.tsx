import { useEffect, useRef, useState } from "react";
import { Bell, ShieldCheck, UsersRound, BriefcaseBusiness, CheckCheck, ChevronRight, UserRound, X } from "lucide-react";
import { initialJobs, migrateJobs, type Profile } from "../../data/models";
import { matchesJob, notification, useNotifications } from "../../data/notifications";
import { useLocalData } from "../../lib/storage";
import { useI18n } from "../../i18n/context";
export default function NotificationCenter({ profile, onNavigate }: { profile: Profile; onNavigate: (path: string) => void }) {
  const { t, locale, language } = useI18n(), [items, setItems] = useNotifications(), [jobs] = useLocalData("jobs", initialJobs, migrateJobs), [open, setOpen] = useState(false), ref = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const mine = items.filter(n => n.recipientId === profile.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), unread = mine.filter(n => !n.read).length;
  useEffect(() => { const matching = jobs.filter(j => j.moderation !== "pending" && j.moderation !== "rejected" && j.ownerId !== profile.id && matchesJob(j, profile)); setItems(current => { const fresh = matching.filter(j => !current.some(n => n.id === `job-match:${j.id}:${profile.id}`)).map(j => notification({ id: `job-match:${j.id}:${profile.id}`, recipientId: profile.id, title: "Une offre pour tes compétences", text: `${j.title} · ${j.company}`, target: `offres/${j.id}`, kind: "job" })); return fresh.length ? [...fresh, ...current] : current; }); }, [jobs, profile, setItems]);
  useEffect(() => { if (!open) return; const outside = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); }; const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); } }; document.addEventListener("mousedown", outside); document.addEventListener("keydown", key); return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", key); }; }, [open]);
  return <div
    className="notification-center"
    ref={ref}>
    <button
      ref={trigger}
      className="notification-bell"
      aria-label={`${t("Notifications")}${unread ? `, ${unread} ${t("non lues", "unread")}` : ""}`}
      aria-expanded={open}
      onClick={() => setOpen(!open)}>
      <Bell size={20} />
      {unread > 0 && <span>
        {unread > 99 ? "99+" : unread}
      </span>}
    </button>
    {open && <section
      className="notification-panel"
      aria-label={t("Notifications")}>
      <header>
        <h2>
          {t("Notifications")}
        </h2>
        <button
          className="quiet"
          aria-label={t("Fermer")}
          onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </header>
      <button
        className="mark-read"
        onClick={() => setItems(current => current.map(n => n.recipientId === profile.id ? { ...n, read: true } : n))}>
        <CheckCheck size={15} />
        {t("Tout marquer comme lu", "Mark all as read")}
      </button>
      <div className="notification-list">
        {mine.length ? mine.map(n => <button
          className={`notification-item ${n.read ? "" : "unread"}`}
          key={n.id}
          onClick={() => { setItems(current => current.map(item => item.id === n.id ? { ...item, read: true } : item)); setOpen(false); onNavigate(n.target); }}>
          <span className="notification-symbol">
            {n.kind === "job" ? <BriefcaseBusiness size={20} /> : n.kind === "group" ? <UsersRound size={20} /> : n.kind === "moderation" ? <ShieldCheck size={20} /> : <UserRound size={20} />}
          </span>
          <span>
            <strong>
              {t(n.title)}
            </strong>
            <span>
              {language === "en" ? n.textEn || n.text.replace(" a postulé : ", " applied for: ") : n.text}
            </span>
            <small>
              {new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(new Date(n.createdAt))}
            </small>
          </span>
          <ChevronRight size={15} />
        </button>) : <p className="notifications-empty">
          {t("Tout est à jour. Les offres adaptées et les nouvelles candidatures apparaîtront ici.", "You are up to date. Matching jobs and new applications will appear here.")}
        </p>}
      </div>
    </section>}
  </div>;
}
