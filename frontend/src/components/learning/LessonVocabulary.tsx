import { BookOpen, RotateCcw } from "lucide-react";
import type { LessonVocabularyPlan, VocabularyOrigin } from "../../data/courseVocabulary";
import { useI18n } from "../../i18n/context";

export default function LessonVocabulary({ plan, beginner, onReview }: {
  plan: LessonVocabularyPlan;
  beginner: boolean;
  onReview: (origin: VocabularyOrigin) => void;
}) {
  const { t } = useI18n();
  const levels = { debutant: t("Débutant", "Beginner"), intermediaire: t("Intermédiaire", "Intermediate"), avance: t("Avancé", "Advanced") };
  if (!plan.introduced.length && !plan.review.length) return null;
  return (
    <div className="lesson-vocabulary-area">
      {plan.introduced.length > 0 && (
        <details className="lesson-vocabulary" open={beginner}>
          <summary><BookOpen size={18} /><span>{t("Quelques définitions à savoir", "A few definitions to know")}<small>{plan.introduced.length} {plan.introduced.length === 1 ? t("nouvelle notion dans cette leçon", "new concept in this lesson") : t("nouvelles notions dans cette leçon", "new concepts in this lesson")}</small></span></summary>
          <p>{t("Un mot nouveau ? Voici son sens et un exemple pour continuer sereinement.", "New word? Here is its meaning and an example to help you continue.")}</p>
          <dl>{plan.introduced.map((term) => <div key={term.id} data-term-id={term.id}><dt>{term.label}</dt><dd>{term.meaning}<p><strong>{t("Exemple :", "Example:")}</strong> {term.example}</p></dd></div>)}</dl>
        </details>
      )}
      {plan.review.length > 0 && (
        <details className="lesson-vocabulary-review">
          <summary><RotateCcw size={14} />{t("Revoir une définition déjà présentée", "Revisit an earlier definition")}</summary>
          <div>{plan.review.map(({ term, origin }) => <button type="button" key={term.id} onClick={() => onReview(origin)} title={origin.lessonTitle}><span>{term.label}</span><small>{levels[origin.levelId]} · {origin.number}</small></button>)}</div>
        </details>
      )}
    </div>
  );
}
