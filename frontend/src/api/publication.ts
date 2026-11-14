import { isAxiosError } from 'axios'
import client from './client'

export type EtatCandidature = 'accepte' | 'refuse' | 'en_attente'

export interface Candidature {
  id: number
  etat: EtatCandidature
  date_postule: string
  nom_offre: string
  offre_localisation: string
  developper_email: string
  developper_pseudo: string
  developper_photo?: string | null
  lettre_motivation?: string | null
  pj?: string | null
  lien_cv?: string | null
}

type PublicationEnregistrable = { id: string; date: string; auteur: string }
export type Signet = {
  type: 'forum_post'
  publication: PublicationEnregistrable & { description: string }
} | {
  type: 'offre_emploi'
  publication: PublicationEnregistrable & { nom_poste: string; localisation: string }
}
export type Enregistrement = Signet & { id: number; date_enregistrement: string }

export interface ForumPostResponse {
  id_publication: string
  developper_email: string
  developper_pseudo: string
  developper_pays?: string
  description: string
  lien?: string | null
  fichier?: string | null
  date_publication: string
  feu_vert: boolean
  collaboration?: boolean
  nombre_notes?: number
  nombre_commentaires?: number
  liked_by_me?: boolean
}

type ForumPublicationResult = { message: string; post: ForumPostResponse; raison?: string }

export const publicationApi = {

  // ─── Forum Posts ──────────────────────────────────────────────────────────

  // liste des posts validés (feu_vert=True)
  getPostsForum: () =>
    client.get<ForumPostResponse[]>('/api/forum/posts/'),

  // mes posts (tous, validés ou non)
  getMesPostsForum: () =>
    client.get('/api/forum/mes-posts/'),

  // détail d'un post
  getPostForum: (id: string) =>
    client.get<ForumPostResponse>(`/api/forum/posts/${id}/`),

  creerPostForum: async ({ fichier, ...post }: {
    description: string; lien?: string; fichier?: File; collaboration: boolean
  }) => {
    let payload: typeof post | FormData = post
    if (fichier) {
      const form = new FormData()
      form.append('description', post.description)
      form.append('collaboration', String(post.collaboration))
      if (post.lien) form.append('lien', post.lien)
      form.append('fichier', fichier)
      payload = form
    }

    try {
      const { data } = await client.post<ForumPublicationResult>('/api/forum/posts/creer/', payload)
      return data
    } catch (error) {
      // Django conserve le post refusé et le renvoie avec son motif.
      if (isAxiosError<ForumPublicationResult>(error) && error.response?.status === 400) {
        const result = error.response.data
        if (result?.post?.id_publication && result.post.feu_vert === false) return result
      }
      throw error
    }
  },

  // modifier un post
  modifierPostForum: (id: string, data: { description?: string; lien?: string | null }) =>
    client.put<ForumPublicationResult>(`/api/forum/posts/${id}/`, data),

  // supprimer un post
  supprimerPostForum: (id: string) =>
    client.delete(`/api/forum/posts/${id}/supprimer/`),

  // rechercher des posts
  rechercherPostsForum: (query: string) =>
    client.get<ForumPostResponse[]>(`/api/forum/posts/recherche/`, { params: { q: query } }),

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
    client.get<Enregistrement[]>('/api/forum/enregistrements/'),

  enregistrer: (typePublication: 'forum_post' | 'offre_emploi', idPublication: string) =>
    client.post<{ id: number }>('/api/forum/enregistrements/', {
      type_publication: typePublication,
      id_publication: idPublication,
    }),

  supprimerEnregistrement: (id: number) =>
    client.delete(`/api/forum/enregistrements/${id}/supprimer/`),

  // ─── Offres d'emploi ──────────────────────────────────────────────────────

  getOffres: () =>
    client.get('/api/jobs/offres/'),

  getMesOffres: () =>
    client.get('/api/jobs/mes-offres/'),

  getOffre: (id: string) =>
    client.get(`/api/jobs/offres/${id}/`),

  creerOffre: (data: {
    description: string
    nom_poste: string
    localisation: string
    type_contrat: 'CDI' | 'CDD' | 'Stage' | 'Freelance'
    duree?: string
    competence_requise: string
    type_travail: 'R' | 'S' | 'H'
    deadline: string
    lien?: string
    email?: string
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

  postuler: (idOffre: string, data: { lettre_motivation?: string; lien_cv?: string; pj?: File }) => {
    if (data.pj) {
      const form = new FormData()
      if (data.lettre_motivation) form.append('lettre_motivation', data.lettre_motivation)
      if (data.lien_cv) form.append('lien_cv', data.lien_cv)
      form.append('pj', data.pj)
      return client.post(`/api/jobs/offres/${idOffre}/postuler/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    return client.post(`/api/jobs/offres/${idOffre}/postuler/`, {
      lettre_motivation: data.lettre_motivation,
      lien_cv: data.lien_cv,
    })
  },

  mesCandidatures: (etat?: 'accepte' | 'refuse' | 'en_attente') =>
    client.get<Candidature[]>(`/api/jobs/mes-candidatures/${etat ? `?etat=${etat}` : ''}`),

  retirerMaCandidature: (id: number) =>
    client.delete(`/api/jobs/mes-candidatures/${id}/`),

  candidaturesOffre: (idOffre: string, etat?: 'accepte' | 'refuse' | 'en_attente') =>
    client.get<Candidature[]>(`/api/jobs/offres/${idOffre}/candidatures/${etat ? `?etat=${etat}` : ''}`),

  traiterCandidature: (idOffre: string, idCandidature: number, etat: 'accepte' | 'refuse') =>
    client.put(`/api/jobs/offres/${idOffre}/candidatures/${idCandidature}/`, { etat }),

  // ─── Signalement ──────────────────────────────────────────────────────────
  // Note: Les fonctions de signalement sont maintenant dans api/moderation.ts
  // Gardées ici pour compatibilité avec le code existant
  signalerPost: (id: string, motif: string) =>
    client.post(`/api/moderation/signaler/post/${id}/`, { motif }),

  signalerOffre: (id: string, motif: string) =>
    client.post(`/api/moderation/signaler/offre/${id}/`, { motif }),

  signalerDev: (email: string, motif: string) =>
    client.post(`/api/moderation/signaler/dev/${email}/`, { motif }),
}
