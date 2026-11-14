import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function mediaUrl(path?: string | null) {
  if (!path) return undefined
  try {
    const url = new URL(path, new URL(BASE_URL, window.location.origin))
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

export function apiError(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback
  const data = error.response?.data
  if (!data || typeof data !== 'object') return fallback
  const message = data.erreur || data.detail || data.message
  if (typeof message === 'string') return message
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  }
  return fallback
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Intercepteur requête — ajoute le token JWT automatiquement ───────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Si c'est du FormData, laisser axios gérer le Content-Type automatiquement
  // (il va mettre multipart/form-data avec boundary)
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type')
  }
  
  return config
})

// ─── Intercepteur réponse — gère l'expiration du token ───────────────────────
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // si le token est expiré (401) et qu'on n'a pas déjà réessayé
    const refreshToken = localStorage.getItem('refresh_token')
    if (error.response?.status === 401 && originalRequest?.headers?.Authorization &&
        !originalRequest._retry && refreshToken) {
      originalRequest._retry = true

      try {
        // appel direct sans intercepteur pour éviter une boucle infinie
        const response = await axios.post(`${BASE_URL}/api/auth/connexion/refresh/`, {
          refresh: refreshToken,
        })

        const newAccessToken = response.data.access
        if (localStorage.getItem('refresh_token') !== refreshToken) return Promise.reject(error)
        localStorage.setItem('access_token', newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return client(originalRequest)
      } catch {
        // refresh expiré → déconnexion forcée
        if (localStorage.getItem('refresh_token') === refreshToken) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('devafrica:profile')
          window.location.hash = '#login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default client
