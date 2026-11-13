/**
 * Hook React pour exécuter du code via l'API Docker
 */

import { useState } from 'react'
import { codeExecutionApi, type CodeExecutionResponse, type SupportedLanguage } from '../api/codeExecution'

interface ExecutionState {
  isExecuting: boolean
  result: CodeExecutionResponse | null
  error: string | null
}

export function useCodeExecution() {
  const [state, setState] = useState<ExecutionState>({
    isExecuting: false,
    result: null,
    error: null,
  })

  const execute = async (language: SupportedLanguage, code: string, stdin = '') => {
    setState({ isExecuting: true, result: null, error: null })

    try {
      const response = await codeExecutionApi.execute({ language, code, stdin })
      setState({
        isExecuting: false,
        result: response.data,
        error: null,
      })
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.erreur || err.message || 'Erreur d\'exécution'
      setState({
        isExecuting: false,
        result: null,
        error: errorMessage,
      })
      throw new Error(errorMessage)
    }
  }

  const reset = () => {
    setState({ isExecuting: false, result: null, error: null })
  }

  return {
    execute,
    reset,
    isExecuting: state.isExecuting,
    result: state.result,
    error: state.error,
  }
}
