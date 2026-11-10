import { createContext, useContext } from "react";
import { english } from "./en";
import { inlineEnglish } from "./inline";
import { catalogEnglish } from "./catalog";
const translations={...inlineEnglish,...english,...catalogEnglish};
const frenchByEnglish=Object.fromEntries(Object.entries(translations).map(([fr,en])=>[en,fr]));
export type Language = "fr" | "en";
export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({ language: "fr", setLanguage: () => {} });
export function useI18n() {
  const context = useContext(LanguageContext);
  return {
    ...context,
    t: (fr: string, en?: string) =>
      context.language === "en" ? en || translations[fr in translations ? fr : frenchByEnglish[fr] || fr] || fr : fr in translations ? fr : frenchByEnglish[fr] || fr,
    locale: context.language === "en" ? "en-GB" : "fr-FR",
  };
}
