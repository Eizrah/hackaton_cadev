import { compactStars } from "../../lib/format";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  Flag,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useLocalData } from "../../lib/storage";
import {
  initialPosts,
  migratePosts,
  type Post,
  type Profile,
} from "../../data/models";
import { makeReview, useReviews } from "../../data/workflow";
import { useI18n } from "../../i18n/context";
import { CountryFlag } from "../CountryFlag";
import Modal from "../Modal";
function PostMenu({
  post,
  owner,
  onCollaboration,
  onProfile,
  onSave,
  onReport,
}: {
  post: Post;
  owner: boolean;
  onCollaboration: () => void;
  onProfile: () => void;
  onSave: () => void;
  onReport: () => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div className="post-menu" ref={ref}>
      <button
        className="quiet"
        ref={trigger}
        aria-label={t("Options de la publication", "Post options")}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
      >
        <MoreHorizontal size={22} />
      </button>
      {open && (
        <div
          className="post-dropdown"
          role="menu"
          aria-label={t("Actions de la publication", "Post actions")}
        >
          <button
            role="menuitemcheckbox"
            aria-checked={post.collaboration}
            disabled={!owner}
            title={
              !owner
                ? t(
                    "Seul l’auteur peut modifier sa demande d’aide.",
                    "Only the author can change this request.",
                  )
                : undefined
            }
            onClick={onCollaboration}
          >
            <span
              className={`menu-check ${post.collaboration ? "checked" : ""}`}
            >
              {post.collaboration && <Check size={13} />}
            </span>
            <span>
              {t(
                "Demande d’aide / collaboration",
                "Help / collaboration request",
              )}
            </span>
          </button>
          <button
            role="menuitem"
            onClick={() => {
              onProfile();
              setOpen(false);
            }}
          >
            <UserRound size={17} />
            {t("Voir le profil", "View profile")}
          </button>
          <button
            role="menuitem"
            onClick={() => {
              onSave();
              setOpen(false);
            }}
          >
            <Bookmark size={17} fill={post.saved ? "currentColor" : "none"} />
            {post.saved
              ? t("Annonce enregistrée", "Saved post")
              : t("Enregistrer l’annonce", "Save post")}
          </button>
          <button
            role="menuitem"
            className="danger"
            onClick={() => {
              onReport();
              setOpen(false);
            }}
          >
            <Flag size={17} />
            {t("Signaler", "Report")}
          </button>
        </div>
      )}
    </div>
  );
}
export default function Community({
  profile,
  onNavigate,
  onNotice,
}: {
  profile: Profile;
  onNavigate: (path: string) => void;
  onNotice: (text: string) => void;
}) {
  const { t, locale } = useI18n();
  const [posts, setPosts] = useLocalData("posts", initialPosts, migratePosts);
  const [, setReviews] = useReviews();
  const [filter, setFilter] = useState("Tous");
  const [text, setText] = useState(""),
    [title, setTitle] = useState(""),
    [tag, setTag] = useState("Projet"),
    [collaboration, setCollaboration] = useState(false);
  const [commentPost, setCommentPost] = useState<number | null>(null),
    [comment, setComment] = useState(""),
    [report, setReport] = useState<Post | null>(null);
  function publish(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const id = Date.now();
    const post: Post = {
      id,
      author: profile.name,
      country: profile.country,
      tag,
      title: title.trim(),
      text: text.trim(),
      comments: [],
      publishedAt: new Date().toISOString(),
      collaboration,
      starCount: 0,
      starred: false,
      saved: false,
      owned: true,
      moderation: "pending",
    };
    setPosts((current) => [post, ...current]);
    setReviews((current) => [
      makeReview("post", id, post.title || post.text.slice(0, 70), post.text),
      ...current,
    ]);
    setText("");
    setTitle("");
    onNotice(
      t(
        "Publication envoyée à la file de modération de démonstration.",
        "Post sent to the demo moderation queue.",
      ),
    );
  }
  const visible = posts.filter(
    (p) =>
      p.moderation !== "rejected" &&
      (filter === "Tous" || (filter === "saved" ? p.saved : p.tag === filter)),
  );
  return (
    <div className="feed-layout">
      <section className="feed-column">
        <form className="panel composer" onSubmit={publish}>
          <div className="row">
            <div className="person">
              <span className="avatar">
                {profile.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <strong>
                  {t(
                    "Qu’est-ce qu’on construit aujourd’hui ?",
                    "What are we building today?",
                  )}
                </strong>
                <small>
                  {t(
                    "Une idée peut devenir un projet commun.",
                    "An idea can become a shared project.",
                  )}
                </small>
              </div>
            </div>
            <Sparkles size={20} className="composer-spark" />
          </div>
          <input
            aria-label={t("Titre de la publication", "Post title")}
            placeholder={t(
              "Un titre pour ton projet ou ta question",
              "A title for your project or question",
            )}
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            aria-label={t("Votre publication", "Your post")}
            placeholder={t(
              "Partage ton idée, une question ou une découverte…",
              "Share an idea, a question or a discovery…",
            )}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            maxLength={3000}
          />
          <div className="composer-options">
            <label>
              {t("Type de publication", "Post type")}
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="Projet">{t("Projet", "Project")}</option>
                <option value="Question & découverte">
                  {t("Question & découverte", "Question & discovery")}
                </option>
              </select>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={collaboration}
                onChange={(e) => setCollaboration(e.target.checked)}
              />
              {t(
                "Demander de l’aide / collaborer",
                "Ask for help / collaborate",
              )}
            </label>
            <button className="btn-primary">
              <Plus size={18} />
              {t("Publier", "Publish")}
            </button>
          </div>
        </form>
        <div
          className="filter-tabs"
          role="group"
          aria-label={t("Filtrer les publications", "Filter posts")}
        >
          {[
            ["Tous", t("Tout le fil", "All posts")],
            ["Projet", t("Projets", "Projects")],
            [
              "Question & découverte",
              t("Questions & découvertes", "Questions & discoveries"),
            ],
            ["saved", t("Enregistrées", "Saved")],
          ].map(([id, label]) => (
            <button
              key={id}
              className={filter === id ? "active" : ""}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {visible.map((post) => {
          const owner = post.owned || post.author === profile.name;
          return (
            <article
              className="panel post"
              key={post.id}
              aria-label={post.title || post.author}
            >
              <header className="row">
                <div className="person">
                  <span className={`avatar avatar-${post.id % 3}`}>
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <strong>{post.author}</strong>
                    <div className="post-meta">
                      <CountryFlag country={post.country} />
                      <span>·</span>
                      <span>
                        {t(
                          post.tag,
                          post.tag === "Projet"
                            ? "Project"
                            : "Question & discovery",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <PostMenu
                  post={post}
                  owner={owner}
                  onCollaboration={() =>
                    setPosts((current) =>
                      current.map((p) =>
                        p.id === post.id
                          ? { ...p, collaboration: !p.collaboration }
                          : p,
                      ),
                    )
                  }
                  onProfile={() =>
                    onNavigate(
                      owner
                        ? "profil"
                        : `profil/membre/${encodeURIComponent(post.author)}`,
                    )
                  }
                  onSave={() => {
                    setPosts((current) =>
                      current.map((p) =>
                        p.id === post.id ? { ...p, saved: !p.saved } : p,
                      ),
                    );
                    onNotice(
                      post.saved
                        ? t(
                            "Annonce retirée des enregistrements.",
                            "Post removed from saved items.",
                          )
                        : t("Annonce enregistrée.", "Post saved."),
                    );
                  }}
                  onReport={() => setReport(post)}
                />
              </header>
              <div className="post-badges">
                {post.collaboration && (
                  <span className="collab-badge">
                    <UsersRound size={13} />
                    {t("Collaboration ouverte", "Open collaboration")}
                  </span>
                )}
                {post.moderation === "pending" && (
                  <button
                    className="pending-review"
                    onClick={() => onNavigate("ia/moderation")}
                  >
                    <ShieldCheck size={13} />
                    {t(
                      "En attente de modération · démo",
                      "Awaiting moderation · demo",
                    )}
                  </button>
                )}
                <span className="post-date">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>
                      {t("Publié le", "Published")}{" "}
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Indian/Antananarivo",
                      }).format(new Date(post.publishedAt))}
                    </time>
                  ) : (
                    t(
                      "Date de publication non renseignée",
                      "Publication date unavailable",
                    )
                  )}
                </span>
              </div>
              {post.title && <h2 className="post-title">{post.title}</h2>}
              <p className="post-content">{post.text}</p>
              <div className="post-actions">
                <button
                  className={`star-like ${post.starred ? "is-starred" : ""}`}
                  aria-label={`${t("Étoile", "Star")} : ${post.starCount}`}
                  aria-pressed={post.starred}
                  onClick={() =>
                    setPosts((current) =>
                      current.map((p) =>
                        p.id === post.id
                          ? {
                              ...p,
                              starred: !p.starred,
                              starCount: Math.max(
                                0,
                                p.starCount + (p.starred ? -1 : 1),
                              ),
                            }
                          : p,
                      ),
                    )
                  }
                >
                  <Star
                    size={21}
                    fill={post.starred ? "currentColor" : "none"}
                  />
                  <strong>{compactStars(post.starCount)}</strong>
                  <span>{t("Étoiles", "Stars")}</span>
                </button>
                <button
                  onClick={() => {
                    setCommentPost(commentPost === post.id ? null : post.id);
                    setComment("");
                  }}
                >
                  <MessageCircle size={18} />
                  {post.comments.length} {t("commentaires", "comments")}
                </button>
                {post.collaboration && (
                  <button
                    className="collab-action"
                    onClick={() =>
                      onNavigate(
                        `messages/prive/${encodeURIComponent(post.author)}`,
                      )
                    }
                  >
                    <UsersRound size={17} />
                    {t("Proposer mon aide", "Offer help")}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
              {commentPost === post.id && (
                <div className="comments">
                  {post.comments.map((c, i) => (
                    <p key={i}>{c}</p>
                  ))}
                  <form
                    className="row"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!comment.trim()) return;
                      setPosts((current) =>
                        current.map((p) =>
                          p.id === post.id
                            ? {
                                ...p,
                                comments: [...p.comments, comment.trim()],
                              }
                            : p,
                        ),
                      );
                      setComment("");
                    }}
                  >
                    <input
                      required
                      maxLength={1500}
                      aria-label={t("Ajouter un commentaire", "Add a comment")}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t(
                        "Une réponse, un encouragement…",
                        "An answer, an encouraging word…",
                      )}
                    />
                    <button
                      className="btn-primary"
                      aria-label={t("Envoyer le commentaire", "Send comment")}
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })}
        {!visible.length && (
          <div className="panel empty-state">
            <Bookmark />
            <h2>
              {t(
                "Aucune publication ici pour le moment.",
                "No posts here yet.",
              )}
            </h2>
          </div>
        )}
      </section>
      <aside className="community-aside">
        <section className="panel community-callout">
          <span className="mini-label">
            {t("PAR LES DEVS, POUR LES DEVS", "BY DEVS, FOR DEVS")}
          </span>
          <h2>
            {t(
              "Les bonnes idées grandissent ensemble.",
              "Great ideas grow together.",
            )}
          </h2>
          <p>
            {t(
              "Une étoile pour encourager. Un commentaire pour avancer.",
              "A star to encourage. A comment to move forward.",
            )}
          </p>
          <button
            className="btn-primary"
            onClick={() => onNavigate("messages/groupes")}
          >
            {t("Découvrir les groupes", "Discover groups")}
            <ArrowRight size={17} />
          </button>
          <div className="callout-orbit" aria-hidden="true">
            &lt;/&gt;
          </div>
        </section>
        <section className="panel">
          <h2>
            {t(
              "Une étoile, un encouragement.",
              "One star, one show of support.",
            )}
          </h2>
          <p>
            {t(
              "Chaque personne peut ajouter ou retirer son étoile. Le compteur montre le nombre d’utilisateurs qui apprécient la publication.",
              "Each person can add or remove a star. The counter shows how many users appreciate the post.",
            )}
          </p>
          <small className="muted">
            {t(
              "1 000 étoiles = 1k · exemples locaux.",
              "1,000 stars = 1k · local examples.",
            )}
          </small>
        </section>
      </aside>
      {report && (
        <Modal
          title={t("Signaler une publication", "Report a post")}
          onClose={() => setReport(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const reason = String(
                new FormData(e.currentTarget).get("reason"),
              ).trim();
              if (!reason) return;
              const id = Date.now();
              try {
                const reports = JSON.parse(
                  localStorage.getItem("devafrica:reports") || "[]",
                );
                localStorage.setItem(
                  "devafrica:reports",
                  JSON.stringify([
                    ...reports,
                    {
                      id,
                      target: report.id,
                      reason,
                      date: new Date().toISOString(),
                    },
                  ]),
                );
                setReviews((current) => [
                  makeReview(
                    "report",
                    id,
                    report.title || report.author,
                    reason,
                  ),
                  ...current,
                ]);
                onNotice(
                  t(
                    "Signalement transmis à la file de modération locale.",
                    "Report sent to the local moderation queue.",
                  ),
                );
              } catch {
                onNotice(
                  t(
                    "Impossible d’enregistrer le signalement.",
                    "Could not save the report.",
                  ),
                );
              }
              setReport(null);
            }}
          >
            <p>
              {t(
                "Explique la raison de ton signalement.",
                "Explain why you are reporting this post.",
              )}
            </p>
            <label>
              {t("Motif", "Reason")}
              <textarea name="reason" required maxLength={1000} />
            </label>
            <button className="btn-primary">
              <Flag size={16} />
              {t("Envoyer le signalement", "Send report")}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
