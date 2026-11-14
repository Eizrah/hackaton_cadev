import { useEffect, useId, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { skillCatalog, skillKey } from "../../data/skillCatalog";
import TechIcon from "../TechIcon";
import { useI18n } from "../../i18n/context";

// Compétence retournée par la sélection — nom + UUID backend si disponible
export type SkillOption = { name: string; competenceId?: string };

export default function SkillSearch({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (option: SkillOption) => void;
}) {
  const { t } = useI18n();

  // Catalogue enrichi avec UUID backend quand le mode API est actif
  const [catalog, setCatalog] = useState<SkillOption[]>(
    skillCatalog.map((name) => ({ name })),
  );

  useEffect(() => {
    if (import.meta.env.VITE_AUTH_MODE !== "api") return;
    import("../../api/auth").then(({ authApi }) => {
      authApi
        .getCompetencesDisponibles()
        .then((res) => {
          const data: { nom_competence: string; id_competence: string }[] =
            res.data;
          if (Array.isArray(data) && data.length > 0) {
            setCatalog(
              data.map((c) => ({
                name: c.nom_competence,
                competenceId: c.id_competence,
              })),
            );
          }
        })
        .catch(() => {
          /* fallback sur le catalogue local — aucune action nécessaire */
        });
    });
  }, []);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [custom, setCustom] = useState(false);
  const [other, setOther] = useState("");
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const results = catalog
    .filter(
      (opt) =>
        !selected.some((s) => skillKey(s) === skillKey(opt.name)) &&
        skillKey(opt.name).includes(skillKey(query)),
    )
    .slice(0, 9);

  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  function choose(option: SkillOption) {
    if (!selected.some((s) => skillKey(s) === skillKey(option.name))) {
      onSelect({ name: option.name.trim(), competenceId: option.competenceId });
    }
    setQuery("");
    setOpen(false);
    setCustom(false);
    setOther("");
    input.current?.focus();
  }

  function chooseAt(index: number) {
    if (index === results.length) {
      setCustom(true);
      setOpen(false);
    } else if (results[index]) {
      choose(results[index]);
    }
  }

  return (
    <div
      className="skill-search"
      ref={ref}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}>
      <label
        className="skill-search-label"
        htmlFor={id}>
        {t("Rechercher une compétence", "Search for a skill")}
      </label>
      <div className="skill-search-bar">
        <span>
          <Search size={21} />
        </span>
        <input
          id={id}
          ref={input}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-activedescendant={
            open ? `${id}-option-${active}` : undefined
          }
          value={query}
          maxLength={80}
          placeholder={t("React, Java, Python…", "React, Java, Python…")}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (["ArrowDown", "ArrowUp"].includes(e.key)) {
              e.preventDefault();
              setOpen(true);
              setActive((n) =>
                e.key === "ArrowDown"
                  ? Math.min(results.length, n + 1)
                  : Math.max(0, n - 1),
              );
            }
            if (e.key === "Enter" && open) {
              e.preventDefault();
              chooseAt(active);
            }
          }}
        />
      </div>
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="skill-search-results"
          aria-label={t("Compétences disponibles", "Available skills")}>
          {results.map((opt, index) => (
            <li
              key={opt.name}
              role="option"
              aria-label={opt.name}
              id={`${id}-option-${index}`}
              aria-selected={active === index}
              onMouseDown={(e) => e.preventDefault()}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => choose(opt)}>
                <TechIcon
                  name={opt.name}
                  size={20} />
                <span>{opt.name}</span>
                <Plus size={16} />
              </button>
            </li>
          ))}
          <li
            role="option"
            id={`${id}-option-${results.length}`}
            aria-selected={active === results.length}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                setCustom(true);
                setOpen(false);
              }}>
              <Plus size={19} />
              {t("Autre compétence…", "Other skill…")}
            </button>
          </li>
        </ul>
      )}
      {custom && (
        <div className="custom-skill">
          <label htmlFor={`${id}-custom`}>
            {t("Votre autre compétence", "Your other skill")}
          </label>
          <div>
            <input
              autoFocus
              id={`${id}-custom`}
              value={other}
              maxLength={80}
              placeholder="Angular, Java web…"
              onChange={(e) => setOther(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (other.trim()) choose({ name: other });
                }
              }}
            />
            <button
              type="button"
              className="btn-primary"
              disabled={
                !other.trim() ||
                selected.some((s) => skillKey(s) === skillKey(other))
              }
              onClick={() => choose({ name: other })}>
              {t("Ajouter", "Add")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
