import React, { useEffect, useState } from 'react'
import { publicationApi } from '../../api/publication'
import { User, Calendar, FileText, Mail, Check, X, Clock, ExternalLink } from 'lucide-react'

interface Candidature {
  id: number
  candidat_nom: string
  candidat_email: string
  candidat_pseudo?: string
  lettre_motivation: string
  pj?: string
  etat: 'en_attente' | 'accepte' | 'refuse'
  date_candidature: string
}

interface OfferCandidatesProps {
  offreId: string
  offreTitre: string
  onClose?: () => void
  onNavigate?: (path: string) => void
}

type FilterState = 'tous' | 'en_attente' | 'accepte' | 'refuse'

export default function OfferCandidates({ offreId, offreTitre, onClose, onNavigate }: OfferCandidatesProps) {
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterState>('tous')
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    loadCandidatures()
  }, [filter])

  const loadCandidatures = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const etat = filter === 'tous' ? undefined : filter
      const response = await publicationApi.candidaturesOffre(offreId, etat)
      
      console.log('Candidatures offre:', response.data)
      setCandidatures(response.data)
    } catch (err: any) {
      console.error('Erreur chargement candidatures:', err)
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleTraiter = async (candidatureId: number, nouveauEtat: 'accepte' | 'refuse') => {
    try {
      setProcessing(candidatureId)
      setError(null)

      await publicationApi.traiterCandidature(offreId, candidatureId, nouveauEtat)
      
      // Mettre à jour l'état local
      setCandidatures(prev =>
        prev.map(c =>
          c.id === candidatureId ? { ...c, etat: nouveauEtat } : c
        )
      )
    } catch (err: any) {
      console.error('Erreur traitement candidature:', err)
      setError(err.response?.data?.message || 'Erreur lors du traitement')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEtatBadge = (etat: string) => {
    switch (etat) {
      case 'en_attente':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            En attente
          </span>
        )
      case 'accepte':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            <Check className="w-4 h-4" />
            Accepté
          </span>
        )
      case 'refuse':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            <X className="w-4 h-4" />
            Refusé
          </span>
        )
      default:
        return null
    }
  }

  const stats = {
    total: candidatures.length,
    en_attente: candidatures.filter(c => c.etat === 'en_attente').length,
    accepte: candidatures.filter(c => c.etat === 'accepte').length,
    refuse: candidatures.filter(c => c.etat === 'refuse').length,
  }

  return (
    <div className="bg-[#1a1a2e] rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Candidatures reçues</h2>
        <p className="text-gray-400">Pour l'offre : {offreTitre}</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('tous')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
            filter === 'tous'
              ? 'bg-blue-600 text-white'
              : 'bg-[#0f0f1e] text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Tous ({stats.total})
        </button>
        <button
          onClick={() => setFilter('en_attente')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
            filter === 'en_attente'
              ? 'bg-yellow-600 text-white'
              : 'bg-[#0f0f1e] text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          En attente ({stats.en_attente})
        </button>
        <button
          onClick={() => setFilter('accepte')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
            filter === 'accepte'
              ? 'bg-green-600 text-white'
              : 'bg-[#0f0f1e] text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Accepté ({stats.accepte})
        </button>
        <button
          onClick={() => setFilter('refuse')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
            filter === 'refuse'
              ? 'bg-red-600 text-white'
              : 'bg-[#0f0f1e] text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Refusé ({stats.refuse})
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          Chargement...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && candidatures.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Aucune candidature</p>
          <p className="text-sm">
            {filter === 'tous'
              ? "Aucun candidat n'a encore postulé à cette offre"
              : `Aucune candidature avec le statut "${filter.replace('_', ' ')}"`}
          </p>
        </div>
      )}

      {/* Candidatures List */}
      {!loading && !error && candidatures.length > 0 && (
        <div className="space-y-4">
          {candidatures.map((candidature) => (
            <div
              key={candidature.id}
              className="bg-[#0f0f1e] border border-gray-800 rounded-lg p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {candidature.candidat_nom}
                      </h3>
                      {candidature.candidat_pseudo && onNavigate && (
                        <button
                          onClick={() => onNavigate(`profil/${candidature.candidat_pseudo}`)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition"
                          title="Voir le profil"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Voir profil
                        </button>
                      )}
                    </div>
                    {candidature.candidat_pseudo && (
                      <p className="text-sm text-gray-400">@{candidature.candidat_pseudo}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <a
                        href={`mailto:${candidature.candidat_email}`}
                        className="flex items-center gap-1 hover:text-blue-400 transition"
                      >
                        <Mail className="w-4 h-4" />
                        {candidature.candidat_email}
                      </a>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(candidature.date_candidature)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getEtatBadge(candidature.etat)}
                </div>
              </div>

              {/* Lettre de motivation */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase mb-2">Lettre de motivation:</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {candidature.lettre_motivation}
                </p>
              </div>

              {/* Footer avec actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                {/* CV Link */}
                {candidature.pj && (
                  <a
                    href={candidature.pj}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:underline text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Télécharger le CV
                  </a>
                )}

                {/* Action buttons */}
                {candidature.etat === 'en_attente' && (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleTraiter(candidature.id, 'refuse')}
                      disabled={processing === candidature.id}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Refuser
                    </button>
                    <button
                      onClick={() => handleTraiter(candidature.id, 'accepte')}
                      disabled={processing === candidature.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Accepter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close button if provided */}
      {onClose && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  )
}
