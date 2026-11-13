import { useEffect, useRef, useState } from "react";
import { BellOff, Check, ChevronRight, FileText, Flag, Images, Info, Link2, MessageCircle, MoreHorizontal, Pencil, Plus, Search, ShieldCheck, Slash, Trash2, UserMinus, UserPlus, UsersRound, X } from "lucide-react";
import { useLocalData } from "../../lib/storage";
import { normalizeText, type Profile } from "../../data/models";
import { type ChatPreference } from "../../data/chat";
import { usePeople } from "../../data/people";
import { useI18n } from "../../i18n/context";
import { safePortfolio } from "../../lib/urls";
import { useAttachmentUrl, type StoredAttachment, readAttachment } from "../../lib/attachments";
import { AttachmentCard, AttachmentPicker } from "../shared/Attachments";
import ConversationMedia, { type SharedLink } from "./ConversationMedia";
import Modal from "../Modal";
import MessageComposer from "./MessageComposer";
import { ReportModal } from "../shared/ReportModal";
import { useConversations, useConversationMessages, useGroupes, useGroupeMembres, useGroupeMessages, useInvitations } from "../../hooks/useMessaging";
import { messagingApi, groupsApi } from "../../api/messaging";
import { blocageApi } from "../../api/auth";
import { moderationApi } from "../../api/moderation";
type UsefulLink = SharedLink & { conversation: string };
function ChatAvatar({ name, photo, photoUrl, group = false }: { name: string; photo?: StoredAttachment; photoUrl?: string | null; group?: boolean }) {
  const localPhotoUrl = useAttachmentUrl(photo)
  const url = photoUrl || localPhotoUrl
  
  // Ajouter un timestamp pour éviter le cache des images
  const imageUrl = url && url.startsWith('http') ? `${url}?t=${Date.now()}` : url
  
  return <span className="avatar">
    {imageUrl ? <img src={imageUrl} alt="" /> : group ? <UsersRound size={23} /> : name.split(" ").map(n => n[0]).slice(0, 2).join("")}
  </span>
}
export default function Messages({ route, profile, onNavigate, onNotice }: { route: string[]; profile: Profile; onNavigate: (path: string) => void; onNotice: (text: string) => void }) {
  const { t, locale } = useI18n()
  
  // ─── Backend Data ─────────────────────────────────────────────────────────
  const { conversations: backendConversations, reload: reloadConversations } = useConversations()
  const { groupes: backendGroupes, reload: reloadGroupes } = useGroupes()
  const { invitations, reload: reloadInvitations } = useInvitations()
  
  // Déterminer l'email ou le groupe ID actuel
  const isPrivateRoute = route[0] === "prive"
  let currentEmail: string | null = null
  let currentGroupId: string | null = null
  
  if (isPrivateRoute && route[1]) {
    try {
      currentEmail = decodeURIComponent(route[1])
    } catch {
      currentEmail = null
    }
  } else if (route[0] === "groupe" && route[1]) {
    currentGroupId = route[1]
  }
  
  // Messages selon le contexte
  const { messages: privateMessages, reload: reloadPrivateMessages } = useConversationMessages(currentEmail)
  const { messages: groupMessages, reload: reloadGroupMessages } = useGroupeMessages(currentGroupId)
  const { membres: groupMembers, reload: reloadGroupMembers } = useGroupeMembres(currentGroupId)
  
  // ─── Local State ──────────────────────────────────────────────────────────
  const [preferences, setPreferences] = useLocalData<Record<string, ChatPreference>>("chat-preferences", {})
  const [links, setLinks] = useLocalData<UsefulLink[]>("chat-links", [])
  const [registry] = usePeople()
  
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [messageQuery, setMessageQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [memberQuery, setMemberQuery] = useState("")
  const [sending, setSending] = useState(false)
  
  const [modal, setModal] = useState<"create" | "edit-name" | "link" | "members" | "clear" | "delete-group" | "invitations" | null>(null)
  const [media, setMedia] = useState<"photos" | "files" | "links" | null>(null)
  const [reportTarget, setReportTarget] = useState<{ type: 'dev' | 'groupe'; id: string; name?: string } | null>(null)
  const [photoRefreshKey, setPhotoRefreshKey] = useState(Date.now())
  
  const menu = useRef<HTMLDivElement>(null)
  const roomLog = useRef<HTMLDivElement>(null)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  
  // ─── Derived State ────────────────────────────────────────────────────────
  const currentGroup = currentGroupId ? backendGroupes.find(g => g.id_group === currentGroupId) : undefined
  const unavailable = route[0] === "groupe" && !currentGroup
  const key = currentGroup ? `group:${currentGroup.id_group}` : currentEmail || ""
  const title = currentGroup?.nom || currentEmail || ""
  const prefKey = `${profile.id}|${key}`
  const preference = preferences[prefKey] || {}
  
  // Admin si c'est un groupe et qu'on est dans les membres avec type 'A'
  const admin = currentGroup ? groupMembers.some(m => m.dev_email === profile.email && m.type === 'A') : false
  const joined = currentGroup ? groupMembers.some(m => m.dev_email === profile.email) : true
  const canWrite = (!currentGroup || joined) && !preference.blocked && !unavailable
  
  const visibleFilter = route[0] === "groupes" ? "groups" : route[0] === "prives" ? "private" : filter
  
  // Construire la liste des conversations (privées + groupes)
  const conversations = [
    ...backendGroupes.map(groupe => ({
      id: `group:${groupe.id_group}`,
      title: groupe.nom,
      group: groupe,
      key: `group:${groupe.id_group}`,
      path: `messages/groupe/${groupe.id_group}`,
      photo: groupe.photo
    })),
    ...backendConversations.map((conv, idx) => ({
      id: conv.email || `conv-${idx}`,
      title: conv.pseudo || 'Utilisateur',
      group: undefined,
      key: conv.email || `conv-${idx}`,
      path: `messages/prive/${encodeURIComponent(conv.email)}`,
      photo: conv.photoprofil,
      dernierMessage: conv.dernierMessage,
      nonLus: conv.nonLus
    }))
  ].filter(c => 
    (visibleFilter === "all" || (visibleFilter === "groups" ? !!c.group : !c.group)) && 
    normalizeText(c.title).includes(normalizeText(query))
  )
  
  // Messages actuels
  const backendMessages = currentGroup ? groupMessages : privateMessages
  const currentMessages = backendMessages.filter(m => !preference.hiddenMessages?.includes(Number(m.id_message)))
  
  // Adapter les messages backend au format frontend
  const displayMessages = currentMessages
    .filter(m => {
      const content = m.contenu || ""
      const fichiers = m.fichiers?.map(f => f.fichier).join(" ") || ""
      return normalizeText(`${content} ${fichiers}`).includes(normalizeText(messageQuery))
    })
    .map((m, idx) => ({
      id: m.id_message && !isNaN(Number(m.id_message)) ? Number(m.id_message) : `temp-${Date.now()}-${idx}`,
      text: m.contenu || (m.supprime ? t("[Message supprimé]", "[Message deleted]") : ""),
      sentAt: m.date_envoie,
      author: m.envoyeur_pseudo,
      authorId: m.envoyeur_email,
      mine: m.envoyeur_email === profile.email,
      attachments: m.fichiers?.map((f, fidx) => {
        // Construire l'URL complète du fichier
        const fileUrl = f.fichier.startsWith('http') 
          ? f.fichier 
          : `http://localhost:8000${f.fichier.startsWith('/') ? '' : '/'}${f.fichier}`
        
        return {
          id: f.id_fichier || `temp-file-${idx}-${fidx}`,
          name: f.fichier.split('/').pop() || f.fichier,
          type: "application/octet-stream",
          size: Number(f.taille) * 1024 * 1024,
          url: fileUrl
        }
      }) || []
    }))
  
  const files = displayMessages.flatMap(m => m.attachments || [])
  const photos = files.filter(f => f.type.startsWith("image/"))
  const documents = files.filter(f => !f.type.startsWith("image/"))
  
  const sharedLinks: SharedLink[] = [
    ...links.filter(l => l.conversation === key && !preference.hiddenLinks?.includes(String(l.id))),
    ...displayMessages.flatMap(m => 
      (m.text.match(/https?:\/\/[^\s<>]+/g) || []).flatMap((url, index) => {
        const safe = safePortfolio(url.replace(/[).,!?;]+$/, ""))
        return safe ? [{ id: `message-${m.id}-${index}`, url: safe, title: safe }] : []
      })
    )
  ].filter((l, index, all) => all.findIndex(other => other.url === l.url) === index)
  // ─── Effects ──────────────────────────────────────────────────────────────
  
  // Scroll to bottom on new messages
  useEffect(() => { 
    roomLog.current?.scrollTo({ top: roomLog.current.scrollHeight, behavior: "smooth" }) 
  }, [key, displayMessages.length])
  
  // Close menu on click outside
  useEffect(() => { 
    if (!menuOpen) return
    const outside = (e: MouseEvent) => { 
      if (!menu.current?.contains(e.target as Node)) setMenuOpen(false) 
    }
    const escape = (e: KeyboardEvent) => { 
      if (e.key === "Escape") { 
        setMenuOpen(false)
        menuTrigger.current?.focus() 
      } 
    }
    document.addEventListener("mousedown", outside)
    document.addEventListener("keydown", escape)
    return () => { 
      document.removeEventListener("mousedown", outside)
      document.removeEventListener("keydown", escape) 
    }
  }, [menuOpen])
  
  // Polling pour nouveaux messages toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      // Recharger les conversations pour mettre à jour les compteurs de messages non lus
      reloadConversations()
      
      // Recharger les messages de la conversation actuelle
      if (currentEmail) {
        reloadPrivateMessages()
      } else if (currentGroupId) {
        reloadGroupMessages()
      }
    }, 10000) // 10 secondes
    
    return () => clearInterval(interval)
  }, [currentEmail, currentGroupId, reloadConversations, reloadPrivateMessages, reloadGroupMessages])
  
  // ─── Functions ────────────────────────────────────────────────────────────
  
  function navigate(path: string) { 
    setMessageQuery("")
    setShowSearch(false)
    setShowInfo(false)
    setMenuOpen(false)
    setModal(null)
    setMedia(null)
    onNavigate(path)
  }
  
  function updatePreference(next: Partial<ChatPreference>) { 
    setPreferences(current => ({ 
      ...current, 
      [prefKey]: { ...current[prefKey], ...next } 
    }))
    setMenuOpen(false)
  }
  
  async function handleBlockToggle() {
    if (!currentEmail) return
    
    try {
      if (preference.blocked) {
        await blocageApi.debloquer(currentEmail)
        updatePreference({ blocked: false })
        onNotice(t("Discussion débloquée.", "Conversation unblocked."))
      } else {
        await blocageApi.bloquer(currentEmail)
        updatePreference({ blocked: true })
        onNotice(t("Discussion bloquée.", "Conversation blocked."))
      }
    } catch (err: any) {
      console.error('Erreur blocage:', err)
      onNotice(t("Erreur lors du blocage.", "Error blocking."))
    }
  }
  
  async function handleMuteToggle() {
    if (!currentEmail && !currentGroupId) return
    
    try {
      if (preference.muted) {
        await blocageApi.retirerSourdine(
          currentEmail ? { email: currentEmail } : { id_group: currentGroupId! }
        )
        updatePreference({ muted: false })
        onNotice(t("Notifications réactivées.", "Notifications enabled."))
      } else {
        await blocageApi.mettreEnSourdine(
          currentEmail ? { email: currentEmail } : { id_group: currentGroupId! }
        )
        updatePreference({ muted: true })
        onNotice(t("Discussion mise en sourdine.", "Conversation muted."))
      }
    } catch (err: any) {
      console.error('Erreur sourdine:', err)
      onNotice(t("Erreur lors de la mise en sourdine.", "Error muting."))
    }
  }
  
  async function handleDeleteConversation() {
    if (!currentEmail) return
    
    try {
      await messagingApi.supprimerConversation(currentEmail)
      reloadConversations()
      navigate("messages")
      onNotice(t("Conversation supprimée.", "Conversation deleted."))
    } catch (err: any) {
      console.error('Erreur suppression:', err)
      onNotice(t("Erreur lors de la suppression.", "Error deleting."))
    }
  }
  
  async function send(text: string, attachments: StoredAttachment[]) { 
    if ((!text.trim() && !attachments.length) || !canWrite || sending) return
    
    setSending(true)
    
    try {
      if (currentGroup) {
        // Envoyer dans un groupe
        if (attachments.length > 0) {
          // Envoyer chaque fichier séparément
          for (const [attachmentIndex, attachment] of attachments.entries()) {
            // Récupérer le blob depuis IndexedDB
            const blob = await readAttachment(attachment.id)
            if (!blob) {
              console.error('Impossible de récupérer le fichier:', attachment.name)
              continue
            }
            
            // Créer un File à partir du Blob
            const file = new File([blob], attachment.name, { type: attachment.type })
            const formData = new FormData()
            
            // Déterminer si c'est un audio ou un fichier
            const isAudio = attachment.type.startsWith('audio/')
            
            if (isAudio) {
              formData.append('audio', file)
              if (attachmentIndex === 0 && text.trim()) {
                formData.append('contenu', text.trim())
              }
              await groupsApi.envoyerAudioGroupe(currentGroup.id_group, formData)
            } else {
              formData.append('fichier', file)
              if (attachmentIndex === 0 && text.trim()) {
                formData.append('contenu', text.trim())
              }
              await groupsApi.envoyerFichierGroupe(currentGroup.id_group, formData)
            }
          }
        } else if (text.trim()) {
          // Message texte uniquement
          await groupsApi.envoyerMessageGroupe(currentGroup.id_group, {
            contenu: text.trim()
          })
        }
        reloadGroupMessages()
      } else if (currentEmail) {
        // Envoyer message privé
        if (attachments.length > 0) {
          // Envoyer chaque fichier séparément
          for (const [attachmentIndex, attachment] of attachments.entries()) {
            // Récupérer le blob depuis IndexedDB
            const blob = await readAttachment(attachment.id)
            if (!blob) {
              console.error('Impossible de récupérer le fichier:', attachment.name)
              continue
            }
            
            // Créer un File à partir du Blob
            const file = new File([blob], attachment.name, { type: attachment.type })
            const formData = new FormData()
            formData.append('destinataire', currentEmail)
            
            // Déterminer si c'est un audio ou un fichier
            const isAudio = attachment.type.startsWith('audio/')
            
            if (isAudio) {
              formData.append('audio', file)
              if (attachmentIndex === 0 && text.trim()) {
                formData.append('contenu', text.trim())
              }
              await messagingApi.envoyerAudio(formData)
            } else {
              formData.append('fichier', file)
              if (attachmentIndex === 0 && text.trim()) {
                formData.append('contenu', text.trim())
              }
              await messagingApi.envoyerFichier(formData)
            }
          }
        } else if (text.trim()) {
          // Message texte uniquement
          await messagingApi.envoyerMessage({
            destinataire: currentEmail,
            contenu: text.trim()
          })
        }
        reloadPrivateMessages()
      }
      
        } catch (err: any) {
      console.error('Erreur envoi message:', err)
      
      // Gestion spécifique pour les erreurs 403 (blocage)
      if (err.response?.status === 403) {
        onNotice(t(
          "Vous ne pouvez pas envoyer de message à cet utilisateur. Vous avez peut-être été bloqué.",
          "You cannot send a message to this user. You may have been blocked."
        ))
      } else {
        onNotice(t("Erreur lors de l'envoi du message.", "Error sending message."))
      }
    } finally {
      setSending(false)
    }
  }
  
  async function join() { 
    if (!currentGroup || joined) return
    
    // Note: Dans le nouveau système, on ne "rejoint" pas directement
    // On doit être invité et accepter l'invitation
    onNotice(t("Tu dois être invité pour rejoindre ce groupe.", "You must be invited to join this group."))
  }
  
  async function removeMember(member: any) { 
    if (!admin || !currentGroup) return
    
    try {
      await groupsApi.retirerMembre(currentGroup.id_group, member.dev_email)
      reloadGroupMembers()
      onNotice(t("Membre retiré du groupe.", "Member removed from the group."))
    } catch (err: any) {
      console.error('Erreur retrait membre:', err)
      onNotice(t("Erreur lors du retrait du membre.", "Error removing member."))
    }
  }
  
  async function deleteGroup() { 
    if (!currentGroup || !admin) return
    
    try {
      await groupsApi.supprimerGroupe(currentGroup.id_group, t("Supprimé par l'administrateur", "Deleted by admin"))
      reloadGroupes()
      navigate("messages/groupes")
      onNotice(t("Groupe supprimé. Les membres ont été informés.", "Group deleted. Members have been notified."))
    } catch (err: any) {
      console.error('Erreur suppression groupe:', err)
      onNotice(t("Erreur lors de la suppression du groupe.", "Error deleting group."))
    }
  }

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
          key={`avatar-details-${photoRefreshKey}`}
          name={title}
          photoUrl={currentGroup?.photo}
          group={!!currentGroup} />
      </div>
      <h3>
        {title}
      </h3>
      <small>
        {currentGroup ? `${t("Groupe", "Group")} · ${groupMembers.length} ${t("membres", "members")}` : t("Conversation privée", "Private conversation")}
      </small>
      <p>
        {currentGroup?.motif_creation || t("Un espace pour échanger et construire ensemble.", "A space to share and build together.")}
      </p>
      {admin && <div className="group-admin-tools">
        <span>
          <ShieldCheck size={14} />
          {t("Tu administres ce groupe", "You manage this group")}
        </span>
        <AttachmentPicker
          label={t("Changer la photo du groupe", "Change group photo")}
          accept="image/*"
          onAdd={async selected => { 
            if (!selected[0]?.type.startsWith("image/")) { 
              onNotice(t("Choisis une image pour la photo du groupe.", "Choose an image for the group photo."))
              return
            }
            if (admin && currentGroup) {
              try {
                console.log('[PHOTO] Selected:', selected[0])
                
                // Récupérer le blob depuis IndexedDB
                const blob = await readAttachment(selected[0].id)
                console.log('[PHOTO] Blob récupéré:', blob?.type, blob?.size)
                
                if (!blob) {
                  onNotice(t("Impossible de charger l'image.", "Cannot load image."))
                  return
                }
                
                // Créer un File à partir du Blob
                const file = new File([blob], selected[0].name, { type: selected[0].type })
                console.log('[PHOTO] File créé:', file.name, file.type, file.size)
                
                await groupsApi.modifierGroupe(currentGroup.id_group, { photo: file })
                console.log('[PHOTO] Modification réussie')
                
                // Forcer un nouveau timestamp pour rafraîchir l'image
                setPhotoRefreshKey(Date.now())
                
                // Recharger les groupes
                await reloadGroupes()
                console.log('[PHOTO] Groupes rechargés')
                
                onNotice(t("Photo du groupe mise à jour.", "Group photo updated."))
              } catch (err: any) {
                console.error('Erreur modification photo:', err)
                console.error('Détails:', err.response?.data)
                console.error('Status:', err.response?.status)
                console.error('Headers:', err.response?.headers)
                onNotice(t("Erreur lors de la modification de la photo.", "Error updating photo."))
              }
            }
          }} />
        <button
          className="details-edit"
          onClick={() => setModal("edit-name")}>
          <Pencil size={14} />
          {t("Modifier le nom", "Edit name")}
        </button>
      </div>}
    </div>
    {currentGroup && <div className="details-section">
      <div className="row">
        <h3>{t("Participants", "Participants")} ({groupMembers.length})</h3>
        <button
          className="quiet"
          onClick={() => setModal("members")}
          aria-label={admin ? t("Gérer les membres", "Manage members") : t("Voir les membres", "View members")}>
          {admin ? <UserPlus size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <div className="member-avatars">
        {groupMembers.slice(0, 5).map(member => <span
          className="avatar"
          key={member.dev_email}
          title={member.dev_pseudo}>
          {member.dev_pseudo.slice(0, 2)}
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
      {currentGroup && !admin && (
        <button
          className="details-delete-group"
          style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}
          onClick={() => {
            setReportTarget({
              type: 'groupe',
              id: currentGroup.id_group,
              name: currentGroup.nom
            })
            setShowInfo(false)
          }}>
          <Flag size={15} />
          {t("Signaler ce groupe", "Report this group")}
        </button>
      )}
      {admin ? <button
        className="details-delete-group"
        onClick={() => setModal("delete-group")}>
        <Trash2 size={15} />
        {t("Supprimer le groupe", "Delete group")}
      </button> : currentGroup && joined ? <button
        className="details-leave"
        onClick={async () => { 
          try {
            await groupsApi.quitterGroupe(currentGroup.id_group)
            reloadGroupes()
            navigate("messages/groupes")
            onNotice(t("Vous avez quitté le groupe.", "You left the group."))
          } catch (err) {
            onNotice(t("Erreur lors de la sortie du groupe.", "Error leaving group."))
          }
        }}>
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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {invitations.length > 0 && (
            <button
              aria-label={t("Invitations en attente", "Pending invitations")}
              onClick={() => setModal("invitations")}
              style={{ position: 'relative' }}>
              <UserPlus size={21} />
              {invitations.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {invitations.length}
                </span>
              )}
            </button>
          )}
          <button
            aria-label={t("Créer un groupe", "Create a group")}
            onClick={() => setModal("create")}>
            <Plus size={21} />
          </button>
        </div>
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
          const state = preferences[`${profile.id}|${c.key}`] || {}
          const dernierTexte = c.group 
            ? t("Discussion de groupe", "Group chat")
            : (c as any).dernierMessage?.contenu || t("Démarrer la discussion", "Start a conversation")
          const nonLus = (c as any).nonLus || 0
          
          return <button
            key={c.id}
            className={c.key === key ? "active" : ""}
            onClick={() => navigate(c.path)}>
            <ChatAvatar
              name={c.title}
              photoUrl={c.photo}
              group={!!c.group} />
            <span>
              <strong>
                {c.title}
                {state.muted && <BellOff size={12} />}
                {nonLus > 0 && <span className="unread-badge">{nonLus}</span>}
              </strong>
              <small>
                {dernierTexte}
              </small>
            </span>
            {c.group && !joined && c.key === key && <Plus size={14} />}
          </button>
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
              key={`avatar-header-${photoRefreshKey}`}
              name={title}
              photoUrl={currentGroup?.photo}
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
                  onClick={handleMuteToggle}>
                  <BellOff size={17} />
                  {preference.muted ? t("Réactiver le son", "Unmute") : t("Sourdine", "Mute")}
                </button>
                <button
                  role="menuitem"
                  onClick={handleBlockToggle}>
                  <Slash size={17} />
                  {preference.blocked ? t("Débloquer", "Unblock") : t("Bloquer", "Block")}
                </button>
                <button
                  role="menuitem"
                  className="danger"
                  onClick={currentEmail ? handleDeleteConversation : () => { setMenuOpen(false); setModal("clear"); }}>
                  <Trash2 size={17} />
                  {t("Effacer la discussion", "Clear conversation")}
                </button>
                {currentEmail && (
                  <button
                    role="menuitem"
                    className="danger"
                    onClick={() => {
                      setReportTarget({
                        type: 'dev',
                        id: currentEmail,
                        name: title
                      })
                      setMenuOpen(false)
                    }}>
                    <Flag size={17} />
                    {t("Signaler cet utilisateur", "Report this user")}
                  </button>
                )}
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
            const mine = message.mine; return <article
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
            onClick={handleBlockToggle}>
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
        </div> : <MessageComposer key={prefKey} onSend={send} />}
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
          onClick={() => { updatePreference({ hiddenMessages: currentMessages.map(m => Number(m.id_message)), hiddenLinks: links.filter(l => l.conversation === key).map(l => String(l.id)) }); setModal(null); onNotice(t("Discussion effacée de ton historique.", "Conversation cleared from your history.")); }}>
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
        {groupMembers.map(member => <article key={member.dev_email}>
          <button
            className="member-profile"
            onClick={() => navigate(member.dev_email === profile.email ? "profil" : `profil/${encodeURIComponent(member.dev_email)}`)}>
            <span className="avatar">
              {member.dev_pseudo.slice(0, 2)}
            </span>
            <span>
              <strong>
                {member.dev_pseudo}
              </strong>
            </span>
          </button>
          {member.type === 'A' ? <span className="admin-badge">
            <ShieldCheck size={13} />
            {t("Administrateur", "Administrator")}
          </span> : admin && <button
            className="quiet"
            aria-label={`${t("Retirer le membre", "Remove member")} ${member.dev_pseudo}`}
            onClick={() => removeMember(member)}>
            <UserMinus size={17} />
          </button>}
        </article>)}
      </div>
      {admin && <section className="add-group-members">
        <h3>
          {t("Inviter des membres", "Invite members")}
        </h3>
        <input
          placeholder={t("Rechercher par pseudo…", "Search by pseudo…")}
          value={memberQuery}
          onChange={e => setMemberQuery(e.target.value)}
          aria-label={t("Rechercher un membre", "Search members")} />
        
        {/* Personnes avec qui l'admin a discuté */}
        {backendConversations
          .filter(conv => 
            !groupMembers.some(member => member.dev_email === conv.email) && 
            normalizeText(conv.pseudo).includes(normalizeText(memberQuery))
          )
          .slice(0, 10)
          .map(conv => <button
            key={`conv-${conv.email}`}
            onClick={async () => {
              if (!admin) return
              try {
                await groupsApi.inviterMembre(currentGroup.id_group, conv.email)
                onNotice(t(`Invitation envoyée à ${conv.pseudo}`, `Invitation sent to ${conv.pseudo}`))
              } catch (err) {
                onNotice(t("Erreur lors de l'invitation", "Error sending invitation"))
              }
            }}>
            <UserPlus size={17} />
            {conv.pseudo}
          </button>)}
        
        {/* Si recherche, afficher aussi les devs du registry */}
        {memberQuery && registry
          .filter(person => 
            !groupMembers.some(member => member.dev_email === person.email) &&
            !backendConversations.some(conv => conv.email === person.email) &&
            normalizeText(person.name).includes(normalizeText(memberQuery))
          )
          .slice(0, 5)
          .map(person => <button
            key={`reg-${person.email}`}
            onClick={async () => {
              if (!admin) return
              try {
                await groupsApi.inviterMembre(currentGroup.id_group, person.email)
                onNotice(t(`Invitation envoyée à ${person.name}`, `Invitation sent to ${person.name}`))
              } catch (err) {
                onNotice(t("Erreur lors de l'invitation", "Error sending invitation"))
              }
            }}>
            <UserPlus size={17} />
            {person.name}
          </button>)}
          
        {backendConversations.length === 0 && !memberQuery && (
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
            {t("Commence à discuter avec des développeurs pour les inviter.", "Start chatting with developers to invite them.")}
          </p>
        )}
      </section>}
    </Modal>}
    {(modal === "create" || modal === "edit-name" || modal === "link") && <Modal
      title={modal === "create" ? t("Créer un groupe", "Create a group") : modal === "edit-name" ? t("Modifier le nom du groupe", "Edit group name") : t("Ajouter un lien utile", "Add a useful link")}
      onClose={() => setModal(null)}>
      <form
        className="chat-settings-form"
        onSubmit={async e => { 
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          const value = (name: string) => String(data.get(name) || "").trim()
          
          if (modal === "create") { 
            if (!value("name") || !value("description")) return
            
            try {
              const photoInput = e.currentTarget.querySelector('input[name="photo"]') as HTMLInputElement
              const photo = photoInput?.files?.[0]
              
              const groupData: any = { 
                nom: value("name"), 
                motif_creation: value("description")
              }
              
              // N'ajouter la photo que si elle existe
              if (photo) {
                groupData.photo = photo
              }
              
              await groupsApi.creerGroupe(groupData)
              
              await reloadGroupes()
              setModal(null)
              onNotice(t("Groupe créé. Tu peux inviter tes premiers membres.", "Group created. You can add your first members."))
              navigate("messages/groupes")
            } catch (err: any) {
              console.error('Erreur création groupe:', err)
              console.error('Détails:', err.response?.data)
              onNotice(t("Erreur lors de la création du groupe.", "Error creating group."))
            }
          } else if (modal === "edit-name") { 
            if (!admin || !currentGroup || !value("name")) return
            
            try {
              await groupsApi.modifierGroupe(currentGroup.id_group, { nom: value("name") })
              await reloadGroupes()
              setModal(null)
              onNotice(t("Nom du groupe mis à jour.", "Group name updated."))
            } catch (err: any) {
              console.error('Erreur modification nom:', err)
              console.error('Détails:', err.response?.data)
              onNotice(t("Erreur lors de la modification.", "Error updating."))
            }
          } else { 
            const url = safePortfolio(value("url"))
            if (!url) { 
              onNotice(t("Indique un lien HTTP(S) valide.", "Enter a valid HTTP(S) link."))
              return
            }
            setLinks(current => [...current, { id: Date.now(), conversation: key, title: value("title") || url, url }])
            setModal(null)
            onNotice(t("Lien ajouté.", "Link added."))
          } 
        }}>
        {modal === "create" && <>
          <label>
            {t("Nom du groupe", "Group name")}
            <input
              name="name"
              required
              maxLength={80} />
          </label>
          <label>
            {t("Photo du groupe (optionnel)", "Group photo (optional)")}
            <input
              name="photo"
              type="file"
              accept="image/*" />
          </label>
        </>}
        {modal === "edit-name" && <label>
          {t("Nom du groupe", "Group name")}
          <input
            name="name"
            required
            maxLength={100}
            defaultValue={currentGroup?.nom} />
        </label>}
        {modal === "create" && <label>
          {t("Description", "Description")}
          <textarea
            name="description"
            required
            maxLength={1000} />
        </label>}
        {modal === "link" && <>
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
    {modal === "invitations" && <Modal
      title={t("Invitations en attente", "Pending invitations")}
      onClose={() => setModal(null)}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {invitations.map(invitation => (
          <div key={invitation.id_invitation} style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div>
              <strong>{invitation.groupe_nom}</strong>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>
                {t("Invité par", "Invited by")} {invitation.inviteur_pseudo}
              </p>
              <small style={{ color: '#9ca3af' }}>
                {new Date(invitation.date_invitation).toLocaleDateString(locale)}
              </small>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-primary"
                onClick={async () => {
                  try {
                    await groupsApi.accepterInvitation(invitation.id_invitation)
                    await reloadInvitations()
                    await reloadGroupes()
                    if (invitations.length === 1) setModal(null)
                    onNotice(t("Invitation acceptée !", "Invitation accepted!"))
                  } catch (err: any) {
                    console.error('Erreur acceptation:', err)
                    console.error('Détails:', err.response?.data)
                    onNotice(t("Erreur lors de l'acceptation", "Error accepting invitation"))
                  }
                }}
                style={{ flex: 1 }}>
                <Check size={16} />
                {t("Accepter", "Accept")}
              </button>
              <button
                className="btn-outline"
                onClick={async () => {
                  try {
                    await groupsApi.refuserInvitation(invitation.id_invitation)
                    await reloadInvitations()
                    if (invitations.length === 1) setModal(null)
                    onNotice(t("Invitation refusée", "Invitation declined"))
                  } catch (err: any) {
                    console.error('Erreur refus:', err)
                    onNotice(t("Erreur lors du refus", "Error declining invitation"))
                  }
                }}
                style={{ flex: 1 }}>
                <X size={16} />
                {t("Refuser", "Decline")}
              </button>
            </div>
          </div>
        ))}
        {invitations.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
            {t("Aucune invitation en attente", "No pending invitations")}
          </p>
        )}
      </div>
    </Modal>}
    
    {/* ─── Modal signalement ─── */}
    <ReportModal
      target={reportTarget}
      onClose={() => setReportTarget(null)}
      onSubmit={async (motif) => {
        if (!reportTarget) return
        try {
          if (reportTarget.type === 'dev') {
            await moderationApi.signalerDev(reportTarget.id, motif)
          } else {
            await moderationApi.signalerGroupe(reportTarget.id, motif)
          }
        } catch (error: any) {
          // L'erreur sera gérée par ReportModal qui affichera le message
          throw error
        }
      }}
      onNotice={onNotice}
    />
  </section>;
}
