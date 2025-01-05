import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@lib/database/server";

interface RouteProps {
  params: Promise<{ slug: string; filename: string }>;
}

export async function GET(_request: NextRequest, { params: paramsPromise }: RouteProps) {
  const params = await paramsPromise;

  const supabase = createServerSupabase("SERVICE_ROLE", { revalidate: 3600 });
  const { data } = await supabase.from("uploads").select("*").eq("slug", params.slug).maybeSingle();

  if (!data || data.filename !== params.filename) notFound();

  // TODO: think of better uploaded asset paths (/assets/uploads/fdghbvef/Image.png is a bit long)
  // TODO: maybe add a route in blog/[...slug]/, to allow use like ![](./Image.png) (then link/reference uploads to posts?)

  const { publicUrl } = supabase.storage.from("uploads").getPublicUrl(params.slug).data;

  const res = await fetch(publicUrl, { next: { revalidate: 3600 } });

  console.log(Object.fromEntries([...res.headers.entries()]));

  const blob = await res.blob();

  return new NextResponse(blob, {
    headers: {
      "Content-Type": res.headers.get("Content-Type")!,
    },
  });
}
