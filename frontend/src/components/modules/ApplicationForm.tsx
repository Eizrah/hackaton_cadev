import React, { useState, type FormEvent } from 'react'
import { publicationApi } from '../../api/publication'
import { X, Upload, FileText, Send } from 'lucide-react'

interface ApplicationFormProps {
  offreId: string
  onClose: () => void
  onSuccess: () => void
}

export default function ApplicationForm({ offreId, onClose, onSuccess }: ApplicationFormProps) {
  const [lettreMotivation, setLettreMotivation] = useState('')
  const [cv, setCv] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier (PDF uniquement)
    if (file.type !== 'application/pdf') {
      setError('Le CV doit être au format PDF')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Le CV ne doit pas dépasser 5 Mo')
      return
    }

    setCv(file)
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!lettreMotivation.trim()) {
      setError('La lettre de motivation est requise')
      return
    }

    if (!cv) {
      setError('Veuillez joindre votre CV (PDF)')
      return
    }

    try {
      setUploading(true)
      setError(null)

      await publicationApi.postuler(offreId, {
        lettre_motivation: lettreMotivation.trim(),
        pj: cv,
      })

      onSuccess()
    } catch (err: any) {
      console.error('Erreur candidature:', err)
      setError(
        err.response?.data?.message || 
        err.response?.data?.erreur ||
        'Erreur lors de la soumission de la candidature'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2e] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Send className="w-6 h-6" />
            Postuler à cette offre
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            disabled={uploading}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lettre de motivation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lettre de motivation *
            </label>
            <textarea
              value={lettreMotivation}
              onChange={(e) => setLettreMotivation(e.target.value)}
              placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
              className="w-full bg-[#0f0f1e] text-white border border-gray-700 rounded-lg p-3 min-h-[200px] focus:border-blue-500 focus:outline-none resize-vertical"
              disabled={uploading}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {lettreMotivation.length} / 2000 caractères
            </p>
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Curriculum Vitae (PDF) *
            </label>
            
            {!cv ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 hover:bg-gray-800/50 transition cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-300 mb-1">
                    Cliquez pour choisir votre CV
                  </p>
                  <p className="text-xs text-gray-500">
                    Format PDF uniquement • Maximum 5 Mo
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            ) : (
              <div className="bg-[#0f0f1e] border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-10 h-10 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{cv.name}</p>
                    <p className="text-xs text-gray-400">
                      {(cv.size / 1024).toFixed(1)} Ko
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCv(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                  disabled={uploading}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition"
              disabled={uploading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading || !lettreMotivation.trim() || !cv}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer ma candidature
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
