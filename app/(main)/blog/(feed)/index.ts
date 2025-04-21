import "server-only";
import { Feed, FeedOptions } from "feed";
import { getAllBlogPosts, getBlogPostSlug, getBlogPostUrl } from "@api/blog";
import { createServerSupabase } from "@lib/database/server";
import { notFound } from "next/navigation";
import { extractFrontmatter } from "@lib/mdx/frontmatter";

export async function generateFeed() {
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const posts = (await getAllBlogPosts(supabase)) ?? notFound();

  const baseUrl = "https://" + (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "chsm.dev");

  const latestDate = new Date(Math.max(...posts.map(p => Date.parse(p.created_at))));

  const author: FeedOptions["author"] = {
    name: "Chasmical",
    email: "kaz@chsm.dev",
    link: baseUrl + "/about",
  };
  const copyright = `Copyright © ${new Date().getUTCFullYear()} Chasmical`;

  const feed = new Feed({
    id: baseUrl + "/blog",
    link: baseUrl + "/blog",
    language: "en",
    title: "chsm.dev | blog posts",
    description:
      "A blog about whatever I'm doing. It's mostly about programming, microoptimization, and overcomplicated bizarre projects.",
    // image: "",
    // generator: "",
    favicon: baseUrl + "/favicon.ico",
    copyright,
    updated: latestDate,
    feedLinks: {
      rss: baseUrl + "/blog/rss.xml",
      json: baseUrl + "/blog/feed.json",
      atom: baseUrl + "/blog/atom.xml",
    },
    author,
  });

  const tasks = posts.map(async post => {
    type Frontmatter = { title?: string; description?: string };
    const { frontmatter } = extractFrontmatter<Frontmatter>(post.content);

    const title = frontmatter?.title ?? post.title;
    const description = frontmatter?.description ?? "";

    feed.addItem({
      id: getBlogPostSlug(post),
      guid: getBlogPostSlug(post),
      title,
      description,
      link: baseUrl + getBlogPostUrl(post),
      date: new Date(post.edited_at ?? post.created_at),
      published: new Date(post.created_at),
      category: post.tags.map(t => ({ term: t, name: t })),
      copyright,
      author: [author],
    });
  });

  await Promise.all(tasks);

  feed.items.sort((a, b) => +a.date - +b.date);

  return feed;
}
