import type { MdxConfig } from "@lib/mdx";
// Remark plugins
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import remarkCustomDirectives from "./plugins/remark-custom-directives";
import remarkCustomHeadingId from "remark-custom-heading-id";
import remarkTocHeadings, { RemarkTocHeadingsOptions } from "./plugins/remark-toc-headings";
import remarkInlineCssColor from "./plugins/remark-inline-css-color";
import remarkEmoji from "./plugins/remark-emoji";
import remarkEmbed, { RemarkEmbedOptions } from "./plugins/remark-embed";
import remarkAnalyze, { RemarkAnalyzeOptions } from "./plugins/remark-analyze";
// Rehype plugins
import rehypeKatex from "./plugins/rehype-katex";
import rehypeOverrideJsx from "./plugins/rehype-override-jsx";
import rehypeCodeMeta from "./plugins/rehype-code-meta";
// Miscellaneous stuff
import KatexCopyHandler from "./misc/KatexCopyHandler";

export interface MdxPluginConfigs {
  toc?: RemarkTocHeadingsOptions["data"];
  analysis?: RemarkAnalyzeOptions["data"];
  embedSize?: [width: number, height: number];
}

export default function configurePlugins(config: MdxPluginConfigs = {}) {
  const tocOptions: RemarkTocHeadingsOptions = { data: {} as never };
  const analysisOptions: RemarkAnalyzeOptions = { data: {} as never };
  const embedOptions: RemarkEmbedOptions = { size: config?.embedSize };

  const options: Pick<MdxConfig, "remarkPlugins" | "rehypePlugins" | "extraOutputComponents"> = {
    remarkPlugins: [
      [remarkGfm, { singleTilde: false }],
      remarkBreaks,
      [remarkMath, { singleDollarTextMath: false }],
      remarkDirective,
      [remarkCustomDirectives, {}],
      remarkCustomHeadingId,
      [remarkTocHeadings, tocOptions],
      [remarkInlineCssColor, {}],
      [remarkEmoji, { extraEmojis }],
      [remarkEmbed, embedOptions],
      [remarkAnalyze, analysisOptions],
    ],
    rehypePlugins: [
      [rehypeKatex, { throwOnError: false, errorColor: "#FF0000" }],
      [rehypeOverrideJsx, {}],
      [rehypeCodeMeta, {}],
    ],
    extraOutputComponents: [KatexCopyHandler],
  };

  config.toc = tocOptions.data;
  config.analysis = analysisOptions.data;

  return options;
}

function extraEmojis(emojiName: string): { url: string; className?: string; ariaLabel?: string } | undefined {
  if (emojiName.startsWith("blob")) {
    return { url: "/assets/emojis/" + emojiName + ".png", className: "extraEmoji" };
  }
}
