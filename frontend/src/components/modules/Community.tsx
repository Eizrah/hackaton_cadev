import { AttachmentPicker, AttachmentCard } from "../shared/Attachments";
import type { StoredAttachment } from "../../lib/attachments";
import { safePortfolio } from "../../lib/urls";
import { compactStars } from "../../lib/format";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bookmark,
  Flag,
  Edit3,
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
  isOwned,
  onProfile,
  onSave,
  onEdit,
  onDelete,
  onReport,
}: {
  saved: boolean;
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
          <button role="menuitem" onClick={() => { onSave(); setOpen(false); }}>
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
            {saved ? t("Annonce enregistrée", "Saved post") : t("Enregistrer l'annonce", "Save post")}
          </button>
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
}: {
  profile: Profile;
  focusPostId?: string | number;
  onNavigate: (path: string) => void;
  onNotice: (text: string) => void;
}) {
  const { t, locale } = useI18n();
  // Posts en mémoire uniquement — tout vient du backend
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setReviews] = useReviews();

  // ─── États ────────────────────────────────────────────────────────────────
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [collaboration, setCollaboration] = useState(false);
  const [commentPost, setCommentPost] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [report, setReport] = useState<Post | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reportCategory, setReportCategory] = useState("");
  const [attachments, setAttachments] = useState<StoredAttachment[]>([]);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);

  // États pour la modification de post
  const [editingPostId, setEditingPostId] = useState<string | number | null>(null);
  const [editText, setEditText] = useState("");
  const [editLink, setEditLink] = useState("");

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchPeople, setSearchPeople] = useState<Array<{ pseudo: string; email: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // ─── Chargement des posts depuis le backend ───────────────────────────────
  useEffect(() => {
    console.log('[FORUM] Début du chargement des posts...');
    setLoading(true);
    import("../../api/publication")
      .then(({ publicationApi }) => {
        console.log('[FORUM] Module publication importé');
        publicationApi
          .getPostsForum()
          .then((res) => {
            console.log('[FORUM] Réponse backend reçue:', res);
            console.log('[FORUM] Données brutes:', res.data);
            
            // Fonction pour transformer l'URL du fichier backend en format StoredAttachment
            const parseAttachmentResult = (fichierUrl: string | null | undefined, postId: string): StoredAttachment[] => {
              if (!fichierUrl) return [];
              // Extraire le nom du fichier de l'URL
              const fileName = fichierUrl.split('/').pop() || 'fichier';
              // Essayer de deviner le type MIME
              const extension = fileName.split('.').pop()?.toLowerCase() || '';
              const mimeTypes: Record<string, string> = {
                pdf: 'application/pdf',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                xls: 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              };
              return [{
                id: `backend-${postId}`,
                name: fileName,
                type: mimeTypes[extension] || 'application/octet-stream',
                size: 0,
                url: fichierUrl,
              }];
            };

            const backendPosts: Post[] = res.data.map((p: any) => ({
              id: p.id_publication,
              authorId: p.developper_email,
              author: p.developper_pseudo,
              country: "",
              tag: "Publication",
              title: "",
              text: p.description,
              links: p.lien ? [p.lien] : [],
              attachments: parseAttachmentResult(p.fichier, p.id_publication),
              savedBy: [],
              comments: [],
              publishedAt: p.date_publication,
              collaboration: false,
              starCount: p.nombre_notes || 0,
              starred: p.liked_by_me || false,
              saved: false,
              moderation: p.feu_vert ? "approved" : "pending",
            }));

            console.log('[FORUM] Posts transformés:', backendPosts);
            console.log('[FORUM] Premier post ID:', backendPosts[0]?.id);
            console.log('[FORUM] Affectation des posts...');
            setPosts(backendPosts);
          })
          .catch((err) => {
            console.error('[FORUM] Erreur lors du chargement:', err);
            console.error('[FORUM] Détails:', err.response?.data);
          })
          .finally(() => {
            console.log('[FORUM] Chargement terminé');
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error('[FORUM] Erreur import module:', err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Recherche de posts et personnes ──────────────────────────────────────
  function handleSearch(query: string) {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setSearchPeople([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // 1. Recherche de personnes par pseudo (prioritaire)
    import("../../api/auth").then(({ authApi }) => {
      authApi
        .rechercherDevs(query)
        .then((res) => {
          const people = res.data.map((dev: any) => ({
            pseudo: dev.pseudo,
            email: dev.email,
          }));
          setSearchPeople(people);

          // 2. Si aucune personne trouvée, rechercher des publications
          if (people.length === 0) {
            searchPostsInternal(query);
          } else {
            // Réinitialiser les résultats de posts si on a trouvé des gens
            setSearchResults([]);
          }
        })
        .catch(() => {
          // Si erreur API personnes, rechercher directement les posts
          searchPostsInternal(query);
        });
    });
  }

  // Recherche de publications (fonction interne)
  function searchPostsInternal(query: string) {
    // Recherche locale dans les posts chargés (par contenu ou auteur)
    const localResults = posts.filter((post) => {
      const searchLower = query.toLowerCase();
      return (
        post.text.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower) ||
        post.title?.toLowerCase().includes(searchLower)
      );
    });

    // Recherche backend pour les posts non chargés
    import("../../api/publication").then(({ publicationApi }) => {
      publicationApi
        .rechercherPostsForum(query)
        .then((res) => {
          const backendResults: Post[] = res.data.map((p: any) => {
            // Fonction pour transformer l'URL du fichier backend en format StoredAttachment
            const parseAttachmentResult = (fichierUrl: string | null | undefined, postId: string): StoredAttachment[] => {
              if (!fichierUrl) return [];
              const fileName = fichierUrl.split('/').pop() || 'fichier';
              const extension = fileName.split('.').pop()?.toLowerCase() || '';
              const mimeTypes: Record<string, string> = {
                pdf: 'application/pdf',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                xls: 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              };
              return [{
                id: `backend-${postId}`,
                name: fileName,
                type: mimeTypes[extension] || 'application/octet-stream',
                size: 0,
                url: fichierUrl,
              }];
            };
            return {
              id: p.id_publication,
              authorId: p.developper_email,
              author: p.developper_pseudo,
              country: "",
              tag: "Publication",
              title: "",
              text: p.description,
              links: p.lien ? [p.lien] : [],
              attachments: parseAttachmentResult(p.fichier, p.id_publication),
              savedBy: [],
              comments: [],
              publishedAt: p.date_publication,
              collaboration: false,
              starCount: p.nombre_notes || 0,
              starred: p.liked_by_me || false,
              saved: false,
              moderation: p.feu_vert ? "approved" : "pending",
            };
          });

          // Fusionner les résultats locaux et backend (dédupliquer par ID)
          const allResults = [...localResults];
          backendResults.forEach((br) => {
            if (!allResults.some((lr) => lr.id === br.id)) {
              allResults.push(br);
            }
          });

          setSearchResults(allResults);
        })
        .catch(() => {
          // En cas d'erreur backend, utiliser uniquement les résultats locaux
          setSearchResults(localResults);
        });
    });
  }

  // scroll vers le post ciblé
  useEffect(() => {
    if (focusPostId)
      requestAnimationFrame(() =>
        document.getElementById(`post-${focusPostId}`)?.scrollIntoView({ block: "center" })
      );
  }, [focusPostId]);

  // ─── Modification d'un post ───────────────────────────────────────────────
  function handleEditPost(post: Post) {
    console.log('[EDIT] handleEditPost appelé avec post.id:', post.id);
    setEditingPostId(post.id);
    setEditText(post.text);
    setEditLink(post.links?.[0] || "");
  }

  function handleSaveEdit(postId: string | number) {
    console.log('[EDIT] handleSaveEdit appelé avec postId:', postId);
    if (!editText.trim()) {
      onNotice(t("Le texte ne peut pas être vide.", "Text cannot be empty."));
      return;
    }

    setBusy(true);
    import("../../api/publication").then(({ publicationApi }) => {
      publicationApi
        .modifierPostForum(String(postId), {
          description: editText.trim(),
          lien: editLink.trim() || undefined,
        })
        .then((res) => {
          setPosts((current) =>
            current.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    text: editText.trim(),
                    links: editLink.trim() ? [editLink.trim()] : [],
                    moderation: res.data.post.feu_vert ? "approved" : "pending",
                  }
                : p
            )
          );
          setEditingPostId(null);
          onNotice(t("Publication modifiée.", "Post updated."));
        })
        .catch(() => {
          onNotice(t("Erreur lors de la modification.", "Update failed."));
        })
        .finally(() => setBusy(false));
    });
  }

  function handleDeletePost(postId: string | number) {
    console.log('[DELETE] handleDeletePost appelé avec postId:', postId);
    if (!confirm(t("Supprimer cette publication ?", "Delete this post?"))) return;

    import("../../api/publication").then(({ publicationApi }) => {
      publicationApi
        .supprimerPostForum(String(postId))
        .then(() => {
          setPosts((current) => current.filter((p) => p.id !== postId));
          onNotice(t("Publication supprimée.", "Post deleted."));
        })
        .catch(() => {
          onNotice(t("Erreur lors de la suppression.", "Delete failed."));
        });
    });
  }

  // ─── Chargement des commentaires d'un post ────────────────────────────────
  function loadComments(postId: string | number) {
    console.log('[COMMENTS] Chargement des commentaires pour post:', postId);
    import("../../api/publication")
      .then(({ publicationApi }) => {
        publicationApi
          .getCommentaires(String(postId))
          .then((res) => {
            console.log('[COMMENTS] Commentaires reçus:', res.data);
            const backendComments = res.data.map((c: any) => ({
              id: c.id_commentaire,
              authorId: c.developper_pseudo, // on stocke le pseudo comme ID temporaire
              author: c.developper_pseudo,
              country: "",
              photo: undefined,
              text: c.commentaire,
              createdAt: c.date_commentaire,
              // commentaire_parent est soit un UUID string, soit null
              parentId: c.commentaire_parent || undefined,
            }));
            console.log('[COMMENTS] Commentaires transformés:', backendComments);
            setPosts((current) =>
              current.map((p) =>
                p.id === postId ? { ...p, comments: backendComments } : p
              )
            );
          })
          .catch((err) => {
            console.error('[COMMENTS] Erreur chargement:', err);
          });
      })
      .catch((err) => {
        console.error('[COMMENTS] Erreur import:', err);
      });
  }

  // ─── Publication d'un post ────────────────────────────────────────────────
  async function publish(e: FormEvent) {
    e.preventDefault();
    if (uploading || busy || (!text.trim() && !attachments.length && !link.trim())) return;
    const url = link.trim() ? safePortfolio(link.trim()) : null;
    if (link.trim() && !url) {
      onNotice(t("Indique un lien HTTP(S) valide.", "Enter a valid HTTP(S) link."));
      return;
    }
    console.log('[PUBLISH] Début de la publication...');
    console.log('[PUBLISH] Texte:', text);
    console.log('[PUBLISH] Lien:', url);
    console.log('[PUBLISH] Fichiers:', attachments);
    
    setBusy(true);
    
    // Récupérer le fichier réel depuis IndexedDB si nécessaire
    let fileToUpload: File | undefined = undefined;
    if (attachments.length > 0) {
      try {
        const { readAttachment } = await import("../../lib/attachments");
        const blob = await readAttachment(attachments[0].id);
        if (blob) {
          fileToUpload = new File([blob], attachments[0].name, { type: attachments[0].type });
          console.log('[PUBLISH] Fichier récupéré depuis IndexedDB:', fileToUpload);
        }
      } catch (err) {
        console.error('[PUBLISH] Erreur lors de la récupération du fichier:', err);
      }
    }
    
    import("../../api/publication")
      .then(({ publicationApi }) => {
        console.log('[PUBLISH] Appel API...');
        publicationApi
          .creerPostForum({
            description: text.trim(),
            lien: url || undefined,
            fichier: fileToUpload,
          })
          .then((res) => {
            console.log('[PUBLISH] Réponse API:', res);
            const data = res.data;
            
            // Fonction pour transformer l'URL du fichier backend en format StoredAttachment
            const parseAttachmentResult = (fichierUrl: string | null | undefined, postId: string): StoredAttachment[] => {
              if (!fichierUrl) return [];
              const fileName = fichierUrl.split('/').pop() || 'fichier';
              const extension = fileName.split('.').pop()?.toLowerCase() || '';
              const mimeTypes: Record<string, string> = {
                pdf: 'application/pdf',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                xls: 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              };
              return [{
                id: `backend-${postId}`,
                name: fileName,
                type: mimeTypes[extension] || 'application/octet-stream',
                size: 0,
                url: fichierUrl,
              }];
            };
            
            const post: Post = {
              id: data.post?.id_publication || Date.now(),
              authorId: profile.id,
              author: profile.pseudo || profile.name,
              country: profile.country,
              tag: "Publication",
              title: "",
              attachments: parseAttachmentResult(data.post?.fichier, data.post?.id_publication),
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
              moderation: data.post?.feu_vert ? "approved" : "pending",
            };
            console.log('[PUBLISH] Post créé:', post);
            setPosts((current) => [post, ...current]);
            setReviews((current) => [
              makeReview(
                "post",
                post.id,
                post.text.slice(0, 70) || t("Publication avec pièce jointe", "Post with attachment"),
                [post.text, ...(post.links || [])].join("\n")
              ),
              ...current,
            ]);
            setText("");
            setAttachments([]);
            setLink("");
            onNotice(data.message || t("Publication envoyée à la modération.", "Post sent to moderation."));
          })
          .catch((err) => {
            console.error('[PUBLISH] Erreur API:', err);
            console.error('[PUBLISH] Détails:', err.response?.data);
            const msg =
              err?.response?.data?.raison ||
              t("Erreur lors de la publication.", "Error while publishing.");
            onNotice(msg);
          })
          .finally(() => setBusy(false));
      })
      .catch((err) => {
        console.error('[PUBLISH] Erreur import:', err);
        onNotice(t("Service indisponible.", "Service unavailable."));
        setBusy(false);
      });
  }

  const visible = posts
    .filter(
      (post) =>
        !post.moderation ||
        post.moderation === "approved" ||
        post.authorId === profile.id ||
        (!post.authorId && post.author === profile.name)
    )
    .sort((a, b) => {
      // Tri par date de publication (plus récent en premier)
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA; // Ordre décroissant
    });

  // Afficher les résultats de recherche s'il y a une recherche active, sinon les posts normaux
  const displayedPosts = isSearching && searchQuery.trim() 
    ? searchPeople.length > 0 
      ? [] // Ne pas afficher les posts si on a trouvé des personnes
      : searchResults 
    : visible;

  console.log('[FORUM] Posts totaux:', posts.length);
  console.log('[FORUM] Posts visibles après filtrage:', visible.length);
  console.log('[FORUM] Premier post:', posts[0]);
  console.log('[FORUM] Profile ID:', profile.id);
  console.log('[FORUM] Profile name:', profile.name);

  return (
    <div className="feed-layout">
      <section className="feed-column">
        {/* ─── Formulaire de publication ─── */}
        <form className="panel composer" onSubmit={publish}>
          <div className="row">
            <div className="person">
              <span className="avatar">{profile.name.slice(0, 2).toUpperCase()}</span>
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
            onChange={(e) => setText(e.target.value)}
            maxLength={3000}
          />
          <div className="composer-attachments">
            <AttachmentPicker
              label={t("Joindre des fichiers", "Attach files")}
              multiple
              onBusy={setUploading}
              onAdd={(files) => setAttachments((current) => [...current, ...files].slice(0, 5))}
            />
            <label className="composer-link">
              <Link2 size={18} />
              <input
                type="url"
                aria-label={t("Lien à partager", "Link to share")}
                placeholder={t("Lien vers un projet, une ressource…", "Link to a project or resource…")}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                maxLength={2000}
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
              className="btn-primary"
              disabled={busy || uploading || (!text.trim() && !attachments.length && !link.trim())}
            >
              <Plus size={18} />
              {busy ? t("En cours…", "Working…") : t("Publier", "Publish")}
            </button>
          </div>
        </form>

        {/* ─── Barre de recherche ─── */}
        <div className="panel search-bar">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="search"
              placeholder={t("Rechercher une personne (pseudo) ou une publication...", "Search for a person (username) or post...")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => handleSearch("")}
                aria-label={t("Effacer", "Clear")}
              >
                <X size={18} />
              </button>
            )}
          </div>
          {isSearching && searchQuery && (
            <small className="search-info">
              {searchPeople.length > 0
                ? `${searchPeople.length} personne(s) trouvée(s)`
                : searchResults.length > 0
                ? `${searchResults.length} publication(s) trouvée(s)`
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
                    onNavigate(`profil/membre/${encodeURIComponent(person.email)}`);
                    setSearchQuery("");
                    setSearchPeople([]);
                    setIsSearching(false);
                  }}
                >
                  <div className="person">
                    <span className="avatar">
                      {person.pseudo.slice(0, 2).toUpperCase()}
                    </span>
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
          const owner = post.authorId
            ? post.authorId === profile.id
            : post.author === profile.name;
          
          // Log pour déboguer
          if (editingPostId !== null) {
            console.log('[EDIT_CHECK] Post:', post.id, 'editingPostId:', editingPostId, 'Match:', editingPostId === post.id);
          }
          
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
                    {post.author.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <strong>{post.author}</strong>
                    <div className="post-meta">
                      <CountryFlag country={post.country} />
                    </div>
                  </div>
                </div>
                <PostMenu
                  saved={isSavedBy(post, profile.id)}
                  isOwned={owner}
                  onProfile={() =>
                    onNavigate(
                      owner
                        ? "profil"
                        : `profil/membre/${encodeURIComponent(post.authorId || post.author)}`
                    )
                  }
                  onSave={() => {
                    // sauvegarde locale
                    setPosts((current) =>
                      current.map((p) =>
                        p.id === post.id
                          ? {
                              ...p,
                              saved: !isSavedBy(p, profile.id),
                              savedBy: isSavedBy(p, profile.id)
                                ? (p.savedBy || []).filter((id) => id !== profile.id)
                                : [...(p.savedBy || []), profile.id],
                            }
                          : p
                      )
                    );
                    // sauvegarde backend
                    if (!isSavedBy(post, profile.id)) {
                      import("../../api/publication").then(({ publicationApi }) => {
                        publicationApi
                          .enregistrer("forum_post", String(post.id))
                          .catch(() => {/* silencieux */});
                      });
                    }
                    onNotice(
                      isSavedBy(post, profile.id)
                        ? t("Annonce retirée des enregistrements.", "Post removed from saved items.")
                        : t("Annonce enregistrée.", "Post saved.")
                    );
                  }}
                  onEdit={owner ? () => handleEditPost(post) : undefined}
                  onDelete={owner ? () => handleDeletePost(post.id) : undefined}
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
                  <button className="pending-review" onClick={() => onNavigate("ia/moderation")}>
                    <ShieldCheck size={13} />
                    {t("En attente de modération · démo", "Awaiting moderation · demo")}
                  </button>
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
                        maxLength={2000}
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

                  {!!post.attachments?.length && (
                    <div className="post-attachments">
                      {post.attachments.map((file) => (
                        <AttachmentCard key={file.id} file={file} />
                      ))}
                    </div>
                  )}

                  {post.moderation === "rejected" && (
                    <p className="blocked-post-status">
                      <ShieldCheck size={15} />
                      {t("Cette publication a été bloquée par la modération.", "This post has been blocked by moderation.")}
                    </p>
                  )}
                </>
              )}

              <div className="post-actions">
                {/* ─── Like/étoile ─── */}
                <button
                  className={`star-like ${post.starred ? "is-starred" : ""}`}
                  aria-label={`${t("Étoile", "Star")} : ${post.starCount}`}
                  aria-pressed={post.starred}
                  onClick={() => {
                    // mise à jour locale immédiate
                    setPosts((current) =>
                      current.map((p) =>
                        p.id === post.id
                          ? { ...p, starred: !p.starred, starCount: Math.max(0, p.starCount + (p.starred ? -1 : 1)) }
                          : p
                      )
                    );
                    // appel backend
                    import("../../api/publication").then(({ publicationApi }) => {
                      publicationApi.toggleNote(String(post.id)).catch(() => {
                        // annule le changement local en cas d'erreur
                        setPosts((current) =>
                          current.map((p) =>
                            p.id === post.id
                              ? { ...p, starred: !p.starred, starCount: Math.max(0, p.starCount + (p.starred ? 1 : -1)) }
                              : p
                          )
                        );
                      });
                    });
                  }}
                >
                  <Star size={21} fill={post.starred ? "currentColor" : "none"} />
                  <strong>{compactStars(post.starCount)}</strong>
                  <span>{t("Étoiles", "Stars")}</span>
                </button>

                {/* ─── Commentaires ─── */}
                <button
                  onClick={() => {
                    const nextState = commentPost === post.id ? null : post.id;
                    setCommentPost(nextState);
                    setComment("");
                    setReplyTo(null);
                    // charge les commentaires si on ouvre la section
                    if (nextState === post.id && post.comments.length === 0) {
                      loadComments(post.id);
                    }
                  }}
                >
                  <MessageCircle size={18} />
                  {post.comments.length} {t("commentaires", "comments")}
                </button>

                {post.collaboration && (
                  <button
                    className="collab-action"
                    onClick={() => onNavigate(`messages/prive/${encodeURIComponent(post.author)}`)}
                  >
                    <UsersRound size={17} />
                    {t("Proposer mon aide", "Offer help")}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* ─── Section commentaires ─── */}
              {commentPost === post.id && (
                <div className="comments">
                  {orderedComments(post.comments).map(({ comment: c, depth }) => {
                    const parent = post.comments.find((item) => item.id === c.parentId);
                    return (
                      <article
                        className={`comment-card ${parent ? "comment-reply" : ""}`}
                        key={c.id}
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
                                c.authorId === profile.id
                                  ? "profil"
                                  : `profil/membre/${encodeURIComponent(c.authorId || c.author)}`
                              )
                            }
                            aria-label={`${t("Voir le profil de", "View profile of")} ${c.author}`}
                          >
                            <span className="avatar">
                              {c.photo?.startsWith("data:image/") ? (
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
                          {/* Boutons modifier/supprimer si c'est mon commentaire ET qu'il existe en base */}
                          {c.author === (profile.pseudo || profile.name) && c.id.match(/^[a-f0-9-]{36}$/i) && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const newText = prompt(t("Modifier le commentaire", "Edit comment"), c.text);
                                  if (newText && newText.trim() && newText.trim() !== c.text) {
                                    import("../../api/publication").then(({ publicationApi }) => {
                                      publicationApi
                                        .modifierCommentaire(String(post.id), c.id, { commentaire: newText.trim() })
                                        .then(() => {
                                          setPosts((current) =>
                                            current.map((p) =>
                                              p.id === post.id
                                                ? {
                                                    ...p,
                                                    comments: p.comments.map((com) =>
                                                      com.id === c.id ? { ...com, text: newText.trim() } : com
                                                    ),
                                                  }
                                                : p
                                            )
                                          );
                                          onNotice(t("Commentaire modifié.", "Comment updated."));
                                        })
                                        .catch(() => onNotice(t("Erreur modification.", "Update failed.")));
                                    });
                                  }
                                }}
                              >
                                {t("Modifier", "Edit")}
                              </button>
                              <button
                                type="button"
                                className="danger"
                                onClick={() => {
                                  if (confirm(t("Supprimer ce commentaire ?", "Delete this comment?"))) {
                                    import("../../api/publication").then(({ publicationApi }) => {
                                      publicationApi
                                        .supprimerCommentaire(String(post.id), c.id)
                                        .then(() => {
                                          setPosts((current) =>
                                            current.map((p) =>
                                              p.id === post.id
                                                ? { ...p, comments: p.comments.filter((com) => com.id !== c.id) }
                                                : p
                                            )
                                          );
                                          onNotice(t("Commentaire supprimé.", "Comment deleted."));
                                        })
                                        .catch(() => onNotice(t("Erreur suppression.", "Delete failed.")));
                                    });
                                  }
                                }}
                              >
                                {t("Supprimer", "Delete")}
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    );
                  })}

                  {replyTo && post.comments.some((c) => c.id === replyTo) && (
                    <div className="reply-indicator">
                      {t("Répondre à", "Reply to")}{" "}
                      {post.comments.find((c) => c.id === replyTo)?.author}
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!comment.trim()) return;
                      
                      console.log('[COMMENT] Soumission commentaire...');
                      console.log('[COMMENT] Post ID:', post.id);
                      console.log('[COMMENT] Texte:', comment.trim());
                      console.log('[COMMENT] Reply to:', replyTo);
                      
                      const newComment = {
                        id: `comment-${Date.now()}`,
                        authorId: profile.id,
                        author: profile.pseudo || profile.name,
                        country: profile.country,
                        photo: profile.photo,
                        text: comment.trim(),
                        createdAt: new Date().toISOString(),
                        parentId: replyTo || undefined,
                      };
                      // mise à jour locale immédiate
                      setPosts((current) =>
                        current.map((p) =>
                          p.id === post.id
                            ? { ...p, comments: [...p.comments, newComment] }
                            : p
                        )
                      );
                      setComment("");
                      setReplyTo(null);
                      // appel backend
                      const payload: { commentaire: string; commentaire_parent?: string } = {
                        commentaire: newComment.text,
                      };
                      // Envoyer commentaire_parent UNIQUEMENT si c'est un UUID valide (commentaire déjà en base)
                      if (replyTo && replyTo.match(/^[a-f0-9-]{36}$/i)) {
                        payload.commentaire_parent = replyTo;
                      }
                      console.log('[COMMENT] Payload envoyé:', payload);
                      
                      import("../../api/publication").then(({ publicationApi }) => {
                        publicationApi
                          .ajouterCommentaire(String(post.id), payload)
                          .then((res) => {
                            console.log('[COMMENT] Réponse backend:', res);
                            // Remplacer le commentaire local par celui du backend
                            const backendComment = res.data.commentaire;
                            setPosts((current) =>
                              current.map((p) =>
                                p.id === post.id
                                  ? {
                                      ...p,
                                      comments: p.comments.map((com) =>
                                        com.id === newComment.id
                                          ? {
                                              id: backendComment.id_commentaire,
                                              authorId: backendComment.developper_pseudo,
                                              author: backendComment.developper_pseudo,
                                              country: "",
                                              photo: undefined,
                                              text: backendComment.commentaire,
                                              createdAt: backendComment.date_commentaire,
                                              parentId: backendComment.commentaire_parent || undefined,
                                            }
                                          : com
                                      ),
                                    }
                                  : p
                              )
                            );
                            onNotice(t("Commentaire envoyé.", "Comment sent."));
                          })
                          .catch((err) => {
                            console.error('[COMMENT] Erreur backend:', err);
                            console.error('[COMMENT] Détails:', err.response?.data);
                            onNotice(t("Erreur lors de l'envoi.", "Error while sending."));
                            // Retirer le commentaire local en cas d'erreur
                            setPosts((current) =>
                              current.map((p) =>
                                p.id === post.id
                                  ? { ...p, comments: p.comments.filter((com) => com.id !== newComment.id) }
                                  : p
                              )
                            );
                          });
                      });
                    }}
                  >
                    <input
                      id={`comment-input-${post.id}`}
                      required
                      maxLength={1500}
                      aria-label={t("Ajouter un commentaire", "Add a comment")}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t("Une réponse, un encouragement…", "An answer, an encouraging word…")}
                    />
                    <button className="btn-primary" aria-label={t("Envoyer le commentaire", "Send comment")}>
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })}

        {!visible.length && !loading && (
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
        .search-bar {
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--muted-color);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 2.75rem;
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          background: var(--input-bg, rgba(255, 255, 255, 0.05));
          font-size: 0.9375rem;
          color: var(--text-color);
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .search-input::placeholder {
          color: var(--muted-color);
        }

        .search-clear {
          position: absolute;
          right: 0.5rem;
          padding: 0.25rem;
          background: none;
          border: none;
          color: var(--muted-color);
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .search-clear:hover {
          background: var(--glass-border);
        }

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
      `}</style>

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
                await import("../../api/publication").then(({ publicationApi }) => 
                  publicationApi.signalerPost(String(report.id), reason)
                );
                
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
