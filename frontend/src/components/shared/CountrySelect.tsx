import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { useI18n } from "../../i18n/context";
import { countryLabel, searchAfricanCountries } from "../../lib/countries";

export default function CountrySelect({ value, onChange, name = "country", required = true }: { value: string; onChange: (value: string) => void; name?: string; required?: boolean }) {
  const { t, language } = useI18n();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [active, setActive] = useState(0);
  const open = showResults && !!query?.trim();
  const results = searchAfricanCountries(query ?? "", language);
  const display = query ?? (value ? countryLabel(value, language) : "");
  const invalidCountry = t("Choisis un pays dans la liste.", "Choose a country from the list.");
  const listId = `${id}-countries`;
  const optionId = (index: number) => `${id}-country-${index}`;

  useEffect(() => {
    input.current?.setCustomValidity(!value && !!display.trim() ? invalidCountry : "");
  }, [value, display, invalidCountry]);

  function select(country: string) {
    onChange(country);
    setQuery(null);
    setShowResults(false);
    input.current?.setCustomValidity("");
  }

  function handleKeys(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setShowResults(false);
    }
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && results.length) {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const next = open ? Math.max(0, Math.min(active + direction, results.length - 1)) : 0;
      setActive(next);
      setShowResults(true);
      document.getElementById(optionId(next))?.scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter" && open && results[active]) {
      event.preventDefault();
      select(results[active].country);
    }
  }

  return <div
    className="country-combobox"
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setShowResults(false); }}>
    <div className="rounded-search">
      <Search
        size={18}
        aria-hidden="true" />
      <input
        ref={input}
        name={`${name}-search`}
        value={display}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-label={t("Rechercher un pays", "Search countries")}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && results[active] ? optionId(active) : undefined}
        required={required}
        placeholder={t("Rechercher un pays…", "Search countries…")}
        onFocus={() => setShowResults(true)}
        onChange={e => {
          setQuery(e.target.value);
          if (value) onChange("");
          setShowResults(true);
          setActive(0);
        }}
        onKeyDown={handleKeys} />
    </div>
    <input
      type="hidden"
      name={name}
      value={value} />
    {open && <ul
      id={listId}
      className="country-results"
      role="listbox"
      aria-label={t("Pays africains", "African countries")}>
      {results.map(({ country, label }, index) => <li
        key={country}
        id={optionId(index)}
        role="option"
        aria-selected={index === active}
        onMouseDown={e => e.preventDefault()}
        onClick={() => select(country)}>
        {label}
      </li>)}
      {!results.length && <li role="presentation">
        {t("Aucun pays correspondant.", "No matching countries.")}
      </li>}
    </ul>}
  </div>;
}
