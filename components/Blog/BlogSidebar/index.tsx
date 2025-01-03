import ActivatableLink from "@components/Specialized/ActivatableLink";
import type { DbBlogPostShallow } from "@lib/database/types";
import { getBlogPostUrl } from "@api/blog/helper";
import styles from "./index.module.scss";

export interface BlogSidebarProps {
  posts: DbBlogPostShallow[];
}

export default function BlogSidebar({ posts }: BlogSidebarProps) {
  return (
    <nav className={styles.container}>
      <div className={styles.title}>{"Recent posts"}</div>

      <ul className={styles.items}>
        {posts.map(post => (
          <li className={styles.item} key={post.id}>
            <ActivatableLink className={styles.link} href={getBlogPostUrl(post)}>
              {post.title}
            </ActivatableLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
