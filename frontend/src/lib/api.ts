// À utiliser quand les routes Django auront été confirmées avec le backend.
// Ce client suppose une authentification Django par cookie de session et CSRF.
const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(status: number, details: unknown) {
    super(`La requête a échoué (${status}).`);
    this.status = status;
    this.details = details;
  }
}
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  const csrfCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrftoken="));
  if (csrfCookie)
    headers.set(
      "X-CSRFToken",
      decodeURIComponent(csrfCookie.slice("csrftoken=".length)),
    );
  const response = await fetch(`${baseUrl}/${path.replace(/^\//, "")}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const data =
    response.status === 204
      ? undefined
      : response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : await response.text();
  if (!response.ok) throw new ApiError(response.status, data);
  return data as T;
}
