"use client";
import { useDocumentEvent } from "@lib/hooks/useEvent";

// Code copied from: https://github.com/KaTeX/KaTeX/tree/main/contrib/copy-tex

export default function KatexCopyHandler(): React.ReactNode {
  // Return <div class="katex"> element containing node, or null if not found.
  function closestKatex(node: Node) {
    // If node is a Text Node, for example, go up to containing Element,
    // where we can apply the `closest` method.
    const element = node instanceof Element ? node : node.parentElement;
    return element && element.closest(".katex");
  }

  // Global copy handler to modify behavior on/within .katex elements.
  useDocumentEvent("copy", event => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !event.clipboardData) {
      return; // default action OK if selection is empty or unchangeable
    }
    const clipboardData = event.clipboardData;
    const range = selection.getRangeAt(0);

    // When start point is within a formula, expand to entire formula.
    const startKatex = closestKatex(range.startContainer);
    startKatex && range.setStartBefore(startKatex);

    // Similarly, when end point is within a formula, expand to entire formula.
    const endKatex = closestKatex(range.endContainer);
    endKatex && range.setEndAfter(endKatex);

    const fragment = range.cloneContents();
    if (!fragment.querySelector(".katex-mathml")) return; // default action OK if no .katex-mathml elements

    const htmlContents = [...fragment.childNodes]
      .map(e => (e instanceof Text ? e.textContent : (e as Element).outerHTML))
      .join("");

    // Preserve usual HTML copy/paste behavior.
    clipboardData.setData("text/html", htmlContents);
    // Rewrite plain-text version.
    clipboardData.setData("text/plain", katexReplaceWithTex(fragment).textContent);
    // Prevent normal copy handling.
    event.preventDefault();
  });

  return null;
}

interface CopyDelimiters {
  inline: [string, string];
  display: [string, string];
}
// Set these to how you want inline and display math to be delimited.
const copyDelimiters: CopyDelimiters = {
  inline: ["$$", "$$"], // alternative: ['\(', '\)']
  display: ["$$$", "$$$"], // alternative: ['\[', '\]']
};

// Replace .katex elements with their TeX source (<annotation> element).
// Modifies fragment in-place.  Useful for writing your own 'copy' handler,
// as in copy-tex.js.
function katexReplaceWithTex(fragment: DocumentFragment): DocumentFragment {
  // Remove .katex-html blocks that are preceded by .katex-mathml blocks
  // (which will get replaced below).
  const katexHtml = fragment.querySelectorAll(".katex-mathml + .katex-html");
  for (const element of katexHtml) {
    if (element.remove) element.remove();
    else element.parentNode?.removeChild(element);
  }
  // Replace .katex-mathml elements with their annotation (TeX source)
  // descendant, with inline delimiters.
  const katexMathml = fragment.querySelectorAll(".katex-mathml");
  for (const element of katexMathml) {
    const texSource = element.querySelector("annotation");
    if (texSource) {
      if (element.replaceWith) element.replaceWith(texSource);
      else element.parentNode?.replaceChild(texSource, element);
      texSource.innerHTML = copyDelimiters.inline[0] + texSource.innerHTML + copyDelimiters.inline[1];
    }
  }
  // Switch display math to display delimiters.
  const displays = fragment.querySelectorAll(".katex-display annotation");
  for (const element of displays) {
    element.innerHTML =
      copyDelimiters.display[0] +
      element.innerHTML.substring(
        copyDelimiters.inline[0].length,
        element.innerHTML.length - copyDelimiters.inline[0].length - copyDelimiters.inline[1].length,
      ) +
      copyDelimiters.display[1];
  }
  return fragment;
}
