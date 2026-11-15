import { useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  ExternalLink,
  GraduationCap,
  List,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useI18n } from "../../i18n/context";
import { useLocalData } from "../../lib/storage";
import { initialProfile, migrateProfile } from "../../data/profile";
import {
  lessonsInLevel,
  type DetailedCourseId,
  type WebLevel,
  type WebLesson,
} from "../../data/webCourseTypes";
import { webCurricula } from "../../data/webCurricula";
import { courseFoundations } from "../../data/courseFoundations";
import { lessonVocabulary, type LessonVocabularyPlan, type VocabularyOrigin } from "../../data/courseVocabulary";
import { useCurrentLessonHelp, useFloatingTutor } from "../../lib/tutorOverlayContext";
import type { LearningLessonContext } from "../../lib/learningTutorContext";
import {
  editorFilenames,
  firstEditorFile,
  readEditorFile,
} from "../../lib/webEditorFiles";
import TechIcon from "../TechIcon";
import WebCodeStudio from "./WebCodeStudio";
import LessonVocabulary from "./LessonVocabulary";
import "./web-learning.css";
import "./learning-enhancements.css";

type WebProgress = { lessons: string[]; projects: string[] };
const emptyProgress: WebProgress = { lessons: [], projects: [] };
// Ces parcours mobile et backend n’utilisent pas le bouton d’essai du cours web.
const pathsWithoutExampleTry = new Set(["backend", "android", "ios", "multiplateforme"]);
// Dans ces cours de programmation, le niveau avancé n’ouvre pas l’atelier web.
const advancedCoursesWithoutExampleTry = new Set<DetailedCourseId>([
  "lang-cpp",
  "lang-python",
  "lang-java",
  "lang-javascript",
  "lang-typescript",
  "lang-php",
]);
// Ces runtimes ouvrent une fenêtre de bureau et s’exécutent dans un environnement local.
const graphicalRuntimes = new Set(["gtk", "qt", "javafx", "customtkinter", "electron", "nodegui", "php-desktop", "fltk"]);
function canTryExample(courseId: DetailedCourseId, path: string | undefined, level: WebLevel, lesson: WebLesson) {
  if (pathsWithoutExampleTry.has(path ?? "")) return false;
  if (level.id === "avance" && advancedCoursesWithoutExampleTry.has(courseId)) return false;
  const runtime = lesson.files.local?.runtime;
  if (level.id === "avance" && runtime && graphicalRuntimes.has(runtime)) return false;
  // Les exemples GTK du niveau intermédiaire de C se lancent avec l’environnement local.
  if (courseId === "lang-c" && level.id === "intermediaire" && runtime === "gtk") return false;
  return true;
}
function migrateWebProgress(saved: unknown, levels: WebLevel[]): WebProgress {
  const value =
    saved && typeof saved === "object"
      ? (saved as Record<string, unknown>)
      : {};
  const validLessons = levels.flatMap((level) =>
    lessonsInLevel(level).map((lesson) => `${level.id}/${lesson.id}`),
  );
  const validProjects = levels.flatMap((level) =>
    level.projects.map((project) => `${level.id}/${project.id}`),
  );
  return {
    lessons: Array.isArray(value.lessons)
      ? [
          ...new Set(
            value.lessons.filter(
              (item): item is string =>
                typeof item === "string" && validLessons.includes(item),
            ),
          ),
        ]
      : [],
    projects: Array.isArray(value.projects)
      ? [
          ...new Set(
            value.projects.filter(
              (item): item is string =>
                typeof item === "string" && validProjects.includes(item),
            ),
          ),
        ]
      : [],
  };
}
export default function WebClassroom({
  courseId = "html-css-web",
  route,
  onNavigate,
  onCourseComplete,
}: {
  courseId?: DetailedCourseId;
  route: string[];
  onNavigate: (path: string) => void;
  onCourseComplete: () => void;
}) {
  const openTutor = useFloatingTutor();
  const { t, language } = useI18n();
  const curriculum = webCurricula[courseId];
  const { levels, mode } = curriculum;
  const path = curriculum.path ?? "frontend";
  const domain =
    path === "langages"
      ? "langages"
      : path === "frontend" || path === "backend"
        ? "web"
        : "mobile";
  const pathName = {
    frontend: "Frontend",
    backend: "Backend",
    android: "Android",
    ios: "iOS",
    multiplateforme: "Multiplateforme",
    langages: "Langages de programmation",
  }[path];
  const coursePath = `apprentissage/cours/${courseId}`;
  const storagePrefix = mode === "html-css" ? "html-css" : courseId;
  const lessonCount = levels.reduce(
    (total, level) => total + lessonsInLevel(level).length,
    0,
  );
  const projectCount = levels.reduce(
    (total, level) => total + level.projects.length,
    0,
  );
  const [progress, setProgress] = useLocalData(
    `${storagePrefix}-progress`,
    emptyProgress,
    (saved) => migrateWebProgress(saved, levels),
  );
  const [profile] = useLocalData("profile", initialProfile, migrateProfile);
  const [tocOpen, setTocOpen] = useState(false);
  const [last, setLast] = useLocalData<Record<string, string>>(
    `${storagePrefix}-last`,
    {},
    (saved) =>
      saved && typeof saved === "object"
        ? Object.fromEntries(
            Object.entries(saved).filter(
              ([, value]) => typeof value === "string",
            ),
          )
        : {},
  );
  const level = levels.find((item) => item.id === route[0]) || levels[0];
  const lessons = lessonsInLevel(level);
  const view = route[1] || "lecon";
  const lesson =
    lessons.find((item) => item.id === route[2]) ||
    lessons.find((item) => item.id === last[level.id]) ||
    lessons[0];
  const project = level.projects.find((item) => item.id === route[2]);
  const invalid =
    (route[0] && !levels.some((item) => item.id === route[0])) ||
    (route[1] && !["lecon", "projet", "atelier"].includes(view)) ||
    (view === "projet" && !project) ||
    ((view === "lecon" || view === "atelier") &&
      route[2] &&
      !lessons.some((item) => item.id === route[2]));
  const levelDone = lessons.filter((item) =>
    progress.lessons.includes(`${level.id}/${item.id}`),
  ).length;
  const lessonHelp:LearningLessonContext | undefined = invalid ? undefined : {
    kind: "lesson", courseId, courseTitle: curriculum.title, level: level.id,
    lessonTitle: view === "projet" && project ? project.title : lesson.title,
    explanation: (view === "projet" && project
      ? [project.description, ...project.requirements, ...project.hints].join("\n")
      : lesson.sections.map(section => [section.title, section.text, ...section.points].join("\n")).join("\n\n")).slice(0,8000),
    returnPath: view === "projet" && project ? `${coursePath}/${level.id}/projet/${project.id}` : `${coursePath}/${level.id}/lecon/${lesson.id}`,
  };
  useCurrentLessonHelp(lessonHelp);
  const projectsDone = level.projects.filter((item) =>
    progress.projects.includes(`${level.id}/${item.id}`),
  ).length;
  const percent = Math.round(
    ((levelDone + projectsDone) / (lessons.length + level.projects.length)) *
      100,
  );
  function go(path: string, focusContent = true) {
    onNavigate(path);
    setTocOpen(false);
    if (focusContent)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const element = document.getElementById("web-active-content");
          if (element) {
            element.scrollIntoView({ block: "start", behavior: "instant" });
            element.focus({ preventScroll: true });
          }
        }),
      );
  }
  function openLesson(target: WebLevel, id: string) {
    setLast({ ...last, [target.id]: id });
    go(`${coursePath}/${target.id}/lecon/${id}`);
  }
  function saveProgress(next: WebProgress) {
    setProgress(next);
    if (
      next.lessons.length === lessonCount &&
      next.projects.length === projectCount
    )
      onCourseComplete();
  }
  function finishLesson() {
    const id = `${level.id}/${lesson.id}`;
    if (!progress.lessons.includes(id))
      saveProgress({ ...progress, lessons: [...progress.lessons, id] });
  }
  function finishProject() {
    if (!project) return;
    const id = `${level.id}/${project.id}`;
    if (!progress.projects.includes(id))
      saveProgress({ ...progress, projects: [...progress.projects, id] });
  }
  const currentChapter = level.chapters.find((chapter) =>
    chapter.lessons.some((item) => item.id === lesson.id),
  );
  const nextLesson = lessons[lessons.indexOf(lesson) + 1];
  const previousLesson = lessons[lessons.indexOf(lesson) - 1];
  const firstLessonOfLevel = lesson.id === lessons[0].id;
  const firstLessonOfCourse = firstLessonOfLevel && level.id === levels[0].id;
  const vocabulary = lessonVocabulary(courseId, curriculum, level.id, lesson.id);
  function askAboutCode(file: string, code: string, anchor?: HTMLElement) {
    openTutor({ courseId, courseTitle: curriculum.title, level: level.id, lessonTitle: project?.title || lesson.title, file, code,
      returnPath: `${coursePath}/${level.id}/${view}/${project?.id || lesson.id}`,
      explanation: project ? project.description + "\n" + project.requirements.join("\n") + "\n" + project.hints.join("\n") : lesson.sections.map((part) => part.title + "\n" + part.text + "\n" + part.points.join("\n")).join("\n\n"),
    }, anchor);
  }
  if (!invalid && view !== "lecon") return (
    <div className="web-studio-page" style={{ "--web-accent": level.color } as CSSProperties}>
      <header className="studio-page-header">
        <button type="button" onClick={() => openLesson(level, lesson.id)}><ArrowLeft size={17} />{t("Revenir à la leçon", "Return to lesson")}</button>
        <div><span>DEVAfrica <strong>STUDIO</strong></span><small>{curriculum.title} / {level.title}</small></div>
        <span className="studio-page-badge"><Code2 size={15} />{t("Un espace pour créer", "Room to create")}</span>
      </header>
      <section id="web-active-content" tabIndex={-1} className="studio-page-content" aria-label={t("Atelier en grand format", "Expanded code studio")}>
        <h1 className="sr-only">{curriculum.title} · {project?.title || lesson.title}</h1>
        <WebCodeStudio key={`${level.id}/${view}/${project?.id || lesson.id}`}
          draftId={`${mode === "html-css" ? "" : `${courseId}-`}${level.id}-${view}-${project?.id || lesson.id}`}
          mode={mode} title={project?.title || lesson.title} initialFiles={project?.files || lesson.files}
          project={view === "projet" ? project : undefined}
          completed={project ? progress.projects.includes(`${level.id}/${project.id}`) : undefined}
          onComplete={finishProject} onAskCode={askAboutCode} />
      </section>
    </div>
  );
  return (
    <div
      className="web-classroom"
      style={{ "--web-accent": level.color } as CSSProperties}
    >
      <button
        className="back-link web-back"
        onClick={() =>
          onNavigate(
            path === "langages"
              ? "apprentissage/langages"
              : `apprentissage/${domain}/${path}`,
          )
        }
      >
        <ArrowLeft size={17} />
        {t(`Retour au parcours ${pathName}`, `Back to ${pathName}`)}
      </button>
      {language === "en" && (
        <p className="catalog-language-note">
          The interface is in English. Course content and project briefs
          currently remain in French.
        </p>
      )}
      <header className="web-course-hero">
        <div className="web-hero-copy">
          <span className="web-eyebrow">
            <GraduationCap size={16} />
            DEVAfrica LEARNING ·{" "}
            {domain === "langages"
              ? pathName.toUpperCase()
              : `${domain.toUpperCase()} / ${pathName.toUpperCase()}`}
          </span>
          <div className="web-course-heading">
            <div className="web-dual-tech">
              {curriculum.icons.map((icon) => (
                <TechIcon name={icon} size={30} key={icon} />
              ))}
            </div>
            <h2>{curriculum.title}</h2>
          </div>
          <p>{curriculum.intro}</p>
          <div className="web-hero-metadata">
            <span>
              <BookOpen size={14} />
              {lessonCount} {t("leçons", "lessons")}
            </span>
            <span>
              <Code2 size={14} />
              {projectCount} {t("mini-projets", "mini projects")}
            </span>
            <span>
              <CheckCircle2 size={14} />
              {t("À ton rythme", "At your pace")}
            </span>
          </div>
        </div>
        <figure className="web-learning-visual">
          <img
            src="/images/learning-lab.jpg"
            alt={t(
              "Un livre ouvert sur un ordinateur : apprendre et pratiquer dans le même espace.",
              "An open book on a laptop: learn and practise in the same space.",
            )}
          />
          <figcaption>
            <span />
            {t("Ici, on apprend en créant.", "Here, we learn by creating.")}
          </figcaption>
        </figure>
      </header>
      <div
        className="web-level-tabs"
        role="group"
        aria-label={t("Choisir le niveau du cours", "Choose the course level")}
      >
        {levels.map((item, index) => (
          <button
            key={item.id}
            aria-pressed={item.id === level.id}
            onClick={() =>
              openLesson(
                item,
                lessonsInLevel(item).find((entry) => entry.id === last[item.id])
                  ?.id || lessonsInLevel(item)[0].id,
              )
            }
            style={{ "--level-color": item.color } as CSSProperties}
          >
            <span className="web-level-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <strong>
                {t(item.title, ["Beginner", "Intermediate", "Advanced"][index])}
              </strong>
              <small>{item.subtitle}</small>
            </span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
      {invalid ? (
        <section className="web-lesson-panel">
          <h2>
            {t(
              "Cette leçon n’est pas disponible.",
              "This lesson is unavailable.",
            )}
          </h2>
          <button
            className="web-primary-button"
            onClick={() => openLesson(level, lessons[0].id)}
          >
            {t(
              "Revenir au début du niveau",
              "Return to the start of this level",
            )}
          </button>
        </section>
      ) : (
        <div
          className={`web-classroom-grid ${view !== "lecon" ? "web-with-studio" : ""}`}
        >
          <aside className={`web-toc ${tocOpen ? "web-toc-open" : ""}`}>
            <div className="web-learner">
              <span className="web-learner-avatar">
                {/* Reprendre la photo du profil partagé ; garder l’initiale en solution de secours. */}
                {profile.photo ? (
                  <img src={profile.photo} alt="" />
                ) : (
                  profile.firstName.slice(0, 1) ||
                  profile.name.slice(0, 1) ||
                  "D"
                )}
              </span>
              <div>
                <strong>{profile.firstName || profile.name}</strong>
                <span>
                  {t("Ton parcours de développeur", "Your developer journey")}
                </span>
              </div>
            </div>
            <div className="web-toc-progress">
              <span>
                {t("Progression du niveau", "Level progress")}
                <strong>{percent}%</strong>
              </span>
              <progress
                value={levelDone + projectsDone}
                max={lessons.length + level.projects.length}
                aria-label={t("Progression du niveau", "Level progress")}
              />
              <small>
                {levelDone}/{lessons.length} {t("leçons", "lessons")} ·{" "}
                {projectsDone}/{level.projects.length}{" "}
                {t("projets terminés", "projects completed")}
              </small>
            </div>
            <button
              className="web-toc-toggle"
              aria-expanded={tocOpen}
              aria-controls="web-toc-navigation"
              onClick={() => setTocOpen(!tocOpen)}
            >
              <List size={18} />
              {t("Table des matières", "Table of contents")}
              <ChevronDown size={17} />
            </button>
            <nav
              id="web-toc-navigation"
              className="web-toc-navigation"
              aria-label={t("Chapitres et leçons", "Chapters and lessons")}
            >
              <div className="web-toc-title">
                <BookOpen size={16} />
                <strong>{t("Table des matières", "Table of contents")}</strong>
              </div>
              {level.chapters.map((chapter, index) => (
                <details key={chapter.id} open className="web-toc-chapter">
                  <summary>
                    <span className="web-chapter-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{chapter.title}</strong>
                      <small>
                        {chapter.lessons.length} {t("leçons", "lessons")} ·{" "}
                        {chapter.lessons.reduce(
                          (sum, item) => sum + item.minutes,
                          0,
                        )}{" "}
                        min
                      </small>
                    </span>
                    <ChevronDown size={14} />
                  </summary>
                  <div>
                    {chapter.lessons.map((item, lessonIndex) => (
                      <button
                        key={item.id}
                        className={
                          view === "lecon" && item.id === lesson.id
                            ? "active"
                            : ""
                        }
                        aria-current={
                          view === "lecon" && item.id === lesson.id
                            ? "page"
                            : undefined
                        }
                        onClick={() => openLesson(level, item.id)}
                      >
                        <span
                          className={
                            progress.lessons.includes(`${level.id}/${item.id}`)
                              ? "done"
                              : ""
                          }
                        >
                          {progress.lessons.includes(
                            `${level.id}/${item.id}`,
                          ) ? (
                            <Check size={12} />
                          ) : (
                            `${index + 1}.${lessonIndex + 1}`
                          )}
                        </span>
                        <span>
                          {item.title}
                          <small>{item.minutes} min</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </details>
              ))}
              <div className="web-toc-projects">
                <h3>
                  <Trophy size={16} />
                  {t("À toi de construire", "Time to build")}
                </h3>
                {level.projects.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      go(`${coursePath}/${level.id}/projet/${item.id}`)
                    }
                    aria-current={
                      view === "projet" && project?.id === item.id
                        ? "page"
                        : undefined
                    }
                  >
                    <span>
                      {progress.projects.includes(`${level.id}/${item.id}`) ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <Code2 size={17} />
                      )}
                    </span>
                    <span>
                      <small>
                        {t("MINI-PROJET", "MINI PROJECT")} {index + 1}
                      </small>
                      {item.title}
                    </span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
              <button
                className="web-free-studio"
                onClick={() =>
                  go(`${coursePath}/${level.id}/atelier/${lesson.id}`)
                }
              >
                <Play size={15} />
                {t("Ouvrir l’atelier libre", "Open practice studio")}
                <ArrowRight size={15} />
              </button>
            </nav>
          </aside>
          <section
            id="web-active-content"
            className="web-active-content"
            tabIndex={-1}
            aria-label={t(
              "Leçon ou atelier sélectionné",
              "Selected lesson or studio",
            )}
          >
            {view === "lecon" ? (
              <>
                <section className="web-level-objective">
                  <span>
                    <Target size={20} />
                  </span>
                  <div>
                    <small>{t("OBJECTIF DU NIVEAU", "LEVEL OBJECTIVE")}</small>
                    <h3>{level.subtitle}</h3>
                    <p>{level.objective}</p>
                    {firstLessonOfLevel && level.definition && !levels.slice(0, levels.indexOf(level)).some((earlier) => earlier.definition === level.definition) && (
                      <div className="web-framework-definition">
                        <h4>
                          {t(
                            `Qu’est-ce que ${curriculum.title} ?`,
                            `What is ${curriculum.title}?`,
                          )}
                        </h4>
                        <p>{level.definition}</p>
                      </div>
                    )}
                    {firstLessonOfCourse && <><div className="web-execution-note"><strong>{t("Comment ce cours s’exécute", "How this course runs")}</strong><p>{courseFoundations[courseId].execution}</p></div>
                    <details className="web-first-steps"><summary>{t("Tes premiers repères", "Your first landmarks")}<ChevronDown size={14} /></summary><ol>{courseFoundations[courseId].journey.map((step) => <li key={step}>{step}</li>)}</ol></details></>}
                    <details>
                      <summary>
                        {t(
                          "Ce que tu sauras à ce niveau",
                          "What you’ll learn at this level",
                        )}
                        <ChevronDown size={14} />
                      </summary>
                      <ul>
                        {level.outcomes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p>{level.prerequisites}</p>
                    </details>
                  </div>
                </section>
                <LessonReader
                  key={`${level.id}/${lesson.id}`}
                  lesson={lesson}
                  courseId={courseId}
                  beginner={level.id === "debutant"}
                  showTry={canTryExample(courseId, curriculum.path, level, lesson)}
                  vocabulary={vocabulary}
                  onReviewDefinition={(origin) => openLesson(levels.find((item) => item.id === origin.levelId)!, origin.lessonId)}
                  onAskCode={askAboutCode}
                  chapter={currentChapter?.title || ""}
                  completed={progress.lessons.includes(
                    `${level.id}/${lesson.id}`,
                  )}
                  onComplete={finishLesson}
                  onTry={() =>
                    go(`${coursePath}/${level.id}/atelier/${lesson.id}`)
                  }
                />
                {(mode === "html-css"
                  ? lesson.id === "environnement"
                  : level.id === "debutant") && (
                  <section className="web-tools-panel">
                    <h3>{t("Ta boîte à outils", "Your toolkit")}</h3>
                    <p>
                      {t(
                        "Des outils pour comprendre le cours, compiler et poursuivre tes projets sur ton ordinateur.",
                        "Tools to understand the course, compile and continue your projects on your computer.",
                      )}
                    </p>
                    <div>
                      {curriculum.toolbox.map((tool) => (
                        <a
                          key={tool.name}
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <strong>
                            {tool.name}
                            <ExternalLink size={14} />
                          </strong>
                          <span>{tool.role}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
                <nav
                  className="web-lesson-pagination"
                  aria-label={t(
                    "Passer à une autre leçon",
                    "Lesson navigation",
                  )}
                >
                  <button
                    disabled={!previousLesson}
                    onClick={() =>
                      previousLesson && openLesson(level, previousLesson.id)
                    }
                  >
                    <ArrowLeft size={16} />
                    {t("Leçon précédente", "Previous lesson")}
                  </button>
                  <button
                    onClick={() =>
                      nextLesson
                        ? openLesson(level, nextLesson.id)
                        : go(
                            `${coursePath}/${level.id}/projet/${level.projects[0].id}`,
                          )
                    }
                  >
                    {nextLesson
                      ? t("Leçon suivante", "Next lesson")
                      : t("Passer aux mini-projets", "Start the mini projects")}
                    <ArrowRight size={16} />
                  </button>
                </nav>
                {!nextLesson && (
                  <ProjectChoices
                    level={level}
                    onOpen={(id) =>
                      go(`${coursePath}/${level.id}/projet/${id}`)
                    }
                  />
                )}
              </>
            ) : (
              <>
                <button
                  className="web-text-button web-return-lesson"
                  onClick={() => openLesson(level, lesson.id)}
                >
                  <ArrowLeft size={16} />
                  {t("Revenir à la leçon", "Return to lesson")}
                </button>
                <WebCodeStudio
                  key={`${level.id}/${view}/${project?.id || lesson.id}`}
                  draftId={`${mode === "html-css" ? "" : `${courseId}-`}${level.id}-${view}-${project?.id || lesson.id}`}
                  mode={mode}
                  title={project?.title || lesson.title}
                  initialFiles={project?.files || lesson.files}
                  project={view === "projet" ? project : undefined}
                  completed={
                    project
                      ? progress.projects.includes(`${level.id}/${project.id}`)
                      : undefined
                  }
                  onComplete={finishProject}
                />
                <ProjectChoices
                  level={level}
                  onOpen={(id) => go(`${coursePath}/${level.id}/projet/${id}`)}
                />
              </>
            )}
            {percent === 100 && (
              <section className="web-level-finished" role="status">
                <Trophy size={30} />
                <div>
                  <h3>
                    {t(
                      "Ce niveau est terminé. Bravo pour ta régularité !",
                      "Level complete. Well done for keeping at it!",
                    )}
                  </h3>
                  <p>
                    {t(
                      "Tu peux revoir les leçons, améliorer tes projets ou choisir le niveau suivant.",
                      "Revisit lessons, improve your projects or choose the next level.",
                    )}
                  </p>
                </div>
              </section>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function ProjectChoices({
  level,
  onOpen,
}: {
  level: WebLevel;
  onOpen: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <section className="web-project-choices">
      <div className="web-section-heading">
        <span className="web-eyebrow">
          <Code2 size={16} />
          {t("APPRENDRE EN FAISANT", "LEARN BY DOING")}
        </span>
        <h3>
          {t(
            "Mets tes acquis en pratique",
            "Put your skills into practice",
          )}
        </h3>
      </div>
      <div>
        {level.projects.map((project, index) => (
          <button key={project.id} onClick={() => onOpen(project.id)}>
            <span className="web-project-index">0{index + 1}</span>
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <span>
              <Clock3 size={14} />
              {project.minutes} min {t("indicatives", "approx.")}
            </span>
            <strong>
              {t("Ouvrir le projet", "Open project")}
              <ArrowRight size={16} />
            </strong>
          </button>
        ))}
      </div>
    </section>
  );
}
function LessonReader({
  lesson,
  courseId,
  beginner,
  showTry,
  vocabulary,
  onReviewDefinition,
  onAskCode,
  chapter,
  completed,
  onComplete,
  onTry,
}: {
  lesson: WebLesson;
  courseId: DetailedCourseId;
  beginner: boolean;
  showTry: boolean;
  vocabulary: LessonVocabularyPlan;
  onReviewDefinition: (origin: VocabularyOrigin) => void;
  onAskCode: (file: string, code: string, anchor?: HTMLElement) => void;
  chapter: string;
  completed: boolean;
  onComplete: () => void;
  onTry: () => void;
}) {
  const { t } = useI18n();
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [codeFile, setCodeFile] = useState(firstEditorFile(lesson.files));
  const correct = checked && answer === lesson.quiz.answer;
  return (
    <>
      <article className="web-lesson-panel">
        <div className="web-lesson-kicker">
          <span>{chapter}</span>
          <span>
            <Clock3 size={14} />
            {lesson.minutes} min
          </span>
        </div>
        <h2>{lesson.title}</h2>
        <p className="web-lesson-lead">{lesson.summary}</p>
        {courseId === "lang-sql" && <aside className="web-sql-dialect"><strong>SQL · SQLite</strong><p>{t("Dans cette salle, les requêtes s’exécutent avec SQLite. PostgreSQL, MySQL et SQL Server ont leurs propres particularités.", "This classroom runs queries with SQLite. PostgreSQL, MySQL and SQL Server have their own differences.")}</p><a href="/guides/sqlite-et-sgbd.html" target="_blank" rel="noreferrer">{t("Guide détaillé : SQLite et les autres SGBD", "Detailed guide: SQLite and other database systems")}<ExternalLink size={14} /></a></aside>}
        <LessonVocabulary plan={vocabulary} beginner={beginner} onReview={onReviewDefinition} />
        {lesson.sections.map((section) => (
          <section className="web-lesson-section" key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.text}</p>
            <ul>
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
        <div className="web-takeaway">
          <Sparkles size={21} />
          <div>
            <strong>{t("À retenir", "Remember")}</strong>
            <p>{lesson.takeaway}</p>
          </div>
        </div>
        <section className="web-example">
          <div className="web-example-heading">
            <h3>{t("Un exemple à explorer", "An example to explore")}</h3>
            {lesson.files.local ? (
              <select
                className="web-example-file-select"
                value={codeFile}
                aria-label={t("Fichier de l’exemple", "Example file")}
                onChange={(event) => setCodeFile(event.target.value)}
              >
                {editorFilenames(lesson.files).map((file) => (
                  <option key={file}>{file}</option>
                ))}
              </select>
            ) : (
              <div
                role="group"
                aria-label={t("Fichier de l’exemple", "Example file")}
              >
                {editorFilenames(lesson.files).map((file) => (
                  <button
                    key={file}
                    aria-pressed={codeFile === file}
                    onClick={() => setCodeFile(file)}
                  >
                    {file}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="web-example-code">
          <button type="button" className="web-example-robot" aria-label={t("Demander à l’agent d’expliquer ce code", "Ask the agent to explain this code")} title={t("Demander à l’agent d’expliquer ce code", "Ask the agent to explain this code")} onClick={event => onAskCode(codeFile, readEditorFile(lesson.files, codeFile), event.currentTarget)}><Bot size={19} /></button>
          <pre>
            <code>{readEditorFile(lesson.files, codeFile)}</code>
          </pre>
          </div>
          {showTry && <div className="web-example-actions"><button className="web-primary-button" onClick={onTry}>
            <Play size={16} />
            {t("Essayer dans l’atelier", "Try in the studio")}
            <ArrowRight size={16} />
          </button>
          </div>}
        </section>
        <div className="web-practice">
          <span>
            <Code2 size={20} />
          </span>
          <div>
            <strong>{t("À toi de jouer", "Your turn")}</strong>
            <p>{lesson.task}</p>
          </div>
        </div>
        <a
          className="web-source-link"
          href={lesson.resource.url}
          target="_blank"
          rel="noreferrer"
        >
          {lesson.resource.label}
          <ExternalLink size={14} />
        </a>
      </article>
      <form
        className="web-lesson-quiz"
        onSubmit={(event) => {
          event.preventDefault();
          if (answer === null) return;
          setChecked(true);
          if (answer === lesson.quiz.answer) onComplete();
        }}
      >
        <span className="web-eyebrow">
          {t("UN INSTANT POUR VÉRIFIER", "A QUICK CHECK")}
        </span>
        <h3>{lesson.quiz.question}</h3>
        <fieldset>
          <legend className="sr-only">
            {t("Choisis une réponse", "Choose an answer")}
          </legend>
          {lesson.quiz.options.map((option, index) => (
            <label key={option} className={answer === index ? "selected" : ""}>
              <input
                name={`web-quiz-${lesson.id}`}
                type="radio"
                checked={answer === index}
                onChange={() => {
                  setAnswer(index);
                  setChecked(false);
                }}
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
        <div className="web-quiz-actions">
          <button
            type="submit"
            className="web-primary-button"
            disabled={answer === null}
          >
            {t("Vérifier ma réponse", "Check my answer")}
            <CheckCircle2 size={16} />
          </button>
          {completed && (
            <span>
              <CheckCircle2 size={16} />
              {t("Leçon validée", "Lesson completed")}
            </span>
          )}
        </div>
        {checked && (
          <div
            className={`web-quiz-feedback ${correct ? "correct" : ""}`}
            role="status"
          >
            <strong>
              {correct
                ? t("Bien vu !", "Well done!")
                : t(
                    "Prends un instant et réessaie.",
                    "Take a moment and try again.",
                  )}
            </strong>
            <p>{lesson.quiz.explanation}</p>
          </div>
        )}
      </form>
    </>
  );
}
