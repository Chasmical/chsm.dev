import React from "react";
import type { PluggableList } from "unified";
import type { MDXComponents, MDXModule } from "mdx/types";
import { VFile, type VFileCompatible } from "vfile";
import { createProcessor } from "@mdx-js/mdx";
import { extractFrontmatter } from "@lib/mdx/frontmatter";
import { jsxRuntime } from "@lib/mdx/jsx-runtime.cjs";

export type { PluggableList as MdxPlugins } from "unified";
export type { MDXComponents as MdxComponents } from "mdx/types";

export interface MdxConfig {
  format?: "md" | "mdx";
  rehypePlugins: PluggableList;
  remarkPlugins: PluggableList;
  scope?: Record<string, unknown>;
  components?: MDXComponents;
  extraOutputComponents?: React.FunctionComponent[];
}
export interface MdxEvalOptions {
  scope?: Record<string, unknown>;
}
export interface MdxProcessor {
  processor: ReturnType<typeof createProcessor>;
  compile: <FM>(markdown: VFileCompatible) => Promise<MdxResult<FM>>;
}
export interface MdxResult<FM> {
  frontmatter?: FM;
  content: React.ReactNode;
}

export function configureMdx(config: MdxConfig): MdxProcessor {
  // Create a unified processor from the specified configuration
  const processor = createProcessor({
    format: config?.format ?? "md",
    rehypePlugins: config.rehypePlugins,
    remarkPlugins: config.remarkPlugins,
    outputFormat: "function-body",
    development: process.env.NODE_ENV === "development",
  });

  const compile = async <FM>(markdown: VFileCompatible, evalOptions?: MdxEvalOptions) => {
    // Create a VFile and parse the frontmatter from it
    const vfile = new VFile(markdown);
    const { frontmatter } = extractFrontmatter<FM>(vfile, true);

    // Combine all of the provided scope variables
    const scope = { ...config.scope, frontmatter, ...evalOptions?.scope };

    // Process the markdown, and then evaluate the generated JS module
    const source = String(await processor.process(vfile));
    const { default: Content } = await evaluateModule(source, scope);

    // Create a React element: <Content components={…} />
    let content: React.ReactNode = React.createElement(Content, { components: config.components });

    if (config.extraOutputComponents) {
      // Add extra output components (such as KatexCopyHandler)
      const extra = config.extraOutputComponents.map(component => React.createElement(component));
      content = React.createElement(React.Fragment, undefined, content, ...extra);
    }
    return { frontmatter, content };
  };

  return { processor, compile };
}

export function compileMdx<FM>(markdown: VFileCompatible, config: MdxConfig) {
  return configureMdx(config).compile<FM>(markdown);
}

type AsyncFunctionCtor = new <Args extends unknown[], Return>(...args: string[]) => (...args: Args) => Promise<Return>;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as AsyncFunctionCtor;

function evaluateModule(source: string, scope?: Record<string, unknown> | null) {
  // Note: jsxRuntime needs to be accessible through arguments[0]
  scope = { jsxRuntime, ...scope };

  const keys = Object.keys(scope);
  const values = Object.values(scope);

  type InitModule = (...args: unknown[]) => Promise<MDXModule>;
  const init = Reflect.construct(AsyncFunction, keys.concat(source)) as InitModule;

  return init.apply(init, values);
}
