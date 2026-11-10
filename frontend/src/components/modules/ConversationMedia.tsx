import { useState } from "react";
import { ExternalLink, FileText, Images, Link2, Search } from "lucide-react";
import { useI18n } from "../../i18n/context";
import type { StoredAttachment } from "../../lib/attachments";
import { AttachmentCard } from "../shared/Attachments";
import Modal from "../Modal";
export type SharedLink = { id: string | number; url: string; title: string };
export default function ConversationMedia({ title, files, links, initialTab = "photos", onClose }: { title: string; files: StoredAttachment[]; links: SharedLink[]; initialTab?: "photos" | "files" | "links"; onClose: () => void }) {
  const { t } = useI18n(), [tab, setTab] = useState(initialTab), [query, setQuery] = useState("");
  const photos = files.filter(f => f.type.startsWith("image/")), documents = files.filter(f => !f.type.startsWith("image/")), visible = (tab === "photos" ? photos : documents).filter(f => f.name.toLowerCase().includes(query.toLowerCase())), visibleLinks = links.filter(l => `${l.title} ${l.url}`.toLowerCase().includes(query.toLowerCase()));
  return <Modal
    size="wide"
    title={t("Médias, fichiers et liens", "Media, files and links")}
    onClose={onClose}>
    <p className="media-conversation-name">
      {title}
    </p>
    <div
      className="media-tabs"
      role="tablist"
      aria-label={t("Contenu partagé", "Shared content")}>
      {([['photos', Images, t("Photos", "Photos"), photos.length], ['files', FileText, t("Fichiers", "Files"), documents.length], ['links', Link2, t("Liens", "Links"), links.length]] as const).map(([key, Icon, label, count]) => <button
        type="button"
        role="tab"
        aria-selected={tab === key}
        className={tab === key ? "active" : ""}
        key={key}
        onClick={() => setTab(key)}>
        <Icon size={18} />
        {label}
        <span>
          {count}
        </span>
      </button>)}
    </div>
    <label className="media-search">
      <Search size={18} />
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t("Rechercher dans les éléments partagés…", "Search shared items…")}
        aria-label={t("Rechercher un élément partagé", "Search a shared item")} />
    </label>
    <div
      role="tabpanel"
      className={`shared-media-grid media-${tab}`}>
      {tab === "links" ? visibleLinks.map(link => <a
        className="shared-link-card"
        href={link.url}
        key={link.id}
        target="_blank"
        rel="noopener noreferrer">
        <Link2 size={23} />
        <span>
          <strong>
            {link.title}
          </strong>
          <small>
            {link.url}
          </small>
        </span>
        <ExternalLink size={15} />
      </a>) : visible.map(file => <AttachmentCard
        key={file.id}
        file={file} />)}
      {!(tab === "links" ? visibleLinks.length : visible.length) && <div className="media-empty">
        <Images size={35} />
        <p>
          {t("Aucun élément dans cette sélection.", "No items in this selection.")}
        </p>
      </div>}
    </div>
  </Modal>;
}
