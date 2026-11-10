import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { africanCountries } from "../../data/countries";
import { normalizeText } from "../../data/models";
import { useI18n } from "../../i18n/context";
import { countryLabel } from "../../lib/countries";
export default function CountrySelect({ value, onChange, name = "country", required = true }: { value: string; onChange: (value: string) => void; name?: string; required?: boolean }) {
  const { t, language } = useI18n(), id = useId(), ref = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), [query, setQuery] = useState<string | null>(null), [open, setOpen] = useState(false), [active, setActive] = useState(0);
  const results = [...africanCountries].sort((a, b) => countryLabel(a, language).localeCompare(countryLabel(b, language), language)).filter(country => query === null || [country, countryLabel(country, language)].some(label => normalizeText(label).startsWith(normalizeText(query))));
  const display = query ?? (value ? countryLabel(value, language) : "");
  const invalidCountry = t("Choisis un pays dans la liste.", "Choose a country from the list.");
  useEffect(() => { input.current?.setCustomValidity(required && !value && !!display ? invalidCountry : ""); }, [value, display, required, invalidCountry]);
  function select(country: string) { onChange(country); setQuery(null); setOpen(false); input.current?.setCustomValidity(""); }
  return <div
    ref={ref}
    className="country-combobox"
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}>
    <div className="country-search-bar">
      <Search
        size={18}
        aria-hidden="true" />
      <input
        ref={input}
        name={`${name}-search`}
        value={display}
        autoComplete="off"
        role="combobox"
        aria-label={t("Rechercher un pays", "Search countries")}
        aria-expanded={open}
        aria-controls={`${id}-countries`}
        aria-activedescendant={open && results[active] ? `${id}-country-${active}` : undefined}
        required={required}
        placeholder={t("Rechercher un pays…", "Search countries…")}
        onFocus={() => { setOpen(true); setActive(0); }}
        onChange={e => { setQuery(e.target.value); onChange(""); setOpen(true); setActive(0); }}
        onKeyDown={e => { if (e.key === "Escape") setOpen(false); if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setActive(n => e.key === "ArrowDown" ? Math.min(results.length - 1, open ? n + 1 : 0) : Math.max(0, n - 1)); } if (e.key === "Enter" && open) { e.preventDefault(); if (results[active]) select(results[active]); } }} />
      <button
        type="button"
        aria-label={t("Afficher les pays", "Show countries")}
        onClick={() => { if (open) { setOpen(false); } else { setQuery(null); setOpen(true); input.current?.focus(); } }}>
        <ChevronDown size={17} />
      </button>
    </div>
    <input
      type="hidden"
      name={name}
      value={value} />
    {open && <ul
      id={`${id}-countries`}
      className="country-results"
      role="listbox"
      aria-label={t("Pays africains", "African countries")}>
      {results.map((country, index) => <li
        key={country}
        id={`${id}-country-${index}`}
        role="option"
        aria-selected={index === active}
        aria-label={countryLabel(country, language)}
        onMouseDown={e => e.preventDefault()}
        onClick={() => select(country)}>
        {countryLabel(country, language)}
      </li>)}
      {!results.length && <li role="presentation">
        {t("Aucun pays correspondant.", "No matching countries.")}
      </li>}
    </ul>}
  </div>;
}
