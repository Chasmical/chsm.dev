import { Fragment } from "react";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@lib/database/server";
import { getAllBlogPosts } from "@api/blog";
import { truncateBlogPostContent } from "@api/blog/helper";
import { configureMdx } from "@lib/mdx";
import configurePlugins, { MdxPluginConfigs } from "@lib/mdx/configure-plugins";
import configureComponents from "@lib/mdx/configure-components";
import BlogLayout from "@components/Blog/BlogLayout";
import BlogSidebar from "@components/Blog/BlogSidebar";
import BlogArticle from "@components/Blog/BlogArticle";

export default async function BlogLandingPage() {
  // Select all blog posts (throw notFound on error)
  const supabase = createServerSupabase("anonymous", { revalidate: 300 });
  const recent = (await getAllBlogPosts(supabase)) || notFound();

  // Configure and compile the markdown
  const mdxOptions: MdxPluginConfigs = { embedSize: [480, 270] };

  const mdx = configureMdx({
    format: "mdx",
    ...configurePlugins(mdxOptions),
    components: configureComponents(),
  });

  const truncatedMdxContents = await Promise.all(
    recent.map(post => mdx.compile(truncateBlogPostContent(post.content))),
  );

  return (
    <BlogLayout
      sidebar={<BlogSidebar posts={recent} />}
      article={
        <>
          {recent.map((post, i) => {
            return <BlogArticle key={post.id} post={post} mdxContent={truncatedMdxContents[i].content} readMore />;
          })}
        </>
      }
      toc={null}
    />
  );
}
