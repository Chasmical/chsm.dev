import { useMemo } from "react";
import NextLink from "next/link";
import { extractFrontmatter } from "@lib/mdx/frontmatter";
import type { DbBlogPostWithAuthors } from "@lib/database/types";
import { markdownClass } from "@components/Specialized/MarkdownWrapper";
import Heading from "@components/Common/Heading";
import HeaderAuthors from "./HeaderAuthors";
import HeaderDates from "./HeaderDates";
import HeaderTags from "./HeaderTags";
import { getBlogPostUrl } from "@api/blog";
import styles from "./index.module.scss";

export interface BlogArticleProps {
  post: DbBlogPostWithAuthors;
  mdxContent: React.ReactNode;
  readMore?: boolean;
}

export default function BlogArticle({ post, mdxContent, readMore }: BlogArticleProps) {
  const description = useMemo(() => {
    const { frontmatter } = extractFrontmatter<{ description?: string }>(post.content);
    return frontmatter?.description;
  }, [post.content]);

  return (
    <article itemProp="blogPost" className={styles.article} itemScope itemType="https://schema.org/BlogPosting">
      <meta itemProp="description" content={description || ""} />

      <header>
        <Heading
          level={1}
          href={getBlogPostUrl(post)}
          itemProp="headline"
          linkItemProp="url"
          className={styles.headline}
        >
          {post.title}
        </Heading>

        <div className={styles.headerInfo}>
          <HeaderDates post={post} />
          <HeaderAuthors authors={post.authors} />
          {!readMore && <HeaderTags tags={post.tags} />}
        </div>
      </header>

      <section itemProp="articleBody" id="__blogPostContainer" className={markdownClass}>
        {mdxContent}
      </section>

      <footer className={styles.footer}>
        {readMore && (
          <>
            <HeaderTags tags={post.tags} />
            <NextLink href={getBlogPostUrl(post)} className={styles.readMoreButton}>
              {"Read more..."}
            </NextLink>
          </>
        )}
      </footer>
    </article>
  );
}
