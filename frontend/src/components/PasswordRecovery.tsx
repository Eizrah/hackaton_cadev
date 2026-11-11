import { useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useI18n } from "../i18n/context";
import LanguageSwitcher from "./LanguageSwitcher";
import { PasswordField } from "./Authentication";
import {
  confirmPasswordReset,
  expiredResetError,
  parseResetLink,
  requestPasswordReset,
  resetPasswordProblem,
  type ResetProof,
} from "../lib/passwordRecovery";
import "../authentication.css";

// 4 stages seulement — plus de "sent" ni "verify"
type Stage = "request" | "password" | "success" | "invalid";

export default function PasswordRecovery({
  route,
  onNavigate,
}: {
  route: string;
  onNavigate: (destination: "home" | "login" | "forgot" | "reset") => void;
}) {
  const { t } = useI18n();
  const link = parseResetLink(route);
  const api = import.meta.env.VITE_AUTH_MODE === "api";

  // si un lien est détecté (uid+token dans l'URL) → on va directement à l'étape mot de passe
  const [stage, setStage] = useState<Stage>(() => (link ? "password" : "request"));
  const [email, setEmail] = useState("");
  const [proof, setProof] = useState<ResetProof | undefined>(link);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const heading = useRef<HTMLHeadingElement>(null);
  const card = useRef<HTMLElement>(null);

  // 2 étapes : 0 = demande email, 1 = nouveau mot de passe
  const step = stage === "request" ? 0 : 1;

  function go(next: Stage) {
    setError("");
    setStage(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      if (window.innerWidth < 1000)
        card.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");

    // validation du mot de passe avant d'appeler l'API
    if (stage === "password") {
      const problem = resetPasswordProblem(password, confirmation);
      if (problem) {
        setError(
          problem === "mismatch"
            ? t("Les mots de passe ne correspondent pas.", "Passwords do not match.")
            : problem === "long"
              ? t(
                  "Le mot de passe doit contenir au maximum 128 caractères.",
                  "Your password must contain at most 128 characters.",
                )
              : t(
                  "Le mot de passe doit contenir au moins 8 caractères.",
                  "Your password must have at least 8 characters.",
                ),
        );
        return;
      }
      if (!proof) {
        go("invalid");
        return;
      }
    }

    setBusy(true);
    try {
      if (stage === "request") {
        // envoie l'email de réinitialisation
        if (api) await requestPasswordReset(email.trim());
        // affiche un message de succès — l'utilisateur doit consulter son email
        // et cliquer sur le lien qui le ramènera ici avec uid+token dans l'URL
        go("success");
      } else if (stage === "password" && proof) {
        // confirme le nouveau mot de passe avec uid+token
        if (api) await confirmPasswordReset(proof, password, confirmation);
        setPassword("");
        setConfirmation("");
        setProof(undefined);
        go("success");
      }
    } catch (failure) {
      if (stage === "password" && expiredResetError(failure)) {
        setProof(undefined);
        setPassword("");
        setConfirmation("");
        go("invalid");
      } else {
        setError(
          stage === "password"
            ? t(
                "Le mot de passe n'a pas pu être modifié. Vérifie les règles du serveur ou réessaie.",
                "Your password could not be changed. Check the server requirements or try again.",
              )
            : t(
                "La demande n'a pas pu être envoyée. Vérifie ta connexion et réessaie.",
                "The request could not be sent. Check your connection and try again.",
              ),
        );
      }
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<Stage, string> = {
    request: t("Mot de passe oublié ?", "Forgot your password?"),
    password: t("Nouveau mot de passe", "New password"),
    success: t("Votre accès est rétabli", "Your access is restored"),
    invalid: t("Ce lien n'est plus utilisable", "This link cannot be used"),
  };

  return (
    <main className="registration-page registration-forgot recovery-page">
      <header className="registration-header">
        <button
          className="register-brand"
          onClick={() => onNavigate("home")}
          aria-label={t("DevAfrica Connect, accueil", "DevAfrica Connect, home")}>
          <img src="/images/africa-mark.png" alt="" />
          <span>
            <strong>
              Dev<span>Africa</span>
            </strong>
            <small>CONNECT</small>
          </span>
        </button>
        <nav
          className="recovery-header-nav"
          aria-label={t("Navigation de récupération", "Recovery navigation")}>
          <button onClick={() => onNavigate("login")}>{t("Se connecter", "Sign in")}</button>
        </nav>
        <LanguageSwitcher />
      </header>

      <div className="registration-layout">
        <section className="registration-card recovery-card" ref={card}>
          {/* icône selon le stage */}
          <div className="recovery-symbol">
            {stage === "success" ? (
              <CheckCircle2 size={28} />
            ) : stage === "password" ? (
              <LockKeyhole size={28} />
            ) : (
              <KeyRound size={28} />
            )}
          </div>

          {/* titre et description */}
          <div className="registration-card-heading">
            <h1 tabIndex={-1} ref={heading}>
              {titles[stage]}
            </h1>
            <p>
              {stage === "request"
                ? t(
                    "Un oubli, ça arrive. Retrouvons l'accès à votre communauté.",
                    "It happens. Let's get you back to your community.",
                  )
                : stage === "password"
                  ? t(
                      "Choisissez un nouveau mot de passe et confirmez-le.",
                      "Choose a new password and confirm it.",
                    )
                  : stage === "invalid"
                    ? t(
                        "Le lien est incomplet, invalide ou a expiré. Demandez-en un nouveau pour continuer.",
                        "The link is incomplete, invalid, or expired. Request a new one to continue.",
                      )
                    : stage === "success" && link
                      ? t(
                          "Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.",
                          "Your password has been changed. You can now sign in.",
                        )
                      : t(
                          "Si un compte correspond à cette adresse, vous recevrez un lien de récupération.",
                          "If an account matches this address, you will receive a recovery link.",
                        )}
            </p>
          </div>

          {/* stepper — 2 étapes seulement */}
          {stage !== "invalid" && stage !== "success" && (
            <ol
              className="recovery-progress"
              aria-label={t("Étapes de récupération", "Recovery steps")}>
              {[t("Demande", "Request"), t("Mot de passe", "Password")].map((label, index) => (
                <li
                  key={index}
                  className={index === step ? "active" : index < step ? "complete" : ""}
                  aria-current={index === step ? "step" : undefined}>
                  <span>{index < step ? <Check size={14} /> : index + 1}</span>
                  <small>{label}</small>
                </li>
              ))}
            </ol>
          )}

          {/* message mode démo */}
          {!api && (
            <p className="recovery-demo" role="note">
              {t(
                "Mode démonstration : aucun e-mail n'est envoyé et aucun mot de passe réel n'est changé.",
                "Demo mode: no email is sent and no real password is changed.",
              )}
            </p>
          )}

          {/* formulaire — affiché pour request et password uniquement */}
          {(stage === "request" || stage === "password") && (
            <form className="recovery-form" onSubmit={submit}>
              {/* étape 1 — saisir l'email */}
              {stage === "request" && (
                <label>
                  {t("Adresse e-mail", "Email address")}
                  <span className="onboard-input">
                    <Mail size={18} />
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("vous@exemple.com", "you@example.com")}
                    />
                  </span>
                </label>
              )}

              {/* étape 2 — saisir le nouveau mot de passe */}
              {stage === "password" && (
                <>
                  <PasswordField
                    newPassword
                    label={t("Nouveau mot de passe", "New password")}
                    value={password}
                    onChange={setPassword}
                  />
                  <PasswordField
                    confirm
                    label={t("Confirmer le nouveau mot de passe", "Confirm new password")}
                    value={confirmation}
                    onChange={setConfirmation}
                  />
                  <p className="recovery-hint">
                    {t(
                      "Au moins 8 caractères. Choisissez un mot de passe différent de l'ancien.",
                      "At least 8 characters. Choose a password different from the old one.",
                    )}
                  </p>
                </>
              )}

              {error && (
                <p className="registration-error" role="alert">
                  {t(error)}
                </p>
              )}

              <button className="register-continue" type="submit" disabled={busy}>
                {busy ? (
                  <>
                    <LoaderCircle className="spin" size={18} />
                    {t("En cours…", "Working…")}
                  </>
                ) : (
                  <>
                    {stage === "request"
                      ? t("Recevoir le lien de récupération", "Get recovery link")
                      : api
                        ? t("Enregistrer mon mot de passe", "Save my password")
                        : t("Vérifier le formulaire (démo)", "Validate form (demo)")}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* écran succès */}
          {stage === "success" && (
            <button className="register-continue" onClick={() => onNavigate("login")}>
              {t("Retour à la connexion", "Back to sign in")}
              <ArrowRight size={18} />
            </button>
          )}

          {/* écran lien invalide */}
          {stage === "invalid" && (
            <div className="recovery-next">
              <button
                className="register-continue"
                onClick={() => {
                  setProof(undefined);
                  go("request");
                }}>
                {t("Demander un nouveau lien", "Request a new link")}
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* bouton retour */}
          {stage !== "success" && (
            <button className="recovery-back" onClick={() => onNavigate("login")}>
              <ArrowLeft size={16} />
              {t("Retour à la connexion", "Back to sign in")}
            </button>
          )}
        </section>

        <aside
          className="registration-art"
          aria-label={t("Illustration de développement", "Development illustration")}>
          <span className="register-art-badge">
            <Code2 size={23} />
            <span>
              {t("Un continent de talents.", "A continent of talent.")}
              <strong>{t("Construisons ensemble.", "Let's build together.")}</strong>
            </span>
          </span>
          <img
            className="registration-illustration"
            src="/images/auth-developer.jpg"
            alt={t(
              "Développeur devant des interfaces de code",
              "Developer working with code interfaces",
            )}
          />
          <div className="register-art-caption">
            <span />
            <p>{t("Apprendre. Partager. Faire grandir ses idées.", "Learn. Share. Grow your ideas.")}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
