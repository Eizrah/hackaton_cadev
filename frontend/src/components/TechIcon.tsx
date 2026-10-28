import { Code2, Coffee } from "lucide-react";
import { normalizeText } from "../data/models";
const techNames: Record<string, string> = {
  react: "react",
  "react native": "react",
  "vue.js": "vuedotjs",
  vue: "vuedotjs",
  angular: "angular",
  html: "html5",
  html5: "html5",
  css: "css",
  css3: "css",
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  python: "python",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  "node.js": "nodedotjs",
  node: "nodedotjs",
  express: "express",
  php: "php",
  laravel: "laravel",
  "spring boot": "springboot",
  kotlin: "kotlin",
  "jetpack compose": "jetpackcompose",
  swift: "swift",
  swiftui: "swift",
  flutter: "flutter",
  dart: "dart",
  "c++": "cplusplus",
  "c#": "csharp",
  c: "c",
  ".net": "dotnet",
  ".net maui": "dotnet",
  "asp.net core": "dotnet",
  electron: "electron",
  tauri: "tauri",
  qt: "qt",
  "qt / pyside6": "qt",
  pyside6: "qt",
  javafx: "java",
  java: "java",
  figma: "figma",
  blender: "blender",
  rive: "rive",
  go: "go",
  rust: "rust",
  ruby: "ruby",
  sql: "postgresql",
  r: "r",
  lua: "lua",
  scala: "scala",
  git: "git",
  github: "github",
  "ui/ux": "figma",
  mongodb: "mongodb",
  "sql / postgresql": "postgresql",
};
export default function TechIcon({
  name,
  size = 22,
}: {
  name: string;
  size?: number;
}) {
  const slug = techNames[normalizeText(name)];
  if (slug === "java")
    return (
      <Coffee size={size} className="tech-icon java-icon" aria-hidden="true" />
    );
  return slug ? (
    <img
      className="tech-icon"
      src={`/tech/${slug}.svg`}
      width={size}
      height={size}
      alt={`Icône ${name}`}
    />
  ) : (
    <Code2 size={size} className="tech-icon" aria-hidden="true" />
  );
}
export function SkillChip({ name }: { name: string }) {
  return (
    <span className="skill-chip">
      <TechIcon name={name} size={18} />
      {name}
    </span>
  );
}
