import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@lib/database/server";
import { getAllBlogPosts, getBlogPostUrl } from "@api/blog";
import { compileMdx } from "@lib/mdx";
import { extractFrontmatter } from "@lib/mdx/frontmatter";
import configurePlugins, { MdxPluginConfigs } from "@lib/mdx/configure-plugins";
import configureComponents from "@lib/mdx/configure-components";
import BlogLayout from "@components/Blog/BlogLayout";
import BlogSidebar from "@components/Blog/BlogSidebar";
import BlogArticle from "@components/Blog/BlogArticle";
import BlogPagination from "@components/Blog/BlogPagination";
import BlogToc from "@components/Blog/BlogToc";
import markdownFile from "./content.mdx";

export default async function BlogPostPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  // Configure and compile the markdown
  const mdxOptions: MdxPluginConfigs = { embedSize: [480, 270] };

  const { content, frontmatter } = await compileMdx<object>(markdownFile, {
    format: "mdx",
    ...configurePlugins(mdxOptions),
    components: configureComponents(),
  });

  // Get the latest blog posts to display in the sidebar (throw notFound on error)
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  let recent = (await getAllBlogPosts(supabase)) || notFound();

  const post = {
    ...recent[0],
    ...frontmatter,
    id: -1,
    content: markdownFile,
    created_at: new Date().toISOString(),
    edited_at: null,
  };
  recent = [post, ...recent];
  const curIndex = 0;

  return (
    <BlogLayout
      sidebar={<BlogSidebar posts={recent} />}
      article={
        <>
          <BlogArticle mdxContent={content} post={post} />
          <BlogPagination cur={post} prev={recent[curIndex + 1]} next={recent[curIndex - 1]} />
        </>
      }
      toc={<BlogToc toc={mdxOptions.toc!} />}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  if (process.env.NODE_ENV !== "development") notFound();

  // Get the latest blog posts to display in the sidebar (throw notFound on error)
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const recent = (await getAllBlogPosts(supabase)) || notFound();

  // Extract metadata from frontmatter
  type Frontmatter = { title?: string; description?: string };
  const { frontmatter } = extractFrontmatter<Frontmatter>(markdownFile);

  const post = Object.assign({}, recent[0], frontmatter);

  const title = frontmatter?.title ?? post.title;
  const description = frontmatter?.description;

  return {
    title,
    description,
    authors: post.authors.map(a => ({ name: a.user?.username, url: `/user/${a.user?.slug ?? a.user_id}` })),
    category: "Blog posts",

    openGraph: {
      type: "article",
      section: "Blog posts",
      title,
      description,
      url: getBlogPostUrl(post),
      authors: post.authors.map(a => a.user?.username).filter(a => a != null),
      publishedTime: post.created_at,
      modifiedTime: post.edited_at ?? undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: false,
    },
  };
}
