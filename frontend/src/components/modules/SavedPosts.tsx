import { Bookmark, ArrowRight, Trash2 } from "lucide-react";
import { initialPosts, isSavedBy, migratePosts, type Profile } from "../../data/models";
import { useLocalData } from "../../lib/storage";
import { useI18n } from "../../i18n/context";
import { CountryFlag } from "../CountryFlag";
export default function SavedPosts({ profile, onNavigate }: { profile: Profile; onNavigate: (path: string) => void }) {
  const { t } = useI18n(), [posts, setPosts] = useLocalData("posts", initialPosts, migratePosts), saved = posts.filter(p => isSavedBy(p, profile.id));
  return <section
    className="panel saved-posts"
    id="enregistrements">
    <div className="section-title">
      <span className="round-icon">
        <Bookmark size={20} />
      </span>
      <div>
        <h2>
          {t("Mes enregistrements", "My saved posts")}
        </h2>
        <p>
          {t("Les publications que tu souhaites retrouver plus tard.", "Posts you want to come back to later.")}
        </p>
      </div>
      <span className="saved-count">
        {saved.length}
      </span>
    </div>
    {saved.length ? <div className="saved-post-list">
      {saved.map(post => <article key={post.id}>
        <div>
          <strong>
            {post.author}
          </strong>
          <CountryFlag country={post.country} />
        </div>
        {post.title && <h3>
          {post.title}
        </h3>}
        <p>
          {post.text}
        </p>
        <footer>
          <button
            className="text-link"
            onClick={() => onNavigate(`communaute/publication/${post.id}`)}>
            {t("Ouvrir la publication", "Open post")}
            <ArrowRight size={15} />
          </button>
          <button
            className="quiet"
            aria-label={t("Retirer des enregistrements", "Remove from saved posts")}
            onClick={() => setPosts(current => current.map(p => p.id === post.id ? { ...p, saved: false, savedBy: (p.savedBy || ["dev-juliana"]).filter(id => id !== profile.id) } : p))}>
            <Trash2 size={16} />
          </button>
        </footer>
      </article>)}
    </div> : <p className="muted">
      {t("Utilise les trois points d’une publication, puis Enregistrer l’annonce.", "Open a post’s three-dot menu and choose Save post.")}
    </p>}
  </section>;
}
