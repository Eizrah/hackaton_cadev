import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Paperclip,
  Plus,
  Search,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import { useLocalData } from "../../lib/storage";
import {
  initialGroups,
  normalizeText,
  type ChatMessage,
  type Group,
} from "../../data/models";
import Modal from "../Modal";
export default function Messages({
  route,
  onNavigate,
  onNotice,
}: {
  route: string[];
  onNavigate: (path: string) => void;
  onNotice: (text: string) => void;
}) {
  const [groups, setGroups] = useLocalData("groups", initialGroups);
  const [messages, setMessages] = useLocalData<ChatMessage[]>("messages", []);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const isGroups = route[0] === "groupes" || route[0] === "groupe";
  const group =
    route[0] === "groupe"
      ? groups.find((g) => g.id === Number(route[1]))
      : undefined;
  let privateName = "Amina Diallo";
  try {
    if (route[0] === "prive" && route[1])
      privateName = decodeURIComponent(route[1]);
  } catch {
    /* Route incorrecte : ouvrir la conversation par défaut. */
  }
  const conversation = group ? `Groupe : ${group.name}` : privateName;
  const people = [
    ...new Set([
      "Amina Diallo",
      "Tiana Rakoto",
      "Koffi Mensah",
      privateName,
      ...messages
        .filter((m) => !m.conversation.startsWith("Groupe : "))
        .map((m) => m.conversation),
    ]),
  ];
  const visibleMessages = messages.filter(
    (m) => m.conversation === conversation,
  );
  const matchingGroups = groups.filter((g) =>
    normalizeText(`${g.name} ${g.description}`).includes(normalizeText(query)),
  );
  function changeConversation(path: string) {
    setText("");
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
    onNavigate(path);
  }
  function join(group: Group) {
    setGroups((current) =>
      current.map((g) => (g.id === group.id ? { ...g, joined: !g.joined } : g)),
    );
    onNotice(
      group.joined
        ? "Tu as quitté le groupe dans cette démo."
        : "Tu as rejoint le groupe dans cette démo.",
    );
  }
  function send() {
    if (!text.trim() && !file) return;
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        conversation,
        text: text.trim(),
        file: file?.name,
        sentAt: new Date().toISOString(),
      },
    ]);
    setText("");
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }
  function renderChat() {
    return (
      <section className="chat">
        <header className="chat-header">
          <div className="person">
            <span className="avatar">
              {group ? (
                <UsersRound size={21} />
              ) : (
                privateName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
              )}
            </span>
            <div>
              <h2>{group?.name || privateName}</h2>
              <small>
                {group ? "Discussion de groupe" : "Conversation privée"} ·
                Démonstration locale
              </small>
            </div>
          </div>
          {group && (
            <button
              className="quiet"
              aria-label="Revenir aux groupes"
              onClick={() => changeConversation("messages/groupes")}
            >
              <ArrowLeft size={19} />
            </button>
          )}
        </header>
        <div
          className="chat-history"
          role="log"
          aria-label="Messages de la conversation"
        >
          <div className="chat-start">
            <MessageCircle size={28} />
            <p>
              {group
                ? `Bienvenue dans ${group.name}.`
                : `Une bonne conversation commence par un bonjour.`}
            </p>
            <small>
              Les messages restent sur cet appareil tant que Django n’est pas
              connecté.
            </small>
          </div>
          {visibleMessages.map((m) => (
            <div className="chat-bubble" key={m.id}>
              {m.text && <p>{m.text}</p>}
              {m.file && (
                <span className="attachment-preview">
                  <Paperclip size={15} />
                  {m.file}
                  <small>Nom uniquement · fichier non envoyé</small>
                </span>
              )}
              {m.sentAt && (
                <time dateTime={m.sentAt}>
                  {new Intl.DateTimeFormat("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Indian/Antananarivo",
                  }).format(new Date(m.sentAt))}
                </time>
              )}
            </div>
          ))}
        </div>
        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          {file && (
            <div className="selected-attachment">
              <Paperclip size={15} />
              <span>{file.name}</span>
              <button
                type="button"
                className="quiet"
                aria-label="Retirer la pièce jointe"
                onClick={() => {
                  setFile(null);
                  if (fileInput.current) fileInput.current.value = "";
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="row">
            <label className="file-label">
              <Paperclip size={21} />
              <span className="sr-only">Joindre un fichier</span>
              <input
                ref={fileInput}
                type="file"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected && selected.size > 5 * 1024 * 1024) {
                    onNotice("Choisis un fichier de 5 Mo maximum.");
                    e.target.value = "";
                    return;
                  }
                  setFile(selected || null);
                }}
              />
            </label>
            <input
              value={text}
              aria-label="Votre message"
              placeholder="Écris ton message…"
              maxLength={4000}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="btn-primary"
              disabled={!text.trim() && !file}
              aria-label="Envoyer le message"
            >
              <Send size={18} />
            </button>
          </div>
          <small>Pièces jointes : nom uniquement en démo · 5 Mo maximum.</small>
        </form>
      </section>
    );
  }
  return (
    <div className="messages-page">
      <div
        className="messages-tabs"
        role="group"
        aria-label="Type de conversation"
      >
        <button
          className={!isGroups ? "active" : ""}
          aria-pressed={!isGroups}
          onClick={() => changeConversation("messages")}
        >
          <MessageCircle size={18} />
          Conversations privées
        </button>
        <button
          className={isGroups ? "active" : ""}
          aria-pressed={isGroups}
          onClick={() => changeConversation("messages/groupes")}
        >
          <UsersRound size={18} />
          Groupes<span>{groups.filter((g) => g.joined).length}</span>
        </button>
      </div>
      {isGroups && route[0] === "groupes" && (
        <>
          <div className="groups-intro">
            <div>
              <span className="mini-label">UNE PLACE POUR CHAQUE PASSION</span>
              <h2>Trouve les personnes avec qui avancer.</h2>
              <p>
                Les groupes et leurs discussions vivent désormais dans ta
                messagerie.
              </p>
            </div>
            <button className="btn-primary" onClick={() => setCreating(true)}>
              <Plus size={18} />
              Créer un groupe
            </button>
          </div>
          <div className="catalog-search">
            <Search size={20} />
            <input
              aria-label="Rechercher un groupe"
              placeholder="Rechercher par technologie ou centre d’intérêt…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="group-grid">
            {matchingGroups.map((g, i) => (
              <article className="panel group-card" key={g.id}>
                <div className="row">
                  <span className={`group-symbol group-color-${i % 3}`}>
                    <UsersRound size={27} />
                  </span>
                  <span
                    className={g.joined ? "membership joined" : "membership"}
                  >
                    {g.joined ? (
                      <>
                        <Check size={13} />
                        Membre
                      </>
                    ) : (
                      "À découvrir"
                    )}
                  </span>
                </div>
                <h3>{g.name}</h3>
                <p>{g.description}</p>
                <div className="group-actions">
                  {g.joined ? (
                    <>
                      <button
                        className="btn-primary"
                        onClick={() =>
                          changeConversation(`messages/groupe/${g.id}`)
                        }
                      >
                        Ouvrir la discussion
                        <ArrowRight size={16} />
                      </button>
                      <button
                        className="text-link muted-link"
                        onClick={() => join(g)}
                      >
                        Quitter
                      </button>
                    </>
                  ) : (
                    <button className="btn-primary" onClick={() => join(g)}>
                      <Plus size={16} />
                      Rejoindre
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!matchingGroups.length && (
            <div className="panel empty-state">
              <Search />
              <h2>Aucun groupe trouvé.</h2>
              <p>Essaie React, Python ou crée ton propre groupe.</p>
            </div>
          )}
        </>
      )}
      {route[0] === "groupe" && (!group || !group.joined) && (
        <div className="panel empty-state">
          <UsersRound size={30} />
          <h2>
            {group
              ? "Rejoins ce groupe pour discuter."
              : "Ce groupe n’est pas disponible."}
          </h2>
          <button
            className="btn-primary"
            onClick={() => onNavigate("messages/groupes")}
          >
            Découvrir les groupes
          </button>
        </div>
      )}
      {(!isGroups || (group && group.joined)) && (
        <div className="panel messenger">
          <aside className="conversation-list">
            <div className="conversation-list-heading">
              <h2>{group ? "Mes groupes" : "Mes conversations"}</h2>
            </div>
            <div className="conversation-search">
              <Search size={16} />
              <input
                aria-label="Rechercher une conversation"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher…"
              />
            </div>
            {group
              ? groups
                  .filter(
                    (g) =>
                      g.joined &&
                      normalizeText(g.name).includes(normalizeText(query)),
                  )
                  .map((g) => (
                    <button
                      key={g.id}
                      aria-pressed={group.id === g.id}
                      className={group.id === g.id ? "active" : ""}
                      onClick={() =>
                        changeConversation(`messages/groupe/${g.id}`)
                      }
                    >
                      <span className="avatar">
                        <UsersRound size={20} />
                      </span>
                      <span>
                        <strong>{g.name}</strong>
                        <small>Discussion de groupe</small>
                      </span>
                    </button>
                  ))
              : people
                  .filter((n) =>
                    normalizeText(n).includes(normalizeText(query)),
                  )
                  .map((n) => (
                    <button
                      key={n}
                      aria-pressed={privateName === n}
                      className={privateName === n ? "active" : ""}
                      onClick={() =>
                        changeConversation(
                          `messages/prive/${encodeURIComponent(n)}`,
                        )
                      }
                    >
                      <span className="avatar">
                        {n
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <span>
                        <strong>{n}</strong>
                        <small>Conversation privée</small>
                      </span>
                    </button>
                  ))}
          </aside>
          {renderChat()}
        </div>
      )}
      {creating && (
        <Modal title="Créer un groupe" onClose={() => setCreating(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const name = String(data.get("name")).trim();
              const description = String(data.get("description")).trim();
              if (!name || !description) return;
              const id = Date.now();
              setGroups((current) => [
                { id, name, description, joined: true },
                ...current,
              ]);
              setCreating(false);
              onNotice("Groupe créé. Tu peux lancer sa discussion.");
              changeConversation(`messages/groupe/${id}`);
            }}
          >
            <label>
              Nom du groupe
              <input
                name="name"
                required
                maxLength={80}
                pattern=".*\S.*"
                placeholder="Ex. Design Madagascar"
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                required
                maxLength={600}
                placeholder="Qu’allez-vous apprendre ou construire ensemble ?"
              />
            </label>
            <button className="btn-primary">
              Créer le groupe
              <ArrowRight size={17} />
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
