import { AttachmentPicker, AttachmentCard } from "../shared/Attachments";
import type { StoredAttachment } from "../../lib/attachments";
import { safePortfolio } from "../../lib/urls";
import { compactStars } from "../../lib/format";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bookmark,
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
  Link2,
  Reply,
  X,
} from "lucide-react";
import { useLocalData } from "../../lib/storage";
import {
  initialPosts,
  migratePosts,
  isSavedBy,
  orderedComments,
  type Post,
  type Profile,
} from "../../data/models";
import { makeReview, useReviews } from "../../data/workflow";
import { useI18n } from "../../i18n/context";
import { CountryFlag } from "../CountryFlag";
import Modal from "../Modal";
function PostMenu({
  saved,
  onProfile,
  onSave,
  onReport,
}: {
  saved: boolean;
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
    <div
      className="post-menu"
      ref={ref}>
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
            <Bookmark
              size={17}
              fill={saved ? "currentColor" : "none"} />
            {saved
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
  focusPostId,
}: {
  profile: Profile;
  focusPostId?: number;
  onNavigate: (path: string) => void;
  onNotice: (text: string) => void;
}) {
  const { t, locale } = useI18n();
  const [posts, setPosts] = useLocalData("posts", initialPosts, migratePosts);
  const [, setReviews] = useReviews();
  const [text, setText] = useState(""),
    [collaboration, setCollaboration] = useState(false);
  const [commentPost, setCommentPost] = useState<number | null>(null),
    [comment, setComment] = useState(""),
    [report, setReport] = useState<Post | null>(null),
    [replyTo, setReplyTo] = useState<string | null>(null),
    [reportCategory, setReportCategory] = useState("");
  const [attachments, setAttachments] = useState<StoredAttachment[]>([]), [link, setLink] = useState(""), [uploading, setUploading] = useState(false);
  useEffect(() => { if (focusPostId) requestAnimationFrame(() => document.getElementById(`post-${focusPostId}`)?.scrollIntoView({ block: "center" })); }, [focusPostId]);
  function publish(e: FormEvent) {
    e.preventDefault();
    if (uploading || (!text.trim() && !attachments.length && !link.trim())) return;
    const url = link.trim() ? safePortfolio(link.trim()) : null;
    if (link.trim() && !url) { onNotice(t("Indique un lien HTTP(S) valide.", "Enter a valid HTTP(S) link.")); return; }
    const id = Date.now();
    const post: Post = {
      id,
      authorId: profile.id,
      author: profile.name,
      country: profile.country,
      tag: "Publication",
      title: "",
      attachments,
      links: url ? [url] : [],
      savedBy: [],
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
      makeReview("post", id, post.text.slice(0, 70) || t("Publication avec pièce jointe", "Post with attachment"), [post.text, ...(post.links || []), ...(post.attachments || []).map(f => f.name)].join("\n")),
      ...current,
    ]);
    setText("");
    setAttachments([]); setLink("");
    onNotice(
      t(
        "Publication envoyée à la file de modération de démonstration.",
        "Post sent to the demo moderation queue.",
      ),
    );
  }
  const visible = posts.filter(post => !post.moderation || post.moderation === "approved" || post.authorId === profile.id || (!post.authorId && post.author === profile.name));
  return (
    <div className="feed-layout">
      <section className="feed-column">
        <form
          className="panel composer"
          onSubmit={publish}>
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
            <Sparkles
              size={20}
              className="composer-spark" />
          </div>
          <textarea
            aria-label={t("Votre publication", "Your post")}
            placeholder={t(
              "Partage ton idée, une question ou une découverte…",
              "Share an idea, a question or a discovery…",
            )}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={3000}
          />
          <div className="composer-attachments">
            <AttachmentPicker
              label={t("Joindre des fichiers", "Attach files")}
              multiple
              onBusy={setUploading}
              onAdd={files => setAttachments(current => [...current, ...files].slice(0, 5))} />
            <label className="composer-link">
              <Link2 size={18} />
              <input
                type="url"
                aria-label={t("Lien à partager", "Link to share")}
                placeholder={t("Lien vers un projet, une ressource…", "Link to a project or resource…")}
                value={link}
                onChange={e => setLink(e.target.value)}
                maxLength={2000} />
            </label>
          </div>
          {attachments.length > 0 && <div className="post-attachments">
            {attachments.map(file => <AttachmentCard
              key={file.id}
              file={file}
              onRemove={() => setAttachments(current => current.filter(f => f.id !== file.id))} />)}
          </div>}
          <div className="composer-options">
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
            <button
              className="btn-primary"
              disabled={uploading || (!text.trim() && !attachments.length && !link.trim())}>
              <Plus size={18} />
              {t("Publier", "Publish")}
            </button>
          </div>
        </form>
        <div className="feed-divider">
          {t("Tout le fil", "Community feed")}
        </div>
        {visible.map((post) => {
          const owner = post.authorId ? post.authorId === profile.id : post.author === profile.name;
          return (
            <article
              id={`post-${post.id}`}
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
                    <strong>
                      {post.author}
                    </strong>
                    <div className="post-meta">
                      <CountryFlag country={post.country} />
                    </div>
                  </div>
                </div>
                <PostMenu
                  saved={isSavedBy(post, profile.id)}
                  onProfile={() =>
                    onNavigate(
                      owner
                        ? "profil"
                        : `profil/membre/${encodeURIComponent(post.authorId || post.author)}`,
                    )
                  }
                  onSave={() => {
                    setPosts((current) =>
                      current.map((p) =>
                        p.id === post.id ? { ...p, saved: !isSavedBy(p, profile.id), savedBy: isSavedBy(p, profile.id) ? (p.savedBy || ["dev-juliana"]).filter(id => id !== profile.id) : [...(p.savedBy || []), profile.id] } : p,
                      ),
                    );
                    onNotice(
                      isSavedBy(post, profile.id)
                        ? t(
                          "Annonce retirée des enregistrements.",
                          "Post removed from saved items.",
                        )
                        : t("Annonce enregistrée.", "Post saved."),
                    );
                  }}
                  onReport={() => { setReportCategory(""); setReport(post); }}
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
                      {t("Publié le", "Published")}
                      {" "}
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
              {post.title && <h2 className="post-title">
                {post.title}
              </h2>}
              <p className="post-content">
                {post.text}
              </p>
              {(post.links || []).map(url => <a
                className="post-link"
                href={safePortfolio(url) || undefined}
                target="_blank"
                rel="noopener noreferrer"
                key={url}>
                <Link2 size={16} />
                {url}
              </a>)}
              {!!post.attachments?.length && <div className="post-attachments">
                {post.attachments.map(file => <AttachmentCard
                  key={file.id}
                  file={file} />)}
              </div>}
              {post.moderation === "rejected" && <p className="blocked-post-status">
                <ShieldCheck size={15} />
                {t("Cette publication a été bloquée par la modération.", "This post has been blocked by moderation.")}
              </p>}
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
                  <strong>
                    {compactStars(post.starCount)}
                  </strong>
                  <span>
                    {t("Étoiles", "Stars")}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCommentPost(commentPost === post.id ? null : post.id);
                    setComment("");
                    setReplyTo(null);
                  }}
                >
                  <MessageCircle size={18} />
                  {post.comments.length}
                  {" "}
                  {t("commentaires", "comments")}
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
                  {orderedComments(post.comments).map(({ comment: c, depth }) => {
                    const parent = post.comments.find(item => item.id === c.parentId);
                    return <article
                      className={`comment-card ${parent ? "comment-reply" : ""}`}
                      key={c.id}
                      style={{ marginLeft: Math.min(depth, 3) * 14 }}>
                      {parent && <small className="reply-context">
                        <Reply size={13} />
                        {t("En réponse à", "Replying to")}
                        {" "}
                        {parent.author}
                      </small>}
                      <div className="comment-person">
                        <button
                          type="button"
                          className="comment-profile"
                          onClick={() => onNavigate(c.authorId === profile.id ? "profil" : `profil/membre/${encodeURIComponent(c.authorId || c.author)}`)}
                          aria-label={`${t("Voir le profil de", "View profile of")} ${c.author}`}>
                          <span className="avatar">
                            {c.photo?.startsWith("data:image/") ? <img
                              src={c.photo}
                              alt="" /> : c.author.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </span>
                          <strong>
                            {c.author}
                          </strong>
                        </button>
                        <CountryFlag country={c.country} />
                      </div>
                      <p>
                        {c.text}
                      </p>
                      <div className="comment-footer">
                        {c.createdAt && <time dateTime={c.createdAt}>
                          {new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(new Date(c.createdAt))}
                        </time>}
                        <button
                          type="button"
                          onClick={() => { setReplyTo(c.id); setComment(""); requestAnimationFrame(() => document.getElementById(`comment-input-${post.id}`)?.focus()); }}>
                          <Reply size={14} />
                          {t("Répondre", "Reply")}
                        </button>
                      </div>
                    </article>;
                  })}
                  {replyTo && post.comments.some(c => c.id === replyTo) && <div className="reply-indicator">
                    {t("Répondre à", "Reply to")}
                    {" "}
                    {post.comments.find(c => c.id === replyTo)?.author}
                    <button
                      type="button"
                      className="quiet"
                      aria-label={t("Annuler la réponse", "Cancel reply")}
                      onClick={() => setReplyTo(null)}>
                      <X size={15} />
                    </button>
                  </div>}
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
                              comments: [...p.comments, { id: `comment-${Date.now()}`, authorId: profile.id, author: profile.name, country: profile.country, photo: profile.photo, text: comment.trim(), createdAt: new Date().toISOString(), parentId: replyTo || undefined }],
                            }
                            : p,
                        ),
                      );
                      setComment("");
                      setReplyTo(null);
                      onNotice(t("Commentaire envoyé.", "Comment sent."));
                    }}
                  >
                    <input
                      id={`comment-input-${post.id}`}
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
          <div
            className="callout-orbit"
            aria-hidden="true">
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
              const detail = String(new FormData(e.currentTarget).get("reason") || "").trim();
              if (!reportCategory || (reportCategory === "Autres" && !detail)) return;
              const reason = `${reportCategory}${detail ? ` : ${detail}` : ""}`;
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
                    "Signalement envoyé. Merci de contribuer à une communauté bienveillante.",
                    "Report sent. Thank you for helping keep the community welcoming.",
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
              {t("Motif du signalement", "Report category")}
              <select
                className="rounded-select report-category"
                required
                value={reportCategory}
                onChange={e => setReportCategory(e.target.value)}>
                <option
                  value=""
                  disabled>
                  {t("Choisir un motif", "Choose a reason")}
                </option>
                {[["Harcèlement", "Harassment"], ["Propos inappropriés ou haineux", "Inappropriate or hateful language"], ["Fausses informations", "False information"], ["Arnaque ou fraude", "Scam or fraud"], ["Spam ou publicité abusive", "Spam or abusive advertising"], ["Atteinte à la vie privée", "Privacy violation"], ["Autres", "Other"]].map(([fr, en]) => <option
                  key={fr}
                  value={fr}>
                  {t(fr, en)}
                </option>)}
              </select>
            </label>
            {reportCategory && <label>
              {reportCategory === "Autres" ? t("Explique la raison de ton signalement.", "Explain why you are reporting this post.") : t("Précisions (facultatif)", "Details (optional)")}
              <textarea
                name="reason"
                required={reportCategory === "Autres"}
                maxLength={1000}
                placeholder={t("Décris les faits pour aider la modération…", "Describe what happened to help moderation…")} />
            </label>}
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
