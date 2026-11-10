import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Code2, KeyRound, Link2, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n/context";
import LanguageSwitcher from "./LanguageSwitcher";
import { PasswordField } from "./Authentication";
import { confirmPasswordReset, expiredResetError, parseResetLink, requestPasswordReset, resetPasswordProblem, verifyRecoveryCode, type RecoveryMethod, type ResetProof } from "../lib/passwordRecovery";
import "../authentication.css";

type Stage = "request" | "sent" | "verify" | "password" | "success" | "invalid";
export default function PasswordRecovery({ route, onNavigate }: { route: string; onNavigate: (destination: "home" | "login" | "forgot" | "reset") => void }) {
  const { t } = useI18n();
  const link = parseResetLink(route), api = import.meta.env.VITE_AUTH_MODE === "api";
  const [stage, setStage] = useState<Stage>(() => link ? "password" : route.startsWith("reset?") ? "invalid" : route === "reset" ? "verify" : "request");
  const [email, setEmail] = useState(""), [code, setCode] = useState(""), [method, setMethod] = useState<RecoveryMethod>("code");
  const [proof, setProof] = useState<ResetProof | undefined>(link), [password, setPassword] = useState(""), [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null), card = useRef<HTMLElement>(null);
  const step = stage === "request" ? 0 : stage === "sent" || stage === "verify" ? 1 : 2;
  function go(next: Stage) {
    setError(""); setStage(next);
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); if (window.innerWidth < 1000) card.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setError("");
    if (stage === "password") {
      const problem = resetPasswordProblem(password, confirmation);
      if (problem) { setError(problem === "mismatch" ? t("Les mots de passe ne correspondent pas.", "Passwords do not match.") : problem === "long" ? t("Le mot de passe doit contenir au maximum 128 caractères.", "Your password must contain at most 128 characters.") : t("Le mot de passe doit contenir au moins 8 caractères.", "Your password must have at least 8 characters.")); return; }
      if (!proof) { go("invalid"); return; }
    }
    setBusy(true);
    try {
      if (stage === "request") {
        if (api) await requestPasswordReset(email.trim());
        go("sent");
      } else if (stage === "verify") {
        setProof(api ? await verifyRecoveryCode(email.trim(), code.trim(), method) : { email: email.trim(), resetToken: "demo-preview" });
        setCode(""); go("password");
      } else if (stage === "password" && proof) {
        if (api) await confirmPasswordReset(proof, password, confirmation);
        setPassword(""); setConfirmation(""); setProof(undefined); go("success");
      }
    } catch (failure) {
      if (stage === "password" && expiredResetError(failure)) { setProof(undefined); setPassword(""); setConfirmation(""); go("invalid"); }
      else setError(stage === "verify" ? t("Le code est incorrect, expiré ou la vérification est indisponible. Réessaie ou demande un nouveau lien.", "The code is incorrect, expired, or verification is unavailable. Try again or request a new link.") : stage === "password" ? t("Le mot de passe n’a pas pu être modifié. Vérifie les règles du serveur ou réessaie.", "Your password could not be changed. Check the server requirements or try again.") : t("La demande n’a pas pu être envoyée. Vérifie ta connexion et réessaie.", "The request could not be sent. Check your connection and try again."));
    } finally { setBusy(false); }
  }
  const titles: Record<Stage, string> = {
    request: t("Mot de passe oublié ?", "Forgot your password?"),
    sent: t("Consultez votre boîte e-mail", "Check your inbox"),
    verify: t("Vérifiez votre accès", "Verify your access"),
    password: t("Nouveau mot de passe", "New password"),
    success: api ? t("Votre accès est rétabli", "Your access is restored") : t("L’écran de récupération est prêt", "The recovery screen is ready"),
    invalid: t("Ce lien n’est plus utilisable", "This link cannot be used"),
  };
  return <main className="registration-page registration-forgot recovery-page">
    <header className="registration-header">
      <button
        className="register-brand"
        onClick={() => onNavigate("home")}
        aria-label={t("DevAfrica Connect, accueil", "DevAfrica Connect, home")}>
        <img
          src="/images/africa-mark.png"
          alt="" />
        <span>
          <strong>Dev<span>Africa</span></strong>
          <small>CONNECT</small>
        </span>
      </button>
      <nav
        className="recovery-header-nav"
        aria-label={t("Navigation de récupération", "Recovery navigation")}>
        <button onClick={() => onNavigate("login")}>
          {t("Se connecter", "Sign in")}
        </button>
      </nav>
      <LanguageSwitcher />
    </header>
    <div className="registration-layout">
      <section
        className="registration-card recovery-card"
        ref={card}>
        <div className="recovery-symbol">
          {stage === "success" ? <CheckCircle2 size={28} /> : stage === "sent" ? <Mail size={28} /> : stage === "password" ? <LockKeyhole size={28} /> : stage === "verify" ? <ShieldCheck size={28} /> : <KeyRound size={28} />}
        </div>
        <div className="registration-card-heading">
          <h1
            tabIndex={-1}
            ref={heading}>
            {titles[stage]}
          </h1>
          <p>
            {stage === "request" ? t("Un oubli, ça arrive. Retrouvons l’accès à votre communauté.", "It happens. Let’s get you back to your community.") : stage === "verify" ? t("Utilisez le code ou le mot de passe temporaire reçu par e-mail.", "Use the code or temporary password you received by email.") : stage === "password" ? t("Choisissez un nouveau mot de passe et confirmez-le.", "Choose a new password and confirm it.") : stage === "invalid" ? t("Le lien est incomplet, invalide ou a expiré. Demandez-en un nouveau pour continuer.", "The link is incomplete, invalid, or expired. Request a new one to continue.") : stage === "success" ? api ? t("Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.", "Your password has been changed. You can now sign in.") : t("Le formulaire est validé en démonstration. Aucun mot de passe n’a été modifié.", "The demo form is valid. No password was changed.") : t("Si un compte correspond à cette adresse, vous recevrez les instructions de récupération.", "If an account matches this address, you will receive recovery instructions.")}
          </p>
        </div>
        {stage !== "invalid" && <ol
          className="recovery-progress"
          aria-label={t("Étapes de récupération", "Recovery steps")}>
          {[t("Demande", "Request"), t("Vérification", "Verification"), t("Mot de passe", "Password")].map((label, index) => <li
            key={index}
            className={index === step ? "active" : index < step ? "complete" : ""}
            aria-current={index === step ? "step" : undefined}>
            <span>
              {index < step ? <Check size={14} /> : index + 1}
            </span>
            <small>
              {label}
            </small>
          </li>)}
        </ol>}
        {!api && <p
          className="recovery-demo"
          role="note">
          {t("Mode démonstration : aucun e-mail n’est envoyé et aucun mot de passe réel n’est changé.", "Demo mode: no email is sent and no real password is changed.")}
        </p>}
        {(stage === "request" || stage === "verify" || stage === "password") && <form
          className="recovery-form"
          onSubmit={submit}>
          {(stage === "request" || stage === "verify") && <label>
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
                onChange={e => setEmail(e.target.value)}
                placeholder={t("vous@exemple.com", "you@example.com")} />
            </span>
          </label>}
          {stage === "request" && <p className="recovery-hint">
            {t("Le message pourra contenir un lien sécurisé ou un code, selon le mode choisi par votre plateforme.", "The message may contain a secure link or code, depending on your platform’s configuration.")}
          </p>}
          {stage === "verify" && <>
            <div
              className="recovery-methods"
              role="group"
              aria-label={t("Méthode de vérification", "Verification method")}>
              <button
                type="button"
                aria-pressed={method === "code"}
                onClick={() => { setMethod("code"); setCode(""); setError(""); }}>
                {t("Code reçu", "Received code")}
              </button>
              <button
                type="button"
                aria-pressed={method === "temporary_password"}
                onClick={() => { setMethod("temporary_password"); setCode(""); setError(""); }}>
                {t("Mot de passe temporaire", "Temporary password")}
              </button>
            </div>
            <label>
              {method === "code" ? t("Code de vérification", "Verification code") : t("Mot de passe temporaire", "Temporary password")}
              <span className="onboard-input">
                <KeyRound size={18} />
                <input
                  type="password"
                  name="recoveryCode"
                  autoComplete="one-time-code"
                  required={api}
                  value={code}
                  maxLength={256}
                  onChange={e => setCode(e.target.value)}
                  placeholder={method === "code" ? t("Saisissez le code reçu", "Enter the code you received") : t("Saisissez le mot de passe temporaire", "Enter the temporary password")} />
              </span>
            </label>
            <p className="recovery-hint">
              {api ? t("Un code expiré ? Demandez un nouvel envoi.", "Expired code? Request another one.") : t("Vous pouvez prévisualiser l’écran suivant sans saisir de code en démonstration.", "In demo mode, you can preview the next screen without entering a code.")}
            </p>
          </>}
          {stage === "password" && <>
            <PasswordField
              newPassword
              label={t("Nouveau mot de passe", "New password")}
              value={password}
              onChange={setPassword} />
            <PasswordField
              confirm
              label={t("Confirmer le nouveau mot de passe", "Confirm new password")}
              value={confirmation}
              onChange={setConfirmation} />
            <p className="recovery-hint">
              {t("Au moins 8 caractères. Choisissez un mot de passe différent de l’ancien.", "At least 8 characters. Choose a password different from the old one.")}
            </p>
          </>}
          {error && <p
            className="registration-error"
            role="alert">
            {t(error)}
          </p>}
          <button
            className="register-continue"
            type="submit"
            disabled={busy}>
            {busy ? <>
              <LoaderCircle
                className="spin"
                size={18} />
              {t("En cours…", "Working…")}
            </> : <>
              {stage === "request" ? t("Recevoir les instructions", "Get recovery instructions") : stage === "verify" ? api ? t("Vérifier mon accès", "Verify my access") : t("Voir l’écran suivant (démo)", "Preview next screen (demo)") : api ? t("Enregistrer mon mot de passe", "Save my password") : t("Vérifier le formulaire (démo)", "Validate form (demo)")}
              <ArrowRight size={18} />
            </>}
          </button>
        </form>}
        {stage === "sent" && <div className="recovery-next">
          <div className="recovery-inbox">
            <Mail size={23} />
            <span>
              <strong>
                {email}
              </strong>
              <small>
                {t("Pensez aussi au dossier des courriers indésirables.", "Remember to check your spam folder too.")}
              </small>
            </span>
          </div>
          <button
            className="register-continue"
            onClick={() => go("verify")}>
            <KeyRound size={18} />
            {t("J’ai reçu un code", "I received a code")}
          </button>
          <p className="recovery-hint">
            <Link2 size={15} />
            {t("Vous avez reçu un lien ? Ouvrez-le depuis l’e-mail pour choisir votre nouveau mot de passe.", "Received a link? Open it from the email to choose your new password.")}
          </p>
          <button
            className="recovery-text-button"
            onClick={() => go("request")}>
            {t("Renvoyer les instructions ou changer d’adresse", "Resend instructions or change email")}
          </button>
        </div>}
        {stage === "invalid" && <div className="recovery-next">
          <button
            className="register-continue"
            onClick={() => { setProof(undefined); go("request"); }}>
            {t("Demander un nouveau lien", "Request a new link")}
            <ArrowRight size={18} />
          </button>
          <button
            className="recovery-text-button"
            onClick={() => go("verify")}>
            {t("J’ai plutôt reçu un code", "I received a code instead")}
          </button>
        </div>}
        {stage === "success" && <button
          className="register-continue"
          onClick={() => onNavigate("login")}>
          {t("Retour à la connexion", "Back to sign in")}
          <ArrowRight size={18} />
        </button>}
        {stage === "request" && <button
          className="recovery-text-button"
          onClick={() => go("verify")}>
          {t("J’ai déjà un code ou un mot de passe temporaire", "I already have a code or temporary password")}
        </button>}
        {stage === "verify" && <button
          className="recovery-text-button"
          disabled={busy}
          onClick={() => go("request")}>
          {t("Demander un nouveau lien", "Request a new link")}
        </button>}
        {stage !== "success" && <button
          className="recovery-back"
          onClick={() => onNavigate("login")}>
          <ArrowLeft size={16} />
          {t("Retour à la connexion", "Back to sign in")}
        </button>}
      </section>
      <aside
        className="registration-art"
        aria-label={t("Illustration de développement", "Development illustration")}>
        <span className="register-art-badge">
          <Code2 size={23} />
          <span>
            {t("Un continent de talents.", "A continent of talent.")}
            <strong>
              {t("Construisons ensemble.", "Let’s build together.")}
            </strong>
          </span>
        </span>
        <img
          className="registration-illustration"
          src="/images/auth-developer.jpg"
          alt={t("Développeur devant des interfaces de code", "Developer working with code interfaces")} />
        <div className="register-art-caption">
          <span />
          <p>
            {t("Apprendre. Partager. Faire grandir ses idées.", "Learn. Share. Grow your ideas.")}
          </p>
        </div>
      </aside>
    </div>
  </main>;
}
