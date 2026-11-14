import client from './client'

// ─── Messages privés ──────────────────────────────────────────────────────

export const messagingApi = {
  // Récupérer la liste des conversations
  getConversations: () =>
    client.get('/api/messaging/conversations/'),

  // Récupérer les messages d'une conversation
  getConversation: (email: string) =>
    client.get(`/api/messaging/conversation/${encodeURIComponent(email)}/`),

  // Envoyer un message texte
  envoyerMessage: (data: { destinataire: string; contenu: string; message_parent?: string }) =>
    client.post('/api/messaging/envoyer/', data),

  // Envoyer un message audio
  envoyerAudio: (data: FormData) =>
    client.post('/api/messaging/envoyer-audio/', data),

  // Envoyer un fichier
  envoyerFichier: (data: FormData) =>
    client.post('/api/messaging/envoyer-fichier/', data),

  // Supprimer un message
  supprimerMessage: (idMessage: string) =>
    client.delete(`/api/messaging/${idMessage}/supprimer/`),

  // Supprimer une conversation (soft delete)
  supprimerConversation: (email: string) =>
    client.delete(`/api/messaging/conversation/${encodeURIComponent(email)}/supprimer/`),
}

// ─── Groupes ──────────────────────────────────────────────────────────────

export const groupsApi = {
  // Liste des groupes
  getGroupes: () =>
    client.get('/api/groups/'),

  // Détails d'un groupe
  getGroupe: (idGroupe: string) =>
    client.get(`/api/groups/${idGroupe}/`),

  // Créer un groupe
  creerGroupe: (data: { nom: string; motif_creation: string; photo?: File }) => {
    const formData = new FormData()
    formData.append('nom', data.nom)
    formData.append('motif_creation', data.motif_creation)
    if (data.photo) {
      formData.append('photo', data.photo)
    }
    return client.post('/api/groups/creer/', formData)
  },

  // Modifier un groupe
  modifierGroupe: (idGroupe: string, data: { nom?: string; photo?: File }) => {
    const formData = new FormData()
    if (data.nom) {
      formData.append('nom', data.nom)
    }
    if (data.photo) {
      console.log('[API] Ajout photo au FormData:', data.photo.name, data.photo.type, data.photo.size)
      formData.append('photo', data.photo)
    }
    console.log('[API] FormData entries:', Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `File(${v.name})` : v]))
    return client.put(`/api/groups/${idGroupe}/`, formData)
  },

  // Supprimer un groupe
  supprimerGroupe: (idGroupe: string, motif?: string) =>
    client.delete(`/api/groups/${idGroupe}/`, { data: { motif_suppression: motif } }),

  // Quitter un groupe
  quitterGroupe: (idGroupe: string) =>
    client.delete(`/api/groups/${idGroupe}/quitter/`),

  // Liste des membres
  getMembres: (idGroupe: string) =>
    client.get(`/api/groups/${idGroupe}/membres/`),

  // Inviter un membre (crée une invitation, n'ajoute pas directement)
  inviterMembre: (idGroupe: string, email: string) =>
    client.post(`/api/groups/${idGroupe}/membres/`, { email }),

  // Retirer un membre
  retirerMembre: (idGroupe: string, email: string) =>
    client.delete(`/api/groups/${idGroupe}/membres/${email}/`),

  // Changer le rôle d'un membre (M = Modérateur, MB = Membre)
  changerRole: (idGroupe: string, email: string, type: 'M' | 'MB') =>
    client.put(`/api/groups/${idGroupe}/membres/${email}/`, { type }),

  // Invitations
  getMesInvitations: () =>
    client.get('/api/groups/invitations/'),

  accepterInvitation: (idInvitation: string) =>
    client.post(`/api/groups/invitations/${idInvitation}/accepter/`),

  refuserInvitation: (idInvitation: string) =>
    client.post(`/api/groups/invitations/${idInvitation}/refuser/`),

  // Messages du groupe
  getMessagesGroupe: (idGroupe: string) =>
    client.get(`/api/groups/${idGroupe}/messages/`),

  // Envoyer un message dans le groupe
  envoyerMessageGroupe: (idGroupe: string, data: { contenu: string; message_parent?: string }) =>
    client.post(`/api/groups/${idGroupe}/messages/`, data),

  // Envoyer un audio dans le groupe
  envoyerAudioGroupe: (idGroupe: string, data: FormData) =>
    client.post(`/api/groups/${idGroupe}/messages/audio/`, data),

  // Envoyer un fichier dans le groupe
  envoyerFichierGroupe: (idGroupe: string, data: FormData) =>
    client.post(`/api/groups/${idGroupe}/messages/fichier/`, data),
}
