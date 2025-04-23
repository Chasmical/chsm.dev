import type { Transformer } from "unified";
import type { Nodes, PhrasingContent } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { get as getEmoji } from "node-emoji";
import { toCodePoints } from "@twemoji/parser";
import twemojiRegex from "@twemoji/parser/dist/lib/regex"; // See ./twemoji-parser.d.ts
import { gemoji } from "gemoji";
import "./remark-emoji.scss";

// Code adapted and combined from the following plugins:
// - https://github.com/rhysd/remark-emoji
// - https://github.com/jdecked/twemoji-parser
// - https://github.com/florianeckerstorfer/remark-a11y-emoji

const EmojiNameRegex = /:(\+1|-1|[\w-]+):/g;
const EmojiRegex = new RegExp(`(\\\\*)(${twemojiRegex.source})`, "g");

export interface RemarkEmojiOptions {
  className?: string;
  buildUrl?: (codepoints: string, type: "png" | "svg") => string;
  type?: "png" | "svg";
  extraEmojis?: (emojiName: string) => { url: string; description: string } | undefined;
}

export default function remarkEmoji(options?: RemarkEmojiOptions): Transformer<Nodes> {
  options ??= {};

  const className = options.className ?? "emoji";
  const buildUrl = options.buildUrl ?? defaultBuildUrl;
  function defaultBuildUrl(codepoints: string, type: "png" | "svg") {
    const basePath = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/";
    return `${basePath}${type === "png" ? "72x72" : "svg"}/${codepoints}.${type}`;
  }
  const type = options.type ?? "png";

  return tree => {
    // Replace emoji names with emojis
    findAndReplace(tree, [
      EmojiNameRegex,
      (_, emojiName) => {
        const twemoji = getEmoji(emojiName);
        if (twemoji) return twemoji;

        // Replace extra emojis with images
        const extra = options.extraEmojis?.(emojiName);
        if (extra) {
          const { url, ...extraProps } = extra;
          return {
            type: "image",
            url,
            data: { hProperties: { draggable: "false", alt: "", className, ...extraProps } },
          };
        }
        return false;
      },
    ]);

    // Replace emojis with twemojis
    findAndReplace(tree, [
      EmojiRegex,
      (_, escapes: string, emoji: string) => {
        const codepoints = toCodePoints(removeVS16s(emoji)).join("-");
        const src = buildUrl(codepoints, type);
        const ariaLabel = getEmojiDescription(emoji);

        if (escapes.length % 2 === 1) {
          return escapes.slice(0, escapes.length / 2) + emoji;
        }

        const escapesContent: PhrasingContent = {
          type: "text",
          value: escapes.slice(0, escapes.length / 2),
        };
        const emojiContent: PhrasingContent = {
          type: "image",
          url: src,
          data: { hProperties: { draggable: "false", alt: emoji, className, ariaLabel } },
        };

        return escapesContent.value ? [escapesContent, emojiContent] : emojiContent;
      },
    ]);
  };
}

// Remove Variation Selector-16, if there is no Zero Width Joiner (???)
function removeVS16s(emoji: string) {
  return emoji.indexOf("\u200D") < 0 ? emoji.replaceAll("\uFE0F", "") : emoji;
}

function findGemoji(emoji: string) {
  return gemoji.find(item => item.emoji === emoji);
}
function getEmojiDescription(emoji: string) {
  const skintone = emoji.match(SkintoneRegex)?.[0] as keyof typeof SkintoneMap | undefined;
  if (skintone) emoji = emoji.replace(SkintoneRegex, "");

  const info = findGemoji(emoji) ?? findGemoji(emoji + "\uFE0F");
  if (!info) return "";

  const skintoneDescription = SkintoneMap[skintone!] as string | undefined;
  return skintoneDescription ? `${info.description} (${skintoneDescription})` : info.description;
}

const SkintoneMap = {
  "\u{1F3FB}": "light skin tone",
  "\u{1F3FC}": "medium-light skin tone",
  "\u{1F3FD}": "medium skin tone",
  "\u{1F3FE}": "medium-dark skin tone",
  "\u{1F3FF}": "dark skin tone",
};
const SkintoneRegex = new RegExp(Object.keys(SkintoneMap).join("|"), "g");
