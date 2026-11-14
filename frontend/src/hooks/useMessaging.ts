import { useState, useEffect } from 'react'
import { messagingApi, groupsApi } from '../api/messaging'

// ─── Types ────────────────────────────────────────────────────────────────

export interface Conversation {
  email: string
  pseudo: string
  photoprofil: string | null
  dernierMessage?: {
    id_message: string
    contenu: string
    date_envoie: string
  }
  nonLus: number
}

export interface Message {
  id_message: string
  contenu: string | null
  date_envoie: string
  envoyeur_email: string
  envoyeur_pseudo: string
  destinataire_email?: string
  etat: string
  supprime: boolean
  fichier_audio?: string | null
  fichiers?: Array<{
    id_fichier: string
    fichier: string
    taille: number
  }>
}

export interface Groupe {
  id_group: string
  nom: string
  photo: string | null
  date_creation: string
  nombre_membres: number
  motif_creation?: string
}

export interface Membre {
  id: number
  dev_email: string
  dev_pseudo: string
  dev_photo: string | null
  type: 'A' | 'M' | 'MB'
  date_adhesion: string
}

export interface Invitation {
  id_invitation: string
  groupe: string
  groupe_nom: string
  groupe_photo: string | null
  inviteur_pseudo: string
  statut: 'P' | 'A' | 'R'
  date_invitation: string
}

// ─── Hook: Conversations privées ──────────────────────────────────────────

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await messagingApi.getConversations()
      const data = response.data.map((conv: any) => ({
        email: conv.dev.email,
        pseudo: conv.dev.pseudo,
        photoprofil: conv.dev.photoprofil,
        dernierMessage: conv.dernier_message,
        nonLus: conv.non_lus
      }))
      setConversations(data)
      setError(null)
    } catch (err: any) {
      console.error('Erreur chargement conversations:', err)
      setError(err.response?.data?.erreur || 'Erreur chargement conversations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  return { conversations, loading, error, reload: loadConversations }
}

// ─── Hook: Messages d'une conversation ────────────────────────────────────

export function useConversationMessages(email: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = async () => {
    if (!email) return
    
    try {
      setLoading(true)
      const response = await messagingApi.getConversation(email)
      setMessages(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Erreur chargement messages:', err)
      setError(err.response?.data?.erreur || 'Erreur chargement messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (email) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [email])

  return { messages, loading, error, reload: loadMessages, setMessages }
}

// ─── Hook: Groupes ─────────────────────────────────────────────────────────

export function useGroupes() {
  const [groupes, setGroupes] = useState<Groupe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadGroupes = async () => {
    try {
      setLoading(true)
      const response = await groupsApi.getGroupes()
      setGroupes(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Erreur chargement groupes:', err)
      setError(err.response?.data?.erreur || 'Erreur chargement groupes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGroupes()
  }, [])

  return { groupes, loading, error, reload: loadGroupes, setGroupes }
}

// ─── Hook: Membres d'un groupe ────────────────────────────────────────────

export function useGroupeMembres(groupeId: string | null) {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMembres = async () => {
    if (!groupeId) return
    
    try {
      setLoading(true)
      const response = await groupsApi.getMembres(groupeId)
      setMembres(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Erreur chargement membres:', err)
      // Ne pas afficher l'erreur si c'est juste que le groupe n'existe plus
      if (err.response?.status !== 404) {
        setError(err.response?.data?.erreur || 'Erreur chargement membres')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (groupeId) {
      loadMembres()
    } else {
      setMembres([])
    }
  }, [groupeId])

  return { membres, loading, error, reload: loadMembres, setMembres }
}

// ─── Hook: Messages d'un groupe ───────────────────────────────────────────

export function useGroupeMessages(groupeId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = async () => {
    if (!groupeId) return
    
    try {
      setLoading(true)
      const response = await groupsApi.getMessagesGroupe(groupeId)
      setMessages(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Erreur chargement messages groupe:', err)
      setError(err.response?.data?.erreur || 'Erreur chargement messages groupe')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (groupeId) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [groupeId])

  return { messages, loading, error, reload: loadMessages, setMessages }
}

// ─── Hook: Invitations ─────────────────────────────────────────────────────

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInvitations = async () => {
    try {
      setLoading(true)
      const response = await groupsApi.getMesInvitations()
      setInvitations(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Erreur chargement invitations:', err)
      setError(err.response?.data?.erreur || 'Erreur chargement invitations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvitations()
  }, [])

  return { invitations, loading, error, reload: loadInvitations }
}
