import { useEffect, type ReactNode } from "react";
import { LanguageContext, type Language } from "../i18n/context";
import { useLocalData } from "../lib/storage";
export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguage] = useLocalData<Language>(
    "language",
    "fr",
    (saved) => (saved === "en" ? "en" : "fr"),
  );
  useEffect(() => {
    document.documentElement.lang = language;
    document.title=language === "en" ? "DevAfrica Connect — By developers, for developers" : "DevAfrica Connect — Par les devs, pour les devs";
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
