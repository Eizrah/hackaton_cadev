import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Info,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Send,
  Smile,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import { useLocalData } from "../../lib/storage";
import {
  initialGroups,
  normalizeText,
  type ChatMessage,
  type Profile,
} from "../../data/models";
import { useI18n } from "../../i18n/context";
import { safePortfolio } from "../../lib/urls";
import Modal from "../Modal";
const sampleMessages: ChatMessage[] = [
  {
    id: 101,
    conversation: "Amina Diallo",
    text: "Bonjour ! Je serais ravie d’échanger sur nos projets React et Django.",
    sentAt: "2026-10-31T09:10:00+03:00",
    author: "Amina Diallo",
    mine: false,
  },
  {
    id: 102,
    conversation: "Groupe : Python & Django",
    text: "Bienvenue ! Ici, on partage nos questions et nos découvertes Python.",
    sentAt: "2026-10-31T09:00:00+03:00",
    author: "Amina Diallo",
    mine: false,
  },
  {
    id: 103,
    conversation: "Groupe : Python & Django",
    text: "Je prépare une petite API Django pour notre prochain projet. Qui veut en discuter ?",
    sentAt: "2026-10-31T09:05:00+03:00",
    author: "Tiana Rakoto",
    mine: false,
  },
];
type UsefulLink = {
  id: number;
  conversation: string;
  title: string;
  url: string;
};
export default function Messages({
  route,
  profile,
  onNavigate,
  onNotice,
}: {
  route: string[];
  profile: Profile;
  onNavigate: (path: string) => void;
  onNotice: (text: string) => void;
}) {
  const { t, locale } = useI18n();
  const [groups, setGroups] = useLocalData("groups", initialGroups);
  const [messages, setMessages] = useLocalData<ChatMessage[]>(
    "messages",
    sampleMessages,
  );
  const [links, setLinks] = useLocalData<UsefulLink[]>("chat-links", []);
  const [favorites, setFavorites] = useLocalData<string[]>(
    "favorite-conversations",
    [],
  );
  const [query, setQuery] = useState(""),
    [text, setText] = useState(""),
    [messageQuery, setMessageQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const [file, setFile] = useState<File | null>(null);
  const [modal, setModal] = useState<"create" | "description" | "link" | null>(
    null,
  );
  const [showInfo, setShowInfo] = useState(false),
    [showSearch, setShowSearch] = useState(false),
    [emoji, setEmoji] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const visibleFilter =
    route[0] === "groupes"
      ? "groups"
      : route[0] === "prives"
        ? "private"
        : filter;
  const group =
    route[0] === "groupe"
      ? groups.find((g) => g.id === Number(route[1]))
      : route[0] === "groupes"
        ? groups.find((g) => g.joined) || groups[0]
        : undefined;
  let person = "Amina Diallo";
  try {
    if (route[0] === "prive" && route[1]) person = decodeURIComponent(route[1]);
  } catch {
    /* Conversation par défaut. */
  }
  const key = group ? `Groupe : ${group.name}` : person;
  const conversationTitle = group?.name || person;
  const canWrite = !group || group.joined;
  const people = [
    ...new Set([
      "Amina Diallo",
      "Tiana Rakoto",
      "Koffi Mensah",
      person,
      ...messages
        .filter((m) => !m.conversation.startsWith("Groupe : "))
        .map((m) => m.conversation),
    ]),
  ];
  const conversations = [
    ...groups.map((g) => ({
      id: `group-${g.id}`,
      title: g.name,
      key: `Groupe : ${g.name}`,
      group: g,
      path: `messages/groupe/${g.id}`,
    })),
    ...people.map((name) => ({
      id: name,
      title: name,
      key: name,
      group: undefined,
      path: `messages/prive/${encodeURIComponent(name)}`,
    })),
  ].filter(
    (c) =>
      (visibleFilter === "all" ||
        (visibleFilter === "groups" ? !!c.group : !c.group)) &&
      normalizeText(
        `${c.title} ${messages.filter((m) => m.conversation === c.key).at(-1)?.text || ""}`,
      ).includes(normalizeText(query)),
  );
  const currentMessages = messages.filter((m) => m.conversation === key);
  const displayMessages = currentMessages.filter((m) =>
    normalizeText(m.text + " " + m.file).includes(normalizeText(messageQuery)),
  );
  const files = currentMessages.filter((m) => m.file);
  const currentLinks = links.filter((l) => l.conversation === key);
  function navigate(path: string) {
    setText("");
    setFile(null);
    setMessageQuery("");
    setShowSearch(false);
    setShowInfo(false);
    if (fileInput.current) fileInput.current.value = "";
    onNavigate(path);
  }
  function send() {
    if ((!text.trim() && !file) || !canWrite) return;
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        conversation: key,
        text: text.trim(),
        file: file?.name,
        sentAt: new Date().toISOString(),
        author: profile.name,
        mine: true,
      },
    ]);
    setText("");
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }
  const members = group
    ? [
        ...new Set([
          "Amina Diallo",
          "Tiana Rakoto",
          ...(group.joined ? [profile.name] : []),
        ]),
      ]
    : [person];
  const info = (
    <aside className={`message-details ${showInfo ? "open" : ""}`}>
      <button
        className="details-close quiet"
        onClick={() => setShowInfo(false)}
        aria-label={t("Fermer les informations", "Close details")}
      >
        <X size={20} />
      </button>
      <div className="contact-detail-card">
        <div className="contact-art" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span className="contact-large-avatar">
          {group ? (
            <UsersRound size={39} />
          ) : (
            person
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
          )}
        </span>
        <h3>{conversationTitle}</h3>
        <small>
          {group
            ? t("Discussion de groupe · démo", "Group chat · demo")
            : t("Conversation privée · démo", "Private conversation · demo")}
        </small>
        <p>
          {group?.description ||
            t(
              "Un espace pour échanger et construire ensemble.",
              "A space to exchange ideas and build together.",
            )}
        </p>
        {group && group.joined && (
          <button
            className="details-edit"
            onClick={() => setModal("description")}
          >
            <Pencil size={14} />
            {t("Modifier la description", "Edit description")}
          </button>
        )}
        {group?.joined && <button className="details-leave" onClick={() => { setGroups(current => current.map(g => g.id === group.id ? { ...g, joined: false } : g)); navigate('messages/groupes') }}>{t('Quitter le groupe', 'Leave group')}</button>}
      </div>
      <div className="details-section">
        <h3>{t("Participants", "Participants")}</h3>
        <div className="member-avatars">
          {members.map((name) => (
            <span className="avatar" title={name} key={name}>
              {name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
          ))}
        </div>
        <small>
          {t(
            "Profils de démonstration, présence non synchronisée.",
            "Demo profiles, presence is not synchronized.",
          )}
        </small>
      </div>
      <div className="details-section">
        <h3>{t("Fichiers récents", "Recent files")}</h3>
        {files.length ? (
          files.slice(-4).map((m) => (
            <div className="recent-file" key={m.id}>
              <FileText size={20} />
              <div>
                <strong>{m.file}</strong>
                <small>
                  {t(
                    "Nom local · fichier non transmis",
                    "Local name · file not sent",
                  )}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>
            {t(
              "Les pièces jointes apparaîtront ici.",
              "Attachments will appear here.",
            )}
          </p>
        )}
      </div>
      <div className="details-section">
        <div className="row">
          <h3>{t("Liens utiles", "Useful links")}</h3>
          <button
            className="quiet"
            aria-label={t("Ajouter un lien", "Add a link")}
            onClick={() => setModal("link")}
          >
            <Plus size={18} />
          </button>
        </div>
        {currentLinks.map((l) => (
          <a href={l.url} target="_blank" rel="noopener noreferrer" key={l.id}>
            <Link2 size={15} />
            {l.title}
            <ArrowRight size={13} />
          </a>
        ))}
        {!currentLinks.length && (
          <p>
            {t(
              "Garde les ressources du projet à portée de main.",
              "Keep project resources close at hand.",
            )}
          </p>
        )}
      </div>
    </aside>
  );
  return (
    <section className="messaging-app">
      <aside className="message-directory">
        <div className="message-directory-top">
          <h2>{t("Conversations", "Conversations")}</h2>
          <button
            aria-label={t("Créer un groupe", "Create a group")}
            onClick={() => setModal("create")}
          >
            <Plus size={21} />
          </button>
        </div>
        <div
          className="conversation-kind"
          role="group"
          aria-label={t("Type de conversation", "Conversation type")}
        >
          {[
            ["all", t("Toutes", "All"), MessageCircle],
            ["private", t("Privés", "Private"), Info],
            ["groups", t("Groupes", "Groups"), UsersRound],
          ].map(([id, label, Icon]) => {
            const Symbol = Icon as typeof MessageCircle;
            return (
              <button
                key={id as string}
                className={visibleFilter === id ? "active" : ""}
                aria-pressed={visibleFilter === id}
                aria-label={
                  id === "all"
                    ? t("Toutes les conversations", "All conversations")
                    : id === "private"
                      ? t("Messages privés", "Private messages")
                      : t("Groupes", "Groups")
                }
                onClick={() => {
                  setFilter(id as string);
                  navigate(
                    id === "groups"
                      ? "messages/groupes"
                      : id === "private"
                        ? "messages/prives"
                        : "messages",
                  );
                }}
              >
                <Symbol size={16} />
                <span>{label as string}</span>
              </button>
            );
          })}
        </div>
        <label className="directory-search">
          <Search size={17} />
          <input
            aria-label={t(
              "Rechercher une conversation",
              "Search conversations",
            )}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Rechercher une conversation…",
              "Search conversations…",
            )}
          />
        </label>
        <div className="message-threads">
          {conversations.map((c) => {
            const last = messages
              .filter((m) => m.conversation === c.key)
              .at(-1);
            return (
              <button
                key={c.id}
                className={key === c.key ? "active" : ""}
                onClick={() => navigate(c.path)}
              >
                <span className="thread-avatar">
                  {c.group ? (
                    <UsersRound size={25} />
                  ) : (
                    c.title
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  )}
                </span>
                <span className="thread-preview">
                  <strong>{c.title}</strong>
                  <small>
                    {last?.text ||
                      c.group?.description ||
                      t("Démarrer la discussion", "Start a conversation")}
                  </small>
                </span>
                <span className="thread-meta">
                  {last?.sentAt
                    ? new Intl.DateTimeFormat(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(last.sentAt))
                    : ""}
                  {c.group && !c.group.joined && <Plus size={13} />}
                </span>
              </button>
            );
          })}
          {!conversations.length && (
            <p className="directory-empty">
              {t("Aucune conversation trouvée.", "No conversations found.")}
            </p>
          )}
        </div>
      </aside>
      <section className="message-room">
        <header className="message-room-header">
          <div className="person">
            <span className="avatar">
              {group ? (
                <UsersRound size={23} />
              ) : (
                person
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
              )}
            </span>
            <div>
              <h2>{conversationTitle}</h2>
              <small>
                <span className="status-dot" />
                {group
                  ? t("Discussion de groupe", "Group chat")
                  : t("Message privé", "Private message")}
              </small>
            </div>
          </div>
          <div className="room-tools">
            <button
              className={favorites.includes(key) ? "favorite" : ""}
              aria-pressed={favorites.includes(key)}
              aria-label={t("Conversation favorite", "Favorite conversation")}
              onClick={() =>
                setFavorites((current) =>
                  current.includes(key)
                    ? current.filter((x) => x !== key)
                    : [...current, key],
                )
              }
            >
              <Star
                size={18}
                fill={favorites.includes(key) ? "currentColor" : "none"}
              />
            </button>
            <button
              aria-label={t(
                "Rechercher dans les messages",
                "Search within messages",
              )}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={18} />
            </button>
            <button
              aria-label={t(
                "Informations de la conversation",
                "Conversation details",
              )}
              onClick={() => setShowInfo(!showInfo)}
            >
              <MoreHorizontal size={22} />
            </button>
          </div>
        </header>
        {showSearch && (
          <div className="room-search">
            <Search size={16} />
            <input
              autoFocus
              aria-label={t("Chercher un message", "Find a message")}
              value={messageQuery}
              onChange={(e) => setMessageQuery(e.target.value)}
              placeholder={t(
                "Chercher dans cette conversation…",
                "Search this conversation…",
              )}
            />
          </div>
        )}
        <div
          className="room-log"
          role="log"
          aria-label={t("Messages de la conversation", "Conversation messages")}
        >
          <span className="room-date">
            {t("Conversations locales · démo", "Local conversations · demo")}
          </span>
          {displayMessages.map((m) => (
            <article
              className={`message-entry ${m.mine !== false ? "mine" : "other"}`}
              key={m.id}
            >
              {m.mine === false && (
                <span className="avatar">
                  {(m.author || person)
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
              <div>
                <div className="message-byline">
                  <strong>
                    {m.mine === false ? m.author : t("Toi", "You")}
                  </strong>
                  {m.sentAt && (
                    <time dateTime={m.sentAt}>
                      {new Intl.DateTimeFormat(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(m.sentAt))}
                    </time>
                  )}
                </div>
                <div className="message-balloon">
                  {m.text && <p>{m.text}</p>}
                  {m.file && (
                    <span className="message-file">
                      <FileText size={22} />
                      <span>
                        {m.file}
                        <small>
                          {t(
                            "Nom uniquement · fichier non envoyé",
                            "Name only · file not sent",
                          )}
                        </small>
                      </span>
                    </span>
                  )}
                  {m.mine !== false && (
                    <Check
                      size={13}
                      className="local-message-check"
                      aria-label={t("Enregistré localement", "Saved locally")}
                    />
                  )}
                </div>
              </div>
            </article>
          ))}
          {!displayMessages.length && (
            <div className="message-empty">
              <MessageCircle size={35} />
              <h3>
                {t(
                  "Une bonne conversation commence par un bonjour.",
                  "A good conversation starts with hello.",
                )}
              </h3>
            </div>
          )}
        </div>
        {canWrite ? (
          <form
            className="room-composer"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            {file && (
              <div className="selected-attachment">
                <Paperclip size={14} />
                <span>{file.name}</span>
                <button
                  type="button"
                  className="quiet"
                  aria-label={t("Retirer la pièce jointe", "Remove attachment")}
                  onClick={() => {
                    setFile(null);
                    if (fileInput.current) fileInput.current.value = "";
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            )}
            <div className="room-composer-row">
              <label className="file-label">
                <Paperclip size={21} />
                <span className="sr-only">
                  {t("Joindre un fichier", "Attach a file")}
                </span>
                <input
                  type="file"
                  ref={fileInput}
                  onChange={(e) => {
                    const chosen = e.target.files?.[0];
                    if (chosen && chosen.size > 5 * 1024 * 1024) {
                      onNotice(
                        t(
                          "Choisis un fichier de 5 Mo maximum.",
                          "Choose a file up to 5 MB.",
                        ),
                      );
                      e.target.value = "";
                      return;
                    }
                    setFile(chosen || null);
                  }}
                />
              </label>
              <button
                type="button"
                className="emoji-button"
                aria-label={t("Ajouter un emoji", "Add an emoji")}
                onClick={() => setEmoji(!emoji)}
              >
                <Smile size={21} />
              </button>
              <input
                aria-label={t("Votre message", "Your message")}
                placeholder={t("Écrire un message…", "Write a message…")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={4000}
              />
              <button
                className="room-send"
                aria-label={t("Envoyer le message", "Send message")}
                disabled={!text.trim() && !file}
              >
                <Send size={22} />
              </button>
            </div>
            {emoji && (
              <div className="emoji-picker">
                {["👋", "✨", "💻", "🚀", "👍"].map((symbol) => (
                  <button
                    type="button"
                    key={symbol}
                    onClick={() => {
                      setText((current) => current + symbol);
                      setEmoji(false);
                    }}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            )}
            <small>
              {t(
                "Messages et noms de fichiers enregistrés sur cet appareil.",
                "Messages and file names are stored on this device.",
              )}
            </small>
          </form>
        ) : (
          <div className="join-conversation">
            <p>
              {t(
                "Rejoins le groupe pour participer à la discussion.",
                "Join this group to take part.",
              )}
            </p>
            <button
              className="btn-primary"
              onClick={() =>
                setGroups((current) =>
                  current.map((g) =>
                    g.id === group?.id ? { ...g, joined: true } : g,
                  ),
                )
              }
            >
              {t("Rejoindre le groupe", "Join group")}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
      {info}
      {modal && (
        <Modal
          title={
            modal === "create"
              ? t("Créer un groupe", "Create a group")
              : modal === "description"
                ? t("Modifier la description", "Edit description")
                : t("Ajouter un lien utile", "Add a useful link")
          }
          onClose={() => setModal(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              if (modal === "create") {
                const name = String(data.get("name")).trim(),
                  description = String(data.get("description")).trim();
                if (!name || !description) return;
                const id = Date.now();
                setGroups((current) => [
                  { id, name, description, joined: true },
                  ...current,
                ]);
                setModal(null);
                setFilter("groups");
                navigate(`messages/groupe/${id}`);
              } else if (modal === "description") {
                setGroups((current) =>
                  current.map((g) =>
                    g.id === group?.id
                      ? {
                          ...g,
                          description: String(data.get("description")).trim(),
                        }
                      : g,
                  ),
                );
                setModal(null);
              } else {
                const url = safePortfolio(String(data.get("url")));
                if (!url) {
                  onNotice(
                    t(
                      "Utilise une adresse http:// ou https://.",
                      "Use an http:// or https:// URL.",
                    ),
                  );
                  return;
                }
                setLinks((current) => [
                  ...current,
                  {
                    id: Date.now(),
                    conversation: key,
                    title: String(data.get("title")).trim(),
                    url,
                  },
                ]);
                setModal(null);
              }
            }}
          >
            {modal === "create" && (
              <label>
                {t("Nom du groupe", "Group name")}
                <input name="name" required maxLength={80} pattern=".*\S.*" />
              </label>
            )}
            {modal !== "link" ? (
              <label>
                {t("Description", "Description")}
                <textarea
                  name="description"
                  required
                  maxLength={600}
                  defaultValue={
                    modal === "description" ? group?.description : ""
                  }
                />
              </label>
            ) : (
              <>
                <label>
                  {t("Titre", "Title")}
                  <input name="title" required maxLength={80} />
                </label>
                <label>
                  URL
                  <input
                    name="url"
                    required
                    type="url"
                    placeholder="https://"
                  />
                </label>
              </>
            )}
            <button className="btn-primary">
              {modal === "create"
                ? t("Créer le groupe", "Create group")
                : t("Enregistrer", "Save")}
              <ArrowRight size={16} />
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
