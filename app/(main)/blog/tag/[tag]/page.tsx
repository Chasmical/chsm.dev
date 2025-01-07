import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase, type Supabase } from "@lib/database/server";
import { getAllBlogPostsShallow, searchBlogPostsByTag } from "@api/blog";
import { getBlogPostSlug, truncateBlogPostContent } from "@api/blog/helper";
import { configureMdx } from "@lib/mdx";
import configurePlugins, { MdxPluginConfigs } from "@lib/mdx/configure-plugins";
import configureComponents from "@lib/mdx/configure-components";
import BlogLayout from "@components/Blog/BlogLayout";
import BlogSidebar from "@components/Blog/BlogSidebar";
import BlogArticle from "@components/Blog/BlogArticle";
import { PostTag } from "@components/Blog/BlogArticle/HeaderTags";
import { decodeUriParams } from "@lib/utils/decodeUri";
import joinList from "@lib/utils/joinList";
import plural from "@lib/utils/plural";

interface PageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page: string }>;
}

/** Shared function for processing parameters and searching for posts */
async function handleParamsShared(supabase: Supabase, props: PageProps) {
  // Parse params and search params
  const params = decodeUriParams(await props.params) || notFound();
  const searchParams = await props.searchParams;

  // Determine which indices to select, from ?page=123 query
  const pageIndex = Math.abs(parseInt(searchParams.page) - 1) || 0;

  // Find posts with specified tags (throw notFound on error or no matches)
  const tags = params.tag.split(/[,+]/);
  if (!tags.length) notFound();

  const posts = (await searchBlogPostsByTag(supabase, tags, pageIndex, 10)) || notFound();
  if (!posts.length) notFound();

  return { tags, posts };
}

export default async function BlogPostsByTagPage(props: PageProps) {
  // Select all blog posts (shallow) for the sidebar (throw notFound on error)
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const recentPosts = (await getAllBlogPostsShallow(supabase)) || notFound();
  // Handle the page's props and find matching props
  const { tags, posts: matchedPosts } = await handleParamsShared(supabase, props);

  // Configure and compile the markdown
  const mdxOptions: MdxPluginConfigs = { embedSize: [480, 270] };

  const mdx = configureMdx({
    format: "mdx",
    ...configurePlugins(mdxOptions),
    components: configureComponents(),
  });

  const truncatedMdxResults = await Promise.all(
    matchedPosts.map(post => mdx.compile(truncateBlogPostContent(post.content))),
  );

  return (
    <BlogLayout
      sidebar={<BlogSidebar posts={recentPosts} />}
      article={
        <>
          <h2 style={{ marginBottom: "2rem" }}>
            {joinList(tags, {
              prefix: () => `Found ${plural(matchedPosts.length, "post")} with `,
              map: (tag, i) => <PostTag key={i} tag={tag} />,
              join: ", ",
              suffix: " tag:",
            })}
          </h2>

          {matchedPosts.map((post, i) => {
            return <BlogArticle key={post.id} post={post} mdxContent={truncatedMdxResults[i].content} readMore />;
          })}
        </>
      }
      toc={null}
    />
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  // Handle the page's props and find matching props
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const { tags, posts: matchedPosts } = await handleParamsShared(supabase, props);

  const title = `Posts with ${joinList(tags, { prefix: "tag: ", join: ", " }).join("")}`;
  const description = [
    `Found ${matchedPosts.totalCount} posts:`,
    ...matchedPosts.map(p => `${getBlogPostSlug(p).split("/").slice(0, 3).join("-")}: ${p.title}`),
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

    robots: {
      index: tags.length === 1,
      follow: true,
    },
  };
}
