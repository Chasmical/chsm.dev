import Link from "@components/Common/Link";
import styles from "./page.module.scss";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <p>
        <Link href="/blog">{"⇒ Go to Blog"}</Link>
      </p>
      <p>
        <Link href="/markdown">{"⇒ Go to Markdown demo"}</Link>
      </p>
    </div>
  );
}

