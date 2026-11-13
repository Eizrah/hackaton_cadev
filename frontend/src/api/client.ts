import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Variables pour gérer le rafraîchissement automatique ──────────────────────
let refreshTimer: ReturnType<typeof setTimeout> | null = null

// Fonction pour décoder le JWT et obtenir l'expiration
function getTokenExpiration(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 // Convertir en millisecondes
  } catch {
    return null
  }
}

// Fonction pour rafraîchir le token proactivement
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return false

    console.log('[TOKEN] Rafraîchissement du token d\'accès...')
    
    // Appel direct sans intercepteur pour éviter une boucle infinie
    const response = await axios.post(`${BASE_URL}/api/auth/connexion/refresh/`, {
      refresh: refreshToken,
    })

    const newAccessToken = response.data.access
    const newRefreshToken = response.data.refresh // Nouveau refresh token si rotation activée
    
    localStorage.setItem('access_token', newAccessToken)
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken)
    }
    
    console.log('[TOKEN] Token rafraîchi avec succès')
    
    // Programme le prochain rafraîchissement
    scheduleTokenRefresh(newAccessToken)
    
    return true
  } catch (error) {
    console.error('[TOKEN] Échec du rafraîchissement:', error)
    // Refresh expiré → déconnexion forcée
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('devafrica:profile')
    window.location.hash = '#login'
    return false
  }
}

// Planifie un rafraîchissement proactif AVANT l'expiration
function scheduleTokenRefresh(token: string) {
  // Annule le timer précédent
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }

  const expiration = getTokenExpiration(token)
  if (!expiration) return

  const now = Date.now()
  const timeUntilExpiry = expiration - now
  
  // Rafraîchir 5 minutes AVANT l'expiration (ou à mi-chemin si moins de 10 min)
  const refreshBuffer = Math.min(5 * 60 * 1000, timeUntilExpiry / 2)
  const refreshIn = timeUntilExpiry - refreshBuffer

  if (refreshIn > 0) {
    console.log(`[TOKEN] Prochain rafraîchissement dans ${Math.round(refreshIn / 1000 / 60)} minutes`)
    refreshTimer = setTimeout(() => {
      refreshAccessToken()
    }, refreshIn)
  } else {
    // Token déjà expiré ou expire dans moins de 5 min → rafraîchir immédiatement
    refreshAccessToken()
  }
}

// Initialise le rafraîchissement automatique au chargement
const initialToken = localStorage.getItem('access_token')
if (initialToken) {
  scheduleTokenRefresh(initialToken)
}

// ─── Intercepteur requête — ajoute le token JWT automatiquement ───────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Si c'est du FormData, laisser axios gérer le Content-Type automatiquement
  // (il va mettre multipart/form-data avec boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  
  return config
})

// ─── Intercepteur réponse — gère l'expiration du token (fallback) ─────────────
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si le token est expiré (401) et qu'on n'a pas déjà réessayé
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const success = await refreshAccessToken()
      if (success) {
        // Réessayer la requête originale avec le nouveau token
        const newToken = localStorage.getItem('access_token')
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return client(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default client
