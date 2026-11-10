import { deleteGroupResult } from "../../data/lifecycle";
import { useEffect, useRef, useState } from "react";
import { BellOff, Check, ChevronRight, FileText, Images, Info, Link2, MessageCircle, MoreHorizontal, Pencil, Plus, Search, Send, ShieldCheck, Slash, Smile, Trash2, UserMinus, UserPlus, UsersRound, X } from "lucide-react";
import { useLocalData } from "../../lib/storage";
import { initialGroups, migrateGroups, normalizeText, type ChatMessage, type Group, type GroupMember, type Profile } from "../../data/models";
import { groupAdmin, chatKey, type ChatPreference } from "../../data/chat";
import { usePeople } from "../../data/people";
import { notification, useNotifications } from "../../data/notifications";
import { useI18n } from "../../i18n/context";
import { safePortfolio } from "../../lib/urls";
import { useAttachmentUrl, type StoredAttachment } from "../../lib/attachments";
import { AttachmentCard, AttachmentPicker } from "../shared/Attachments";
import { CountryFlag } from "../CountryFlag";
import ConversationMedia, { type SharedLink } from "./ConversationMedia";
import Modal from "../Modal";
const sampleMessages: ChatMessage[] = [{ id: 101, conversation: "Amina Diallo", text: "Bonjour ! Je serais ravie d’échanger sur nos projets React et Django.", sentAt: "2026-10-31T09:10:00+03:00", author: "Amina Diallo", authorId: "dev-amina", mine: false }, { id: 102, conversation: "Groupe : Python & Django", text: "Bienvenue ! Ici, on partage nos questions et nos découvertes Python.", sentAt: "2026-10-31T09:00:00+03:00", author: "Amina Diallo", authorId: "dev-amina", mine: false }, { id: 103, conversation: "Groupe : Python & Django", text: "Je prépare une petite API Django pour notre prochain projet. Qui veut en discuter ?", sentAt: "2026-10-31T09:05:00+03:00", author: "Tiana Rakoto", authorId: "dev-tiana", mine: false }];
type UsefulLink = SharedLink & { conversation: string };
function ChatAvatar({ name, photo, group = false }: { name: string; photo?: StoredAttachment; group?: boolean }) {
  const url = useAttachmentUrl(photo); return <span className="avatar">
    {url ? <img
      src={url}
      alt="" /> : group ? <UsersRound size={23} /> : name.split(" ").map(n => n[0]).slice(0, 2).join("")}
  </span>;
}
export default function Messages({ route, profile, onNavigate, onNotice }: { route: string[]; profile: Profile; onNavigate: (path: string) => void; onNotice: (text: string) => void }) {
  const { t, locale } = useI18n(), [groups, setGroups] = useLocalData("groups", migrateGroups(initialGroups), migrateGroups), [messages, setMessages] = useLocalData<ChatMessage[]>("messages", sampleMessages), [links, setLinks] = useLocalData<UsefulLink[]>("chat-links", []), [preferences, setPreferences] = useLocalData<Record<string, ChatPreference>>("chat-preferences", {}), [registry] = usePeople(), [, setNotifications] = useNotifications();
  const [query, setQuery] = useState(""), [text, setText] = useState(""), [filter, setFilter] = useState("all"), [messageQuery, setMessageQuery] = useState(""), [showSearch, setShowSearch] = useState(false), [showInfo, setShowInfo] = useState(false), [menuOpen, setMenuOpen] = useState(false), [emoji, setEmoji] = useState(false), [attachments, setAttachments] = useState<StoredAttachment[]>([]), [uploadCount, setUploadCount] = useState(0), [memberQuery, setMemberQuery] = useState("");
  const uploading = uploadCount > 0;
  const [modal, setModal] = useState<"create" | "description" | "link" | "members" | "clear" | "delete-group" | null>(null), [media, setMedia] = useState<"photos" | "files" | "links" | null>(null);
  const menu = useRef<HTMLDivElement>(null), roomLog = useRef<HTMLDivElement>(null), menuTrigger = useRef<HTMLButtonElement>(null);
  const availableGroups = groups.filter(g => !g.deletedAt), currentGroup = route[0] === "groupe" ? availableGroups.find(g => g.id === Number(route[1])) : route[0] === "groupes" ? availableGroups.find(g => g.members?.some(m => m.id === profile.id)) || availableGroups[0] : undefined;
  let person = "Amina Diallo"; try { if (route[0] === "prive" && route[1]) person = decodeURIComponent(route[1]); } catch {/* Keep the default contact. */ }
  const unavailable = route[0] === "groupe" && !currentGroup, key = currentGroup ? `group:${currentGroup.id}` : person, title = currentGroup?.name || person, prefKey = `${profile.id}|${key}`, preference = preferences[prefKey] || {}, admin = groupAdmin(currentGroup, profile.id), joined = !!currentGroup?.members?.some(m => m.id === profile.id), canWrite = (!currentGroup || joined) && !preference.blocked && !unavailable;
  const names = Array.from(new Set([...registry.map(p => p.name), person, ...messages.filter(m => !m.conversation.startsWith("Groupe : ") && !m.conversation.startsWith("group:")).map(m => m.conversation)])).filter(name => name !== profile.name);
  const visibleFilter = route[0] === "groupes" ? "groups" : route[0] === "prives" ? "private" : filter;
  const conversations = [...availableGroups.map(group => ({ id: `group:${group.id}`, title: group.name, group, key: `group:${group.id}`, path: `messages/groupe/${group.id}` })), ...names.map(name => ({ id: name, title: name, group: undefined as Group | undefined, key: name, path: `messages/prive/${encodeURIComponent(name)}` }))].filter(c => (visibleFilter === "all" || (visibleFilter === "groups" ? !!c.group : !c.group)) && normalizeText(c.title).includes(normalizeText(query)));
  const allCurrent = messages.filter(m => chatKey(m.conversation, groups) === key), currentMessages = allCurrent.filter(m => !preference.hiddenMessages?.includes(m.id)), displayMessages = currentMessages.filter(m => normalizeText(`${m.text} ${m.file || ""} ${(m.attachments || []).map(f => f.name).join(" ")}`).includes(normalizeText(messageQuery))), files = currentMessages.flatMap(m => m.attachments?.length ? m.attachments : m.file ? [{ id: `legacy-${m.id}`, name: m.file, type: "application/octet-stream", size: 0 }] : []), photos = files.filter(f => f.type.startsWith("image/")), documents = files.filter(f => !f.type.startsWith("image/"));
  const sharedLinks: SharedLink[] = [...links.filter(l => chatKey(l.conversation, groups) === key && !preference.hiddenLinks?.includes(String(l.id))), ...currentMessages.flatMap(m => (m.text.match(/https?:\/\/[^\s<>]+/g) || []).flatMap((url, index) => { const safe = safePortfolio(url.replace(/[).,!?;]+$/, "")); return safe ? [{ id: `message-${m.id}-${index}`, url: safe, title: safe }] : []; }))].filter((l, index, all) => all.findIndex(other => other.url === l.url) === index);
  useEffect(() => { roomLog.current?.scrollTo({ top: roomLog.current.scrollHeight, behavior: "smooth" }); }, [key, currentMessages.length]);
  useEffect(() => { if (!menuOpen) return; const outside = (e: MouseEvent) => { if (!menu.current?.contains(e.target as Node)) setMenuOpen(false); }, escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenuOpen(false); menuTrigger.current?.focus(); } }; document.addEventListener("mousedown", outside); document.addEventListener("keydown", escape); return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); }; }, [menuOpen]);
  function navigate(path: string) { setText(""); setAttachments([]); setMessageQuery(""); setShowSearch(false); setShowInfo(false); setMenuOpen(false); setModal(null); setMedia(null); onNavigate(path); }
  function updatePreference(next: Partial<ChatPreference>) { setPreferences(current => ({ ...current, [prefKey]: { ...current[prefKey], ...next } })); setMenuOpen(false); }
  function join() { if (!currentGroup || joined) return; setGroups(current => current.map(g => g.id === currentGroup.id ? { ...g, joined: true, members: [...(g.members || []), { id: profile.id, name: profile.name, country: profile.country, photo: profile.photo }] } : g)); onNotice(t("Tu as rejoint le groupe.", "You joined the group.")); }
  function send() { if ((!text.trim() && !attachments.length) || !canWrite || uploading) return; setMessages(current => [...current, { id: Date.now(), conversation: key, text: text.trim(), attachments, sentAt: new Date().toISOString(), author: profile.name, authorId: profile.id, mine: true }]); setText(""); setAttachments([]); setEmoji(false); }
  function removeMember(member: GroupMember) { if (!admin || !currentGroup || member.id === currentGroup.adminId) return; setGroups(current => current.map(g => g.id === currentGroup.id ? { ...g, members: (g.members || []).filter(m => m.id !== member.id) } : g)); setNotifications(current => [notification({ id: `group-removed:${currentGroup.id}:${member.id}:${Date.now()}`, recipientId: member.id, title: "Participation au groupe modifiée", text: `Tu as été retiré du groupe ${currentGroup.name}.`, textEn: `You were removed from ${currentGroup.name}.`, target: "messages/groupes", kind: "group" }), ...current]); onNotice(t("Membre retiré du groupe.", "Member removed from the group.")); }
  function deleteGroup() { if (!currentGroup) return; const result = deleteGroupResult(currentGroup, profile.id); if (!result) return; setGroups(current => current.map(g => g.id === result.group.id ? result.group : g)); setNotifications(current => [...result.notifications, ...current]); onNotice(t("Groupe supprimé. Les membres ont été informés.", "Group deleted. Members have been notified.")); navigate("messages/groupes"); }

  const info = <aside className={`message-details ${showInfo ? "open" : ""}`}>
    <button
      className="details-close quiet"
      aria-label={t("Fermer les informations", "Close details")}
      onClick={() => setShowInfo(false)}>
      <X size={20} />
    </button>
    <div className="contact-detail-card">
      <div
        className="contact-art"
        aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="contact-large-avatar">
        <ChatAvatar
          name={title}
          photo={currentGroup?.photo}
          group={!!currentGroup} />
      </div>
      <h3>
        {title}
      </h3>
      <small>
        {currentGroup ? `${t("Groupe", "Group")} · ${currentGroup.members?.length || 0} ${t("membres", "members")}` : t("Conversation privée", "Private conversation")}
      </small>
      <p>
        {currentGroup?.description || t("Un espace pour échanger et construire ensemble.", "A space to share and build together.")}
      </p>
      {admin && <div className="group-admin-tools">
        <span>
          <ShieldCheck size={14} />
          {t("Tu administres ce groupe", "You manage this group")}
        </span>
        <AttachmentPicker
          label={t("Changer la photo du groupe", "Change group photo")}
          accept="image/*"
          onAdd={selected => { if (!selected[0]?.type.startsWith("image/")) { onNotice(t("Choisis une image pour la photo du groupe.", "Choose an image for the group photo.")); return; } if (admin && currentGroup) setGroups(current => current.map(g => g.id === currentGroup.id ? { ...g, photo: selected[0] } : g)); }} />
        <button
          className="details-edit"
          onClick={() => setModal("description")}>
          <Pencil size={14} />
          {t("Modifier la description", "Edit description")}
        </button>
      </div>}
    </div>
    {currentGroup && <div className="details-section">
      <div className="row">
        <h3>{t("Participants", "Participants")} ({currentGroup.members?.length || 0})</h3>
        <button
          className="quiet"
          onClick={() => setModal("members")}
          aria-label={admin ? t("Gérer les membres", "Manage members") : t("Voir les membres", "View members")}>
          {admin ? <UserPlus size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <div className="member-avatars">
        {currentGroup.members?.slice(0, 5).map(member => <span
          className="avatar"
          key={member.id}
          title={member.name}>
          {member.name.slice(0, 2)}
        </span>)}
      </div>
    </div>}
    <div className="details-section shared-content-summary">
      <h3>
        {t("Éléments partagés", "Shared items")}
      </h3>
      <button onClick={() => setMedia("photos")}>
        <Images size={19} />
        {t("Photos", "Photos")}
        <span>
          {photos.length}
        </span>
        <ChevronRight size={15} />
      </button>
      <button onClick={() => setMedia("files")}>
        <FileText size={19} />
        {t("Fichiers récents", "Recent files")}
        <span>
          {documents.length}
        </span>
        <ChevronRight size={15} />
      </button>
      <button onClick={() => setMedia("links")}>
        <Link2 size={19} />
        {t("Liens utiles", "Useful links")}
        <span>
          {sharedLinks.length}
        </span>
        <ChevronRight size={15} />
      </button>
    </div>
    <div className="details-section">
      <button
        className="details-edit"
        onClick={() => setModal("link")}>
        <Plus size={15} />
        {t("Ajouter un lien utile", "Add a useful link")}
      </button>
      {admin ? <button
        className="details-delete-group"
        onClick={() => setModal("delete-group")}>
        <Trash2 size={15} />
        {t("Supprimer le groupe", "Delete group")}
      </button> : currentGroup && joined ? <button
        className="details-leave"
        onClick={() => { setGroups(current => current.map(g => g.id === currentGroup.id ? { ...g, joined: false, members: g.members?.filter(m => m.id !== profile.id) } : g)); navigate("messages/groupes"); }}>
        {t("Quitter le groupe", "Leave group")}
      </button> : null}
    </div>
  </aside>;
  return <section className="messaging-app">
    <aside className="message-directory">
      <div className="message-directory-top">
        <h2>
          {t("Conversations", "Conversations")}
        </h2>
        <button
          aria-label={t("Créer un groupe", "Create a group")}
          onClick={() => setModal("create")}>
          <Plus size={21} />
        </button>
      </div>
      <div
        className="conversation-kind"
        role="group"
        aria-label={t("Type de conversation", "Conversation type")}>
        {([['all', MessageCircle, t("Toutes", "All")], ['private', Info, t("Privés", "Private")], ['groups', UsersRound, t("Groupes", "Groups")]] as const).map(([value, Icon, label]) => <button
          key={value}
          className={visibleFilter === value ? "active" : ""}
          aria-pressed={visibleFilter === value}
          onClick={() => { setFilter(value); if (route[0] === "groupes" || route[0] === "prives") navigate(value === "groups" ? "messages/groupes" : value === "private" ? "messages/prives" : "messages"); }}>
          <Icon size={15} />
          {label}
        </button>)}
      </div>
      <label className="directory-search">
        <Search size={17} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t("Rechercher une conversation…", "Search conversations…")}
          aria-label={t("Rechercher une conversation", "Search conversations")} />
      </label>
      <div className="message-threads">
        {conversations.map(c => {
          const state = preferences[`${profile.id}|${c.key}`] || {}, last = messages.filter(m => chatKey(m.conversation, groups) === c.key && !state.hiddenMessages?.includes(m.id)).at(-1); return <button
            key={c.id}
            className={c.key === key ? "active" : ""}
            onClick={() => navigate(c.path)}>
            <ChatAvatar
              name={c.title}
              photo={c.group?.photo}
              group={!!c.group} />
            <span>
              <strong>
                {c.title}
                {state.muted && <BellOff size={12} />}
              </strong>
              <small>
                {last?.text || (last?.attachments?.length ? t("Pièce jointe", "Attachment") : c.group?.description || t("Démarrer la discussion", "Start a conversation"))}
              </small>
            </span>
            {c.group && !c.group.members?.some(m => m.id === profile.id) && <Plus size={14} />}
          </button>;
        })}
        {!conversations.length && <p className="directory-empty">
          {t("Aucune conversation correspondante.", "No matching conversations.")}
        </p>}
      </div>
    </aside>
    <section className="message-room">
      {unavailable ? <div className="message-empty">
        <h3>
          {t("Ce groupe n’est plus disponible.", "This group is no longer available.")}
        </h3>
        <button
          className="btn-primary"
          onClick={() => navigate("messages/groupes")}>
          {t("Voir les groupes", "View groups")}
        </button>
      </div> : <>
        <header className="message-room-header">
          <button
            className="conversation-person"
            onClick={() => setShowInfo(!showInfo)}
            aria-label={t("Informations de la conversation", "Conversation details")}>
            <ChatAvatar
              name={title}
              photo={currentGroup?.photo}
              group={!!currentGroup} />
            <span>
              <h2>
                {title}
              </h2>
              <small>
                <span className="status-dot" />
                {currentGroup ? t("Discussion de groupe", "Group chat") : t("Message privé", "Private message")}
                {preference.muted && <BellOff size={12} />}
              </small>
            </span>
          </button>
          <div className="room-tools">
            <button
              aria-label={t("Rechercher dans les messages", "Search within messages")}
              onClick={() => setShowSearch(!showSearch)}>
              <Search size={19} />
            </button>
            <button
              aria-label={t("Ouvrir les médias partagés", "Open shared media")}
              onClick={() => setMedia("photos")}>
              <Images size={19} />
            </button>
            <div
              className="conversation-menu"
              ref={menu}>
              <button
                ref={menuTrigger}
                aria-label={t("Options de la discussion", "Conversation options")}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen(!menuOpen)}>
                <MoreHorizontal size={23} />
              </button>
              {menuOpen && <div
                role="menu"
                className="conversation-menu-list">
                <button
                  role="menuitem"
                  onClick={() => { updatePreference({ muted: !preference.muted }); onNotice(preference.muted ? t("Notifications réactivées.", "Notifications enabled.") : t("Discussion mise en sourdine.", "Conversation muted.")); }}>
                  <BellOff size={17} />
                  {preference.muted ? t("Réactiver le son", "Unmute") : t("Sourdine", "Mute")}
                </button>
                <button
                  role="menuitem"
                  onClick={() => { updatePreference({ blocked: !preference.blocked }); onNotice(preference.blocked ? t("Discussion débloquée.", "Conversation unblocked.") : t("Discussion bloquée.", "Conversation blocked.")); }}>
                  <Slash size={17} />
                  {preference.blocked ? t("Débloquer", "Unblock") : t("Bloquer", "Block")}
                </button>
                <button
                  role="menuitem"
                  className="danger"
                  onClick={() => { setMenuOpen(false); setModal("clear"); }}>
                  <Trash2 size={17} />
                  {t("Effacer la discussion", "Clear conversation")}
                </button>
                <button
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); setShowInfo(true); }}>
                  <Info size={17} />
                  {t("Informations", "Details")}
                </button>
              </div>}
            </div>
          </div>
        </header>
        {showSearch && <label className="room-search">
          <Search size={17} />
          <input
            autoFocus
            value={messageQuery}
            onChange={e => setMessageQuery(e.target.value)}
            aria-label={t("Chercher un message", "Find a message")} />
          <button
            className="quiet"
            onClick={() => { setShowSearch(false); setMessageQuery(""); }}
            aria-label={t("Fermer la recherche", "Close search")}>
            <X size={16} />
          </button>
        </label>}
        <div
          className="room-log"
          ref={roomLog}
          role="log"
          aria-label={t("Messages de la discussion", "Conversation messages")}>
          {displayMessages.map(message => {
            const mine = message.authorId ? message.authorId === profile.id : message.mine !== false; return <article
              className={`message-entry ${mine ? "mine" : "other"}`}
              key={message.id}>
              <div className="message-content">
                <div className="message-byline">
                  <strong>
                    {mine ? t("Toi", "You") : message.author || title}
                  </strong>
                  {message.sentAt && <time dateTime={message.sentAt}>
                    {new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(message.sentAt))}
                  </time>}
                </div>
                <div className="message-balloon">
                  {message.text && <p>
                    {message.text}
                  </p>}
                  {message.attachments?.map(file => <AttachmentCard
                    key={file.id}
                    file={file} />)}
                  {message.file && !message.attachments?.length && <p className="legacy-chat-file">
                    <FileText size={19} />
                    {message.file}
                    <small>
                      {t("Ancien fichier : seul son nom a été conservé.", "Legacy file: only its name was saved.")}
                    </small>
                  </p>}
                  {mine && <Check
                    size={13}
                    className="local-message-check" />}
                </div>
              </div>
            </article>;
          })}
          {!displayMessages.length && <div className="message-empty">
            <MessageCircle size={29} />
            <p>
              {t("La discussion commence ici.", "The conversation starts here.")}
            </p>
          </div>}
        </div>
        {preference.blocked ? <div className="chat-blocked">
          <Slash size={18} />
          <p>
            {t("Tu as bloqué cette discussion.", "You blocked this conversation.")}
          </p>
          <button
            className="btn-outline"
            onClick={() => updatePreference({ blocked: false })}>
            {t("Débloquer", "Unblock")}
          </button>
        </div> : currentGroup && !joined ? <div className="join-conversation">
          <p>
            {t("Rejoins le groupe pour participer.", "Join the group to take part.")}
          </p>
          <button
            className="btn-primary"
            onClick={join}>
            {t("Rejoindre le groupe", "Join group")}
          </button>
        </div> : <form
          className="room-composer"
          onSubmit={e => { e.preventDefault(); send(); }}>
          {attachments.length > 0 && <div className="chat-draft-files">
            {attachments.map(file => <AttachmentCard
              key={file.id}
              preview={false}
              file={file}
              onRemove={() => setAttachments(current => current.filter(f => f.id !== file.id))} />)}
          </div>}
          {emoji && <div className="emoji-choices">
            {["👋", "✨", "🚀", "👍", "😊", "💻"].map(symbol => <button
              type="button"
              key={symbol}
              onClick={() => { setText(value => value + symbol); setEmoji(false); }}>
              {symbol}
            </button>)}
          </div>}
          <div className="room-composer-row">
            <AttachmentPicker
              key={key}
              label={t("Joindre un fichier", "Attach a file")}
              multiple
              onBusy={busy => setUploadCount(n => Math.max(0, n + (busy ? 1 : -1)))}
              onAdd={selected => setAttachments(current => [...current, ...selected].slice(0, 5))} />
            <button
              type="button"
              className="room-emoji"
              aria-label={t("Ajouter un emoji", "Add an emoji")}
              onClick={() => setEmoji(!emoji)}>
              <Smile size={20} />
            </button>
            <input
              value={text}
              maxLength={10000}
              onChange={e => setText(e.target.value)}
              placeholder={t("Écrire un message…", "Write a message…")}
              aria-label={t("Écrire un message", "Write a message")} />
            <button
              type="submit"
              className="send-message"
              disabled={uploading || (!text.trim() && !attachments.length)}
              aria-label={t("Envoyer le message", "Send message")}>
              <Send size={21} />
            </button>
          </div>
        </form>}
      </>}
    </section>
    {!unavailable && info}
    {media && <ConversationMedia
      title={title}
      files={files}
      links={sharedLinks}
      initialTab={media}
      onClose={() => setMedia(null)} />}
    {modal === "clear" && <Modal
      title={t("Effacer la discussion ?", "Clear the conversation?")}
      onClose={() => setModal(null)}>
      <p>
        {t("L’historique sera masqué pour toi. Les autres participants conservent leur copie.", "The history will be hidden for you. Other participants keep their copy.")}
      </p>
      <div className="modal-actions">
        <button
          className="btn-outline"
          onClick={() => setModal(null)}>
          {t("Annuler", "Cancel")}
        </button>
        <button
          className="btn-primary"
          onClick={() => { updatePreference({ hiddenMessages: allCurrent.map(m => m.id), hiddenLinks: links.filter(l => chatKey(l.conversation, groups) === key).map(l => String(l.id)) }); setModal(null); onNotice(t("Discussion effacée de ton historique.", "Conversation cleared from your history.")); }}>
          {t("Effacer", "Clear")}
        </button>
      </div>
    </Modal>}
    {modal === "delete-group" && admin && <Modal
      title={t("Supprimer le groupe ?", "Delete the group?")}
      onClose={() => setModal(null)}>
      <p>
        {t("Le groupe ne sera plus accessible. Tous ses membres recevront une notification.", "The group will no longer be accessible. All its members will receive a notification.")}
      </p>
      <div className="modal-actions">
        <button
          className="btn-outline"
          onClick={() => setModal(null)}>
          {t("Annuler", "Cancel")}
        </button>
        <button
          className="btn-primary"
          onClick={deleteGroup}>
          <Trash2 size={17} />
          {t("Supprimer le groupe", "Delete group")}
        </button>
      </div>
    </Modal>}
    {modal === "members" && currentGroup && <Modal
      title={admin ? t("Gérer les membres", "Manage members") : t("Membres du groupe", "Group members")}
      onClose={() => setModal(null)}>
      <div className="group-member-list">
        {currentGroup.members?.map(member => <article key={member.id}>
          <button
            className="member-profile"
            onClick={() => navigate(member.id === profile.id ? "profil" : `profil/membre/${encodeURIComponent(member.id)}`)}>
            <span className="avatar">
              {member.name.slice(0, 2)}
            </span>
            <span>
              <strong>
                {member.name}
              </strong>
              <CountryFlag country={member.country} />
            </span>
          </button>
          {member.id === currentGroup.adminId ? <span className="admin-badge">
            <ShieldCheck size={13} />
            {t("Administrateur", "Administrator")}
          </span> : admin && <button
            className="quiet"
            aria-label={`${t("Retirer le membre", "Remove member")} ${member.name}`}
            onClick={() => removeMember(member)}>
            <UserMinus size={17} />
          </button>}
        </article>)}
      </div>
      {admin && <section className="add-group-members">
        <h3>
          {t("Ajouter des membres", "Add members")}
        </h3>
        <input
          placeholder={t("Rechercher un membre…", "Search members…")}
          value={memberQuery}
          onChange={e => setMemberQuery(e.target.value)}
          aria-label={t("Rechercher un membre", "Search members")} />
        {registry.filter(person => !currentGroup.members?.some(member => member.id === person.id) && normalizeText(person.name).includes(normalizeText(memberQuery))).map(person => <button
          key={person.id}
          onClick={() => { if (!admin) return; setGroups(current => current.map(g => g.id === currentGroup.id ? { ...g, members: [...(g.members || []), { id: person.id, name: person.name, country: person.country, photo: person.photo }] } : g)); onNotice(t("Membre ajouté au groupe.", "Member added to the group.")); }}>
          <UserPlus size={17} />
          {person.name}
          <CountryFlag country={person.country} />
        </button>)}
      </section>}
    </Modal>}
    {(modal === "create" || modal === "description" || modal === "link") && <Modal
      title={modal === "create" ? t("Créer un groupe", "Create a group") : modal === "description" ? t("Modifier la description", "Edit description") : t("Ajouter un lien utile", "Add a useful link")}
      onClose={() => setModal(null)}>
      <form
        className="chat-settings-form"
        onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget), value = (name: string) => String(data.get(name) || "").trim(); if (modal === "create") { if (!value("name") || !value("description")) return; const id = Date.now(); setGroups(current => [...current, { id, name: value("name"), description: value("description"), adminId: profile.id, members: [{ id: profile.id, name: profile.name, country: profile.country, photo: profile.photo }], joined: true }]); navigate(`messages/groupe/${id}`); onNotice(t("Groupe créé. Tu peux inviter tes premiers membres.", "Group created. You can add your first members.")); } else if (modal === "description") { if (!admin || !currentGroup) return; setGroups(current => current.map(g => g.id === currentGroup.id ? { ...g, description: value("description") } : g)); setModal(null); onNotice(t("Description mise à jour.", "Description updated.")); } else { const url = safePortfolio(value("url")); if (!url) { onNotice(t("Indique un lien HTTP(S) valide.", "Enter a valid HTTP(S) link.")); return; } setLinks(current => [...current, { id: Date.now(), conversation: key, title: value("title") || url, url }]); setModal(null); onNotice(t("Lien ajouté.", "Link added.")); } }}>
        {modal === "create" && <label>
          {t("Nom du groupe", "Group name")}
          <input
            name="name"
            required
            maxLength={80} />
        </label>}
        {modal !== "link" ? <label>
          {t("Description", "Description")}
          <textarea
            name="description"
            required
            maxLength={1000}
            defaultValue={modal === "description" ? currentGroup?.description : ""} />
        </label> : <>
          <label>
            {t("Titre du lien", "Link title")}
            <input
              name="title"
              maxLength={120} />
          </label>
          <label>
            {t("Adresse du lien", "Link address")}
            <input
              type="url"
              name="url"
              required
              placeholder="https://…" />
          </label>
        </>}
        <button className="btn-primary">
          {modal === "create" ? t("Créer le groupe", "Create group") : t("Enregistrer", "Save")}
        </button>
      </form>
    </Modal>}
  </section>;
}
