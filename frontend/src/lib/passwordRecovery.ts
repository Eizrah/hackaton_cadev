import { ApiError } from "./api";

export type ResetProof = { uid: string; token: string };
export type RecoveryMethod = "code" | "temporary_password";

export function parseResetLink(route: string): ResetProof | undefined {
  if (!route.startsWith("reset?")) return;
  const query = new URLSearchParams(route.slice("reset?".length));
  const uid = query.get("uid") || query.get("uidb64") || "";
  const token = query.get("token") || "";
  if (!uid || !token || uid.length > 256 || token.length > 2048 || /\s/.test(uid + token)) return;
  return { uid, token };
}

export function resetPasswordProblem(password: string, confirmation: string) {
  if (password.length < 8) return "short" as const;
  if (password.length > 128) return "long" as const;
  if (password !== confirmation) return "mismatch" as const;
  return null;
}

export function expiredResetError(error: unknown) {
  if (!(error instanceof ApiError)) return false;
  return (
    error.status === 410 ||
    (error.status === 400 &&
      /invalid_token|expired_token|token_expired|invalid_reset_token/i.test(
        JSON.stringify(error.details),
      ))
  );
}

// Étape 1 — envoie le lien de réinitialisation par email
export async function requestPasswordReset(email: string): Promise<void> {
  const { authApi } = await import("../api/auth");
  await authApi.motDePasseOublie(email);
  // Django envoie un email avec le lien /#reset?uid=...&token=...
  // L'utilisateur clique sur le lien → parseResetLink détecte uid+token → stage "password"
}

// Étape 2 — confirme le nouveau mot de passe avec uid+token du lien
export async function confirmPasswordReset(
  proof: ResetProof,
  password: string,
  confirmation: string,
): Promise<void> {
  if (resetPasswordProblem(password, confirmation)) throw new Error("Invalid password confirmation");
  const { authApi } = await import("../api/auth");
  await authApi.reinitialiserMotDePasse(proof.uid, proof.token, password);
}
