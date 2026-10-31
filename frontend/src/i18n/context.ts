import { createContext, useContext } from "react";
import { english } from "./en";
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
      context.language === "en" ? en || english[fr] || fr : fr,
    locale: context.language === "en" ? "en-GB" : "fr-FR",
  };
}
