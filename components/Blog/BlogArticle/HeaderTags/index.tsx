import NextLink from "next/link";
import type { DbBlogPostWithAuthors } from "@lib/database/types";
import styles from "./index.module.scss";

export default function PostTags({ tags }: { tags: DbBlogPostWithAuthors["tags"] }) {
  return (
    <div className={styles.tagsRow}>
      <b>{"Tags: "}</b>
      {tags.length
        ? tags.map(tag => (
            <NextLink key={tag} href={`/blog/tag/${tag}`} className={styles.tagLink}>
              {tag.replaceAll("_", " ")}
            </NextLink>
          ))
        : "none"}
    </div>
  );
}
