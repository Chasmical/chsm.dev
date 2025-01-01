import { Fragment } from "react";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@lib/database/server";
import { getAllBlogPosts } from "@api/blog";
import { configureMdx } from "@lib/mdx";
import configurePlugins, { MdxPluginConfigs } from "@lib/mdx/configure-plugins";
import configureComponents from "@lib/mdx/configure-components";
import BlogLayout from "@components/Blog/BlogLayout";
import BlogSidebar from "@components/Blog/BlogSidebar";
import BlogArticle from "@components/Blog/BlogArticle";

const truncateRegex = /(?:\r?\n|\r){\/\*\s*truncate\s*\*\/}(?:\r?\n|\r)/;

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
    recent.map(post => {
      let src = post.content;
      src = src.slice(0, truncateRegex.exec(src)?.index);
      return mdx.compile(src);
    }),
  );

  return (
    <BlogLayout
      sidebar={<BlogSidebar posts={recent} />}
      article={
        <>
          {recent.map((post, i) => {
            return (
              <Fragment key={post.id}>
                <BlogArticle post={post} mdxContent={truncatedMdxContents[i].content} />
              </Fragment>
            );
          })}
        </>
      }
      toc={null}
    />
  );
}
