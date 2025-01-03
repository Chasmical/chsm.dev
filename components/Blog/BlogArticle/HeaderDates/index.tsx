import { useMemo } from "react";
import DateTime from "@components/Specialized/DateTime";
import type { DbBlogPostWithAuthors } from "@lib/database/types";
import styles from "./index.module.scss";

export default function HeaderDates({ post }: { post: DbBlogPostWithAuthors }) {
  return (
    <div className={styles.datesAndTime}>
      <div>
        <DateTime itemProp="datePublished" dateTime={post.created_at} format="date" />
        {" ⋅ "}
        <ReadingTime content={post.content} wordsPerMinute={200} />
      </div>
      {post.edited_at && (
        <div className={styles.lastEditedDate}>
          {"Last edited: "}
          <DateTime itemProp="datePublished" dateTime={post.edited_at} format="date" />
        </div>
      )}
    </div>
  );
}

function ReadingTime({ content, wordsPerMinute }: { content: string; wordsPerMinute: number }) {
  const wordCount = useMemo(() => content.split(/[\s\r\n]+/g).length, [content]);

  return (
    <span title={`Approx. ${wordCount} words, at ${wordsPerMinute} words per minute.`}>
      {Math.ceil(wordCount / wordsPerMinute)}
      {" min read"}
    </span>
  );
}
