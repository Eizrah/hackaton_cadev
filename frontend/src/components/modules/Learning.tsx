import { useI18n } from "../../i18n/context";
import { lazy, Suspense, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  Globe2,
  Layers3,
  ExternalLink,
  Search,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { courses, domains, type Course } from "../../data/learning";
import { normalizeText } from "../../data/models";
import { useLocalData } from "../../lib/storage";
import TechIcon from "../TechIcon";
import { completionKey, isDetailedCourse } from "../../data/webCourseTypes";
import "../learning/web-learning.css";

const WebClassroom = lazy(() => import("../learning/HtmlCssClassroom"));
const domainIcons = {
  globe: Globe2,
  phone: Smartphone,
  code: Code2,
};
function completed(course: Course, progress: string[]) {
  const key = completionKey(course.id);
  return progress.includes(key) || (key === course.id && progress.includes(course.title));
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
  const { t } = useI18n();

  const domain = domains.find((d) => d.id === course.domain)!;
  const htmlCss = course.id === "html-css-web";
  const backend = course.paths.includes("backend");
  return (
    <button className="learning-course" onClick={onOpen}>
      <div className="course-card-top">
        <span className="tech-icon-box">
          <TechIcon name={course.tech} size={htmlCss ? 24 : 29} />
          {htmlCss && <TechIcon name="CSS3" size={24} />}
        </span>
        <span className={`course-badge ${done ? "complete" : ""}`}>
          {done ? (
            <>
              <CheckCircle2 size={13} />
              {t("Validé")}
            </>
          ) : isDetailedCourse(course.id === "lang-swift" ? "swift-mobile" : course.id) ? (
            t("3 niveaux", "3 levels")
          ) : (
            t("Découverte")
          )}
        </span>
      </div>
      <span className="course-location">
        {t(domain.title)}
        {course.paths[0]
          ? ` / ${t(domain.paths.find((p) => p.id === course.paths[0])?.title || "")}`
          : ""}
      </span>
      <h3>{t(course.title)}</h3>
      {!backend && (
        <>
          <p>{t(course.description)}</p>
          <span className="course-role">{t(course.role)}</span>
        </>
      )}
      <div className="course-card-bottom">
        <span>
          {done
            ? t("Revoir la fiche")
            : t("Choisir la fiche", "Choose this course")}
        </span>
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
  const { t, language } = useI18n();

  const [query, setQuery] = useState("");
  const [progress, setProgress] = useLocalData<string[]>("progress", []);

  const selectedDomain = domains.find((d) => d.id === route[0]);
  const selectedPath = selectedDomain?.paths.find((p) => p.id === route[1]);
  const legacyWeb = route[1] === "html-web" || route[1] === "css-web";
  const selectedCourse =
    route[0] === "cours"
      ? courses.find((c) => c.id === (legacyWeb ? "html-css-web" : route[1]))
      : undefined;
  const doneCount = courses.filter((c) => completed(c, progress)).length;
  const detailedCourseId = selectedCourse?.id === "lang-swift" ? "swift-mobile" : selectedCourse?.id;
  if (selectedCourse && detailedCourseId && isDetailedCourse(detailedCourseId)) {
    const key = completionKey(detailedCourseId);
    return (
      <Suspense
        fallback={
          <div className="panel" role="status">
            {t("Ouverture du cours…", "Opening the course…")}
          </div>
        }
      >
        <WebClassroom
          key={detailedCourseId}
          courseId={detailedCourseId}
          route={
            legacyWeb
              ? [
                  "debutant",
                  "lecon",
                  route[1] === "css-web" ? "selecteurs" : "structure",
                ]
              : route.slice(2)
          }
          onNavigate={onNavigate}
          onCourseComplete={() =>
            setProgress((current) =>
              current.includes(key) ? current : [...current, key],
            )
          }
        />
      </Suspense>
    );
  }
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
        <h2>{t("Ce parcours n’est pas disponible.")}</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setQuery("");
            onNavigate("apprentissage");
          }}
        >
          {t("Revenir au catalogue")}
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
  const needsWebPath =
    selectedDomain?.id === "web" && !selectedPath && !tokens.length;
  const visibleCourses =
    (selectedDomain || tokens.length) && !needsWebPath ? filtered : [];
  return (
    <div className="learning-page">
      {language === "en" && (
        <p className="catalog-language-note">
          The interface is in English. Detailed learning notes currently remain
          in French.
        </p>
      )}
      <div className="learning-banner">
        <div>
          <span className="mini-label">
            {t("UN CHEMIN POUR CHAQUE CURIOSITÉ")}
          </span>
          <h2>
            {selectedDomain
              ? selectedDomain.id === "langages"
                ? t("Explore les langages de programmation")
                : language === "en"
                  ? `Explore ${t(selectedDomain.title)}`
                  : `Explore le ${selectedDomain.title.toLowerCase()}`
              : t("Ton prochain « je sais faire » commence ici.")}
          </h2>
          <p>
            {selectedDomain
              ? t(selectedDomain.description)
              : t(
                  "Avance à ton rythme en Web, Mobile ou Langages de programmation.",
                  "Learn at your own pace across Web, Mobile and Programming Languages.",
                )}
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
          <span>{t("fiches validées")}</span>
          <progress
            value={doneCount}
            max={courses.length}
            aria-label={t("Progression globale")}
          />
        </div>
      </div>
      <div className="catalog-search">
        <Search size={21} />
        <input
          type="search"
          aria-label={t("Rechercher un apprentissage")}
          placeholder={t("Que veux-tu apprendre ? Python, React, mobile…")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="quiet"
            aria-label={t("Effacer la recherche")}
            onClick={() => setQuery("")}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav
        className="learning-breadcrumb"
        aria-label={t("Fil d’Ariane apprentissage")}
      >
        <button
          onClick={() => {
            setQuery("");
            onNavigate("apprentissage");
          }}
        >
          {t("Tous les domaines")}
        </button>
        {selectedDomain && (
          <>
            <ChevronRight size={14} />
            <button
              aria-current={selectedPath ? undefined : "page"}
              onClick={() => onNavigate(`apprentissage/${selectedDomain.id}`)}
            >
              {t(selectedDomain.title)}
            </button>
          </>
        )}
        {selectedPath && (
          <>
            <ChevronRight size={14} />
            <span aria-current="page">{t(selectedPath.title)}</span>
          </>
        )}
      </nav>
      {!selectedDomain && !query.trim() && (
        <>
          <div className="catalog-section-title">
            <div>
              <h2>{t("Choisis ton terrain de jeu")}</h2>
              <p>
                {t("Aucune expérience nécessaire pour commencer à découvrir.")}
              </p>
            </div>
            <span>
              {String(domains.length).padStart(2, "0")}{" "}
              {t("domaines", "categories")}
            </span>
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
                  <span className="domain-subtitle">{t(d.subtitle)}</span>
                  <h3>
                    {d.id === "langages" ? (
                      <>
                        {t("Langages")}
                        <span className="domain-title-sub">
                          {t("de programmation")}
                        </span>
                      </>
                    ) : (
                      t(d.title)
                    )}
                  </h3>
                  <p>{t(d.description)}</p>
                  <span className="domain-card-link">
                    {t("Explorer")}
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
              <h3>{t("Tu ne sais pas par où commencer ?")}</h3>
              <p>
                {t(
                  "Pour une interface visible dans le navigateur, essaie Web → Frontend : HTML, CSS, puis JavaScript.",
                )}
              </p>
              <button onClick={() => onNavigate("ia")}>
                {t("Demander à l’agent apprentissage")}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <section className="beginner-callout">
            <Layers3 size={24} />
            <div>
              <h3>{t("Langage, framework… quelle différence ?")}</h3>
              <p>
                {t(
                  "Un langage sert à exprimer la logique. Un framework fournit une structure et des outils. React est une bibliothèque d’interface ; HTML structure la page et CSS définit son apparence.",
                  "A language expresses logic. A framework provides structure and tools. React is a UI library; HTML structures a page and CSS defines its appearance.",
                )}
              </p>
            </div>
          </section>
          <div className="catalog-section-title">
            <div>
              <h2>{t("Les premières briques")}</h2>
              <p>{t("Quelques fiches pour commencer sans te perdre.")}</p>
            </div>
          </div>
          <div className="courses-grid">
            {courses
              .filter((c) =>
                ["html-css-web", "javascript-web", "react-web"].includes(c.id),
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
            aria-label={t("Choisir un autre domaine")}
          >
            {domains.map((d) => (
              <button
                key={d.id}
                aria-pressed={d.id === selectedDomain.id}
                className={d.id === selectedDomain.id ? "active" : ""}
                onClick={() => onNavigate(`apprentissage/${d.id}`)}
              >
                {t(d.title)}
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
                  <h3>{t(p.title)}</h3>
                  <p>{t(p.description)}</p>
                  <span className="path-link">
                    {t("Choisir ce parcours")}
                    <ArrowRight size={17} />
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="catalog-section-title">
            <div>
              <h2>
                {needsWebPath
                  ? t("Choisis ton parcours web", "Choose your web path")
                  : selectedPath
                    ? t(selectedPath.title)
                    : selectedDomain.id === "langages"
                      ? t("Les principaux langages")
                      : t("Les technologies à découvrir")}
              </h2>
              <p>
                {t(selectedPath?.description ||
                  (selectedDomain.id === "langages"
                    ? "Un même langage peut servir dans plusieurs domaines. Les fiches précisent ses usages et outils associés."
                    : "Choisis un parcours ou explore les fiches ci-dessous."))}
              </p>
            </div>
            {!needsWebPath && (
              <span>
                {filtered.length}
                {t("fiches")}
              </span>
            )}
          </div>
        </>
      )}
      {tokens.length > 0 && (
        <div className="catalog-section-title">
          <div>
            <h2>
              {filtered.length}
              {t("résultat")}
              {filtered.length > 1 ? t("s") : ""}
              {t("pour «")} {query.trim()} »
            </h2>
            <p>
              {t(
                "Recherche dans tous les domaines, les titres et les technologies associées.",
              )}
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
      {needsWebPath && (
        <div className="web-path-prompt">
          <BookOpen size={24} />
          <p>
            {t(
              "Choisis Frontend ou Backend ci-dessus pour découvrir les fiches de ton parcours.",
              "Choose Frontend or Backend above to discover its courses.",
            )}
          </p>
        </div>
      )}
      {(selectedDomain || tokens.length > 0) &&
        !needsWebPath &&
        !visibleCourses.length && (
          <div className="panel empty-state">
            <Search size={32} />
            <h2>{t("Aucune fiche trouvée.")}</h2>
            <p>
              {t(
                "Essaie un mot plus simple, comme Python, Web ou Mobile.",
                "Try a simpler term, such as Python, Web or Mobile.",
              )}
            </p>
            <button className="text-link" onClick={() => setQuery("")}>
              {t("Effacer ma recherche")}
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
  const { t } = useI18n();

  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const domain = domains.find((d) => d.id === course.domain)!;
  const valid = checked && answer === course.answer;
  return (
    <div className="course-detail web-classroom">
      <button
        className="back-link"
        onClick={() =>
          onNavigate(
            `apprentissage/${course.domain}${course.paths[0] ? "/" + course.paths[0] : ""}`,
          )
        }
      >
        <ArrowLeft size={17} />
        {t("Retour au parcours")}
        {t(domain.title)}
      </button>
      <div className="course-detail-grid">
        <aside>
          <section className="panel course-overview">
            <span className="tech-icon-box large">
              <TechIcon name={course.tech} size={45} />
            </span>
            <span className="course-badge">{t("Fiche découverte")}</span>
            <h2>{t(course.title)}</h2>
            <p>{t(course.role)}</p>
            <div className="course-outline">
              <span>
                <span>01</span>
                {t("Comprendre le rôle")}
              </span>
              <span>
                <span>02</span>
                {t("Voir un exemple")}
              </span>
              <span>
                <span>03</span>
                {t("Vérifier sa compréhension")}
              </span>
            </div>
            <div className="course-completion">
              <CheckCircle2 size={17} />
              {done || valid ? t("Fiche validée") : t("À ton rythme")}
            </div>
          </section>
          <section className="panel">
            <h2>{t("Les outils associés")}</h2>
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
                  {t("Les bases d’abord, sans framework.")}
                </span>
              )}
            </div>
            <p>
              {t(
                "Un outil accompagne le langage ; il ne remplace pas les notions de base.",
              )}
            </p>
          </section>
        </aside>
        <section>
          <article className="panel lesson-panel web-discovery-panel">
            <div className="section-title">
              <span className="round-icon">
                <BookOpen size={20} />
              </span>
              <h2>{t("Comprendre avant de commencer")}</h2>
            </div>
            <p>{course.lesson}</p>
            <div className="lesson-key">
              <Sparkles size={19} />
              <p>
                <strong>{t("À retenir")}</strong>
                <br />
                {t(course.description)}
              </p>
            </div>
            <h3>{t("Un premier aperçu")}</h3>
            <pre>
              <code>{course.example}</code>
            </pre>
            {course.resource ? (
              <a
                className="web-source-link"
                href={course.resource}
                target="_blank"
                rel="noreferrer"
              >
                {t(
                  "Lire la documentation officielle",
                  "Read the official documentation",
                )}
                <ExternalLink size={14} />
              </a>
            ) : (
              <small className="muted">
                {t(
                  "Exemple de lecture à explorer dans ton environnement.",
                  "Reading example to explore in your environment.",
                )}
              </small>
            )}
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
            <span className="mini-label">
              {t("UNE QUESTION POUR VÉRIFIER")}
            </span>
            <h2>{course.question}</h2>
            <fieldset>
              <legend className="sr-only">{t("Choisis une réponse")}</legend>
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
              {t("Vérifier ma réponse")}
              <ArrowRight size={17} />
            </button>
            {checked && (
              <div
                className={valid ? "quiz-feedback correct" : "quiz-feedback"}
                role="status"
              >
                <strong>
                  {valid
                    ? t("Bravo, tu as compris !")
                    : t("Pas tout à fait. Réessaie.")}
                </strong>
                <p>{course.explanation}</p>
                {valid && (
                  <small>
                    {t("Ta progression est enregistrée sur cet appareil.")}
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
