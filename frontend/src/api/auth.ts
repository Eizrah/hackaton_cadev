import client from './client'

export const authApi = {
  inscription: (data: object | FormData) =>
    client.post('/api/auth/inscription/', data),

  connexion: (email: string, password: string) =>
    client.post('/api/auth/connexion/', { email, password }),

  deconnexion: (refresh: string) =>
    client.post('/api/auth/deconnexion/', { refresh }),

  getProfil: () =>
    client.get('/api/auth/profil/'),

  // modification des infos de base (nom, prénom, age, photo, bio...)
  updateProfil: (data: object | FormData) =>
    client.put('/api/auth/profil/infos/', data),

  // modification email ou pseudo — mot de passe requis
  modifierEmailPseudo: (data: { email?: string; pseudo?: string; mot_de_passe: string }) =>
    client.put('/api/auth/profil/email-pseudo/', data),

  // changement de mot de passe — ancien mot de passe requis
  changerMotDePasse: (data: {
    ancien_mot_de_passe: string
    nouveau_mot_de_passe: string
    confirmation: string
  }) => client.put('/api/auth/profil/mot-de-passe/', data),

  motDePasseOublie: (email: string) =>
    client.post('/api/auth/mot-de-passe-oublie/', { email }),

  reinitialiserMotDePasse: (uidb64: string, token: string, password: string) =>
    client.post(
      `/api/auth/reinitialisation-mot-de-passe/${uidb64}/${token}/`,
      { password }
    ),

  // Recherche de devs par pseudo
  rechercherDevs: (query: string) =>
    client.get(`/api/auth/rechercher/?q=${encodeURIComponent(query)}`),
}
