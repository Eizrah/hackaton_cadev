import { useEffect, useId, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { skillCatalog, skillKey } from "../../data/skillCatalog";
import TechIcon from "../TechIcon";
import { useI18n } from "../../i18n/context";
export default function SkillSearch({ selected, onSelect }: { selected: string[]; onSelect: (name: string) => void }) {
  const { t } = useI18n();
  const [query, setQuery] = useState(""), [open, setOpen] = useState(false), [active, setActive] = useState(0), [custom, setCustom] = useState(false), [other, setOther] = useState("");
  const id = useId(), ref = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const results = skillCatalog.filter(name => !selected.some(s => skillKey(s) === skillKey(name)) && skillKey(name).includes(skillKey(query))).slice(0, 9);
  useEffect(() => { const outside = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", outside); return () => document.removeEventListener("mousedown", outside); }, []);
  function choose(name: string) { if (!selected.some(s => skillKey(s) === skillKey(name))) onSelect(name.trim()); setQuery(""); setOpen(false); setCustom(false); setOther(""); input.current?.focus(); }
  function chooseAt(index: number) { if (index === results.length) { setCustom(true); setOpen(false); } else if (results[index]) choose(results[index]); }
  return <div
    className="skill-search"
    ref={ref}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
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
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        value={query}
        maxLength={80}
        placeholder={t("React, Java, Python…", "React, Java, Python…")}
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(0); }}
        onKeyDown={e => { if (e.key === "Escape") setOpen(false); if (["ArrowDown", "ArrowUp"].includes(e.key)) { e.preventDefault(); setOpen(true); setActive(n => e.key === "ArrowDown" ? Math.min(results.length, n + 1) : Math.max(0, n - 1)); } if (e.key === "Enter" && open) { e.preventDefault(); chooseAt(active); } }} />
    </div>
    {open && <ul
      id={`${id}-list`}
      role="listbox"
      className="skill-search-results"
      aria-label={t("Compétences disponibles", "Available skills")}>
      {results.map((name, index) => <li
        key={name}
        role="option"
        aria-label={name}
        id={`${id}-option-${index}`}
        aria-selected={active === index}
        onMouseDown={e => e.preventDefault()}>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => choose(name)}>
          <TechIcon
            name={name}
            size={20} />
          <span>
            {name}
          </span>
          <Plus size={16} />
        </button>
      </li>)}
      <li
        role="option"
        id={`${id}-option-${results.length}`}
        aria-selected={active === results.length}>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { setCustom(true); setOpen(false); }}>
          <Plus size={19} />
          {t("Autre compétence…", "Other skill…")}
        </button>
      </li>
    </ul>}
    {custom && <div className="custom-skill">
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
          onChange={e => setOther(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (other.trim()) choose(other); } }} />
        <button
          type="button"
          className="btn-primary"
          disabled={!other.trim() || selected.some(s => skillKey(s) === skillKey(other))}
          onClick={() => choose(other)}>
          {t("Ajouter", "Add")}
        </button>
      </div>
    </div>}
  </div>;
}
