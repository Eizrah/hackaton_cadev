import { blockedPostNotice } from "../../data/lifecycle";
import { useNotifications } from "../../data/notifications";
import { usePeople } from "../../data/people";
import { createLocalId } from "../../lib/format";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bot,
  Check,
  CheckCheck,
  FileText,
  Flag,
  LoaderCircle,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useI18n } from "../../i18n/context";
import { useLocalData } from "../../lib/storage";
import { askTutor, type TutorMessage } from "../../lib/agents";
import { readLearningCodeContext, tutorCodeQuestion, type LearningCodeContext } from "../../lib/learningTutorContext";
import { checkContent, useReviews, type Review } from "../../data/workflow";
import { initialPosts, migratePosts, initialJobs, migrateJobs } from "../../data/models";
import "../learning/learning-enhancements.css";
type TutorThread = {
  id: number;
  title: string;
  messages: TutorMessage[];
  createdAt: string;
  context?: LearningCodeContext;
};
function Reply({ content }: { content: string }) {
  const parts = content.split(/```(?:[a-zA-Z0-9]+)?\n?/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <pre key={i}>
            <code>{part.trim()}</code>
          </pre>
        ) : (
          <p key={i}>{part}</p>
        ),
      )}
    </>
  );
}
export default function Assistant({
  route,
  onNavigate,
}: {
  route: string[];
  onNavigate: (path: string) => void;
}) {
  const { t } = useI18n();
  const moderation = route[0] === "moderation";
  return (
    <div className="agents-page">
      <div
        className="agent-tabs"
        role="group"
        aria-label={t("Choisir un agent", "Choose an agent")}
      >
        <button
          className={!moderation ? "active" : ""}
          onClick={() => onNavigate("ia")}
        >
          <BookOpen size={18} />
          {t("Agent apprentissage", "Learning agent")}
        </button>
        <button
          className={moderation ? "active" : ""}
          onClick={() => onNavigate("ia/moderation")}
        >
          <ShieldCheck size={18} />
          {t("Agent modérateur", "Moderation agent")}
        </button>
      </div>
      {moderation ? <ModerationAgent /> : <LearningAgent key={route[0] || "accueil"} initialContext={route[0] === "code" ? readLearningCodeContext() : undefined} onNavigate={onNavigate} />}
    </div>
  );
}
function LearningAgent({ initialContext, onNavigate }: { initialContext?: LearningCodeContext; onNavigate: (path: string) => void }) {
  const { t, language } = useI18n();
  const [threads, setThreads] = useLocalData<TutorThread[]>(
    "tutor-threads",
    [],
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [attachedContext, setAttachedContext] = useState(initialContext);
  const [question, setQuestion] = useState(() => initialContext ? tutorCodeQuestion(initialContext, language === "en") : ""),
    [search, setSearch] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const thread = threads.find((h) => h.id === selected);
  const context = thread ? thread.context : attachedContext;
  async function send(override?: string) {
    const content = (override ?? question).trim();
    if (!content || busy) return;
    const id = selected ?? createLocalId();
    const previous = threads.find((h) => h.id === id);
    const messages: TutorMessage[] = [
      ...(previous?.messages || []),
      { role: "user", content },
    ];
    setThreads((current) =>
      previous
        ? current.map((h) => (h.id === id ? { ...h, messages } : h))
        : [
            {
              id,
              title: content.slice(0, 48),
              messages,
              createdAt: new Date().toISOString(),
              ...(context ? { context } : {}),
            },
            ...current,
          ],
    );
    setSelected(id);
    setQuestion("");
    setBusy(true);
    setError("");
    try {
      const answer = await askTutor(messages, language, context);
      setThreads((current) =>
        current.map((h) =>
          h.id === id
            ? {
                ...h,
                messages: [
                  ...h.messages,
                  { role: "assistant", content: answer },
                ],
              }
            : h,
        ),
      );
    } catch {
      setError(
        t(
          "L’agent est indisponible. Vérifie le serveur Django ou repasse en mode démo.",
          "The agent is unavailable. Check Django or switch back to demo mode.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="assistant-shell">
      <aside className="assistant-history">
        <button
          className="new-discussion"
          onClick={() => {
            setSelected(null);
            setQuestion("");
            setAttachedContext(undefined);
            setError("");
          }}
          disabled={busy}
        >
          <Plus size={19} />
          {t("Nouvelle discussion", "New chat")}
        </button>
        <label className="history-search">
          <Search size={16} />
          <input
            aria-label={t("Rechercher un historique", "Search chat history")}
            placeholder={t("Rechercher…", "Search…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <span className="history-label">
          {t("TES CONVERSATIONS", "YOUR CONVERSATIONS")}
        </span>
        <div className="history-list">
          {threads
            .filter((h) => h.title.toLowerCase().includes(search.toLowerCase()))
            .map((h) => (
              <div key={h.id} className={selected === h.id ? "selected" : ""}>
                <button
                  disabled={busy}
                  onClick={() => {
                    setSelected(h.id);
                    setQuestion("");
                    setError("");
                  }}
                >
                  <MessageSquare size={15} />
                  <span>{h.title}</span>
                </button>
                <button
                  disabled={busy}
                  className="delete-thread"
                  aria-label={`${t("Supprimer", "Delete")} ${h.title}`}
                  onClick={() => {
                    setThreads((current) =>
                      current.filter((x) => x.id !== h.id),
                    );
                    if (selected === h.id) setSelected(null);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          {!threads.length && (
            <p>
              {t(
                "Tes discussions apparaîtront ici.",
                "Your chats will appear here.",
              )}
            </p>
          )}
        </div>
        <div className="assistant-history-foot">
          <Bot size={19} />
          <span>
            {t(
              "Un compagnon pour comprendre et construire.",
              "A companion for understanding and building.",
            )}
          </span>
        </div>
      </aside>
      <section className="assistant-conversation">
        <header>
          <span>
            <Sparkles size={17} />
            {t("Agent apprentissage", "Learning agent")}
          </span>
          <small>
            {import.meta.env.VITE_AGENT_MODE === "api"
              ? t("Mode API Django", "Django API mode")
              : t("Mode démo · réponses locales", "Demo mode · local replies")}
          </small>
        </header>
        {context && (
          <aside className="tutor-code-context" aria-label={t("Code joint à la conversation", "Code attached to this conversation")}>
            <div><Bot size={20} /><span><strong>{context.courseTitle} · {context.lessonTitle}</strong><small>{context.file} · {t("Le code et le passage du cours accompagnent ta question.", "The code and lesson excerpt accompany your question.")}</small></span></div>
            <button type="button" onClick={() => onNavigate(context.returnPath)}><ArrowLeft size={15} />{t("Revenir au cours ou à l’atelier", "Return to the course or studio")}</button>
            <details><summary>{t("Voir le code joint", "View attached code")}</summary><pre><code>{context.code}</code></pre></details>
          </aside>
        )}
        {!thread ? (
          <div className="assistant-welcome">
            <span className="tutor-symbol">
              <Sparkles size={35} />
            </span>
            <h2>
              {t(
                "Par quoi veux-tu commencer ?",
                "Where would you like to start?",
              )}
            </h2>
            <p>
              {t(
                "Une notion, un langage, un morceau de code. On avance ensemble.",
                "A concept, a language, a piece of code. Let’s work through it.",
              )}
            </p>
            <div className="prompt-cards">
              {[
                t(
                  "Explique-moi frontend et backend",
                  "Explain frontend and backend",
                ),
                t(
                  "Comment fonctionne useState dans React ?",
                  "How does useState work in React?",
                ),
                t("Montre-moi une boucle Python", "Show me a Python loop"),
              ].map((q) => (
                <button key={q} disabled={busy} onClick={() => send(q)}>
                  <BookOpen size={18} />
                  <span>{q}</span>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="tutor-messages"
            role="log"
            aria-label={t("Discussion avec l’agent", "Agent conversation")}
          >
            {thread.messages.map((m, i) => (
              <article className={`tutor-message ${m.role}`} key={i}>
                {m.role === "assistant" && (
                  <span className="tutor-avatar">
                    <Bot size={20} />
                  </span>
                )}
                <div>
                  <small>
                    {m.role === "assistant"
                      ? import.meta.env.VITE_AGENT_MODE === "api" ? t("Agent apprentissage", "Learning agent") : t("Agent apprentissage · démo", "Learning agent · demo")
                      : t("Toi", "You")}
                  </small>
                  <Reply content={m.content} />
                </div>
              </article>
            ))}
          </div>
        )}
        {error && (
          <p className="tutor-error" role="alert">
            {error}
          </p>
        )}
        <form
          className="tutor-composer"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <textarea
            aria-label={t(
              "Question à l’assistant",
              "Question for the assistant",
            )}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={6000}
            placeholder={t(
              "Pose une question ou colle ton code…",
              "Ask a question or paste your code…",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <button
            className="btn-primary"
            disabled={!question.trim() || busy}
            aria-label={t("Envoyer à l’agent", "Send to the agent")}
          >
            {busy ? (
              <LoaderCircle size={20} className="spinning" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
        <p className="tutor-footnote">
          {t(
            "Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne. Les exemples ne sont pas exécutés.",
            "Enter to send · Shift + Enter for a new line. Examples are not executed.",
          )}
        </p>
      </section>
    </div>
  );
}
function ModerationAgent() {
  const { t } = useI18n();
  const [reviews, setReviews] = useReviews();
  const [posts, setPosts] = useLocalData("posts", initialPosts, migratePosts);
  const [people]=usePeople();
  const [,setNotifications]=useNotifications();
  const [, setJobs] = useLocalData("jobs", initialJobs, migrateJobs);
  const [filter, setFilter] = useState("pending");
  function decide(
    review: Review,
    status: "approved" | "rejected",
    reason: string,
  ) {
    setReviews((current) =>
      current.map((r) =>
        r.id === review.id ? { ...r, status, decision: reason } : r,
      ),
    );
    if(review.kind === "post" && status === "rejected") {
      const post=posts.find(p=>p.id===review.resourceId),recipientId=post?.authorId || people.find(person=>person.name===post?.author)?.id;
      const notice=post?blockedPostNotice(post,recipientId):undefined;
      if(notice)setNotifications(current=>[notice,...current]);
    }
    if (review.kind === "post")
      setPosts((current) =>
        current.map((p) =>
          p.id === review.resourceId ? { ...p, moderation: status } : p,
        ),
      );
    if (review.kind === "offer")
      setJobs((current) =>
        current.map((j) =>
          j.id === review.resourceId ? { ...j, moderation: status } : j,
        ),
      );
  }
  const filtered = reviews.filter(
    (r) => filter === "all" || r.status === filter,
  );
  return (
    <section className="moderation-space">
      <div className="moderation-intro">
        <span className="round-icon">
          <ShieldCheck size={28} />
        </span>
        <div>
          <h2>
            {t(
              "Un espace pour veiller sur la communauté.",
              "A space to look after the community.",
            )}
          </h2>
          <p>
            {t(
              "Publications, offres et signalements. Cette interface simule la file de travail de l’agent modérateur ; les droits et décisions réels seront gérés par Django.",
              "Posts, jobs and reports. This interface simulates the moderation queue; real permissions and decisions will be handled by Django.",
            )}
          </p>
        </div>
      </div>
      <div className="moderation-tabs">
        {[
          ["pending", t("À vérifier", "To review")],
          ["approved", t("Validés", "Approved")],
          ["rejected", t("Refusés", "Rejected")],
          ["all", t("Tous", "All")],
        ].map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="moderation-list">
        {filtered.map((r) => (
          <article className="panel review-card" key={r.id}>
            <div className="review-heading">
              <span className="round-icon">
                {r.kind === "report" ? (
                  <Flag size={19} />
                ) : (
                  <FileText size={19} />
                )}
              </span>
              <div>
                <small>
                  {r.kind === "post"
                    ? t("Publication", "Post")
                    : r.kind === "offer"
                      ? t("Offre", "Job")
                      : t("Signalement", "Report")}
                </small>
                <h3>{r.title}</h3>
              </div>
              <span className={`review-status ${r.status}`}>
                {r.status === "pending"
                  ? t("En attente", "Pending")
                  : r.status === "approved"
                    ? t("Validé", "Approved")
                    : t("Refusé", "Rejected")}
              </span>
            </div>
            <p className="review-content">{r.content}</p>
            {r.decision && <p className="review-decision">{t(r.decision)}</p>}
            {r.status === "pending" && (
              <div className="review-actions">
                {r.kind !== "report" && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      const result = checkContent(r.content);
                      decide(r, result.status, result.reason);
                    }}
                  >
                    <Sparkles size={16} />
                    {t("Vérification locale · démo", "Local check · demo")}
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() =>
                    decide(
                      r,
                      "approved",
                      t(
                        "Décision manuelle de démonstration.",
                        "Manual demonstration decision.",
                      ),
                    )
                  }
                >
                  <Check size={16} />
                  {r.kind === "report"
                    ? t("Marquer traité", "Mark reviewed")
                    : t("Valider", "Approve")}
                </button>
                <button
                  className="btn-secondary danger"
                  onClick={() =>
                    decide(
                      r,
                      "rejected",
                      t(
                        "Refus manuel de démonstration.",
                        "Manual demonstration rejection.",
                      ),
                    )
                  }
                >
                  <X size={16} />
                  {t("Refuser", "Reject")}
                </button>
              </div>
            )}
          </article>
        ))}
        {!filtered.length && (
          <div className="panel empty-state">
            <CheckCheck size={36} />
            <h2>{t("La file est à jour.", "The queue is up to date.")}</h2>
            <p>
              {t(
                "Les nouvelles publications, offres et signalements apparaîtront ici.",
                "New posts, jobs and reports will appear here.",
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
