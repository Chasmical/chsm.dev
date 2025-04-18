import "server-only";
import type { DbBlogPostShallow, DbBlogPostWithAuthors, Supabase } from "@lib/database/types";
export { getBlogPostSlug, getBlogPostUrl } from "./helper";

/** Selects a single blog post with the specified id. */
export async function getBlogPostById(sb: Supabase, id: number): Promise<DbBlogPostWithAuthors | null> {
  const builder = sb.from("blog_posts").select(`
    id, created_at, edited_at, title, content, is_public, tags, slug,
    authors:blog_post_authors(*, user:users(*))
  `);

  return (await builder.eq("id", id).limit(1).maybeSingle()).data;
}

/** Searches for blog posts within the specified date range, and, optionally, with the specified slug. */
export async function searchBlogPostsBySlug(
  sb: Supabase,
  range: Date | [start: Date, end: Date],
  slug?: string,
): Promise<DbBlogPostWithAuthors[] | null> {
  const builder = sb.from("blog_posts").select(`
    id, created_at, edited_at, title, content, is_public, tags, slug,
    authors:blog_post_authors(*, user:users(*))
  `);

  // If not an array, turn Date into a one-day range
  const [start, end] = Array.isArray(range) ? range : [range, new Date(+range + 24 * 3600 * 1000)];
  builder.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());

  if (slug) builder.eq("slug", slug).limit(1);

  return (await builder).data;
}

/** Searches for blog posts with the specified tags, within the specified page range, sorted from newest to oldest. */
export async function searchBlogPostsByTag(
  sb: Supabase,
  tags: string[],
  pageIndex = 0,
  pageSize = 10,
): Promise<(DbBlogPostWithAuthors[] & { totalCount: number }) | null> {
  const builder = sb.from("blog_posts").select(
    `
    id, created_at, edited_at, title, content, is_public, tags, slug,
    authors:blog_post_authors(*, user:users(*))
  `,
    { count: "exact" },
  );

  builder.contains("tags", tags).range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);

  const { data, count } = await builder.order("created_at", { ascending: false });

  return data ? Object.assign(data, { totalCount: count! }) : null;
}

/** Selects all blog posts, sorted from newest to oldest. */
export async function getAllBlogPosts(sb: Supabase): Promise<DbBlogPostWithAuthors[] | null> {
  const builder = sb.from("blog_posts").select(`
    id, created_at, edited_at, title, content, is_public, tags, slug,
    authors:blog_post_authors(*, user:users(*))
  `);

  return (await builder.order("created_at", { ascending: false })).data;
}
/** Shallowly selects all blog posts, sorted from newest to oldest. */
export async function getAllBlogPostsShallow(sb: Supabase): Promise<DbBlogPostShallow[] | null> {
  const builder = sb.from("blog_posts").select(`
    id, created_at, title, slug
  `);

  return (await builder.order("created_at", { ascending: false })).data;
}

type BlogPostParams = { yyyy: string; MM: string; dd: string; slug?: string };

/** Searches for a blog post matching the specified route parameters. */
export async function getBlogPostFromParams(supabase: Supabase, params: BlogPostParams) {
  const { yyyy, MM, dd, slug } = params;

  // Parse the date and ensure it's valid
  const date = new Date(`${yyyy}-${MM}-${dd}Z`);
  if (Number.isNaN(+date)) return null;

  // Select the matching post
  return (await searchBlogPostsBySlug(supabase, date, slug))?.[0] ?? null;
}
