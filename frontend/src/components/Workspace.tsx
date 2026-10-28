import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Check,
  Code2,
  Flag,
  Heart,
  LogOut,
  MessageCircle,
  Paperclip,
  Plus,
  Search,
  Send,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useLocalData } from "../lib/storage";

type Tab =
  | "communaute"
  | "profil"
  | "apprentissage"
  | "offres"
  | "groupes"
  | "messages"
  | "ia";
const tabs = [
  ["communaute", "Communauté", UsersRound],
  ["profil", "Mon profil", UserRound],
  ["apprentissage", "Apprentissage", BookOpen],
  ["offres", "Offres", BriefcaseBusiness],
  ["groupes", "Groupes", MessageCircle],
  ["messages", "Messagerie", Send],
  ["ia", "Assistant IA", Bot],
] as const;
const initialPosts = [
  {
    id: 1,
    author: "Amina Diallo",
    country: "Sénégal",
    tag: "Projet",
    text: "Je développe une application pour connecter les artisans locaux à leurs clients. Qui veut échanger sur React et Django ?",
    likes: 24,
    liked: false,
    comments: ["Très belle idée ! Vous cherchez aussi des designers ?"],
  },
  {
    id: 2,
    author: "Tiana Rakoto",
    country: "Madagascar",
    tag: "Question",
    text: "Quelle est votre méthode pour rendre une interface responsive ? Je partage bientôt mon premier portfolio !",
    likes: 12,
    liked: false,
    comments: [] as string[],
  },
];
const initialJobs = [
  {
    id: 1,
    title: "Développeur frontend React",
    company: "Baobab Studio",
    country: "Sénégal",
    contract: "CDI",
    mode: "Remote",
    skills: "React · TypeScript",
  },
  {
    id: 2,
    title: "Stage développeur Django",
    company: "MadaTech",
    country: "Madagascar",
    contract: "Stage",
    mode: "Hybride",
    skills: "Python · Django",
  },
  {
    id: 3,
    title: "Designer UI / UX",
    company: "Ubuntu Digital",
    country: "Kenya",
    contract: "Freelance",
    mode: "Remote",
    skills: "Figma · Design system",
  },
];
const courses = [
  {
    title: "Les bases de React",
    skill: "React",
    description: "Composants, propriétés et état local.",
    question: "Quel hook permet de gérer un état local ?",
    options: ["useState", "useStyle", "useHTML"],
    answer: 0,
  },
  {
    title: "Créer une interface responsive",
    skill: "CSS",
    description: "Grilles, flexbox et media queries.",
    question: "Quelle règle adapte le style à la largeur de l’écran ?",
    options: ["@import", "@media", "@font-face"],
    answer: 1,
  },
  {
    title: "Découvrir les API Django",
    skill: "API",
    description: "Relier le navigateur et le serveur.",
    question: "Quel verbe HTTP sert généralement à lire une ressource ?",
    options: ["DELETE", "POST", "GET"],
    answer: 2,
  },
];

export default function Workspace({
  initialTab,
  onHome,
}: {
  initialTab: string;
  onHome: () => void;
}) {
  const [tab, setTab] = useState<Tab>(
    tabs.some((t) => t[0] === initialTab) ? (initialTab as Tab) : "communaute",
  );
  const [notice, setNotice] = useState("");
  const [posts, setPosts] = useLocalData("posts", initialPosts);
  const [profile, setProfile] = useLocalData("profile", {
    name: "Juliana",
    country: "Madagascar",
    level: "Débutant",
    skills: "React, UI/UX, Blender",
    bio: "Je construis et j’apprends avec la communauté.",
    experience: "Étudiante en informatique",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [jobs, setJobs] = useLocalData("jobs", initialJobs);
  const [applications, setApplications] = useLocalData<number[]>(
    "applications",
    [],
  );
  const [groups, setGroups] = useLocalData("groups", [
    {
      id: 1,
      name: "React Africa",
      description: "Construisons des interfaces ensemble.",
      joined: false,
    },
    {
      id: 2,
      name: "Python & Django",
      description: "Du premier script à votre API.",
      joined: true,
    },
  ]);
  const [messages, setMessages] = useLocalData<
    { id: number; conversation: string; text: string; file?: string }[]
  >("messages", []);
  const [progress, setProgress] = useLocalData<string[]>("progress", []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [postText, setPostText] = useState("");
  const [postTag, setPostTag] = useState("Projet");
  const [comment, setComment] = useState("");
  const [commentPost, setCommentPost] = useState<number | null>(null);
  const [conversation, setConversation] = useState("Amina Diallo");
  const [messageText, setMessageText] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [modal, setModal] = useState<"offre" | "groupe" | "report" | null>(
    null,
  );
  const modalRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = modalRef.current;
    const focusable = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, [tabindex="0"]',
        ) || [],
      );
    focusable()[0]?.focus();
    function trap(event: KeyboardEvent) {
      if (event.key === "Escape") setModal(null);
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [modal]);
  const [reportTarget, setReportTarget] = useState("");
  const [course, setCourse] = useState<number | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [ai, setAi] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [chatGroup, setChatGroup] = useState<number | null>(null);
  function submitModal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (modal === "groupe")
      setGroups([
        {
          id: Date.now(),
          name: String(data.get("name")).trim(),
          description: String(data.get("description")).trim(),
          joined: true,
        },
        ...groups,
      ]);
    if (modal === "offre")
      setJobs([
        {
          id: Date.now(),
          title: String(data.get("name")).trim(),
          company: String(data.get("company")).trim(),
          country: String(data.get("country")).trim(),
          contract: String(data.get("contract")),
          mode: String(data.get("mode")),
          skills: String(data.get("description")).trim(),
        },
        ...jobs,
      ]);
    if (modal === "report") {
      setNotice(
        "Signalement enregistré dans cette démonstration. Aucun modérateur n’a été contacté.",
      );
      try {
        const reports = JSON.parse(
          localStorage.getItem("devafrica:reports") || "[]",
        );
        localStorage.setItem(
          "devafrica:reports",
          JSON.stringify([
            ...reports,
            {
              target: reportTarget,
              reason: data.get("description"),
              date: new Date().toISOString(),
            },
          ]),
        );
      } catch {
        setNotice(
          "Stockage indisponible : le signalement n’a pas été conservé.",
        );
      }
    } else setNotice("Création enregistrée dans cette démonstration locale.");
    setModal(null);
  }
  function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!messageText.trim() && !attachment) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        conversation,
        text: messageText.trim(),
        file: attachment?.name,
      },
    ]);
    setMessageText("");
    setAttachment(null);
  }
  const visibleMessages = messages.filter(
    (m) => m.conversation === conversation,
  );
  return (
    <div className="workspace">
      <aside className="sidebar">
        <button className="brand-button" onClick={onHome}>
          <div className="brand">
            <img src="/images/africa-mark.png" alt="" />
            <div className="brand-wordmark">
              <strong>
                Dev<span>Africa</span>
              </strong>
              <small>CONNECT</small>
            </div>
          </div>
        </button>
        <p className="sidebar-caption">TON ESPACE DÉVELOPPEUR</p>
        <nav aria-label="Modules">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => {
                setTab(id);
                setFilter("Tous");
                setSearch("");
                setNotice("");
                setChatGroup(null);
                setCourse(null);
              }}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
        <button className="exit-demo" onClick={onHome}>
          <LogOut size={18} /> Quitter la démo
        </button>
        <small>Par les devs. Pour les devs.</small>
      </aside>
      <main className="workspace-main">
        <div className="workspace-top">
          <span>
            <span className="status-dot" /> Espace communautaire
          </span>
          <button
            className="avatar"
            onClick={() => setTab("profil")}
            aria-label="Ouvrir mon profil"
          >
            {profile.name.slice(0, 2).toUpperCase()}
          </button>
        </div>
        <div className="demo-banner">
          <Code2 size={18} />
          <span>
            Mode démo · données enregistrées sur cet appareil. Connexion Django
            à venir.
          </span>
        </div>
        <header className="module-heading">
          <div>
            <p className="eyebrow">APPRENDRE. PARTAGER. CONSTRUIRE.</p>
            <h1>{tabs.find((t) => t[0] === tab)?.[1]}</h1>
            <p>Le prochain grand projet africain commence par un échange.</p>
          </div>
          <span className="country-pill">🌍 Connectés par le code</span>
        </header>
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button onClick={() => setNotice("")} aria-label="Fermer">
              <X size={18} />
            </button>
          </div>
        )}
        {tab === "profil" && (
          <form
            className="panel profile-form"
            onSubmit={(e) => {
              e.preventDefault();
              setProfile(draftProfile);
              setNotice("Profil enregistré sur cet appareil.");
            }}
          >
            <div className="profile-cover">
              <UserRound size={42} />
              <div>
                <h2>{profile.name}</h2>
                <p>
                  {profile.country} · {profile.level}
                </p>
              </div>
            </div>
            {(["name", "country", "skills", "experience", "bio"] as const).map(
              (key, i) => (
                <label key={key}>
                  {
                    [
                      "Nom complet",
                      "Pays",
                      "Compétences (séparées par des virgules)",
                      "Expériences, diplômes et certificats",
                      "Présentation",
                    ][i]
                  }
                  <input
                    required={key === "name" || key === "country"}
                    value={draftProfile[key]}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        [key]: e.target.value,
                      })
                    }
                  />
                </label>
              ),
            )}
            <label>
              Niveau
              <select
                value={draftProfile.level}
                onChange={(e) =>
                  setDraftProfile({ ...draftProfile, level: e.target.value })
                }
              >
                {["Débutant", "Intermédiaire", "Avancé", "Expert"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <button className="btn-primary">
              Enregistrer mon profil <Check size={17} />
            </button>
          </form>
        )}
        {tab === "communaute" && (
          <div className="feed-layout">
            <section>
              <form
                className="panel composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!postText.trim()) return;
                  setPosts([
                    {
                      id: Date.now(),
                      author: profile.name,
                      country: profile.country,
                      tag: postTag,
                      text: postText.trim(),
                      likes: 0,
                      liked: false,
                      comments: [],
                    },
                    ...posts,
                  ]);
                  setPostText("");
                }}
              >
                <h2>Une idée à partager ?</h2>
                <textarea
                  aria-label="Votre publication"
                  placeholder="Partage un projet, une question, une découverte…"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  required
                  maxLength={3000}
                />
                <div className="row">
                  <select
                    aria-label="Type de publication"
                    value={postTag}
                    onChange={(e) => setPostTag(e.target.value)}
                  >
                    <option>Projet</option>
                    <option>Question</option>
                    <option>Découverte</option>
                  </select>
                  <button className="btn-primary">
                    Publier <Send size={16} />
                  </button>
                </div>
              </form>
              <div className="filter-tabs">
                {["Tous", "Projet", "Question"].map((t) => (
                  <button
                    key={t}
                    className={filter === t ? "active" : ""}
                    onClick={() => setFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {posts
                .filter((p) => filter === "Tous" || p.tag === filter)
                .map((p) => (
                  <article className="panel post" key={p.id}>
                    <div className="row">
                      <div className="person">
                        <span className="avatar">
                          {p.author.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <strong>{p.author}</strong>
                          <small>
                            {p.country} · {p.tag}
                          </small>
                        </div>
                      </div>
                      <button
                        className="quiet"
                        aria-label={`Signaler la publication de ${p.author}`}
                        onClick={() => {
                          setReportTarget(`Publication ${p.id}`);
                          setModal("report");
                        }}
                      >
                        <Flag size={17} />
                      </button>
                    </div>
                    <p className="post-content">{p.text}</p>
                    <div className="post-actions">
                      <button
                        aria-pressed={p.liked}
                        onClick={() =>
                          setPosts(
                            posts.map((x) =>
                              x.id === p.id
                                ? {
                                    ...x,
                                    liked: !x.liked,
                                    likes: x.likes + (x.liked ? -1 : 1),
                                  }
                                : x,
                            ),
                          )
                        }
                      >
                        <Heart size={18} fill={p.liked ? "#147cff" : "none"} />
                        {p.likes}
                      </button>
                      <button
                        onClick={() => {
                          setCommentPost(commentPost === p.id ? null : p.id);
                          setComment("");
                        }}
                      >
                        <MessageCircle size={18} />
                        {p.comments.length} commentaires
                      </button>
                    </div>
                    {commentPost === p.id && (
                      <div className="comments">
                        {p.comments.map((c, i) => (
                          <p key={i}>{c}</p>
                        ))}
                        <form
                          className="row"
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!comment.trim()) return;
                            setPosts(
                              posts.map((x) =>
                                x.id === p.id
                                  ? {
                                      ...x,
                                      comments: [...x.comments, comment.trim()],
                                    }
                                  : x,
                              ),
                            );
                            setComment("");
                          }}
                        >
                          <input
                            aria-label="Ajouter un commentaire"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Un commentaire bienveillant…"
                            required
                          />
                          <button
                            className="btn-primary"
                            aria-label="Envoyer le commentaire"
                          >
                            <Send size={18} />
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                ))}
            </section>
            <aside className="panel community-aside">
              <span className="feature-icon cyan">
                <RocketIcon />
              </span>
              <h2>Ensemble, plus loin.</h2>
              <p>
                Ton expérience peut débloquer le projet de quelqu’un. Pose une
                question, partage ce que tu sais.
              </p>
              <h3>À explorer</h3>
              <button className="text-link" onClick={() => setTab("groupes")}>
                Trouver mon groupe <ArrowRight size={16} />
              </button>
              <div className="tag-list">
                <span>#React</span>
                <span>#Django</span>
                <span>#MadeInAfrica</span>
              </div>
            </aside>
          </div>
        )}
        {tab === "offres" && (
          <>
            <div className="toolbar">
              <label className="search-box">
                <Search size={18} />
                <input
                  aria-label="Rechercher une offre"
                  placeholder="Poste, compétence, pays…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <select
                aria-label="Mode de travail"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["Tous", "Remote", "Hybride", "Local"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <button className="btn-primary" onClick={() => setModal("offre")}>
                <Plus size={18} /> Publier une offre
              </button>
            </div>
            <div className="module-grid">
              {jobs
                .filter(
                  (j) =>
                    (filter === "Tous" ||
                      !["Remote", "Hybride", "Local"].includes(filter) ||
                      j.mode === filter) &&
                    `${j.title} ${j.skills} ${j.country}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map((j) => (
                  <article className="panel job" key={j.id}>
                    <span className="feature-icon orange">
                      <BriefcaseBusiness />
                    </span>
                    <h2>{j.title}</h2>
                    <p>
                      {j.company} · {j.country}
                    </p>
                    <div className="tag-list">
                      <span>{j.contract}</span>
                      <span>{j.mode}</span>
                    </div>
                    <p>{j.skills}</p>
                    <button
                      className="btn-primary"
                      disabled={applications.includes(j.id)}
                      onClick={() => {
                        setApplications([...applications, j.id]);
                        setNotice(
                          "Candidature simulée. Aucun employeur n’a été contacté.",
                        );
                      }}
                    >
                      {applications.includes(j.id)
                        ? "Candidature enregistrée"
                        : "Postuler"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </article>
                ))}
            </div>
            <p className="muted">
              {
                jobs.filter(
                  (j) =>
                    (!["Remote", "Hybride", "Local"].includes(filter) ||
                      j.mode === filter) &&
                    `${j.title} ${j.skills} ${j.country}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                ).length
              }{" "}
              offre(s) trouvée(s).
            </p>
          </>
        )}
        {tab === "groupes" && (
          <>
            <div className="toolbar">
              <label className="search-box">
                <Search size={18} />
                <input
                  placeholder="Rechercher un groupe…"
                  aria-label="Rechercher un groupe"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <button
                className="btn-primary"
                onClick={() => setModal("groupe")}
              >
                <Plus size={18} /> Créer un groupe
              </button>
            </div>
            <div className="module-grid">
              {groups
                .filter((g) =>
                  g.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((g) => (
                  <article className="panel" key={g.id}>
                    <span className="feature-icon purple">
                      <UsersRound />
                    </span>
                    <h2>{g.name}</h2>
                    <p>{g.description}</p>
                    <div className="row">
                      <button
                        className="btn-primary"
                        onClick={() =>
                          setGroups(
                            groups.map((x) =>
                              x.id === g.id ? { ...x, joined: !x.joined } : x,
                            ),
                          )
                        }
                      >
                        {g.joined ? "Quitter" : "Rejoindre"}
                      </button>
                      {g.joined && (
                        <button
                          className="text-link"
                          onClick={() => {
                            setChatGroup(g.id);
                            setConversation(`Groupe : ${g.name}`);
                            setTab("messages");
                          }}
                        >
                          Discuter
                        </button>
                      )}
                    </div>
                  </article>
                ))}
            </div>
            {!groups.some((g) =>
              g.name.toLowerCase().includes(search.toLowerCase()),
            ) && <p>Aucun groupe trouvé.</p>}
          </>
        )}
        {tab === "messages" && (
          <section className="panel messenger">
            <aside className="conversation-list">
              <h2>Conversations</h2>
              {[
                "Amina Diallo",
                "Tiana Rakoto",
                ...groups
                  .filter((g) => g.joined)
                  .map((g) => `Groupe : ${g.name}`),
              ].map((n) => (
                <button
                  key={n}
                  className={conversation === n ? "active" : ""}
                  onClick={() => {
                    setConversation(n);
                    setAttachment(null);
                    setMessageText("");
                  }}
                >
                  <span className="avatar">{n.slice(0, 2)}</span>
                  {n}
                </button>
              ))}
            </aside>
            <div className="chat">
              <h2>{conversation}</h2>
              <small>
                {chatGroup ? "Discussion de groupe" : "Conversation privée"} ·
                simulation locale
              </small>
              <div className="chat-history" aria-live="polite">
                <p className="chat-hint">
                  Commence la discussion. Les messages de cette démo restent sur
                  cet appareil.
                </p>
                {visibleMessages.map((m) => (
                  <div className="chat-bubble" key={m.id}>
                    <p>{m.text}</p>
                    {m.file && (
                      <small>
                        <Paperclip size={14} />
                        {m.file} (nom uniquement, fichier non envoyé)
                      </small>
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage}>
                <div className="row">
                  <label className="file-label" title="Joindre un fichier">
                    <Paperclip size={20} />
                    <span className="sr-only">
                      Joindre un fichier (nom uniquement en démo)
                    </span>
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f && f.size > 5 * 1024 * 1024) {
                          setNotice("Choisis un fichier de 5 Mo maximum.");
                          e.target.value = "";
                          return;
                        }
                        setAttachment(f ?? null);
                      }}
                    />
                  </label>
                  <input
                    aria-label="Votre message"
                    placeholder="Écris ton message…"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    className="btn-primary"
                    aria-label="Envoyer le message"
                  >
                    <Send size={18} />
                  </button>
                </div>
                {attachment && (
                  <small>
                    {attachment.name}{" "}
                    <button type="button" onClick={() => setAttachment(null)}>
                      Retirer
                    </button>
                  </small>
                )}
              </form>
            </div>
          </section>
        )}
        {tab === "apprentissage" && (
          <>
            <div className="panel learning-intro">
              <div>
                <span className="feature-icon green">
                  <BookOpen />
                </span>
                <h2>Chaque petit pas compte.</h2>
                <p>Trois premiers exercices pour commencer à construire.</p>
              </div>
              <div>
                <strong>
                  {progress.length} / {courses.length}
                </strong>
                <p>exercices réussis</p>
                <progress
                  value={progress.length}
                  max={courses.length}
                  aria-label="Progression globale"
                />
              </div>
            </div>
            <div className="module-grid">
              {courses.map((c, i) => (
                <article className="panel" key={c.title}>
                  <span className="tag">{c.skill} · Débutant</span>
                  <h2>{c.title}</h2>
                  <p>{c.description}</p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setCourse(i);
                      setAnswer(null);
                    }}
                  >
                    {progress.includes(c.title)
                      ? "Revoir l’exercice"
                      : "Commencer"}{" "}
                    <ArrowRight size={17} />
                  </button>
                </article>
              ))}
            </div>
            {course !== null && (
              <section className="panel exercise">
                <h2>{courses[course].question}</h2>
                {courses[course].options.map((o, i) => (
                  <button
                    className={`answer ${answer === i ? "chosen" : ""}`}
                    key={o}
                    onClick={() => {
                      setAnswer(i);
                      if (
                        i === courses[course].answer &&
                        !progress.includes(courses[course].title)
                      )
                        setProgress([...progress, courses[course].title]);
                    }}
                  >
                    {o}
                  </button>
                ))}
                {answer !== null && (
                  <p role="status">
                    {answer === courses[course].answer
                      ? "Bravo, c’est la bonne réponse ! Ta progression est enregistrée."
                      : "Pas encore. Essaie une autre réponse."}
                  </p>
                )}
              </section>
            )}
          </>
        )}
        {tab === "ia" && (
          <section className="panel ai-panel">
            <span className="feature-icon cyan">
              <Bot />
            </span>
            <h2>Un coup de pouce pour apprendre</h2>
            <p>
              Prototype d’aide à règles fixes. Aucun modèle IA n’est connecté
              pour le moment.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = ai.toLowerCase();
                setAiResult(
                  q.includes("react")
                    ? "React compose une interface avec des composants. useState conserve une valeur et déclenche un nouvel affichage quand elle change. Essaie l’exercice React du module Apprentissage."
                    : q.includes("django") || q.includes("api")
                      ? "Le navigateur envoie une requête HTTP à Django. Django valide les données puis renvoie une réponse JSON. Votre équipe devra convenir des URL, des champs et de l’authentification."
                      : q.includes("css") || q.includes("responsive")
                        ? "Commence avec une seule colonne pour mobile, utilise grid ou flex, puis ajoute une media query pour les grands écrans. Vérifie aussi le clavier et les débordements à 320 px."
                        : "Pour cette démo, pose une question contenant React, Django, API, CSS ou responsive. Les réponses sont prédéfinies.",
                );
              }}
            >
              <textarea
                required
                aria-label="Question à l’assistant"
                placeholder="Comment fonctionne React ?"
                value={ai}
                onChange={(e) => setAi(e.target.value)}
              />
              <button className="btn-primary">
                Demander de l’aide <Bot size={18} />
              </button>
            </form>
            {aiResult && (
              <div className="ai-response" role="status">
                {aiResult}
              </div>
            )}
          </section>
        )}
      </main>
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <section
            ref={modalRef}
            className="panel modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") setModal(null);
            }}
          >
            <div className="row">
              <h2 id="modal-title">
                {modal === "offre"
                  ? "Publier une offre"
                  : modal === "groupe"
                    ? "Créer un groupe"
                    : "Signaler un contenu"}
              </h2>
              <button
                className="quiet"
                autoFocus
                aria-label="Fermer"
                onClick={() => setModal(null)}
              >
                <X />
              </button>
            </div>
            <form onSubmit={submitModal}>
              {modal !== "report" && (
                <label>
                  {modal === "offre" ? "Intitulé du poste" : "Nom du groupe"}
                  <input
                    name="name"
                    required
                    maxLength={100}
                    pattern=".*\S.*"
                  />
                </label>
              )}
              {modal === "offre" && (
                <>
                  <label>
                    Organisation
                    <input name="company" required />
                  </label>
                  <label>
                    Pays
                    <input name="country" required />
                  </label>
                  <label>
                    Contrat
                    <select name="contract">
                      <option>CDI</option>
                      <option>CDD</option>
                      <option>Stage</option>
                      <option>Freelance</option>
                    </select>
                  </label>
                  <label>
                    Mode de travail
                    <select name="mode">
                      <option>Remote</option>
                      <option>Hybride</option>
                      <option>Local</option>
                    </select>
                  </label>
                </>
              )}
              <label>
                {modal === "report"
                  ? "Motif du signalement"
                  : modal === "offre"
                    ? "Compétences recherchées"
                    : "Description"}
                <textarea name="description" required maxLength={1000} />
              </label>
              <button className="btn-primary" type="submit">
                {modal === "report" ? "Enregistrer le signalement" : "Créer"}{" "}
                <Check size={17} />
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
function RocketIcon() {
  return <ArrowRight />;
}
