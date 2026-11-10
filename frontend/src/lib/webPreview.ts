import type { WebFiles } from "../data/webCourseTypes";

type ScriptBundle = { nonce: string; sources: string[] };

export function buildWebDocument(
  files: WebFiles,
  preview = true,
  bundle?: ScriptBundle,
) {
  const doc = new DOMParser().parseFromString(files.html, "text/html");
  doc
    .querySelectorAll('link[rel~="stylesheet"]')
    .forEach((node) => node.remove());
  if (preview || bundle) {
    doc
      .querySelectorAll("script, iframe, object, embed, base, meta[http-equiv]")
      .forEach((node) => node.remove());
  }
  if (preview) {
    const policy = doc.createElement("meta");
    policy.httpEquiv = "Content-Security-Policy";
    policy.content = [
      "default-src 'none'",
      "style-src 'unsafe-inline'",
      "img-src data: blob:",
      "media-src data: blob:",
      "form-action 'none'",
      "base-uri 'none'",
      bundle ? `script-src 'nonce-${bundle.nonce}'` : "script-src 'none'",
      bundle
        ? "connect-src https://geocoding-api.open-meteo.com https://api.open-meteo.com https://ghibliapi.vercel.app https://dummyjson.com https://api.coinpaprika.com"
        : "connect-src 'none'",
    ].join("; ");
    doc.head.prepend(policy);
  }
  if (!doc.querySelector('meta[name="viewport"]')) {
    const viewport = doc.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    doc.head.append(viewport);
  }
  const style = doc.createElement("style");
  style.textContent = files.css.replace(/<\/style/gi, "<\\/style");
  doc.head.append(style);
  if (bundle) {
    for (const source of bundle.sources) {
      const script = doc.createElement("script");
      script.setAttribute("nonce", bundle.nonce);
      script.textContent = source.replace(/<\/script/gi, "<\\/script");
      doc.body.append(script);
    }
  }
  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
}
