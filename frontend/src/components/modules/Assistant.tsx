import { useState } from "react";
import { ArrowRight, Bot } from "lucide-react";
export default function Assistant() {
  const [question, setQuestion] = useState(""),
    [response, setResponse] = useState("");
  return (
    <section className="panel ai-panel">
      <span className="feature-icon cyan">
        <Bot size={30} />
      </span>
      <h2>Un coup de pouce pour apprendre</h2>
      <p>
        Ce prototype utilise des réponses prédéfinies. Aucun modèle IA n’est
        connecté.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = question.toLowerCase();
          setResponse(
            q.includes("react")
              ? "React compose l’interface avec des composants. useState conserve une valeur locale et permet d’actualiser l’affichage. Découvre la fiche React dans Web → Frontend."
              : q.includes("django") || q.includes("api")
                ? "Django reçoit les requêtes, valide les données et applique les règles métier. Le frontend peut interroger une API qui renvoie du JSON. Consulte Web → Backend pour les premières notions."
                : q.includes("python")
                  ? "Python peut servir au backend avec Django, Flask ou FastAPI, et aux applications desktop avec Tkinter ou PySide6. Cherche Python dans le catalogue pour comparer ses usages."
                  : q.includes("css") || q.includes("responsive")
                    ? "Pour une interface responsive, commence avec une seule colonne, utilise Grid ou Flexbox puis adapte la mise en page avec des media queries. Vérifie le résultat à 320 px et au clavier."
                    : "Pour cette démonstration, pose une question contenant React, Django, API, Python, CSS ou responsive. Les réponses sont prédéfinies.",
          );
        }}
      >
        <label>
          Ta question
          <textarea
            aria-label="Question à l’assistant"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            maxLength={2000}
            placeholder="Quelle différence entre frontend et backend ?"
          />
        </label>
        <button className="btn-primary">
          Demander de l’aide
          <ArrowRight size={17} />
        </button>
      </form>
      {response && (
        <div className="ai-response" role="status">
          {response}
        </div>
      )}
    </section>
  );
}
