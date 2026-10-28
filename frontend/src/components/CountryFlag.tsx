import { Globe2 } from "lucide-react";
import { normalizeText } from "../data/models";
// Codes ISO 3166-1. Les noms sont reconnus en français et en anglais.
const codes =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );
const countryCodes = new Map<string, string>();
for (const code of codes) {
  countryCodes.set(normalizeText(code), code);
  for (const locale of ["fr", "en"]) {
    const name = new Intl.DisplayNames([locale], { type: "region" }).of(code);
    if (name) countryCodes.set(normalizeText(name), code);
  }
}
for (const [name, code] of Object.entries({
  "Congo RDC": "CD",
  RDC: "CD",
  "RD Congo": "CD",
  "Congo Brazzaville": "CG",
  "Congo Kinshasa": "CD",
  "Cap Vert": "CV",
  "Cabo Verde": "CV",
  Swaziland: "SZ",
  "Sao Tome et Principe": "ST",
  "Guinee Bissau": "GW",
  "Afrique du sud": "ZA",
  "Cote dIvoire": "CI",
  "Ivory Coast": "CI",
  Tanzanie: "TZ",
}))
  countryCodes.set(normalizeText(name), code);
export function CountryFlag({
  country,
  showName = true,
}: {
  country: string;
  showName?: boolean;
}) {
  const code = countryCodes.get(normalizeText(country));
  return (
    <span className="country-label">
      {code ? (
        <img
          className="country-flag"
          src={`/flags/${code.toLowerCase()}.svg`}
          alt={`Drapeau : ${country}`}
          width="22"
          height="15"
        />
      ) : (
        <Globe2 size={17} aria-hidden="true" />
      )}
      {showName && <span>{country || "Pays non renseigné"}</span>}
    </span>
  );
}
