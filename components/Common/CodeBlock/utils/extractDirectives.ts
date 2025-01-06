export interface DirectiveInfo {
  index: number;
  type: string;
  style?: Record<string, string>;
  className?: string;
}

const commentRegex = /\s*(?:\/\*(.+?)\*\/|\/\/(.+)|{\/\*(.+?)\*\/}|<!--(.+?)-->)\s*/g;

const availableDirectiveTypes = ["highlight", "annotate-top", "annotate-mid", "annotate-bot", "annotate"];

/**
 * Extracts directives from the code, removing them from the array.
 *
 * Supported comment types:
 * - `// directive`
 * - `/* directive * /`
 * - `{/* directive * /}`
 * - `<!-- directive -->`
 */
export default function extractDirectives(lines: string[]): DirectiveInfo[] {
  const directives: DirectiveInfo[] = [];

  // TODO: split by directive type
  let highlightStart: number | undefined;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Find all potential directives on every line
    for (const match of line.matchAll(commentRegex)) {
      const text = match.find((e, i) => e && i);
      if (!text) continue;

      const trimmedText = text.trimStart();
      const matchedType = availableDirectiveTypes.find(d => trimmedText.startsWith(d));
      if (!matchedType) continue;

      const directiveContents = trimmedText.slice(matchedType.length).trim();
      // When the directive is extracted, its position may need to be decremented once
      let decrementOnEmpty = false;

      const info: DirectiveInfo = { index: i, type: matchedType };

      let directiveAction = directiveContents;

      const colonIndex = directiveAction.indexOf(":");
      if (~colonIndex) {
        const attributes = directiveAction.slice(colonIndex + 1);
        directiveAction = directiveAction.slice(0, colonIndex).trimEnd();
        Object.assign(info, parseDirectiveAttributes(attributes));
      }

      // Handle the directive action
      switch (directiveAction.replace(" ", "-")) {
        case "":
        case "this":
        case "this-line":
          directives.push(info);
          break;
        case "next":
        case "next-line":
          info.index++;
          directives.push(info);
          decrementOnEmpty = true;
          break;
        case "prev":
        case "prev-line":
          info.index--;
          directives.push(info);
          break;
        case "begin":
        case "start":
          if (highlightStart !== undefined) continue;
          highlightStart = i;
          break;
        case "end":
        case "finish":
          if (highlightStart === undefined) continue;
          for (let j = highlightStart; j <= i; j++) {
            directives.push({ ...info, index: j });
          }
          highlightStart = undefined;
          decrementOnEmpty = true;
          break;
        default:
          continue;
      }

      // Extract the directive from the line
      line = line.replace(match[0], "");
      if (line.trim()) {
        // If there's still something on it, keep it
        lines[i] = line;
      } else {
        // Otherwise, remove the line completely
        lines.splice(i--, 1);
        if (decrementOnEmpty) directives[directives.length - 1]!.index--;
      }
    }
  }

  return directives;
}

const attributeRegex = /([^\s=]+)(?:="([^"]+)"|=([^\s]+))?/g;

function parseDirectiveAttributes(attributes: string) {
  let style: Record<string, string> | undefined;
  let className = "";

  for (const [, key, quoted, unquoted] of attributes.matchAll(attributeRegex)) {
    const value = quoted ?? unquoted;
    if (value != null) {
      (style ??= {})["--" + key] = value;
    } else {
      className && (className += " ");
      className += key;
    }
  }

  return { style, className };
}
