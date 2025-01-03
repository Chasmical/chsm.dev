import NextLink from "next/link";
import Link from "@components/Common/Link";
import Avatar from "@components/Common/Avatar";
import type { DbBlogPostWithAuthors } from "@lib/database/types";
import styles from "./index.module.scss";

export default function HeaderAuthors({ authors }: { authors: DbBlogPostWithAuthors["authors"] }) {
  return (
    <div className={styles.authorsList}>
      {authors.map(author => {
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
      })}
    </div>
  );
}
