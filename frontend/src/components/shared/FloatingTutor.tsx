import { useSyncExternalStore, useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Bot, CircleHelp, History, LoaderCircle, Plus, Send, Trash2, X } from "lucide-react";
import { askTutor, tutorErrorMessage, usesDjangoTutor, type TutorMessage } from "../../lib/agents";
import { isLessonContext, saveLearningCodeContext, type LearningLessonContext, type LearningTutorContext } from "../../lib/learningTutorContext";
import { createLocalId } from "../../lib/format";
import { useLocalData } from "../../lib/storage";
import { useI18n } from "../../i18n/context";
import { LessonHelpRegistration, TutorOverlay } from "../../lib/tutorOverlayContext";
import TutorMessageComponent from "./TutorMessage";
type Thread = { id: number; title: string; messages: TutorMessage[]; createdAt: string; context?: LearningTutorContext };
type TutorDragStart = { pointerId: number; pointerX: number; pointerY: number; left: number; top: number };
const subscribeRoute = (update: () => void) => { for (const event of ["devafrica:navigate", "hashchange", "popstate"]) window.addEventListener(event, update); return () => { for (const event of ["devafrica:navigate", "hashchange", "popstate"]) window.removeEventListener(event, update); }; };
const routeSnapshot = () => window.location.hash;
export default function FloatingTutor({ children }: { children: ReactNode }) {
  const { t, language } = useI18n(), [threads, setThreads] = useLocalData<Thread[]>("tutor-threads", []);
  const [open, setOpen] = useState(false), [selected, setSelected] = useState<number | null>(null), [context, setContext] = useState<LearningTutorContext>(), [question, setQuestion] = useState(""), [busy, setBusy] = useState(false), [error, setError] = useState(""), [history, setHistory] = useState(false), [position, setPosition] = useState<CSSProperties>({});
  const currentLesson = useRef<LearningLessonContext | undefined>(undefined);
  const registerLesson = useCallback((value?: LearningLessonContext) => { currentLesson.current = value; }, []);
  const anchor = useRef<HTMLElement | undefined>(undefined), input = useRef<HTMLTextAreaElement>(null), scroll = useRef<HTMLDivElement>(null), panel = useRef<HTMLElement>(null), close = useRef<HTMLButtonElement>(null);
  const dragStart = useRef<TutorDragStart | null>(null), manuallyPositioned = useRef(false);
  const route = useSyncExternalStore(subscribeRoute, routeSnapshot);
  const showHelp = route.startsWith("#workspace/apprentissage");
  const thread = threads.find(item => item.id === selected), attached = thread?.context || context;
  const codeMode = !!attached && !isLessonContext(attached);
  const contextLabel = attached ? (isLessonContext(attached) ? attached.lessonTitle : attached.file) : "";
  const place = useCallback(() => {
    if (window.innerWidth < 700) { setPosition({}); return; }
    const width = Math.min(424, window.innerWidth - 32), height = Math.min(610, window.innerHeight - 40), rect = anchor.current?.getBoundingClientRect();
    let left = window.innerWidth - width - 24, top = window.innerHeight - height - 24;
    if (rect) { left = rect.right + 18 + width < window.innerWidth ? rect.right + 18 : rect.left - width - 18 > 16 ? rect.left - width - 18 : window.innerWidth - width - 24; top = Math.max(16, Math.min(rect.top, window.innerHeight - height - 16)); }
    setPosition({ left: Math.max(16, left), top, width, height, bottom: "auto", right: "auto" });
  }, []);
  const beginDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (event.button !== 0 && event.pointerType !== "touch") return;
    const rect = panel.current?.getBoundingClientRect();
    if (!rect) return;
    dragStart.current = { pointerId: event.pointerId, pointerX: event.clientX, pointerY: event.clientY, left: rect.left, top: rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);
  const moveTutor = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const start = dragStart.current;
    const rect = panel.current?.getBoundingClientRect();
    if (!start || start.pointerId !== event.pointerId || !rect) return;
    event.preventDefault();
    const left = Math.max(8, Math.min(start.left + event.clientX - start.pointerX, window.innerWidth - rect.width - 8));
    const top = Math.max(8, Math.min(start.top + event.clientY - start.pointerY, window.innerHeight - rect.height - 8));
    manuallyPositioned.current = true;
    setPosition({ left, top, width: rect.width, height: rect.height, bottom: "auto", right: "auto" });
  }, []);
  const endDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;
    dragStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);
  const openTutor = useCallback((value?: LearningTutorContext, element?: HTMLElement) => {
    if (value && !isLessonContext(value)) saveLearningCodeContext(value);
    manuallyPositioned.current = false;
    dragStart.current = null;
    anchor.current = element; setContext(value); setSelected(null); setError(""); setHistory(false); setQuestion(value && !isLessonContext(value) ? (language === "en" ? "Explain this code step by step." : "Explique-moi ce code pas à pas.") : ""); setOpen(true); place();
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  }, [language, place]);
  useEffect(() => { const closeOnNavigation = () => setOpen(false); return subscribeRoute(closeOnNavigation); }, []);
  const dismiss = useCallback(() => { setOpen(false); anchor.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      const rect = panel.current?.getBoundingClientRect();
      if (!manuallyPositioned.current || !rect) { place(); return; }
      const width = Math.min(rect.width, window.innerWidth - 16), height = Math.min(rect.height, window.innerHeight - 16);
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const top = Math.max(8, Math.min(rect.top, window.innerHeight - height - 8));
      setPosition({ left, top, width, height, bottom: "auto", right: "auto" });
    };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("resize", reposition); document.addEventListener("keydown", key);
    return () => { window.removeEventListener("resize", reposition); document.removeEventListener("keydown", key); };
  }, [open, place, dismiss]);
  useEffect(() => { scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: "smooth" }); }, [thread?.messages.length, busy]);
  async function send(override?: string) {
    const content = (override ?? question).trim();
    if (!content || busy) return;
    const id = selected ?? createLocalId();
    const history = thread?.messages || [];
    const previous = history.at(-1);
    const messages: TutorMessage[] = previous?.role === "user" && previous.content === content
      ? history
      : [...history, { role: "user", content }];
    const currentContext = attached;
    setThreads(current => current.some(item => item.id === id) ? current.map(item => item.id === id ? { ...item, messages } : item) : [{ id, title: currentContext ? `${currentContext.courseTitle} · ${contextLabel}` : content.slice(0, 48), messages, createdAt: new Date().toISOString(), context: currentContext }, ...current]);
    setSelected(id); setQuestion(""); setBusy(true); setError("");
    try {
      const answer = await askTutor(messages, language, currentContext);
      setThreads(current => current.map(item => item.id === id
        ? { ...item, messages: [...item.messages, { role: "assistant", content: answer }] }
        : item));
    } catch (error) {
      setError(tutorErrorMessage(error, language));
      setQuestion(draft => draft || content);
    } finally {
      setBusy(false);
    }
  }
  return <LessonHelpRegistration.Provider value={registerLesson}>
    <TutorOverlay.Provider value={openTutor}>
      {children}
      {showHelp && !open && <button
        className="floating-help"
        aria-label={t("Ouvrir l’aide à l’apprentissage", "Open learning help")}
        title={t("Un mot ou une phrase à comprendre ?", "Need help with a word or sentence?")}
        onClick={event => openTutor(currentLesson.current, event.currentTarget)}>
        <CircleHelp size={27} />
      </button>}
      {showHelp && open && <section
        ref={panel}
        className={`floating-tutor${typeof position.left === "number" ? " is-drag-positioned" : ""}`}
        style={{
          ...position,
          "--floating-tutor-left": `${typeof position.left === "number" ? position.left : 12}px`,
          "--floating-tutor-top": `${typeof position.top === "number" ? position.top : 12}px`,
          "--floating-tutor-width": `${typeof position.width === "number" ? position.width : 320}px`,
          "--floating-tutor-height": `${typeof position.height === "number" ? position.height : 400}px`,
        } as CSSProperties}
        role="dialog"
        aria-modal="false"
        aria-labelledby="floating-tutor-title">
        <header
          className="floating-tutor-drag-handle"
          title={t("Maintiens l’en-tête pour déplacer cette fenêtre", "Press and drag the header to move this window")}
          onPointerDown={beginDrag}
          onPointerMove={moveTutor}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}>
          <span className="floating-tutor-avatar">
            <Bot size={23} />
          </span>
          <div>
            <h2 id="floating-tutor-title">
              {codeMode ? t("Comprendre le code", "Understand the code") : t("Comprendre la leçon", "Understand the lesson")}
            </h2>
            <small>
              {attached ? `${attached.courseTitle} · ${contextLabel}` : t("Les mots et les phrases du cours", "Words and sentences from your course")}
            </small>
          </div>
          <button
            className="quiet"
            onClick={() => setHistory(!history)}
            aria-label={t("Historique des discussions", "Conversation history")}
            aria-expanded={history}>
            <History size={18} />
          </button>
          <button
            className="quiet"
            ref={close}
            onClick={dismiss}
            aria-label={t("Fermer l’aide", "Close learning help")}>
            <X size={20} />
          </button>
        </header>
        {history ? <div className="floating-tutor-history">
          <button
            className="text-link"
            onClick={() => { setContext(attached || currentLesson.current); setSelected(null); setHistory(false); setQuestion(""); }}>
            <Plus size={16} />
            {t("Nouvelle discussion", "New conversation")}
          </button>
          {threads.length ? threads.map(item => <div className="floating-tutor-history-item" key={item.id}>
            <button
              type="button"
              className="floating-tutor-history-open"
              onClick={() => { setSelected(item.id); setContext(item.context); setHistory(false); setError(""); }}>
              <History size={15} />
              <span>{item.title}</span>
            </button>
            {/* Supprimer uniquement cette session enregistrée dans l’historique local. */}
            <button
              type="button"
              className="floating-tutor-history-delete"
              aria-label={t("Supprimer cette session", "Delete this session")}
              title={t("Supprimer cette session", "Delete this session")}
              onClick={event => {
                event.stopPropagation();
                setThreads(current => current.filter(thread => thread.id !== item.id));
                if (selected === item.id) { setSelected(null); setQuestion(""); setError(""); }
              }}>
              <Trash2 size={17} />
            </button>
          </div>) : <p>
            {t("Tes discussions apparaîtront ici.", "Your conversations will appear here.")}
          </p>}
        </div> : <>
          <div
            className="floating-tutor-scroll"
            ref={scroll}>
            {!thread && <div className="floating-tutor-welcome">
              <Bot size={34} />
              <h3>
                {codeMode ? t("Comprenons ce code ensemble.", "Let’s understand this code together.") : t("Quel passage veux-tu comprendre ?", "Which passage would you like to understand?")}
              </h3>
              <p>
                {codeMode ? t("Demande le rôle d’une balise, d’une variable ou d’une ligne. Ton code est joint à cette discussion.", "Ask about a tag, a variable or a line. Your code is attached to this conversation.") : t("Écris un mot, un acronyme ou copie une phrase de la leçon. Je t’aide à en comprendre le sens avec un exemple.", "Enter a word or acronym, or paste a sentence from your lesson. I can help explain its meaning with an example.")}
              </p>
            </div>}
            {thread?.messages.map((message, index) => <TutorMessageComponent
              key={index}
              message={message}
              onResend={message.role === "user" && index === thread.messages.length - 1 ? () => {
                void send(message.content);
              } : undefined}
            />)}
            {busy && <p
              className="tutor-loading"
              role="status">
              <LoaderCircle
                className="spin"
                size={17} />
              {t("Préparation de la réponse…", "Preparing a reply…")}
            </p>}
          </div>
          {error && <p
            className="form-error"
            role="alert">
            {error}
          </p>}
          <form
            className="floating-tutor-composer"
            onSubmit={e => { e.preventDefault(); void send(); }}>
            <textarea
              ref={input}
              rows={2}
              aria-label={t("Question pour l’agent", "Question for the agent")}
              placeholder={codeMode ? t("Que signifie cette ligne ?", "What does this line mean?") : t("Que signifie ce mot ou cette phrase ?", "What does this word or sentence mean?")}
              value={question}
              maxLength={8000}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }} />
            <button
              className="btn-primary"
              disabled={busy || !question.trim()}
              aria-label={t("Envoyer à l’agent", "Send to the agent")}>
              <Send size={18} />
            </button>
          </form>
          <small className="floating-tutor-mode">
            {usesDjangoTutor ? t("Assistant Django", "Django assistant") : t("Aide locale · connexion IA à configurer", "Local help · AI connection to configure")}
          </small>
        </>}
      </section>}
    </TutorOverlay.Provider>
  </LessonHelpRegistration.Provider>;
}
