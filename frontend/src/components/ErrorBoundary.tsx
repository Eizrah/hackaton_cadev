import { Component, type ReactNode, type ErrorInfo } from "react";
// Filet de sécurité pour les erreurs React à l’exécution (pas pour les imports invalides).
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erreur DevAfrica", error, info.componentStack);
  }
  render() {
    const english=document.documentElement.lang.startsWith("en");
    if (this.state.failed)
      return (
        <main className="error-page">
          <h1>{english?"The interface could not be displayed.":"L’interface n’a pas pu s’afficher."}</h1>
          <p>
            {english?"Reload the page. If the problem continues, open the console with F12 and share the error message.":"Recharge la page. Si le problème continue, ouvre la console avec F12 et transmets le message d’erreur."}
          </p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            {english?"Reload":"Recharger"}
          </button>
        </main>
      );
    return this.props.children;
  }
}
