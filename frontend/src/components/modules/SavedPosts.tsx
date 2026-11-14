import { ArrowRight, Bookmark, Trash2 } from "lucide-react";
import { apiError } from "../../api/client";
import { useSavedPublications } from "../../hooks/useSavedPublications";
import { useI18n } from "../../i18n/context";

export default function SavedPosts({ onNavigate, onNotice }: {
  onNavigate: (path: string) => void;
  onNotice: (message: string) => void;
}) {
  const { t } = useI18n();
  const { items, loading, error, busy, remove, retry } = useSavedPublications();

  async function removeSaved(id: number) {
    try {
      if (await remove(id)) onNotice(t("Enregistrement retiré.", "Saved item removed."));
    } catch (err) {
      onNotice(apiError(err, t("Impossible de retirer l’enregistrement.", "Could not remove the saved item.")));
    }
  }

  return <section className="panel saved-posts" id="enregistrements">
    <div className="section-title">
      <span className="round-icon"><Bookmark size={20} /></span>
      <div>
        <h2>{t("Mes enregistrements", "My saved posts")}</h2>
        <p>{t("Retrouve les publications et les offres que tu as enregistrées.", "Find the posts and offers you saved.")}</p>
      </div>
      {!loading && !error && <span className="saved-count">{items.length}</span>}
    </div>
    {loading && <p className="muted" role="status">{t("Chargement…", "Loading…")}</p>}
    {error && <div role="alert">
      <p className="form-error">{t("Impossible de charger tes enregistrements.", "Could not load saved items.")}</p>
      <button type="button" className="text-link" onClick={retry}>{t("Réessayer", "Retry")}</button>
    </div>}
    {!loading && !error && (items.length ? <div className="saved-post-list">
      {items.map(item => {
        const post = item.type === "forum_post";
        const path = post ? "communaute/publication" : "offres/offre";
        return <article key={item.id}>
          <div><strong>{item.publication.auteur}</strong></div>
          {post ? <p>{item.publication.description}</p> : <>
            <h3>{item.publication.nom_poste}</h3>
            <p>{item.publication.localisation}</p>
          </>}
          <footer>
            <button type="button" className="text-link" onClick={() => onNavigate(`${path}/${item.publication.id}`)}>
              {post ? t("Ouvrir la publication", "Open post") : t("Ouvrir l’offre", "Open offer")} <ArrowRight size={15} />
            </button>
            <button type="button" className="quiet" disabled={busy}
              aria-label={t("Retirer des enregistrements", "Remove from saved posts")}
              onClick={() => void removeSaved(item.id)}><Trash2 size={16} /></button>
          </footer>
        </article>;
      })}
    </div> : <p className="muted">{t("Tu n’as encore rien enregistré.", "You have no saved items yet.")}</p>)}
  </section>;
}
