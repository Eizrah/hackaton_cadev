import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    delete config.headers['Content-Type']
  }
  
  return config
})

// ─── Intercepteur réponse — gère l'expiration du token ───────────────────────
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // si le token est expiré (401) et qu'on n'a pas déjà réessayé
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        // appel direct sans intercepteur pour éviter une boucle infinie
        const response = await axios.post(`${BASE_URL}/api/auth/connexion/refresh/`, {
          refresh: refreshToken,
        })

        const newAccessToken = response.data.access
        localStorage.setItem('access_token', newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return client(originalRequest)
      } catch {
        // refresh expiré → déconnexion forcée
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/connexion'
      }
    }

    return Promise.reject(error)
  }
)

export default client
