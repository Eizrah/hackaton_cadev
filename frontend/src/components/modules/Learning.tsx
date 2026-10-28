import { useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  Globe2,
  Layers3,
  Monitor,
  Palette,
  Search,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { courses, domains, type Course } from "../../data/learning";
import { normalizeText } from "../../data/models";
import { useLocalData } from "../../lib/storage";
import TechIcon from "../TechIcon";
const domainIcons = {
  globe: Globe2,
  monitor: Monitor,
  phone: Smartphone,
  palette: Palette,
  code: Code2,
};
function completed(course: Course, progress: string[]) {
  const legacy: Record<string, string> = {
    "react-web": "Les bases de React",
    "css-web": "Créer une interface responsive",
    "django-web": "Découvrir les API Django",
  };
  return (
    progress.includes(course.id) ||
    progress.includes(course.title) ||
    progress.includes(legacy[course.id])
  );
}
function CourseCard({
  course,
  done,
  onOpen,
}: {
  course: Course;
  done: boolean;
  onOpen: () => void;
}) {
  const domain = domains.find((d) => d.id === course.domain)!;
  return (
    <button className="learning-course" onClick={onOpen}>
      <div className="course-card-top">
        <span className="tech-icon-box">
          <TechIcon name={course.tech} size={29} />
        </span>
        <span className={`course-badge ${done ? "complete" : ""}`}>
          {done ? (
            <>
              <CheckCircle2 size={13} />
              Validé
            </>
          ) : (
            "Découverte"
          )}
        </span>
      </div>
      <span className="course-location">
        {domain.title}
        {course.paths[0]
          ? ` / ${domain.paths.find((p) => p.id === course.paths[0])?.title || ""}`
          : ""}
      </span>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <span className="course-role">{course.role}</span>
      <div className="course-card-bottom">
        <span>{done ? "Revoir la fiche" : "Découvrir la fiche"}</span>
        <ArrowRight size={17} />
      </div>
    </button>
  );
}
export default function Learning({
  route,
  onNavigate,
}: {
  route: string[];
  onNavigate: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useLocalData<string[]>("progress", []);

  const selectedDomain = domains.find((d) => d.id === route[0]);
  const selectedPath = selectedDomain?.paths.find((p) => p.id === route[1]);
  const selectedCourse =
    route[0] === "cours" ? courses.find((c) => c.id === route[1]) : undefined;
  const doneCount = courses.filter((c) => completed(c, progress)).length;
  if (selectedCourse)
    return (
      <CourseDetail
        key={selectedCourse.id}
        course={selectedCourse}
        done={completed(selectedCourse, progress)}
        onComplete={() =>
          setProgress((current) =>
            current.includes(selectedCourse.id)
              ? current
              : [...current, selectedCourse.id],
          )
        }
        onNavigate={onNavigate}
      />
    );
  if (route[0] && !selectedDomain)
    return (
      <div className="panel empty-state">
        <BookOpen />
        <h2>Ce parcours n’est pas disponible.</h2>
        <button
          className="btn-primary"
          onClick={() => onNavigate("apprentissage")}
        >
          Revenir au catalogue
        </button>
      </div>
    );
  const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
  const filtered = courses.filter((c) => {
    if (tokens.length) {
      const domain = domains.find((d) => d.id === c.domain)!;
      const haystack = normalizeText(
        [
          c.title,
          c.tech,
          c.description,
          c.role,
          c.lesson,
          domain.title,
          ...c.frameworks,
          ...c.paths,
        ].join(" "),
      );
      return tokens.every((t) => haystack.includes(t));
    }
    return (
      (!selectedDomain || c.domain === selectedDomain.id) &&
      (!selectedPath || c.paths.includes(selectedPath.id))
    );
  });
  const visibleCourses = selectedDomain || tokens.length ? filtered : [];
  return (
    <div className="learning-page">
      <div className="learning-banner">
        <div>
          <span className="mini-label">UN CHEMIN POUR CHAQUE CURIOSITÉ</span>
          <h2>
            {selectedDomain
              ? selectedDomain.id === "langages"
                ? "Explore les langages de programmation"
                : `Explore le ${selectedDomain.title.toLowerCase()}`
              : "Ton prochain « je sais faire » commence ici."}
          </h2>
          <p>
            {selectedDomain
              ? selectedDomain.description
              : "Web, mobile, desktop, design ou langages : avance à ton rythme, une notion à la fois."}
          </p>
        </div>
        <div className="learning-progress">
          <span className="progress-icon">
            <GraduationSymbol />
          </span>
          <strong>
            {doneCount}
            <small> / {courses.length}</small>
          </strong>
          <span>fiches validées</span>
          <progress
            value={doneCount}
            max={courses.length}
            aria-label="Progression globale"
          />
        </div>
      </div>
      <div className="catalog-search">
        <Search size={21} />
        <input
          type="search"
          aria-label="Rechercher un apprentissage"
          placeholder="Que veux-tu apprendre ? Python, React, mobile…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="quiet"
            aria-label="Effacer la recherche"
            onClick={() => setQuery("")}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav
        className="learning-breadcrumb"
        aria-label="Fil d’Ariane apprentissage"
      >
        <button onClick={() => onNavigate("apprentissage")}>
          Tous les domaines
        </button>
        {selectedDomain && (
          <>
            <ChevronRight size={14} />
            <button
              aria-current={selectedPath ? undefined : "page"}
              onClick={() => onNavigate(`apprentissage/${selectedDomain.id}`)}
            >
              {selectedDomain.title}
            </button>
          </>
        )}
        {selectedPath && (
          <>
            <ChevronRight size={14} />
            <span aria-current="page">{selectedPath.title}</span>
          </>
        )}
      </nav>
      {!selectedDomain && !query.trim() && (
        <>
          <div className="catalog-section-title">
            <div>
              <h2>Choisis ton terrain de jeu</h2>
              <p>Aucune expérience nécessaire pour commencer à découvrir.</p>
            </div>
            <span>05 domaines</span>
          </div>
          <div className="domain-grid">
            {domains.map((d, i) => {
              const Icon = domainIcons[d.icon as keyof typeof domainIcons];
              return (
                <button
                  key={d.id}
                  className="domain-card"
                  style={{ "--card-accent": d.color } as CSSProperties}
                  onClick={() => onNavigate(`apprentissage/${d.id}`)}
                >
                  <span className="domain-card-icon">
                    <Icon size={31} strokeWidth={1.4} />
                  </span>
                  <span className="domain-subtitle">{d.subtitle}</span>
                  <h3>
                    {d.id === "langages" ? (
                      <>
                        Langages
                        <span className="domain-title-sub">
                          de programmation
                        </span>
                      </>
                    ) : (
                      d.title
                    )}
                  </h3>
                  <p>{d.description}</p>
                  <span className="domain-card-link">
                    Explorer
                    <ArrowRight size={17} />
                  </span>
                  <span className="domain-ribbon">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </span>
                </button>
              );
            })}
            <div className="learning-helper">
              <span className="helper-icon">
                <Sparkles size={28} />
              </span>
              <h3>Tu ne sais pas par où commencer ?</h3>
              <p>
                Pour une interface visible dans le navigateur, essaie Web →
                Frontend : HTML, CSS, puis JavaScript.
              </p>
              <button onClick={() => onNavigate("apprentissage/web/frontend")}>
                Découvrir le frontend
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <section className="beginner-callout">
            <Layers3 size={24} />
            <div>
              <h3>Langage, framework… quelle différence ?</h3>
              <p>
                Un <strong>langage</strong> sert à exprimer la logique. Un{" "}
                <strong>framework</strong> fournit une structure et des outils.
                React est une bibliothèque d’interface ; HTML structure la page
                et CSS définit son apparence.
              </p>
            </div>
          </section>
          <div className="catalog-section-title">
            <div>
              <h2>Les premières briques</h2>
              <p>Quelques fiches pour commencer sans te perdre.</p>
            </div>
          </div>
          <div className="courses-grid">
            {courses
              .filter((c) =>
                ["html-web", "react-web", "python-web"].includes(c.id),
              )
              .map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  done={completed(c, progress)}
                  onOpen={() => onNavigate(`apprentissage/cours/${c.id}`)}
                />
              ))}
          </div>
        </>
      )}
      {selectedDomain && !query.trim() && (
        <>
          <div
            className="domain-tabs"
            role="group"
            aria-label="Choisir un autre domaine"
          >
            {domains.map((d) => (
              <button
                key={d.id}
                aria-pressed={d.id === selectedDomain.id}
                className={d.id === selectedDomain.id ? "active" : ""}
                onClick={() => onNavigate(`apprentissage/${d.id}`)}
              >
                {d.title}
              </button>
            ))}
          </div>
          {selectedDomain.paths.length > 0 && (
            <div className="path-grid">
              {selectedDomain.paths.map((p, i) => (
                <button
                  key={p.id}
                  className={`path-card ${selectedPath?.id === p.id ? "selected" : ""}`}
                  onClick={() =>
                    onNavigate(`apprentissage/${selectedDomain.id}/${p.id}`)
                  }
                  aria-pressed={selectedPath?.id === p.id}
                >
                  <span className="path-step">0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <span className="path-link">
                    Choisir ce parcours
                    <ArrowRight size={17} />
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="catalog-section-title">
            <div>
              <h2>
                {selectedPath
                  ? selectedPath.title
                  : selectedDomain.id === "langages"
                    ? "Les principaux langages"
                    : "Les technologies à découvrir"}
              </h2>
              <p>
                {selectedPath?.description ||
                  (selectedDomain.id === "langages"
                    ? "Un même langage peut servir dans plusieurs domaines. Les fiches précisent ses usages et outils associés."
                    : "Choisis un parcours ou explore les fiches ci-dessous.")}
              </p>
            </div>
            <span>{filtered.length} fiches</span>
          </div>
        </>
      )}
      {tokens.length > 0 && (
        <div className="catalog-section-title">
          <div>
            <h2>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour «{" "}
              {query.trim()} »
            </h2>
            <p>
              Recherche dans tous les domaines, les titres et les technologies
              associées.
            </p>
          </div>
        </div>
      )}
      {visibleCourses.length > 0 && (
        <div className="courses-grid">
          {visibleCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              done={completed(c, progress)}
              onOpen={() => onNavigate(`apprentissage/cours/${c.id}`)}
            />
          ))}
        </div>
      )}
      {(selectedDomain || tokens.length > 0) && !visibleCourses.length && (
        <div className="panel empty-state">
          <Search size={32} />
          <h2>Aucune fiche trouvée.</h2>
          <p>Essaie un mot plus simple, comme Python, web ou design.</p>
          <button className="text-link" onClick={() => setQuery("")}>
            Effacer ma recherche
          </button>
        </div>
      )}
    </div>
  );
}
function GraduationSymbol() {
  return <BookOpen size={24} />;
}
function CourseDetail({
  course,
  done,
  onComplete,
  onNavigate,
}: {
  course: Course;
  done: boolean;
  onComplete: () => void;
  onNavigate: (path: string) => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const domain = domains.find((d) => d.id === course.domain)!;
  const valid = checked && answer === course.answer;
  return (
    <div className="course-detail">
      <button
        className="back-link"
        onClick={() =>
          onNavigate(
            `apprentissage/${course.domain}${course.paths[0] ? "/" + course.paths[0] : ""}`,
          )
        }
      >
        <ArrowLeft size={17} />
        Retour au parcours {domain.title}
      </button>
      <div className="course-detail-grid">
        <aside>
          <section className="panel course-overview">
            <span className="tech-icon-box large">
              <TechIcon name={course.tech} size={45} />
            </span>
            <span className="course-badge">Fiche découverte</span>
            <h2>{course.title}</h2>
            <p>{course.role}</p>
            <div className="course-outline">
              <span>
                <span>01</span>Comprendre le rôle
              </span>
              <span>
                <span>02</span>Voir un exemple
              </span>
              <span>
                <span>03</span>Vérifier sa compréhension
              </span>
            </div>
            <div className="course-completion">
              <CheckCircle2 size={17} />
              {done || valid ? "Fiche validée" : "À ton rythme"}
            </div>
          </section>
          <section className="panel">
            <h2>Les outils associés</h2>
            <div className="skills-wall">
              {course.frameworks.length ? (
                course.frameworks.map((f) => (
                  <span className="skill-chip" key={f}>
                    <TechIcon name={f} size={18} />
                    {f}
                  </span>
                ))
              ) : (
                <span className="muted">
                  Les bases d’abord, sans framework.
                </span>
              )}
            </div>
            <p>
              Un outil accompagne le langage ; il ne remplace pas les notions de
              base.
            </p>
          </section>
        </aside>
        <section>
          <article className="panel lesson-panel">
            <div className="section-title">
              <span className="round-icon">
                <BookOpen size={20} />
              </span>
              <h2>Comprendre avant de commencer</h2>
            </div>
            <p>{course.lesson}</p>
            <div className="lesson-key">
              <Sparkles size={19} />
              <p>
                <strong>À retenir</strong>
                <br />
                {course.description}
              </p>
            </div>
            <h3>Un premier aperçu</h3>
            <pre>
              <code>{course.example}</code>
            </pre>
            <small className="muted">
              Exemple de lecture ; aucun code n’est exécuté dans cette fiche.
            </small>
          </article>
          <form
            className="panel exercise"
            onSubmit={(e) => {
              e.preventDefault();
              if (answer === null) return;
              setChecked(true);
              if (answer === course.answer) onComplete();
            }}
          >
            <span className="mini-label">UNE QUESTION POUR VÉRIFIER</span>
            <h2>{course.question}</h2>
            <fieldset>
              <legend className="sr-only">Choisis une réponse</legend>
              {course.options.map((o, i) => (
                <label
                  className={`quiz-option ${answer === i ? "selected" : ""}`}
                  key={o}
                >
                  <input
                    type="radio"
                    name={`quiz-${course.id}`}
                    checked={answer === i}
                    onChange={() => {
                      setAnswer(i);
                      setChecked(false);
                    }}
                    required
                  />
                  <span>{o}</span>
                </label>
              ))}
            </fieldset>
            <button
              className="btn-primary"
              disabled={answer === null}
              type="submit"
            >
              Vérifier ma réponse
              <ArrowRight size={17} />
            </button>
            {checked && (
              <div
                className={valid ? "quiz-feedback correct" : "quiz-feedback"}
                role="status"
              >
                <strong>
                  {valid
                    ? "Bravo, tu as compris !"
                    : "Pas tout à fait. Réessaie."}
                </strong>
                <p>{course.explanation}</p>
                {valid && (
                  <small>
                    Ta progression est enregistrée sur cet appareil.
                  </small>
                )}
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
