import client from './client'

export const publicationApi = {

  // ─── Forum Posts ──────────────────────────────────────────────────────────

  // liste des posts validés (feu_vert=True)
  getPostsForum: () =>
    client.get('/api/forum/posts/'),

  // mes posts (tous, validés ou non)
  getMesPostsForum: () =>
    client.get('/api/forum/mes-posts/'),

  // détail d'un post
  getPostForum: (id: string) =>
    client.get(`/api/forum/posts/${id}/`),

  // créer un post — Multipart si fichier, JSON sinon
  creerPostForum: (data: { description: string; lien?: string; fichier?: File }) => {
    if (data.fichier) {
      const form = new FormData()
      form.append('description', data.description)
      if (data.lien && data.lien.trim()) form.append('lien', data.lien.trim())
      form.append('fichier', data.fichier)
      return client.post('/api/forum/posts/creer/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    // JSON — n'envoie lien que s'il est renseigné
    const payload: Record<string, string> = { description: data.description }
    if (data.lien && data.lien.trim()) payload.lien = data.lien.trim()
    return client.post('/api/forum/posts/creer/', payload)
  },

  // modifier un post
  modifierPostForum: (id: string, data: { description?: string; lien?: string }) =>
    client.put(`/api/forum/posts/${id}/`, data),

  // supprimer un post
  supprimerPostForum: (id: string) =>
    client.delete(`/api/forum/posts/${id}/supprimer/`),

  // rechercher des posts
  rechercherPostsForum: (query: string) =>
    client.get(`/api/forum/posts/recherche/?q=${encodeURIComponent(query)}`),

  // ─── Commentaires ─────────────────────────────────────────────────────────

  getCommentaires: (idPost: string) =>
    client.get(`/api/forum/posts/${idPost}/commentaires/`),

  ajouterCommentaire: (idPost: string, data: { commentaire: string; commentaire_parent?: string }) => {
    // ne pas envoyer commentaire_parent si undefined
    const payload: Record<string, string> = { commentaire: data.commentaire };
    if (data.commentaire_parent) {
      payload.commentaire_parent = data.commentaire_parent;
    }
    return client.post(`/api/forum/posts/${idPost}/commentaires/`, payload);
  },

  modifierCommentaire: (idPost: string, idCommentaire: string, data: { commentaire: string }) =>
    client.put(`/api/forum/posts/${idPost}/commentaires/${idCommentaire}/`, data),

  supprimerCommentaire: (idPost: string, idCommentaire: string) =>
    client.delete(`/api/forum/posts/${idPost}/commentaires/${idCommentaire}/`),

  // ─── Notes (likes) ────────────────────────────────────────────────────────

  // toggle like/unlike — un seul appel fait les deux
  toggleNote: (idPost: string) =>
    client.post(`/api/forum/posts/${idPost}/noter/`),

  // ─── Enregistrements ──────────────────────────────────────────────────────

  getEnregistrements: () =>
    client.get('/api/forum/enregistrements/'),

  enregistrer: (typePublication: 'forum_post' | 'offre_emploi', idPublication: string) =>
    client.post('/api/forum/enregistrements/', {
      type_publication: typePublication,
      id_publication: idPublication,
    }),

  supprimerEnregistrement: (id: number) =>
    client.delete(`/api/forum/enregistrements/${id}/supprimer/`),

  // ─── Offres d'emploi ──────────────────────────────────────────────────────

  getOffres: () =>
    client.get('/api/jobs/offres/'),

  getOffre: (id: string) =>
    client.get(`/api/jobs/offres/${id}/`),

  creerOffre: (data: {
    description: string
    nom_poste: string
    localisation: string
    type_contrat: 'CDI' | 'CDD'
    duree?: string
    competence_requise: string
    type_travail: 'R' | 'S' | 'H'
    deadline: string
    lien?: string
    fichier?: File
  }) => {
    if (data.fichier) {
      const form = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null && k !== 'fichier')
          form.append(k, String(v))
      })
      form.append('fichier', data.fichier)
      return client.post('/api/jobs/offres/creer/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    return client.post('/api/jobs/offres/creer/', data)
  },

  modifierOffre: (id: string, data: object) =>
    client.put(`/api/jobs/offres/${id}/`, data),

  supprimerOffre: (id: string) =>
    client.delete(`/api/jobs/offres/${id}/supprimer/`),

  rechercherOffres: (query: string) =>
    client.get(`/api/jobs/offres/recherche/?q=${encodeURIComponent(query)}`),

  // ─── Candidatures ─────────────────────────────────────────────────────────

  postuler: (idOffre: string, data: { lettre_motivation?: string; pj?: File }) => {
    if (data.pj) {
      const form = new FormData()
      if (data.lettre_motivation) form.append('lettre_motivation', data.lettre_motivation)
      form.append('pj', data.pj)
      return client.post(`/api/jobs/offres/${idOffre}/postuler/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    return client.post(`/api/jobs/offres/${idOffre}/postuler/`, {
      lettre_motivation: data.lettre_motivation,
    })
  },

  mesCandidatures: (etat?: 'accepte' | 'refuse' | 'en_attente') =>
    client.get(`/api/jobs/mes-candidatures/${etat ? `?etat=${etat}` : ''}`),

  candidaturesOffre: (idOffre: string, etat?: 'accepte' | 'refuse' | 'en_attente') =>
    client.get(`/api/jobs/offres/${idOffre}/candidatures/${etat ? `?etat=${etat}` : ''}`),

  traiterCandidature: (idOffre: string, idCandidature: number, etat: 'accepte' | 'refuse') =>
    client.put(`/api/jobs/offres/${idOffre}/candidatures/${idCandidature}/`, { etat }),

  // ─── Signalement ──────────────────────────────────────────────────────────

  signalerPost: (id: string, motif: string) =>
    client.post(`/api/moderation/signaler/post/${id}/`, { motif }),

  signalerOffre: (id: string, motif: string) =>
    client.post(`/api/moderation/signaler/offre/${id}/`, { motif }),

  signalerDev: (email: string, motif: string) =>
    client.post(`/api/moderation/signaler/dev/${email}/`, { motif }),
}
