import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Plus,
  Search,
} from "lucide-react";
import { useLocalData } from "../../lib/storage";
import { initialJobs, normalizeText } from "../../data/models";
import { CountryFlag } from "../CountryFlag";
import Modal from "../Modal";
export default function Offers({
  onNotice,
}: {
  onNotice: (message: string) => void;
}) {
  const [jobs, setJobs] = useLocalData("jobs", initialJobs);
  const [applications, setApplications] = useLocalData<number[]>(
    "applications",
    [],
  );
  const [query, setQuery] = useState(""),
    [mode, setMode] = useState("Tous"),
    [creating, setCreating] = useState(false);
  const filtered = jobs.filter(
    (j) =>
      (mode === "Tous" || mode === j.mode) &&
      normalizeText(
        `${j.title} ${j.country} ${j.skills} ${j.company}`,
      ).includes(normalizeText(query)),
  );
  return (
    <>
      <div className="toolbar">
        <label className="search-box">
          <Search size={19} />
          <input
            aria-label="Rechercher une offre"
            placeholder="Poste, compétence, pays…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Mode de travail"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {["Tous", "Remote", "Hybride", "Local"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} />
          Publier une offre
        </button>
      </div>
      <p className="muted results-count">
        {filtered.length} offre{filtered.length > 1 ? "s" : ""} à découvrir
      </p>
      <div className="module-grid offers-grid">
        {filtered.map((j) => (
          <article className="panel job" key={j.id}>
            <span className="feature-icon orange">
              <BriefcaseBusiness size={26} />
            </span>
            <h2>{j.title}</h2>
            <p>{j.company}</p>
            <CountryFlag country={j.country} />
            <div className="tag-list">
              <span>{j.contract}</span>
              <span>{j.mode}</span>
            </div>
            <p>{j.skills}</p>
            <button
              className="btn-primary"
              disabled={applications.includes(j.id)}
              onClick={() => {
                setApplications((current) => [...current, j.id]);
                onNotice(
                  "Candidature simulée enregistrée. Aucun employeur n’a été contacté.",
                );
              }}
            >
              {applications.includes(j.id) ? (
                <>
                  <Check size={16} />
                  Candidature enregistrée
                </>
              ) : (
                <>
                  Postuler
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="panel empty-state">
          <Search />
          <h2>Aucune offre trouvée.</h2>
          <p>Essaie un autre mot-clé ou un autre mode de travail.</p>
        </div>
      )}
      {creating && (
        <Modal title="Publier une offre" onClose={() => setCreating(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              setJobs((current) => [
                {
                  id: Date.now(),
                  title: String(d.get("title")).trim(),
                  company: String(d.get("company")).trim(),
                  country: String(d.get("country")).trim(),
                  mode: String(d.get("mode")),
                  contract: String(d.get("contract")),
                  skills: String(d.get("skills")).trim(),
                },
                ...current,
              ]);
              setCreating(false);
              onNotice("Offre ajoutée à la démonstration locale.");
            }}
          >
            <label>
              Intitulé du poste
              <input name="title" required maxLength={120} pattern=".*\S.*" />
            </label>
            <label>
              Organisation
              <input name="company" required maxLength={80} />
            </label>
            <label>
              Pays
              <input name="country" required maxLength={80} />
            </label>
            <div className="form-grid">
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
            </div>
            <label>
              Compétences recherchées
              <textarea name="skills" required maxLength={1000} />
            </label>
            <button className="btn-primary">
              Créer l’offre
              <ArrowRight size={17} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
