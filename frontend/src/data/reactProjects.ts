import { reactFiles } from "./courseAuthoring";
import type { WebProject } from "./webCourseTypes";

const vote: WebProject = {
  id: "votes",
  title: "Votes et scores",
  minutes: 55,
  description:
    "Utilise un composant pour chaque participant et calcule le total à partir des scores.",
  requirements: [
    "Réutiliser un composant avec le nom, le score et une fonction de vote en props.",
    "Mettre à jour uniquement le score du participant choisi.",
    "Calculer le total des voix et ajouter une remise à zéro.",
  ],
  hints: [
    "Utilise une fonction de mise à jour avec la valeur précédente dans setParticipants.",
    "Calcule le total avec reduce pendant le rendu.",
    "L’identifiant de chaque participant sert de key.",
  ],
  files: reactFiles(
    "Votes et scores",
    `import { useState } from "react";

const depart = [
  { id: "a", nom: "Aïcha", voix: 0 },
  { id: "b", nom: "Bako", voix: 0 },
  { id: "c", nom: "Lina", voix: 0 }
];

function Participant({ nom, voix, onVoter }) {
  return <article className="card"><h2>{nom}</h2><p>{voix} voix</p><button onClick={onVoter}>Voter pour {nom}</button></article>;
}

function App() {
  const [participants, setParticipants] = useState(depart);
  function voter(id) {
    setParticipants(avant => avant.map(personne => personne.id === id ? { ...personne, voix: personne.voix + 1 } : personne));
  }
  const total = participants.reduce((somme, personne) => somme + personne.voix, 0);
  return <main><h1>Votes et scores</h1><p role="status">Total : {total}</p>
    <div className="grid">{participants.map(personne => <Participant key={personne.id} nom={personne.nom} voix={personne.voix} onVoter={() => voter(personne.id)} />)}</div>
    {/* À toi : ajoute un bouton pour remettre les scores à zéro. */}
  </main>;
}`,
  ),
};

const converter: WebProject = {
  id: "devises",
  title: "Convertisseur de devises",
  minutes: 55,
  description:
    "Relie un montant et un choix de devise à un résultat calculé à chaque saisie.",
  requirements: [
    "Contrôler le champ de montant et le menu avec useState.",
    "Calculer le résultat au rendu avec un taux d’exercice clairement indiqué.",
    "Gérer un champ vide et ajouter une devise au tableau des taux.",
  ],
  hints: [
    "Conserve la saisie comme chaîne puis convertis-la avec Number.",
    "Utilise Intl.NumberFormat pour afficher la devise.",
    "Le résultat découle du montant et de la devise. Il n’a pas besoin d’un état séparé.",
  ],
  files: reactFiles(
    "Convertisseur de devises",
    `import { useState } from "react";

const tauxExercice = { MGA: 4900, USD: 1.1, JPY: 160 };

function App() {
  const [montant, setMontant] = useState("1");
  const [devise, setDevise] = useState("MGA");
  const nombre = Number(montant);
  const valide = montant.trim() !== "" && Number.isFinite(nombre) && nombre >= 0;
  const resultat = valide ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: devise }).format(nombre * tauxExercice[devise]) : "Saisis un montant positif ou nul.";
  return <main><h1>Convertisseur de devises</h1>
    <div className="card actions"><label>Montant en euros <input value={montant} onChange={e => setMontant(e.target.value)} type="number" min="0" step="0.01" /></label>
      <div><label htmlFor="devise">Devise </label><select id="devise" value={devise} onChange={e => setDevise(e.target.value)}>{Object.keys(tauxExercice).map(code => <option key={code}>{code}</option>)}</select></div></div>
    <output aria-live="polite" className="output">{resultat}</output>
    <p className="muted">Taux fictifs pour l’exercice de programmation.</p>
  </main>;
}`,
  ),
};

const films: WebProject = {
  id: "films",
  title: "Catalogue de films avec recherche",
  minutes: 110,
  description:
    "Charge les films du Studio Ghibli, filtre le catalogue à la saisie et ouvre une page de détail.",
  requirements: [
    "Charger le catalogue depuis l’API publique avec un effet nettoyé.",
    "Filtrer par titre dans un champ contrôlé.",
    "Naviguer avec Link vers une route films/:id.",
    "Distinguer les données distantes des exemples locaux et ajouter un filtre par année.",
  ],
  hints: [
    "useParams lit id dans la route de détail.",
    "Dans l’atelier, MemoryRouter conserve les routes dans la mémoire de l’aperçu.",
    "Le tableau filtré se calcule à partir des films chargés et de la saisie.",
  ],
  files: reactFiles(
    "Catalogue de films",
    `import { useState } from "react";
import { MemoryRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useFilms } from "./useFilms.js";

function Liste({ films }) {
  const [recherche, setRecherche] = useState("");
  const query = recherche.trim().toLocaleLowerCase();
  const visibles = films.filter(film => film.title.toLocaleLowerCase().includes(query));
  return <section><label>Rechercher un film <input value={recherche} onChange={e => setRecherche(e.target.value)} /></label>
    <div className="grid">{visibles.map(film => <article className="card film" key={film.id}>
      <div className="film-visuel" aria-hidden="true">✦</div><h2>{film.title}</h2><p>{film.release_date}</p><Link to={"/films/" + film.id}>Voir {film.title}</Link>
    </article>)}</div>{!visibles.length && <p>Aucun film ne correspond.</p>}
  </section>;
}

function Detail({ films }) {
  const { id } = useParams();
  const film = films.find(item => item.id === id);
  return <section className="card"><Link to="/">Retour au catalogue</Link>
    {film ? <><h2>{film.title}</h2><p>{film.release_date} · {film.director}</p><p>{film.description}</p></> : <p>Film introuvable.</p>}
  </section>;
}

function App() {
  const { films, chargement, message } = useFilms();
  return <main><h1>Catalogue de films</h1><p role="status">{chargement ? "Chargement…" : message}</p>
    {!chargement && <MemoryRouter><Routes><Route path="/" element={<Liste films={films} />} /><Route path="/films/:id" element={<Detail films={films} />} /></Routes></MemoryRouter>}
  </main>;
}`,
    {
      css: ".film-visuel { display: grid; place-items: center; min-height: 5.5rem; border-radius: .6rem; background: linear-gradient(130deg,#15518b,#398abe); color: #fff; font-size: 2rem; } .film h2 { font-size: 1.1rem; }",
      modules: {
        "useFilms.js": `import { useEffect, useState } from "react";

const exemples = [
  { id: "totoro-local", title: "Mon voisin Totoro", release_date: "1988", director: "Hayao Miyazaki", description: "Deux sœurs découvrent un voisin mystérieux dans la forêt." },
  { id: "kiki-local", title: "Kiki la petite sorcière", release_date: "1989", director: "Hayao Miyazaki", description: "Une jeune sorcière apprend à devenir autonome dans une ville côtière." }
];

export function useFilms() {
  const [etat, setEtat] = useState({ films: [], chargement: true, message: "" });
  useEffect(() => {
    const controleur = new AbortController();
    let ferme = false;
    const limite = setTimeout(() => controleur.abort(), 8000);
    async function charger() {
      try {
        const reponse = await fetch("https://ghibliapi.vercel.app/films", { signal: controleur.signal });
        if (!reponse.ok) throw new Error("HTTP " + reponse.status);
        const films = await reponse.json();
        if (!Array.isArray(films)) throw new Error("Format inattendu");
        if (!ferme) setEtat({ films, chargement: false, message: "Catalogue chargé depuis Studio Ghibli API." });
      } catch (erreur) {
        if (!ferme) {
          setEtat({ films: exemples, chargement: false, message: "API indisponible. Deux exemples locaux sont affichés." });
          console.warn(erreur);
        }
      } finally { clearTimeout(limite); }
    }
    void charger();
    return () => { ferme = true; clearTimeout(limite); controleur.abort(); };
  }, []);
  return etat;
}`,
      },
    },
  ),
};

const kanban: WebProject = {
  id: "kanban",
  title: "Tableau Kanban",
  minutes: 90,
  description:
    "Crée des tâches dans un formulaire contrôlé et fais-les circuler entre les trois colonnes.",
  requirements: [
    "Conserver une liste de tâches dans le composant parent.",
    "Ajouter une tâche non vide depuis le formulaire.",
    "Déplacer une tâche entre À faire, En cours et Terminé.",
    "Ajouter un bouton de suppression et garder des clés stables.",
  ],
  hints: [
    "Donne à chaque tâche un id et un index de colonne.",
    "Filtre les tâches d’une colonne au rendu sans dupliquer l’état.",
    "Pour déplacer une tâche, crée un nouvel objet avec map.",
  ],
  files: reactFiles(
    "Tableau Kanban",
    `import { useRef, useState } from "react";

const colonnes = ["À faire", "En cours", "Terminé"];

function Colonne({ titre, taches, index, onDeplacer }) {
  return <section className="card colonne"><h2>{titre}</h2>
    {taches.map(tache => <article className="tache" key={tache.id}><p>{tache.titre}</p><div className="actions">
      {index > 0 && <button onClick={() => onDeplacer(tache.id, index - 1)}>← Reculer</button>}
      {index < 2 && <button onClick={() => onDeplacer(tache.id, index + 1)}>Avancer →</button>}
    </div></article>)}{!taches.length && <p className="muted">Aucune tâche.</p>}
  </section>;
}

function App() {
  const [titre, setTitre] = useState("");
  const [taches, setTaches] = useState([{ id: 1, titre: "Lire le brief", colonne: 0 }]);
  const prochainId = useRef(2);
  function ajouter(e) {
    e.preventDefault();
    const nom = titre.trim();
    if (!nom) return;
    const nouvelle = { id: prochainId.current++, titre: nom, colonne: 0 };
    setTaches(avant => [...avant, nouvelle]);
    setTitre("");
  }
  function deplacer(id, colonne) {
    setTaches(avant => avant.map(tache => tache.id === id ? { ...tache, colonne } : tache));
  }
  return <main><h1>Tableau Kanban</h1>
    <form onSubmit={ajouter} className="actions"><label>Tâche <input value={titre} onChange={e => setTitre(e.target.value)} maxLength={80} required /></label><button>Ajouter</button></form>
    <div className="grid">{colonnes.map((nom, index) => <Colonne key={nom} titre={nom} index={index} taches={taches.filter(tache => tache.colonne === index)} onDeplacer={deplacer} />)}</div>
  </main>;
}`,
    {
      css: ".colonne h2 { font-size: 1rem; } .tache { background: #eef5fc; padding: .6rem; border-radius: .5rem; margin-bottom: .5rem; overflow-wrap: anywhere; } .tache button { font-size: .8rem; }",
    },
  ),
};

const shop: WebProject = {
  id: "boutique",
  title: "Boutique avec panier global",
  minutes: 145,
  description:
    "Construis une boutique typée avec un catalogue distant et un panier partagé entre les pages.",
  requirements: [
    "Typer les produits, les lignes et le contexte en TypeScript.",
    "Charger les produits et rendre visible la source des données.",
    "Ajouter au panier depuis le catalogue ou le détail.",
    "Modifier les quantités et calculer le total.",
    "Tester le tiroir de panier et améliorer son parcours clavier.",
  ],
  hints: [
    "Le fournisseur du panier entoure les routes.",
    "Les articles de démonstration prennent le relais si DummyJSON ne répond pas.",
    "Observe le calcul total et la stabilité des fonctions avant de mesurer un gain de performance.",
  ],
  files: reactFiles(
    "Boutique avec panier global",
    `import { useEffect, useRef, useState } from "react";
import { MemoryRouter, Route, Routes, Link, useParams } from "react-router-dom";
import { PanierProvider, usePanier, type Produit } from "./panier.tsx";

const prix = (valeur: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" }).format(valeur);
const exemples: Produit[] = [{ id: 1, title: "Carnet de projets", price: 9.5 }, { id: 2, title: "Sac de studio", price: 24 }];

function Fiche({ produit }: { produit: Produit }) {
  const { ajouter } = usePanier();
  return <article className="card"><h2>{produit.title}</h2><p>{prix(produit.price)}</p>
    <div className="actions"><button onClick={() => ajouter(produit)}>Ajouter au panier</button><Link to={"/produits/" + produit.id}>Détail</Link></div>
  </article>;
}

function Detail({ produits }: { produits: Produit[] }) {
  const { id } = useParams();
  const produit = produits.find(item => String(item.id) === id);
  return produit ? <Fiche produit={produit} /> : <p>Produit introuvable.</p>;
}

function Boutique() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [message, setMessage] = useState("Chargement…");
  const [ouvert, setOuvert] = useState(false);
  const fermer = useRef<HTMLButtonElement>(null);
  const ouvrir = useRef<HTMLButtonElement>(null);
  const { lignes, modifier, total } = usePanier();
  useEffect(() => {
    const controleur = new AbortController();
    let actif = true;
    const limite = setTimeout(() => controleur.abort(), 8000);
    async function charger() {
      try {
        const reponse = await fetch("https://dummyjson.com/products?limit=8", { signal: controleur.signal });
        if (!reponse.ok) throw new Error("HTTP " + reponse.status);
        const donnees = await reponse.json();
        if (!Array.isArray(donnees.products)) throw new Error("Catalogue invalide");
        const valides = donnees.products.filter((p: Produit) => p && typeof p.id === "number" && typeof p.title === "string" && Number.isFinite(p.price));
        if (actif) { setProduits(valides); setMessage("Produits de démonstration chargés depuis DummyJSON."); }
      } catch (erreur) {
        if (actif) { setProduits(exemples); setMessage("API indisponible. Exemples locaux affichés."); console.warn(erreur); }
      } finally { clearTimeout(limite); }
    }
    void charger();
    return () => { actif = false; clearTimeout(limite); controleur.abort(); };
  }, []);
  useEffect(() => { if (ouvert) fermer.current?.focus(); }, [ouvert]);
  function fermerPanier() { setOuvert(false); ouvrir.current?.focus(); }
  return <main><h1>Boutique de démonstration</h1>
    <nav className="actions" aria-label="Boutique"><Link to="/">Catalogue</Link><button ref={ouvrir} aria-expanded={ouvert} aria-controls="panier" onClick={() => setOuvert(true)}>Panier ({lignes.reduce((n, item) => n + item.quantite, 0)})</button></nav>
    <p role="status">{message}</p>
    <Routes><Route path="/" element={<div className="grid">{produits.map(produit => <Fiche key={produit.id} produit={produit} />)}</div>} /><Route path="/produits/:id" element={<Detail produits={produits} />} /></Routes>
    <aside id="panier" aria-label="Panier" inert={!ouvert} className={"tiroir" + (ouvert ? " ouvert" : "")} onKeyDown={e => { if (e.key === "Escape") fermerPanier(); }}>
      <button ref={fermer} onClick={fermerPanier}>Fermer le panier</button><h2>Ton panier</h2>
      {lignes.map(ligne => <article className="card" key={ligne.id}><h3>{ligne.title}</h3><p>{ligne.quantite} × {prix(ligne.price)}</p>
        <div className="actions"><button aria-label={"Diminuer " + ligne.title} onClick={() => modifier(ligne.id, -1)}>−</button><button aria-label={"Augmenter " + ligne.title} onClick={() => modifier(ligne.id, 1)}>+</button></div>
      </article>)}<p><strong>Total : {prix(total)}</strong></p>
    </aside>
  </main>;
}

function App() {
  return <PanierProvider><MemoryRouter><Boutique /></MemoryRouter></PanierProvider>;
}`,
    {
      entry: "main.tsx",
      css: "body { overflow-x: hidden; } .tiroir { position: fixed; z-index: 1; inset: 0 0 0 auto; width: min(100%, 23rem); background: white; padding: 1rem; overflow-y: auto; transform: translateX(100%); transition: transform .24s; border-left: 1px solid #c8dbe9; } .tiroir.ouvert { transform: translateX(0); box-shadow: 0 0 1.5rem #18334e33; } @media (prefers-reduced-motion: reduce) { .tiroir { transition: none; } }",
      modules: {
        "panier.tsx": `import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Produit = { id: number; title: string; price: number };
type Ligne = Produit & { quantite: number };
type Panier = { lignes: Ligne[]; total: number; ajouter: (produit: Produit) => void; modifier: (id: number, delta: number) => void };
const Contexte = createContext<Panier | null>(null);

export function PanierProvider({ children }: { children: ReactNode }) {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const ajouter = useCallback((produit: Produit) => {
    setLignes(avant => avant.some(item => item.id === produit.id)
      ? avant.map(item => item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item)
      : [...avant, { ...produit, quantite: 1 }]);
  }, []);
  const modifier = useCallback((id: number, delta: number) => {
    setLignes(avant => avant.map(item => item.id === id ? { ...item, quantite: item.quantite + delta } : item).filter(item => item.quantite > 0));
  }, []);
  const valeur = useMemo(() => ({ lignes, total: lignes.reduce((somme, item) => somme + item.price * item.quantite, 0), ajouter, modifier }), [lignes, ajouter, modifier]);
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function usePanier() {
  const valeur = useContext(Contexte);
  if (!valeur) throw new Error("usePanier demande PanierProvider.");
  return valeur;
}`,
      },
    },
  ),
};

const social: WebProject = {
  id: "mini-social",
  title: "Mini réseau social",
  minutes: 140,
  description:
    "Gère un profil de démonstration, des publications, des likes et des pages de créateurs.",
  requirements: [
    "Entrer dans la démo avec un pseudo et rendre le profil accessible par contexte.",
    "Publier un message et basculer son like sans modifier le tableau en place.",
    "Extraire la logique du fil dans un hook personnalisé.",
    "Ouvrir des profils et ajouter un filtre sur les publications.",
  ],
  hints: [
    "Le contexte contient seulement l’identité de démonstration.",
    "Un tableau d’identifiants de personnes permet de compter un like par profil.",
    "Relis les props du composant Publication avant d’utiliser memo.",
  ],
  files: reactFiles(
    "Mini réseau social",
    `import { memo, useState } from "react";
import { MemoryRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { ProfilProvider, useProfil } from "./session.jsx";
import { useFlux } from "./useFlux.js";

const Publication = memo(function Publication({ post, profil, onAimer }) {
  return <article className="card"><Link to={"/profils/" + encodeURIComponent(post.auteur)}>{post.auteur}</Link>
    <p>{post.texte}</p><button disabled={!profil} aria-pressed={post.likes.includes(profil)} onClick={() => onAimer(post.id, profil)}>J’aime · {post.likes.length}</button>
  </article>;
});

function Connexion() {
  const { profil, setProfil } = useProfil();
  const [pseudo, setPseudo] = useState("");
  if (profil) return <div className="actions"><strong>Profil : {profil}</strong><button onClick={() => setProfil("")}>Quitter la démo</button></div>;
  return <form className="actions" onSubmit={e => { e.preventDefault(); if (pseudo.trim()) setProfil(pseudo.trim()); }}>
    <label>Pseudo <input required maxLength={24} value={pseudo} onChange={e => setPseudo(e.target.value)} /></label><button>Entrer dans la démo</button>
  </form>;
}

function Profil({ posts }) {
  const { nom } = useParams();
  const visibles = posts.filter(post => post.auteur === nom);
  return <section className="card"><h2>Profil de {nom}</h2><Link to="/">Retour au fil</Link><ul>{visibles.map(post => <li key={post.id}>{post.texte}</li>)}</ul></section>;
}

function Application() {
  const { profil } = useProfil();
  const [texte, setTexte] = useState("");
  const { posts, publier, aimer } = useFlux();
  function envoyer(e) { e.preventDefault(); if (profil && texte.trim()) { publier(profil, texte.trim()); setTexte(""); } }
  return <main><h1>Mini réseau social</h1><Connexion /><p className="muted">Session fictive, sans compte externe.</p>
    <Routes><Route path="/" element={<section>
      {profil && <form className="actions" onSubmit={envoyer}><label>Message <textarea required maxLength={220} value={texte} onChange={e => setTexte(e.target.value)} /></label><button>Publier</button></form>}
      {posts.map(post => <Publication key={post.id} post={post} profil={profil} onAimer={aimer} />)}
    </section>} /><Route path="/profils/:nom" element={<Profil posts={posts} />} /></Routes>
  </main>;
}

function App() {
  return <ProfilProvider><MemoryRouter><Application /></MemoryRouter></ProfilProvider>;
}`,
    {
      modules: {
        "session.jsx": `import { createContext, useContext, useState } from "react";
const Contexte = createContext(null);
export function ProfilProvider({ children }) {
  const [profil, setProfil] = useState("");
  return <Contexte.Provider value={{ profil, setProfil }}>{children}</Contexte.Provider>;
}
export function useProfil() { return useContext(Contexte); }`,
        "useFlux.js": `import { useCallback, useRef, useState } from "react";
const depart = [
  { id: 1, auteur: "Aïcha", texte: "Je viens de publier mon premier projet web.", likes: [] },
  { id: 2, auteur: "Bako", texte: "Aujourd’hui, j’apprends à créer un composant réutilisable.", likes: [] }
];
export function useFlux() {
  const [posts, setPosts] = useState(depart);
  const prochainId = useRef(3);
  const publier = useCallback((auteur, texte) => {
    const post = { id: prochainId.current++, auteur, texte, likes: [] };
    setPosts(avant => [post, ...avant]);
  }, []);
  const aimer = useCallback((id, profil) => {
    if (!profil) return;
    setPosts(avant => avant.map(post => {
      if (post.id !== id) return post;
      const likes = post.likes.includes(profil) ? post.likes.filter(nom => nom !== profil) : [...post.likes, profil];
      return { ...post, likes };
    }));
  }, []);
  return { posts, publier, aimer };
}`,
      },
    },
  ),
};

export const reactProjects = {
  debutant: [vote, converter],
  intermediaire: [films, kanban],
  avance: [shop, social],
};
