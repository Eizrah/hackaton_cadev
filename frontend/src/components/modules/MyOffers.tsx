import { useEffect, useState } from 'react'
import { publicationApi } from '../../api/publication'
import { MapPin, Briefcase, Calendar, ExternalLink, Mail, Trash2, Users } from 'lucide-react'
import OfferCandidates from './OfferCandidates'
import ConfirmDialog from '../shared/ConfirmDialog'
import { useI18n } from '../../i18n/context'
import { mediaUrl } from '../../api/client'

interface Offre {
  id_publication: string
  description: string
  nom_poste: string
  localisation: string
  type_contrat: 'CDI' | 'CDD' | 'Stage' | 'Freelance'
  duree?: string
  competence_requise: string
  type_travail: 'R' | 'S' | 'H'
  deadline: string
  lien?: string
  email?: string
  fichier?: string
  date_publication: string
  developper_email: string
  feu_vert: boolean
  candidatures_count?: number
}

interface MyOffersProps {
  onNavigate: (path: string) => void
  onNotice: (message: string) => void
  focusJob?: string
}

export default function MyOffers({ onNavigate, onNotice, focusJob }: MyOffersProps) {
  const { t } = useI18n()
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null)
  const [removing, setRemoving] = useState<Offre | null>(null)

  useEffect(() => {
    loadOffres()
  }, [focusJob])

  const loadOffres = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await publicationApi.getMesOffres()
      const owned: Offre[] = response.data
      setOffres(owned)
      if (focusJob) setSelectedOffre(owned.find(offre => offre.id_publication === focusJob) || null)
    } catch (err: any) {
      console.error('Erreur chargement offres:', err)
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const getTypeTravail = (type: string) => {
    switch (type) {
      case 'R': return 'Remote'
      case 'S': return 'Sur site'
      case 'H': return 'Hybride'
      default: return type
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return <div id="recrutement" className="text-center py-8 text-gray-400">Chargement...</div>
  }

  if (error) {
    return <div id="recrutement" className="text-center py-8 text-red-400">{error}</div>
  }

  if (offres.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Vous n'avez publié aucune offre d'emploi
      </div>
    )
  }

  return (
    <section id="recrutement" className="panel my-offers space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Mes offres d'emploi</h2>
      
      {offres.map((offre) => (
        <div
          key={offre.id_publication}
          className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{offre.nom_poste}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {offre.localisation}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {offre.type_contrat}
                  {offre.duree && ` - ${offre.duree}`}
                </span>
                <span>{getTypeTravail(offre.type_travail)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!offre.feu_vert && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                  En attente
                </span>
              )}
              <button
                onClick={() => setSelectedOffre(offre)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
                title={t("Voir les candidatures", "View applications")}
                aria-label={t("Voir les candidatures", "View applications")}
              >
                <Users className="w-5 h-5 text-blue-400" />
                {offre.candidatures_count !== undefined && offre.candidatures_count > 0 && (
                  <span className="ml-1 text-xs text-gray-400">
                    ({offre.candidatures_count})
                  </span>
                )}
              </button>
              <button
                onClick={() => setRemoving(offre)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
                title={t("Supprimer l’offre", "Delete offer")}
                aria-label={t("Supprimer l’offre", "Delete offer")}
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-3">{offre.description}</p>

          {/* Compétences */}
          <div className="mb-3">
            <span className="text-xs text-gray-400 uppercase">Compétences requises:</span>
            <p className="text-sm text-gray-300 mt-1">{offre.competence_requise}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-400 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Publié le {formatDate(offre.date_publication)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Deadline: {formatDate(offre.deadline)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {offre.email && (
                <a
                  href={`mailto:${offre.email}`}
                  className="flex items-center gap-1 text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              )}
              {offre.lien && (
                <a
                  href={offre.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Lien
                </a>
              )}
              {offre.fichier && (
                <a
                  href={mediaUrl(offre.fichier)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  📎 Fichier
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Modal de gestion des candidatures */}
      {selectedOffre && <OfferCandidates
        key={selectedOffre.id_publication}
        offreId={selectedOffre.id_publication}
        offreTitre={selectedOffre.nom_poste}
        onClose={() => setSelectedOffre(null)}
        onNavigate={onNavigate}
      />}
      {removing && <ConfirmDialog
        title={t("Supprimer cette offre ?", "Delete this offer?")}
        description={removing.nom_poste}
        onClose={() => setRemoving(null)}
        onConfirm={async () => {
          await publicationApi.supprimerOffre(removing.id_publication)
          setOffres(current => current.filter(offre => offre.id_publication !== removing.id_publication))
          onNotice(t("Offre supprimée.", "Offer deleted."))
        }}
      />}
    </section>
  )
}
