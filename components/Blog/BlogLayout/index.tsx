import clsx from "clsx";
import styles from "./index.module.scss";
import BlogSocials from "@components/Blog/BlogSocials";

export interface BlogLayoutProps {
  sidebar: React.ReactNode;
  article: React.ReactNode;
  toc: React.ReactNode;
}

export default function BlogLayout({ sidebar, article, toc }: BlogLayoutProps) {
  return (
    <div className={clsx(styles.container, !toc && styles.hideTocFirst)}>
      <aside className={styles.colSidebar}>
        <div className={styles.stickyColumn}>{sidebar}</div>
      </aside>
      <div className={styles.colToc}>
        <div className={styles.stickyColumn}>
          {toc}
          <BlogSocials />
        </div>
      </div>
      <main className={styles.colContent} itemScope itemType="https://schema.org/Blog">
        {article}
      </main>
    </div>
  );
}
