import { useMemo } from "react";
import type { DbBlogPostWithAuthors } from "@lib/database/types";
import Link from "@components/Common/Link";
import Avatar from "@components/Common/Avatar";
import Heading from "@components/Common/Heading";
import DateTime from "@components/Specialized/DateTime";
import NextLink from "next/link";
import styles from "./index.module.scss";
import { getBlogPostUrl } from "@api/blog";

export interface BlogArticleHeaderProps {
  post: DbBlogPostWithAuthors;
}

export default function BlogArticleHeader({ post }: BlogArticleHeaderProps) {
  return (
    <header>
      <Heading level={1} href={getBlogPostUrl(post)} itemProp="headline" linkItemProp="url" className={styles.headline}>
        {post.title}
      </Heading>
      <div className={styles.headerInfo}>
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
        <div className={styles.authorsList}>
          {post.authors.map(author => (
            <AuthorInfo author={author} key={author.id} />
          ))}
        </div>
        <div className={styles.tagsRow}>
          <b>{"Tags: "}</b>
          {post.tags.length
            ? post.tags.map(tag => (
                <NextLink key={tag} href={`/blog/tag/${tag}`} className={styles.tagLink}>
                  {tag.replaceAll("_", " ")}
                </NextLink>
              ))
            : "none"}
        </div>
      </div>
    </header>
  );
}

function AuthorInfo({ author }: { author: DbBlogPostWithAuthors["authors"][number] }) {
  const url = `/user/${author.user?.slug ?? author.user_id}`;

  return (
    <div className={styles.author} key={author.id}>
      <NextLink href={url} className={styles.authorAvatarLink}>
        <Avatar size={32} src={author.user?.avatar_url ?? undefined} />
      </NextLink>
      <div className={styles.authorInfo} itemProp="author" itemScope itemType="https://schema.org/Person">
        <Link href={url} itemProp="url">
          <span itemProp="name">{author.user?.username}</span>
        </Link>
        {author.label && <span itemProp="description">{author.label}</span>}
      </div>
    </div>
  );
}

interface ReadingTimeProps {
  content: string;
  wordsPerMinute: number;
}
function ReadingTime({ content, wordsPerMinute }: ReadingTimeProps) {
  const wordCount = useMemo(() => content.split(/[\s\r\n]+/g).length, [content]);

  return (
    <span title={`Approx. ${wordCount} words, at ${wordsPerMinute} words per minute.`}>
      {Math.ceil(wordCount / wordsPerMinute)}
      {" min read"}
    </span>
  );
}
