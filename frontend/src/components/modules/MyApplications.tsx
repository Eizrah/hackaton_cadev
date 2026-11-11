import React, { useEffect, useState } from 'react'
import { publicationApi } from '../../api/publication'
import { MapPin, Briefcase, Calendar, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Candidature {
  id: number
  offre_id: string
  offre_titre: string
  offre_entreprise?: string
  offre_localisation?: string
  offre_type_contrat?: string
  lettre_motivation: string
  pj?: string
  etat: 'en_attente' | 'accepte' | 'refuse'
  date_candidature: string
}

type FilterState = 'tous' | 'en_attente' | 'accepte' | 'refuse'

export default function MyApplications() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterState>('tous')

  useEffect(() => {
    loadCandidatures()
  }, [filter])

  const loadCandidatures = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const etat = filter === 'tous' ? undefined : filter
      const response = await publicationApi.mesCandidatures(etat)
      
      console.log('Candidatures:', response.data)
      setCandidatures(response.data)
    } catch (err: any) {
      console.error('Erreur chargement candidatures:', err)
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
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
            <CheckCircle className="w-4 h-4" />
            Accepté
          </span>
        )
      case 'refuse':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            <XCircle className="w-4 h-4" />
            Refusé
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const stats = {
    total: candidatures.length,
    en_attente: candidatures.filter(c => c.etat === 'en_attente').length,
    accepte: candidatures.filter(c => c.etat === 'accepte').length,
    refuse: candidatures.filter(c => c.etat === 'refuse').length,
  }

  return (
    <div className="panel">
      <div className="section-title mb-6">
        <h2 className="text-xl font-semibold text-white">Mes candidatures</h2>
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
        <div className="text-center py-8 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          Chargement...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && candidatures.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Aucune candidature</p>
          <p className="text-sm">
            {filter === 'tous'
              ? "Vous n'avez pas encore postulé à des offres"
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
              className="bg-[#0f0f1e] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {candidature.offre_titre || 'Offre supprimée'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    {candidature.offre_localisation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {candidature.offre_localisation}
                      </span>
                    )}
                    {candidature.offre_type_contrat && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {candidature.offre_type_contrat}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Postulé le {formatDate(candidature.date_candidature)}
                    </span>
                  </div>
                </div>
                {getEtatBadge(candidature.etat)}
              </div>

              {/* Lettre de motivation */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 uppercase mb-1">Ma lettre de motivation:</p>
                <p className="text-sm text-gray-300 line-clamp-3">
                  {candidature.lettre_motivation}
                </p>
              </div>

              {/* CV Link */}
              {candidature.pj && (
                <div className="pt-3 border-t border-gray-800">
                  <a
                    href={candidature.pj}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:underline text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Voir mon CV
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
