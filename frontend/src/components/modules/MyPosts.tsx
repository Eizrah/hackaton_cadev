import { useState, useEffect } from "react";
import { FileText, Trash2, Edit3, Eye, EyeOff } from "lucide-react";
import { useI18n } from "../../i18n/context";
import type { Profile } from "../../data/models";
import { publicationApi } from "../../api/publication";
import { apiError, mediaUrl } from "../../api/client";
import ConfirmDialog from "../shared/ConfirmDialog";

interface MyPost {
  id: string;
  description: string;
  date_publication: string;
  feu_vert: boolean;
  lien?: string;
  fichier?: string;
  nombre_notes: number;
}

export default function MyPosts({
  onNotice,
}: {
  profile: Profile;
  onNotice: (msg: string) => void;
}) {
  const { t } = useI18n();
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editLink, setEditLink] = useState("");
  const [removing, setRemoving] = useState<string>();

  useEffect(() => {
    let active = true;
    void publicationApi.getMesPostsForum().then(({ data }) => {
      if (!active) return;
      const rows: (Omit<MyPost, "id"> & { id_publication: string })[] = data;
      setPosts(rows.map(({ id_publication, ...post }) => ({ ...post, id: id_publication })));
    }).catch(error => {
      if (active) onNotice(apiError(error, t("Erreur lors du chargement.", "Error loading posts.")));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  function handleEdit(post: MyPost) {
    setEditingId(post.id);
    setEditText(post.description);
    setEditLink(post.lien || "");
  }

  async function handleSaveEdit(postId: string) {
    const description = editText.trim();
    const lien = editLink.trim();
    if (!description) {
      onNotice(t("Le texte ne peut pas être vide.", "Text cannot be empty."));
      return;
    }
    try {
      const { data } = await publicationApi.modifierPostForum(postId, { description, lien: lien || null });
      setPosts(current => current.map(post => post.id === postId
        ? { ...post, description, lien: lien || undefined, feu_vert: data.post.feu_vert } : post));
      setEditingId(null);
      onNotice(t("Publication modifiée.", "Post updated."));
    } catch (error) {
      onNotice(apiError(error, t("Erreur lors de la modification.", "Update failed.")));
    }
  }

  if (loading) {
    return (
      <div className="panel">
        <h2>{t("Mes publications", "My posts")}</h2>
        <p>{t("Chargement...", "Loading...")}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="panel">
        <h2>
          <FileText size={20} />
          {t("Mes publications", "My posts")}
        </h2>
        <p className="muted">
          {t("Vous n'avez pas encore publié dans la communauté.", "You haven't published anything yet.")}
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>
        <FileText size={20} />
        {t("Mes publications", "My posts")}
      </h2>
      <p className="muted">
        {posts.length} {t("publication(s)", "post(s)")}
      </p>

      <div className="my-posts-list">
        {posts.map((post) => (
          <article key={post.id} className={`my-post-card ${!post.feu_vert ? "pending" : ""}`}>
            <div className="my-post-header">
              <div className="my-post-status">
                {post.feu_vert ? (
                  <>
                    <Eye size={16} className="status-icon approved" />
                    <span className="status-label approved">{t("Publié", "Published")}</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={16} className="status-icon pending" />
                    <span className="status-label pending">{t("En attente", "Pending")}</span>
                  </>
                )}
              </div>
              <time dateTime={post.date_publication}>
                {new Intl.DateTimeFormat("fr", { dateStyle: "short", timeStyle: "short" }).format(
                  new Date(post.date_publication)
                )}
              </time>
            </div>

            {editingId === post.id ? (
              <div className="my-post-edit">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  maxLength={3000}
                  rows={4}
                />
                <input
                  type="url"
                  placeholder={t("Lien (optionnel)", "Link (optional)")}
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                />
                <div className="my-post-edit-actions">
                  <button className="btn-primary" onClick={() => handleSaveEdit(post.id)}>
                    {t("Enregistrer", "Save")}
                  </button>
                  <button className="btn-secondary" onClick={() => setEditingId(null)}>
                    {t("Annuler", "Cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="my-post-text">{post.description}</p>
                {post.lien && (
                  <a href={post.lien} target="_blank" rel="noopener noreferrer" className="my-post-link">
                    {post.lien}
                  </a>
                )}
                {post.fichier && (
                  <div className="my-post-attachment">
                    <FileText size={16} />
                    <a href={mediaUrl(post.fichier)} target="_blank" rel="noopener noreferrer">
                      {t("Ouvrir la pièce jointe", "Open attachment")}
                    </a>
                  </div>
                )}
                <div className="my-post-footer">
                  <span className="my-post-likes">
                    ★ {post.nombre_notes} {t("like(s)", "like(s)")}
                  </span>
                  <div className="my-post-actions">
                    <button onClick={() => handleEdit(post)} title={t("Modifier", "Edit")}>
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => setRemoving(post.id)} title={t("Supprimer", "Delete")} className="danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>

      <style>{`
        .my-posts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .my-post-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 1rem;
        }

        .my-post-card.pending {
          opacity: 0.7;
          border-left: 3px solid var(--warning-color, orange);
        }

        .my-post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .my-post-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-icon.approved {
          color: var(--success-color, #22c55e);
        }

        .status-icon.pending {
          color: var(--warning-color, orange);
        }

        .status-label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-label.approved {
          color: var(--success-color, #22c55e);
        }

        .status-label.pending {
          color: var(--warning-color, orange);
        }

        .my-post-text {
          margin: 0.5rem 0;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .my-post-link {
          display: block;
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.875rem;
          margin: 0.5rem 0;
        }

        .my-post-link:hover {
          text-decoration: underline;
        }

        .my-post-attachment {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--muted-color);
          font-size: 0.875rem;
          margin: 0.5rem 0;
        }

        .my-post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--glass-border);
        }

        .my-post-likes {
          color: var(--muted-color);
          font-size: 0.875rem;
        }

        .my-post-actions {
          display: flex;
          gap: 0.5rem;
        }

        .my-post-actions button {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .my-post-actions button:hover {
          background: var(--glass-border);
        }

        .my-post-actions button.danger:hover {
          background: var(--danger-bg, rgba(239, 68, 68, 0.1));
          color: var(--danger-color, #ef4444);
        }

        .my-post-edit {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .my-post-edit textarea,
        .my-post-edit input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--glass-border);
          border-radius: 6px;
          background: var(--input-bg);
          font-family: inherit;
          resize: vertical;
        }

        .my-post-edit-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-secondary {
          background: var(--glass-border);
          color: var(--text-color);
        }

        .btn-secondary:hover {
          opacity: 0.8;
        }
      `}</style>
      {removing && <ConfirmDialog
        title={t("Supprimer cette publication ?", "Delete this post?")}
        onClose={() => setRemoving(undefined)}
        onConfirm={async () => {
          await publicationApi.supprimerPostForum(removing);
          setPosts(current => current.filter(post => post.id !== removing));
          onNotice(t("Publication supprimée.", "Post deleted."));
        }}
      />}
    </div>
  );
}
