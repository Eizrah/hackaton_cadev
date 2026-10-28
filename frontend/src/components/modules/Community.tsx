import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Flag,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { useLocalData } from "../../lib/storage";
import {
  initialPosts,
  migratePosts,
  type Post,
  type Profile,
} from "../../data/models";
import { CountryFlag } from "../CountryFlag";
import Modal from "../Modal";

function publishedDate(value: string | null) {
  if (!value || Number.isNaN(new Date(value).getTime()))
    return "Date de publication non renseignée";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Indian/Antananarivo",
  }).format(new Date(value));
}
function ProjectRating({
  post,
  onRate,
}: {
  post: Post;
  onRate: (note: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const average = post.ratingCount ? post.ratingTotal / post.ratingCount : 0;
  return (
    <div className="project-rating">
      <div className="rating-summary">
        <Star size={19} fill="currentColor" />
        <strong>
          {post.ratingCount ? average.toFixed(1).replace(".", ",") : "—"}
        </strong>
        <span>/ 5</span>
        <span>· {post.ratingCount} avis</span>
      </div>
      <div className="rating-picker">
        <span>{post.myRating ? "Ta note" : "Donne ton avis"}</span>
        <div
          role="group"
          aria-label={`Noter ${post.title || "cette publication"} sur 5`}
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onMouseEnter={() => setHovered(n)}
              onFocus={() => setHovered(n)}
              onBlur={() => setHovered(0)}
              className={n <= (hovered || post.myRating) ? "rated" : ""}
              aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
              aria-pressed={post.myRating === n}
              onClick={() => onRate(n)}
            >
              <Star
                size={22}
                fill={n <= (hovered || post.myRating) ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default function Community({
  profile,
  onNavigate,
  onNotice,
}: {
  profile: Profile;
  onNavigate: (route: string) => void;
  onNotice: (text: string) => void;
}) {
  const [posts, setPosts] = useLocalData("posts", initialPosts, migratePosts);
  const [filter, setFilter] = useState("Tous");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Projet");
  const [collaboration, setCollaboration] = useState(true);
  const [commentPost, setCommentPost] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [report, setReport] = useState<Post | null>(null);
  function publish(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosts((current) => [
      {
        id: Date.now(),
        author: profile.name,
        country: profile.country,
        title: title.trim(),
        tag,
        text: text.trim(),
        comments: [],
        publishedAt: new Date().toISOString(),
        collaboration: tag !== "Question" && collaboration,
        ratingTotal: 0,
        ratingCount: 0,
        myRating: 0,
        starred: false,
      },
      ...current,
    ]);
    setText("");
    setTitle("");
    onNotice("Publication ajoutée à ta communauté de démonstration.");
  }
  function rate(post: Post, note: number) {
    setPosts((current) =>
      current.map((p) =>
        p.id === post.id
          ? {
              ...p,
              ratingTotal: p.ratingTotal - p.myRating + note,
              ratingCount: p.ratingCount + (p.myRating ? 0 : 1),
              myRating: note,
            }
          : p,
      ),
    );
    onNotice(
      "Ta note est enregistrée. Tu peux la modifier sans ajouter un second avis.",
    );
  }
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
                <strong>Qu’est-ce qu’on construit aujourd’hui ?</strong>
                <small>Une idée peut devenir un projet commun.</small>
              </div>
            </div>
            <span className="composer-spark">
              <Sparkles size={20} />
            </span>
          </div>
          <input
            aria-label="Titre de la publication"
            placeholder="Un titre pour ton projet, ta découverte ou ta question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
          <textarea
            aria-label="Votre publication"
            placeholder="Partage ton idée, ce que tu as découvert ou le défi que tu veux relever…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            maxLength={3000}
          />
          <div className="composer-options">
            <label>
              Type de publication
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option>Projet</option>
                <option>Découverte</option>
                <option>Question</option>
              </select>
            </label>
            {tag !== "Question" && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={collaboration}
                  onChange={(e) => setCollaboration(e.target.checked)}
                />
                Je cherche des collaborateurs
              </label>
            )}
            <button className="btn-primary" type="submit">
              <Plus size={18} />
              Publier
            </button>
          </div>
        </form>
        <div
          className="filter-tabs"
          role="group"
          aria-label="Filtrer les publications"
        >
          {["Tous", "Projet", "Découverte", "Question"].map((t) => (
            <button
              key={t}
              aria-pressed={filter === t}
              className={filter === t ? "active" : ""}
              onClick={() => setFilter(t)}
            >
              {t === "Tous"
                ? "Tout le fil"
                : t === "Projet"
                  ? "Projets"
                  : t === "Question"
                    ? "Questions"
                    : "Découvertes"}
            </button>
          ))}
        </div>
        {posts
          .filter((p) => filter === "Tous" || p.tag === filter)
          .map((post) => (
            <article
              className="panel post"
              key={post.id}
              aria-label={post.title || `Publication de ${post.author}`}
            >
              <header className="row">
                <div className="person">
                  <span className={`avatar avatar-${post.id % 3}`}>
                    {post.author
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <strong>{post.author}</strong>
                    <div className="post-meta">
                      <CountryFlag country={post.country} />
                      <span className="meta-dot">·</span>
                      <span>{post.tag}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="quiet"
                  aria-label={`Signaler la publication de ${post.author}`}
                  onClick={() => setReport(post)}
                >
                  <Flag size={17} />
                </button>
              </header>
              <div className="post-badges">
                {post.collaboration && (
                  <span className="collab-badge">
                    <UsersRound size={13} />
                    Collaboration ouverte
                  </span>
                )}
                <span className="post-date">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>
                      Publié le {publishedDate(post.publishedAt)}
                    </time>
                  ) : (
                    publishedDate(null)
                  )}
                </span>
              </div>
              {post.title && <h2 className="post-title">{post.title}</h2>}
              <p className="post-content">{post.text}</p>
              {post.tag !== "Question" ? (
                <ProjectRating post={post} onRate={(n) => rate(post, n)} />
              ) : (
                <div className="question-star">
                  <button
                    className={post.starred ? "rated" : ""}
                    aria-pressed={post.starred}
                    onClick={() =>
                      setPosts((current) =>
                        current.map((p) =>
                          p.id === post.id ? { ...p, starred: !p.starred } : p,
                        ),
                      )
                    }
                  >
                    <Star
                      size={19}
                      fill={post.starred ? "currentColor" : "none"}
                    />
                    {post.starred
                      ? "Question enregistrée"
                      : "Garder cette question"}
                  </button>
                </div>
              )}
              <div className="post-actions">
                <button
                  onClick={() => {
                    setCommentPost(commentPost === post.id ? null : post.id);
                    setComment("");
                  }}
                >
                  <MessageCircle size={18} />
                  {post.comments.length} commentaire
                  {post.comments.length > 1 ? "s" : ""}
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
                    Proposer mon aide
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
                      aria-label="Ajouter un commentaire"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      maxLength={1500}
                      placeholder="Une réponse, un encouragement…"
                    />
                    <button
                      className="btn-primary"
                      aria-label="Envoyer le commentaire"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              )}
            </article>
          ))}
        {!posts.some((p) => filter === "Tous" || p.tag === filter) && (
          <div className="panel empty-state">
            <Sparkles />
            <h2>La première publication sera peut-être la tienne.</h2>
            <p>Partage un {filter.toLowerCase()} avec la communauté.</p>
          </div>
        )}
      </section>
      <aside className="community-aside">
        <section className="panel community-callout">
          <span className="mini-label">PAR LES DEVS, POUR LES DEVS</span>
          <h2>Les bonnes idées grandissent ensemble.</h2>
          <p>
            Propose ton aide, découvre un talent et construis quelque chose qui
            compte.
          </p>
          <button
            className="btn-primary"
            onClick={() => onNavigate("messages/groupes")}
          >
            Trouver un groupe
            <ArrowRight size={17} />
          </button>
          <div className="callout-orbit">
            <CodeOrbit />
          </div>
        </section>
        <section className="panel">
          <h2>Une étoile, un avis utile.</h2>
          <p>
            Note les projets et découvertes de 1 à 5. La moyenne évolue avec les
            avis ; ton commentaire explique ce qui t’a marqué.
          </p>
          <div className="stars-decoration" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={20} fill="currentColor" />
            ))}
          </div>
          <small className="muted">
            Les notes affichées sont des exemples locaux.
          </small>
        </section>
        <section className="panel">
          <h2>Des talents, partout.</h2>
          <div className="country-stack">
            {["Madagascar", "Sénégal", "Côte d’Ivoire", "Kenya"].map((c) => (
              <CountryFlag key={c} country={c} />
            ))}
          </div>
        </section>
      </aside>
      {report && (
        <Modal title="Signaler une publication" onClose={() => setReport(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const reason = String(
                new FormData(e.currentTarget).get("reason"),
              ).trim();
              if (!reason) return;
              try {
                const reports = JSON.parse(
                  localStorage.getItem("devafrica:reports") || "[]",
                );
                localStorage.setItem(
                  "devafrica:reports",
                  JSON.stringify([
                    ...reports,
                    {
                      target: report.id,
                      reason,
                      date: new Date().toISOString(),
                    },
                  ]),
                );
                onNotice(
                  "Signalement enregistré dans la démo. Aucun modérateur contacté.",
                );
              } catch {
                onNotice(
                  "Le signalement n’a pas pu être conservé sur cet appareil.",
                );
              }
              setReport(null);
            }}
          >
            <p>
              Décris le problème concernant la publication de {report.author}.
            </p>
            <label>
              Motif
              <textarea name="reason" required maxLength={1000} />
            </label>
            <button className="btn-primary">Enregistrer le signalement</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
function CodeOrbit() {
  return <span aria-hidden="true">&lt;/&gt;</span>;
}
