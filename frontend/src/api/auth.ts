import client from './client'

export interface DjangoExperience {
  id: number
  nom_poste: string
  description: string
  nbr_annee_exp: number
  diplome: string | null
  certificat: string | null
  fichier_diplome_url?: string | null
  fichier_certificat_url?: string | null
}

export interface DjangoProfile {
  identifiant: string
  email: string
  nom: string
  prenom: string | null
  pseudo: string
  age?: number
  niveau: 'D' | 'I' | 'A'
  pays: string
  sexe?: 'M' | 'F'
  presentation: string | null
  lien_portfolio: string | null
  photoprofil: string | null
  nombre_publications?: number
  experiences: DjangoExperience[]
  possessions: Array<{
    competence: string
    competence_nom: string
    competence_domaine: string
    competence_difficulte: string
  }>
  competences_personnalisees: string[] | null
}

export const authApi = {
  inscription: (data: object | FormData) =>
    client.post<{
      identifiant: string
      profil: DjangoProfile
      tokens: { access: string; refresh: string }
    }>('/api/auth/inscription/', data),

  connexion: (email: string, password: string) =>
    client.post('/api/auth/connexion/', { email, password }),

  deconnexion: (refresh: string) =>
    client.post('/api/auth/deconnexion/', { refresh }),

  getProfil: () =>
    client.get<DjangoProfile>('/api/auth/profil/'),

  getProfilMembre: (membre: string, signal?: AbortSignal) =>
    client.get<DjangoProfile>(`/api/auth/profil/membre/${encodeURIComponent(membre)}/`, { signal }),

  // modification des infos de base (nom, prénom, age, photo, bio...)
  updateProfil: (data: object | FormData) =>
    client.put<{ profil: DjangoProfile; experiences_enregistrees: number[] }>('/api/auth/profil/infos/', data),

  // modification email ou pseudo — mot de passe requis
  modifierEmailPseudo: (data: { email?: string; pseudo?: string; mot_de_passe: string }) =>
    client.put<{ email: string; pseudo: string }>('/api/auth/profil/email-pseudo/', data),

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

  // Suppression de compte avec confirmation par mot de passe
  supprimerCompte: (data: { password: string; refresh?: string }) =>
    client.delete('/api/auth/supprimer-compte/', {
      data
    }),

  // Catalogue partagé par l'inscription, le profil et les offres.
  getCompetencesDisponibles: (signal?: AbortSignal) =>
    client.get<Array<{ id_competence: string; nom_competence: string }>>('/api/learning/competences/', { signal }),
}


// ─── Notifications ────────────────────────────────────────────────────────

export const notifApi = {
  // Récupérer toutes les notifications
  getMesNotifications: () =>
    client.get('/api/auth/notifications/'),

  // Compter les notifications non lues
  compterNonLues: () =>
    client.get('/api/auth/notifications/count/'),

  // Marquer une notification comme lue
  marquerLue: (notifId: number) =>
    client.put(`/api/auth/notifications/${notifId}/marquer/`),

  // Marquer toutes comme lues
  marquerToutesLues: () =>
    client.put('/api/auth/notifications/marquer-toutes/'),
}



// ─── Blocage & Sourdine ───────────────────────────────────────────────────

export const blocageApi = {
  // Bloquer un développeur
  bloquer: (email: string) =>
    client.post(`/api/auth/bloquer/${email}/`),

  // Débloquer un développeur
  debloquer: (email: string) =>
    client.delete(`/api/auth/bloquer/${email}/`),

  // Mettre en sourdine (personne ou groupe)
  mettreEnSourdine: (data: { email?: string; id_group?: string }) =>
    client.post('/api/auth/sourdine/', data),

  // Retirer la sourdine
  retirerSourdine: (data: { email?: string; id_group?: string }) =>
    client.delete('/api/auth/sourdine/', { data }),
}
