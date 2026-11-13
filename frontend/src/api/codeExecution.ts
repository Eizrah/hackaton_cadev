/**
 * API pour l'exécution de code via Docker
 * Supporte: Python, JavaScript, TypeScript, C, C++, Java, PHP, Swift, SQL
 */

import client from './client'

export type SupportedLanguage =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'c'
  | 'cpp'
  | 'java'
  | 'php'
  | 'swift'
  | 'sql'

export interface CodeExecutionRequest {
  language: SupportedLanguage
  code: string
  stdin?: string
}

export interface CodeExecutionResponse {
  id?: number
  stdout: string
  stderr: string
  status: 'success' | 'error' | 'timeout'
  execution_time: number
  created_at?: string
}

export const codeExecutionApi = {
  /**
   * Exécute du code dans un conteneur Docker sécurisé
   */
  execute: (data: CodeExecutionRequest) =>
    client.post<CodeExecutionResponse>('/api/code-execution/execute/', data),

  /**
   * Récupère l'historique des exécutions de l'utilisateur
   */
  getHistory: () =>
    client.get<CodeExecutionResponse[]>('/api/code-execution/history/'),

  /**
   * Vérifie que le service d'exécution est opérationnel
   */
  healthCheck: () =>
    client.get<{
      status: 'healthy' | 'degraded' | 'unhealthy'
      message: string
      docker: 'connected' | 'disconnected'
    }>('/api/code-execution/health/'),
}
