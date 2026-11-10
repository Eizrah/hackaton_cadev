import { ArrowRight, MessageCircle, Newspaper, Star } from "lucide-react";
import { initialPosts, migratePosts } from "../data/models";
import { useLocalData } from "../lib/storage";
import { compactStars } from "../lib/format";
import { CountryFlag } from "./CountryFlag";
import { useI18n } from "../i18n/context";
import { countryLabel } from "../lib/countries";
export default function HomeHighlights({ onExplore }: { onExplore: () => void }) {
  const { t, language } = useI18n(), [posts] = useLocalData("posts", initialPosts, migratePosts), approved = posts.filter(p => !p.moderation || p.moderation === "approved");
  const latest = [...approved].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "")).slice(0, 3), popular = approved.filter(p => p.tag === "Projet").sort((a, b) => b.starCount - a.starCount).slice(0, 3);
  return <section className="home-highlights">
    <div className="home-news">
      <div className="highlight-heading">
        <span>
          <Newspaper size={19} />
          {t("LA COMMUNAUTÉ EN MOUVEMENT", "FROM THE COMMUNITY")}
        </span>
        <h2>
          {t("Actualités de la communauté", "Community news")}
        </h2>
        <p>
          {t("Les idées se partagent. Les projets prennent vie.", "Ideas are shared. Projects come to life.")}
        </p>
      </div>
      <div className="home-news-grid">
        {latest.map(post => <button
          className="home-news-card"
          key={post.id}
          onClick={onExplore}>
          <span className="home-post-tag">
            {t(post.tag)}
          </span>
          <h3>
            {post.title || post.text.slice(0, 60)}
          </h3>
          <p>
            {post.text}
          </p>
          <div>
            <span className="avatar">
              {post.author.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </span>
            <span>
              <strong>
                {post.author}
              </strong>
              <CountryFlag country={post.country} />
            </span>
            <ArrowRight size={18} />
          </div>
        </button>)}
      </div>
    </div>
    <div className="home-popular">
      <div className="highlight-heading">
        <span>
          <Star size={19} />
          {t("LES COUPS DE CŒUR DES DEVS", "DEVELOPER FAVOURITES")}
        </span>
        <h2>
          {t("Projets populaires", "Popular projects")}
        </h2>
      </div>
      {popular.length ? popular.map(post => <button
        className="popular-project"
        onClick={onExplore}
        key={post.id}>
        <span
          className="popular-project-art"
          aria-hidden="true">&lt;/&gt;</span>
        <span>
          <strong>
            {post.title}
          </strong>
          <small>{post.author} · {countryLabel(post.country, language)}</small>
          <span>
            <Star size={14} />
            {compactStars(post.starCount)}
            <MessageCircle size={14} />
            {post.comments.length}
          </span>
        </span>
        <ArrowRight size={20} />
      </button>) : <p>
        {t("Partage ton premier projet avec la communauté.", "Share your first project with the community.")}
      </p>}
      <button
        className="home-explore-link"
        onClick={onExplore}>
        {t("Explorer la communauté", "Explore the community")}
        <ArrowRight size={17} />
      </button>
    </div>
  </section>;
}
