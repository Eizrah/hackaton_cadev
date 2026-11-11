import client from '../api/client'
import { migrateProfile, type Profile } from '../data/profile'

export function bannedLoginError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { detail?: string } } }
    const detail = axiosError.response?.data?.detail || ''
    return /banni|banned/i.test(detail)
  }
  return false
}

export async function loginWithDjango(
  email: string,
  password: string,
  _remember: boolean
): Promise<Profile> {
  const response = await client.post('/api/auth/connexion/', { email, password })
  const data = response.data

  // stocke les tokens JWT dans localStorage
  localStorage.setItem('access_token', data.tokens.access)
  localStorage.setItem('refresh_token', data.tokens.refresh)

  // récupère le profil complet depuis /api/auth/profil/
  // pour avoir toutes les infos y compris le pseudo, pays, niveau...
  try {
    const profilResponse = await client.get('/api/auth/profil/')
    const profil = profilResponse.data

    const profile = {
      id: `dev-${profil.email}`,
      email: profil.email,
      firstName: profil.prenom || '',
      lastName: profil.nom || '',
      name: `${profil.prenom || ''} ${profil.nom || ''}`.trim() || profil.nom || '',
      pseudo: profil.pseudo || '',
      level: profil.niveau === 'D' ? 'Débutant' : profil.niveau === 'I' ? 'Intermédiaire' : 'Avancé',
      country: profil.pays || '',
      age: String(profil.age || ''),
      bio: profil.presentation || '',
      skillDetails: (profil.possessions || []).map((p: any) => ({
        id: p.competence || `skill-${Math.random()}`,
        name: p.competence_nom || '',
        difficulty: '',
        domain: p.competence_domaine || '',
      })),
      experiences: [],
      documents: [],
      accountStatus: profil.banne ? 'banned' : 'active',
    }

    return migrateProfile(profile)
  } catch {
    // fallback si /profil/ échoue — utilise les données de connexion
    const profile = {
      email: data.email,
      firstName: '',
      lastName: data.nom || '',
      name: data.nom || '',
      pseudo: data.pseudo || '',
      level: data.niveau || 'D',
      country: data.pays || '',
      skillDetails: [],
      experiences: [],
      documents: [],
      accountStatus: 'active',
    }
    return migrateProfile(profile)
  }
}
