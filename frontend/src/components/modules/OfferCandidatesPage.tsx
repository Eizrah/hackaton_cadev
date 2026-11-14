import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicationApi } from '../../api/publication'
import OfferCandidates from './OfferCandidates'
import { ArrowLeft } from 'lucide-react'

export default function OfferCandidatesPage() {
  const { offreId } = useParams<{ offreId: string }>()
  const navigate = useNavigate()
  const [offreTitre, setOffreTitre] = useState<string>('Offre d\'emploi')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!offreId) return

    // Charger les détails de l'offre pour avoir le titre
    const loadOffre = async () => {
      try {
        const response = await publicationApi.getOffre(offreId)
        setOffreTitre(response.data.nom_poste)
      } catch (err) {
        console.error('Erreur chargement offre:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOffre()
  }, [offreId])

  if (!offreId) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-400">ID d'offre manquant</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <OfferCandidates
        offreId={offreId}
        offreTitre={offreTitre}
        onClose={() => navigate(-1)}
      />
    </div>
  )
}
