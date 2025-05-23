import NextLink from "next/link";
import type { DbBlogPostWithAuthors } from "@lib/database/types";
import styles from "./index.module.scss";

export default function PostTags({ tags }: { tags: DbBlogPostWithAuthors["tags"] }) {
  return (
    <div className={styles.tagsRow}>
      <b>{"Tags: "}</b>
      {tags.length ? tags.map(tag => <PostTag key={tag} tag={tag} />) : "none"}
    </div>
  );
}

export function PostTag({ tag }: { tag: string }) {
  return (
    <NextLink href={`/blog/tag/${tag}`} className={styles.tagLink}>
      {tag.replaceAll("_", " ")}
    </NextLink>
  );
}
