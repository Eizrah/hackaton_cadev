import { useState } from 'react'
import { Flag } from 'lucide-react'
import Modal from '../Modal'
import { useI18n } from '../../i18n/context'

type ReportTarget = {
  type: 'post' | 'offre' | 'dev' | 'groupe'
  id: string
  name?: string
}

type ReportModalProps = {
  target: ReportTarget | null
  onClose: () => void
  onSubmit: (motif: string) => Promise<void> | void
  onNotice: (message: string) => void
}

export function ReportModal({ target, onClose, onSubmit, onNotice }: ReportModalProps) {
  const { t } = useI18n()
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!target) return null

  const titles = {
    post: t("Signaler une publication", "Report a post"),
    offre: t("Signaler une offre d'emploi", "Report a job offer"),
    dev: t("Signaler un utilisateur", "Report a user"),
    groupe: t("Signaler un groupe", "Report a group"),
  }

  const categories = [
    ["Harcèlement", "Harassment"],
    ["Propos inappropriés ou haineux", "Inappropriate or hateful language"],
    ["Fausses informations", "False information"],
    ["Arnaque ou fraude", "Scam or fraud"],
    ["Spam ou publicité abusive", "Spam or abusive advertising"],
    ["Atteinte à la vie privée", "Privacy violation"],
    ["Contenu illégal", "Illegal content"],
    ["Autres", "Other"],
  ] as const

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    const detail = String(new FormData(e.currentTarget).get("reason") || "").trim()
    if (!category || (category === "Autres" && !detail)) return

    const motif = `${category}${detail ? ` : ${detail}` : ""}`

    setSubmitting(true)
    try {
      await onSubmit(motif)
      
      // Log local pour l'interface Assistant (simulation de modération)
      try {
        const id = Date.now()
        const reports = JSON.parse(localStorage.getItem("devafrica:reports") || "[]")
        localStorage.setItem(
          "devafrica:reports",
          JSON.stringify([
            ...reports,
            {
              id,
              target: target.id,
              targetType: target.type,
              targetName: target.name,
              reason: motif,
              date: new Date().toISOString(),
            },
          ])
        )
      } catch {
        /* silencieux */
      }

      onNotice(
        t(
          "Signalement envoyé. Merci de contribuer à une communauté bienveillante.",
          "Report sent. Thank you for helping keep the community welcoming."
        )
      )
      onClose()
    } catch (error: any) {
      if (error.response?.data?.erreur) {
        onNotice(error.response.data.erreur)
      } else {
        onNotice(t("Erreur lors de l'envoi du signalement.", "Error sending report."))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={titles[target.type]} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <p>
          {t(
            "Explique la raison de ton signalement.",
            "Explain why you are reporting this."
          )}
        </p>

        <label>
          {t("Motif du signalement", "Report category")}
          <select
            className="rounded-select report-category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={submitting}
          >
            <option value="" disabled>
              {t("Choisir un motif", "Choose a reason")}
            </option>
            {categories.map(([fr, en]) => (
              <option key={fr} value={fr}>
                {t(fr, en)}
              </option>
            ))}
          </select>
        </label>

        {category && (
          <label>
            {category === "Autres"
              ? t(
                  "Explique la raison de ton signalement.",
                  "Explain why you are reporting this."
                )
              : t("Précisions (facultatif)", "Details (optional)")}
            <textarea
              name="reason"
              required={category === "Autres"}
              maxLength={1000}
              placeholder={t(
                "Décris les faits pour aider la modération…",
                "Describe what happened to help moderation…"
              )}
              disabled={submitting}
            />
          </label>
        )}

        <button className="btn-primary" disabled={submitting}>
          <Flag size={16} />
          {submitting
            ? t("Envoi en cours...", "Sending...")
            : t("Envoyer le signalement", "Send report")}
        </button>
      </form>
    </Modal>
  )
}
