import "server-only";

export type CommentProps = { text: string; children?: never } | { text?: never; children: string };

export { default as default } from "./ssr-only";
