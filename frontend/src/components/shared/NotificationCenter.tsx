import { useEffect, useRef, useState } from "react";
import { Bell, MessageCircle, Heart, Trash2, CheckCheck, ChevronRight, UserRound, X, AlertCircle } from "lucide-react";
import { type Profile } from "../../data/models";
import { useI18n } from "../../i18n/context";
import { notifApi } from "../../api/auth";

interface Notification {
  id: number
  type: string
  message: string
  lu: boolean
  date: string
  post_id?: number
  commentaire_id?: number
  offre_id?: number
}

export default function NotificationCenter({ profile, onNavigate }: { profile: Profile; onNavigate: (path: string) => void }) {
  const { t, locale } = useI18n()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  // Charger les notifications au montage et périodiquement
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()

    // Recharger toutes les 30 secondes
    const interval = setInterval(() => {
      loadUnreadCount()
      if (open) {
        loadNotifications()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [open])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await notifApi.getMesNotifications()
      setNotifications(response.data)
    } catch (err) {
      console.error('Erreur chargement notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await notifApi.compterNonLues()
      setUnreadCount(response.data.count)
    } catch (err) {
      console.error('Erreur comptage notifications:', err)
    }
  }

  const handleMarkAsRead = async (notifId: number) => {
    try {
      await notifApi.marquerLue(notifId)
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, lu: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Erreur marquage notification:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notifApi.marquerToutesLues()
      setNotifications(prev => prev.map(n => ({ ...n, lu: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Erreur marquage toutes notifications:', err)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'commentaire':
      case 'reponse_commentaire':
        return <MessageCircle size={20} />
      case 'like':
        return <Heart size={20} className="text-red-400" />
      case 'post_supprime':
        return <Trash2 size={20} className="text-red-400" />
      case 'post_refuse':
        return <AlertCircle size={20} className="text-yellow-400" />
      default:
        return <UserRound size={20} />
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t('À l\'instant', 'Just now')
    if (minutes < 60) return t(`Il y a ${minutes} min`, `${minutes}m ago`)
    if (hours < 24) return t(`Il y a ${hours}h`, `${hours}h ago`)
    if (days < 7) return t(`Il y a ${days}j`, `${days}d ago`)
    
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date)
  }

  const handleNotificationClick = (notif: Notification) => {
    // Marquer comme lue
    handleMarkAsRead(notif.id)
    setOpen(false)

    // Navigation selon le type de notification
    if (notif.post_id) {
      // Pour les notifications liées à un post du forum
      onNavigate(`communaute/publication/${notif.post_id}`)
    } else if (notif.offre_id) {
      // Pour les notifications liées à une offre d'emploi
      onNavigate(`offres/offre/${notif.offre_id}`)
    }
    // Si pas d'ID, pas de navigation (notifications générales)
  }

  // Fermer au clic extérieur
  useEffect(() => {
    if (!open) return
    
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <div className="notification-center" ref={ref}>
      <button
        ref={trigger}
        className="notification-bell"
        aria-label={`${t("Notifications")}${unreadCount ? `, ${unreadCount} ${t("non lues", "unread")}` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section className="notification-panel" aria-label={t("Notifications")}>
          <header>
            <h2>{t("Notifications")}</h2>
            <button
              className="quiet"
              aria-label={t("Fermer")}
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </header>

          {notifications.length > 0 && unreadCount > 0 && (
            <button className="mark-read" onClick={handleMarkAllAsRead}>
              <CheckCheck size={15} />
              {t("Tout marquer comme lu", "Mark all as read")}
            </button>
          )}

          <div className="notification-list">
            {loading && notifications.length === 0 ? (
              <p className="notifications-empty">
                {t("Chargement...", "Loading...")}
              </p>
            ) : notifications.length > 0 ? (
              notifications.map(notif => (
                <button
                  key={notif.id}
                  className={`notification-item ${notif.lu ? "" : "unread"}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <span className="notification-symbol">
                    {getNotificationIcon(notif.type)}
                  </span>
                  <span>
                    <strong>{notif.message}</strong>
                    <small>{formatDate(notif.date)}</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
              ))
            ) : (
              <p className="notifications-empty">
                {t(
                  "Aucune notification pour le moment.",
                  "No notifications yet."
                )}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
