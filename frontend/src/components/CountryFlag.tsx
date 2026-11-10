import { useI18n } from "../i18n/context";
import { Globe2 } from "lucide-react";
import { countryCode, countryLabel } from "../lib/countries";
export function CountryFlag({
  country,
  showName = true,
}: {
  country: string;
  showName?: boolean;
}) {
  const { t, language } = useI18n();
  const code = countryCode(country);
  const label = countryLabel(country,language);
  return (
    <span className="country-label">
      {code ? (
        <img
          className="country-flag"
          src={`/flags/${code.toLowerCase()}.svg`}
          alt={`${t("Drapeau", "Flag")} : ${label}`}
          width="22"
          height="15"
        />
      ) : (
        <Globe2 size={17} aria-hidden="true" />
      )}
      {showName && <span>{label || t("Pays non renseigné", "Country not provided")}</span>}
    </span>
  );
}
