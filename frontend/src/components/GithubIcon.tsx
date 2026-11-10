import type { SVGProps } from "react";
// Les logos de marques ne sont plus fournis par la version Lucide du projet.
export default function GithubIcon(
  props: SVGProps<SVGSVGElement> & { size?: number },
) {
  return (
    <svg
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.61 0c2.14-1.45 3.08-1.15 3.08-1.15.62 1.55.23 2.7.12 2.98a4.34 4.34 0 0 1 1.15 3.02c0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  );
}
