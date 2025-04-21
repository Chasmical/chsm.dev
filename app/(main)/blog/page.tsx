import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@lib/database/server";
import { getAllBlogPosts, getAllBlogPostsShallow } from "@api/blog";
import { getBlogPostSlug, truncateBlogPostContent } from "@api/blog/helper";
import { configureMdx } from "@lib/mdx";
import configurePlugins, { MdxPluginConfigs } from "@lib/mdx/configure-plugins";
import configureComponents from "@lib/mdx/configure-components";
import BlogLayout from "@components/Blog/BlogLayout";
import BlogSidebar from "@components/Blog/BlogSidebar";
import BlogArticle from "@components/Blog/BlogArticle";

export default async function BlogLandingPage() {
  // Select all blog posts (throw notFound on error)
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const recentPosts = (await getAllBlogPosts(supabase)) || notFound();

  // Configure and compile the markdown
  const mdxOptions: MdxPluginConfigs = { embedSize: [480, 270] };

  const mdx = configureMdx({
    format: "mdx",
    ...configurePlugins(mdxOptions),
    components: configureComponents(),
  });

  const truncatedMdxResults = await Promise.all(
    recentPosts.map(post => mdx.compile(truncateBlogPostContent(post.content))),
  );

  return (
    <BlogLayout
      sidebar={<BlogSidebar posts={recentPosts} />}
      article={
        <>
          {recentPosts.map((post, i) => {
            return <BlogArticle key={post.id} post={post} mdxContent={truncatedMdxResults[i].content} readMore />;
          })}
        </>
      }
      toc={null}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  // Select all blog posts (throw notFound on error)
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const recentPosts = (await getAllBlogPostsShallow(supabase)) || notFound();
  const latest = recentPosts[0];

  const title = `Blog posts`;
  const description = [
    "A blog about whatever I'm doing. It's mostly about programming, microoptimization, and overcomplicated bizarre projects.",
    `A total of ${recentPosts.length} posts. Most recent: [${getBlogPostSlug(latest).split("/").slice(0, 3).join("-")}] "${latest.title}".`,
  ].join("\n");

  return {
    title,
    description,

    openGraph: {
      type: "website",
      title,
      description,
      locale: "en",
      images: [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [],
    },
    alternates: {
      types: {
        "application/rss+xml": "/blog/rss.xml",
        "application/atom+xml": "/blog/atom.xml",
        "application/json": "/blog/feed.json",
      },
    },
  };
}
