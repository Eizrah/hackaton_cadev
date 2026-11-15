import { AttachmentPicker, AttachmentCard } from "../shared/Attachments";
import { readAttachment, type StoredAttachment } from "../../lib/attachments";
import { safePortfolio } from "../../lib/urls";
import { compactStars } from "../../lib/format";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bookmark,
  Flag,
  Edit3,
  FileText,
  Trash2,
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
  Search,
} from "lucide-react";
import {
  orderedComments,
  type Post,
  type PostComment,
  type Profile,
} from "../../data/models";
import { makeReview, useReviews } from "../../data/workflow";
import { useI18n } from "../../i18n/context";
import { CountryFlag } from "../CountryFlag";
import Modal from "../Modal";
import ConfirmDialog from "../shared/ConfirmDialog";
import { publicationApi, type ForumPostResponse } from "../../api/publication";
import { authApi } from "../../api/auth";
import { apiError, mediaUrl } from "../../api/client";
import { useSavedPublications } from "../../hooks/useSavedPublications";

type DjangoComment = {
  id_commentaire: string;
  commentaire: string;
  date_commentaire: string;
  commentaire_parent?: string | null;
  developper_email: string;
  developper_pseudo: string;
  developper_pays?: string;
  developper_photo?: string | null;
};

type ForumPost = Pick<Post, "author" | "authorPhoto" | "country" | "title" | "text" | "links" | "publishedAt" |
  "collaboration" | "starred" | "starCount"> & {
  id: string;
  authorId: string;
  commentCount: number;
  fileUrl?: string;
  moderation: "approved" | "rejected";
};

function mapForumPost(post: ForumPostResponse): ForumPost {
  return {
    id: post.id_publication,
    authorId: post.developper_email,
    author: post.developper_pseudo || post.developper_email,
    authorPhoto: mediaUrl(post.developper_photoprofil),
    country: post.developper_pays || "",
    title: "",
    text: post.description,
    links: post.lien ? [post.lien] : [],
    fileUrl: mediaUrl(post.fichier),
    publishedAt: post.date_publication,
    collaboration: post.collaboration ?? false,
    moderation: post.feu_vert ? "approved" : "rejected",
    starred: !!post.liked_by_me,
    starCount: post.nombre_notes || 0,
    commentCount: post.nombre_commentaires || 0,
  };
}

// Les publications identifient leur auteur par e-mail ; normaliser avant de comparer.
function isOwnPost(post: ForumPost, profile: Profile) {
  const authorEmail = post.authorId.trim().toLocaleLowerCase();
  const profileEmail = profile.email.trim().toLocaleLowerCase();
  return !!authorEmail && !!profileEmail && authorEmail === profileEmail;
}

function mapComment(comment: DjangoComment): PostComment {
  return {
    id: comment.id_commentaire,
    authorId: comment.developper_email,
    author: comment.developper_pseudo || comment.developper_email,
    country: comment.developper_pays || "",
    photo: mediaUrl(comment.developper_photo),
    text: comment.commentaire,
    createdAt: comment.date_commentaire,
    parentId: comment.commentaire_parent || undefined,
  };
}



function PostMenu({
  saved,
  saveBusy,
  saveFailed,
  canSave,
  isOwned,
  onProfile,
  onSave,
  onEdit,
  onDelete,
  onReport,
}: {
  saved: boolean;
  saveBusy: boolean;
  saveFailed: boolean;
  canSave: boolean;
  isOwned: boolean;
  onProfile: () => void;
  onSave: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
          <button role="menuitem" onClick={() => { onProfile(); setOpen(false); }}>
            <UserRound size={17} />
            {t("Voir le profil", "View profile")}
          </button>
          {canSave && <button role="menuitem" disabled={saveBusy} onClick={() => { onSave(); setOpen(false); }}>
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
            {saveFailed ? t("Recharger les enregistrements", "Reload saved items")
              : saved ? t("Retirer des enregistrements", "Remove from saved items") : t("Enregistrer l'annonce", "Save post")}
          </button>}
          {isOwned && onEdit && (
            <button role="menuitem" onClick={() => { onEdit(); setOpen(false); }}>
              <Edit3 size={17} />
              {t("Modifier", "Edit")}
            </button>
          )}
          {isOwned && onDelete && (
            <button role="menuitem" className="danger" onClick={() => { onDelete(); setOpen(false); }}>
              <Trash2 size={17} />
              {t("Supprimer", "Delete")}
            </button>
          )}
          {!isOwned && (
            <button role="menuitem" className="danger" onClick={() => { onReport(); setOpen(false); }}>
              <Flag size={17} />
              {t("Signaler", "Report")}
            </button>
          )}
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
  focusCommentId,
}: {
  profile: Profile;
  focusPostId?: string;
  focusCommentId?: string;
  onNavigate: (path: string) => void;
  onNotice: (text: string) => void;
}) {
  const { t, locale } = useI18n();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [, setReviews] = useReviews();
  const savedPublications = useSavedPublications();
  const [busy, setBusy] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [collaboration, setCollaboration] = useState(false);
  const [commentPost, setCommentPost] = useState<string | null>(focusCommentId && focusPostId ? focusPostId : null);
  const [comment, setComment] = useState("");
  const [threads, setThreads] = useState<Record<string, PostComment[]>>({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [dialog, setDialog] = useState<
    { kind: "delete-post"; postId: string } |
    { kind: "delete-comment" | "edit-comment"; postId: string; comment: PostComment }
  >();
  const [editComment, setEditComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [editingComment, setEditingComment] = useState(false);
  const [report, setReport] = useState<ForumPost | null>(null);
  const [reportCategory, setReportCategory] = useState("");
  const [attachments, setAttachments] = useState<StoredAttachment[]>([]);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editLink, setEditLink] = useState("");
  const [focusMissing, setFocusMissing] = useState(false);
  const [pendingStars, setPendingStars] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIds, setSearchIds] = useState<string[]>([]);
  const [searchPeople, setSearchPeople] = useState<Array<{ pseudo: string; email: string; photoprofil?: string }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchVersion = useRef(0);
  const commentVersion = useRef(0);
  const isSearching = !!searchQuery.trim();

  function mergePosts(incoming: ForumPost[]) {
    setPosts(current => {
      const existing = new Map(current.map(post => [post.id, post]));
      for (const post of incoming) {
        existing.set(post.id, post);
      }
      return [...existing.values()];
    });
  }

  useEffect(() => {
    let active = true;
    void publicationApi.getPostsForum().then(({ data }) => {
      if (active) mergePosts(data.map(mapForumPost));
    }).catch(error => {
      if (active) onNotice(apiError(error, t("Impossible de charger les publications.", "Could not load posts.")));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!focusPostId) return;
    let active = true;
    void publicationApi.getPostForum(focusPostId).then(({ data }) => {
      if (active) mergePosts([mapForumPost(data)]);
    }).catch(() => {
      if (active) setFocusMissing(true);
    });
    return () => { active = false; };
  }, [focusPostId]);

  useEffect(() => {
    if (!commentPost) return;
    const version = ++commentVersion.current;
    setLoadingComments(true);
    setCommentsError(false);
    void publicationApi.getCommentaires(commentPost).then(({ data }) => {
      if (version !== commentVersion.current) return;
      const thread = (data as DjangoComment[]).map(mapComment);
      setThreads(current => ({ ...current, [commentPost]: thread }));
      setPosts(current => current.map(post => post.id === commentPost ? { ...post, commentCount: thread.length } : post));
    }).catch(() => {
      if (version === commentVersion.current) setCommentsError(true);
    }).finally(() => {
      if (version === commentVersion.current) setLoadingComments(false);
    });
    return () => { commentVersion.current += 1; };
  }, [commentPost]);

  const focusAvailable = !!focusPostId && posts.some(post => post.id === focusPostId);
  useEffect(() => {
    if (!focusAvailable) return;
    const frame = requestAnimationFrame(() => {
      const target = focusCommentId && document.getElementById(`comment-${focusCommentId}`);
      (target || document.getElementById(`post-${focusPostId}`))?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusAvailable, focusPostId, focusCommentId, loadingComments]);

  async function handleSearch(query: string) {
    const version = ++searchVersion.current;
    const term = query.trim();
    setSearchQuery(query);
    setSearchIds([]);
    setSearchPeople([]);
    setSearchLoading(!!term);
    setSearchFailed(false);
    if (!term) return;
    const [people, publications] = await Promise.allSettled([
      authApi.rechercherDevs(term),
      publicationApi.rechercherPostsForum(term),
    ]);
    if (version !== searchVersion.current) return;
    setSearchLoading(false);
    setSearchFailed(people.status === "rejected" && publications.status === "rejected");
    if (people.status === "fulfilled") setSearchPeople(people.value.data);
    const found = publications.status === "fulfilled" ? publications.value.data.map(mapForumPost) : [];
    mergePosts(found);
    const lower = term.toLowerCase();
    const local = posts.filter(post => `${post.text} ${post.author}`.toLowerCase().includes(lower));
    setSearchIds([...new Set([...local, ...found].map(post => post.id))]);
  }

  function clearSearch() {
    void handleSearch("");
    searchInput.current?.focus();
  }

  function handleEditPost(post: ForumPost) {
    setEditingPostId(post.id);
    setEditText(post.text);
    setEditLink(post.links?.[0] || "");
  }

  async function handleSaveEdit(postId: string) {
    const description = editText.trim();
    const inputLink = editLink.trim();
    const lien = inputLink ? safePortfolio(inputLink) : null;
    if (!description || (inputLink && (!lien || lien.length > 200))) {
      onNotice(t("Vérifie le texte et le lien de la publication.", "Check the post text and link."));
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await publicationApi.modifierPostForum(postId, { description, lien });
      mergePosts([mapForumPost(data.post)]);
      setEditingPostId(null);
      onNotice(data.post.feu_vert
        ? t("Publication modifiée.", "Post updated.")
        : t("La publication modifiée a été refusée par la modération.", "The updated post was rejected by moderation."));
    } catch (err) {
      onNotice(apiError(err, t("Impossible de modifier la publication.", "Could not update the post.")));
    } finally {
      setBusy(false);
    }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading || busy) return;
    setPublishError("");
    if (!text.trim()) {
      setPublishError(t("Ajoute une description à ta publication.", "Add a description to your post."));
      return;
    }
    const url = link.trim() ? safePortfolio(link.trim()) : null;
    if (link.trim() && (!url || url.length > 200)) {
      setPublishError(t("Indique un lien HTTP(S) valide.", "Enter a valid HTTP(S) link."));
      return;
    }
    setBusy(true);
    try {
      const attachment = attachments[0];
      const blob = attachment ? await readAttachment(attachment.id) : undefined;
      if (attachment && !blob) {
        setPublishError(t("La pièce jointe est introuvable.", "The attachment is unavailable."));
        return;
      }
      const { post: result, raison } = await publicationApi.creerPostForum({
        description: text.trim(), lien: url || undefined, collaboration,
        fichier: blob && attachment ? new File([blob], attachment.name, { type: attachment.type }) : undefined,
      });
      const post = mapForumPost({ ...result, collaboration: result.collaboration ?? collaboration });
      setPosts(current => [post, ...current.filter(item => item.id !== post.id)]);
      if (searchQuery) void handleSearch("");
      setText("");
      setAttachments([]);
      setLink("");
      setCollaboration(false);
      if (post.moderation === "rejected") {
        setPublishError(raison || t("La publication a été refusée par la modération. Tu peux la modifier.", "Moderation rejected this post. You can edit it."));
      } else {
        onNotice(t("Publication publiée.", "Post published."));
      }
    } catch (err) {
      setPublishError(apiError(err, t("Impossible de publier.", "Could not publish the post.")));
    } finally {
      setBusy(false);
    }
  }

  async function toggleSaved(post: ForumPost) {
    if (savedPublications.error) {
      savedPublications.retry();
      return;
    }
    const saved = savedPublications.saved("forum_post", post.id);
    try {
      if (await savedPublications.toggle({
        type: "forum_post",
        publication: { id: post.id, description: post.text, auteur: post.author, date: post.publishedAt || "" },
      })) onNotice(saved ? t("Annonce retirée des enregistrements.", "Post removed from saved items.")
        : t("Annonce enregistrée.", "Post saved."));
    } catch (err) {
      onNotice(apiError(err, t("Impossible de modifier l’enregistrement.", "Could not update the saved item.")));
    }
  }

  async function toggleStar(post: ForumPost) {
    if (pendingStars.includes(post.id)) return;
    setPendingStars(current => [...current, post.id]);
    try {
      const response = await publicationApi.toggleNote(post.id);
      setPosts(current => current.map(item => item.id === post.id
        ? { ...item, starred: response.status === 201, starCount: response.data.nombre_notes } : item));
    } catch (err) {
      onNotice(apiError(err, t("Impossible d’enregistrer l’étoile.", "Could not update the star.")));
    } finally {
      setPendingStars(current => current.filter(id => id !== post.id));
    }
  }

  async function sendComment(event: FormEvent, postId: string) {
    event.preventDefault();
    if (sendingComment || loadingComments || !comment.trim()) return;
    const version = commentVersion.current;
    setSendingComment(true);
    try {
      const { data } = await publicationApi.ajouterCommentaire(postId, {
        commentaire: comment.trim(), commentaire_parent: replyTo || undefined,
      });
      setThreads(current => ({ ...current, [postId]: [...(current[postId] || []), mapComment(data.commentaire)] }));
      setPosts(current => current.map(post => post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post));
      if (version === commentVersion.current) { setComment(""); setReplyTo(null); }
      onNotice(t("Commentaire envoyé.", "Comment sent."));
    } catch (err) {
      onNotice(apiError(err, t("Impossible d’envoyer le commentaire.", "Could not send the comment.")));
    } finally {
      setSendingComment(false);
    }
  }

  async function saveComment(event: FormEvent) {
    event.preventDefault();
    if (dialog?.kind !== "edit-comment" || editingComment || !editComment.trim()) return;
    const { postId, comment } = dialog;
    setEditingComment(true);
    setCommentError("");
    try {
      const { data } = await publicationApi.modifierCommentaire(postId, comment.id, { commentaire: editComment.trim() });
      setThreads(current => ({
        ...current, [postId]: (current[postId] || []).map(item => item.id === comment.id ? mapComment(data.commentaire) : item),
      }));
      setDialog(undefined);
      onNotice(t("Commentaire modifié.", "Comment updated."));
    } catch (err) {
      setCommentError(apiError(err, t("Impossible de modifier le commentaire.", "Could not edit the comment.")));
    } finally {
      setEditingComment(false);
    }
  }

  async function deleteContent() {
    if (!dialog) return;
    const { postId } = dialog;
    if (dialog.kind === "delete-comment") {
      const id = dialog.comment.id;
      await publicationApi.supprimerCommentaire(postId, id);
      setThreads(current => ({
        ...current, [postId]: (current[postId] || []).filter(item => item.id !== id)
          .map(item => item.parentId === id ? { ...item, parentId: undefined } : item),
      }));
      setPosts(current => current.map(post => post.id === postId
        ? { ...post, commentCount: Math.max(0, post.commentCount - 1) } : post));
      if (replyTo === id) setReplyTo(null);
      onNotice(t("Commentaire supprimé.", "Comment deleted."));
    } else {
      await publicationApi.supprimerPostForum(postId);
      setPosts(current => current.filter(post => post.id !== postId));
      onNotice(t("Publication supprimée.", "Post deleted."));
    }
  }

  const visible = posts.filter(post => post.moderation === "approved" || isOwnPost(post, profile));
  const displayedPosts = isSearching
    ? visible.filter(post => post.moderation === "approved" && searchIds.includes(post.id))
    : visible;

  return (
    <div className="feed-layout">
      <section className="feed-column">
        {/* ─── Formulaire de publication ─── */}
        <form className="panel composer" onSubmit={publish} noValidate>
          <div className="row">
            <div className="person">
              {profile.photo ? (
                <img 
                  src={profile.photo} 
                  alt={profile.name}
                  className="avatar-img"
                />
              ) : (
                <span className="avatar">{profile.name.slice(0, 2).toUpperCase()}</span>
              )}
              <div>
                <strong>{t("Qu'est-ce qu'on construit aujourd'hui ?", "What are we building today?")}</strong>
                <small>{t("Une idée peut devenir un projet commun.", "An idea can become a shared project.")}</small>
              </div>
            </div>
            <Sparkles size={20} className="composer-spark" />
          </div>
          <textarea
            aria-label={t("Votre publication", "Your post")}
            placeholder={t("Partage ton idée, une question ou une découverte…", "Share an idea, a question or a discovery…")}
            value={text}
            onChange={(e) => { setText(e.target.value); setPublishError(""); }}
            maxLength={3000}
          />
          <div className="composer-attachments">
            <AttachmentPicker
              label={t("Joindre un fichier", "Attach a file")}
              accept=".pdf,.zip,.doc,.docx"
              onBusy={setUploading}
              onAdd={files => setAttachments(files.slice(0, 1))}
            />
            <label className="composer-link">
              <Link2 size={18} />
              <input
                type="url"
                aria-label={t("Lien à partager", "Link to share")}
                placeholder={t("Lien vers un projet, une ressource…", "Link to a project or resource…")}
                value={link}
                onChange={(e) => { setLink(e.target.value); setPublishError(""); }}
                maxLength={200}
              />
            </label>
          </div>
          {attachments.length > 0 && (
            <div className="post-attachments">
              {attachments.map((file) => (
                <AttachmentCard
                  key={file.id}
                  file={file}
                  onRemove={() => setAttachments((current) => current.filter((f) => f.id !== file.id))}
                />
              ))}
            </div>
          )}
          {publishError && <p className="form-error" role="alert">{publishError}</p>}
          <div className="composer-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={collaboration}
                onChange={(e) => setCollaboration(e.target.checked)}
              />
              {t("Demander de l'aide / collaborer", "Ask for help / collaborate")}
            </label>
            <button
              type="submit"
              className="btn-primary"
              disabled={busy || uploading || (!text.trim() && !attachments.length && !link.trim())}
            >
              <Plus size={18} />
              {busy ? t("En cours…", "Working…") : t("Publier", "Publish")}
            </button>
          </div>
        </form>

        {/* ─── Barre de recherche ─── */}
        <div className="panel community-search" role="search" aria-label={t("Recherche dans la communauté", "Search the community")}>
          <div className="rounded-search">
            <Search size={19} aria-hidden="true" />
            <input
              ref={searchInput}
              type="search"
              aria-label={t("Rechercher une personne ou une publication", "Search for a person or post")}
              placeholder={t("Rechercher une personne (pseudo) ou une publication…", "Search for a person (username) or post…")}
              value={searchQuery}
              onChange={e => void handleSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Escape" && searchQuery) {
                  e.preventDefault();
                  clearSearch();
                }
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="quiet"
                onClick={clearSearch}
                aria-label={t("Effacer", "Clear")}
              >
                <X size={18} />
              </button>
            )}
          </div>
          {isSearching && (
            <small className="search-info" role="status">
              {searchLoading
                ? t("Recherche en cours…", "Searching…")
                : searchPeople.length > 0
                ? `${searchPeople.length} personne(s) trouvée(s)`
                : displayedPosts.length > 0
                ? `${displayedPosts.length} publication(s) trouvée(s)`
                : searchFailed
                ? t("La recherche est indisponible.", "Search is unavailable.")
                : t("Aucun résultat", "No results")}
            </small>
          )}
        </div>

        {/* ─── Résultats de recherche de personnes ─── */}
        {isSearching && searchQuery && searchPeople.length > 0 && (
          <div className="search-people-results">
            <h3 className="search-section-title">
              <UserRound size={18} />
              {t("Personnes trouvées", "People found")}
            </h3>
            <div className="people-list">
              {searchPeople.map((person) => (
                <button
                  key={person.email}
                  className="panel person-card"
                  onClick={() => {
                    void handleSearch("");
                    onNavigate(`profil/membre/${encodeURIComponent(person.email)}`);
                  }}
                >
                  <div className="person">
                    {person.photoprofil ? (
                      <img 
                        src={mediaUrl(person.photoprofil)} 
                        alt={person.pseudo}
                        className="avatar-img"
                      />
                    ) : (
                      <span className="avatar">
                        {person.pseudo.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <strong>{person.pseudo}</strong>
                      <small className="muted">{t("Voir le profil", "View profile")}</small>
                    </div>
                  </div>
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="panel" style={{ textAlign: "center", padding: "16px", color: "#888" }}>
            {t("Chargement des publications…", "Loading posts…")}
          </div>
        )}

        <div className="feed-divider">
          {isSearching && searchQuery
            ? searchPeople.length > 0
              ? t("Vous pouvez aussi rechercher parmi les publications", "You can also search posts")
              : t("Publications trouvées", "Posts found")
            : t("Tout le fil", "Community feed")}
        </div>

        {/* ─── Liste des posts ─── */}
        {displayedPosts.map((post) => {
          const owner = isOwnPost(post, profile);
          const thread = threads[post.id] || [];
          return (
            <article
              id={`post-${post.id}`}
              className="panel post"
              key={post.id}
              aria-label={post.title || post.author}
            >
              <header className="row">
                <div className="person">
                  {post.authorPhoto ? (
                    <img 
                      src={post.authorPhoto} 
                      alt={post.author}
                      className="avatar-img"
                    />
                  ) : (
                    <span className={`avatar avatar-${post.id.charCodeAt(0) % 3}`}>
                      {post.author.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  )}
                  <div>
                    <strong>{post.author}</strong>
                    <div className="post-meta">
                      <CountryFlag country={post.country} />
                    </div>
                  </div>
                </div>
                <PostMenu
                  saved={!!savedPublications.saved("forum_post", post.id)}
                  saveBusy={savedPublications.loading || savedPublications.busy}
                  saveFailed={savedPublications.error}
                  canSave={post.moderation === "approved"}
                  isOwned={owner}
                  onProfile={() =>
                    onNavigate(
                      owner
                        ? "profil"
                        : `profil/membre/${encodeURIComponent(post.authorId || post.author)}`
                    )
                  }
                  onSave={() => void toggleSaved(post)}
                  onEdit={owner ? () => handleEditPost(post) : undefined}
                  onDelete={owner ? () => setDialog({ kind: "delete-post", postId: post.id }) : undefined}
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
                    t("Date de publication non renseignée", "Publication date unavailable")
                  )}
                </span>
              </div>

              {editingPostId === post.id ? (
                <div className="panel composer" style={{ margin: "1rem 0" }}>
                  <div className="row" style={{ marginBottom: "0.5rem" }}>
                    <div className="person">
                      <span className="avatar">{profile.name.slice(0, 2).toUpperCase()}</span>
                      <div>
                        <strong>{t("Modifier la publication", "Edit post")}</strong>
                        <small>{t("Apportez vos modifications ci-dessous", "Make your changes below")}</small>
                      </div>
                    </div>
                  </div>
                  <textarea
                    aria-label={t("Contenu de la publication", "Post content")}
                    placeholder={t("Votre texte...", "Your text...")}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    maxLength={3000}
                  />
                  <div className="composer-attachments">
                    <label className="composer-link">
                      <Link2 size={18} />
                      <input
                        type="url"
                        aria-label={t("Lien à partager", "Link to share")}
                        placeholder={t("Lien (optionnel)", "Link (optional)")}
                        value={editLink}
                        onChange={(e) => setEditLink(e.target.value)}
                        maxLength={200}
                      />
                    </label>
                  </div>
                  <div className="composer-options">
                    <div></div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn-secondary" onClick={() => setEditingPostId(null)} disabled={busy}>
                        {t("Annuler", "Cancel")}
                      </button>
                      <button className="btn-primary" onClick={() => handleSaveEdit(post.id)} disabled={busy}>
                        {busy ? t("Enregistrement...", "Saving...") : t("Enregistrer", "Save")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {post.title && <h2 className="post-title">{post.title}</h2>}
                  <p className="post-content">{post.text}</p>

                  {(post.links || []).map((url) => (
                    <a
                      className="post-link"
                      href={safePortfolio(url) || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={url}
                    >
                      <Link2 size={16} />
                      {url}
                    </a>
                  ))}

                  {post.fileUrl && <a className="post-link" href={post.fileUrl} target="_blank" rel="noopener noreferrer">
                    <FileText size={16} /> {t("Ouvrir la pièce jointe", "Open attachment")}
                  </a>}

                  {post.moderation === "rejected" && (
                    <p className="blocked-post-status">
                      <ShieldCheck size={15} />
                      {t("Cette publication a été bloquée par la modération.", "This post has been blocked by moderation.")}
                    </p>
                  )}
                </>
              )}

              {post.moderation === "approved" && <div className="post-actions">
                {/* ─── Like/étoile ─── */}
                <button
                  className={`star-like ${post.starred ? "is-starred" : ""}`}
                  aria-label={`${t("Étoile", "Star")} : ${post.starCount}`}
                  aria-pressed={post.starred}
                  disabled={pendingStars.includes(post.id)}
                  onClick={() => void toggleStar(post)}
                >
                  <Star size={21} fill={post.starred ? "currentColor" : "none"} />
                  <strong>{compactStars(post.starCount)}</strong>
                  <span>{t("Étoiles", "Stars")}</span>
                </button>

                {/* ─── Commentaires ─── */}
                <button
                  aria-expanded={commentPost === post.id}
                  onClick={() => {
                    setCommentPost(commentPost === post.id ? null : post.id);
                    setComment("");
                    setReplyTo(null);
                  }}
                >
                  <MessageCircle size={18} />
                  {post.commentCount} {t("commentaires", "comments")}
                </button>

                {post.collaboration && !owner && (
                  <button
                    className="collab-action"
                    onClick={() => onNavigate(`messages/prive/${encodeURIComponent(post.authorId || post.author)}`)}
                  >
                    <UsersRound size={17} />
                    {t("Proposer mon aide", "Offer help")}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>}

              {/* ─── Section commentaires ─── */}
              {post.moderation === "approved" && commentPost === post.id && (
                <div className="comments">
                  {loadingComments && <p role="status">{t("Chargement des commentaires…", "Loading comments…")}</p>}
                  {commentsError && <p className="form-error" role="alert">{t("Impossible de charger les commentaires.", "Could not load comments.")}</p>}
                  {orderedComments(thread).map(({ comment: c, depth }) => {
                    const parent = thread.find((item) => item.id === c.parentId);
                    return (
                      <article
                        className={`comment-card ${parent ? "comment-reply" : ""}`}
                        key={c.id}
                        id={`comment-${c.id}`}
                        style={{ marginLeft: Math.min(depth, 3) * 14 }}
                      >
                        {parent && (
                          <small className="reply-context">
                            <Reply size={13} />
                            {t("En réponse à", "Replying to")} {parent.author}
                          </small>
                        )}
                        <div className="comment-person">
                          <button
                            type="button"
                            className="comment-profile"
                            onClick={() =>
                              onNavigate(
                                c.authorId === profile.email
                                  ? "profil"
                                  : `profil/membre/${encodeURIComponent(c.authorId || c.author)}`
                              )
                            }
                            aria-label={`${t("Voir le profil de", "View profile of")} ${c.author}`}
                          >
                            <span className="avatar">
                              {c.photo ? (
                                <img src={c.photo} alt="" />
                              ) : (
                                c.author.split(" ").map((n) => n[0]).slice(0, 2).join("")
                              )}
                            </span>
                            <strong>{c.author}</strong>
                          </button>
                          <CountryFlag country={c.country} />
                        </div>
                        <p>{c.text}</p>
                        <div className="comment-footer">
                          {c.createdAt && (
                            <time dateTime={c.createdAt}>
                              {new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(
                                new Date(c.createdAt)
                              )}
                            </time>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setReplyTo(c.id);
                              setComment("");
                              requestAnimationFrame(() =>
                                document.getElementById(`comment-input-${post.id}`)?.focus()
                              );
                            }}
                          >
                            <Reply size={14} />
                            {t("Répondre", "Reply")}
                          </button>
                          {c.authorId === profile.email && <>
                            <button type="button" onClick={() => {
                              setEditComment(c.text);
                              setCommentError("");
                              setDialog({ kind: "edit-comment", postId: post.id, comment: c });
                            }}>{t("Modifier", "Edit")}</button>
                            <button type="button" className="danger"
                              onClick={() => setDialog({ kind: "delete-comment", postId: post.id, comment: c })}>
                              {t("Supprimer", "Delete")}
                            </button>
                          </>}
                        </div>
                      </article>
                    );
                  })}

                  {replyTo && thread.some((c) => c.id === replyTo) && (
                    <div className="reply-indicator">
                      {t("Répondre à", "Reply to")}{" "}
                      {thread.find((c) => c.id === replyTo)?.author}
                      <button
                        type="button"
                        className="quiet"
                        aria-label={t("Annuler la réponse", "Cancel reply")}
                        onClick={() => setReplyTo(null)}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}

                  <form
                    className="row"
                    onSubmit={event => void sendComment(event, post.id)}
                  >
                    <input
                      id={`comment-input-${post.id}`}
                      required
                      maxLength={1500}
                      aria-label={t("Ajouter un commentaire", "Add a comment")}
                      value={comment}
                      disabled={sendingComment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t("Une réponse, un encouragement…", "An answer, an encouraging word…")}
                    />
                    <button className="btn-primary" disabled={sendingComment || loadingComments}
                      aria-label={t("Envoyer le commentaire", "Send comment")}>
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })}

        {focusMissing && <p className="form-error" role="alert">{t("Cette publication est indisponible.", "This post is unavailable.")}</p>}
        {!visible.length && !loading && !isSearching && (
          <div className="panel empty-state">
            <Bookmark />
            <h2>{t("Aucune publication ici pour le moment.", "No posts here yet.")}</h2>
          </div>
        )}
      </section>

      <aside className="community-aside">
        <section className="panel community-callout">
          <span className="mini-label">{t("PAR LES DEVS, POUR LES DEVS", "BY DEVS, FOR DEVS")}</span>
          <h2>{t("Les bonnes idées grandissent ensemble.", "Great ideas grow together.")}</h2>
          <p>{t("Une étoile pour encourager. Un commentaire pour avancer.", "A star to encourage. A comment to move forward.")}</p>
          <button className="btn-primary" onClick={() => onNavigate("messages/groupes")}>
            {t("Découvrir les groupes", "Discover groups")}
            <ArrowRight size={17} />
          </button>
          <div className="callout-orbit" aria-hidden="true">&lt;/&gt;</div>
        </section>
        <section className="panel">
          <h2>{t("Une étoile, un encouragement.", "One star, one show of support.")}</h2>
          <p>{t("Chaque personne peut ajouter ou retirer son étoile. Le compteur montre le nombre d'utilisateurs qui apprécient la publication.", "Each person can add or remove a star. The counter shows how many users appreciate the post.")}</p>
          <small className="muted">{t("1 000 étoiles = 1k · exemples locaux.", "1,000 stars = 1k · local examples.")}</small>
        </section>
      </aside>

      {/* ─── Styles pour la recherche ─── */}
      <style>{`
        .search-info {
          display: block;
          margin-top: 0.5rem;
          color: var(--muted-color);
          font-size: 0.875rem;
        }

        .search-people-results {
          margin-bottom: 1.5rem;
        }

        .search-section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .people-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .person-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          text-align: left;
          width: 100%;
          border: none;
          background: var(--glass-bg);
          cursor: pointer;
          transition: all 0.2s;
        }

        .person-card:hover {
          background: var(--glass-hover, rgba(255, 255, 255, 0.08));
          transform: translateX(4px);
        }

        .person-card .person {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .person-card .avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .person-card .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        /* Avatar images globally for posts and composer */
        .person .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .composer .person .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
      `}</style>

      {dialog?.kind === "edit-comment" && <Modal
        title={t("Modifier le commentaire", "Edit comment")} onClose={() => setDialog(undefined)} busy={editingComment}>
        <form className="job-form" onSubmit={event => void saveComment(event)}>
          <label>{t("Commentaire", "Comment")}
            <textarea value={editComment} onChange={event => setEditComment(event.target.value)}
              maxLength={1500} rows={4} required disabled={editingComment} />
          </label>
          {commentError && <p className="form-error" role="alert">{commentError}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setDialog(undefined)} disabled={editingComment}>{t("Annuler", "Cancel")}</button>
            <button type="submit" className="btn-primary" disabled={editingComment || !editComment.trim()}>{t("Enregistrer", "Save")}</button>
          </div>
        </form>
      </Modal>}
      {dialog && dialog.kind !== "edit-comment" && <ConfirmDialog
        title={dialog.kind === "delete-post"
          ? t("Supprimer cette publication ?", "Delete this post?")
          : t("Supprimer ce commentaire ?", "Delete this comment?")}
        onClose={() => setDialog(undefined)} onConfirm={deleteContent} />}

      {/* ─── Modal signalement ─── */}
      {report && (
        <Modal
          title={t("Signaler une publication", "Report a post")}
          onClose={() => setReport(null)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const detail = String(new FormData(e.currentTarget).get("reason") || "").trim();
              if (!reportCategory || (reportCategory === "Autres" && !detail)) return;
              const reason = `${reportCategory}${detail ? ` : ${detail}` : ""}`;
              // signalement backend
              try {
                await publicationApi.signalerPost(report.id, reason);
                
                // log local
                try {
                  const id = Date.now();
                  const reports = JSON.parse(localStorage.getItem("devafrica:reports") || "[]");
                  localStorage.setItem(
                    "devafrica:reports",
                    JSON.stringify([...reports, { id, target: report.id, reason, date: new Date().toISOString() }])
                  );
                  setReviews((current) => [makeReview("report", id, report.title || report.author, reason), ...current]);
                } catch {/* silencieux */}
                
                onNotice(t("Signalement envoyé. Merci de contribuer à une communauté bienveillante.", "Report sent. Thank you for helping keep the community welcoming."));
                setReport(null);
              } catch (err: any) {
                if (err.response?.data?.erreur) {
                  onNotice(err.response.data.erreur);
                } else {
                  onNotice(t("Erreur lors de l'envoi du signalement.", "Error sending report."));
                }
              }
            }}
          >
            <p>{t("Explique la raison de ton signalement.", "Explain why you are reporting this post.")}</p>
            <label>
              {t("Motif du signalement", "Report category")}
              <select
                className="rounded-select report-category"
                required
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
              >
                <option value="" disabled>{t("Choisir un motif", "Choose a reason")}</option>
                {[
                  ["Harcèlement", "Harassment"],
                  ["Propos inappropriés ou haineux", "Inappropriate or hateful language"],
                  ["Fausses informations", "False information"],
                  ["Arnaque ou fraude", "Scam or fraud"],
                  ["Spam ou publicité abusive", "Spam or abusive advertising"],
                  ["Atteinte à la vie privée", "Privacy violation"],
                  ["Autres", "Other"],
                ].map(([fr, en]) => (
                  <option key={fr} value={fr}>{t(fr, en)}</option>
                ))}
              </select>
            </label>
            {reportCategory && (
              <label>
                {reportCategory === "Autres"
                  ? t("Explique la raison de ton signalement.", "Explain why you are reporting this post.")
                  : t("Précisions (facultatif)", "Details (optional)")}
                <textarea
                  name="reason"
                  required={reportCategory === "Autres"}
                  maxLength={1000}
                  placeholder={t("Décris les faits pour aider la modération…", "Describe what happened to help moderation…")}
                />
              </label>
            )}
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
