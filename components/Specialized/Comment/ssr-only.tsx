"use client";
import type { CommentProps } from ".";

/**
 * A cool work-around to instantly insert HTML comments in a React app.
 *
 * **It only works when rendered from the server-side.** Does not render or update on the client.
 */
export default function SsrOnlyComment({ text, children }: CommentProps) {
  if (typeof window === "undefined") {
    const comment = (text ?? children).replaceAll("`", "\\`").replaceAll("--", "—");
    const code = `document.currentScript.outerHTML = \`<!-- ${comment} -->\``;
    return <script>{code}</script>;
  }
}
