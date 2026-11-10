import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import FloatingTutor from "./components/shared/FloatingTutor";
import ToastProvider from "./components/shared/ToastProvider";
import "./enhancements.css";
import "./revision-v17.css";
import "./revision-v18.css";
import LanguageProvider from "./components/LanguageProvider";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider><FloatingTutor><App /></FloatingTutor></ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);
