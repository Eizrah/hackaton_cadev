import { blockedPostNotice } from "../../data/lifecycle";
import { useNotifications } from "../../data/notifications";
import { usePeople } from "../../data/people";
import { createLocalId } from "../../lib/format";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bot,
  Check,
  CheckCheck,
  Copy,
  FileText,
  Flag,
  History,
  LoaderCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useI18n } from "../../i18n/context";
import { useLocalData } from "../../lib/storage";
import { askTutor, tutorErrorMessage, usesDjangoTutor, type TutorMessage } from "../../lib/agents";
import { isLessonContext, readLearningCodeContext, tutorCodeQuestion, type LearningCodeContext, type LearningTutorContext } from "../../lib/learningTutorContext";
import { checkContent, useReviews, type Review } from "../../data/workflow";
import { initialPosts, migratePosts, initialJobs, migrateJobs } from "../../data/models";
import "../learning/learning-enhancements.css";
type TutorThread = {
  id: number;
  title: string;
  messages: TutorMessage[];
  createdAt: string;
  context?: LearningTutorContext;
};
function Reply({ content }: { content: string }) {
  const { t } = useI18n();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== undefined) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const parts = content.split(/```(?:[a-zA-Z0-9]+)?\n?/);
  
  return (
    <div className="message-body">
      {parts.map((part, i) =>
        i % 2 ? (
          <div key={i} className="code-block-wrapper">
            <button
              className="code-copy-btn"
              onClick={() => copyToClipboard(part.trim(), i)}
              title={t("Copier le code", "Copy code")}
            >
              {copiedIndex === i ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
            </button>
            <pre>
              <code>{part.trim()}</code>
            </pre>
          </div>
        ) : (
          part.trim() && <p key={i}>{part}</p>
        ),
      )}
      <div className="message-actions">
        <button
          className="message-action-btn icon-only"
          onClick={() => copyToClipboard(content)}
          title={t("Copier le message", "Copy message")}
        >
          {copiedMessage ? (
            <Check size={13} />
          ) : (
            <Copy size={13} />
          )}
        </button>
      </div>
    </div>
  );
}
export default function Assistant({
  route,
  onNavigate,
}: {
  route: string[];
  onNavigate: (path: string) => void;
}) {
  if (route[0] === "moderation") return <ModerationQueue />;
  return <div className="agents-page">
    <AssistantConversation
      key={route[0] || "accueil"}
      initialContext={route[0] === "code" ? readLearningCodeContext() : undefined}
      onNavigate={onNavigate} />
  </div>;
}
function AssistantConversation({ initialContext, onNavigate }: { initialContext?: LearningCodeContext; onNavigate: (path: string) => void }) {
  const { t, language } = useI18n();
  const [threads, setThreads] = useLocalData<TutorThread[]>(
    "tutor-threads",
    [],
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyId = useId();
  const log = useRef<HTMLDivElement>(null);
  const [attachedContext, setAttachedContext] = useState(initialContext);
  const [question, setQuestion] = useState(() => initialContext ? tutorCodeQuestion(initialContext, language === "en") : ""),
    [search, setSearch] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const thread = threads.find((h) => h.id === selected);
  const context = thread ? thread.context : attachedContext;
  const codeContext = context && !isLessonContext(context) ? context : undefined;
  const messageCount = thread?.messages.length ?? 0;

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [selected, messageCount, busy]);

  async function send(override?: string) {
    const content = (override ?? question).trim();
    if (!content || busy) return;
    const id = selected ?? createLocalId();
    const previous = threads.find((h) => h.id === id);
    const history = previous?.messages || [];
    const last = history.at(-1);
    const messages: TutorMessage[] = last?.role === "user" && last.content === content
      ? history
      : [...history, { role: "user", content }];
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
    } catch (error) {
      setError(tutorErrorMessage(error, language));
      setQuestion((draft) => draft || content);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="assistant-shell">
      <aside id={historyId} className={`assistant-history${historyOpen ? " open" : ""}`}>
        <button
          className="new-discussion"
          onClick={() => {
            setSelected(null);
            setQuestion("");
            setAttachedContext(undefined);
            setError("");
            setHistoryOpen(false);
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
                    setHistoryOpen(false);
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
      </aside>
      <section className="assistant-conversation">
        <header>
          <span>
            <Sparkles size={17} />
            {t("Assistant IA", "AI assistant")}
          </span>
          <small>
            {usesDjangoTutor
              ? t("Assistant Django", "Django assistant")
              : t("Mode démo · réponses locales", "Demo mode · local replies")}
          </small>
          <button type="button" className="assistant-history-toggle"
            aria-controls={historyId} aria-expanded={historyOpen}
            aria-label={t("Historique des conversations", "Chat history")}
            title={t("Historique des conversations", "Chat history")}
            onClick={() => setHistoryOpen(open => !open)}><History size={20} /></button>
        </header>
        {context && (
          <aside className="tutor-code-context" aria-label={t("Contexte de la conversation", "Conversation context")}>
            <div><Bot size={20} /><span><strong>{context.courseTitle} · {context.lessonTitle}</strong>{codeContext && <small>{codeContext.file}</small>}</span></div>
            <button type="button" onClick={() => onNavigate(context.returnPath)}><ArrowLeft size={15} />{t("Revenir au cours ou à l’atelier", "Return to the course or studio")}</button>
            {codeContext && <details><summary>{t("Voir le code joint", "View attached code")}</summary><pre><code>{codeContext.code}</code></pre></details>}
          </aside>
        )}
        {!thread ? (
          <div className="assistant-welcome">
            <span className="tutor-symbol">
              <Sparkles size={35} />
            </span>
            <h2>
              {t(
                "Que veux-tu apprendre sur le développement ?",
                "What would you like to learn about development?",
              )}
            </h2>
            <p>
              {t(
                "Découvre les métiers du web, choisis un parcours ou pose une question sur ton code.",
                "Explore web development roles, choose a learning path or ask about your code.",
              )}
            </p>
            <div className="prompt-cards">
              {[
                t("C’est quoi HTML ?", "What is HTML?"),
                t("Par quoi commencer en backend ?", "How do I start with backend development?"),
                t("C’est quoi un dev fullstack ?", "What is a full-stack developer?"),
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
            ref={log}
            role="log"
            aria-label={t("Discussion avec l’assistant", "Conversation with the assistant")}
          >
            {thread.messages.map((m, i) => (
              <article className={`tutor-message ${m.role}`} key={i}>
                {m.role === "assistant" && (
                  <span className="tutor-avatar">
                    <Bot size={20} />
                  </span>
                )}
                {m.role === "assistant" ? (
                  <div>
                    <small>
                      {import.meta.env.VITE_AGENT_MODE === "api" ? t("Agent apprentissage", "Learning agent") : t("Agent apprentissage · démo", "Learning agent · demo")}
                    </small>
                    <Reply content={m.content} />
                  </div>
                ) : (
                  <div className="user-message-wrapper">
                    <div className="message-body user-message-body">
                      <p>{m.content}</p>
                    </div>
                    <div className="message-actions user-message-actions">
                      <button
                        className="message-action-btn icon-only"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(m.content);
                          } catch (error) {
                            console.error("Failed to copy:", error);
                          }
                        }}
                        title={t("Copier le message", "Copy message")}
                      >
                        <Copy size={14} />
                      </button>
                      {i === thread.messages.length - 2 && (
                        <button
                          className="message-action-btn icon-only"
                          onClick={() => send(m.content)}
                          disabled={busy}
                          title={t("Renvoyer ce message", "Resend this message")}
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <button
            className="btn-primary"
            disabled={!question.trim() || busy}
            aria-label={t("Envoyer à l’assistant", "Send to the assistant")}
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
            "Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne.",
            "Enter to send · Shift + Enter for a new line.",
          )}
        </p>
      </section>
    </div>
  );
}
function ModerationQueue() {
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
              "Modération",
              "Moderation",
            )}
          </h2>
          <p>
            {t(
              "Publications, offres et signalements à vérifier dans la démo.",
              "Posts, jobs and reports to review in the demo.",
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
