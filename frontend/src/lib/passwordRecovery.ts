import { ApiError, apiRequest } from "./api";

export type ResetProof = { uid: string; token: string } | { email: string; resetToken: string };
export type RecoveryMethod = "code" | "temporary_password";

export function parseResetLink(route: string): { uid: string; token: string } | undefined {
  if (!route.startsWith("reset?")) return;
  const query = new URLSearchParams(route.slice("reset?".length));
  const uid = query.get("uid") || query.get("uidb64") || "", token = query.get("token") || "";
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
  return error.status === 410 || error.status === 400 && /invalid_token|expired_token|token_expired|invalid_reset_token/i.test(JSON.stringify(error.details));
}

async function initializeCsrf() { await apiRequest("auth/csrf/"); }

export async function requestPasswordReset(email: string) {
  await initializeCsrf();
  await apiRequest("auth/password-reset/", { method: "POST", body: JSON.stringify({ email }) });
}

export async function verifyRecoveryCode(email: string, code: string, method: RecoveryMethod) {
  await initializeCsrf();
  const result = await apiRequest<{ reset_token?: string }>("auth/password-reset/verify/", {
    method: "POST", body: JSON.stringify({ email, code, method }),
  });
  if (!result?.reset_token || typeof result.reset_token !== "string") throw new Error("Missing reset token");
  return { email, resetToken: result.reset_token };
}

export async function confirmPasswordReset(proof: ResetProof, password: string, confirmation: string) {
  if (resetPasswordProblem(password, confirmation)) throw new Error("Invalid password confirmation");
  await initializeCsrf();
  const credentials = "uid" in proof ? proof : { email: proof.email, reset_token: proof.resetToken };
  await apiRequest("auth/password-reset/confirm/", {
    method: "POST", body: JSON.stringify({ ...credentials, new_password1: password, new_password2: confirmation }),
  });
}
