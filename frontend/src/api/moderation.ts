import client from './client'

export const moderationApi = {
  // ─── Signalement de personne ─────────────────────────────────────────────
  signalerDev: (email: string, motif: string) =>
    client.post(`/api/moderation/signaler/dev/${email}/`, { motif }),

  // ─── Signalement de post ─────────────────────────────────────────────────
  signalerPost: (id: string, motif: string) =>
    client.post(`/api/moderation/signaler/post/${id}/`, { motif }),

  // ─── Signalement d'offre ─────────────────────────────────────────────────
  signalerOffre: (id: string, motif: string) =>
    client.post(`/api/moderation/signaler/offre/${id}/`, { motif }),

  // ─── Signalement de groupe ───────────────────────────────────────────────
  signalerGroupe: (id: string, motif: string) =>
    client.post(`/api/moderation/signaler/groupe/${id}/`, { motif }),
}
