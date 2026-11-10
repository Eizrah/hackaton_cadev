import { useI18n, type Language } from "../i18n/context";
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  return (
    <label className="language-switcher">
      <img src={language === "fr" ? "/flags/fr.svg" : "/flags/gb.svg"} alt="" />
      <span className="sr-only">
        {t("Langue de l’interface", "Interface language")}
      </span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label={t("Langue de l’interface", "Interface language")}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
