import { notFound } from "next/navigation";
import { createServerSupabase } from "@lib/database/server";
import { getAllBlogPostsShallow, searchBlogPostsByTag } from "@api/blog";
import { truncateBlogPostContent } from "@api/blog/helper";
import { configureMdx } from "@lib/mdx";
import configurePlugins, { MdxPluginConfigs } from "@lib/mdx/configure-plugins";
import configureComponents from "@lib/mdx/configure-components";
import BlogLayout from "@components/Blog/BlogLayout";
import BlogSidebar from "@components/Blog/BlogSidebar";
import BlogArticle from "@components/Blog/BlogArticle";
import Code from "@components/Common/Code";
import { decodeUriParams } from "@lib/utils/decodeUri";
import joinList from "@lib/utils/joinList";
import plural from "@lib/utils/plural";

interface PageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page: string }>;
}

export default async function BlogPostsByTagPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: PageProps) {
  // Parse params and search params
  const params = decodeUriParams(await paramsPromise) || notFound();
  const searchParams = await searchParamsPromise;

  // Select all blog posts (shallow) for the sidebar (throw notFound on error)
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const recentPosts = (await getAllBlogPostsShallow(supabase)) || notFound();

  // Determine which indices to select, from ?page=123 query
  const pageIndex = Math.abs(parseInt(searchParams.page) - 1) || 0;

  // Find posts with specified tags (throw notFound on error or no matches)
  const tags = params.tag.split(/[,+]/);
  const matchedPosts = (await searchBlogPostsByTag(supabase, tags, pageIndex, 10)) || notFound();
  if (!matchedPosts.length) notFound();

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
              map: (tag, i) => <Code key={i}>{tag.replaceAll("_", " ")}</Code>,
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
