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
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
