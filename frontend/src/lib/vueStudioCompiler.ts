import {
  compileScript,
  compileStyle,
  compileTemplate,
  parse,
} from "vue/compiler-sfc";

export function compileVueFile(code: string, filename: string, index: number) {
  const scopeId = `data-v-studio-${index}`;
  const parsed = parse(code, { filename });
  if (parsed.errors.length) throw parsed.errors[0];
  const { descriptor } = parsed;
  const scoped = descriptor.styles.some((style) => style.scoped);
  const component = "__studio_component";
  const script =
    descriptor.script || descriptor.scriptSetup
      ? compileScript(descriptor, { id: scopeId, genDefaultAs: component })
      : undefined;
  const template = descriptor.template
    ? compileTemplate({
        filename,
        id: scopeId,
        source: descriptor.template.content,
        scoped,
        compilerOptions: { bindingMetadata: script?.bindings },
      })
    : undefined;
  if (template?.errors.length) throw template.errors[0];
  const css = descriptor.styles.map((style) => {
    if (style.lang || style.module || style.src) {
      throw new Error(
        "Utilise une balise <style> CSS, avec scoped si nécessaire.",
      );
    }
    const compiled = compileStyle({
      filename,
      id: scopeId,
      source: style.content,
      scoped: style.scoped,
    });
    if (compiled.errors.length) throw compiled.errors[0];
    return compiled.code;
  });
  return {
    code: [
      script?.content ?? `const ${component} = {};`,
      template?.code,
      template && `${component}.render = render;`,
      scoped && `${component}.__scopeId = ${JSON.stringify(scopeId)};`,
      `export default ${component};`,
    ]
      .filter(Boolean)
      .join("\n"),
    css: css.join("\n"),
    typescript: (descriptor.scriptSetup ?? descriptor.script)?.lang === "ts",
  };
}
